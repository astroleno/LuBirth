import type { Observation } from './observation';
import type { Vec3 } from '../astro/referenceFrames';

export type ViewTransfer = {
  observationKey: string;
  reason: 'navigation' | 'birth-point' | 'locate-target';
  targetId?: string;
};
export function observationKey(observation: Observation) {
  return `${observation.utc}/${observation.observer.latitude}/${observation.observer.longitude}`;
}
export function createViewTransfer(observation: Observation, reason: ViewTransfer['reason'], targetId?: string): ViewTransfer {
  if (reason === 'locate-target' && !targetId) throw new Error('请选择要定位的天体。');
  return { observationKey: observationKey(observation), reason, ...(targetId ? { targetId } : {}) };
}
export function directionToSkyView(direction: Vec3, fov = 35) {
  const length = Math.hypot(...direction);
  if (!Number.isFinite(length) || length < 1e-12) throw new Error('天体方向无效。');
  return { azimuth: (Math.atan2(direction[0], -direction[2]) * 180 / Math.PI + 360) % 360,
    altitude: Math.asin(Math.max(-1, Math.min(1, direction[1] / length))) * 180 / Math.PI, fov };
}
