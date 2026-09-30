import React from 'react';
import { createPortal } from 'react-dom';

export function SceneScreenshot() {
  const [image, setImage] = React.useState<string | null>(null);
  const [capturePending, setCapturePending] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!image) return;
    const background = Array.from(dialogRef.current?.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== dialogRef.current)
      .map(element => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    closeRef.current?.focus();
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImage(null);
    };
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('keydown', escape);
      background.forEach(({ element, inert }) => { element.inert = inert; });
      triggerRef.current?.focus();
    };
  }, [image]);
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
        setImage(captured);
      } catch { alert('截图失败，请稍后重试。'); }
      finally { setCapturePending(false); }
    }}>{capturePending ? '准备截图…' : '截图'}</button>
    {image && createPortal(<div ref={dialogRef} className="screenshot-preview" role="dialog" aria-modal="true" aria-label="地月截图" onClick={() => setImage(null)} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('a, button');
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <div className="screenshot-content" onClick={e => e.stopPropagation()}>
        <img src={image} alt="当前地球与月球画面" />
        <p>手机可长按图片保存</p>
        <div className="row">
          <a className="btn" href={image} download="LuBirth.png">保存图片</a>
          <button ref={closeRef} className="btn" onClick={() => setImage(null)}>关闭预览</button>
        </div>
      </div>
    </div>, document.fullscreenElement ?? document.body)}
  </>;
}
