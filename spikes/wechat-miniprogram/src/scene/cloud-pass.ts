import type { ScenePass, SceneTextureBundle } from './scene-types.ts';

export function createCloudPass(
  THREE: any,
  textures: SceneTextureBundle,
  fallback: any,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const geometry = new THREE.SphereGeometry(1.012, 128, 64);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthCloudCapabilityMaterial',
    transparent: true,
    depthWrite: false,
    uniforms: {
      cloudMap: { value: textures.clouds ?? fallback.cloud },
      lightDir: { value: new THREE.Vector3(...lightRayDirection).normalize() },
      opacity: { value: 0.72 },
      displacementScale: { value: 0.008 },
    },
    vertexShader: `
      uniform sampler2D cloudMap;
      uniform float displacementScale;
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      void main() {
        vUv = uv;
        float density = texture2D(cloudMap, uv).r;
        vec3 displaced = position + normal * density * displacementScale;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D cloudMap;
      uniform vec3 lightDir;
      uniform float opacity;
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      void main() {
        vec4 cloud = texture2D(cloudMap, vUv);
        float density = smoothstep(0.18, 0.82, max(cloud.r, cloud.a));
        float daylight = smoothstep(-0.2, 0.35, dot(normalize(vWorldNormal), -normalize(lightDir)));
        vec3 color = mix(vec3(0.12, 0.16, 0.24), vec3(0.96), daylight);
        gl_FragColor = vec4(color, density * opacity);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'cloudMesh';
  mesh.renderOrder = 3;
  return {
    object: mesh,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
