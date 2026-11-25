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

// Character variants for supported catalog searches. Keep historical name
// spellings such as 修 and 脩 distinct; the cited source title contains 脩.
const searchVariants = new Map([
  ['蘇', '苏'], ['軾', '轼'], ['歐', '欧'], ['陽', '阳'], ['記', '记'],
  ['遊', '游'], ['蘭', '兰'], ['紹', '绍'], ['興', '兴'], ['書', '书'], ['東', '东'],
  ['啟', '启'], ['啓', '启'], ['魯', '鲁'], ['錢', '钱'], ['學', '学'], ['飛', '飞'],
  ['孫', '孙'], ['齊', '齐'], ['譚', '谭'], ['會', '会'], ['廣', '广'],
  ['國', '国'], ['縣', '县'], ['鄉', '乡'], ['門', '门'], ['圖', '图'],
  ['館', '馆'], ['臺', '台'], ['龍', '龙'], ['長', '长'], ['寧', '宁'],
]);
const variantPattern = new RegExp(`[${[...searchVariants.keys()].join('')}]`, 'g');
const normalizeSearch = (value: string) => value.normalize('NFKC').toLocaleLowerCase()
  .replace(variantPattern, character => searchVariants.get(character)!);

// Match complete standalone date terms, allowing spaces around separators.
// Partial dates and identifiers still use the existing text matching.
const gregorianDateTerm = /(?:^|\s)(\d{1,4})(?:\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日|\s*([-\/])\s*(\d{1,2})\s*\4\s*(\d{1,2}))(?=\s|$)/g;

function searchTerms(value: string) {
  const dates: { literal: string; iso: string }[] = [];
  const text = normalizeSearch(value).replace(gregorianDateTerm, (literal, year, chineseMonth, chineseDay, _separator, numericMonth, numericDay) => {
    const month = chineseMonth ?? numericMonth;
    const day = chineseDay ?? numericDay;
    dates.push({ literal: literal.trimStart(), iso: `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` });
    return ' ';
  });
  return { text: text.split(/\s+/).filter(Boolean), dates };
}

// 苏轼年谱简编 identifies his 字子瞻 and 號東坡 in the introduction
// and 東坡居士 in the 1082 entry. https://fns.pdsu.edu.cn/info/1062/1655.htm
const searchAliases = new Map([['dsh:H002', ['苏东坡', '东坡居士', '苏子瞻']]]);

type SearchEntry = {
  metadata: string;
  sources: { text: string; source: HistoryRecord['sources'][number] }[];
};

// The archive provides shared record objects; replacement records get new entries.
const searchEntries = new WeakMap<HistoryRecord, SearchEntry>();

function searchEntry(record: HistoryRecord) {
  const cached = searchEntries.get(record);
  if (cached) return cached;
  const entry = {
    metadata: normalizeSearch([
      record.name, record.place.original, record.place.observer?.name, record.date.original,
      record.date.iso, record.id, record.originalId, record.period, record.region === 'china' ? '中国' : '世界 海外 境外',
    ].join(' ')),
    sources: record.sources.map(source => ({ source, text: normalizeSearch(source.title) })),
  };
  searchEntries.set(record, entry);
  return entry;
}

export function matchedHistorySource(record: HistoryRecord, query: string) {
  const terms = searchTerms(query);
  if (!terms.text.length && !terms.dates.length) return undefined;
  const { metadata, sources } = searchEntry(record);
  const aliases = searchAliases.get(record.id);
  const sourceTerms = terms.text.filter(term => !metadata.includes(term) && !aliases?.includes(term));
  for (const { literal, iso } of terms.dates) {
    if (record.date.iso !== iso && !metadata.includes(literal)) sourceTerms.push(literal);
  }
  return sources.find(({ text }) => sourceTerms.some(term => text.includes(term)))?.source;
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
    if (terms.text.length || terms.dates.length) {
      const { metadata, sources } = searchEntry(record);
      const matchesLiteral = (term: string) => metadata.includes(term) || sources.some(({ text }) => text.includes(term));
      const aliases = searchAliases.get(record.id);
      if (!terms.text.every(term => aliases?.includes(term) || matchesLiteral(term))) return false;
      if (!terms.dates.every(({ literal, iso }) => record.date.iso === iso || matchesLiteral(literal))) return false;
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
