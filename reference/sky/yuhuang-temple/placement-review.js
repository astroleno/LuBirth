import { createSkyFrame, cultureCenter, illustrationDirection } from '../../../src/spikes/sky/skyModel.ts';

const base = '../../../';
const [catalog, current, previous, pass1, pass2] = await Promise.all([
  fetch(base + 'src/spikes/sky/data/catalog.json').then(r => r.json()),
  fetch(base + 'src/spikes/sky/data/chinese-art/manifest.json').then(r => r.json()),
  // An unavailable optional baseline may be served as Vite's HTML fallback.
  // Keep current placements usable instead of failing the entire review page.
  fetch('./placement-baseline.json').then(r => r.ok ? r.json().catch(() => null) : null).catch(() => null),
  fetch('./placement-pass-1.json').then(r => r.ok ? r.json().catch(() => null) : null).catch(() => null),
  fetch('./placement-pass-2.json').then(r => r.ok ? r.json().catch(() => null) : null).catch(() => null),
]);
const frame = createSkyFrame(catalog, new Date('2000-01-01T12:00Z'), { latitude: 0, longitude: 0 }, false);
const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
const select = document.querySelector('#figure'), status = document.querySelector('#status');
let group = 'dragon', version = 0;
const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);
const unit = v => { const norm = Math.hypot(...v); return v.map(n => n / norm); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vector = hip => { const i = frame.hipIndex.get(hip); return Array.from(frame.positions.slice(i * 3, i * 3 + 3)); };
const images = new Map();
function loadImage(file) {
  if (!images.has(file)) images.set(file, new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = base + 'src/spikes/sky/data/' + file;
  }));
  return images.get(file);
}
function triangle(img, src, dst) {
  const [a, b, c] = src, [p, q, r] = dst;
  const d = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
  if (Math.abs(d) < 1e-9) return;
  const solve = k => [((q[k] - p[k]) * (c[1] - a[1]) - (r[k] - p[k]) * (b[1] - a[1])) / d,
    ((r[k] - p[k]) * (b[0] - a[0]) - (q[k] - p[k]) * (c[0] - a[0])) / d];
  const [ax, bx] = solve(0), [ay, by] = solve(1);
  ctx.save();ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.lineTo(...r);ctx.closePath();ctx.clip();
  ctx.setTransform(ax, ay, bx, by, p[0] - ax * a[0] - bx * a[1], p[1] - ay * a[0] - by * a[1]);
  ctx.drawImage(img, 0, 0);ctx.restore();
}
function drawArtwork(entry, img, project) {
  const image = document.querySelector('#variant').value === 'line' ? entry.skyImage : entry.image;
  const grid = 16;
  ctx.globalAlpha = document.querySelector('#variant').value === 'line' ? .75 : .83;
  for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) {
    const source = [[x,y],[x+1,y],[x+1,y+1],[x,y+1]].map(([u,v]) => [u/grid*image.size[0],v/grid*image.size[1]]);
    const dest = source.map(([px,py]) => project(illustrationDirection(image,frame,px,py)));
    for (const ids of [[0,1,2],[0,2,3]]) triangle(img,ids.map(i=>source[i]),ids.map(i=>dest[i]));
  }
  ctx.globalAlpha = 1;
}
function options() {
  select.replaceChildren(new Option('同看七宿','all'), ...current.entries.filter(e=>e.group===group).map(e=>new Option(e.title,String(e.number))));
}
function landmarkSheet(entries, bitmaps) {
  canvas.height=1120;
  ctx.fillStyle='#080e17';ctx.fillRect(0,0,canvas.width,canvas.height);
  entries.forEach((e,i)=>{
    const currentEntry=current.entries.find(p=>p.number===e.number),image=bitmaps[i];
    const x=i%4*330,y=Math.floor(i/4)*560;
    const scale=Math.min(275/image.width,410/image.height),w=image.width*scale,h=image.height*scale;
    const ox=x+(330-w)/2,oy=y+52;
    ctx.font='17px "PingFang SC",system-ui';ctx.textAlign='center';ctx.fillStyle='#dfd8c7';ctx.fillText(e.number+' · '+e.title,x+165,y+28);
    ctx.globalAlpha=.9;ctx.drawImage(image,ox,oy,w,h);ctx.globalAlpha=1;
    currentEntry.placement.controls.forEach((c,k)=>{
      const p=[ox+c.uv[0]*w,oy+c.uv[1]*h];
      ctx.strokeStyle=k?'#7cc8ed':'#ffbd7e';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.8;
      ctx.beginPath();ctx.arc(...p,6,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(p[0]-9,p[1]);ctx.lineTo(p[0]+9,p[1]);ctx.moveTo(p[0],p[1]-9);ctx.lineTo(p[0],p[1]+9);ctx.stroke();
      ctx.font='13px system-ui';ctx.textAlign='center';ctx.fillText((k?'B':'A')+' '+c.feature+' · HIP '+c.hip,x+165,y+488+k*25);
    });
  });
}
// A diagnostic contact sheet: hold each unmirrored portrait upright, and place
// every real member (not just the two controls) in that portrait's pixel frame.
function memberSheet(entries, bitmaps) {
  const cols=entries.length===1?1:4,cw=canvas.width/cols,ch=540;
  canvas.height=Math.ceil(entries.length/cols)*ch;
  ctx.fillStyle='#080e17';ctx.fillRect(0,0,canvas.width,canvas.height);
  entries.forEach((e,i)=>{
    const x=i%cols*cw,y=Math.floor(i/cols)*ch,img=bitmaps[i],members=e.placement.memberPixels;
    const [iw,ih]=e.image.size,ps=[[0,0],[iw,ih],...members.map(m=>[m.uv[0]*iw,m.uv[1]*ih])];
    const low=[0,1].map(k=>Math.min(...ps.map(p=>p[k]))),high=[0,1].map(k=>Math.max(...ps.map(p=>p[k])));
    const scale=Math.min((cw-52)/(high[0]-low[0]),(ch-110)/(high[1]-low[1]));
    const p=uv=>[x+cw/2+(uv[0]*iw-(low[0]+high[0])/2)*scale,y+ch/2+(uv[1]*ih-(low[1]+high[1])/2)*scale];
    ctx.font='17px "PingFang SC",system-ui';ctx.textAlign='center';ctx.fillStyle='#e4d8bf';ctx.fillText(e.number+' · '+e.title,x+cw/2,y+27);
    const o=p([0,0]);ctx.globalAlpha=.72;ctx.drawImage(img,o[0],o[1],iw*scale,ih*scale);ctx.globalAlpha=1;
    const byHip=new Map(members.map(m=>[m.hip,m.uv])),item=catalog.culture.find(c=>c.id===e.cultureId);
    ctx.strokeStyle='#7ac3f0';ctx.lineWidth=1.5;
    for(const line of item.lines){ctx.beginPath();line.forEach((hip,k)=>{const q=byHip.get(hip);if(!q)return;const a=p(q);k?ctx.lineTo(...a):ctx.moveTo(...a)});ctx.stroke();}
    members.forEach(m=>{const a=p(m.uv);ctx.fillStyle=e.placement.controls.some(c=>c.hip===m.hip)?'#ffc17f':'#d5eaff';ctx.beginPath();ctx.arc(...a,3,0,Math.PI*2);ctx.fill();ctx.font='10px system-ui';ctx.textAlign='left';ctx.fillText(String(m.hip),a[0]+4,a[1]-4)});
    ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillStyle='#91a3b8';ctx.fillText('原图朝向 · 全部 '+members.length+' 个成员',x+cw/2,y+ch-18);
  });
}
async function render() {
  const serial = ++version;
  window.__placementReview={ready:false,serial};
  status.textContent = '正在载入图绘…';
  const landmarks=document.querySelector('#format').value==='landmarks';
  const memberView=document.querySelector('#format').value==='members';
  for(const id of ['placement','neighbors','guides']) document.querySelector('#'+id).disabled=landmarks;
  document.querySelector('#neighbors').disabled=landmarks||memberView;
  const useBefore = !landmarks && document.querySelector('#placement').value === 'before';
  const usePass1 = !landmarks && document.querySelector('#placement').value === 'pass1';
  const usePass2 = !landmarks && document.querySelector('#placement').value === 'pass2';
  if (useBefore && !previous) { status.textContent = '未找到本地旧版记录。'; return; }
  if (usePass1 && !pass1) { status.textContent = '未找到本轮调整前记录。'; return; }
  if (usePass2 && !pass2) { status.textContent = '未找到全量迭代前记录。'; return; }
  if (memberView && useBefore) { status.textContent = '最初版本没有逐星对应记录，请选择后续编排。'; return; }
  const allEntries=(useBefore ? previous : usePass1 ? pass1 : usePass2 ? pass2 : current).entries;
  const groupEntries=allEntries.filter(e=>e.group===group && (select.value==='all'||e.number===Number(select.value)));
  const first=groupEntries[0].number,last=groupEntries.at(-1).number,chosen=new Set(groupEntries.map(e=>e.number));
  const neighbors=document.querySelector('#neighbors').checked && document.querySelector('#format').value==='sky';
  if(neighbors){chosen.add(first===1?28:first-1);chosen.add(last===28?1:last+1);}
  const entries=allEntries.filter(e=>chosen.has(e.number));
  const singles = entries.length===1;
  const items = entries.map(e=>catalog.culture.find(item=>item.id===e.cultureId));
  const center = unit(items.map(item=>cultureCenter(item,frame)).reduce((a,b)=>a.map((n,i)=>n+b[i]),[0,0,0]));
  const northPole = frame.eqjBasis[2], east = unit(cross(northPole, center)), north = cross(center,east);
  const raw = p => [-dot(p,east)/dot(p,center),-dot(p,north)/dot(p,center)];
  // Use the same bounds on both sides of this round's comparison: stars must not jump when toggling.
  const comparison=usePass1?pass1:pass2;
  const framingEntries = !useBefore && comparison
    ? [...current.entries, ...comparison.entries].filter(e=>chosen.has(e.number)) : entries;
  const samples = framingEntries.flatMap(e=>[
    ...[[0,0],[1,0],[0,1],[1,1]].map(([x,y])=>illustrationDirection(e.image,frame,e.image.size[0]*x,e.image.size[1]*y)),
    ...[...new Set(catalog.culture.find(item=>item.id===e.cultureId).lines.flat())].filter(h=>frame.hipIndex.has(h)).map(vector),
  ]).map(raw);
  const min = [0,1].map(k=>Math.min(...samples.map(p=>p[k]))), max = [0,1].map(k=>Math.max(...samples.map(p=>p[k])));
  canvas.height=780;
  const w = canvas.width, h = canvas.height;
  const scale = Math.min((w-130)/(max[0]-min[0]),(h-180)/(max[1]-min[1]));
  const offset = [w/2-(min[0]+max[0])*scale/2,(h-30)/2-(min[1]+max[1])*scale/2];
  const project = p => raw(p).map((n,i)=>n*scale+offset[i]);
  const bitmaps = await Promise.all(entries.map(e=>loadImage((document.querySelector('#variant').value==='line'?e.skyImage:e.image).file)));
  if (serial !== version) return;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);
  const gradient=ctx.createRadialGradient(w*.55,h*.4,0,w*.5,h*.5,w*.6);gradient.addColorStop(0,'#111e30');gradient.addColorStop(1,'#040912');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
  // Real catalog stars; no decorative random dots.
  for(let i=0;i<catalog.stars.length;i++){
    const star=catalog.stars[i],p=Array.from(frame.positions.slice(i*3,i*3+3));
    if(star[4]>6.5||dot(p,center)<.35)continue;const [x,y]=project(p);if(x<0||x>w||y<0||y>h)continue;
    ctx.globalAlpha=Math.max(.1,Math.min(.7,(7-star[4])/7));ctx.fillStyle='#bccde4';ctx.beginPath();ctx.arc(x,y,Math.max(.5,1.8-star[4]*.18),0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  entries.forEach((e,i)=>drawArtwork(e,bitmaps[i],project));
  const guides=document.querySelector('#guides').checked;
  for(let i=0;i<entries.length;i++){
    const e=entries[i],item=items[i],authored=e.placement ? e : current.entries.find(p=>p.number===e.number);
    if(guides){
      ctx.strokeStyle='#94b7d4';ctx.lineWidth=1.3;ctx.globalAlpha=.75;
      for(const line of item.lines){ctx.beginPath();line.filter(h=>frame.hipIndex.has(h)).forEach((hip,k)=>{const p=project(vector(hip));k?ctx.lineTo(...p):ctx.moveTo(...p)});ctx.stroke();}
      ctx.globalAlpha=1;
      for(const hip of new Set(item.lines.flat())){if(!frame.hipIndex.has(hip))continue;const p=project(vector(hip));const control=authored.placement.controls.find(c=>c.hip===hip);
        ctx.fillStyle=control?'#f0b779':'#c3d6e7';ctx.beginPath();ctx.arc(...p,control?4:2.5,0,Math.PI*2);ctx.fill();
        if(singles){ctx.font='13px system-ui';ctx.textAlign='left';ctx.fillText(control?control.feature+' · '+hip:String(hip),p[0]+8,p[1]-8);}
      }
    }
    const p=project(illustrationDirection(e.image,frame,e.image.size[0]*.5,e.image.size[1]*1.05));
    ctx.font='17px "PingFang SC",system-ui';ctx.textAlign='center';ctx.fillStyle='#e4d8bf';ctx.fillText(e.title,p[0],Math.min(h-26,p[1]+20));
  }
  ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillStyle='#7b93af';ctx.fillText('天北 ↑',w/2,26);ctx.fillText('天东 ←',45,h/2);ctx.fillText('→ 天西',w-45,h/2);
  if(document.querySelector('#format').value==='landmarks') landmarkSheet(entries,bitmaps);
  if(memberView) memberSheet(entries,bitmaps);
  document.querySelector('#notes').replaceChildren(...entries.map(entry=>{
    const e=entry.placement ? entry : current.entries.find(p=>p.number===entry.number),p=e.placement,a=document.createElement('article');
    const h=document.createElement('h2');h.textContent=e.number+' · '+e.title;
    const detail=document.createElement('p');detail.textContent=p.rationale;
    const foot=document.createElement('small');foot.textContent=p.controls.map(c=>c.feature+' ↔ HIP '+c.hip).join('；')+'。角宽 '+p.angularWidthDeg.toFixed(1)+'°，相对天北旋转 '+p.rotationDeg.toFixed(1)+'°。';
    a.append(h,detail,foot);return a;
  }));
  status.textContent=landmarks ? '当前编排的原图对应点 · '+entries.length+' 幅 · 图像比例与左右关系保持原样'
    : (useBefore?'最初统一朝北':usePass1?'四宿调整前':usePass2?'28 宿迭代前':'当前编排')+' · '+entries.length+' 幅 · '+(memberView?'原图朝向下检查整条星链（非天北视图）':guides?'显示真实星形与对应点':'仅看夜空图绘');
  window.__placementReview={ready:true,serial,group,numbers:entries.map(e=>e.number),before:useBefore,placement:useBefore?'before':usePass1?'pass1':usePass2?'pass2':'after',variant:document.querySelector('#variant').value,format:document.querySelector('#format').value,guides};
}
document.querySelector('nav').addEventListener('click',e=>{const b=e.target.closest('[data-group]');if(!b)return;group=b.dataset.group;document.querySelectorAll('[data-group]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));options();void render();});
document.querySelector('.controls').addEventListener('change',()=>void render());
document.querySelector('#neighbors').addEventListener('change',()=>void render());
options();await render();
