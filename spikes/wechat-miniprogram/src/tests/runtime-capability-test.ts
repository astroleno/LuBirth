import type { ResultStatus } from '../metrics/result-schema.ts';
import type { RuntimeSession } from '../runtime/runtime-contract.ts';

export type RuntimeCapabilityResult = {
  status: ResultStatus;
  route: RuntimeSession['route'];
  threeVersion: string;
  capability: RuntimeSession['capability'];
  drawingBuffer: RuntimeSession['drawingBuffer'];
  cases: {
    texturedSphere: boolean;
    derivativeShader: boolean;
    transparentBlend: boolean;
    renderTarget: boolean;
  };
  shaderLogs: string[];
  glError: number;
  rendererInfo: unknown;
};

export function resolveRuntimeCapabilityStatus(input: {
  capabilityStatus: ResultStatus;
  renderTargetPassed: boolean;
  noGlError: boolean;
  shaderPassed: boolean;
}): ResultStatus {
  if (!input.renderTargetPassed || !input.noGlError || !input.shaderPassed) return 'fail';
  return input.capabilityStatus === 'pass' ? 'pass' : input.capabilityStatus;
}

export function runRuntimeCapabilityTest(session: RuntimeSession): RuntimeCapabilityResult {
  const { THREE, renderer, gl } = session;
  const shaderLogs: string[] = [];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
  camera.position.set(0, 0, 3);

  const pixels = new Uint8Array([
    30, 90, 180, 255, 210, 230, 255, 255,
    10, 20, 60, 255, 100, 180, 230, 180,
  ]);
  const texture = new THREE.DataTexture(pixels, 2, 2, THREE.RGBAFormat);
  texture.needsUpdate = true;
  const geometry = new THREE.SphereGeometry(0.8, 32, 16);
  const material = new THREE.ShaderMaterial({
    uniforms: { map: { value: texture } },
    extensions: { derivatives: true },
    transparent: true,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vUv;
      void main() {
        float derivativeSignal = abs(dFdx(vUv.x)) + abs(dFdy(vUv.y));
        vec4 texel = texture2D(map, vUv);
        gl_FragColor = vec4(texel.rgb + derivativeSignal * 0.02, texel.a * 0.85);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const renderTarget = new THREE.WebGLRenderTarget(64, 64, { depthBuffer: true });

  const debug = (renderer as any).debug;
  if (debug && 'onShaderError' in debug) {
    debug.onShaderError = (
      context: WebGLRenderingContext,
      program: WebGLProgram,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader,
    ) => {
      shaderLogs.push(
        context.getProgramInfoLog(program) ?? '',
        context.getShaderInfoLog(vertexShader) ?? '',
        context.getShaderInfoLog(fragmentShader) ?? '',
      );
    };
  }

  let renderTargetPassed = false;
  try {
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
    renderTargetPassed = true;
  } finally {
    renderer.setRenderTarget(null);
  }
  const glError = typeof gl.getError === 'function' ? gl.getError() : -1;
  const noGlError = glError === (gl as any).NO_ERROR;
  const shaderPassed = shaderLogs.every((entry) => entry.trim().length === 0);

  const result: RuntimeCapabilityResult = {
    status: resolveRuntimeCapabilityStatus({
      capabilityStatus: session.capability.status,
      renderTargetPassed,
      noGlError,
      shaderPassed,
    }),
    route: session.route,
    threeVersion: session.threeVersion,
    capability: session.capability,
    drawingBuffer: session.drawingBuffer,
    cases: {
      texturedSphere: noGlError,
      derivativeShader: shaderPassed && session.capability.requiredExtensions.derivatives,
      transparentBlend: noGlError,
      renderTarget: renderTargetPassed,
    },
    shaderLogs: shaderLogs.filter(Boolean),
    glError,
    rendererInfo: renderer.info ? {
      render: { ...renderer.info.render },
      memory: { ...renderer.info.memory },
    } : null,
  };

  renderTarget.dispose();
  material.dispose();
  geometry.dispose();
  texture.dispose();
  return result;
}
