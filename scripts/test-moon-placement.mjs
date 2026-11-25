import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SphereGeometry } from 'three';
import { createServer } from 'vite';
const reference = JSON.parse(await readFile(new URL('../reference/sky/lunar-orientation.json', import.meta.url)));
const cacheDir=await mkdtemp(join(tmpdir(),'lubirth-moon-'));
const vite=await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
let checks=0; const test=(name,run)=>{run();checks++;console.log('PASS '+name);};
try {
  const C=await vite.ssrLoadModule('/src/astro/celestialState.ts'), R=await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const { projectLunarSurface } = await vite.ssrLoadModule('/src/astro/lunarOrientation.ts');
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

  const orientationErrors = [];
  function verifyLunarFace([utc, expectedLon, expectedLat, expectedPoleAngle], location) {
    const state = C.createCelestialState(utc);
    const observer = location && C.createObserverState(state, location);
    const direction = observer ? observer.moon.directionEqj : R.unit(state.moonEqjKm);
    const [x,y,z] = R.applyFrame(R.inverseFrame(state.moonBodyToEqj), R.scale(direction, -1));
    const longitude = Math.atan2(y, x) / R.DEG;
    const latitude = Math.asin(z) / R.DEG;
    const celestialFrame = observer ? state.eqjToEqd : R.IDENTITY_FRAME;
    const skyDirection = R.applyFrame(celestialFrame, direction);
    const pole = R.applyFrame(celestialFrame, state.moonBodyToEqj[2]);
    const east = R.unit(R.cross([0, 0, 1], skyDirection));
    const north = R.cross(skyDirection, east);
    const poleAngle = Math.atan2(R.dot(pole, east), R.dot(pole, north)) / R.DEG;
    const errors = [Math.abs(R.wrapDegrees(longitude - expectedLon)), Math.abs(latitude - expectedLat),
      Math.abs(R.wrapDegrees(poleAngle - expectedPoleAngle))];
    assert.ok(Math.max(...errors) < .01, JSON.stringify({ utc, location, longitude, latitude, poleAngle, errors }));
    orientationErrors.push(...errors);
  }
  test('lunar longitude, latitude and pole angle agree with NASA SVS and JPL Horizons', () => {
    reference.nasaSvs.rows.forEach(row => verifyLunarFace(row));
    reference.horizons.sites.forEach(site => site.rows.forEach(row => verifyLunarFace(row, site.location)));
  });
  test('Earth, sky and portrait frames keep lunar surface axes right-handed', () => {
    const observer = C.createObserverState(s, {latitude: 25.033, longitude: 121.5654});
    const [prime, east, north] = s.moonBodyToEqj;
    for (const projection of [f.eqjToScene, observer.eqjToSky, observer.eqjToMoonPortrait]) {
      const [x, y, z] = projectLunarSurface(s.moonBodyToEqj, projection);
      assert.ok(R.angleDegrees(x, R.applyFrame(projection, prime)) < 1e-10);
      assert.ok(R.angleDegrees(y, R.applyFrame(projection, north)) < 1e-10);
      assert.ok(R.angleDegrees(z, R.applyFrame(projection, R.scale(east, -1))) < 1e-10);
      assert.ok(R.angleDegrees(R.cross(x, y), z) < 1e-10);
    }
  });
  const sphere = new SphereGeometry(1, 64, 64);
  const spherePositions = sphere.getAttribute('position'), sphereUv = sphere.getAttribute('uv');
  const glb = await readFile(new URL('../public/models/nasa-moon-topo-128.glb', import.meta.url));
  const binHeader = 20 + glb.readUInt32LE(12);
  const document = JSON.parse(glb.toString('utf8', 20, binHeader));
  const attributes = document.meshes[0].primitives[0].attributes;
  const glbAttribute = (name, stride) => {
    const accessor = document.accessors[attributes[name]], view = document.bufferViews[accessor.bufferView];
    const start = binHeader + 8 + view.byteOffset + (accessor.byteOffset ?? 0);
    return { count: accessor.count, get: (index, component) => glb.readFloatLE(start + (index * stride + component) * 4) };
  };
  function checkMap(uv, position, northV) {
    for (const [u, v, axis] of [[.5, .5, [1, 0, 0]], [.75, .5, [0, 0, -1]], [.5, northV, [0, 1, 0]]]) {
      let found = false;
      for (let index = 0; index < uv.count; index++) {
        if (Math.abs(uv.get(index, 0) - u) > 1 / 64 || uv.get(index, 1) !== v) continue;
        const vertex = [0,1,2].map(component => position.get(index, component));
        if (R.angleDegrees(vertex, axis) < 1e-4) { found = true; break; }
      }
      assert.ok(found, JSON.stringify({ u, v, axis }));
    }
  }
  test('sphere and NASA terrain share the same surface axes', () => {
    const attribute = a => ({ count: a.count, get: (index, component) => a.array[index * a.itemSize + component] });
    checkMap(attribute(sphereUv), attribute(spherePositions), 1);
    checkMap(glbAttribute('TEXCOORD_0', 2), glbAttribute('POSITION', 3), 0);
  });
  sphere.dispose();
  console.log(JSON.stringify({checks, maxOrientationErrorDeg: Math.max(...orientationErrors)}));
}finally{await vite.close();await rm(cacheDir,{recursive:true,force:true});}
