export const LUNAR_GREGORIAN_START = '1901-01-01';
export const LUNAR_GREGORIAN_END = '2100-12-31';
export const LUNAR_RANGE_NOTE = '农历资料覆盖公历 1901–2100 年。';

export const isInLunarRange = (date: string) => date >= LUNAR_GREGORIAN_START && date <= LUNAR_GREGORIAN_END;
