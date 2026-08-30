import type { AssetTier } from '../config/scenarios.ts';

export type AssetKey =
  | 'earthDay'
  | 'earthNight'
  | 'earthNormal'
  | 'earthSpecular'
  | 'earthDisplacement'
  | 'clouds'
  | 'moon'
  | 'moonNormal'
  | 'moonDisplacement'
  | 'stars';

export type AssetManifestEntry = {
  id: string;
  key: AssetKey;
  tier: AssetTier;
  fileName: string;
  mimeType: 'image/jpeg' | 'image/webp';
  fileBytes: number;
  width: number;
  height: number;
  decodedRgbaBytes: number;
  colorSpace: 'srgb' | 'linear';
  required: boolean;
};

function entry(input: Omit<AssetManifestEntry, 'decodedRgbaBytes'>): AssetManifestEntry {
  return { ...input, decodedRgbaBytes: input.width * input.height * 4 };
}

export const ASSET_MANIFEST: readonly AssetManifestEntry[] = [
  entry({ id: 'earth-clouds-2k', key: 'clouds', tier: '2k', fileName: '2k_earth_clouds.jpg', mimeType: 'image/jpeg', fileBytes: 965676, width: 2048, height: 1024, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-day-2k', key: 'earthDay', tier: '2k', fileName: '2k_earth_daymap.jpg', mimeType: 'image/jpeg', fileBytes: 463087, width: 2048, height: 1024, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-displacement-2k', key: 'earthDisplacement', tier: '2k', fileName: '2k_earth_displacement_map.jpg', mimeType: 'image/jpeg', fileBytes: 159845, width: 2048, height: 1024, colorSpace: 'linear', required: true }),
  entry({ id: 'earth-night-2k', key: 'earthNight', tier: '2k', fileName: '2k_earth_nightmap.jpg', mimeType: 'image/jpeg', fileBytes: 255287, width: 2048, height: 1024, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-normal-2k', key: 'earthNormal', tier: '2k', fileName: '2k_earth_normal_map.jpg', mimeType: 'image/jpeg', fileBytes: 420471, width: 2048, height: 1024, colorSpace: 'linear', required: true }),
  entry({ id: 'earth-specular-2k', key: 'earthSpecular', tier: '2k', fileName: '2k_earth_specular_map.jpg', mimeType: 'image/jpeg', fileBytes: 498489, width: 2048, height: 1024, colorSpace: 'linear', required: true }),
  entry({ id: 'moon-color-2k', key: 'moon', tier: '2k', fileName: '2k_moon.jpg', mimeType: 'image/jpeg', fileBytes: 1053869, width: 2048, height: 1024, colorSpace: 'srgb', required: true }),
  entry({ id: 'moon-displacement-2k', key: 'moonDisplacement', tier: '2k', fileName: '2k_moon_displacement.jpg', mimeType: 'image/jpeg', fileBytes: 852265, width: 2048, height: 1024, colorSpace: 'linear', required: true }),
  entry({ id: 'moon-normal-2k', key: 'moonNormal', tier: '2k', fileName: '2k_moon_normal.jpg', mimeType: 'image/jpeg', fileBytes: 1718242, width: 2048, height: 1024, colorSpace: 'linear', required: true }),
  entry({ id: 'stars-2k', key: 'stars', tier: '2k', fileName: '2k_stars_milky_way.webp', mimeType: 'image/webp', fileBytes: 43612, width: 2048, height: 1024, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-clouds-8k', key: 'clouds', tier: '8k', fileName: '8k_earth_clouds.webp', mimeType: 'image/webp', fileBytes: 8284478, width: 8192, height: 4096, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-day-8k', key: 'earthDay', tier: '8k', fileName: '8k_earth_daymap.webp', mimeType: 'image/webp', fileBytes: 2460196, width: 8192, height: 4096, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-displacement-8k', key: 'earthDisplacement', tier: '8k', fileName: '8k_earth_displacement_map.jpg', mimeType: 'image/jpeg', fileBytes: 1588717, width: 8192, height: 4096, colorSpace: 'linear', required: true }),
  entry({ id: 'earth-night-8k', key: 'earthNight', tier: '8k', fileName: '8k_earth_nightmap.webp', mimeType: 'image/webp', fileBytes: 1274016, width: 8192, height: 4096, colorSpace: 'srgb', required: true }),
  entry({ id: 'earth-specular-8k', key: 'earthSpecular', tier: '8k', fileName: '8k_earth_specular_map.webp', mimeType: 'image/webp', fileBytes: 755346, width: 8192, height: 4096, colorSpace: 'linear', required: true }),
  entry({ id: 'stars-8k', key: 'stars', tier: '8k', fileName: '8k_stars_milky_way.webp', mimeType: 'image/webp', fileBytes: 564780, width: 8192, height: 4096, colorSpace: 'srgb', required: true }),
];

export function selectAssetsForTier(tier: AssetTier): AssetManifestEntry[] {
  if (tier === '2k') return ASSET_MANIFEST.filter((asset) => asset.tier === '2k');
  const byKey = new Map<AssetKey, AssetManifestEntry>();
  for (const asset of ASSET_MANIFEST) {
    const selected = byKey.get(asset.key);
    if (!selected || asset.tier === '8k') byKey.set(asset.key, asset);
  }
  return [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
}
