import { useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SkyFrame } from './skyModel';
import textureUrl from './data/milky-way-density.png';

export function MilkyWay({ frame, ground, daylight, strength }: { frame: SkyFrame; ground: boolean; daylight: number; strength: number }) {
  const { invalidate } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loaded = new THREE.TextureLoader().load(textureUrl, ready => {
      if (cancelled) return;
      ready.colorSpace = THREE.SRGBColorSpace; ready.wrapS = THREE.RepeatWrapping;
      setTexture(ready); invalidate();
    });
    return () => { cancelled = true; loaded.dispose(); };
  }, [invalidate]);
  const geometry = useMemo(() => new THREE.SphereGeometry(110, 64, 32), []);
  const material = useMemo(() => new THREE.ShaderMaterial({ side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    uniforms: { map: { value: null }, rotation: { value: new THREE.Matrix3() }, ground: { value: 1 }, brightness: { value: 0 } },
    vertexShader: `uniform mat3 rotation; varying vec2 skyUV; varying float altitude;
      void main(){ skyUV=uv; vec3 world=rotation*position.xzy; altitude=world.y/110.; gl_Position=projectionMatrix*modelViewMatrix*vec4(world,1.); }`,
    fragmentShader: `uniform sampler2D map; uniform float ground; uniform float brightness; varying vec2 skyUV; varying float altitude;
      void main(){ if(ground>.5 && altitude<0.) discard; vec3 density=texture2D(map,skyUV).rgb;
        float fade=ground>.5 ? smoothstep(0.,.10,altitude) : 1.;
        // Remove the map's grey floor, retaining the real dust lanes and warm/cool
        // structure. This is the same texture and celestial projection, one pass.
        vec3 structure=max(density-vec3(.018),vec3(0.));
        float luminance=dot(structure,vec3(.2126,.7152,.0722));
        float contrast=.35+smoothstep(.01,.30,luminance);
        vec3 band=mix(vec3(luminance),structure,.55)*contrast*vec3(.25,.26,.30);
        gl_FragColor=vec4(vec3(.001,.002,.005)+band*brightness*fade,1.); }`,
  }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const [x, y, z] = frame.eqjBasis;
  material.uniforms.rotation.value.set(x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]);
  material.uniforms.map.value = texture;
  material.uniforms.ground.value = ground ? 1 : 0;
  material.uniforms.brightness.value = strength * daylight;
  return texture ? <mesh geometry={geometry} material={material} renderOrder={-30} frustumCulled={false} dispose={null} /> : null;
}
