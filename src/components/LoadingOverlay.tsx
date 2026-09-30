import React from 'react';

interface LoadingOverlayProps {
  // 等待超过此时长后提供重试或手动进入，不假装资源已加载完成。
  durationMs?: number;
  // 最小展示时长（防止太快闪一下）。
  minShowMs?: number;
  // 淡出时长
  fadeMs?: number;
  // 场景就绪事件名（由场景派发）。
  readyEventName?: string;
  // 预热帧数：收到就绪后先渲染几帧再淡出
  prewarmFrames?: number;
}

export default function LoadingOverlay(props: LoadingOverlayProps) {
  const {
    durationMs = 8000,
    minShowMs = 1200,
    fadeMs = 800,
    readyEventName = 'lubirth:assets-ready',
    prewarmFrames = 3
  } = props;

  const [visible, setVisible] = React.useState(true);
  const [fading, setFading] = React.useState(false);
  const [progress, setProgress] = React.useState(() => (window as any).__lubirthAssetProgress ?? { loaded: 0, total: 2 });
  const [slow, setSlow] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    const update = (event: Event) => setProgress((event as CustomEvent).detail);
    const error = () => setFailed(true);
    window.addEventListener('lubirth:asset-progress', update);
    window.addEventListener('lubirth:asset-error', error);
    return () => { window.removeEventListener('lubirth:asset-progress', update); window.removeEventListener('lubirth:asset-error', error); };
  }, []);
  const mountedAtRef = React.useRef<number>(performance.now());
  const finishedRef = React.useRef<boolean>(false);
  const fadeTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => () => clearTimeout(fadeTimerRef.current), []);

  // 触发淡出与卸载
  const startFadeOut = React.useCallback(() => {
    if (finishedRef.current) return;
    try {
      finishedRef.current = true;
      try {
        // 通知场景：Overlay 开始淡出（可用于解锁自转）
        window.dispatchEvent(new CustomEvent('lubirth:overlay-fade-start'));
      } catch {}
      setFading(true);
      fadeTimerRef.current = setTimeout(() => setVisible(false), fadeMs);
    } catch (e) {
      console.error('[LoadingOverlay] fade out failed:', e);
      setVisible(false);
    }
  }, [fadeMs]);

  // 监听“就绪事件”→ 等待最小展示时间 → 预热 N 帧 → 淡出
  React.useEffect(() => {
    try {
      let rafId: number | null = null;
      let readyTimer: ReturnType<typeof setTimeout>;
      let scheduled = false;
      let prewarmCount = 0;

      const maybeFinish = () => {
        // 预热帧循环
        const pump = () => {
          prewarmCount++;
          if (prewarmCount >= prewarmFrames) {
            startFadeOut();
          } else {
            rafId = requestAnimationFrame(pump);
          }
        };
        rafId = requestAnimationFrame(pump);
      };

      const onReady = () => {
        if (scheduled) return;
        scheduled = true;
        // 等待最小展示时长
        const elapsed = performance.now() - mountedAtRef.current;
        const wait = Math.max(0, minShowMs - elapsed);
        readyTimer = setTimeout(maybeFinish, wait);
      };

      window.addEventListener(readyEventName, onReady as EventListener, { once: true });

      // 如果事件在组件挂载前已触发，则立即按已就绪处理
      try {
        const already = (window as any).__lubirthAssetsReady;
        if (already) onReady();
      } catch {}

      // 网络较慢时保持真实状态，同时提供退出加载层的入口。
      const maxTimer = setTimeout(() => {
        setSlow(true);
      }, durationMs);

      return () => {
        try {
          window.removeEventListener(readyEventName, onReady as EventListener);
          if (rafId) cancelAnimationFrame(rafId);
          clearTimeout(maxTimer);
          clearTimeout(readyTimer);
        } catch {}
      };
    } catch (e) {
      console.error('[LoadingOverlay] setup ready listener failed:', e);
    }
  }, [durationMs, minShowMs, prewarmFrames, readyEventName, startFadeOut]);

  if (!visible) return null;

  const renderWord = (text: string) => {
    return (
      <span className="lubirth-loading-word" aria-label={text}>
        {Array.from(text).map((ch, idx) => (
          <span
            className="lubirth-loading-char"
            data-index={idx}
            key={`${text}-${idx}`}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div
      className={`lubirth-loading-overlay${fading ? ' fading' : ''}`}
      role="status"
      aria-live="polite"
      style={{ ['--fadeMs' as any]: `${fadeMs}ms`, transitionDuration: `${fadeMs}ms` }}
    >
      <div className="lubirth-loading-container">
        <div className="lubirth-loading-line line-1">{renderWord('LuBirth')}</div>
        <div className="lubirth-loading-line line-2">{renderWord('Moon Earth You')}</div>
        <div className="loading-caption">
          <p>输入出生时间与地点，看看那一刻的地球与月相。</p>
          <progress className="loading-progress" value={progress.loaded} max={progress.total} aria-label="地月基础贴图加载进度" />
          <p>{failed ? '部分画面未能加载' : slow ? '连接较慢，地月画面仍在加载…' : `正在准备地月画面 · ${progress.loaded}/${progress.total}`}</p>
          {(failed || slow) && <div><button className="btn" onClick={() => window.location.reload()}>重新加载</button>{' '}<button className="btn" onClick={startFadeOut}>先进入场景</button></div>}
        </div>
      </div>
    </div>
  );
}
