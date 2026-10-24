import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_INPUT = 'output/history-dsh-fresh50-20261023-r2/catalog-150/records.json';
const coordinateFile = 'public/data/全国各地方省市经纬度及地方行政区号simple.csv';
const overrideFile = 'reference/history/location-overrides.json';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => JSON.stringify(value);
const statuses = new Set(['conditional_gregorian_interpretation', 'numeric_equivalence_verified', 'calculated_agreement', 'not_applicable']);

export function nominalJdn(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Invalid civil date: ${iso}`);
  const [y, m, d] = match.slice(1).map(Number);
  const value = new Date(0);
  value.setUTCFullYear(y, m - 1, d);
  value.setUTCHours(0, 0, 0, 0);
  if (y < 1 || y > 2999 || value.getUTCFullYear() !== y || value.getUTCMonth() !== m - 1 || value.getUTCDate() !== d)
    throw new Error(`Invalid civil date: ${iso}`);
  return value.getTime() / 86400000 + 2440588;
}

function sourceUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(`Unsafe source URL: ${value}`);
  return url.href;
}

function safeSourceFile(relative) {
  const absolute = path.resolve(root, 'output', relative);
  if (!absolute.startsWith(path.join(root, 'output') + path.sep)) throw new Error('Source must remain in the authorized output directory');
  return absolute;
}

function period(year, world) {
  if (world) return '世界其他地区';
  if (year < 581) return '魏晋南北朝';
  if (year < 907) return '隋唐';
  if (year < 960) return '五代十国';
  if (year < 1279) return '宋代';
  if (year < 1368) return '元代';
  if (year < 1644) return '明代';
  if (year < 1912) return '清代及清末';
  return '近现代';
}

export function normalizeRecords(catalog, sourceLists, locations, overrides) {
  if (!Array.isArray(catalog) || !catalog.length) throw new Error('Expected a non-empty catalog');
  const mappings = new Map();
  for (const group of overrides.groups) {
    const matches = locations.filter(p => p.city === group.city && p.district === group.district);
    if (matches.length !== 1) throw new Error(`Coordinate lookup must be unique: ${group.city}/${group.district}`);
    const p = matches[0];
    const latitude = Number(p.lat), longitude = Number(p.lon);
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180)
      throw new Error(`Invalid coordinate: ${group.city}/${group.district}`);
    for (const id of group.ids) {
      if (mappings.has(id)) throw new Error(`Duplicate location override: ${id}`);
      mappings.set(id, { name: group.district + '代表点', latitude, longitude, precision: 'representative', note: group.reason, source: coordinateFile });
    }
  }
  const ids = new Set();
  return catalog.map(row => {
    if (!/^[A-Za-z0-9_-]+$/.test(row.id) || !['birth', 'event'].includes(row.kind) || !row.name?.trim())
      throw new Error('Missing record identity');
    const id = 'dsh:' + row.id;
    if (ids.has(id)) throw new Error(`Duplicate record: ${id}`);
    ids.add(id);
    const source = sourceLists.get(row.record_file)?.filter(item => item.id === row.id);
    if (source?.length !== 1) throw new Error(`Missing or duplicate original record: ${row.id}`);
    const raw = source[0];
    if (raw.name !== row.name || raw.kind !== row.kind) throw new Error(`Identity mismatch: ${id}`);
    if (!statuses.has(row.calendar_status)) throw new Error(`Unknown calendar status: ${id}`);
    const jdn = nominalJdn(row.iso_pg);
    if (jdn !== Number(row.jdn)) throw new Error(`JDN/date disagreement: ${id}`);
    if (raw.utc || raw.time?.utc) throw new Error(`Precise historical UTC requires an explicit schema review: ${id}`);
    const urls = [...new Set(String(row.source_urls).split(' | ').map(sourceUrl))];
    if (!urls.length) throw new Error(`No sources: ${id}`);
    const originalSources = Array.isArray(raw.sources) ? raw.sources : [];
    const world = /英国|英格兰|意大利|柏林|布尔诺|槟榔屿|巴黎|东京|London|Washington|Shrewsbury|Padua|Brno/.test(row.place);
    const unresolved = overrides.unresolvedNotes[row.id];
    return {
      id, originalId: row.id, kind: row.kind, name: row.name,
      period: period(Number(row.iso_pg.slice(0, 4)), world), region: world ? 'world' : 'china',
      date: { original: row.original_date, originalCalendar: row.source_calendar || raw.date?.calendar || 'unspecified',
        iso: row.iso_pg, jdn, status: row.calendar_status,
        note: [raw.date?.notes, raw.calendar_check?.source_convention_notes].filter(Boolean).join('\n') },
      time: { precision: 'date-only', note: raw.time?.notes || '资料未建立准确时刻；观看天空时须自行选择演示钟点。' },
      place: { original: row.place, role: raw.place?.role || (row.kind === 'birth' ? 'birthplace' : 'event-place'),
        precision: row.place_precision, note: [raw.place?.notes, unresolved].filter(Boolean).join('\n'), observer: mappings.get(row.id) || null },
      sources: urls.map(url => ({ url, title: originalSources.find(item => item.url === url)?.title || new URL(url).hostname })),
      notes: raw.notes || '',
      remainingChecks: [...new Set([...(raw.remaining_checks || []), ...(raw.calendar_check?.source_convention_resolution?.remaining_uncertainties || [])])],
      provenance: { dataset: row.dataset, file: 'output/' + row.record_file,
        recordHash: sha(stable({ summary: row, original: raw, observer: mappings.get(row.id) || null, unresolved: unresolved || null })),
        productionReady: row.production_ready === true && raw.production_ready === true },
    };
  });
}

export function catalogDiff(previous, next) {
  const before = new Map(previous.map(row => [row.id, row]));
  const after = new Map(next.map(row => [row.id, row]));
  const brief = row => ({ id: row.id, name: row.name, date: row.date, place: row.place });
  const added = next.filter(row => !before.has(row.id)).map(brief);
  const removed = previous.filter(row => !after.has(row.id)).map(brief);
  const changed = next.flatMap(row => {
    const old = before.get(row.id);
    if (!old) return [];
    const fields = [...new Set([...Object.keys(old), ...Object.keys(row)])].filter(key => stable(old[key]) !== stable(row[key]));
    return fields.length ? [{ id: row.id, name: row.name, fields,
      before: Object.fromEntries(fields.map(key => [key, old[key]])),
      after: Object.fromEntries(fields.map(key => [key, row[key]])) }] : [];
  });
  return { added, removed, changed, unchanged: next.length - added.length - changed.length };
}

export async function prepare(input = DEFAULT_INPUT, destination = 'src/history/data', { write = true } = {}) {
  const raw = await fs.readFile(path.resolve(root, input));
  const rows = JSON.parse(raw);
  const sources = new Map(), sourceHashes = [];
  for (const relative of [...new Set(rows.map(row => row.record_file))]) {
    const bytes = await fs.readFile(safeSourceFile(relative));
    const list = JSON.parse(bytes);
    if (!Array.isArray(list)) throw new Error(`Expected source record array: ${relative}`);
    sources.set(relative, list);
    sourceHashes.push({ path: 'output/' + relative, sha256: sha(bytes) });
  }
  const csv = await fs.readFile(path.join(root, coordinateFile), 'utf8');
  const locations = csv.trim().split(/\r?\n/).slice(1).map(line => {
    const [city, district, lon, lat] = line.split(',');
    return { city, district, lon, lat };
  });
  const overrideBytes = await fs.readFile(path.join(root, overrideFile));
  const records = normalizeRecords(rows, sources, locations, JSON.parse(overrideBytes));
  const data = JSON.stringify(records, null, 2) + '\n';
  const counts = key => Object.fromEntries([...new Set(records.map(key))].map(value => [value, records.filter(row => key(row) === value).length]));
  const manifest = { schema: 1, namespace: 'dsh', input, inputSha256: sha(raw), sourceHashes,
    coordinates: { path: coordinateFile, sha256: sha(csv) }, overrides: { path: overrideFile, sha256: sha(overrideBytes) },
    recordsSha256: sha(data), count: records.length, kinds: counts(row => row.kind), calendar: counts(row => row.date.status),
    periods: counts(row => row.period), monthDays: new Set(records.map(row => row.date.iso.slice(5))).size,
    placesWithRepresentative: records.filter(row => row.place.observer).length,
    placesRequiringChoice: records.filter(row => !row.place.observer).map(row => row.id),
    preciseInstants: 0, productionReady: records.filter(row => row.provenance.productionReady).length };
  const dir = path.resolve(root, destination);
  let previous = [];
  try { previous = JSON.parse(await fs.readFile(path.join(dir, 'records.json'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const diff = { schema: 1, fromRecordsSha256: previous.length ? sha(JSON.stringify(previous, null, 2) + '\n') : null,
    toRecordsSha256: manifest.recordsSha256, ...catalogDiff(previous, records) };
  if (!write) return { ...manifest, diff };
  await fs.mkdir(dir, { recursive: true });
  // Validate everything before replacing either published artifact.
  await fs.writeFile(path.join(dir, 'records.json.tmp'), data);
  await fs.writeFile(path.join(dir, 'manifest.json.tmp'), JSON.stringify(manifest, null, 2) + '\n');
  await fs.writeFile(path.join(dir, 'import-diff.json.tmp'), JSON.stringify(diff, null, 2) + '\n');
  await fs.rename(path.join(dir, 'records.json.tmp'), path.join(dir, 'records.json'));
  await fs.rename(path.join(dir, 'manifest.json.tmp'), path.join(dir, 'manifest.json'));
  await fs.rename(path.join(dir, 'import-diff.json.tmp'), path.join(dir, 'import-diff.json'));
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2), check = args.includes('--check'), paths = args.filter(arg => arg !== '--check');
  const result = await prepare(paths[0] || DEFAULT_INPUT, paths[1] || 'src/history/data', { write: !check });
  console.log(JSON.stringify({ count: result.count, kinds: result.kinds, monthDays: result.monthDays,
    placesWithRepresentative: result.placesWithRepresentative, placesRequiringChoice: result.placesRequiringChoice,
    ...(check ? { checkOnly: true, diff: result.diff } : {}) }, null, 2));
}
