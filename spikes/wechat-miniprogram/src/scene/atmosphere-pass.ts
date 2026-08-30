import type { ScenePass } from './scene-types.ts';

export function createAtmospherePass(
  THREE: any,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const geometry = new THREE.SphereGeometry(1.075, 96, 48);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthAtmosphereCapabilityMaterial',
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      lightDir: { value: new THREE.Vector3(...lightRayDirection).normalize() },
      atmosphereColor: { value: new THREE.Color(0x78aaff) },
      intensity: { value: 0.72 },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform vec3 lightDir;
      uniform vec3 atmosphereColor;
      uniform float intensity;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.4);
        float day = smoothstep(-0.35, 0.28, dot(normal, -normalize(lightDir)));
        float alpha = fresnel * mix(0.06, 0.9, day) * intensity;
        gl_FragColor = vec4(atmosphereColor * alpha, alpha);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'atmosphereMesh';
  mesh.renderOrder = 4;
  return {
    object: mesh,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
