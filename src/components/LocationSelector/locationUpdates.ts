import type { LocationData } from './types';

const hangzhouNotice = 'https://zfgb.hangzhou.gov.cn/10/105220253/t116220253054/518298.shtml';
// This transcript preserves the Hebei government notice and points to the original publication.
const xingtaiNotice = 'https://zh.wikisource.org/wiki/国务院批复同意河北省调整邢台市部分行政区划';

const macaoTourism = 'https://www.macaotourism.gov.mo/zh-hans/';
// Map pins (WGS84) from MGTO. Macau Peninsula parish boundaries: https://bo.dsaj.gov.mo/bo/i/91/16/declei26_cn.asp
const macaoPoints = new Map<string, readonly [traditional: string, point: string, path: string]>([
  ['花王堂区', ['花王堂區', '圣安多尼堂', 'sightseeing/churches/st-anthonys-church']],
  ['望德堂区', ['望德堂區', '望德圣母堂', 'sightseeing/churches/st-lazarus-church']],
  ['风顺堂区', ['風順堂區', '圣老楞佐堂', 'sightseeing/churches/st-lawrences-church']],
  ['圣方济各堂区', ['聖方濟各堂區', '圣方济各圣堂', 'sightseeing/churches/chapel-of-st-francis-xavier']],
  ['嘉模堂区', ['嘉模堂區', '嘉模圣母堂', 'sightseeing/churches/our-lady-of-carmel-church']],
  ['大堂区', ['大堂區', '主教座堂', 'sightseeing/macao-world-heritage/cathedral']],
  ['路氹填海区', ['路氹填海區', '澳门新濠影汇', 'events/whatson/13425']],
  ['花地玛堂区', ['花地瑪堂區', '花地玛圣母堂', 'sightseeing/churches/our-lady-of-fatima-church']],
  ['澳门', ['澳門', '议事亭前地', 'sightseeing/macao-world-heritage/senado-square']],
]);

// District memberships are confirmed by the provincial cultural relics bureau, Xingtai's
// 信用信都区 site, and the city agriculture bureau's list of towns. Links below give the coordinates.
// https://wenwu.hebei.gov.cn/system/2024/03/04/030278946.shtml
// https://xy.xingtai.gov.cn/xsq/xyqxq/
// https://nync.xingtai.gov.cn/uploadfiles/202306/20/202306200927490738.pdf
const xingtaiPoints = new Map<string, readonly [point: string, source: string]>([
  ['襄都区', ['邢台博物馆', 'https://zh.wikipedia.org/wiki/邢台博物馆']],
  ['信都区', ['达活泉街道', 'https://zh.wikipedia.org/wiki/达活泉街道']],
  ['任泽区', ['任城镇', 'https://zh.wikipedia.org/wiki/任城镇']],
  ['南和区', ['和阳镇', 'https://zh.wikipedia.org/wiki/和阳镇']],
]);

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

type DistrictRevision = {
  year: number;
  notice: string;
  source: string;
  former: { csvName: string; name: string; current?: string[]; currentSharesName?: boolean }[];
};

const districtRevisions = new Map<string, DistrictRevision>([
  ['杭州市', { year: 2021, notice: '杭政函〔2021〕25号', source: hangzhouNotice, former: [
    { csvName: '上城区', name: '上城区', currentSharesName: true },
    { csvName: '拱墅', name: '拱墅区', currentSharesName: true },
    { csvName: '余杭', name: '余杭区', current: ['余杭区', '临平区'], currentSharesName: true },
    { csvName: '下城区', name: '下城区' },
    { csvName: '江干', name: '江干区', current: ['上城区', '钱塘区'] },
  ] }],
  ['邢台市', { year: 2020, notice: '2020 年邢台区划调整批复', source: xingtaiNotice, former: [
    { csvName: '桥东区', name: '桥东区', current: ['襄都区'] },
    { csvName: '桥西区', name: '桥西区', current: ['信都区'] },
    { csvName: '邢台县', name: '邢台县', current: ['襄都区', '信都区'] },
    { csvName: '任县', name: '任县', current: ['任泽区'] },
    { csvName: '南和', name: '南和县', current: ['南和区'] },
  ] }],
]);

const historicDistrict = (district: string, year: number) => `${district}（${year} 年调整前）`;

function previousDistrict(location: LocationData) {
  const revision = districtRevisions.get(location.city);
  const former = revision?.former.find(item => item.csvName === location.district
    || historicDistrict(item.name, revision.year) === location.district);
  return revision && former ? { revision, former } : undefined;
}

export function updateAdministrativeLocation(location: LocationData): LocationData {
  const withZone = { ...location, timeZone: administrativeTimeZone(location.province) };
  if (location.province === '新疆维吾尔自治区') return { ...withZone, alternateTimeZone: 'Asia/Urumqi' };
  const macao = location.city === '澳门' ? macaoPoints.get(location.district) : undefined;
  if (macao) {
    const [traditional, point, path] = macao;
    return { ...withZone, aliases: [traditional, point], note: `采用${point}附近的代表点。`, source: macaoTourism + path };
  }
  const xingtai = location.city === '邢台市' ? xingtaiPoints.get(location.district) : undefined;
  if (xingtai) {
    const [point, source] = xingtai;
    return { ...withZone, note: `现行区划，采用${point}附近的代表点。`, source };
  }
  const previous = previousDistrict(location);
  if (!previous) return withZone;
  const { former, revision } = previous;
  const shortName = former.name.slice(0, -1);
  const names = shortName.length >= 2 ? [former.name, shortName] : [former.name];
  return { ...withZone, district: historicDistrict(former.name, revision.year),
    aliases: [...names.flatMap(name => [`原${name}`, `旧${name}`]), ...(former.currentSharesName ? [] : names)],
    status: 'historical', note: `${revision.year} 年${location.city}区划调整前的地点表代表点。`, source: revision.source };
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

export function currentDistrictCandidates(location: LocationData, findDistrict: (district: string) => LocationData | undefined): LocationData[] {
  const previous = previousDistrict(location);
  const districts = previous?.former.current;
  if (!previous || !districts) return [];
  const { former, revision } = previous;
  return districts.flatMap(district => {
    const place = findDistrict(district);
    if (!place) return [];
    const detail = districts.length > 1 ? `包含原${former.name}部分区域` : `原${former.name}调整为${district}`;
    return [{ ...place, note: `据${revision.notice}，${detail}。${place.note ?? ''}` }];
  });
}
