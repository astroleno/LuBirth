import assert from 'node:assert/strict';
import * as THREE from 'three';
import { solveCloseupShot, BIRTH_POINT_ANCHOR_RADIUS_SCALE } from '../src/scenes/simple/utils/closeupShot.ts';

// Run with: node --experimental-strip-types scripts/verify-closeup-composition.mjs
const distance = 15;
assert.ok(BIRTH_POINT_ANCHOR_RADIUS_SCALE > 1.002 && BIRTH_POINT_ANCHOR_RADIUS_SCALE <= 1.005,
  'Pin must clear the surface shell while staying within 0.5% of the globe radius');
const radius = 1.68 * distance * Math.tan(Math.PI / 8);
const legacy = new THREE.PerspectiveCamera(45, 1.6, 0.01, 400);
const legacyElevation = THREE.MathUtils.degToRad(31.2 - 28);
legacy.position.set(0, distance * Math.sin(legacyElevation), distance * Math.cos(legacyElevation));
legacy.lookAt(0, distance * 1.08, 0);
legacy.updateMatrixWorld(true);
const legacyEarthCenter = new THREE.Vector3().project(legacy);

const locations = [
  ['Shanghai', 121.4737, 31.2304], ['Urumqi', 87.6168, 43.8256],
  ['New York', -74.006, 40.7128], ['Sydney', 151.2093, -33.8688],
  ['Equator', 0, 0], ['South polar', 10, -80], ['North polar', 10, 80],
];
let checked = 0;
for (const [name, longitudeDeg, latitudeDeg] of locations) {
  for (const earthYawDeg of [0, 150, 359]) {
    for (const aspect of [1.6, 390 / 844]) {
      for (const targetLatitudeDeg of [60, 70, 80]) {
        const result = solveCloseupShot({ longitudeDeg, latitudeDeg, earthYawDeg,
          cameraDistance: distance, earthRadius: radius, lookAtDistanceRatio: 1.08,
          targetLatitudeDeg, aspect });
        const az = THREE.MathUtils.degToRad(result.cameraAzimuthDeg);
        const el = THREE.MathUtils.degToRad(result.cameraElevationDeg);
        const camera = new THREE.PerspectiveCamera(45, aspect, 0.01, 400);
        const radial = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
        const north = new THREE.Vector3(-Math.sin(az) * Math.sin(el), Math.cos(el), -Math.cos(az) * Math.sin(el));
        camera.position.copy(radial).multiplyScalar(distance);
        camera.up.copy(north);
        // Measure the point on a globe-centered view before applying framing.
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld(true);
        const lat = THREE.MathUtils.degToRad(latitudeDeg);
        const lon = THREE.MathUtils.degToRad(longitudeDeg + earthYawDeg);
        const point = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon))
          .multiplyScalar(radius * BIRTH_POINT_ANCHOR_RADIUS_SCALE);
        const centered = point.clone().project(camera);
        const silhouetteNdc = Math.tan(Math.asin(radius / distance)) / Math.tan(Math.PI / 8);
        const measuredLatitude = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(centered.y / silhouetteNdc, -1, 1)));
        assert.ok(Math.abs(measuredLatitude - targetLatitudeDeg) < 1e-7, `${name}: configured latitude must determine marker position`);
        assert.ok(point.clone().normalize().dot(camera.position.clone().sub(point).normalize()) > 0,
          `${name}: point must remain on the visible hemisphere`);
        // Apply the framing independently, then compare with the old preset.
        const forward = radial.clone().negate();
        forward.applyAxisAngle(forward.clone().cross(north).normalize(), THREE.MathUtils.degToRad(result.cameraViewPitchDeg));
        camera.lookAt(camera.position.clone().add(forward));
        camera.updateMatrixWorld(true);
        const projected = point.clone().project(camera);
        const earthCenter = new THREE.Vector3().project(camera);
        assert.ok(Math.abs(projected.x) < 1e-9, `${name}: marker must be horizontally centered`);
        assert.ok(Math.abs(earthCenter.y - legacyEarthCenter.y) < 1e-9, `${name}: Earth framing must match original`);
        assert.ok(projected.y > -1 && projected.y < 0.1, `${name}: marker must stay on the globe, away from the header`);
        assert.ok(projected.distanceTo(new THREE.Vector3(...result.markerNdc)) < 1e-8, `${name}: reported projection must match rendered camera`);
        checked++;
      }
    }
  }
}
console.log(`Close-up composition: ${checked} checks passed; original Earth framing, centered marker, configured 60°/70°/80° latitudes.`);
