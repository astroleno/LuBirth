import * as THREE from 'three';

import { probeCapabilities } from './capability-probe.ts';
import {
  CanvasEventBridge,
  computeDrawingBufferSize,
  type MiniProgramCanvas,
  type RuntimeAdapter,
  type RuntimeCreateOptions,
  type RuntimeSession,
} from './runtime-contract.ts';

type CanvasFacade = HTMLCanvasElement & {
  dispatchEvent(event: Event | { type: string }): boolean;
};

export function createCanvasFacade(
  canvas: MiniProgramCanvas,
  cssWidth = canvas.clientWidth ?? canvas.width,
  cssHeight = canvas.clientHeight ?? canvas.height,
): CanvasFacade {
  const events = new CanvasEventBridge();
  const facade: Record<string, unknown> = {
    getContext: canvas.getContext.bind(canvas),
    requestAnimationFrame: canvas.requestAnimationFrame.bind(canvas),
    cancelAnimationFrame: canvas.cancelAnimationFrame.bind(canvas),
    createImage: canvas.createImage.bind(canvas),
    addEventListener: (type: string, listener: (event: any) => void) => {
      events.addEventListener(type, listener);
      canvas.addEventListener?.(type, listener as EventListener);
    },
    removeEventListener: (type: string, listener: (event: any) => void) => {
      events.removeEventListener(type, listener);
      canvas.removeEventListener?.(type, listener as EventListener);
    },
    dispatchEvent: (event: { type: string }) => {
      events.dispatchEvent(event);
      return true;
    },
    setAttribute: () => undefined,
    removeAttribute: () => undefined,
    focus: () => undefined,
  };
  Object.defineProperties(facade, {
    width: {
      enumerable: true,
      get: () => canvas.width,
      set: (value: number) => { canvas.width = value; },
    },
    height: {
      enumerable: true,
      get: () => canvas.height,
      set: (value: number) => { canvas.height = value; },
    },
    clientWidth: { enumerable: true, get: () => cssWidth },
    clientHeight: { enumerable: true, get: () => cssHeight },
    style: {
      enumerable: true,
      get: () => ({ width: `${cssWidth}px`, height: `${cssHeight}px` }),
    },
  });
  return facade as unknown as CanvasFacade;
}

export class R160Adapter implements RuntimeAdapter {
  readonly route = 'r160' as const;

  create(canvas: MiniProgramCanvas, options: RuntimeCreateOptions): RuntimeSession {
    const attributes = {
      alpha: options.alpha ?? false,
      antialias: options.antialias ?? true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    };
    const gl = canvas.getContext('webgl2', attributes)
      ?? canvas.getContext('webgl', attributes);
    if (!gl) throw new Error('Unable to create a WebGL context on the mini-program canvas');

    const capability = probeCapabilities(gl);
    const drawingBuffer = computeDrawingBufferSize({
      cssWidth: options.cssWidth,
      cssHeight: options.cssHeight,
      requestedDpr: options.dpr,
      maxTextureSize: capability.maxTextureSize,
      maxRenderbufferSize: capability.maxRenderbufferSize,
      maxViewportDims: capability.maxViewportDims,
    });
    const facade = createCanvasFacade(canvas, options.cssWidth, options.cssHeight);
    const renderer = new THREE.WebGLRenderer({
      canvas: facade,
      context: gl,
      ...attributes,
    });
    renderer.setPixelRatio(drawingBuffer.pixelRatio);
    renderer.setSize(options.cssWidth, options.cssHeight, false);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.debug.checkShaderErrors = true;

    let disposed = false;
    return {
      route: this.route,
      threeVersion: THREE.REVISION,
      THREE,
      renderer,
      canvas,
      gl,
      capability,
      drawingBuffer,
      requestFrame: canvas.requestAnimationFrame.bind(canvas),
      cancelFrame: canvas.cancelAnimationFrame.bind(canvas),
      createImage: canvas.createImage.bind(canvas),
      dispose: () => {
        if (disposed) return;
        disposed = true;
        renderer.setRenderTarget(null);
        renderer.dispose();
      },
    };
  }
}
