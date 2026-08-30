import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CanvasEventBridge,
  computeDrawingBufferSize,
  selectRuntimeRoute,
} from '../src/runtime/runtime-contract.ts';
import { probeCapabilities } from '../src/runtime/capability-probe.ts';
import {
  createCanvasFacade,
  disposeR160Renderer,
  selectR160GlContext,
} from '../src/runtime/r160-adapter.ts';

function fakeGl(overrides: Record<string, unknown> = {}) {
  const parameters = new Map<unknown, unknown>([
    [1, 'WebGL 1.0 Fake'],
    [2, 'WebGL GLSL ES 1.0 Fake'],
    [3, 4096],
    [4, 4096],
    [5, [4096, 2048]],
    [6, 16],
    [7, 8],
  ]);
  return {
    VERSION: 1,
    SHADING_LANGUAGE_VERSION: 2,
    MAX_TEXTURE_SIZE: 3,
    MAX_RENDERBUFFER_SIZE: 4,
    MAX_VIEWPORT_DIMS: 5,
    MAX_TEXTURE_IMAGE_UNITS: 6,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 7,
    FRAGMENT_SHADER: 8,
    HIGH_FLOAT: 9,
    getParameter: (key: unknown) => parameters.get(key),
    getShaderPrecisionFormat: () => ({ rangeMin: 127, rangeMax: 127, precision: 23 }),
    getSupportedExtensions: () => ['OES_standard_derivatives', 'WEBGL_depth_texture'],
    getExtension: (name: string) => name === 'OES_standard_derivatives' || name === 'WEBGL_depth_texture' ? {} : null,
    ...overrides,
  } as any;
}

test('capability probe preserves GL limits, precision and required extension status', () => {
  const report = probeCapabilities(fakeGl());

  assert.equal(report.status, 'pass');
  assert.equal(report.webglVersion, 'WebGL 1.0 Fake');
  assert.equal(report.highpFragment.precision, 23);
  assert.deepEqual(report.maxViewportDims, [4096, 2048]);
  assert.deepEqual(report.requiredExtensions, { derivatives: true });
  assert.deepEqual(report.informationalExtensions, { depthTexture: true });
});

test('missing fragment highp is unsupported rather than silently downgraded', () => {
  const report = probeCapabilities(fakeGl({
    getShaderPrecisionFormat: () => ({ rangeMin: 0, rangeMax: 0, precision: 0 }),
  }));

  assert.equal(report.status, 'unsupported');
  assert.deepEqual(report.issues, ['fragment-highp-unavailable']);
});

test('missing depth texture stays informational because the representative path does not require it', () => {
  const report = probeCapabilities(fakeGl({
    getSupportedExtensions: () => ['OES_standard_derivatives'],
    getExtension: (name: string) => name === 'OES_standard_derivatives' ? {} : null,
  }));

  assert.equal(report.status, 'pass');
  assert.equal(report.informationalExtensions.depthTexture, false);
  assert.deepEqual(report.issues, []);
});

test('drawing buffer sizing clamps DPR without changing aspect ratio', () => {
  assert.deepEqual(computeDrawingBufferSize({
    cssWidth: 1000,
    cssHeight: 500,
    requestedDpr: 3,
    maxTextureSize: 4096,
    maxRenderbufferSize: 4096,
    maxViewportDims: [2048, 2048],
  }), {
    width: 2048,
    height: 1024,
    pixelRatio: 2.048,
    clamped: true,
  });
});

test('canvas event bridge removes only the selected listener', () => {
  const bridge = new CanvasEventBridge();
  const calls: string[] = [];
  const first = () => calls.push('first');
  const second = () => calls.push('second');
  bridge.addEventListener('webglcontextlost', first);
  bridge.addEventListener('webglcontextlost', second);
  bridge.removeEventListener('webglcontextlost', first);

  bridge.dispatchEvent({ type: 'webglcontextlost', preventDefault() {} });

  assert.deepEqual(calls, ['second']);
});

test('runtime route selection keeps r160 primary and labels r108 fallback', () => {
  assert.deepEqual(selectRuntimeRoute({
    r160: { status: 'pass', adapterPatchLines: 86, touchesThreeInternals: false },
    r108: { status: 'pass', adapterPatchLines: 0, touchesThreeInternals: false },
  }), { route: 'r160', decision: 'recommended', reason: 'r160-stable-narrow-adapter' });

  assert.deepEqual(selectRuntimeRoute({
    r160: { status: 'fail', adapterPatchLines: 220, touchesThreeInternals: true },
    r108: { status: 'pass', adapterPatchLines: 0, touchesThreeInternals: false },
  }), { route: 'r108', decision: 'fallback', reason: 'r160-failed-r108-passed' });

  assert.deepEqual(selectRuntimeRoute({
    r160: { status: 'fail', adapterPatchLines: 220, touchesThreeInternals: true },
    r108: { status: 'fail', adapterPatchLines: 0, touchesThreeInternals: false },
  }), { route: null, decision: 'no-go', reason: 'no-maintainable-runtime' });
});

test('r160 canvas facade supplies only local DOM-shaped surface and syncs dimensions', () => {
  const nativeListeners: string[] = [];
  const rawCanvas: any = {
    width: 320,
    height: 180,
    getContext: () => ({ kind: 'gl' }),
    requestAnimationFrame: () => 7,
    cancelAnimationFrame: () => undefined,
    createImage: () => ({ kind: 'image' }),
    addEventListener: (type: string) => nativeListeners.push(`add:${type}`),
    removeEventListener: (type: string) => nativeListeners.push(`remove:${type}`),
  };
  const facade: any = createCanvasFacade(rawCanvas);
  let contextLost = 0;
  facade.addEventListener('webglcontextlost', () => { contextLost += 1; });

  facade.width = 640;
  facade.height = 360;
  facade.dispatchEvent({ type: 'webglcontextlost' });

  assert.equal(rawCanvas.width, 640);
  assert.equal(rawCanvas.height, 360);
  assert.equal(facade.clientWidth, 320);
  assert.equal(facade.clientHeight, 180);
  assert.deepEqual(facade.style, { width: '320px', height: '180px' });
  assert.equal(contextLost, 1);
  facade.removeEventListener('webglcontextlost', () => undefined);
  assert.deepEqual(nativeListeners, ['add:webglcontextlost', 'remove:webglcontextlost']);
  assert.equal((globalThis as any).document, undefined);
});

test('r160 session disposal tolerates the Three animation-context cleanup defect', () => {
  const calls: string[] = [];
  const renderer = {
    setRenderTarget: (target: unknown) => calls.push(`target:${String(target)}`),
    dispose: () => {
      calls.push('dispose');
      throw new TypeError("Cannot read property 'cancelAnimationFrame' of null");
    },
  };

  assert.doesNotThrow(() => disposeR160Renderer(renderer));
  assert.deepEqual(calls, ['target:null', 'dispose']);
});

test('r160 session disposal recognizes a cross-realm Three cleanup error by its message', () => {
  const renderer = {
    setRenderTarget: () => undefined,
    dispose: () => {
      throw {
        name: 'TypeError',
        message: "Cannot read property 'cancelAnimationFrame' of null",
      };
    },
  };

  assert.doesNotThrow(() => disposeR160Renderer(renderer));
});

test('r160 selects WebGL1 first so the same mini-program canvas can switch to official r108', () => {
  const calls: string[] = [];
  const webgl1 = { version: 1 };
  const canvas = {
    getContext(type: string) {
      calls.push(type);
      return type === 'webgl' ? webgl1 : { version: 2 };
    },
  } as any;

  assert.equal(selectR160GlContext(canvas, {}), webgl1);
  assert.deepEqual(calls, ['webgl']);
});

test('r160 production renderer leaves highlight headroom for the Earth and atmosphere stack', () => {
  const source = readFileSync(new URL('../src/runtime/r160-adapter.ts', import.meta.url), 'utf8');
  assert.match(source, /renderer\.toneMappingExposure = 0\.9;/);
});
