import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import test from 'node:test';

import { ASSET_MANIFEST, selectAssetsForTier } from '../src/assets/asset-manifest.ts';
import { createWechatTextureLoader, MiniProgramTextureLoader } from '../src/assets/texture-loader.ts';
import { SceneLifecycle } from '../src/lifecycle/scene-lifecycle.ts';
import { summarizeAssetTier } from '../src/tests/asset-tier-test.ts';
import { evaluateLifecycleStress } from '../src/tests/lifecycle-stress-test.ts';

test('asset tiers select one best-fit asset per semantic without pretending missing 8K moon/normal exist', () => {
  const baseline = selectAssetsForTier('2k');
  const high = selectAssetsForTier('8k');

  assert.equal(baseline.length, 9);
  assert.ok(baseline.every((asset) => asset.tier === '2k'));
  assert.equal(new Set(high.map((asset) => asset.key)).size, high.length);
  assert.equal(high.find((asset) => asset.key === 'earthDay')?.tier, '8k');
  assert.equal(high.find((asset) => asset.key === 'earthNormal')?.tier, '2k');
  assert.equal(high.find((asset) => asset.key === 'moon')?.tier, '2k');
  assert.equal(high.find((asset) => asset.key === 'stars')?.tier, '8k');
  assert.equal(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-8k')?.decodedRgbaBytes, 134_217_728);
});

test('asset manifest file names and byte counts match the repository textures exactly', () => {
  const textureRoot = new URL('../../../public/textures/', import.meta.url);
  for (const asset of ASSET_MANIFEST) {
    const stats = statSync(new URL(asset.fileName, textureRoot));
    assert.equal(stats.size, asset.fileBytes, asset.id);
  }
});

test('texture loading retries once, records phases, and produces a real texture boundary object', async () => {
  let downloads = 0;
  const THREE = {
    SRGBColorSpace: 'srgb',
    NoColorSpace: 'linear',
    Texture: class {
      image: unknown;
      needsUpdate = false;
      colorSpace = '';
      disposed = false;
      constructor(image: unknown) { this.image = image; }
      dispose() { this.disposed = true; }
    },
  };
  const loader = new MiniProgramTextureLoader({
    THREE,
    resourceBaseUrl: 'https://cdn.example/textures',
    now: (() => { let value = 0; return () => ++value; })(),
    download: async () => {
      downloads += 1;
      if (downloads === 1) throw new Error('temporary network error');
      return { localPath: '/tmp/earth.jpg', statusCode: 200, bytes: 463087, fromCache: false };
    },
    createImage: () => {
      const image: any = { width: 2048, height: 1024, onload: null, onerror: null };
      Object.defineProperty(image, 'src', {
        set() { queueMicrotask(() => image.onload?.()); },
      });
      return image;
    },
    uploadTexture: async () => undefined,
    maxAttempts: 2,
  });

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'pass');
  assert.equal(result.attempts, 2);
  assert.equal(result.bytes, 463087);
  assert.ok((result.timings.downloadMs ?? 0) > 0);
  assert.ok((result.timings.decodeMs ?? 0) > 0);
  assert.ok((result.timings.uploadMs ?? 0) > 0);
  assert.equal((result.texture as any).needsUpdate, true);
  assert.equal((result.texture as any).colorSpace, 'srgb');
});

test('required asset failure is retained at its exact tier after bounded retries', async () => {
  let attempts = 0;
  const loader = new MiniProgramTextureLoader({
    THREE: { Texture: class {}, SRGBColorSpace: 'srgb', NoColorSpace: 'linear' },
    resourceBaseUrl: 'https://cdn.example/textures',
    now: Date.now,
    download: async () => { attempts += 1; throw new Error('404'); },
    createImage: () => ({}),
    uploadTexture: async () => undefined,
    maxAttempts: 2,
  });

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-8k')!);

  assert.equal(result.status, 'fail');
  assert.equal(result.tier, '8k');
  assert.equal(result.attempts, 2);
  assert.match(result.error ?? '', /404/);
});

test('8K loading establishes the complete 2K baseline before applying high-quality replacements', async () => {
  let currentUrl = '';
  const loader = new MiniProgramTextureLoader({
    THREE: {
      SRGBColorSpace: 'srgb', NoColorSpace: 'linear',
      Texture: class {
        needsUpdate = false;
        colorSpace = '';
        disposed = false;
        constructor(_image: unknown) {}
        dispose() { this.disposed = true; }
      },
    },
    resourceBaseUrl: 'https://cdn.example/textures',
    now: Date.now,
    download: async (url) => {
      currentUrl = url;
      return { localPath: url, statusCode: 200 };
    },
    createImage: () => {
      const is8k = currentUrl.includes('8k_');
      const image: any = { width: is8k ? 8192 : 2048, height: is8k ? 4096 : 1024 };
      Object.defineProperty(image, 'src', { set() { queueMicrotask(() => image.onload?.()); } });
      return image;
    },
    uploadTexture: async () => undefined,
  });

  const result = await loader.loadTier('8k');

  assert.equal(result.status, 'pass');
  assert.deepEqual(result.results.slice(0, 9).map((entry) => entry.tier), Array(9).fill('2k'));
  assert.deepEqual(result.results.slice(9).map((entry) => entry.tier), Array(6).fill('8k'));
  assert.equal(Object.keys(result.textures).length, 10);
  const highEarthDay = result.textures.earthDay;
  const downgraded = loader.handleMemoryWarning();
  assert.notEqual(downgraded.earthDay, highEarthDay);
  assert.equal((highEarthDay as any).disposed, true);
  assert.equal(loader.getLoadedTextures('8k').earthDay, downgraded.earthDay);
  assert.equal((await loader.loadTier('8k')).status, 'unsupported');
});

test('scene lifecycle pauses, resumes, handles memory warning and disposes owned resources once', () => {
  const scheduled: number[] = [];
  const cancelled: number[] = [];
  const calls: string[] = [];
  let nextFrameId = 1;
  const lifecycle = new SceneLifecycle({
    requestFrame: () => { const id = nextFrameId++; scheduled.push(id); return id; },
    cancelFrame: (id) => cancelled.push(id),
    renderFrame: () => undefined,
    scene: { dispose: () => calls.push('scene.dispose') },
    runtime: { dispose: () => calls.push('runtime.dispose') },
    assets: {
      handleMemoryWarning: () => calls.push('assets.memoryWarning'),
      dispose: () => calls.push('assets.dispose'),
    },
  });

  lifecycle.onShow();
  lifecycle.onHide();
  lifecycle.onShow();
  lifecycle.onMemoryWarning();
  lifecycle.onUnload();
  lifecycle.onUnload();
  lifecycle.onShow();

  assert.deepEqual(scheduled, [1, 2]);
  assert.deepEqual(cancelled, [1, 2]);
  assert.deepEqual(calls, [
    'assets.memoryWarning',
    'scene.dispose',
    'assets.dispose',
    'runtime.dispose',
  ]);
  assert.deepEqual(lifecycle.snapshot(), {
    state: 'unloaded',
    showCount: 2,
    hideCount: 1,
    memoryWarningCount: 1,
    frameActive: false,
  });
});

test('WeChat texture loader uses downloadFile, reads exact bytes and forces a GPU upload', async () => {
  const calls: string[] = [];
  const image: any = { width: 2048, height: 1024 };
  Object.defineProperty(image, 'src', {
    set(path: string) {
      calls.push(`image:${path}`);
      queueMicrotask(() => image.onload?.());
    },
  });
  const renderer = {
    initTexture: (_texture: unknown) => calls.push('renderer.initTexture'),
  };
  const session: any = {
    capability: { maxTextureSize: 4096 },
    THREE: {
      SRGBColorSpace: 'srgb',
      NoColorSpace: 'linear',
      Texture: class {
        needsUpdate = false;
        colorSpace = '';
        constructor(_image: unknown) {}
        dispose() {}
      },
    },
    renderer,
    gl: { finish: () => calls.push('gl.finish') },
    createImage: () => image,
  };
  const wxApi = {
    downloadFile(options: any) {
      calls.push(`download:${options.url}`);
      options.success({ statusCode: 200, tempFilePath: '/wx/cache/earth.jpg' });
    },
    getFileSystemManager() {
      return { statSync: () => ({ stats: { size: 463_087 } }) };
    },
  };
  const loader = createWechatTextureLoader(session, 'https://cdn.example/textures/', wxApi);

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'pass');
  assert.equal(result.bytes, 463_087);
  assert.deepEqual(calls, [
    'download:https://cdn.example/textures/2k_earth_daymap.jpg',
    'image:/wx/cache/earth.jpg',
    'renderer.initTexture',
    'gl.finish',
  ]);
});

test('asset evidence keeps timing, cache and failed-resource boundaries auditable', () => {
  const summary = summarizeAssetTier('8k', [
    {
      id: 'earth-day-2k', key: 'earthDay', tier: '2k', status: 'pass', attempts: 1,
      url: 'https://cdn/2k.jpg', bytes: 10, fromCache: true,
      timings: { downloadMs: 3, decodeMs: 4, uploadMs: 5, totalMs: 12 },
    },
    {
      id: 'earth-day-8k', key: 'earthDay', tier: '8k', status: 'fail', attempts: 2,
      url: 'https://cdn/8k.jpg', timings: { downloadMs: 9, totalMs: 9 }, error: 'HTTP 404',
    },
  ]);

  assert.equal(summary.status, 'fail');
  assert.equal(summary.cacheHitCount, 1);
  assert.equal(summary.totalBytes, 10);
  assert.equal(summary.totalDownloadMs, 12);
  assert.deepEqual(summary.failedAssetIds, ['earth-day-8k']);
});

test('lifecycle gate fails faults and remains inconclusive until both stress windows complete', () => {
  assert.equal(evaluateLifecycleStress({
    durationMs: 600_000,
    reentryCount: 10,
    contextLossCount: 0,
    postUnloadFrameCount: 0,
    blackScreenCount: 0,
    crashCount: 0,
    resourceDelta: 0,
  }).status, 'pass');
  assert.equal(evaluateLifecycleStress({
    durationMs: 100_000,
    reentryCount: 3,
    contextLossCount: 0,
    postUnloadFrameCount: 0,
    blackScreenCount: 0,
    crashCount: 0,
    resourceDelta: 0,
  }).status, 'inconclusive');
  assert.equal(evaluateLifecycleStress({
    durationMs: 600_000,
    reentryCount: 10,
    contextLossCount: 1,
    postUnloadFrameCount: 0,
    blackScreenCount: 0,
    crashCount: 0,
    resourceDelta: 0,
  }).status, 'fail');
});
