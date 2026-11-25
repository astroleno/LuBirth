import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

// Astronomy Engine distributes the Roman (1987) lookup table under MIT.
// Convert the arrangement to shared, axis-aligned edges, omitting internal cell lines.
const library = await readFile(new URL('../node_modules/astronomy-engine/esm/astronomy.js', import.meta.url), 'utf8');
const table = library.split('const ConstelBounds = [')[1]?.split('];')[0];
assert.ok(table, 'The pinned Astronomy Engine boundary table was not found');
const rows = Array.from(table.matchAll(/\[\d+, ([\d.]+), ([\d.]+), (-?[\d.]+)\] \/\/ (\w{3})/g),
  ([, lo, hi, dec, region]) => ({ lo: +lo, hi: +hi, dec: +dec, region }));
assert.equal(rows.length, 357);
assert.equal(new Set(rows.map(row => row.region)).size, 88);

const sorted = values => Array.from(new Set(values)).sort((a, b) => a - b);
const ras = sorted(rows.flatMap(({ lo, hi }) => [lo, hi]));
const decs = sorted([2160, ...rows.map(({ dec }) => dec)]);
const strips = decs.slice(0, -1).map((dec, index) => {
  const y = (dec + decs[index + 1]) / 2;
  return ras.slice(0, -1).map((ra, column) => {
    const x = (ra + ras[column + 1]) / 2;
    const row = rows.find(row => y >= row.dec && x >= row.lo && x < row.hi);
    assert.ok(row, `Unassigned B1875 cell (${x}, ${y})`);
    return row.region;
  });
});

const segments = [];
function addSegments(coordinates, getLabels, output) {
  let start = 0;
  while (start < coordinates.length - 1) {
    const labels = getLabels(start);
    const pair = labels.join('/');
    let end = start + 1;
    while (end < coordinates.length - 1 && getLabels(end).join('/') === pair) end++;
    if (labels[0] !== labels[1]) segments.push([...output(coordinates[start], coordinates[end]), ...labels]);
    start = end;
  }
}

for (const [x, ra] of ras.slice(0, -1).entries()) {
  const west = (x - 1 + strips[0].length) % strips[0].length;
  addSegments(decs, y => [strips[y][west], strips[y][x]], (from, to) => [ra, from, ra, to]);
}
for (let y = 1; y < decs.length - 1; y++) {
  addSegments(ras, x => [strips[y - 1][x], strips[y][x]], (from, to) => [from, decs[y], to, decs[y]]);
}

await writeFile(new URL('../src/spikes/sky/data/iau-boundaries.json', import.meta.url),
  '{"units":"1/24 deg","epoch":"B1875","segments":[\n' + segments.map(segment => JSON.stringify(segment)).join(',\n') + '\n]}\n');
console.log(`Generated ${segments.length} shared boundary segments.`);
