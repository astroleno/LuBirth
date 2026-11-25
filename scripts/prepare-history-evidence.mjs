import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const data = new URL('../src/history/data/', import.meta.url);
const read = async file => JSON.parse(await fs.readFile(new URL(file, data), 'utf8'));
const sha256 = data => createHash('sha256').update(data).digest('hex');
const ordered = value => Array.isArray(value) ? value.map(ordered)
  : value !== null && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])])) : value;

const [records, supplements, evidence] = await Promise.all([read('records.json'), read('supplemental-events.json'), read('evidence.json')]);
const base = new Map([...records, ...supplements].map(row => [row.id, row]));
const revisions = {};
for (const [id, entry] of Object.entries(evidence.records)) {
  assert.ok(base.has(id), id);
  const sourceIds = new Set([
    ...(entry.date?.sources ?? []), ...(entry.place?.sources ?? []),
    ...(entry.time ? [entry.time.source, ...(entry.time.clockBasis.sources ?? [])] : []),
  ]);
  const sources = Object.fromEntries([...sourceIds].map(key => {
    const source = evidence.sources[key];
    assert.ok(source?.title && /^https?:\/\//.test(source.url), `${id}: ${key}`);
    return [key, source];
  }));
  const baseRecordHash = base.get(id).provenance.recordHash;
  const recordHash = sha256(JSON.stringify(ordered({ schema: evidence.schema, baseRecordHash, entry, sources })));
  revisions[id] = { baseRecordHash, recordHash };
}

if (process.argv.includes('--write')) {
  // Keep the hand-edited evidence readable. The generated revisions are the final field.
  const file = new URL('evidence.json', data);
  const source = await fs.readFile(file, 'utf8');
  const field = /^  "revisions": [\s\S]+\n\}\s*$/m;
  assert.match(source, field);
  const serialized = JSON.stringify(revisions, null, 2).replace(/\n/g, '\n  ');
  await fs.writeFile(file, source.replace(field, `  "revisions": ${serialized}\n}\n`));
} else {
  assert.deepEqual(evidence.revisions, revisions);
}
console.log(`Historical evidence revisions: ${Object.keys(revisions).length}`);
