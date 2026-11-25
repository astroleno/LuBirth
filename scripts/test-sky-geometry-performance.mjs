import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpus } from 'node:os';
import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

const baseline = '529054b2';
const skyPath = '/src/spikes/sky/';
const hookModule = 'virtual:sky-geometry-test-hooks';
const hookKey = Symbol.for(hookModule);
const objectNames = ['skyStars', 'skyConstellationLines', 'skyMinorConstellationLines', 'selected'];
const attributeNames = ['position', 'magnitude', 'tint'];
const now = '2026-10-24T12:00:00Z', historical = '1037-01-14T13:04:40Z';
const locations = [{ latitude: 31.2304, longitude: 121.4737 }, { latitude: -33.87, longitude: 151.21 }];
const bytes = array => Buffer.from(array.buffer, array.byteOffset, array.byteLength);
const checkStats = values => {
  const sorted = values.toSorted((a, b) => a - b);
  return { medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.ceil(.95 * sorted.length) - 1] };
};

// Exercise the component's actual memo dependencies and effect cleanup on the CPU.
// Browser rendering and GPU timing are outside this harness.
function mount(Component) {
  const slots = [];
  const gl = { getContext: () => ({ ALIASED_POINT_SIZE_RANGE: 1, getParameter: () => [1, 64] }) };
  const invalidate = () => {};
  let index, effects;
  const changed = (previous, deps) => !previous || deps.some((value, i) => !Object.is(value, previous.deps[i]));
  const hooks = {
    useMemo(factory, deps) {
      const slot = index++;
      if (changed(slots[slot], deps)) slots[slot] = { value: factory(), deps };
      return slots[slot].value;
    },
    useEffect(effect, deps) {
      const slot = index++;
      if (changed(slots[slot], deps)) effects.push(() => {
        slots[slot]?.cleanup?.();
        slots[slot] = { deps, cleanup: effect() };
      });
    },
    useThree: () => ({ gl, invalidate }),
    useFrame: callback => callback(),
  };
  return {
    render(props) {
      index = 0;
      effects = [];
      globalThis[hookKey] = hooks;
      try {
        const tree = Component(props);
        effects.forEach(effect => effect());
        const objects = new Map();
        function visit(node) {
          if (Array.isArray(node)) return node.forEach(visit);
          if (!node || typeof node !== 'object') return;
          if (node.props.geometry) objects.set(node.props.name ?? 'selected', node.props.geometry);
          visit(node.props.children);
        }
        visit(tree);
        return objects;
      } finally { delete globalThis[hookKey]; }
    },
    unmount() {
      slots.forEach(slot => slot.cleanup?.());
      slots.length = 0;
    },
  };
}

async function run(reference) {
  const source = new Map(reference ? ['skyModel.ts', 'SkyObjects.tsx'].map(file => [file, execFileSync('git',
    ['show', `${baseline}:${skyPath.slice(1)}${file}`], { encoding: 'utf8' })]) : []);
  const server = await createServer({
    configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error',
    plugins: [{
      name: 'sky-geometry-test', enforce: 'pre',
      resolveId(id) { if (id === hookModule) return '\0' + id; },
      load(id) {
        if (id === '\0' + hookModule) return ['useMemo', 'useEffect', 'useThree', 'useFrame']
          .map(name => `export const ${name} = (...args) => globalThis[Symbol.for('${hookModule}')].${name}(...args)`).join('\n');
      },
      transform(code, id) {
        if (id.endsWith(skyPath + 'skyModel.ts')) return source.get('skyModel.ts');
        if (id.endsWith(skyPath + 'SkyObjects.tsx')) return (source.get('SkyObjects.tsx') ?? code)
          .replace(/from '(react|@react-three\/fiber)'/g, `from '${hookModule}'`);
      },
    }],
  });
  try {
    const { createSkyFrame, createWorldSkyFrame } = await server.ssrLoadModule(skyPath + 'skyModel.ts');
    const { SkyObjects, createStarGeometry } = await server.ssrLoadModule(skyPath + 'SkyObjects.tsx');
    const { skyCatalog: catalog } = await server.ssrLoadModule(skyPath + 'skyCatalog.ts');
    const { SKY_SYSTEMS } = await server.ssrLoadModule(skyPath + 'skyCultures.ts');
    const { createCelestialState, createObserverState } = await server.ssrLoadModule('/src/astro/celestialState.ts');
    const { createEarthSceneFrame } = await server.ssrLoadModule('/src/astro/referenceFrames.ts');
    const frames = [now, historical].flatMap((utc, i) => {
      const celestial = createCelestialState(utc);
      const observer = createObserverState(celestial, locations[i]);
      const earth = createEarthSceneFrame(celestial);
      return [false, true].flatMap(motion => [
        () => createSkyFrame(catalog, celestial.date, locations[i], motion, celestial),
        () => createWorldSkyFrame(catalog, celestial, observer, earth, motion),
      ]);
    });
    const props = {
      magnitude: 6, daylight: 1, dpr: 1, ground: true, chinese: true,
      appearance: { brightness: 1, colorStrength: 1, glow: 1 }, view: { current: { fov: 60 } },
    };
    const snapshot = [];
    const firstStart = performance.now();
    const first = frames[0]();
    const firstStars = createStarGeometry(first);
    const coldFrameAndStarsMs = performance.now() - firstStart;
    firstStars.dispose();
    const app = mount(SkyObjects);
    for (const build of frames) {
      const frame = build();
      snapshot.push([bytes(frame.positions), [...frame.hipIndex], frame.aboveHorizon, frame.key, frame.projection]);
      for (const [items, chinese] of [[SKY_SYSTEMS.song.items, true], [SKY_SYSTEMS.modern.items, false]]) {
        for (const [culture, lines] of [['all', false], ['all', true], [items[0].id, true], [items[1].id, true], [items[0].id, false]]) {
          const objects = app.render({ ...props, frame, items, culture, lines, chinese });
          snapshot.push(objectNames.map(name => {
            const geometry = objects.get(name);
            return geometry && attributeNames.map(attributeName => {
              const attribute = geometry.getAttribute(attributeName);
              return attribute && [attribute.itemSize, bytes(attribute.array)];
            });
          }));
        }
      }
    }
    app.unmount();

    const [a, b] = frames.slice(0, 2).map(build => build());
    const fixtureStar = (hyg, hip) => [hyg, hip, 1, 2, 3, null, null, null, null, null, null, null];
    const fixture = { stars: [fixtureStar(10, 50), fixtureStar(10, 51), fixtureStar(11, 50), fixtureStar(12, null)],
      hipAliases: [{ hip: 53, hyg: 10 }, { hip: 55, hyg: 10 }, { hip: 54, hyg: 99 }, { hip: 53, hyg: 11 }] };
    const fixtureFrame = createSkyFrame(fixture, a.date, locations[0]);
    assert.deepEqual([...fixtureFrame.hipIndex], [[50, 2], [51, 1], [53, 2], [55, 0]]);
    snapshot.push([...fixtureFrame.hipIndex]);
    const overridden = createSkyFrame({ ...fixture, hipAliases: [...fixture.hipAliases, { hip: 50, hyg: 12 }] }, a.date, locations[0]);
    assert.deepEqual([...overridden.hipIndex], [[50, 3], [51, 1], [53, 2], [55, 0]]);
    if (!reference) {
      assert.equal(a.hipIndex, b.hipIndex);
      assert.notEqual(a.positions, b.positions);
      assert.notEqual(a.hipIndex, fixtureFrame.hipIndex);
      assert.notEqual(fixtureFrame.hipIndex, createSkyFrame({ ...fixture }, a.date, locations[0]).hipIndex);
      const starsA = createStarGeometry(a), starsB = createStarGeometry(b);
      for (const key of attributeNames) assert.notEqual(starsA.getAttribute(key), starsB.getAttribute(key));
      for (const key of ['magnitude', 'tint']) assert.equal(starsA.getAttribute(key).array, starsB.getAttribute(key).array);
      starsA.dispose();
      const starsC = createStarGeometry(a);
      assert.equal(starsC.getAttribute('tint').array, starsB.getAttribute('tint').array);
      starsB.dispose();
      starsC.dispose();

      const items = SKY_SYSTEMS.song.items;
      const settings = { ...props, items, frame: a, lines: true, culture: items[0].id };
      const initial = app.render(settings);
      const disposals = new Map([...initial].map(([name, geometry]) => {
        const counts = { value: 0 };
        geometry.addEventListener('dispose', () => counts.value++);
        return [name, counts];
      }));
      const selected = app.render({ ...settings, culture: items[1].id });
      for (const name of objectNames.slice(0, 3)) {
        assert.equal(selected.get(name), initial.get(name));
        assert.equal(disposals.get(name).value, 0);
      }
      assert.notEqual(selected.get('selected'), initial.get('selected'));
      assert.equal(disposals.get('selected').value, 1);
      const hidden = app.render({ ...settings, culture: items[1].id, lines: false });
      assert.deepEqual([...hidden.keys()], ['skyStars']);
      assert.equal(disposals.get('skyConstellationLines').value, 1);
      assert.equal(disposals.get('skyMinorConstellationLines').value, 1);
      const shown = app.render({ ...settings, culture: 'all' });
      assert.deepEqual([...shown.keys()], objectNames.slice(0, 3));
      assert.notEqual(shown.get('skyConstellationLines'), initial.get('skyConstellationLines'));
      app.unmount();
      assert.equal(disposals.get('skyStars').value, 1);
      const remounted = app.render(settings);
      assert.notEqual(remounted.get('skyStars'), initial.get('skyStars'));
      assert.deepEqual(bytes(remounted.get('skyStars').getAttribute('tint').array), bytes(initial.get('skyStars').getAttribute('tint').array));
      app.unmount();
    }

    const items = SKY_SYSTEMS.song.items;
    const settings = { ...props, frame: a, items, lines: true };
    function measure() {
      let start = performance.now();
      for (const build of frames) build();
      const frameTime = (performance.now() - start) / frames.length;
      start = performance.now();
      app.render({ ...settings, culture: 'all' });
      app.render({ ...settings, culture: items[0].id });
      app.render({ ...settings, culture: items[1].id });
      app.render({ ...settings, culture: items[1].id, lines: false });
      return { frameTime, selectionTime: (performance.now() - start) / 4 };
    }
    return { snapshot, measure, unmount: app.unmount, stats: { stars: catalog.stars.length, coldFrameAndStarsMs } };
  } finally { await server.close(); }
}

const before = await run(true);
const after = await run(false);
assert.deepEqual(after.snapshot, before.snapshot);
const samples = new Map([before, after].map(build => [build, []]));
for (let i = 0; i < 80; i++) {
  // Alternate the order so warm timings share the same host conditions.
  for (const build of i % 2 ? [after, before] : [before, after]) {
    const sample = build.measure();
    if (i >= 15) samples.get(build).push(sample);
  }
}
for (const [build, timings] of samples) {
  build.unmount();
  build.stats.frameUpdates = checkStats(timings.map(sample => sample.frameTime));
  build.stats.selectionAndVisibility = checkStats(timings.map(sample => sample.selectionTime));
}
console.log(JSON.stringify({ baseline, node: process.version, cpu: cpus()[0].model, frameCases: 8,
  componentCases: 80, before: before.stats, after: after.stats,
  checks: ['byte equality for typed attributes and line geometries', 'ordered HIP and alias precedence',
    'per-catalog index, shared static CPU arrays and independent attributes', 'selection, visibility, disposal and remount'] }, null, 2));
