import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=fileURLToPath(new URL('..',import.meta.url));
const source=await readFile(root+'/src/spikes/sky/skyLabelLayout.ts','utf8');
const [silhouetteSource,manifestSource]=await Promise.all([
  readFile(root+'/src/spikes/sky/data/chinese-art/silhouettes.json','utf8'),
  readFile(root+'/src/spikes/sky/data/chinese-art/manifest.json','utf8'),
]);
const javascript=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}}).outputText;
const {layoutSkyLabels,overlapsFigure,rectsOverlap}=await import('data:text/javascript;base64,'+Buffer.from(javascript).toString('base64'));
const results=[];
function test(name,run){run();results.push(name);console.log('PASS',name);}
const polygon=[[100,100],[200,50],[300,100],[200,300]];
test('Rotated drawing envelopes protect the silhouette while retaining empty corner sky',()=>{
  assert.equal(overlapsFigure({x:95,y:250,w:30,h:25},polygon,0),false);
  assert.equal(overlapsFigure({x:185,y:140,w:30,h:25},polygon,0),true);
  assert.equal(overlapsFigure({x:200,y:292,w:30,h:25},polygon,6),true);
});
test('A caption moves away from its own artwork and a footer without entering another drawing',()=>{
  const figures=[[[120,80],[280,100],[250,300],[100,260]],[[325,170],[390,180],[390,310],[325,300]]];
  const labels=figures.map((figure,i)=>({id:String(i),anchor:i?[355,320]:[180,280],w:62,h:44,priority:i?50:100,figure}));
  const ui=[{x:0,y:355,w:500,h:45}];
  const placed=layoutSkyLabels(labels,{width:500,height:400},ui,8);
  assert.ok(placed.has('0'));
  for(const r of placed.values()){
    assert.ok(!ui.some(o=>rectsOverlap(r,o,10)));
    assert.ok(!figures.some(p=>overlapsFigure(r,p)));
    assert.ok(r.x>=12&&r.y>=16&&r.x+r.w<=488&&r.y+r.h<=384);
  }
});
test('Selected captions win the label budget and all visible touch targets remain disjoint',()=>{
  const labels=Array.from({length:10},(_,i)=>({id:String(i),anchor:[55+i*70,160],w:52,h:44,priority:i===7?100:50}));
  const placed=layoutSkyLabels(labels,{width:800,height:400},[],1);
  assert.deepEqual([...placed.keys()],['7']);
  const all=[...layoutSkyLabels(labels,{width:800,height:400},[],10).values()];
  for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)assert.ok(!rectsOverlap(all[i],all[j],8));
});
test('Small camera changes retain a valid caption side instead of jumping between positions',()=>{
  const figure=[[130,100],[230,100],[230,250],[130,250]];
  const before=new Map([['a',{x:242,y:153,w:52,h:44,slot:'right'}]]);
  const placement=layoutSkyLabels([{id:'a',anchor:[180,270],w:52,h:44,priority:100,figure}],{width:500,height:400},[],4,before).get('a');
  assert.equal(placement.slot,'right');
});
test('Portrait Moon resizing relocates a nearby mansion caption without moving its sky anchor',()=>{
  const label={id:'kui',anchor:[320,232],w:60,h:44,priority:100,
    figure:[[220,70],[365,100],[340,220],[220,200]]};
  const viewport={width:390,height:844};
  const original=layoutSkyLabels([label],viewport,[],6).get('kui');
  assert.ok(original);
  for(const scale of [.6,1,1.5]){
    const r=40*scale,moon={x:390*.82-r,y:844*.28-r,w:r*2,h:r*2};
    const placed=layoutSkyLabels([label],viewport,[moon],6,new Map([['kui',original]])).get('kui');
    assert.ok(placed,'Mansion caption still has room below the Moon at '+scale+'x');
    assert.ok(!rectsOverlap(placed,moon,10));
    assert.ok(!overlapsFigure(placed,label.figure));
    assert.ok(Math.hypot(placed.x+placed.w/2-label.anchor[0],placed.y+placed.h/2-label.anchor[1])<=170);
    const restored=layoutSkyLabels([label],viewport,[],6,new Map([['kui',placed]])).get('kui');
    assert.deepEqual(restored,original,'Removing the portrait obstruction releases its label space');
  }
});
test('Captions disappear when the viewport offers no honest space; cardinal directions do not consume the artwork budget',()=>{
  const label={id:'a',anchor:[180,270],w:52,h:44,priority:100,figure:polygon};
  assert.equal(layoutSkyLabels([label],{width:390,height:400},[{x:0,y:0,w:390,h:400}],5).size,0);
  const labels=[{...label,figure:undefined,anchor:[80,140]},{id:'north',anchor:[280,140],w:40,h:28,priority:0,cardinal:true}];
  assert.equal(layoutSkyLabels(labels,{width:390,height:400},[],1).size,2);
});
test('All 28 silhouette envelopes are convex, source-matched and stay within their original raster',()=>{
  const silhouettes=JSON.parse(silhouetteSource),manifest=JSON.parse(manifestSource);
  assert.equal(silhouettes.entries.length,28);
  for(const e of silhouettes.entries){
    const asset=manifest.entries.find(a=>a.cultureId===e.cultureId);assert.equal(e.sourceSha256,asset.skyVariant.sha256);
    assert.ok(e.hull.length>=3);
    assert.ok(e.hull.every(p=>p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1)));
    for(let i=0;i<e.hull.length;i++){
      const [a,b,c]=[0,1,2].map(j=>e.hull[(i+j)%e.hull.length]);
      assert.ok((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0])>=-1e-6);
    }
  }
});
await mkdir(root+'/output/yuhuang-layout-20261023',{recursive:true});
await writeFile(root+'/output/yuhuang-layout-20261023/label-checks.json',JSON.stringify({checks:results.length,results},null,2)+'\n');
