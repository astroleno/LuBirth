import type { ResultStatus } from '../metrics/result-schema.ts';

export type LifecycleStressInput = {
  durationMs: number;
  reentryCount: number;
  contextLossCount: number;
  postUnloadFrameCount: number;
  blackScreenCount: number;
  crashCount: number;
  resourceDelta: number;
};

export type LifecycleStressResult = LifecycleStressInput & {
  status: ResultStatus;
  requiredDurationMs: 600_000;
  requiredReentryCount: 10;
  blockers: string[];
  missingEvidence: string[];
};

export function evaluateLifecycleStress(input: LifecycleStressInput): LifecycleStressResult {
  const blockers: string[] = [];
  if (input.contextLossCount > 0) blockers.push('context-loss');
  if (input.postUnloadFrameCount > 0) blockers.push('post-unload-frame');
  if (input.blackScreenCount > 0) blockers.push('black-screen');
  if (input.crashCount > 0) blockers.push('crash');
  if (input.resourceDelta > 0) blockers.push('resource-count-did-not-return-to-baseline');

  const missingEvidence: string[] = [];
  if (input.durationMs < 600_000) missingEvidence.push('10-minute-stability-window');
  if (input.reentryCount < 10) missingEvidence.push('10-page-reentries');
  const status: ResultStatus = blockers.length > 0
    ? 'fail'
    : missingEvidence.length > 0
      ? 'inconclusive'
      : 'pass';

  return {
    ...input,
    status,
    requiredDurationMs: 600_000,
    requiredReentryCount: 10,
    blockers,
    missingEvidence,
  };
}
