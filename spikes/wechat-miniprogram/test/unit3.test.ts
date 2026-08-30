import assert from 'node:assert/strict';
import test from 'node:test';

import {
  angularDistanceDeg,
  compareAstroCase,
  createAstroParityReport,
  type AstroSnapshot,
} from '../src/tests/astro-parity-test.ts';

const base: AstroSnapshot = {
  id: 'sample',
  utc: '2024-03-21T12:00:00.000Z',
  latDeg: 0,
  lonDeg: 0,
  altDeg: 89.2,
  azDeg: 0,
  azDefined: false,
  illumination: 0.82,
  sunWorld: { x: 1, y: 0, z: 0 },
  moonWorld: { x: 0, y: 1, z: 0 },
};

test('angular distance uses the shorter great-circle separation', () => {
  assert.equal(angularDistanceDeg({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }), 90);
  assert.equal(angularDistanceDeg({ x: 4, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }), 0);
});

test('near-zenith undefined azimuth is excluded while vector parity remains strict', () => {
  const result = compareAstroCase(base, { ...base, azDeg: 271 });

  assert.equal(result.status, 'pass');
  assert.equal(result.differences.azDeg, null);
  assert.equal(result.differences.sunDirectionDeg, 0);
});

test('a 0.02 degree direction drift fails the 0.01 degree contract', () => {
  const angle = 0.02 * Math.PI / 180;
  const result = compareAstroCase(base, {
    ...base,
    sunWorld: { x: Math.cos(angle), y: Math.sin(angle), z: 0 },
  });

  assert.equal(result.status, 'fail');
  assert.ok((result.differences.sunDirectionDeg ?? 0) > 0.0199);
  assert.deepEqual(result.issues, ['sun-direction-drift']);
});

test('fingerprint mismatch makes the whole parity report inconclusive', () => {
  const report = createAstroParityReport({
    webCases: [base],
    miniprogramCases: [base],
    webFingerprint: {
      revision: 'a', dirty: false, dependencyLockSha256: 'dep', assetManifestSha256: 'asset', astroSourceSha256: 'astro',
    },
    miniprogramFingerprint: {
      revision: 'b', dirty: false, dependencyLockSha256: 'dep', assetManifestSha256: 'asset', astroSourceSha256: 'astro',
    },
  });

  assert.equal(report.status, 'inconclusive');
  assert.deepEqual(report.fingerprint.mismatches, ['revision']);
});
