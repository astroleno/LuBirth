import type { ScenePass, SceneTextureBundle } from './scene-types.ts';

export function createStarBackground(THREE: any, textures: SceneTextureBundle, fallback: any): ScenePass {
  const geometry = new THREE.SphereGeometry(18, 64, 32);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthStarBackgroundMaterial',
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      starMap: { value: textures.stars ?? fallback.stars },
      hasStarMap: { value: textures.stars ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D starMap;
      uniform float hasStarMap;
      varying vec2 vUv;
      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }
      void main() {
        vec3 mapped = pow(texture2D(starMap, vUv).rgb, vec3(2.2));
        vec2 grid = floor(vUv * vec2(720.0, 360.0));
        float seed = hash21(grid);
        float star = smoothstep(0.996, 1.0, seed);
        float band = exp(-pow((vUv.y - 0.54 + sin(vUv.x * 6.283) * 0.08) / 0.12, 2.0));
        vec3 procedural = vec3(0.002, 0.004, 0.012) + vec3(star) * mix(vec3(0.55, 0.7, 1.0), vec3(1.0, 0.78, 0.55), seed);
        procedural += vec3(0.025, 0.032, 0.055) * band * hash21(grid * 0.07);
        gl_FragColor = vec4(mix(procedural, mapped, hasStarMap), 1.0);
      }
    `,
  });
  material.toneMapped = false;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'starBackground';
  mesh.renderOrder = -10;
  return {
    object: mesh,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
