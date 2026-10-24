import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
import * as Astronomy from 'astronomy-engine';
const cacheDir = await mkdtemp(join(tmpdir(), 'lubirth-celestial-'));
const vite = await createServer({ configFile: false, cacheDir, server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
let checks = 0;
function test(name, run) { run(); checks++; console.log('PASS ' + name); }
try {
  const C = await vite.ssrLoadModule('/src/astro/celestialState.ts');
  const R = await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const S = await vite.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  const { skyCatalog: catalog } = await vite.ssrLoadModule('/src/spikes/sky/skyCatalog.ts');
  const dates = ['0001-01-01T12:00:00Z','0050-01-01T12:30:19Z','1037-01-14T13:04:40Z',
    '2026-03-20T12:00:00Z','2026-06-21T12:00:00Z','2026-12-21T12:00:00Z','2999-12-31T12:00:00Z'];
  const locations = [{latitude:31.2304,longitude:121.4737},{latitude:-33.8688,longitude:151.2093},
    {latitude:0,longitude:0},{latitude:70,longitude:180},{latitude:-70,longitude:-180},
    {latitude:90,longitude:0},{latitude:-90,longitude:90}];
  let maxRoundtrip=0, maxParallax=0;
  test('invalid/absolute time, years 1–99, seconds and coordinate boundaries',()=>{
    for(const input of [new Date(NaN),'2026-01-01T00:00','0000-12-31T00:00Z','3000-01-01T00:00Z',
      '2026-02-30T00:00Z','2026-01-01T24:00Z','2026-01-01T00:00+14:01']) assert.throws(()=>C.createCelestialState(input));
    assert.equal(C.createCelestialState(dates[1]).utc,'0050-01-01T12:30:19.000Z');
    for(const p of [{latitude:NaN,longitude:0},{latitude:91,longitude:0},{latitude:0,longitude:181}]) assert.throws(()=>C.createObserverState(C.createCelestialState(dates[3]),p));
  });
  test('right-handed adapters; legacy axis swap remains explicit reflection',()=>{
    assert.deepEqual(R.applyFrame(R.EQUATOR_TO_SCENE,[1,0,0]),[1,0,0]);
    assert.deepEqual(R.applyFrame(R.EQUATOR_TO_SCENE,[0,1,0]),[0,0,-1]);
    assert.deepEqual(R.applyFrame(R.EQUATOR_TO_SCENE,[0,0,1]),[0,1,0]);
    assert.equal(R.dot(R.cross(R.EQUATOR_TO_SCENE[0],R.EQUATOR_TO_SCENE[1]),R.EQUATOR_TO_SCENE[2]),1);
    const legacy=[[1,0,0],[0,1,0],[0,0,1]].map(R.ecefToLegacyWorld);
    assert.equal(R.dot(R.cross(legacy[0],legacy[1]),legacy[2]),-1);
  });
  test('fixed solar azimuth, real declination, upright axis and inverse transforms',()=>{
    for(const date of dates) for(const az of [-179,-90,0,179]) {
      const state=C.createCelestialState(date), f=R.createEarthSceneFrame(state,az);
      assert.ok(Math.abs(R.wrapDegrees(Math.atan2(f.sunDirectionScene[0],f.sunDirectionScene[2])/R.DEG-az))<1e-9);
      assert.ok(Math.abs(f.sunDirectionScene[1]-R.unit(R.applyFrame(state.eqjToEqd,state.sunEqjKm))[2])<1e-12);
      assert.ok(R.angleDegrees(R.applyFrame(f.ecefToScene,[0,0,1]),[0,1,0])<1e-9);
      for(const v of [[1,0,0],[0,1,0],[0,0,1]]) assert.ok(R.angleDegrees(R.applyFrame(R.inverseFrame(f.eqjToScene),R.applyFrame(f.eqjToScene,v)),v)<1e-9);
    }
    assert.ok(R.createEarthSceneFrame(C.createCelestialState(dates[4])).sunDeclinationDeg>23);
    assert.ok(R.createEarthSceneFrame(C.createCelestialState(dates[5])).sunDeclinationDeg< -23);
    assert.throws(()=>R.createEarthSceneFrame(C.createCelestialState(dates[3]),NaN));
  });
  test('ECEF orientation agrees with independent observer-vector API',()=>{
    for(const date of dates) for(const [lat,lon] of [[0,0],[0,90],[90,0]]) {
      const s=C.createCelestialState(date), v=Astronomy.ObserverVector(s.time,new Astronomy.Observer(lat,lon,0),false);
      assert.ok(R.angleDegrees(R.applyFrame(s.ecefToEqj,R.geographicNormal(lat,lon)),[v.x,v.y,v.z])<1e-8);
    }
  });
  test('direct local stars equal globe→observer route, including poles and ancient dates',()=>{
    for(const date of dates) for(const p of locations) {
      const s=C.createCelestialState(date), o=C.createObserverState(s,p), f=R.createEarthSceneFrame(s);
      const a=S.createSkyFrame(catalog,s.date,p,true,s), b=S.createWorldSkyFrame(catalog,s,o,f,true);
      for(const hip of [11767,32349,91262,69673,65474,30343]) {
        const i=a.hipIndex.get(hip), g=Array.from(b.positions.slice(i*3,i*3+3));
        const local=R.applyFrame(o.eqjToSky,R.applyFrame(R.inverseFrame(f.eqjToScene),g));
        const error=R.angleDegrees(local,Array.from(a.positions.slice(i*3,i*3+3)));
        maxRoundtrip=Math.max(maxRoundtrip,error); assert.ok(error<.0001,`${date} HIP ${hip}: ${error}`);
      }
      assert.ok(Number.isFinite(o.sun.altitudeDeg)&&Number.isFinite(o.moon.altitudeDeg));
      assert.ok(o.moon.angularRadiusDeg>.20&&o.moon.angularRadiusDeg<.35);
      maxParallax=Math.max(maxParallax,R.angleDegrees(o.moon.directionEqj,s.moonEqjKm));
    }
    assert.ok(maxParallax>.5,'must retain observer translation and lunar parallax');
  });
  test('observer changes leave global light/Moon untouched and alter local sky',()=>{
    const s=C.createCelestialState(dates[4]), before=JSON.stringify(s);
    const a=C.createObserverState(s,locations[0]), b=C.createObserverState(s,locations[1]);
    assert.equal(JSON.stringify(s),before); assert.ok(R.angleDegrees(a.moon.direction,b.moon.direction)>10);
    assert.ok(R.angleDegrees(a.moon.directionEqj,b.moon.directionEqj)>.01);
  });
  test('all lunar quarters: unit lighting matches observer phase fraction',()=>{
    for(const angle of [0,90,180,270]) {
      const t=Astronomy.SearchMoonPhase(angle,new Date('2026-01-01T00:00Z'),40); assert.ok(t);
      for(const p of locations) {
        const o=C.createObserverState(C.createCelestialState(t.date),p);
        assert.ok(Math.abs(Math.hypot(...o.portraitLight)-1)<1e-9);
        assert.ok(Math.abs((1+o.portraitLight[2])/2-o.phaseFraction)<1e-12);
        if(angle===0) assert.ok(o.phaseFraction<.005);
        if(angle===180) assert.ok(o.phaseFraction>.995);
      }
    }
    assert.equal(R.horizonCoordinates([0,1,0]).azimuthDeg,null); assert.throws(()=>R.unit([0,0,0]));
  });
  console.log(JSON.stringify({checks,maxRoundtripDeg:maxRoundtrip,maxObservedParallaxDeg:maxParallax}));
} finally { await vite.close(); await rm(cacheDir,{recursive:true,force:true}); }
