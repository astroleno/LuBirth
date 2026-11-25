import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { resolveCivilTime, ianaOffsetSeconds, supportsTimeZone } = await vite.ssrLoadModule('/src/history/ianaTime.ts');
  const { resolveObservation, readObservation, observationOffsetSeconds } = await vite.ssrLoadModule('/src/history/observation.ts');
  const { nextAstronomicalEvents, calendarClock } = await vite.ssrLoadModule('/src/astro/astronomicalCalendar.ts');
  const { createJourneyStore } = await vite.ssrLoadModule('/src/history/journeyStore.ts');
  const { IanaTimeFields } = await vite.ssrLoadModule('/src/history/ObservationForm.tsx');
  const place = (name, latitude, longitude, timeZone) => ({ name, latitude, longitude, timeZone,
    precision: 'user-selected', note: '用于测试' });
  const source = { kind: 'birth', label: '测试出生时刻' };
  const newYork = place('纽约', 40.71427, -74.00597, 'America/New_York');
  const shanghai = place('上海', 31.2304, 121.4737, 'Asia/Shanghai');
  const kolkata = place('加尔各答', 22.5726, 88.3639, 'Asia/Kolkata');
  const resolve = (date, time, observer, basis) => resolveObservation(date, time, observer, basis, source);

  const urumqi = { ...place('乌鲁木齐', 43.792818, 87.617733, 'Asia/Shanghai'), alternateTimeZone: 'Asia/Urumqi' };
  for (const [zone, utc] of [[urumqi.timeZone, '2025-07-01T12:00:00.000Z'],
    [urumqi.alternateTimeZone, '2025-07-01T14:00:00.000Z']]) {
    const match = await resolveCivilTime('2025-07-01', '20:00', zone);
    assert.equal(match.kind, 'unique');
    assert.equal(resolve('2025-07-01', '20:00', urumqi, match.basis).utc, utc);
    assert.equal(readObservation(resolve('2025-07-01', '20:00', urumqi, match.basis)).utc, utc);
    const markup = renderToStaticMarkup(React.createElement(IanaTimeFields, { zone, xinjiangClocks: true,
      check: { key: 'test', result: match, loading: false }, fold: '', onZoneChange() {}, onFoldChange() {} }));
    assert.match(markup, /北京时间（现行 UTC\+8）/);
    assert.match(markup, /新疆时间（现行 UTC\+6）/);
    assert.ok(markup.includes(`value="${zone}" selected=""`));
  }
  const shanghaiLmt = await resolveCivilTime('1900-01-01', '20:00', shanghai.timeZone);
  assert.equal(shanghaiLmt.kind, 'unique');
  assert.equal(shanghaiLmt.basis.offsetSeconds, 29143);
  assert.equal(resolve('1900-01-01', '20:00', shanghai, shanghaiLmt.basis).utc, '1900-01-01T11:54:17.000Z');
  const earlierClockMarkup = renderToStaticMarkup(React.createElement(IanaTimeFields, { zone: shanghai.timeZone,
    check: { key: 'test', result: shanghaiLmt, loading: false }, fold: '', onZoneChange() {}, onFoldChange() {} }));
  assert.match(earlierClockMarkup, /上海地方平太阳时/);

  for (const [observer, date, time, utc] of [
    [newYork, '2025-07-01', '20:00', '2025-07-02T00:00:00.000Z'],
    [newYork, '2025-01-01', '20:00', '2025-01-02T01:00:00.000Z'],
    [shanghai, '1990-07-01', '20:00', '1990-07-01T11:00:00.000Z'],
    [shanghai, '1990-01-01', '20:00', '1990-01-01T12:00:00.000Z'],
    [kolkata, '2026-07-01', '20:00', '2026-07-01T14:30:00.000Z'],
  ]) {
    const match = await resolveCivilTime(date, time, observer.timeZone);
    assert.equal(match.kind, 'unique');
    const observation = resolve(date, time, observer, match.basis);
    assert.equal(observation.utc, utc);
    assert.equal(ianaOffsetSeconds(observer.timeZone, new Date(utc)), match.basis.offsetSeconds);
    assert.deepEqual(readObservation(JSON.parse(JSON.stringify(observation))), observation);
  }
  assert.deepEqual(await resolveCivilTime('2025-03-09', '02:30', newYork.timeZone), { kind: 'gap' });
  assert.deepEqual(await resolveCivilTime('2011-12-30', '12:00', 'Pacific/Apia'), { kind: 'gap' });
  const overlap = await resolveCivilTime('2025-11-02', '01:30', newYork.timeZone);
  assert.equal(overlap.kind, 'overlap');
  assert.equal(resolve('2025-11-02', '01:30', newYork, overlap.earlier).utc, '2025-11-02T05:30:00.000Z');
  assert.equal(resolve('2025-11-02', '01:30', newYork, overlap.later).utc, '2025-11-02T06:30:00.000Z');
  const halfHourOverlap = await resolveCivilTime('2025-04-06', '01:45', 'Australia/Lord_Howe');
  assert.equal(halfHourOverlap.kind, 'overlap');
  assert.equal(halfHourOverlap.earlier.offsetSeconds - halfHourOverlap.later.offsetSeconds, 1800);
  assert.equal(supportsTimeZone('Somewhere/Unknown'), false);
  assert.equal(supportsTimeZone('+08:00'), false);

  const march8 = await resolveCivilTime('2025-03-08', '15:00', newYork.timeZone);
  const observation = resolve('2025-03-08', '15:00', newYork, march8.basis);
  assert.equal(observation.timeBasis.offsetSeconds, -18000);
  const equinox = nextAstronomicalEvents(observation.utc).solarTerm;
  assert.equal(equinox.name, '春分');
  const eventOffset = observationOffsetSeconds(observation.timeBasis, newYork.longitude, new Date(equinox.utc));
  assert.equal(eventOffset, -14400);
  assert.equal(calendarClock(equinox.utc, eventOffset), '2025-03-20 05:01');

  // Legacy offsets and already-resolved IANA snapshots are stable when session data is restored.
  const values = new Map();
  const session = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  for (const basis of [{ kind: 'offset', offsetMinutes: -300 }, { kind: 'local-mean-solar' },
    { kind: 'iana', timeZone: newYork.timeZone, offsetSeconds: -18000 }]) {
    const birth = resolve('2025-07-01', '20:00', newYork, basis);
    createJourneyStore({ session }).setBirth(birth);
    assert.deepEqual(createJourneyStore({ session }).getSnapshot().birth, birth);
    assert.equal(readObservation({ ...birth, utc: '2025-07-02T00:00:00.000Z' }), null);
  }
  console.log('PASS civil time, DST gaps/overlaps, calendar event offsets and stored observations');
} finally { await vite.close(); }
