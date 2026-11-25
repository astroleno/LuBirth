import { lazy } from 'react';

// The standalone diagnostics entry and the experience share the same import.
export const EarthScene = lazy(() => import('./SimpleTest'));
