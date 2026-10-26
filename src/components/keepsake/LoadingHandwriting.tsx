import React from 'react';
import { handwritingAsset, KEEPSAKE_TEMPLATES, selectLoadingTemplate } from '../../keepsake/templates';
import { templateUrl } from '../../keepsake/templates';
import './loading-handwriting.css';

export function LoadingHandwriting({ onComplete, reducedMotion = false }: {
  onComplete: () => void; reducedMotion?: boolean;
}) {
  const [id] = React.useState(() => selectLoadingTemplate());
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const template = KEEPSAKE_TEMPLATES.find(item => item.id === id)!;
  const asset = handwritingAsset(id);
  React.useEffect(() => {
    if (!loaded && !failed && asset) return;
    // SVG animations start when the image loads, not when this component mounts.
    // Leave a short pause after the last character before revealing the scene.
    const duration = failed || !asset || reducedMotion ? 0 : asset.loadingDurationMs + 200;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [loaded, failed, asset, reducedMotion, onComplete]);
  return <div className="loading-handwriting">
    {asset && !failed ? <img src={templateUrl(asset.loading)} width={asset.width} height={asset.loadingHeight}
      alt={template.text} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      : <p className="loading-handwriting-fallback">{template.text}</p>}
  </div>;
}
