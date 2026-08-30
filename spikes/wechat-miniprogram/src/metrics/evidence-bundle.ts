import type { ResultStatus, RunResult } from './result-schema.ts';

export type CompleteValidationBundle = {
  schemaVersion: '1.0.0';
  kind: 'complete-validation';
  exportedAt: string;
  status: ResultStatus;
  runIds: string[];
  runs: RunResult[];
};

export function createCompleteValidationBundle(
  runs: RunResult[],
  exportedAt = new Date().toISOString(),
): CompleteValidationBundle {
  const status: ResultStatus = runs.some((run) => run.status === 'fail')
    ? 'fail'
    : runs.length !== 4 || runs.some((run) => run.status === 'inconclusive')
      ? 'inconclusive'
      : runs.some((run) => run.status === 'unsupported')
        ? 'unsupported'
        : 'pass';
  return {
    schemaVersion: '1.0.0',
    kind: 'complete-validation',
    exportedAt,
    status,
    runIds: runs.map((run) => run.runId),
    runs,
  };
}
