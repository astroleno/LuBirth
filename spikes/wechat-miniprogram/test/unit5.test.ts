import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import test from 'node:test';

import { ASSET_MANIFEST, selectAssetsForTier } from '../src/assets/asset-manifest.ts';
import {
  createWechatTextureLoader,
  formatAssetFailureStatus,
  MiniProgramTextureLoader,
} from '../src/assets/texture-loader.ts';
import { SceneLifecycle } from '../src/lifecycle/scene-lifecycle.ts';
import { summarizeAssetTier } from '../src/tests/asset-tier-test.ts';
import { evaluateLifecycleStress } from '../src/tests/lifecycle-stress-test.ts';

test('asset tiers include a true 2K star texture and do not pretend missing 8K moon/normal exist', () => {
  const baseline = selectAssetsForTier('2k');
  const high = selectAssetsForTier('8k');

  assert.equal(baseline.length, 10);
  assert.ok(baseline.every((asset) => asset.tier === '2k'));
  assert.equal(baseline.find((asset) => asset.key === 'stars')?.id, 'stars-2k');
  assert.equal(baseline.find((asset) => asset.key === 'stars')?.width, 2048);
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

test('equirectangular textures repeat across longitude before their first GPU upload', async () => {
  let uploadedTexture: any = null;
  const THREE = {
    SRGBColorSpace: 'srgb',
    NoColorSpace: 'linear',
    RepeatWrapping: 'repeat',
    ClampToEdgeWrapping: 'clamp',
    Texture: class {
      needsUpdate = false;
      colorSpace = '';
      wrapS = 'clamp';
      wrapT = 'clamp';
      constructor(_image: unknown) {}
      dispose() {}
    },
  };
  const loader = new MiniProgramTextureLoader({
    THREE,
    resourceBaseUrl: 'https://cdn.example/textures',
    download: async () => ({ localPath: '/tmp/earth-day.jpg', statusCode: 200 }),
    createImage: () => {
      const image: any = { width: 2048, height: 1024 };
      Object.defineProperty(image, 'src', { set() { queueMicrotask(() => image.onload?.()); } });
      return image;
    },
    uploadTexture: async (texture) => { uploadedTexture = texture; },
  });

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'pass');
  assert.equal(uploadedTexture, result.texture);
  assert.equal(uploadedTexture.wrapS, 'repeat');
  assert.equal(uploadedTexture.wrapT, 'clamp');
});

test('2K star texture downloads from the configured CDN before decode and GPU upload', async () => {
  let downloads = 0;
  let uploads = 0;
  let requestedUrl = '';
  const THREE = {
    SRGBColorSpace: 'srgb',
    NoColorSpace: 'linear',
    Texture: class {
      needsUpdate = false;
      colorSpace = '';
      constructor(_image: unknown) {}
      dispose() {}
    },
  };
  const loader = new MiniProgramTextureLoader({
    THREE,
    resourceBaseUrl: 'https://cdn.example/textures',
    download: async (url) => {
      downloads += 1;
      requestedUrl = url;
      return { localPath: '/tmp/2k-stars.webp', statusCode: 200 };
    },
    createImage: () => {
      const image: any = { width: 2048, height: 1024 };
      Object.defineProperty(image, 'src', { set() { queueMicrotask(() => image.onload?.()); } });
      return image;
    },
    uploadTexture: async () => { uploads += 1; },
  });
  const stars = ASSET_MANIFEST.find((asset) => asset.id === 'stars-2k')!;

  const result = await loader.loadEntry(stars);

  assert.equal(result.status, 'pass');
  assert.equal(result.url, 'https://cdn.example/textures/2k_stars_milky_way.webp');
  assert.equal(requestedUrl, result.url);
  assert.equal(downloads, 1);
  assert.equal(uploads, 1);
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
  assert.deepEqual(result.results.slice(0, 10).map((entry) => entry.tier), Array(10).fill('2k'));
  assert.deepEqual(result.results.slice(10).map((entry) => entry.tier), Array(6).fill('8k'));
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

test('WeChat texture loader attributes a GPU upload GL error to the exact asset', async () => {
  const image: any = { width: 2048, height: 1024 };
  Object.defineProperty(image, 'src', {
    set() { queueMicrotask(() => image.onload?.()); },
  });
  const glErrors = [0, 1281];
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
    renderer: { initTexture: () => undefined },
    gl: {
      NO_ERROR: 0,
      INVALID_VALUE: 1281,
      finish: () => undefined,
      getError: () => glErrors.shift() ?? 0,
    },
    createImage: () => image,
  };
  const wxApi = {
    downloadFile(options: any) {
      options.success({ statusCode: 200, tempFilePath: '/wx/cache/earth.jpg' });
    },
    getFileSystemManager() {
      return { statSync: () => ({ size: 463_087 }) };
    },
  };
  const loader = createWechatTextureLoader(session, 'https://cdn.example/textures', wxApi);

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'fail');
  assert.match(result.error ?? '', /GPU upload WebGL error 1281/);
  assert.equal(result.id, 'earth-day-2k');
});

test('WeChat texture loader clears a pre-existing GL error before attributing the texture upload', async () => {
  const image: any = { width: 2048, height: 1024 };
  Object.defineProperty(image, 'src', {
    set() { queueMicrotask(() => image.onload?.()); },
  });
  const glErrors = [1281, 0];
  let uploads = 0;
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
    renderer: { initTexture: () => { uploads += 1; } },
    gl: {
      NO_ERROR: 0,
      finish: () => undefined,
      getError: () => glErrors.shift() ?? 0,
    },
    createImage: () => image,
  };
  const wxApi = {
    downloadFile(options: any) {
      options.success({ statusCode: 200, tempFilePath: '/wx/cache/earth.jpg' });
    },
    getFileSystemManager() {
      return { statSync: () => ({ size: 463_087 }) };
    },
  };
  const loader = createWechatTextureLoader(session, 'https://cdn.example/textures', wxApi);

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'pass');
  assert.equal(uploads, 1);
});

test('WeChat texture loader preserves downloadFile errMsg objects from a physical device', async () => {
  const session: any = {
    capability: { maxTextureSize: 4096 },
    THREE: { Texture: class {}, SRGBColorSpace: 'srgb', NoColorSpace: 'linear' },
    renderer: {},
    gl: {},
    createImage: () => ({}),
  };
  const wxApi = {
    downloadFile(options: any) {
      options.fail({
        errMsg: 'downloadFile:fail url not in domain list',
        errno: 600009,
      });
    },
    getFileSystemManager() {
      return { statSync: () => ({ size: 0 }) };
    },
  };
  const loader = createWechatTextureLoader(session, 'https://assets.aitoshuu.me/textures', wxApi);

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'fail');
  assert.equal(result.error, 'downloadFile:fail url not in domain list (errno 600009)');
});

test('WeChat texture loader records the URL when downloadFile fails without details', async () => {
  const session: any = {
    capability: { maxTextureSize: 4096 },
    THREE: { Texture: class {}, SRGBColorSpace: 'srgb', NoColorSpace: 'linear' },
    renderer: {},
    gl: {},
    createImage: () => ({}),
  };
  const wxApi = {
    downloadFile(options: any) {
      options.fail(undefined);
    },
    getFileSystemManager() {
      return { statSync: () => ({ size: 0 }) };
    },
  };
  const loader = createWechatTextureLoader(session, 'https://assets.aitoshuu.me', wxApi);

  const result = await loader.loadEntry(ASSET_MANIFEST.find((asset) => asset.id === 'earth-day-2k')!);

  assert.equal(result.status, 'fail');
  assert.equal(
    result.error,
    'downloadFile failed without error details: https://assets.aitoshuu.me/2k_earth_daymap.jpg',
  );
});

test('asset failure status names the missing WeChat downloadFile legal domain', () => {
  const statusText = formatAssetFailureStatus('2k', [{
    id: 'earth-day-2k',
    key: 'earthDay',
    tier: '2k',
    status: 'fail',
    attempts: 2,
    url: 'https://assets.aitoshuu.me/textures/2k_earth_daymap.jpg',
    timings: { totalMs: 10 },
    error: 'downloadFile:fail url not in domain list (errno 600009)',
  }]);

  assert.equal(
    statusText,
    '2K 下载被微信拦截：请把 assets.aitoshuu.me 加入 downloadFile 合法域名',
  );
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
