import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compareFingerprints,
  createRunResult,
  finalizeRun,
  type SourceFingerprint,
} from '../src/metrics/result-schema.ts';
import { PerformanceProbe } from '../src/metrics/performance-probe.ts';
import { SCENARIOS, getScenario } from '../src/config/scenarios.ts';
import { ResultStore } from '../src/metrics/result-store.ts';
import { RunHarness } from '../src/tests/harness-self-test.ts';

const completeDevice = {
  platform: 'ios' as const,
  model: 'iPhone 15',
  osVersion: 'iOS 19.0',
  wechatVersion: '9.0.0',
  baseLibraryVersion: '3.8.12',
  dpr: 3,
};

const fingerprint: SourceFingerprint = {
  revision: '48bdde1',
  dirty: false,
  dependencyLockSha256: 'dep-a',
  assetManifestSha256: 'asset-a',
  astroSourceSha256: 'astro-a',
};

test('missing device prerequisites make a run inconclusive', () => {
  const run = createRunResult({
    runId: 'run-missing-device',
    scenarioId: 'equinox-shanghai-2k',
    startedAt: '2026-08-30T00:00:00.000Z',
    source: fingerprint,
    device: { platform: 'devtools', model: 'simulator', dpr: 2 },
    prerequisites: { appId: false, resourceDomain: false, physicalDevice: false },
  });

  assert.equal(run.status, 'inconclusive');
  assert.deepEqual(run.missingPrerequisites, [
    'appId',
    'resourceDomain',
    'physicalDevice',
    'device.osVersion',
    'device.wechatVersion',
    'device.baseLibraryVersion',
  ]);
});

test('a thrown test is preserved and later tests still run', async () => {
  const harness = new RunHarness(createRunResult({
    runId: 'run-error-isolation',
    scenarioId: 'equinox-shanghai-2k',
    startedAt: '2026-08-30T00:00:00.000Z',
    source: fingerprint,
    device: completeDevice,
    prerequisites: { appId: true, resourceDomain: true, physicalDevice: true },
  }), () => 100);

  await harness.runTest('shader compile', 'shader', () => {
    throw new Error('fragment shader failed');
  });
  await harness.runTest('cleanup', 'lifecycle', () => ({ status: 'pass' }));

  const final = finalizeRun(harness.snapshot(), '2026-08-30T00:01:00.000Z');
  assert.equal(final.tests.length, 2);
  assert.equal(final.tests[0].status, 'fail');
  assert.equal(final.tests[0].error?.message, 'fragment shader failed');
  assert.equal(final.tests[1].status, 'pass');
  assert.equal(final.status, 'fail');
});

test('fingerprint mismatch rejects direct comparison', () => {
  const mismatch = compareFingerprints(fingerprint, {
    ...fingerprint,
    assetManifestSha256: 'asset-b',
  });

  assert.equal(mismatch.status, 'inconclusive');
  assert.deepEqual(mismatch.mismatches, ['assetManifestSha256']);
});

test('dirty astro source drift is detected even when git revision is unchanged', () => {
  const mismatch = compareFingerprints(fingerprint, {
    ...fingerprint,
    astroSourceSha256: 'astro-b',
  });

  assert.equal(mismatch.status, 'inconclusive');
  assert.deepEqual(mismatch.mismatches, ['astroSourceSha256']);
});

test('performance probe reports literal median and p95 frame intervals', () => {
  const probe = new PerformanceProbe(5);
  [0, 10, 30, 60, 100, 150].forEach((timestamp) => probe.recordFrame(timestamp));

  assert.deepEqual(probe.summary(), {
    sampleCount: 5,
    medianFrameMs: 30,
    p95FrameMs: 50,
    medianFps: 33.333333333333336,
    droppedFrameCount: 2,
  });
});

test('unload stops every registered RAF and timer exactly once', () => {
  const cancelledRaf: number[] = [];
  const clearedTimers: number[] = [];
  const harness = new RunHarness(createRunResult({
    runId: 'run-lifecycle',
    scenarioId: 'equinox-shanghai-2k',
    startedAt: '2026-08-30T00:00:00.000Z',
    source: fingerprint,
    device: completeDevice,
    prerequisites: { appId: true, resourceDomain: true, physicalDevice: true },
  }));

  harness.trackRaf(11, (id) => cancelledRaf.push(id));
  harness.trackTimer(22, (id) => clearedTimers.push(id));
  harness.onHide();
  harness.onShow();
  harness.onUnload();
  harness.onUnload();

  assert.deepEqual(cancelledRaf, [11]);
  assert.deepEqual(clearedTimers, [22]);
  assert.equal(harness.snapshot().runId, 'run-lifecycle');
  assert.deepEqual(harness.snapshot().lifecycle.map((event) => event.type), [
    'hide',
    'show',
    'unload',
  ]);
});

test('the experiment matrix fixes three astronomical inputs and both PIP sizes', () => {
  assert.equal(SCENARIOS.length, 3);
  assert.deepEqual(SCENARIOS.map((scenario) => scenario.utc), [
    '2024-03-21T12:00:00.000Z',
    '2024-06-21T12:00:00.000Z',
    '2024-12-21T12:00:00.000Z',
  ]);
  assert.deepEqual(getScenario('equinox-shanghai').pip.resolutions, [256, 512]);
  assert.equal(getScenario('equinox-shanghai').performance.durationMs, 60_000);
});

test('raw run evidence is immutable and summaries only reference run ids', async () => {
  const files = new Map<string, string>();
  const store = new ResultStore('/user-data', {
    exists: async (path) => files.has(path),
    ensureDirectory: async () => undefined,
    writeText: async (path, content) => { files.set(path, content); },
  });
  const run = createRunResult({
    runId: 'run-immutable',
    scenarioId: 'equinox-shanghai-2k',
    startedAt: '2026-08-30T00:00:00.000Z',
    source: fingerprint,
    device: completeDevice,
    prerequisites: { appId: true, resourceDomain: true, physicalDevice: true },
  });

  await store.writeRun(run);
  await assert.rejects(() => store.writeRun(run), /already exists/);
  await store.writeSummary('latest', ['run-immutable']);

  assert.deepEqual(JSON.parse(files.get('/user-data/results/latest.json') ?? '{}'), {
    schemaVersion: '1.0.0',
    summaryId: 'latest',
    runIds: ['run-immutable'],
  });
});
