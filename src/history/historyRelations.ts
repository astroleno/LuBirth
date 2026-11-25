import type { HistoryRecord } from './historyModel';
import type { Observation } from './observation';
import { civilDate } from './observation';

export type HistoryFilter = 'all' | 'birth' | 'event' | 'ready' | 'birthday' | 'season' | 'today' | 'saved';
export const EARLY_PERIODS = 'before-qing';
const earlyPeriods = new Set(['魏晋南北朝', '隋唐', '五代十国', '宋代', '元代', '明代']);
export const WORLD_PERIOD = '世界其他地区';

/** Preparation required by the record itself, before applying saved edits. */
export function historyViewingNeeds(record: HistoryRecord) {
  return { place: !record.place.observer, clock: record.kind === 'birth' };
}

const normalizeSearch = (value: string) => value.normalize('NFKC').toLocaleLowerCase();
const searchTerms = (value: string) => normalizeSearch(value).split(/\s+/).filter(Boolean);
const metadataText = (record: HistoryRecord) => normalizeSearch([
  record.name, record.place.original, record.place.observer?.name, record.date.original,
  record.date.iso, record.id, record.originalId, record.period, record.region === 'china' ? '中国' : '世界 海外 境外',
].join(' '));

export function matchedHistorySource(record: HistoryRecord, query: string) {
  const metadata = metadataText(record);
  const sourceTerms = searchTerms(query).filter(term => !metadata.includes(term));
  return record.sources.find(source => sourceTerms.some(term => normalizeSearch(source.title).includes(term)));
}

export function monthDayDistance(a: string, b: string) {
  // Leap-year reference gives February 29 its own place; no implicit Feb 28 birthday.
  const day = (iso: string) => civilDate('2000-' + iso.slice(5)).getTime() / 86400000;
  const delta = Math.abs(day(a) - day(b));
  return Math.min(delta, 366 - delta);
}

export function selectHistory(records: HistoryRecord[], options: {
  query?: string; filter?: HistoryFilter; period?: string; birth?: Observation | null;
  favorites?: string[]; today?: string;
}) {
  const terms = searchTerms(options.query || '');
  const filter = options.filter || 'all';
  const birthDate = options.birth?.civilDate;
  const matches = records.filter(record => {
    if (terms.length) {
      const text = [metadataText(record), ...record.sources.map(source => normalizeSearch(source.title))];
      if (!terms.every(term => text.some(value => value.includes(term)))) return false;
    }
    if (options.period === EARLY_PERIODS) {
      if (!earlyPeriods.has(record.period) || record.region !== 'china') return false;
    } else if (options.period && options.period !== 'all' && record.period !== options.period) return false;
    if (filter === 'birth' || filter === 'event') return record.kind === filter;
    if (filter === 'ready') {
      const needs = historyViewingNeeds(record);
      return !needs.place && !needs.clock;
    }
    if (filter === 'birthday') return !!birthDate && record.date.iso.slice(5) === birthDate.slice(5);
    if (filter === 'season') return !!birthDate && monthDayDistance(record.date.iso, birthDate) <= 14;
    if (filter === 'today') return !!options.today && record.date.iso.slice(5) === options.today.slice(5);
    if (filter === 'saved') return options.favorites?.includes(record.id);
    return true;
  });
  return matches.sort((a, b) => filter === 'season' && birthDate
    ? monthDayDistance(a.date.iso, birthDate) - monthDayDistance(b.date.iso, birthDate) || a.date.iso.localeCompare(b.date.iso)
    : a.date.iso.localeCompare(b.date.iso));
}

export function relationLabel(record: HistoryRecord, birth: Observation | null) {
  if (!birth) return null;
  const days = monthDayDistance(record.date.iso, birth.civilDate);
  return days === 0 ? '与你同月同日 · 换算公历' : days <= 14 ? `与你的生日相距 ${days} 天 · 公历时节` : null;
}

export function localToday(date = new Date()) {
  return `${date.getFullYear().toString().padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
