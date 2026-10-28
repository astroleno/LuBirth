import { createLocationSearchDraft, type LocationSearchDraft } from '../components/LocationSelector/locationDraft';
import type { HistoryRecord, ObserverPlace } from './historyModel';
import { exampleObservation, validateObserver, type Observation } from './observation';
import { resolveHistoryChoices, type HistoryClockChoice } from './historyObservationPolicy';

export type ObserverDraft = {
  selection: ObserverPlace | null;
  mode: 'summary' | 'search' | 'coordinates';
  search: LocationSearchDraft;
  coordinates: { name: string; latitude: string; longitude: string };
};

export function createObserverDraft(selection: ObserverPlace | null): ObserverDraft {
  return { selection: selection ? { ...selection } : null, mode: selection ? 'summary' : 'search',
    search: createLocationSearchDraft(selection?.name),
    coordinates: { name: selection?.name ?? '', latitude: selection ? String(selection.latitude) : '',
      longitude: selection ? String(selection.longitude) : '' } };
}

export function coordinateDraftError(draft: ObserverDraft): string {
  const fields = draft.coordinates;
  if (!fields.name.trim()) return '请填写观测地点名称。';
  if (!fields.latitude.trim() || !Number.isFinite(Number(fields.latitude)) || Math.abs(Number(fields.latitude)) > 90)
    return '纬度请填写 −90 到 90 之间的数值。';
  if (!fields.longitude.trim() || !Number.isFinite(Number(fields.longitude)) || Math.abs(Number(fields.longitude)) > 180)
    return '经度请填写 −180 到 180 之间的数值。';
  return '';
}

/** One submission boundary for search, administrative selection and coordinates. */
export function resolveObserverDraft(draft: ObserverDraft): ObserverPlace | null {
  if (draft.mode === 'coordinates') {
    if (coordinateDraftError(draft)) return null;
    const name = draft.coordinates.name.trim(), latitude = Number(draft.coordinates.latitude), longitude = Number(draft.coordinates.longitude);
    if (draft.selection?.name === name && draft.selection.latitude === latitude && draft.selection.longitude === longitude)
      return draft.selection;
    return { name, latitude, longitude, precision: 'user-selected', note: '用户明确填写的观测位置' };
  }
  return draft.mode === 'search' && draft.search.pending ? null : draft.selection;
}

export function commitObserverDraft(draft: ObserverDraft): ObserverDraft {
  const selected = resolveObserverDraft(draft);
  return selected ? { ...createObserverDraft(selected), search: { ...draft.search, query: selected.name, pending: false } } : draft;
}

export type HistoryPlaceMode = 'record' | 'current' | 'personal' | 'custom';
export type HistoryPlaceSnapshot = {
  placeMode: HistoryPlaceMode;
  custom: ObserverDraft;
  reusedPlace: ObserverPlace | null;
  reusedOrigin: string;
};
export type HistoricalDraft = {
  clockChoice: HistoryClockChoice;
  basis: 'local-mean-solar' | 'offset';
  offset: number;
  placeMode: HistoryPlaceMode;
  custom: ObserverDraft;
  reusedPlace: ObserverPlace | null;
  reusedOrigin: string;
  placeBeforeEdit: HistoryPlaceSnapshot | null;
  placeOpen: boolean;
  adjusting: boolean;
  sourceOpen: boolean;
  watched: boolean;
};

export function createHistoricalDraft(record: HistoryRecord, current?: Observation): HistoricalDraft {
  const draft: HistoricalDraft = { clockChoice: resolveHistoryChoices(record), basis: 'local-mean-solar', offset: 480,
    placeMode: record.place.observer ? 'record' : 'custom', custom: createObserverDraft(null), reusedPlace: null,
    reusedOrigin: '', placeBeforeEdit: null, placeOpen: !record.place.observer, adjusting: false, sourceOpen: false, watched: false };
  if (current?.source.kind === 'history' && current.source.recordId === record.id
    && current.source.recordHash === record.provenance.recordHash) {
    draft.clockChoice = { clock: current.clock, timeSelection: { ...current.timeSelection } };
    draft.basis = current.timeBasis.kind;
    if (current.timeBasis.kind === 'offset') draft.offset = current.timeBasis.offsetMinutes;
    const point = record.place.observer;
    if (!point || point.name !== current.observer.name || point.latitude !== current.observer.latitude
      || point.longitude !== current.observer.longitude || current.observer.precision !== 'representative') {
      draft.placeMode = 'custom'; draft.custom = createObserverDraft(current.observer);
    }
    draft.placeOpen = false; draft.watched = true;
  }
  return draft;
}

export function historicalDraftObserver(record: HistoryRecord, draft: HistoricalDraft): ObserverPlace | null {
  if (draft.placeMode === 'record') return record.place.observer ?? null;
  if (draft.placeMode === 'custom') return resolveObserverDraft(draft.custom);
  return draft.reusedPlace;
}

export function beginHistoricalPlaceEdit(record: HistoryRecord, draft: HistoricalDraft): HistoricalDraft {
  const placeBeforeEdit = draft.placeBeforeEdit ?? (historicalDraftObserver(record, draft) ? {
    placeMode: draft.placeMode,
    custom: { ...draft.custom, selection: draft.custom.selection ? { ...draft.custom.selection } : null,
      search: { ...draft.custom.search }, coordinates: { ...draft.custom.coordinates } },
    reusedPlace: draft.reusedPlace ? { ...draft.reusedPlace } : null,
    reusedOrigin: draft.reusedOrigin,
  } : null);
  return { ...draft, placeBeforeEdit, placeOpen: true,
    custom: draft.placeMode === 'custom' && draft.custom.mode === 'summary' ? { ...draft.custom, mode: 'search' } : draft.custom };
}

export function cancelHistoricalPlaceEdit(draft: HistoricalDraft): HistoricalDraft {
  return draft.placeBeforeEdit ? { ...draft, ...draft.placeBeforeEdit, placeBeforeEdit: null, placeOpen: false } : draft;
}

export function observationPlaceOrigin(observation: Observation) {
  return observation.source.kind === 'history' ? `${observation.source.label} · 历史演示`
    : observation.source.kind === 'birth' ? '我的出生地点' : '示例画面的地点';
}

/** Historical browsing must never initialize the personal form. */
export function personalObservationInitial(state: { birth: Observation | null; current: Observation; beforeHistory: Observation | null }): Observation {
  if (state.birth) return state.birth;
  if (state.current.source.kind !== 'history') return state.current;
  if (state.beforeHistory && state.beforeHistory.source.kind !== 'history') return state.beforeHistory;
  return exampleObservation();
}

type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
const DRAFT_RULE = 'history-ux-v2';
function validPlace(value: unknown): value is ObserverPlace {
  if (value === null) return false;
  try {
    const place = validateObserver(value as ObserverPlace);
    return place.name.length <= 300 && ['representative', 'user-selected'].includes(place.precision)
      && typeof place.note === 'string' && place.note.length <= 2000
      && (place.source === undefined || (typeof place.source === 'string' && place.source.length <= 1000));
  } catch { return false; }
}

function readObserverDraft(value: unknown): ObserverDraft | null {
  const draft = value as ObserverDraft;
  if (!draft || !['summary', 'search', 'coordinates'].includes(draft.mode)
    || (draft.selection !== null && !validPlace(draft.selection)) || !draft.coordinates || !draft.search) return null;
  if (!Object.values(draft.coordinates).every(v => typeof v === 'string' && v.length <= 300)
    || !['name', 'latitude', 'longitude'].every(key => typeof draft.coordinates[key as keyof typeof draft.coordinates] === 'string')
    || !['query', 'province', 'city', 'district'].every(key => typeof draft.search[key as keyof LocationSearchDraft] === 'string'
      && String(draft.search[key as keyof LocationSearchDraft]).length <= 300) || typeof draft.search.pending !== 'boolean') return null;
  return draft;
}

function readHistoricalDraft(value: unknown, record: HistoryRecord): HistoricalDraft | null {
  try {
    const entry = value as { rule: string; hash: string; draft: HistoricalDraft };
    if (!entry || entry.rule !== DRAFT_RULE || entry.hash !== record.provenance.recordHash) return null;
    const draft = entry.draft, custom = readObserverDraft(draft?.custom);
    if (!draft || !custom || !['record', 'current', 'personal', 'custom'].includes(draft.placeMode)
      || !['offset', 'local-mean-solar'].includes(draft.basis)
      || (draft.reusedPlace !== null && !validPlace(draft.reusedPlace)) || typeof draft.reusedOrigin !== 'string'
      || draft.reusedOrigin.length > 500 || !['placeOpen', 'adjusting', 'sourceOpen', 'watched'].every(key => typeof draft[key as keyof HistoricalDraft] === 'boolean')) return null;
    const before = draft.placeBeforeEdit;
    if (before !== null && (!before || !['record', 'current', 'personal', 'custom'].includes(before.placeMode)
      || !readObserverDraft(before.custom) || (before.reusedPlace !== null && !validPlace(before.reusedPlace))
      || typeof before.reusedOrigin !== 'string' || before.reusedOrigin.length > 500
      || !historicalDraftObserver(record, { ...draft, ...before }))) return null;
    const clock = draft.clockChoice?.clock;
    if (typeof clock !== 'string' || (clock !== '' && !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(clock))) return null;
    const clockChoice = resolveHistoryChoices(record, { clock, useDefault: draft.clockChoice.timeSelection?.origin === 'event-default-20' });
    const offset = draft.offset === null ? NaN : draft.offset;
    if (typeof offset !== 'number' || (Number.isFinite(offset) && (!Number.isInteger(offset) || Math.abs(offset) > 840))) return null;
    return { ...draft, clockChoice, custom, offset };
  } catch { return null; }
}

/** Local input never publishes global Observation or triggers the 3D scene. */
export function createHistoryDraftCache(storage?: StoragePort) {
  const values = new Map<string, HistoricalDraft>();
  const pending = new Map<string, { record: HistoryRecord; draft: HistoricalDraft }>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const key = (record: HistoryRecord) => `${record.id}:${record.provenance.recordHash}`;
  const storageKey = (record: HistoryRecord) => `lubirth.history-draft.v1:${record.id}`;
  const flush = () => {
    clearTimeout(timer); timer = undefined;
    for (const { record, draft } of pending.values()) {
      try { storage?.setItem(storageKey(record), JSON.stringify({ rule: DRAFT_RULE, hash: record.provenance.recordHash, draft })); }
      catch { /* The in-memory draft remains usable when session storage is unavailable. */ }
    }
    pending.clear();
  };
  return {
    get(record: HistoryRecord, current?: Observation) {
      const cached = values.get(key(record));
      if (cached) return cached;
      let restored: HistoricalDraft | null = null;
      try { restored = readHistoricalDraft(JSON.parse(storage?.getItem(storageKey(record)) || 'null'), record); } catch { /* Safe initial draft below. */ }
      const draft = restored ?? createHistoricalDraft(record, current);
      values.set(key(record), draft); return draft;
    },
    set(record: HistoryRecord, draft: HistoricalDraft) {
      values.set(key(record), draft); pending.set(record.id, { record, draft });
      clearTimeout(timer); timer = setTimeout(flush, 250);
    },
    flush,
    dispose: flush,
  };
}
