import React from 'react';
import { EarthMoonScene, type Composition } from '@/scene/Scene';
import { computeEphemeris, toUTCFromLocal } from '@/astro/ephemeris';

type FormState = {
  lat: string;
  lon: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

const DEFAULTS: FormState = {
  lat: '31.2304',
  lon: '121.4737',
  date: '1993-08-01',
  time: '11:00'
};

export default function App() {
  React.useEffect(() => { try { console.log('[App] mounted'); } catch {} }, []);
  const [form, setForm] = React.useState<FormState>(DEFAULTS);
  const [ephem, setEphem] = React.useState(() => {
    const utc = toUTCFromLocal(`${DEFAULTS.date}T${DEFAULTS.time}`, parseFloat(DEFAULTS.lon));
    return computeEphemeris(utc, parseFloat(DEFAULTS.lat), parseFloat(DEFAULTS.lon));
  });
  const [comp, setComp] = React.useState<Composition>({
    earthTopY: 0.333,
    earthSize: 3.0,
    moonScreenX: 0.5,
    moonScreenY: 0.78,
    moonDist: 14,
    moonRadius: 0.44,
    useTextures: true,
    glow: 0.22,
    useClouds: true,
    useMilkyWay: true,
    dayAmbient: 0.02,
    nightIntensity: 3.0,
    terminatorSoftness: 0.06,
    terminatorLift: 0.01,
    nightFalloff: 1.6,
    bgScale: 0.5,
    rimStrength: 1.08,
    rimWidth: 0.15,
    tideLock: false,
    rimRadius: 0.002,
    haloWidth: 0.006,
    earthGlowStrength: 0.15,
    earthGlowHeight: 0.02,
    cloudHeight: 0.01,
    cloudStrength: 0.55,
    cloudGamma: 1.15,
    strictDecouple: false,
    cloudYawDeg: 0,
    cloudPitchDeg: 0,
    earthTiltDeg: 0,
    earthYawDeg: 0,
    debugLeftSun: true,
    sunAzDeg: 180,
    sunElDeg: 23.44,
    lightTempK: 5200,
    shininess: 80,
    specStrength: 0.05,
    broadStrength: 0.15,
    broadShiny: 24,
    nightGamma: 1.1,
    moonSeparateLight: true,
    moonAzDeg: 180,
    moonElDeg: 0,
    sunIntensity: 1.3,
    sunIntensityEarth: 2.0,
    sunIntensityMoon: 1.2,
    exposure: 1.0,
  });
  const [mode, setMode] = React.useState<'art' | 'real'>('real');
  // 持久化：从 localStorage 读取
  React.useEffect(() => {
    try {
      const savedForm = localStorage.getItem('luBirth.form');
      const savedComp = localStorage.getItem('luBirth.comp');
      const savedMode = localStorage.getItem('luBirth.mode') as 'art'|'real'|null;
      if (savedForm) setForm(v => ({ ...v, ...JSON.parse(savedForm) }));
      if (savedComp) setComp(v => ({ ...v, ...JSON.parse(savedComp) }));
      if (savedMode === 'art' || savedMode === 'real') setMode(savedMode);
    } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem('luBirth.form', JSON.stringify(form)); } catch {}
  }, [form]);
  React.useEffect(() => {
    try { localStorage.setItem('luBirth.comp', JSON.stringify(comp)); } catch {}
  }, [comp]);
  React.useEffect(() => {
    try { localStorage.setItem('luBirth.mode', mode); } catch {}
  }, [mode]);
  const debug = React.useMemo(() => new URLSearchParams(location.search).get('debug') === '1', []);
  const [canvasRect, setCanvasRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    if (!debug) return;
    const update = () => {
      const c = document.querySelector('canvas');
      if (!c) return;
      const r = c.getBoundingClientRect();
      setCanvasRect(r);
    };
    update();
    const ro = new ResizeObserver(update);
    const c = document.querySelector('canvas');
    if (c) ro.observe(c);
    window.addEventListener('resize', update);
    const id = setInterval(update, 500);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [debug]);

  const onApply = React.useCallback(() => {
    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);
    const utc = toUTCFromLocal(`${form.date}T${form.time}`, lon);
    try {
      const e = computeEphemeris(utc, lat, lon);
      setEphem(e);
    } catch (err) {
      console.error(err);
      alert('计算失败，请检查输入。');
    }
  }, [form]);

  const onReset = React.useCallback(() => {
    setForm(DEFAULTS);
    setComp({
      earthTopY: 0.333,
      earthSize: 3.0,
      moonScreenX: 0.5,
      moonScreenY: 0.78,
      moonDist: 14,
      moonRadius: 0.44,
      useTextures: true,
      glow: 0.22,
      useClouds: true,
      useMilkyWay: true,
      dayAmbient: 0.02,
      nightIntensity: 3.0,
      terminatorSoftness: 0.06,
      terminatorLift: 0.01,
      nightFalloff: 1.6,
      bgScale: 0.5,
      rimStrength: 1.08,
      rimWidth: 0.15,
      tideLock: false,
      rimRadius: 0.002,
      haloWidth: 0.006,
      earthGlowStrength: 0.15,
      earthGlowHeight: 0.02,
      cloudHeight: 0.01,
      cloudStrength: 0.35,
      cloudYawDeg: 0,
      cloudPitchDeg: 0,
      earthTiltDeg: 0,
      earthYawDeg: 0,
      debugLeftSun: true,
      sunAzDeg: 180,
      sunElDeg: 23.44,
      lightTempK: 5200,
      shininess: 80,
      specStrength: 0.05,
      broadStrength: 0.15,
      broadShiny: 24,
      nightGamma: 1.1,
      moonSeparateLight: true,
      moonAzDeg: 180,
      moonElDeg: 0,
      sunIntensity: 1.3,
      sunIntensityEarth: 2.0,
      sunIntensityMoon: 1.2,
      exposure: 1.0,
    });
    setMode('real');
  }, []);

  const onExportPNG = React.useCallback(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) { alert('未找到画布'); return; }
    const src = canvas as HTMLCanvasElement;
    // 导出为 ~2K：按当前宽高等比例缩放到最大边 ~2048
    const sw = src.width, sh = src.height;
    const maxSide = 2048;
    const scale = Math.min(1, sw > sh ? maxSide / sw : maxSide / sh);
    const tw = Math.round(sw * scale);
    const th = Math.round(sh * scale);
    const off = document.createElement('canvas');
    off.width = tw; off.height = th;
    const ctx = off.getContext('2d');
    if (!ctx) { alert('导出失败'); return; }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, tw, th);
    off.toBlob((blob) => {
      if (!blob) { alert('导出失败'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earth-moon-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, []);

  const locLabel = React.useMemo(() => {
    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);
    const near = (a:number,b:number,eps=0.5)=>Math.abs(a-b)<eps;
    if (near(lat,31.2304) && near(lon,121.4737)) return '上海';
    return `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  }, [form.lat, form.lon]);

  const localLabel = React.useMemo(() => `${form.date} ${form.time}`, [form.date, form.time]);

  return (
    <div className="canvas-wrap">
      <div className="overlay">
        <div style={{ fontWeight: 500, letterSpacing: 0.4 }}>地月合影 · 出生纪念</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(ephem.time).toISOString()}</div>
      </div>

      <EarthMoonScene
        sunEQD={ephem.sunEQD}
        moonEQD={ephem.moonEQD}
        observerEQD={ephem.observerEQD}
        composition={comp}
        // 真实方位：仅用于光照方向，其它保持构图不变（最小偏置入框）
        mode={mode}
      />

      {/* 辅助线已移除 */}

      {debug && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
            {/* viewport center */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,0,0,0.6)' }} />
            {/* canvas center and bounds */}
            {canvasRect && (
              <>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${canvasRect.left + canvasRect.width/2}px`, width: 1, background: 'rgba(0,255,0,0.8)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${canvasRect.left}px`, width: 1, background: 'rgba(0,200,255,0.6)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${canvasRect.right}px`, width: 1, background: 'rgba(0,200,255,0.6)' }} />
              </>
            )}
          </div>
      )}

      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="row" style={{ gap: 12 }}>
            <label className="label">构图模式</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="radio" name="mode" checked={mode==='art'} onChange={()=>setMode('art')} /> 艺术构图
              </label>
              <label>
                <input type="radio" name="mode" checked={mode==='real'} onChange={()=>setMode('real')} /> 真实方位（光照）
              </label>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onExportPNG}>保存 PNG</button>
            <button className="btn" onClick={onReset}>重置</button>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">纬度 (lat)</label>
            <input className="input" value={form.lat} onChange={(e) => setForm(v => ({ ...v, lat: e.target.value }))} />
          </div>
          <div className="col">
            <label className="label">经度 (lon)</label>
            <input className="input" value={form.lon} onChange={(e) => setForm(v => ({ ...v, lon: e.target.value }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球朝向（潮汐锁定）</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any).tideLock} onChange={(e)=>setComp(v=>({...v, tideLock: e.target.checked}))} /> 锁定朝地球
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">太阳方位/仰角: {Math.round(((comp as any).sunAzDeg ?? 180))}° / {Math.round(((comp as any).sunElDeg ?? 0))}°</label>
            <div className="row">
              <input className="input" type="range" min={0} max={360} step={1}
                     value={(comp as any).sunAzDeg ?? 180}
                     onChange={(e) => setComp(v => ({ ...v, sunAzDeg: parseFloat(e.target.value) }))} />
              <input className="input" type="range" min={-45} max={45} step={1}
                     value={(comp as any).sunElDeg ?? 0}
                     onChange={(e) => setComp(v => ({ ...v, sunElDeg: parseFloat(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">日期 (YYYY-MM-DD)</label>
            <input className="input" value={form.date} onChange={(e) => setForm(v => ({ ...v, date: e.target.value }))} />
          </div>
          <div className="col">
            <label className="label">时间 (HH:mm)</label>
            <input className="input" value={form.time} onChange={(e) => setForm(v => ({ ...v, time: e.target.value }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">贴图与背景</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!comp.useTextures} onChange={(e)=>setComp(v=>({...v, useTextures: e.target.checked}))} /> 贴图增强
              </label>
              <label>
                <input type="checkbox" disabled={!comp.useTextures} checked={!!comp.useClouds} onChange={(e)=>setComp(v=>({...v, useClouds: e.target.checked}))} /> 云层
              </label>
              <label>
                <input type="checkbox" disabled={!comp.useTextures} checked={!!comp.useMilkyWay} onChange={(e)=>setComp(v=>({...v, useMilkyWay: e.target.checked}))} /> 银河星空
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">光晕强度: {Math.round((comp.glow ?? 0.22)*100)}%</label>
            <input className="input" type="range" min={0} max={1} step={0.01}
                   value={comp.glow ?? 0.22}
                   onChange={(e) => setComp(v => ({ ...v, glow: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">地球上沿 (0-1): {comp.earthTopY}</label>
            <input className="input" type="range" min={0.05} max={0.8} step={0.005}
                   value={comp.earthTopY ?? 0.333}
                   onChange={(e) => setComp(v => ({ ...v, earthTopY: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">地球大小(占屏): {Math.round((comp.earthSize ?? 0.33)*100)}%</label>
            <input className="input" type="range" min={0.08} max={3.0} step={0.01}
                   value={comp.earthSize ?? 0.33}
                   onChange={(e) => setComp(v => ({ ...v, earthSize: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">地轴倾角: {Math.round((comp.earthTiltDeg ?? 23.44)*100)/100}°</label>
            <input className="input" type="range" min={-45} max={45} step={0.1}
                   value={comp.earthTiltDeg ?? 23.44}
                   onChange={(e) => setComp(v => ({ ...v, earthTiltDeg: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">地球经线对齐(自转角): {Math.round((comp.earthYawDeg ?? 0))}°</label>
            <input className="input" type="range" min={-180} max={180} step={1}
                   value={comp.earthYawDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, earthYawDeg: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">银河缩放: {Math.round(((comp as any)?.bgScale ?? 1)*100)}%</label>
            <input className="input" type="range" min={50} max={200} step={1}
                   value={Math.round((((comp as any)?.bgScale ?? 0.5)*100))}
                   onChange={(e) => setComp(v => ({ ...v, bgScale: parseFloat(e.target.value)/100 }))} />
          </div>
          <div className="col">
            <label className="label">月球俯仰微调: {Math.round(((comp as any)?.moonPitchDeg ?? 0))}°</label>
            <input className="input" type="range" min={-90} max={90} step={1}
                   value={(comp as any)?.moonPitchDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, moonPitchDeg: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">晨昏线柔和度: {Math.round(((comp as any)?.terminatorSoftness ?? 0.06)*1000)/1000}</label>
            <input className="input" type="range" min={0.0} max={0.3} step={0.005}
                   value={(comp as any)?.terminatorSoftness ?? 0.06}
                   onChange={(e) => setComp(v => ({ ...v, terminatorSoftness: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">晨昏线亮度补偿: {Math.round(((comp as any)?.terminatorLift ?? 0.04)*100)}%</label>
            <input className="input" type="range" min={0} max={30} step={1}
                   value={Math.round((((comp as any)?.terminatorLift ?? 0.01)*100))}
                   onChange={(e) => setComp(v => ({ ...v, terminatorLift: parseFloat(e.target.value)/100 }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">夜景强度: {Math.round(((comp as any)?.nightIntensity ?? 1.0)*100)}%</label>
            <input className="input" type="range" min={0} max={300} step={1}
                   value={Math.round((((comp as any)?.nightIntensity ?? 3.0)*100))}
                   onChange={(e) => setComp(v => ({ ...v, nightIntensity: parseFloat(e.target.value)/100 }))} />
          </div>
          <div className="col">
            <label className="label">日侧补光: {Math.round(((comp as any)?.dayAmbient ?? 0.02)*100)}%</label>
            <input className="input" type="range" min={0} max={20} step={1}
                   value={Math.round((((comp as any)?.dayAmbient ?? 0.02)*100))}
                   onChange={(e) => setComp(v => ({ ...v, dayAmbient: parseFloat(e.target.value)/100 }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">弧光强度: {Math.round(((comp as any)?.rimStrength ?? 0.15)*100)}%</label>
            <input className="input" type="range" min={0} max={200} step={1}
                   value={Math.round((((comp as any)?.rimStrength ?? 0.15)*100))}
                   onChange={(e) => setComp(v => ({ ...v, rimStrength: parseFloat(e.target.value)/100 }))} />
          </div>
          <div className="col">
            <label className="label">弧光宽度: {Math.round(((comp as any)?.rimWidth ?? 0.08)*100)}%</label>
            <input className="input" type="range" min={2} max={30} step={1}
                   value={Math.round((((comp as any)?.rimWidth ?? 0.08)*100))}
                   onChange={(e) => setComp(v => ({ ...v, rimWidth: parseFloat(e.target.value)/100 }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">云层贴合(高度): {((comp as any)?.cloudHeight ?? 0.008).toFixed(3)}</label>
            <input className="input" type="range" min={0.0005} max={0.03} step={0.0005}
                   value={(comp as any)?.cloudHeight ?? 0.008}
                   onChange={(e) => setComp(v => ({ ...v, cloudHeight: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">云层经度旋转(°): {Math.round(((comp as any)?.cloudYawDeg ?? 0))}</label>
            <input className="input" type="range" min={-180} max={180} step={1}
                   value={(comp as any)?.cloudYawDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, cloudYawDeg: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">云层纬度旋转(°): {Math.round(((comp as any)?.cloudPitchDeg ?? 0))}</label>
            <input className="input" type="range" min={-90} max={90} step={1}
                   value={(comp as any)?.cloudPitchDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, cloudPitchDeg: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">弧光贴合: {((comp as any)?.rimRadius ?? 0.002).toFixed(3)} · Halo宽度: {((comp as any)?.haloWidth ?? 0.006).toFixed(3)}</label>
            <div className="row">
              <input className="input" type="range" min={0.001} max={0.01} step={0.0005}
                     value={(comp as any)?.rimRadius ?? 0.002}
                     onChange={(e) => setComp(v => ({ ...v, rimRadius: parseFloat(e.target.value) }))} />
              <input className="input" type="range" min={0} max={0.03} step={0.001}
                     value={(comp as any)?.haloWidth ?? 0.006}
                     onChange={(e) => setComp(v => ({ ...v, haloWidth: parseFloat(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">调试: 左侧太阳</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.debugLeftSun} onChange={(e)=>setComp(v=>({...v, debugLeftSun: e.target.checked}))} /> 左侧平行光
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">镜面高光: 强度 {Math.round((((comp as any)?.specStrength ?? 0.8)*100))}% · 锐度 {Math.round(((comp as any)?.shininess ?? 80))}</label>
            <div className="row">
              <input className="input" type="range" min={0} max={300} step={1}
                     value={Math.round((((comp as any)?.specStrength ?? 0.8)*100))}
                     onChange={(e) => setComp(v => ({ ...v, specStrength: parseFloat(e.target.value)/100 }))} />
              <input className="input" type="range" min={1} max={400} step={1}
                     value={(comp as any)?.shininess ?? 80}
                     onChange={(e) => setComp(v => ({ ...v, shininess: parseFloat(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">阳光强度（地球）: {((comp as any)?.sunIntensityEarth ?? 1.3).toFixed(2)}</label>
            <input className="input" type="range" min={0} max={6} step={0.05}
                   value={(comp as any)?.sunIntensityEarth ?? 1.3}
                   onChange={(e) => setComp(v => ({ ...v, sunIntensityEarth: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">阳光强度（月球）: {((comp as any)?.sunIntensityMoon ?? 1.2).toFixed(2)}</label>
            <input className="input" type="range" min={0} max={6} step={0.05}
                   value={(comp as any)?.sunIntensityMoon ?? 1.2}
                   onChange={(e) => setComp(v => ({ ...v, sunIntensityMoon: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">高光铺展: 强度 {Math.round((((comp as any)?.broadStrength ?? 0.4)*100))}% · 锐度 {Math.round(((comp as any)?.broadShiny ?? 20))}</label>
            <div className="row">
              <input className="input" type="range" min={0} max={200} step={1}
                     value={Math.round((((comp as any)?.broadStrength ?? 0.4)*100))}
                     onChange={(e) => setComp(v => ({ ...v, broadStrength: parseFloat(e.target.value)/100 }))} />
              <input className="input" type="range" min={1} max={200} step={1}
                     value={(comp as any)?.broadShiny ?? 20}
                     onChange={(e) => setComp(v => ({ ...v, broadShiny: parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div className="col">
            <label className="label">色温: {Math.round(((comp as any)?.lightTempK ?? 5600))}K · 夜景Gamma {((comp as any)?.nightGamma ?? 1.4).toFixed(1)}</label>
            <div className="row">
              <input className="input" type="range" min={2000} max={10000} step={50}
                     value={(comp as any)?.lightTempK ?? 5600}
                     onChange={(e) => setComp(v => ({ ...v, lightTempK: parseFloat(e.target.value) }))} />
              <input className="input" type="range" min={0.5} max={3.0} step={0.1}
                     value={(comp as any)?.nightGamma ?? 1.4}
                     onChange={(e) => setComp(v => ({ ...v, nightGamma: parseFloat(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">晨昏线过渡 (edge): {((comp as any)?.terminatorSoftness ?? 0.06).toFixed(3)}</label>
            <input className="input" type="range" min={0.0} max={0.3} step={0.005}
                   value={(comp as any)?.terminatorSoftness ?? 0.06}
                   onChange={(e) => setComp(v => ({ ...v, terminatorSoftness: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">夜景衰减 (nightFalloff): {((comp as any)?.nightFalloff ?? 1.6).toFixed(2)}</label>
            <input className="input" type="range" min={0.5} max={4.0} step={0.05}
                   value={(comp as any)?.nightFalloff ?? 1.6}
                   onChange={(e) => setComp(v => ({ ...v, nightFalloff: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">云层强度: {Math.round((((comp as any)?.cloudStrength ?? 0.18)*100))}%</label>
            <input className="input" type="range" min={0} max={100} step={1}
                   value={Math.round((((comp as any)?.cloudStrength ?? 0.18)*100))}
                   onChange={(e) => { const v = parseFloat(e.target.value)/100; (window as any).__cloudStrength = v; setComp(c=>({...c, cloudStrength: v})); }} />
          </div>
          <div className="col">
            <label className="label">云层Gamma: {((comp as any)?.cloudGamma ?? 1.15).toFixed(2)}</label>
            <input className="input" type="range" min={0.6} max={2.0} step={0.05}
                   value={(comp as any)?.cloudGamma ?? 1.15}
                   onChange={(e) => setComp(v => ({ ...v, cloudGamma: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">云层黑点: {((comp as any)?.cloudBlack ?? 0.40).toFixed(2)}</label>
            <input className="input" type="range" min={0.0} max={0.9} step={0.01}
                   value={(comp as any)?.cloudBlack ?? 0.40}
                   onChange={(e) => setComp(v => ({ ...v, cloudBlack: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">云层白点: {((comp as any)?.cloudWhite ?? 0.85).toFixed(2)}</label>
            <input className="input" type="range" min={0.1} max={1.0} step={0.01}
                   value={(comp as any)?.cloudWhite ?? 0.85}
                   onChange={(e) => setComp(v => ({ ...v, cloudWhite: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">云层对比度: {((comp as any)?.cloudContrast ?? 1.20).toFixed(2)}</label>
            <input className="input" type="range" min={0.5} max={2.5} step={0.05}
                   value={(comp as any)?.cloudContrast ?? 1.20}
                   onChange={(e) => setComp(v => ({ ...v, cloudContrast: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">地光强度: {((comp as any)?.earthGlowStrength ?? 0.15).toFixed(2)}</label>
            <input className="input" type="range" min={0.0} max={3.0} step={0.01}
                   value={(comp as any)?.earthGlowStrength ?? 0.15}
                   onChange={(e) => setComp(v => ({ ...v, earthGlowStrength: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">地光高度(占R): {Math.round(((comp as any)?.earthGlowHeight ?? 0.02)*100)}%</label>
            <input className="input" type="range" min={0.5} max={50} step={0.5}
                   value={Math.round((((comp as any)?.earthGlowHeight ?? 0.02)*100))}
                   onChange={(e) => setComp(v => ({ ...v, earthGlowHeight: parseFloat(e.target.value)/100 }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球朝向微调: {Math.round((comp.moonYawDeg ?? 0))}°</label>
            <input className="input" type="range" min={-180} max={180} step={1}
                   value={comp.moonYawDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, moonYawDeg: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球独立光</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any).moonSeparateLight} onChange={(e)=>setComp(v=>({...v, moonSeparateLight: e.target.checked}))} /> 启用
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">月光方位/仰角: {Math.round(((comp as any).moonAzDeg ?? 180))}° / {Math.round(((comp as any).moonElDeg ?? 0))}°</label>
            <div className="row">
              <input className="input" type="range" min={0} max={360} step={1}
                     value={(comp as any).moonAzDeg ?? 180}
                     onChange={(e) => setComp(v => ({ ...v, moonAzDeg: parseFloat(e.target.value) }))} />
              <input className="input" type="range" min={-45} max={45} step={1}
                     value={(comp as any).moonElDeg ?? 0}
                     onChange={(e) => setComp(v => ({ ...v, moonElDeg: parseFloat(e.target.value) }))} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球X (0-1): {comp.moonScreenX}</label>
            <input className="input" type="range" min={0.2} max={0.8} step={0.01}
                   value={comp.moonScreenX ?? 0.5}
                   onChange={(e) => setComp(v => ({ ...v, moonScreenX: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">月球Y (0-1): {comp.moonScreenY}</label>
            <input className="input" type="range" min={0.55} max={0.95} step={0.01}
                   value={comp.moonScreenY ?? 0.78}
                   onChange={(e) => setComp(v => ({ ...v, moonScreenY: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球距离: {comp.moonDist}</label>
            <input className="input" type="range" min={8} max={40} step={0.5}
                   value={comp.moonDist ?? 14}
                   onChange={(e) => setComp(v => ({ ...v, moonDist: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">月球半径: {comp.moonRadius}</label>
            <input className="input" type="range" min={0.1} max={1.0} step={0.02}
                   value={comp.moonRadius ?? 0.44}
                   onChange={(e) => setComp(v => ({ ...v, moonRadius: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <span className="label">构图模式</span>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">曝光 (Exposure): {((comp as any)?.exposure ?? 1.0).toFixed(2)}</label>
            <input className="input" type="range" min={0.2} max={3.0} step={0.05}
                   value={(comp as any)?.exposure ?? 1.0}
                   onChange={(e) => setComp(v => ({ ...v, exposure: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onApply}>应用</button>
        </div>
      </div>

      <div className="credit">视觉基调：极简·低饱和·苹果风（MVP） · 构图：地球下1/3 + 右上小月亮</div>
      <div className="caption">{locLabel} · {localLabel}</div>
    </div>
  );
}
