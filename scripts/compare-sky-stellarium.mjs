import * as Astronomy from 'astronomy-engine';

const RAD = Math.PI / 180;
const binaryHip = new Set([32349, 71683]);
function horizonVector(azimuth, altitude) {
  const a = azimuth * RAD, h = altitude * RAD;
  return [Math.sin(a) * Math.cos(h), Math.sin(h), -Math.cos(a) * Math.cos(h)];
}
function separationArcsec(a, b) {
  const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  return Math.atan2(Math.hypot(...cross), a.reduce((sum, x, i) => sum + x * b[i], 0)) / RAD * 3600;
}

/** Frozen outputs come from the desktop executable, not astronomy-engine. */
export function compareStellarium(model, catalog, reference) {
  const cases = reference.scenarios.map(sample => {
    const date = model.parseUtcInput(sample.utc);
    const jd = date.getTime() / 86400000 + 2440587.5;
    if (Math.abs(jd - sample.actualJD) > 1e-8 || Math.abs(jd - sample.jd) > 1e-8) throw Error('Reference calendar/JD mismatch: ' + sample.id);
    const frame = model.createSkyFrame(catalog, date, sample, true);
    const time = new Astronomy.AstroTime(date);
    const rotation = Astronomy.Rotation_EQJ_HOR(time, new Astronomy.Observer(sample.latitude, sample.longitude, 0));
    return { id: sample.id, utc: sample.utc, jd, latitude: sample.latitude, longitude: sample.longitude,
      stars: sample.stars.map(star => {
        const index = frame.hipIndex.get(star.hip);
        if (index === undefined || !Number.isFinite(star.altitude) || !Number.isFinite(star.azimuth)) throw Error('Missing reference star: ' + star.hip);
        const expected = horizonVector(star.azimuth, star.altitude);
        const actual = Array.from(frame.positions.slice(index * 3, index * 3 + 3));
        // Feed desktop-propagated EQJ into our rotation to separate catalog/motion from axis/time errors.
        const a = star.raJ2000 * RAD, d = star.decJ2000 * RAD;
        const hor = Astronomy.RotateVector(rotation, new Astronomy.Vector(Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d), time));
        const transformed = model.horizonToWorld(hor.x, hor.y, hor.z);
        return { hip: star.hip, catalogDifferenceArcsec: separationArcsec(actual, expected),
          transformDifferenceArcsec: separationArcsec(transformed, expected),
          desktopAzimuth: star.azimuth, desktopAltitude: star.altitude,
          knownBinaryModelDifference: binaryHip.has(star.hip) };
      }) };
  });
  const modern = cases.filter(row => row.utc.startsWith('2026')).flatMap(row => row.stars);
  const ancient = cases.filter(row => !row.utc.startsWith('2026')).flatMap(row => row.stars);
  const max = (rows, key) => Math.max(...rows.map(row => row[key]));
  const ancientMaxArcsec = max(ancient, 'catalogDifferenceArcsec');
  return { producer: reference.producer, settings: reference.settings, sampleCount: cases.reduce((n, row) => n + row.stars.length, 0),
    modernMaxArcsec: max(modern, 'catalogDifferenceArcsec'),
    ancientMaxArcsec,
    ancientOtherStarsMaxArcsec: max(ancient.filter(row => !row.knownBinaryModelDifference), 'catalogDifferenceArcsec'),
    rotationMaxArcsec: max(cases.flatMap(row => row.stars), 'transformDifferenceArcsec'),
    historicalCatalogStatus: ancientMaxArcsec > 10
      ? 'NOT_ALIGNED: historical catalog differences exceed 10 arcsec' : 'ALIGNED_WITHIN_10_ARCSEC_FOR_SAMPLED_STARS',
    limitations: ['Geometric comparison: refraction, annual aberration and parallax disabled in desktop reference',
      'Not a claim of sub-minute ancient pointing: historical UT/DeltaT and catalog/binary uncertainties remain',
      'Stellarium models binary orbits for HIP 32349/71683; HYG linear propagation does not'], cases };
}
