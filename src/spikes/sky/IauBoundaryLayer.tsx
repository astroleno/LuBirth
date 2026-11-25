import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { b1875BoundaryDirection } from '../../astro/iauConstellations';
import type { Frame3 } from '../../astro/referenceFrames';
import boundaryData from './data/iau-boundaries.json';

const boundaryVertices: number[] = [];
for (const segment of boundaryData.segments) {
  const [raA, decA, raB, decB] = segment.map(Number);
  // A constant-declination edge is a small circle. Tessellate in B1875 before precession.
  const steps = Math.max(1, Math.ceil(Math.hypot(raB - raA, decB - decA) / 24));
  let previous = b1875BoundaryDirection(raA / 24, decA / 24);
  for (let index = 1; index <= steps; index++) {
    const fraction = index / steps;
    const point = b1875BoundaryDirection((raA + fraction * (raB - raA)) / 24, (decA + fraction * (decB - decA)) / 24);
    boundaryVertices.push(...previous.map(value => value * 80), ...point.map(value => value * 80));
    previous = point;
  }
}

const positions = new Float32Array(boundaryVertices);

export default function IauBoundaryLayer({ frame, ground, daylight }: { frame: Frame3; ground: boolean; daylight: number }) {
  const invalidate = useThree(state => state.invalidate);
  const geometry = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)), []);
  const material = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false,
    uniforms: { ground: { value: 0 }, opacity: { value: 0 }, eqjToSky: { value: new THREE.Matrix3() } },
    vertexShader: `uniform mat3 eqjToSky; varying float y;
      void main() { vec3 point = eqjToSky * position; y = point.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.); }`,
    fragmentShader: `uniform float ground; uniform float opacity; varying float y;
      void main() { if (ground > .5 && y < 0.) discard; gl_FragColor = vec4(.38, .70, .94, opacity); }`,
  }), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  material.uniforms.ground.value = ground ? 1 : 0;
  material.uniforms.opacity.value = daylight * .52;
  material.uniforms.eqjToSky.value.fromArray(frame.flat());
  useEffect(() => { invalidate(); }, [frame, ground, daylight, invalidate]);
  return <lineSegments name="iauConstellationBoundaries" geometry={geometry} material={material} frustumCulled={false} renderOrder={1} dispose={null} />;
}
