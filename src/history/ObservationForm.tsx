import React, { Suspense, useEffect, useId, useState } from 'react';
import { offsetSecondsLabel, resolveObservation, timeBasisLabel, type Observation, type TimeBasis } from './observation';
import { resolveCivilTime, supportsTimeZone, type CivilTimeChoices } from './ianaTime';
import { isInLunarRange } from '../calendar/lunarRange';
import { locationLabel, selectedLocationDraft } from '../components/LocationSelector/locationDraft';
import { commitObserverDraft, coordinateDraftError, createObserverDraft, resolveObserverDraft, type ObserverDraft } from './observationDraft';

const LocationSelector = React.lazy(() => import('../components/LocationSelector').then(module => ({ default: module.LocationSelector })));
const LunarBirthDateFields = React.lazy(() => import('../calendar/LunarCalendarFields').then(module => ({ default: module.LunarBirthDateFields })));

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
              note: place.note ?? '用户选择的行政地点代表点。', source: place.source ?? '项目现有地点表', timeZone: place.timeZone };
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
          {draft.mode === 'search' ? '填写坐标' : '改用地名搜索'}</button>
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
    <input id={id} aria-label="UTC 偏移小时" type="number" min="-14" max="14" step="any" value={Number.isFinite(value) ? value / 60 : ''}
      onChange={e => onChange(e.target.value === '' ? NaN : Number(e.target.value) * 60)} />
    <p className="journey-hint">{Number.isInteger(value) ? timeBasisLabel({ kind: 'offset', offsetMinutes: value }) : '以小时填写 UTC 偏移，例如 −5 或 5.75'}。沿用所填偏移。</p>
  </div>;
}

type Fold = 'earlier' | 'later';
type IanaCheck = { key: string; result?: CivilTimeChoices; error?: string };

export function useIanaTimeChoices(enabled: boolean, date: string, clock: string, zone: string) {
  const key = [date, clock, zone].join('|');
  const valid = enabled && !!date && !!clock && supportsTimeZone(zone);
  const [check, setCheck] = useState<IanaCheck>();
  useEffect(() => {
    if (!valid) return;
    let active = true;
    resolveCivilTime(date, clock, zone).then(result => { if (active) setCheck({ key, result }); }, () => {
      if (active) setCheck({ key, error: '无法换算所填时区的钟点，请核对日期和时区。' });
    });
    return () => { active = false; };
  }, [valid, date, clock, zone, key]);
  const current = valid && check?.key === key ? check : undefined;
  return { key, loading: valid && !current, result: current?.result,
    error: enabled && zone && !supportsTimeZone(zone) ? '请选择有效的 IANA 时区。' : current?.error };
}

const commonTimeZones = {
  'Asia/Shanghai': '中国标准时间', 'Asia/Urumqi': '新疆地方民用习惯', 'Asia/Hong_Kong': '香港', 'Asia/Macau': '澳门',
  'Asia/Taipei': '台北', 'Asia/Tokyo': '东京', 'Asia/Seoul': '首尔', 'Asia/Singapore': '新加坡',
  'Asia/Kolkata': '印度', 'Asia/Kathmandu': '尼泊尔', 'Australia/Sydney': '悉尼', 'Pacific/Auckland': '奥克兰',
  'America/New_York': '纽约', 'America/Chicago': '芝加哥', 'America/Los_Angeles': '洛杉矶', 'America/Toronto': '多伦多',
  'Europe/London': '伦敦', 'Europe/Paris': '巴黎', 'Europe/Berlin': '柏林', 'UTC': '协调世界时',
};

export function IanaTimeFields({ zone, onZoneChange, check, fold, onFoldChange }: {
  zone: string; onZoneChange: (zone: string) => void; check: ReturnType<typeof useIanaTimeChoices>;
  fold: Fold | ''; onFoldChange: (fold: Fold | '') => void;
}) {
  const id = useId();
  const suggestions = React.useMemo(() => {
    const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
    return [...new Set([...Object.keys(commonTimeZones), ...(intl.supportedValuesOf?.('timeZone') ?? [])])];
  }, []);
  return <>
    <div><label htmlFor={id+'-zone'}>当地时区</label>
      <input id={id+'-zone'} value={zone} list={id+'-zones'} placeholder="例如 America/New_York" autoCapitalize="none"
        autoComplete="off" spellCheck={false} aria-invalid={!!check.error || undefined}
        onChange={event => onZoneChange(event.target.value)} />
      <datalist id={id+'-zones'}>{suggestions.map(value => <option key={value} value={value}
        label={commonTimeZones[value as keyof typeof commonTimeZones]} />)}</datalist>
      {!zone && <p className="journey-hint">坐标需选择当地 IANA 时区，也可改填固定 UTC 偏移。</p>}
    </div>
    {check.loading && <p className="journey-hint" role="status">正在核对当地钟点…</p>}
    {check.error && <p className="journey-error" role="alert">{check.error}</p>}
    {check.result?.kind === 'gap' && <p className="journey-error" role="alert">时区切换跳过了这个当地钟点。请选择当日实际存在的时间。</p>}
    {check.result?.kind === 'unique' && <p className="journey-hint">当时的偏移为 {offsetSecondsLabel(check.result.basis.offsetSeconds)}。</p>}
    {check.result?.kind === 'overlap' && <div>
      <label htmlFor={id+'-fold'}>这个钟点出现了两次</label>
      <select id={id+'-fold'} value={fold} onChange={event => onFoldChange(event.target.value as Fold | '')}>
        <option value="">选择哪一次</option>
        <option value="earlier">第一次 · {offsetSecondsLabel(check.result.earlier.offsetSeconds)}</option>
        <option value="later">第二次 · {offsetSecondsLabel(check.result.later.offsetSeconds)}</option>
      </select>
    </div>}
  </>;
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

export default function ObservationForm({ initial, onSave, active = true, submitLabel = '保存出生时刻' }: {
  initial: Observation; onSave: (observation: Observation) => void; active?: boolean; submitLabel?: string;
}) {
  const id = useId();
  const [date, setDate] = useState(initial.civilDate);
  const [dateMode, setDateMode] = useState<'gregorian' | 'lunar'>('gregorian');
  const [clock, setClock] = useState(initial.source.kind === 'birth' ? initial.clock : initial.clock.slice(0, 5));
  const [place, setPlace] = useState(() => createObserverDraft(initial.observer));
  const observer = resolveObserverDraft(place);
  const [basisKind, setBasisKind] = useState<TimeBasis['kind']>(initial.source.kind === 'birth' ? initial.timeBasis.kind : 'iana');
  const [offset, setOffset] = useState(initial.source.kind === 'birth' && initial.timeBasis.kind === 'offset'
    ? initial.timeBasis.offsetMinutes : NaN);
  const [zoneOverride, setZoneOverride] = useState<string | null>(initial.timeBasis.kind === 'iana'
    && initial.timeBasis.timeZone !== initial.observer.timeZone ? initial.timeBasis.timeZone : null);
  const zone = zoneOverride ?? observer?.timeZone ?? '';
  const canUseDate = !!date && (dateMode === 'gregorian' || isInLunarRange(date));
  const check = useIanaTimeChoices(active && basisKind === 'iana' && !!observer && canUseDate, date, clock, zone.trim());
  const [foldChoice, setFoldChoice] = useState<{ key: string; value: Fold | '' }>();
  const unchanged = initial.source.kind === 'birth' && date === initial.civilDate && clock === initial.clock
    && observer?.longitude === initial.observer.longitude && observer?.latitude === initial.observer.latitude;
  const savedZoneBasis = unchanged && initial.timeBasis.kind === 'iana' && initial.timeBasis.timeZone === zone.trim()
    ? initial.timeBasis : null;
  const fold = foldChoice?.key === check.key ? foldChoice.value : savedZoneBasis?.disambiguation ?? '';
  let basis: TimeBasis | undefined;
  if (basisKind === 'offset' && Number.isInteger(offset) && Math.abs(offset) <= 840) basis = { kind: 'offset', offsetMinutes: offset };
  if (basisKind === 'local-mean-solar') basis = { kind: 'local-mean-solar' };
  if (basisKind === 'iana') {
    if (savedZoneBasis && fold === (savedZoneBasis.disambiguation ?? '')) basis = savedZoneBasis;
    else if (check.result?.kind === 'unique') basis = check.result.basis;
    else if (check.result?.kind === 'overlap' && fold) basis = check.result[fold];
  }
  const [error, setError] = useState(''), [saved, setSaved] = useState(false);
  const clockField = <div><label htmlFor={id+'-clock'}>出生钟点</label><input id={id+'-clock'} type="time" aria-label="出生钟点"
    step={initial.source.kind === 'birth' && initial.clock.length > 5 ? 1 : 60} required value={clock}
    onChange={event => setClock(event.target.value)} /></div>;
  return <form className="journey-form" onChange={() => { setSaved(false); setError(''); }} onSubmit={event => {
    event.preventDefault();
    try {
      if (!observer) throw new Error('请从候选中选定出生地点，或补全有效坐标。');
      if (!canUseDate) throw new Error('请填写可用的出生日期。');
      if (!basis) throw new Error('请补全当地时区和钟点。');
      const value = resolveObservation(date, clock, observer, basis, { kind: 'birth', label: '我的出生时刻' });
      setPlace(commitObserverDraft(place)); onSave(value); setError(''); setSaved(true);
    } catch (e) { setError((e as Error).message); }
  }}>
    <div><label htmlFor={id+'-date-mode'}>出生日期历法</label>
      <select id={id+'-date-mode'} value={dateMode} onChange={event => setDateMode(event.target.value as typeof dateMode)}>
        <option value="gregorian">公历</option><option value="lunar">农历</option>
      </select>
    </div>
    {dateMode === 'gregorian' ? <div className="journey-columns">
      <div><label htmlFor={id+'-date'}>出生日期 · 公历</label><input id={id+'-date'} type="date" aria-label="出生日期"
        min="0001-01-01" max="2999-12-31" required value={date} onChange={event => setDate(event.target.value)} /></div>
      {clockField}
    </div> : <><Suspense fallback={<p className="journey-hint" role="status">正在加载农历…</p>}>
      <LunarBirthDateFields date={date} onDateChange={setDate} />
    </Suspense>{clockField}</>}
    <label>出生地点</label><ObserverPicker label="出生地点" draft={place} onChange={value => {
      const next = resolveObserverDraft(value);
      if (next && (next.latitude !== observer?.latitude || next.longitude !== observer?.longitude || next.timeZone !== observer?.timeZone)) {
        setZoneOverride(null); setFoldChoice(undefined);
      }
      setPlace(value); setSaved(false); setError('');
    }} />
    <div><label htmlFor={id+'-basis'}>钟点按什么时间记录</label>
      <select id={id+'-basis'} value={basisKind} onChange={event => setBasisKind(event.target.value as TimeBasis['kind'])}>
        <option value="iana">当地民用时间</option><option value="offset">固定 UTC 偏移</option>
        <option value="local-mean-solar">地方平太阳时</option>
      </select>
    </div>
    {basisKind === 'iana' && <IanaTimeFields zone={zone} onZoneChange={setZoneOverride} check={check} fold={fold}
      onFoldChange={value => setFoldChoice({ key: check.key, value })} />}
    {basisKind === 'offset' && <OffsetField value={offset} onChange={setOffset} />}
    {initial.source.kind === 'example' && <p className="journey-hint">上面是示例信息。填写并保存后，才会成为你的出生基准。</p>}
    {error && <p className="journey-error" role="alert">{error}</p>}
    <button className="journey-primary" type="submit" disabled={!observer || !canUseDate || !clock || !basis}>{submitLabel}</button>
    {saved && <p className="journey-status" role="status">出生时刻已保存，地月与观天共用这份时间地点。</p>}
  </form>;
}
