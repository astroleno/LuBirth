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
  return {
    calls,
    autoClear: true,
    setRenderTarget(value: unknown) { target = value; calls.push({ kind: 'target', value }); },
    getRenderTarget() { return target; },
    render(scene: any) { calls.push({ kind: 'render', value: scene.name }); },
    clear() { calls.push({ kind: 'clear' }); },
    clearDepth() { calls.push({ kind: 'clearDepth' }); },
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
    earthAxisYUp: true,
  });
  assert.deepEqual(Object.keys(scene.earth.material.uniforms).sort(), [
    'cloudMap',
    'cloudShadowStrength',
    'dayMap',
    'displacementMap',
    'displacementScale',
    'lightDir',
    'nightMap',
    'normalMap',
    'normalStrength',
    'specularMap',
    'terminatorSoftness',
  ]);
  assert.equal(scene.pip.moon.parent, scene.pip.scene);
  assert.equal(scene.stars.material.isShaderMaterial, true);
  assert.equal(scene.stars.material.uniforms.hasStarMap.value, 0);
  scene.dispose();
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
