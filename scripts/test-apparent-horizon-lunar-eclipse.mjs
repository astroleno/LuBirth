import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';

const fixture = JSON.parse(await readFile(new URL('../reference/sky/horizon-and-lunar-eclipse.json', import.meta.url)));
const cacheDir = await mkdtemp(join(tmpdir(), 'lubirth-horizon-'));
const vite = await createServer({ configFile: false, cacheDir, server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });

function findTransition(utc, acceptsLater) {
  const published = Date.parse(utc);
  let before = published - 180000, after = published + 180000;
  assert.equal(acceptsLater(new Date(before)), false, utc);
  assert.equal(acceptsLater(new Date(after)), true, utc);
  while (after - before > 1000) {
    const mid = (before + after) / 2;
    if (acceptsLater(new Date(mid))) after = mid;
    else before = mid;
  }
  return { date: new Date(after), differenceSeconds: (after - published) / 1000 };
}

try {
  const { createCelestialState, createObserverState } = await vite.ssrLoadModule('/src/astro/celestialState.ts');
  const { apparentHorizonDisk } = await vite.ssrLoadModule('/src/astro/apparentHorizon.ts');
  const { lunarShadow, projectLunarShadow } = await vite.ssrLoadModule('/src/astro/lunarShadow.ts');
  const { applyFrame, horizonCoordinates, angleDegrees, wrapDegrees } = await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const observer = (date, location = fixture.riseSet.location) => createObserverState(createCelestialState(date), location);
  const disk = (date, body, location) => apparentHorizonDisk(observer(date, location)[body]);

  const riseSet = fixture.riseSet.events.map(({ body, direction, utc, azimuthDeg }) => {
    const { date, differenceSeconds } = findTransition(utc, time => (disk(time, body).visibility !== 'below') === (direction === 'rise'));
    const geometric = observer(date)[body], apparent = apparentHorizonDisk(geometric);
    assert.ok(Math.abs(geometric.altitudeDeg + geometric.angularRadiusDeg + 34 / 60) < .005, utc);
    assert.ok(Math.abs(wrapDegrees(geometric.azimuthDeg - azimuthDeg)) < .6, utc);
    assert.ok(Math.abs(horizonCoordinates(apparent.direction).altitudeDeg - apparent.altitudeDeg) < 1e-7, utc);
    return { body, direction, computedUtc: date.toISOString(), differenceSeconds };
  });

  const taipei = { latitude: 25.033, longitude: 121.5654 };
  const visibility = time => disk(`2026-11-24T${time}:00Z`, 'moon', taipei).visibility;
  assert.deepEqual(['08:30', '08:33', '08:36'].map(visibility), ['below', 'partial', 'above']);
  assert.ok(observer('2026-11-24T08:33:00Z', taipei).moon.altitudeDeg < 0);
  for (let hour = 0; hour < 24; hour += 3) {
    assert.equal(disk(new Date(Date.UTC(2026, 5, 21, hour)), 'sun', { latitude: 85, longitude: 0 }).visibility, 'above');
    assert.equal(disk(new Date(Date.UTC(2026, 11, 21, hour)), 'sun', { latitude: 85, longitude: 0 }).visibility, 'below');
  }

  const contacts = fixture.lunarEclipse.contacts.map(({ utc, before, after }) => {
    const stage = time => lunarShadow(createCelestialState(time))?.kind ?? 'none';
    assert.equal(stage(new Date(Date.parse(utc) - 180000)), before);
    const { date, differenceSeconds } = findTransition(utc, time => stage(time) === after);
    return { before, after, computedUtc: date.toISOString(), differenceSeconds };
  });

  const partial = lunarShadow(createCelestialState('2022-11-08T09:45:00Z'));
  assert.equal(partial.kind, 'partial');
  const distance = Math.hypot(...partial.offset);
  assert.ok(distance - 1 < partial.umbra && distance + 1 > partial.umbra);
  const total = lunarShadow(createCelestialState('2022-11-08T11:00:00Z'));
  assert.equal(total.kind, 'total');
  assert.ok(Math.hypot(...total.offset) + 1 < total.umbra);
  const local = observer('2022-11-08T11:00:00Z', taipei);
  assert.equal(apparentHorizonDisk(local.moon).visibility, 'above');
  assert.ok(angleDegrees(applyFrame(local.eqjToMoonPortrait, local.moon.directionEqj), [0, 0, -1]) < 1e-8);
  const portrait = projectLunarShadow(total, local.eqjToMoonPortrait);
  assert.ok(Math.abs(Math.hypot(...portrait.offset) - Math.hypot(...total.offset)) < 1e-10);
  assert.equal(lunarShadow(createCelestialState('2026-11-24T12:00:00Z')), null);
  console.log(JSON.stringify({ riseSet, contacts, partial: partial.kind, taipeiTotal: total.kind }, null, 2));
} finally { await vite.close(); await rm(cacheDir, { recursive: true, force: true }); }
