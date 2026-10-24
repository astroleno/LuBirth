import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
const results = [];
try {
  const { resolveObservation, historyObservation, parseAbsoluteInstant, exampleObservation, readObservation } = await server.ssrLoadModule('/src/history/observation.ts');
  const { createJourneyStore } = await server.ssrLoadModule('/src/history/journeyStore.ts');
  const { selectHistory, relationLabel, monthDayDistance } = await server.ssrLoadModule('/src/history/historyRelations.ts');
  const { toUTCFromLocal, computeEphemeris } = await server.ssrLoadModule('/src/astro/ephemeris.ts');
  const { getEarthState } = await server.ssrLoadModule('/src/scenes/simple/api/earthState.ts');
  const { createSkyFrame } = await server.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  const { seasonalSunDirWorldYUp } = await server.ssrLoadModule('/src/scenes/simple/utils/lightingUtils.ts');
  const { calculateMoonPhase } = await server.ssrLoadModule('/src/scenes/simple/utils/moonPhaseCalculator.ts');
  const records = JSON.parse(await fs.readFile('src/history/data/records.json', 'utf8'));
  const catalog = JSON.parse(await fs.readFile('src/spikes/sky/data/catalog.json', 'utf8'));
  const shanghai = { name: '上海', latitude: 31.2304, longitude: 121.4737, precision: 'user-selected', note: '测试地点' };
  const birth = { kind: 'birth', label: '我的出生时刻' };
  const offset = minutes => ({ kind: 'offset', offsetMinutes: minutes });
  const test = (name, fn) => { fn(); results.push(name); console.log('PASS', name); };
  test('UTC offsets cross civil dates without applying host timezone', () => {
    assert.equal(resolveObservation('2000-01-01', '00:30', shanghai, offset(480), birth).utc, '1999-12-31T16:30:00.000Z');
    assert.equal(resolveObservation('2000-12-31', '23:30', shanghai, offset(-300), birth).utc, '2001-01-01T04:30:00.000Z');
  });
  test('Local mean solar time uses continuous longitude and preserves seconds', () => {
    const value = resolveObservation('1037-01-14', '20:00', shanghai, { kind: 'local-mean-solar' }, birth);
    assert.equal(value.utc, '1037-01-14T11:54:06.000Z');
    assert.equal(readObservation(value).utc, value.utc);
  });
  test('Early years, leap years and invalid civil/clock inputs are handled explicitly', () => {
    assert.equal(resolveObservation('0007-01-01', '12:00', shanghai, offset(0), birth).utc, '0007-01-01T12:00:00.000Z');
    assert.equal(resolveObservation('2000-02-29', '12:00', shanghai, offset(0), birth).civilDate, '2000-02-29');
    for (const date of ['1900-02-29', '2025-02-29', '2026-04-31', '0000-01-01'])
      assert.throws(() => resolveObservation(date, '12:00', shanghai, offset(0), birth));
    for (const clock of ['', '24:00', '12:60', '00:00:60']) assert.throws(() => resolveObservation('2026-01-01', clock, shanghai, offset(0), birth));
    assert.throws(() => resolveObservation('0001-01-01', '00:00', shanghai, offset(840), birth));
    assert.throws(() => resolveObservation('2000-01-01', '12:00', { ...shanghai, latitude: 91 }, offset(0), birth));
  });
  test('History requires clock, date acknowledgement and explicit observer selection', () => {
    const record = records.find(row => row.originalId === 'B03-01');
    const choices = { clock: '20:00', observer: record.place.observer, timeBasis: offset(480), dateAcknowledged: true, placeConfirmed: true };
    const value = historyObservation(record, choices);
    assert.equal(value.source.recordId, record.id);
    assert.ok(value.assumptions.some(item => item.includes('条件性')));
    assert.throws(() => historyObservation(record, { ...choices, clock: '' }));
    assert.throws(() => historyObservation(record, { ...choices, dateAcknowledged: false }));
    assert.throws(() => historyObservation(record, { ...choices, placeConfirmed: false }));
    assert.throws(() => historyObservation(record, { ...choices, observer: null }));
  });
  test('Absolute instants pass unchanged through Earth, Moon-compatible adapter and sky', () => {
    for (const value of ['1037-01-14T11:54:06.000Z', '0099-12-31T23:00:00Z', '2000-01-01T00:30:15+08:00']) {
      const instant = parseAbsoluteInstant(value);
      assert.equal(toUTCFromLocal(value, 121.5).getTime(), instant.getTime());
      assert.equal(toUTCFromLocal(value, -75).getTime(), instant.getTime());
      const earth = getEarthState(value, shanghai.latitude, shanghai.longitude);
      const direct = computeEphemeris(instant, shanghai.latitude, shanghai.longitude);
      const frame = createSkyFrame(catalog, instant, shanghai);
      assert.equal(frame.date.getTime(), instant.getTime());
      assert.equal(earth.illumination, direct.illumination);
      assert.ok(Number.isFinite(frame.sunAlt));
    }
    assert.throws(() => parseAbsoluteInstant('1900-02-29T00:00:00Z'));
    assert.throws(() => parseAbsoluteInstant('2000-01-01T00:00+14:01'));
  });
  test('Birthday matching follows local date; nearby season wraps the year and keeps leap day distinct', () => {
    const personal = resolveObservation('2000-01-14', '00:05', shanghai, offset(480), birth);
    const matches = selectHistory(records, { filter: 'birthday', birth: personal });
    assert.ok(matches.some(row => row.originalId === 'H002'));
    assert.ok(matches.every(row => row.date.iso.endsWith('-01-14')));
    assert.equal(monthDayDistance('2000-12-31', '2000-01-01'), 1);
    assert.equal(monthDayDistance('2000-02-28', '2000-02-29'), 1);
    assert.equal(selectHistory(records, { filter: 'birthday', birth: null }).length, 0);
    assert.match(relationLabel(matches[0], personal), /换算公历/);
    assert.ok(selectHistory(records, { query: '苏轼', filter: 'birth' }).length === 1);
  });
  test('Seasonal sun keeps fixed azimuth and correct early-year day numbers', () => {
    let yaw;
    for (const year of ['0007', '2007']) for (const [day, expected] of [['06-21', 23.44], ['12-21', -23.44]]) {
      const direction = seasonalSunDirWorldYUp(new Date(`${year}-${day}T12:00:00Z`), 0, 23.44, 0, 270);
      const altitude = Math.asin(direction.y) * 180 / Math.PI;
      const azimuth = Math.atan2(direction.z, direction.x);
      assert.ok(Math.abs(altitude - expected) < .1);
      if (yaw !== undefined) assert.ok(Math.abs(azimuth - yaw) < 1e-12);
      yaw = azimuth;
    }
    assert.deepEqual(seasonalSunDirWorldYUp(new Date('0007-06-21T12:00:00Z'), 121, 23.44, 0, 180),
      seasonalSunDirWorldYUp(new Date('2007-06-21T12:00:00Z'), 121, 23.44, 0, 180));
    assert.equal(calculateMoonPhase(new Date('0007-06-21T12:00:00Z'), 0, 0).moonRotation,
      calculateMoonPhase(new Date('2007-06-21T12:00:00Z'), 0, 0).moonRotation);
  });
  test('Catalog filters keep counts, era, favorites and an uncollected today honest', () => {
    assert.equal(selectHistory(records, { filter: 'birth' }).length, 90);
    assert.equal(selectHistory(records, { filter: 'event' }).length, 60);
    assert.equal(selectHistory(records, { period: '宋代' }).length, 7);
    assert.equal(selectHistory(records, { filter: 'today', today: '2000-02-29' }).length, 0);
    assert.equal(selectHistory(records, { query: '不存在的记录' }).length, 0);
    assert.deepEqual(selectHistory(records, { filter: 'saved', favorites: ['dsh:H002'] }).map(row => row.name), ['苏轼']);
  });
  test('Culture choice preserves observation; history return restores personal baseline', () => {
    const store = createJourneyStore({ now: new Date('2000-01-01T00:00Z') });
    const personal = resolveObservation('1993-08-01', '11:00', shanghai, offset(480), birth);
    store.setBirth(personal);
    store.setCulture('chenzhuo');
    assert.deepEqual(store.getSnapshot().current, personal);
    const record = records[0];
    store.enterHistory(historyObservation(record, { clock: '20:00', observer: record.place.observer,
      timeBasis: { kind: 'local-mean-solar' }, dateAcknowledged: true, placeConfirmed: true }));
    assert.equal(store.getSnapshot().birth.utc, personal.utc);
    store.returnToPersonal();
    assert.deepEqual(store.getSnapshot().current, personal);
    assert.equal(store.getSnapshot().culture, 'chenzhuo');
  });
  test('Browsing history before entering a birth preserves the prior example', () => {
    const store = createJourneyStore({ now: new Date('2000-01-01T00:00Z') }), original = store.getSnapshot().current;
    const record = records[0];
    const value = historyObservation(record, { clock: '20:00', observer: shanghai,
      timeBasis: offset(480), dateAcknowledged: true, placeConfirmed: true });
    store.enterHistory(value); store.enterHistory(value); store.returnToPersonal();
    assert.deepEqual(store.getSnapshot().current, original);
    assert.equal(store.getSnapshot().birth, null);
  });
  test('Session persistence, favorites and rejected storage retain a usable state', () => {
    const values = new Map(), storage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
    const store = createJourneyStore({ session: storage, preferences: storage });
    store.setBirth(resolveObservation('2000-01-01', '12:00', shanghai, offset(480), birth));
    store.toggleFavorite('dsh:H002'); store.setCulture('yuan');
    const restored = createJourneyStore({ session: storage, preferences: storage });
    assert.equal(restored.getSnapshot().culture, 'yuan');
    assert.deepEqual(restored.getSnapshot().favorites, ['dsh:H002']);
    assert.equal(restored.getSnapshot().birth.utc, store.getSnapshot().birth.utc);
    const failed = createJourneyStore({ preferences: { getItem: () => '{bad', setItem: () => { throw new Error('denied'); } } });
    failed.toggleFavorite('dsh:H002'); assert.ok(failed.getSnapshot().storageWarning);
    assert.deepEqual(failed.getSnapshot().favorites, ['dsh:H002']);
    assert.equal(readObservation({ ...exampleObservation(), utc: 'invalid' }), null);
  });
  console.log(JSON.stringify({ passed: results.length, checks: results }));
} finally { await server.close(); }
