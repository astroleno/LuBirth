import React, { Suspense, useId, useState } from 'react';
import type { ObserverPlace } from './historyModel';
import { resolveObservation, timeBasisLabel, type Observation } from './observation';

const LocationSelector = React.lazy(() => import('../components/LocationSelector').then(module => ({ default: module.LocationSelector })));

export function ObserverPicker({ value, onChange }: { value: ObserverPlace | null; onChange: (value: ObserverPlace | null) => void }) {
  const id = useId();
  const [latitude, setLatitude] = useState(''), [longitude, setLongitude] = useState(''), [name, setName] = useState('');
  const updateCoordinates = (lat: string, lon: string, label: string) => {
    setLatitude(lat); setLongitude(lon); setName(label);
    onChange(lat.trim() && lon.trim() && label.trim() ? { name: label.trim(), latitude: Number(lat), longitude: Number(lon),
      precision: 'user-selected', note: '用户明确选择的观测位置' } : null);
  };
  return <div className="journey-place-picker">
    {value && <p className="journey-place-current">{value.name}<small>{value.latitude.toFixed(4)}°，{value.longitude.toFixed(4)}°</small></p>}
    <Suspense fallback={<p className="journey-hint" role="status">加载地点选择…</p>}><LocationSelector onLocationChange={({ lat, lon, city, district }) => {
      onChange({ name: [city, district].filter(Boolean).join(' · '), latitude: lat, longitude: lon, precision: 'user-selected',
        note: '用户选择的现代行政地点代表点，不是建筑坐标。', source: '项目现有地点表' });
    }} /></Suspense>
    <details className="journey-details"><summary>境外地点／直接填写坐标</summary>
      <label htmlFor={id+'-name'}>观测地点名称</label><input id={id+'-name'} value={name} placeholder="例如：伦敦市中心" onChange={e => updateCoordinates(latitude, longitude, e.target.value)} />
      <div className="journey-columns"><div><label htmlFor={id+'-lat'}>纬度 · 北纬为正</label><input id={id+'-lat'} type="number" min="-90" max="90" step="any" inputMode="decimal" value={latitude} onChange={e => updateCoordinates(e.target.value, longitude, name)} /></div>
        <div><label htmlFor={id+'-lon'}>经度 · 东经为正</label><input id={id+'-lon'} type="number" min="-180" max="180" step="any" inputMode="decimal" value={longitude} onChange={e => updateCoordinates(latitude, e.target.value, name)} /></div></div>
    </details>
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
  const [observer, setObserver] = useState<ObserverPlace | null>(initial.observer);
  const [offset, setOffset] = useState(initial.timeBasis.kind === 'offset' ? initial.timeBasis.offsetMinutes : 480);
  const [error, setError] = useState(''), [saved, setSaved] = useState(false);
  return <form className="journey-form" onChange={() => setSaved(false)} onSubmit={event => {
    event.preventDefault();
    try {
      if (!observer) throw new Error('请先选择出生地点。');
      const value = resolveObservation(date, clock, observer, { kind: 'offset', offsetMinutes: offset }, { kind: 'birth', label: '我的出生时刻' });
      onSave(value); setError(''); setSaved(true);
    } catch (e) { setError((e as Error).message); }
  }}>
    <div className="journey-columns"><div><label htmlFor={id+'-date'}>出生日期 · 公历</label><input id={id+'-date'} type="date" aria-label="出生日期" min="0001-01-01" max="2999-12-31" required value={date} onChange={e => setDate(e.target.value)} /></div>
      <div><label htmlFor={id+'-clock'}>出生钟点</label><input id={id+'-clock'} type="time" aria-label="出生钟点" required value={clock} onChange={e => setClock(e.target.value)} /></div></div>
    <label>出生地点</label><ObserverPicker value={observer} onChange={value => { setObserver(value); setSaved(false); }} />
    <OffsetField value={offset} onChange={setOffset} />
    {initial.source.kind === 'example' && <p className="journey-hint">上面是示例信息。填写并保存后，才会成为你的出生基准。</p>}
    {error && <p className="journey-error" role="alert">{error}</p>}
    <button className="journey-primary" type="submit">{submitLabel}</button>
    {saved && <p className="journey-status" role="status">出生时刻已保存，地月与观天共用这份时间地点。</p>}
  </form>;
}
