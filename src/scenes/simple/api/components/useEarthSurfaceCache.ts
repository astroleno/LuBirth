import { useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { terrainAOGLSL, nightGlowGLSL } from './earthSurfaceKernels';

type SurfaceInputs = {
  heightMap: THREE.Texture;
  nightMap: THREE.Texture;
  enabled: boolean;
  aoEnabled: boolean;
  blur: number;
  heightThreshold: number;
  distanceAttenuation: number;
  maxOcclusion: number;
  smoothFactor: number;
};

/** Cache view-independent AO and night glow; sunlight, terrain normals and rim remain live. */
export function useEarthSurfaceCache(inputs: SurfaceInputs) {
  const { gl } = useThree();
  // Secondary textures can finish within the same short loading burst. Keep
  // the previous cache until that burst settles instead of compiling and
  // rendering the expensive surface pass once per arriving image.
  const [stable, setStable] = useState(inputs);
  useEffect(() => {
    if (!inputs.enabled) {
      setStable(current => current.enabled ? inputs : current);
      return;
    }
    const timer = window.setTimeout(() => setStable(inputs), 600);
    return () => window.clearTimeout(timer);
  }, [inputs.heightMap, inputs.nightMap, inputs.enabled, inputs.aoEnabled, inputs.blur,
    inputs.heightThreshold, inputs.distanceAttenuation, inputs.maxOcclusion, inputs.smoothFactor]);
  const { heightMap, nightMap, enabled, aoEnabled, blur, heightThreshold,
    distanceAttenuation, maxOcclusion, smoothFactor } = stable;
  const cache = useMemo(() => {
    if (!enabled) return null;
    const target = new THREE.WebGLRenderTarget(1024, 512, {
      type: gl.extensions.has('EXT_color_buffer_float') ? THREE.HalfFloatType : THREE.UnsignedByteType,
      depthBuffer: false, stencilBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping, wrapT: THREE.ClampToEdgeWrapping,
    });
    target.texture.name = 'earth-surface-cache';
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: {
        heightMap: { value: heightMap }, nightMap: { value: nightMap },
        aoEnabled: { value: aoEnabled }, blur: { value: blur },
        heightThreshold: { value: heightThreshold }, distanceAttenuation: { value: distanceAttenuation },
        maxOcclusion: { value: maxOcclusion }, smoothFactor: { value: smoothFactor },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D heightMap, nightMap;
        uniform bool aoEnabled;
        uniform float blur, heightThreshold, distanceAttenuation, maxOcclusion, smoothFactor;
        ${terrainAOGLSL}
        ${nightGlowGLSL}
        void main() {
          float ao = aoEnabled ? calculateAO(vUv, heightMap, 16, 0.1,
            heightThreshold, distanceAttenuation, maxOcclusion, smoothFactor) : 1.0;
          gl_FragColor = vec4(sampleNightGlow(nightMap, vUv, blur), ao);
        }`,
    });
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { target, scene, camera: new THREE.Camera(), material, geometry, ready: false };
  }, [gl, heightMap, nightMap, enabled, aoEnabled, blur, heightThreshold,
    distanceAttenuation, maxOcclusion, smoothFactor]);

  useFrame(() => {
    if (!cache || cache.ready) return;
    const previous = gl.getRenderTarget();
    const autoClear = gl.autoClear;
    try {
      gl.autoClear = true;
      gl.setRenderTarget(cache.target);
      gl.render(cache.scene, cache.camera);
      cache.ready = true;
    } finally {
      gl.setRenderTarget(previous);
      gl.autoClear = autoClear;
    }
  }, -2);
  useEffect(() => {
    const restore = () => { if (cache) cache.ready = false; };
    gl.domElement.addEventListener('webglcontextrestored', restore);
    return () => {
      gl.domElement.removeEventListener('webglcontextrestored', restore);
      cache?.target.dispose();
      cache?.material.dispose();
      cache?.geometry.dispose();
    };
  }, [cache, gl]);
  return cache;
}
