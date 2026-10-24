import React from 'react';
import SimpleTest, { type EarthViewState } from './SimpleTest';
import LoadingOverlay from './components/LoadingOverlay';
import { useMobileLayout } from './performance/renderProfile';
import { journeyStore } from './history/journeyStore';
import type { Observation } from './history/observation';
import type { JourneyTab } from './history/JourneyPanel';
import type { SkyViewState } from './spikes/sky/main';
import ObservationForm, { ObservationSummary } from './history/ObservationForm';
import { createCelestialState, createObserverState } from './astro/celestialState';
import { createViewTransfer } from './history/viewBridge';
import type { ViewTransfer } from './history/viewBridge';
import { SpatialValidationProbe } from './performance/SpatialValidationProbe';
import './history/journey.css';

const SkyView = React.lazy(() => import('./spikes/sky/main'));
const JourneyPanel = React.lazy(() => import('./history/JourneyPanel'));

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
  const [panel, setPanel] = React.useState<JourneyTab | null>(() => new URLSearchParams(location.search).get('history') === '1' ? 'history' : null);
  const [earthHidden, setEarthHidden] = React.useState(false);
  const [earthStarted, setEarthStarted] = React.useState(view === 'earth');
  const [transfer, setTransfer] = React.useState<ViewTransfer | undefined>();
  const [earthTransfer, setEarthTransfer] = React.useState<ViewTransfer | undefined>();
  const celestial = React.useMemo(() => createCelestialState(state.current.utc), [state.current.utc]);
  const observer = React.useMemo(() => createObserverState(celestial, state.current.observer),
    [celestial, state.current.observer.latitude, state.current.observer.longitude]);
  const sceneRoot = React.useRef<HTMLDivElement>(null);
  const scope = state.current.source.kind === 'history' ? 'history' : 'personal';
  const earthViews = React.useRef<Partial<Record<'history' | 'personal', EarthViewState>>>({});
  const skyViews = React.useRef<Partial<Record<'history' | 'personal', SkyViewState>>>({});
  const saveEarthView = React.useCallback((value: EarthViewState) => { earthViews.current[scope] = value; setEarthHidden(value.uiHidden); }, [scope]);
  const saveSkyView = React.useCallback((value: SkyViewState) => { skyViews.current[scope] = value; }, [scope]);
  const closePanel = React.useCallback(() => setPanel(null), []);
  const consumeEarthTransfer = React.useCallback(() => setEarthTransfer(undefined), []);
  const enterHistory = React.useCallback((observation: Observation) => { journeyStore.enterHistory(observation);
    setEarthTransfer(createViewTransfer(observation, 'birth-point'));
    setEarthHidden(true); setPanel(null); setView('earth'); }, []);
  const enterSky = React.useCallback(() => { setTransfer(createViewTransfer(state.current, 'birth-point')); setPanel(null); setView('sky'); }, [state.current]);
  const locateMoon = React.useCallback(() => {
    journeyStore.setMoonPlacement('physical');
    setTransfer(createViewTransfer(state.current, 'locate-target', 'body:moon')); setPanel(null); setView('sky');
  }, [state.current]);
  const chooseCulture = React.useCallback(() => setPanel(null), []);
  React.useEffect(() => { if (sceneRoot.current) sceneRoot.current.inert = !!panel; }, [panel, view]);
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
    <div className={'journey-app' + (panel ? ' journey-panel-open' : '')} data-view={view} data-history={state.current.source.kind === 'history' || undefined}>
      {import.meta.env.DEV && new URLSearchParams(location.search).get('spatialtest') === '1' && <SpatialValidationProbe />}
      <nav className="journey-nav" aria-label="观看方式" hidden={view === 'earth' && earthHidden && !panel}>
        <button aria-current={view === 'earth' ? 'page' : undefined} onClick={() => { setView('earth'); setPanel(null); }}>地月</button>
        <button aria-current={view === 'sky' ? 'page' : undefined} onClick={() => {
          setTransfer(createViewTransfer(state.current, 'navigation')); setView('sky'); setPanel(null);
        }}>观天</button>
        <button aria-expanded={!!panel} onClick={() => setPanel(panel ? null : 'history')}>古今同源</button>
      </nav>
      {/* 基础地月画面稳定后尽快露出场景。 */}
      {earthStarted && <div hidden={view !== 'earth'}><LoadingOverlay
        durationMs={mobile ? 6000 : 4000}
        minShowMs={mobile ? 300 : 650}
        fadeMs={mobile ? 380 : 600}
        prewarmFrames={1}
      /></div>}
      <div ref={sceneRoot} className="journey-scene" aria-hidden={panel ? true : undefined}>
        <ViewBoundary key={view + scope} onBack={() => { setView('earth'); setPanel(null); }}>
          <React.Suspense fallback={<div className="journey-loading" role="status">正在打开{view === 'sky' ? '星空' : '地月'}…</div>}>
            {view === 'earth' ? <SimpleTest key={scope} observation={state.current} initialState={earthViews.current[scope]} onStateChange={saveEarthView}
              entryTransfer={earthTransfer} onEntryTransferConsumed={consumeEarthTransfer}
              celestial={celestial} observerState={observer} cultureVersion={state.culture}
              moonPlacement={state.moonPlacement} onMoonPlacementChange={journeyStore.setMoonPlacement} onEnterSky={enterSky} onLocateMoon={locateMoon}
              observationControls={<>
                <ObservationSummary observation={state.current} />
                {state.current.source.kind === 'history' ? <div className="journey-inline-actions"><button onClick={() => journeyStore.returnToPersonal()}>{state.birth ? '回到我的出生时刻' : '回到此前天空'}</button><button onClick={() => setPanel('history')}>浏览历史资料</button></div>
                  : <ObservationForm initial={state.birth || state.current} onSave={value => journeyStore.setBirth(value)} />}
              </>} />
              : <SkyView key={scope} observation={state.current} cultureVersion={state.culture} onCultureChange={journeyStore.setCulture}
                celestial={celestial} moonPlacement={state.moonPlacement} onMoonPlacementChange={journeyStore.setMoonPlacement} entryTransfer={transfer}
                onEditObservation={() => setPanel('birth')} initialState={skyViews.current[scope]} onStateChange={saveSkyView} />}
          </React.Suspense>
        </ViewBoundary>
      </div>
      {state.current.source.kind === 'history' && !panel && !(view === 'earth' && earthHidden) && <div className="journey-return">
        <p>{state.current.source.label} · {state.current.timeSelection.origin === 'event-default-20' ? '默认演示 20:00' : '演示时刻'}<br />{state.current.civilDate} {state.current.clock} · {state.current.observer.name}</p>
        <button onClick={() => journeyStore.returnToPersonal()}>{state.birth ? '回到我的出生时刻' : '回到此前天空'}</button>
      </div>}
      {panel && <React.Suspense fallback={<div className="journey-panel" role="status"><p style={{ padding: 28 }}>正在打开古今同源…</p><button className="journey-secondary" onClick={closePanel}>关闭</button></div>}>
        <JourneyPanel initialTab={panel} onClose={closePanel} onObserve={enterHistory} onCulture={chooseCulture} />
      </React.Suspense>}
      {assetStatus && !(view === 'earth' && earthHidden) && <div className="asset-status" role="status">{assetStatus}</div>}
    </div>
  );
}
