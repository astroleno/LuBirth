import { EARTH_RADIUS_KM, MOON_RADIUS_KM, SUN_RADIUS_KM } from './celestialState';
import type { CelestialState } from './celestialState';
import { applyFrame, dot, scale, subtract, unit } from './referenceFrames';
import type { Frame3, Vec3 } from './referenceFrames';

// Effective Earth radius for eclipse contact timing. The extra height models
// atmospheric extinction. The shader's residual copper tint is illustrative.
const SHADOW_EARTH_RADIUS_KM = EARTH_RADIUS_KM + 80;

export type LunarShadow = {
  kind: 'penumbral' | 'partial' | 'total';
  axis: Vec3;
  offset: Vec3;
  umbra: number;
  penumbra: number;
  umbraSlope: number;
  penumbraSlope: number;
};

/** Finite solar disk casting two cones. Lengths are in lunar radii. */
export function lunarShadow(state: Pick<CelestialState, 'sunEqjKm' | 'moonEqjKm' | 'sunDistanceKm'>): LunarShadow | null {
  const axis = unit(scale(state.sunEqjKm, -1));
  const axialDistance = dot(state.moonEqjKm, axis);
  if (axialDistance <= 0) return null;
  const offset = scale(subtract(state.moonEqjKm, scale(axis, axialDistance)), 1 / MOON_RADIUS_KM);
  const separation = Math.hypot(...offset);
  const umbraSlope = (SHADOW_EARTH_RADIUS_KM - SUN_RADIUS_KM) / state.sunDistanceKm;
  const penumbraSlope = (SHADOW_EARTH_RADIUS_KM + SUN_RADIUS_KM) / state.sunDistanceKm;
  const umbra = (SHADOW_EARTH_RADIUS_KM + axialDistance * umbraSlope) / MOON_RADIUS_KM;
  const penumbra = (SHADOW_EARTH_RADIUS_KM + axialDistance * penumbraSlope) / MOON_RADIUS_KM;
  if (separation >= penumbra + 1) return null;
  const kind = separation + 1 <= umbra ? 'total' : separation < umbra + 1 ? 'partial' : 'penumbral';
  return { kind, axis, offset, umbra, penumbra, umbraSlope, penumbraSlope };
}

export const LUNAR_ECLIPSE_LABELS = { penumbral: '半影月食', partial: '月偏食', total: '月全食' } as const;

export function projectLunarShadow(shadow: LunarShadow | null, frame: Frame3): LunarShadow | null {
  return shadow && { ...shadow, axis: applyFrame(frame, shadow.axis), offset: applyFrame(frame, shadow.offset) };
}
