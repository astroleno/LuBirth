import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const sha = async path => createHash('sha256').update(await fs.readFile(path)).digest('hex');
const data = 'src/history/data/';
const [raw, supplements, overlay, manifest, calendars] = await Promise.all([
  read(data + 'records.json'), read(data + 'supplemental-events.json'), read(data + 'evidence.json'),
  read(data + 'manifest.json'), read('reference/history/qing-calendar-sample.json'),
]);
assert.equal(await sha(data + 'records.json'), manifest.recordsSha256);
assert.equal(await sha(data + 'supplemental-events.json'), 'f45172e9edac03264d564537fbf4fa84d852bc7c936e7ad2d37754c348a761b2');
const server = await createServer({
  configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom', logLevel: 'error',
  plugins: [{
    name: 'history-evidence-static-form',
    enforce: 'pre',
    transform(code, id) {
      if (!/\/src\/history\/(HistoricalObservation|ObservationForm)\.tsx$/.test(id)) return;
      return code.replace('journeyStore.subscribe, journeyStore.getSnapshot)',
        'journeyStore.subscribe, journeyStore.getSnapshot, journeyStore.getSnapshot)').replaceAll('useLayoutEffect(', 'useEffect(');
    },
  }],
});

try {
  const { historyCatalog } = await server.ssrLoadModule('/src/history/historyCatalog.ts');
  const { historicalCalendarText } = await server.ssrLoadModule('/src/history/historyModel.ts');
  const { selectHistory, historyViewingNeeds, matchedHistorySource } = await server.ssrLoadModule('/src/history/historyRelations.ts');
  const { historyObservation, readObservation } = await server.ssrLoadModule('/src/history/observation.ts');
  const { resolveHistoryChoices } = await server.ssrLoadModule('/src/history/historyObservationPolicy.ts');
  const { createHistoricalDraft, createHistoryDraftCache, historicalDraftObserver } = await server.ssrLoadModule('/src/history/observationDraft.ts');
  const { default: HistoryForm } = await server.ssrLoadModule('/src/history/HistoricalObservation.tsx');
  const { ObservationSummary } = await server.ssrLoadModule('/src/history/ObservationForm.tsx');
  const { records } = historyCatalog;
  const byId = new Map(records.map(record => [record.id, record]));
  const find = id => byId.get('dsh:' + id);
  const noop = () => {};
  const markup = record => renderToStaticMarkup(React.createElement(HistoryForm, {
    record, initialDraft: { ...createHistoricalDraft(record), sourceOpen: true },
    onDraftChange: noop, onObserve: noop, onCulture: noop,
  }));

  assert.equal(byId.size, 153);
  let dates = 0;
  for (const original of [...raw, ...supplements]) {
    const current = byId.get(original.id);
    assert.equal(current.date.original, original.date.original, original.id);
    assert.equal(current.date.originalCalendar, original.date.originalCalendar, original.id);
    assert.equal(current.date.iso, original.date.iso, original.id);
    assert.equal(current.date.jdn, original.date.jdn, original.id);
    assert.equal(current.place.original, original.place.original, original.id);
    assert.deepEqual(current.sources, original.sources, original.id);
    if (!overlay.records[original.id]) assert.deepEqual(current, original, original.id);
    else {
      assert.equal(current.provenance.baseRecordHash, original.provenance.recordHash, original.id);
      assert.equal(current.provenance.recordHash, overlay.revisions[original.id].recordHash, original.id);
      assert.notEqual(current.provenance.recordHash, original.provenance.recordHash, original.id);
    }
    const lunar = current.date.evidence?.lunar;
    if (lunar) {
      const monthStart = calendars.regularMonthStarts[lunar.year][lunar.month - 1];
      const iso = new Date(Date.UTC(lunar.year, 0, monthStart + lunar.day - 1)).toISOString().slice(0, 10);
      assert.equal(current.date.iso, iso, original.id);
      assert.ok(current.date.evidence.sources.some(source => source.url === calendars.source), original.id);
      dates++;
    }
  }
  assert.equal(dates, 11);
  assert.equal(raw.filter(record => record.date.status === 'conditional_gregorian_interpretation').length, 85);
  assert.equal(records.filter(record => record.date.status === 'conditional_gregorian_interpretation').length, 79);
  assert.equal(raw.filter(record => !record.place.observer).length, 34);
  assert.equal(records.filter(record => !record.place.observer).length, 27);
  for (const id of ['H006', 'H017', 'H040', 'H054', 'N50-033', 'N50-034', 'N50-048']) {
    const { place } = find(id);
    assert.equal(place.observer.precision, 'historical-site', id);
    assert.equal(place.evidence.coordinateSystem, 'WGS84', id);
    assert.ok(place.evidence.radiusMeters > 0 && place.evidence.sources.length >= 2, id);
  }
  for (const id of ['H026', 'X01-01', 'N50-026', 'N50-035']) assert.equal(find(id).place.observer, null, id);

  function confirm(record, draft = createHistoricalDraft(record)) {
    const timeBasis = draft.basis === 'recorded' || draft.basis === 'offset'
      ? { kind: 'offset', offsetMinutes: draft.offset } : { kind: 'local-mean-solar' };
    return historyObservation(record, { ...draft.clockChoice, timeBasis,
      observer: historicalDraftObserver(record, draft), dateAcknowledged: true, placeConfirmed: true });
  }
  const library = find('N50-033'), bath = find('H040'), whiteCity = find('N50-048'), school = find('S15-12');
  assert.equal(confirm(library).utc, '1897-11-01T14:00:00.000Z');
  assert.equal(confirm(library).timeSelection.origin, 'history-recorded-point');
  assert.deepEqual(confirm(library).timeBasis, { kind: 'offset', offsetMinutes: -300 });
  assert.equal(library.time.clockBasis.kind, 'fixed-offset');
  assert.equal(library.time.clockBasis.sources[0].url, 'https://www.govinfo.gov/content/pkg/STATUTE-23/pdf/STATUTE-23-Pg4-2.pdf');
  assert.equal(confirm(bath).utc, '1781-03-13T22:39:28.000Z');
  assert.equal(confirm(bath).timeSelection.origin, 'history-window-midpoint');
  assert.deepEqual([bath.time.start, bath.time.end, bath.time.example], ['22:00', '23:00', '22:30']);
  assert.equal(find('H021').time.dayBoundary, 'unverified');
  for (const [id, clock] of [['H021', '00:00'], ['H023', '22:00'], ['H024', '04:00']]) {
    assert.equal(confirm(find(id)).clock, clock);
    assert.equal(historyViewingNeeds(find(id)).clock, false);
  }
  assert.equal(confirm(school).clock, '07:00');
  assert.equal(confirm(school).timeSelection.origin, 'history-related-point');
  assert.equal(confirm(whiteCity).utc, '1908-07-13T15:30:00.000Z');
  assert.equal(confirm(whiteCity).timeSelection.origin, 'history-related-point');
  assert.equal(confirm(find('N50-034')).timeSelection.origin, 'event-default-20');
  assert.equal(resolveHistoryChoices(find('N50-003')).clock, '');
  assert.throws(() => resolveHistoryChoices(library, { clock: '20:00', useDefault: true }));

  const search = query => selectHistory(records, { query }).map(record => record.id);
  assert.deepEqual(search('同治二年 癸亥年'), ['dsh:N50-003']);
  assert.deepEqual(search('陈桥兵变 甲辰日'), ['dsh:H043']);
  assert.deepEqual(search('陈桥兵变 甲辰年'), []);
  assert.deepEqual(search('景仁宫 康熙帝'), ['dsh:H006']);
  assert.equal(matchedHistorySource(bath, '赫歇尔 Account').url, bath.time.source.url);
  assert.match(markup(library), /09:00 当年时制.*史载钟点.*按有史料依据的时制换算/);
  assert.match(markup(library), /单独的馆钟校准资料待核/);
  assert.match(markup(bath), /22:30 当地.*时段中点演示/);
  assert.match(markup(school), /史载相关钟点.*赛前钟响/);
  assert.match(renderToStaticMarkup(React.createElement(ObservationSummary, { observation: confirm(library) })), /史载钟点 · 上午 9 点正式对公众开放/);
  assert.match(markup(find('N50-003')), /原载干支年<\/dt><dd>癸亥年/);
  assert.match(markup(find('H043')), /原载干支日<\/dt><dd>癸卯日、甲辰日/);
  const suShi = find('H002'), qiBaishi = find('N50-003');
  assert.equal(suShi.date.evidence, undefined);
  assert.equal(historicalCalendarText(suShi), suShi.date.original);
  assert.equal(historicalCalendarText(qiBaishi), qiBaishi.date.evidence.originalLabel);
  assert.equal(historicalCalendarText(library), undefined);
  const unexpandedChineseDates = records.filter(record => record.date.originalCalendar === 'chinese-historical' && !record.date.evidence);
  assert.equal(unexpandedChineseDates.length, 40);
  assert.ok(unexpandedChineseDates.every(record => historicalCalendarText(record) === record.date.original));
  assert.match(markup(suShi), /journey-watch-date">景祐三年十二月十九日（中国原历） <span>· 换算公历 1037-01-14/);
  assert.match(markup(qiBaishi), /journey-watch-date">同治二年（癸亥）十一月廿二 <span>· 换算公历 1864-01-01/);
  const tangFounding = byId.get('curated:tang-founding');
  assert.match(markup(tangFounding), /journey-watch-date">[^<]+ <span>· 换算公历 0618-06-21 · 20:00 当地/);
  assert.match(markup(tangFounding), /<button class="journey-primary" type="submit" aria-describedby="[^"]+">观看地月合照<\/button>/);

  const oldRecord = raw.find(record => record.id === library.id);
  const oldDraft = createHistoricalDraft(oldRecord);
  const oldObservation = historyObservation(oldRecord, { ...oldDraft.clockChoice,
    observer: { name: '旧地点', longitude: -77, latitude: 38, precision: 'user-selected', note: '旧演示地点' },
    timeBasis: { kind: 'offset', offsetMinutes: -300 }, dateAcknowledged: true, placeConfirmed: true,
  });
  assert.equal(oldObservation.utc, '1897-11-02T01:00:00.000Z');
  assert.deepEqual(readObservation(oldObservation), oldObservation);
  const resumed = createHistoricalDraft(library, oldObservation), replay = confirm(library, resumed);
  assert.equal(resumed.clockChoice.timeSelection.origin, 'legacy-demo');
  assert.equal(replay.utc, oldObservation.utc);
  assert.deepEqual(replay.observer, oldObservation.observer);
  const manualObservation = historyObservation(oldRecord, {
    ...resolveHistoryChoices(oldRecord, { clock: '09:00' }), observer: library.place.observer,
    timeBasis: { kind: 'local-mean-solar' }, dateAcknowledged: true, placeConfirmed: true,
  });
  assert.equal(manualObservation.utc, '1897-11-01T14:08:01.000Z');
  assert.deepEqual(readObservation(manualObservation), manualObservation);
  assert.equal(confirm(library, createHistoricalDraft(library, manualObservation)).utc, manualObservation.utc);
  const storage = new Map();
  const port = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const cache = createHistoryDraftCache(port);
  cache.set(bath, { ...createHistoricalDraft(bath), watched: true });
  cache.flush();
  assert.equal(createHistoryDraftCache(port).get(bath).clockChoice.timeSelection.origin, 'history-window-midpoint');
  console.log(JSON.stringify({ count: byId.size, enriched: Object.keys(overlay.records).length, dates,
    remainingConditionalDates: 79, suppliedLocations: 7, stillRequiringPlace: 27, clockEvidence: 7, legacyUtc: replay.utc }));
} finally {
  await server.close();
}
