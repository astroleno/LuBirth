import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import * as THREE from 'three';
import { Moon } from './Moon';
import { moonScenePlacement } from '../../utils/moonPlacement';
import type { CelestialState, ObserverState } from '../../../../astro/celestialState';
import { applyFrame } from '../../../../astro/referenceFrames';
import type { EarthSceneFrame } from '../../../../astro/referenceFrames';
import type { MoonPlacement } from '../../../../history/journeyStore';
import { lunarShadow, projectLunarShadow } from '../../../../astro/lunarShadow';
import { projectLunarSurface } from '../../../../astro/lunarOrientation';

export default function MoonPresentation({ celestial, observer, frame, placement, earthRadius, earthPosition, ...props }: ComponentProps<typeof Moon> & {
  celestial: CelestialState; observer: ObserverState; frame: EarthSceneFrame;
  placement: MoonPlacement; earthRadius: number; earthPosition: [number, number, number];
}) {
  const geometry = moonScenePlacement(celestial, frame, placement, earthRadius, { position: props.position, radius: props.radius });
  const sunDirection = useMemo(() => new THREE.Vector3(...applyFrame(frame.eqjToScene, celestial.moonToSunEqj)), [frame, celestial]);
  const moonFrame = placement === 'physical' ? frame.eqjToScene : observer.eqjToMoonPortrait;
  const earthShadow = useMemo(() => projectLunarShadow(lunarShadow(celestial), moonFrame), [celestial, moonFrame]);
  const surfaceFrame = useMemo(() => projectLunarSurface(celestial.moonBodyToEqj, moonFrame), [celestial, moonFrame]);
  const lighting = useMemo(() => ({ key: observer.key, portraitLight: observer.portraitLight,
    phaseFraction: observer.phaseFraction, phaseAngleDeg: observer.phaseAngleDeg, cycleAngleDeg: celestial.cycleAngleDeg }), [observer, celestial]);
  const position = geometry.position.map((value, axis) => value + (placement === 'physical' ? earthPosition[axis] : 0)) as [number, number, number];
  // Use the sky portrait's parallel projection: a nearby enlarged sphere otherwise
  // changes the visible illuminated fraction, especially for crescents.
  return <Moon {...props} position={position} radius={geometry.radius}
    enableScreenAnchor={geometry.screenAnchor} useCameraLockedPhase={geometry.screenAnchor}
    screenSpacePortrait={geometry.screenAnchor}
    celestialLighting={lighting} surfaceFrame={surfaceFrame} sunDirWorldForShading={sunDirection} earthShadow={earthShadow} />;
}
