import type { ResultStatus } from '../metrics/result-schema.ts';

export type CapabilityReport = {
  status: ResultStatus;
  webglVersion: string;
  glslVersion: string;
  highpFragment: { rangeMin: number; rangeMax: number; precision: number };
  maxTextureSize: number;
  maxRenderbufferSize: number;
  maxViewportDims: [number, number];
  maxTextureImageUnits: number;
  maxVertexTextureImageUnits: number;
  extensions: string[];
  requiredExtensions: {
    derivatives: boolean;
  };
  informationalExtensions: {
    depthTexture: boolean;
  };
  contextLossExtension: boolean;
  issues: string[];
};

function numberParameter(gl: WebGLRenderingContext | WebGL2RenderingContext, parameter: number): number {
  const value = gl.getParameter(parameter);
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function probeCapabilities(gl: WebGLRenderingContext | WebGL2RenderingContext): CapabilityReport {
  const webglVersion = String(gl.getParameter(gl.VERSION) ?? 'unknown');
  const isWebGl2 = /WebGL\s*2/i.test(webglVersion);
  const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const highpFragment = {
    rangeMin: highp?.rangeMin ?? 0,
    rangeMax: highp?.rangeMax ?? 0,
    precision: highp?.precision ?? 0,
  };
  const extensions = [...(gl.getSupportedExtensions() ?? [])].sort();
  const derivatives = isWebGl2 || Boolean(gl.getExtension('OES_standard_derivatives'));
  const depthTexture = isWebGl2 || Boolean(
    gl.getExtension('WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture'),
  );
  const issues: string[] = [];
  if (highpFragment.precision <= 0) issues.push('fragment-highp-unavailable');
  if (!derivatives) issues.push('standard-derivatives-unavailable');
  const viewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as ArrayLike<number> | null;

  return {
    status: issues.length === 0 ? 'pass' : 'unsupported',
    webglVersion,
    glslVersion: String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION) ?? 'unknown'),
    highpFragment,
    maxTextureSize: numberParameter(gl, gl.MAX_TEXTURE_SIZE),
    maxRenderbufferSize: numberParameter(gl, gl.MAX_RENDERBUFFER_SIZE),
    maxViewportDims: [Number(viewport?.[0] ?? 0), Number(viewport?.[1] ?? 0)],
    maxTextureImageUnits: numberParameter(gl, gl.MAX_TEXTURE_IMAGE_UNITS),
    maxVertexTextureImageUnits: numberParameter(gl, gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    extensions,
    requiredExtensions: { derivatives },
    informationalExtensions: { depthTexture },
    contextLossExtension: Boolean(gl.getExtension('WEBGL_lose_context')),
    issues,
  };
}
