import React from 'react';
import { EarthMoonScene, type Composition } from '@/scene/Scene';
import { computeEphemeris, toUTCFromLocal } from '@/astro/ephemeris';
import * as THREE from 'three';

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
    earthLightEnabled: true,
    earthLightAzDeg: 180,
    earthLightElDeg: 23.44,
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
    earthLightIntensity: 2.0,
    sunIntensityMoon: 1.2,
    exposure: 1.0,
    moonLatDeg: 0,
    moonLonDeg: -90, // 设置月球经度调整默认值为 -90°
    // 双通道渲染参数
    // 双轨渲染已不再使用
  // dualChannelEnabled: false,
    moonRenderTargetSize: 512,
          // 月球缓存已不再使用
      // moonCacheEnabled: true,
    // 月球烘焙参数
    moonBakingEnabled: false, // 默认关闭，需要时手动开启
          moonOverlayEnabled: false, // 遮罩功能已关闭，使用包裹球方案
  });
  const [mode, setMode] = React.useState<'debug' | 'celestial'>('celestial');
  
  // 模式切换时的参数处理
  const handleModeChange = React.useCallback((newMode: 'debug' | 'celestial') => {
    setMode(newMode);
    
    // 保存当前模式的参数
    try {
      const currentKey = mode === 'celestial' ? 'luBirth.celestial' : 'luBirth.debug';
      localStorage.setItem(currentKey, JSON.stringify(comp));
    } catch {}
    
    // 加载新模式的参数
    try {
      const newKey = newMode === 'celestial' ? 'luBirth.celestial' : 'luBirth.debug';
      const savedComp = localStorage.getItem(newKey);
      if (savedComp) {
        setComp(v => ({ ...v, ...JSON.parse(savedComp) }));
      }
    } catch {}
  }, [mode]); // 移除comp依赖，避免循环
  // 持久化：从 localStorage 读取
  React.useEffect(() => {
    try {
      const savedForm = localStorage.getItem('luBirth.form');
      const savedMode = localStorage.getItem('luBirth.mode') as 'debug'|'celestial'|null;
      
      // 根据模式加载对应的参数
      if (savedMode === 'debug' || savedMode === 'celestial') {
        setMode(savedMode);
        const savedComp = localStorage.getItem(`luBirth.${savedMode}`);
        if (savedComp) {
          const parsedComp = JSON.parse(savedComp);
          // 强制设置烘焙为关闭，避免之前保存的开启状态
          parsedComp.moonBakingEnabled = false;
          parsedComp.moonOverlayEnabled = false;
          setComp(v => ({ ...v, ...parsedComp }));
        }
      }
      
      if (savedForm) setForm(v => ({ ...v, ...JSON.parse(savedForm) }));
    } catch {}
  }, []);
  // 参数分离存储：根据模式分别保存参数
  React.useEffect(() => {
    try { localStorage.setItem('luBirth.form', JSON.stringify(form)); } catch {}
  }, [form]);
  
  React.useEffect(() => {
    try { 
      if (mode === 'celestial') {
        localStorage.setItem('luBirth.celestial', JSON.stringify(comp)); 
      } else {
        localStorage.setItem('luBirth.debug', JSON.stringify(comp)); 
      }
    } catch {}
  }, [comp, mode]);
  
  React.useEffect(() => {
    try { localStorage.setItem('luBirth.mode', mode); } catch {}
  }, [mode]);
  const debug = React.useMemo(() => new URLSearchParams(location.search).get('debug') === '1', []);
  const clean = React.useMemo(() => new URLSearchParams(location.search).get('clean') === '1', []);
  const decoupled = React.useMemo(() => new URLSearchParams(location.search).get('decoupled') === '1', []);
  const [DecComp, setDecComp] = React.useState<React.ComponentType<any> | null>(null);
  const [decErr, setDecErr] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!decoupled) return;
    try {
      // 使用相对路径匹配 test 目录文件（相对于 src/App.tsx）
      const mods: Record<string, () => Promise<any>> = (import.meta as any).glob('../test/decoupled/DualCanvas.tsx');
      const loader = mods['../test/decoupled/DualCanvas.tsx'];
      if (!loader) { setDecErr('not-found'); return; }
      loader().then((m) => { setDecComp(() => m.DualCanvasShell); }).catch((e) => { console.error(e); setDecErr('load-failed'); });
    } catch (e) {
      console.error(e);
      setDecErr('load-exception');
    }
  }, [decoupled]);
  const [uiHidden, setUiHidden] = React.useState<boolean>(clean);
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

  // 天相模式下的参数联动计算
  const updateCelestialParams = React.useCallback((ephemeris: any) => {
    if (mode !== 'celestial') return;
    
    try {
      // 基于天文数据计算光照方向
      const sunVector = new THREE.Vector3(ephemeris.sunEQD.x, ephemeris.sunEQD.y, ephemeris.sunEQD.z);
      const moonVector = new THREE.Vector3(ephemeris.moonEQD.x, ephemeris.moonEQD.y, ephemeris.moonEQD.z);
      
      // 计算太阳方位角和仰角
      const sunAz = Math.atan2(sunVector.z, sunVector.x) * 180 / Math.PI;
      const sunEl = Math.asin(sunVector.y / sunVector.length()) * 180 / Math.PI;
      
      // 计算月球方位角和仰角
      const moonAz = Math.atan2(moonVector.z, moonVector.x) * 180 / Math.PI;
      const moonEl = Math.asin(moonVector.y / moonVector.length()) * 180 / Math.PI;
      
      // 自动更新相关参数
      setComp(prev => ({
        ...prev,
        earthLightAzDeg: sunAz,
        earthLightElDeg: sunEl,
        moonAzDeg: moonAz,
        moonElDeg: moonEl,
        moonSeparateLight: true, // 天相模式下启用独立月球光照
      }));
      
      console.log('[天相模式] 参数已自动更新:', { sunAz, sunEl, moonAz, moonEl });
    } catch (error) {
      console.error('[天相模式] 参数更新失败:', error);
    }
  }, [mode]);

  const onApply = React.useCallback(() => {
    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);
    const utc = toUTCFromLocal(`${form.date}T${form.time}`, lon);
    try {
      const e = computeEphemeris(utc, lat, lon);
      setEphem(e);
      
      // 天相模式下自动更新参数
      updateCelestialParams(e);
    } catch (err) {
      console.error(err);
      alert('计算失败，请检查输入。');
    }
  }, [form, updateCelestialParams]);

  const onReset = React.useCallback(() => {
    // 优先使用保存的默认，否则退回内置默认
    try {
      const dForm = localStorage.getItem('luBirth.defaults.form');
      const dComp = localStorage.getItem('luBirth.defaults.comp');
      const dMode = localStorage.getItem('luBirth.defaults.mode') as 'debug'|'celestial'|null;
      if (dForm) setForm(JSON.parse(dForm)); else setForm(DEFAULTS);
      if (dComp) setComp(JSON.parse(dComp)); else setComp({
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
      earthLightEnabled: true,
      earthLightAzDeg: 180,
      earthLightElDeg: 23.44,
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
      earthLightIntensity: 2.0,
      sunIntensityMoon: 1.2,
      exposure: 1.0,
      moonLatDeg: 0,
      moonLonDeg: -90,
    });
      if (dMode === 'debug' || dMode === 'celestial') setMode(dMode); else setMode('celestial');
      return;
    } catch {}
    setForm(DEFAULTS);
    setMode('celestial');
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

  const saveAsDefault = React.useCallback(() => {
    try {
      localStorage.setItem('luBirth.defaults.form', JSON.stringify(form));
      localStorage.setItem('luBirth.defaults.comp', JSON.stringify(comp));
      localStorage.setItem('luBirth.defaults.mode', mode);
      alert('已保存当前为默认参数');
    } catch {}
  }, [form, comp, mode]);

  return (
    <div className="canvas-wrap">
      {!uiHidden && (
      <div className="overlay">
        <div style={{ fontWeight: 500, letterSpacing: 0.4 }}>地月合影 · 出生纪念</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(ephem.time).toISOString()}</div>
      </div>
      )}

      {decoupled ? (
        <div style={{ position:'absolute', inset:0 }}>
          {/* 解耦模式指示（仅用于排查加载状态） */}
          <div style={{ position:'absolute', top: 8, left: 8, color:'#fff', fontSize: 12, opacity: 0.8, pointerEvents:'none', zIndex: 100 }}>Decoupled: loading {DecComp? 'ok' : (decErr || '...')}</div>
          {DecComp ? (
            <DecComp 
              sunEQD={ephem.sunEQD} 
              moonEQD={ephem.moonEQD} 
              observerEQD={ephem.observerEQD} 
              composition={comp}
              disableHemisphere={true} // 添加半球光禁用参数
            />
          ) : decErr ? (
            <div style={{ color:'#fff', position:'absolute', top:16, left:16, zIndex: 100 }}>解耦模块加载失败：{decErr}</div>
          ) : null}
        </div>
      ) : (
        <EarthMoonScene
          sunEQD={ephem.sunEQD}
          moonEQD={ephem.moonEQD}
          observerEQD={ephem.observerEQD}
          composition={comp}
          mode={mode}
        />
      )}

      {/* 辅助线已移除 */}

      {debug && !uiHidden && (
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

      {!uiHidden && (
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="row" style={{ gap: 12 }}>
            <label className="label">构图模式</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="radio" name="mode" checked={mode==='celestial'} onChange={()=>handleModeChange('celestial')} /> 天相模式
              </label>
              <label>
                <input type="radio" name="mode" checked={mode==='debug'} onChange={()=>handleModeChange('debug')} /> 调试模式
              </label>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onExportPNG}>保存 PNG</button>
            <button className="btn" onClick={onReset}>重置</button>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={saveAsDefault}>保存为默认</button>
            <button className="btn" onClick={()=>setUiHidden(true)}>折叠 UI</button>
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
            <label className="label">地球光照方位/仰角: {Math.round(((comp as any).earthLightAzDeg ?? 180))}° / {Math.round(((comp as any).earthLightElDeg ?? 0))}°</label>
            <div className="row">
              <input className="input" type="range" min={0} max={360} step={1}
                     value={(comp as any).earthLightAzDeg ?? 180}
                     onChange={(e) => setComp(v => ({ ...v, earthLightAzDeg: parseFloat(e.target.value) }))} />
              <input className="input" type="range" min={-45} max={45} step={1}
                     value={(comp as any).earthLightElDeg ?? 0}
                     onChange={(e) => setComp(v => ({ ...v, earthLightElDeg: parseFloat(e.target.value) }))} />
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
            <label className="label">调试: 地月光照</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.earthLightEnabled} onChange={(e)=>setComp(v=>({...v, earthLightEnabled: e.target.checked}))} /> 地球光照
              </label>
            </div>
          </div>
          {/* 双通道渲染已不再使用，移除相关UI */}
          {/* <div className="col">
            <label className="label">双通道渲染</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.dualChannelEnabled} onChange={(e)=>setComp(v=>({...v, dualChannelEnabled: e.target.checked}))} /> 启用
              </label>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.moonCacheEnabled} onChange={(e)=>setComp(v=>({...v, moonCacheEnabled: e.target.checked}))} /> 月球缓存
              </label>
            </div>
          </div> */}
          <div className="col">
            <label className="label">月球烘焙</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.moonBakingEnabled} onChange={(e)=>setComp(v=>({...v, moonBakingEnabled: e.target.checked}))} /> 启用
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">显示包裹球</label>
            <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
              <label>
                <input type="checkbox" checked={!!(comp as any)?.moonOverlayEnabled} onChange={(e)=>setComp(v=>({...v, moonOverlayEnabled: e.target.checked}))} /> 启用
              </label>
            </div>
          </div>
          <div className="col">
            <label className="label">月球高度贴图: 强度 {((comp as any)?.moonDisplacementScale ?? 0.02).toFixed(2)}</label>
            <input className="input" type="range" min={0} max={0.5} step={0.01}
                   value={(comp as any)?.moonDisplacementScale ?? 0.02}
                   onChange={(e) => setComp(v => ({ ...v, moonDisplacementScale: parseFloat(e.target.value) }))} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="col">
            <label className="label">月球RenderTarget分辨率: {comp.moonRenderTargetSize ?? 512}</label>
            <input className="input" type="range" min={256} max={1024} step={128}
                   value={comp.moonRenderTargetSize ?? 512}
                   onChange={(e) => setComp(v => ({ ...v, moonRenderTargetSize: parseInt(e.target.value) }))} />
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
            <label className="label">地球光照强度: {((comp as any)?.earthLightIntensity ?? 1.3).toFixed(2)}</label>
            <input className="input" type="range" min={0} max={6} step={0.05}
                   value={(comp as any)?.earthLightIntensity ?? 1.3}
                   onChange={(e) => setComp(v => ({ ...v, earthLightIntensity: parseFloat(e.target.value) }))} />
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
            <label className="label">月球纬度调整: {Math.round(((comp as any)?.moonLatDeg ?? 0))}°</label>
            <input className="input" type="range" min={-90} max={90} step={1}
                   value={(comp as any)?.moonLatDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, moonLatDeg: parseFloat(e.target.value) }))} />
          </div>
          <div className="col">
            <label className="label">月球经度调整: {Math.round(((comp as any)?.moonLonDeg ?? 0))}°</label>
            <input className="input" type="range" min={-180} max={180} step={1}
                   value={(comp as any)?.moonLonDeg ?? 0}
                   onChange={(e) => setComp(v => ({ ...v, moonLonDeg: parseFloat(e.target.value) }))} />
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
      )}
      {uiHidden && (
        <div style={{ position:'absolute', top: 10, left: 10, zIndex: 40 }}>
          <button className="btn" onClick={()=>setUiHidden(false)}>显示 UI</button>
        </div>
      )}

      {!uiHidden && (
        <>
          <div className="credit">视觉基调：极简·低饱和·苹果风（MVP） · 构图：地球下1/3 + 右上小月亮</div>
          <div className="caption">{locLabel} · {localLabel}</div>
        </>
      )}
    </div>
  );
}
