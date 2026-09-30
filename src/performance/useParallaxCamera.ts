import React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import type { ParallaxOffset } from './useParallaxInput';

/** Small lateral camera shift: the Earth moves more than the anchored Moon. */
export function useParallaxCamera(
  enabled: boolean,
  target: React.MutableRefObject<ParallaxOffset>,
  cameraKey: string,
) {
  const { camera } = useThree();
  const current = React.useRef<ParallaxOffset>({ x: 0, y: 0 });
  const base = React.useRef(camera.position.clone());
  const rotation = React.useRef(camera.quaternion.clone());
  const right = React.useMemo(() => new THREE.Vector3(), []);
  const up = React.useMemo(() => new THREE.Vector3(), []);

  React.useEffect(() => {
    base.current.copy(camera.position);
    rotation.current.copy(camera.quaternion);
    current.current = { x: 0, y: 0 };
    return () => {
      camera.position.copy(base.current);
      camera.quaternion.copy(rotation.current);
      camera.updateMatrixWorld();
    };
  }, [camera, cameraKey, enabled]);

  useFrame((_, delta) => {
    const weight = 1 - Math.exp(-Math.min(delta, 0.1) * 10);
    const tx = enabled ? target.current.x : 0;
    const ty = enabled ? target.current.y : 0;
    current.current.x += (tx - current.current.x) * weight;
    current.current.y += (ty - current.current.y) * weight;
    if (!enabled) return;
    right.set(1, 0, 0).applyQuaternion(rotation.current);
    up.set(0, 1, 0).applyQuaternion(rotation.current);
    camera.position.copy(base.current)
      .addScaledVector(right, current.current.x * 0.14)
      .addScaledVector(up, -current.current.y * 0.10);
    camera.quaternion.copy(rotation.current);
    camera.updateMatrixWorld();
  }, -1);

  return current;
}
