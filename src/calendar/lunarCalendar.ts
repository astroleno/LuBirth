import data from './hkoLunarMonths.json';
import { civilDate } from '../history/observation';
import { LUNAR_GREGORIAN_END, LUNAR_GREGORIAN_START, isInLunarRange } from './lunarRange';

const DAY_MS = 86_400_000;
const MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

type LunarMonth = {
  year: number;
  month: number;
  leap: boolean;
  dayFrom: number;
  dayThrough: number;
  monthLength: number;
};
export type LunarDate = Pick<LunarMonth, 'year' | 'month' | 'leap'> & { day: number };

const firstDay = civilDate(LUNAR_GREGORIAN_START).getTime();
const lastDay = civilDate(LUNAR_GREGORIAN_END).getTime();
const followingMonthStart = civilDate(data.followingMonthStartsOn).getTime();
const monthStarts = data.months.map(row => ({ startsOn: civilDate(String(row[0])).getTime(), year: Number(row[1]),
  month: Math.abs(Number(row[2])), leap: Number(row[2]) < 0 }));
const months = monthStarts.map(({ startsOn, ...month }, index) => {
  const nextStart = monthStarts[index + 1]?.startsOn ?? followingMonthStart;
  const monthLength = (nextStart - startsOn) / DAY_MS;
  return { ...month, startsOn, monthLength,
    dayFrom: Math.max(0, (firstDay - startsOn) / DAY_MS) + 1,
    dayThrough: Math.min(monthLength, (lastDay - startsOn) / DAY_MS + 1) };
});
const monthsByYear = new Map<number, typeof months>();
for (const month of months) {
  const year = monthsByYear.get(month.year);
  if (year) year.push(month);
  else monthsByYear.set(month.year, [month]);
}

export const HKO_LUNAR_SOURCE = data.source;
export const lunarYears = [...monthsByYear.keys()];

export function getLunarMonths(year: number): readonly LunarMonth[] {
  return monthsByYear.get(year) ?? [];
}

export function gregorianToLunar(iso: string): LunarDate | null {
  if (!isInLunarRange(iso)) return null;
  let day: number;
  try { day = civilDate(iso).getTime(); } catch { return null; }
  let low = 0, high = months.length;
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (months[middle].startsOn <= day) low = middle;
    else high = middle;
  }
  const { startsOn, year, month, leap } = months[low];
  return { year, month, leap, day: (day - startsOn) / DAY_MS + 1 };
}

export function lunarToGregorian(date: LunarDate): string | null {
  const month = monthsByYear.get(date.year)?.find(row => row.month === date.month && row.leap === date.leap);
  if (!month || !Number.isInteger(date.day) || date.day < month.dayFrom || date.day > month.dayThrough) return null;
  return new Date(month.startsOn + (date.day - 1) * DAY_MS).toISOString().slice(0, 10);
}

export function ganzhiYear(year: number) {
  const index = ((year - 4) % 60 + 60) % 60;
  return '甲乙丙丁戊己庚辛壬癸'[index % 10] + '子丑寅卯辰巳午未申酉戌亥'[index % 12];
}

export const lunarMonthLabel = (month: number, leap: boolean) => `${leap ? '闰' : ''}${MONTH_NAMES[month - 1]}`;
export const lunarDayLabel = (day: number) => DAY_NAMES[day - 1];

export function lunarDateLabel(date: LunarDate) {
  return `${ganzhiYear(date.year)}年${lunarMonthLabel(date.month, date.leap)}${lunarDayLabel(date.day)}`;
}
