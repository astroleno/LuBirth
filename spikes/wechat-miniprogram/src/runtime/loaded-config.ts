import type { AssetTier } from '../config/scenarios.ts';
import type { RuntimeRoute } from './runtime-contract.ts';

export type LoadedSceneConfig = {
  runtimeRoute: RuntimeRoute;
  assetTier: AssetTier;
  scenarioId: string;
  assetSource: 'fallback' | 'remote';
};

export type LoadedSceneConfigMismatch = keyof LoadedSceneConfig | 'missingLoadedConfig';

export function compareLoadedSceneConfig(
  actual: LoadedSceneConfig | null,
  requested: LoadedSceneConfig,
): { matches: boolean; mismatches: LoadedSceneConfigMismatch[] } {
  if (!actual) return { matches: false, mismatches: ['missingLoadedConfig'] };
  const fields: Array<keyof LoadedSceneConfig> = [
    'runtimeRoute',
    'assetTier',
    'scenarioId',
    'assetSource',
  ];
  const mismatches = fields.filter((field) => actual[field] !== requested[field]);
  return { matches: mismatches.length === 0, mismatches };
}
