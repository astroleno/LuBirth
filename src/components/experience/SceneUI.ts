export type ExperiencePanelKind = 'birth' | 'history' | 'sky' | 'appearance';
export type SceneSection = 'sky' | 'appearance';

/** DOM destination only: each scene continues to own its presentation settings. */
export type SceneUIHost = {
  target: HTMLElement | null;
  section: SceneSection | null;
  open: (section: SceneSection) => void;
  close: () => void;
};

export type EarthUIActions = { setImmersed: (value: boolean) => void };
