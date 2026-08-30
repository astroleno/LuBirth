import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FrameWindowAbort,
  captureFrameWindow,
  decideNativeMigration,
  evaluateBaselinePerformance,
  evaluatePairedPipRounds,
  firstStableFrame,
  runPairedPipBenchmark,
  summarizeFrameIntervals,
} from '../src/tests/performance-benchmark-test.ts';

test('frame summary uses deterministic median and nearest-rank p95', () => {
  const summary = summarizeFrameIntervals([16, 17, 18, 40, 60]);

  assert.equal(summary.sampleCount, 5);
  assert.equal(summary.medianFrameMs, 18);
  assert.equal(summary.p95FrameMs, 60);
  assert.equal(summary.medianFps, 1000 / 18);
  assert.equal(summary.droppedFrameCount, 2);
});

test('2K baseline gate enforces both median FPS and p95 frame interval', () => {
  assert.equal(evaluateBaselinePerformance(summarizeFrameIntervals([30, 31, 32, 40, 49])).status, 'pass');
  assert.equal(evaluateBaselinePerformance(summarizeFrameIntervals([30, 31, 32, 40, 51])).status, 'fail');
  assert.equal(evaluateBaselinePerformance(summarizeFrameIntervals([])).status, 'inconclusive');
});

test('PIP gate uses three paired median deltas and retains p95 data', () => {
  const report = evaluatePairedPipRounds(256, [
    { round: 1, order: 'off-on', off: summarizeFrameIntervals([16, 17, 18]), on: summarizeFrameIntervals([18, 19, 20]) },
    { round: 2, order: 'on-off', off: summarizeFrameIntervals([17, 18, 19]), on: summarizeFrameIntervals([18, 19, 20]) },
    { round: 3, order: 'off-on', off: summarizeFrameIntervals([18, 19, 20]), on: summarizeFrameIntervals([19, 20, 21]) },
  ]);

  assert.equal(report.status, 'pass');
  assert.equal(report.medianDeltaMs, 1);
  assert.deepEqual(report.p95Pairs, [
    { offMs: 18, onMs: 20 },
    { offMs: 19, onMs: 20 },
    { offMs: 20, onMs: 21 },
  ]);
  assert.equal(evaluatePairedPipRounds(512, report.rounds.slice(0, 2)).status, 'inconclusive');
});

test('paired runner alternates order and records each window under the matching PIP state', async () => {
  const toggles: boolean[] = [];
  const report = await runPairedPipBenchmark({
    resolution: 256,
    rounds: 3,
    setPipEnabled: (enabled) => toggles.push(enabled),
    capture: async () => summarizeFrameIntervals(toggles[toggles.length - 1] ? [18, 19, 20] : [17, 18, 19]),
  });

  assert.deepEqual(toggles, [false, true, true, false, false, true]);
  assert.deepEqual(report.rounds.map((round) => round.order), ['off-on', 'on-off', 'off-on']);
  assert.equal(report.medianDeltaMs, 1);
});

test('stable-frame marker requires core resources plus eleven error-free frames at one generation', () => {
  const observations = Array.from({ length: 12 }, (_, index) => ({
    timestampMs: index * 16,
    coreTexturesReady: index >= 1,
    shaderErrorCount: 0,
    resourceGeneration: index >= 1 ? 2 : 1,
  }));
  assert.equal(firstStableFrame(observations)?.timestampMs, 16);
  observations[7].shaderErrorCount = 1;
  assert.equal(firstStableFrame(observations), null);
});

test('decision gate never emits Go without complete real-device prerequisites', () => {
  const base = {
    realAppId: true,
    resourceDomain: true,
    requiredDeviceCount: 3,
    maintainableRuntime: true,
    devices: [
      { id: 'ios', platform: 'ios' as const, core2k: 'pass' as const, high8k: 'pass' as const },
      { id: 'android-mid', platform: 'android' as const, core2k: 'pass' as const, high8k: 'pass' as const },
      { id: 'android-low', platform: 'android' as const, core2k: 'pass' as const, high8k: 'pass' as const },
    ],
  };

  assert.equal(decideNativeMigration(base).decision, 'GO-FULL');
  assert.equal(decideNativeMigration({ ...base, devices: base.devices.slice(0, 2) }).decision, 'INCONCLUSIVE');
  assert.equal(decideNativeMigration({
    ...base,
    devices: base.devices.map((device, index) => index === 2 ? { ...device, high8k: 'fail' as const } : device),
  }).decision, 'GO-ADAPTIVE');
  assert.equal(decideNativeMigration({
    ...base,
    devices: base.devices.map((device, index) => index === 2 ? { ...device, core2k: 'fail' as const } : device),
  }).decision, 'NO-GO-NATIVE');
});

test('frame-window capture excludes warmup and resolves from injected RAF timestamps', async () => {
  let timestamp = 0;
  let nextId = 1;
  const summary = await captureFrameWindow({
    requestFrame(callback) {
      const id = nextId++;
      queueMicrotask(() => {
        timestamp += 10;
        callback(timestamp);
      });
      return id;
    },
    cancelFrame: () => undefined,
    warmupMs: 20,
    durationMs: 40,
  });

  assert.equal(summary.sampleCount, 4);
  assert.equal(summary.medianFrameMs, 10);
  assert.equal(summary.p95FrameMs, 10);
});

test('aborting a frame window cancels the outstanding RAF and returns incomplete evidence', async () => {
  let scheduledCallback: ((timestamp: number) => void) | null = null;
  const cancelled: number[] = [];
  const abort = new FrameWindowAbort();
  const pending = captureFrameWindow({
    requestFrame(callback) {
      scheduledCallback = callback;
      return 41;
    },
    cancelFrame: (id) => cancelled.push(id),
    warmupMs: 0,
    durationMs: 60_000,
    abort,
  });

  assert.ok(scheduledCallback);
  abort.abort();
  const summary = await pending;
  assert.deepEqual(cancelled, [41]);
  assert.equal(summary.sampleCount, 0);
});
