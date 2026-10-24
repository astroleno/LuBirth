import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const folder=process.argv[2]||'output/earth-sky-spatial-integration-20261024';
const read=async name=>JSON.parse(await readFile(`${folder}/${name}.json`,'utf8'));
const checks=[];
const test=(name,run)=>{run();checks.push(name);console.log('PASS '+name);};
const sky=await read('mobile-sky'),earth=await read('mobile-earth'),event=await read('mobile-event'),entry=await read('birth-entry');
const fallback=await read('moon-texture-fallback'),recovered=await read('moon-texture-recovered');
const idleA=await read('sky-idle-a'),idleB=await read('sky-idle-b'),gpu=await read('sky-star-gpu');
const person=await readFile(`${folder}/mobile-person-ui.txt`,'utf8');
const cultureEarth=await read('earth-culture');
test('narrow sky remains one canvas with one portrait Moon and a 390 px viewport',()=>{
  assert.equal(sky.canvases,1);assert.deepEqual(sky.sky.viewport,[390,844]);assert.equal(sky.sky.placement,'portrait');assert.equal(sky.sky.moonCount,1);
});
test('narrow Earth preserves the immersive closeup and portrait Moon',()=>{
  assert.equal(earth.canvases,1);assert.equal(earth.journey.earthView.uiHidden,true);
  assert.equal(earth.performance.profile.mobile,true);assert.equal(earth.earth.placement,'portrait');assert.equal(earth.earth.moonCount,1);
});
test('narrow history event enters local 20:00 with LMT seconds and its default provenance',()=>{
  const value=event.journey.state.current;assert.equal(value.clock,'20:00');assert.equal(value.utc,'1083-11-30T11:54:06.000Z');
  assert.equal(value.timeSelection.origin,'event-default-20');assert.equal(event.sky.utc,value.utc);
});
test('person history form leaves the clock empty and the observe action disabled',()=>{
  const clock=person.split('\n').find(line=>line.includes('time field')&&line.includes('history-clock'));
  assert.ok(clock&&!clock.includes('Value:'));assert.match(person,/button \(disabled\) 观看这一天的天空/);
});
test('first birth-point entry is local north at 30 degrees, with portrait as default',()=>{
  assert.equal(entry.sky.placement,'portrait');
  const expected=[Math.sin(Math.PI/12),0,0,Math.cos(Math.PI/12)];
  entry.sky.cameraQuaternion.forEach((value,i)=>assert.ok(Math.abs(value-expected[i])<1e-8));
});
test('blocked lunar texture retains valid phase and position state, then reloads normally',()=>{
  assert.equal(fallback.solarObjects.texture,'failed');assert.equal(recovered.solarObjects.texture,'ready');
  assert.equal(fallback.sky.moonCount,1);assert.equal(fallback.sky.key,recovered.sky.key);
  assert.equal(fallback.sky.moonFraction,recovered.sky.moonFraction);assert.deepEqual(fallback.sky.sunLightView,recovered.sky.sunLightView);
});
test('stationary sky stops rendering between two actual browser captures',()=>{
  assert.notEqual(idleA.capturedAt,idleB.capturedAt);assert.equal(idleA.skyMetrics.state,'idle');
  assert.ok(idleA.skyMetrics.renders>0);assert.equal(idleA.skyMetrics.renders,idleB.skyMetrics.renders);
});
test('real browser GPU star rendering probe executes all twelve checks without shader errors',()=>{
  assert.equal(gpu.checks.length,12);assert.ok(gpu.passed&&gpu.checks.every(c=>c.pass));assert.deepEqual(gpu.shaderErrors,[]);
});
test('Earth culture overlay uses the current shared star frame and preserves its physical state',()=>{
  assert.equal(cultureEarth.journey.earthView.composition.showSkyCulture,true);assert.equal(cultureEarth.journey.state.culture,'song');
  assert.equal(cultureEarth.earth.starFrameKey,cultureEarth.earth.frame.key);assert.equal(cultureEarth.earth.backgroundKey,cultureEarth.earth.frame.key);
  assert.equal(cultureEarth.earth.starCount,8947);assert.equal(cultureEarth.earth.placement,'portrait');assert.equal(cultureEarth.canvases,1);
});
const result={checks:checks.length,results:checks};
await writeFile(folder+'/browser-flow-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
