import { useEffect, useState } from 'react';

/** Local acceptance diagnostics. Kept out of production and the normal product UI. */
export function SpatialValidationProbe() {
  const [snapshot, setSnapshot] = useState('{}');
  const [moonSuppressed, setMoonSuppressed] = useState(false);
  useEffect(() => {
    const update = () => {
      const debug = window as any;
      try {
        setSnapshot(JSON.stringify({ capturedAt: new Date().toISOString(),
          journey: debug.__luBirthJourney, earth: debug.getLuBirthSpatialState?.(),
          sky: debug.getLuBirthSkySpatialState?.(), performance: debug.getLuBirthPerformance?.(),
          skyMetrics: debug.__skySpike?.metrics, artCache: debug.__skySpike?.artCache,
          skySettings: debug.__skySpike?.settings, solarObjects: debug.__skySolarObjects,
          solarValidation: debug.__validationSolar,
          canvases: document.querySelectorAll('canvas').length,
        }));
      } catch (error) { setSnapshot(JSON.stringify({ error: String(error) })); }
    };
    update();
    const timer = window.setInterval(update, 500);
    return () => window.clearInterval(timer);
  }, []);
  return <>
    <output hidden data-testid="spatial-validation">{snapshot}</output>
    {new URLSearchParams(location.search).get('spatialcontrols') === '1' && <><button data-testid="validation-toggle-moon" style={{position:'fixed',right:8,bottom:8,zIndex:20000,fontSize:10,opacity:.65}}
      onClick={() => { const next = !moonSuppressed; setMoonSuppressed(next);
        (window as any).__validationMoonSuppressed = next;
        window.dispatchEvent(new CustomEvent('lubirth:validation-moon', {detail:next}));
      }}>{moonSuppressed ? '验收：恢复月球绘制' : '验收：暂停月球绘制'}</button>
    <button data-testid="validation-solar" style={{position:'fixed',right:8,bottom:35,zIndex:20000,fontSize:10,opacity:.65}}
      onClick={async () => { (window as any).__validationSolar = await (window as any).runSolarFullTests(); }}>验收：完整光照检查</button></>}
  </>;
}
