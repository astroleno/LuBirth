import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EarthScene } from './EarthScene';
import { ViewBoundary } from './components/experience/ViewBoundary';
import './glass.css';

const params = new URLSearchParams(window.location.search);
const standaloneEarth = params.get('dev') === '1';
createRoot(document.getElementById('root')!).render(standaloneEarth
  ? <ViewBoundary earth onBack={() => window.location.reload()}>
    <React.Suspense fallback={<div className="boot" role="status"><span className="boot-status">正在准备地月画面。</span></div>}>
      <EarthScene />
    </React.Suspense>
  </ViewBoundary>
  : <App />);

// Font files are visual polish rather than a prerequisite for the first scene.
// Load them once the base Earth/Moon frame is ready so they do not compete with
// the two textures that gate the loading overlay.
let fontScheduled = false;
const scheduleFonts = () => {
  if (fontScheduled) return;
  fontScheduled = true;
  const load = () => {
    if (document.querySelector('link[data-lubirth-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${import.meta.env.BASE_URL}fonts/inter.css`;
    link.dataset.lubirthFonts = 'true';
    document.head.appendChild(link);
  };
  const requestIdle = (window as any).requestIdleCallback as undefined | ((callback: () => void, options: { timeout: number }) => number);
  if (typeof requestIdle === 'function') requestIdle(load, { timeout: 1800 });
  else setTimeout(load, 250);
};
window.addEventListener('lubirth:assets-ready', scheduleFonts, { once: true });
window.addEventListener('lubirth:overlay-fade-start', scheduleFonts, { once: true });
if ((window as any).__lubirthAssetsReady) scheduleFonts();
window.setTimeout(scheduleFonts, 8000);

// Keep diagnostics available without parsing or executing them during normal startup.
const earthDiagnosticNames = ['runNoTiltAutoTest', 'runFixedSunAzimuthLockTest', 'runSeasonalAutoTest'] as const;
type DiagnosticWindow = Window & Partial<Record<typeof earthDiagnosticNames[number], () => unknown>> & {
  getLuBirthSpatialState?: () => { earthReady: boolean };
  __lubirthAssetsReady?: boolean;
};
const hasEarthView = () => standaloneEarth || (document.querySelector('[data-experience-root]')?.getAttribute('data-view')
  ?? (params.get('scene') === 'sky' ? 'sky' : 'earth')) === 'earth';

async function waitForEarthDiagnostics() {
  const browser: DiagnosticWindow = window;
  const deadline = performance.now() + 12000;
  const ready = () => browser.__lubirthAssetsReady && browser.getLuBirthSpatialState?.().earthReady
    && earthDiagnosticNames.every(name => typeof browser[name] === 'function');
  while (hasEarthView() && !ready() && performance.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

let diagnostics: Promise<void> | undefined;
const loadDiagnostics = () => diagnostics ??= import('./astro/browserDiagnostics')
  .then(module => {
    module.installDiagnostics();
    const runFullTests = (window as any).runSolarFullTests;
    (window as any).runSolarFullTests = async () => {
      await waitForEarthDiagnostics();
      return runFullTests();
    };
  })
  .catch(error => { diagnostics = undefined; throw error; });

for (const name of [
  'runSolarAutoTests', 'runSolarFullTests', 'runMoonPhaseAutoTests',
  'runMoonPhaseRenderValidation', 'runCameraPolarValidation', 'runBirthAlignDiagnostics',
]) {
  (window as any)[name] = async (...args: unknown[]) => {
    await loadDiagnostics();
    return (window as any)[name](...args);
  };
}
if (params.get('autotest') === '1' || params.get('fulltest') === '1') {
  void loadDiagnostics().then(async () => {
    if (params.get('autotest') === '1') await (window as any).runSolarAutoTests();
    if (params.get('fulltest') === '1') await (window as any).runSolarFullTests();
  }).catch(error => console.error('[Diagnostics] load failed', error));
}
