import React from 'react';
import type { ExperiencePanelKind } from './SceneUI';

const SECTIONS = [['birth', '出生'], ['history', '古今'], ['sky', '星空'], ['appearance', '画面']] as const;

export function ExperiencePanel({ active, onChange, onClose, onHost, children, scene, returnFocus }: {
  active: ExperiencePanelKind | null;
  onChange: (section: ExperiencePanelKind) => void;
  onClose: () => void;
  onHost: (element: HTMLDivElement | null) => void;
  children: React.ReactNode;
  scene: 'earth' | 'sky';
  returnFocus: React.RefObject<HTMLButtonElement>;
}) {
  const root = React.useRef<HTMLElement>(null), previous = React.useRef(active);
  const scroll = React.useRef<HTMLDivElement>(null);
  const positions = React.useRef(new Map<ExperiencePanelKind, number>());
  const focused = React.useRef(new Map<ExperiencePanelKind, HTMLElement>());
  React.useLayoutEffect(() => {
    if (active && scroll.current) scroll.current.scrollTop = positions.current.get(active) ?? 0;
    if (active && !previous.current) {
      const remembered = focused.current.get(active);
      const target = remembered?.isConnected && remembered.getClientRects().length ? remembered
        : root.current?.querySelector<HTMLElement>('[aria-selected=true]');
      target?.focus({ preventScroll: true });
    }
    if (!active && previous.current) returnFocus.current?.focus({ preventScroll: true });
    previous.current = active;
  }, [active, returnFocus]);
  React.useEffect(() => {
    if (!active) return;
    // Portaled scene controls follow a different React ancestry; handle Escape
    // at the native boundary so they close this same panel as the other tabs.
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || document.querySelector('.screenshot-preview')) return;
      event.preventDefault(); event.stopPropagation(); onClose();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [active, onClose]);
  return <aside ref={root} id="experience-panel" className="experience-panel" data-liquid-glass data-glass-variant="panel" data-sky-obstruction
    hidden={!active} aria-label="探索面板">
    <header className="experience-panel-heading">
      <nav role="tablist" aria-label="探索内容">{SECTIONS.map(([key, label], index) => <button
        key={key} id={'experience-tab-' + key} role="tab" aria-selected={active === key}
        aria-controls="experience-content" tabIndex={active === key ? 0 : -1} onClick={() => onChange(key)}
        onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % SECTIONS.length;
          else if (event.key === 'ArrowLeft') next = (index + SECTIONS.length - 1) % SECTIONS.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = SECTIONS.length - 1;
          else return;
          event.preventDefault(); onChange(SECTIONS[next][0]);
          root.current?.querySelector<HTMLElement>('#experience-tab-' + SECTIONS[next][0])?.focus();
        }}>{label}</button>)}</nav>
      <button type="button" className="experience-close" aria-label="关闭探索面板" onClick={onClose}>×</button>
    </header>
    <div ref={scroll} className="experience-panel-content" id="experience-content" role="tabpanel"
      aria-labelledby={'experience-tab-' + (active || 'birth')}
      onScroll={event => { if (active && !root.current?.hidden) positions.current.set(active, event.currentTarget.scrollTop); }}
      onFocusCapture={event => { if (active && event.target instanceof HTMLElement) focused.current.set(active, event.target); }}>
      {children}
      <div ref={onHost} className="experience-scene-controls" hidden={active !== 'appearance' && !(active === 'sky' && scene === 'sky')} />
    </div>
  </aside>;
}
