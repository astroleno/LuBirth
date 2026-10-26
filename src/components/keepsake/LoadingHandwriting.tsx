import React from 'react';
import { chooseLoadingVariant } from '../../keepsake/loadingVariants';
import { assetUrl } from '../../utils/assetUrl';
import './loading-handwriting.css';

export function LoadingHandwriting({ onComplete, reducedMotion = false }: {
  onComplete: () => void; reducedMotion?: boolean;
}) {
  const [{ variant, seed }] = React.useState(() => chooseLoadingVariant());
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [mode, setMode] = React.useState<'pending' | 'revealing' | 'static'>('pending');
  const canvas = React.useRef<HTMLCanvasElement>(null), image = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    if (!loaded && !failed) return;
    if (failed || reducedMotion) {
      setMode('static');
      const timer = setTimeout(onComplete, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false, dispose: (() => void) | undefined;
    void import('./inkHandwriting').then(({ mountInkHandwriting }) => {
      if (cancelled || !canvas.current || !image.current) return;
      dispose = mountInkHandwriting({ canvas: canvas.current, glyph: image.current, indexUrl: assetUrl(variant.index),
        characters: variant.characters, durationMs: variant.durationMs, seed,
        onState: state => { if (!cancelled) setMode(state === 'revealing' ? 'revealing' : 'static'); },
        onComplete: () => { if (!cancelled) onComplete(); } });
    }).catch(() => { if (!cancelled) { setMode('static'); onComplete(); } });
    return () => { cancelled = true; dispose?.(); };
  }, [loaded, failed, reducedMotion, variant, seed, onComplete]);
  return <div className="loading-handwriting" data-loading-variant={variant.id} data-ink-state={mode}
    style={{ aspectRatio: `${variant.width} / ${variant.height}` }}>
    {!failed ? <img ref={image} src={assetUrl(variant.glyph)} width={variant.width} height={variant.height}
      alt={variant.text} crossOrigin="anonymous" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      : <p className="loading-handwriting-fallback">{variant.text}</p>}
    {!failed && !reducedMotion && <canvas ref={canvas} aria-hidden="true" />}
  </div>;
}
