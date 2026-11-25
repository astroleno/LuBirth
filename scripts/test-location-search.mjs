import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { createServer } from 'vite';

const baseline = process.argv.includes('--baseline');
const processor = '/src/components/LocationSelector/dataProcessor.ts';
const administrativeData = '/src/components/LocationSelector/administrativeData.ts';
const csv = 'public/data/全国各地方省市经纬度及地方行政区号simple.csv';
const revision = '942d727b';
const readBaseline = path => execFileSync('git', ['show', `${revision}:${path}`], { encoding: 'utf8' });
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
  plugins: [{
    name: 'location-search-baseline',
    enforce: 'pre',
    transform(_, id) {
      const source = [processor, administrativeData].find(path => id.endsWith(path));
      if (baseline && source) return readBaseline(source.slice(1));
    },
  }],
});

try {
  const { parseCSVData, buildSearchIndex, buildLocationTree, getLocationCoords, searchLocations } = await server.ssrLoadModule(processor);
  const rows = parseCSVData(baseline ? readBaseline(csv) : await fs.readFile(csv, 'utf8'));
  const index = buildSearchIndex(rows);
  const search = query => searchLocations(query, index);
  const hangzhou = rows.filter(row => row.city === '杭州市');
  const shangcheng = hangzhou.find(row => row.district === '上城区');
  const xihu = hangzhou.find(row => row.district === '西湖');
  const beijing = rows.filter(row => row.city === '北京市');
  const haidian = beijing.find(row => row.district === '海淀');
  const inputs = [
    [' 杭州 ', hangzhou], ['浙江 杭州', hangzhou], ['浙江省／杭州市', hangzhou],
    ['ZHEJIANG，ＨＡＮＧＺＨＯＵ', hangzhou], ['beijing', beijing],
    ['海淀区', [haidian]], ['北京 · 海淀区', [haidian]], ['北京  海淀区', [haidian]],
    ['浙江省 · 杭州市 · 上城区', [shangcheng]], ['北京市 · 海淀', [haidian]],
    ['　浙江省，杭州市 西湖区　', [xihu]], ['北京 海淀县', []], ['杭州 西湖县', []],
    ['beijing 海淀区', [haidian]], ['浙江 海淀区', []], ['北京 hangzhou', []],
    ['constructor', []], ['__proto__', []], ['hasOwnProperty', []], ['toString', []],
    ['\u3000', []], [' / · ', []],
  ];
  const observations = inputs.map(([query, expected]) => {
    try {
      const actual = search(query);
      if (!baseline) assert.deepEqual(actual, expected, query);
      return { query, count: actual.length, expected: expected.length };
    } catch (error) {
      if (!baseline) throw error;
      return { query, error: error.name, expected: expected.length };
    }
  });
  for (const query of ['杭州', '北京', '杭州市临安', '朝阳', '浙江省', '浦东新区']) {
    observations.push({ query, count: search(query).length,
      orderedIds: search(query).map(row => [row.province, row.city, row.district].join('/')) });
  }
  if (!baseline) {
    assert.deepEqual(search('杭州'), hangzhou);
    assert.deepEqual(search('北京'), beijing);
    assert.deepEqual(search('朝阳').map(row => [row.city, row.district]), [
      ['北京市', '朝阳'], ['朝阳市', '朝阳'], ['朝阳市', '双塔'], ['朝阳市', '龙城'],
      ['朝阳市', '朝阳县'], ['朝阳市', '建平'], ['朝阳市', '喀左'], ['朝阳市', '北票'],
      ['朝阳市', '凌源'], ['长春市', '朝阳区'],
    ]);
    assert.deepEqual(search('朝阳区').map(row => [row.city, row.district]), [['长春市', '朝阳区'], ['北京市', '朝阳']]);
    assert.equal(search('浙江省').length, 20);
    assert.equal(search('浦东新区')[0].district, '浦东新区');
    const smallIndex = buildSearchIndex([haidian, { ...haidian }, { ...haidian, city: '测试市' }]);
    assert.deepEqual(searchLocations('海淀区', smallIndex), [haidian]);
    const result = searchLocations('海淀', smallIndex);
    assert.equal(result.length, 2);
    assert.equal(result[0], haidian);
    const { selectedLocationDraft } = await server.ssrLoadModule('/src/components/LocationSelector/locationDraft.ts');
    const { createObserverDraft, resolveObserverDraft } = await server.ssrLoadModule('/src/history/observationDraft.ts');
    const observer = { name: '北京市 · 海淀', latitude: haidian.lat, longitude: haidian.lon,
      precision: 'user-selected', note: '测试地点' };
    assert.equal(haidian.lat, 39.956074);
    assert.equal(haidian.lon, 116.310316);
    const tree = buildLocationTree(rows);
    assert.deepEqual(getLocationCoords(tree, haidian.province, haidian.city, haidian.district),
      { lat: haidian.lat, lon: haidian.lon });
    assert.equal(getLocationCoords(tree, '__proto__', '北京市', '海淀'), null);
    assert.equal(getLocationCoords(tree, '北京市', 'constructor', '海淀'), null);
    assert.equal(getLocationCoords(tree, '北京市', '北京市', 'toString'), null);
    const draft = { ...createObserverDraft(observer), mode: 'search', search: selectedLocationDraft(search('海淀区')[0]) };
    assert.deepEqual(resolveObserverDraft(draft), observer);
    assert.equal(resolveObserverDraft({ ...draft, search: { ...draft.search, query: '海淀区', pending: true } }), null);
    assert.equal(resolveObserverDraft({ ...draft, search: { ...draft.search, query: '', pending: true } }), null);
  }
  console.log(JSON.stringify({ revision: baseline ? revision : 'working tree', rows: rows.length, observations }, null, 2));
} finally {
  await server.close();
}
