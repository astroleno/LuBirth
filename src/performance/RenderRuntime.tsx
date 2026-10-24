import { useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { RenderProfile } from './renderProfile';
import { LiquidGlassRenderer } from './LiquidGlassRenderer';
import { adaptResolution, resolutionCeiling, type ResolutionState } from './adaptiveResolution';
import { GpuTimer, percentile } from '../spikes/sky/skyPerformance';

/** Drive only the requested frames; stop GPU work while the tab is hidden. */
export function RenderRuntime({ profile }: { profile: RenderProfile }) {
  const { gl, scene, camera, invalidate, setFrameloop, setDpr, size } = useThree();
  const glass = useRef<LiquidGlassRenderer | null>(null);
  const sceneStats = useRef({ triangles: 0, calls: 0 });
  const frames = useRef(0);
  const resolution = useRef<ResolutionState>({ dpr: 1, slow: 0, fast: 0 });
  const sample = useRef({ since: 0, frames: 0, fps: 0 });
  const booting = useRef(!(window as any).__lubirthOverlayFading);
  const renderTiming = useRef({cpu:[] as number[],gpu:[] as number[],frames:0});
  const validationTimer = useRef<GpuTimer | null>(null);
  useEffect(() => {
    if (!import.meta.env.DEV || new URLSearchParams(location.search).get('spatialtest') !== '1') return;
    validationTimer.current = new GpuTimer(gl.getContext());
    return () => { validationTimer.current?.dispose(); validationTimer.current=null; };
  }, [gl]);
  const renderScene = useCallback(() => {
    const background = scene.userData.astronomicalBackground as { scene: THREE.Scene; camera: THREE.PerspectiveCamera } | undefined;
    if (!background) { gl.render(scene, camera); return { calls: gl.info.render.calls, triangles: gl.info.render.triangles }; }
    const autoClear = gl.autoClear;
    let calls = 0, triangles = 0;
    try {
      background.camera.copy(camera as THREE.PerspectiveCamera);
      background.camera.position.set(0, 0, 0);
      background.camera.updateMatrixWorld(true);
      gl.autoClear = false;
      gl.clear();
      gl.render(background.scene, background.camera);
      calls = gl.info.render.calls; triangles = gl.info.render.triangles;
      gl.clearDepth();
      gl.render(scene, camera);
      return { calls: calls + gl.info.render.calls, triangles: triangles + gl.info.render.triangles };
    } finally { gl.autoClear = autoClear; }
  }, [scene, camera, gl]);
  const ceiling = resolutionCeiling(size.width, size.height, window.devicePixelRatio || 1, profile.dpr,
    profile.quality === 'battery' ? 1_000_000 : profile.quality === 'detail' ? 3_500_000 : profile.mobile ? 1_500_000 : 2_500_000);
  useEffect(() => {
    resolution.current = { dpr: ceiling, slow: 0, fast: 0 };
    sample.current = { since: performance.now(), frames: 0, fps: 0 };
    setDpr(ceiling);
  }, [ceiling, profile, setDpr]);
  useEffect(() => {
    const finishBoot = () => {
      booting.current = false;
      sample.current = { since: performance.now(), frames: 0, fps: sample.current.fps };
      resolution.current.slow = resolution.current.fast = 0;
    };
    window.addEventListener('lubirth:overlay-fade-start', finishBoot);
    return () => window.removeEventListener('lubirth:overlay-fade-start', finishBoot);
  }, []);
  useEffect(() => {
    glass.current = new LiquidGlassRenderer(gl.domElement);
    return () => { glass.current?.dispose(); glass.current = null; };
  }, [gl]);
  useFrame(() => {
    // Canvas resize/layout updates can reapply its declarative DPR. Restore the
    // adaptive value before drawing so mode transitions never jump back to the
    // full device DPR for an expensive frame.
    if (Math.abs(gl.getPixelRatio() - resolution.current.dpr) > 0.001) {
      setDpr(resolution.current.dpr);
    }
    if (validationTimer.current) {
      renderTiming.current.gpu.push(...validationTimer.current.poll());
      renderTiming.current.gpu=renderTiming.current.gpu.slice(-240);
      validationTimer.current.begin();
    }
    const renderStart = performance.now();
    const rendered = renderScene();
    if (validationTimer.current) {
      validationTimer.current.end();
      renderTiming.current.cpu.push(performance.now()-renderStart);
      renderTiming.current.cpu=renderTiming.current.cpu.slice(-240); renderTiming.current.frames++;
    }
    scene.userData.renderedSpatialFrameKey = scene.userData.astronomicalBackground?.scene.userData.frameKey ?? null;
    frames.current++;
    sceneStats.current.triangles = rendered.triangles;
    sceneStats.current.calls = rendered.calls;
    glass.current?.render(gl, camera, {
      uiGlass: profile.quality !== 'battery',
      highQualityMarker: !profile.mobile && profile.quality !== 'battery',
      moon: scene.getObjectByName('moonMesh'),
    });
    const now = performance.now();
    if (now < sample.current.since) return;
    sample.current.frames++;
    const elapsed = now - sample.current.since;
    // Calibrate aggressively while the opaque loading layer is still present,
    // then use long windows so visible resolution changes remain infrequent.
    if (elapsed < (booting.current ? 500 : 2000)) return;
    sample.current.fps = sample.current.frames * 1000 / elapsed;
    const next = adaptResolution(resolution.current, sample.current.fps, profile.fps, ceiling);
    if (Math.abs(next.dpr - resolution.current.dpr) > 0.001) setDpr(next.dpr);
    resolution.current = next;
    sample.current.since = now;
    sample.current.frames = 0;
  }, 1);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      setFrameloop(document.hidden ? 'never' : 'demand');
      sample.current = { since: performance.now(), frames: 0, fps: 0 };
      resolution.current.slow = resolution.current.fast = 0;
      if (!document.hidden) {
        invalidate();
        timer = setInterval(invalidate, 1000 / profile.fps);
      }
    };
    update();
    document.addEventListener('visibilitychange', update);
    // Render and read in the same task: screenshots do not need a persistent buffer.
    const capture = () => {
      scene.updateMatrixWorld(true);
      renderScene();
      glass.current?.render(gl, camera, {
        uiGlass: false,
        includeUi: false,
        highQualityMarker: !profile.mobile && profile.quality !== 'battery',
        moon: scene.getObjectByName('moonMesh'),
      });
      return gl.domElement.toDataURL('image/png');
    };
    const diagnostics = () => ({
      profile,
      frames: frames.current,
      measuredFps: sample.current.fps,
      effectiveDpr: resolution.current.dpr,
      hidden: document.hidden,
      drawingBuffer: [gl.domElement.width, gl.domElement.height],
      triangles: sceneStats.current.triangles,
      calls: sceneStats.current.calls,
      glass: glass.current?.stats,
      textures: gl.info.memory.textures,
      geometries: gl.info.memory.geometries,
      programs: gl.info.programs?.length ?? 0,
      renderTiming: validationTimer.current ? {frames:renderTiming.current.frames,cpuSamples:renderTiming.current.cpu.length,
        gpuSamples:renderTiming.current.gpu.length,cpuP95:percentile(renderTiming.current.cpu,.95),gpuP95:percentile(renderTiming.current.gpu,.95),
        cpuMean:renderTiming.current.cpu.reduce((a,b)=>a+b,0)/Math.max(1,renderTiming.current.cpu.length),
        gpuMean:renderTiming.current.gpu.reduce((a,b)=>a+b,0)/Math.max(1,renderTiming.current.gpu.length),
        gpuSupported:validationTimer.current.supported,scope:'Complete scene drawing; excludes separate glass context, React/layout and asset loading'} : null,
      backgroundFrameKey: scene.userData.astronomicalBackground?.scene.userData.frameKey ?? null,
      moonTriangles: (() => {
        const moon = scene.getObjectByName('moonMesh');
        if (!moon || !('geometry' in moon)) return 0;
        const geometry = moon.geometry as THREE.BufferGeometry;
        return (geometry.index?.count ?? geometry.getAttribute('position')?.count ?? 0) / 3;
      })(),
      cameraPosition: camera.position.toArray(),
      projectionAspect: camera.projectionMatrix.elements[5] / camera.projectionMatrix.elements[0],
      framing: (() => {
        let earthSurface: THREE.Mesh | undefined;
        scene.getObjectByName('earthRoot')?.traverse(object => {
          if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial
            && object.material.uniforms.nightBoost) earthSurface = object;
        });
        const material = earthSurface?.material instanceof THREE.ShaderMaterial ? earthSurface.material : undefined;
        const nightImage = material?.uniforms.nightMap?.value?.image;
        const moon = scene.getObjectByName('moonMesh');
        const moonMaterial = moon instanceof THREE.Mesh && moon.material instanceof THREE.ShaderMaterial
          ? moon.material : undefined;
        const project = (object: THREE.Object3D | undefined) => object
          ? object.getWorldPosition(new THREE.Vector3()).project(camera).toArray() : null;
        return {
          earthCenterNdc: project(earthSurface),
          earthRadius: material?.uniforms.earthRadius?.value ?? null,
          moonNdc: project(moon),
          moonMaterialIntensity: moonMaterial?.uniforms.sunIntensity?.value ?? null,
          moonPhaseIntensityRatio: moonMaterial?.uniforms.moonIntensityRatio?.value ?? null,
          nightLightIntensity: material?.uniforms.nightBoost?.value ?? null,
          hasNightMap: material?.uniforms.hasNight?.value === 1,
          nightMapSize: nightImage ? [nightImage.width, nightImage.height] : null,
          nightGlowOpacity: material?.uniforms.nightGlowOpacity?.value ?? null,
        };
      })(),
    });
    Object.assign(window, { captureLuBirth: capture, getLuBirthPerformance: diagnostics });
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
      delete (window as any).captureLuBirth;
      delete (window as any).getLuBirthPerformance;
    };
  }, [gl, scene, camera, invalidate, setFrameloop, profile, renderScene]);
  return null;
}
