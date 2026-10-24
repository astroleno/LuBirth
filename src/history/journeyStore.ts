import { exampleObservation, readObservation, type Observation } from './observation';

export type CultureVersion = 'chenzhuo' | 'song' | 'yuan' | 'modern';
export const CULTURE_VERSIONS: CultureVersion[] = ['chenzhuo', 'song', 'yuan', 'modern'];
export type MoonPlacement = 'portrait' | 'physical';
export type JourneyState = {
  current: Observation;
  birth: Observation | null;
  beforeHistory: Observation | null;
  culture: CultureVersion;
  favorites: string[];
  moonPlacement: MoonPlacement;
  storageWarning: string;
};
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
const SESSION_KEY = 'lubirth.observation.v1';
const PREF_KEY = 'lubirth.history-preferences.v1';

export function createJourneyStore(ports: { session?: StoragePort; preferences?: StoragePort; now?: Date } = {}) {
  let state: JourneyState = { current: exampleObservation(ports.now), birth: null, beforeHistory: null,
    culture: 'song', favorites: [], moonPlacement: 'portrait', storageWarning: '' };
  const listeners = new Set<() => void>();
  try {
    const value = ports.session?.getItem(SESSION_KEY);
    if (value) {
      const saved = JSON.parse(value);
      const current = readObservation(saved.current), birth = readObservation(saved.birth), before = readObservation(saved.beforeHistory);
      if (!current || (saved.birth && (!birth || birth.source.kind !== 'birth')) || (saved.beforeHistory && !before)) throw new Error('Invalid saved observation');
      state = { ...state, current, birth, beforeHistory: before };
    }
  } catch { state.storageWarning = '之前的观察记录未能读取，已使用示例天空。'; }
  try {
    const value = ports.preferences?.getItem(PREF_KEY);
    if (value) {
      const saved = JSON.parse(value);
      if (!CULTURE_VERSIONS.includes(saved.culture) || !Array.isArray(saved.favorites)
        || saved.favorites.some((id: unknown) => typeof id !== 'string' || !/^dsh:[A-Za-z0-9_-]+$/.test(id))) throw new Error('Invalid preferences');
      state = { ...state, culture: saved.culture, favorites: [...new Set<string>(saved.favorites)],
        moonPlacement: saved.moonPlacement === 'physical' ? 'physical' : 'portrait' };
    }
  } catch { state.storageWarning = '本机偏好未能读取，收藏仍可在当前页面使用。'; }

  const publish = (next: JourneyState) => {
    state = next;
    try { ports.session?.setItem(SESSION_KEY, JSON.stringify({ current: state.current, birth: state.birth, beforeHistory: state.beforeHistory })); }
    catch { state = { ...state, storageWarning: '浏览器未允许保存观察信息；当前页面仍可使用。' }; }
    try { ports.preferences?.setItem(PREF_KEY, JSON.stringify({ culture: state.culture, favorites: state.favorites, moonPlacement: state.moonPlacement })); }
    catch { state = { ...state, storageWarning: '浏览器未允许保存收藏与偏好；当前页面仍可使用。' }; }
    listeners.forEach(listener => listener());
  };
  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setBirth(observation: Observation) {
      const parsed = readObservation(observation);
      if (!parsed || parsed.source.kind !== 'birth') throw new Error('Expected a valid personal observation');
      publish({ ...state, current: parsed, birth: parsed, beforeHistory: null });
    },
    enterHistory(observation: Observation) {
      const parsed = readObservation(observation);
      if (!parsed || parsed.source.kind !== 'history' || !parsed.source.recordId) throw new Error('Expected a resolved historical demonstration');
      publish({ ...state, current: parsed, beforeHistory: state.current.source.kind === 'history' ? state.beforeHistory : state.current });
    },
    returnToPersonal() {
      const previous = state.birth || state.beforeHistory;
      if (previous) publish({ ...state, current: previous, beforeHistory: null });
    },
    setCulture(culture: CultureVersion) {
      if (!CULTURE_VERSIONS.includes(culture)) throw new Error('Unknown culture version');
      publish({ ...state, culture });
    },
    setMoonPlacement(moonPlacement: MoonPlacement) {
      if (moonPlacement !== 'portrait' && moonPlacement !== 'physical') throw new Error('未知的月球位置方式。');
      publish({ ...state, moonPlacement });
    },
    toggleFavorite(id: string) {
      if (!/^dsh:[A-Za-z0-9_-]+$/.test(id)) throw new Error('Invalid record ID');
      publish({ ...state, favorites: state.favorites.includes(id) ? state.favorites.filter(item => item !== id) : [...state.favorites, id] });
    },
  };
}

function browserStorage(kind: 'sessionStorage' | 'localStorage'): StoragePort | undefined {
  try { return typeof window === 'undefined' ? undefined : window[kind]; }
  catch { return { getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); } }; }
}
export const journeyStore = createJourneyStore({ session: browserStorage('sessionStorage'), preferences: browserStorage('localStorage') });
