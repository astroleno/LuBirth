export type AssetTier = '2k' | '8k';

export type ExperimentScenario = {
  id: string;
  label: string;
  visualFocus: 'day' | 'terminator' | 'night';
  utc: string;
  observer: { latDeg: number; lonDeg: number };
  camera: { azimuthDeg: number; elevationDeg: number; distance: number; fovDeg: number };
  fixedSunDirection: readonly [number, number, number];
  earthYawDeg: number;
  assetTiers: readonly AssetTier[];
  pip: {
    resolutions: readonly [256, 512];
    fps: 30;
    screenX: number;
    screenY: number;
    size: number;
  };
  performance: {
    warmupMs: number;
    durationMs: 60_000;
    stabilityDurationMs: 600_000;
    reentryCount: 10;
    pairedRounds: 3;
  };
};

const COMMON = {
  observer: { latDeg: 31.2304, lonDeg: 121.4737 },
  camera: { azimuthDeg: 28, elevationDeg: 18, distance: 3.2, fovDeg: 38 },
  fixedSunDirection: [1, 0, 0] as const,
  earthYawDeg: 0,
  assetTiers: ['2k'] as const,
  pip: {
    resolutions: [256, 512] as const,
    fps: 30 as const,
    screenX: 0.78,
    screenY: 0.22,
    size: 0.24,
  },
  performance: {
    warmupMs: 10_000,
    durationMs: 60_000 as const,
    stabilityDurationMs: 600_000 as const,
    reentryCount: 10 as const,
    pairedRounds: 3,
  },
} as const satisfies Omit<ExperimentScenario, 'id' | 'label' | 'visualFocus' | 'utc'>;

export const SCENARIOS: readonly ExperimentScenario[] = [
  {
    ...COMMON,
    id: 'equinox-shanghai',
    label: '白昼 · 上海（2K）',
    visualFocus: 'day',
    utc: '2024-03-21T12:00:00.000Z',
    fixedSunDirection: [-0.44649398900279075, -0.3090169943749474, -0.8397330617356027],
  },
  {
    ...COMMON,
    id: 'summer-solstice-shanghai',
    label: '晨昏线 · 上海（2K）',
    visualFocus: 'terminator',
    utc: '2024-06-21T12:00:00.000Z',
    fixedSunDirection: [-0.882947592858927, 0, 0.4694715627858908],
  },
  {
    ...COMMON,
    id: 'winter-solstice-shanghai',
    label: '夜面 · 上海（2K）',
    visualFocus: 'night',
    utc: '2024-12-21T12:00:00.000Z',
    fixedSunDirection: [0.44649398900279075, 0.3090169943749474, 0.8397330617356027],
  },
];

export function getScenario(id: string): ExperimentScenario {
  const scenario = SCENARIOS.find((candidate) => candidate.id === id);
  if (!scenario) throw new Error(`Unknown scenario: ${id}`);
  return scenario;
}
