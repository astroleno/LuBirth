import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SkyFrame } from './skyModel';
import { SKY_ATMOSPHERE_GLSL } from './skyLight';
import type { SkyLight } from './skyLight';
import textureUrl from './data/milky-way-density.png';

export function MilkyWay({ frame, ground, daylight, strength, atmosphere }: {
  frame: SkyFrame; ground: boolean; daylight: number; strength: number; atmosphere?: SkyLight;
}) {
  const { invalidate } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const galaxyEnabled = strength > 0;
  useEffect(() => {
    if (!galaxyEnabled) { setTexture(null); return; }
    let cancelled = false;
    const loaded = new THREE.TextureLoader().load(textureUrl, ready => {
      if (cancelled) return;
      ready.colorSpace = THREE.SRGBColorSpace; ready.wrapS = THREE.RepeatWrapping;
      setTexture(ready);
    });
    return () => { cancelled = true; loaded.dispose(); };
  }, [galaxyEnabled]);
  const geometry = useMemo(() => new THREE.SphereGeometry(110, 64, 32), []);
  const material = useMemo(() => new THREE.ShaderMaterial({ side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    uniforms: { map: { value: null }, rotation: { value: new THREE.Matrix3() }, ground: { value: 1 }, brightness: { value: 0 },
      sunDirection: { value: new THREE.Vector3() }, apparentSunDirection: { value: new THREE.Vector3() },
      skyAmounts: { value: new THREE.Vector3() } },
    vertexShader: `uniform mat3 rotation; varying vec2 skyUV; varying vec3 skyRay;
      void main(){ skyUV=uv; vec3 world=rotation*position.xzy; skyRay=world/110.; gl_Position=projectionMatrix*modelViewMatrix*vec4(world,1.); }`,
    fragmentShader: `uniform sampler2D map;
      uniform float ground, brightness;
      uniform vec3 sunDirection, apparentSunDirection, skyAmounts;
      varying vec2 skyUV;
      varying vec3 skyRay;

      ${SKY_ATMOSPHERE_GLSL}

      void main(){
        bool belowGround=ground>.5 && skyRay.y<0.;
        if(belowGround && (skyAmounts.x<=0. || skyRay.y<-SKY_HAZE_WIDTH)) discard;
        vec3 color=skyAtmosphereColor(skyRay,sunDirection,apparentSunDirection,skyAmounts,ground);
        if(brightness>0. && !belowGround) {
          float fade=ground>.5 ? smoothstep(0.,.10,skyRay.y) : 1.;
          color+=texture2D(map,skyUV).rgb*vec3(.12,.17,.25)*brightness*fade;
        }
        gl_FragColor=vec4(color,1.);
      }`,
  }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const galaxy = galaxyEnabled ? texture : null;
  useLayoutEffect(() => {
    const [x, y, z] = frame.eqjBasis;
    material.uniforms.rotation.value.set(x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]);
    material.uniforms.map.value = galaxy;
    material.uniforms.ground.value = ground ? 1 : 0;
    material.uniforms.brightness.value = galaxy ? strength * daylight : 0;
    material.uniforms.sunDirection.value.set(...frame.observer.sun.direction);
    material.uniforms.apparentSunDirection.value.set(...frame.apparentSun.direction);
    material.uniforms.skyAmounts.value.set(atmosphere?.twilight ?? 0, atmosphere?.daylight ?? 0, atmosphere?.sunset ?? 0);
    invalidate();
  }, [material, frame, galaxy, ground, strength, daylight, atmosphere, invalidate]);
  return galaxy || atmosphere?.twilight ? <mesh geometry={geometry} material={material}
    renderOrder={-30} frustumCulled={false} dispose={null} /> : null;
}
