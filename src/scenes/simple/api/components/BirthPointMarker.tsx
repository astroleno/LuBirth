import { useEffect, useMemo, useRef } from 'react';
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
  emphasized?: boolean;
  reducedMotion?: boolean;
}

const LABEL_TEXTURE_WIDTH = 512;
const LABEL_TEXTURE_HEIGHT = 128;

function createLabelTexture(label: string) {
  const characters = Array.from(label.trim() || '出生地');
  const conciseLabel = characters.length > 7
    ? `${characters.slice(0, 6).join('')}…`
    : characters.join('');
  const canvas = document.createElement('canvas');
  canvas.width = LABEL_TEXTURE_WIDTH;
  canvas.height = LABEL_TEXTURE_HEIGHT;
  let context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create birth-point label texture');

  const font = '600 54px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
  context.font = font;
  const measuredWidth = context.measureText(conciseLabel).width;
  canvas.width = Math.ceil(measuredWidth + 96);
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
  context.fillText(conciseLabel, canvas.width / 2, canvas.height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return {
    texture,
    widthPx: THREE.MathUtils.clamp(measuredWidth / 4 + 34, 82, 164),
  };
}

/**
 * Keeps an exact globe anchor for the post-scene glass pass. The marker is not
 * mounted until the user enters the aligned close view.
 */
export function BirthPointMarker({
  composition,
  earthSize,
  emphasized = false,
  reducedMotion = false,
}: BirthPointMarkerProps) {
  const longitudeDeg = composition.birthPointLongitudeDeg ?? 0;
  const latitudeDeg = composition.birthPointLatitudeDeg ?? 0;
  const markerSize = composition.birthPointMarkerSize ?? 0.06;
  const markerLabel = composition.birthPointMarkerLabel ?? '出生地';
  const { gl, size } = useThree();
  const anchorRef = useRef<THREE.Group>(null!);
  const animationElapsed = useRef(Number.POSITIVE_INFINITY);
  const label = useMemo(() => createLabelTexture(markerLabel), [markerLabel]);
  const overlay = useRef<GlassMarkerOverlay>({
    canvas: gl.domElement,
    anchor: null,
    labelTexture: label.texture,
    labelWidthPx: label.widthPx,
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
  const shouldShow = !!composition.showBirthPointMarker && emphasized;

  overlay.current.canvas = gl.domElement;
  overlay.current.labelTexture = label.texture;
  overlay.current.labelWidthPx = label.widthPx;
  overlay.current.sizePx = (size.width <= 767 ? 82 : 92)
    * THREE.MathUtils.clamp(markerSize / 0.06, 0.75, 1.4);

  useEffect(() => registerGlassMarkerOverlay(overlay.current), []);
  useEffect(() => () => label.texture.dispose(), [label.texture]);
  useEffect(() => {
    animationElapsed.current = shouldShow && !reducedMotion ? 0 : Number.POSITIVE_INFINITY;
    overlay.current.reveal = shouldShow && reducedMotion ? 1 : 0;
    overlay.current.active = false;
  }, [latitudeDeg, longitudeDeg, reducedMotion, shouldShow]);

  useFrame((_, delta) => {
    const descriptor = overlay.current;
    descriptor.anchor = anchorRef.current ?? null;
    descriptor.active = shouldShow && !!anchorRef.current;
    if (!descriptor.active) {
      descriptor.reveal = 0;
      return;
    }
    if (reducedMotion) {
      descriptor.reveal = 1;
      return;
    }

    animationElapsed.current += delta;
    const progress = THREE.MathUtils.clamp((animationElapsed.current - 0.28) / 0.52, 0, 1);
    descriptor.reveal = 1 + 2.70158 * Math.pow(progress - 1, 3)
      + 1.70158 * Math.pow(progress - 1, 2);
  });

  if (!shouldShow) return null;
  return <group ref={anchorRef} name="birthPointMarker" position={birthPointPosition} />;
}
