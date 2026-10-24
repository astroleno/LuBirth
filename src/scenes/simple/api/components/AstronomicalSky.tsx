import { useEffect, useMemo, useRef } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { skyCatalog } from '../../../../spikes/sky/skyCatalog';
import { SKY_SYSTEMS } from '../../../../spikes/sky/skyCultures';
import { createWorldSkyFrame } from '../../../../spikes/sky/skyModel';
import { SkyObjects } from '../../../../spikes/sky/SkyObjects';
import { SkyArtwork } from '../../../../spikes/sky/SkyArtwork';
import { MilkyWay } from '../../../../spikes/sky/MilkyWay';
import { DEFAULT_STAR_APPEARANCE } from '../../../../spikes/sky/starAppearance';
import { disposeArtCache } from '../../../../spikes/sky/artTextureCache';
import type { SkyView } from '../../../../spikes/sky/SkyRuntime';
import type { CelestialState, ObserverState } from '../../../../astro/celestialState';
import type { EarthSceneFrame } from '../../../../astro/referenceFrames';
import type { CultureVersion } from '../../../../history/journeyStore';

// The bright Earth and Moon need more background contrast than the local-sky view.
const BACKGROUND_STAR_APPEARANCE = { ...DEFAULT_STAR_APPEARANCE, brightness: 1.3 };

/** One canvas, direction-only background pass before the spatial Earth/Moon pass. */
export default function AstronomicalSky({ celestial, observer, frame, culture, galaxy, artwork }: {
  celestial: CelestialState; observer: ObserverState; frame: EarthSceneFrame;
  culture: CultureVersion; galaxy: number; artwork: boolean;
}) {
  const { scene, camera, gl, invalidate } = useThree();
  const background = useMemo(() => ({ scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() }), []);
  const projection = useMemo(() => createWorldSkyFrame(skyCatalog, celestial, observer, frame), [celestial, observer, frame]);
  const view = useRef<SkyView>({ azimuth: 0, altitude: 0, fov: 45 });
  const forward = useMemo(() => new THREE.Vector3(), []);
  const items = SKY_SYSTEMS[culture].items;
  useFrame(() => {
    camera.getWorldDirection(forward);
    view.current = { azimuth: (Math.atan2(forward.x, -forward.z) * 180 / Math.PI + 360) % 360,
      altitude: Math.asin(THREE.MathUtils.clamp(forward.y, -1, 1)) * 180 / Math.PI,
      fov: (camera as THREE.PerspectiveCamera).fov };
  });
  useEffect(() => {
    scene.userData.astronomicalBackground = background;
    return () => {
      if (scene.userData.astronomicalBackground === background) delete scene.userData.astronomicalBackground;
      disposeArtCache();
    };
  }, [scene, background]);
  useEffect(() => { background.scene.userData.frameKey = frame.key; invalidate(); }, [background, frame, invalidate]);
  useEffect(() => { background.scene.userData.culture = culture; invalidate(); }, [background, culture, invalidate]);
  return createPortal(<>
    {galaxy > 0 && <MilkyWay frame={projection} ground={false} daylight={1} strength={galaxy} />}
    {artwork && <SkyArtwork items={items} frame={projection} view={view} ground={false} daylight={1} selected="all" opacityScale={1.45} />}
    <SkyObjects frame={projection} magnitude={6.5} culture="all" items={items} lines={artwork} daylight={1}
      dpr={gl.getPixelRatio()} ground={false} chinese={culture !== 'modern'} appearance={BACKGROUND_STAR_APPEARANCE} view={view} lineOpacityScale={1.6} />
  </>, background.scene, { camera: background.camera });
}
