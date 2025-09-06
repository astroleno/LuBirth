import React from 'react';
import SimpleTest from './SimpleTest';

export default function App() {
  React.useEffect(() => {
    try { 
      console.log('[App] mounted - using SimpleTest scene'); 
    } catch {}
  }, []);

  // 使用 SimpleTest 组件作为主场景
  return <SimpleTest />;
}
