import type { HistoryRecord } from './historyModel';
import type { Observation } from './observation';
import { civilDate } from './observation';

export type HistoryFilter = 'all' | 'birth' | 'event' | 'birthday' | 'season' | 'today' | 'saved';
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
  const query = (options.query || '').trim().toLocaleLowerCase();
  const filter = options.filter || 'all';
  const birthDate = options.birth?.civilDate;
  const matches = records.filter(record => {
    if (query && ![record.name, record.place.original, record.date.original, record.date.iso, record.originalId]
      .join(' ').toLocaleLowerCase().includes(query)) return false;
    if (options.period && options.period !== 'all' && record.period !== options.period) return false;
    if (filter === 'birth' || filter === 'event') return record.kind === filter;
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
