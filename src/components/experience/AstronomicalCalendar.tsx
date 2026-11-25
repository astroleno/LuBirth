import { lazy, Suspense, useMemo, useState } from 'react';
import { calendarClock, nextAstronomicalEvents } from '../../astro/astronomicalCalendar';
import { ianaOffsetSeconds } from '../../history/ianaTime';
import { observationOffsetSeconds, timeBasisLabel } from '../../history/observation';
import type { Observation } from '../../history/observation';
import './astronomical-calendar.css';

const CalendarDateCorrespondence = lazy(() => import('../../calendar/LunarCalendarFields').then(module => ({ default: module.CalendarDateCorrespondence })));
const HistoricalCalendarDate = lazy(() => import('../../calendar/HistoricalCalendarDate'));

function offsetAt(instant: Date, observation?: Observation, timeZone?: string) {
  if (observation) return observationOffsetSeconds(observation.timeBasis, observation.observer.longitude, instant);
  return timeZone ? ianaOffsetSeconds(timeZone, instant) : 0;
}

function eventClock(utc: string, observation?: Observation, timeZone?: string) {
  try {
    return calendarClock(utc, offsetAt(new Date(utc), observation, timeZone));
  } catch {
    return `${calendarClock(utc, 0)} UTC`;
  }
}

function currentCivilDate(utc: string, observation?: Observation, timeZone?: string) {
  if (observation?.utc === utc) return { date: observation.civilDate, local: true };
  try {
    const instant = new Date(utc);
    const offset = offsetAt(instant, observation, timeZone);
    return { date: new Date(instant.getTime() + offset * 1000).toISOString().slice(0, 10), local: !!(observation || timeZone) };
  } catch { return { date: utc.slice(0, 10), local: false }; }
}

export function AstronomicalCalendar({ utc, observation, timeZone }: { utc: string; observation?: Observation; timeZone?: string }) {
  const [open, setOpen] = useState(false);
  const events = useMemo(() => {
    if (open) {
      try { return nextAstronomicalEvents(utc); }
      catch { return null; }
    }
    return null;
  }, [open, utc]);
  const basis = observation?.timeBasis;
  const timeLabel = basis?.kind === 'iana' ? basis.timeZone : basis ? timeBasisLabel(basis) : timeZone ?? 'UTC';
  const date = open ? currentCivilDate(utc, observation, timeZone) : null;
  const recordId = observation?.source.kind === 'history' ? observation.source.recordId : undefined;
  return <details className="astronomical-calendar" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>天文日历</summary>
    {date && <>
      <Suspense fallback={<p role="status">正在加载公农历对照…</p>}>
        {recordId ? <HistoricalCalendarDate {...date} recordId={recordId}>
          <CalendarDateCorrespondence {...date} />
        </HistoricalCalendarDate> : <CalendarDateCorrespondence {...date} />}
      </Suspense>
      {events ? <><p>按当前观测时刻推算 · {timeLabel}</p>
      <dl>
        {([['下一次主要月相', events.moon], ['下一节气', events.solarTerm]] as const).map(([label, event]) =>
          <div key={label}>
            <dt>{label}</dt>
            <dd>{event ? <><span>{event.name}</span><time dateTime={event.utc}>{eventClock(event.utc, observation, timeZone)}</time></> : '超出可用年份'}</dd>
          </div>)}
      </dl>
      </> : <p role="status">暂时无法计算此日期的天文日历。</p>}
    </>}
  </details>;
}
