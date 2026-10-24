import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { artBounds, visibleArtwork } from './skyPresentation';
import { ConstellationArt } from './ConstellationArt';
import type { SkyCulture, SkyFrame } from './skyModel';
import type { SkyView } from './SkyRuntime';

export function SkyArtwork({ items, frame, view, ground, daylight, selected, opacityScale = 1 }: {
  items: SkyCulture[]; frame: SkyFrame; view: React.MutableRefObject<SkyView>; ground: boolean; daylight: number; selected: string;
  opacityScale?: number;
}) {
  const { size } = useThree();
  const bounds = useMemo(() => items.map(item => artBounds(item, frame)).filter((item): item is NonNullable<typeof item> => !!item), [items, frame]);
  const [visible, setVisible] = useState<SkyCulture[]>([]);
  const previous = useRef('');
  const previousBounds = useRef(bounds);
  useFrame(() => {
    const next = visibleArtwork(bounds, view.current, size.width / size.height, ground, selected, size.width < 600 ? 5 : 8);
    const key = next.map(item => item.id).join('|');
    if (key !== previous.current || previousBounds.current !== bounds) {
      previous.current = key; previousBounds.current = bounds; setVisible(next);
    }
  });
  return <>{visible.map(item => {
    const lineArt = item.id.includes('chinese_song_dynasty');
    const focused = item.id === selected;
    // Warm figures sit behind the blue-grey star skeleton; selection stays restrained.
    const opacity = lineArt ? focused ? .30 : selected === 'all' ? .22 : .14 : focused ? .38 : .22;
    return <ConstellationArt key={item.id} image={item.image!} frame={frame} ground={ground} daylight={daylight}
      lineArt={lineArt} opacity={Math.min(1, opacity * opacityScale)} />;
  })}</>;
}
