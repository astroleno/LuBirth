import { Body, RotationAxis } from 'astronomy-engine';
import type { AstroTime } from 'astronomy-engine';
import { composeFrames, cross, DEG, scale, unit } from './referenceFrames';
import type { Frame3, Vec3 } from './referenceFrames';

/** Lunar prime meridian, lunar east and lunar north in J2000 equatorial coordinates. */
export function lunarBodyToEqj(time: AstroTime): Frame3 {
  const { north, spin } = RotationAxis(Body.Moon, time);
  const pole: Vec3 = [north.x, north.y, north.z];
  const node = unit(cross([0, 0, 1], pole));
  const tangent = cross(pole, node);
  const w = (spin % 360) * DEG;
  const c = Math.cos(w), s = Math.sin(w);
  const prime: Vec3 = [c * node[0] + s * tangent[0], c * node[1] + s * tangent[1], c * node[2] + s * tangent[2]];
  return [prime, cross(pole, prime), pole];
}

/** Both lunar meshes use +X at 0° longitude, +Y at the north pole, and −Z east. */
export function projectLunarSurface([prime, east, north]: Frame3, eqjToView: Frame3): Frame3 {
  return composeFrames(eqjToView, [prime, north, scale(east, -1)]);
}
