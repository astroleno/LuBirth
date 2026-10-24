import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const folder=process.argv[2]||'output/earth-sky-spatial-integration-20261024';
const earth=JSON.parse(await readFile(folder+'/moon-earth-performance.json','utf8'));
const sky=JSON.parse(await readFile(folder+'/moon-performance.json','utf8'));
const compare=(rows,stats,buffer)=>{
  const baseline=rows.filter(r=>r.mode.startsWith('baseline')),moon=rows.filter(r=>r.mode.startsWith('portrait'));
  assert.ok(baseline.length&&moon.length>=2);
  for(const row of rows){assert.deepEqual(buffer(row),buffer(rows[0]));assert.ok(stats(row).gpuSupported);}
  // Use the largest measured lunar value against the smallest baseline,
  // retaining negative differences as measurement noise instead of claiming a speedup.
  const difference=key=>Math.max(...moon.map(r=>stats(r)[key]))-Math.min(...baseline.map(r=>stats(r)[key]));
  return {samples:rows.length,cpuMeanDelta:difference('cpuMean'),cpuP95Delta:difference('cpuP95'),gpuP95Delta:difference('gpuP95'),
    ...(Number.isFinite(stats(rows[0]).gpuMean)?{gpuMeanDelta:difference('gpuMean')}:{})};
};
for(const row of earth){assert.equal(row.earth.utc,earth[0].earth.utc);assert.deepEqual(row.earth.cameraQuaternion,earth[0].earth.cameraQuaternion);
  assert.equal(row.earth.moonCount,row.mode.startsWith('baseline')?0:1);assert.ok(row.performance.renderTiming.gpuSamples>=120);}
const earthResult=compare(earth,r=>r.performance.renderTiming,r=>r.performance.drawingBuffer);
const skyRows=sky.map(row=>({...row,metrics:{...row.metrics,cpuMean:row.metrics.cpuMs}}));
for(const row of skyRows){assert.equal(row.state.utc,skyRows[0].state.utc);assert.equal(row.state.moonCount,row.mode.startsWith('baseline')?0:1);}
const skyResult=compare(skyRows,r=>r.metrics,r=>[r.metrics.width,r.metrics.height]);
// Sky's established diagnostics expose GPU P95 only; no mean is reported.
for(const result of [earthResult,skyResult]){assert.ok(result.cpuP95Delta<2);assert.ok(result.gpuP95Delta<2);}
assert.ok(earthResult.cpuMeanDelta<2&&earthResult.gpuMeanDelta<2);
const result={earth:earthResult,sky:skyResult,target:'Observed added drawing cost < 2 ms/frame in this desktop browser',
  limitations:['A/B samples are sequential; GPU contention/noise remains. Negative deltas are not speedups.',
    'CPU measures scene submission, excluding React/layout and asset loading. Earth glass uses a separate context and is excluded.',
    'These are sampled portrait costs, not a device-independent guarantee. Physical mode geometry/visibility is validated separately.']};
await writeFile(folder+'/performance-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
