import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { DEFAULT_INPUT, nominalJdn, normalizeRecords, catalogDiff, prepare } from './prepare-history-catalog.mjs';

const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const sourceRows = await read(DEFAULT_INPUT), records = await read('src/history/data/records.json');
const manifest = await read('src/history/data/manifest.json');
const overrides = await read('reference/history/location-overrides.json');
const locations = (await fs.readFile(overrides.coordinateSource, 'utf8')).trim().split(/\r?\n/).slice(1).map(row => {
  const [city, district, lon, lat] = row.split(','); return { city, district, lon, lat };
});
const sources = new Map();
for (const file of new Set(sourceRows.map(row => row.record_file))) sources.set(file, await read(path.join('output', file)));
const results = [];
const test = async (name, fn) => { await fn(); results.push(name); console.log('PASS', name); };

await test('150 records retain all identities, source links, date statuses and uncertainty', () => {
  assert.equal(records.length, 150);
  assert.deepEqual(manifest.kinds, { birth: 90, event: 60 });
  assert.equal(manifest.monthDays, 120);
  assert.equal(new Set(records.map(row => row.id)).size, 150);
  for (const record of records) {
    const source = sourceRows.find(row => row.id === record.originalId);
    assert.equal(record.date.iso, source.iso_pg);
    assert.equal(record.date.status, source.calendar_status);
    assert.equal(record.place.original, source.place);
    assert.equal(record.provenance.productionReady, false);
    assert.equal(record.time.precision, 'date-only');
    assert.ok(record.sources.length);
  }
  assert.equal(records.filter(row => row.date.status === 'conditional_gregorian_interpretation').length, 85);
  assert.ok(records.find(row => row.originalId === 'H001').remainingChecks.length >= 3);
});
await test('All ISO dates and nominal JDNs agree, including early years and leap days', () => {
  for (const record of records) assert.equal(nominalJdn(record.date.iso), record.date.jdn);
  assert.equal(nominalJdn('2000-01-01'), 2451545);
  assert.equal(nominalJdn('0001-01-01'), 1721426);
  assert.equal(nominalJdn('0099-12-31') + 1, nominalJdn('0100-01-01'));
  assert.throws(() => nominalJdn('1900-02-29'));
  assert.throws(() => nominalJdn('0000-01-01'));
});
await test('Regeneration is deterministic and original files still match recorded hashes', async () => {
  assert.deepEqual(normalizeRecords(sourceRows, sources, locations, overrides), records);
  for (const file of [{ path: manifest.input, sha256: manifest.inputSha256 }, ...manifest.sourceHashes]) {
    const digest = crypto.createHash('sha256').update(await fs.readFile(file.path)).digest('hex');
    assert.equal(digest, file.sha256, file.path);
  }
});
await test('Place precision is not upgraded and ambiguous homonyms remain unresolved', () => {
  assert.equal(records.filter(row => row.place.observer).length, 116);
  assert.match(records.find(row => row.originalId === 'H005').place.observer.name, /苏州/);
  for (const id of ['H026', 'X01-01', 'N50-026', 'N50-035'])
    assert.equal(records.find(row => row.originalId === id).place.observer, null, id);
  assert.ok(records.filter(row => row.place.observer).every(row => row.place.observer.precision === 'representative'));
});
await test('Duplicate IDs, conflicting dates, missing evidence and unsafe links are rejected', () => {
  assert.throws(() => normalizeRecords([...sourceRows, sourceRows[0]], sources, locations, overrides), /Duplicate record/);
  const changed = structuredClone(sourceRows); changed[0].jdn = '1';
  assert.throws(() => normalizeRecords(changed, sources, locations, overrides), /JDN\/date/);
  const missing = new Map(sources); missing.set(sourceRows[0].record_file, []);
  assert.throws(() => normalizeRecords(sourceRows, missing, locations, overrides), /Missing or duplicate/);
  changed[0] = { ...sourceRows[0], source_urls: 'javascript:alert(1)' };
  assert.throws(() => normalizeRecords(changed, sources, locations, overrides), /Unsafe source/);
});
await test('Incremental imports report new, removed and changed dates/places without losing stable IDs', () => {
  const next = structuredClone(records.slice(1));
  next[0].date.iso = '2000-01-01';
  next[0].place.observer = { name: 'new representative', latitude: 0, longitude: 0 };
  next.push({ ...structuredClone(records[0]), id: 'dsh:new-fixture' });
  const diff = catalogDiff(records, next);
  assert.deepEqual(diff.added.map(row => row.id), ['dsh:new-fixture']);
  assert.deepEqual(diff.removed.map(row => row.id), [records[0].id]);
  assert.equal(diff.changed.length, 1);
  assert.deepEqual(diff.changed[0].fields, ['date', 'place']);
  assert.equal(diff.changed[0].before.date.iso, records[1].date.iso);
  assert.equal(diff.changed[0].after.place.observer.latitude, 0);
  assert.equal(diff.unchanged, 148);
  assert.equal(catalogDiff(records, records).unchanged, 150);
});
await test('Check-only import validates and reports changes without replacing application files', async () => {
  const files = ['records.json', 'manifest.json', 'import-diff.json'];
  const before = await Promise.all(files.map(file => fs.readFile('src/history/data/' + file, 'utf8')));
  const result = await prepare(DEFAULT_INPUT, 'src/history/data', { write: false });
  assert.equal(result.diff.unchanged, 150);
  assert.deepEqual(await Promise.all(files.map(file => fs.readFile('src/history/data/' + file, 'utf8'))), before);
});
console.log(JSON.stringify({ passed: results.length, checks: results }));
