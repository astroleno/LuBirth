import React from 'react';
import { LoadingHandwriting } from './keepsake/LoadingHandwriting';
import { useReducedMotion } from '../performance/renderProfile';

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
  // 黑底完全退场后再显示应用操作界面。
  onComplete?: () => void;
}

export default function LoadingOverlay(props: LoadingOverlayProps) {
  const {
    durationMs = 8000,
    minShowMs = 0,
    fadeMs: configuredFadeMs = 800,
    readyEventName = 'lubirth:assets-ready',
    prewarmFrames = 3,
    onComplete
  } = props;
  const reducedMotion = useReducedMotion();
  const fadeMs = reducedMotion ? 0 : configuredFadeMs;
  const contentFadeMs = reducedMotion ? 0 : 180;

  const [visible, setVisible] = React.useState(true);
  const [clearing, setClearing] = React.useState(false);
  const [fading, setFading] = React.useState(false);
  const [progress, setProgress] = React.useState(() => (window as any).__lubirthAssetProgress ?? { loaded: 0, total: 2 });
  const [slow, setSlow] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [sceneReady, setSceneReady] = React.useState(false);
  const [handwritingComplete, setHandwritingComplete] = React.useState(false);
  const completeHandwriting = React.useCallback(() => setHandwritingComplete(true), []);
  React.useEffect(() => {
    const update = (event: Event) => setProgress((event as CustomEvent).detail);
    const error = () => setFailed(true);
    window.addEventListener('lubirth:asset-progress', update);
    window.addEventListener('lubirth:asset-error', error);
    return () => { window.removeEventListener('lubirth:asset-progress', update); window.removeEventListener('lubirth:asset-error', error); };
  }, []);
  const mountedAtRef = React.useRef<number>(performance.now());
  const finishedRef = React.useRef<boolean>(false);
  const clearTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
  const fadeTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => () => {
    clearTimeout(clearTimerRef.current);
    clearTimeout(fadeTimerRef.current);
  }, []);

  // 先在不透明黑底上收起文字，再露出场景，避免手写与场景叠印。
  const startFadeOut = React.useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setClearing(true);
    clearTimerRef.current = setTimeout(() => {
      (window as any).__lubirthOverlayFading = true;
      window.dispatchEvent(new CustomEvent('lubirth:overlay-fade-start'));
      setFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, fadeMs);
    }, contentFadeMs);
  }, [contentFadeMs, fadeMs, onComplete]);

  // Resource readiness and the handwriting timeline run independently.
  React.useEffect(() => {
    const onReady = () => setSceneReady(true);
    window.addEventListener(readyEventName, onReady);
    if ((window as any).__lubirthAssetsReady) onReady();
    const maxTimer = setTimeout(() => setSlow(true), durationMs);
    return () => {
      window.removeEventListener(readyEventName, onReady);
      clearTimeout(maxTimer);
    };
  }, [durationMs, readyEventName]);

  // Reveal only after both are complete; never cut a fast-load animation short.
  React.useEffect(() => {
    if (!sceneReady || !handwritingComplete) return;
    let rafId: number;
    let prewarmCount = 0;
    const pump = () => {
      if (++prewarmCount >= prewarmFrames) startFadeOut();
      else rafId = requestAnimationFrame(pump);
    };
    const timer = setTimeout(() => { rafId = requestAnimationFrame(pump); },
      Math.max(0, minShowMs - (performance.now() - mountedAtRef.current)));
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [sceneReady, handwritingComplete, minShowMs, prewarmFrames, startFadeOut]);

  if (!visible) return null;

  return (
    <div
      className={`lubirth-loading-overlay${clearing ? ' clearing' : ''}${fading ? ' fading' : ''}`}
      data-phase={fading ? 'revealing' : clearing ? 'clearing' : 'writing'}
      role="status"
      aria-live="polite"
      style={{ ['--fadeMs' as any]: `${fadeMs}ms`, ['--contentFadeMs' as any]: `${contentFadeMs}ms` }}
    >
      <div className="lubirth-loading-container">
        <LoadingHandwriting onComplete={completeHandwriting} reducedMotion={reducedMotion} />
        <span className="sr-only">地月基础画面已加载 {progress.loaded} / {progress.total}。</span>
      </div>
      {(failed || slow) && !clearing && <div className="loading-feedback">
        <p>{failed ? '部分画面未能加载' : sceneReady ? '开场文字仍在准备…' : '连接较慢，地月画面仍在加载…'}</p>
        <div className="loading-actions"><button onClick={() => window.location.reload()}>重新加载</button>
          <button onClick={startFadeOut}>先进入场景</button></div>
      </div>}
    </div>
  );
}
