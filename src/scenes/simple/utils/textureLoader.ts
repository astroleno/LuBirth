import React from 'react';
import * as THREE from 'three';

// 可选贴图加载器 - 直接移植自原Scene.tsx
export function useOptionalTexture(path?: string, enabled?: boolean) {
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  
  React.useEffect(() => {
    if (!enabled || !path) { 
      setTex(null); 
      return; 
    }
    
    let canceled = false;
    const loader = new THREE.TextureLoader();
    
    loader.load(
      path,
      (t) => {
        if (canceled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => { 
        if (!canceled) setTex(null); 
      }
    );
    
    return () => { 
      canceled = true; 
    };
  }, [path, enabled]);
  
  return tex;
}

// 首选可用贴图加载器 - 直接移植自原Scene.tsx
export function useFirstAvailableTexture(paths: string[], enabled?: boolean) {
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  
  React.useEffect(() => {
    if (!enabled) { 
      setTex(null); 
      return; 
    }
    
    let canceled = false;
    const loader = new THREE.TextureLoader();
    let idx = 0;
    const allPaths: string[] = [];
    
    // 同时尝试相对路径和绝对路径
    for (const p of paths) {
      allPaths.push(p);
      if (p.startsWith('/')) allPaths.push(p.slice(1));
    }
    
    const tryNext = () => {
      if (canceled || idx >= allPaths.length) { 
        setTex(null); 
        return; 
      }
      
      const p = allPaths[idx++];
      if (!p) { 
        tryNext(); 
        return; 
      }
      
      loader.load(
        p,
        (t) => {
          if (canceled) return;
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.ClampToEdgeWrapping;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.anisotropy = 16;
          setTex(t);
        },
        undefined,
        () => { 
          if (!canceled) tryNext(); 
        }
      );
    };
    
    tryNext();
    
    return () => { 
      canceled = true; 
    };
  }, [enabled, JSON.stringify(paths)]);
  
  return tex;
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
    '/textures/8k_earth_daymap.jpg',
    '/textures/2k_earth_daymap.jpg',
    '/textures/earth_day_2k.jpg.jpg'
  ],
  earthNight: [
    '/textures/8k_earth_nightmap.jpg',
    '/textures/2k_earth_nightmap.jpg'
  ],
  earthNormal: [
    '/textures/8k_earth_normal_map.jpg',
    '/textures/8k_earth_normal_map.png',
    '/textures/2k_earth_normal_map.jpg',
    '/textures/2k_earth_normal_map.png'
  ],
  earthSpecular: [
    '/textures/8k_earth_specular_map.jpg',
    '/textures/8k_earth_specular_map.png',
    '/textures/2k_earth_specular_map.jpg',
    '/textures/2k_earth_specular_map.png'
  ],
  earthClouds: [
    '/textures/8k_earth_clouds.jpg',
    '/textures/2k_earth_clouds.jpg'
  ],
  
  // 月球贴图
  moon: [
    '/textures/8k_moon.jpg',
    '/textures/2k_moon.jpg'
  ],
  moonDisplacement: [
    '/textures/2k_moon_displacement.jpg'
  ],
  
  // 星空贴图
  starsMilky: [
    '/textures/8k_stars_milky_way.jpg',
    '/textures/2k_stars_milky_way.jpg'
  ]
};

// 纹理加载状态管理
export function useTextureLoader(composition: any) {
  const useTex = !!composition?.useTextures;
  
  // 地球贴图
  const earthMap = useFirstAvailableTexture(TEXTURE_PATHS.earthDay, useTex);
  const earthNight = useFirstAvailableTexture(TEXTURE_PATHS.earthNight, useTex);
  const earthNormal = useFirstAvailableTexture(TEXTURE_PATHS.earthNormal, useTex);
  const earthSpecular = useFirstAvailableTexture(TEXTURE_PATHS.earthSpecular, useTex);
  const earthClouds = useFirstAvailableTexture(TEXTURE_PATHS.earthClouds, useTex && !!composition?.useClouds);
  
  // 月球贴图
  const moonMap = useFirstAvailableTexture(TEXTURE_PATHS.moon, useTex);
  const moonDisplacementMap = useOptionalTexture(TEXTURE_PATHS.moonDisplacement[0], useTex);
  
  // 星空贴图
  const starsMilky = useFirstAvailableTexture(TEXTURE_PATHS.starsMilky, useTex && !!composition?.useMilkyWay);
  
  return {
    earthMap,
    earthNight,
    earthNormal,
    earthSpecular,
    earthClouds,
    moonMap,
    moonDisplacementMap,
    starsMilky
  };
}
