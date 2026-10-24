/** A deadline clock: late callbacks skip missed slots instead of shifting every deadline. */
export class FrameCadence {
  private next: number | null = null;
  constructor(readonly interval = 1000 / 30) {}
  reset() { this.next = null; }
  take(now: number) {
    if (this.next === null) { this.next = now + this.interval; return true; }
    // Browser frame timestamps can be quantized/jittered by ~1 ms. A .1 ms
    // threshold intermittently misses every second vsync (16/50 ms pacing).
    // A small early window preserves the absolute deadlines without drift.
    if (now + Math.min(2, this.interval / 8) < this.next) return false;
    this.next += (Math.floor(Math.max(0, now - this.next) / this.interval) + 1) * this.interval;
    return true;
  }
}

export function percentile(values: number[], fraction: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

export type SkyMetrics = {
  state: 'idle' | 'drawing' | 'measuring' | 'hidden';
  fps: number | null; callbackFps: number | null; callbackP95: number | null;
  frameP95: number | null; cpuMs: number; cpuP95: number | null; gpuP95: number | null;
  gpuSupported: boolean; calls: number; points: number; segments: number; triangles: number; width: number; height: number;
  renders: number; longTasks: number; longTasksSupported: boolean; focused: boolean;
};
const initial: SkyMetrics = { state: 'idle', fps: null, callbackFps: null, callbackP95: null,
  frameP95: null, cpuMs: 0, cpuP95: null, gpuP95: null, gpuSupported: false,
  calls: 0, points: 0, segments: 0, triangles: 0, width: 0, height: 0, renders: 0, longTasks: 0, longTasksSupported: false, focused: true };

/** Only the diagnostics subscribe; publishing a sample must not invalidate the scene. */
class MetricsStore {
  private value = initial;
  private listeners = new Set<() => void>();
  getSnapshot = () => this.value;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  publish(value: SkyMetrics) { this.value = value; for (const listener of this.listeners) listener(); }
}
export const skyMetrics = new MetricsStore();

/** Asynchronous elapsed GPU queries. Never use finish()/readPixels() to time a frame. */
export class GpuTimer {
  private extension: any;
  private pending: WebGLQuery[] = [];
  private current: WebGLQuery | null = null;
  readonly supported: boolean;
  constructor(private context: WebGL2RenderingContext | WebGLRenderingContext) {
    this.extension = 'createQuery' in context ? context.getExtension('EXT_disjoint_timer_query_webgl2') : null;
    this.supported = !!this.extension;
  }
  begin() {
    if (!this.supported || this.pending.length >= 4) return;
    const context = this.context as WebGL2RenderingContext;
    this.current = context.createQuery();
    if (this.current) context.beginQuery(this.extension.TIME_ELAPSED_EXT, this.current);
  }
  end() {
    if (!this.current) return;
    (this.context as WebGL2RenderingContext).endQuery(this.extension.TIME_ELAPSED_EXT);
    this.pending.push(this.current); this.current = null;
  }
  poll() {
    if (!this.supported) return [];
    const context = this.context as WebGL2RenderingContext, samples: number[] = [];
    const disjoint = context.getParameter(this.extension.GPU_DISJOINT_EXT);
    this.pending = this.pending.filter(query => {
      if (!disjoint && !context.getQueryParameter(query, context.QUERY_RESULT_AVAILABLE)) return true;
      if (!disjoint) samples.push(context.getQueryParameter(query, context.QUERY_RESULT) / 1e6);
      context.deleteQuery(query); return false;
    });
    return samples;
  }
  dispose() { for (const query of this.pending) (this.context as WebGL2RenderingContext).deleteQuery(query); this.pending = []; }
}
