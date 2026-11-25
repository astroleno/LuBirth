import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const reference = JSON.parse(await readFile('reference/sky/astronomical-calendar-2026.json', 'utf8'));
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { nextAstronomicalEvents, calendarClock } = await vite.ssrLoadModule('/src/astro/astronomicalCalendar.ts');
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
  const place = { name: '黄州代表点', latitude: 30.447435, longitude: 114.878934,
    precision: 'representative', note: '用于测试' };
  const lmt = { kind: 'local-mean-solar' };
  const offset = observationOffsetSeconds(lmt, place.longitude);
  assert.equal(offset, 27571);
  assert.equal(calendarClock('1083-11-30T16:20:29Z', offset), '1083-12-01');
  assert.equal(calendarClock('1083-11-30T16:20:28Z', offset), '1083-11-30');
  assert.equal(resolveObservation('1083-12-01', '00:00', place, lmt, { kind: 'birth', label: '测试' }).utc,
    '1083-11-30T16:20:29.000Z');

  console.log(JSON.stringify({
    moon: { samples: moon.length, maximumSeconds: Math.max(...moon) },
    solarTerms: { samples: terms.length, maximumSeconds: Math.max(...terms) },
  }, null, 2));
} finally { await vite.close(); }
