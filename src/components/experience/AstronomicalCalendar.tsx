import { lazy, Suspense, useMemo, useState } from 'react';
import { calendarCivilDate, calendarClock, HKO_CALENDAR_OFFSET_SECONDS, HKO_CALENDAR_SOURCE,
  hkoDatesForNewMoon, hkoNewMoonOnDate, nextAstronomicalEvents } from '../../astro/astronomicalCalendar';
import type { HkoNewMoon } from '../../astro/astronomicalCalendar';
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

function eventOffset(instant: Date, observation?: Observation, timeZone?: string) {
  try {
    return offsetAt(instant, observation, timeZone);
  } catch {
    return null;
  }
}

function eventClock(utc: string, observation?: Observation, timeZone?: string) {
  const offset = eventOffset(new Date(utc), observation, timeZone);
  return offset === null ? `${calendarClock(utc, 0)} UTC` : calendarClock(utc, offset);
}

function currentCivilDate(utc: string, observation?: Observation, timeZone?: string) {
  if (observation?.utc === utc) return { date: observation.civilDate, local: true };
  try {
    const instant = new Date(utc);
    return { date: calendarCivilDate(instant, offsetAt(instant, observation, timeZone)), local: !!(observation || timeZone) };
  } catch { return { date: utc.slice(0, 10), local: false }; }
}

export function NewMoonDates({ event, offset, timeLabel }: { event: HkoNewMoon; offset: number | null; timeLabel: string }) {
  return <>
    <dd><span>推算朔（新月，UTC+8）</span><time dateTime={event.utc}>{calendarClock(event.utc, HKO_CALENDAR_OFFSET_SECONDS)}</time></dd>
    {offset !== HKO_CALENDAR_OFFSET_SECONDS && <dd><span>{offset === null || timeLabel === 'UTC' ? 'UTC 换算' : '当地换算'}</span>
      <time dateTime={event.utc}>{calendarClock(event.utc, offset ?? 0)}</time></dd>}
    <dd className="astronomical-calendar-date"><span><a href={HKO_CALENDAR_SOURCE} target="_blank" rel="noreferrer">香港天文台历表</a>初一{event.midnightUncertainty && '（UTC+8）'}</span>
      <time dateTime={event.publishedDate}>{event.publishedDate}</time></dd>
    <dd className="astronomical-calendar-note">{event.midnightUncertainty
      ? '远期朔时可能有数分钟误差，接近午夜时可能跨日。'
      : '历史历表沿用当时的日界。民国历书所用的北京地方平时比今 UTC+8 慢约 14 分钟。'}</dd>
  </>;
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
  const nextNewMoon = events?.moon?.longitude === 0 ? hkoDatesForNewMoon(events.moon.utc) : null;
  const selectedNewMoon = date && !nextNewMoon
    ? hkoNewMoonOnDate(date.date, instant => eventOffset(instant, observation, timeZone) ?? 0) : null;
  const renderNewMoon = (event: HkoNewMoon) =>
    <NewMoonDates event={event} offset={eventOffset(new Date(event.utc), observation, timeZone)} timeLabel={timeLabel} />;
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
        {selectedNewMoon && <div><dt>农历初一与推算朔</dt>{renderNewMoon(selectedNewMoon)}</div>}
        {([['下一次主要月相', events.moon], ['下一节气', events.solarTerm]] as const).map(([label, event]) =>
          <div key={label}>
            <dt>{label}</dt>
            {nextNewMoon && event === events.moon ? renderNewMoon(nextNewMoon)
              : <dd>{event ? <><span>{event.name}</span><time dateTime={event.utc}>{eventClock(event.utc, observation, timeZone)}</time></> : '超出可用年份'}</dd>}
          </div>)}
      </dl>
      </> : <p role="status">暂时无法计算此日期的天文日历。</p>}
    </>}
  </details>;
}
