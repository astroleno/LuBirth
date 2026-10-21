import * as THREE from 'three';

export type CloseupShotInput = {
  longitudeDeg: number;
  latitudeDeg: number;
  earthYawDeg: number;
  seamOffsetDeg?: number;
  cameraDistance: number;
  earthRadius: number;
  targetLatitudeDeg: number;
  lookAtDistanceRatio: number;
  fovDeg?: number;
  aspect?: number;
};

export type CloseupShot = {
  cameraAzimuthDeg: number;
  cameraElevationDeg: number;
  cameraViewPitchDeg: number;
  markerNdc: [number, number, number];
  earthCenterNdcY: number;
  projectedLatitudeDeg: number;
};

// Clear the displaced terrain/cloud shell without making the pin hover.
export const BIRTH_POINT_ANCHOR_RADIUS_SCALE = 1.004;

// The original close-up used Shanghai (31.2°) and a 28° camera offset.
// Preserve that framing while changing which geographic point is centered.
const ORIGINAL_CLOSEUP_ELEVATION_DEG = 31.2 - 28;

function normalizeDegrees(value: number) {
  let normalized = value % 360;
  if (normalized > 180) normalized -= 360;
  if (normalized < -180) normalized += 360;
  return normalized;
}

function geographicNormal(latitudeDeg: number, longitudeWorldDeg: number) {
  const latitude = THREE.MathUtils.degToRad(latitudeDeg);
  const longitude = THREE.MathUtils.degToRad(longitudeWorldDeg);
  return new THREE.Vector3(
    Math.cos(latitude) * Math.cos(longitude),
    Math.sin(latitude),
    -Math.cos(latitude) * Math.sin(longitude),
  );
}

function applyCameraPose(
  camera: THREE.PerspectiveCamera,
  azimuthDeg: number,
  elevationDeg: number,
  viewPitchDeg: number,
  distance: number,
) {
  const azimuth = THREE.MathUtils.degToRad(azimuthDeg);
  const elevation = THREE.MathUtils.degToRad(elevationDeg);
  const radial = new THREE.Vector3(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimuth) * Math.cos(elevation),
  ).normalize();
  const north = new THREE.Vector3(
    -Math.sin(azimuth) * Math.sin(elevation),
    Math.cos(elevation),
    -Math.cos(azimuth) * Math.sin(elevation),
  );

  const forward = radial.clone().negate();
  const right = forward.clone().cross(north).normalize();
  forward.applyAxisAngle(right, THREE.MathUtils.degToRad(viewPitchDeg));

  camera.position.copy(radial).multiplyScalar(distance);
  camera.up.copy(north);
  camera.lookAt(camera.position.clone().add(forward));
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
}

/**
 * Keep the original Earth framing and place the birthplace at the configured
 * latitude of the visible globe. A latitude is not a viewport percentage.
 * Perspective shortens the visible surface: directly subtracting 70° would
 * put the point behind the horizon at the original close-up distance.
 */
export function solveCloseupShot({
  longitudeDeg,
  latitudeDeg,
  earthYawDeg,
  seamOffsetDeg = 0,
  cameraDistance,
  earthRadius,
  targetLatitudeDeg,
  lookAtDistanceRatio,
  fovDeg = 45,
  aspect = 16 / 9,
}: CloseupShotInput): CloseupShot {
  const longitudeWorldDeg = longitudeDeg + earthYawDeg + seamOffsetDeg;
  const cameraAzimuthDeg = normalizeDegrees(90 + longitudeWorldDeg);
  const marker = geographicNormal(latitudeDeg, longitudeWorldDeg)
    .multiplyScalar(earthRadius * BIRTH_POINT_ANCHOR_RADIUS_SCALE);
  const camera = new THREE.PerspectiveCamera(fovDeg, aspect, 0.01, Math.max(400, cameraDistance + 20));
  const radiusRatio = earthRadius / cameraDistance;
  const anchorRadiusRatio = radiusRatio * BIRTH_POINT_ANCHOR_RADIUS_SCALE;
  const targetLatitude = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(targetLatitudeDeg, -90, 90));
  const silhouetteSlope = radiusRatio / Math.sqrt(1 - radiusRatio * radiusRatio);
  const targetRayAngle = Math.atan(Math.sin(targetLatitude) * silhouetteSlope);
  // The near-side intersection of the target ray with the globe.
  const surfaceAngle = Math.asin(THREE.MathUtils.clamp(Math.sin(targetRayAngle) / anchorRadiusRatio, -1, 1))
    - targetRayAngle;
  const elevationDeg = latitudeDeg - THREE.MathUtils.radToDeg(surfaceAngle);

  const referenceElevation = THREE.MathUtils.degToRad(ORIGINAL_CLOSEUP_ELEVATION_DEG);
  const viewPitchDeg = THREE.MathUtils.radToDeg(Math.atan2(
    lookAtDistanceRatio * Math.cos(referenceElevation),
    1 - lookAtDistanceRatio * Math.sin(referenceElevation),
  ));
  applyCameraPose(camera, cameraAzimuthDeg, elevationDeg, viewPitchDeg, cameraDistance);
  const projectedSlope = anchorRadiusRatio * Math.sin(surfaceAngle) / (1 - anchorRadiusRatio * Math.cos(surfaceAngle));

  return {
    cameraAzimuthDeg,
    cameraElevationDeg: elevationDeg,
    cameraViewPitchDeg: viewPitchDeg,
    markerNdc: marker.project(camera).toArray() as [number, number, number],
    earthCenterNdcY: new THREE.Vector3().project(camera).y,
    projectedLatitudeDeg: THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(projectedSlope / silhouetteSlope, -1, 1))),
  };
}
