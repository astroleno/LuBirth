import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);
console.log('[Main] React root created');
root.render(<App />);
console.log('[Main] App render called');
