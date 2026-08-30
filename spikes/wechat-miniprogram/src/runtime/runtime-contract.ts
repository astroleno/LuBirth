import type { CapabilityReport } from './capability-probe.ts';

export type RuntimeRoute = 'r160' | 'r108';

export type MiniProgramCanvas = {
  width: number;
  height: number;
  clientWidth?: number;
  clientHeight?: number;
  getContext(type: 'webgl' | 'webgl2', attributes?: Record<string, unknown>): WebGLRenderingContext | WebGL2RenderingContext | null;
  requestAnimationFrame(callback: (timestamp: number) => void): number;
  cancelAnimationFrame(id: number): void;
  createImage(): unknown;
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
};

export type RendererLike = {
  setSize(width: number, height: number, updateStyle?: boolean): void;
  setPixelRatio?(ratio: number): void;
  setRenderTarget(target: unknown): void;
  render(scene: unknown, camera: unknown): void;
  getContext(): WebGLRenderingContext | WebGL2RenderingContext;
  dispose(): void;
  forceContextLoss?(): void;
  info?: { reset?: () => void; render?: Record<string, number>; memory?: Record<string, number> };
};

export type RuntimeSession = {
  route: RuntimeRoute;
  threeVersion: string;
  THREE: any;
  renderer: RendererLike;
  canvas: MiniProgramCanvas;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  capability: CapabilityReport;
  drawingBuffer: DrawingBufferSize;
  requestFrame(callback: (timestamp: number) => void): number;
  cancelFrame(id: number): void;
  createImage(): unknown;
  dispose(): void;
};

export type RuntimeAdapter = {
  readonly route: RuntimeRoute;
  create(canvas: MiniProgramCanvas, options: RuntimeCreateOptions): RuntimeSession;
};

export type RuntimeCreateOptions = {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
  antialias?: boolean;
  alpha?: boolean;
};

export type DrawingBufferSize = {
  width: number;
  height: number;
  pixelRatio: number;
  clamped: boolean;
};

export type DrawingBufferInput = {
  cssWidth: number;
  cssHeight: number;
  requestedDpr: number;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  maxViewportDims: readonly [number, number];
};

export function computeDrawingBufferSize(input: DrawingBufferInput): DrawingBufferSize {
  for (const [name, value] of Object.entries(input)) {
    if (name !== 'maxViewportDims' && (!Number.isFinite(value) || (value as number) <= 0)) {
      throw new Error(`${name} must be a positive finite number`);
    }
  }
  const maxWidth = Math.min(input.maxTextureSize, input.maxRenderbufferSize, input.maxViewportDims[0]);
  const maxHeight = Math.min(input.maxTextureSize, input.maxRenderbufferSize, input.maxViewportDims[1]);
  const pixelRatio = Math.min(
    input.requestedDpr,
    maxWidth / input.cssWidth,
    maxHeight / input.cssHeight,
  );
  return {
    width: Math.max(1, Math.floor(input.cssWidth * pixelRatio)),
    height: Math.max(1, Math.floor(input.cssHeight * pixelRatio)),
    pixelRatio,
    clamped: pixelRatio < input.requestedDpr,
  };
}

type CanvasEvent = { type: string; target?: unknown; currentTarget?: unknown } & Record<string, unknown>;
type CanvasListener = (event: CanvasEvent) => void;

export class CanvasEventBridge {
  private readonly listeners = new Map<string, Set<CanvasListener>>();

  addEventListener(type: string, listener: CanvasListener): void {
    const registered = this.listeners.get(type) ?? new Set<CanvasListener>();
    registered.add(listener);
    this.listeners.set(type, registered);
  }

  removeEventListener(type: string, listener: CanvasListener): void {
    const registered = this.listeners.get(type);
    if (!registered) return;
    registered.delete(listener);
    if (registered.size === 0) this.listeners.delete(type);
  }

  dispatchEvent(event: CanvasEvent): void {
    const registered = this.listeners.get(event.type);
    if (!registered) return;
    for (const listener of [...registered]) listener(event);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export type RuntimeRouteEvidence = {
  status: 'pass' | 'fail' | 'unsupported' | 'inconclusive';
  adapterPatchLines: number;
  touchesThreeInternals: boolean;
};

export function selectRuntimeRoute(input: {
  r160: RuntimeRouteEvidence;
  r108: RuntimeRouteEvidence;
}): {
  route: RuntimeRoute | null;
  decision: 'recommended' | 'fallback' | 'no-go' | 'inconclusive';
  reason: string;
} {
  const r160IsNarrow = input.r160.status === 'pass' && !input.r160.touchesThreeInternals;
  if (r160IsNarrow) {
    return { route: 'r160', decision: 'recommended', reason: 'r160-stable-narrow-adapter' };
  }
  if (input.r108.status === 'pass') {
    return { route: 'r108', decision: 'fallback', reason: 'r160-failed-r108-passed' };
  }
  if (input.r160.status === 'inconclusive' || input.r108.status === 'inconclusive') {
    return { route: null, decision: 'inconclusive', reason: 'runtime-evidence-incomplete' };
  }
  return { route: null, decision: 'no-go', reason: 'no-maintainable-runtime' };
}
