import * as Astronomy from 'astronomy-engine';
import { applyFrame, composeFrames, cross, DEG, dot, HORIZON_TO_SKY, horizonCoordinates,
  inverseFrame, scale, subtract, unit } from './referenceFrames';
import type { Frame3, Vec3 } from './referenceFrames';

export const EARTH_RADIUS_KM = 6378.137;
export const MOON_RADIUS_KM = 1737.4;
export const SUN_RADIUS_KM = 695700;
export const CELESTIAL_MODEL = 'astronomy-engine/geo-lighttime/no-aberration/no-refraction/v1';
export type ObserverLocation = { latitude: number; longitude: number };

export function astronomyFrame(rotation: Astronomy.RotationMatrix): Frame3 {
  return rotation.rot.map(column => [...column]) as Frame3;
}
function vectorKm(vector: Astronomy.Vector): Vec3 {
  return [vector.x * Astronomy.KM_PER_AU, vector.y * Astronomy.KM_PER_AU, vector.z * Astronomy.KM_PER_AU];
}
export function validateCelestialDate(value: Date | string) {
  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/i.exec(value);
    if (!match) throw new Error('天文计算需要明确且有效的 UTC 时刻。');
    const [year, month, day, hour, minute, second] = match.slice(1, 7).map(part => Number(part || 0));
    const civil = new Date(0);
    civil.setUTCFullYear(year, month - 1, day);
    const zone = match[7], zoneHours = zone.toUpperCase() === 'Z' ? 0 : Number(zone.slice(1, 3));
    const zoneMinutes = zone.toUpperCase() === 'Z' ? 0 : Number(zone.slice(4));
    if (civil.getUTCFullYear() !== year || civil.getUTCMonth() !== month - 1 || civil.getUTCDate() !== day
      || hour > 23 || minute > 59 || second > 59 || zoneHours > 14 || zoneMinutes > 59
      || (zoneHours === 14 && zoneMinutes !== 0)) throw new Error('天文时刻的日期、钟点或时区无效。');
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1 || date.getUTCFullYear() > 2999)
    throw new Error('天文时刻超出 0001–2999 年范围。');
  return date;
}
export function validateLocation(location: ObserverLocation) {
  if (!Number.isFinite(location.latitude) || Math.abs(location.latitude) > 90
    || !Number.isFinite(location.longitude) || Math.abs(location.longitude) > 180) throw new Error('经纬度超出有效范围。');
}
export type CelestialState = ReturnType<typeof createCelestialState>;
export function createCelestialState(value: Date | string) {
  const date = validateCelestialDate(value), time = new Astronomy.AstroTime(date);
  const eqjToEqd = astronomyFrame(Astronomy.Rotation_EQJ_EQD(time));
  const sidereal = Astronomy.SiderealTime(time) * 15 * DEG;
  const c = Math.cos(sidereal), s = Math.sin(sidereal);
  const ecefToEqd: Frame3 = [[c, s, 0], [-s, c, 0], [0, 0, 1]];
  const ecefToEqj = composeFrames(inverseFrame(eqjToEqd), ecefToEqd);
  const sunEqjKm = vectorKm(Astronomy.GeoVector(Astronomy.Body.Sun, time, false));
  const moonEqjKm = vectorKm(Astronomy.GeoVector(Astronomy.Body.Moon, time, false));
  const moonToSunEqj = unit(subtract(sunEqjKm, moonEqjKm));
  const phaseCosine = dot(moonToSunEqj, unit(scale(moonEqjKm, -1)));
  return { key: `${date.toISOString()}/${CELESTIAL_MODEL}`, utc: date.toISOString(), date, time,
    model: CELESTIAL_MODEL, years: time.tt / 365.25, eqjToEqd, ecefToEqj,
    sunEqjKm, moonEqjKm, moonToSunEqj,
    sunDistanceKm: Math.hypot(...sunEqjKm), moonDistanceKm: Math.hypot(...moonEqjKm),
    phaseFraction: Math.max(0, Math.min(1, (1 + phaseCosine) / 2)), cycleAngleDeg: Astronomy.MoonPhase(time) };
}
export type ObservedBody = {
  directionEqj: Vec3; direction: Vec3; distanceKm: number; angularRadiusDeg: number;
  altitudeDeg: number; azimuthDeg: number | null; aboveHorizon: boolean;
};
export type ObserverState = ReturnType<typeof createObserverState>;
export function createObserverState(state: CelestialState, location: ObserverLocation) {
  validateLocation(location);
  const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);
  const positionEqjKm = vectorKm(Astronomy.ObserverVector(state.time, observer, false));
  const eqjToSky = composeFrames(HORIZON_TO_SKY, astronomyFrame(Astronomy.Rotation_EQJ_HOR(state.time, observer)));
  const body = (position: Vec3, radius: number): ObservedBody => {
    const vector = subtract(position, positionEqjKm), distanceKm = Math.hypot(...vector);
    const directionEqj = unit(vector), direction = unit(applyFrame(eqjToSky, directionEqj));
    const angles = horizonCoordinates(direction);
    return { directionEqj, direction, distanceKm, angularRadiusDeg: Math.asin(radius / distanceKm) / DEG,
      ...angles, aboveHorizon: direction[1] >= 0 };
  };
  const sun = body(state.sunEqjKm, SUN_RADIUS_KM), moon = body(state.moonEqjKm, MOON_RADIUS_KM);
  const moonToViewer = unit(subtract(positionEqjKm, state.moonEqjKm));
  const cosine = Math.max(-1, Math.min(1, dot(state.moonToSunEqj, moonToViewer)));
  const phaseAngleDeg = Math.acos(cosine) / DEG;
  // Project local zenith onto the Moon's tangent plane. Near zenith use local north.
  const upReference: Vec3 = Math.abs(moon.direction[1]) < .999999 ? [0, 1, 0] : [0, 0, -1];
  const up = unit(subtract(upReference, scale(moon.direction, dot(upReference, moon.direction))));
  const right = unit(cross(moon.direction, up));
  const light = unit(applyFrame(eqjToSky, state.moonToSunEqj));
  const lightX = dot(light, right), lightY = dot(light, up);
  const brightLimbAngleDeg = Math.atan2(lightX, lightY) / DEG;
  const sine = Math.sqrt(Math.max(0, 1 - cosine * cosine));
  const portraitLight: Vec3 = [sine * Math.sin(brightLimbAngleDeg * DEG), sine * Math.cos(brightLimbAngleDeg * DEG), cosine];
  return { key: `${state.key}/observer/${location.latitude}/${location.longitude}`, location: { ...location },
    positionEqjKm, eqjToSky, skyToEqj: inverseFrame(eqjToSky), sun, moon,
    phaseFraction: (1 + cosine) / 2, phaseAngleDeg, brightLimbAngleDeg,
    brightLimbDefined: Math.hypot(lightX, lightY) > 1e-8, portraitLight };
}
