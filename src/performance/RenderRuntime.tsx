import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { RenderProfile } from './renderProfile';
import { LiquidGlassRenderer } from './LiquidGlassRenderer';

/** Drive only the requested frames; stop GPU work while the tab is hidden. */
export function RenderRuntime({ profile }: { profile: RenderProfile }) {
  const { gl, scene, camera, invalidate, setFrameloop } = useThree();
  const glass = useRef<LiquidGlassRenderer | null>(null);
  const sceneStats = useRef({ triangles: 0, calls: 0 });
  useEffect(() => {
    glass.current = new LiquidGlassRenderer(gl.domElement);
    return () => { glass.current?.dispose(); glass.current = null; };
  }, [gl]);
  useFrame(() => {
    gl.render(scene, camera);
    sceneStats.current.triangles = gl.info.render.triangles;
    sceneStats.current.calls = gl.info.render.calls;
    glass.current?.render(gl, profile.quality !== 'battery');
  }, 1);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      setFrameloop(document.hidden ? 'never' : 'demand');
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
