import { toUTCFromLocal } from '../../../astro/ephemeris';
import { AstroTime, Body, Illumination } from 'astronomy-engine';

export type MoonPhaseInfo = {
  illumination: number; // 0..1
  phaseAngleRad: number; // 太阳-月球相位角（弧度）
};

export function getMoonPhase(localISO: string, latDeg: number, lonDeg: number): MoonPhaseInfo {
  try {
    const utc = toUTCFromLocal(localISO, lonDeg);
    const info = Illumination(Body.Moon, new AstroTime(utc));
    // astronomy-engine 提供的 phase_fraction 为 0..1，phase_angle 为度，我们转弧度
    const illumination = Math.min(1, Math.max(0, info.phase_fraction));
    const phaseAngleRad = (info.phase_angle * Math.PI) / 180;
    return { illumination, phaseAngleRad };
  } catch (err) {
    console.error('[getMoonPhase] failed:', err);
    return { illumination: 0.5, phaseAngleRad: Math.PI / 2 };
  }
}

