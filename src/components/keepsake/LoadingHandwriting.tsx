import React from 'react';
import { handwritingAsset, KEEPSAKE_TEMPLATES, selectLoadingTemplate } from '../../keepsake/templates';
import { templateUrl } from '../../keepsake/templates';
import './loading-handwriting.css';

export function LoadingHandwriting() {
  const [id] = React.useState(() => selectLoadingTemplate());
  const [failed, setFailed] = React.useState(false);
  const template = KEEPSAKE_TEMPLATES.find(item => item.id === id)!;
  const asset = handwritingAsset(id);
  return <div className="loading-handwriting">
    <p className="loading-handwriting-brand">LuBirth</p>
    {asset && !failed ? <img src={templateUrl(asset.loading)} width={asset.width} height={asset.height}
      alt={template.text} onError={() => setFailed(true)} />
      : <p className="loading-handwriting-fallback">{template.text}</p>}
    <p className="loading-handwriting-caption">Moon · Earth · You</p>
  </div>;
}
