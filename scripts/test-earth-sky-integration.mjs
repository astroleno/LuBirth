// Offline verification of evidence exported from the actual browser/R3F scene.
// This never treats the pure model's output as proof that a mesh used that output.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const folder=process.argv[2]||'output/earth-sky-spatial-integration-20261024';
const read=async name=>JSON.parse(await readFile(`${folder}/${name}.json`,'utf8'));
const cacheDir=await mkdtemp(join(tmpdir(),'lubirth-integration-'));
const vite=await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
const results=[];let maxRenderedStarError=0;
const test=(name,run)=>{run();results.push(name);console.log('PASS '+name);};
try {
  const C=await vite.ssrLoadModule('/src/astro/celestialState.ts'),R=await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const seasons=await read('season-render-snapshots'),roundtrips=await read('roundtrips');
  const portrait=await read('sky-portrait'),physical=await read('sky-physical'),earthPhysical=await read('earth-closeup-physical');
  const eventSky=await read('event-sky'),eventEarth=await read('event-earth'),returned=await read('personal-return'),closeup=await read('earth-closeup');
  const cultures=await read('culture-snapshots'),solar=await read('browser-solar-full');
  test('actual Earth shader, upright mesh and catalog buffers follow the same celestial state',()=>{
    for(const sample of [...seasons,...roundtrips.map(r=>r.earth)]) {
      assert.equal(sample.canvases,1); const e=sample.earth,s=C.createCelestialState(e.utc),f=R.createEarthSceneFrame(s,e.frame.fixedSunAzimuthDeg);
      assert.equal(e.key,s.key);assert.equal(e.backgroundKey,f.key);assert.equal(e.starFrameKey,f.key);
      assert.ok(R.angleDegrees(e.shaderSunDirection,f.sunDirectionScene)<.0001);
      assert.ok(R.angleDegrees(e.axis,[0,1,0])<.0001);assert.equal(e.starCount,8947);assert.equal(e.moonCount,1);
      assert.ok(Math.abs(Math.asin(e.shaderSunDirection[1])/R.DEG-f.sunDeclinationDeg)<.0001);
      for(const star of e.starSamples){maxRenderedStarError=Math.max(maxRenderedStarError,star.errorDeg);assert.ok(star.errorDeg<.0001);}
      assert.deepEqual(Object.values(e.textureAttributes),[8947,8947,8947]);
    }
  });
  test('actual star buffers agree between Earth and local sky; culture switching preserves positions',()=>{
    const earth=roundtrips.at(-1).earth.earth, sky=portrait.sky;
    for(const star of earth.starSamples){const local=sky.starSamples.find(s=>s.hip===star.hip);assert.ok(R.angleDegrees(star.local,local.position)<.0001);}
    assert.equal(cultures.length,4);
    for(const sample of cultures){assert.equal(sample.key,cultures[0].key);assert.deepEqual(sample.stars,cultures[0].stars);}
  });
  test('physical Moon mesh uses the actual Earth center, one km scale, real radius and a sufficient far plane',()=>{
    const e=earthPhysical.earth,s=C.createCelestialState(e.utc);
    const relative=R.subtract(e.moonPosition,e.earthPosition),expected=R.scale(R.applyFrame(e.frame.eqjToScene,s.moonEqjKm),e.earthRadius/C.EARTH_RADIUS_KM);
    assert.equal(e.placement,'physical');assert.equal(e.moonCount,1);
    assert.ok(Math.hypot(...R.subtract(relative,expected))<1e-7);
    assert.ok(Math.abs(Math.hypot(...relative)/e.earthRadius-s.moonDistanceKm/C.EARTH_RADIUS_KM)<1e-7);
    assert.ok(Math.abs(e.moonRadius*e.moonScale[0]/e.earthRadius-C.MOON_RADIUS_KM/C.EARTH_RADIUS_KM)<1e-6);
    assert.ok(e.far>Math.hypot(...R.subtract(e.moonPosition,e.cameraPosition))+e.moonRadius*e.moonScale[0]);
    const p=physical.sky; assert.equal(p.moonCount,1);assert.equal(p.placement,'physical');
    assert.ok(R.angleDegrees(p.moonPosition,p.moonDirection)<.0001);
    assert.ok(Math.abs(Math.asin(p.radius/Math.hypot(...p.moonPosition))/R.DEG-p.moonAngularRadius)<1e-7);
  });
  test('portrait is one screen-space Moon with the observer phase and stable pixel size',()=>{
    const p=portrait.sky;assert.equal(p.placement,'portrait');assert.equal(p.moonCount,1);assert.equal(p.portraitProjection,1);
    assert.ok(Math.abs(p.moonNdc[0]-.72)<1e-8&&Math.abs(p.moonNdc[1]-.44)<1e-8);
    assert.ok(R.angleDegrees(p.sunLightView,p.portraitLight)<1e-7);
    const pixels=p.meshRadius*p.meshScale[0]*p.viewport[1]/(2*14*Math.tan(p.cameraFov*R.DEG/2));
    assert.ok(Math.abs(pixels-Math.min(56,Math.max(22,p.viewport[1]*.052)))<.001);
    let lit=0,total=0;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      const nx=(x+.5)/128-1,ny=(y+.5)/128-1,r2=nx*nx+ny*ny;if(r2>=1)continue;total++;
      if(R.dot([nx,ny,Math.sqrt(1-r2)],p.sunLightView)>0)lit++;
    }
    assert.ok(Math.abs(lit/total-p.moonFraction)<.002);
  });
  test('date-only event at local 20:00 has explicit provenance and shares one UTC across both views',()=>{
    const event=eventSky.journey.state.current;
    assert.equal(event.clock,'20:00');assert.equal(event.timeSelection.origin,'event-default-20');
    assert.equal(event.timeSelection.ruleVersion,'event-evening-v1');assert.equal(event.source.recordKind,'event');
    assert.equal(event.utc,'1083-11-30T12:20:29.000Z');assert.equal(eventSky.sky.utc,event.utc);assert.equal(eventEarth.earth.utc,event.utc);
    assert.equal(eventEarth.journey.state.birth.utc,'2000-01-01T12:00:00.000Z');
  });
  test('personal/history return and 20 view roundtrips retain independent cameras and the portrait preference',()=>{
    assert.equal(roundtrips.length,20);assert.equal(returned.earth.utc,closeup.earth.utc);
    assert.ok(Math.hypot(...R.subtract(returned.earth.cameraPosition,closeup.earth.cameraPosition))<1e-7);
    assert.deepEqual(returned.earth.cameraQuaternion,closeup.earth.cameraQuaternion);
    for(const row of roundtrips){assert.equal(row.earth.earth.utc,row.sky.sky.utc);assert.equal(row.earth.earth.placement,'portrait');assert.equal(row.sky.sky.placement,'portrait');
      assert.equal(row.earth.earth.earthReady,true);assert.equal(row.sky.sky.skyReady,true);assert.equal(row.earth.earth.directionalLights,1);
      assert.equal(row.sky.canvases,1);assert.equal(row.sky.sky.moonCount,1);assert.deepEqual(row.sky.sky.cameraQuaternion,roundtrips[0].sky.sky.cameraQuaternion);}
  });
  test('20 actual roundtrips respect artwork and renderer resource bounds',()=>{
    for(const row of roundtrips){
      const a=row.sky.artCache,m=row.sky.sky.rendererMemory;
      assert.ok(a.entries<=12&&a.bytes<=64*1024*1024&&a.failed===0);
      assert.ok(m.textures<=14&&m.geometries<=20&&m.programs<=20);
      assert.ok(row.earth.performance.textures<=25&&row.earth.performance.geometries<=30);
    }
    const first=roundtrips.slice(0,5),last=roundtrips.slice(-5);
    for(const field of ['textures','geometries','programs']) assert.ok(Math.max(...last.map(r=>r.sky.sky.rendererMemory[field]))<=Math.max(...first.map(r=>r.sky.sky.rendererMemory[field]))+1);
  });
  test('browser full-light checks are registered, nonempty and successful',()=>{
    assert.equal(solar.summary.passed,solar.summary.total);assert.ok(solar.summary.total>0);
    assert.ok(solar.noTilt.ok&&solar.noTilt.samples===180&&solar.noTilt.maxTiltDeg<=.0001);
    assert.ok(solar.fixedSunAz.ok&&solar.fixedSunAz.diff<=.0001);assert.ok(solar.seasonal.ok);
    assert.equal(solar.moonPhase.passed,solar.moonPhase.total);assert.ok(solar.moonPhase.total>0);
  });
  const hashes=await read('baseline-hashes');
  const unchanged=Object.keys(hashes).filter(file=>file.endsWith('.png')||file.startsWith('src/history/data/'));
  for(const file of unchanged) assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),hashes[file],file);
  test('all original figure art and history catalog hashes are unchanged',()=>assert.ok(unchanged.length>=56));
  const report={checks:results.length,maxRenderedStarErrorDeg:maxRenderedStarError,roundtrips:roundtrips.length,unchangedFiles:unchanged.length,results};
  await writeFile(`${folder}/integration-results.json`,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
} finally {await vite.close();await rm(cacheDir,{recursive:true,force:true});}
