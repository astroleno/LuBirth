import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as Astronomy from 'astronomy-engine';
import { createServer } from 'vite';
import { compareStellarium } from './compare-sky-stellarium.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = await readFile(new URL('../src/spikes/sky/data/catalog.json', import.meta.url));
const catalog = JSON.parse(data);
const manifest = JSON.parse(await readFile(new URL('../src/spikes/sky/data/manifest.json', import.meta.url), 'utf8'));
const vite = await createServer({ configFile: false, root, cacheDir: join(tmpdir(), 'lubirth-sky-spike-test-cache'),
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true }, appType: 'custom' });
let checks = 0;
function test(name, run) { run(); checks++; console.log(`PASS ${name}`); }
try {
  const model = await vite.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  const { FrameCadence } = await vite.ssrLoadModule('/src/spikes/sky/skyPerformance.ts');
  const { SKY_SYSTEMS } = await vite.ssrLoadModule('/src/spikes/sky/skyCultures.ts');
  const modernBytes = await readFile(new URL('../src/spikes/sky/data/modern.json', import.meta.url));
  const desktopReference = JSON.parse(await readFile(new URL('../src/spikes/sky/data/stellarium-reference.json', import.meta.url), 'utf8'));
  const external = compareStellarium(model, catalog, desktopReference);
  test('independent desktop reference: 60 geometric samples, modern catalog and coordinate transform', () => {
    assert.equal(external.sampleCount, 60);
    assert.ok(external.modernMaxArcsec < 10, 'Modern catalog difference exceeds 10 arcseconds');
    assert.ok(external.rotationMaxArcsec < 3, 'Shared-EQJ rotation difference exceeds 3 arcseconds');
    assert.ok(external.ancientOtherStarsMaxArcsec < 10);
  });
  test('historical binary discrepancies remain explicitly unresolved in the report', () => {
    assert.match(external.historicalCatalogStatus, /NOT_ALIGNED/);
    assert.ok(external.ancientMaxArcsec > 400 && external.ancientMaxArcsec < 430);
    const outliers = external.cases.flatMap(row => row.stars).filter(row => row.catalogDifferenceArcsec > 10);
    assert.deepEqual([...new Set(outliers.map(row => row.hip))].sort((a, b) => a - b), [32349, 71683]);
  });
  test('modern 88 and Chinese 28 are distinct complete source-backed layers', () => {
    assert.equal(SKY_SYSTEMS.modern.items.length, 88);
    assert.equal(SKY_SYSTEMS.mansions.items.length, 28);
    assert.equal(SKY_SYSTEMS.song.items.length, 339);
    assert.equal(new Set(SKY_SYSTEMS.modern.items.map(item => item.id)).size, 88);
    assert.equal(createHash('sha256').update(modernBytes).digest('hex'), manifest.modernCatalogSha256);
    const hips = new Set(catalog.stars.map(star => star[1]));
    for (const item of SKY_SYSTEMS.modern.items) {
      assert.match(item.name, /座$/);
      for (const hip of item.lines.flat()) assert.ok(hips.has(hip), 'Missing modern HIP ' + hip);
    }
    assert.equal(SKY_SYSTEMS.mansions.items[0].name, '角宿');
    assert.equal(SKY_SYSTEMS.mansions.items[27].name, '轸宿');
    assert.equal(SKY_SYSTEMS.mansions.items[7].name, '斗宿', 'must not select the unrelated asterism 斗');
  });
  test('30 Hz deadlines survive 59.94/60/120 Hz callbacks, jitter and suspension', () => {
    for (const hz of [59.94, 60, 120]) {
      const clock = new FrameCadence(), rendered = [];
      const duration = 60000;
      for (let i = 0; i * 1000 / hz < duration; i++) {
        const now = i * 1000 / hz + (i % 3 === 0 ? .8 : i % 3 === 1 ? -.5 : 0);
        if (clock.take(now)) rendered.push(now);
      }
      assert.ok(Math.abs(rendered.length - duration * 30 / 1000) <= 2, hz + ' Hz drift: ' + rendered.length);
      assert.ok(Math.max(...rendered.slice(1).map((t, i) => t - rendered[i])) < 52);
    }
    const clock = new FrameCadence();
    assert.equal(clock.take(0), true); assert.equal(clock.take(1), false);
    assert.equal(clock.take(5000), true); assert.equal(clock.take(5000), false);
    assert.equal(clock.take(5010), false); assert.equal(clock.take(5034), true);
    clock.reset(); assert.equal(clock.take(5034), true);
    const timelineClock = new FrameCadence(), arrivalTimes = [];
    for (let i = 0; i < 600; i++) {
      const frameTime = i * 1000 / 60;
      const callbackArrival = frameTime + (i % 4 < 2 ? 1.2 : .1);
      if (timelineClock.take(frameTime)) arrivalTimes.push(callbackArrival);
    }
    assert.ok(Math.max(...arrivalTimes.slice(1).map((time, i) => time - arrivalTimes[i])) < 35,
      'CPU callback queueing must not shift the display-frame cadence');
  });
  test('pinned data hash, IDs and finite catalog fields', () => {
    assert.equal(createHash('sha256').update(data).digest('hex'), manifest.catalogSha256);
    assert.equal(catalog.stars.length, manifest.retainedStars);
    assert.ok(catalog.stars.length > 8000 && catalog.stars.length < 15000);
    assert.ok(!catalog.stars.some(star => star[0] === 0), 'Sun is not a catalog star');
    assert.equal(new Set(catalog.stars.map(star => star[0])).size, catalog.stars.length);
    for (const star of catalog.stars) {
      assert.equal(star.length, 12);
      assert.ok(star.slice(2, 5).every(Number.isFinite));
      assert.ok(star[2] >= 0 && star[2] < 24 && Math.abs(star[3]) <= 90);
      assert.ok(star.slice(6).every(value => value === null) || star.slice(6).every(Number.isFinite));
    }
  });
  test('Song references use direct HIP matches or two explicit component proxies', () => {
    const hips = catalog.stars.map(star => star[1]).filter(id => id !== null);
    assert.equal(new Set(hips).size, hips.length);
    const references = new Set(catalog.culture.flatMap(item => item.lines.flat()).filter(id => typeof id === 'number'));
    for (const hip of references) assert.ok(hips.includes(hip) || catalog.hipAliases.some(alias => alias.hip === hip), `HIP ${hip} not resolved`);
    assert.deepEqual(manifest.missingDirectHipReferences, [55203, 78727]);
    for (const alias of catalog.hipAliases) {
      assert.ok(catalog.stars.some(star => star[0] === alias.hyg));
      assert.equal(alias.status, 'component-proxy-not-system-photocentre');
    }
    assert.equal(references.size, manifest.cultureHipReferences);
    assert.deepEqual(manifest.missingHipReferences, []);
    assert.deepEqual(manifest.unrenderedNonStellarObjects, ['DSO:M44', 'DSO:M7']);
    assert.match(catalog.lunarSystemUnverified.comment, /Needs confirmation/);
  });
  test('UTC parsing preserves years 1–99 and rejects normalized invalid dates', () => {
    assert.equal(model.parseUtcInput('0050-01-01T12:30').getUTCFullYear(), 50);
    assert.equal(model.parseUtcInput('0001-01-01T00:00').getUTCFullYear(), 1);
    assert.equal(model.parseUtcInput('2000-02-29T00:00').getUTCDate(), 29);
    for (const value of ['2026-02-30T00:00', '1900-02-29T12:00', '0000-01-01T00:00', '2026-01-01T24:00', '2026-13-01T00:00']) {
      assert.throws(() => model.parseUtcInput(value));
    }
  });
  test('right-handed horizon axes: north −Z, east +X, zenith +Y', () => {
    assert.deepEqual(model.horizonToWorld(1, 0, 0).map(x => x || 0), [0, 0, -1]);
    assert.deepEqual(model.horizonToWorld(0, -1, 0).map(x => x || 0), [1, 0, 0]);
    assert.deepEqual(model.horizonToWorld(0, 0, 1).map(x => x || 0), [0, 1, 0]);
    assert.throws(() => model.createSkyFrame(catalog, new Date(), { latitude: 91, longitude: 0 }));
  });
  let maxDifferenceDeg = 0;
  test('catalog vectors agree with separate RA/Dec→Horizon path across dates and hemispheres', () => {
    for (const value of ['0050-01-01T12:30', '1076-09-01T13:00', '2026-10-21T13:00']) {
      for (const place of [{ latitude: 31.2304, longitude: 121.4737 }, { latitude: -33.8688, longitude: 151.2093 }, { latitude: 70, longitude: 0 }]) {
        const date = model.parseUtcInput(value), time = new Astronomy.AstroTime(date);
        const observer = new Astronomy.Observer(place.latitude, place.longitude, 0);
        const frame = model.createSkyFrame(catalog, date, place, false);
        for (const hip of [11767, 32349, 91262, 69673, 65474, 30343]) {
          const index = frame.hipIndex.get(hip); assert.notEqual(index, undefined);
          const j2000 = model.starDirection(catalog.stars[index], 0, false);
          const eqd = Astronomy.EquatorFromVector(Astronomy.RotateVector(Astronomy.Rotation_EQJ_EQD(time), new Astronomy.Vector(...j2000, time)));
          const hor = Astronomy.Horizon(time, observer, eqd.ra, eqd.dec, null);
          const [x, y, z] = frame.positions.slice(index * 3, index * 3 + 3);
          const alt = Math.atan2(y, Math.hypot(x, z)) * 180 / Math.PI;
          const az = (Math.atan2(x, -z) * 180 / Math.PI + 360) % 360;
          const azDiff = Math.abs(((az - hor.azimuth + 540) % 360) - 180);
          const difference = Math.max(Math.abs(alt - hor.altitude), azDiff);
          maxDifferenceDeg = Math.max(maxDifferenceDeg, difference);
          assert.ok(difference < .0001, `${value} HIP ${hip}: ${difference}°`);
        }
      }
    }
  });
  const date = model.parseUtcInput('2026-10-21T13:00'), place = { latitude: 31.2304, longitude: 121.4737 };
  const frame = model.createSkyFrame(catalog, date, place, true);
  test('85 original illustration files have valid hashes, dimensions and HIP anchors', () => {
    assert.equal(manifest.illustrations.length, 85);
    assert.equal(SKY_SYSTEMS.modern.items.filter(item => item.image).length, 85);
    for (const item of SKY_SYSTEMS.modern.items) if (item.image) {
      assert.equal(item.image.anchors.length, 3);
      for (const anchor of item.image.anchors) {
        const index = frame.hipIndex.get(anchor.hip); assert.notEqual(index, undefined);
        const direction = model.illustrationDirection(item.image, frame, ...anchor.pos);
        assert.ok(direction && direction.every((value, k) => Math.abs(value - frame.positions[index * 3 + k]) < 1e-6));
      }
    }
  });
  for (const image of manifest.illustrations) {
    const bytes = await readFile(new URL('../src/spikes/sky/data/' + image.file, import.meta.url));
    assert.equal(bytes.length, image.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'), image.sha256);
  }
  test('modern Polaris altitude near observer latitude; time and place actually alter sky', () => {
    const index = frame.hipIndex.get(11767);
    const [x, y, z] = frame.positions.slice(index * 3, index * 3 + 3);
    assert.ok(Math.abs(Math.atan2(y, Math.hypot(x, z)) * 180 / Math.PI - place.latitude) < 1);
    const later = model.createSkyFrame(catalog, model.parseUtcInput('2026-10-21T19:00'), place, true);
    const southern = model.createSkyFrame(catalog, date, { latitude: -33.8688, longitude: 151.2093 }, true);
    assert.ok(southern.positions[index * 3 + 1] < 0, 'Polaris below Sydney horizon');
    assert.ok(frame.positions.some((value, i) => Math.abs(value - later.positions[i]) > .5));
    assert.ok(frame.sunAlt < -18);
    assert.ok(model.createSkyFrame(catalog, model.parseUtcInput('2026-10-21T04:00'), place).sunAlt > 0);
  });
  test('proper motion affects historical directions and preserves unit vectors', () => {
    const historical = model.createSkyFrame(catalog, model.parseUtcInput('1076-09-01T13:00'), place, true);
    const fixed = model.createSkyFrame(catalog, model.parseUtcInput('1076-09-01T13:00'), place, false);
    assert.ok(historical.positions.some((value, i) => Math.abs(value - fixed.positions[i]) > .001));
    for (let i = 0; i < historical.positions.length; i += 3) {
      assert.ok(Math.abs(Math.hypot(...historical.positions.slice(i, i + 3)) - 1) < .000001);
    }
  });
  test('all-culture arcs remain on sphere; selection narrows actual geometry', () => {
    const all = model.cultureGeometry(catalog.culture, frame, 'all');
    const one = model.cultureGeometry(catalog.culture, frame, catalog.culture[0].id);
    assert.ok(one.length > 0 && one.length < all.length);
    assert.equal(all.length % 6, 0);
    for (let i = 0; i < all.length; i += 3) assert.ok(Math.abs(Math.hypot(...all.slice(i, i + 3)) - 1) < .000001);
    assert.equal(model.cultureCenter({ lines: [['DSO:M7']] }, frame), null);
  });
  console.log(JSON.stringify({ checks, maxDifferenceDeg, stars: catalog.stars.length, hipReferences: manifest.cultureHipReferences,
    externalAstrometryComparison: { producer: external.producer, samples: external.sampleCount,
      modernMaxArcsec: external.modernMaxArcsec, rotationMaxArcsec: external.rotationMaxArcsec,
      ancientOtherStarsMaxArcsec: external.ancientOtherStarsMaxArcsec, ancientMaxArcsec: external.ancientMaxArcsec,
      historicalCatalogStatus: external.historicalCatalogStatus } }, null, 2));
} finally {
  await vite.close();
}
