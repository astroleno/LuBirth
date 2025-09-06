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
    
    // 修复：astronomy-engine的phase_angle范围是0-360度，但需要确保完整周期
    let phaseAngleDeg = info.phase_angle;
    
    // 确保phase_angle在0-360度范围内
    if (phaseAngleDeg < 0) phaseAngleDeg += 360;
    if (phaseAngleDeg >= 360) phaseAngleDeg -= 360;
    
    // 转换为弧度
    const phaseAngleRad = (phaseAngleDeg * Math.PI) / 180;
    
    return { illumination, phaseAngleRad };
  } catch (err) {
    console.error('[getMoonPhase] failed:', err);
    return { illumination: 0.5, phaseAngleRad: Math.PI / 2 };
  }
}

