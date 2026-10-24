import React from 'react';
import { composeBirthCard } from '../../keepsake/compose';
import { initialCardOptions, type CardOptions, type KeepsakeDraft } from '../../keepsake/draft';
import { handwritingAsset, KEEPSAKE_TEMPLATES, type TemplateId } from '../../keepsake/templates';
import { createCardZip } from '../../keepsake/zip';
import './keepsake.css';

type ImageResult = { url: string; blob: Blob; templateId: TemplateId };
const aborted = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';
export default function KeepsakeEditor({ draft, onBack, onClose }: {
  draft: KeepsakeDraft; onBack: () => void; onClose: () => void;
}) {
  const [options, setOptions] = React.useState(() => initialCardOptions(draft));
  const [image, setImage] = React.useState<ImageResult | null>(null);
  const [error, setError] = React.useState(''), [working, setWorking] = React.useState(false);
  const [batchProgress, setBatchProgress] = React.useState(0), [zip, setZip] = React.useState<string | null>(null);
  const focus = React.useRef<HTMLButtonElement>(null), batch = React.useRef<AbortController | null>(null);
  const zipUrl = React.useRef<string | null>(null);
  const prepared = !!handwritingAsset(options.templateId);
  const allPrepared = KEEPSAKE_TEMPLATES.every(template => !!handwritingAsset(template.id));
  React.useEffect(() => {
    focus.current?.focus();
    return () => {
      batch.current?.abort(); batch.current = null;
      if (zipUrl.current) URL.revokeObjectURL(zipUrl.current);
    };
  }, []);
  React.useEffect(() => {
    const controller = new AbortController();
    let url: string | null = null;
    setImage(null); setError('');
    if (!prepared) { setWorking(false); return () => controller.abort(); }
    setWorking(true);
    // Coalesce slider/typing changes; one settled preview owns one temporary URL.
    const timer = setTimeout(() => {
      void composeBirthCard(draft, options, controller.signal).then(blob => {
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob); setImage({ url, blob, templateId: options.templateId });
      }).catch(reason => { if (!controller.signal.aborted && !aborted(reason)) setError((reason as Error).message); })
        .finally(() => { if (!controller.signal.aborted) setWorking(false); });
    }, 120);
    return () => { clearTimeout(timer); controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [draft, options, prepared]);
  React.useEffect(() => {
    if (zipUrl.current) URL.revokeObjectURL(zipUrl.current);
    zipUrl.current = null;
    setZip(null);
  }, [options]);
  const update = <K extends keyof CardOptions>(key: K, value: CardOptions[K]) => setOptions(previous => ({ ...previous, [key]: value }));
  const saveAll = async () => {
    const controller = new AbortController(); batch.current?.abort(); batch.current = controller;
    setBatchProgress(1); setError('');
    try {
      const files = [];
      for (let index = 0; index < KEEPSAKE_TEMPLATES.length; index++) {
        controller.signal.throwIfAborted(); setBatchProgress(index + 1);
        const template = KEEPSAKE_TEMPLATES[index];
        files.push({ name: `LuBirth-${template.text}-${draft.observation.civilDate}.png`,
          blob: await composeBirthCard(draft, { ...options, templateId: template.id }, controller.signal) });
      }
      const blob = await createCardZip(files, controller.signal); controller.signal.throwIfAborted();
      if (zipUrl.current) URL.revokeObjectURL(zipUrl.current);
      zipUrl.current = URL.createObjectURL(blob); setZip(zipUrl.current);
    } catch (reason) { if (!controller.signal.aborted && !aborted(reason)) setError((reason as Error).message); }
    finally { if (batch.current === controller) { batch.current = null; setBatchProgress(0); } }
  };
  return <div className="keepsake-editor">
    <header className="keepsake-heading"><button ref={focus} className="btn" onClick={onBack}>← 返回截图</button>
      <div><p>LuBirth · 留住这一刻</p><h2>制作纪念卡</h2></div><button className="btn" onClick={onClose}>关闭</button></header>
    <div className="keepsake-workspace">
      <section className="keepsake-preview" aria-label="纪念卡预览" aria-busy={working}>
        {image ? <img src={image.url} alt={KEEPSAKE_TEMPLATES.find(template => template.id === options.templateId)!.text + ' · 地月纪念卡'} />
          : <><img src={draft.sceneImage} alt="已冻结的地月截图" /><p role="status">{working ? '正在合成纪念卡…' : '手写模板准备中，原始截图仍可保存。'}</p></>}
      </section>
      <div className="keepsake-side"><section className="keepsake-controls" aria-label="纪念卡设置">
        <fieldset disabled={batchProgress > 0}><legend>选择寄语</legend>
          <div className="keepsake-templates">{KEEPSAKE_TEMPLATES.map(template => <label key={template.id}>
            <input type="radio" name="keepsake-template" value={template.id} checked={options.templateId === template.id}
              onChange={() => update('templateId', template.id)} /><span>{template.text}<small>{template.description}</small></span>
          </label>)}</div>
          <details className="keepsake-adjustments"><summary>调整文字</summary>
            <label>文字大小<input type="range" min=".8" max="1.2" step=".05" value={options.textScale} onChange={event => update('textScale', Number(event.target.value))} /></label>
            <label>左右位置<input type="range" min="0" max="1" step=".05" value={options.textPosition} onChange={event => update('textPosition', Number(event.target.value))} /></label>
          </details>
          <div className="keepsake-fields"><label><input type="checkbox" checked={options.showClock} onChange={event => update('showClock', event.target.checked)} />显示钟点</label>
            <label><input type="checkbox" checked={options.showPlace} onChange={event => update('showPlace', event.target.checked)} />显示地点</label>
            <label className="keepsake-signature">署名 · 可选<input type="text" maxLength={32} value={options.signature} placeholder="例如：爱你的爸爸妈妈"
              onChange={event => update('signature', event.target.value)} /><small>使用普通文字排版</small></label></div>
        </fieldset>
        <p className="keepsake-note">取景已经保留。切换场景不会改写这张卡片，图片在你的浏览器内合成。</p>
        {draft.observation.source.kind === 'history' && <p className="keepsake-note">历史卡会保留日期与演示时刻说明。</p>}
        {error && <p className="keepsake-error" role="alert">{error}</p>}
      </section>
        <div className="keepsake-downloads">
          {image && !working && !batchProgress ? <a className="btn btn-primary" href={image.url}
            download={`LuBirth-${KEEPSAKE_TEMPLATES.find(template => template.id === image.templateId)!.text}-${draft.observation.civilDate}.png`}>保存 PNG</a>
            : <button className="btn btn-primary" disabled>{working ? '正在合成…' : '保存 PNG'}</button>}
          {zip ? <a className="btn" href={zip} download={`LuBirth-三套纪念卡-${draft.observation.civilDate}.zip`}>保存三套 ZIP</a>
            : <button className="btn" disabled={!allPrepared || working || !!batchProgress} onClick={saveAll}>导出三套</button>}
          {batchProgress > 0 && <><p role="status">正在准备第 {batchProgress} / 3 张</p><button className="btn" onClick={() => batch.current?.abort()}>取消</button></>}
          {image && <p className="keepsake-note"><a href={image.url} target="_blank" rel="noreferrer">查看大图</a> · 手机上可长按预览图片保存</p>}
        </div>
      </div>
    </div>
  </div>;
}
