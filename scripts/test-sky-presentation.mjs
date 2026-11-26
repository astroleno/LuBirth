import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Matrix4, PerspectiveCamera } from 'three';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(await readFile(new URL('../src/spikes/sky/data/catalog.json', import.meta.url)));
const artwork = JSON.parse(await readFile(new URL('../src/spikes/sky/data/chinese-art/manifest.json', import.meta.url)));
const vite = await createServer({ configFile: false, root, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const results = [];
function test(name, run) { run(); results.push(name); console.log('PASS', name); }
function viewProjection(camera) {
  camera.updateMatrixWorld(true);
  return new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
}
function losslessWebPSize(file) {
  assert.equal(file.toString('ascii', 0, 4), 'RIFF');
  assert.equal(file.toString('ascii', 8, 12), 'WEBP');
  assert.equal(file.readUInt32LE(4) + 8, file.length);
  for (let offset = 12; offset + 8 <= file.length;) {
    const length = file.readUInt32LE(offset + 4);
    const payload = offset + 8;
    assert.ok(payload + length <= file.length, 'WebP chunk exceeds the container');
    if (file.toString('ascii', offset, offset + 4) === 'VP8L') {
      assert.ok(length >= 5);
      assert.equal(file[payload], 0x2f);
      const flags = file.readUInt32LE(payload + 1);
      assert.equal((flags >>> 28) & 1, 1, 'line art must have transparency');
      return [(flags & 0x3fff) + 1, ((flags >>> 14) & 0x3fff) + 1];
    }
    offset = payload + length + (length % 2);
  }
  assert.fail('Missing lossless WebP image data');
}
try {
  const model = await vite.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  const presentation = await vite.ssrLoadModule('/src/spikes/sky/skyPresentation.ts');
  const { SKY_SYSTEMS } = await vite.ssrLoadModule('/src/spikes/sky/skyCultures.ts');
  const { FrameCadence, percentile } = await vite.ssrLoadModule('/src/spikes/sky/skyPerformance.ts');
  test('Quantized/jittered 60 Hz callbacks do not alternate 16/50 ms at the 30 Hz deadline', () => {
    for (const hz of [59.94, 60, 120]) {
      const cadence = new FrameCadence(), times = [];
      for (let i = 0; i < hz * 60; i++) {
        const now = Math.round(i * 1000 / hz * 2) / 2 + [.8, -.6, .1, .9][i % 4];
        if (cadence.take(now)) times.push(now);
      }
      const intervals = times.slice(1).map((time, i) => time - times[i]);
      assert.ok(percentile(intervals, .95) < 36, hz + ' Hz pacing');
      assert.ok(Math.abs(times.length - 1800) <= 2, hz + ' Hz count drift');
    }
  });
  test('Chinese hierarchy: six enclosure walls and 28 primary asterisms; all source records preserved', () => {
    const major = SKY_SYSTEMS.song.items.filter(presentation.isMajorCulture);
    assert.equal(major.length, 34);
    for (const group of ['dragon', 'tortoise', 'tiger', 'bird']) assert.equal(major.filter(item => presentation.cultureGroup(item) === group).length, 7);
    for (const group of ['purple', 'supreme', 'market']) assert.equal(major.filter(item => presentation.cultureGroup(item) === group).length, 2);
    assert.equal(SKY_SYSTEMS.song.items.length, 339);
  });
  test('113 artwork mappings reproduce all three HIP anchors across dates and hemispheres', () => {
    const art = [...SKY_SYSTEMS.song.items, ...SKY_SYSTEMS.modern.items].filter(item => item.image);
    assert.equal(art.length, 113);
    for (const [date, latitude, longitude] of [['2026-07-21T14:00Z', 31.23, 121.47], ['1052-06-21T14:00Z', -33.87, 151.21], ['2000-01-01T12:00Z', 70, 0]]) {
      const frame = model.createSkyFrame(catalog, new Date(date), { latitude, longitude });
      for (const { image } of art) for (const anchor of image.anchors) {
        const direction = model.illustrationDirection(image, frame, ...anchor.pos);
        const expected = Array.from(frame.positions.slice(frame.hipIndex.get(anchor.hip) * 3, frame.hipIndex.get(anchor.hip) * 3 + 3));
        assert.ok(Math.hypot(...direction.map((value, i) => value - expected[i])) < 1e-6, image.file);
      }
    }
  });
  const assetFacts = await Promise.all(artwork.entries.map(async entry => ({ entry,
    portrait: await readFile(root + '/src/spikes/sky/data/' + entry.image.file),
    line: await readFile(root + '/src/spikes/sky/data/' + entry.skyImage.file),
    delivery: await readFile(root + '/src/spikes/sky/data/' + entry.skyVariant.delivery.file),
    photo: await readFile(root + '/reference/sky/yuhuang-temple/photos/' + entry.photograph.localFile) })));
  test('All 28 paired assets have distinct source photographs, intact hashes and consistent aspect-preserving registrations', () => {
    assert.equal(artwork.entries.length, 28);
    assert.deepEqual(artwork.entries.map(entry => entry.number), Array.from({ length: 28 }, (_, i) => i + 1));
    assert.equal(new Set(artwork.entries.map(entry => entry.cultureId)).size, 28);
    assert.equal(new Set(artwork.entries.map(entry => entry.photograph.localFile)).size, 28);
    const songImages = new Map(SKY_SYSTEMS.song.items.map(item => [item.id, item.image]));
    for (const { entry, portrait, line, delivery, photo } of assetFacts) {
      assert.equal(createHash('sha256').update(portrait).digest('hex'), entry.sha256);
      assert.equal(createHash('sha256').update(line).digest('hex'), entry.skyVariant.sha256);
      assert.equal(portrait[25], 6, 'portrait must preserve RGBA transparency');
      assert.equal(line[25], 6, 'line art must preserve RGBA transparency');
      const encoded = entry.skyVariant.delivery;
      assert.equal(encoded.sourceSha256, entry.skyVariant.sha256);
      assert.equal(createHash('sha256').update(delivery).digest('hex'), encoded.sha256);
      assert.equal(delivery.length, encoded.bytes);
      assert.ok(delivery.length < line.length, 'WebP must reduce the line-art payload');
      assert.deepEqual(losslessWebPSize(delivery), entry.skyImage.size);
      assert.deepEqual(songImages.get(entry.cultureId), { ...entry.skyImage, file: encoded.file });
      assert.ok(Math.abs(portrait.readUInt32BE(16) / portrait.readUInt32BE(20) - line.readUInt32BE(16) / line.readUInt32BE(20)) < .005);
      entry.image.anchors.forEach((anchor, i) => {
        const paired = entry.skyImage.anchors[i]; assert.equal(anchor.hip, paired.hip);
        anchor.pos.forEach((pixel, axis) => assert.ok(Math.abs(pixel / entry.image.size[axis] - paired.pos[axis] / entry.skyImage.size[axis]) < .01));
      });
      assert.equal(entry.photograph.localFile, String(entry.number).padStart(2, '0') + '.jpg');
      assert.ok(photo.length > 10000 && entry.summary.length > 5);
      assert.equal(entry.skyVariant.derivedFrom, entry.image.file.split('/').pop());
    }
    assert.equal(artwork.entries[4].sha256, '343eb258d33aaf8ad4250a9c91ba0ee4e9f8425a69ed7ec4ad73d9a57473a0e8');
    assert.equal(artwork.entries[5].sha256, '014d33586194905231ba71afcb67d5cf91760824aa99bd51e3cf60d88284e1a9');
  });
  test('Portrait registrations preserve pixel proportions instead of stretching every drawing into a square', () => {
    const item = SKY_SYSTEMS.song.items.find(item => item.name === '心宿');
    const frame = model.createSkyFrame(catalog, new Date('2000-01-01T12:00Z'), { latitude: 0, longitude: 0 }, false);
    const image = presentation.createChineseIllustration(catalog, item, 'portrait.png', [900, 1200], 12);
    const center = model.illustrationDirection(image, frame, 450, 600);
    const angle = (x, y) => Math.acos(Math.min(1, model.illustrationDirection(image, frame, x, y).reduce((s, n, i) => s + n * center[i], 0)));
    // Compare nearby pixel steps to avoid finite-angle projection effects at the image corners.
    const horizontal = angle(451, 600), vertical = angle(450, 601);
    assert.ok(Math.abs(horizontal / vertical - 1) < .03);
  });
  test('Diffuse sky uses the same J2000 observer rotation as unpropagated catalog stars', () => {
    for (const latitude of [-33, 0, 70]) {
      const frame = model.createSkyFrame(catalog, new Date('2026-10-21T13:00Z'), { latitude, longitude: 121.47 }, false);
      for (let i = 0; i < catalog.stars.length; i += 251) {
        const star = catalog.stars[i], u = ((.5 - star[2] / 24) % 1 + 1) % 1, v = .5 + star[3] / 180;
        const phi = u * Math.PI * 2, theta = (1 - v) * Math.PI;
        const eqj = [-Math.cos(phi) * Math.sin(theta), Math.sin(phi) * Math.sin(theta), Math.cos(theta)];
        const world = [0, 1, 2].map(k => eqj.reduce((sum, value, j) => sum + value * frame.eqjBasis[j][k], 0));
        assert.ok(Math.hypot(...world.map((value, k) => value - frame.positions[i * 3 + k])) < 1e-6);
      }
    }
  });
  test('Portrait frustum rejects sideways objects and keeps selection within hard visibility budget', () => {
    const direction = (az, alt) => [Math.sin(az * Math.PI / 180) * Math.cos(alt * Math.PI / 180), Math.sin(alt * Math.PI / 180), -Math.cos(az * Math.PI / 180) * Math.cos(alt * Math.PI / 180)];
    const rectangle = (id, az, alt) => ({ item: { id }, center: direction(az, alt),
      corners: [[-.25, -.25], [.25, -.25], [.25, .25], [-.25, .25]].map(([x, y]) => direction(az + x, alt + y)) });
    const entries = Array.from({ length: 12 }, (_, i) => rectangle(String(i), i * 3, 20));
    entries.push(rectangle('outside', 40, 20), rectangle('below', 0, -30));
    const camera = new PerspectiveCamera(70, .46);
    camera.lookAt(...direction(0, 20));
    const visible = presentation.visibleArtwork(entries, viewProjection(camera), true, '4', 5).map(item => item.id);
    assert.equal(visible.length, 5); assert.equal(visible[0], '4'); assert.ok(!visible.includes('outside')); assert.ok(!visible.includes('below'));
  });
  test('Artwork must overlap the visible screen and the horizon in the same region', () => {
    const direction = (x, y) => [x, y, -1].map(value => value / Math.hypot(x, y, 1));
    const entries = [
      { item: { id: 'corner' }, center: direction(1, 1), corners: [[.9, .9], [1.2, .9], [1.2, 1.2], [.9, 1.2]].map(point => direction(...point)) },
      { item: { id: 'surrounds' }, center: direction(0, 0), corners: [[-3, -3], [3, -3], [3, 3], [-3, 3]].map(point => direction(...point)) },
      { item: { id: 'occluded' }, center: direction(1.1, -.1), corners: [[.7, -.35], [1, -.35], [1.5, .15], [1.2, .15]].map(point => direction(...point)) },
    ];
    const projection = viewProjection(new PerspectiveCamera(90, 1));
    const visible = ground => presentation.visibleArtwork(entries, projection, ground, 'all', 8).map(item => item.id);
    assert.deepEqual(new Set(visible(true)), new Set(['corner', 'surrounds']));
    assert.ok(visible(false).includes('occluded'));
  });
  test('Offset and roll use the same visible edges as the rendered camera', () => {
    const direction = (x, y) => [x, y, -1].map(value => value / Math.hypot(x, y, 1));
    const rectangle = (id, x, y) => ({ item: { id }, center: direction(x, y),
      corners: [[-.1, -.1], [.1, -.1], [.1, .1], [-.1, .1]].map(([dx, dy]) => direction(x + dx, y + dy)) });
    const entries = [rectangle('center', -.5, 0), rectangle('right', 1.5, 0), rectangle('top', 0, 1.5)];
    const camera = new PerspectiveCamera(90, 1);
    const visible = () => presentation.visibleArtwork(entries, viewProjection(camera), false, 'all', 8).map(item => item.id);
    assert.deepEqual(visible(), ['center']);
    camera.setViewOffset(200, 200, 100, 0, 200, 200);
    assert.deepEqual(visible(), ['right']);
    camera.rotateZ(Math.PI / 2);
    assert.deepEqual(visible(), ['center', 'top']);
  });
  test('25 / 70 / 110 degree views retain selected visible artwork, with at most eight residents', () => {
    const frame = model.createSkyFrame(catalog, new Date('2026-10-21T13:00Z'), { latitude: 31.23, longitude: 121.47 });
    const bounds = SKY_SYSTEMS.modern.items.map(item => presentation.artBounds(item, frame)).filter(Boolean);
    for (const fov of [25, 70, 110]) for (const aspect of [.46, 1, 2]) {
      const chosen = bounds[10];
      const camera = new PerspectiveCamera(fov, aspect);
      camera.lookAt(...chosen.center);
      const result = presentation.visibleArtwork(bounds, viewProjection(camera), false, chosen.item.id, 8);
      assert.equal(result[0].id, chosen.item.id); assert.ok(result.length <= 8);
    }
  });
  const png = await readFile(new URL('../src/spikes/sky/data/milky-way-density.png', import.meta.url));
  const background = JSON.parse(await readFile(new URL('../src/spikes/sky/data/milky-way-density.json', import.meta.url)));
  test('Background provenance points to NASA bright-star-excluded equatorial layer and matches output hash', () => {
    assert.match(background.source, /\/milkyway_2020_4k\.exr$/); assert.ok(!background.source.includes('_gal'));
    assert.equal(createHash('sha256').update(png).digest('hex'), background.outputSha256);
    assert.equal(png.readUInt32BE(16), 1024); assert.equal(png.readUInt32BE(20), 512);
  });
  console.log(JSON.stringify({ checks: results.length, results }, null, 2));
} finally { await vite.close(); }
