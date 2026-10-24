import type { HistoryRecord } from './historyModel';
import type { TimeSelection } from './observation';

export type HistoryClockChoice = { clock: string; timeSelection: TimeSelection };
/** Defaults belong to an event draft, never to the strict UTC parser or source data. */
export function resolveHistoryChoices(record: HistoryRecord, draft?: { clock: string; useDefault?: boolean }): HistoryClockChoice {
  if (record.time.precision !== 'date-only') throw new Error('这条资料的时刻精度尚未接入，请先核对时间资料。');
  const useDefault = draft ? !!draft.useDefault : record.kind === 'event';
  if (useDefault && record.kind !== 'event') throw new Error('默认晚间演示只适用于缺少时刻的事件。');
  const clock = draft?.clock ?? (useDefault ? '20:00' : '');
  if (useDefault && !/^20:00(?::00)?$/.test(clock)) throw new Error('默认事件演示钟点应为 20:00。');
  return { clock, timeSelection: useDefault
    ? { origin: 'event-default-20', ruleVersion: 'event-evening-v1', label: '未载明时刻，默认以当地 20:00 演示，可修改。' }
    : { origin: 'user-input', ruleVersion: null, label: '自选演示时刻，并非史料认定钟点。' } };
}
