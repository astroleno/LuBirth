export type CalendarStatus = 'conditional_gregorian_interpretation' | 'numeric_equivalence_verified'
  | 'calculated_agreement' | 'not_applicable';

export type ObserverPlace = {
  name: string;
  latitude: number;
  longitude: number;
  precision: 'representative' | 'user-selected';
  note: string;
  source?: string;
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
  };
  time: { precision: 'date-only'; note: string };
  place: { original: string; role: string; precision: string; note: string; observer: ObserverPlace | null };
  sources: { url: string; title: string }[];
  notes: string;
  remainingChecks: string[];
  provenance: { dataset: string; file: string; recordHash: string; productionReady: boolean };
};

export const CALENDAR_LABELS: Record<CalendarStatus, string> = {
  conditional_gregorian_interpretation: '按公历作条件性解释',
  numeric_equivalence_verified: '日序对应已核对',
  calculated_agreement: '历法计算结果一致',
  not_applicable: '沿用资料日期解释',
};

export const CALENDAR_NOTES: Record<CalendarStatus, string> = {
  conditional_gregorian_interpretation: '来源没有明确声明西历种类。这里按前推格里高利历解释数字日期，用于演示；不代表作者已声明采用该历法。',
  numeric_equivalence_verified: '原历与西历数字的日序对应已核对；数值相同不能证明作者采用的历法，仍须保留资料中的分歧与说明。',
  calculated_agreement: '已有历法换算得到一致日序。计算一致不等于独立史料已经证明所有日期解释。',
  not_applicable: '这里沿用资料包所给的规范日期，并保留原历文字与出处；尚未建立精确的出生或事件时刻。',
};
