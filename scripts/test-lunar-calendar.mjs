import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { gregorianToLunar, lunarToGregorian, lunarDateLabel, getLunarMonths, lunarYears } = await vite.ssrLoadModule('/src/calendar/lunarCalendar.ts');
  const { CalendarDateCorrespondence, LunarBirthDateFields } = await vite.ssrLoadModule('/src/calendar/LunarCalendarFields.tsx');
  const { resolveCivilTime } = await vite.ssrLoadModule('/src/history/ianaTime.ts');
  const { resolveObservation } = await vite.ssrLoadModule('/src/history/observation.ts');
  for (const [gregorian, label, expected] of [
    ['2025-06-25', '乙巳年六月初一', { year: 2025, month: 6, leap: false, day: 1 }],
    ['2025-07-25', '乙巳年闰六月初一', { year: 2025, month: 6, leap: true, day: 1 }],
    ['2026-02-16', '乙巳年十二月廿九', { year: 2025, month: 12, leap: false, day: 29 }],
    ['2026-02-17', '丙午年正月初一', { year: 2026, month: 1, leap: false, day: 1 }],
  ]) {
    assert.deepEqual(gregorianToLunar(gregorian), expected);
    assert.equal(lunarDateLabel(expected), label);
    assert.equal(lunarToGregorian(expected), gregorian);
    const markup = renderToStaticMarkup(React.createElement(CalendarDateCorrespondence, { date: gregorian, local: true }));
    assert.ok(markup.includes(`当地日期 <time dateTime="${gregorian}">${gregorian}</time> · 农历 ${label}`), markup);
  }
  assert.match(lunarDateLabel(gregorianToLunar('2026-02-04')), /^乙巳年/);
  assert.equal(gregorianToLunar('2033-12-22').leap, true);
  assert.equal(lunarToGregorian({ year: 2025, month: 6, leap: true, day: 30 }), null);
  assert.equal(lunarToGregorian({ year: 2026, month: 6, leap: true, day: 1 }), null);
  const monthLabels = renderToStaticMarkup(React.createElement(LunarBirthDateFields, { date: '2025-07-25', onDateChange() {} }));
  assert.match(monthLabels, /六月 · 大月 30 天/);
  assert.match(monthLabels, /闰六月 · 小月 29 天/);
  assert.match(monthLabels, /对应公历 2025-07-25/);
  assert.equal(gregorianToLunar('1900-12-31'), null);
  assert.equal(gregorianToLunar('2101-01-01'), null);
  assert.equal(gregorianToLunar('2100-02-29'), null);
  assert.equal(gregorianToLunar('2025-02-31'), null);
  assert.equal(lunarToGregorian({ year: 1900, month: 11, leap: false, day: 10 }), null);
  assert.equal(lunarToGregorian({ year: 1900, month: 11, leap: false, day: 11 }), '1901-01-01');
  assert.equal(lunarToGregorian({ year: 2100, month: 12, leap: false, day: 1 }), '2100-12-31');
  assert.equal(lunarToGregorian({ year: 2100, month: 12, leap: false, day: 2 }), null);
  assert.match(renderToStaticMarkup(React.createElement(CalendarDateCorrespondence, { date: '1037-01-14', local: true })), /农历资料覆盖公历 1901–2100 年/);

  let count = 0;
  for (let stamp = Date.UTC(1901, 0, 1); stamp <= Date.UTC(2100, 11, 31); stamp += 86_400_000) {
    const date = new Date(stamp).toISOString().slice(0, 10);
    assert.equal(lunarToGregorian(gregorianToLunar(date)), date);
    count++;
  }
  assert.equal(count, 73_049);
  const months = lunarYears.flatMap(getLunarMonths);
  assert.ok(months.every(month => [29, 30].includes(month.monthLength)));
  assert.equal(months.reduce((sum, month) => sum + month.dayThrough - month.dayFrom + 1, 0), count);

  const place = { name: '纽约', latitude: 40.71427, longitude: -74.00597, precision: 'user-selected', note: '用于测试', timeZone: 'America/New_York' };
  const clock = '20:00';
  const source = { kind: 'birth', label: '测试出生时刻' };
  for (const date of ['2025-07-25', lunarToGregorian({ year: 2025, month: 6, leap: true, day: 1 })]) {
    const choice = await resolveCivilTime(date, clock, place.timeZone);
    assert.equal(choice.kind, 'unique');
    assert.equal(resolveObservation(date, clock, place, choice.basis, source).utc, '2025-07-26T00:00:00.000Z');
  }
  console.log(`PASS ${count} Gregorian/lunar round trips, leap months, Ganzhi transition and shared UTC`);
} finally { await vite.close(); }
