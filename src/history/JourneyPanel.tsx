import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import recordsData from './data/records.json';
import manifest from './data/manifest.json';
import type { HistoryRecord } from './historyModel';
import type { Observation } from './observation';
import { journeyStore, CULTURE_VERSIONS } from './journeyStore';
import { CULTURE_INFO } from './cultureVersions';
import { localToday, relationLabel, selectHistory, type HistoryFilter } from './historyRelations';
import ObservationForm, { ObservationSummary } from './ObservationForm';
import HistoricalObservation from './HistoricalObservation';
import { createHistoryDraftCache, personalObservationInitial } from './observationDraft';

export type JourneyTab = 'history' | 'birth' | 'cultures';
const records = recordsData as HistoryRecord[];
const FILTERS: [HistoryFilter, string][] = [['all','全部'],['birth','人物'],['event','事件'],['birthday','同月同日'],['season','相近时节'],['today','历史上的今天'],['saved','收藏']];


export default function JourneyPanel({ initialTab = 'history', onClose, onObserve, onCulture, embedded = false, activeTab, onTabChange }: {
  initialTab?: JourneyTab; onClose: () => void; onObserve: (value: Observation) => void; onCulture: () => void;
  embedded?: boolean; activeTab?: JourneyTab; onTabChange?: (tab: JourneyTab) => void;
}) {
  const state = useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot);
  const [localTab, setLocalTab] = useState<JourneyTab>(initialTab), [query, setQuery] = useState(''), [filter, setFilter] = useState<HistoryFilter>('all');
  const tab = activeTab ?? localTab;
  const setTab = (next: JourneyTab) => { if (activeTab === undefined) setLocalTab(next); onTabChange?.(next); };
  const [period, setPeriod] = useState('all'), [selectedId, setSelectedId] = useState<string | null>(null);
  const panel = useRef<HTMLElement>(null), scroll = useRef<HTMLDivElement>(null);
  const selected = records.find(record => record.id === selectedId);
  const [draftCache] = useState(() => {
    try { return createHistoryDraftCache(window.sessionStorage); } catch { return createHistoryDraftCache(); }
  });
  const positions = useRef(new Map<string, number>()), returnTarget = useRef<string | null>(null);
  const returnIndex = useRef(0);
  const readingKey = tab + ':' + (selected ? selected.id + ':' + selected.provenance.recordHash : 'directory');
  const reading = useRef(readingKey);
  const scrollHost = () => (embedded ? scroll.current?.closest('.experience-panel-content') : scroll.current) as HTMLElement | null;
  const navigate = (next: string | null) => {
    const host = scrollHost();
    if (host) positions.current.set(reading.current, host.scrollTop);
    if (next === null) returnTarget.current = selectedId;
    else returnIndex.current = Math.max(0, matches.findIndex(record => record.id === next));
    draftCache.flush(); setSelectedId(next);
  };
  const today = localToday();
  const matches = useMemo(() => selectHistory(records, { query, filter, period, birth: state.birth, favorites: state.favorites, today }),
    [query, filter, period, state.birth, state.favorites, today]);
  useEffect(() => {
    const flush = () => draftCache.flush();
    window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('pagehide', flush); draftCache.dispose(); };
  }, [draftCache]);
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
  React.useLayoutEffect(() => {
    const host = scrollHost();
    if (!host) return;
    const remember = () => {
      if (panel.current?.getClientRects().length) positions.current.set(reading.current, host.scrollTop);
    };
    host.addEventListener('scroll', remember, { passive: true });
    return () => host.removeEventListener('scroll', remember);
  }, [embedded]);
  React.useLayoutEffect(() => {
    const changed = reading.current !== readingKey;
    reading.current = readingKey;
    const host = scrollHost();
    if (host) host.scrollTop = positions.current.get(readingKey) ?? 0;
    if (!changed) return;
    if (!selectedId && returnTarget.current) {
      const neighbor = matches[Math.min(returnIndex.current, matches.length - 1)];
      const targets = [document.getElementById('history-record-'+returnTarget.current),
        neighbor ? document.getElementById('history-record-'+neighbor.id) : null,
        panel.current?.querySelector<HTMLElement>('#history-search'), panel.current];
      targets.find(target => target && target.getClientRects().length)?.focus({ preventScroll: true });
      returnTarget.current = null;
    } else panel.current?.focus({ preventScroll: true });
  }, [readingKey, selectedId, embedded]);
  const outdated = state.current.source.kind === 'history' && records.find(record => record.id === state.current.source.recordId)?.provenance.recordHash !== state.current.source.recordHash;
  const Root = embedded ? 'section' : 'aside';
  return <Root ref={panel} className={embedded ? 'journey-content' : 'journey-panel'} role={embedded ? undefined : 'dialog'} aria-modal={embedded ? undefined : true} aria-labelledby={embedded ? undefined : 'journey-title'} tabIndex={-1}>
    {!embedded && <><header className="journey-heading"><div><p>LuBirth · 与古人同望</p><h2 id="journey-title">{tab === 'birth' ? '我的出生时刻' : tab === 'cultures' ? '古人的星空' : '古今同月'}</h2></div>
      <button onClick={onClose} aria-label="关闭古今同月面板">×</button></header>
    <nav className="journey-tabs" aria-label="联动内容">{([['history','人物与日期'],['cultures','古星图'],['birth','我的出生']] as const).map(([value,label]) =>
      <button key={value} aria-current={tab === value ? 'page' : undefined} onClick={() => setTab(value)}>{label}</button>)}</nav></>}
    <div className="journey-scroll" ref={scroll}>
      {state.storageWarning && <p className="journey-hint" role="status">{state.storageWarning}</p>}
      {outdated && <p className="journey-notice">这条资料已更新。当前画面保留你之前选择的演示参数，请重新打开记录核对日期与地点。</p>}
      {tab === 'birth' && <><ObservationSummary observation={personalObservationInitial(state)} />
        {state.current.source.kind === 'history' && <button className="journey-secondary" onClick={() => journeyStore.returnToPersonal()}>{state.birth ? '回到我的出生时刻' : '回到此前天空'}</button>}
        <ObservationForm initial={personalObservationInitial(state)} onSave={value => journeyStore.setBirth(value)} />
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
        <div className="journey-detail-toolbar"><button onClick={() => navigate(null)}>← 返回目录</button>
          <button aria-pressed={state.favorites.includes(selected.id)} onClick={() => journeyStore.toggleFavorite(selected.id)}>{state.favorites.includes(selected.id) ? '已收藏 ✓' : '收藏'}</button></div>
        <p className="journey-eyebrow">{selected.kind === 'birth' ? '人物出生' : '历史事件'} · {selected.period}</p><h3 className="journey-record-title">{selected.name}</h3>
        {relationLabel(selected, state.birth) && <p className="journey-relation">{relationLabel(selected, state.birth)}</p>}
        <HistoricalObservation key={selected.id+selected.provenance.recordHash} record={selected}
          initialDraft={draftCache.get(selected, state.current)} onDraftChange={draft => draftCache.set(selected, draft)}
          onObserve={onObserve} onCulture={() => setTab('cultures')} />
      </> : <>
        <p className="journey-intro">{state.birth ? '从你的出生时刻，走进另一段有出处的时光。' : '选一段有出处的时光，去那里看月亮。'}</p>
        <p className="journey-count">{manifest.count} 条资料 · {manifest.kinds.birth} 位人物 · {manifest.kinds.event} 件事件</p>
        <label className="journey-sr-only" htmlFor="history-search">搜索人物、事件或地点</label><input id="history-search" type="search" placeholder="搜索人物、事件或地点" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="journey-filters" aria-label="资料分类">{FILTERS.map(([key,name]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{name}</button>)}</div>
        <div className="journey-list-heading"><label htmlFor="history-period">记录发生年代</label><select id="history-period" value={period} onChange={e => setPeriod(e.target.value)}><option value="all">全部年代与地区</option>
          {Object.entries(manifest.periods).map(([name,count]) => <option key={name} value={name}>{name} · {count}</option>)}</select></div>
        {filter === 'birthday' || filter === 'season' ? <p className="journey-hint">{state.birth ? filter === 'birthday' ? '按出生当地日期与资料换算公历的月日匹配，不混用原历生日。' : '按公历年内相距 14 天以内推荐，不表示月相或天象相同。' : '先保存你的出生时刻，才能查找日期上的联系。'}{!state.birth && <button className="journey-text-action" onClick={() => setTab('birth')}>填写出生信息 ↗</button>}</p>
          : filter === 'today' ? <p className="journey-hint">今天 {today} · 按你设备的当地月日匹配换算公历。</p> : null}
        <p className="journey-list-count" role="status">{matches.length} 条结果</p>
        <div className="journey-records">{matches.map(record => <button key={record.id} id={'history-record-'+record.id} onClick={() => navigate(record.id)}>
          <span className="journey-record-name">{record.name}<i aria-hidden="true">↗</i></span><span className="journey-record-meta">{record.date.iso} · {record.kind === 'birth' ? '出生' : '事件'} · {record.place.original}</span>
          {relationLabel(record, state.birth) && <span className="journey-relation">{relationLabel(record, state.birth)}</span>}
        </button>)}</div>
        {!matches.length && <p className="journey-empty">{filter === 'today' ? '这一天暂未收录资料。可以浏览全部人物与事件。' : filter === 'saved' ? '收藏感兴趣的人物或事件，稍后从这里继续。' : '没有符合条件的记录，试试其他关键词或年代。'}</p>}
        <p className="journey-coverage">当前覆盖 {manifest.monthDays} 个公历月日，年代以近代为主。资料持续补充；日期、时刻与地点的确定程度在各条详情中说明。</p>
      </>)}
    </div>
  </Root>;
}
