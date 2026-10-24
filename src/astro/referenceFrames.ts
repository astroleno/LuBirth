/** Right-handed frames stored as three column vectors, independent of Three/React. */
export type Vec3 = [number, number, number];
export type Frame3 = [Vec3, Vec3, Vec3];
export const IDENTITY_FRAME: Frame3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
export const DEG = Math.PI / 180;
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const subtract = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, value: number): Vec3 => [a[0] * value, a[1] * value, a[2] * value];
export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export function unit(a: Vec3): Vec3 {
  const length = Math.hypot(...a);
  if (!Number.isFinite(length) || length < 1e-14) throw new Error('天文方向无效。');
  return scale(a, 1 / length);
}
export function applyFrame(frame: Frame3, vector: Vec3): Vec3 {
  return [0, 1, 2].map(i => frame[0][i] * vector[0] + frame[1][i] * vector[1] + frame[2][i] * vector[2]) as Vec3;
}
export function inverseFrame(frame: Frame3): Frame3 {
  return [0, 1, 2].map(i => [frame[0][i], frame[1][i], frame[2][i]]) as Frame3;
}
export function composeFrames(after: Frame3, before: Frame3): Frame3 {
  return before.map(column => applyFrame(after, column)) as Frame3;
}
export function angleDegrees(a: Vec3, b: Vec3) {
  return Math.atan2(Math.hypot(...cross(a, b)), dot(a, b)) / DEG;
}
export function wrapDegrees(value: number) { return ((value + 180) % 360 + 360) % 360 - 180; }
export function rotationY(angle: number): Frame3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [[c, 0, -s], [0, 1, 0], [s, 0, c]];
}
/** ECEF/EQD (Z north) → the existing globe texture axes (Y north). det = +1. */
export const EQUATOR_TO_SCENE: Frame3 = [[1, 0, 0], [0, 0, -1], [0, 1, 0]];
/** Astronomy Engine HOR (north, west, zenith) → east, zenith, south. */
export const HORIZON_TO_SKY: Frame3 = [[0, 0, -1], [-1, 0, 0], [0, 1, 0]];
/** Compatibility only: this old axis swap is a reflection, never a quaternion. */
export function ecefToLegacyWorld(a: Vec3): Vec3 { return [a[0], a[2], a[1]]; }
export function geographicNormal(latitude: number, longitude: number): Vec3 {
  const lat = latitude * DEG, lon = longitude * DEG;
  return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
}
export function horizonCoordinates(direction: Vec3) {
  const [x, y, z] = unit(direction), horizontal = Math.hypot(x, z);
  return { altitudeDeg: Math.atan2(y, horizontal) / DEG,
    azimuthDeg: horizontal < 1e-10 ? null : (Math.atan2(x, -z) / DEG + 360) % 360 };
}

export type EarthSceneFrame = {
  key: string; eqjToScene: Frame3; ecefToScene: Frame3;
  sunDirectionScene: Vec3; lightTravelDirectionScene: Vec3;
  fixedSunAzimuthDeg: number; sunDeclinationDeg: number; earthYawDeg: number;
};
export function createEarthSceneFrame(state: {
  key: string; eqjToEqd: Frame3; ecefToEqj: Frame3; sunEqjKm: Vec3;
}, fixedSunAzimuthDeg = -90, seamOffsetDeg = 0): EarthSceneFrame {
  if (!Number.isFinite(fixedSunAzimuthDeg) || !Number.isFinite(seamOffsetDeg)) throw new Error('太阳方位或贴图标定无效。');
  const eqjToUpright = composeFrames(EQUATOR_TO_SCENE, state.eqjToEqd);
  const uprightSun = unit(applyFrame(eqjToUpright, state.sunEqjKm));
  const yaw = fixedSunAzimuthDeg * DEG - Math.atan2(uprightSun[0], uprightSun[2]);
  const eqjToScene = composeFrames(rotationY(yaw), eqjToUpright);
  const ecefToScene = composeFrames(eqjToScene, state.ecefToEqj);
  const sunDirectionScene = unit(applyFrame(eqjToScene, state.sunEqjKm));
  // The geographic seam belongs to the mesh only, never to the celestial vectors.
  const meshFrame = composeFrames(ecefToScene, inverseFrame(EQUATOR_TO_SCENE));
  const earthYawDeg = wrapDegrees(Math.atan2(-meshFrame[0][2], meshFrame[0][0]) / DEG + seamOffsetDeg);
  return { key: `${state.key}/scene/${fixedSunAzimuthDeg}/${seamOffsetDeg}`, eqjToScene, ecefToScene,
    sunDirectionScene, lightTravelDirectionScene: scale(sunDirectionScene, -1),
    fixedSunAzimuthDeg: wrapDegrees(fixedSunAzimuthDeg), sunDeclinationDeg: Math.asin(uprightSun[1]) / DEG, earthYawDeg };
}

/** The legacy shader and light position actually use point-to-Sun, despite old comments. */
export function legacySolarAzimuth(direction: number[] | undefined) {
  return direction && direction.length === 3 && direction.every(Number.isFinite) && Math.hypot(direction[0], direction[2]) > 1e-10
    ? Math.atan2(direction[0], direction[2]) / DEG : -90;
}
