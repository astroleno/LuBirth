import type { LocationData } from './types';

const hangzhouNotice = 'https://zfgb.hangzhou.gov.cn/10/105220253/t116220253054/518298.shtml';

// Use named points within today's districts. The coordinates are not district centroids.
const hangzhouDistrictPoints = [
  ['上城区', 120.1784, 30.2460, '杭州站', 'https://www.wikidata.org/wiki/Q986404'],
  ['拱墅区', 120.1436, 30.3192, '拱宸桥东站', 'https://www.wikidata.org/wiki/Q21245974'],
  ['余杭区', 120.0156, 30.2827, '海创园站', 'https://www.wikidata.org/wiki/Q109774943'],
  ['临平区', 120.2920, 30.3831, '临平南站', 'https://www.wikidata.org/wiki/Q8060449'],
  ['钱塘区', 120.4519, 30.3010, '河庄路站', 'https://www.openstreetmap.org/node/9869948584'],
] as const;

function administrativeTimeZone(province: string) {
  if (province === '香港特别行政区') return 'Asia/Hong_Kong';
  if (province === '澳门特别行政区') return 'Asia/Macau';
  if (province === '台湾省') return 'Asia/Taipei';
  return 'Asia/Shanghai';
}

const oldHangzhouDistricts = new Map([['上城区', '上城区'], ['拱墅', '拱墅区'], ['余杭', '余杭区'],
  ['下城区', '下城区'], ['江干', '江干区']]);
const historicDistrict = (district: string) => `${district}（2021 年调整前）`;
const splitDistricts = new Map([
  [historicDistrict('江干区'), { former: '江干区', current: ['上城区', '钱塘区'] }],
  [historicDistrict('余杭区'), { former: '余杭区', current: ['余杭区', '临平区'] }],
]);

export function updateAdministrativeLocation(location: LocationData): LocationData {
  const withZone = { ...location, timeZone: administrativeTimeZone(location.province) };
  const oldName = location.city === '杭州市' && oldHangzhouDistricts.get(location.district);
  if (!oldName) return withZone;
  const shortName = oldName.slice(0, -1);
  return { ...withZone, district: historicDistrict(oldName), aliases: [`原${oldName}`, `旧${oldName}`, `原${shortName}`, `旧${shortName}`,
    ...(oldName === '下城区' || oldName === '江干区' ? [oldName, shortName] : [])], status: 'historical',
    note: '2021 年杭州区划调整前的地点表代表点。', source: hangzhouNotice };
}

export const addedLocations: LocationData[] = [
  ...hangzhouDistrictPoints.map(([district, lon, lat, point, source]) => ({
    province: '浙江省', city: '杭州市', district, lat, lon, timeZone: 'Asia/Shanghai',
    note: `现行区划，采用${point}附近的代表点。`, source,
  })),
  { province: '美国', city: '纽约', district: '', lat: 40.71427, lon: -74.00597, timeZone: 'America/New_York',
    aliases: ['纽约市', '紐約', '紐約市', 'New York', 'New York City', 'NYC'], status: 'international',
    note: '纽约市代表点。', source: 'https://www.geonames.org/5128581/new-york-city.html' },
  { province: '英国', city: '伦敦', district: '', lat: 51.50853, lon: -0.12574, timeZone: 'Europe/London',
    aliases: ['倫敦', 'London'], status: 'international', note: '伦敦市区代表点。',
    source: 'https://www.geonames.org/2643743/london.html' },
];

export function currentDistrictCandidates(location: LocationData): LocationData[] {
  const split = splitDistricts.get(location.district);
  if (!split || location.city !== '杭州市') return [];
  return addedLocations.filter(place => place.city === location.city && split.current.includes(place.district)).map(place => ({
    ...place,
    note: `据杭政函〔2021〕25号，包含原${split.former}部分区域。${place.note}`,
  }));
}
