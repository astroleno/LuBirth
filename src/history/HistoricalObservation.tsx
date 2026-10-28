import React, { useId, useState, useSyncExternalStore } from 'react';
import type { HistoryRecord } from './historyModel';
import { CALENDAR_LABELS, CALENDAR_NOTES } from './historyModel';
import { historyObservation, type Observation, type TimeBasis } from './observation';
import { journeyStore } from './journeyStore';
import { CULTURE_INFO, contemporaryCulture } from './cultureVersions';
import { ObserverPicker, OffsetField } from './ObservationForm';
import { resolveHistoryChoices } from './historyObservationPolicy';
import { beginHistoricalPlaceEdit, cancelHistoricalPlaceEdit, commitObserverDraft, historicalDraftObserver, observationPlaceOrigin, type HistoricalDraft, type HistoryPlaceMode } from './observationDraft';

export default function HistoricalObservation({ record, initialDraft, onDraftChange, onObserve, onCulture }: {
  record: HistoryRecord; initialDraft: HistoricalDraft; onDraftChange: (draft: HistoricalDraft) => void;
  onObserve: (value: Observation) => void; onCulture: () => void;
}) {
  const state = useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot);
  const [draft, setDraft] = useState(initialDraft), [error, setError] = useState('');
  const [clockEntryOpen, setClockEntryOpen] = useState(!initialDraft.clockChoice.clock);
  const id = useId(), confirm = React.useRef<HTMLButtonElement>(null);
  const changePlace = React.useRef<HTMLButtonElement>(null), placeWasOpen = React.useRef(draft.placeOpen);
  const placeMode = React.useRef<HTMLSelectElement>(null);
  React.useLayoutEffect(() => {
    if (placeWasOpen.current && !draft.placeOpen) changePlace.current?.focus({ preventScroll: true });
    if (!placeWasOpen.current && draft.placeOpen) placeMode.current?.focus({ preventScroll: true });
    placeWasOpen.current = draft.placeOpen;
  }, [draft.placeOpen]);
  const observer = historicalDraftObserver(record, draft), clock = draft.clockChoice.clock;
  const validOffset = draft.basis === 'local-mean-solar' || (Number.isInteger(draft.offset) && Math.abs(draft.offset) <= 840);
  const ready = !!observer && !!clock && validOffset;
  const update = (patch: Partial<HistoricalDraft>, changesObservation = true) => {
    const next = { ...draft, ...patch, watched: changesObservation ? false : (patch.watched ?? draft.watched) };
    setDraft(next); onDraftChange(next); setError('');
  };
  const selectPlace = (mode: HistoryPlaceMode) => {
    const from = mode === 'personal' ? state.birth : state.current;
    const reused = mode === 'current' || mode === 'personal';
    update({ placeMode: mode, ...(reused && from ? {
      reusedPlace: { ...from.observer, precision: 'user-selected', note: '沿用此前选择的位置，仅用于演示，不作为本条历史发生地。' },
      reusedOrigin: observationPlaceOrigin(from),
    } : {}), placeOpen: mode === 'custom', placeBeforeEdit: mode === 'custom' ? draft.placeBeforeEdit : null,
    ...(mode === 'custom' ? { custom: { ...draft.custom, mode: draft.custom.selection ? 'search' : draft.custom.mode } } : {}) });
  };
  const clockField = <><label htmlFor={id+'-clock'}>演示钟点</label><div className="journey-clock">
    <input id={id+'-clock'} name="history-clock" type="time" required value={clock}
      onChange={event => {
        if (!event.target.value) setClockEntryOpen(true);
        update({ clockChoice: resolveHistoryChoices(record, { clock: event.target.value }) });
      }} />
    <button type="button" onClick={() => {
      setClockEntryOpen(false);
      update({ clockChoice: resolveHistoryChoices(record, { clock: '20:00', useDefault: record.kind === 'event' }) });
    }}>
      {record.kind === 'event' ? '恢复晚上 8 点' : '选晚上 8 点'}</button>
  </div></>;
  const culture = contemporaryCulture(Number(record.date.iso.slice(0, 4)));
  const currentOptionName = draft.placeMode === 'current' && draft.reusedPlace ? draft.reusedPlace.name : state.current.observer.name;
  const currentOrigin = draft.placeMode === 'current' ? draft.reusedOrigin : observationPlaceOrigin(state.current);
  return <div className="journey-history-detail" data-history-record={record.id}>
    <form className="journey-form journey-history-form" aria-label={record.name+'的合照设置'} onSubmit={event => {
      event.preventDefault();
      // This labelled action, next to the visible assumptions, is the single confirmation.
      if ((event.nativeEvent as SubmitEvent).submitter !== confirm.current) return;
      try {
        const timeBasis: TimeBasis = draft.basis === 'offset' ? { kind: 'offset', offsetMinutes: draft.offset } : { kind: 'local-mean-solar' };
        const observation = historyObservation(record, { clock, observer, timeBasis, timeSelection: draft.clockChoice.timeSelection,
          dateAcknowledged: true, placeConfirmed: !!observer });
        setClockEntryOpen(false);
        update({ custom: commitObserverDraft(draft.custom), watched: true, placeOpen: false, placeBeforeEdit: null }, false);
        onObserve(observation);
      } catch (reason) { setError((reason as Error).message); }
    }}>
      <p className="journey-watch-date">{record.date.iso} <span>· {clock ? clock + ' 当地' : '请选择演示钟点'}</span></p>
      {clockEntryOpen && !draft.adjusting && <div className="journey-required-clock">{clockField}</div>}
      {!draft.placeOpen && observer ? <div className="journey-watch-place">
        <strong>{observer.name}</strong><button ref={changePlace} type="button" className="journey-text-action" aria-label="更改演示地点"
          onClick={() => update(beginHistoricalPlaceEdit(record, draft), false)}>更改地点</button>
      </div> : <div className="journey-place-editor">
        <div className="journey-place-actions"><label htmlFor={id+'-place'}>在哪里观看</label>
          {draft.placeBeforeEdit && <button type="button" className="journey-text-action" aria-label="取消更改演示地点"
            onClick={() => update(cancelHistoricalPlaceEdit(draft), false)}>取消更改</button>}
        </div>
        <select ref={placeMode} id={id+'-place'} name="history-place" value={draft.placeMode} onChange={event => selectPlace(event.target.value as HistoryPlaceMode)}>
          {record.place.observer && <option value="record">{record.place.observer.name} · 资料相关地区</option>}
          <option value="custom">另选演示地点</option>
          <option value="current">沿用画面地点 · {currentOptionName}（{currentOrigin}）</option>
          {state.birth && <option value="personal">沿用我的出生地点 · {draft.placeMode === 'personal' && draft.reusedPlace ? draft.reusedPlace.name : state.birth.observer.name}</option>}
        </select>
        {draft.placeMode === 'custom' && <ObserverPicker label="演示地点" showCancel={false} draft={draft.custom} onChange={custom => update({ custom,
          placeOpen: custom.mode !== 'summary', placeBeforeEdit: custom.mode === 'summary' ? null : draft.placeBeforeEdit })} />}
        {!record.place.observer && <p className="journey-hint">史料尚无已匹配地点，请选本次演示的位置。</p>}
        {!draft.placeBeforeEdit && observer && <button type="button" className="journey-text-action" onClick={() => update({ placeOpen: false }, false)}>收起地点设置</button>}
      </div>}
      <p className="journey-watch-assumptions journey-hint" id={id+'-assumptions'}>
        {record.date.status === 'conditional_gregorian_interpretation' ? '日期按前推公历作条件性解释。' : '沿用资料换算日期。'}
        {observer?.precision === 'representative' ? '采用地区代表点，不定位历史建筑。' : observer ? '地点仅用于本次演示。' : ''}
        {draft.clockChoice.timeSelection.origin === 'event-default-20' ? '未载时刻，默认当地晚上 8 点演示。' : '所选钟点用于演示，并非史料认定时刻。'}
      </p>
      {error && <p className="journey-error" role="alert">{error}</p>}
      <button ref={confirm} className="journey-primary" type="submit" aria-describedby={id+'-assumptions'} disabled={!ready}>
        {draft.watched ? '用上次设置再看' : '确认此日期与地点，查看合照'}
      </button>
      {!ready && <p className="journey-hint" role="status">{!observer ? '选定一个地点即可继续。' : !clock ? '请选择本次演示钟点。' : '请在时间设置中填写有效的 UTC 偏移。'}</p>}
      <details className="journey-details journey-time-settings" open={draft.adjusting} onToggle={event => {
        if (event.currentTarget.open !== draft.adjusting) {
          if (!event.currentTarget.open) setClockEntryOpen(!clock);
          update({ adjusting: event.currentTarget.open }, false);
        }
      }}><summary>调整钟点与时间解释</summary>
        {draft.adjusting && <>{clockField}
          <p className="journey-hint">{draft.clockChoice.timeSelection.label}</p>
          <label htmlFor={id+'-basis'}>钟点如何换算</label><select id={id+'-basis'} name="history-time-basis" value={draft.basis}
            onChange={event => update({ basis: event.target.value as HistoricalDraft['basis'] })}>
            <option value="local-mean-solar">地方平太阳时 · 演示约定</option><option value="offset">我指定 UTC 偏移</option>
          </select>
          {draft.basis === 'offset' ? <OffsetField value={draft.offset} onChange={offset => update({ offset })} />
            : <p className="journey-hint">按所选经度换算，仅作演示，不代表当时的民用钟表制度。</p>}
        </>}
      </details>
    </form>
    <details className="journey-details journey-source-details" open={draft.sourceOpen} onToggle={event => {
      if (event.currentTarget.open !== draft.sourceOpen) update({ sourceOpen: event.currentTarget.open }, false);
    }}><summary>原日期、地点与史料依据</summary>
      <dl className="journey-facts"><dt>换算公历</dt><dd>{record.date.iso}</dd><dt>原日期</dt><dd>{record.date.original}</dd>
        <dt>{record.kind === 'birth' ? '资料出生地' : '资料发生地'}</dt><dd>{record.place.original}</dd></dl>
      <div className="journey-notice"><strong>{CALENDAR_LABELS[record.date.status]}</strong><p>{CALENDAR_NOTES[record.date.status]}</p></div>
      {[record.date.note, record.place.note, record.time.note, record.notes].filter(Boolean).map((note, index) => <p className="journey-hint" key={index}>{note}</p>)}
      {!!record.remainingChecks.length && <ul>{record.remainingChecks.map((note, index) => <li key={index}>{note}</li>)}</ul>}
      {observer && <p className="journey-hint">本次观看：{observer.note}<br />{observer.latitude.toFixed(4)}°，{observer.longitude.toFixed(4)}°</p>}
      <div className="journey-sources"><span>原始出处</span>{record.sources.map((source, index) =>
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{index + 1}. {source.title} ↗</a>)}</div>
      {culture && <p className="journey-hint">这一年代可对照{CULTURE_INFO[culture].name}，不表示人物曾使用该星图。
        <button type="button" className="journey-text-action" onClick={onCulture}>选择星图视角 ↗</button></p>}
    </details>
  </div>;
}
