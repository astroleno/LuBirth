import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import recordsData from './data/records.json';
import manifest from './data/manifest.json';
import type { HistoryRecord, ObserverPlace } from './historyModel';
import { CALENDAR_LABELS, CALENDAR_NOTES } from './historyModel';
import { historyObservation, type Observation, type TimeBasis } from './observation';
import { journeyStore, CULTURE_VERSIONS } from './journeyStore';
import { CULTURE_INFO, contemporaryCulture } from './cultureVersions';
import { localToday, relationLabel, selectHistory, type HistoryFilter } from './historyRelations';
import ObservationForm, { ObserverPicker, OffsetField, ObservationSummary } from './ObservationForm';
import { resolveHistoryChoices } from './historyObservationPolicy';

export type JourneyTab = 'history' | 'birth' | 'cultures';
const records = recordsData as HistoryRecord[];
const FILTERS: [HistoryFilter, string][] = [['all','全部'],['birth','人物'],['event','事件'],['birthday','同月同日'],['season','相近时节'],['today','历史上的今天'],['saved','收藏']];

function HistoricalObservation({ record, onObserve }: { record: HistoryRecord; onObserve: (value: Observation) => void }) {
  const current = useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot).current;
  const [clockChoice, setClockChoice] = useState(() => resolveHistoryChoices(record));
  const clock = clockChoice.clock;
  const [basis, setBasis] = useState<'local-mean-solar' | 'offset'>('local-mean-solar');
  const [offset, setOffset] = useState(480), [placeMode, setPlaceMode] = useState('');
  const [custom, setCustom] = useState<ObserverPlace | null>(null), [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');
  const observer = placeMode === 'record' ? record.place.observer : placeMode === 'current'
    ? { ...current.observer, precision: 'user-selected' as const, note: '用户选择当前观测位置用于历史日期演示' } : placeMode === 'custom' ? custom : null;
  return <form className="journey-form journey-history-form" onSubmit={event => {
    event.preventDefault();
    try {
      const timeBasis: TimeBasis = basis === 'offset' ? { kind: 'offset', offsetMinutes: offset } : { kind: 'local-mean-solar' };
      onObserve(historyObservation(record, { clock, observer, timeBasis, timeSelection: clockChoice.timeSelection,
        dateAcknowledged: acknowledged, placeConfirmed: !!placeMode && !!observer }));
    } catch (e) { setError((e as Error).message); }
  }}>
    <h3>生成这一天的地月合照</h3>
    <p className="journey-hint">地球标出所选地点，月球呈现对应月相。也可以从合照继续进入当地天空。</p>
    <p className="journey-hint">{record.time.note}</p>
    <label htmlFor="history-clock">演示钟点 · 不是史料认定时刻</label>
    <div className="journey-clock"><input id="history-clock" type="time" required value={clock}
      onChange={e => setClockChoice(resolveHistoryChoices(record, { clock: e.target.value }))} />
      <button type="button" onClick={() => setClockChoice(resolveHistoryChoices(record, { clock: '20:00', useDefault: record.kind === 'event' }))}>
        {record.kind === 'event' ? '恢复默认 20:00' : '选 20:00'}</button></div>
    <p className="journey-hint" role="status">{clockChoice.timeSelection.label}</p>
    <label htmlFor="history-place">观测地点</label><select id="history-place" required value={placeMode} onChange={e => setPlaceMode(e.target.value)}>
      <option value="">请选择用于演示的位置</option>
      {record.place.observer && <option value="record">{record.place.observer.name} · 资料相关地区</option>}
      <option value="current">在我当前的地点观看 · {current.observer.name}</option><option value="custom">另选地点或填写坐标</option>
    </select>
    {observer && <p className="journey-hint">{observer.note}<br />纬度 {observer.latitude.toFixed(4)}°，经度 {observer.longitude.toFixed(4)}°</p>}
    {!record.place.observer && <p className="journey-hint">该条尚无已匹配的观测点。你所选的位置只用于演示，不会被记成历史发生地。</p>}
    {placeMode === 'custom' && <ObserverPicker value={custom} onChange={setCustom} />}
    <label htmlFor="history-time-basis">如何解释钟点</label><select id="history-time-basis" value={basis} onChange={e => setBasis(e.target.value as typeof basis)}>
      <option value="local-mean-solar">地方平太阳时 · 演示约定</option><option value="offset">我指定 UTC 偏移</option>
    </select>
    {basis === 'offset' ? <OffsetField value={offset} onChange={setOffset} /> : <p className="journey-hint">按观测地经度换算。这是本次演示约定，不代表当时的民用钟表制度。</p>}
    <label className="journey-check"><input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
      <span>我已了解日期解释，按所选地点和演示钟点观看。</span></label>
    {error && <p className="journey-error" role="alert">{error}</p>}
    <button className="journey-primary" type="submit" disabled={!clock || !observer || !acknowledged}>查看这一天的地月合照</button>
    {(!clock || !observer || !acknowledged) && <p className="journey-hint">请先选钟点、地点，并确认日期与演示说明。</p>}
  </form>;
}

export default function JourneyPanel({ initialTab = 'history', onClose, onObserve, onCulture, embedded = false, activeTab, onTabChange }: {
  initialTab?: JourneyTab; onClose: () => void; onObserve: (value: Observation) => void; onCulture: () => void;
  embedded?: boolean; activeTab?: JourneyTab; onTabChange?: (tab: JourneyTab) => void;
}) {
  const state = useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot);
  const [localTab, setLocalTab] = useState<JourneyTab>(initialTab), [query, setQuery] = useState(''), [filter, setFilter] = useState<HistoryFilter>('all');
  const tab = activeTab ?? localTab;
  const setTab = (next: JourneyTab) => { if (activeTab === undefined) setLocalTab(next); onTabChange?.(next); };
  const [period, setPeriod] = useState('all'), [selectedId, setSelectedId] = useState<string | null>(null);
  const previousSelection = useRef(selectedId);
  const panel = useRef<HTMLElement>(null), scroll = useRef<HTMLDivElement>(null);
  const selected = records.find(record => record.id === selectedId);
  const today = localToday();
  const matches = useMemo(() => selectHistory(records, { query, filter, period, birth: state.birth, favorites: state.favorites, today }),
    [query, filter, period, state.birth, state.favorites, today]);
  useEffect(() => {
    if (embedded) return;
    const prior = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') {
        const items = [...(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],summary,[tabindex="0"]') || [])]
          .filter(item => item.getClientRects().length);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first.focus(); }
      }
    };
    panel.current?.addEventListener('keydown', key);
    const current = panel.current;
    return () => { current?.removeEventListener('keydown', key); if (prior && document.contains(prior)) prior.focus(); };
  }, [onClose, embedded]);
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
    if (embedded) scroll.current?.closest('.experience-panel-content')?.scrollTo({ top: 0 });
    // Selecting a record removes its focused list button. Keep subsequent Tab
    // presses inside the dialog instead of leaving focus on the document body.
    const selectionChanged = previousSelection.current !== selectedId;
    previousSelection.current = selectedId;
    if ((!embedded || selectionChanged) && !panel.current?.contains(document.activeElement)) panel.current?.focus();
  }, [selectedId, tab, embedded]);
  const outdated = state.current.source.kind === 'history' && records.find(record => record.id === state.current.source.recordId)?.provenance.recordHash !== state.current.source.recordHash;
  const Root = embedded ? 'section' : 'aside';
  return <Root ref={panel} className={embedded ? 'journey-content' : 'journey-panel'} role={embedded ? undefined : 'dialog'} aria-modal={embedded ? undefined : true} aria-labelledby={embedded ? undefined : 'journey-title'} tabIndex={-1}>
    {!embedded && <><header className="journey-heading"><div><p>LuBirth · 与古人同望</p><h2 id="journey-title">{tab === 'birth' ? '我的出生时刻' : tab === 'cultures' ? '古人的星空' : '古今同源'}</h2></div>
      <button onClick={onClose} aria-label="关闭古今同源面板">×</button></header>
    <nav className="journey-tabs" aria-label="联动内容">{([['history','人物与日期'],['cultures','古星图'],['birth','我的出生']] as const).map(([value,label]) =>
      <button key={value} aria-current={tab === value ? 'page' : undefined} onClick={() => setTab(value)}>{label}</button>)}</nav></>}
    <div className="journey-scroll" ref={scroll}>
      {state.storageWarning && <p className="journey-hint" role="status">{state.storageWarning}</p>}
      {outdated && <p className="journey-notice">这条资料已更新。当前画面保留你之前选择的演示参数，请重新打开记录核对日期与地点。</p>}
      {tab === 'birth' && <><ObservationSummary observation={state.current} />
        {state.current.source.kind === 'history' && <button className="journey-secondary" onClick={() => journeyStore.returnToPersonal()}>{state.birth ? '回到我的出生时刻' : '回到此前天空'}</button>}
        <ObservationForm initial={state.birth || state.current} onSave={value => journeyStore.setBirth(value)} />
        <p className="journey-hint">出生时间地点只用于当前浏览器会话，不会发送给资料来源网站。</p></>}
      {tab === 'cultures' && <><p className="journey-intro">保留此时、此地，换一种理解星空的方式。</p>
        <div className="journey-cultures">{CULTURE_VERSIONS.map(id => <article key={id} data-selected={state.culture === id || undefined}>
          <p className="journey-eyebrow">{CULTURE_INFO[id].era}</p><h3>{CULTURE_INFO[id].name}</h3><p>{CULTURE_INFO[id].description}</p>
          <div className="journey-inline-actions"><button onClick={() => { journeyStore.setCulture(id); onCulture(); }}>{state.culture === id ? '观看这一视角' : '用这一视角观看'}</button>
            <a href={CULTURE_INFO[id].source} target="_blank" rel="noreferrer">版本依据 ↗</a></div><small>{CULTURE_INFO[id].author}</small>
        </article>)}</div>
        <div className="journey-source-note"><h3>唐代敦煌星图</h3><p>可阅读原图与历史说明。它尚未建立独立逐星映射，陈卓体系也不能冒充它的完整数字复刻。</p>
          <a href="https://idp.bl.uk/discover/learning/chinese-astronomy/articles/the-chinese-sky/the-dunhuang-star-atlas/" target="_blank" rel="noreferrer">国际敦煌项目 · 查看史料 ↗</a></div></>}
      {tab === 'history' && (selected ? <>
        <div className="journey-detail-toolbar"><button onClick={() => setSelectedId(null)}>← 返回目录</button>
          <button aria-pressed={state.favorites.includes(selected.id)} onClick={() => journeyStore.toggleFavorite(selected.id)}>{state.favorites.includes(selected.id) ? '已收藏 ✓' : '收藏'}</button></div>
        <p className="journey-eyebrow">{selected.kind === 'birth' ? '人物出生' : '历史事件'} · {selected.period}</p><h3 className="journey-record-title">{selected.name}</h3>
        {relationLabel(selected, state.birth) && <p className="journey-relation">{relationLabel(selected, state.birth)}</p>}
        <dl className="journey-facts"><dt>换算公历</dt><dd>{selected.date.iso}</dd><dt>原日期</dt><dd>{selected.date.original}</dd><dt>{selected.kind === 'birth' ? '资料记载出生地' : '资料记载发生地'}</dt><dd>{selected.place.original}</dd></dl>
        <div className="journey-notice"><strong>{CALENDAR_LABELS[selected.date.status]}</strong><p>{CALENDAR_NOTES[selected.date.status]}</p></div>
        <details className="journey-details"><summary>日期、地点与尚待核验的说明</summary>
          {[selected.date.note, selected.place.note, selected.notes].filter(Boolean).map((note, index) => <p key={index}>{note}</p>)}
          {!!selected.remainingChecks.length && <ul>{selected.remainingChecks.map((note,index) => <li key={index}>{note}</li>)}</ul>}
          <p>这条资料可用于检索和有说明的天空演示；尚未建立准确的出生／事件瞬间。</p></details>
        <div className="journey-sources"><span>原始出处</span>{selected.sources.map((source,index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{index+1}. {source.title} ↗</a>)}</div>
        {contemporaryCulture(Number(selected.date.iso.slice(0,4))) && <p className="journey-hint">这一年代可对照{CULTURE_INFO[contemporaryCulture(Number(selected.date.iso.slice(0,4)))!].name}。
          <button className="journey-text-action" onClick={() => setTab('cultures')}>选择星图视角 ↗</button> 这不表示人物曾使用该星图。</p>}
        <HistoricalObservation key={selected.id} record={selected} onObserve={onObserve} />
      </> : <>
        <p className="journey-intro">从你的出生日期，走进另一段有出处的时光。</p>
        <p className="journey-count">{manifest.count} 条资料 · {manifest.kinds.birth} 位人物 · {manifest.kinds.event} 件事件</p>
        <label className="journey-sr-only" htmlFor="history-search">搜索人物、事件或地点</label><input id="history-search" type="search" placeholder="搜索人物、事件或地点" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="journey-filters" aria-label="资料分类">{FILTERS.map(([key,name]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{name}</button>)}</div>
        <div className="journey-list-heading"><label htmlFor="history-period">记录发生年代</label><select id="history-period" value={period} onChange={e => setPeriod(e.target.value)}><option value="all">全部年代与地区</option>
          {Object.entries(manifest.periods).map(([name,count]) => <option key={name} value={name}>{name} · {count}</option>)}</select></div>
        {filter === 'birthday' || filter === 'season' ? <p className="journey-hint">{state.birth ? filter === 'birthday' ? '按出生当地日期与资料换算公历的月日匹配，不混用原历生日。' : '按公历年内相距 14 天以内推荐，不表示月相或天象相同。' : '先保存你的出生时刻，才能查找日期上的联系。'}{!state.birth && <button className="journey-text-action" onClick={() => setTab('birth')}>填写出生信息 ↗</button>}</p>
          : filter === 'today' ? <p className="journey-hint">今天 {today} · 按你设备的当地月日匹配换算公历。</p> : null}
        <p className="journey-list-count" role="status">{matches.length} 条结果</p>
        <div className="journey-records">{matches.map(record => <button key={record.id} onClick={() => setSelectedId(record.id)}>
          <span className="journey-record-name">{record.name}<i aria-hidden="true">↗</i></span><span className="journey-record-meta">{record.date.iso} · {record.kind === 'birth' ? '出生' : '事件'} · {record.place.original}</span>
          {relationLabel(record, state.birth) && <span className="journey-relation">{relationLabel(record, state.birth)}</span>}
        </button>)}</div>
        {!matches.length && <p className="journey-empty">{filter === 'today' ? '这一天暂未收录资料。可以浏览全部人物与事件。' : filter === 'saved' ? '收藏感兴趣的人物或事件，稍后从这里继续。' : '没有符合条件的记录，试试其他关键词或年代。'}</p>}
        <p className="journey-coverage">当前覆盖 {manifest.monthDays} 个公历月日，年代以近代为主。资料持续补充；日期、时刻与地点的确定程度在各条详情中说明。</p>
      </>)}
    </div>
  </Root>;
}
