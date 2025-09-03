import { computeEphemeris, toUTCFromLocal } from '../../../astro/ephemeris';

export type MoonPhaseInfo = {
  illumination: number; // 0..1
  phaseAngleRad: number; // 太阳-月球相位角（弧度）
};

export function getMoonPhase(localISO: string, latDeg: number, lonDeg: number): MoonPhaseInfo {
  try {
    const utc = toUTCFromLocal(localISO, lonDeg);
    const eph = computeEphemeris(utc, latDeg, lonDeg);
    // illumination已在ephemeris中计算，近似足够用于调控
    // 用反推得到相位角（注意数值边界）
    const ill = Math.min(1, Math.max(0, eph.illumination));
    const phaseAngle = Math.acos(Math.min(1, Math.max(-1, 2 * ill - 1)));
    return {
      illumination: ill,
      phaseAngleRad: phaseAngle
    };
  } catch (err) {
    console.error('[getMoonPhase] failed:', err);
    return {
      illumination: 0.5,
      phaseAngleRad: Math.PI / 2
    };
  }
}


