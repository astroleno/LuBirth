import { EARTH_RADIUS_KM, MOON_RADIUS_KM } from '../../../astro/celestialState';
import type { CelestialState } from '../../../astro/celestialState';
import { applyFrame, scale } from '../../../astro/referenceFrames';
import type { EarthSceneFrame, Vec3 } from '../../../astro/referenceFrames';
import type { MoonPlacement } from '../../../history/journeyStore';

export function moonScenePlacement(state: CelestialState, frame: EarthSceneFrame, mode: MoonPlacement,
  earthRadius: number, portrait: { position: Vec3; radius: number }) {
  if (!(earthRadius > 0) || !Number.isFinite(earthRadius)) throw new Error('地球显示尺寸无效。');
  const scalePerKm = earthRadius / EARTH_RADIUS_KM;
  const physicalPosition = scale(applyFrame(frame.eqjToScene, state.moonEqjKm), scalePerKm);
  return { position: mode === 'physical' ? physicalPosition : portrait.position,
    radius: mode === 'physical' ? MOON_RADIUS_KM * scalePerKm : portrait.radius,
    screenAnchor: mode === 'portrait', physicalPosition, scalePerKm,
    distanceEarthRadii: state.moonDistanceKm / EARTH_RADIUS_KM };
}
