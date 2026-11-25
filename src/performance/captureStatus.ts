export const CAPTURE_STATUS_EVENT = 'lubirth:capture-status';

export type SceneCapturePair = Readonly<{ original: string; clean: string }>;
export type SceneCapture = {
  (): string;
  (mode: 'original-and-clean'): SceneCapturePair;
};

type CaptureWindow = Window & {
  captureLuBirth?: SceneCapture;
  __luBirthCaptureReady?: boolean;
};

export function getSceneCapture(): SceneCapture | undefined {
  return typeof window === 'undefined' ? undefined : (window as CaptureWindow).captureLuBirth;
}

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
