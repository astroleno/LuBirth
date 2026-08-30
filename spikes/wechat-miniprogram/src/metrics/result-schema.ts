export const RESULT_SCHEMA_VERSION = '1.0.0' as const;

export type ResultStatus = 'pass' | 'fail' | 'unsupported' | 'inconclusive';

export type SourceFingerprint = {
  revision: string;
  dirty: boolean;
  dependencyLockSha256: string;
  assetManifestSha256: string;
  astroSourceSha256: string;
};

export type DeviceMetadata = {
  platform?: 'ios' | 'android' | 'devtools' | 'unknown';
  model?: string;
  osVersion?: string;
  wechatVersion?: string;
  baseLibraryVersion?: string;
  dpr?: number;
  screenWidth?: number;
  screenHeight?: number;
};

export type PrerequisiteState = {
  appId: boolean;
  resourceDomain: boolean;
  physicalDevice: boolean;
};

export type TestEvidence = {
  name: string;
  stage: string;
  status: ResultStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  metrics?: Record<string, number | string | boolean | null>;
  notes?: string[];
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
};

export type LifecycleEvidence = {
  type: 'hide' | 'show' | 'unload' | 'memory-warning' | 'context-lost' | 'context-restored';
  at: string;
  detail?: string;
};

export type RunResult = {
  schemaVersion: typeof RESULT_SCHEMA_VERSION;
  runId: string;
  scenarioId: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  status: ResultStatus;
  source: SourceFingerprint;
  device: DeviceMetadata;
  prerequisites: PrerequisiteState;
  missingPrerequisites: string[];
  tests: TestEvidence[];
  lifecycle: LifecycleEvidence[];
};

type CreateRunInput = Pick<RunResult, 'runId' | 'scenarioId' | 'startedAt' | 'source' | 'device' | 'prerequisites'>;

const REQUIRED_DEVICE_FIELDS: Array<keyof DeviceMetadata> = [
  'platform',
  'model',
  'osVersion',
  'wechatVersion',
  'baseLibraryVersion',
  'dpr',
];

export function missingPrerequisites(input: Pick<CreateRunInput, 'device' | 'prerequisites'>): string[] {
  const missing = Object.entries(input.prerequisites)
    .filter(([, present]) => !present)
    .map(([name]) => name);

  for (const field of REQUIRED_DEVICE_FIELDS) {
    const value = input.device[field];
    if (value === undefined || value === null || value === '') {
      missing.push(`device.${field}`);
    }
  }
  return missing;
}

export function createRunResult(input: CreateRunInput): RunResult {
  const missing = missingPrerequisites(input);
  return {
    schemaVersion: RESULT_SCHEMA_VERSION,
    runId: input.runId,
    scenarioId: input.scenarioId,
    startedAt: input.startedAt,
    updatedAt: input.startedAt,
    status: 'inconclusive',
    source: { ...input.source },
    device: { ...input.device },
    prerequisites: { ...input.prerequisites },
    missingPrerequisites: missing,
    tests: [],
    lifecycle: [],
  };
}

export function aggregateStatus(run: Pick<RunResult, 'missingPrerequisites' | 'tests'>): ResultStatus {
  if (run.tests.some((entry) => entry.status === 'fail')) return 'fail';
  if (run.missingPrerequisites.length > 0 || run.tests.length === 0) return 'inconclusive';
  if (run.tests.some((entry) => entry.status === 'inconclusive')) return 'inconclusive';
  if (run.tests.some((entry) => entry.status === 'unsupported')) return 'unsupported';
  return 'pass';
}

export function finalizeRun(run: RunResult, completedAt = new Date().toISOString()): RunResult {
  return {
    ...run,
    updatedAt: completedAt,
    completedAt,
    status: aggregateStatus(run),
  };
}

export function compareFingerprints(
  web: SourceFingerprint,
  miniprogram: SourceFingerprint,
): { status: 'pass' | 'inconclusive'; mismatches: Array<keyof SourceFingerprint> } {
  const fields: Array<keyof SourceFingerprint> = [
    'revision',
    'dirty',
    'dependencyLockSha256',
    'assetManifestSha256',
    'astroSourceSha256',
  ];
  const mismatches = fields.filter((field) => web[field] !== miniprogram[field]);
  return { status: mismatches.length === 0 ? 'pass' : 'inconclusive', mismatches };
}
