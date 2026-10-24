import type { HistoryRecord, ObserverPlace } from './historyModel';

export type TimeBasis = { kind: 'offset'; offsetMinutes: number } | { kind: 'local-mean-solar' };
export type TimeSelection = {
  origin: 'user-input' | 'event-default-20' | 'legacy-demo' | 'system-example';
  ruleVersion: 'event-evening-v1' | null;
  label: string;
};
export type Observation = {
  utc: string;
  civilDate: string;
  clock: string;
  timeBasis: TimeBasis;
  observer: ObserverPlace;
  source: { kind: 'birth' | 'history' | 'example'; label: string; recordId?: string; recordHash?: string; recordKind?: 'birth' | 'event' };
  assumptions: string[];
  timeSelection: TimeSelection;
};

export function civilDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error('请填写完整的公历日期。');
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (year < 1 || year > 2999 || date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
    throw new Error('请填写 0001–2999 年间有效的公历日期。');
  return date;
}

export function validateObserver(observer: ObserverPlace) {
  if (!observer || !observer.name?.trim() || !Number.isFinite(observer.latitude) || Math.abs(observer.latitude) > 90
    || !Number.isFinite(observer.longitude) || Math.abs(observer.longitude) > 180)
    throw new Error('请明确选择观测地点，并填写有效经纬度。');
  return observer;
}

export function resolveObservation(date: string, clock: string, observer: ObserverPlace, timeBasis: TimeBasis,
  source: Observation['source'], assumptions: string[] = [], selection?: TimeSelection): Observation {
  validateObserver(observer);
  const instant = civilDate(date);
  const parts = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(clock);
  if (!parts) throw new Error('请选择观测钟点；只知道日期不能推算准确时刻。');
  const hour = Number(parts[1]), minute = Number(parts[2]), second = Number(parts[3] || 0);
  if (hour > 23 || minute > 59 || second > 59) throw new Error('观测钟点超出有效范围。');
  let offsetSeconds: number;
  if (timeBasis.kind === 'local-mean-solar') offsetSeconds = Math.round(observer.longitude * 240);
  else if (timeBasis.kind === 'offset' && Number.isInteger(timeBasis.offsetMinutes) && Math.abs(timeBasis.offsetMinutes) <= 840)
    offsetSeconds = timeBasis.offsetMinutes * 60;
  else throw new Error('请选择有效的时间解释。');
  instant.setUTCHours(hour, minute, second, 0);
  instant.setTime(instant.getTime() - offsetSeconds * 1000);
  if (instant.getUTCFullYear() < 1 || instant.getUTCFullYear() > 2999) throw new Error('换算后的 UTC 超出可显示年份范围。');
  const timeSelection: TimeSelection = selection === undefined ? (source.kind === 'history'
    ? { origin: 'legacy-demo', ruleVersion: null, label: '此前保存的演示时刻。' }
    : source.kind === 'example' ? { origin: 'system-example', ruleVersion: null, label: '当前时刻示例。' }
      : { origin: 'user-input', ruleVersion: null, label: '用户填写的出生时刻。' }) : selection;
  if (!['user-input', 'event-default-20', 'legacy-demo', 'system-example'].includes(timeSelection.origin)
    || typeof timeSelection.label !== 'string' || timeSelection.label.length > 500
    || (source.recordKind !== undefined && !['birth', 'event'].includes(source.recordKind))
    || (timeSelection.origin === 'event-default-20' && (source.kind !== 'history' || source.recordKind !== 'event'
      || !/^20:00(?::00)?$/.test(clock) || timeSelection.ruleVersion !== 'event-evening-v1'))
    || (timeSelection.origin !== 'event-default-20' && timeSelection.ruleVersion !== null)
    || (timeSelection.origin === 'system-example' && source.kind !== 'example')
    || (timeSelection.origin === 'legacy-demo' && source.kind !== 'history')) throw new Error('演示钟点来源无效，请重新选择。');
  return { utc: instant.toISOString(), civilDate: date, clock, timeBasis: { ...timeBasis }, observer: { ...observer },
    source: { ...source }, assumptions: [...assumptions], timeSelection: { ...timeSelection } };
}

export function historyObservation(record: HistoryRecord, choices: {
  clock: string; observer: ObserverPlace | null; timeBasis: TimeBasis; dateAcknowledged: boolean; placeConfirmed: boolean; timeSelection?: TimeSelection;
}) {
  if (!choices.dateAcknowledged) throw new Error('请先确认本条日期解释与演示说明。');
  if (!choices.placeConfirmed || !choices.observer) throw new Error('请选择并确认用于演示的观测地点。');
  return resolveObservation(record.date.iso, choices.clock, choices.observer, choices.timeBasis,
    { kind: 'history', label: record.name, recordId: record.id, recordHash: record.provenance.recordHash, recordKind: record.kind },
    ['演示时刻，并非已经核实的出生或事件钟点。',
      choices.observer.precision === 'representative' ? '采用现代地点代表点，不是历史建筑的精确位置。' : '采用用户所选观测位置，不回写为历史发生地。',
      ...(record.date.status === 'conditional_gregorian_interpretation' ? ['日期按前推格里高利历作条件性解释。'] : []),
      ...(choices.timeBasis.kind === 'local-mean-solar' ? ['地方平太阳时是本次演示约定，不代表当时的民用时间制度。'] : []),
      ...(choices.timeSelection?.origin === 'event-default-20' ? ['史料未载时刻，默认以所选地点的 20:00 演示，不代表事件发生瞬间。'] : [])],
    choices.timeSelection || { origin: 'user-input', ruleVersion: null, label: '自选演示时刻，并非史料认定钟点。' });
}

export function readObservation(value: unknown): Observation | null {
  try {
    const candidate = value as Observation;
    if (!candidate || !['birth', 'history', 'example'].includes(candidate.source?.kind)
      || typeof candidate.source.label !== 'string' || candidate.source.label.length > 300
      || !Array.isArray(candidate.assumptions) || candidate.assumptions.some(item => typeof item !== 'string')) return null;
    const parsed = resolveObservation(candidate.civilDate, candidate.clock, candidate.observer, candidate.timeBasis,
      candidate.source, candidate.assumptions, candidate.timeSelection);
    return parsed.utc === candidate.utc ? parsed : null;
  } catch { return null; }
}

export function offsetLabel(minutes: number) {
  const value = Math.abs(minutes);
  return `UTC${minutes < 0 ? '−' : '+'}${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

export function timeBasisLabel(basis: TimeBasis) {
  return basis.kind === 'local-mean-solar' ? '地方平太阳时 · 演示约定' : offsetLabel(basis.offsetMinutes);
}

export function exampleObservation(now = new Date()): Observation {
  const shifted = new Date(now.getTime() + 480 * 60000).toISOString();
  return resolveObservation(shifted.slice(0, 10), shifted.slice(11, 19),
    { name: '上海', latitude: 31.2304, longitude: 121.4737, precision: 'representative', note: '初始示例地点' },
    { kind: 'offset', offsetMinutes: 480 }, { kind: 'example', label: '此时的上海' });
}

/** Explicit ISO offsets pass through; legacy unzoned callers keep their existing adapter. */
export function parseAbsoluteInstant(value: string): Date | null {
  if (!/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return null;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/i.exec(value);
  if (!match) throw new Error('Invalid absolute observation instant');
  civilDate(match[1]);
  const [, , h, m, s, , zone] = match;
  if (Number(h) > 23 || Number(m) > 59 || Number(s || 0) > 59) throw new Error('Invalid absolute clock');
  if (zone.toUpperCase() !== 'Z') {
    const hours = Number(zone.slice(1, 3)), minutes = Number(zone.slice(4));
    if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) throw new Error('Invalid absolute offset');
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1 || date.getUTCFullYear() > 2999) throw new Error('Absolute observation outside supported years');
  return date;
}
