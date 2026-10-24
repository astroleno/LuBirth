import base from './data/catalog.json';
import historical from './data/historical-cultures.json';
import type { SkyCatalog } from './skyModel';

// The frame and every GPU attribute must use this exact order and star count.
export const skyCatalog = { ...base, stars: [...base.stars, ...historical.extraStars],
  hipAliases: [...base.hipAliases, ...historical.hipAliases] } as unknown as SkyCatalog;
