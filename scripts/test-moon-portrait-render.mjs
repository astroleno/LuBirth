// Validate snapshots collected after actual Earth and sky frames have rendered.
// Usage: node scripts/test-moon-portrait-render.mjs <browser-evidence.json>
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

assert.ok(process.argv[2], 'Provide actual browser evidence');
const { samples, physical } = JSON.parse(await readFile(process.argv[2], 'utf8'));
assert.ok(samples.length >= 3, 'Include crescent, quarter and gibbous frames');
for (const [low, high] of [[.1, .35], [.45, .55], [.85, .98]]) {
  assert.ok(samples.some(({ earth }) => earth.phaseFraction > low && earth.phaseFraction < high));
}
for (const { name, earth, sky } of samples) {
  assert.ok(earth.earthReady && sky.skyReady, name);
  assert.equal(earth.utc, sky.utc);
  assert.equal(earth.moonFrameKey, earth.observerKey);
  assert.equal(earth.moonFrameKey, sky.moonFrameKey);
  assert.equal(earth.moonCount, 1);
  assert.equal(sky.moonCount, 1);
  assert.equal(earth.placement, 'portrait');
  assert.equal(sky.placement, 'portrait');
  assert.equal(earth.portraitProjection, 1);
  assert.equal(sky.portraitProjection, 1);
  assert.ok(Math.abs(earth.phaseFraction - sky.moonFraction) < 1e-10);
  assert.ok(Math.hypot(...earth.moonSunDirectionView.map((v, i) => v - sky.sunLightView[i])) < 1e-10);
  for (const light of [earth.moonSunDirectionView, sky.sunLightView]) {
    assert.ok(Math.abs(Math.hypot(...light) - 1) < 1e-10);
    // Parallel projection must preserve the observer's apparent illuminated area.
    let lit = 0, total = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const nx = (x + .5) / 128 - 1, ny = (y + .5) / 128 - 1, r2 = nx * nx + ny * ny;
      if (r2 >= 1) continue;
      total++;
      if (nx * light[0] + ny * light[1] + Math.sqrt(1 - r2) * light[2] > 0) lit++;
    }
    assert.ok(Math.abs(lit / total - earth.phaseFraction) < .002, name);
  }
  console.log('PASS matching rendered portrait phase:', name);
}
assert.deepEqual(Object.keys(physical).sort(), ['earth', 'sky']);
for (const [view, state] of Object.entries(physical)) {
  assert.equal(state.placement, 'physical', view);
  assert.equal(state.portraitProjection, 0, view);
  assert.equal(state.moonCount, 1, view);
}
console.log(JSON.stringify({ samples: samples.length, physicalViews: Object.keys(physical).length, passed: true }));
