import * as THREE from 'three';

type Entry = { texture: THREE.Texture; refs: number; bytes: number; used: number; ready: boolean; listeners: Set<(texture: THREE.Texture | null) => void>; failed: boolean };
type TextureSource = { url: string; size: number[]; maxEdge: number };
export type ArtworkTexture = { url: string; texture: THREE.Texture };
const cache = new Map<string, Entry>();
const LIMIT_BYTES = 64 * 1024 * 1024, LIMIT_ENTRIES = 12;
const mipmapBytes = (width: number, height: number) => Math.ceil(width * height * 4 * 4 / 3);
function dispose(entry: Entry) {
  if (typeof entry.texture.image?.close === 'function') entry.texture.image.close();
  entry.texture.dispose();
}
function prune() {
  const candidates = [...cache].filter(([, value]) => !value.refs).sort((a, b) => a[1].used - b[1].used);
  let bytes = [...cache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
  for (const [url, entry] of candidates) {
    if (bytes <= LIMIT_BYTES && cache.size <= LIMIT_ENTRIES) break;
    dispose(entry); cache.delete(url); bytes -= entry.bytes;
  }
}
export function artCacheSnapshot() {
  return { entries: cache.size, active: [...cache.values()].filter(e => e.refs).length,
    bytes: [...cache.values()].reduce((sum, e) => sum + e.bytes, 0), limitBytes: LIMIT_BYTES,
    failed: [...cache.values()].filter(e => e.failed).length };
}
function evictFailed(url: string, entry: Entry) {
  if (cache.get(url) !== entry || !entry.failed || entry.refs) return;
  dispose(entry); cache.delete(url);
}
function acquireArtTexture({ url, size, maxEdge }: TextureSource, listener: (texture: THREE.Texture | null) => void) {
  let entry = cache.get(url);
  if (!entry) {
    const canResize = typeof createImageBitmap === 'function';
    const scale = canResize ? Math.min(1, maxEdge / Math.max(...size)) : 1;
    const bytes = mipmapBytes(Math.round(size[0] * scale), Math.round(size[1] * scale));
    const value: Entry = { texture: new THREE.Texture(), refs: 0, bytes, used: performance.now(), ready: false, listeners: new Set(), failed: false };
    value.texture = new THREE.TextureLoader().load(url, async texture => {
      if (cache.get(url) !== value) { texture.dispose(); return; }
      // Decode off the drawing path; cap GPU upload size without altering source artwork.
      try {
        await texture.image.decode?.();
        const original = texture.image;
        if (cache.get(url) !== value) return;
        if (canResize && Math.max(original.width, original.height) > maxEdge) {
          const ratio = maxEdge / Math.max(original.width, original.height);
          const bitmap = await createImageBitmap(original, { resizeWidth: Math.round(original.width * ratio), resizeHeight: Math.round(original.height * ratio),
            resizeQuality: 'high', imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
          if (cache.get(url) !== value) { bitmap.close(); return; }
          texture.image = bitmap; texture.flipY = false;
        }
      } catch { /* Keep decoded source on browsers without resize/decode support. */ }
      if (cache.get(url) !== value) return;
      value.bytes = mipmapBytes(texture.image.width, texture.image.height);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace; value.ready = true;
      value.listeners.forEach(fn => fn(texture)); prune();
    }, undefined, () => {
      if (cache.get(url) !== value) return;
      value.failed = true; value.bytes = 0;
      value.listeners.forEach(fn => fn(null)); evictFailed(url, value);
    });
    entry = value; cache.set(url, entry);
  }
  entry.refs++; entry.used = performance.now(); entry.listeners.add(listener);
  if (entry.ready) listener(entry.texture);
  else if (entry.failed) listener(null);
  prune();
  return () => {
    entry.refs--; entry.listeners.delete(listener); entry.used = performance.now();
    evictFailed(url, entry); prune();
  };
}

export function createArtworkTextureRequest(full: TextureSource, mobile: TextureSource | undefined, listener: (artwork: ArtworkTexture) => void) {
  let releaseFull: (() => void) | undefined;
  let releaseMobile: (() => void) | undefined;
  let fullReady = false;
  const requestFull = () => {
    releaseFull ??= acquireArtTexture(full, texture => {
      if (texture) { fullReady = true; listener({ url: full.url, texture }); }
    });
  };
  const dropMobile = () => { releaseMobile?.(); releaseMobile = undefined; };
  return {
    update(preferMobile: boolean) {
      const cachedFull = cache.get(full.url);
      if (!preferMobile || !mobile || (cachedFull && !cachedFull.failed)) {
        requestFull();
      } else {
        releaseMobile ??= acquireArtTexture(mobile, texture => {
          if (!texture) requestFull();
          else if (!fullReady) listener({ url: mobile.url, texture });
        });
      }
    },
    dropMobile,
    dispose() { dropMobile(); releaseFull?.(); },
  };
}

export function disposeArtCache() { for (const entry of cache.values()) dispose(entry); cache.clear(); }
if (import.meta.hot) import.meta.hot.dispose(disposeArtCache);
