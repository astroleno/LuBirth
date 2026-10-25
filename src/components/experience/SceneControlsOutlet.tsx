import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function SceneControlsOutlet({ host, active, children }: { host?: HTMLElement | null; active: boolean; children: ReactNode }) {
  if (host === undefined) return <>{children}</>;
  return host && active ? createPortal(children, host) : null;
}
