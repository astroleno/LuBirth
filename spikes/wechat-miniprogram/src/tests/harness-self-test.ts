import {
  aggregateStatus,
  type LifecycleEvidence,
  type ResultStatus,
  type RunResult,
  type TestEvidence,
} from '../metrics/result-schema.ts';

type TestOutcome = {
  status: ResultStatus;
  metrics?: TestEvidence['metrics'];
  notes?: string[];
};

type TrackedHandle = {
  id: number;
  cancel: (id: number) => void;
};

export class RunHarness {
  private run: RunResult;
  private readonly rafs = new Map<number, TrackedHandle>();
  private readonly timers = new Map<number, TrackedHandle>();
  private unloaded = false;
  private readonly now: () => number;

  constructor(initialRun: RunResult, now: () => number = () => Date.now()) {
    this.run = cloneSerializable(initialRun);
    this.now = now;
  }

  async runTest(
    name: string,
    stage: string,
    execute: () => TestOutcome | Promise<TestOutcome>,
  ): Promise<TestEvidence> {
    const startedMs = this.now();
    const startedAt = new Date(startedMs).toISOString();
    let evidence: TestEvidence;
    try {
      const outcome = await execute();
      const endedMs = this.now();
      evidence = {
        name,
        stage,
        status: outcome.status,
        startedAt,
        endedAt: new Date(endedMs).toISOString(),
        durationMs: Math.max(0, endedMs - startedMs),
        metrics: outcome.metrics,
        notes: outcome.notes,
      };
    } catch (caught) {
      const endedMs = this.now();
      const error = caught instanceof Error ? caught : new Error(String(caught));
      evidence = {
        name,
        stage,
        status: 'fail',
        startedAt,
        endedAt: new Date(endedMs).toISOString(),
        durationMs: Math.max(0, endedMs - startedMs),
        error: { name: error.name, message: error.message, stack: error.stack },
      };
    }
    this.run.tests.push(evidence);
    this.run.updatedAt = evidence.endedAt;
    this.run.status = aggregateStatus(this.run);
    return evidence;
  }

  trackRaf(id: number, cancel: (id: number) => void): void {
    if (this.unloaded) cancel(id);
    else this.rafs.set(id, { id, cancel });
  }

  untrackRaf(id: number): void {
    this.rafs.delete(id);
  }

  trackTimer(id: number, cancel: (id: number) => void): void {
    if (this.unloaded) cancel(id);
    else this.timers.set(id, { id, cancel });
  }

  untrackTimer(id: number): void {
    this.timers.delete(id);
  }

  onHide(): void {
    this.recordLifecycle('hide');
    this.cancelAll(this.rafs);
  }

  onShow(): void {
    if (this.unloaded) return;
    this.recordLifecycle('show');
  }

  onUnload(): void {
    if (this.unloaded) return;
    this.unloaded = true;
    this.cancelAll(this.rafs);
    this.cancelAll(this.timers);
    this.recordLifecycle('unload');
  }

  recordLifecycle(type: LifecycleEvidence['type'], detail?: string): void {
    this.run.lifecycle.push({ type, at: new Date(this.now()).toISOString(), detail });
  }

  snapshot(): RunResult {
    return cloneSerializable(this.run);
  }

  private cancelAll(handles: Map<number, TrackedHandle>): void {
    for (const handle of handles.values()) handle.cancel(handle.id);
    handles.clear();
  }
}

function cloneSerializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
