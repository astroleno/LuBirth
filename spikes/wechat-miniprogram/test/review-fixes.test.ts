import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compareLoadedSceneConfig,
  evaluateEffectMatrixReadiness,
  type LoadedSceneConfig,
} from '../src/runtime/loaded-config.ts';
import { evaluateBenchmarkStatus } from '../src/tests/performance-benchmark-test.ts';
import { resolveRuntimeCapabilityStatus } from '../src/tests/runtime-capability-test.ts';
import { MiniProgramTextureLoader } from '../src/assets/texture-loader.ts';
import {
  LifecycleEvidenceSession,
  type LifecycleEvidencePersistence,
  type LifecycleEvidenceState,
  type LifecycleEventRecord,
  type LifecycleSummary,
} from '../src/lifecycle/lifecycle-evidence-session.ts';
import {
  captureScreenshotEvidence,
  ScreenshotStore,
} from '../src/metrics/screenshot-store.ts';
import { assertDevicePackageSize, sumPackageBytes } from '../build-output.mjs';

const loaded: LoadedSceneConfig = {
  runtimeRoute: 'r160',
  assetTier: '2k',
  scenarioId: 'equinox-shanghai',
  assetSource: 'remote',
};

test('loaded-scene comparison rejects stale runtime, tier, scenario and fallback assets', () => {
  assert.deepEqual(compareLoadedSceneConfig(loaded, loaded), { matches: true, mismatches: [] });
  assert.deepEqual(compareLoadedSceneConfig(loaded, {
    runtimeRoute: 'r108',
    assetTier: '8k',
    scenarioId: 'summer-solstice-shanghai',
    assetSource: 'fallback',
  }), {
    matches: false,
    mismatches: ['runtimeRoute', 'assetTier', 'scenarioId', 'assetSource'],
  });
  assert.deepEqual(compareLoadedSceneConfig(null, loaded), {
    matches: false,
    mismatches: ['missingLoadedConfig'],
  });
});

test('production effect matrix requires a passing remote 2K scene', () => {
  assert.equal(evaluateEffectMatrixReadiness({
    runtimeReady: true,
    loaderReady: true,
    loadedSceneStatus: 'pass',
    loadedConfig: loaded,
  }).ready, true);

  for (const candidate of [
    { runtimeReady: false, loaderReady: true, loadedSceneStatus: 'pass' as const, loadedConfig: loaded },
    { runtimeReady: true, loaderReady: false, loadedSceneStatus: 'pass' as const, loadedConfig: loaded },
    { runtimeReady: true, loaderReady: true, loadedSceneStatus: 'fail' as const, loadedConfig: loaded },
    { runtimeReady: true, loaderReady: true, loadedSceneStatus: 'pass' as const, loadedConfig: { ...loaded, assetTier: '8k' as const } },
    { runtimeReady: true, loaderReady: true, loadedSceneStatus: 'pass' as const, loadedConfig: { ...loaded, assetSource: 'fallback' as const } },
  ]) {
    assert.equal(evaluateEffectMatrixReadiness(candidate).ready, false);
  }
});

test('benchmark aggregate cannot pass when PIP 512 fails or a stage is interrupted', () => {
  assert.equal(evaluateBenchmarkStatus({
    baselineStatus: 'pass',
    pip256Status: 'pass',
    pip512Status: 'fail',
    interrupted: false,
    noGlError: true,
  }), 'fail');
  assert.equal(evaluateBenchmarkStatus({
    baselineStatus: 'pass',
    pip256Status: 'pass',
    pip512Status: 'pass',
    interrupted: true,
    noGlError: true,
  }), 'inconclusive');
  assert.equal(evaluateBenchmarkStatus({
    baselineStatus: 'pass',
    pip256Status: 'pass',
    pip512Status: 'pass',
    interrupted: false,
    noGlError: true,
  }), 'pass');
});

test('runtime result preserves unsupported required capabilities after successful drawing', () => {
  assert.equal(resolveRuntimeCapabilityStatus({
    capabilityStatus: 'unsupported',
    renderTargetPassed: true,
    noGlError: true,
    shaderPassed: true,
  }), 'unsupported');
  assert.equal(resolveRuntimeCapabilityStatus({
    capabilityStatus: 'unsupported',
    renderTargetPassed: true,
    noGlError: false,
    shaderPassed: true,
  }), 'fail');
});

test('8K entries exceeding MAX_TEXTURE_SIZE are rejected before download and decode', async () => {
  let downloads = 0;
  let decodes = 0;
  const loader = new MiniProgramTextureLoader({
    THREE: { Texture: class {} },
    resourceBaseUrl: 'https://example.invalid',
    maxTextureSize: 4096,
    download: async () => {
      downloads += 1;
      return { localPath: '/tmp/unexpected', statusCode: 200 };
    },
    createImage: () => {
      decodes += 1;
      return {};
    },
    uploadTexture: async () => undefined,
  });
  const result = await loader.loadEntry({
    id: 'earth-day-8k',
    key: 'earthDay',
    tier: '8k',
    required: true,
    fileName: 'earth-day-8k.jpg',
    mimeType: 'image/jpeg',
    fileBytes: 1,
    width: 8192,
    height: 4096,
    decodedRgbaBytes: 8192 * 4096 * 4,
    colorSpace: 'srgb',
  });

  assert.equal(result.status, 'unsupported');
  assert.equal(result.attempts, 0);
  assert.match(result.error ?? '', /MAX_TEXTURE_SIZE/);
  assert.equal(downloads, 0);
  assert.equal(decodes, 0);
});

class MemoryLifecyclePersistence implements LifecycleEvidencePersistence {
  active: LifecycleEvidenceState | null = null;
  events = new Map<string, LifecycleEventRecord>();
  summaries = new Map<string, LifecycleSummary>();

  loadActive() { return this.active ? structuredClone(this.active) : null; }
  saveActive(state: LifecycleEvidenceState | null) { this.active = state ? structuredClone(state) : null; }
  writeEvent(event: LifecycleEventRecord) {
    if (this.events.has(event.runId)) throw new Error('event overwritten');
    this.events.set(event.runId, structuredClone(event));
  }
  writeSummary(summary: LifecycleSummary) {
    if (this.summaries.has(summary.runId)) throw new Error('summary overwritten');
    this.summaries.set(summary.runId, structuredClone(summary));
  }
}

test('lifecycle evidence survives ten page instances and summarizes immutable event run IDs', () => {
  const persistence = new MemoryLifecyclePersistence();
  let now = 0;
  let sequence = 0;
  const id = (prefix: string) => `${prefix}-${++sequence}`;
  let session: LifecycleEvidenceSession | null = null;

  for (let reentry = 0; reentry < 10; reentry += 1) {
    session = LifecycleEvidenceSession.open(persistence, { now: () => now, makeId: id });
    session.record('show');
    now += 60_001;
    session.recordResourceCount(0);
    session.record('unload');
  }

  const snapshot = session!.snapshot();
  assert.equal(snapshot.reentryCount, 10);
  assert.equal(snapshot.eventRunIds.length, 40);
  const summary = session!.complete();
  assert.equal(summary.evaluation.status, 'pass');
  assert.deepEqual(summary.rawEvidenceRunIds, snapshot.eventRunIds);
  assert.equal('events' in summary, false);
  assert.equal(persistence.active, null);
  assert.equal(persistence.events.size, 40);
  assert.equal(persistence.summaries.size, 1);
});

test('lifecycle stability duration excludes time after the page is hidden', () => {
  const persistence = new MemoryLifecyclePersistence();
  let now = 0;
  let sequence = 0;
  const session = LifecycleEvidenceSession.open(persistence, {
    now: () => now,
    makeId: (prefix) => `${prefix}-${++sequence}`,
  });
  session.record('show');
  now = 100;
  session.record('hide');
  now = 700_000;

  const summary = session.complete();
  assert.equal(summary.evaluation.durationMs, 100);
  assert.equal(summary.evaluation.status, 'inconclusive');
});

test('screenshot store copies temporary output to a run-id-addressed persistent path', async () => {
  const calls: string[] = [];
  const store = new ScreenshotStore('/wx-user/results', {
    exists: async () => false,
    ensureDirectory: async (path) => { calls.push(`mkdir:${path}`); },
    copyFile: async (source, destination) => { calls.push(`copy:${source}->${destination}`); },
  });
  const path = await store.persist('/tmp/canvas.png', 'scene-abc-123');

  assert.equal(path, '/wx-user/results/screenshots/scene-abc-123.png');
  assert.deepEqual(calls, [
    'mkdir:/wx-user/results/screenshots',
    'copy:/tmp/canvas.png->/wx-user/results/screenshots/scene-abc-123.png',
  ]);
});

test('unsupported WebGL canvas screenshots remain non-blocking evidence', async () => {
  const store = new ScreenshotStore('/wx-user/results', {
    exists: async () => false,
    ensureDirectory: async () => undefined,
    copyFile: async () => undefined,
  });

  const evidence = await captureScreenshotEvidence({
    runId: 'scene-ios-webgl',
    captureTemporaryPath: async () => {
      throw { errMsg: 'canvasToTempFilePath:fail Invalid context type [2d] for Canvas#getContext' };
    },
    store,
  });

  assert.deepEqual(evidence, {
    error: 'canvasToTempFilePath:fail Invalid context type [2d] for Canvas#getContext',
  });
});

test('device package size gate sums output and rejects anything over two MiB', () => {
  assert.equal(sumPackageBytes([{ size: 10 }, { size: 20 }]), 30);
  assert.equal(assertDevicePackageSize(2 * 1024 * 1024).status, 'pass');
  assert.throws(() => assertDevicePackageSize(2 * 1024 * 1024 + 1), /2 MiB/);
});
