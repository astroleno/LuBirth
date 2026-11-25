import type { ReactNode } from 'react';
import { historyCatalog } from '../history/historyCatalog';
import { historicalCalendarText } from '../history/historyModel';

export default function HistoricalCalendarDate({ date, local, recordId, children }: {
  date: string; local: boolean; recordId: string; children: ReactNode;
}) {
  const record = historyCatalog.records.find(item => item.id === recordId && item.date.iso === date);
  const original = record && historicalCalendarText(record);
  if (!original) return <>{children}</>;
  return <p className="astronomical-calendar-date">{local ? '当地日期' : 'UTC 日期'} <time dateTime={date}>{date}</time>
    {' · 史载 '}{original}
  </p>;
}
