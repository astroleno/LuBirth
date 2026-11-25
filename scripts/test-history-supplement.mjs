import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const basePath = 'src/history/data/records.json';
const curatedPath = 'src/history/data/supplemental-events.json';
const baseHash = 'a82447980edfd206941ae42093c375d68e53effe44229fb340d0d95b9a5e3ea1';
const sha = value => createHash('sha256').update(value).digest('hex');
// Hash normalized record contents; exclude the provenance envelope containing the digest.
const byKey = value => Array.isArray(value) ? value.map(byKey)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, byKey(value[key])]))
    : value;

function julianJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a, m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}
const evidence = [
  { id: 'curated:tang-founding', civil: '0618-06-21', julian: [618, 6, 18], jdn: 1946951, utc: '0618-06-21T12:44:12.000Z',
    query: '李渊', original: /五月甲子/, site: '长安太极殿（今陕西西安）', coords: [34.263161, 108.948024],
    url: 'https://zh.wikisource.org/wiki/舊唐書/卷1' },
  { id: 'curated:william-i-coronation', civil: '1066-12-31', julian: [1066, 12, 25], jdn: 2110773, utc: '1066-12-31T20:00:31.000Z',
    query: '威廉一世', original: /25 December 1066/, site: '英国伦敦威斯敏斯特教堂（Westminster Abbey）', coords: [51.49939, -0.12736],
    url: 'https://www.westminster-abbey.org/history/coronations-at-the-abbey/a-history-of-coronations' },
  { id: 'curated:us-constitution-signing', civil: '1787-09-17', jdn: 2374008, utc: '1787-09-17T21:00:36.000Z',
    query: '独立厅', original: /September 17, 1787/, site: '美国费城独立厅（Independence Hall）', coords: [39.948611, -75.15],
    clock: '16:00', clockOrigin: 'history-window-example', clockLabel: '史载相关时段 · 约下午 4 点散会',
    url: 'https://www.archives.gov/milestone-documents/constitution' },
];

const baseContents = await fs.readFile(basePath), base = JSON.parse(baseContents);
const curated = JSON.parse(await fs.readFile(curatedPath));
assert.equal(sha(baseContents), baseHash);
assert.equal(base.length, 150);

const server = await createServer({
  configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false },
  appType: 'custom', logLevel: 'error',
  plugins: [{
    name: 'render-client-history-components-in-test',
    enforce: 'pre',
    transform(code, id) {
      if (!/\/src\/history\/(JourneyPanel|HistoricalObservation)\.tsx$/.test(id)) return;
      // Supply the current store snapshot and skip DOM layout effects for static rendering.
      return code.replace('journeyStore.subscribe, journeyStore.getSnapshot)',
        'journeyStore.subscribe, journeyStore.getSnapshot, journeyStore.getSnapshot)')
        .replace(/\buseLayoutEffect\(\(/g, 'useEffect((');
    },
  }],
});
try {
  const { historyCatalog, mergeHistoryCatalog } = await server.ssrLoadModule('/src/history/historyCatalog.ts');
  const { CALENDAR_LABELS } = await server.ssrLoadModule('/src/history/historyModel.ts');
  const { selectHistory, EARLY_PERIODS, WORLD_PERIOD } = await server.ssrLoadModule('/src/history/historyRelations.ts');
  const { createHistoricalDraft, historicalDraftObserver, createHistoryDraftCache, beginHistoricalPlaceEdit,
    cancelHistoricalPlaceEdit, createObserverDraft } = await server.ssrLoadModule('/src/history/observationDraft.ts');
  const { civilDate, historyObservation, readObservation } = await server.ssrLoadModule('/src/history/observation.ts');
  const { createJourneyStore } = await server.ssrLoadModule('/src/history/journeyStore.ts');
  const { default: HistoricalObservation } = await server.ssrLoadModule('/src/history/HistoricalObservation.tsx');
  const { default: JourneyPanel } = await server.ssrLoadModule('/src/history/JourneyPanel.tsx');

  assert.equal(historyCatalog.count, 153);
  assert.deepEqual(historyCatalog.records.slice(base.length, base.length + 2), curated.slice(0, 2));
  assert.deepEqual(historyCatalog.records.map(record => record.id), [...base, ...curated].map(record => record.id));
  const old = mergeHistoryCatalog(base, []);
  const counts = (rows, options) => selectHistory(rows, options).length;
  assert.equal(historyCatalog.monthDays, new Set([...base, ...curated].map(record => record.date.iso.slice(5))).size);
  assert.equal(counts(historyCatalog.records, { filter: 'event' }), 63);
  assert.equal(counts(historyCatalog.records, { filter: 'birth' }), 90);
  assert.equal(counts(historyCatalog.records, { filter: 'ready' }), counts(base, { filter: 'ready' }) + 3 + 9);
  assert.equal(counts(historyCatalog.records, { period: EARLY_PERIODS }), counts(base, { period: EARLY_PERIODS }) + 1);
  assert.equal(historyCatalog.periods[WORLD_PERIOD], old.periods[WORLD_PERIOD] + 2);
  assert.equal(historyCatalog.periods['隋唐'], old.periods['隋唐'] + 1);
  assert.throws(() => mergeHistoryCatalog(base, [curated[0], curated[0]]), /Duplicate history record ID/);
  assert.throws(() => mergeHistoryCatalog(base, [base[0]]), /Invalid history record ID/);
  const noop = () => {};
  const catalogMarkup = renderToStaticMarkup(React.createElement(JourneyPanel, { onClose: noop, onObserve: noop, onCulture: noop }));
  assert.match(catalogMarkup, new RegExp(`153 条资料，覆盖 ${historyCatalog.monthDays} 个公历月日`));
  assert.match(catalogMarkup, new RegExp(`世界资料<small>${historyCatalog.periods[WORLD_PERIOD]}</small>`));
  assert.match(catalogMarkup, new RegExp(`魏晋至明<small>${counts(historyCatalog.records, { period: EARLY_PERIODS })}</small>`));
  assert.match(catalogMarkup, new RegExp(`可直接看<small>${counts(historyCatalog.records, { filter: 'ready' })}</small>`));

  const coordinates = await fs.readFile('public/data/全国各地方省市经纬度及地方行政区号simple.csv', 'utf8');
  assert.match(coordinates, /^西安市,西安,108\.948024,34\.263161\s*$/m);
  const observers = [];
  for (const sample of evidence) {
    const record = historyCatalog.records.find(value => value.id === sample.id);
    const { provenance, ...body } = curated.find(value => value.id === sample.id);
    assert.equal(sha(JSON.stringify(byKey(body))), provenance.recordHash, sample.id);
    assert.equal(provenance.file, curatedPath);
    assert.equal(provenance.dataset, 'curated-events-v1');
    assert.equal(record.kind, 'event');
    assert.deepEqual(Object.keys(body.time), ['precision', 'note']);
    assert.equal(body.time.precision, 'date-only');
    if (sample.clock) {
      assert.equal(record.provenance.baseRecordHash, provenance.recordHash);
      assert.equal(record.time.precision, 'window');
      assert.equal(record.time.scope, 'related');
      assert.match(record.time.original, /约下午 4 点散会/);
    } else assert.equal(record.time.precision, 'date-only');
    assert.equal(record.date.iso, sample.civil);
    assert.match(record.date.original, sample.original);
    assert.equal(record.date.jdn, sample.jdn);
    assert.equal(civilDate(record.date.iso).getTime() / 86400000 + 2440588, sample.jdn);
    if (sample.julian) assert.equal(julianJdn(...sample.julian), sample.jdn);
    assert.equal(record.place.original, sample.site);
    assert.equal(record.place.observer.precision, 'representative');
    if (sample.coords) assert.deepEqual([record.place.observer.latitude, record.place.observer.longitude], sample.coords);
    assert.ok(record.sources.some(source => source.url === sample.url));
    assert.ok(record.sources.every(source => {
      const url = new URL(source.url);
      return url.protocol === 'https:' && !url.username && !url.password && !!source.title.trim();
    }));
    assert.ok(selectHistory(historyCatalog.records, { query: sample.query }).includes(record));
    assert.ok(selectHistory(historyCatalog.records, { query: sample.civil }).includes(record));
    assert.ok(selectHistory(historyCatalog.records, { filter: 'today', today: `2026-${sample.civil.slice(5)}` }).includes(record));
    const draft = createHistoricalDraft(record);
    const observer = historicalDraftObserver(record, draft);
    assert.deepEqual(observer, record.place.observer);
    assert.equal(draft.placeOpen, false);
    assert.equal(draft.basis, 'local-mean-solar');
    assert.equal(draft.clockChoice.clock, sample.clock ?? '20:00');
    assert.equal(draft.clockChoice.timeSelection.origin, sample.clockOrigin ?? 'event-default-20');
    const choices = { ...draft.clockChoice, observer, timeBasis: { kind: draft.basis }, dateAcknowledged: true, placeConfirmed: true };
    const observation = historyObservation(record, choices);
    assert.equal(observation.utc, sample.utc);
    assert.equal(observation.source.recordHash, record.provenance.recordHash);
    assert.equal(observation.source.recordId, sample.id);
    assert.deepEqual(readObservation(observation), observation);
    assert.throws(() => historyObservation(record, { ...choices, dateAcknowledged: false }));
    assert.throws(() => historyObservation(record, { ...choices, placeConfirmed: false }));
    const edited = beginHistoricalPlaceEdit(record, draft);
    const replacement = { ...observer, name: '另选观测地', longitude: 0, latitude: 0, precision: 'user-selected' };
    assert.deepEqual(historicalDraftObserver(record, { ...edited, placeMode: 'custom', custom: createObserverDraft(replacement) }), replacement);
    assert.deepEqual(historicalDraftObserver(record, cancelHistoricalPlaceEdit(edited)), observer);
    const markup = renderToStaticMarkup(React.createElement(HistoricalObservation, {
      record, initialDraft: { ...draft, sourceOpen: true }, onDraftChange: noop, onObserve: noop, onCulture: noop,
    }));
    for (const text of [record.date.original, record.place.original, CALENDAR_LABELS[record.date.status], record.date.note,
      sample.clockLabel ?? '未载时刻，默认当地晚上 8 点演示。', sample.url]) assert.ok(markup.includes(text), text);
    observers.push({ record, draft, observation });
  }
  assert.equal((evidence[0].jdn + 49) % 60, 0);
  assert.equal(evidence[2].coords[0], Number((39 + 56 / 60 + 55 / 3600).toFixed(6)));
  assert.equal(evidence[2].coords[1], -(75 + 9 / 60));

  const data = new Map(), storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const options = { session: storage, preferences: storage, now: new Date('2026-10-24T12:00:00Z') };
  const store = createJourneyStore(options);
  const personal = store.getSnapshot().current;
  store.toggleFavorite('dsh:H001');
  for (const { observation } of observers) {
    store.toggleFavorite(observation.source.recordId);
    store.enterHistory(observation);
    assert.deepEqual(createJourneyStore(options).getSnapshot().current, observation);
  }
  const restored = createJourneyStore(options);
  assert.deepEqual(restored.getSnapshot().favorites, ['dsh:H001', ...evidence.map(sample => sample.id)]);
  assert.equal(selectHistory(historyCatalog.records, { filter: 'saved', favorites: restored.getSnapshot().favorites }).length, 4);
  assert.throws(() => restored.toggleFavorite('other:tang-founding'), /Invalid record ID/);
  restored.returnToPersonal();
  assert.deepEqual(restored.getSnapshot().current, personal);
  const cache = createHistoryDraftCache(storage);
  const { record, draft } = observers[0];
  cache.set(record, { ...draft, watched: true });
  cache.flush();
  assert.equal(createHistoryDraftCache(storage).get(record).watched, true);
  assert.equal(createHistoryDraftCache(storage).get({ ...record, provenance: { ...record.provenance, recordHash: 'changed' } }).watched, false);
  cache.dispose();
  console.log(JSON.stringify({ base: base.length, curated: curated.length, combined: historyCatalog.count,
    periods: historyCatalog.periods, monthDays: historyCatalog.monthDays,
    demonstrations: observers.map(({ observation }) => [observation.source.recordId, observation.utc]) }));
} finally {
  await server.close();
}
