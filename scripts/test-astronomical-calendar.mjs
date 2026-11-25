import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const reference = JSON.parse(await readFile('reference/sky/astronomical-calendar-2026.json', 'utf8'));
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { HKO_CALENDAR_OFFSET_SECONDS, calendarClock, hkoDatesForNewMoon, hkoNewMoonOnDate, nextAstronomicalEvents }
    = await vite.ssrLoadModule('/src/astro/astronomicalCalendar.ts');
  const { NewMoonDates } = await vite.ssrLoadModule('/src/components/experience/AstronomicalCalendar.tsx');
  const { ianaOffsetSeconds } = await vite.ssrLoadModule('/src/history/ianaTime.ts');
  const { observationOffsetSeconds, resolveObservation } = await vite.ssrLoadModule('/src/history/observation.ts');
  const phases = ['朔（新月）', '上弦', '望（满月）', '下弦'];
  const verify = (kind, longitude, name, time, zone, interval) => {
    const expected = Date.parse(`${reference.year}-${time.replace(' ', 'T')}:00${zone}`);
    const modeled = nextAstronomicalEvents(new Date(expected - 86400000))[kind];
    assert.equal(modeled.longitude, longitude);
    assert.equal(modeled.name, name);
    const modeledTime = Date.parse(modeled.utc);
    assert.equal(nextAstronomicalEvents(new Date(modeledTime - 1000))[kind].utc, modeled.utc);
    for (const offset of [0, 1000]) {
      const following = nextAstronomicalEvents(new Date(modeledTime + offset))[kind];
      assert.equal(following.longitude, (modeled.longitude + interval) % 360);
      assert.ok(Date.parse(following.utc) > modeledTime + offset);
    }
    return Math.abs(modeledTime - expected) / 1000;
  };
  const moon = reference.moonRows.flatMap(row => row.flatMap((time, index) => time
    ? [verify('moon', index * 90, phases[index], time, 'Z', 90)] : []));
  const terms = reference.termRows.map(([longitude, name, time]) => verify('solarTerm', longitude, name, time, '+08:00', 15));
  assert.equal(moon.length, 50);
  assert.equal(terms.length, 24);
  assert.ok(Math.max(...moon) <= 180, `USNO max error ${Math.max(...moon)} seconds`);
  assert.ok(Math.max(...terms) <= 180, `HKO max error ${Math.max(...terms)} seconds`);
  assert.equal(nextAstronomicalEvents('2026-12-31T23:59:00Z').solarTerm.name, '小寒');
  assert.match(nextAstronomicalEvents('2026-12-31T23:59:00Z').moon.utc, /^2027-/);
  assert.ok(nextAstronomicalEvents('0001-01-01T00:00:00Z').solarTerm);
  assert.deepEqual(nextAstronomicalEvents('2999-12-31T23:59:59Z'), { moon: null, solarTerm: null });
  assert.throws(() => nextAstronomicalEvents('2026-02-30T00:00:00Z'));

  const example = '2026-04-04T18:40:00.000Z';
  assert.equal(calendarClock(example, 8 * 3600), '2026-04-05 02:40');
  assert.equal(calendarClock(example, observationOffsetSeconds({ kind: 'offset', offsetMinutes: 330 }, 0)), '2026-04-05 00:10');
  assert.equal(calendarClock('2026-01-01T02:04:00Z', -5 * 3600), '2025-12-31 21:04');
  assert.equal(calendarClock('2026-04-04T15:59:45Z', HKO_CALENDAR_OFFSET_SECONDS), '2026-04-04 23:59');
  assert.equal(calendarClock('2026-04-04T16:00:15Z', HKO_CALENDAR_OFFSET_SECONDS), '2026-04-05 00:00');
  assert.equal(calendarClock('2026-04-04T23:58:45Z', 0), '2026-04-04 23:59');
  const place = { name: '黄州代表点', latitude: 30.447435, longitude: 114.878934,
    precision: 'representative', note: '用于测试' };
  const lmt = { kind: 'local-mean-solar' };
  const offset = observationOffsetSeconds(lmt, place.longitude);
  assert.equal(offset, 27571);
  assert.equal(calendarClock('1083-11-30T16:20:29Z', offset), '1083-12-01');
  assert.equal(calendarClock('1083-11-30T16:20:28Z', offset), '1083-11-30');
  assert.equal(resolveObservation('1083-12-01', '00:00', place, lmt, { kind: 'birth', label: '测试' }).utc,
    '1083-11-30T16:20:29.000Z');

  const hkoOffset = () => HKO_CALENDAR_OFFSET_SECONDS;
  const boundaryMoons = [
    ['1914-11-17', '1914-11-18', '1914-11-17T16:02:15.000Z', '1914-11-18', false],
    ['1916-02-03', '1916-02-04', '1916-02-03T16:05:51.000Z', '1916-02-04', false],
    ['1920-11-10', '1920-11-11', '1920-11-10T16:05:26.000Z', '1920-11-11', false],
    ['2057-09-28', '2057-09-29', '2057-09-28T16:00:40.000Z', '2057-09-29 00:01', true],
    ['2089-09-04', '2089-09-04', '2089-09-04T15:58:07.000Z', '2089-09-04 23:58', true],
    ['2097-08-07', '2097-08-08', '2097-08-07T16:00:15.000Z', '2097-08-08 00:00', true],
  ];
  for (const [publishedDate, modeledDate, utc, modeledClock, midnightUncertainty] of boundaryMoons) {
    const event = nextAstronomicalEvents(new Date(Date.parse(utc) - 86400000)).moon;
    assert.equal(event.utc, utc);
    assert.equal(event.longitude, 0);
    const dates = { publishedDate, modeledDate, utc, midnightUncertainty };
    assert.deepEqual(hkoDatesForNewMoon(event.utc), dates);
    assert.deepEqual(hkoNewMoonOnDate(publishedDate, hkoOffset), dates);
    assert.deepEqual(hkoNewMoonOnDate(modeledDate, hkoOffset), dates);
    assert.equal(calendarClock(event.utc, HKO_CALENDAR_OFFSET_SECONDS), modeledClock);
    assert.notEqual(nextAstronomicalEvents(utc).moon.longitude, 0);
    const markup = renderToStaticMarkup(React.createElement(NewMoonDates,
      { event: dates, offset: HKO_CALENDAR_OFFSET_SECONDS, timeLabel: 'Asia/Hong_Kong' }));
    assert.match(markup, /推算朔（新月，UTC\+8）/);
    if (midnightUncertainty) {
      assert.match(markup, /香港天文台历表<\/a>初一（UTC\+8）/);
      assert.match(markup, /远期朔时/);
    } else {
      assert.match(markup, /香港天文台历表<\/a>初一<\/span>/);
      assert.match(markup, /历史历表沿用当时的日界.*北京地方平时/);
    }
  }
  assert.equal(hkoNewMoonOnDate('2026-02-17', hkoOffset), null);
  const ordinaryNewMoon = nextAstronomicalEvents('2026-02-16T00:00:00Z').moon;
  assert.equal(ordinaryNewMoon.longitude, 0);
  assert.equal(hkoDatesForNewMoon(ordinaryNewMoon.utc), null);
  const kiritimatiDate = hkoNewMoonOnDate('2089-09-05', instant => ianaOffsetSeconds('Pacific/Kiritimati', instant));
  assert.equal(kiritimatiDate.publishedDate, '2089-09-04');
  assert.equal(calendarClock(kiritimatiDate.utc, 14 * 3600), '2089-09-05 05:58');
  const dstOffset = ianaOffsetSeconds('America/New_York', new Date(boundaryMoons[3][2]));
  assert.equal(dstOffset, -4 * 3600);
  assert.equal(calendarClock(boundaryMoons[3][2], dstOffset), '2057-09-28 12:01');

  console.log(JSON.stringify({
    moon: { samples: moon.length, maximumSeconds: Math.max(...moon) },
    solarTerms: { samples: terms.length, maximumSeconds: Math.max(...terms) },
    nearMidnightNewMoons: boundaryMoons.length,
  }, null, 2));
} finally { await vite.close(); }
