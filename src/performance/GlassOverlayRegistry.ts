import type * as THREE from 'three';

/** Mutable data shared between a scene anchor and the post-scene glass pass. */
export interface GlassMarkerOverlay {
  canvas: HTMLCanvasElement;
  anchor: THREE.Object3D | null;
  labelTexture: THREE.Texture;
  labelWidthPx: number;
  sizePx: number;
  reveal: number;
  active: boolean;
}

const markerOverlays = new Set<GlassMarkerOverlay>();

export function registerGlassMarkerOverlay(overlay: GlassMarkerOverlay) {
  markerOverlays.add(overlay);
  return () => { markerOverlays.delete(overlay); };
}

export function getGlassMarkerOverlays(canvas: HTMLCanvasElement) {
  return Array.from(markerOverlays).filter(overlay => overlay.canvas === canvas && overlay.active && overlay.anchor);
}

export function getGlassMarkerOverlayDiagnostics(canvas: HTMLCanvasElement) {
  const overlays = Array.from(markerOverlays).filter(overlay => overlay.canvas === canvas);
  return {
    registered: overlays.length,
    active: overlays.filter(overlay => overlay.active).length,
    anchored: overlays.filter(overlay => !!overlay.anchor).length,
  };
}
