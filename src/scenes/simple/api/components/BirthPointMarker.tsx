import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SimpleComposition } from '../../../../types/SimpleComposition';
import { BIRTH_POINT_ANCHOR_RADIUS_SCALE } from '../../utils/closeupShot';
import {
  registerGlassMarkerOverlay,
  type GlassMarkerOverlay,
} from '../../../../performance/GlassOverlayRegistry';

interface BirthPointMarkerProps {
  composition: SimpleComposition;
  earthSize: number;
  style: GlassMarkerOverlay['style'];
  fullLabel?: boolean;
  reducedMotion?: boolean;
}

const LABEL_TEXTURE_WIDTH = 512;
const LABEL_TEXTURE_HEIGHT = 128;
const MAX_LABEL_TEXTURE_WIDTH = 2048;

function createLabelTexture(label: string, fullLabel: boolean) {
  const characters = Array.from(label.trim() || '出生地');
  const text = !fullLabel && characters.length > 7
    ? `${characters.slice(0, 6).join('')}…`
    : characters.join('');
  const canvas = document.createElement('canvas');
  canvas.width = LABEL_TEXTURE_WIDTH;
  canvas.height = LABEL_TEXTURE_HEIGHT;
  let context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create birth-point label texture');

  const font = '600 54px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
  context.font = font;
  const measuredWidth = context.measureText(text).width;
  canvas.width = Math.min(MAX_LABEL_TEXTURE_WIDTH, Math.ceil(measuredWidth + 96));
  context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to resize birth-point label texture');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = font;
  context.shadowColor = 'rgba(0,0,0,0.72)';
  context.shadowBlur = 12;
  context.shadowOffsetY = 3;
  context.fillStyle = 'rgba(248,252,255,0.98)';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 1, canvas.width - 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return {
    texture,
    widthPx: Math.max(measuredWidth / 4 + 34, 82),
  };
}

/** Keeps the globe anchor shared by the live view and original captures. */
export function BirthPointMarker({
  composition,
  earthSize,
  style,
  fullLabel = false,
  reducedMotion = false,
}: BirthPointMarkerProps) {
  const longitudeDeg = composition.birthPointLongitudeDeg ?? 0;
  const latitudeDeg = composition.birthPointLatitudeDeg ?? 0;
  const markerSize = composition.birthPointMarkerSize ?? 0.06;
  const markerLabel = composition.birthPointMarkerLabel ?? '出生地';
  const { gl, size } = useThree();
  const anchorRef = useRef<THREE.Group>(null!);
  const animationElapsed = useRef(Number.POSITIVE_INFINITY);
  const label = useMemo(() => style === 'pin' ? createLabelTexture(markerLabel, fullLabel) : null,
    [style, markerLabel, fullLabel]);
  const maxLabelWidth = fullLabel ? Math.min(320, Math.max(1, size.width - 32)) : 164;
  const labelWidthPx = Math.min(label?.widthPx ?? 0, maxLabelWidth);
  const animate = style === 'pin' && !reducedMotion;
  const overlay = useRef<GlassMarkerOverlay>({
    canvas: gl.domElement,
    anchor: null,
    style,
    labelTexture: label?.texture ?? null,
    labelWidthPx,
    sizePx: 92,
    reveal: 0,
    active: false,
  });

  const localNormal = useMemo(
    () => {
      // Match Three.js SphereGeometry's equirectangular UV orientation so the
      // anchor lands on the same country shown by the Earth texture.
      const latitude = THREE.MathUtils.degToRad(latitudeDeg);
      const longitude = THREE.MathUtils.degToRad(longitudeDeg);
      return new THREE.Vector3(
        Math.cos(latitude) * Math.cos(longitude),
        Math.sin(latitude),
        -Math.cos(latitude) * Math.sin(longitude),
      );
    },
    [latitudeDeg, longitudeDeg],
  );
  const birthPointPosition = useMemo(
    () => localNormal.clone().multiplyScalar(earthSize * BIRTH_POINT_ANCHOR_RADIUS_SCALE),
    [earthSize, localNormal],
  );
  overlay.current.canvas = gl.domElement;
  overlay.current.style = style;
  overlay.current.labelTexture = label?.texture ?? null;
  overlay.current.labelWidthPx = labelWidthPx;
  overlay.current.sizePx = (size.width <= 767 ? 82 : 92)
    * THREE.MathUtils.clamp(markerSize / 0.06, 0.75, 1.4);

  useLayoutEffect(() => registerGlassMarkerOverlay(overlay.current), []);
  useEffect(() => () => label?.texture.dispose(), [label]);
  useLayoutEffect(() => {
    animationElapsed.current = 0;
    overlay.current.reveal = animate ? 0 : 1;
    overlay.current.active = false;
  }, [latitudeDeg, longitudeDeg, animate]);

  useFrame((_, delta) => {
    const descriptor = overlay.current;
    descriptor.anchor = anchorRef.current ?? null;
    descriptor.active = !!anchorRef.current;
    if (!descriptor.active || !animate) return;

    animationElapsed.current += delta;
    const progress = THREE.MathUtils.clamp((animationElapsed.current - 0.28) / 0.52, 0, 1);
    descriptor.reveal = 1 + 2.70158 * Math.pow(progress - 1, 3)
      + 1.70158 * Math.pow(progress - 1, 2);
  });

  return <group ref={anchorRef} name="birthPointMarker" position={birthPointPosition} />;
}
