import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Matrix4, PerspectiveCamera, type Camera } from 'three';
import { artBounds, visibleArtwork } from './skyPresentation';
import { ConstellationArt } from './ConstellationArt';
import type { SkyCulture, SkyFrame } from './skyModel';

export function SkyArtwork({ items, frame, ground, daylight, selected, projectionCamera, opacityScale = 1 }: {
  items: SkyCulture[]; frame: SkyFrame; ground: boolean; daylight: number; selected: string;
  projectionCamera?: Camera;
  opacityScale?: number;
}) {
  const width = useThree(state => state.size.width);
  const deepZoom = useRef(false);
  const bounds = useMemo(() => items.map(item => artBounds(item, frame)).filter((item): item is NonNullable<typeof item> => !!item), [items, frame]);
  const [visible, setVisible] = useState({ items: [] as SkyCulture[], preferMobile: false });
  const updateVisible = useMemo(() => {
    const inverseRotation = new Matrix4(), projection = new Matrix4(), previousProjection = new Matrix4();
    return ({ camera }: { camera: Camera }) => {
      if (!width) return;
      const source = projectionCamera ?? camera;
      // The Earth background is rendered from the origin with the main camera's rotation and view offset.
      inverseRotation.makeRotationFromQuaternion(source.quaternion).transpose();
      projection.multiplyMatrices(source.projectionMatrix, inverseRotation);
      if (projection.equals(previousProjection)) return;
      previousProjection.copy(projection);
      const narrow = width < 600;
      const next = visibleArtwork(bounds, projection, ground, selected, narrow ? 5 : 8);
      const fov = source instanceof PerspectiveCamera ? source.getEffectiveFOV() : Infinity;
      deepZoom.current = narrow && (deepZoom.current ? fov < 36 : fov <= 30);
      const preferMobile = narrow && !deepZoom.current;
      setVisible(previous => previous.preferMobile === preferMobile && previous.items.length === next.length
        && previous.items.every((item, index) => item === next[index]) ? previous : { items: next, preferMobile });
    };
  }, [bounds, ground, projectionCamera, selected, width]);
  useFrame(updateVisible);
  return <>{visible.items.map(item => {
    const lineArt = item.id.includes('chinese_song_dynasty');
    const focused = item.id === selected;
    // Warm figures sit behind the blue-grey star skeleton; selection stays restrained.
    const opacity = lineArt ? focused ? .30 : selected === 'all' ? .22 : .14 : focused ? .38 : .22;
    return <ConstellationArt key={item.id} image={item.image!} frame={frame} ground={ground} daylight={daylight}
      preferMobile={visible.preferMobile} lineArt={lineArt} opacity={Math.min(1, opacity * opacityScale)} />;
  })}</>;
}
