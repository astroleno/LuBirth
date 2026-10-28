import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { createObserverDraft, resolveObserverDraft, commitObserverDraft, createHistoricalDraft,
    historicalDraftObserver, beginHistoricalPlaceEdit, cancelHistoricalPlaceEdit, createHistoryDraftCache, personalObservationInitial } = await server.ssrLoadModule('/src/history/observationDraft.ts');
  const { historyObservation, resolveObservation, exampleObservation } = await server.ssrLoadModule('/src/history/observation.ts');
  const { locationLabel } = await server.ssrLoadModule('/src/components/LocationSelector/locationDraft.ts');
  const records = JSON.parse(await fs.readFile('src/history/data/records.json', 'utf8'));
  const representative = records.find(record => record.kind === 'event' && record.place.observer);
  const unknown = records.find(record => !record.place.observer);
  const person = records.find(record => record.kind === 'birth');
  const shanghai = { name: '上海', latitude: 31.2304, longitude: 121.4737, precision: 'user-selected', note: '测试地点' };
  const beijing = { ...shanghai, name: '北京', latitude: 39.9042, longitude: 116.4074 };
  const checks = [];
  const test = (name, run) => { run(); checks.push(name); console.log('PASS', name); };

  test('Location labels omit a repeated city-centre name while retaining geographic distinctions', () => {
    assert.equal(locationLabel({ province: '北京市', city: '北京市', district: '北京' }), '北京市');
    assert.equal(locationLabel({ province: '广东省', city: '广州市', district: '广州' }), '广东省 · 广州市');
    assert.equal(locationLabel({ province: '吉林省', city: '吉林市', district: '吉林' }), '吉林省 · 吉林市');
    assert.equal(locationLabel({ province: '北京市', city: '北京市', district: '朝阳区' }), '北京市 · 朝阳区');
  });

  test('A new query, cleared query or incomplete province cannot silently submit the previous city', () => {
    const selected = createObserverDraft(shanghai);
    for (const search of [{ ...selected.search, query: '北京', pending: true },
      { ...selected.search, query: '', pending: true },
      { ...selected.search, province: '广东省', city: '', district: '', pending: true }]) {
      assert.equal(resolveObserverDraft({ ...selected, mode: 'search', search }), null);
    }
    assert.deepEqual(resolveObserverDraft(createObserverDraft(beijing)), beijing);
    assert.deepEqual(resolveObserverDraft(createObserverDraft(selected.selection)), shanghai);
  });
  test('Renaming or changing one coordinate keeps the other selected fields; zero coordinates are valid', () => {
    const original = createObserverDraft(shanghai);
    const renamed = { ...original, mode: 'coordinates', coordinates: { ...original.coordinates, name: '上海取景点' } };
    assert.deepEqual(resolveObserverDraft(renamed), { name: '上海取景点', latitude: shanghai.latitude,
      longitude: shanghai.longitude, precision: 'user-selected', note: '用户明确填写的观测位置' });
    const moved = { ...renamed, coordinates: { ...renamed.coordinates, latitude: '0' } };
    assert.equal(resolveObserverDraft(moved).latitude, 0);
    assert.equal(resolveObserverDraft(moved).longitude, shanghai.longitude);
    assert.deepEqual(commitObserverDraft(moved).coordinates, moved.coordinates);
    for (const latitude of ['', '91', 'NaN']) assert.equal(resolveObserverDraft({ ...moved,
      coordinates: { ...moved.coordinates, latitude } }), null);
    assert.equal(resolveObserverDraft({ ...moved, coordinates: { ...moved.coordinates, longitude: '-181' } }), null);
  });
  test('Known event places and local 20:00 are proposed together; one explicit action still passes strict confirmation', () => {
    const draft = createHistoricalDraft(representative), observer = historicalDraftObserver(representative, draft);
    assert.deepEqual(observer, representative.place.observer);
    assert.equal(draft.placeOpen, false);
    assert.equal(draft.clockChoice.clock, '20:00');
    assert.equal(draft.clockChoice.timeSelection.origin, 'event-default-20');
    const choices = { ...draft.clockChoice, observer, timeBasis: { kind: draft.basis }, dateAcknowledged: true, placeConfirmed: true };
    const observation = historyObservation(representative, choices);
    assert.equal(observation.clock, '20:00');
    assert.equal(observation.observer.longitude, observer.longitude);
    assert.throws(() => historyObservation(representative, { ...choices, dateAcknowledged: false }));
    assert.throws(() => historyObservation(representative, { ...choices, placeConfirmed: false }));
  });
  test('Unknown history places require a choice and personal births never receive the event default', () => {
    assert.equal(historicalDraftObserver(unknown, createHistoricalDraft(unknown)), null);
    assert.equal(createHistoricalDraft(unknown).placeOpen, true);
    assert.equal(createHistoricalDraft(person).clockChoice.clock, '');
  });
  test('Reusing a chosen place never silently falls back to the record representative', () => {
    for (const mode of ['current', 'personal']) {
      const draft = { ...createHistoricalDraft(representative), placeMode: mode, reusedPlace: { ...beijing }, reusedOrigin: '此前选定的地点' };
      assert.deepEqual(historicalDraftObserver(representative, draft), beijing);
      assert.equal(historicalDraftObserver(representative, { ...draft, reusedPlace: null }), null);
    }
  });
  test('Canceling a representative place edit restores its precision and source without reverting time edits', () => {
    const initial = createHistoricalDraft(representative), editing = beginHistoricalPlaceEdit(representative, initial);
    const pending = { ...editing, placeMode: 'custom', custom: { ...editing.custom,
      search: { ...editing.custom.search, query: '北京', pending: true } },
      clockChoice: { clock: '21:30', timeSelection: { origin: 'user-input', ruleVersion: null, label: '自选' } },
      basis: 'offset', offset: 540 };
    assert.equal(historicalDraftObserver(representative, pending), null);
    const restored = cancelHistoricalPlaceEdit(pending);
    assert.equal(restored.placeOpen, false);
    assert.equal(restored.placeBeforeEdit, null);
    assert.deepEqual(historicalDraftObserver(representative, restored), representative.place.observer);
    assert.equal(restored.clockChoice.clock, '21:30');
    assert.equal(restored.basis, 'offset');
    assert.equal(restored.offset, 540);
  });
  test('Custom and reused places keep their own rollback snapshots; unknown places cannot invent a previous choice', () => {
    for (const mode of ['custom', 'current', 'personal']) {
      const initial = { ...createHistoricalDraft(representative), placeMode: mode, custom: createObserverDraft(beijing),
        reusedPlace: { ...shanghai }, reusedOrigin: '我的出生地点' };
      const editing = beginHistoricalPlaceEdit(representative, initial);
      assert.notEqual(editing.placeBeforeEdit.custom, initial.custom);
      const changed = { ...editing, placeMode: 'custom', custom: { ...editing.custom,
        search: { ...editing.custom.search, query: '未完成', pending: true } } };
      const restored = cancelHistoricalPlaceEdit(changed);
      assert.equal(restored.placeMode, mode);
      assert.deepEqual(historicalDraftObserver(representative, restored), mode === 'custom' ? beijing : shanghai);
      assert.equal(restored.reusedOrigin, initial.reusedOrigin);
    }
    const missing = beginHistoricalPlaceEdit(unknown, createHistoricalDraft(unknown));
    assert.equal(missing.placeBeforeEdit, null);
    assert.equal(cancelHistoricalPlaceEdit(missing), missing);
  });
  test('Pending place edits keep their cancel snapshot after a cache round trip', () => {
    const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const cache = createHistoryDraftCache(storage), editing = beginHistoricalPlaceEdit(representative, cache.get(representative));
    cache.set(representative, { ...editing, placeMode: 'custom', custom: { ...editing.custom,
      search: { ...editing.custom.search, query: '北京', pending: true } } });
    cache.flush();
    const restoredCache = createHistoryDraftCache(storage), restored = restoredCache.get(representative);
    assert.equal(historicalDraftObserver(representative, restored), null);
    assert.deepEqual(historicalDraftObserver(representative, cancelHistoricalPlaceEdit(restored)), representative.place.observer);
    cache.dispose(); restoredCache.dispose();
  });
  test('Returning to a record preserves pending edits, source reading and an incomplete UTC offset', () => {
    const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const cache = createHistoryDraftCache(storage);
    const draft = { ...cache.get(representative), placeMode: 'custom', custom: { ...createObserverDraft(shanghai), mode: 'search',
      search: { ...createObserverDraft(shanghai).search, query: '北京', pending: true } }, sourceOpen: true, adjusting: true,
      placeOpen: true, basis: 'offset', offset: NaN };
    cache.set(representative, draft);
    assert.equal(cache.get(representative).custom.search.query, '北京');
    cache.flush();
    const restored = createHistoryDraftCache(storage).get(representative);
    assert.equal(restored.sourceOpen, true);
    assert.equal(restored.custom.search.query, '北京');
    assert.equal(historicalDraftObserver(representative, restored), null);
    assert.ok(Number.isNaN(restored.offset));
    cache.dispose();
  });
  test('Different records and changed source hashes never reuse a previous confirmation', () => {
    const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const cache = createHistoryDraftCache(storage), draft = { ...cache.get(representative), watched: true, clockChoice: {
      clock: '21:15', timeSelection: { origin: 'user-input', ruleVersion: null, label: '测试自选时刻' } } };
    cache.set(representative, draft); cache.flush();
    const changed = { ...representative, provenance: { ...representative.provenance, recordHash: 'changed' } };
    assert.equal(cache.get(changed).watched, false);
    assert.equal(createHistoryDraftCache(storage).get(changed).clockChoice.clock, '20:00');
    assert.equal(cache.get(unknown).watched, false);
    cache.dispose();
  });
  test('Invalid storage falls back safely and blocked storage still keeps an in-memory draft', () => {
    const invalid = createHistoryDraftCache({ getItem: () => '{bad', setItem: () => {} });
    assert.equal(invalid.get(representative).watched, false);
    const corrupt = createHistoryDraftCache({ getItem: () => JSON.stringify({ rule: 'history-ux-v2', hash: representative.provenance.recordHash,
      draft: { ...createHistoricalDraft(representative), watched: true, placeMode: 'custom', custom: createObserverDraft({ ...shanghai, latitude: 91 }) } }), setItem: () => {} });
    assert.equal(corrupt.get(representative).watched, false);
    assert.deepEqual(historicalDraftObserver(representative, corrupt.get(representative)), representative.place.observer);
    const denied = createHistoryDraftCache({ getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } });
    denied.set(representative, { ...denied.get(representative), sourceOpen: true }); denied.flush();
    assert.equal(denied.get(representative).sourceOpen, true);
    invalid.dispose(); corrupt.dispose(); denied.dispose();
  });
  test('Reloading from history never pre-fills a personal birth with an ancient observation', () => {
    const initial = exampleObservation();
    const personal = resolveObservation('1993-08-01', '11:00', shanghai, { kind: 'offset', offsetMinutes: 480 }, { kind: 'birth', label: '我的出生时刻' });
    const draft = createHistoricalDraft(representative);
    const historical = historyObservation(representative, { ...draft.clockChoice, observer: representative.place.observer,
      timeBasis: { kind: 'local-mean-solar' }, dateAcknowledged: true, placeConfirmed: true });
    assert.deepEqual(personalObservationInitial({ birth: personal, current: historical, beforeHistory: initial }), personal);
    assert.deepEqual(personalObservationInitial({ birth: null, current: historical, beforeHistory: initial }), initial);
    assert.equal(personalObservationInitial({ birth: null, current: historical, beforeHistory: historical }).source.kind, 'example');
    assert.equal(personalObservationInitial({ birth: null, current: historical, beforeHistory: null }).source.kind, 'example');
  });
  console.log(JSON.stringify({ passed: checks.length, checks }));
} finally { await server.close(); }
