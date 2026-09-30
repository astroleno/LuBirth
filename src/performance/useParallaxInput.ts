import React from 'react';

export type ParallaxOffset = { x: number; y: number };
export type ParallaxMode = 'idle' | 'waiting' | 'motion' | 'denied' | 'unavailable';

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/** Screen-relative tilt from a calibrated phone pose; no compass access needed. */
export function relativeTilt(beta: number, gamma: number, origin: ParallaxOffset, angle: number): ParallaxOffset {
  const x = clamp((gamma - origin.x) / 18);
  const y = clamp((beta - origin.y) / 18);
  switch (((angle % 360) + 360) % 360) {
    case 90: return { x: -y, y: x };
    case 180: return { x: -x, y: -y };
    case 270: return { x: y, y: -x };
    default: return { x, y };
  }
}

export function useParallaxInput(enabled: boolean) {
  const target = React.useRef<ParallaxOffset>({ x: 0, y: 0 });
  const sensorTarget = React.useRef<ParallaxOffset>({ x: 0, y: 0 });
  const origin = React.useRef<ParallaxOffset | null>(null);
  const [mode, setMode] = React.useState<ParallaxMode>('idle');
  const supported = typeof window !== 'undefined' && window.isSecureContext && 'DeviceOrientationEvent' in window;

  React.useEffect(() => {
    if (enabled) return;
    target.current = { x: 0, y: 0 };
    sensorTarget.current = { x: 0, y: 0 };
    origin.current = null;
    setMode('idle');
  }, [enabled]);

  React.useEffect(() => {
    if (!enabled || (mode !== 'waiting' && mode !== 'motion')) return;
    let received = false;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      received = true;
      if (mode === 'waiting') setMode('motion');
      if (!origin.current) origin.current = { x: event.gamma, y: event.beta };
      sensorTarget.current = relativeTilt(
        event.beta, event.gamma, origin.current, window.screen.orientation?.angle ?? 0,
      );
      target.current = sensorTarget.current;
    };
    const onOrientationChange = () => { origin.current = null; };
    window.addEventListener('deviceorientation', onOrientation);
    window.screen.orientation?.addEventListener('change', onOrientationChange);
    const timeout = window.setTimeout(() => {
      if (received) return;
      sensorTarget.current = { x: 0, y: 0 };
      target.current = { x: 0, y: 0 };
      setMode('unavailable');
    }, 2000);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('deviceorientation', onOrientation);
      window.screen.orientation?.removeEventListener('change', onOrientationChange);
    };
  }, [enabled, mode]);

  const startMotion = React.useCallback(async () => {
    if (!enabled || !supported) { setMode('unavailable'); return; }
    const eventClass = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    try {
      // On Safari this call must originate in the button's user gesture.
      if (eventClass.requestPermission && await eventClass.requestPermission() !== 'granted') {
        setMode('denied');
        return;
      }
      origin.current = null;
      setMode('waiting');
    } catch {
      setMode('denied');
    }
  }, [enabled, supported]);

  const stopMotion = React.useCallback(() => {
    setMode('idle');
    target.current = { x: 0, y: 0 };
    sensorTarget.current = { x: 0, y: 0 };
    origin.current = null;
  }, []);

  const recenter = React.useCallback(() => {
    origin.current = null;
    target.current = { x: 0, y: 0 };
  }, []);

  return { target, mode, supported, startMotion, stopMotion, recenter };
}
