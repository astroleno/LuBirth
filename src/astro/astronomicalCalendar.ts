import { NextMoonQuarter, SearchMoonPhase, SearchMoonQuarter, SearchSunLongitude, SunPosition } from 'astronomy-engine';
import hkoNewMoons from '../calendar/hkoNewMoonDates.json';
import { validateCelestialDate } from './celestialState';

const DAY_MS = 86400000;
const MINUTE_MS = 60000;
const MOON_PHASES = ['朔（新月）', '上弦', '望（满月）', '下弦'];
const SOLAR_TERMS = [
  '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露',
  '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
];

type CalendarEvent = { name: string; longitude: number; utc: string };
export type HkoNewMoon = (typeof hkoNewMoons.dates)[number] & { utc: string };
export const HKO_CALENDAR_SOURCE = hkoNewMoons.source;
export const HKO_CALENDAR_OFFSET_SECONDS = hkoNewMoons.offsetSeconds;

function calendarEvent(name: string, longitude: number, date: Date): CalendarEvent | null {
  const year = date.getUTCFullYear();
  return year >= 1 && year <= 2999 ? { name, longitude, utc: date.toISOString() } : null;
}

const toSecond = (date: Date) => new Date(Math.round(date.getTime() / 1000) * 1000);

/** Calendar events use geocentric ecliptic longitude. Brightness in the scene is local. */
export function nextAstronomicalEvents(instant: Date | string) {
  const after = validateCelestialDate(instant);
  // Start before today's boundary so both searches also handle an event exactly at the input instant.
  const anchor = new Date(Math.floor(after.getTime() / DAY_MS) * DAY_MS - DAY_MS);
  let quarter = SearchMoonQuarter(anchor);
  if (toSecond(quarter.time.date) <= after) quarter = NextMoonQuarter(quarter);
  let term = (Math.floor(SunPosition(anchor).elon / 15) + 1) % 24;
  let termTime = SearchSunLongitude(term * 15, anchor, 18);
  if (termTime && toSecond(termTime.date) <= after) {
    term = (term + 1) % 24;
    termTime = SearchSunLongitude(term * 15, after, 18);
  }
  if (!termTime) throw new Error('暂时无法计算下一次节气。');
  return {
    moon: calendarEvent(MOON_PHASES[quarter.quarter], quarter.quarter * 90, toSecond(quarter.time.date)),
    solarTerm: calendarEvent(SOLAR_TERMS[term], term * 15, toSecond(termTime.date)),
  };
}

export function calendarCivilDate(instant: Date, offsetSeconds: number) {
  return new Date(instant.getTime() + offsetSeconds * 1000).toISOString().slice(0, 10);
}

export function hkoDatesForNewMoon(utc: string): HkoNewMoon | null {
  const modeledDate = calendarCivilDate(new Date(utc), HKO_CALENDAR_OFFSET_SECONDS);
  const dates = hkoNewMoons.dates.find(item => item.modeledDate === modeledDate);
  return dates ? { ...dates, utc } : null;
}

/** Keeps the comparison visible on the relevant civil dates after the new moon has passed. */
export function hkoNewMoonOnDate(day: string, localOffsetAt: (instant: Date) => number): HkoNewMoon | null {
  for (const dates of hkoNewMoons.dates) {
    const dayDifference = Date.parse(day) - Date.parse(dates.modeledDate);
    // The two HKO dates and the corresponding date in any local zone span at most one day either side.
    if (Math.abs(dayDifference) > DAY_MS) continue;
    const anchor = new Date(Date.parse(dates.modeledDate) - HKO_CALENDAR_OFFSET_SECONDS * 1000 - DAY_MS);
    const phase = SearchMoonPhase(0, anchor, 3);
    if (!phase || calendarCivilDate(phase.date, HKO_CALENDAR_OFFSET_SECONDS) !== dates.modeledDate) continue;
    const instant = toSecond(phase.date);
    if (day === dates.publishedDate || day === dates.modeledDate || day === calendarCivilDate(instant, localOffsetAt(instant))) {
      return { ...dates, utc: instant.toISOString() };
    }
  }
  return null;
}

export function calendarClock(utc: string, offsetSeconds: number) {
  const date = new Date(utc);
  const year = date.getUTCFullYear();
  const localTime = date.getTime() + offsetSeconds * 1000;
  // Avoid clock-level precision in the historical simulation and far-future calendar.
  if (year < 1972 || year > 2100) return calendarCivilDate(date, offsetSeconds);
  // Rounding the clock must preserve the civil date used for the comparison.
  const roundedMinute = Math.round(localTime / MINUTE_MS) * MINUTE_MS;
  const lastMinuteOfDay = (Math.floor(localTime / DAY_MS) + 1) * DAY_MS - MINUTE_MS;
  return new Date(Math.min(roundedMinute, lastMinuteOfDay)).toISOString().slice(0, 16).replace('T', ' ');
}
