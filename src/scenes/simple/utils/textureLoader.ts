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

// 首选可用贴图加载器 - 改进版，增加错误处理和重试机制
export function useFirstAvailableTexture(paths: string[], enabled?: boolean) {
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (!enabled) { 
      setTex(null); 
      setError(null);
      setLoading(false);
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
    
    setLoading(true);
    setError(null);
    
    const tryNext = () => {
      if (canceled || idx >= allPaths.length) { 
        console.error('[TextureLoader] ❌ 所有路径尝试完毕，未找到可用纹理:', paths);
        setError('所有纹理路径均加载失败');
        setTex(null); 
        setLoading(false);
        return; 
      }
      
      const p = allPaths[idx++];
      if (!p) { 
        tryNext(); 
        return; 
      }
      
      console.log(`[TextureLoader] 尝试加载纹理: ${p}`);
      
      // 添加时间戳防止缓存
      const timestamp = new Date().getTime();
      const urlWithCache = `${p}?t=${timestamp}`;
      
      loader.load(
        urlWithCache,
        (t) => {
          if (canceled) return;
          const img: any = t.image as any;
          const w = img?.width ?? 0;
          const h = img?.height ?? 0;

          // 对超大纹理做一次性缩放，避免超过GPU最大纹理尺寸（常见 8192）
          const MAX_SIZE = 8192; // 保守阈值，兼容多数设备
          if (w > MAX_SIZE || h > MAX_SIZE) {
            try {
              const scale = Math.min(MAX_SIZE / Math.max(1, w), MAX_SIZE / Math.max(1, h));
              const nw = Math.max(1, Math.floor(w * scale));
              const nh = Math.max(1, Math.floor(h * scale));
              const canvas = document.createElement('canvas');
              canvas.width = nw;
              canvas.height = nh;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, nw, nh);
                (t as any).image = canvas;
                (t as any).needsUpdate = true;
                console.warn(`[TextureLoader] 🔧 纹理过大，已自动缩放: ${w}x${h} → ${nw}x${nh} (${p})`);
              }
            } catch (e) {
              console.warn('[TextureLoader] 超大纹理缩放失败，继续使用原图（可能超出GPU限制）:', e);
            }
          }

          console.log(`[TextureLoader] ✅ 纹理加载成功: ${p}`, {
            width: (t.image as any)?.width,
            height: (t.image as any)?.height,
            src: (t.image as any)?.src || 'no-src',
            colorSpace: t.colorSpace,
            wrapS: t.wrapS,
            wrapT: t.wrapT
          });
          
          // 确保纹理配置正确
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.ClampToEdgeWrapping;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.anisotropy = 16;
          t.needsUpdate = true;
          
          setTex(t);
          setError(null);
          setLoading(false);
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`[TextureLoader] 📥 ${p} 加载进度: ${percent.toFixed(1)}%`);
          }
        },
        (error) => {
          console.error(`[TextureLoader] ❌ 纹理加载失败: ${p}`, error);
          if (!canceled) {
            setTimeout(() => tryNext(), 100); // 延迟重试
          }
        }
      );
    };
    
    tryNext();
    
    return () => { 
      canceled = true; 
    };
  }, [enabled, JSON.stringify(paths)]);
  
  // 调试信息
  React.useEffect(() => {
    console.log(`[TextureLoader] 纹理状态:`, {
      enabled,
      loading,
      hasError: !!error,
      hasTexture: !!tex,
      paths,
      error: error || 'none'
    });
  }, [enabled, loading, error, tex, paths]);
  
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
    '/textures/8k_earth_clouds.jpg',
    '/textures/2k_earth_clouds.jpg'
  ],
  
  // 月球贴图
  moon: [
    '/textures/8k_moon.jpg',
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
    '/textures/8k_stars_milky_way.jpg',
    '/textures/2k_stars_milky_way.jpg'
  ]
};

// 纹理加载状态管理
export function useTextureLoader(composition: any) {
  const useTex = !!composition?.useTextures;
  
  console.log('[TextureLoader] 开始加载纹理，配置:', {
    useTextures: useTex,
    useClouds: !!composition?.useClouds,
    useMilkyWay: !!composition?.useMilkyWay
  });
  
  // 地球贴图
  const earthMap = useFirstAvailableTexture(TEXTURE_PATHS.earthDay, useTex);
  const earthNight = useFirstAvailableTexture(TEXTURE_PATHS.earthNight, useTex);
  const earthNormal = useFirstAvailableTexture(TEXTURE_PATHS.earthNormal, useTex);
  const earthSpecular = useFirstAvailableTexture(TEXTURE_PATHS.earthSpecular, useTex);
  const earthDisplacement = useFirstAvailableTexture(TEXTURE_PATHS.earthDisplacement, useTex);
  const earthClouds = useFirstAvailableTexture(TEXTURE_PATHS.earthClouds, useTex && !!composition?.useClouds);
  
  // 月球贴图
  const moonMap = useFirstAvailableTexture(TEXTURE_PATHS.moon, useTex);
  const moonNormalMap = useFirstAvailableTexture(TEXTURE_PATHS.moonNormal, useTex);
  const moonDisplacementMap = useFirstAvailableTexture(TEXTURE_PATHS.moonDisplacement, useTex);
  
  // 星空贴图
  const starsMilky = useFirstAvailableTexture(TEXTURE_PATHS.starsMilky, useTex && !!composition?.useMilkyWay);
  
  // 监控纹理加载状态
  React.useEffect(() => {
    console.log('[TextureLoader] 纹理加载状态:', {
      earthMap: earthMap ? '✅' : '❌',
      earthNight: earthNight ? '✅' : '❌',
      earthNormal: earthNormal ? '✅' : '❌',
      earthSpecular: earthSpecular ? '✅' : '❌',
      earthDisplacement: earthDisplacement ? '✅' : '❌',
      earthClouds: earthClouds ? '✅' : '❌',
      moonMap: moonMap ? '✅' : '❌',
      moonNormalMap: moonNormalMap ? '✅' : '❌',
      moonDisplacementMap: moonDisplacementMap ? '✅' : '❌',
      starsMilky: starsMilky ? '✅' : '❌'
    });
  }, [earthMap, earthNight, earthNormal, earthSpecular, earthClouds, moonMap, moonNormalMap, moonDisplacementMap, starsMilky]);
  
  return {
    earthMap,
    earthNight,
    earthNormal,
    earthSpecular,
    earthDisplacement,
    earthClouds,
    moonMap,
    moonNormalMap,
    moonDisplacementMap,
    starsMilky
  };
}
