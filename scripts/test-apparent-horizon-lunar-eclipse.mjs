import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Body, GeoVector, KM_PER_AU, SearchMoonPhase } from 'astronomy-engine';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const fixture = JSON.parse(await readFile(new URL('../reference/sky/horizon-and-lunar-eclipse.json', import.meta.url)));
const cacheDir = await mkdtemp(join(tmpdir(), 'lubirth-horizon-'));
const vite = await createServer({ configFile: false, cacheDir, server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
const DAY_MS = 86_400_000;

function findTransition(utc, acceptsLater) {
  const published = new Date(utc).getTime();
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
  const { createCelestialState, createObserverState, EARTH_RADIUS_KM, SUN_RADIUS_KM } = await vite.ssrLoadModule('/src/astro/celestialState.ts');
  const { apparentHorizonDisk } = await vite.ssrLoadModule('/src/astro/apparentHorizon.ts');
  const { lunarShadow, projectLunarShadow } = await vite.ssrLoadModule('/src/astro/lunarShadow.ts');
  const { applyFrame, cross, dot, horizonCoordinates, angleDegrees, wrapDegrees } = await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const { MoonPlacementControl } = await vite.ssrLoadModule('/src/components/MoonPlacementControl.tsx');
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

  const stage = time => lunarShadow(createCelestialState(time))?.kind ?? 'none';
  const contacts = fixture.lunarEclipse.contacts.map(({ utc, before, after }) => {
    assert.equal(stage(new Date(Date.parse(utc) - 180000)), before);
    const { date, differenceSeconds } = findTransition(utc, time => stage(time) === after);
    return { before, after, computedUtc: date.toISOString(), differenceSeconds };
  });
  assert.ok(contacts.every(contact => Math.abs(contact.differenceSeconds) <= 30));
  for (const event of fixture.lunarEclipse.grazingEvents) assert.equal(stage(event.utc), event.kind, event.utc);
  const briefTotal = fixture.lunarEclipse.grazingEvents[0];
  const center = Date.parse(briefTotal.utc);
  const halfDuration = briefTotal.totalSeconds * 500;
  const totalBegin = findTransition(new Date(center - halfDuration), time => stage(time) === 'total').date;
  const totalEnd = findTransition(new Date(center + halfDuration), time => stage(time) !== 'total').date;
  const shortTotalSeconds = (totalEnd.getTime() - totalBegin.getTime()) / 1000;
  assert.ok(Math.abs(shortTotalSeconds - briefTotal.totalSeconds) < 60, shortTotalSeconds);

  const partial = lunarShadow(createCelestialState('2022-11-08T09:45:00Z'));
  assert.equal(partial.kind, 'partial');
  const distance = Math.hypot(...partial.offset);
  assert.ok(distance - 1 < partial.umbra && distance + 1 > partial.umbra);
  const totalState = createCelestialState('2022-11-08T11:00:00Z');
  const total = lunarShadow(totalState);
  assert.equal(total.kind, 'total');
  assert.ok(Math.hypot(...total.offset) + 1 < total.umbra);
  const local = observer('2022-11-08T11:00:00Z', taipei);
  assert.equal(apparentHorizonDisk(local.moon).visibility, 'above');
  assert.ok(local.phaseFraction > .999);
  assert.ok(angleDegrees(applyFrame(local.eqjToMoonPortrait, local.moon.directionEqj), [0, 0, -1]) < 1e-8);
  const portrait = projectLunarShadow(total, local.eqjToMoonPortrait);
  assert.ok(Math.abs(Math.hypot(...portrait.offset) - Math.hypot(...total.offset)) < 1e-10);
  const aberrated = GeoVector(Body.Sun, totalState.time, true);
  assert.ok(angleDegrees(total.axis, [-aberrated.x, -aberrated.y, -aberrated.z]) < 1e-10);
  assert.ok(angleDegrees(total.axis, totalState.sunEqjKm.map(value => -value)) > .005);
  const oppositeSite = { latitude: -taipei.latitude, longitude: taipei.longitude - 180 };
  const below = disk(totalState.date, 'moon', oppositeSite).visibility;
  assert.equal(below, 'below');
  for (const value of ['portrait', 'physical']) {
    const html = renderToStaticMarkup(React.createElement(MoonPlacementControl,
      { value, onChange() {}, eclipse: 'total', visibility: below }));
    assert.match(html, /月全食进行中，地影遮挡月面的直射阳光/);
    assert.match(html, /月面全部在当地地平线下/);
    assert.doesNotMatch(html, /可见月全食/);
  }
  assert.equal(lunarShadow(createCelestialState('2026-11-24T12:00:00Z')), null);

  let eclipseCatalog;
  if (process.argv[2]) {
    const html = await readFile(process.argv[2], 'utf8');
    const row = />\s*(09\d{3})<\/a>\s+(\d{4})\s+([A-Z][a-z]{2})\s+(\d{2})\s+([0-9:]+)\s+(\d+)\s+\d+\s+<a\b[^>]*>\d+<\/a>\s+([NPT])/g;
    const types = { N: 'penumbral', P: 'partial', T: 'total' };
    const catalog = [...html.matchAll(row)].map(([, id, year, month, day, clock, deltaT, type]) => ({
      id, utc: Date.parse(`${month} ${day} ${year} ${clock} GMT`) - Number(deltaT) * 1000, kind: types[type],
    }));
    assert.equal(catalog.length, 228);
    for (const event of catalog) assert.equal(stage(new Date(event.utc)), event.kind, event.id);
    // Find the nearest approach of the Moon's limb to the penumbra around each
    // uncatalogued full moon. Checking exact syzygy alone can miss a grazing overlap.
    const clearance = stamp => {
      const time = new Date(stamp);
      const sun = GeoVector(Body.Sun, time, true), moon = GeoVector(Body.Moon, time, false);
      const sunVector = [sun.x, sun.y, sun.z], moonVector = [moon.x, moon.y, moon.z];
      const sunDistance = Math.hypot(...sunVector);
      const axisDistance = -dot(moonVector, sunVector) / sunDistance;
      const lateralDistance = Math.hypot(...cross(moonVector, sunVector)) / sunDistance;
      return lateralDistance - axisDistance * (EARTH_RADIUS_KM + SUN_RADIUS_KM) / (sunDistance * KM_PER_AU);
    };
    let outsideCatalog = 0;
    let full = SearchMoonPhase(180, new Date('2001-01-01T00:00:00Z'), 40).date;
    while (full.getUTCFullYear() <= 2100) {
      const stamp = full.getTime();
      if (!catalog.some(event => Math.abs(event.utc - stamp) < DAY_MS)) {
        let before = stamp - DAY_MS / 4, after = stamp + DAY_MS / 4;
        while (after - before > 1000) {
          const third = (after - before) / 3;
          if (clearance(before + third) < clearance(after - third)) after -= third;
          else before += third;
        }
        assert.equal(stage(new Date((before + after) / 2)), 'none', full.toISOString());
        outsideCatalog++;
      }
      full = SearchMoonPhase(180, new Date(stamp + DAY_MS), 40).date;
    }
    eclipseCatalog = { catalogued: catalog.length, outsideCatalog };
  }
  console.log(JSON.stringify({ riseSet, contacts, shortTotalSeconds, partial: partial.kind, taipeiTotal: total.kind, eclipseCatalog }, null, 2));
} finally { await vite.close(); await rm(cacheDir, { recursive: true, force: true }); }
