export const CAPTURE_STATUS_EVENT = 'lubirth:capture-status';

type CaptureWindow = Window & {
  captureLuBirth?: () => string;
  __luBirthCaptureReady?: boolean;
};

export function captureIsReady(): boolean {
  if (typeof window === 'undefined') return false;
  const source = window as CaptureWindow;
  return source.__luBirthCaptureReady === true && typeof source.captureLuBirth === 'function';
}

export function publishCaptureReady(ready: boolean): void {
  const source = window as CaptureWindow;
  if (source.__luBirthCaptureReady === ready) return;
  source.__luBirthCaptureReady = ready;
  window.dispatchEvent(new Event(CAPTURE_STATUS_EVENT));
}

export function subscribeCaptureStatus(listener: () => void): () => void {
  window.addEventListener(CAPTURE_STATUS_EVENT, listener);
  return () => window.removeEventListener(CAPTURE_STATUS_EVENT, listener);
}
