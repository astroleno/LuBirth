import React from 'react';
import * as THREE from 'three';
import { assetUrl } from '../../../utils/assetUrl';

type TextureOptions = { maxSize?: number; anisotropy?: number; staged?: boolean; delayMs?: number };

// Each hook owns its textures. Requests finishing after unmount are disposed too.
function useManagedTexture(paths: string[], enabled = true, options: TextureOptions = {}) {
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const { maxSize = 8192, anisotropy = 16, staged = false, delayMs = 5000 } = options;
  React.useEffect(() => {
    setTexture(null);
    if (!enabled) return;
    let canceled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const owned = new Set<THREE.Texture>();
    const loader = new THREE.TextureLoader();
    const candidates = maxSize <= 2048 ? paths.filter(p => !p.includes('8k')) : paths;
    const low = candidates.filter(p => !p.includes('8k'));
    const high = candidates.filter(p => p.includes('8k'));
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
    const load = (list: string[], index = 0, onReady?: () => void) => {
      if (canceled || index >= list.length) return;
      loader.load(assetUrl(list[index]), t => {
        if (canceled) { t.dispose(); return; }
        configure(t);
        owned.add(t);
        setTexture(t);
        onReady?.();
      }, undefined, () => load(list, index + 1, onReady));
    };
    if (staged && low.length && high.length) {
      load(low, 0, () => { timer = setTimeout(() => load(high), delayMs); });
    } else load(candidates);
    return () => {
      canceled = true;
      clearTimeout(timer);
      owned.forEach(t => t.dispose());
    };
  }, [paths, enabled, maxSize, anisotropy, staged, delayMs]);
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
    '/textures/8k_earth_daymap.webp',
    '/textures/2k_earth_daymap.jpg'
  ],
  earthNight: [
    '/textures/8k_earth_nightmap.webp',
    '/textures/2k_earth_nightmap.jpg'
  ],
  earthNormal: [
    // 当前资源仅有 2k 正常贴图
    '/textures/2k_earth_normal_map.jpg'
  ],
  earthSpecular: [
    '/textures/8k_earth_specular_map.webp',
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
    '/textures/2k_earth_clouds.jpg'
  ],
  
  // 月球贴图
  moon: [
    '/textures/2k_moon.jpg'
  ],
  moonNormal: [
    '/textures/2k_moon_normal.jpg'
  ],
  moonDisplacement: [
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

// Shared resource policy: mobile never requests the 8K candidates.
export function useTextureLoader(config: {
  useTextures: boolean; useClouds?: boolean; useMilkyWay?: boolean; useMoon?: boolean;
  stagedLowFirst?: boolean; maxSize?: number; anisotropy?: number;
}) {
  const enabled = !!config.useTextures;
  const options = { maxSize: config.maxSize, anisotropy: config.anisotropy, staged: config.stagedLowFirst };
  const earthMap = useManagedTexture(TEXTURE_PATHS.earthDay, enabled, options);
  const earthNight = useManagedTexture(TEXTURE_PATHS.earthNight, enabled, options);
  // Earth derives its surface normals from DEM; the normal-map shader branch is disabled.
  const earthNormal = null;
  const earthSpecular = useManagedTexture(TEXTURE_PATHS.earthSpecular, enabled, options);
  const earthDisplacement = useManagedTexture(TEXTURE_PATHS.earthDisplacement, enabled, options);
  const earthClouds = useManagedTexture(TEXTURE_PATHS.earthClouds, enabled && !!config.useClouds, options);
  const moonEnabled = enabled && config.useMoon !== false;
  const moonMap = useManagedTexture(TEXTURE_PATHS.moon, moonEnabled, options);
  const moonNormalMap = useManagedTexture(TEXTURE_PATHS.moonNormal, moonEnabled, options);
  const moonDisplacementMap = useManagedTexture(TEXTURE_PATHS.moonDisplacement, moonEnabled, options);
  const starsMilky = useManagedTexture(TEXTURE_PATHS.starsMilky, enabled && !!config.useMilkyWay, options);
  React.useEffect(() => {
    if (earthMap && (!moonEnabled || moonMap)) {
      (window as any).__lubirthAssetsReady = true;
      window.dispatchEvent(new CustomEvent('lubirth:assets-ready'));
    }
  }, [earthMap, moonMap, moonEnabled]);
  return { earthMap, earthNight, earthNormal, earthSpecular, earthDisplacement, earthClouds,
    moonMap, moonNormalMap, moonDisplacementMap, starsMilky };
}
