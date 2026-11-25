export type CalendarStatus = 'conditional_gregorian_interpretation' | 'numeric_equivalence_verified'
  | 'calculated_agreement' | 'not_applicable' | 'historical_julian_conversion' | 'gregorian_documented';

export function isHistoryRecordId(id: unknown): id is string {
  return typeof id === 'string' && /^(?:dsh|curated):[A-Za-z0-9_-]+$/.test(id);
}

export type ObserverPlace = {
  name: string;
  latitude: number;
  longitude: number;
  precision: 'representative' | 'historical-site' | 'user-selected';
  note: string;
  source?: string;
  timeZone?: string;
};

export type HistorySource = { url: string; title: string };

export type HistoryDateEvidence = {
  originalLabel: string;
  calendarLabel: string;
  era?: string;
  ganzhiYear?: string;
  ganzhiDays?: string[];
  lunar?: { year: number; month: number; day: number };
  note: string;
  sources: HistorySource[];
};

type HistoryClockBasis =
  | { kind: 'unverified'; note: string; sources?: HistorySource[] }
  | { kind: 'fixed-offset'; offsetMinutes: number; note: string; sources: HistorySource[] };

type RecordedTime = { original: string; note: string; source: HistorySource; clockBasis: HistoryClockBasis };

export type HistoryTime =
  | { precision: 'date-only'; note: string }
  | (RecordedTime & { precision: 'point'; clock: string; scope: 'event' | 'related' })
  | (RecordedTime & { precision: 'window'; start: string; end: string; example: string; dayBoundary?: 'unverified' });

export type HistorySiteEvidence = {
  coordinateSystem: 'WGS84';
  radiusMeters: number;
  scope: 'site' | 'area';
  sources: HistorySource[];
};

export type HistoryRecord = {
  id: string;
  originalId: string;
  kind: 'birth' | 'event';
  name: string;
  period: string;
  region: 'china' | 'world';
  date: {
    original: string;
    originalCalendar: string;
    iso: string;
    jdn: number;
    status: CalendarStatus;
    note: string;
    evidence?: HistoryDateEvidence;
  };
  time: HistoryTime;
  place: { original: string; role: string; precision: string; note: string; observer: ObserverPlace | null; evidence?: HistorySiteEvidence };
  sources: HistorySource[];
  notes: string;
  remainingChecks: string[];
  provenance: { dataset: string; file: string; recordHash: string; baseRecordHash?: string; productionReady: boolean };
};

export function historyEvidenceSources(record: HistoryRecord): HistorySource[] {
  const sources = [...(record.date.evidence?.sources ?? []), ...(record.place.evidence?.sources ?? [])];
  if (record.time.precision !== 'date-only') sources.push(record.time.source, ...(record.time.clockBasis.sources ?? []));
  return [...new Map(sources.map(source => [source.url, source])).values()];
}

export function historicalCalendarText(record: HistoryRecord): string | undefined {
  const { original, originalCalendar, evidence } = record.date;
  return evidence?.originalLabel ?? (originalCalendar === 'chinese-historical' || originalCalendar === 'julian' ? original : undefined);
}

export const ORIGINAL_CALENDAR_LABELS: Record<string, string> = {
  'chinese-historical': '中国原历', gregorian: '格里高利历', julian: '儒略历', 'western-unspecified': '西历种类未明',
};

export const CALENDAR_LABELS: Record<CalendarStatus, string> = {
  conditional_gregorian_interpretation: '按公历作条件性解释',
  numeric_equivalence_verified: '日序对应已核对',
  calculated_agreement: '历法计算结果一致',
  not_applicable: '沿用资料日期解释',
  historical_julian_conversion: '按历史儒略历日期换算',
  gregorian_documented: '采用史料所记的格里高利历日期',
};

export const CALENDAR_NOTES: Record<CalendarStatus, string> = {
  conditional_gregorian_interpretation: '来源没有明确声明西历种类。这里按前推格里高利历解释数字日期，用于演示；不代表作者已声明采用该历法。',
  numeric_equivalence_verified: '原历与西历数字的日序对应已核对；数值相同不能证明作者采用的历法，仍须保留资料中的分歧与说明。',
  calculated_agreement: '已有历法换算得到一致日序。计算一致不等于独立史料已经证明所有日期解释。',
  not_applicable: '这里沿用资料包所给的规范日期，并保留原历文字与出处；尚未建立精确的出生或事件时刻。',
  historical_julian_conversion: '依事件发生时当地的历法，将记载的儒略历日期换算为同一日序的前推格里高利历日期。',
  gregorian_documented: '采用事件文书所记日期，沿用事件发生时当地的格里高利民用历法。',
};
