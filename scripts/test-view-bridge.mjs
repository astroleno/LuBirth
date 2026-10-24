import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const cacheDir=await mkdtemp(join(tmpdir(),'lubirth-views-'));
const vite=await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
let checks=0; const test=(name,run)=>{run();checks++;console.log('PASS '+name);};
try {
  const O=await vite.ssrLoadModule('/src/history/observation.ts');
  const P=await vite.ssrLoadModule('/src/history/historyObservationPolicy.ts');
  const V=await vite.ssrLoadModule('/src/history/viewBridge.ts');
  const {createJourneyStore}=await vite.ssrLoadModule('/src/history/journeyStore.ts');
  const records=JSON.parse(await readFile('src/history/data/records.json','utf8'));
  const event=records.find(r=>r.kind==='event'), person=records.find(r=>r.kind==='birth');
  const place={name:'演示地点',latitude:0,longitude:121.4737,precision:'user-selected',note:'测试输入'};
  const choose=(record,choice,basis={kind:'local-mean-solar'},observer=place)=>O.historyObservation(record,{...choice,observer,timeBasis:basis,dateAcknowledged:true,placeConfirmed:true});
  const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};};
  test('only date-only events default to 20:00, without changing source records',()=>{
    const before=JSON.stringify(event), initial=P.resolveHistoryChoices(event);
    assert.equal(initial.clock,'20:00');assert.equal(initial.timeSelection.origin,'event-default-20');
    assert.equal(P.resolveHistoryChoices(person).clock,'');assert.equal(JSON.stringify(event),before);
    assert.throws(()=>P.resolveHistoryChoices({...event,time:{precision:'exact'}}));
  });
  test('local mean solar seconds, explicit offsets and cross-day civil date are preserved',()=>{
    const choice=P.resolveHistoryChoices(event);
    const e={...event,date:{...event.date,iso:'2026-10-23'}};
    assert.equal(choose(e,choice).utc,'2026-10-23T11:54:06.000Z');
    assert.equal(choose(e,choice,{kind:'offset',offsetMinutes:480}).utc,'2026-10-23T12:00:00.000Z');
    const west=choose(e,choice,{kind:'offset',offsetMinutes:-300});
    assert.equal(west.utc,'2026-10-24T01:00:00.000Z');assert.equal(west.civilDate,'2026-10-23');
    assert.equal(west.timeSelection.origin,'event-default-20');
  });
  test('manual editing/clearing/restoring default has explicit provenance',()=>{
    const manual=P.resolveHistoryChoices(event,{clock:'21:30'});
    assert.equal(manual.clock,'21:30');assert.equal(manual.timeSelection.origin,'user-input');
    assert.equal(P.resolveHistoryChoices(event,{clock:'20:00'}).timeSelection.origin,'user-input');
    assert.equal(P.resolveHistoryChoices(event,{clock:'20:00',useDefault:true}).timeSelection.origin,'event-default-20');
    assert.throws(()=>choose(event,P.resolveHistoryChoices(event,{clock:''})));
    assert.throws(()=>P.resolveHistoryChoices(person,{clock:'20:00',useDefault:true}));
    assert.throws(()=>P.resolveHistoryChoices(event,{clock:'21:00',useDefault:true}));
  });
  test('default clock never bypasses place/date gates or valid time basis',()=>{
    const c={...P.resolveHistoryChoices(event),observer:place,timeBasis:{kind:'offset',offsetMinutes:480},dateAcknowledged:true,placeConfirmed:true};
    for(const invalid of [{observer:null},{dateAcknowledged:false},{placeConfirmed:false},{timeBasis:{kind:'offset',offsetMinutes:900}}]) assert.throws(()=>O.historyObservation(event,{...c,...invalid}));
  });
  test('old 20:00 stays legacy-demo; new source kinds and default provenance are validated',()=>{
    const value=choose(event,P.resolveHistoryChoices(event));
    const old=JSON.parse(JSON.stringify(value));delete old.timeSelection;delete old.source.recordKind;
    assert.equal(O.readObservation(old).timeSelection.origin,'legacy-demo');assert.equal(O.readObservation(old).utc,value.utc);
    assert.equal(O.readObservation({...value,clock:'21:00'}),null);
    assert.equal(O.readObservation({...value,source:{...value.source,recordKind:'birth'}}),null);
  });
  test('portrait is default, physical persists, bad Moon preference retains other preferences',()=>{
    const session=memory(), preferences=memory(), store=createJourneyStore({session,preferences});
    assert.equal(store.getSnapshot().moonPlacement,'portrait');
    store.setCulture('yuan');store.toggleFavorite(event.id);store.setMoonPlacement('physical');
    assert.equal(createJourneyStore({session,preferences}).getSnapshot().moonPlacement,'physical');
    preferences.setItem('lubirth.history-preferences.v1',JSON.stringify({culture:'yuan',favorites:[event.id],moonPlacement:'invalid'}));
    const restored=createJourneyStore({session,preferences}).getSnapshot();
    assert.equal(restored.moonPlacement,'portrait');assert.equal(restored.culture,'yuan');assert.deepEqual(restored.favorites,[event.id]);
  });
  test('history return and target transfers preserve personal state and Moon preference',()=>{
    const store=createJourneyStore(), before=store.getSnapshot().current;
    store.setMoonPlacement('physical');store.enterHistory(choose(event,P.resolveHistoryChoices(event)));
    const transfer=V.createViewTransfer(store.getSnapshot().current,'locate-target','body:moon');
    assert.equal(transfer.observationKey,V.observationKey(store.getSnapshot().current));
    store.returnToPersonal();assert.equal(store.getSnapshot().current.utc,before.utc);assert.equal(store.getSnapshot().moonPlacement,'physical');
    assert.deepEqual(V.directionToSkyView([1,0,0],85),{azimuth:90,altitude:0,fov:85});
    assert.throws(()=>V.directionToSkyView([0,0,0]));assert.throws(()=>V.createViewTransfer(before,'locate-target'));
  });
  console.log(JSON.stringify({checks}));
}finally{await vite.close();await rm(cacheDir,{recursive:true,force:true});}
