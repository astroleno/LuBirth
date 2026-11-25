import { useMemo, useState } from 'react';
import { calendarClock, nextAstronomicalEvents } from '../../astro/astronomicalCalendar';
import { observationOffsetSeconds, timeBasisLabel } from '../../history/observation';
import type { Observation } from '../../history/observation';
import './astronomical-calendar.css';

function eventClock(utc: string, observation?: Observation) {
  if (!observation) return calendarClock(utc, 0);
  try {
    const offset = observationOffsetSeconds(observation.timeBasis, observation.observer.longitude, new Date(utc));
    return calendarClock(utc, offset);
  } catch {
    return `${calendarClock(utc, 0)} UTC`;
  }
}

export function AstronomicalCalendar({ utc, observation }: { utc: string; observation?: Observation }) {
  const [open, setOpen] = useState(false);
  const events = useMemo(() => {
    if (open) {
      try { return nextAstronomicalEvents(utc); }
      catch { return null; }
    }
    return null;
  }, [open, utc]);
  const basis = observation?.timeBasis;
  return <details className="astronomical-calendar" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>天文日历</summary>
    {open && (events ? <>
      <p>按当前观测时刻推算 · {basis?.kind === 'iana' ? basis.timeZone : basis ? timeBasisLabel(basis) : 'UTC'}</p>
      <dl>
        {([['下一次主要月相', events.moon], ['下一节气', events.solarTerm]] as const).map(([label, event]) =>
          <div key={label}>
            <dt>{label}</dt>
            <dd>{event ? <><span>{event.name}</span><time dateTime={event.utc}>{eventClock(event.utc, observation)}</time></> : '超出可用年份'}</dd>
          </div>)}
      </dl>
    </> : <p role="status">暂时无法计算此日期的天文日历。</p>)}
  </details>;
}
