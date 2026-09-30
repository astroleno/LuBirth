export type ResolutionState = { dpr: number; slow: number; fast: number };

/** Bound framebuffer memory independently of CSS breakpoints and device DPR. */
export function resolutionCeiling(width: number, height: number, deviceDpr: number, profileDpr: number, pixels: number) {
  return Math.max(0.5, Math.min(deviceDpr, profileDpr, Math.sqrt(pixels / Math.max(1, width * height))));
}

/** Two slow windows to reduce load; ten healthy windows before probing recovery. */
export function adaptResolution(state: ResolutionState, fps: number, target: number, ceiling: number): ResolutionState {
  const floor = Math.min(0.75, ceiling);
  if (!Number.isFinite(fps) || fps <= 0) return state;
  const slow = fps < target * 0.72 ? state.slow + 1 : 0;
  const fast = fps >= target * 0.94 ? state.fast + 1 : 0;
  if (slow >= 2) return { dpr: Math.max(floor, state.dpr * 0.85), slow: 0, fast: 0 };
  if (fast >= 10) return { dpr: Math.min(ceiling, state.dpr * 1.05), slow: 0, fast: 0 };
  return { dpr: Math.min(ceiling, state.dpr), slow, fast };
}
