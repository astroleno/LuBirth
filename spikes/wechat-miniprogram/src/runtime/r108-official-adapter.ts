import { createScopedThreejs } from 'threejs-miniprogram';

import { probeCapabilities } from './capability-probe.ts';
import {
  computeDrawingBufferSize,
  type MiniProgramCanvas,
  type RuntimeAdapter,
  type RuntimeCreateOptions,
  type RuntimeSession,
} from './runtime-contract.ts';

const scopedThreeByCanvas = new WeakMap<object, any>();

export class R108OfficialAdapter implements RuntimeAdapter {
  readonly route = 'r108' as const;

  create(canvas: MiniProgramCanvas, options: RuntimeCreateOptions): RuntimeSession {
    let THREE = scopedThreeByCanvas.get(canvas as object);
    if (!THREE) {
      THREE = createScopedThreejs(canvas);
      scopedThreeByCanvas.set(canvas as object, THREE);
    }
    const gl = canvas.getContext('webgl', {
      alpha: options.alpha ?? false,
      antialias: options.antialias ?? true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('Official r108 adapter could not create WebGL context');
    const capability = probeCapabilities(gl);
    const drawingBuffer = computeDrawingBufferSize({
      cssWidth: options.cssWidth,
      cssHeight: options.cssHeight,
      requestedDpr: options.dpr,
      maxTextureSize: capability.maxTextureSize,
      maxRenderbufferSize: capability.maxRenderbufferSize,
      maxViewportDims: capability.maxViewportDims,
    });
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: options.alpha ?? false,
      antialias: options.antialias ?? true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(drawingBuffer.pixelRatio);
    renderer.setSize(options.cssWidth, options.cssHeight, false);
    renderer.setClearColor(0x000000, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    if (renderer.debug) renderer.debug.checkShaderErrors = true;

    let disposed = false;
    return {
      route: this.route,
      threeVersion: THREE.REVISION,
      THREE,
      renderer,
      canvas,
      gl,
      capability,
      drawingBuffer,
      requestFrame: canvas.requestAnimationFrame.bind(canvas),
      cancelFrame: canvas.cancelAnimationFrame.bind(canvas),
      createImage: canvas.createImage.bind(canvas),
      dispose: () => {
        if (disposed) return;
        disposed = true;
        renderer.setRenderTarget(null);
        renderer.dispose();
      },
    };
  }
}
