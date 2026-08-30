export type PerformanceSummary = {
  sampleCount: number;
  medianFrameMs: number | null;
  p95FrameMs: number | null;
  medianFps: number | null;
  droppedFrameCount: number;
};

function percentile(sorted: number[], quantile: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.ceil(quantile * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export class PerformanceProbe {
  private previousTimestamp: number | null = null;
  private readonly frameIntervals: number[] = [];
  private readonly maxSamples: number;

  constructor(maxSamples = Number.POSITIVE_INFINITY) {
    this.maxSamples = maxSamples;
  }

  recordFrame(timestampMs: number): void {
    if (this.previousTimestamp !== null) {
      const interval = timestampMs - this.previousTimestamp;
      if (Number.isFinite(interval) && interval >= 0) {
        this.frameIntervals.push(interval);
        if (this.frameIntervals.length > this.maxSamples) this.frameIntervals.shift();
      }
    }
    this.previousTimestamp = timestampMs;
  }

  reset(): void {
    this.previousTimestamp = null;
    this.frameIntervals.length = 0;
  }

  summary(): PerformanceSummary {
    const sorted = [...this.frameIntervals].sort((a, b) => a - b);
    const medianFrameMs = percentile(sorted, 0.5);
    const p95FrameMs = percentile(sorted, 0.95);
    return {
      sampleCount: sorted.length,
      medianFrameMs,
      p95FrameMs,
      medianFps: medianFrameMs === null || medianFrameMs === 0 ? null : 1000 / medianFrameMs,
      droppedFrameCount: sorted.filter((interval) => interval > 1000 / 30).length,
    };
  }
}
