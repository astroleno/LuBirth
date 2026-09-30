import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './glass.css';

createRoot(document.getElementById('root')!).render(<App />);

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
const params = new URLSearchParams(window.location.search);
if (params.get('autotest') === '1' || params.get('fulltest') === '1') {
  void loadDiagnostics().then(async () => {
    if (params.get('autotest') === '1') await (window as any).runSolarAutoTests();
    if (params.get('fulltest') === '1') await (window as any).runSolarFullTests();
  }).catch(error => console.error('[Diagnostics] load failed', error));
}
