import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FrameCadence, GpuTimer, percentile, skyMetrics } from './skyPerformance';
import { layoutSkyLabels } from './skyLabelLayout';
import type { LabelCandidate, PlacedLabel, ScreenPoint, ScreenRect } from './skyLabelLayout';

export type SkyView = { azimuth: number; altitude: number; fov: number };
export type SkyLabel = { id: string; name: string; subtitle?: string; position: [number, number, number];
  figure?: [number, number, number][]; cardinal?: boolean; priority?: number };
export const NORTH_VIEW: SkyView = { azimuth: 0, altitude: 30, fov: 85 };

export function SkyRuntime({ view, revision, labels, overlay, measuring, ground, onView }: {
  view: React.MutableRefObject<SkyView>; labels: SkyLabel[]; overlay: React.RefObject<HTMLDivElement>;
  revision: SkyView;
  measuring: boolean; ground: boolean; onView: (view: SkyView) => void;
}) {
  const { gl, invalidate, setFrameloop, size } = useThree();
  const clock = useMemo(() => new FrameCadence(), []);
  const timer = useMemo(() => new GpuTimer(gl.getContext()), [gl]);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const nodes = useRef(new Map<string, HTMLElement>());
  const dimensions = useRef(new Map<string, { w: number; h: number }>());
  const placements = useRef(new Map<string, PlacedLabel>());
  const lastProjection = useRef('');
  const lastCamera = useRef('');
  // Orient before screen-anchored objects update, including while dragging.
  useFrame(({ camera }) => {
    const v = view.current, key = `${v.azimuth},${v.altitude},${v.fov}`;
    if (lastCamera.current === key) return;
    lastCamera.current = key;
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = v.fov; perspective.updateProjectionMatrix();
    const az = THREE.MathUtils.degToRad(v.azimuth), alt = THREE.MathUtils.degToRad(v.altitude);
    camera.lookAt(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt));
    camera.updateMatrixWorld();
  }, -1);
  const settle = useRef<ReturnType<typeof setTimeout>>();
  const stats = useRef({ start: performance.now(), lastCallback: 0, lastRender: 0, renders: 0, longTasks: 0,
    callbacks: [] as number[], frames: [] as number[], cpu: [] as number[], gpu: [] as number[] });
  const report = (state: 'idle' | 'drawing' | 'measuring' | 'hidden') => {
    const s = stats.current, duration = performance.now() - s.start;
    skyMetrics.publish({ state, fps: measuring && duration > 0 ? s.cpu.length * 1000 / duration : null,
      callbackFps: measuring && s.callbacks.length ? 1000 / (s.callbacks.reduce((a, b) => a + b, 0) / s.callbacks.length) : null,
      callbackP95: percentile(s.callbacks, .95), frameP95: percentile(s.frames, .95),
      cpuMs: s.cpu.length ? s.cpu.reduce((a, b) => a + b, 0) / s.cpu.length : skyMetrics.getSnapshot().cpuMs,
      cpuP95: percentile(s.cpu, .95), gpuP95: percentile(s.gpu, .95), gpuSupported: timer.supported,
      calls: gl.info.render.calls, points: gl.info.render.points, segments: gl.info.render.lines,
      triangles: gl.info.render.triangles, width: gl.domElement.width,
      height: gl.domElement.height, renders: s.renders, longTasks: s.longTasks,
      longTasksSupported: typeof PerformanceObserver !== 'undefined' && !!PerformanceObserver.supportedEntryTypes?.includes('longtask'),
      focused: document.hasFocus() });
    s.start = performance.now(); s.callbacks = []; s.frames = []; s.cpu = []; s.gpu = []; s.longTasks = 0;
  };
  const reportRef = useRef(report); reportRef.current = report;
  useEffect(() => {
    nodes.current = new Map(Array.from(overlay.current?.querySelectorAll<HTMLElement>('[data-label-id]') ?? [])
      .map(node => [node.dataset.labelId!, node]));
    const measure=()=>{
      const prior=[...nodes.current].map(([id,node])=>({id,node,hidden:node.hidden,visibility:node.style.visibility}));
      // One batched layout read on content/viewport changes, never in the render loop.
      for(const {node} of prior){node.style.visibility='hidden';node.hidden=false;}
      dimensions.current=new Map(prior.map(({id,node})=>{const r=node.getBoundingClientRect();return [id,{w:Math.ceil(r.width),h:Math.ceil(r.height)}];}));
      for(const {node,hidden,visibility} of prior){node.hidden=hidden;node.style.visibility=visibility;}
      placements.current.clear();lastProjection.current='';invalidate();
    };
    let active=true;measure();
    void document.fonts.ready.then(()=>{if(active)measure();});
    return ()=>{active=false;};
  }, [labels, overlay, invalidate, size.width, size.height]);
  useEffect(() => { invalidate(); }, [revision, ground, invalidate]);
  useEffect(() => {
    const observer = new ResizeObserver(() => { lastProjection.current = ''; invalidate(); });
    document.querySelectorAll('.sky-dock, .sky-heading, .sky-footer, [data-sky-obstruction]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [invalidate]);
  useEffect(() => {
    clock.reset();
    const visibility = () => {
      clearTimeout(settle.current);
      const s = stats.current;
      s.start = performance.now(); s.lastCallback = 0; s.lastRender = 0;
      s.callbacks = []; s.frames = []; s.cpu = []; s.gpu = []; s.longTasks = 0;
      clock.reset();
      setFrameloop(document.hidden ? 'never' : measuring ? 'always' : 'demand');
      reportRef.current(document.hidden ? 'hidden' : measuring ? 'measuring' : 'idle');
      if (!document.hidden) invalidate();
    };
    document.addEventListener('visibilitychange', visibility); visibility();
    return () => { clearTimeout(settle.current); document.removeEventListener('visibilitychange', visibility); };
  }, [measuring, clock, invalidate, setFrameloop]);
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined' || !PerformanceObserver.supportedEntryTypes?.includes('longtask')) return;
    const observer = new PerformanceObserver(list => { stats.current.longTasks += list.getEntries().length; });
    observer.observe({ type: 'longtask' }); return () => observer.disconnect();
  }, []);
  useEffect(() => () => timer.dispose(), [timer]);
  useEffect(() => {
    const canvas = gl.domElement;
    const pointers = new Map<number, { x: number; y: number }>();
    const zoom = (factor: number) => { view.current = { ...view.current,
      fov: THREE.MathUtils.clamp(view.current.fov * factor, 25, 110) }; invalidate(); };
    const down = (event: PointerEvent) => {
      if (pointers.size >= 2) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const point = { x: event.clientX, y: event.clientY };
      if (pointers.size === 2) {
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)![1];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance > 8) zoom(Math.hypot(previous.x - other.x, previous.y - other.y) / distance);
      } else {
        const scale = view.current.fov / Math.max(240, Math.min(size.width, size.height));
        view.current = { ...view.current, azimuth: (view.current.azimuth - (point.x - previous.x) * scale + 360) % 360,
          altitude: THREE.MathUtils.clamp(view.current.altitude + (point.y - previous.y) * scale, -85, 85) };
        invalidate();
      }
      pointers.set(event.pointerId, point);
    };
    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      onView({ ...view.current });
    };
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoom(Math.exp(event.deltaY * .001)); onView({ ...view.current }); };
    const key = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', '+', '=', '-'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') view.current = { ...NORTH_VIEW };
      else if (['+', '=', '-'].includes(event.key)) zoom(event.key === '-' ? 1.15 : 1 / 1.15);
      else view.current = { ...view.current,
        azimuth: (view.current.azimuth + (event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0) + 360) % 360,
        altitude: THREE.MathUtils.clamp(view.current.altitude + (event.key === 'ArrowUp' ? 5 : event.key === 'ArrowDown' ? -5 : 0), -85, 85) };
      onView({ ...view.current }); invalidate();
    };
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', '交互星空：拖动或方向键转向，滚轮、双指或加减键缩放，Home 回到北方');
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('keydown', key); canvas.addEventListener('wheel', wheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('keydown', key); canvas.removeEventListener('wheel', wheel);
    };
  }, [gl, invalidate, onView, size, view]);
  useFrame(({ camera, scene }) => {
    if (document.hidden) return;
    const now = performance.now(), s = stats.current;
    if (measuring && s.lastCallback) s.callbacks.push(now - s.lastCallback);
    s.lastCallback = now;
    s.gpu.push(...timer.poll());
    // DocumentTimeline shares rAF's frame timestamp. Callback entry time includes
    // queueing jitter and can incorrectly alternate 16/50 ms at a 30 Hz deadline.
    const timelineTime = document.timeline?.currentTime;
    if (measuring && !clock.take(typeof timelineTime === 'number' ? timelineTime : now)) return;
    const start = performance.now(), v = view.current;
    const moonBounds = scene.userData.portraitMoonBounds as ScreenRect | undefined;
    const moonKey = moonBounds ? `${moonBounds.x},${moonBounds.y},${moonBounds.w},${moonBounds.h}` : '';
    const key = `${v.azimuth},${v.altitude},${v.fov},${size.width},${size.height},${ground},${moonKey}`;
    if (key !== lastProjection.current) {
      const perspective = camera as THREE.PerspectiveCamera;
      if (perspective.fov !== v.fov) { perspective.fov = v.fov; perspective.updateProjectionMatrix(); }
      const az = THREE.MathUtils.degToRad(v.azimuth), alt = THREE.MathUtils.degToRad(v.altitude);
      camera.lookAt(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt)); camera.updateMatrixWorld();
      const obstructions = Array.from(document.querySelectorAll('.sky-dock, .sky-heading, .sky-footer, [data-sky-obstruction]'))
        .filter(element=>getComputedStyle(element).visibility!=='hidden').map(element => element.getBoundingClientRect())
        .filter(r=>r.width>0 && r.height>0).map(r=>({x:r.left,y:r.top,w:r.width,h:r.height}));
      if (moonBounds) obstructions.push(moonBounds);
      const narrow = size.width < 600, candidates: LabelCandidate[]=[],figures: ScreenPoint[][]=[];
      for (const label of labels) {
        const el = nodes.current.get(label.id); if (!el) continue;
        projected.set(...label.position).multiplyScalar(100).project(camera);
        const x = (projected.x * .5 + .5) * size.width, y = (-projected.y * .5 + .5) * size.height;
        const measured=dimensions.current.get(label.id);if(!measured)continue;
        const eligible=(!ground||label.cardinal||label.position[1]>.015) && projected.z>-1 && projected.z<1
          && (label.cardinal||(label.priority??0)>10||v.fov<65);
        let figure: ScreenPoint[]|undefined;
        if(label.figure){
          const points=label.figure.map(point=>projected.set(...point).multiplyScalar(100).project(camera).clone());
          if(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.z>-1&&p.z<1)){
            figure=points.map((p):ScreenPoint=>[(p.x*.5+.5)*size.width,(-p.y*.5+.5)*size.height]);
            figures.push(figure);
          }
        }
        if(eligible)candidates.push({id:label.id,anchor:[x,y],...measured,priority:label.priority??0,cardinal:label.cardinal,figure});
      }
      const next=layoutSkyLabels(candidates,size,obstructions,narrow?(v.fov<45?10:6):(v.fov<45?18:12),placements.current,figures);
      for(const label of labels){
        const el=nodes.current.get(label.id);if(!el)continue;
        const placed=next.get(label.id),visible=!!placed;
        if(el.hidden===visible)el.hidden=!visible;
        if(placed){
          const transform = `translate(${placed.x.toFixed(1)}px, ${placed.y.toFixed(1)}px)`;
          if (el.style.transform !== transform) el.style.transform = transform;
          el.dataset.labelSlot=placed.slot;
        }
      }
      placements.current=next;
      lastProjection.current = key;
    }
    if (measuring) timer.begin();
    gl.render(scene, camera);
    scene.userData.renderedFrameKey = scene.getObjectByName('skyStars')?.userData.frameKey;
    if (measuring) timer.end();
    if (measuring && s.lastRender) s.frames.push(now - s.lastRender);
    s.lastRender = now; s.renders++; s.cpu.push(performance.now() - start);
    if (measuring) {
      if (now - s.start >= 1200) reportRef.current('measuring');
    } else {
      clearTimeout(settle.current);
      settle.current = setTimeout(() => reportRef.current('idle'), 250);
    }
  }, 1);
  return null;
}
