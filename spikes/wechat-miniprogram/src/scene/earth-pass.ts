import type { ScenePass, SceneTextureBundle } from './scene-types.ts';

export function createEarthPass(
  THREE: any,
  textures: SceneTextureBundle,
  fallback: ReturnType<typeof import('./texture-fallbacks.ts')['createFallbackTextures']>,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const geometry = new THREE.SphereGeometry(1, 128, 64);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthEarthCapabilityMaterial',
    extensions: { derivatives: true },
    uniforms: {
      dayMap: { value: textures.earthDay ?? fallback.day },
      nightMap: { value: textures.earthNight ?? fallback.night },
      normalMap: { value: textures.earthNormal ?? fallback.normal },
      specularMap: { value: textures.earthSpecular ?? fallback.specular },
      displacementMap: { value: textures.earthDisplacement ?? fallback.displacement },
      cloudMap: { value: textures.clouds ?? fallback.cloud },
      lightDir: { value: new THREE.Vector3(...lightRayDirection).normalize() },
      displacementScale: { value: textures.earthDisplacement ? 0.018 : 0 },
      normalStrength: { value: 0.85 },
      terminatorSoftness: { value: 0.075 },
      cloudShadowStrength: { value: 0.24 },
    },
    vertexShader: `
      uniform sampler2D displacementMap;
      uniform float displacementScale;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      void main() {
        vUv = uv;
        float height = (texture2D(displacementMap, uv).r - 0.5) * displacementScale;
        vec3 displaced = position + normal * height;
        vec4 world = modelMatrix * vec4(displaced, 1.0);
        vWorldPosition = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform sampler2D dayMap;
      uniform sampler2D nightMap;
      uniform sampler2D normalMap;
      uniform sampler2D specularMap;
      uniform sampler2D cloudMap;
      uniform vec3 lightDir;
      uniform float normalStrength;
      uniform float terminatorSoftness;
      uniform float cloudShadowStrength;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;

      vec3 derivativeNormal(vec3 baseNormal) {
        vec3 q0 = dFdx(vWorldPosition);
        vec3 q1 = dFdy(vWorldPosition);
        vec2 st0 = dFdx(vUv);
        vec2 st1 = dFdy(vUv);
        vec3 tangent = normalize(q0 * st1.t - q1 * st0.t);
        vec3 bitangent = normalize(-q0 * st1.s + q1 * st0.s);
        vec3 sampled = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
        sampled.xy *= normalStrength;
        return normalize(mat3(tangent, bitangent, baseNormal) * sampled);
      }

      void main() {
        vec3 normal = derivativeNormal(normalize(vWorldNormal));
        vec3 toSun = -normalize(lightDir);
        float ndl = dot(normal, toSun);
        float dayMix = smoothstep(-terminatorSoftness, terminatorSoftness, ndl);
        vec3 dayColor = pow(texture2D(dayMap, vUv).rgb, vec3(2.2));
        vec3 nightColor = pow(texture2D(nightMap, vUv).rgb, vec3(2.2)) * 1.7;
        float clouds = texture2D(cloudMap, vUv).r;
        float shadow = 1.0 - clouds * cloudShadowStrength * dayMix;
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 halfDir = normalize(toSun + viewDir);
        float specMask = texture2D(specularMap, vUv).r;
        float specular = pow(max(dot(normal, halfDir), 0.0), 42.0) * specMask * dayMix;
        vec3 color = mix(nightColor, dayColor * (0.08 + max(ndl, 0.0)) * shadow, dayMix);
        color += vec3(0.55, 0.68, 0.82) * specular * 0.5;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'earthMesh';
  return {
    object: mesh,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
