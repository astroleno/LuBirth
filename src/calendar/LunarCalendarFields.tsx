import { useId } from 'react';
import { ganzhiYear, getLunarMonths, gregorianToLunar, HKO_LUNAR_SOURCE, lunarDateLabel,
  lunarDayLabel, lunarMonthLabel, lunarToGregorian, lunarYears } from './lunarCalendar';
import { LUNAR_RANGE_NOTE } from './lunarRange';

const orderedYears = [...lunarYears].reverse();
const monthValue = (month: number, leap: boolean) => leap ? -month : month;

function LunarSourceLink() {
  return <a href={HKO_LUNAR_SOURCE} target="_blank" rel="noreferrer">香港天文台公农历对照表</a>;
}

export function LunarBirthDateFields({ date, onDateChange }: { date: string; onDateChange: (date: string) => void }) {
  const id = useId();
  const selected = gregorianToLunar(date);
  const months = selected ? getLunarMonths(selected.year) : [];
  const currentMonth = months.find(row => row.month === selected?.month && row.leap === selected.leap);
  const commitMonth = (month: NonNullable<typeof currentMonth>, preferredDay: number) => {
    const day = Math.max(month.dayFrom, Math.min(preferredDay, month.dayThrough));
    const gregorian = lunarToGregorian({ year: month.year, month: month.month, leap: month.leap, day });
    if (gregorian) onDateChange(gregorian);
  };
  return <>
    <div className="journey-columns">
      <div><label htmlFor={id+'-lunar-year'}>农历年</label>
        <select id={id+'-lunar-year'} value={selected?.year ?? ''} onChange={event => {
          const months = getLunarMonths(Number(event.target.value));
          const month = months.find(row => row.month === selected?.month && row.leap === selected.leap)
            ?? months.find(row => row.month === selected?.month && !row.leap) ?? months[0];
          if (month) commitMonth(month, selected?.day ?? 1);
        }}>
          <option value="" disabled>选择农历年</option>
          {orderedYears.map(year => <option key={year} value={year}>{year} · {ganzhiYear(year)}年</option>)}
        </select></div>
      <div><label htmlFor={id+'-lunar-month'}>农历月</label>
        <select id={id+'-lunar-month'} disabled={!selected} value={selected ? monthValue(selected.month, selected.leap) : ''}
          onChange={event => {
            const month = months.find(row => monthValue(row.month, row.leap) === Number(event.target.value));
            if (month) commitMonth(month, selected?.day ?? 1);
          }}>
          {!selected && <option value="">选择农历月</option>}
          {months.map(row => <option key={monthValue(row.month, row.leap)} value={monthValue(row.month, row.leap)}>
            {lunarMonthLabel(row.month, row.leap)} · {row.monthLength === 30 ? '大月 30 天' : '小月 29 天'}
          </option>)}
        </select></div>
    </div>
    <div><label htmlFor={id+'-lunar-day'}>农历日</label>
      <select id={id+'-lunar-day'} disabled={!currentMonth} value={selected?.day ?? ''} onChange={event => {
        if (currentMonth) commitMonth(currentMonth, Number(event.target.value));
      }}>
        {!currentMonth && <option value="">选择农历日</option>}
        {currentMonth && Array.from({ length: currentMonth.dayThrough - currentMonth.dayFrom + 1 }, (_, index) => {
          const day = currentMonth.dayFrom + index;
          return <option key={day} value={day}>{lunarDayLabel(day)}</option>;
        })}
      </select></div>
    <p className="journey-hint"><span role="status">{selected ? `对应公历 ${date}。` : `${LUNAR_RANGE_NOTE}请选择可用的农历年。`}</span> <LunarSourceLink /></p>
  </>;
}

export function CalendarDateCorrespondence({ date, local }: { date: string; local: boolean }) {
  const lunar = gregorianToLunar(date);
  return <p className="astronomical-calendar-date">{local ? '当地日期' : 'UTC 日期'} <time dateTime={date}>{date}</time>
    {lunar ? <> · 农历 {lunarDateLabel(lunar)} · <LunarSourceLink /></> : <> · {LUNAR_RANGE_NOTE}</>}
  </p>;
}
