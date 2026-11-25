import importedRecords from './data/records.json';
import curatedEvents from './data/supplemental-events.json';
import { isHistoryRecordId, type HistoryRecord } from './historyModel';

export function mergeHistoryCatalog(imported: readonly HistoryRecord[], curated: readonly HistoryRecord[]) {
  const ids = new Set<string>();
  const periods: Record<string, number> = Object.create(null);
  const monthDays = new Set<string>();
  for (const [namespace, records] of [['dsh', imported], ['curated', curated]] as const) {
    for (const record of records) {
      if (!isHistoryRecordId(record.id) || record.id !== `${namespace}:${record.originalId}`)
        throw new Error(`Invalid history record ID: ${record.id}`);
      if (ids.has(record.id)) throw new Error(`Duplicate history record ID: ${record.id}`);
      ids.add(record.id);
      periods[record.period] = (periods[record.period] ?? 0) + 1;
      monthDays.add(record.date.iso.slice(5));
    }
  }
  return { records: [...imported, ...curated], periods, count: ids.size, monthDays: monthDays.size };
}

export const historyCatalog = mergeHistoryCatalog(importedRecords as HistoryRecord[], curatedEvents as HistoryRecord[]);
