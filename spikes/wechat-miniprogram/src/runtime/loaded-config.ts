import type { AssetTier } from '../config/scenarios.ts';
import type { RuntimeRoute } from './runtime-contract.ts';

export type LoadedSceneConfig = {
  runtimeRoute: RuntimeRoute;
  assetTier: AssetTier;
  scenarioId: string;
  assetSource: 'fallback' | 'remote';
};

export type LoadedSceneConfigMismatch = keyof LoadedSceneConfig | 'missingLoadedConfig';

export type EffectMatrixReadiness = {
  ready: boolean;
  missing: Array<'runtime' | 'loader' | 'passingScene' | 'remote2k'>;
};

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

export function evaluateEffectMatrixReadiness(input: {
  runtimeReady: boolean;
  loaderReady: boolean;
  loadedSceneStatus: 'pass' | 'fail' | 'unsupported' | 'inconclusive' | null;
  loadedConfig: LoadedSceneConfig | null;
}): EffectMatrixReadiness {
  const missing: EffectMatrixReadiness['missing'] = [];
  if (!input.runtimeReady) missing.push('runtime');
  if (!input.loaderReady) missing.push('loader');
  if (input.loadedSceneStatus !== 'pass') missing.push('passingScene');
  if (input.loadedConfig?.assetTier !== '2k' || input.loadedConfig.assetSource !== 'remote') {
    missing.push('remote2k');
  }
  return { ready: missing.length === 0, missing };
}
