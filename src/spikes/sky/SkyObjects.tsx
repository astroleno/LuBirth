import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cultureGeometry, starDirection } from './skyModel';
import { applyFrame } from '../../astro/referenceFrames';
import type { SkyCulture, SkyFrame } from './skyModel';
import { createStarMaterial, starColor } from './starAppearance';
import type { StarAppearance } from './starAppearance';
import { skyCatalog as catalog } from './skyCatalog';
import { isMajorCulture } from './skyPresentation';
import type { SkyView } from './SkyRuntime';

const vertex = `
  varying float altitude;
  void main() { altitude = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 100.0, 1.0); }
`;
const lineFragment = `
  precision highp float;
  varying float altitude;
  uniform float daylight;
  uniform float ground;
  uniform vec3 color;
  uniform float intensity;
  void main() {
    if (ground > .5 && altitude < 0.0) discard;
    gl_FragColor = vec4(color, intensity * daylight * (ground > .5 ? smoothstep(0.0, .025, altitude) : 1.0));
  }
`;

function starColors() {
  const colors = new Float32Array(catalog.stars.length * 3);
  catalog.stars.forEach((star, index) => {
    const color = starColor(star[5]);
    colors.set([color.r, color.g, color.b], index * 3);
  });
  return colors;
}

export function createStarGeometry(frame: SkyFrame) {
  if (frame.positions.length !== catalog.stars.length * 3) throw new Error('Sky frame and star attributes must use the same catalog');
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(frame.positions, 3));
  geometry.setAttribute('magnitude', new THREE.Float32BufferAttribute(catalog.stars.map(star => star[4]), 1));
  geometry.setAttribute('tint', new THREE.BufferAttribute(starColors(), 3));
  return geometry;
}

export function SkyObjects({ frame, magnitude, culture, items, lines, daylight, dpr, ground, chinese, appearance, view, lineOpacityScale = 1 }: {
  frame: SkyFrame; magnitude: number; culture: string; items: SkyCulture[]; lines: boolean; daylight: number; dpr: number; ground: boolean; chinese: boolean;
  appearance: StarAppearance;
  view: React.MutableRefObject<SkyView>;
  lineOpacityScale?: number;
}) {
  const { gl, invalidate } = useThree();
  const { brightness, colorStrength, glow } = appearance;
  useEffect(() => { invalidate(); }, [frame, magnitude, culture, items, lines, daylight, dpr, ground, chinese,
    brightness, colorStrength, glow, invalidate]);
  const stars = useMemo(() => createStarGeometry(frame), [frame]);
  const geometries = useMemo(() => [items.filter(isMajorCulture), items.filter(item => !isMajorCulture(item)), items.filter(item => item.id === culture)]
    .map(layer => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(cultureGeometry(layer, frame, 'all'), 3))), [frame, culture, items]);
  const material = useMemo(() => {
    const context = gl.getContext();
    return createStarMaterial(context.getParameter(context.ALIASED_POINT_SIZE_RANGE)[1]);
  }, [gl]);
  const lineMaterial = useMemo(() => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: lineFragment,
    transparent: true, depthTest: false, depthWrite: false, uniforms: { daylight: { value: 1 }, ground: { value: 1 },
      intensity: { value: .3 }, color: { value: new THREE.Color() } } }), []);
  const minorMaterial = useMemo(() => lineMaterial.clone(), [lineMaterial]);
  const selectedMaterial = useMemo(() => lineMaterial.clone(), [lineMaterial]);
  useEffect(() => () => stars.dispose(), [stars]);
  useEffect(() => () => geometries.forEach(g => g.dispose()), [geometries]);
  useEffect(() => () => { material.dispose(); lineMaterial.dispose(); minorMaterial.dispose(); selectedMaterial.dispose(); }, [material, lineMaterial, minorMaterial, selectedMaterial]);
  material.uniforms.limit.value = magnitude;
  material.uniforms.daylight.value = daylight;
  material.uniforms.dpr.value = dpr;
  material.uniforms.ground.value = ground ? 1 : 0;
  material.uniforms.brightness.value = brightness;
  material.uniforms.colorStrength.value = colorStrength;
  material.uniforms.glow.value = glow;
  for (const line of [lineMaterial, minorMaterial, selectedMaterial]) {
    line.uniforms.daylight.value = daylight;
    line.uniforms.ground.value = ground ? 1 : 0;
    line.uniforms.color.value.set('#97b9da');
  }
  lineMaterial.uniforms.intensity.value = Math.min(1, (chinese ? .42 : .26) * lineOpacityScale);
  selectedMaterial.uniforms.intensity.value = .65;
  useFrame(() => { minorMaterial.uniforms.intensity.value = Math.min(1, .22 * lineOpacityScale)
    * (1 - THREE.MathUtils.smoothstep(view.current.fov, 35, 85)); });
  return <>
    {/* Keep point-source cores above every illustration and line endpoint. */}
    <points name="skyStars" geometry={stars} material={material} frustumCulled={false} renderOrder={10} dispose={null}
      userData={{ frameKey: frame.key, projection: frame.projection,
        samples: [11767,32349,91262,69673,65474,30343].map(hip => {
          const index = frame.hipIndex.get(hip)!;
          return { hip, index, localDirection: applyFrame(frame.observer.eqjToSky, starDirection(catalog.stars[index], frame.years, frame.motion)) };
        }) }} />
    {lines && <>
      <lineSegments name="skyConstellationLines" geometry={geometries[0]} material={lineMaterial} frustumCulled={false} dispose={null} />
      <lineSegments name="skyMinorConstellationLines" geometry={geometries[1]} material={minorMaterial} frustumCulled={false} dispose={null} />
      {culture !== 'all' && <lineSegments geometry={geometries[2]} material={selectedMaterial} frustumCulled={false} renderOrder={1} dispose={null} />}
    </>}
  </>;
}


export function HorizonGuide() {
  const material = useMemo(() => new THREE.LineBasicMaterial({ color: '#71899b', transparent: true, opacity: .42,
    depthTest: false, depthWrite: false }), []);
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    for (let i = 0; i <= 144; i++) {
      const angle = i * Math.PI / 72;
      vertices.push(99 * Math.sin(angle), 0, -99 * Math.cos(angle));
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  return <lineLoop geometry={geometry} material={material} frustumCulled={false} dispose={null} />;
}
