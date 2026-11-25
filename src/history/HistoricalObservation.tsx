import React, { useId, useState, useSyncExternalStore } from 'react';
import type { HistoryRecord } from './historyModel';
import { CALENDAR_LABELS, CALENDAR_NOTES, historicalCalendarText, historyEvidenceSources, ORIGINAL_CALENDAR_LABELS } from './historyModel';
import { historyObservation, type Observation, type TimeBasis } from './observation';
import { journeyStore } from './journeyStore';
import { CULTURE_INFO, contemporaryCulture } from './cultureVersions';
import { ObserverPicker, OffsetField, IanaTimeFields, useIanaTimeChoices } from './ObservationForm';
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
  const date = record.date.evidence, time = record.time.precision === 'date-only' ? null : record.time;
  const originalDate = historicalCalendarText(record);
  const recordedBasis = time?.clockBasis.kind === 'fixed-offset' ? time.clockBasis : null;
  const zone = draft.zoneOverride ?? observer?.timeZone ?? '';
  const zoneCheck = useIanaTimeChoices(draft.basis === 'iana' && !!observer, record.date.iso, clock, zone.trim());
  const savedBasis = draft.watched && draft.savedIanaBasis?.timeZone === zone.trim() ? draft.savedIanaBasis : undefined;
  const fold = draft.foldChoice?.key === zoneCheck.key ? draft.foldChoice.value : savedBasis?.disambiguation ?? '';
  let timeBasis: TimeBasis | undefined;
  if (draft.basis === 'local-mean-solar') timeBasis = { kind: 'local-mean-solar' };
  if (draft.basis === 'offset' && Number.isInteger(draft.offset) && Math.abs(draft.offset) <= 840)
    timeBasis = { kind: 'offset', offsetMinutes: draft.offset };
  if (draft.basis === 'recorded' && recordedBasis) timeBasis = { kind: 'offset', offsetMinutes: recordedBasis.offsetMinutes };
  if (draft.basis === 'iana') {
    if (savedBasis) timeBasis = savedBasis;
    else if (zoneCheck.result?.kind === 'unique') timeBasis = zoneCheck.result.basis;
    else if (zoneCheck.result?.kind === 'overlap' && fold) timeBasis = zoneCheck.result[fold];
  }
  const ready = !!observer && !!clock && !!timeBasis;
  const update = (patch: Partial<HistoricalDraft>, changesObservation = true) => {
    const next = { ...draft, ...(changesObservation ? { savedIanaBasis: undefined } : {}), ...patch,
      watched: changesObservation ? false : (patch.watched ?? draft.watched) };
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
    <input id={id+'-clock'} name="history-clock" type="time" required value={clock} step={clock.length > 5 ? 1 : 60}
      onChange={event => {
        if (!event.target.value) setClockEntryOpen(true);
        update({ clockChoice: resolveHistoryChoices(record, { clock: event.target.value }) });
      }} />
    <button type="button" onClick={() => {
      setClockEntryOpen(false);
      update({ clockChoice: time || record.kind === 'event' ? resolveHistoryChoices(record) : resolveHistoryChoices(record, { clock: '20:00' }) });
    }}>
      {time?.precision === 'point' ? '恢复史载钟点' : time ? '恢复演示钟点' : record.kind === 'event' ? '恢复晚上 8 点' : '选晚上 8 点'}</button>
  </div></>;
  const culture = contemporaryCulture(Number(record.date.iso.slice(0, 4)));
  const currentOptionName = draft.placeMode === 'current' && draft.reusedPlace ? draft.reusedPlace.name : state.current.observer.name;
  const currentOrigin = draft.placeMode === 'current' ? draft.reusedOrigin : observationPlaceOrigin(state.current);
  const originalURLs = new Set(record.sources.map(source => new URL(source.url).href));
  const supportingSources = historyEvidenceSources(record).filter(source => !originalURLs.has(new URL(source.url).href));
  const site = draft.placeMode === 'record' ? record.place.evidence : undefined;
  const clockExplanation = !clock ? '' : draft.clockChoice.timeSelection.label;
  return <div className="journey-history-detail" data-history-record={record.id}>
    <form className="journey-form journey-history-form" aria-label={record.name+'的合照设置'} onSubmit={event => {
      event.preventDefault();
      // This labelled action, next to the visible assumptions, is the single confirmation.
      if ((event.nativeEvent as SubmitEvent).submitter !== confirm.current) return;
      try {
        if (!timeBasis) throw new Error('请先选定演示时制。');
        const observation = historyObservation(record, { clock, observer, timeBasis, timeSelection: draft.clockChoice.timeSelection,
          dateAcknowledged: true, placeConfirmed: !!observer });
        setClockEntryOpen(false);
        update({ custom: commitObserverDraft(draft.custom), watched: true, placeOpen: false, placeBeforeEdit: null,
          savedIanaBasis: timeBasis.kind === 'iana' ? timeBasis : undefined }, false);
        onObserve(observation);
      } catch (reason) { setError((reason as Error).message); }
    }}>
      <p className="journey-watch-date">{originalDate ?? record.date.iso} <span>· {originalDate && `换算公历 ${record.date.iso} · `}
        {clock ? clock + (draft.basis === 'recorded' ? ' 当年时制' : ' 当地') : '请选择演示钟点'}</span></p>
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
          {record.place.observer && <option value="record">{record.place.observer.name} · {record.place.observer.precision === 'historical-site' ? '场址范围' : '资料相关地区'}</option>}
          <option value="custom">另选演示地点</option>
          <option value="current">沿用画面地点 · {currentOptionName}（{currentOrigin}）</option>
          {state.birth && <option value="personal">沿用我的出生地点 · {draft.placeMode === 'personal' && draft.reusedPlace ? draft.reusedPlace.name : state.birth.observer.name}</option>}
        </select>
        {!record.place.observer && !observer && <div className="journey-reuse-place">
          <p className="journey-hint">资料没有已匹配地点，可自选观测地点演示。</p>
          <button type="button" className="journey-text-action" onClick={() => selectPlace(state.birth ? 'personal' : 'current')}>
            {state.birth ? '沿用出生地点' : '沿用当前地点'} · {(state.birth ?? state.current).observer.name}
          </button>
        </div>}
        {draft.placeMode === 'custom' && <ObserverPicker label="演示地点" showCancel={false} draft={draft.custom} onChange={custom => update({ custom,
          placeOpen: custom.mode !== 'summary', placeBeforeEdit: custom.mode === 'summary' ? null : draft.placeBeforeEdit })} />}
        {!draft.placeBeforeEdit && observer && <button type="button" className="journey-text-action" onClick={() => update({ placeOpen: false }, false)}>收起地点设置</button>}
      </div>}
      <p className="journey-watch-assumptions journey-hint" id={id+'-assumptions'}>
        {clockExplanation}
        {clock && draft.basis === 'local-mean-solar' && '演示 UTC 按所选经度换算。'}
        {clock && draft.basis === 'recorded' && '按有史料依据的时制换算。'}
        {record.date.status === 'conditional_gregorian_interpretation' && '日期按前推公历作条件性解释。'}
        {observer?.precision === 'representative' && '采用地区代表点。'}
      </p>
      {error && <p className="journey-error" role="alert">{error}</p>}
      <button ref={confirm} className="journey-primary" type="submit" aria-describedby={id+'-assumptions'} disabled={!ready}>
        {draft.watched ? '再看这刻合照' : '观看地月合照'}
      </button>
      {!ready && <p className="journey-hint" role="status">{!observer ? '选定一个地点即可继续。' : !clock ? '请选择本次演示钟点。' : '请在时间设置中完成钟点换算。'}</p>}
      <details className="journey-details journey-time-settings" open={draft.adjusting} onToggle={event => {
        if (event.currentTarget.open !== draft.adjusting) {
          if (!event.currentTarget.open) setClockEntryOpen(!clock);
          update({ adjusting: event.currentTarget.open }, false);
        }
      }}><summary>调整钟点与时间解释</summary>
        {draft.adjusting && <>{clockField}
          <label htmlFor={id+'-basis'}>钟点如何换算</label><select id={id+'-basis'} name="history-time-basis" value={draft.basis}
            onChange={event => update({ basis: event.target.value as HistoricalDraft['basis'] })}>
            {recordedBasis && <option value="recorded">有史料依据的时制</option>}
            <option value="local-mean-solar">地方平太阳时 · 演示约定</option><option value="offset">我指定 UTC 偏移</option>
            <option value="iana">按当地民用时间换算</option>
          </select>
          {draft.basis === 'offset' && <OffsetField value={draft.offset} onChange={offset => update({ offset })} />}
          {draft.basis === 'recorded' && <p className="journey-hint">{recordedBasis?.note}</p>}
          {draft.basis === 'local-mean-solar' && <p className="journey-hint">按所选经度和地方平太阳时换算，仅作演示。</p>}
          {draft.basis === 'iana' && <IanaTimeFields zone={zone} check={zoneCheck} fold={fold}
            onZoneChange={zoneOverride => update({ zoneOverride, foldChoice: undefined })}
            onFoldChange={value => update({ foldChoice: { key: zoneCheck.key, value } })} />}
        </>}
      </details>
    </form>
    <details className="journey-details journey-source-details" open={draft.sourceOpen} onToggle={event => {
      if (event.currentTarget.open !== draft.sourceOpen) update({ sourceOpen: event.currentTarget.open }, false);
    }}><summary>原日期、地点与史料依据</summary>
      <dl className="journey-facts"><dt>换算公历</dt><dd>{record.date.iso}</dd><dt>原日期</dt><dd>{record.date.original}</dd>
        <dt>原历</dt><dd>{date?.calendarLabel ?? ORIGINAL_CALENDAR_LABELS[record.date.originalCalendar] ?? record.date.originalCalendar}</dd>
        {date?.era && <><dt>年号</dt><dd>{date.era}</dd></>}
        {date?.ganzhiYear && <><dt>原载干支年</dt><dd>{date.ganzhiYear}年</dd></>}
        {date?.ganzhiDays?.length && <><dt>原载干支日</dt><dd>{date.ganzhiDays.map(day => day+'日').join('、')}</dd></>}
        {time && <><dt>{time.precision === 'window' ? (time.scope === 'related' ? '史载相关时段' : '史载时段')
          : time.scope === 'event' ? '史载钟点' : '史载相关钟点'}</dt><dd>{time.original}</dd>
          <dt>历史时制</dt><dd>{time.clockBasis.note}</dd></>}
        <dt>{record.kind === 'birth' ? '资料出生地' : '资料发生地'}</dt><dd>{record.place.original}</dd></dl>
      <div className="journey-notice"><strong>{CALENDAR_LABELS[record.date.status]}</strong><p>{CALENDAR_NOTES[record.date.status]}</p></div>
      {[record.eventEvidence?.note, date?.note, record.date.note, record.place.evidence ? '' : record.place.note, record.time.note,
        record.provenance.baseRecordHash ? '' : record.notes].filter(Boolean).map((note, index) => <p className="journey-hint" key={index}>{note}</p>)}
      {!!record.remainingChecks.length && <ul>{record.remainingChecks.map((note, index) => <li key={index}>{note}</li>)}</ul>}
      {observer && <p className="journey-hint">{observer.note}<br />{observer.latitude.toFixed(4)}°，{observer.longitude.toFixed(4)}°
        {site && ` · ${site.coordinateSystem} · 约 ${site.radiusMeters} 米范围`}</p>}
      <div className="journey-sources"><span>原始出处</span>{record.sources.map((source, index) =>
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{index + 1}. {source.title} ↗</a>)}</div>
      {!!supportingSources.length && <div className="journey-sources"><span>补充依据</span>{supportingSources.map(source =>
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div>}
      {culture && <p className="journey-hint">这一年代可对照{CULTURE_INFO[culture].name}，不表示人物曾使用该星图。
        <button type="button" className="journey-text-action" onClick={onCulture}>选择星图视角 ↗</button></p>}
    </details>
  </div>;
}
