import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ASTRO_CASE_DEFINITIONS,
  computeAstroSnapshots,
  runSourceCharacterization,
} from '../src/astro/entry.ts';
import baseline from '../src/astro/web-baseline.json';
import { compareAstroCase } from '../src/tests/astro-parity-test.ts';

test('shared LuBirth astro source produces normalized finite vectors for every fixed case', () => {
  const snapshots = computeAstroSnapshots();

  assert.equal(snapshots.length, 8);
  assert.deepEqual(snapshots.map((entry) => entry.id), ASTRO_CASE_DEFINITIONS.map((entry) => entry.id));
  for (const snapshot of snapshots) {
    assert.ok(Number.isFinite(snapshot.altDeg));
    assert.ok(Number.isFinite(snapshot.azDeg));
    assert.ok(Math.abs(Math.hypot(snapshot.sunWorld.x, snapshot.sunWorld.y, snapshot.sunWorld.z) - 1) < 1e-12);
    assert.ok(Math.abs(Math.hypot(snapshot.moonWorld.x, snapshot.moonWorld.y, snapshot.moonWorld.z) - 1) < 1e-12);
  }
});

test('existing solar and lunar characterization suites stay green in the bundled host', () => {
  const result = runSourceCharacterization();

  assert.equal(result.auto.passed, result.auto.total);
  assert.equal(result.full.passed, result.full.total);
  assert.equal(result.moon.passed, result.moon.total);
});

test('checked-in Web baseline matches both current source bytes and current outputs', () => {
  const sourcePaths = [
    '../../src/astro/ephemeris.ts',
    '../../src/astro/autoTests.ts',
    '../../src/astro/fullLightingAutoTest.ts',
    '../../src/astro/moonPhaseAutoTests.ts',
  ];
  const hash = createHash('sha256');
  for (const path of sourcePaths) hash.update(readFileSync(resolve(process.cwd(), path)));

  const astroSourceSha256 = hash.digest('hex');
  assert.equal(astroSourceSha256, baseline.astroSourceSha256);
  assert.equal(baseline.sourceFingerprint.astroSourceSha256, astroSourceSha256);
  assert.equal(baseline.sourceFingerprint.revision, baseline.generatedFromRevision);
  assert.equal(
    createHash('sha256').update(readFileSync(resolve(process.cwd(), 'package-lock.json'))).digest('hex'),
    baseline.sourceFingerprint.dependencyLockSha256,
  );
  const current = computeAstroSnapshots();
  assert.ok(baseline.cases.every((web, index) => compareAstroCase(web, current[index]).status === 'pass'));
});
