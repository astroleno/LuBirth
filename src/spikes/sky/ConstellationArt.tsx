import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { illustrationDirection } from './skyModel';
import type { SkyFrame, SkyIllustration } from './skyModel';
import { acquireArtTexture } from './artTextureCache';

// URL imports emit assets at build time; PNGs load only when admitted to the visible drawing set.
const urls = import.meta.glob(['./data/illustrations/*.png', './data/chinese-art/*.png', '!./data/chinese-art/*-line-v1.png'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export const artworkUrl = (file: string) => urls['./data/' + file];

export function ConstellationArt({ image, frame, ground, daylight, opacity = .24, lineArt = false }: {
  image: SkyIllustration; frame: SkyFrame; ground: boolean; daylight: number; opacity?: number; lineArt?: boolean;
}) {
  const { invalidate, gl, camera } = useThree();
  const url = artworkUrl(image.file);
  const [loaded, setLoaded] = useState<{ url: string; texture: THREE.Texture } | null>(null);
  const [prepared, setPrepared] = useState<THREE.Texture | null>(null);
  const revealStart = useRef(0);
  const compilations = useRef(new Set<Promise<unknown>>());
  useEffect(() => {
    if (!url) return;
    return acquireArtTexture(url, image.size, texture => {
      revealStart.current = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : performance.now();
      setLoaded(texture ? { url, texture } : null); invalidate();
    });
  }, [url, image, invalidate]);
  const geometry = useMemo(() => {
    const positions: number[] = [], uvs: number[] = [], divisions = 20;
    for (let y = 0; y < divisions; y++) for (let x = 0; x < divisions; x++) {
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 0], [1, 1], [0, 1]]) {
        const u = (x + dx) / divisions, v = (y + dy) / divisions;
        const p = illustrationDirection(image, frame, u * image.size[0], (1 - v) * image.size[1]);
        if (!p) return null;
        positions.push(...p); uvs.push(u, v);
      }
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      .setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }, [image, frame]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { artwork: { value: null }, ground: { value: 1 }, daylight: { value: 1 }, opacity: { value: .24 },
      lineArt: { value: 0 }, ink: { value: new THREE.Color('#e5ddc9') } },
    vertexShader: 'varying vec2 imageUV; varying float altitude; void main(){ imageUV=uv; altitude=position.y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position*100.0,1.0); }',
    fragmentShader: 'uniform sampler2D artwork; uniform float ground; uniform float daylight; uniform float opacity; uniform float lineArt; uniform vec3 ink; varying vec2 imageUV; varying float altitude; void main(){ if(ground>.5 && altitude<0.0) discard; vec4 paint=texture2D(artwork,imageUV); gl_FragColor=vec4(mix(paint.rgb,ink,lineArt),paint.a*opacity*daylight);\n#include <colorspace_fragment>\n}',
  }), []);
  useEffect(() => () => { geometry?.dispose(); }, [geometry]);
  useEffect(() => () => {
    // Three's async linker still reads material properties while polling readiness.
    // A fast pan may unmount this drawing before that polling has finished.
    if (compilations.current.size) void Promise.allSettled([...compilations.current]).then(() => material.dispose());
    else material.dispose();
  }, [material]);
  useEffect(() => {
    if (!geometry || loaded?.url !== url) return;
    let cancelled = false;
    const staging = new THREE.Scene();
    staging.add(new THREE.Mesh(geometry, material));
    // Compile during loading, so first appearance does not synchronously link a new program.
    const compilation = gl.compileAsync(staging, camera);
    compilations.current.add(compilation);
    compilation.then(() => {
      if (!cancelled) {
        gl.initTexture(loaded.texture);
        revealStart.current = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : performance.now();
        setPrepared(loaded.texture); invalidate();
      }
      staging.clear();
    }).catch(() => { if (!cancelled) { setPrepared(loaded.texture); invalidate(); } staging.clear(); })
      .finally(() => compilations.current.delete(compilation));
    return () => { cancelled = true; staging.clear(); };
  }, [loaded, geometry, material, url, camera, gl, invalidate]);
  material.uniforms.artwork.value = loaded?.texture;
  material.uniforms.ground.value = ground ? 1 : 0;
  material.uniforms.daylight.value = daylight;
  material.uniforms.lineArt.value = lineArt ? 1 : 0;
  useFrame(() => {
    const progress = revealStart.current ? Math.min(1, (performance.now() - revealStart.current) / 180) : 1;
    material.uniforms.opacity.value = opacity * progress;
    if (prepared && progress < 1) invalidate();
  });
  if (!url || !geometry || loaded?.url !== url || prepared !== loaded.texture) return null;
  return <mesh name="skyConstellationArt" userData={{ file: image.file }} geometry={geometry} material={material} frustumCulled={false} renderOrder={-10} dispose={null} />;
}
