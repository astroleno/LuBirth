import React from 'react';
import SimpleTest from './SimpleTest';
import LoadingOverlay from './components/LoadingOverlay';
import { useMobileLayout } from './performance/renderProfile';

export default function App() {
  const mobile = useMobileLayout();
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
    </>
  );
}
