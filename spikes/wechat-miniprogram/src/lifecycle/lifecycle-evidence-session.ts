import { evaluateLifecycleStress, type LifecycleStressResult } from '../tests/lifecycle-stress-test.ts';

export type LifecycleEventType =
  | 'page-entry'
  | 'show'
  | 'hide'
  | 'unload'
  | 'memory-warning'
  | 'context-lost'
  | 'context-restored'
  | 'post-unload-frame'
  | 'black-screen'
  | 'crash'
  | 'resource-sample';

export type LifecycleEventRecord = {
  schemaVersion: '1.0.0';
  runId: string;
  sessionId: string;
  pageEntryId: string;
  type: LifecycleEventType;
  at: string;
  detail?: string;
  resourceCount?: number;
};

export type LifecycleEvidenceState = {
  schemaVersion: '1.0.0';
  sessionId: string;
  startedAtMs: number;
  updatedAtMs: number;
  reentryCount: number;
  pageEntryId: string;
  eventRunIds: string[];
  contextLossCount: number;
  postUnloadFrameCount: number;
  blackScreenCount: number;
  crashCount: number;
  resourceBaseline: number | null;
  latestResourceCount: number | null;
  observedVisibleDurationMs: number;
  visibleStartedAtMs: number | null;
};

export type LifecycleSummary = {
  schemaVersion: '1.0.0';
  runId: string;
  sessionId: string;
  startedAt: string;
  completedAt: string;
  rawEvidenceRunIds: string[];
  evaluation: LifecycleStressResult;
};

export interface LifecycleEvidencePersistence {
  loadActive(): LifecycleEvidenceState | null;
  saveActive(state: LifecycleEvidenceState | null): void;
  writeEvent(event: LifecycleEventRecord): void;
  writeSummary(summary: LifecycleSummary): void;
}

type SessionOptions = {
  now?: () => number;
  makeId?: (prefix: string) => string;
};

function defaultId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class LifecycleEvidenceSession {
  private readonly persistence: LifecycleEvidencePersistence;
  private readonly now: () => number;
  private readonly makeId: (prefix: string) => string;
  private state: LifecycleEvidenceState;

  private constructor(
    persistence: LifecycleEvidencePersistence,
    now: () => number,
    makeId: (prefix: string) => string,
    state: LifecycleEvidenceState,
  ) {
    this.persistence = persistence;
    this.now = now;
    this.makeId = makeId;
    this.state = state;
  }

  static open(
    persistence: LifecycleEvidencePersistence,
    options: SessionOptions = {},
  ): LifecycleEvidenceSession {
    const now = options.now ?? (() => Date.now());
    const makeId = options.makeId ?? defaultId;
    const atMs = now();
    const prior = persistence.loadActive();
    const pageEntryId = makeId('page');
    const priorVisibleDuration = prior
      ? (prior.observedVisibleDurationMs ?? 0) + (
          prior.visibleStartedAtMs === null || prior.visibleStartedAtMs === undefined
            ? 0
            : Math.max(0, prior.updatedAtMs - prior.visibleStartedAtMs)
        )
      : 0;
    const state: LifecycleEvidenceState = prior
      ? {
          ...prior,
          updatedAtMs: atMs,
          reentryCount: prior.reentryCount + 1,
          pageEntryId,
          eventRunIds: [...prior.eventRunIds],
          observedVisibleDurationMs: priorVisibleDuration,
          visibleStartedAtMs: null,
        }
      : {
          schemaVersion: '1.0.0',
          sessionId: makeId('lifecycle'),
          startedAtMs: atMs,
          updatedAtMs: atMs,
          reentryCount: 1,
          pageEntryId,
          eventRunIds: [],
          contextLossCount: 0,
          postUnloadFrameCount: 0,
          blackScreenCount: 0,
          crashCount: 0,
          resourceBaseline: null,
          latestResourceCount: null,
          observedVisibleDurationMs: 0,
          visibleStartedAtMs: null,
        };
    const session = new LifecycleEvidenceSession(persistence, now, makeId, state);
    session.record('page-entry');
    return session;
  }

  record(type: LifecycleEventType, detail?: string): LifecycleEventRecord {
    const atMs = this.now();
    const event: LifecycleEventRecord = {
      schemaVersion: '1.0.0',
      runId: this.makeId('lifecycle-event'),
      sessionId: this.state.sessionId,
      pageEntryId: this.state.pageEntryId,
      type,
      at: new Date(atMs).toISOString(),
      ...(detail ? { detail } : {}),
    };
    this.incrementCounter(type);
    this.updateVisibilityDuration(type, atMs);
    this.appendEvent(event, atMs);
    return event;
  }

  recordResourceCount(resourceCount: number): LifecycleEventRecord {
    if (!Number.isFinite(resourceCount) || resourceCount < 0) {
      throw new Error('resource count must be a finite non-negative number');
    }
    const atMs = this.now();
    if (this.state.resourceBaseline === null) this.state.resourceBaseline = resourceCount;
    this.state.latestResourceCount = resourceCount;
    const event: LifecycleEventRecord = {
      schemaVersion: '1.0.0',
      runId: this.makeId('lifecycle-event'),
      sessionId: this.state.sessionId,
      pageEntryId: this.state.pageEntryId,
      type: 'resource-sample',
      at: new Date(atMs).toISOString(),
      resourceCount,
    };
    this.appendEvent(event, atMs);
    return event;
  }

  snapshot(): LifecycleEvidenceState {
    return { ...this.state, eventRunIds: [...this.state.eventRunIds] };
  }

  complete(): LifecycleSummary {
    const completedAtMs = this.now();
    const baseline = this.state.resourceBaseline ?? 0;
    const latest = this.state.latestResourceCount ?? baseline;
    const durationMs = this.state.observedVisibleDurationMs + (
      this.state.visibleStartedAtMs === null
        ? 0
        : Math.max(0, completedAtMs - this.state.visibleStartedAtMs)
    );
    const summary: LifecycleSummary = {
      schemaVersion: '1.0.0',
      runId: this.makeId('lifecycle-summary'),
      sessionId: this.state.sessionId,
      startedAt: new Date(this.state.startedAtMs).toISOString(),
      completedAt: new Date(completedAtMs).toISOString(),
      rawEvidenceRunIds: [...this.state.eventRunIds],
      evaluation: evaluateLifecycleStress({
        durationMs,
        reentryCount: this.state.reentryCount,
        contextLossCount: this.state.contextLossCount,
        postUnloadFrameCount: this.state.postUnloadFrameCount,
        blackScreenCount: this.state.blackScreenCount,
        crashCount: this.state.crashCount,
        resourceDelta: latest - baseline,
      }),
    };
    this.persistence.writeSummary(summary);
    this.persistence.saveActive(null);
    return summary;
  }

  private appendEvent(event: LifecycleEventRecord, atMs: number): void {
    this.persistence.writeEvent(event);
    this.state = {
      ...this.state,
      updatedAtMs: atMs,
      eventRunIds: [...this.state.eventRunIds, event.runId],
    };
    this.persistence.saveActive(this.state);
  }

  private incrementCounter(type: LifecycleEventType): void {
    if (type === 'context-lost') this.state.contextLossCount += 1;
    if (type === 'post-unload-frame') this.state.postUnloadFrameCount += 1;
    if (type === 'black-screen') this.state.blackScreenCount += 1;
    if (type === 'crash') this.state.crashCount += 1;
  }

  private updateVisibilityDuration(type: LifecycleEventType, atMs: number): void {
    if (type === 'show' && this.state.visibleStartedAtMs === null) {
      this.state.visibleStartedAtMs = atMs;
      return;
    }
    if ((type === 'hide' || type === 'unload') && this.state.visibleStartedAtMs !== null) {
      this.state.observedVisibleDurationMs += Math.max(0, atMs - this.state.visibleStartedAtMs);
      this.state.visibleStartedAtMs = null;
    }
  }
}
