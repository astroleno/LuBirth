import { historicalCalendarText, isHistoryRecordId, type HistoryRecord } from '../history/historyModel';
import type { Observation } from '../history/observation';

export type KeepsakeHistorySummary = Readonly<{
  recordId: string;
  recordHash: string;
  civilDate: string;
  originalDate?: string;
  conditionalDate: boolean;
  time?: Readonly<{ scope?: 'event' | 'related'; dayBoundary?: 'unverified'; offsetMinutes: number | null }>;
}>;

const chineseDay = /[正冬臘腊一二三四五六七八九十]+月(?:[初廿卅一二三四五六七八九十]+日?|[朔晦]|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/u;

function originalDateForCard(record: HistoryRecord) {
  const source = historicalCalendarText(record);
  if (!source || record.date.evidence || record.date.originalCalendar !== 'chinese-historical') return source;
  // Raw citations can continue with a clock, a place, or an entire sentence.
  const day = chineseDay.exec(source);
  if (!day) return undefined;
  const before = source.slice(0, day.index);
  const open = Math.max(before.lastIndexOf('（'), before.lastIndexOf('('));
  const closed = Math.max(before.lastIndexOf('）'), before.lastIndexOf(')'));
  return source.slice(open > closed ? open + 1 : 0, day.index + day[0].length).trim();
}

export async function loadKeepsakeHistorySummary(observation: Observation): Promise<KeepsakeHistorySummary | undefined> {
  const { source, civilDate } = observation;
  if (source.kind !== 'history' || !isHistoryRecordId(source.recordId) || !source.recordHash) return undefined;
  const { historyCatalog } = await import('../history/historyCatalog');
  const record = historyCatalog.records.find(candidate => candidate.id === source.recordId && candidate.date.iso === civilDate
    && candidate.provenance.recordHash === source.recordHash);
  if (!record) return undefined;
  const time = record.time.precision === 'date-only' ? undefined : Object.freeze({
    scope: record.time.scope,
    dayBoundary: record.time.precision === 'window' ? record.time.dayBoundary : undefined,
    offsetMinutes: record.time.clockBasis.kind === 'fixed-offset' ? record.time.clockBasis.offsetMinutes : null,
  });
  return Object.freeze({ recordId: record.id, recordHash: record.provenance.recordHash, civilDate, originalDate: originalDateForCard(record),
    conditionalDate: record.date.status === 'conditional_gregorian_interpretation',
    time });
}
