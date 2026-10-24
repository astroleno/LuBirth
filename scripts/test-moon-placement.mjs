import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const cacheDir=await mkdtemp(join(tmpdir(),'lubirth-moon-'));
const vite=await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
let checks=0; const test=(name,run)=>{run();checks++;console.log('PASS '+name);};
try {
  const C=await vite.ssrLoadModule('/src/astro/celestialState.ts'), R=await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const {moonScenePlacement}=await vite.ssrLoadModule('/src/scenes/simple/utils/moonPlacement.ts');
  const s=C.createCelestialState('2026-10-24T12:00:00Z'), f=R.createEarthSceneFrame(s), before=JSON.stringify(s);
  const portrait={position:[0,0,-14],radius:1.2};
  test('physical position uses one scale for Earth, lunar distance and lunar radius',()=>{
    for(const radius of [.05,1,10]) {
      const m=moonScenePlacement(s,f,'physical',radius,portrait);
      assert.ok(Math.abs(Math.hypot(...m.position)/radius-s.moonDistanceKm/C.EARTH_RADIUS_KM)<1e-10);
      assert.ok(Math.abs(m.radius/radius-C.MOON_RADIUS_KM/C.EARTH_RADIUS_KM)<1e-12);
      assert.ok(R.angleDegrees(m.position,R.applyFrame(f.eqjToScene,s.moonEqjKm))<1e-10);
      assert.equal(m.screenAnchor,false);
    }
  });
  test('portrait geometry preserves current anchors without altering physical state',()=>{
    const a=moonScenePlacement(s,f,'portrait',2,portrait);
    const b=moonScenePlacement(s,f,'portrait',2,{position:[5,7,-3],radius:3});
    assert.deepEqual(a.position,portrait.position);assert.equal(a.radius,portrait.radius);assert.equal(a.screenAnchor,true);
    assert.deepEqual(a.physicalPosition,b.physicalPosition);assert.equal(JSON.stringify(s),before);
    assert.throws(()=>moonScenePlacement(s,f,'physical',NaN,portrait));
  });
  test('camera-space portrait phase is observer-corrected and independent of picture layout',()=>{
    const a=C.createObserverState(s,{latitude:31.2304,longitude:121.4737});
    const b=C.createObserverState(s,{latitude:-33.8688,longitude:151.2093});
    for(const o of [a,b]) {assert.ok(Math.abs((o.portraitLight[2]+1)/2-o.phaseFraction)<1e-12);assert.ok(Math.abs(Math.hypot(...o.portraitLight)-1)<1e-12);}
    assert.ok(R.angleDegrees(a.moon.directionEqj,b.moon.directionEqj)>.01);
  });
  test('legacy shader azimuth preserves composition while incoming light is opposite',()=>{
    assert.equal(R.legacySolarAzimuth([-.7071,.7071,0]),-90);
    assert.equal(R.legacySolarAzimuth([0,1,0]),-90);
    assert.ok(R.dot(f.sunDirectionScene,f.lightTravelDirectionScene)<-.999999);
  });
  console.log(JSON.stringify({checks}));
}finally{await vite.close();await rm(cacheDir,{recursive:true,force:true});}
