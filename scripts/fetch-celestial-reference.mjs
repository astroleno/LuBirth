// Explicit refresh of the frozen, independent NASA/JPL acceptance reference.
// This is never called by the application or by the offline comparison.
import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const utc = ['0050-01-01T12:30:19Z','1037-01-14T13:04:40Z','2000-01-01T12:00:00Z','2026-03-20T12:00:00Z','2026-06-21T12:00:00Z',
  '2026-09-22T12:00:00Z','2026-10-24T12:00:00Z','2026-12-21T12:00:00Z'];
const common = { format:'json', EPHEM_TYPE:'VECTORS', CENTER:'500@399', REF_PLANE:'FRAME', REF_SYSTEM:'ICRF',
  OUT_UNITS:'KM-S', VEC_TABLE:'2', VEC_CORR:'LT', TIME_TYPE:'UT', CAL_TYPE:'GREGORIAN', CSV_FORMAT:'YES',
  TLIST_TYPE:'JD', TLIST:utc.map(t=>new Date(t).getTime()/86400000+2440587.5).join('\n') };
const reference = { retrievedAt:new Date().toISOString(), source:'NASA/JPL Horizons',
  documentation:'https://ssd-api.jpl.nasa.gov/doc/horizons.html', endpoint:'https://ssd.jpl.nasa.gov/api/horizons.api',
  options:common, observer:'Earth geocenter (500@399); local observer derived only in the comparison',
  convention:'ICRF/EQJ, km, light-time only; no stellar aberration or refraction. UT input; proleptic Gregorian.',
  cases:utc.map(utc=>({utc})), responses:[] };
await mkdir('reference/sky',{recursive:true});
for(const [body,command] of [['sun','10'],['moon','301']]) {
  const params=new URLSearchParams(Object.fromEntries(Object.entries({...common,COMMAND:command}).map(([k,v])=>[k,k==='format'?v:`'${v}'`])));
  const response=await fetch(reference.endpoint+'?'+params,{signal:AbortSignal.timeout(60000)});
  if(!response.ok) throw Error('Horizons HTTP '+response.status);
  const raw=await response.text(), json=JSON.parse(raw);
  if(json.error || !json.result?.includes('$$SOE')) throw Error(json.error||json.result||'Missing Horizons vectors');
  const rows=json.result.split('$$SOE')[1].split('$$EOE')[0].trim().split('\n').map(line=>line.split(',').map(v=>v.trim()));
  if(rows.length!==utc.length) throw Error('Unexpected reference sample count');
  rows.forEach((row,i)=>{
    const jd=Number(row[0]), expected=new Date(utc[i]).getTime()/86400000+2440587.5;
    const vector=row.slice(2,5).map(Number);
    if(Math.abs(jd-expected)>1e-8 || vector.some(v=>!Number.isFinite(v))) throw Error('Reference parse error');
    reference.cases[i][body+'EqjKm']=vector;
  });
  const file=`celestial-horizons-${body}.json`;
  await writeFile('reference/sky/'+file,raw+'\n');
  reference.responses.push({body,command,file,signature:json.signature,sha256:createHash('sha256').update(raw+'\n').digest('hex')});
}
await writeFile('reference/sky/celestial-validation.json',JSON.stringify(reference,null,2)+'\n');
console.log(`Frozen ${reference.cases.length*2} independent JPL vectors.`);
