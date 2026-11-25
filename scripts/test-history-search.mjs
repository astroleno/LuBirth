import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

// Labels are catalog original IDs read from the names, places, dates, IDs, and
// source titles in 529054b2. Every label is within that fixed catalog.
const cases = [
  ['苏轼', ['H002']],
  ['蘇軾', ['H002']],
  ['歐陽修', ['H001']],
  ['歐陽脩', ['H001']],
  ['欧阳脩生日考辨', ['H001']],
  ['記承天寺夜遊', ['H033']],
  ['蘭亭雅集', ['H031']],
  ['書拓定武本蘭亭', []],
  ['紹興', ['H030', 'H031', 'H052', 'N50-006']],
  ['１０８３－１１－３０', ['H033']],
  ['1083年11月30日', ['H033']],
  ['1083/11/30', ['H033']],
  ['353-4-23', ['H031']],
  ['0353 / 04 / 23', ['H031']],
  ['1083年11月30日 承天寺', ['H033']],
  ['1083年10月12日', []],
  ['1083/11/31', []],
  ['Ｈ００２', ['H002']],
  ['Shrewsbury', ['H060']],
  ['new king street', ['H040']],
  ['Washington, D.C.', ['N50-033']],
  ['HerschEL Museum 巴斯', ['H040']],
  ['蘭亭 1083-11-30', []],
  ['欧阳修 爪哇', []],
  ['ZZZ-not-in-archive', []],
];

const regressionCases = [
  ['1863年11月22日', ['N50-003']],
  ['1940年5月14日', ['N50-012']],
  ['1947年6月26日', ['N50-025']],
  ['1863/11/22', []],
  ['1940/5/14', []],
  ['1947/6/26', []],
  // H002 cites 苏轼年谱简编. The introduction gives 字子瞻 and 號東坡,
  // and the 1082 entry gives 東坡居士. https://fns.pdsu.edu.cn/info/1062/1655.htm
  ['苏东坡', ['H002']],
  ['蘇東坡', ['H002']],
  ['东坡居士', ['H002']],
  ['蘇子瞻', ['H002']],
  ['蘇東坡 眉山', ['H002']],
  ['东坡', []],
];

const holdoutCases = [
  ['梁啟超', ['H028']],
  ['魯迅', ['H052']],
  ['錢學森', ['B03-03']],
  ['岳飛', ['H020']],
  ['孫中山', ['H029']],
  ['齊白石', ['N50-003']],
  ['譚嗣同', ['N50-049']],
  ['會稽', ['H031']],
  ['廣州', ['H059', 'B03-08', 'B04-02', 'B02-06', 'X01-05', 'S15-04']],
  ['梁啟超 廣州', []],
  ['魯迅 1863/11/22', []],
];

const modulePath = '/src/history/historyRelations.ts';
const baseline = process.argv.includes('--baseline');
const readBaseline = file => execFileSync('git', ['show', `529054b2:${file}`], { encoding: 'utf8' });
const recordsPath = 'src/history/data/records.json';
const records = JSON.parse(baseline ? readBaseline(recordsPath) : await fs.readFile(recordsPath, 'utf8'));
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
  plugins: baseline ? [{
    name: 'history-search-baseline',
    enforce: 'pre',
    transform(_, id) {
      if (id.endsWith(modulePath)) return readBaseline(modulePath.slice(1));
    },
  }] : [],
});

try {
  const { selectHistory, matchedHistorySource } = await server.ssrLoadModule(modulePath);
  const recordById = new Map(records.map(record => [record.originalId, record]));
  const queryIds = query => selectHistory(records, { query }).map(record => record.originalId);
  const firstRuns = [];
  for (let trial = 0; trial < 25; trial++) {
    // Use fresh objects each time to measure the first search against a catalog.
    const fresh = structuredClone(records);
    const start = performance.now();
    selectHistory(fresh, { query: '蘭亭雅集' });
    firstRuns.push(performance.now() - start);
  }
  function evaluate(group) {
    const expectedTargets = group.reduce((sum, [, ids]) => sum + ids.length, 0);
    let foundTargets = 0;
    let extraHits = 0;
    let emptyQueryLeaks = 0;
    const differences = [];
    for (const [query, ids] of group) {
      for (const id of ids) assert.ok(recordById.has(id), id);
      const found = queryIds(query);
      foundTargets += found.filter(id => ids.includes(id)).length;
      extraHits += found.filter(id => !ids.includes(id)).length;
      if (!ids.length && found.length) emptyQueryLeaks++;
      if (found.length !== ids.length || ids.some(id => !found.includes(id))) {
        differences.push({ query, expected: ids, found });
      }
    }
    return {
      queries: group.length,
      noMatchQueries: group.filter(([, ids]) => !ids.length).length,
      foundTargets,
      expectedTargets,
      recall: foundTargets / expectedTargets,
      extraHits,
      emptyQueryLeaks,
      differences,
    };
  }
  const targeted = evaluate(cases);
  const regressions = evaluate(regressionCases);
  const holdout = evaluate(holdoutCases);
  const warmRuns = [];
  const sameQueryRuns = [];
  for (let trial = 0; trial < 25; trial++) {
    const start = performance.now();
    for (let repetition = 0; repetition < 20; repetition++) {
      for (const [query] of cases) queryIds(query);
    }
    warmRuns.push((performance.now() - start) / (20 * cases.length));
    const sameQueryStart = performance.now();
    for (let repetition = 0; repetition < 500; repetition++) queryIds('蘭亭雅集');
    sameQueryRuns.push((performance.now() - sameQueryStart) / 500);
  }
  const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  console.log(JSON.stringify({
    revision: baseline ? '529054b2' : 'working tree',
    records: records.length,
    targeted,
    regressions,
    holdout,
    medianFirstCatalogQueryMs: median(firstRuns),
    medianWarmQueryMs: median(warmRuns),
    medianWarmSameQueryMs: median(sameQueryRuns),
  }, null, 2));

  if (!baseline) {
    assert.deepEqual(targeted.differences, []);
    assert.deepEqual(regressions.differences, []);
    assert.deepEqual(holdout.differences, []);
    assert.deepEqual(queryIds('紹興'), ['H031', 'H030', 'H052', 'N50-006']);
    assert.deepEqual(selectHistory(records, { query: '紹興', filter: 'saved', favorites: [recordById.get('H031').id] }),
      [recordById.get('H031')]);
    assert.deepEqual(selectHistory(records, { query: '歐陽修', filter: 'event' }), []);
    assert.equal(matchedHistorySource(recordById.get('H033'), '1083年11月30日 記承天寺夜遊')?.title, '记承天寺夜游');
    assert.equal(matchedHistorySource(recordById.get('H033'), '1083年11月30日 承天寺'), undefined);
    assert.equal(matchedHistorySource(recordById.get('H001'), '歐陽脩')?.title, '王瑞来：欧阳脩生日考辨');
    assert.equal(matchedHistorySource(recordById.get('H002'), '蘇東坡'), undefined);
    const record = structuredClone(recordById.get('H033'));
    const source = { url: 'https://example.invalid/archive', title: '题录：1083年10月12日' };
    record.sources.push(source);
    assert.deepEqual(selectHistory([record], { query: '承天寺 1083年10月12日' }), [record]);
    assert.equal(matchedHistorySource(record, '承天寺 1083年10月12日'), source);
    assert.deepEqual(selectHistory([record], { query: '1083/10/12' }), []);
  }
} finally {
  await server.close();
}
