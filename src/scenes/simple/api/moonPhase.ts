import { toUTCFromLocal } from '../../../astro/ephemeris';
import { Body, Illumination, MoonPhase, GeoVector } from 'astronomy-engine';
import * as THREE from 'three';

export type MoonPhaseInfo = {
  illumination: number;
  phaseAngleRad: number; // Sun–Moon–Earth angle: 0 = full, PI = new.
  cycleAngleDeg: number; // Ecliptic longitude difference: 0/90/180/270 = new/first/full/last.
  sunDirection: THREE.Vector3; // Presentation frame: +X screen right, +Z toward viewer.
  moonDirection: THREE.Vector3;
  positionAngle: number; // Legacy cycle offset, not an apparent sky position angle.
};

/** Geocentric phase, displayed with waxing on the right and waning on the left.
 * This diagram does not model local horizon rotation, libration or eclipse shadows.
 */
export function getMoonPhaseAtTime(utc: Date): MoonPhaseInfo {
  if (!Number.isFinite(utc.getTime())) throw new Error('Invalid Moon phase date');
  const illum = Illumination(Body.Moon, utc);
  const illumination = THREE.MathUtils.clamp(illum.phase_fraction, 0, 1);
  const cycleAngleDeg = MoonPhase(utc);
  // True phase fraction keeps the projected disk area consistent with the ephemeris.
  const z = 2 * illumination - 1;
  const x = Math.sqrt(Math.max(0, 1 - z * z)) * (cycleAngleDeg < 180 ? 1 : -1);
  const moon = GeoVector(Body.Moon, utc, false);
  return {
    illumination,
    phaseAngleRad: THREE.MathUtils.degToRad(illum.phase_angle),
    cycleAngleDeg,
    sunDirection: new THREE.Vector3(x, 0, z),
    moonDirection: new THREE.Vector3(moon.x, moon.z, moon.y).normalize(),
    positionAngle: THREE.MathUtils.degToRad(cycleAngleDeg) - Math.PI,
  };
}

export function getMoonPhase(localISO: string, _latDeg: number, lonDeg: number): MoonPhaseInfo {
  const utc = /(?:Z|[+-]\d{2}:\d{2})$/i.test(localISO)
    ? new Date(localISO) : toUTCFromLocal(localISO, lonDeg);
  return getMoonPhaseAtTime(utc);
}
