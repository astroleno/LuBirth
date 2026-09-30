import * as THREE from 'three';
import { getMoonPhaseAtTime } from '../api/moonPhase';

/**
 * 月相计算结果接口
 */
export interface MoonPhaseResult {
  sunDirection: THREE.Vector3;    // 太阳方向向量
  moonRotation: number;           // 月球自转角度
  phaseAngle: number;             // 月相角度
  illumination: number;           // 照明比例 (0-1)
  phaseName: string;              // 月相名称
}

/**
 * 月相名称枚举
 */
const MOON_PHASES = [
  { name: '新月', minAngle: 0, maxAngle: 22.5 },
  { name: '蛾眉月', minAngle: 22.5, maxAngle: 67.5 },
  { name: '上弦月', minAngle: 67.5, maxAngle: 112.5 },
  { name: '盈凸月', minAngle: 112.5, maxAngle: 157.5 },
  { name: '满月', minAngle: 157.5, maxAngle: 202.5 },
  { name: '亏凸月', minAngle: 202.5, maxAngle: 247.5 },
  { name: '下弦月', minAngle: 247.5, maxAngle: 292.5 },
  { name: '残月', minAngle: 292.5, maxAngle: 337.5 },
  { name: '新月', minAngle: 337.5, maxAngle: 360 }
];

/**
 * 计算月相信息
 * @param date 日期时间
 * @param observerLat 观察者纬度
 * @param observerLon 观察者经度
 * @returns 月相计算结果
 */
export function calculateMoonPhase(
  date: Date,
  observerLat: number,
  observerLon: number
): MoonPhaseResult {
  const phase = getMoonPhaseAtTime(date);
  return {
    sunDirection: phase.sunDirection,
    moonRotation: calculateMoonRotation(date),
    phaseAngle: phase.cycleAngleDeg,
    illumination: phase.illumination,
    phaseName: getMoonPhaseName(phase.cycleAngleDeg),
  };
}

/**
 * 计算月球自转角度
 */
function calculateMoonRotation(date: Date): number {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const dayOfYear = getDayOfYear(date);
  
  // 月球自转：每天约13.2度（360度/27.3天）
  const dailyRotation = (dayOfYear % 27.3) * 13.2;
  // 加上当天的时间影响：每小时0.55度（13.2度/24小时）
  const hourlyRotation = hours * 0.55 + minutes * 0.0092;
  
  return (dailyRotation + hourlyRotation) * Math.PI / 180;
}

/**
 * 获取一年中的第几天
 */
function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 获取月相名称
 */
function getMoonPhaseName(phaseAngle: number): string {
  const phase = MOON_PHASES.find(p => phaseAngle >= p.minAngle && phaseAngle < p.maxAngle);
  return phase?.name || '未知';
}

/**
 * 格式化月相信息用于显示
 */
export function formatMoonPhaseInfo(result: MoonPhaseResult): string {
  return `${result.phaseName} (${result.phaseAngle.toFixed(1)}°)`;
}

/**
 * 获取月相描述
 */
export function getMoonPhaseDescription(result: MoonPhaseResult): string {
  const descriptions = {
    '新月': '月球位于地球和太阳之间，完全看不到月球',
    '蛾眉月': '月球开始显现，呈现细弯钩状',
    '上弦月': '月球右半边被照亮，呈半圆形',
    '盈凸月': '月球大部分被照亮，向满月过渡',
    '满月': '月球完全被太阳照亮，呈现完整的圆形',
    '亏凸月': '月球开始变暗，从满月向新月过渡',
    '下弦月': '月球左半边被照亮，呈半圆形',
    '残月': '月球即将消失，呈现细弯钩状'
  };
  
  return descriptions[result.phaseName as keyof typeof descriptions] || '';
}
