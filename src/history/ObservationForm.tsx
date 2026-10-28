import React, { Suspense, useId, useState } from 'react';
import { resolveObservation, timeBasisLabel, type Observation } from './observation';
import { locationLabel, selectedLocationDraft } from '../components/LocationSelector/locationDraft';
import { commitObserverDraft, coordinateDraftError, createObserverDraft, resolveObserverDraft, type ObserverDraft } from './observationDraft';

const LocationSelector = React.lazy(() => import('../components/LocationSelector').then(module => ({ default: module.LocationSelector })));

export function ObserverPicker({ draft, onChange, label = '观测地点', showCancel = true }: {
  draft: ObserverDraft; onChange: (draft: ObserverDraft) => void; label?: string; showCancel?: boolean;
}) {
  const id = useId();
  const change = React.useRef<HTMLButtonElement>(null), previousMode = React.useRef(draft.mode);
  const picker = React.useRef<HTMLDivElement>(null), focusEditor = React.useRef(false);
  React.useLayoutEffect(() => {
    if (draft.mode === 'summary' && previousMode.current !== 'summary') change.current?.focus({ preventScroll: true });
    previousMode.current = draft.mode;
  }, [draft.mode]);
  const error = draft.mode === 'coordinates' && Object.values(draft.coordinates).some(value => value.trim()) ? coordinateDraftError(draft) : '';
  const coordinate = (field: keyof ObserverDraft['coordinates'], value: string) => onChange({ ...draft, coordinates: { ...draft.coordinates, [field]: value } });
  return <div ref={picker} className="journey-place-picker" data-place-state={resolveObserverDraft(draft) ? 'selected' : 'pending'}
    onKeyDown={event => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) {
      event.preventDefault(); event.stopPropagation();
    } }}>
    {draft.mode === 'summary' && draft.selection ? <div className="journey-place-selection">
      <p className="journey-place-current">{draft.selection.name}<small>{draft.selection.latitude.toFixed(4)}°，{draft.selection.longitude.toFixed(4)}°</small></p>
      <button ref={change} type="button" className="journey-text-action" aria-label={'更改'+label}
        onClick={() => { focusEditor.current = true; onChange({ ...draft, mode: 'search' }); }}>更改</button>
    </div> : <>
      {draft.mode === 'search' ? <Suspense fallback={<p className="journey-hint" role="status">加载地点选择…</p>}>
        <LocationSelector inputLabel={'搜索'+label} draft={draft.search} onDraftChange={search => onChange({ ...draft, search })}
          onReady={input => {
            if (!focusEditor.current) return;
            focusEditor.current = false;
            if (document.activeElement === document.body || picker.current?.contains(document.activeElement)) input.focus({ preventScroll: true });
          }}
          onLocationChange={place => {
            const selected = { name: locationLabel(place), latitude: place.lat, longitude: place.lon, precision: 'user-selected' as const,
              note: '用户选择的现代行政地点代表点，不是建筑坐标。', source: '项目现有地点表' };
            onChange({ ...createObserverDraft(selected), search: selectedLocationDraft(place) });
          }} />
      </Suspense> : <div className="journey-coordinate-fields">
        <label htmlFor={id+'-name'}>{label}名称</label><input id={id+'-name'} value={draft.coordinates.name}
          placeholder="例如：伦敦市中心" onChange={event => coordinate('name', event.target.value)} />
        <div className="journey-columns"><div><label htmlFor={id+'-lat'}>纬度 · 北纬为正</label>
          <input id={id+'-lat'} type="number" min="-90" max="90" step="any" inputMode="decimal" value={draft.coordinates.latitude}
            aria-invalid={error.startsWith('纬度') || undefined} onChange={event => coordinate('latitude', event.target.value)} /></div>
          <div><label htmlFor={id+'-lon'}>经度 · 东经为正</label>
            <input id={id+'-lon'} type="number" min="-180" max="180" step="any" inputMode="decimal" value={draft.coordinates.longitude}
              aria-invalid={error.startsWith('经度') || undefined} onChange={event => coordinate('longitude', event.target.value)} /></div></div>
        {error && <p className="journey-error" role="status">{error}</p>}
      </div>}
      <div className="journey-place-actions">
        <button type="button" className="journey-text-action" onClick={() => onChange({ ...draft, mode: draft.mode === 'search' ? 'coordinates' : 'search' })}>
          {draft.mode === 'search' ? '境外地点／填写坐标' : '改用地名搜索'}</button>
        {showCancel && draft.selection && <button type="button" className="journey-text-action" aria-label={'取消更改，保留'+draft.selection.name}
          onClick={() => onChange(createObserverDraft(draft.selection))}>取消更改</button>}
      </div>
      {draft.mode === 'search' && draft.search.pending && <p className="journey-hint" role="status">请选择一个候选地点，选中即生效。</p>}
    </>}
  </div>;
}

export function OffsetField({ value, onChange }: { value: number; onChange: (minutes: number) => void }) {
  const id = useId();
  return <div><label htmlFor={id}>时区偏移 · 小时</label>
    <input id={id} aria-label="UTC 偏移小时" type="number" min="-14" max="14" step="0.25" value={Number.isFinite(value) ? value / 60 : ''}
      onChange={e => onChange(e.target.value === '' ? NaN : Number(e.target.value) * 60)} />
    <p className="journey-hint">{Number.isFinite(value) ? timeBasisLabel({ kind: 'offset', offsetMinutes: value }) : '请填写偏移'}。按你指定的偏移换算，历史夏令时请另行核对。</p>
  </div>;
}

export function ObservationSummary({ observation }: { observation: Observation }) {
  return <div className="journey-observation" data-observation-utc={observation.utc}
    data-observation-latitude={observation.observer.latitude} data-observation-longitude={observation.observer.longitude}>
    <strong>{observation.source.label}{observation.source.kind === 'history' ? ' · 演示' : observation.source.kind === 'example' ? ' · 示例' : ''}</strong>
    <p>{observation.civilDate}　{observation.clock}<br />{observation.observer.name}</p>
    <small>{timeBasisLabel(observation.timeBasis)}</small>
    {observation.source.kind === 'history' && <p className="journey-hint">{observation.timeSelection?.origin === 'event-default-20'
      ? '默认演示 20:00，并非事件发生钟点。' : observation.timeSelection?.origin === 'legacy-demo'
        ? '此前保存的演示时刻，地点精度以资料说明为准。' : '自选演示时刻，地点精度以资料说明为准。'}</p>}
  </div>;
}

export default function ObservationForm({ initial, onSave, submitLabel = '保存出生时刻' }: {
  initial: Observation; onSave: (observation: Observation) => void; submitLabel?: string;
}) {
  const id = useId();
  const [date, setDate] = useState(initial.civilDate), [clock, setClock] = useState(initial.clock.slice(0, 5));
  const [place, setPlace] = useState(() => createObserverDraft(initial.observer));
  const observer = resolveObserverDraft(place);
  const [offset, setOffset] = useState(initial.timeBasis.kind === 'offset' ? initial.timeBasis.offsetMinutes : 480);
  const [error, setError] = useState(''), [saved, setSaved] = useState(false);
  return <form className="journey-form" onChange={() => setSaved(false)} onSubmit={event => {
    event.preventDefault();
    try {
      if (!observer) throw new Error('请从候选中选定出生地点，或补全有效坐标。');
      const value = resolveObservation(date, clock, observer, { kind: 'offset', offsetMinutes: offset }, { kind: 'birth', label: '我的出生时刻' });
      setPlace(commitObserverDraft(place)); onSave(value); setError(''); setSaved(true);
    } catch (e) { setError((e as Error).message); }
  }}>
    <div className="journey-columns"><div><label htmlFor={id+'-date'}>出生日期 · 公历</label><input id={id+'-date'} type="date" aria-label="出生日期" min="0001-01-01" max="2999-12-31" required value={date} onChange={e => setDate(e.target.value)} /></div>
      <div><label htmlFor={id+'-clock'}>出生钟点</label><input id={id+'-clock'} type="time" aria-label="出生钟点" required value={clock} onChange={e => setClock(e.target.value)} /></div></div>
    <label>出生地点</label><ObserverPicker label="出生地点" draft={place} onChange={value => { setPlace(value); setSaved(false); setError(''); }} />
    <OffsetField value={offset} onChange={setOffset} />
    {initial.source.kind === 'example' && <p className="journey-hint">上面是示例信息。填写并保存后，才会成为你的出生基准。</p>}
    {error && <p className="journey-error" role="alert">{error}</p>}
    <button className="journey-primary" type="submit" disabled={!observer || !date || !clock || !Number.isFinite(offset)}>{submitLabel}</button>
    {saved && <p className="journey-status" role="status">出生时刻已保存，地月与观天共用这份时间地点。</p>}
  </form>;
}
