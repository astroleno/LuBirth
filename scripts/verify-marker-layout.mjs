import assert from 'node:assert/strict';
import * as THREE from 'three';
import { layoutGlassMarker, projectCameraSphereBounds } from '../src/performance/glassMarkerLayout.ts';

// Real overlapping footprints from the rendered 2026-10-21 Shanghai close-up.
const fixtures = [
  { name: '390×844 expanded', anchorX: 195, anchorY: 254.67208462488878, moonBottom: 139.8134299989116, scale: 82 / 92 },
  { name: '844×390 expanded', anchorX: 260, anchorY: 249.55304774800655, moonBottom: 129.32949464099204, scale: 1 },
  { name: '390×667 expanded', anchorX: 195, anchorY: 198.04273917437957, moonBottom: 125.32850339227659, scale: 82 / 92 },
  { name: '1280×800 desktop', anchorX: 640, anchorY: 511.9036876882186, moonBottom: 265.2912710584457, scale: 1 },
  { name: '320×568 tight space', anchorX: 160, anchorY: 166.4, moonBottom: 117.2, scale: 82 / 92 },
];
let checked = 0;
for (const fixture of fixtures) {
  for (const width of [82, 164]) {
    let placement;
    for (let step = 0; step <= 108; step++) {
      const reveal = step / 100;
      const growth = 0.78 + 0.22 * reveal;
      const scale = fixture.scale * growth;
      const moon = { left: fixture.anchorX - 60, right: fixture.anchorX + 60, top: 40, bottom: fixture.moonBottom };
      const layout = layoutGlassMarker({ anchorX: fixture.anchorX, anchorY: fixture.anchorY,
        scale, maxScale: fixture.scale * 1.0176, labelWidth: width * growth, moon });
      assert.ok(layout.label.top - moon.bottom >= 16 - 1e-8, `${fixture.name}: Moon must have 16px label clearance, including entrance overshoot`);
      assert.ok(layout.bounds.top - moon.bottom >= 16 - 1e-8, `${fixture.name}: the optical halo must also clear the Moon`);
      assert.ok(fixture.anchorY - 85 * layout.pinScale - moon.bottom >= 16 - 1e-8,
        `${fixture.name}: pin must also stay clear of the Moon`);
      assert.ok(Math.abs(layout.label.bottom - layout.label.top - 40 * scale) < 1e-8,
        `${fixture.name}: avoidance must not shrink the label text`);
      assert.ok(Math.abs((layout.bounds.left + layout.bounds.right) / 2 - fixture.anchorX) < 1e-8,
        `${fixture.name}: callout must stay horizontally centered on the geographic anchor`);
      assert.ok(layout.bounds.top <= layout.label.top && layout.bounds.bottom >= layout.label.bottom);
      assert.ok(layout.pinScale >= 0 && layout.pinScale <= scale);
      placement ??= layout.labelPlacement;
      assert.equal(layout.labelPlacement, placement, `${fixture.name}: entrance must not flip the label`);
      if (fixture.name.includes('desktop')) {
        assert.equal(layout.pinScale, scale, 'Roomy layout must retain the original pin size');
        assert.ok(Math.abs(layout.label.top - (fixture.anchorY - 136 * scale)) < 1e-8,
          'Roomy layout must retain the original label position');
      }
      checked++;
    }
  }
}

// Validate silhouette projection independently against sampled 3D surface points,
// including a cropped/off-axis camera. Bounds must enclose and closely touch it.
for (const cropped of [false, true]) {
  const camera = new THREE.PerspectiveCamera(45, 1.6, 0.01, 100);
  if (cropped) camera.setViewOffset(1280, 800, 0, 0, 600, 800);
  for (const center of [new THREE.Vector3(0, 0, -14), new THREE.Vector3(-1.7, 2.3, -14)]) {
    const sphere = new THREE.Sphere(center, 0.918);
    const bounds = projectCameraSphereBounds(sphere, camera.projectionMatrix.elements, 1280, 800);
    assert.ok(bounds);
    const measured = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
    for (let latitude = -90; latitude <= 90; latitude += 2) {
      const lat = latitude * Math.PI / 180;
      for (let longitude = 0; longitude < 360; longitude += 2) {
        const lon = longitude * Math.PI / 180;
        const point = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon))
          .multiplyScalar(sphere.radius).add(center).applyMatrix4(camera.projectionMatrix);
        const x = (point.x + 1) * 640;
        const y = (1 - point.y) * 400;
        assert.ok(x >= bounds.left - 1e-8 && x <= bounds.right + 1e-8 && y >= bounds.top - 1e-8 && y <= bounds.bottom + 1e-8,
          'Projected sphere bounds must contain every sampled surface point');
        measured.left = Math.min(measured.left, x); measured.right = Math.max(measured.right, x);
        measured.top = Math.min(measured.top, y); measured.bottom = Math.max(measured.bottom, y);
      }
    }
    for (const edge of Object.keys(measured)) assert.ok(Math.abs(measured[edge] - bounds[edge]) < 0.2,
      `Projected ${edge} must closely match the silhouette`);
  }
}
assert.equal(projectCameraSphereBounds(new THREE.Sphere(new THREE.Vector3(0, 0, 1), 1), new THREE.Matrix4().elements, 390, 844), null);
console.log(`Marker layout: ${checked} reveal/layout cases passed; 16px clearance, readable text, stable placement; 4 independent sphere projections passed.`);
