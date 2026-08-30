import type { ScenePass, SceneTextureBundle } from './scene-types.ts';

type Vector3Value = { x: number; y: number; z: number };

export function moonLightRayInPip(THREE: any, sunWorld: Vector3Value, moonWorld: Vector3Value): any {
  const sun = new THREE.Vector3(sunWorld.x, sunWorld.y, sunWorld.z).normalize();
  const viewer = new THREE.Vector3(-moonWorld.x, -moonWorld.y, -moonWorld.z).normalize();
  let right = new THREE.Vector3(0, 1, 0).cross(viewer);
  if (right.lengthSq() < 1e-8) right = new THREE.Vector3(1, 0, 0).cross(viewer);
  right.normalize();
  const up = new THREE.Vector3().crossVectors(viewer, right).normalize();
  const towardSunLocal = new THREE.Vector3(
    sun.dot(right),
    sun.dot(up),
    sun.dot(viewer),
  ).normalize();
  return towardSunLocal.negate();
}

export function createMoonPass(
  THREE: any,
  textures: SceneTextureBundle,
  fallback: any,
  lightRayDirection: any,
): ScenePass {
  const geometry = new THREE.SphereGeometry(0.72, 96, 48);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthMoonCapabilityMaterial',
    extensions: { derivatives: true },
    uniforms: {
      moonMap: { value: textures.moon ?? fallback.moon },
      normalMap: { value: textures.moonNormal ?? fallback.normal },
      displacementMap: { value: textures.moonDisplacement ?? fallback.displacement },
      lightDir: { value: lightRayDirection.clone().normalize() },
      displacementScale: { value: textures.moonDisplacement ? 0.026 : 0 },
      normalStrength: { value: 0.45 },
      terminatorSoftness: { value: 0.035 },
      nightLift: { value: 0.012 },
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
      uniform sampler2D moonMap;
      uniform sampler2D normalMap;
      uniform vec3 lightDir;
      uniform float normalStrength;
      uniform float terminatorSoftness;
      uniform float nightLift;
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
        float ndl = dot(normal, -normalize(lightDir));
        float light = smoothstep(-terminatorSoftness, terminatorSoftness, ndl);
        vec3 albedo = pow(texture2D(moonMap, vUv).rgb, vec3(2.2));
        float opposition = pow(max(dot(normalize(cameraPosition - vWorldPosition), -normalize(lightDir)), 0.0), 18.0);
        vec3 color = albedo * (nightLift + light * (0.54 + max(ndl, 0.0) * 0.56) + opposition * 0.08);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'pipMoonMesh';
  return {
    object: mesh,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
