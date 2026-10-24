import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { createServer } from 'vite';

const data = JSON.parse(await fs.readFile('src/spikes/sky/data/historical-cultures.json', 'utf8'));
const base = JSON.parse(await fs.readFile('src/spikes/sky/data/catalog.json', 'utf8'));
const catalog = { ...base, stars: [...base.stars, ...data.extraStars], hipAliases: [...base.hipAliases, ...data.hipAliases] };
const checks = [];
const test = async (name, run) => { await run(); checks.push(name); console.log('PASS', name); };
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { createSkyFrame, cultureGeometry } = await server.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  const { SKY_SYSTEMS } = await server.ssrLoadModule('/src/spikes/sky/skyCultures.ts');
  const { createStarGeometry } = await server.ssrLoadModule('/src/spikes/sky/SkyObjects.tsx');
  const { skyCatalog } = await server.ssrLoadModule('/src/spikes/sky/skyCatalog.ts');
  await test('Historical extra stars have matching position, magnitude and color buffers in the renderer', () => {
    const frame = createSkyFrame(skyCatalog, new Date('1037-01-14T13:04:40Z'), { latitude: 30, longitude: 103 });
    const geometry = createStarGeometry(frame);
    try {
      for (const key of ['position', 'magnitude', 'tint']) assert.equal(geometry.getAttribute(key).count, skyCatalog.stars.length);
      assert.equal(skyCatalog.stars.length, base.stars.length + 2);
      assert.throws(() => createStarGeometry({ ...frame, positions: frame.positions.slice(3) }), /same catalog/);
    } finally { geometry.dispose(); }
  });
  await test('Frozen cultural sources retain every drawing and verifiable licenses', async () => {
    for (const [id, count] of [['chenzhuo', 317], ['yuan', 187]]) {
      const raw = await fs.readFile(`reference/sky/historical-cultures/${id}-index.json`);
      const item = data.cultures.find(c => c.id === id), provenance = data.provenance.find(c => c.id === id);
      assert.equal(item.items.length, count);
      assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), provenance.indexSha256);
      assert.equal(provenance.license, 'CC BY-SA 4.0');
      assert.deepEqual(item.items.map(c => c.lines), JSON.parse(raw).constellations.map(c => c.lines));
      assert.equal(new Set(item.items.map(c => c.id)).size, count);
    }
  });
  await test('Every positive HIP endpoint resolves; deep-sky exceptions and component proxy stay explicit', () => {
    const known = new Set([...catalog.stars.map(s => s[1]), ...catalog.hipAliases.map(a => a.hip)]);
    assert.equal(new Set(catalog.stars.map(s => s[0])).size, catalog.stars.length);
    for (const culture of data.cultures) {
      const nonStars = new Set();
      for (const item of culture.items) for (const id of item.lines.flat()) {
        if (typeof id === 'number') assert.ok(known.has(id), String(id));
        else nonStars.add(id);
      }
      assert.deepEqual([...nonStars].sort(), ['DSO:M31', 'DSO:M44', 'DSO:M7']);
      assert.deepEqual([...nonStars].sort(), culture.nonStellarObjects);
    }
    assert.equal(data.extraStars.length, 2);
    assert.equal(data.hipAliases[0].hip, 115125);
    assert.equal(catalog.stars.find(s => s[0] === data.hipAliases[0].hyg)[1], 115126);
  });
  await test('Switching culture never mutates the sky frame or maps Song artwork into another version', () => {
    for (const [utc, latitude, longitude] of [['0353-04-23T12:00Z', 30, 120], ['1037-01-14T11:54:06Z', 30, 103], ['1363-06-21T20:00Z', -33, 151]]) {
      const frame = createSkyFrame(catalog, new Date(utc), { latitude, longitude });
      const before = Array.from(frame.positions);
      for (const id of ['chenzhuo', 'yuan', 'song', 'modern']) {
        const geometry = cultureGeometry(SKY_SYSTEMS[id].items, frame, 'all');
        assert.ok(geometry.length > 100 && geometry.every(Number.isFinite), id);
        assert.deepEqual(Array.from(frame.positions), before);
      }
    }
    assert.equal(SKY_SYSTEMS.song.items.filter(item => item.image).length, 28);
    assert.ok([...SKY_SYSTEMS.chenzhuo.items, ...SKY_SYSTEMS.yuan.items].every(item => !item.image));
  });
  console.log(JSON.stringify({ passed: checks.length, checks }));
} finally { await server.close(); }
