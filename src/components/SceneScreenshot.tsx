import React from 'react';
import { createPortal } from 'react-dom';
import { journeyStore } from '../history/journeyStore';
import { captureKeepsakeDraft, type KeepsakeDraft } from '../keepsake/draft';

const KeepsakeEditor = React.lazy(() => import('./keepsake/KeepsakeEditor'));

export function SceneScreenshot() {
  const [image, setImage] = React.useState<string | null>(null);
  const [capturePending, setCapturePending] = React.useState(false);
  const [draft, setDraft] = React.useState<KeepsakeDraft | null>(null);
  const [draftError, setDraftError] = React.useState('');
  const [editing, setEditing] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!image) return;
    const background = Array.from(dialogRef.current?.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== dialogRef.current)
      .map(element => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    closeRef.current?.focus();
    return () => {
      background.forEach(({ element, inert }) => { element.inert = inert; });
      triggerRef.current?.focus();
    };
  }, [image]);
  React.useLayoutEffect(() => {
    if (image && !editing) cardRef.current?.focus();
  }, [image, editing]);
  React.useEffect(() => {
    if (!image) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (editing) setEditing(false);
      else { setImage(null); setDraft(null); }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [image, editing]);
  const close = () => { setImage(null); setDraft(null); setEditing(false); };
  return <>
    <button ref={triggerRef} className="btn" style={{ flex: 1 }} disabled={capturePending} onClick={async () => {
      setCapturePending(true);
      try {
        const viewport = document.querySelector('.fullscreen-mode .scene-viewport');
        if (viewport) {
          // The 3D canvas resizes after the fullscreen layout change. Avoid saving its old half-height frame.
          let ready = false;
          for (let frame = 0; frame < 120; frame++) {
            const canvas = viewport.querySelector('canvas');
            const target = viewport.getBoundingClientRect();
            const current = canvas?.getBoundingClientRect();
            if (current && Math.abs(current.width - target.width) < 2 && Math.abs(current.height - target.height) < 2) {
              ready = true;
              break;
            }
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          }
          if (!ready) throw new Error('Canvas resize timed out');
        }
        const captured = (window as any).captureLuBirth?.();
        if (!captured) throw new Error('Capture is unavailable');
        const state = journeyStore.getSnapshot();
        try {
          setDraft(captureKeepsakeDraft({ image: captured, observation: state.current, moonPlacement: state.moonPlacement,
            renderedFrameKey: (window as any).getLuBirthPerformance?.()?.backgroundFrameKey ?? null,
            renderedObservation: (window as any).getLuBirthSpatialState?.() ?? null }));
          setDraftError('');
        } catch (reason) { setDraft(null); setDraftError((reason as Error).message); }
        setEditing(false);
        setImage(captured);
      } catch { alert('截图失败，请稍后重试。'); }
      finally { setCapturePending(false); }
    }}>{capturePending ? '准备截图…' : '截图'}</button>
    {image && createPortal(<div ref={dialogRef} className="screenshot-preview" role="dialog" aria-modal="true" aria-label={editing ? '制作纪念卡' : '地月截图'} onClick={close} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),summary')]
        .filter(element => element.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      {editing && draft ? <div style={{width:'100%',display:'grid',placeItems:'center',minHeight:0}} onClick={event => event.stopPropagation()}>
        <React.Suspense fallback={<p role="status">正在打开纪念卡…</p>}><KeepsakeEditor draft={draft}
          onBack={() => setEditing(false)} onClose={close} /></React.Suspense>
      </div> : <div className="screenshot-content" onClick={e => e.stopPropagation()}>
        <img src={image} alt="当前地球与月球画面" />
        <p>手机可长按图片保存</p>
        <div className="row" style={{flexWrap:'wrap'}}>
          <a className="btn" href={image} download="LuBirth.png">保存图片</a>
          <button ref={cardRef} className="btn" disabled={!draft} onClick={() => setEditing(true)}>制作纪念卡</button>
          <button ref={closeRef} className="btn" onClick={close}>关闭预览</button>
        </div>
        {draftError && <p role="status" style={{fontSize:12,color:'#c7d0dc',maxWidth:360}}>{draftError}</p>}
      </div>}
    </div>, document.fullscreenElement ?? document.body)}
  </>;
}
