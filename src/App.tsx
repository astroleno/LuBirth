import React from 'react';
import SimpleTest, { type EarthViewState } from './SimpleTest';
import LoadingOverlay from './components/LoadingOverlay';
import { useMobileLayout } from './performance/renderProfile';
import { journeyStore } from './history/journeyStore';
import type { Observation } from './history/observation';
import type { SkyViewState } from './spikes/sky/main';
import ObservationForm from './history/ObservationForm';
import { createCelestialState, createObserverState } from './astro/celestialState';
import { createViewTransfer } from './history/viewBridge';
import type { ViewTransfer } from './history/viewBridge';
import { SpatialValidationProbe } from './performance/SpatialValidationProbe';
import { SceneScreenshot } from './components/SceneScreenshot';
import { ExperiencePanel } from './components/experience/ExperiencePanel';
import { CulturePicker } from './components/experience/CulturePicker';
import type { EarthUIActions, ExperiencePanelKind, SceneSection, SceneUIHost } from './components/experience/SceneUI';
import { assetUrl } from './utils/assetUrl';
import './history/journey.css';
import './components/experience/experience.css';

const SkyView = React.lazy(() => import('./spikes/sky/main'));
const JourneyPanel = React.lazy(() => import('./history/JourneyPanel'));
const LocalAudioPlayer = React.lazy(() => import('./components/LocalAudioPlayer'));

class ViewBoundary extends React.Component<{ children: React.ReactNode; onBack: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="journey-loading" role="alert"><div><p>画面未能载入，观察信息仍保留。</p>
    <button className="journey-secondary" onClick={this.props.onBack}>返回地月</button></div></div> : this.props.children; }
}

export default function App() {
  const mobile = useMobileLayout();
  const state = React.useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot);
  const [view, setView] = React.useState<'earth' | 'sky'>(() => new URLSearchParams(location.search).get('scene') === 'sky' ? 'sky' : 'earth');
  const [panel, setPanel] = React.useState<ExperiencePanelKind | null>(() => new URLSearchParams(location.search).get('history') === '1' ? 'history' : state.birth ? null : 'birth');
  const [birthOpened, setBirthOpened] = React.useState(panel === 'birth');
  const [historyOpened, setHistoryOpened] = React.useState(panel === 'history');
  const [controlsHost, setControlsHost] = React.useState<HTMLDivElement | null>(null);
  const [skyImmersed, setSkyImmersed] = React.useState(false);
  const [appFullscreen, setAppFullscreen] = React.useState(false);
  const [audioReady, setAudioReady] = React.useState(false);
  const appRoot = React.useRef<HTMLDivElement>(null), exploreButton = React.useRef<HTMLButtonElement>(null);
  const immersionButton = React.useRef<HTMLButtonElement>(null);
  const earthActions = React.useRef<EarthUIActions | null>(null), lastPanel = React.useRef<ExperiencePanelKind>(panel || 'birth');
  const registerEarthUI = React.useCallback((actions: EarthUIActions | null) => { earthActions.current = actions; }, []);
  const [earthHidden, setEarthHidden] = React.useState(false);
  const [earthStarted, setEarthStarted] = React.useState(view === 'earth');
  const [transfer, setTransfer] = React.useState<ViewTransfer | undefined>();
  const [earthTransfer, setEarthTransfer] = React.useState<ViewTransfer | undefined>();
  const celestial = React.useMemo(() => createCelestialState(state.current.utc), [state.current.utc]);
  const observer = React.useMemo(() => createObserverState(celestial, state.current.observer),
    [celestial, state.current.observer.latitude, state.current.observer.longitude]);
  const scope = state.current.source.kind === 'history' ? 'history' : 'personal';
  const earthViews = React.useRef<Partial<Record<'history' | 'personal', EarthViewState>>>({});
  const skyViews = React.useRef<Partial<Record<'history' | 'personal', SkyViewState>>>({});
  const saveEarthView = React.useCallback((value: EarthViewState) => { earthViews.current[scope] = value; setEarthHidden(value.uiHidden); }, [scope]);
  const saveSkyView = React.useCallback((value: SkyViewState) => { skyViews.current[scope] = value; }, [scope]);
  const closePanel = React.useCallback(() => setPanel(null), []);
  const openPanel = React.useCallback((next: ExperiencePanelKind) => {
    if (next === 'birth') setBirthOpened(true);
    if (next === 'history') setHistoryOpened(true);
    if (view === 'earth') earthActions.current?.setImmersed(false);
    else setSkyImmersed(false);
    lastPanel.current = next; setPanel(next);
  }, [view]);
  const openScenePanel = React.useCallback((next: SceneSection) => openPanel(next), [openPanel]);
  const sceneUI = React.useMemo<SceneUIHost>(() => ({ target: controlsHost,
    section: panel === 'sky' || panel === 'appearance' ? panel : null, open: openScenePanel, close: closePanel }),
    [controlsHost, panel, openScenePanel, closePanel]);
  const setImmersed = React.useCallback((value: boolean) => {
    if (value) setPanel(null);
    if (view === 'earth') earthActions.current?.setImmersed(value);
    else setSkyImmersed(value);
  }, [view]);
  const immersed = view === 'earth' ? earthHidden : skyImmersed;
  React.useEffect(() => {
    if (!immersed || panel) return;
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('.screenshot-preview')) return;
      event.preventDefault(); setImmersed(false);
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [immersed, panel, setImmersed]);
  React.useEffect(() => {
    if (immersed && (document.activeElement === document.body || document.activeElement?.closest('#experience-panel'))) immersionButton.current?.focus();
  }, [immersed]);
  const consumeEarthTransfer = React.useCallback(() => setEarthTransfer(undefined), []);
  const enterHistory = React.useCallback((observation: Observation) => { journeyStore.enterHistory(observation);
    setEarthTransfer(createViewTransfer(observation, 'birth-point'));
    setEarthHidden(true); setPanel(null); setView('earth'); }, []);
  const saveBirth = React.useCallback((observation: Observation) => {
    journeyStore.setBirth(observation); setEarthTransfer(createViewTransfer(observation, 'birth-point'));
    setEarthHidden(true); setPanel(null); setView('earth');
  }, []);
  const enterSky = React.useCallback(() => { setTransfer(createViewTransfer(state.current, 'birth-point')); setPanel(null); setView('sky'); }, [state.current]);
  const locateMoon = React.useCallback(() => {
    journeyStore.setMoonPlacement('physical');
    setTransfer(createViewTransfer(state.current, 'locate-target', 'body:moon')); setPanel(null); setView('sky');
  }, [state.current]);
  const showSky = React.useCallback(() => {
    setTransfer(createViewTransfer(state.current, 'navigation')); setSkyImmersed(false); setView('sky');
  }, [state.current]);
  const fullscreen = React.useCallback(async () => {
    if (appFullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setAppFullscreen(false); return;
    }
    setImmersed(true); setAppFullscreen(true);
    if (document.fullscreenEnabled) await appRoot.current?.requestFullscreen().catch(() => {});
  }, [appFullscreen, setImmersed]);
  React.useEffect(() => {
    const changed = () => { setAppFullscreen(document.fullscreenElement === appRoot.current); };
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(() => setAudioReady(true), 4000);
    return () => clearTimeout(timer);
  }, []);
  React.useEffect(() => { if (view === 'earth') setEarthStarted(true); }, [view]);
  React.useEffect(() => {
    (window as any).__luBirthJourney = { state, view, panel, scope, transfer,
      get earthView() { return earthViews.current[scope]; },
      get skyView() { return skyViews.current[scope]; },
      celestialKey: celestial.key, observerKey: observer.key };
  }, [state, view, panel, scope, earthHidden, celestial, observer, transfer]);
  const [assetStatus, setAssetStatus] = React.useState('');
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = (event: Event) => {
      clearTimeout(timer);
      const status = (event as CustomEvent<string>).detail;
      if (status === 'idle') { setAssetStatus(''); return; }
      setAssetStatus(status === 'loading' ? '正在加载月球地形…' : status === 'ready' ? '月球地形已就绪' : '月球地形加载失败，已保留基础月球');
      if (status !== 'loading') timer = setTimeout(() => setAssetStatus(''), 5000);
    };
    window.addEventListener('lubirth:moon-terrain', update);
    const failed = () => {
      clearTimeout(timer);
      setAssetStatus('部分细节未能加载，已保留基础画面');
      timer = setTimeout(() => setAssetStatus(''), 5000);
    };
    window.addEventListener('lubirth:asset-error', failed);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('lubirth:moon-terrain', update);
      window.removeEventListener('lubirth:asset-error', failed);
    };
  }, []);
  React.useEffect(() => {
    try { 
      console.log('[App] mounted - using SimpleTest scene'); 
    } catch {}
  }, []);

  // 使用 SimpleTest 组件作为主场景
  return (
    <div ref={appRoot} className="journey-app experience-app" data-experience-root data-view={view}
      data-panel={panel || undefined} data-immersed={immersed || undefined} data-history={state.current.source.kind === 'history' || undefined}>
      {import.meta.env.DEV && new URLSearchParams(location.search).get('spatialtest') === '1' && <SpatialValidationProbe />}
      <header className={'experience-toolbar' + (immersed ? ' is-immersed' : '')} data-sky-obstruction>
        {!immersed && <><span className="experience-brand">LuBirth</span>
          <nav aria-label="观看方式" className="experience-views">
            <button aria-current={view === 'earth' ? 'page' : undefined} onClick={() => setView('earth')}>地月</button>
            <button aria-current={view === 'sky' ? 'page' : undefined} onClick={showSky}>观天</button>
          </nav></>}
        <div className="experience-toolbar-actions">
          {!immersed && <button ref={exploreButton} aria-expanded={!!panel} aria-controls="experience-panel"
            onClick={() => panel ? closePanel() : openPanel(lastPanel.current)}>探索</button>}
          {view === 'earth' && <SceneScreenshot label="留念" unified />}
          <button ref={immersionButton} onClick={() => setImmersed(!immersed)}>{immersed ? '显示菜单' : '沉浸'}</button>
        </div>
      </header>
      {/* 基础画面就绪且手写动画完成后露出场景。 */}
      {earthStarted && <div hidden={view !== 'earth'}><LoadingOverlay
        durationMs={mobile ? 6000 : 4000}
        minShowMs={mobile ? 300 : 650}
        fadeMs={mobile ? 380 : 600}
        prewarmFrames={1}
      /></div>}
      <div className="journey-scene">
        <ViewBoundary key={view + scope} onBack={() => { setView('earth'); setPanel(null); }}>
          <React.Suspense fallback={<div className="journey-loading" role="status">正在打开{view === 'sky' ? '星空' : '地月'}…</div>}>
            {view === 'earth' ? <SimpleTest key={scope} observation={state.current} initialState={earthViews.current[scope]} onStateChange={saveEarthView}
              entryTransfer={earthTransfer} onEntryTransferConsumed={consumeEarthTransfer}
              celestial={celestial} observerState={observer} cultureVersion={state.culture}
              moonPlacement={state.moonPlacement} onMoonPlacementChange={journeyStore.setMoonPlacement} onEnterSky={enterSky} onLocateMoon={locateMoon}
              chrome={sceneUI} onUIReady={registerEarthUI} />
              : <SkyView key={scope} observation={state.current} cultureVersion={state.culture} onCultureChange={journeyStore.setCulture}
                celestial={celestial} moonPlacement={state.moonPlacement} onMoonPlacementChange={journeyStore.setMoonPlacement} entryTransfer={transfer}
                onEditObservation={() => openPanel('birth')} initialState={skyViews.current[scope]} onStateChange={saveSkyView} chrome={sceneUI} />}
          </React.Suspense>
        </ViewBoundary>
      </div>
      {!panel && !immersed && <div className="experience-observation" data-sky-obstruction>
        <p>{state.current.source.label}{state.current.source.kind === 'example' ? ' · 示例' : ''}</p>
        <p>{state.current.civilDate} · {state.current.clock} · {state.current.observer.name}</p>
        {state.current.source.kind === 'history' && <><small>{state.current.timeSelection.origin === 'event-default-20' ? '默认当地 20:00 演示' : '所选当地时刻演示'}
          {state.current.observer.precision === 'representative' ? ' · 地区代表点' : ''}</small>
          {!immersed && <button onClick={() => journeyStore.returnToPersonal()}>{state.birth ? '回到我的出生时刻' : '回到此前天空'} ↗</button>}</>}
      </div>}
      <ExperiencePanel active={panel} onChange={openPanel} onClose={closePanel} onHost={setControlsHost} scene={view} returnFocus={exploreButton}>
        {birthOpened && <section hidden={panel !== 'birth'}>
          <p className="experience-intro">填写出生时刻与地点，查看当时的地月。</p>
          {state.current.source.kind === 'history' && <button className="journey-text-action" onClick={() => {
            journeyStore.returnToPersonal(); closePanel();
          }}>{state.birth ? '回到我的出生时刻' : '回到此前天空'} ↗</button>}
          <ObservationForm initial={state.birth || state.current} onSave={saveBirth} submitLabel="查看出生合照" />
          <p className="journey-hint">信息保存在当前浏览器会话，不会发送给史料或笔迹网站。</p>
        </section>}
        {historyOpened && <section hidden={panel !== 'history'}><React.Suspense fallback={<p role="status">正在打开古今资料…</p>}>
          <JourneyPanel embedded activeTab="history" onTabChange={next => openPanel(next === 'cultures' ? 'sky' : next)}
            onClose={closePanel} onObserve={enterHistory} onCulture={closePanel} />
        </React.Suspense></section>}
        {panel === 'sky' && <><CulturePicker value={state.culture} onChange={journeyStore.setCulture} />
          {view === 'earth' && <button className="journey-primary" onClick={() => { enterSky(); openPanel('sky'); }}>从此地观天 ↗</button>}</>}
        <div className="experience-shared-settings" hidden={panel !== 'appearance'}>
          <div className="experience-inline-actions"><button onClick={() => setImmersed(true)}>沉浸观看</button>
            <button onClick={() => void fullscreen()}>{appFullscreen ? '退出全屏' : '全屏观看'}</button></div>
          <div className="experience-audio"><span>环境音乐</span>{audioReady && <React.Suspense fallback={<span>正在准备…</span>}>
            <LocalAudioPlayer basePath={assetUrl('bgm/')} tracks={[{ title: 'Epic Mountain - The Egg', file: 'Epic Mountain - The Egg.mp3', artist: 'Epic Mountain' }]}
              compact autoPlay={false} playOnFirstInteraction={!mobile} />
          </React.Suspense>}</div>
        </div>
      </ExperiencePanel>
      {assetStatus && !immersed && <div className="asset-status" role="status">{assetStatus}</div>}
    </div>
  );
}
