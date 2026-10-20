import { useEffect, useState } from 'react';

export type Quality = 'balanced' | 'battery' | 'detail';
export type RenderProfile = ReturnType<typeof createRenderProfile>;

export function createRenderProfile(mobile: boolean, quality: Quality = 'balanced') {
  const battery = quality === 'battery';
  const detail = quality === 'detail';
  return {
    mobile,
    quality,
    dpr: mobile ? (battery ? 1 : detail ? 1.75 : 1.5) : (battery ? 1 : 2),
    fps: battery ? 24 : detail ? 60 : 30,
    // Start and remain on the compact texture set unless the user explicitly
    // asks for detail. Automatic 8K swaps caused multi-second decode/upload
    // stalls after the loading overlay had already disappeared.
    maxTextureSize: detail && !mobile ? 8192 : 2048,
    anisotropy: mobile || battery ? 4 : 16,
    earthSegments: battery ? 64 : mobile ? 96 : 144,
    earthSegmentsHigh: battery ? 96 : mobile ? (detail ? 256 : 192) : detail ? 512 : 192,
    cloudLayers: battery ? 2 : mobile ? (detail ? 4 : 3) : 12,
    terrainShadows: !mobile && !battery,
    antialias: !battery,
  };
}

export function useMobileLayout() {
  const query = '(max-width: 767px), (max-height: 600px) and (max-width: 1024px)';
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile;
}

export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}
