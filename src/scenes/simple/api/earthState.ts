import { computeEphemeris, toUTCFromLocal } from '../../../astro/ephemeris';

export type EarthState = {
  sunDirEQD: { x: number; y: number; z: number }; // 世界系（EQD）太阳方向
  moonDirEQD: { x: number; y: number; z: number };
  illumination: number; // 月面明暗比例
};

// 根据本地时间字符串与经纬度，计算地球相关的世界系状态
// localISO 例如 '2000-01-01T12:00'
export function getEarthState(localISO: string, latDeg: number, lonDeg: number): EarthState {
  try {
    const utc = toUTCFromLocal(localISO, lonDeg);
    const eph = computeEphemeris(utc, latDeg, lonDeg);
    return {
      sunDirEQD: eph.sunEQD,
      moonDirEQD: eph.moonEQD,
      illumination: eph.illumination
    };
  } catch (err) {
    console.error('[getEarthState] failed:', err);
    // 兜底返回
    return {
      sunDirEQD: { x: 1, y: 0, z: 0 },
      moonDirEQD: { x: -1, y: 0, z: 0 },
      illumination: 0.5
    };
  }
}


