import React from 'react';
import * as THREE from 'three';
import { assetUrl } from '../../../utils/assetUrl';

type TextureOptions = {
  maxSize?: number;
  anisotropy?: number;
  staged?: boolean;
  delayMs?: number;
  priority?: number;
  upgradePriority?: number;
  exclusive?: boolean;
};

type TextureJob = {
  priority: number;
  order: number;
  exclusive: boolean;
  canceled: boolean;
  run: (finish: () => void) => void;
};

// Image decode callbacks and the following GPU upload both contend with the
// render thread. Keep only two requests in flight and let critical base maps
// finish before decorative/detail resources start.
const textureQueue: TextureJob[] = [];
let activeTextureJobs = 0;
let exclusiveTextureJob = false;
let textureJobOrder = 0;
const MAX_TEXTURE_JOBS = 2;

function pumpTextureQueue() {
  textureQueue.sort((a, b) => a.priority - b.priority || a.order - b.order);
  while (!exclusiveTextureJob && activeTextureJobs < MAX_TEXTURE_JOBS && textureQueue.length) {
    const job = textureQueue[0];
    if (job.exclusive && activeTextureJobs > 0) return;
    textureQueue.shift();
    if (job.canceled) continue;
    activeTextureJobs++;
    exclusiveTextureJob = job.exclusive;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      activeTextureJobs--;
      if (job.exclusive) exclusiveTextureJob = false;
      queueMicrotask(pumpTextureQueue);
    };
    try { job.run(finish); } catch { finish(); }
  }
}

function enqueueTextureJob(priority: number, run: TextureJob['run'], exclusive = false) {
  const job: TextureJob = { priority, order: textureJobOrder++, exclusive, canceled: false, run };
  textureQueue.push(job);
  queueMicrotask(pumpTextureQueue);
  return () => { job.canceled = true; };
}

function textureTier(path: string) {
  if (path.includes('8k')) return 8192;
  if (path.includes('4k')) return 4096;
  if (path.includes('2k') || path.includes('2048')) return 2048;
  if (path.includes('1k') || path.includes('1024')) return 1024;
  return 2048;
}

// Each hook owns its textures. Requests finishing after unmount are disposed too.
function useManagedTexture(paths: string[], enabled = true, options: TextureOptions = {}) {
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const currentTexture = React.useRef<THREE.Texture | null>(null);
  const {
    maxSize = 8192,
    anisotropy = 16,
    staged = false,
    delayMs = 5000,
    priority = 2,
    upgradePriority = priority + 10,
    exclusive = false,
  } = options;
  React.useEffect(() => {
    setTexture(null);
    if (!enabled) return;
    let canceled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const owned = new Set<THREE.Texture>();
    const retired = new Set<THREE.Texture>();
    const retireFrames = new Set<number>();
    const queued = new Set<() => void>();
    const loader = new THREE.TextureLoader();
    const sizeMatchedCandidates = paths.filter(path => textureTier(path) <= maxSize);
    const candidates = sizeMatchedCandidates.length ? sizeMatchedCandidates : paths;
    const availableTiers = candidates.map(textureTier);
    const starterTier = Math.min(...availableTiers);
    const targetTier = Math.max(...availableTiers);
    const starter = candidates.filter(path => textureTier(path) === starterTier);
    const upgrades = candidates
      .filter(path => textureTier(path) > starterTier)
      .sort((a, b) => textureTier(b) - textureTier(a));
    const configure = (t: THREE.Texture) => {
      const img = t.image;
      if (Math.max(img.width, img.height) > maxSize) {
        const scale = maxSize / Math.max(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(img.width * scale));
        canvas.height = Math.max(1, Math.floor(img.height * scale));
        const context = canvas.getContext('2d');
        if (context) { context.drawImage(img, 0, 0, canvas.width, canvas.height); t.image = canvas; }
      }
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = anisotropy;
      t.needsUpdate = true;
    };
    const load = (list: string[], index = 0, onReady?: () => void, requestPriority = priority, exclusive = false) => {
      if (canceled) return;
      if (index >= list.length) {
        window.dispatchEvent(new CustomEvent('lubirth:asset-error', { detail: { path: paths[0] } }));
        return;
      }
      let cancel = () => {};
      cancel = enqueueTextureJob(requestPriority, finish => {
        queued.delete(cancel);
        if (canceled) { finish(); return; }
        try {
          loader.load(assetUrl(list[index]), t => {
            finish();
            if (canceled) { t.dispose(); return; }
            configure(t);
            owned.add(t);
            const previous = currentTexture.current;
            currentTexture.current = t;
            setTexture(t);
            if (previous && previous !== t) {
              owned.delete(previous);
              retired.add(previous);
              const frame = requestAnimationFrame(() => {
                retireFrames.delete(frame);
                retired.delete(previous);
                previous.dispose();
              });
              retireFrames.add(frame);
            }
            onReady?.();
          }, undefined, () => {
            finish();
            load(list, index + 1, onReady, requestPriority, exclusive);
          });
        } catch {
          finish();
          load(list, index + 1, onReady, requestPriority, exclusive);
        }
      }, exclusive);
      queued.add(cancel);
    };
    if (staged && starter.length && starterTier < targetTier) {
      load(starter, 0, () => { timer = setTimeout(() => load(upgrades, 0, undefined, upgradePriority, true), delayMs); });
    } else load(candidates, 0, undefined, priority, exclusive);
    return () => {
      canceled = true;
      clearTimeout(timer);
      queued.forEach(cancel => cancel());
      retireFrames.forEach(frame => cancelAnimationFrame(frame));
      owned.forEach(t => t.dispose());
      retired.forEach(t => t.dispose());
      currentTexture.current = null;
    };
  }, [paths, enabled, maxSize, staged, delayMs, priority, upgradePriority, exclusive]);
  React.useEffect(() => {
    if (!texture || texture.anisotropy === anisotropy) return;
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;
  }, [texture, anisotropy]);
  // Detach consumers in the same commit before effect cleanup disposes GPU resources.
  return enabled ? texture : null;
}

export function useOptionalTexture(path?: string, enabled?: boolean) {
  const paths = React.useMemo(() => path ? [path] : [], [path]);
  return useManagedTexture(paths, !!enabled);
}

export function useFirstAvailableTexture(paths: string[], enabled?: boolean, options?: TextureOptions) {
  return useManagedTexture(paths, !!enabled, options);
}

export function useStagedTextureFromPaths(paths: string[], enabled?: boolean, options?: TextureOptions) {
  return useManagedTexture(paths, !!enabled, { ...options, staged: true });
}

// 色温转换工具函数 - 移植自原Scene.tsx
export function kelvinToRGB(k: number): THREE.Color {
  const t = k / 100;
  let r: number, g: number, b: number;
  
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  
  const clamp = (x: number) => Math.max(0, Math.min(255, x));
  return new THREE.Color(clamp(r) / 255, clamp(g) / 255, clamp(b) / 255);
}

// 纹理路径常量
export const TEXTURE_PATHS = {
  // 地球贴图
  earthDay: [
    '/textures/1k_earth_daymap.webp',
    '/textures/8k_earth_daymap.webp',
    '/textures/2k_earth_daymap.webp',
    '/textures/2k_earth_daymap.jpg'
  ],
  earthNight: [
    '/textures/8k_earth_nightmap.webp',
    '/textures/4k_earth_nightmap.webp',
    '/textures/2k_earth_nightmap.webp',
    '/textures/2k_earth_nightmap.jpg'
  ],
  earthNormal: [
    // 当前资源仅有 2k 正常贴图
    '/textures/2k_earth_normal_map.jpg'
  ],
  earthSpecular: [
    '/textures/8k_earth_specular_map.webp',
    '/textures/2k_earth_specular_map.webp',
    '/textures/2k_earth_specular_map.jpg'
  ],
  earthDisplacement: [
    // 优先使用JPG格式的高度贴图
    '/textures/8k_earth_displacement_map.jpg',
    '/textures/8k_earth_displacement.jpg',
    '/textures/8k_earth_displacement_map.png',
    '/textures/2k_earth_displacement_map.jpg',
    '/textures/2k_earth_displacement.jpg',
    '/textures/2k_earth_displacement_map.png'
  ],
  earthClouds: [
    '/textures/8k_earth_clouds.webp',
    '/textures/2k_earth_clouds.webp',
    '/textures/2k_earth_clouds.jpg'
  ],
  
  // 月球贴图
  moon: [
    '/textures/1k_moon.webp',
    '/textures/2k_moon.webp',
    '/textures/2k_moon.jpg'
  ],
  moonNormal: [
    '/textures/2k_moon_normal.jpg'
  ],
  moonDisplacement: [
    '/textures/2k_moon_displacement.webp',
    '/textures/2k_moon_displacement.jpg',
    '/textures/moon_height_2k.jpg',
    '/textures/moon_height_2048x1024.jpg',
    '/textures/moon_height.jpg'
  ],
  
  // 星空贴图
  starsMilky: [
    '/textures/8k_stars_milky_way.webp',
    '/textures/2k_stars_milky_way.jpg'
  ]
};

// A dedicated 4K derivative avoids decoding the 8K source on the render thread.
const CLOSEUP_NIGHT_PATHS = TEXTURE_PATHS.earthNight.filter(path => textureTier(path) > 2048);

// General maps follow the profile. The approved close-up night upgrade is separate.
export function useTextureLoader(config: {
  useTextures: boolean; useClouds?: boolean; useMilkyWay?: boolean; useMoon?: boolean;
  loadMoonFallbackDetails?: boolean; stagedLowFirst?: boolean; maxSize?: number; anisotropy?: number;
  closeupNightMaxSize?: number;
}) {
  const enabled = !!config.useTextures;
  const options = { maxSize: config.maxSize, anisotropy: config.anisotropy, staged: config.stagedLowFirst };
  const baseOptions = { ...options, delayMs: 5000 };
  const earthMap = useManagedTexture(TEXTURE_PATHS.earthDay, enabled, { ...baseOptions, priority: 0 });
  const moonEnabled = enabled && config.useMoon !== false;
  const moonMap = useManagedTexture(TEXTURE_PATHS.moon, moonEnabled, { ...baseOptions, priority: 0 });
  const baseReady = !!earthMap && (!moonEnabled || !!moonMap);
  const closeupNightEnabled = enabled && (config.closeupNightMaxSize ?? 0) > (config.maxSize ?? 8192);
  const closeupNight = useManagedTexture(CLOSEUP_NIGHT_PATHS, closeupNightEnabled, {
    maxSize: config.closeupNightMaxSize, anisotropy: config.anisotropy, priority: 12, exclusive: true,
  });
  // Keep the compact map visible until the upgrade succeeds, then release it.
  const baseNight = useManagedTexture(TEXTURE_PATHS.earthNight, enabled && !closeupNight,
    { ...options, priority: 1 });
  const earthNight = closeupNight ?? baseNight;
  // Earth derives its surface normals from DEM; the normal-map shader branch is disabled.
  const earthNormal = null;
  const earthSpecular = useManagedTexture(TEXTURE_PATHS.earthSpecular, enabled && baseReady, { ...options, priority: 2 });
  const earthDisplacement = useManagedTexture(TEXTURE_PATHS.earthDisplacement, enabled && baseReady, { ...options, priority: 1 });
  const earthClouds = useManagedTexture(TEXTURE_PATHS.earthClouds, enabled && baseReady && !!config.useClouds, { ...options, priority: 2 });
  const moonDetailsEnabled = moonEnabled && baseReady && !!config.loadMoonFallbackDetails;
  const moonNormalMap = useManagedTexture(TEXTURE_PATHS.moonNormal, moonDetailsEnabled, { ...options, priority: 3 });
  const moonDisplacementMap = useManagedTexture(TEXTURE_PATHS.moonDisplacement, moonDetailsEnabled, { ...options, priority: 2 });
  const starsMilky = useManagedTexture(TEXTURE_PATHS.starsMilky, enabled && !!config.useMilkyWay, { ...options, priority: 3 });
  React.useEffect(() => {
    const progress = { loaded: Number(!!earthMap) + Number(moonEnabled && !!moonMap), total: moonEnabled ? 2 : 1 };
    (window as any).__lubirthAssetProgress = progress;
    (window as any).__lubirthAssetsReady = baseReady || !enabled;
    window.dispatchEvent(new CustomEvent('lubirth:asset-progress', { detail: progress }));
    if (baseReady || !enabled) {
      (window as any).__lubirthAssetsReady = true;
      window.dispatchEvent(new CustomEvent('lubirth:assets-ready'));
    }
  }, [earthMap, moonMap, moonEnabled, baseReady, enabled]);
  return { earthMap, earthNight, earthNormal, earthSpecular, earthDisplacement, earthClouds,
    moonMap, moonNormalMap, moonDisplacementMap, starsMilky };
}
