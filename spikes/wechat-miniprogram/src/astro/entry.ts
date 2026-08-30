import type { AstroSnapshot } from '../tests/astro-parity-test.ts';

type SuiteResult = { passed: number; total: number; results: unknown[] };
type EphemerisValue = Omit<AstroSnapshot, 'id' | 'utc' | 'latDeg' | 'lonDeg' | 'azDefined'> & {
  azDefined?: boolean;
};

// Deliberately use the bundler boundary instead of a copied algorithm. TypeScript
// does not pull the browser application's unrelated diagnostics into this spike,
// while esbuild still resolves and bundles these exact repository source files.
const { runAutoTests } = require('../../../../src/astro/autoTests.ts') as {
  runAutoTests(): SuiteResult;
};
const { computeEphemeris } = require('../../../../src/astro/ephemeris.ts') as {
  computeEphemeris(date: Date, latDeg: number, lonDeg: number): EphemerisValue;
};
const { runFullLightingValidation } = require('../../../../src/astro/fullLightingAutoTest.ts') as {
  runFullLightingValidation(): SuiteResult;
};
const { runMoonPhaseAutoTests } = require('../../../../src/astro/moonPhaseAutoTests.ts') as {
  runMoonPhaseAutoTests(): SuiteResult;
};

export type AstroCaseDefinition = {
  id: string;
  utc: string;
  latDeg: number;
  lonDeg: number;
};

export const ASTRO_CASE_DEFINITIONS: readonly AstroCaseDefinition[] = [
  { id: 'equinox-shanghai', utc: '2024-03-21T12:00:00.000Z', latDeg: 31.2304, lonDeg: 121.4737 },
  { id: 'summer-solstice-shanghai', utc: '2024-06-21T12:00:00.000Z', latDeg: 31.2304, lonDeg: 121.4737 },
  { id: 'winter-solstice-shanghai', utc: '2024-12-21T12:00:00.000Z', latDeg: 31.2304, lonDeg: 121.4737 },
  { id: 'equinox-equator-near-zenith', utc: '2024-03-21T12:00:00.000Z', latDeg: 0, lonDeg: 0 },
  { id: 'arctic-circle-summer-midnight', utc: '2024-06-21T00:00:00.000Z', latDeg: 66.6, lonDeg: 0 },
  { id: 'antarctic-circle-polar-night', utc: '2024-06-21T12:00:00.000Z', latDeg: -66.6, lonDeg: 0 },
  { id: 'date-line-east', utc: '2024-03-21T00:00:00.000Z', latDeg: 15, lonDeg: 179.9 },
  { id: 'date-line-west', utc: '2024-03-21T00:00:00.000Z', latDeg: 15, lonDeg: -179.9 },
];

export function computeAstroSnapshot(definition: AstroCaseDefinition): AstroSnapshot {
  const ephemeris = computeEphemeris(
    new Date(definition.utc),
    definition.latDeg,
    definition.lonDeg,
  );
  return {
    ...definition,
    altDeg: ephemeris.altDeg,
    azDeg: ephemeris.azDeg,
    azDefined: ephemeris.azDefined !== false && Math.abs(ephemeris.altDeg) < 89.9,
    illumination: ephemeris.illumination,
    sunWorld: { ...ephemeris.sunWorld },
    moonWorld: { ...ephemeris.moonWorld },
  };
}

export function computeAstroSnapshots(): AstroSnapshot[] {
  return ASTRO_CASE_DEFINITIONS.map(computeAstroSnapshot);
}

export function runSourceCharacterization() {
  return {
    auto: runAutoTests(),
    full: runFullLightingValidation(),
    moon: runMoonPhaseAutoTests(),
  };
}
