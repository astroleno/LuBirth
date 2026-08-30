import type { ResultStatus } from '../metrics/result-schema.ts';
import type { LubirthCapabilityScene } from '../scene/lubirth-capability-scene.ts';

export type SceneCapabilityResult = {
  status: ResultStatus;
  invariants: ReturnType<LubirthCapabilityScene['auditInvariants']>;
  glError: number;
  shaderPrograms: number | null;
  shaderLogs: string[];
};

type VisualFocus = 'day' | 'terminator' | 'night';

type EffectMatrixEntry = {
  visualFocus: VisualFocus;
  status: ResultStatus;
  invariants: Partial<ReturnType<LubirthCapabilityScene['auditInvariants']>>;
};

const REQUIRED_VISUALS: readonly VisualFocus[] = ['day', 'terminator', 'night'];
const REQUIRED_EFFECT_INVARIANTS = [
  'productionEarthEffects',
  'productionAtmosphereEffects',
  'productionCloudEffects',
  'pipLayoutFixed',
] as const;

export function evaluateProductionEffectMatrix(entries: readonly EffectMatrixEntry[]): {
  status: ResultStatus;
  missingVisuals: VisualFocus[];
  failedVisuals: VisualFocus[];
} {
  const missingVisuals = REQUIRED_VISUALS.filter(
    (visualFocus) => !entries.some((entry) => entry.visualFocus === visualFocus),
  );
  const failedVisuals = entries
    .filter((entry) => entry.status === 'fail' || REQUIRED_EFFECT_INVARIANTS.some(
      (key) => entry.invariants[key] !== true,
    ))
    .map((entry) => entry.visualFocus);
  const status: ResultStatus = failedVisuals.length > 0
    ? 'fail'
    : missingVisuals.length > 0 || entries.some((entry) => entry.status === 'inconclusive')
      ? 'inconclusive'
      : entries.some((entry) => entry.status === 'unsupported')
        ? 'unsupported'
        : 'pass';
  return { status, missingVisuals, failedVisuals };
}

export function runSceneCapabilityTest(
  scene: LubirthCapabilityScene,
  renderer: any,
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  timestamp = 0,
): SceneCapabilityResult {
  const shaderLogs: string[] = [];
  const debug = renderer.debug;
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
  scene.render(timestamp);
  const invariants = scene.auditInvariants();
  const glError = typeof gl.getError === 'function' ? gl.getError() : -1;
  const noGlError = glError === (gl as any).NO_ERROR;
  const invariantPassed = Object.values(invariants).every(Boolean);
  const shaderPassed = shaderLogs.every((entry) => entry.trim().length === 0);
  return {
    status: invariantPassed && noGlError && shaderPassed ? 'pass' : 'fail',
    invariants,
    glError,
    shaderPrograms: Array.isArray(renderer.info?.programs) ? renderer.info.programs.length : null,
    shaderLogs: shaderLogs.filter(Boolean),
  };
}
