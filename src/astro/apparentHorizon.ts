import { Refraction } from 'astronomy-engine';
import type { ObservedBody } from './celestialState';
import { DEG } from './referenceFrames';
import type { Vec3 } from './referenceFrames';

const HORIZON_REFRACTION_DEG = 34 / 60;
const referenceRefraction = Refraction('normal', -HORIZON_REFRACTION_DEG);

export type DiskVisibility = 'below' | 'partial' | 'above';

/** Standard sea-level flat horizon. Shift the rigid disk using its upper limb,
 * so the drawn limb and the USNO rise/set convention cross together. */
export function apparentHorizonDisk(body: ObservedBody) {
  const upperGeometric = body.altitudeDeg + body.angularRadiusDeg;
  const fadeBelowHorizon = Math.max(0, Math.min(1, upperGeometric + 2));
  const correctionDeg = Math.max(0, Refraction('normal', Math.min(upperGeometric, 90)))
    * HORIZON_REFRACTION_DEG / referenceRefraction * fadeBelowHorizon;
  const altitudeDeg = body.altitudeDeg + correctionDeg;
  const upperLimbDeg = altitudeDeg + body.angularRadiusDeg;
  const lowerLimbDeg = altitudeDeg - body.angularRadiusDeg;
  const visibility: DiskVisibility = upperLimbDeg <= 0 ? 'below' : lowerLimbDeg < 0 ? 'partial' : 'above';
  const azimuth = (body.azimuthDeg ?? 0) * DEG;
  const altitude = altitudeDeg * DEG;
  const direction: Vec3 = correctionDeg === 0 ? body.direction : [
    Math.sin(azimuth) * Math.cos(altitude), Math.sin(altitude), -Math.cos(azimuth) * Math.cos(altitude),
  ];
  return { direction, altitudeDeg, upperLimbDeg, lowerLimbDeg, visibility };
}
