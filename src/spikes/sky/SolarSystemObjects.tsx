import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Moon } from '../../scenes/simple/api/components/Moon';
import type { SkyFrame } from './skyModel';
import type { MoonPlacement } from '../../history/journeyStore';
import { applyFrame } from '../../astro/referenceFrames';
import { assetUrl } from '../../utils/assetUrl';
import type { ScreenRect } from './skyLabelLayout';

export function SolarSystemObjects({ frame, placement, ground, portraitSize = 1 }: {
  frame: SkyFrame; placement: MoonPlacement; ground: boolean; portraitSize?: number;
}) {
  const { camera, scene, size, invalidate, gl } = useThree();
  const [suppressed, setSuppressed] = useState(false);
  useEffect(() => {
    if (!import.meta.env.DEV || new URLSearchParams(location.search).get('spatialtest') !== '1') return;
    const update = () => { setSuppressed(!!(window as any).__validationMoonSuppressed); invalidate(); };
    update(); window.addEventListener('lubirth:validation-moon', update);
    return () => window.removeEventListener('lubirth:validation-moon', update);
  }, [invalidate]);
  const [map, setMap] = useState<THREE.Texture | null>(null), [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const texture = new THREE.TextureLoader().load(assetUrl('textures/1k_moon.webp'), loaded => {
      if (!active) return;
      loaded.colorSpace = THREE.SRGBColorSpace; setMap(loaded); invalidate();
    }, undefined, () => { if (active) { setFailed(true); invalidate(); } });
    return () => { active = false; texture.dispose(); };
  }, [invalidate]);
  const { observer, celestial } = frame;
  const sunDirection = useMemo(() => new THREE.Vector3(...applyFrame(observer.eqjToSky, celestial.moonToSunEqj)), [observer, celestial]);
  const lightColor = useMemo(() => new THREE.Color(0xffffff), []);
  const lighting = useMemo(() => ({ key: observer.key, portraitLight: observer.portraitLight, phaseFraction: observer.phaseFraction,
    phaseAngleDeg: observer.phaseAngleDeg, cycleAngleDeg: celestial.cycleAngleDeg }), [observer, celestial]);
  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false,
    side: THREE.DoubleSide, uniforms: { ground: { value: ground ? 1 : 0 } },
    vertexShader: 'varying vec3 p; void main(){ p=(modelMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float ground; varying vec3 p; void main(){ if(ground>.5 && p.y<0.)discard; gl_FragColor=vec4(1.,.91,.70,1.); }',
  }), []);
  useEffect(() => () => sunMaterial.dispose(), [sunMaterial]);
  sunMaterial.uniforms.ground.value = ground ? 1 : 0;
  const sunQuaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),
    new THREE.Vector3(...observer.sun.direction).negate()), [observer]);
  const portrait = placement === 'portrait';
  const distance = portrait ? 14 : 60;
  const screenX = size.width < 600 ? .82 : .86, screenY = .72;
  const pixelRadius = Math.min(size.width < 600 ? 40 : 56, Math.max(22, size.height * .052)) * portraitSize;
  const portraitBounds = useMemo<ScreenRect | undefined>(() => portrait && !suppressed ? {
    x: size.width * screenX - pixelRadius,
    y: size.height * (1 - screenY) - pixelRadius,
    w: pixelRadius * 2, h: pixelRadius * 2,
  } : undefined, [portrait, suppressed, size.width, size.height, screenX, pixelRadius]);
  useLayoutEffect(() => {
    // The orthographic portrait disc keeps these CSS-pixel bounds while the sky turns.
    if (portraitBounds) scene.userData.portraitMoonBounds = portraitBounds;
    else delete scene.userData.portraitMoonBounds;
    invalidate();
    return () => {
      if (scene.userData.portraitMoonBounds === portraitBounds) delete scene.userData.portraitMoonBounds;
    };
  }, [scene, portraitBounds, invalidate]);
  const radius = portrait ? pixelRadius * 2 * distance * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov) / 2) / size.height
    : distance * Math.sin(observer.moon.angularRadiusDeg * Math.PI / 180);
  useEffect(() => {
    (window as any).__skySolarObjects = { key: frame.key, placement, texture: failed ? 'failed' : map ? 'ready' : 'loading',
      physicalMoonDirection: observer.moon.direction, angularRadiusDeg: observer.moon.angularRadiusDeg,
      renderedRadius: radius, physical: !portrait };
    return () => { delete (window as any).__skySolarObjects; };
  }, [frame, placement, map, failed, observer, radius, portrait]);
  useEffect(() => {
    const snapshot = () => {
      scene.updateMatrixWorld(true);
      const moon = scene.getObjectByName('moonMesh') as THREE.Mesh | undefined;
      const material = moon?.material instanceof THREE.ShaderMaterial ? moon.material : undefined;
      const stars = scene.getObjectByName('skyStars') as THREE.Points | undefined;
      const attribute = stars?.geometry.getAttribute('position');
      moon?.geometry.computeBoundingSphere();
      return { key: frame.key, utc: frame.celestial.utc, placement, moonCount: scene.getObjectsByProperty('name','moonMesh').length,
        skyReady: gl.info.render.frame > 0 && scene.userData.renderedFrameKey === frame.key,
        moonPosition: moon?.getWorldPosition(new THREE.Vector3()).toArray(), radius,
        moonNdc: moon?.getWorldPosition(new THREE.Vector3()).project(camera).toArray(),
        meshRadius: moon?.geometry.boundingSphere?.radius, meshScale: moon?.scale.toArray(),
        cameraFov: (camera as THREE.PerspectiveCamera).fov, viewport: [size.width, size.height],
        rendererMemory: { textures:gl.info.memory.textures,geometries:gl.info.memory.geometries,programs:gl.info.programs?.length ?? 0 },
        portraitProjection: material?.uniforms.portraitProjection?.value,
        portraitBounds: scene.userData.portraitMoonBounds ?? null,
        moonQuaternion: moon?.quaternion.toArray(), moonFrameKey: moon?.userData.frameKey,
        sunLightView: material?.uniforms.sunDirView?.value.toArray(),
        moonFraction: observer.phaseFraction, moonAltitude: observer.moon.altitudeDeg,
        moonAngularRadius: observer.moon.angularRadiusDeg, moonDirection: observer.moon.direction,
        sunDirection: observer.sun.direction, portraitLight: observer.portraitLight,
        cameraPosition: camera.position.toArray(), cameraQuaternion: camera.quaternion.toArray(),
        starSamples: attribute ? (stars?.userData.samples || []).map((sample: { hip:number; index:number }) => ({
          hip:sample.hip, position:[attribute.getX(sample.index),attribute.getY(sample.index),attribute.getZ(sample.index)]
        })) : [] };
    };
    (window as any).getLuBirthSkySpatialState = snapshot;
    return () => { if ((window as any).getLuBirthSkySpatialState === snapshot) delete (window as any).getLuBirthSkySpatialState; };
  }, [scene, camera, gl, frame, placement, observer, radius, size.width, size.height]);
  return <>
    {failed && <MoonTextureFailure />}
    {(!ground || observer.sun.altitudeDeg + observer.sun.angularRadiusDeg >= 0) && <mesh name="skySun"
      position={observer.sun.direction.map(v => v * 90) as [number,number,number]} quaternion={sunQuaternion} material={sunMaterial} renderOrder={20}>
      <circleGeometry args={[90 * Math.tan(observer.sun.angularRadiusDeg * Math.PI / 180), 48]} />
    </mesh>}
    {!suppressed && (portrait || !ground || observer.moon.altitudeDeg + observer.moon.angularRadiusDeg >= 0) && <Moon
      name="moonMesh" position={observer.moon.direction.map(v => v * distance) as [number,number,number]} radius={radius}
      enableScreenAnchor={portrait} screenSpacePortrait={portrait} portraitPixelRadius={pixelRadius}
      screenX={screenX} screenY={screenY} anchorDistance={distance}
      lightDirection={sunDirection} sunDirWorldForShading={sunDirection} lightColor={lightColor} sunIntensity={2.2}
      useTextures={!!map} moonMap={map ?? undefined} enableTidalLock enableUniformShading useCameraLockedPhase={portrait}
      celestialLighting={lighting} skyLayer horizonClip={ground && !portrait} moonNormalScale={0} moonDisplacementScale={0}
      moonLightMinRatio={.55} moonLightMaxRatio={.8} nightLift={.008} terminatorSoftness={.012} terminatorRadius={.005}
      currentDate={celestial.utc} observerLat={observer.location.latitude} observerLon={observer.location.longitude} />}
  </>;
}

function MoonTextureFailure() {
  useEffect(() => { window.dispatchEvent(new CustomEvent('lubirth:asset-error')); }, []);
  return null;
}
