import React from 'react';
import SimpleTest from './SimpleTest';
import LoadingOverlay from './components/LoadingOverlay';
import { useMobileLayout } from './performance/renderProfile';

export default function App() {
  const mobile = useMobileLayout();
  const [assetStatus, setAssetStatus] = React.useState('');
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = (event: Event) => {
      clearTimeout(timer);
      const status = (event as CustomEvent<string>).detail;
      if (status === 'idle') { setAssetStatus(''); return; }
      setAssetStatus(status === 'loading' ? '正在加载月球地形…' : status === 'ready' ? '月球地形已就绪' : '月球地形加载失败，已保留基础月球');
      if (status !== 'loading') timer = setTimeout(() => setAssetStatus(''), 5000);
    };
    window.addEventListener('lubirth:moon-terrain', update);
    const failed = () => {
      if (!(window as any).__lubirthAssetsReady) return;
      clearTimeout(timer);
      setAssetStatus('部分细节未能加载，已保留基础画面');
      timer = setTimeout(() => setAssetStatus(''), 5000);
    };
    window.addEventListener('lubirth:asset-error', failed);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('lubirth:moon-terrain', update);
      window.removeEventListener('lubirth:asset-error', failed);
    };
  }, []);
  React.useEffect(() => {
    try { 
      console.log('[App] mounted - using SimpleTest scene'); 
    } catch {}
  }, []);

  // 使用 SimpleTest 组件作为主场景
  return (
    <>
      {/* 载入 3s，淡出更柔和 */}
      <LoadingOverlay
        durationMs={mobile ? 6000 : 4000}
        minShowMs={mobile ? 300 : 1200}
        fadeMs={mobile ? 450 : 2000}
        prewarmFrames={mobile ? 1 : 3}
      />
      <SimpleTest />
      {assetStatus && <div className="asset-status" role="status">{assetStatus}</div>}
    </>
  );
}
