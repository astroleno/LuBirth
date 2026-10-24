import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = async path => JSON.parse(await readFile(root + '/' + path, 'utf8'));
const catalog = await read('src/spikes/sky/data/catalog.json');
const manifest = await read('src/spikes/sky/data/chinese-art/manifest.json');
const placements = await read('reference/sky/yuhuang-temple/placements.json');
const original = await read('reference/sky/yuhuang-temple/placement-baseline.json');
const vite = await createServer({ configFile: false, root, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const results = [], facts = [];
const dot = (a,b) => a.reduce((s,n,i) => s+n*b[i],0);
const difference = (a,b) => 2*Math.asin(Math.min(1,Math.hypot(...a.map((n,i)=>n-b[i]))/2))*180/Math.PI;
function test(name, run) { run(); results.push(name); console.log('PASS', name); }
try {
  const { registerChineseFigure } = await vite.ssrLoadModule('/src/spikes/sky/chineseArtPlacement.ts');
  const { createSkyFrame, illustrationDirection, starDirection } = await vite.ssrLoadModule('/src/spikes/sky/skyModel.ts');
  test('28 distinct authored placements, ordered as four groups of seven, retain all 56 original asset hashes', () => {
    assert.deepEqual(placements.entries.map(p=>p.number), Array.from({length:28},(_,i)=>i+1));
    assert.deepEqual(manifest.entries.map(e=>e.name), '角亢氐房心尾箕斗牛女虚危室壁奎娄胃昴毕觜参井鬼柳星张翼轸'.split('').map(n=>n+'宿'));
    for(const e of manifest.entries){const before=original.entries.find(p=>p.number===e.number);assert.equal(e.sha256,before.sha256);assert.equal(e.skyVariant.sha256,before.skyVariant.sha256);}
    for(const group of ['dragon','tortoise','tiger','bird']) assert.equal(manifest.entries.filter(e=>e.group===group).length,7);
  });
  test('Every entry rebuilds reproducibly from its own two member/figure correspondences', () => {
    for(const e of manifest.entries){
      const item=catalog.culture.find(i=>i.id===e.cultureId), authored=placements.entries.find(p=>p.number===e.number);
      const rebuilt=registerChineseFigure(catalog,item,e.image.file,e.image.size,authored);
      assert.deepEqual(rebuilt.image,e.image);assert.deepEqual(rebuilt.calibration,e.placement);
      for(const c of authored.controls) assert.ok(item.lines.flat().includes(c.hip));
      const third=e.placement.thirdControl;
      assert.equal(third.role,item.lines.flat().includes(third.hip)?'asterism-member':'projection-helper');
      assert.ok(Math.abs(e.placement.rotationDeg)<60,'excessive roll: '+e.title);
      assert.ok(e.authoredAngularWidth>2 && e.authoredAngularWidth<24,'unexpected span: '+e.title);
    }
    const e=manifest.entries[0], item=catalog.culture.find(i=>i.id===e.cultureId);
    assert.throws(()=>registerChineseFigure(catalog,item,e.image.file,e.image.size,{...placements.entries[0],controls:[{hip:1,uv:[.5,.2],feature:'invalid'},placements.entries[0].controls[1]]}));
    assert.throws(()=>registerChineseFigure(catalog,item,e.image.file,e.image.size,{...placements.entries[0],controls:[placements.entries[0].controls[0],placements.entries[0].controls[0]]}));
  });
  let maxControlError=0, maxRasterPairError=0;
  test('Both authored landmarks remain attached across four epochs/locations, including the RA wrap and southern hemisphere', () => {
    for(const [date,latitude,longitude] of [['2026-07-21T14:00Z',31.2304,121.4737],['2026-10-21T13:00Z',31.2304,121.4737],['2000-01-01T12:00Z',70,0],['1052-06-21T14:00Z',-33.87,151.21]]){
      const frame=createSkyFrame(catalog,new Date(date),{latitude,longitude});
      for(const e of manifest.entries){
        for(const image of [e.image,e.skyImage]) for(const c of e.placement.controls){
          const actual=illustrationDirection(image,frame,c.uv[0]*image.size[0],c.uv[1]*image.size[1]);
          const i=frame.hipIndex.get(c.hip), expected=Array.from(frame.positions.slice(i*3,i*3+3));
          const error=difference(actual,expected);maxControlError=Math.max(maxControlError,error);assert.ok(error<.00001,e.title+' landmark');
        }
        for(const uv of [[0,0],[1,0],[0,1],[1,1],[.5,.5]]){
          const p=illustrationDirection(e.image,frame,uv[0]*e.image.size[0],uv[1]*e.image.size[1]);
          const q=illustrationDirection(e.skyImage,frame,uv[0]*e.skyImage.size[0],uv[1]*e.skyImage.size[1]);
          const error=difference(p,q);maxRasterPairError=Math.max(maxRasterPairError,error);assert.ok(error<.035,e.title+' raster rounding');
        }
      }
    }
  });
  let maxAspectError=0, maxMemberError=0;
  test('The full plane preserves handedness, perpendicular axes and uniform scale; all member projections agree at J2000', () => {
    const frame=createSkyFrame(catalog,new Date('2000-01-01T12:00Z'),{latitude:0,longitude:0},false);
    for(const e of manifest.entries){
      const controls=e.placement.controls.map(c=>starDirection(catalog.stars.find(s=>s[1]===c.hip),0,false));
      const sum=controls[0].map((n,i)=>n+controls[1][i]),center=sum.map(n=>n/Math.hypot(...sum));
      const toWorld=p=>[0,1,2].map(k=>p.reduce((s,n,j)=>s+n*frame.eqjBasis[j][k],0));
      const centerWorld=toWorld(center), east=[-center[1],center[0],0];const len=Math.hypot(...east);east.forEach((n,i)=>east[i]=n/len);
      const north=[center[1]*east[2]-center[2]*east[1],center[2]*east[0]-center[0]*east[2],center[0]*east[1]-center[1]*east[0]];
      const eWorld=toWorld(east),nWorld=toWorld(north);
      const project=(x,y)=>{const p=illustrationDirection(e.image,frame,x,y),d=dot(p,centerWorld);return [-dot(p,eWorld)/d,-dot(p,nWorld)/d];};
      const [w,h]=e.image.size,p=project(w*.5,h*.5),x=project(w*.5+100,h*.5).map((n,i)=>n-p[i]),y=project(w*.5,h*.5+100).map((n,i)=>n-p[i]);
      const lx=Math.hypot(...x),ly=Math.hypot(...y),err=Math.abs(lx/ly-1);maxAspectError=Math.max(maxAspectError,err);
      assert.ok(err<.0001,e.title+' aspect');assert.ok(Math.abs(dot(x,y)/lx/ly)<.0001,e.title+' shear');assert.ok(x[0]*y[1]-x[1]*y[0]>0,e.title+' mirrored');
      for(const member of e.placement.memberPixels){const p=illustrationDirection(e.image,frame,member.uv[0]*w,member.uv[1]*h);const i=frame.hipIndex.get(member.hip),q=Array.from(frame.positions.slice(i*3,i*3+3));const error=difference(p,q);maxMemberError=Math.max(maxMemberError,error);assert.ok(error<.0001,e.title+' member registration');}
      facts.push({number:e.number,title:e.title,rotationDeg:e.placement.rotationDeg,angularWidthDeg:e.authoredAngularWidth,controls:e.placement.controls,thirdControl:e.placement.thirdControl});
    }
  });
  // Check the actual files as well as equality to the pre-placement manifest.
  for(const e of manifest.entries)for(const [file,expected] of [[e.image.file,e.sha256],[e.skyImage.file,e.skyVariant.sha256]]) assert.equal(createHash('sha256').update(await readFile(root+'/src/spikes/sky/data/'+file)).digest('hex'),expected);
  const report={checks:results.length,results,maxControlErrorDeg:maxControlError,maxRasterPairErrorDeg:maxRasterPairError,maxAspectRatioError:maxAspectError,maxMemberErrorDeg:maxMemberError,placements:facts,limits:['Contemporary figure-to-star correspondences, not historical iconographic verification.','J2000 member-pixel proof; proper motion may change non-control star alignment over centuries.']};
  await mkdir(root+'/output/yuhuang-placement-20261022',{recursive:true});
  await writeFile(root+'/output/yuhuang-placement-20261022/registration-checks.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({checks:results.length,maxControlError,maxRasterPairError,maxAspectError,maxMemberError},null,2));
} finally {await vite.close();}
