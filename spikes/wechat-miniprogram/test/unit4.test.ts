import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';

import { getScenario } from '../src/config/scenarios.ts';
import { TouchCameraController } from '../src/input/touch-camera-controller.ts';
import { latLonToWorld, LubirthCapabilityScene } from '../src/scene/lubirth-capability-scene.ts';
import { shouldRenderPip } from '../src/scene/moon-pip-pass.ts';

function fakeRenderer() {
  const calls: Array<{ kind: string; value?: unknown }> = [];
  let target: unknown = null;
  let clearAlpha = 1;
  const clearColor = new THREE.Color(0x000000);
  return {
    calls,
    autoClear: true,
    setRenderTarget(value: unknown) { target = value; calls.push({ kind: 'target', value }); },
    getRenderTarget() { return target; },
    render(scene: any) { calls.push({ kind: 'render', value: scene.name }); },
    clear() { calls.push({ kind: 'clear' }); },
    clearDepth() { calls.push({ kind: 'clearDepth' }); },
    getClearAlpha() { return clearAlpha; },
    getClearColor(value: THREE.Color) { return value.copy(clearColor); },
    setClearColor(value: THREE.Color | number, alpha: number) {
      clearColor.set(value as any);
      clearAlpha = alpha;
      calls.push({ kind: 'clearColor', value: alpha });
    },
    setSize(width: number, height: number) { calls.push({ kind: 'size', value: [width, height] }); },
    setViewport() {},
    getViewport(vector: any) { return vector.set(0, 0, 1000, 500); },
    setScissor() {},
    getScissor(vector: any) { return vector.set(0, 0, 1000, 500); },
    setScissorTest() {},
    getScissorTest() { return false; },
  } as any;
}

test('scene graph preserves single-light, Y-up, independent camera/stars and PIP-only moon invariants', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });

  assert.deepEqual(scene.auditInvariants(), {
    singleDirectionalLight: true,
    cameraIndependent: true,
    starsIndependent: true,
    moonAbsentFromMainScene: true,
    pipUsesRenderTarget: true,
    pipLayoutFixed: true,
    earthAxisYUp: true,
    productionEarthEffects: true,
    productionAtmosphereEffects: true,
    productionCloudEffects: true,
  });
  assert.deepEqual(Object.keys(scene.earth.material.uniforms).sort(), [
    'broadStrength',
    'cloudMap',
    'cloudShadowStrength',
    'dayDiffuseGamma',
    'dayDiffuseMax',
    'dayMap',
    'displacementMap',
    'displacementScale',
    'haloWidth',
    'lightDir',
    'nightBoost',
    'nightEarthMapHue',
    'nightEarthMapIntensity',
    'nightEarthMapLightness',
    'nightEarthMapSaturation',
    'nightFalloff',
    'nightGamma',
    'nightGlowBlur',
    'nightGlowOpacity',
    'nightHemisphereBrightness',
    'nightMap',
    'normalMap',
    'normalStrength',
    'rimHeight',
    'rimRadius',
    'rimStrength',
    'rimWidth',
    'shininess',
    'specFresnelK',
    'specStrength',
    'specularMap',
    'sunIntensity',
    'terminatorLift',
    'terminatorSoftness',
    'terminatorTint',
    'twilightEnd',
    'twilightStart',
  ]);
  assert.equal(scene.pip.moon.parent, scene.pip.scene);
  assert.equal(scene.stars.material.isShaderMaterial, true);
  assert.equal(scene.stars.material.uniforms.hasStarMap.value, 0);
  scene.dispose();
});

test('scene construction supports the r108 THREE.Math angle API', () => {
  const scenario = getScenario('equinox-shanghai');
  const r108LikeThree = {
    ...THREE,
    MathUtils: undefined,
    Math: { degToRad: (degrees: number) => degrees * Math.PI / 180 },
  };

  const scene = new LubirthCapabilityScene({
    THREE: r108LikeThree,
    renderer: fakeRenderer(),
    scenario,
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });

  assert.ok(Math.abs(scene.earthGroup.rotation.y - scenario.earthYawDeg * Math.PI / 180) < 1e-12);
  scene.dispose();
});

test('scene disposal supports r108 Scene without clear()', () => {
  class R108Scene extends THREE.Scene {
    constructor() {
      super();
      Object.defineProperty(this, 'clear', { value: undefined });
    }
  }
  const r108LikeThree = { ...THREE, Scene: R108Scene };
  const scene = new LubirthCapabilityScene({
    THREE: r108LikeThree,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });

  assert.doesNotThrow(() => scene.dispose());
  assert.equal(scene.scene.children.length, 0);
});

test('Y-up birth point mapping keeps north pole on +Y and 90E equator on +Z', () => {
  const north = latLonToWorld(90, 0, 1);
  const east = latLonToWorld(0, 90, 1);

  assert.ok(Math.abs(north.y - 1) < 1e-12);
  assert.ok(Math.abs(east.z - 1) < 1e-12);
  assert.ok(Math.abs(east.y) < 1e-12);
});

test('PIP cadence renders immediately and then at 30fps intervals', () => {
  assert.equal(shouldRenderPip(Number.NEGATIVE_INFINITY, 0, 30), true);
  assert.equal(shouldRenderPip(0, 20, 30), false);
  assert.equal(shouldRenderPip(0, 34, 30), true);
});

test('earth rotates around world Y while the camera and PIP framing stay fixed', () => {
  const renderer = fakeRenderer();
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer,
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const cameraBefore = scene.camera.position.clone();
  const pipCameraBefore = scene.pip.camera.position.clone();
  const yawBefore = scene.earthGroup.rotation.y;

  scene.render(0);
  scene.render(1000);

  assert.ok(scene.earthGroup.rotation.y > yawBefore);
  assert.deepEqual(scene.camera.position.toArray(), cameraBefore.toArray());
  assert.deepEqual(scene.pip.camera.position.toArray(), pipCameraBefore.toArray());
  scene.dispose();
});

test('touch controller rotates and pinches only the main camera orbit', () => {
  const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 20);
  const controller = new TouchCameraController(camera, {
    azimuthDeg: 0,
    elevationDeg: 0,
    distance: 4,
    minDistance: 2,
    maxDistance: 6,
  });
  controller.setViewport(1000, 500);
  const before = camera.position.clone();
  controller.onTouchStart([{ id: 1, x: 100, y: 100 }]);
  controller.onTouchMove([{ id: 1, x: 200, y: 150 }]);
  const afterRotate = controller.snapshot();
  controller.onTouchStart([{ id: 1, x: 200, y: 150 }, { id: 2, x: 300, y: 150 }]);
  controller.onTouchMove([{ id: 1, x: 175, y: 150 }, { id: 2, x: 325, y: 150 }]);

  assert.notDeepEqual(camera.position.toArray(), before.toArray());
  assert.ok(afterRotate.azimuthDeg < 0);
  assert.ok(afterRotate.elevationDeg > 0);
  assert.ok(controller.snapshot().distance < 4);
  assert.equal(camera.parent, null);
});

test('2K NASA visual profile preserves surface energy through twilight and uses a cutoff-free Fresnel phase', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const uniforms = scene.earth.material.uniforms;

  assert.equal(uniforms.nightGlowBlur.value, 0.01);
  assert.equal(uniforms.nightGlowOpacity.value, 0.42);
  assert.equal(uniforms.nightFalloff.value, 1.45);
  assert.equal(uniforms.nightHemisphereBrightness.value, 0.5);
  assert.equal(uniforms.nightEarthMapIntensity.value, 0.09);
  assert.equal(uniforms.dayDiffuseMax.value, 1);
  assert.equal(uniforms.dayDiffuseGamma.value, 1);
  assert.ok(uniforms.rimStrength.value < 1);
  assert.ok(uniforms.rimWidth.value >= 3);
  assert.match(scene.earth.material.fragmentShader, /float surfaceBlend = smoothstep\(twilightStart, twilightEnd, geometricNdl\);/);
  assert.match(scene.earth.material.fragmentShader, /float dayWeight = surfaceBlend;/);
  assert.match(scene.earth.material.fragmentShader, /float nightGate = 1\.0 - surfaceBlend;/);
  assert.match(scene.earth.material.fragmentShader, /float glowGate = 1\.0 - surfaceBlend;/);
  assert.doesNotMatch(scene.earth.material.fragmentShader, /smoothstep\(-0\.12, 0\.04, ndl\)/);
  assert.match(scene.earth.material.fragmentShader, /float nightSurfaceAmbient = nightEarthMapIntensity \* nightHemisphereBrightness \* 0\.45;/);
  assert.match(scene.earth.material.fragmentShader, /float surfaceAmbient = mix\(nightSurfaceAmbient, 0\.055, dayWeight\);/);
  assert.match(scene.earth.material.fragmentShader, /vec3 surfaceBase = dayTex \* mix\(moonTint, vec3\(1\.0\), dayWeight\) \* surfaceAmbient;/);
  assert.match(scene.earth.material.fragmentShader, /float diffuseRamp = smoothstep\(twilightStart, 0\.58, shadingNdl\);/);
  assert.match(scene.earth.material.fragmentShader, /float cityLightGate = smoothstep\(0\.38, 0\.92, nightGate\);/);
  assert.match(scene.earth.material.fragmentShader, /float rimSunPhase = clamp\(0\.5 \+ 0\.5 \* geometricNdl, 0\.0, 1\.0\);/);
  assert.match(scene.earth.material.fragmentShader, /rimSunPhase = rimSunPhase \* rimSunPhase \* \(3\.0 - 2\.0 \* rimSunPhase\);/);
  assert.match(scene.earth.material.fragmentShader, /float dayNightRim = mix\(0\.12, 1\.0, rimSunPhase\);/);
  assert.doesNotMatch(scene.earth.material.fragmentShader, /dayNightRim[^;]*max\(ndl, 0\.0\)/);
  assert.match(scene.earth.material.fragmentShader, /surfaceBase \+ dayColor \+ nightColor/);
  scene.dispose();
});

test('earth and cloud layers share an unperturbed geometric twilight mask', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const earthUniforms = scene.earth.material.uniforms;
  const cloudLayers = scene.clouds.children;
  const firstCloud = cloudLayers[0];

  assert.equal(earthUniforms.twilightStart.value, firstCloud.material.uniforms.twilightStart.value);
  assert.equal(earthUniforms.twilightEnd.value, firstCloud.material.uniforms.twilightEnd.value);
  assert.ok(earthUniforms.twilightStart.value < 0);
  assert.ok(earthUniforms.twilightEnd.value > 0);
  assert.match(scene.earth.material.fragmentShader, /float geometricNdl = dot\(normalize\(vWorldNormal\), toSun\);/);
  assert.match(scene.earth.material.fragmentShader, /float shadingNdl = dot\(normal, toSun\);/);
  assert.match(scene.earth.material.fragmentShader, /smoothstep\(twilightStart, twilightEnd, geometricNdl\)/);
  assert.doesNotMatch(scene.earth.material.fragmentShader, /ndl_d/);
  assert.match(firstCloud.material.fragmentShader, /smoothstep\(twilightStart, twilightEnd, signedNdl\)/);
  assert.equal(new Set(cloudLayers.map((layer: any) => layer.material.uniforms.uvOffset.value.x)).size, cloudLayers.length);
  assert.ok(firstCloud.material.uniforms.strength.value <= 0.15);
  scene.dispose();
});

test('production atmosphere separates a thin inner arc from a broad glow without a hard day-night cut', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const main = scene.atmosphere.getObjectByName('atmosphereMainShell');
  const near = scene.atmosphere.getObjectByName('atmosphereNearShell');

  assert.ok(main);
  assert.ok(near);
  assert.notEqual(main.material, scene.earth.material);
  assert.ok(main.geometry.parameters.radius > scene.earth.geometry.parameters.radius);
  assert.ok(near.geometry.parameters.radius > scene.earth.geometry.parameters.radius);
  assert.ok(main.geometry.parameters.radius > near.geometry.parameters.radius);
  assert.equal(main.material.uniforms.thickness.value, 0.18);
  assert.ok(main.material.uniforms.intensity.value < near.material.uniforms.intensity.value);
  assert.ok(main.material.uniforms.mainContrast.value >= 0.7);
  assert.ok(main.material.uniforms.mainSoftness.value > near.material.uniforms.nearSoftness.value);
  assert.ok(main.material.uniforms.softBoundaryDelta.value <= 0.02);
  assert.equal(main.material.uniforms.perceptualFloor, undefined);
  assert.ok(main.material.uniforms.scaleHeight.value > 0.06);
  assert.equal(main.material.uniforms.offset.value, 0.001);
  assert.equal(near.material.uniforms.nearFactor.value, 0.22);
  assert.ok(near.material.uniforms.nearStrength.value < 0.5);
  assert.ok(near.material.uniforms.nearContrast.value > 0.6);
  assert.ok(near.material.uniforms.nearSoftness.value < main.material.uniforms.mainSoftness.value);
  assert.ok(near.material.uniforms.scaleHeight.value < 0.02);
  assert.match(main.material.fragmentShader, /float signedNdl = dot\(normalize\(vWorldNormal\), normalize\(lightDir\)\);/);
  assert.match(main.material.fragmentShader, /float sunPhase = clamp\(0\.5 \+ 0\.5 \* signedNdl, 0\.0, 1\.0\);/);
  assert.match(main.material.fragmentShader, /sunPhase = sunPhase \* sunPhase \* \(3\.0 - 2\.0 \* sunPhase\);/);
  assert.match(near.material.fragmentShader, /sunPhase = sunPhase \* sunPhase \* \(3\.0 - 2\.0 \* sunPhase\);/);
  assert.match(main.material.fragmentShader, /float pathVisibility = smoothstep\(0\.01, 0\.055, optical\);/);
  assert.doesNotMatch(main.material.fragmentShader, /perceptualFloor/);
  assert.doesNotMatch(near.material.fragmentShader, /perceptualFloor/);
  assert.doesNotMatch(main.material.fragmentShader, /sunsetStart|sunsetEnd/);
  assert.doesNotMatch(near.material.fragmentShader, /sunsetStart|sunsetEnd/);
  assert.doesNotMatch(main.material.fragmentShader, /max\(dot\(normalize\(vWorldNormal\), normalize\(lightDir\)\), 0\.0\)/);
  assert.doesNotMatch(near.material.fragmentShader, /max\(dot\(normalize\(vWorldNormal\), normalize\(lightDir\)\), 0\.0\)/);
  assert.equal(main.material.blending, THREE.AdditiveBlending);
  assert.equal(near.material.blending, THREE.AdditiveBlending);
  scene.dispose();
});

test('production atmosphere uses linear additive energy for a broad asymmetric outer tail', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const main = scene.atmosphere.getObjectByName('atmosphereMainShell');
  const near = scene.atmosphere.getObjectByName('atmosphereNearShell');

  assert.equal(main.material.premultipliedAlpha, true);
  assert.equal(near.material.premultipliedAlpha, true);
  assert.ok(main.material.uniforms.scaleHeight.value > near.material.uniforms.scaleHeight.value * 3);
  assert.ok(main.material.uniforms.intensity.value < near.material.uniforms.intensity.value);
  assert.ok(main.material.uniforms.mainContrast.value >= 0.7);
  assert.ok(main.material.uniforms.softBoundaryDelta.value <= 0.02);
  assert.ok(scene.earth.material.uniforms.rimStrength.value < 1);
  scene.dispose();
});

test('production cloud stack keeps six layers with stronger sunlit volume and a soft night silhouette', () => {
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });
  const firstLayer = scene.clouds.children[0];
  const lastLayer = scene.clouds.children.at(-1);
  const uniforms = firstLayer.material.uniforms;

  assert.equal(scene.clouds.children.length, 6);
  assert.ok(uniforms.strength.value <= 0.15);
  assert.ok(lastLayer.material.uniforms.strength.value < uniforms.strength.value);
  assert.ok(lastLayer.geometry.parameters.radius > firstLayer.geometry.parameters.radius);
  assert.equal(uniforms.displacementScale.value, 0.02);
  assert.equal(uniforms.displacementBias.value, 0.03);
  assert.equal(uniforms.useVolumeScattering.value, true);
  assert.ok(uniforms.cloudWhite.value >= 0.8);
  assert.ok(uniforms.cloudContrast.value <= 1.05);
  assert.ok(uniforms.volumeDensity.value <= 0.65);
  assert.ok(uniforms.scatteringStrength.value <= 0.45);
  assert.equal(uniforms.scatteringG.value, -0.5);
  assert.ok(uniforms.rimEffect.value <= 0.6);
  assert.ok(uniforms.densityEnhancement.value <= 1.6);
  assert.ok(uniforms.noiseStrength.value <= 0.6);
  assert.equal(uniforms.useThicknessMapping.value, true);
  assert.ok(uniforms.thicknessScale.value <= 3.2);
  assert.equal(uniforms.thicknessBias.value, 1);
  assert.equal(uniforms.thicknessPower.value, 1.5);
  assert.equal(uniforms.useFresnel.value, true);
  assert.equal(uniforms.fresnelPower.value, 5);
  assert.equal(uniforms.fresnelStrength.value, 0.5);
  assert.match(firstLayer.material.fragmentShader, /float signedNdl = dot\(normal, normalize\(lightDir\)\);/);
  assert.match(firstLayer.material.fragmentShader, /float scatteringWeight = clamp\(scattering, 0\.0, 0\.65\);/);
  assert.match(firstLayer.material.fragmentShader, /float nightSilhouette = mix\(0\.05, 1\.0, dayWeight\);/);
  scene.dispose();
});

test('star texture shader trusts the loader color space instead of applying gamma twice', () => {
  const stars = new THREE.Texture();
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
    textures: { stars },
  });

  assert.equal(scene.stars.material.uniforms.hasStarMap.value, 1);
  assert.equal(scene.stars.material.uniforms.starDetailScale.value, 1.7);
  assert.equal(scene.stars.material.uniforms.starDetailStrength.value, 0.5);
  assert.doesNotMatch(scene.stars.material.fragmentShader, /pow\(texture2D\(starMap/);
  assert.match(scene.stars.material.fragmentShader, /texture2D\(starMap, vUv\)\.rgb/);
  assert.match(scene.stars.material.fragmentShader, /vec2 detailUv = fract\(vUv \* starDetailScale/);
  assert.match(scene.stars.material.fragmentShader, /vec3 detailSample = texture2D\(starMap, detailUv\)\.rgb/);
  assert.match(scene.stars.material.fragmentShader, /float detailMask = smoothstep\(0\.48, 0\.82, detailPeak\);/);
  scene.dispose();
});

test('PIP render target clears transparently, clips the overlay, and preserves moon phase contrast', () => {
  const renderer = fakeRenderer();
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer,
    scenario: getScenario('equinox-shanghai'),
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
  });

  scene.pip.render(0);

  assert.deepEqual(
    renderer.calls.filter((call: any) => call.kind === 'clearColor').map((call: any) => call.value),
    [0, 1],
  );
  assert.equal(scene.pip.overlayScene.children[0].material.isShaderMaterial, true);
  assert.match(scene.pip.overlayScene.children[0].material.fragmentShader, /1\.0 - smoothstep\(0\.46, 0\.5, radius\)/);
  assert.equal(scene.pip.moon.material.uniforms.terminatorSoftness.value, 0.02);
  assert.equal(scene.pip.moon.material.uniforms.nightLift.value, 0.002);
  scene.dispose();
});

test('PIP keeps its normalized anchor and square pixel window through portrait and landscape resize', () => {
  const scenario = getScenario('equinox-shanghai');
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer: fakeRenderer(),
    scenario,
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
    viewportWidth: 390,
    viewportHeight: 844,
  });

  assert.deepEqual(scene.pip.layoutSnapshot(), {
    screenX: 0.78,
    screenY: 0.22,
    widthPx: 93.6,
    heightPx: 93.6,
  });
  scene.resize(844, 390, scenario);
  assert.deepEqual(scene.pip.layoutSnapshot(), {
    screenX: 0.78,
    screenY: 0.22,
    widthPx: 202.56,
    heightPx: 202.56,
  });
  scene.dispose();
});

test('viewport resize updates the renderer and fixed PIP window as one operation', async () => {
  const sceneModule = await import('../src/scene/lubirth-capability-scene.ts') as Record<string, unknown>;
  const resizeCapabilityViewport = sceneModule.resizeCapabilityViewport as undefined | ((...args: any[]) => unknown);
  assert.equal(typeof resizeCapabilityViewport, 'function');
  const renderer = fakeRenderer();
  const scenario = getScenario('equinox-shanghai');
  const scene = new LubirthCapabilityScene({
    THREE,
    renderer,
    scenario,
    assetTier: '2k',
    pipEnabled: true,
    pipResolution: 256,
    viewportWidth: 390,
    viewportHeight: 844,
  });

  const result = resizeCapabilityViewport!(renderer, scene, scenario, 844, 390);

  assert.deepEqual(renderer.calls.at(-1), { kind: 'size', value: [844, 390] });
  assert.deepEqual(result, {
    screenX: 0.78,
    screenY: 0.22,
    widthPx: 202.56,
    heightPx: 202.56,
  });
  scene.dispose();
});

test('effect matrix passes only when day, terminator and night all pass production-effect invariants', async () => {
  const capabilityModule = await import('../src/tests/scene-capability-test.ts') as Record<string, unknown>;
  const evaluate = capabilityModule.evaluateProductionEffectMatrix as undefined | ((entries: any[]) => any);
  assert.equal(typeof evaluate, 'function');
  const effects = {
    productionEarthEffects: true,
    productionAtmosphereEffects: true,
    productionCloudEffects: true,
    pipLayoutFixed: true,
  };

  assert.deepEqual(evaluate!([
    { visualFocus: 'day', status: 'pass', invariants: effects },
    { visualFocus: 'terminator', status: 'pass', invariants: effects },
  ]), {
    status: 'inconclusive',
    missingVisuals: ['night'],
    failedVisuals: [],
  });
  assert.deepEqual(evaluate!([
    { visualFocus: 'day', status: 'pass', invariants: effects },
    { visualFocus: 'terminator', status: 'pass', invariants: { ...effects, productionAtmosphereEffects: false } },
    { visualFocus: 'night', status: 'pass', invariants: effects },
  ]), {
    status: 'fail',
    missingVisuals: [],
    failedVisuals: ['terminator'],
  });
  assert.equal(evaluate!([
    { visualFocus: 'day', status: 'pass', invariants: effects },
    { visualFocus: 'terminator', status: 'pass', invariants: effects },
    { visualFocus: 'night', status: 'pass', invariants: effects },
  ]).status, 'pass');
});
