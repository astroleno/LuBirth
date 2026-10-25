import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import SimpleTest from './SimpleTest';
import './glass.css';

const params = new URLSearchParams(window.location.search);
createRoot(document.getElementById('root')!).render(params.get('dev') === '1' ? <SimpleTest /> : <App />);

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
let diagnostics: Promise<void> | undefined;
const loadDiagnostics = () => diagnostics ??= import('./astro/browserDiagnostics')
  .then(module => module.installDiagnostics())
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
