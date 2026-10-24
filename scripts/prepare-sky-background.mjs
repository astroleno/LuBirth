// Reproducible scientific-texture processing, not a painted replacement sky.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { FloatType } from 'three';

const source = 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/milkyway_2020_4k.exr';
const cache = new URL('../output/sky-implementation-20261022/', import.meta.url);
const destination = new URL('../src/spikes/sky/data/', import.meta.url);
await mkdir(cache, { recursive: true });
let bytes;
try { bytes = await readFile(new URL('milkyway_2020_4k.exr', cache)); }
catch { const response = await fetch(source); if (!response.ok) throw new Error(`NASA: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer()); await writeFile(new URL('milkyway_2020_4k.exr', cache), bytes); }
const exr = new EXRLoader().setDataType(FloatType).parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const width = 1024, height = 512, channels = exr.data.length / exr.width / exr.height;
const scale = exr.width / width;
if (scale !== 4 || exr.height / height !== 4) throw new Error('Unexpected source dimensions');
const filtered = new Float32Array(width * height * 3);
// EXRLoader returns bottom-up pixel rows. Write PNG north-up.
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const samples = [];
  for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
    const i = ((exr.height - 1 - (y * scale + dy)) * exr.width + x * scale + dx) * channels;
    const rgb = Array.from(exr.data.slice(i, i + 3)).map(v => Math.max(0, Number.isFinite(v) ? v : 0));
    samples.push({ rgb, luminance: rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722 });
  }
  samples.sort((a, b) => a.luminance - b.luminance);
  for (const sample of samples.slice(0, 12)) for (let c = 0; c < 3; c++) filtered[(y * width + x) * 3 + c] += sample.rgb[c] / 12;
}
// Separable wrapped low-pass: suppress remaining point sources; retain diffuse density.
let current = filtered;
for (const horizontal of [true, false, true, false]) {
  const next = new Float32Array(current.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) for (let k = -2; k <= 2; k++) {
    const xx = horizontal ? (x + k + width) % width : x;
    const yy = horizontal ? y : Math.max(0, Math.min(height - 1, y + k));
    for (let c = 0; c < 3; c++) next[(y * width + x) * 3 + c] += current[(yy * width + xx) * 3 + c] / 5;
  }
  current = next;
}
const sorted = Array.from(current).sort((a, b) => a - b);
const exposure = 1 / Math.max(1e-9, sorted[Math.floor(sorted.length * .99)]);
const scanlines = Buffer.alloc(height * (width * 3 + 1));
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) for (let c = 0; c < 3; c++) {
  const linear = 1 - Math.exp(-current[(y * width + x) * 3 + c] * exposure);
  const srgb = linear <= .0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - .055;
  scanlines[y * (width * 3 + 1) + 1 + x * 3 + c] = Math.round(255 * srgb);
}
function chunk(type, data) {
  const payload = Buffer.concat([Buffer.from(type), data]); let crc = 0xffffffff;
  for (const byte of payload) { crc ^= byte; for (let b = 0; b < 8; b++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  const result = Buffer.alloc(payload.length + 8); result.writeUInt32BE(data.length); payload.copy(result, 4); result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4); return result;
}
const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(scanlines)), chunk('IEND', Buffer.alloc(0))]);
await writeFile(new URL('milky-way-density.png', destination), png);
await writeFile(new URL('milky-way-density.json', destination), JSON.stringify({
  source, page: 'https://svs.gsfc.nasa.gov/4851/', credit: 'NASA/Goddard Space Flight Center Scientific Visualization Studio',
  sourceSha256: createHash('sha256').update(bytes).digest('hex'), outputSha256: createHash('sha256').update(png).digest('hex'),
  width, height, exposure, coordinates: 'ICRF/J2000 equatorial; RA=0 at center, RA increases left; north up',
  recipe: '4x4 luminance-trimmed mean (brightest quarter excluded); two separable radius-2 box filters; exponential exposure and sRGB encoding',
  limitation: 'NASA omits bright Hipparcos/Tycho stars in this source. Low-frequency stellar-density visualization, not photometric surface brightness or a star-free astrophotograph. Fixed J2000 diffuse morphology.',
}, null, 2) + '\n');
console.log({ width, height, bytes: png.length, exposure });
