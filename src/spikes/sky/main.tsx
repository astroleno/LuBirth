import React, { Component, memo, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { resolutionCeiling } from '../../performance/adaptiveResolution';
import { useMobileLayout } from '../../performance/renderProfile';
import { createSkyFrame, cultureCenter, illustrationDirection, parseUtcInput } from './skyModel';
import type { SkyCulture, SkyFrame, SkyLocation } from './skyModel';
import { CHINESE_ARTWORK, SKY_SYSTEMS } from './skyCultures';
import type { SkySystem } from './skyCultures';
import { CHINESE_GROUPS, cultureGroup, isMajorCulture, SOURCE_LINKS } from './skyPresentation';
import { SkyObjects, HorizonGuide } from './SkyObjects';
import { SkyArtwork } from './SkyArtwork';
import { artworkUrl } from './ConstellationArt';
import { MilkyWay } from './MilkyWay';
import { artCacheSnapshot, disposeArtCache } from './artTextureCache';
import { NORTH_VIEW, SkyRuntime } from './SkyRuntime';
import type { SkyLabel, SkyView } from './SkyRuntime';
import { skyMetrics } from './skyPerformance';
import { DEFAULT_STAR_APPEARANCE } from './starAppearance';
import { skyCatalog as catalog } from './skyCatalog';
import manifest from './data/manifest.json';
import silhouettes from './data/chinese-art/silhouettes.json';
import type { Observation } from '../../history/observation';
import type { CultureVersion } from '../../history/journeyStore';
import { CULTURE_INFO } from '../../history/cultureVersions';
import { ObservationSummary } from '../../history/ObservationForm';
import type { CelestialState } from '../../astro/celestialState';
import { journeyStore } from '../../history/journeyStore';
import type { MoonPlacement } from '../../history/journeyStore';
import { directionToSkyView, observationKey } from '../../history/viewBridge';
import type { ViewTransfer } from '../../history/viewBridge';
import { MoonPlacementControl } from '../../components/MoonPlacementControl';
import { SceneControlsOutlet } from '../../components/experience/SceneControlsOutlet';
import type { SceneUIHost } from '../../components/experience/SceneUI';
import { SolarSystemObjects } from './SolarSystemObjects';
import './sky.css';

const CAMERA = { position: [0, 0, 0] as [number, number, number], fov: 85, near: .1, far: 200 };
const GL_OPTIONS = { alpha: true, antialias: true, powerPreference: 'low-power' as const };
const BASE = { utc: '2026-10-21T13:00', place: 'shanghai', magnitude: 6.5, ...DEFAULT_STAR_APPEARANCE,
  system: 'song' as SkySystem, group: 'all', culture: 'all', lines: true, motion: true, ground: true, art: true, galaxy: .85, measuring: false, moonSize: 1 };
type Settings = typeof BASE;
const YUHUANG_SETTINGS = { system: 'mansions' as SkySystem, group: 'dragon', culture: 'all', utc: '2026-07-21T14:00', place: 'shanghai', art: true };
const initialPreview = new URLSearchParams(window.location.search).get('view') === 'yuhuang';
const INITIAL = initialPreview ? { ...BASE, ...YUHUANG_SETTINGS } : BASE;
const photoFiles = import.meta.glob('../../../reference/sky/yuhuang-temple/photos/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const referencePhotos = Object.fromEntries(Object.entries(photoFiles).map(([path, url]) => [path.split('/').pop(), url]));
const artworkSequence = [...CHINESE_ARTWORK.values()];
const figureContours = new Map(silhouettes.entries.map(entry=>[entry.cultureId,entry.hull]));
type Pane = 'catalog' | 'artworks' | 'observation' | 'appearance' | 'detail' | 'reference' | 'sources' | 'diagnostics' | null;
const PLACES: Record<string, SkyLocation & { name: string }> = {
  shanghai: { name: '上海', latitude: 31.2304, longitude: 121.4737 },
  hangzhou: { name: '杭州', latitude: 30.2741, longitude: 120.1551 },
  north: { name: '北纬 70° · 东经 0°', latitude: 70, longitude: 0 },
  south: { name: '悉尼', latitude: -33.8688, longitude: 151.2093 },
};
const CARDINALS: SkyLabel[] = [
  { id: 'north', name: '北 · N', position: [0, 0, -1], cardinal: true },
  { id: 'east', name: '东 · E', position: [1, 0, 0], cardinal: true },
  { id: 'south', name: '南 · S', position: [0, 0, 1], cardinal: true },
  { id: 'west', name: '西 · W', position: [-1, 0, 0], cardinal: true },
];
const SourceLink = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>;

function MetricsPanel({ dpr }: { dpr: number }) {
  const metrics = useSyncExternalStore(skyMetrics.subscribe, skyMetrics.getSnapshot);
  const ms = (n: number | null) => n === null ? '—' : n.toFixed(2);
  return <>
    <p data-testid="sky-metrics">{metrics.state === 'hidden' ? '后台已暂停' : metrics.state === 'measuring'
      ? metrics.fps ? '连续测量 ' + metrics.fps.toFixed(1) + ' fps' : '正在采样' : '静止时按需绘制'}
      <br />累计 {metrics.renders} 帧 · 每帧 {metrics.calls} 次绘制
      <br />浏览器回调 {metrics.callbackFps?.toFixed(1) ?? '—'} Hz · 回调 P95 {ms(metrics.callbackP95)} ms
      <br />绘制间隔 P95 {ms(metrics.frameP95)} ms · CPU P95 {ms(metrics.cpuP95)} ms
      <br />GPU P95 {metrics.gpuSupported ? ms(metrics.gpuP95) + ' ms' : '浏览器未开放计时'}
      <br />画布 {metrics.width} × {metrics.height} · DPR {dpr.toFixed(2)}</p>
    <pre className="sky-raw-metrics" data-testid="sky-performance-json">{JSON.stringify(metrics)}</pre>
  </>;
}
const Scene = memo(function Scene({ frame, settings, items, daylight, dpr, view, orientation, labels, overlay, onView, moonPlacement }: {
  frame: SkyFrame; settings: Settings; items: SkyCulture[]; daylight: number; dpr: number; view: React.MutableRefObject<SkyView>;
  orientation: SkyView; labels: SkyLabel[]; overlay: React.RefObject<HTMLDivElement>; onView: (view: SkyView) => void;
  moonPlacement: MoonPlacement;
}) {
  return <Canvas frameloop={settings.measuring ? 'always' : 'demand'} dpr={dpr} camera={CAMERA} gl={GL_OPTIONS}
    fallback={<div className="sky-fallback">请使用支持 WebGL 的浏览器观看交互星空。</div>}>
    {settings.galaxy > 0 && <MilkyWay frame={frame} ground={settings.ground} daylight={daylight} strength={settings.galaxy} />}
    {settings.art && <SkyArtwork items={items} frame={frame} view={view} ground={settings.ground} daylight={daylight} selected={settings.culture} />}
    <SkyObjects frame={frame} magnitude={settings.magnitude} culture={settings.culture} items={items}
      lines={settings.lines} daylight={daylight} dpr={dpr} ground={settings.ground} chinese={settings.system !== 'modern'} appearance={settings} view={view} />
    <HorizonGuide />
    <SolarSystemObjects frame={frame} placement={moonPlacement} ground={settings.ground} portraitSize={settings.moonSize ?? 1} />
    <SkyRuntime view={view} revision={orientation} labels={labels} overlay={overlay} measuring={settings.measuring} ground={settings.ground} onView={onView} />
  </Canvas>;
});
class SkyBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="sky-fallback" role="alert">星空未能载入，请重新载入后再试。</div> : this.props.children; }
}
export type SkyViewState = { settings: Settings; orientation: SkyView; pane: Pane };
export default function SkySpike({ observation, cultureVersion, onCultureChange, onEditObservation, initialState, onStateChange,
  celestial, moonPlacement: controlledPlacement, onMoonPlacementChange, entryTransfer, chrome,
}: {
  observation?: Observation; cultureVersion?: CultureVersion; onCultureChange?: (version: CultureVersion) => void;
  onEditObservation?: () => void; initialState?: SkyViewState; onStateChange?: (value: SkyViewState) => void;
  celestial?: CelestialState; moonPlacement?: MoonPlacement; onMoonPlacementChange?: (value: MoonPlacement) => void; entryTransfer?: ViewTransfer;
  chrome?: SceneUIHost;
} = {}) {
  const mobile = useMobileLayout();
  const [settings, setSettings] = useState<Settings>(() => ({ ...INITIAL, ...initialState?.settings, system: cultureVersion || initialState?.settings.system || INITIAL.system })), [utcDraft, setUtcDraft] = useState(INITIAL.utc);
  const moonPreference = useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot).moonPlacement;
  const moonPlacement = controlledPlacement || moonPreference;
  const changeMoonPlacement = onMoonPlacementChange || journeyStore.setMoonPlacement;
  const [error, setError] = useState(''), [search, setSearch] = useState('');
  const [pane, setPane] = useState<Pane>(initialState?.pane || null), [pendingFocus, setPendingFocus] = useState<string | null>(!observation && initialPreview && !initialState ? 'chinese-samples' : null);
  useEffect(() => {
    if (chrome?.section === 'sky') setPane(current => current && ['catalog','artworks','detail','reference','sources'].includes(current) ? current : 'catalog');
    else if (chrome?.section === 'appearance') setPane(current => current === 'diagnostics' ? current : 'appearance');
  }, [chrome?.section]);
  const [orientation, setOrientation] = useState<SkyView>(initialState?.orientation || { ...NORTH_VIEW }), [dpr, setDpr] = useState(1);
  const view = useRef<SkyView>(orientation), overlay = useRef<HTMLDivElement>(null), dock = useRef<HTMLElement>(null);
  const location = observation?.observer || PLACES[settings.place], system = SKY_SYSTEMS[settings.system], chinese = settings.system !== 'modern';
  const version: CultureVersion = settings.system === 'mansions' ? 'song' : settings.system;
  const versionInfo = CULTURE_INFO[version];
  const sharedUtc = observation?.utc;
  const items = useMemo(() => system.items.filter(item => !chinese || settings.group === 'all' || cultureGroup(item) === settings.group), [system, chinese, settings.group]);
  const frame = useMemo(() => createSkyFrame(catalog, sharedUtc ? new Date(sharedUtc) : parseUtcInput(settings.utc), location, settings.motion, celestial), [settings.utc, sharedUtc, location, settings.motion, celestial]);
  const lastTransfer = useRef<ViewTransfer>();
  useEffect(() => {
    if (!entryTransfer || lastTransfer.current === entryTransfer || !observation || entryTransfer.observationKey !== observationKey(observation)) return;
    lastTransfer.current = entryTransfer;
    if (entryTransfer.reason === 'locate-target' && entryTransfer.targetId === 'body:moon') {
      const next = directionToSkyView(frame.observer.moon.direction, view.current.fov);
      view.current = next; setOrientation(next);
    } else if (entryTransfer.reason === 'birth-point' && !initialState) {
      view.current = { ...NORTH_VIEW }; setOrientation({ ...NORTH_VIEW });
    }
  }, [entryTransfer, observation, frame, initialState]);
  const daylight = THREE.MathUtils.smoothstep(-frame.sunAlt, 0, 18);
  const labels = useMemo(() => [...CARDINALS, ...(settings.lines && daylight > .025 ? items.map(item => ({
    id: item.id, name: settings.art && chinese && CHINESE_ARTWORK.has(item.id) ? CHINESE_ARTWORK.get(item.id)!.title : item.name,
    subtitle: settings.art && chinese && CHINESE_ARTWORK.has(item.id) ? item.name : undefined, cardinal: false,
    position: (item.id === settings.culture || chinese) && settings.art && item.image
      ? illustrationDirection(item.image, frame, item.image.size[0] * .5, item.image.size[1] * 1.06) : cultureCenter(item, frame),
    figure: settings.art && chinese && item.image ? (figureContours.get(item.id)??[[0,0],[1,0],[1,1],[0,1]]).map(([x,y])=>
      illustrationDirection(item.image!,frame,x*item.image!.size[0],y*item.image!.size[1]))
      .filter((p):p is [number,number,number]=>p!==null) : undefined,
    priority: item.id === settings.culture ? 100 : isMajorCulture(item) ? 50 : 10,
  })).filter((item): item is typeof item & { position: [number, number, number] } => item.position !== null)
    .sort((a, b) => b.priority - a.priority) : [])], [frame, items, settings.culture, settings.lines, settings.art, daylight, chinese]);
  const visibleStars = useMemo(() => catalog.stars.filter((star, i) => star[4] <= settings.magnitude
    && (!settings.ground || frame.positions[i * 3 + 1] >= 0)).length, [settings.magnitude, settings.ground, frame]);
  const selected = items.find(item => item.id === settings.culture);
  const selectedArtwork = selected ? CHINESE_ARTWORK.get(selected.id) : undefined;
  const center = selected ? cultureCenter(selected, frame) : null;
  const selectedAlt = center ? Math.asin(center[1]) * 180 / Math.PI : null;
  const options = items.filter(item => item.lines.flat().some(id => typeof id === 'number')
    && (item.id === settings.culture || (item.name + ' ' + item.english).toLowerCase().includes(search.trim().toLowerCase())));
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(previous => ({ ...previous, [key]: value }));
  const showView = (next: SkyView) => { view.current = next; setOrientation(next); };
  const focus = (id: string) => {
    const item = items.find(candidate => candidate.id === id);
    let p = item ? cultureCenter(item, frame) : null;
    if (id === 'chinese-samples') {
      const centers = items.filter(item => /0[56]A$/.test(item.id)).map(item => cultureCenter(item, frame)).filter((p): p is [number, number, number] => !!p);
      const sum = centers.reduce<number[]>((a, b) => a.map((value, i) => value + b[i]), [0, 0, 0]);
      const norm = Math.hypot(...sum); if (norm) p = sum.map(value => value / norm) as [number, number, number];
    }
    if (!p || (settings.ground && p[1] < 0)) return;
    if(settings.art && chinese && item?.image){
      const artCenter=illustrationDirection(item.image,frame,item.image.size[0]/2,item.image.size[1]/2);
      if(artCenter && (!settings.ground || artCenter[1]>=0))p=artCenter;
    }
    const panelBounds = (chrome?.target?.closest('.experience-panel') ?? dock.current)?.getBoundingClientRect();
    const sidePanel = !!chrome && !!panelBounds && panelBounds.left > innerWidth * .45;
    const panelHeight = sidePanel ? 0 : panelBounds?.height ?? 64;
    const rightSpace = sidePanel && panelBounds ? innerWidth - panelBounds.left : 0;
    const azimuth = Math.atan2(p[0], -p[2]), altitude = Math.asin(p[1]);
    const drawings = id === 'chinese-samples' ? items.filter(item => /0[56]A$/.test(item.id) && item.image) : settings.art && item?.image ? [item] : [];
    let fov = 70;
    const topSpace = chrome ? 74 : innerWidth < 600 ? 180 : 90, bottomSpace = panelHeight + 24 + (drawings.length && settings.lines ? 40 : 0);
    if (drawings.length) {
      const right = [Math.cos(azimuth), 0, Math.sin(azimuth)];
      const up = [-Math.sin(azimuth) * Math.sin(altitude), Math.cos(altitude), Math.cos(azimuth) * Math.sin(altitude)];
      const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
      const corners = drawings.flatMap(({ image }) => [[0, 0], [0, 1], [1, 0], [1, 1]]
        .map(([x, y]) => illustrationDirection(image!, frame, x * image!.size[0], y * image!.size[1])))
        .filter((point): point is [number, number, number] => !!point && dot(point, p!) > .01);
      const horizontal = Math.max(...corners.map(point => Math.abs(dot(point, right) / dot(point, p!)))) / (innerWidth / innerHeight)
        * innerWidth / Math.max(180, innerWidth - rightSpace);
      const vertical = Math.max(...corners.map(point => Math.abs(dot(point, up) / dot(point, p!))))
        * innerHeight / Math.max(180, innerHeight - topSpace - bottomSpace);
      fov = THREE.MathUtils.clamp(2 * Math.atan(Math.max(horizontal, vertical) * 1.12) * 180 / Math.PI,
        chinese && id!=='chinese-samples' ? 25 : 40, 100);
    }
    const offset = Math.atan(Math.tan(THREE.MathUtils.degToRad(fov / 2)) * (bottomSpace - topSpace) / innerHeight) * 180 / Math.PI;
    const horizontalOffset = Math.atan(Math.tan(THREE.MathUtils.degToRad(fov / 2)) * rightSpace / innerHeight) * 180 / Math.PI;
    showView({ azimuth: (azimuth * 180 / Math.PI + horizontalOffset + 360) % 360,
      altitude: THREE.MathUtils.clamp(altitude * 180 / Math.PI - offset, -85, 85), fov });
  };
  const choose = (id: string, nextPane: Pane = 'detail') => {
    const target = system.items.find(item => item.id === id);
    setSettings(previous => ({ ...previous, culture: id,
      group: target && previous.group !== 'all' ? cultureGroup(target) : previous.group }));
    setPane(id === 'all' ? 'catalog' : nextPane); setPendingFocus(id);
    chrome?.open('sky');
  };
  const closePane = () => { setPane(null); chrome?.close(); if (selectedArtwork) setPendingFocus(selectedArtwork.cultureId); };
  const stepArtwork = (direction: number) => {
    const index = artworkSequence.findIndex(entry => entry.cultureId === selectedArtwork?.cultureId);
    const next = artworkSequence[(index + direction + artworkSequence.length) % artworkSequence.length];
    choose(next.cultureId, pane === 'reference' ? 'reference' : 'detail');
  };
  const openArtworkCatalog = () => {
    onCultureChange?.('song');
    setSettings(previous => ({ ...previous, system: 'mansions', group: 'all', culture: 'all' }));
    setSearch(''); setPane('artworks');
  };
  const showSelectedLineArt = () => {
    setSettings(previous => ({ ...previous, art: true,
      ground: selectedAlt !== null && selectedAlt < 0 ? false : previous.ground }));
    closePane();
  };
  useEffect(() => { if (pendingFocus) { focus(pendingFocus); setPendingFocus(null); } }, [pendingFocus, frame, items]);
  useEffect(() => {
    if (cultureVersion && cultureVersion !== version) {
      setSettings(previous => ({ ...previous, system: cultureVersion, group: 'all', culture: 'all' }));
      setSearch(''); setPane(chrome?.section === 'sky' ? 'catalog' : chrome?.section === 'appearance' ? 'appearance' : null);
    }
  }, [cultureVersion, version]);
  useEffect(() => { onStateChange?.({ settings, orientation, pane }); }, [settings, orientation, pane, onStateChange]);
  useEffect(() => {
    dock.current?.querySelector('.sky-pane-content')?.scrollTo({ top: 0 });
    if (chrome) dock.current?.closest('.experience-panel-content')?.scrollTo({ top: 0 });
  }, [pane, selectedArtwork?.cultureId]);
  useEffect(() => {
    const resize = () => setDpr(resolutionCeiling(innerWidth, innerHeight, devicePixelRatio, mobile ? 1.5 : 2, 1_500_000));
    resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize);
  }, [mobile]);
  useEffect(() => () => disposeArtCache(), []);
  useEffect(() => {
    if (chrome) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape' && pane) closePane(); };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [pane, selectedArtwork, chrome]);
  useEffect(() => {
    (window as any).__skySpike = {
      get ready() { return skyMetrics.getSnapshot().renders > 0; }, get metrics() { return skyMetrics.getSnapshot(); },
      get artCache() { return artCacheSnapshot(); }, settings: { ...settings, utc: sharedUtc || settings.utc }, observer: location, sunAltitude: frame.sunAlt, visibleStars,
      observationUtc: frame.date.toISOString(),
      orientation, dpr, catalog: manifest, cultureCount: system.items.length, chineseArtCount: SKY_SYSTEMS.song.items.filter(item => item.image).length,
      limitations: ['3 HIP component proxies; additional 115125 only in Chenzhuo culture', 'M7/M31/M44 not rendered', 'mansion boundaries unverified',
        'no refraction/annual aberration/parallax', 'IAU boundaries not rendered', 'historical binary-star motion differs between catalogs',
        'Chinese artwork: photographic labels, independent museum identification pending', 'Milky Way: fixed J2000 low-frequency density, not photometry'],
    };
  }, [settings, location, frame, visibleStars, orientation, dpr, system, sharedUtc]);
  const commitDate = (event: React.FormEvent) => {
    event.preventDefault(); try { parseUtcInput(utcDraft); update('utc', utcDraft); setError(''); } catch (e) { setError((e as Error).message); }
  };
  const changeDay = (days: number) => {
    const date = parseUtcInput(settings.utc); date.setUTCDate(date.getUTCDate() + days); const next = date.toISOString().slice(0, 16);
    try { parseUtcInput(next); update('utc', next); setUtcDraft(next); setError(''); } catch (e) { setError((e as Error).message); }
  };
  const sample = () => {
    onCultureChange?.('song');
    setSettings(previous => ({ ...previous, ...(observation ? { system: 'mansions' as SkySystem, group: 'dragon', culture: 'all', ground: false, art: true } : YUHUANG_SETTINGS) }));
    if (!observation) setUtcDraft(YUHUANG_SETTINGS.utc);
    setSearch(''); setPendingFocus('chinese-samples'); setPane(null);
  };
  const title = pane === 'artworks' ? '玉皇庙 · 二十八宿' : pane === 'catalog' ? chinese ? '三垣 · 四象 · 二十八宿' : '现代 88 星座'
    : pane === 'observation' ? '此时，此地' : pane === 'appearance' ? '星光与图绘' : pane === 'sources' ? '这片星空的出处'
    : pane === 'reference' ? (selectedArtwork?.title || '图绘') + ' · 实物对照' : pane === 'diagnostics' ? '运行记录'
      : selectedArtwork ? selectedArtwork.title + ' · ' + selectedArtwork.name : selected?.name || '星空';
  const artworkOpen = (!chrome || chrome.section === 'sky') && pane === 'detail' && !!selectedArtwork;
  return <main className="sky-spike" data-portrait={artworkOpen || undefined}>
    <SkyBoundary><div className="sky-canvas"><Scene frame={frame} settings={settings} items={items} daylight={daylight} dpr={dpr}
      view={view} orientation={orientation} labels={labels} overlay={overlay} onView={setOrientation} moonPlacement={moonPlacement} /></div></SkyBoundary>
    <div ref={overlay} className="sky-labels">{labels.map(label => label.cardinal
      ? <span key={label.id} data-label-id={label.id} data-cardinal="true" hidden aria-hidden="true">{label.name}</span>
      : <button key={label.id} data-label-id={label.id} data-selected={label.id === settings.culture || undefined} hidden
        tabIndex={artworkOpen ? -1 : 0}
        onClick={() => choose(label.id)} aria-label={'查看'+(label.subtitle?label.subtitle+' · ':'')+label.name}>
        <span className="sky-label-title">{label.name}</span>{label.subtitle&&<span className="sky-label-subtitle">{label.subtitle}</span>}</button>)}</div>
    {!chrome && <header className="sky-heading"><p>LuBirth <span>{observation ? '此时 · 此地 · 此天' : '独立星空试验'}</span></p><h1>星河有迹</h1>
      <div>{location.name} · {(sharedUtc || settings.utc).replace('T', ' ').replace(/\.\d+Z$/, '').replace(/Z$/, '')} UTC</div>
      <small>{versionInfo.name}{version === 'song' && settings.art ? ' · 当代人物图绘' : ''}</small>
      {version === 'song' && <button className="sky-feature-link" onClick={openArtworkCatalog}>玉皇庙图绘 · 浏览二十八宿 ↗</button>}
      {daylight <= .025 && <p className="sky-daylight-note" role="status">
        {frame.sunAlt >= 0 ? '当地正值白昼，星光暂被日光遮蔽。' : '当地天色尚亮，星光暂被日光遮蔽。'}
      </p>}
      {moonPlacement === 'physical' && frame.observer.moon.altitudeDeg < 0 && <p className="sky-help" role="status">
        月球此时在地平线下。{settings.ground && <button className="sky-feature-link" onClick={() => update('ground', false)}>查看地平线下的天空 ↗</button>}
      </p>}
    </header>}
    {chrome && (daylight <= .025 || moonPlacement === 'physical' && frame.observer.moon.altitudeDeg < 0) && <div className="experience-sky-notes" role="status" data-sky-obstruction>
      {daylight <= .025 && <p>{frame.sunAlt >= 0 ? '当地正值白昼，星光暂被日光遮蔽。' : '当地天色尚亮，星光暂被日光遮蔽。'}</p>}
      {moonPlacement === 'physical' && frame.observer.moon.altitudeDeg < 0 && <p>月球此时在地平线下。{settings.ground && <button onClick={() => update('ground', false)}>查看地平线下的天空 ↗</button>}</p>}
    </div>}
    <SceneControlsOutlet host={chrome ? chrome.target : undefined} active={!!chrome?.section}>
    <section className={chrome ? 'sky-controls-embedded' : 'sky-dock'} ref={dock} data-expanded={!!pane} data-artwork={pane === 'detail' && !!selectedArtwork || undefined} aria-label="星空控制">
      {pane && <div className="sky-pane" id="sky-pane">
        <div className="sky-pane-heading"><h2>{title}</h2>{!chrome && <button aria-label="收起面板" onClick={closePane}>×</button>}</div>
        <div className="sky-pane-content">
          {pane === 'catalog' && <>
            {chrome && version === 'song' && <button className="sky-feature-link" onClick={openArtworkCatalog}>玉皇庙图绘 · 浏览二十八宿 ↗</button>}
            {chinese && <div className="sky-field-row"><label htmlFor="sky-group">天区</label><select id="sky-group" value={settings.group} onChange={e => setSettings(s => ({ ...s, group: e.target.value, culture: 'all' }))}>
              {CHINESE_GROUPS.map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select>
              {version === 'song' && <label className="sky-check"><input id="sky-mansions" type="checkbox" checked={settings.system === 'mansions'} onChange={e => setSettings(s => ({ ...s, system: e.target.checked ? 'mansions' : 'song', group: 'all', culture: 'all' }))} />仅二十八宿</label>}</div>}
            <label className="sky-sr-only" htmlFor="sky-search">查找星座或星官</label><input id="sky-search" type="search" placeholder={chinese ? '查找星官，例如：心宿、紫微垣' : '查找星座，例如：猎户座、Orion'} value={search} onChange={e => setSearch(e.target.value)} />
            <label className="sky-sr-only" htmlFor="sky-culture">选择星座或星官</label><select id="sky-culture" value={settings.culture} onChange={e => choose(e.target.value)}>
              <option value="all">浏览全部 · {options.length} 条绘图记录</option>{options.map(item => <option key={item.id} value={item.id}>{item.name}{CHINESE_ARTWORK.has(item.id) ? ' · ' + CHINESE_ARTWORK.get(item.id)!.title : ''}</option>)}</select>
            <p className="sky-help">{chinese ? '远望看三垣与主宿，放大后逐渐展开其余星官。点击天空中的名称可查看出处。' : '视野内的星座图绘随天空一起展开。点击名称查看单个星座。'}</p>
            {!chrome && <p className="sky-help">{versionInfo.description}</p>}
            <div className="sky-actions">{version === 'song' && <>{!chrome && <button onClick={openArtworkCatalog}>浏览二十八尊原型</button>}<button onClick={sample}>同看心月狐与尾火虎</button></>}<button onClick={() => setPane('sources')}>数据与出处 ↗</button></div>
          </>}
          {pane === 'artworks' && <>
            <p className="sky-help">夜空看细线轮廓，点选看完整淡彩原型。按四象排列，共 {artworkSequence.length} 尊。</p>
            <div className="sky-mansion-index">{CHINESE_GROUPS.filter(([key]) => ['dragon', 'tortoise', 'tiger', 'bird'].includes(key)).map(([key, name]) =>
              <section key={key} aria-label={name}><h3>{name}</h3><div>{artworkSequence.filter(entry => entry.group === key).map(entry =>
                <button key={entry.cultureId} aria-label={'查看' + entry.title + '原型'} onClick={() => choose(entry.cultureId)}>
                  <small>{String(entry.number).padStart(2, '0')}</small><span>{entry.title}</span></button>)}</div></section>)}</div>
            <div className="sky-actions"><button onClick={sample}>同看心月狐与尾火虎</button><button onClick={() => setPane('sources')}>照片与出处</button></div>
          </>}
          {pane === 'detail' && selected && (selectedArtwork ? <div className="sky-portrait">
            <figure className="sky-portrait-figure"><img key={selectedArtwork.cultureId} src={artworkUrl(selectedArtwork.image.file)}
              width={selectedArtwork.image.size[0]} height={selectedArtwork.image.size[1]} alt={selectedArtwork.title + '完整淡彩原型'} />
              <figcaption>淡彩原型 · 玉皇庙彩塑转绘</figcaption></figure>
            <div className="sky-portrait-notes">
              <p className="sky-eyebrow">{CHINESE_GROUPS.find(([key]) => key === selectedArtwork.group)?.[1]} · {String(selectedArtwork.number).padStart(2, '0')} / 28</p>
              <p>{selectedArtwork.summary}</p>
              <p className="sky-help">夜空中以高光线稿辨认轮廓，在这里看完整姿态与淡彩。造型参照玉皇庙实物照片，遮挡部位与纹样作绘画补全。</p>
              {selectedArtwork.adaptationNote && <p className="sky-help">{selectedArtwork.adaptationNote}</p>}
              <p className="sky-help">摄影 Patrick20242023 · 转绘 LuBirth（AI 辅助）<br /><SourceLink href={selectedArtwork.photograph.licenseUrl}>CC BY-SA 4.0</SourceLink></p>
              <div className="sky-artwork-pagination"><button onClick={() => stepArtwork(-1)}>← 上一宿</button><button onClick={openArtworkCatalog}>全部二十八宿</button><button onClick={() => stepArtwork(1)}>下一宿 →</button></div>
              <div className="sky-actions"><button onClick={showSelectedLineArt}>{selectedAlt !== null && selectedAlt < 0 && settings.ground ? '关闭地平线遮挡看线稿' : '在夜空中看线稿'}</button>
                <button onClick={() => setPane('reference')}>实物对照</button><button onClick={() => setPane('sources')}>查看出处</button></div>
              {selectedAlt !== null && selectedAlt < 0 && settings.ground && <p className="sky-help">这宿当前在地平线下，原型仍可完整浏览。</p>}
            </div>
          </div> : <>
            <p className="sky-eyebrow">{chinese ? CHINESE_GROUPS.find(([key]) => key === cultureGroup(selected))?.[1] : selected.english}
              <span>中心高度 {selectedAlt?.toFixed(1)}° · {selectedAlt !== null && selectedAlt < 0 ? '地平线下' : '地平线上'}</span></p>
            <p>{chinese ? /\d{2}A$/.test(selected.id) ? '二十八宿中的主星官。此处的连线描述星形，不代表宿界。' : versionInfo.name + '；图形依据 Stellarium 所收录的文献研究。'
              : '星座连线是一种辨认星形的画法；与 IAU 定义的星座区域边界不同。'}</p>
            <p className="sky-help">{selected.image ? chinese ? '图绘参照玉皇庙彩塑实物照片，保留人物姿态、衣甲与伴生动物，以 AI 辅助转为线描淡彩。属于当代转绘；遮挡部位与纹样有绘画补全。' : '图绘采用 Stellarium 现代星空文化原图，沿原始 HIP 恒星锚点贴合天空。' : '该对象暂未配置独立图绘，仍显示真实星位与文化连线。'}</p>
            <div className="sky-actions"><button disabled={!center || (settings.ground && center[1] < 0)} onClick={() => focus(selected.id)}>定位{selected.name}</button>
              {selectedArtwork && <button onClick={() => setPane('reference')}>实物对照</button>}
              <button onClick={() => setPane('sources')}>查看出处</button><button onClick={() => setPane('catalog')}>继续浏览</button></div>
            {selectedAlt !== null && selectedAlt < 0 && settings.ground && <p className="sky-help">当前位于地平线下，可在「画面」中关闭地平线遮挡后查看。</p>}
          </>)}
          {pane === 'reference' && selectedArtwork && <>
            <div className="sky-reference-pair">
              <figure><img src={referencePhotos[selectedArtwork.photograph.localFile]} alt={selectedArtwork.title + '玉皇庙实物照片'} /><figcaption>玉皇庙实物 · 摄影参考</figcaption></figure>
              <figure><img src={artworkUrl(selectedArtwork.image.file)} alt={selectedArtwork.title + '完整淡彩原型'} /><figcaption>淡彩原型 · 当代转绘</figcaption></figure>
            </div>
            <p className="sky-help">摄影 Patrick20242023；转绘 LuBirth（AI 辅助）。照片与转绘均采用 <SourceLink href={selectedArtwork.photograph.licenseUrl}>CC BY-SA 4.0</SourceLink>。<SourceLink href={selectedArtwork.photograph.page}>查看原始照片</SourceLink></p>
            {selectedArtwork.adaptationNote && <p className="sky-help">{selectedArtwork.adaptationNote}</p>}
            <div className="sky-actions"><button onClick={() => setPane('detail')}>返回完整原型</button><button onClick={closePane}>回到夜空</button>
              <button onClick={() => stepArtwork(-1)}>上一宿</button><button onClick={() => stepArtwork(1)}>下一宿</button></div>
          </>}
          {pane === 'observation' && (observation ? <><ObservationSummary observation={observation} /><p className="sky-help">地月与观天共用这一份时间地点。更换星图视角不会改变时刻。</p><div className="sky-actions"><button onClick={onEditObservation}>我的出生信息</button></div></> : <form onSubmit={commitDate}>
            <div className="sky-two-columns"><div><label htmlFor="sky-date">观察时间 · 公历 UTC</label>
              <input id="sky-date" type="datetime-local" value={utcDraft} min="0001-01-01T00:00" max="2999-12-31T23:59" aria-describedby="sky-time-help" aria-invalid={!!error} required onChange={e => setUtcDraft(e.target.value)} /></div>
              <div><label htmlFor="sky-place">观察地点</label><select id="sky-place" value={settings.place} onChange={e => update('place', e.target.value)}>{Object.entries(PLACES).map(([key, place]) => <option key={key} value={key}>{place.name}</option>)}</select></div></div>
            <p className="sky-help" id="sky-time-help">北京时间 = UTC + 8 小时。古籍原历与地方时须另行核算；这里的时刻仅用于观测演示。</p>
            {error && <p role="alert" className="sky-error">{error}</p>}
            <div className="sky-actions"><button type="button" onClick={() => changeDay(-1)}>前一天</button><button type="button" onClick={() => changeDay(1)}>后一天</button><button type="submit">应用时间</button></div>
            <label className="sky-check"><input id="sky-motion" type="checkbox" checked={settings.motion} onChange={e => update('motion', e.target.checked)} />按日期计算恒星自行</label>
          </form>)}
          {pane === 'appearance' && <>
            <MoonPlacementControl value={moonPlacement} onChange={changeMoonPlacement}
              belowHorizon={frame.observer.moon.altitudeDeg < 0} onLocate={() => showView(directionToSkyView(frame.observer.moon.direction, view.current.fov))} />
            {moonPlacement === 'portrait' && <div><label htmlFor="sky-moon-size">合影月球大小<output>{(settings.moonSize ?? 1).toFixed(1)}×</output></label>
              <input id="sky-moon-size" type="range" min=".6" max="1.5" step=".1" value={settings.moonSize ?? 1} onChange={e => update('moonSize', Number(e.target.value))} /></div>}
            <div className="sky-field-row"><label className="sky-check"><input id="sky-lines" type="checkbox" checked={settings.lines} onChange={e => update('lines', e.target.checked)} />连线与名称</label>
              <label className="sky-check"><input id="sky-art" type="checkbox" checked={settings.art} onChange={e => update('art', e.target.checked)} />星空图绘</label>
              <label className="sky-check"><input id="sky-ground" type="checkbox" checked={settings.ground} onChange={e => update('ground', e.target.checked)} />地平线遮挡</label></div>
            <div className="sky-two-columns">{([
              ['magnitude', '最暗可见星', 3, 6.5, .5, 'sky-magnitude'], ['brightness', '星光亮度', .6, 1.5, .05, 'sky-brightness'],
              ['colorStrength', '冷暖色彩', 0, 1.6, .1, 'sky-color'], ['glow', '柔光强度', 0, 1.4, .05, 'sky-glow'],
              ['galaxy', '银河氛围', 0, 1.5, .05, 'sky-galaxy'],
            ] as const).map(([key, name, min, max, step, id]) => <div key={key}><label htmlFor={id}>{name}<output>{settings[key].toFixed(2)}</output></label><input id={id} type="range" min={min} max={max} step={step} value={settings[key]} onChange={e => update(key, Number(e.target.value))} /></div>)}</div>
            <div className="sky-actions"><button aria-label="缩小星空" onClick={() => showView({ ...view.current, fov: Math.min(110, view.current.fov * 1.2) })}>− 缩小</button>
              <button aria-label="放大星空" onClick={() => showView({ ...view.current, fov: Math.max(25, view.current.fov / 1.2) })}>＋ 放大</button><button onClick={() => showView({ ...NORTH_VIEW })}>回到北方</button><button onClick={() => setPane('diagnostics')}>运行记录</button></div>
          </>}
          {pane === 'sources' && <div className="sky-sources">
            {selected && <p className="sky-eyebrow">{selected.name} · {selected.id}</p>}
            <dl><dt>恒星位置、星等、冷暖</dt><dd><SourceLink href={SOURCE_LINKS.stars}>HYG 4.4 · 冻结版本</SourceLink><p>已核对来源与坐标转换。{catalog.stars.length.toLocaleString()} 颗恒星；星等与色指数来自星表，柔光是视觉呈现。古代双星运动仍存在星表间差异。</p></dd>
              <dt>{chinese ? '中国星官与连线' : '现代星座与连线'}</dt><dd><SourceLink href={versionInfo.source}>{versionInfo.name}</SourceLink><p>{system.help}</p><p>{versionInfo.author}</p></dd>
              <dt>星空图绘</dt><dd>{chinese ? <><SourceLink href={SOURCE_LINKS.yuhuang}>玉皇庙二十八星宿 · 28 尊实物摄影</SourceLink><p>{artworkSequence.length} 尊依据 Patrick20242023 的实物照片转绘；各有夜空高光细线稿与完整淡彩原型。摄影与衍生图绘均为 CC BY-SA 4.0。保留可见姿态，遮挡部分与纹样作绘画补全。名称沿用摄影者标注，独立馆藏考证待补。</p><p>图绘在天空中的位置为当代构图，辅助 HIP 星仅用于配准，不加入星官连线。<SourceLink href={SOURCE_LINKS.animals}>动物名称的文本参考</SourceLink></p></>
                : <><SourceLink href="https://artlibre.org/licence/lal/en/">Stellarium 原图 · Free Art License</SourceLink><p>85 个图绘条目。船尾座、巨蛇座、船帆座未配置独立图绘，不以假图补齐。</p></>}</dd>
              <dt>银河背景</dt><dd><SourceLink href={SOURCE_LINKS.nasa}>NASA / Goddard SVS · Deep Star Maps 2020</SourceLink><p>J2000 赤道坐标星图，经亮点抑制与低通处理后呈现银河星密度；不是无星摄影或光度测量。使用同一观测旋转，底图形态固定于 J2000。</p></dd></dl>
            <div className="sky-actions"><button onClick={() => setPane(selected ? 'detail' : 'catalog')}>返回{selected?.name || '浏览'}</button><button onClick={() => setPane('diagnostics')}>运行记录</button></div>
          </div>}
          {pane === 'diagnostics' && <>
            <label className="sky-check"><input id="sky-measuring" type="checkbox" checked={settings.measuring} onChange={e => update('measuring', e.target.checked)} />连续测量 · 目标 30 FPS</label>
            <MetricsPanel dpr={dpr} /><p className="sky-help">{settings.ground ? '地平线上' : '全天'} {visibleStars.toLocaleString()} 颗星 · 太阳高度 {frame.sunAlt.toFixed(1)}°。日常静止时停止重绘，后台暂停。</p>
            <p className="sky-help">图绘最多同时显示桌面 8 幅 / 窄屏 5 幅；纹理缓存 12 项、估算上限 64 MiB。真实 iPhone Safari 仍待测试。</p>
          </>}
        </div>
      </div>}
      {!chrome && <nav className="sky-toolbar" aria-label="星图工具">
        <label className="sky-sr-only" htmlFor="sky-system">星空文化</label><select id="sky-system" value={version} onChange={e => {
          onCultureChange?.(e.target.value as CultureVersion);
          setSettings(s => ({ ...s, system: e.target.value as SkySystem, group: 'all', culture: 'all' })); setSearch(''); if (pane === 'detail' || pane === 'reference') setPane('catalog');
        }}><option value="song">宋代星官</option><option value="chenzhuo">陈卓体系 · 三世纪</option><option value="yuan">元代星官</option><option value="modern">现代 88 星座</option></select>
        {([['catalog', '星官'], ['observation', '观测'], ['appearance', '画面']] as const).map(([key, name]) => <button key={key} aria-controls="sky-pane" aria-expanded={pane === key} data-active={pane === key} onClick={() => setPane(pane === key ? null : key)}>{key === 'catalog' && !chinese ? '星座' : name}</button>)}
        <span className="sky-toolbar-caption">拖动转向 · 滚轮缩放</span>
      </nav>}
    </section>
    </SceneControlsOutlet>
    {!chrome && <footer className="sky-footer"><span>{mobile ? '拖动转向 · 双指缩放' : '同一片天空，不同的故事'}</span>
      <span>方位 {orientation.azimuth.toFixed(0)}° · 仰角 {orientation.altitude.toFixed(0)}° · 视场 {orientation.fov.toFixed(0)}°</span></footer>}
  </main>;
}
