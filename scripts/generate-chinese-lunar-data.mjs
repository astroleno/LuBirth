import { readFileSync, writeFileSync } from 'node:fs';
import { SearchMoonPhase, SearchSunLongitude } from 'astronomy-engine';

const DAY_MS = 86_400_000;
const FIRST_DAY = '1901-01-01';
const LAST_DAY = '2100-12-31';
const HKO_TABLES = 'https://www.hko.gov.hk/tc/gts/time/conversion.htm';
const HKO_SOURCE_SHA256 = 'ca418f82960d2ca5febd1eac662b8e2b3264b1eec03292a2ffc3cf64cd05d957';

// Observed differences near midnight, recorded as modeled day → published HKO day.
const publishedMonthStarts = new Map([
  ['1914-11-18', '1914-11-17'],
  ['1916-02-04', '1916-02-03'],
  ['1920-11-11', '1920-11-10'],
  ['2057-09-29', '2057-09-28'],
  ['2097-08-08', '2097-08-07'],
]);
const standardDay = instant => new Date(instant.getTime() + 8 * 3_600_000).toISOString().slice(0, 10);
const nextDay = instant => new Date(instant.getTime() + DAY_MS);

const starts = [];
for (let instant = new Date('1900-11-10T00:00:00Z'); standardDay(instant) < '2102-02-01';) {
  const newMoon = SearchMoonPhase(0, instant, 40).date;
  const day = standardDay(newMoon);
  starts.push(publishedMonthStarts.get(day) ?? day);
  instant = nextDay(newMoon);
}

const terms = [];
let longitude = 270;
for (let instant = new Date('1900-12-01T00:00:00Z'); standardDay(instant) < '2101-12-20';) {
  const term = SearchSunLongitude(longitude, instant, 40).date;
  terms.push({ day: standardDay(term), winterSolstice: longitude === 270 });
  instant = nextDay(term);
  longitude = (longitude + 30) % 360;
}

// The month containing the winter solstice is month 11. When there are 13 months
// before the next such month, the first without a principal term repeats its number.
const winters = terms.filter(term => term.winterSolstice).map(({ day }) => ({
  year: Number(day.slice(0, 4)), monthIndex: starts.findLastIndex(start => start <= day),
}));
const months = [];
for (let winter = 0; winter < winters.length - 1; winter++) {
  let { year, monthIndex: first } = winters[winter];
  const next = winters[winter + 1].monthIndex;
  const hasLeapMonth = next - first === 13;
  const leap = hasLeapMonth ? starts.findIndex((start, index) => index > first && index < next
    && !terms.some(({ day }) => start <= day && day < starts[index + 1])) : -1;
  if (hasLeapMonth && leap === -1) throw new Error(`Could not assign lunar leap month after the ${year} solstice`);
  let month = 11;
  for (let index = first; index < next; index++) {
    if (index > first && index !== leap) {
      month = month % 12 + 1;
      if (month === 1) year++;
    }
    if (starts[index] <= LAST_DAY && starts[index + 1] > FIRST_DAY)
      months.push([starts[index], year, index === leap ? -month : month]);
  }
}

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const metadata = {
  formatVersion: 1,
  astronomyEngine: lock.packages['node_modules/astronomy-engine'].version,
  source: HKO_TABLES,
  sourceSha256: HKO_SOURCE_SHA256,
  supportedFrom: FIRST_DAY,
  supportedThrough: LAST_DAY,
  followingMonthStartsOn: starts[starts.indexOf(months.at(-1)[0]) + 1],
};
const rows = months.map(row => '    ' + JSON.stringify(row)).join(',\n');
const contents = JSON.stringify(metadata, null, 2).slice(0, -2) + ',\n  "months": [\n' + rows + '\n  ]\n}\n';
const output = process.argv[2] || new URL('../src/calendar/hkoLunarMonths.json', import.meta.url);
writeFileSync(output, contents);
console.log(`Generated ${months.length} lunar month starts using Astronomy Engine ${metadata.astronomyEngine}`);
