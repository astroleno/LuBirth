/** Bounds in CSS pixels, with the origin at the top left of the canvas. */
export interface ScreenBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const MARKER_MOON_CLEARANCE_PX = 16;
export const MARKER_REFRACTION_PX = 17;
export const MARKER_DISPERSION_PX = 0.3;
export const MARKER_MAX_FRINGE = 1.55;

export interface BackdropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The marker shader clamps the full-screen UV before adding its colour fringe. */
export function markerBackdropRegion(
  rect: BackdropRegion,
  scale: number,
  viewport: { width: number; height: number },
  buffer: { width: number; height: number },
): BackdropRegion {
  const pixelRatio = buffer.width / viewport.width;
  const refraction = MARKER_REFRACTION_PX * scale;
  const fringe = MARKER_DISPERSION_PX * MARKER_MAX_FRINGE * scale;

  const axis = (start: number, extent: number, viewSize: number, bufferSize: number) => {
    const sample = (point: number, offset: number) => {
      const fragment = Math.max(0, Math.min(1, point / viewSize)) * bufferSize;
      const uv = (fragment / pixelRatio + offset) / viewSize;
      return Math.max(.001, Math.min(.999, uv)) * bufferSize;
    };
    // Leave a full texel for bilinear filtering. Quantize only the allocation,
    // so the crop can follow the pin without reallocating at each position.
    const margin = fringe * bufferSize / viewSize + 1;
    const left = Math.max(0, Math.floor(sample(start, -refraction) - margin));
    const right = Math.min(bufferSize, Math.ceil(sample(start + extent, refraction) + margin));
    const size = Math.min(bufferSize, Math.ceil((right - left) / 64) * 64);
    return { origin: Math.min(left, bufferSize - size), size };
  };
  const x = axis(rect.x, rect.width, viewport.width, buffer.width);
  const y = axis(rect.y, rect.height, viewport.height, buffer.height);
  return { x: x.origin, y: y.origin, width: x.size, height: y.size };
}

/** Project the silhouette of a camera-space sphere, including off-axis perspective. */
export function projectCameraSphereBounds(
  sphere: { center: { x: number; y: number; z: number }; radius: number },
  projection: readonly number[],
  width: number,
  height: number,
): ScreenBounds | null {
  const { x, y, z } = sphere.center;
  const radius = sphere.radius;
  const depth = -z;
  if (depth <= radius) return null;
  const denominator = depth * depth - radius * radius;
  const horizontal = radius * Math.sqrt(denominator + x * x);
  const vertical = radius * Math.sqrt(denominator + y * y);
  const ndcLeft = projection[0] * (x * depth - horizontal) / denominator - projection[8];
  const ndcRight = projection[0] * (x * depth + horizontal) / denominator - projection[8];
  const ndcBottom = projection[5] * (y * depth - vertical) / denominator - projection[9];
  const ndcTop = projection[5] * (y * depth + vertical) / denominator - projection[9];
  return {
    left: (ndcLeft + 1) * width / 2,
    right: (ndcRight + 1) * width / 2,
    top: (1 - ndcTop) * height / 2,
    bottom: (1 - ndcBottom) * height / 2,
  };
}

export interface GlassMarkerLayoutOptions {
  anchorX: number;
  anchorY: number;
  scale: number;
  /** Largest reveal scale, so the label does not jump sides during its entrance. */
  maxScale: number;
  labelWidth: number;
  moon: ScreenBounds | null;
}

export function layoutGlassMarker({ anchorX, anchorY, scale, maxScale, labelWidth, moon }: GlassMarkerLayoutOptions) {
  // Match the original artwork: pin reaches 85px above its tip, label is 40px
  // tall, with an 11px gap. Only the pin compresses; label typography stays intact.
  const halfWidth = Math.max(labelWidth / 2 + 6 * scale, 38 * scale) * Math.max(1, maxScale / Math.max(scale, 0.001));
  const overlapsMoonX = moon && anchorX + halfWidth > moon.left - MARKER_MOON_CLEARANCE_PX
    && anchorX - halfWidth < moon.right + MARKER_MOON_CLEARANCE_PX;
  // Include the artwork's two-pixel optical halo, not only the solid glass.
  const ceiling = overlapsMoonX ? Math.max(8, moon.bottom + MARKER_MOON_CLEARANCE_PX + 2 * maxScale) : 8;
  const roomAbove = Math.max(0, anchorY - ceiling);
  const above = roomAbove >= (40 + 11 + 85 * 0.55) * maxScale;
  const pinScale = Math.min(scale, Math.max(0, roomAbove - (above ? 51 * scale : 0)) / 85);
  const labelTop = above
    ? anchorY - 85 * pinScale - 51 * scale
    : Math.max(anchorY + 12 * scale, ceiling);
  const label: ScreenBounds = {
    left: anchorX - labelWidth / 2,
    right: anchorX + labelWidth / 2,
    top: labelTop,
    bottom: labelTop + 40 * scale,
  };
  const rectWidth = Math.max(labelWidth + 12 * scale, 76 * scale);
  const bounds: ScreenBounds = {
    left: anchorX - rectWidth / 2,
    right: anchorX + rectWidth / 2,
    top: Math.min(anchorY - 85 * pinScale, label.top) - 2 * scale,
    bottom: Math.max(anchorY, label.bottom) + 2 * scale,
  };
  return { pinScale, labelPlacement: above ? 'above' as const : 'below' as const, label, bounds };
}
