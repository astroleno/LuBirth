import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { RenderProfile } from './renderProfile';
import { LiquidGlassRenderer } from './LiquidGlassRenderer';
import { adaptResolution, resolutionCeiling, type ResolutionState } from './adaptiveResolution';

/** Drive only the requested frames; stop GPU work while the tab is hidden. */
export function RenderRuntime({ profile }: { profile: RenderProfile }) {
  const { gl, scene, camera, invalidate, setFrameloop, setDpr, size } = useThree();
  const glass = useRef<LiquidGlassRenderer | null>(null);
  const sceneStats = useRef({ triangles: 0, calls: 0 });
  const frames = useRef(0);
  const resolution = useRef<ResolutionState>({ dpr: 1, slow: 0, fast: 0 });
  const sample = useRef({ since: 0, frames: 0, fps: 0 });
  const ceiling = resolutionCeiling(size.width, size.height, window.devicePixelRatio || 1, profile.dpr,
    profile.quality === 'battery' ? 1_000_000 : profile.quality === 'detail' ? 3_500_000 : profile.mobile ? 1_500_000 : 2_500_000);
  useEffect(() => {
    resolution.current = { dpr: ceiling, slow: 0, fast: 0 };
    sample.current = { since: performance.now() + 5000, frames: 0, fps: 0 };
    setDpr(ceiling);
  }, [ceiling, profile, setDpr]);
  useEffect(() => {
    glass.current = new LiquidGlassRenderer(gl.domElement);
    return () => { glass.current?.dispose(); glass.current = null; };
  }, [gl]);
  useFrame(() => {
    gl.render(scene, camera);
    frames.current++;
    sceneStats.current.triangles = gl.info.render.triangles;
    sceneStats.current.calls = gl.info.render.calls;
    glass.current?.render(gl, profile.quality !== 'battery');
    const now = performance.now();
    if (now < sample.current.since) return;
    sample.current.frames++;
    const elapsed = now - sample.current.since;
    if (elapsed < 2000) return;
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
      sample.current = { since: performance.now() + 5000, frames: 0, fps: 0 };
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
      gl.render(scene, camera);
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
      moonTriangles: (() => {
        const moon = scene.getObjectByName('moonMesh');
        if (!moon || !('geometry' in moon)) return 0;
        const geometry = moon.geometry as THREE.BufferGeometry;
        return (geometry.index?.count ?? geometry.getAttribute('position')?.count ?? 0) / 3;
      })(),
      cameraPosition: camera.position.toArray(),
    });
    Object.assign(window, { captureLuBirth: capture, getLuBirthPerformance: diagnostics });
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
      delete (window as any).captureLuBirth;
      delete (window as any).getLuBirthPerformance;
    };
  }, [gl, scene, camera, invalidate, setFrameloop, profile]);
  return null;
}
