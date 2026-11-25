import type { LocationData, LocationTree, SearchIndex } from './types';
import { provinces, getProvinceName, getCitiesByProvince } from './administrativeData';
import { addedLocations, currentDistrictCandidates, updateAdministrativeLocation } from './locationUpdates';

// 可搜索的省级简称和部分常用城市拼音。
const pinyinMap = new Map(Object.entries({
  '北京': 'beijing',
  '上海': 'shanghai',
  '天津': 'tianjin',
  '重庆': 'chongqing',
  '广东': 'guangdong',
  '江苏': 'jiangsu',
  '浙江': 'zhejiang',
  '山东': 'shandong',
  '河南': 'henan',
  '四川': 'sichuan',
  '湖北': 'hubei',
  '湖南': 'hunan',
  '河北': 'hebei',
  '福建': 'fujian',
  '安徽': 'anhui',
  '江西': 'jiangxi',
  '辽宁': 'liaoning',
  '黑龙江': 'heilongjiang',
  '吉林': 'jilin',
  '山西': 'shanxi',
  '陕西': 'shaanxi',
  '甘肃': 'gansu',
  '青海': 'qinghai',
  '新疆': 'xinjiang',
  '西藏': 'xizang',
  '宁夏': 'ningxia',
  '内蒙古': 'neimenggu',
  '广西': 'guangxi',
  '云南': 'yunnan',
  '贵州': 'guizhou',
  '海南': 'hainan',
  '香港': 'xianggang',
  '澳门': 'aomen',
  '台湾': 'taiwan',
  '杭州': 'hangzhou',
  '广州': 'guangzhou',
  '深圳': 'shenzhen',
  '南京': 'nanjing',
  '成都': 'chengdu',
  '武汉': 'wuhan',
  '西安': 'xian',
}));

const provinceShortNames = new Map(provinces.map(province => [province.name, province.shortName]));
const normalizeSearch = (value: string) => value.normalize('NFKC').trim().toLowerCase();

// Official names for supported abbreviated labels in the coordinate table.
// Beijing: https://mzj.beijing.gov.cn/art/2026/7/16/art_9984_692516.html
// Hangzhou: https://zfgb.hangzhou.gov.cn/18/106220253/t106220253064/528872.shtml
const officialDistrictNames = new Map([
  ['北京市', ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区',
    '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']],
  ['杭州市', ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区',
    '富阳区', '临安区', '桐庐县', '淳安县', '建德市']],
]);

// 解析CSV数据
export function parseCSVData(csvText: string): LocationData[] {
  const lines = csvText.trim().split('\n');
  const data: LocationData[] = [];
  
  // 跳过标题行
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [city, district, lon, lat] = line.split(',');
    
    // 使用映射获取正确的省份
    const province = getProvinceName(city);
    
    if (!province) {
      console.warn(`无法找到城市 ${city} 对应的省份`);
      continue;
    }
    
    data.push(updateAdministrativeLocation({
      province,
      city,
      district,
      lon: parseFloat(lon),
      lat: parseFloat(lat)
    }));
  }
  
  return [...data, ...addedLocations];
}

// 构建正确的树形结构（基于中国行政层级）
export function buildLocationTree(data: LocationData[]): LocationTree {
  const tree: LocationTree = { provinces: Object.create(null) };
  
  // 首先添加所有省份
  provinces.forEach(province => {
    tree.provinces[province.name] = {
      name: province.name,
      cities: Object.create(null)
    };
  });
  
  // 然后添加城市和区县数据
  data.forEach(item => {
    if (item.status) return;
    const { province, city, district } = item;
    
    // 确保省份存在
    if (!tree.provinces[province]) {
      tree.provinces[province] = {
        name: province,
        cities: Object.create(null)
      };
    }
    
    // 确保城市存在
    if (!tree.provinces[province].cities[city]) {
      tree.provinces[province].cities[city] = {
        name: city,
        districts: Object.create(null)
      };
    }
    
    // 添加区县
    tree.provinces[province].cities[city].districts[district] = item;
  });
  
  return tree;
}

// 构建搜索索引
export function buildSearchIndex(data: LocationData[]): SearchIndex {
  const names = new Map<string, LocationData[]>();
  const qualifiedNames = new Map<string, LocationData[]>();
  const indexNames = (index: Map<string, LocationData[]>, keys: Iterable<string>, location: LocationData) => {
    for (const key of new Set(keys)) {
      if (!key) continue;
      const matches = index.get(key);
      if (matches) matches.push(location);
      else index.set(key, [location]);
    }
  };
  const entries = data.map(location => {
    const [province, city, district] = [location.province, location.city, location.district].map(normalizeSearch);
    indexNames(names, [province + city + district, city + district, province, city, district], location);

    const provinceShort = provinceShortNames.get(province) ?? province;
    const cityShort = city.replace(/[市县]$/, '');
    const districtShort = district.replace(/[区县市]$/, '');
    const districtVariants = new Set([district, districtShort]);
    const aliases = location.aliases?.map(normalizeSearch) ?? [];
    if (location.status !== 'international') for (const alias of aliases) districtVariants.add(alias);
    indexNames(qualifiedNames, aliases, location);
    const official = officialDistrictNames.get(city)?.find(name => name.slice(0, -1) === district);
    if (official) districtVariants.add(official);
    const provinceVariants = new Set([province, provinceShort]);
    const cityVariants = new Set([city, cityShort]);
    const provincePinyin = pinyinMap.get(provinceShort);
    const cityPinyin = pinyinMap.get(cityShort);
    if (provincePinyin) provinceVariants.add(provincePinyin);
    if (cityPinyin) cityVariants.add(cityPinyin);
    if (location.status === 'international') for (const alias of aliases) cityVariants.add(alias);
    if (district) {
      const combined = [];
      for (const districtName of districtVariants) for (const cityName of cityVariants) {
        combined.push(cityName + districtName);
        for (const provinceName of provinceVariants) combined.push(provinceName + cityName + districtName);
      }
      indexNames(qualifiedNames, combined, location);
    }
    return { location, names: [province, city, district], variants: [provinceVariants, cityVariants, districtVariants] };
  });
  return { names, qualifiedNames, entries };
}

// 搜索功能
export function searchLocations(query: string, searchIndex: SearchIndex): LocationData[] {
  const queryText = normalizeSearch(query);
  const terms: string[] = queryText.match(/(?:\([^)]*\)|[^\s,、/·()])+/g) ?? [];
  if (!terms.length || terms.length > 3) return [];

  const results: LocationData[] = [];
  const seen = new Set<string>();
  const add = (locations: readonly LocationData[], includeHistorical = false) => {
    for (const location of locations) {
      if (location.status === 'historical' && !includeHistorical) continue;
      const candidates = location.status === 'historical' ? [location, ...currentDistrictCandidates(location)] : [location];
      for (const candidate of candidates) {
        if (results.length === 20) return;
        const key = JSON.stringify([candidate.province, candidate.city, candidate.district]);
        if (seen.has(key)) continue;
        seen.add(key);
        results.push(candidate);
      }
    }
  };

  add(searchIndex.qualifiedNames.get(queryText) ?? [], true);
  if (results.length) return results;

  const [term] = terms;
  if (terms.length === 1) {
    const literal = searchIndex.names.get(term) ?? [];
    const matchesField = (location: LocationData) =>
      [location.province, location.city, location.district].some(name => normalizeSearch(name) === term);
    add(literal.filter(matchesField));
    add(literal);
    for (const [name, matches] of searchIndex.names) {
      if (results.length === 20) break;
      if (name !== term && name.includes(term)) add(matches);
    }
    if (results.length < 20) {
      for (const { variants, location } of searchIndex.entries) {
        if (results.length === 20) break;
        if (variants.some(level => level.has(term))) add([location]);
      }
    }
    return results;
  }

  // 每个词匹配同一条记录中后续的层级，可省略任一层。
  const fallbacks: LocationData[] = [];
  for (const { names, variants, location } of searchIndex.entries) {
    let position = 0;
    let exact = true;
    for (const [index, level] of variants.entries()) {
      if (!level.has(terms[position])) continue;
      if (terms[position] !== names[index]) exact = false;
      position++;
    }
    if (position === terms.length && (location.status !== 'historical' || terms.some(term => variants[2].has(term)))) {
      if (exact) add([location], true);
      else fallbacks.push(location);
    }
    if (results.length === 20) return results;
  }
  add(fallbacks, true);
  return results;
}

// 获取省份列表
export function getProvinces(tree: LocationTree): string[] {
  return Object.keys(tree.provinces).sort();
}

// 获取城市列表
export function getCities(tree: LocationTree, province: string): string[] {
  if (!tree.provinces[province]) return [];
  return Object.keys(tree.provinces[province].cities).sort();
}

// 获取省份下的所有城市（基于行政数据）
export function getCitiesByProvinceName(province: string): string[] {
  return getCitiesByProvince(province);
}

// 获取区县列表
export function getDistricts(tree: LocationTree, province: string, city: string): string[] {
  if (!tree.provinces[province] || !tree.provinces[province].cities[city]) return [];
  return Object.keys(tree.provinces[province].cities[city].districts).sort();
}

// 获取位置坐标
export function getLocationCoords(tree: LocationTree, province: string, city: string, district: string): { lon: number; lat: number } | null {
  const place = getSelectedLocation(tree, province, city, district);
  return place ? { lon: place.lon, lat: place.lat } : null;
}

export function getSelectedLocation(tree: LocationTree, province: string, city: string, district: string): LocationData | null {
  return tree.provinces[province]?.cities[city]?.districts[district] ?? null;
}
