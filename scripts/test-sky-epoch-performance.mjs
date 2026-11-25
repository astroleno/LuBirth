import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpus } from 'node:os';
import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

const baseline = '942d727b';
const modelPath = '/src/spikes/sky/skyModel.ts';
const oldModel = execFileSync('git', ['show', `${baseline}:${modelPath.slice(1)}`], { encoding: 'utf8' });
const locations = [{ latitude: 31.2304, longitude: 121.4737 }, { latitude: -33.87, longitude: 151.21 }];
const modern = '2026-10-24T12:00:00Z';
const ancient = '1037-01-14T13:04:40Z';

async function load(reference) {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'error',
    plugins: reference ? [{
      name: 'sky-epoch-reference', enforce: 'pre',
      transform(_, id) { if (id.endsWith(modelPath)) return oldModel; },
    }] : [],
  });
  try {
    return {
      ...await server.ssrLoadModule(modelPath),
      ...await server.ssrLoadModule('/src/astro/celestialState.ts'),
      ...await server.ssrLoadModule('/src/astro/referenceFrames.ts'),
      ...await server.ssrLoadModule('/src/spikes/sky/skyCatalog.ts'),
    };
  } finally { await server.close(); }
}

const [before, after] = [await load(true), await load(false)];

function prepare(runtime, value, location) {
  const celestial = typeof value === 'string' ? runtime.createCelestialState(value) : value;
  return { location, celestial, observer: runtime.createObserverState(celestial, location),
    earth: runtime.createEarthSceneFrame(celestial) };
}

function project(runtime, catalog, state, projection, motion) {
  const { celestial, observer, earth, location } = state;
  const frame = projection === 'earth'
    ? runtime.createWorldSkyFrame(catalog, celestial, observer, earth, motion)
    : runtime.createSkyFrame(catalog, celestial.date, location, motion, celestial);
  assert.equal(frame.celestial, celestial);
  assert.equal(frame.date, celestial.date);
  assert.equal(frame.years, celestial.years);
  assert.equal(frame.projection, projection);
  assert.equal(frame.motion, motion);
  assert.equal(frame.sunAlt, frame.observer.sun.altitudeDeg);
  if (projection === 'earth') {
    assert.equal(frame.key, earth.key);
    assert.equal(frame.observer, observer);
    assert.equal(frame.eqjBasis, earth.eqjToScene);
  } else {
    assert.equal(frame.key, observer.key);
    assert.equal(frame.eqjBasis, frame.observer.eqjToSky);
  }
  return frame;
}

const bytes = values => Buffer.from(values.buffer, values.byteOffset, values.byteLength);
const snapshot = ({ positions, aboveHorizon, hipIndex, projection, key, years, sunAlt, eqjBasis, observer }) => ({
  positions: bytes(positions), aboveHorizon, hipIndex: [...hipIndex], projection, key, years, sunAlt, eqjBasis,
  observer: observer.key,
});
const scenarios = [
  [modern, 0, 'horizon', true], [modern, 0, 'horizon', true],
  [modern, 0, 'earth', true], [modern, 1, 'horizon', true], [modern, 1, 'earth', true],
  [ancient, 0, 'earth', true], [modern, 0, 'horizon', true],
  [modern, 0, 'horizon', false], [modern, 1, 'earth', false], [ancient, 1, 'earth', false],
  [ancient, 0, 'horizon', false], [modern, 0, 'horizon', false],
  [ancient, 1, 'horizon', true], [modern, 0, 'horizon', true],
];

function verifyScenarios(runtime) {
  const frames = scenarios.map(([utc, site, projection, motion]) =>
    project(runtime, runtime.skyCatalog, prepare(runtime, utc, locations[site]), projection, motion));
  const first = frames[0];
  for (const frame of frames.slice(1)) {
    assert.notEqual(frame.positions, first.positions);
    assert.equal(frame.hipIndex, first.hipIndex);
  }
  for (const i of [1, 6, 13]) assert.deepEqual(bytes(frames[i].positions), bytes(first.positions));
  assert.deepEqual(bytes(frames[7].positions), bytes(frames[11].positions));
  assert.notDeepEqual(bytes(frames[7].positions), bytes(first.positions));
  return frames.map(snapshot);
}
assert.deepEqual(verifyScenarios(after), verifyScenarios(before));

function verifyIsolation(runtime) {
  const state = prepare(runtime, modern, locations[0]);
  const years = state.celestial.years;
  const star = (id, xv) => [id, id + 10, 0, 0, 1, null, xv, 1, 0, 1e8, 0, 0];
  const catalogs = [
    { stars: [star(1, -1e8 * years)], hipAliases: [] },
    { stars: [star(2, 1e8 * years)], hipAliases: [] },
  ];
  const perturbed = { ...state, celestial: { ...state.celestial, years: years + 1e-8 } };
  const frames = [
    project(runtime, catalogs[0], state, 'earth', true),
    project(runtime, catalogs[1], state, 'earth', true),
    project(runtime, catalogs[0], perturbed, 'earth', true),
    project(runtime, catalogs[0], state, 'earth', true),
  ];
  assert.notEqual(frames[0].hipIndex, frames[1].hipIndex);
  assert.notDeepEqual(bytes(frames[0].positions), bytes(frames[1].positions));
  assert.notDeepEqual(bytes(frames[0].positions), bytes(frames[2].positions));
  assert.deepEqual(bytes(frames[0].positions), bytes(frames[3].positions));
  frames[3].positions.fill(0);
  const rebuilt = project(runtime, catalogs[0], state, 'earth', true);
  assert.deepEqual(bytes(rebuilt.positions), bytes(frames[0].positions));

  // The double-precision y value is positive even though the stored Float32 rounds to zero.
  const boundary = { ...state, earth: { ...state.earth, eqjToScene: [[1, 1e-46, 0], [0, 0, 0], [0, 0, 1]] } };
  const frame = project(runtime, catalogs[0], boundary, 'earth', false);
  assert.equal(frame.positions[1], 0);
  assert.equal(frame.aboveHorizon, 1);
  return [...frames, rebuilt, frame].map(snapshot);
}
assert.deepEqual(verifyIsolation(after), verifyIsolation(before));

// Read counts distinguish a cache hit from recalculating identical values.
let directionReads = 0;
const fixtureStar = [1, 11, 0, 0, 1, null, 1, 0, 0, 0, 1, 0];
Object.defineProperty(fixtureStar, 2, { get() { directionReads++; return 0; } });
const fixtureCatalog = { stars: [fixtureStar], hipAliases: [] };
const modernFixture = prepare(after, modern, locations[0]);
const ancientFixture = prepare(after, ancient, locations[1]);
for (const [state, motion, expectedReads] of [
  [modernFixture, true, 1], [modernFixture, true, 1], [ancientFixture, true, 2], [modernFixture, true, 3],
  [modernFixture, false, 4], [ancientFixture, false, 4], [modernFixture, true, 5],
]) {
  project(after, fixtureCatalog, state, 'earth', motion);
  assert.equal(directionReads, expectedReads);
}

const stats = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return { medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.ceil(.95 * sorted.length) - 1] };
};

function bench(runtime) {
  const catalog = runtime.skyCatalog;
  const sameUtc = prepare(runtime, modern, locations[0]);
  const otherLocation = prepare(runtime, sameUtc.celestial, locations[1]);
  const horizon = state => runtime.createSkyFrame(catalog, state.celestial.date, state.location, true, state.celestial);
  const world = (state, stars = catalog) => runtime.createWorldSkyFrame(stars, state.celestial, state.observer, state.earth, true);
  const timeStates = Array.from({ length: 8 }, (_, i) =>
    prepare(runtime, new Date(Date.parse(modern) + i * 3_600_000).toISOString(), locations[0]));
  return {
    sameUtcProjectionSwitch() {
      for (let i = 0; i < 4; i++) { horizon(sameUtc); world(sameUtc); }
    },
    sameUtcObserverChange() {
      for (let i = 0; i < 4; i++) { horizon(sameUtc); horizon(otherLocation); }
    },
    distinctTimestamps() {
      for (const state of timeStates) world(state);
    },
    firstCatalogProjection() {
      world(sameUtc, { ...catalog });
    },
  };
}

const builds = [bench(before), bench(after)];
const samples = builds.map(() => ({}));
for (const scenario of Object.keys(builds[0])) {
  const projections = scenario === 'firstCatalogProjection' ? 1 : 8;
  for (const sample of samples) sample[scenario] = [];
  for (let i = 0; i < 100; i++) {
    for (const index of i % 2 ? [1, 0] : [0, 1]) {
      const start = performance.now();
      builds[index][scenario]();
      if (i >= 20) samples[index][scenario].push((performance.now() - start) / projections);
    }
  }
}
const timings = sample => Object.fromEntries(Object.entries(sample).map(([scenario, values]) => [scenario, stats(values)]));
console.log(JSON.stringify({ baseline, node: process.version, cpu: cpus()[0].model,
  stars: after.skyCatalog.stars.length,
  epochBufferBytes: after.skyCatalog.stars.length * 3 * Float64Array.BYTES_PER_ELEMENT,
  frameScenarios: scenarios.length,
  checks: ['byte-identical positions and frame semantics', 'epoch and motion switches',
    'independent catalogs and output arrays', 'positive altitude counted before Float32 rounding'],
  before: timings(samples[0]), after: timings(samples[1]) }, null, 2));
