import type { AssetTier } from '../config/scenarios.ts';
import type { ResultStatus } from '../metrics/result-schema.ts';
import type { RuntimeSession } from '../runtime/runtime-contract.ts';
import { ASSET_MANIFEST, selectAssetsForTier, type AssetManifestEntry, type AssetKey } from './asset-manifest.ts';

type DownloadResult = {
  localPath: string;
  statusCode: number;
  bytes?: number;
  fromCache?: boolean;
};

type TextureLoaderOptions = {
  THREE: any;
  resourceBaseUrl: string;
  now?: () => number;
  download(url: string): Promise<DownloadResult>;
  createImage(): any;
  uploadTexture(texture: any): Promise<void>;
  maxAttempts?: number;
  maxTextureSize?: number;
};

export type AssetLoadResult = {
  id: string;
  key: AssetKey;
  tier: AssetTier;
  status: ResultStatus;
  attempts: number;
  url: string;
  bytes?: number;
  fromCache?: boolean;
  timings: {
    downloadMs?: number;
    decodeMs?: number;
    uploadMs?: number;
    totalMs: number;
  };
  texture?: any;
  error?: string;
};

function loadImage(createImage: () => any, path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const image = createImage();
    image.onload = () => resolve(image);
    image.onerror = (error: unknown) => reject(error instanceof Error ? error : new Error(String(error)));
    image.src = path;
  });
}

export class MiniProgramTextureLoader {
  private readonly THREE: any;
  private readonly resourceBaseUrl: string;
  private readonly now: () => number;
  private readonly download: TextureLoaderOptions['download'];
  private readonly createImage: TextureLoaderOptions['createImage'];
  private readonly uploadTexture: TextureLoaderOptions['uploadTexture'];
  private readonly maxAttempts: number;
  private readonly maxTextureSize: number;
  private readonly loaded = new Map<string, { texture: any; tier: AssetTier; key: AssetKey }>();
  private highQualityAllowed = true;
  private disposed = false;

  constructor(options: TextureLoaderOptions) {
    this.THREE = options.THREE;
    this.resourceBaseUrl = options.resourceBaseUrl.replace(/\/$/, '');
    this.now = options.now ?? (() => Date.now());
    this.download = options.download;
    this.createImage = options.createImage;
    this.uploadTexture = options.uploadTexture;
    this.maxAttempts = options.maxAttempts ?? 2;
    this.maxTextureSize = options.maxTextureSize ?? Number.POSITIVE_INFINITY;
  }

  async loadEntry(entry: AssetManifestEntry): Promise<AssetLoadResult> {
    const totalStarted = this.now();
    const url = `${this.resourceBaseUrl}/${entry.fileName}`;
    if (this.disposed) return this.failed(entry, url, 0, totalStarted, new Error('loader disposed'));
    if (entry.width > this.maxTextureSize || entry.height > this.maxTextureSize) {
      return {
        id: entry.id,
        key: entry.key,
        tier: entry.tier,
        status: 'unsupported',
        attempts: 0,
        url,
        timings: { totalMs: this.now() - totalStarted },
        error: `texture ${entry.width}x${entry.height} exceeds MAX_TEXTURE_SIZE ${this.maxTextureSize}`,
      };
    }
    if (entry.tier === '8k' && !this.highQualityAllowed) {
      return {
        id: entry.id,
        key: entry.key,
        tier: entry.tier,
        status: 'unsupported',
        attempts: 0,
        url,
        timings: { totalMs: this.now() - totalStarted },
        error: 'high-quality loading disabled after memory warning',
      };
    }

    let lastError: unknown;
    let attempts = 0;
    let downloaded: DownloadResult | undefined;
    const downloadStarted = this.now();
    while (attempts < this.maxAttempts) {
      attempts += 1;
      try {
        downloaded = await this.download(url);
        if (downloaded.statusCode < 200 || downloaded.statusCode >= 300) {
          throw new Error(`HTTP ${downloaded.statusCode}`);
        }
        break;
      } catch (error) {
        lastError = error;
      }
    }
    const downloadMs = this.now() - downloadStarted;
    if (!downloaded) return this.failed(entry, url, attempts, totalStarted, lastError, { downloadMs });

    try {
      const decodeStarted = this.now();
      const image = await loadImage(this.createImage, downloaded.localPath);
      const decodeMs = this.now() - decodeStarted;
      if (image.width && image.height && (image.width !== entry.width || image.height !== entry.height)) {
        throw new Error(`decoded dimensions ${image.width}x${image.height}, expected ${entry.width}x${entry.height}`);
      }
      const texture = new this.THREE.Texture(image);
      if ('colorSpace' in texture) {
        texture.colorSpace = entry.colorSpace === 'srgb' ? this.THREE.SRGBColorSpace : this.THREE.NoColorSpace;
      } else if ('encoding' in texture) {
        texture.encoding = entry.colorSpace === 'srgb' ? this.THREE.sRGBEncoding : this.THREE.LinearEncoding;
      }
      texture.needsUpdate = true;
      const uploadStarted = this.now();
      await this.uploadTexture(texture);
      const uploadMs = this.now() - uploadStarted;
      this.loaded.get(entry.id)?.texture.dispose?.();
      this.loaded.set(entry.id, { texture, tier: entry.tier, key: entry.key });
      return {
        id: entry.id,
        key: entry.key,
        tier: entry.tier,
        status: 'pass',
        attempts,
        url,
        bytes: downloaded.bytes,
        fromCache: downloaded.fromCache,
        timings: { downloadMs, decodeMs, uploadMs, totalMs: this.now() - totalStarted },
        texture,
      };
    } catch (error) {
      return this.failed(entry, url, attempts, totalStarted, error, { downloadMs });
    }
  }

  async loadTier(tier: AssetTier): Promise<{
    status: ResultStatus;
    tier: AssetTier;
    textures: Partial<Record<AssetKey, any>>;
    results: AssetLoadResult[];
  }> {
    const results: AssetLoadResult[] = [];
    const plannedAssets = tier === '8k'
      ? [...selectAssetsForTier('2k'), ...ASSET_MANIFEST.filter((asset) => asset.tier === '8k')]
      : selectAssetsForTier('2k');
    for (const asset of plannedAssets) {
      const result = await this.loadEntry(asset);
      results.push(result);
    }
    const requiredResults = results.filter((result) => {
      const manifest = plannedAssets.find((entry) => entry.id === result.id);
      return manifest?.required;
    });
    const status: ResultStatus = requiredResults.some((result) => result.status === 'fail')
      ? 'fail'
      : requiredResults.some((result) => result.status === 'unsupported')
        ? 'unsupported'
        : requiredResults.some((result) => result.status === 'inconclusive')
          ? 'inconclusive'
          : 'pass';
    return {
      status,
      tier,
      textures: this.getLoadedTextures(tier),
      results,
    };
  }

  getLoadedTextures(tier: AssetTier): Partial<Record<AssetKey, any>> {
    const textures: Partial<Record<AssetKey, any>> = {};
    for (const record of this.loaded.values()) {
      if (record.tier === '2k') textures[record.key] = record.texture;
    }
    if (tier === '8k' && this.highQualityAllowed) {
      for (const record of this.loaded.values()) {
        if (record.tier === '8k') textures[record.key] = record.texture;
      }
    }
    return textures;
  }

  handleMemoryWarning(): Partial<Record<AssetKey, any>> {
    this.highQualityAllowed = false;
    for (const [id, record] of this.loaded) {
      if (record.tier !== '8k') continue;
      record.texture.dispose?.();
      this.loaded.delete(id);
    }
    return this.getLoadedTextures('2k');
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const record of this.loaded.values()) record.texture.dispose?.();
    this.loaded.clear();
  }

  private failed(
    entry: AssetManifestEntry,
    url: string,
    attempts: number,
    totalStarted: number,
    error: unknown,
    timings: Partial<AssetLoadResult['timings']> = {},
  ): AssetLoadResult {
    return {
      id: entry.id,
      key: entry.key,
      tier: entry.tier,
      status: 'fail',
      attempts,
      url,
      timings: { ...timings, totalMs: this.now() - totalStarted },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function uploadedFileBytes(fileSystem: any, path: string): number | undefined {
  try {
    const stat = fileSystem.statSync(path);
    const size = stat?.size ?? stat?.stats?.size;
    return typeof size === 'number' && Number.isFinite(size) ? size : undefined;
  } catch {
    return undefined;
  }
}

async function uploadTexture(session: RuntimeSession, texture: any): Promise<void> {
  const renderer = session.renderer as any;
  if (typeof renderer.initTexture === 'function') {
    renderer.initTexture(texture);
  } else {
    const THREE = session.THREE;
    const previousTarget = renderer.getRenderTarget?.() ?? null;
    const previousAutoClear = renderer.autoClear;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    const quad = new THREE.Mesh(geometry, material);
    const target = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false, stencilBuffer: false });
    scene.add(quad);
    try {
      renderer.setRenderTarget(target);
      renderer.autoClear = true;
      renderer.render(scene, camera);
    } finally {
      renderer.setRenderTarget(previousTarget);
      renderer.autoClear = previousAutoClear;
      target.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear?.();
    }
  }
  (session.gl as any).finish?.();
}

/** Creates the production loader without introducing window/document/Image globals. */
export function createWechatTextureLoader(
  session: RuntimeSession,
  resourceBaseUrl: string,
  wxApi: any = wx,
): MiniProgramTextureLoader {
  const fileSystem = wxApi.getFileSystemManager();
  return new MiniProgramTextureLoader({
    THREE: session.THREE,
    resourceBaseUrl,
    createImage: session.createImage,
    download: (url) => new Promise((resolve, reject) => {
      wxApi.downloadFile({
        url,
        success: (response: any) => resolve({
          localPath: response.tempFilePath,
          statusCode: response.statusCode,
          bytes: uploadedFileBytes(fileSystem, response.tempFilePath),
          fromCache: Boolean(response.fromCache),
        }),
        fail: (error: unknown) => reject(error instanceof Error ? error : new Error(String(error))),
      });
    }),
    uploadTexture: (texture) => uploadTexture(session, texture),
    maxAttempts: 2,
    maxTextureSize: session.capability.maxTextureSize,
  });
}
