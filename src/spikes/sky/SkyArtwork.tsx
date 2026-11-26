import { useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Matrix4, type Camera } from 'three';
import { artBounds, visibleArtwork } from './skyPresentation';
import { ConstellationArt } from './ConstellationArt';
import type { SkyCulture, SkyFrame } from './skyModel';

export function SkyArtwork({ items, frame, ground, daylight, selected, projectionCamera, opacityScale = 1 }: {
  items: SkyCulture[]; frame: SkyFrame; ground: boolean; daylight: number; selected: string;
  projectionCamera?: Camera;
  opacityScale?: number;
}) {
  const width = useThree(state => state.size.width);
  const bounds = useMemo(() => items.map(item => artBounds(item, frame)).filter((item): item is NonNullable<typeof item> => !!item), [items, frame]);
  const [visible, setVisible] = useState<SkyCulture[]>([]);
  const updateVisible = useMemo(() => {
    const inverseRotation = new Matrix4(), projection = new Matrix4(), previousProjection = new Matrix4();
    return ({ camera }: { camera: Camera }) => {
      const source = projectionCamera ?? camera;
      // The Earth background is rendered from the origin with the main camera's rotation and view offset.
      inverseRotation.makeRotationFromQuaternion(source.quaternion).transpose();
      projection.multiplyMatrices(source.projectionMatrix, inverseRotation);
      if (projection.equals(previousProjection)) return;
      previousProjection.copy(projection);
      const next = visibleArtwork(bounds, projection, ground, selected, width < 600 ? 5 : 8);
      setVisible(previous => previous.length === next.length && previous.every((item, index) => item === next[index]) ? previous : next);
    };
  }, [bounds, ground, projectionCamera, selected, width]);
  useFrame(updateVisible);
  return <>{visible.map(item => {
    const lineArt = item.id.includes('chinese_song_dynasty');
    const focused = item.id === selected;
    // Warm figures sit behind the blue-grey star skeleton; selection stays restrained.
    const opacity = lineArt ? focused ? .30 : selected === 'all' ? .22 : .14 : focused ? .38 : .22;
    return <ConstellationArt key={item.id} image={item.image!} frame={frame} ground={ground} daylight={daylight}
      lineArt={lineArt} opacity={Math.min(1, opacity * opacityScale)} />;
  })}</>;
}
