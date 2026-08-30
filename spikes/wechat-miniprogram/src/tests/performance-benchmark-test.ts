import type { PerformanceSummary } from '../metrics/performance-probe.ts';
import type { ResultStatus } from '../metrics/result-schema.ts';

export function evaluateBenchmarkStatus(input: {
  baselineStatus: ResultStatus;
  pip256Status: ResultStatus;
  pip512Status: ResultStatus;
  interrupted: boolean;
  noGlError: boolean;
}): ResultStatus {
  const stages = [input.baselineStatus, input.pip256Status, input.pip512Status];
  if (!input.noGlError || stages.includes('fail')) return 'fail';
  if (input.interrupted || stages.some((status) => status !== 'pass')) return 'inconclusive';
  return 'pass';
}

function nearestRank(sorted: number[], quantile: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.max(0, Math.ceil(sorted.length * quantile) - 1);
  return sorted[Math.min(index, sorted.length - 1)];
}

export function summarizeFrameIntervals(intervals: number[]): PerformanceSummary {
  const sorted = intervals.filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
  const medianFrameMs = nearestRank(sorted, 0.5);
  const p95FrameMs = nearestRank(sorted, 0.95);
  return {
    sampleCount: sorted.length,
    medianFrameMs,
    p95FrameMs,
    medianFps: medianFrameMs === null || medianFrameMs === 0 ? null : 1000 / medianFrameMs,
    droppedFrameCount: sorted.filter((interval) => interval > 1000 / 30).length,
  };
}

export function evaluateBaselinePerformance(summary: PerformanceSummary): {
  status: ResultStatus;
  medianFpsThreshold: 30;
  p95FrameMsThreshold: 50;
  summary: PerformanceSummary;
} {
  const missing = summary.sampleCount === 0 || summary.medianFps === null || summary.p95FrameMs === null;
  const passed = !missing && summary.medianFps! >= 30 && summary.p95FrameMs! <= 50;
  return {
    status: missing ? 'inconclusive' : passed ? 'pass' : 'fail',
    medianFpsThreshold: 30,
    p95FrameMsThreshold: 50,
    summary,
  };
}

export type PairedPipRound = {
  round: number;
  order: 'off-on' | 'on-off';
  off: PerformanceSummary;
  on: PerformanceSummary;
};

export type PairedPipReport = {
  resolution: 256 | 512;
  status: ResultStatus;
  requiredRounds: 3;
  medianDeltaThresholdMs: 2;
  medianDeltaMs: number | null;
  roundMedianDeltasMs: Array<number | null>;
  p95Pairs: Array<{ offMs: number | null; onMs: number | null }>;
  rounds: PairedPipRound[];
};

export function evaluatePairedPipRounds(
  resolution: 256 | 512,
  rounds: PairedPipRound[],
): PairedPipReport {
  const roundMedianDeltasMs = rounds.map((round) => (
    round.off.medianFrameMs === null || round.on.medianFrameMs === null
      ? null
      : round.on.medianFrameMs - round.off.medianFrameMs
  ));
  const numericDeltas = roundMedianDeltasMs.filter((value): value is number => value !== null);
  const complete = rounds.length >= 3 && numericDeltas.length === rounds.length;
  const medianDeltaMs = complete ? nearestRank([...numericDeltas].sort((a, b) => a - b), 0.5) : null;
  return {
    resolution,
    status: !complete || medianDeltaMs === null ? 'inconclusive' : medianDeltaMs <= 2 ? 'pass' : 'fail',
    requiredRounds: 3,
    medianDeltaThresholdMs: 2,
    medianDeltaMs,
    roundMedianDeltasMs,
    p95Pairs: rounds.map((round) => ({ offMs: round.off.p95FrameMs, onMs: round.on.p95FrameMs })),
    rounds,
  };
}

export async function runPairedPipBenchmark(options: {
  resolution: 256 | 512;
  rounds: number;
  setPipEnabled(enabled: boolean): void;
  capture(): Promise<PerformanceSummary>;
}): Promise<PairedPipReport> {
  const rounds: PairedPipRound[] = [];
  for (let index = 0; index < options.rounds; index += 1) {
    const order: PairedPipRound['order'] = index % 2 === 0 ? 'off-on' : 'on-off';
    const states = order === 'off-on' ? [false, true] : [true, false];
    let off: PerformanceSummary | null = null;
    let on: PerformanceSummary | null = null;
    for (const enabled of states) {
      options.setPipEnabled(enabled);
      const summary = await options.capture();
      if (enabled) on = summary;
      else off = summary;
    }
    if (!off || !on) throw new Error('paired PIP benchmark did not capture both states');
    rounds.push({ round: index + 1, order, off, on });
  }
  return evaluatePairedPipRounds(options.resolution, rounds);
}

export type StableFrameObservation = {
  timestampMs: number;
  coreTexturesReady: boolean;
  shaderErrorCount: number;
  resourceGeneration: number;
};

export function firstStableFrame(observations: StableFrameObservation[]): StableFrameObservation | null {
  const requiredFrameCount = 11;
  for (let start = 0; start <= observations.length - requiredFrameCount; start += 1) {
    const candidate = observations[start];
    if (!candidate.coreTexturesReady || candidate.shaderErrorCount > 0) continue;
    const window = observations.slice(start, start + requiredFrameCount);
    if (window.every((frame) => (
      frame.coreTexturesReady
      && frame.shaderErrorCount === 0
      && frame.resourceGeneration === candidate.resourceGeneration
    ))) return candidate;
  }
  return null;
}

export class FrameWindowAbort {
  aborted = false;
  private readonly listeners = new Set<() => void>();

  abort(): void {
    if (this.aborted) return;
    this.aborted = true;
    for (const listener of [...this.listeners]) listener();
    this.listeners.clear();
  }

  subscribe(listener: () => void): () => void {
    if (this.aborted) {
      listener();
      return () => undefined;
    }
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export async function captureFrameWindow(options: {
  requestFrame(callback: (timestamp: number) => void): number;
  cancelFrame(id: number): void;
  warmupMs: number;
  durationMs: number;
  abort?: FrameWindowAbort;
}): Promise<PerformanceSummary> {
  if (options.warmupMs < 0 || options.durationMs <= 0) throw new Error('invalid benchmark window');
  return new Promise((resolve) => {
    let startTimestamp: number | null = null;
    let previousCapturedTimestamp: number | null = null;
    const intervals: number[] = [];
    let frameId: number | null = null;
    let completed = false;
    let unsubscribe: () => void = () => undefined;
    const complete = (summary: PerformanceSummary) => {
      if (completed) return;
      completed = true;
      if (frameId !== null) options.cancelFrame(frameId);
      frameId = null;
      unsubscribe();
      resolve(summary);
    };
    const frame = (timestamp: number) => {
      frameId = null;
      if (options.abort?.aborted) {
        complete(summarizeFrameIntervals([]));
        return;
      }
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      if (elapsed >= options.warmupMs) {
        if (previousCapturedTimestamp !== null) intervals.push(timestamp - previousCapturedTimestamp);
        previousCapturedTimestamp = timestamp;
      }
      if (elapsed >= options.warmupMs + options.durationMs) {
        complete(summarizeFrameIntervals(intervals));
        return;
      }
      frameId = options.requestFrame(frame);
    };
    unsubscribe = options.abort?.subscribe(() => complete(summarizeFrameIntervals([]))) ?? unsubscribe;
    if (completed) return;
    frameId = options.requestFrame(frame);
  });
}

type DeviceDecisionInput = {
  id: string;
  platform: 'ios' | 'android';
  core2k: ResultStatus;
  high8k: ResultStatus;
};

export function decideNativeMigration(input: {
  realAppId: boolean;
  resourceDomain: boolean;
  requiredDeviceCount: number;
  maintainableRuntime: boolean;
  devices: DeviceDecisionInput[];
}): {
  decision: 'GO-FULL' | 'GO-ADAPTIVE' | 'NO-GO-NATIVE' | 'INCONCLUSIVE';
  reasons: string[];
} {
  const reasons: string[] = [];
  if (!input.realAppId) reasons.push('real AppID missing');
  if (!input.resourceDomain) reasons.push('approved resource domain missing');
  if (input.devices.length < input.requiredDeviceCount) reasons.push('required device count incomplete');
  if (!input.devices.some((device) => device.platform === 'ios')) reasons.push('iOS evidence missing');
  if (!input.devices.some((device) => device.platform === 'android')) reasons.push('Android evidence missing');
  if (reasons.length > 0) return { decision: 'INCONCLUSIVE', reasons };

  if (!input.maintainableRuntime) return { decision: 'NO-GO-NATIVE', reasons: ['runtime requires an unbounded Three.js fork'] };
  if (input.devices.some((device) => device.core2k === 'fail' || device.core2k === 'unsupported')) {
    return { decision: 'NO-GO-NATIVE', reasons: ['2K core slice failed on a target device'] };
  }
  if (input.devices.some((device) => device.core2k !== 'pass')) {
    return { decision: 'INCONCLUSIVE', reasons: ['2K core evidence incomplete'] };
  }
  if (input.devices.every((device) => device.high8k === 'pass')) {
    return { decision: 'GO-FULL', reasons: ['2K and 8K gates passed across the required matrix'] };
  }
  if (input.devices.some((device) => device.high8k === 'inconclusive')) {
    return { decision: 'INCONCLUSIVE', reasons: ['8K evidence incomplete'] };
  }
  return { decision: 'GO-ADAPTIVE', reasons: ['2K passed, but 8K is not supported across the full matrix'] };
}
