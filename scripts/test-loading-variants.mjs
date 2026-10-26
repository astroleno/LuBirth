import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const tests=[];
const test=async(name,run)=>{await run();tests.push(name);console.log('PASS '+name);};
try{
  const {LOADING_VARIANTS,takeLoadingVariant,chooseLoadingVariant,LOADING_BAG_KEY}=await server.ssrLoadModule('/src/keepsake/loadingVariants.ts');
  const {inkCanvasSize}=await server.ssrLoadModule('/src/components/keepsake/inkHandwriting.ts');
  await test('Five real handwriting styles cover all three phrases with offline glyph/index pairs',async()=>{
    assert.equal(LOADING_VARIANTS.length,15);assert.equal(new Set(LOADING_VARIANTS.map(v=>v.styleId)).size,5);
    const images=new Map();
    for(const variant of LOADING_VARIANTS){
      assert.equal(variant.characters,[...variant.text].length);assert.ok(variant.width>0&&variant.height>0);
      for(const path of [variant.glyph,variant.index]){
        assert.ok(path.startsWith('keepsake/loading/v2/')&&!path.includes('..'));
        const svg=await readFile('public/'+path,'utf8');
        assert.ok(svg.includes(`viewBox="0 0 ${variant.width} ${variant.height}"`));
        assert.equal((svg.match(/data-glyph-index=/g)||[]).length,variant.characters);
        assert.ok(!/<(?:text|script|foreignObject)[\s>]/.test(svg));
        assert.ok(!/href="https?:/.test(svg),'Opening SVGs must not fetch external fonts or pictures');
        if(path===variant.glyph){assert.equal((svg.match(/<image /g)||[]).length,variant.styleId==='inko-no012'?variant.characters:0);images.set(variant.id,svg);}
        else assert.equal((svg.match(/<filter /g)||[]).length,variant.characters);
      }
    }
    for(const template of ['first-meeting','earth-and-you','same-moon']){
      const group=LOADING_VARIANTS.filter(v=>v.templateId===template);
      assert.equal(group.length,5);assert.equal(new Set(group.map(v=>images.get(v.id))).size,5);
    }
    const sources=JSON.parse(await readFile('public/keepsake/loading/v2/font-sources.json','utf8'));
    assert.equal(sources.fonts.length,4);
    for(const source of sources.fonts){assert.match(source.sha256,/^[0-9a-f]{64}$/);assert.ok(source.url.includes(sources.revision));assert.ok(source.license.includes('SIL OPEN FONT LICENSE'));}
  });
  await test('Each shuffle cycle visits all fifteen combinations and consecutive exact repeats are avoided',()=>{
    let state,previous;let seed=123456;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
    for(let cycle=0;cycle<10;cycle++){
      const visited=[];
      for(let index=0;index<15;index++){
        const next=takeLoadingVariant(state,random);
        if(previous)assert.notEqual(next.variant.id,previous.id);
        visited.push(next.variant.id);previous=next.variant;state=next.bag;
      }
      assert.equal(new Set(visited).size,15);assert.equal(state.remaining.length,0);
    }
    const last=LOADING_VARIANTS[0],candidate=LOADING_VARIANTS.find(v=>v.styleId!==last.styleId&&v.templateId!==last.templateId);
    const next=takeLoadingVariant({last:last.id,remaining:[last.id,candidate.id]},()=>0);
    assert.equal(next.variant.id,candidate.id);
  });
  await test('Damaged or unavailable browser storage never prevents a valid bounded selection',()=>{
    for(const value of [null,{},42,{last:'unknown',remaining:['unknown']},{last:null,remaining:[LOADING_VARIANTS[0].id,LOADING_VARIANTS[0].id]}])assert.ok(LOADING_VARIANTS.includes(takeLoadingVariant(value,()=>NaN).variant));
    const keys=[];const storage={getItem(key){keys.push(key);return '{damaged';},setItem(key,value){keys.push(key);assert.ok(JSON.parse(value).remaining);}};
    assert.ok(LOADING_VARIANTS.includes(chooseLoadingVariant(storage,()=>.3).variant));assert.ok(keys.every(key=>key===LOADING_BAG_KEY));
    const blocked={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
    const selected=chooseLoadingVariant(blocked,()=>1);assert.ok(LOADING_VARIANTS.includes(selected.variant));assert.ok(selected.seed>=0&&selected.seed<65536);
  });
  await test('Ink surfaces stay within the DPR and pixel budget across phones, desktop and resize extremes',()=>{
    for(const [width,height] of [[296,100],[420,140],[390,844],[3840,2160],[0,0],[NaN,Infinity]])for(const dpr of [.5,1,2,3,NaN]){
      const [w,h]=inkCanvasSize(width,height,dpr);assert.ok(w>=1&&h>=1&&w*h<=160000);
      if(width>0&&Number.isFinite(width))assert.ok(w<=Math.max(1,width*1.5));
    }
  });
  console.log(JSON.stringify({suite:'loading-variants',passed:tests.length,failed:0}));
}finally{await server.close();}
