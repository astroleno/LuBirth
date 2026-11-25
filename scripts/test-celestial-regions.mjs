import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
import { Rotation_EQD_EQJ } from 'astronomy-engine';

const lines = JSON.parse(await readFile(new URL('../src/spikes/sky/data/iau-boundaries.json', import.meta.url)));
const cacheDir = await mkdtemp(join(tmpdir(), 'lubirth-celestial-regions-'));
const vite = await createServer({ configFile: false, cacheDir, server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });

try {
  const { iauConstellation, b1875BoundaryDirection } = await vite.ssrLoadModule('/src/astro/iauConstellations.ts');
  const { applyFrame, DEG } = await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const { astronomyFrame, createCelestialState, createObserverState } = await vite.ssrLoadModule('/src/astro/celestialState.ts');
  const { songMansionBoundaries, reconstructedSongMansion, SONG_MANSION_EPOCH } = await vite.ssrLoadModule('/src/astro/songMansions.ts');
  const { skyCatalog } = await vite.ssrLoadModule('/src/spikes/sky/skyCatalog.ts');
  const { starDirection } = await vite.ssrLoadModule('/src/spikes/sky/skyModel.ts');

  assert.equal(lines.epoch, 'B1875');
  assert.equal(lines.units, '1/24 deg');
  assert.equal(lines.segments.length, 778);
  assert.equal(new Set(lines.segments.map(edge => edge.slice(0, 4).join('/'))).size, lines.segments.length);
  assert.equal(new Set(lines.segments.flatMap(edge => edge.slice(4))).size, 88);
  for (const [raA, decA, raB, decB, westOrSouth, eastOrNorth] of lines.segments) {
    assert.ok(raA === raB ? decA < decB : decA === decB && raA < raB);
    const ra = (raA + raB) / 48, dec = (decA + decB) / 48;
    const isMeridian = raA === raB;
    const delta = 0.003;
    for (const [sign, expected] of [[-1, westOrSouth], [1, eastOrNorth]]) {
      const direction = b1875BoundaryDirection(ra + (isMeridian ? sign * delta : 0), dec + (isMeridian ? 0 : sign * delta));
      assert.equal(iauConstellation(direction).symbol, expected, `${ra}/${dec}, ${sign}`);
    }
  }
  assert.ok(lines.segments.some(row => row[0] === 0 && row[2] === 0));
  assert.equal(iauConstellation(b1875BoundaryDirection(0, 90)).symbol, 'UMi');
  assert.equal(iauConstellation(b1875BoundaryDirection(0, -90)).symbol, 'Oct');

  // Published stellar identities are independent checks of the IAU regions.
  for (const [ra, dec, expected] of [[88.792939, 7.407064, 'Ori'], [101.287155, -16.716115, 'CMa'],
    [37.954561, 89.264109, 'UMi'], [317.195176, -88.956499, 'Oct'], [56.8712, 24.1051, 'Tau']]) {
    const r = ra * DEG, d = dec * DEG;
    assert.equal(iauConstellation([Math.cos(d) * Math.cos(r), Math.cos(d) * Math.sin(r), Math.sin(d)]).symbol, expected);
  }

  const hipStars = new Map(skyCatalog.stars.map(row => [row[1], row]));
  const directionForHip = (hip, years) => hipStars.has(hip) ? starDirection(hipStars.get(hip), years, true) : undefined;
  const boundaries = songMansionBoundaries(directionForHip);
  assert.equal(boundaries.length, 28);
  assert.equal(boundaries.find(row => row.name === '氐').hip, 72603);
  assert.equal(boundaries.find(row => row.name === '觜').hip, 26207);
  assert.ok(boundaries[19].offset < boundaries[20].offset);
  assert.ok(boundaries.some(row => row.raDeg > 340));
  assert.ok(boundaries.some(row => row.raDeg < 20));
  const widths = boundaries.map((row, i) => (boundaries[i + 1]?.offset ?? 360) - row.offset);
  assert.ok(Math.min(...widths) < 3 && Math.max(...widths) > 25);
  const j2000Ra = hip => { const [x, y] = directionForHip(hip, 0); return Math.atan2(y, x) / DEG; };
  assert.ok(j2000Ra(26207) > j2000Ra(25930), '觜 and 参 reverse if precession is ignored');

  const epoch = new Date(SONG_MANSION_EPOCH);
  const songToEqj = astronomyFrame(Rotation_EQD_EQJ(epoch));
  const sampleSongRa = ra => reconstructedSongMansion(applyFrame(songToEqj, [Math.cos(ra * DEG), Math.sin(ra * DEG), 0]), epoch, boundaries);
  const beforeZero = boundaries.reduce((a, b) => a.raDeg > b.raDeg ? a : b);
  assert.equal(sampleSongRa(359.9999)?.name, beforeZero.name);
  assert.equal(sampleSongRa(.0001)?.name, beforeZero.name);
  assert.equal(sampleSongRa(boundaries[19].raDeg + .02)?.name, '觜');
  assert.equal(sampleSongRa(boundaries[20].raDeg + .02)?.name, '参');

  const sample = createCelestialState('1083-11-30T11:54:06Z');
  const observation = createObserverState(sample, { latitude: 30.447435, longitude: 114.878934 });
  const reconstructed = reconstructedSongMansion(observation.moon.directionEqj, sample.date, boundaries);
  // The independent JPL geometric position for the same historical site also falls in 胃宿.
  const horizons = JSON.parse(await readFile(new URL('../reference/sky/horizons-observer-2026-11-25.json', import.meta.url)));
  const [utc, azimuth, altitude] = horizons.sites.find(site => site.site === 'Huangzhou' && site.body === 'moon').observations[0];
  const jplTime = createCelestialState(utc);
  const jplObserver = createObserverState(jplTime, observation.location);
  const az = azimuth * DEG, alt = altitude * DEG;
  const directionEqj = applyFrame(jplObserver.skyToEqj, [Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt)]);
  assert.equal(reconstructedSongMansion(directionEqj, jplTime.date, boundaries)?.name, '胃');
  assert.equal(reconstructed?.name, '胃');
  assert.ok(reconstructed.marginDeg > 5);
  assert.equal(reconstructedSongMansion(observation.moon.directionEqj, new Date('2026-01-01T00:00Z'), boundaries), null);
  console.log(JSON.stringify({ iauBoundaryEdges: lines.segments.length, testedSides: lines.segments.length * 2,
    songBoundaryCount: boundaries.length, narrowestDeg: Math.min(...widths), widestDeg: Math.max(...widths), reconstructed }, null, 2));
} finally { await vite.close(); await rm(cacheDir, { recursive: true, force: true }); }
