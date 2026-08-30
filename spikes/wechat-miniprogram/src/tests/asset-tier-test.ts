import type { AssetTier } from '../config/scenarios.ts';
import type { ResultStatus } from '../metrics/result-schema.ts';
import type { AssetLoadResult } from '../assets/texture-loader.ts';

export type AssetTierSummary = {
  tier: AssetTier;
  status: ResultStatus;
  assetCount: number;
  passedAssetCount: number;
  cacheHitCount: number;
  totalBytes: number;
  totalDownloadMs: number;
  totalDecodeMs: number;
  totalUploadMs: number;
  failedAssetIds: string[];
};

export function summarizeAssetTier(tier: AssetTier, results: AssetLoadResult[]): AssetTierSummary {
  const failedAssetIds = results
    .filter((entry) => entry.status === 'fail' || entry.status === 'unsupported')
    .map((entry) => entry.id);
  const status: ResultStatus = results.some((entry) => entry.status === 'fail')
    ? 'fail'
    : results.some((entry) => entry.status === 'unsupported')
      ? 'unsupported'
      : results.length === 0 || results.some((entry) => entry.status === 'inconclusive')
        ? 'inconclusive'
        : 'pass';
  return {
    tier,
    status,
    assetCount: results.length,
    passedAssetCount: results.filter((entry) => entry.status === 'pass').length,
    cacheHitCount: results.filter((entry) => entry.fromCache).length,
    totalBytes: results.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0),
    totalDownloadMs: results.reduce((sum, entry) => sum + (entry.timings.downloadMs ?? 0), 0),
    totalDecodeMs: results.reduce((sum, entry) => sum + (entry.timings.decodeMs ?? 0), 0),
    totalUploadMs: results.reduce((sum, entry) => sum + (entry.timings.uploadMs ?? 0), 0),
    failedAssetIds,
  };
}
