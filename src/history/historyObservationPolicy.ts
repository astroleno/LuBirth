import type { HistoryRecord } from './historyModel';
import type { TimeSelection } from './observation';

export type HistoryClockChoice = { clock: string; timeSelection: TimeSelection };
const userClockLabel = '自选演示钟点。';

export function resolveHistoryChoices(record: HistoryRecord, draft?: { clock: string; useDefault?: boolean }): HistoryClockChoice {
  const { time } = record;
  if (!draft && time.precision === 'point') return { clock: time.clock, timeSelection: {
    origin: time.scope === 'event' ? 'history-recorded-point' : 'history-related-point', ruleVersion: null,
    label: time.scope === 'event' ? `史载钟点 · ${time.original}。` : `史载相关钟点 · ${time.original}。`,
  } };
  if (!draft && time.precision === 'window') return { clock: time.example, timeSelection: {
    origin: 'history-window-midpoint', ruleVersion: null,
    label: time.dayBoundary === 'unverified' ? `史载${time.original}，以换算日期 ${time.example} 演示。`
      : `史载${time.original}，以 ${time.example} 作为时段中点演示。`,
  } };
  const eventDefaultAllowed = time.precision === 'date-only' && record.kind === 'event';
  const useDefault = draft ? !!draft.useDefault : eventDefaultAllowed;
  if (useDefault && !eventDefaultAllowed) throw new Error('默认晚间演示只适用于缺少时刻的事件。');
  const clock = draft?.clock ?? (useDefault ? '20:00' : '');
  if (useDefault && !/^20:00(?::00)?$/.test(clock)) throw new Error('默认事件演示钟点应为 20:00。');
  return { clock, timeSelection: useDefault
    ? { origin: 'event-default-20', ruleVersion: 'event-evening-v1', label: '未载时刻，默认当地晚上 8 点演示。' }
    : { origin: 'user-input', ruleVersion: null, label: userClockLabel } };
}

export function restoreHistoryChoices(record: HistoryRecord, choice: HistoryClockChoice, previousRevision: boolean): HistoryClockChoice {
  const suggested = resolveHistoryChoices(record);
  const origin = choice.timeSelection?.origin;
  if (!previousRevision && choice.clock === suggested.clock && origin === suggested.timeSelection.origin) return suggested;
  if (origin === 'legacy-demo' || previousRevision && origin !== 'user-input') return { clock: choice.clock, timeSelection: {
    origin: 'legacy-demo', ruleVersion: null, label: '此前保存的演示钟点。',
  } };
  return resolveHistoryChoices(record, { clock: choice.clock, useDefault: !previousRevision && origin === 'event-default-20' });
}
