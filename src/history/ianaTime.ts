export type IanaTimeBasis = {
  kind: 'iana';
  timeZone: string;
  offsetSeconds: number;
  disambiguation?: 'earlier' | 'later';
};

export function isNamedTimeZone(timeZone: unknown): timeZone is string {
  return typeof timeZone === 'string' && timeZone.length <= 100
    && /^[A-Za-z][A-Za-z\d_+.-]*(?:\/[A-Za-z\d_+.-]+)*$/.test(timeZone);
}

const offsetFormatters = new Map<string, Intl.DateTimeFormat>();

function offsetFormatter(timeZone: string) {
  let formatter = offsetFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US-u-nu-latn', { timeZone, timeZoneName: 'longOffset' });
    offsetFormatters.set(timeZone, formatter);
  }
  return formatter;
}

export function supportsTimeZone(timeZone: string) {
  if (!isNamedTimeZone(timeZone)) return false;
  try { offsetFormatter(timeZone); return true; }
  catch { return false; }
}

export function ianaOffsetSeconds(timeZone: string, instant: Date) {
  const offset = offsetFormatter(timeZone).formatToParts(instant).find(part => part.type === 'timeZoneName')?.value;
  if (offset === 'GMT') return 0;
  const parts = /^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(offset ?? '');
  if (!parts) throw new Error('无法读取这个时区在指定日期的偏移。');
  const [, sign, hours, minutes, seconds] = parts;
  return (sign === '-' ? -1 : 1) * (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds || 0));
}

export type CivilTimeChoices =
  | { kind: 'unique'; basis: IanaTimeBasis }
  | { kind: 'gap' }
  | { kind: 'overlap'; earlier: IanaTimeBasis; later: IanaTimeBasis };

/** The birth editor loads Temporal only when resolving a local wall clock. */
export async function resolveCivilTime(date: string, clock: string, timeZone: string): Promise<CivilTimeChoices> {
  if (!supportsTimeZone(timeZone)) throw new Error('请选择有效的 IANA 时区。');
  const { Temporal } = await import('@js-temporal/polyfill');
  const wallTime = Temporal.PlainDateTime.from(`${date}T${clock}`);
  const earlier = wallTime.toZonedDateTime(timeZone, { disambiguation: 'earlier' });
  const later = wallTime.toZonedDateTime(timeZone, { disambiguation: 'later' });
  if (!earlier.toPlainDateTime().equals(wallTime) || !later.toPlainDateTime().equals(wallTime)) return { kind: 'gap' };
  const earlierBasis: IanaTimeBasis = { kind: 'iana', timeZone, offsetSeconds: earlier.offsetNanoseconds / 1e9 };
  if (earlier.equals(later)) return { kind: 'unique', basis: earlierBasis };
  return { kind: 'overlap', earlier: { ...earlierBasis, disambiguation: 'earlier' },
    later: { ...earlierBasis, offsetSeconds: later.offsetNanoseconds / 1e9, disambiguation: 'later' } };
}
