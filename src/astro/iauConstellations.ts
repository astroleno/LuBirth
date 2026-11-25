import { AstroTime, Constellation, Rotation_EQJ_EQD } from 'astronomy-engine';
import { astronomyFrame } from './celestialState';
import { applyFrame, DEG, inverseFrame } from './referenceFrames';
import type { Frame3, Vec3 } from './referenceFrames';

// Match the B1875 conversion used by Astronomy Engine's Roman (1987) lookup.
const B1875_UT_DAYS = -45655.74141261017;
let b1875ToEqj: Frame3 | undefined;

export function iauConstellation(directionEqj: Vec3) {
  const [x, y, z] = directionEqj;
  return Constellation(Math.atan2(y, x) / DEG / 15, Math.atan2(z, Math.hypot(x, y)) / DEG);
}

export function b1875BoundaryDirection(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  b1875ToEqj ??= inverseFrame(astronomyFrame(Rotation_EQJ_EQD(new AstroTime(B1875_UT_DAYS))));
  return applyFrame(b1875ToEqj, [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)]);
}
