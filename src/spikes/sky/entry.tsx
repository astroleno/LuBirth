import React from 'react';
import { createRoot } from 'react-dom/client';
import SkySpike from './main';

const root = createRoot(document.getElementById('root')!);
root.render(<SkySpike />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
