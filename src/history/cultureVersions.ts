import type { CultureVersion } from './journeyStore';

export const CULTURE_INFO: Record<CultureVersion, {
  name: string; shortName: string; era: string; description: string; author: string; source: string;
}> = {
  chenzhuo: {
    name: '陈卓体系 · 三世纪重建', shortName: '陈卓体系', era: '三世纪',
    description: '从陈卓星表、三家星经及传世星图重建早期星官。名字与星形是现代研究的复原，部分对应仍可能修订。',
    author: '杨伯顺 / Stellarium · CC BY-SA 4.0',
    source: 'https://github.com/Stellarium/stellarium/blob/v26.3/skycultures/chinese_chenzhuo/description.md',
  },
  song: {
    name: '宋代星官 · 1052 体系重建', shortName: '宋代星官', era: '十一世纪',
    description: '沿用现有宋代星官重建。二十八宿人物线稿来自元代玉皇庙彩塑的当代转绘，图像来源与星官体系分别标明。',
    author: '孙殳玮 / Stellarium · CC BY-SA 4.0',
    source: 'https://github.com/Stellarium/stellarium/tree/023040b5241badc9ea0b29428e3ef3f35d2fc65b/skycultures/chinese_song_dynasty',
  },
  yuan: {
    name: '元代星官 · 十四世纪重建', shortName: '元代星官', era: '十四世纪',
    description: '依据《天文汇钞》相关星表研究呈现十四世纪星官。这里展示该资料所收录的星形，不把它称作所有元代人的统一星图。',
    author: 'Lyu Haocheng / Stellarium · CC BY-SA 4.0',
    source: 'https://github.com/Stellarium/stellarium/blob/v26.3/skycultures/chinese_yuan_dynasty/description.md',
  },
  modern: {
    name: '现代 88 星座', shortName: '现代 88 星座', era: '现代',
    description: '用现有现代星座连线和图绘辨认同一片天空；连线图形与正式天区边界不同。',
    author: 'Stellarium 团队 · 连线 CC BY-SA 4.0，图绘 Free Art License',
    source: 'https://github.com/Stellarium/stellarium/tree/v26.3/skycultures/modern',
  },
};

export function contemporaryCulture(year: number): CultureVersion | null {
  if (year >= 200 && year < 400) return 'chenzhuo';
  if (year >= 960 && year < 1279) return 'song';
  if (year >= 1279 && year < 1368) return 'yuan';
  return null;
}
