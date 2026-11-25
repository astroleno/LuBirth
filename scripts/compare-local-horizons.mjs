import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const reference = JSON.parse(await readFile('reference/sky/horizons-observer-2026-11-25.json', 'utf8'));
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { createCelestialState, createObserverState } = await vite.ssrLoadModule('/src/astro/celestialState.ts');
  const R = await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const results = [];
  for (const { site, latitude, longitude, body, observations } of reference.sites) {
    for (const [utc, azimuth, altitude, illumination, distance] of observations) {
      const az = azimuth * R.DEG, el = altitude * R.DEG;
      // Reconstruct the direction solely from the external table, with north at azimuth 0.
      const expected = [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
      const celestial = createCelestialState(utc);
      const observer = createObserverState(celestial, { latitude, longitude });
      const angleDeg = R.angleDegrees(expected, observer[body].direction);
      const phasePctPoints = body === 'moon' ? Math.abs(observer.phaseFraction * 100 - illumination) : null;
      const rangeKm = Math.abs(observer[body].distanceKm - distance);
      const modern = utc.startsWith('2026');
      assert.ok(angleDeg < (modern ? .02 : .5), `${site} ${utc} ${body}: ${angleDeg}°`);
      assert.ok(phasePctPoints === null || phasePctPoints < (modern ? .05 : .3), `${site} ${utc}: ${phasePctPoints} pp`);
      assert.ok(rangeKm / distance < (body === 'sun' ? .00005 : .001), `${site} ${utc} ${body}: ${rangeKm} km`);

      let globeSunDeg = null;
      if (body === 'sun') {
        // Use the actual globe transform to build the tangent basis at the pin, independently of EQJ→HOR.
        const globe = R.createEarthSceneFrame(celestial);
        const up = R.applyFrame(globe.ecefToScene, R.geographicNormal(latitude, longitude));
        const east = R.unit(R.cross([0, 1, 0], up));
        const north = R.cross(up, east);
        const sun = R.unit(R.applyFrame(globe.eqjToScene, R.subtract(celestial.sunEqjKm, observer.positionEqjKm)));
        const local = [R.dot(sun, east), R.dot(sun, up), -R.dot(sun, north)];
        globeSunDeg = R.angleDegrees(local, expected);
        assert.ok(globeSunDeg < (modern ? .02 : .5), `${site} ${utc} globe: ${globeSunDeg}°`);
      }
      results.push({ site, utc, modern, body, angleDeg, phasePctPoints, rangeKm, globeSunDeg });
    }
  }
  assert.equal(results.length, 22);
  const summary = [true, false].flatMap(modern => ['sun', 'moon'].map(body => {
    const samples = results.filter(sample => sample.modern === modern && sample.body === body);
    const max = field => samples[0][field] === null ? null : Math.max(...samples.map(sample => sample[field]));
    return { basis: modern ? '2026' : 'historical', body, count: samples.length,
      angleDeg: max('angleDeg'), phasePctPoints: max('phasePctPoints'), rangeKm: max('rangeKm'), globeSunDeg: max('globeSunDeg') };
  }));
  console.log(JSON.stringify({ summary, results }, null, 2));
} finally { await vite.close(); }
