import songData from './data/catalog.json';
import modernData from './data/modern.json';
import originalArtwork from './data/chinese-art/manifest.json';
import type { SkyCulture } from './skyModel';
import historicalData from './data/historical-cultures.json';
import { CULTURE_INFO } from '../../history/cultureVersions';

const skyImages = new Map(originalArtwork.entries.map(entry => [entry.cultureId, entry.skyImage]));
export const CHINESE_ARTWORK = new Map(originalArtwork.entries.map(entry => [entry.cultureId, entry]));
const song = (songData.culture as SkyCulture[]).map(item => {
  const image = skyImages.get(item.id);
  return image ? { ...item, image } : item;
});
const mansions = songData.lunarSystemUnverified.names.map(mansion => {
  // The primary asterism, NOT the unverified mansion-sector boundary.
  const item = song.find(asterism => asterism.name === mansion.native + '宿');
  if (!item) throw new Error('Missing primary lunar-mansion asterism: ' + mansion.native);
  return item;
});
export const SKY_SYSTEMS = {
  chenzhuo: { name: CULTURE_INFO.chenzhuo.name, count: String(historicalData.cultures[0].items.length) + ' 条绘图记录',
    items: historicalData.cultures.find(item => item.id === 'chenzhuo')!.items as SkyCulture[],
    help: '三世纪体系的现代研究重建。HIP 115125 使用同一双星系统的成分星代理；M7 / M31 / M44 不绘制。未推断宿界。' },
  yuan: { name: CULTURE_INFO.yuan.name, count: String(historicalData.cultures.find(item => item.id === 'yuan')!.items.length) + ' 条绘图记录',
    items: historicalData.cultures.find(item => item.id === 'yuan')!.items as SkyCulture[],
    help: '十四世纪《天文汇钞》相关星官重建。显示资料收录的星官，不扩写成完整历史星官总数；M7 / M31 / M44 不绘制，未推断宿界。' },
  modern: { name: '现代 88 星座', count: '88', items: modernData as SkyCulture[],
    help: 'Stellarium 26.3 现代星座连线与中文名。当前显示星座图形，尚未绘制 IAU 星座区域边界。' },
  mansions: { name: '中国二十八宿', count: '28', items: mansions,
    help: '显示宋代体系的二十八宿主星官连线。并非 28 个等分扇区；距星、宿界及月亮落宿仍待核实。' },
  song: { name: '宋代完整星官', count: '339 条绘图记录', items: song,
    help: '1052 年体系的现代重建；339 是绘图记录数，不是历史星官总数。两处 HIP 锚点使用成分星代理，M7 / M44 尚未绘制。' },
} as const;
export type SkySystem = keyof typeof SKY_SYSTEMS;
