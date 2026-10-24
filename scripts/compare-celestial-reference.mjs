import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const reference=JSON.parse(await readFile('reference/sky/celestial-validation.json','utf8'));
for(const response of reference.responses) assert.equal(createHash('sha256').update(await readFile('reference/sky/'+response.file)).digest('hex'),response.sha256);
const cacheDir=await mkdtemp(join(tmpdir(),'lubirth-external-'));
const vite=await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
  const C=await vite.ssrLoadModule('/src/astro/celestialState.ts'),R=await vite.ssrLoadModule('/src/astro/referenceFrames.ts');
  const cases=[];
  for(const sample of reference.cases) {
    const actual=C.createCelestialState(sample.utc), frame=R.createEarthSceneFrame(actual);
    for(const body of ['sun','moon']) {
      const vector=actual[body+'EqjKm'], expected=sample[body+'EqjKm'];
      const separationDeg=R.angleDegrees(vector,expected),distanceRelativeError=Math.abs(Math.hypot(...vector)/Math.hypot(...expected)-1);
      assert.ok(separationDeg<.5,`${sample.utc} ${body}: ${separationDeg}°`);
      const solarDeclinationErrorDeg=body==='sun'?Math.abs(frame.sunDeclinationDeg-Math.asin(R.unit(R.applyFrame(actual.eqjToEqd,expected))[2])/R.DEG):null;
      if(solarDeclinationErrorDeg!==null) assert.ok(solarDeclinationErrorDeg<.5);
      const observerErrors=[{latitude:31.2304,longitude:121.4737},{latitude:-33.8688,longitude:151.2093},{latitude:0,longitude:0}].map(location=>{
        const observer=C.createObserverState(actual,location);
        const independentDirection=R.applyFrame(observer.eqjToSky,R.subtract(expected,observer.positionEqjKm));
        const error=R.angleDegrees(independentDirection,observer[body].direction);
        assert.ok(error<.5); return error;
      });
      cases.push({utc:sample.utc,body,separationDeg,distanceRelativeError,solarDeclinationErrorDeg,observerErrors});
    }
  }
  console.log(JSON.stringify({source:reference.source,signatures:reference.responses.map(v=>v.signature),sampleCount:cases.length,
    maxAngularErrorDeg:Math.max(...cases.map(v=>v.separationDeg)),
    maxObserverErrorDeg:Math.max(...cases.flatMap(v=>v.observerErrors)),cases},null,2));
} finally { await vite.close();await rm(cacheDir,{recursive:true,force:true}); }
