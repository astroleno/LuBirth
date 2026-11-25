"""Verify the independently calculated lunar month table against HKO annual text tables."""

import argparse
import hashlib
import json
from datetime import date, timedelta
from pathlib import Path
import re


SOURCE = 'https://www.hko.gov.hk/tc/gts/time/conversion.htm'
FIRST_DAY = date(1901, 1, 1)
LAST_DAY = date(2100, 12, 31)
MONTH_NAMES = ('正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月')
DAY_NAMES = ('初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
             '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
             '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十')
ROW = re.compile(r'^\s*(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日\s+(\S+)')


def month_number(label):
    leap = label.startswith('閏')
    name = label[1:] if leap else label
    if name not in MONTH_NAMES:
        return None
    number = MONTH_NAMES.index(name) + 1
    return -number if leap else number


def extract(folder):
    # The January 1901 table begins on lunar 1900's eleventh month, day eleven.
    # Its start is derived from that day number. December 31, 2100 begins a new month;
    # the public tables do not establish the total length of this last month.
    first_month = FIRST_DAY - timedelta(days=10)
    lunar_year = 1900
    months = [(first_month, lunar_year, 11)]
    source_digests = []
    next_day = FIRST_DAY
    for year in range(FIRST_DAY.year, LAST_DAY.year + 1):
        file = folder / f'T{year}c.txt'
        content = file.read_bytes()
        source_digests.append(f'{year}:{hashlib.sha256(content).hexdigest()}\n')
        for line in content.decode('utf-8-sig').splitlines():
            row = ROW.match(line)
            if not row:
                continue
            gregorian_year, gregorian_month, gregorian_day, label = row.groups()
            day = date(int(gregorian_year), int(gregorian_month), int(gregorian_day))
            if day.year != year or day != next_day:
                raise ValueError(f'{file.name}: expected {next_day}, found {day}')
            next_day += timedelta(days=1)
            start, _, previous_month = months[-1]
            number = month_number(label)
            length_so_far = (day - start).days
            if number is None:
                if length_so_far >= len(DAY_NAMES) or label != DAY_NAMES[length_so_far]:
                    raise ValueError(f'{file.name}: inconsistent lunar day for {day}: {label}')
                continue
            expected_month = abs(previous_month) % 12 + 1
            if (length_so_far not in (29, 30) or
                    (number != expected_month and not (previous_month > 0 and number == -previous_month))):
                raise ValueError(f'{file.name}: inconsistent lunar month for {day}: {label}')
            if number == 1:
                lunar_year += 1
            months.append((day, lunar_year, number))
    if next_day != LAST_DAY + timedelta(days=1):
        raise ValueError(f'Expected all dates through {LAST_DAY}, missing dates from {next_day}')
    digest = hashlib.sha256(''.join(source_digests).encode()).hexdigest()
    return months, digest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('tables', type=Path, help='folder containing T1901c.txt through T2100c.txt')
    parser.add_argument('generated', type=Path, nargs='?', default=Path('src/calendar/hkoLunarMonths.json'),
                        help='generated month-start JSON path')
    args = parser.parse_args()
    months, digest = extract(args.tables)
    generated = json.loads(args.generated.read_text(encoding='utf-8'))
    if generated['source'] != SOURCE or generated['sourceSha256'] != digest:
        raise ValueError(f'HKO source differs from the verified snapshot. Current SHA-256: {digest}')
    expected = [[day.isoformat(), year, month] for day, year, month in months]
    if generated['months'] != expected:
        for index, (actual, reference) in enumerate(zip(generated['months'], expected)):
            if actual != reference:
                raise ValueError(f'Month {index}: expected {reference}, found {actual}')
        raise ValueError(f'Expected {len(expected)} months, found {len(generated["months"])}')
    print(f'Verified {len(expected)} month starts and {(LAST_DAY - FIRST_DAY).days + 1} dates against HKO. SHA-256: {digest}')


if __name__ == '__main__':
    main()
