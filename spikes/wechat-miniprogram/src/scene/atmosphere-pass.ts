import type { ScenePass } from './scene-types.ts';

const MAIN_VERTEX_SHADER = `
  uniform float thickness;
  uniform float earthRadius;
  uniform float offset;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vHeight;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = normalize(-mvPosition.xyz);
    vec3 viewNormal = normalize(normalMatrix * normal);
    vFresnel = pow(1.0 - max(dot(viewNormal, vViewDirection), 0.0), 2.0);
    float atmosphereRadius = earthRadius * (1.0 + thickness);
    float innerRadius = earthRadius * (1.0 - offset);
    float currentRadius = length(vWorldPos);
    vHeight = clamp((currentRadius - innerRadius) / (atmosphereRadius - innerRadius), 0.0, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const MAIN_FRAGMENT_SHADER = `
  uniform vec3 lightDir;
  uniform float intensity;
  uniform vec3 color;
  uniform float thickness;
  uniform float fresnelPower;
  uniform float mainContrast;
  uniform float mainSoftness;
  uniform float earthRadius;
  uniform float softBoundaryDelta;
  uniform float scaleHeight;
  uniform float offset;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vHeight;
  void main() {
    float signedNdl = dot(normalize(vWorldNormal), normalize(lightDir));
    float sunPhase = clamp(0.5 + 0.5 * signedNdl, 0.0, 1.0);
    sunPhase = sunPhase * sunPhase * (3.0 - 2.0 * sunPhase);
    float dayNightFactor = mix(1.0 - mainContrast, 1.0, sunPhase);
    float baseIntensity = intensity * dayNightFactor;
    float edgeEffect = pow(vFresnel, 1.0 / max(0.1, fresnelPower));
    float outerRadius = earthRadius * (1.0 + thickness);
    float innerRadius = earthRadius * (1.0 - offset);
    vec3 oc = cameraPosition;
    vec3 rd = normalize(vWorldPos - cameraPosition);
    float b = length(cross(oc, rd));
    float tO = sqrt(max(outerRadius * outerRadius - b * b, 0.0));
    float tI = sqrt(max(innerRadius * innerRadius - b * b, 0.0));
    float pathLen = max(tO - tI, 0.0);
    float pathMax = max(sqrt(max(outerRadius * outerRadius - innerRadius * innerRadius, 0.0)), 1e-5);
    float optical = clamp(pathLen / pathMax, 0.0, 1.0);
    float softness = clamp(mainSoftness / 3.0, 0.0, 1.0);
    float heightEffect = pow(optical, mix(1.2, 0.35, softness));
    float pathVisibility = smoothstep(0.01, 0.055, optical);
    float boundaryWeight = 1.0;
    if (softBoundaryDelta > 0.0) {
      boundaryWeight = 1.0 - smoothstep(outerRadius * (1.0 - softBoundaryDelta), outerRadius, b);
    }
    float finalIntensity = baseIntensity * edgeEffect * heightEffect * pathVisibility * boundaryWeight;
    if (scaleHeight > 0.0) {
      float scaleRadius = max(scaleHeight * earthRadius, 1e-5);
      float closeHeight = max(b - innerRadius, 0.0);
      float scaleWeight = exp(-closeHeight / scaleRadius);
      float edgeWeight = smoothstep(0.0, scaleRadius * 2.0, outerRadius - b);
      finalIntensity *= scaleWeight * edgeWeight;
    }
    vec3 finalColor = color * finalIntensity;
    float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor *= 1.0 + (noise - 0.5) * 0.004;
    gl_FragColor = vec4(finalColor, clamp(finalIntensity * 0.8, 0.0, 1.0));
  }
`;

const NEAR_VERTEX_SHADER = `
  uniform float thickness;
  uniform float nearFactor;
  uniform float earthRadius;
  uniform float offset;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vHeight;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = normalize(-mvPosition.xyz);
    float atmosphereRadius = earthRadius * (1.0 + thickness * nearFactor);
    float innerRadius = earthRadius * (1.0 - offset);
    float currentRadius = length(vWorldPos);
    vHeight = clamp((currentRadius - innerRadius) / (atmosphereRadius - innerRadius), 0.0, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normal);
    vFresnel = pow(1.0 - max(dot(viewNormal, vViewDirection), 0.0), 2.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const NEAR_FRAGMENT_SHADER = `
  uniform vec3 lightDir;
  uniform float intensity;
  uniform vec3 color;
  uniform float thickness;
  uniform float nearFactor;
  uniform float nearStrength;
  uniform float fresnelPower;
  uniform float nearContrast;
  uniform float earthRadius;
  uniform float nearSoftness;
  uniform float softBoundaryDelta;
  uniform float scaleHeight;
  uniform float offset;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDirection;
  varying float vFresnel;
  varying float vHeight;
  void main() {
    float signedNdl = dot(normalize(vWorldNormal), normalize(lightDir));
    float sunPhase = clamp(0.5 + 0.5 * signedNdl, 0.0, 1.0);
    sunPhase = sunPhase * sunPhase * (3.0 - 2.0 * sunPhase);
    float dayNightFactor = mix(1.0 - nearContrast, 1.0, sunPhase);
    float outerRadius = earthRadius * (1.0 + thickness * nearFactor);
    float innerRadius = earthRadius * (1.0 - offset);
    vec3 oc = cameraPosition;
    vec3 rd = normalize(vWorldPos - cameraPosition);
    float b = length(cross(oc, rd));
    float tO = sqrt(max(outerRadius * outerRadius - b * b, 0.0));
    float tI = sqrt(max(innerRadius * innerRadius - b * b, 0.0));
    float pathLen = max(tO - tI, 0.0);
    float pathMax = max(sqrt(max(outerRadius * outerRadius - innerRadius * innerRadius, 0.0)), 1e-5);
    float optical = clamp(pathLen / pathMax, 0.0, 1.0);
    float softness = clamp(nearSoftness / 3.0, 0.0, 1.0);
    float heightEffect = pow(optical, mix(1.2, 0.35, softness));
    float edgeEffect = pow(vFresnel, 1.0 / max(0.1, fresnelPower));
    float pathVisibility = smoothstep(0.01, 0.055, optical);
    float boundaryWeight = 1.0;
    if (softBoundaryDelta > 0.0) {
      boundaryWeight = 1.0 - smoothstep(outerRadius * (1.0 - softBoundaryDelta), outerRadius, b);
    }
    float finalIntensity = intensity * nearStrength * heightEffect * dayNightFactor * edgeEffect * pathVisibility * boundaryWeight;
    if (scaleHeight > 0.0) {
      float scaleRadius = max(scaleHeight * earthRadius, 1e-5);
      float closeHeight = max(b - innerRadius, 0.0);
      float scaleWeight = exp(-closeHeight / scaleRadius);
      float edgeWeight = smoothstep(0.0, scaleRadius * 2.0, outerRadius - b);
      finalIntensity *= scaleWeight * edgeWeight;
    }
    vec3 finalColor = color * finalIntensity * 1.35;
    float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor *= 1.0 + (noise - 0.5) * 0.004;
    gl_FragColor = vec4(finalColor, clamp(finalIntensity * 0.75, 0.0, 1.0));
  }
`;

function useProductionBlend(THREE: any, material: any): void {
  material.blending = THREE.AdditiveBlending;
}

export function createAtmospherePass(
  THREE: any,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const earthRadius = 1;
  const thickness = 0.18;
  const nearFactor = 0.22;
  const lightDir = new THREE.Vector3(...lightRayDirection).multiplyScalar(-1).normalize();
  const common = {
    lightDir: { value: lightDir },
    thickness: { value: thickness },
    fresnelPower: { value: 3.6 },
    earthRadius: { value: earthRadius },
    offset: { value: 0.001 },
  };
  const mainMaterial = new THREE.ShaderMaterial({
    name: 'LuBirthAtmosphereMainProductionMaterial',
    vertexShader: MAIN_VERTEX_SHADER,
    fragmentShader: MAIN_FRAGMENT_SHADER,
    uniforms: {
      ...common,
      intensity: { value: 0.36 },
      color: { value: new THREE.Color(0.07, 0.22, 0.58) },
      mainContrast: { value: 0.78 },
      mainSoftness: { value: 2.35 },
      softBoundaryDelta: { value: 0.012 },
      scaleHeight: { value: 0.078 },
    },
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    side: THREE.BackSide,
  });
  useProductionBlend(THREE, mainMaterial);
  const nearMaterial = new THREE.ShaderMaterial({
    name: 'LuBirthAtmosphereNearProductionMaterial',
    vertexShader: NEAR_VERTEX_SHADER,
    fragmentShader: NEAR_FRAGMENT_SHADER,
    uniforms: {
      ...common,
      intensity: { value: 0.62 },
      color: { value: new THREE.Color(0.12, 0.46, 0.95) },
      nearFactor: { value: nearFactor },
      nearStrength: { value: 0.46 },
      nearContrast: { value: 0.68 },
      nearSoftness: { value: 1.5 },
      softBoundaryDelta: { value: 0.02 },
      scaleHeight: { value: 0.016 },
    },
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    side: THREE.BackSide,
  });
  useProductionBlend(THREE, nearMaterial);

  const mainGeometry = new THREE.SphereGeometry(earthRadius * (1 + thickness), 64, 64);
  const nearGeometry = new THREE.SphereGeometry(earthRadius * (1 + thickness * nearFactor), 64, 64);
  const main = new THREE.Mesh(mainGeometry, mainMaterial);
  main.name = 'atmosphereMainShell';
  main.renderOrder = 4;
  const near = new THREE.Mesh(nearGeometry, nearMaterial);
  near.name = 'atmosphereNearShell';
  near.renderOrder = 5;
  const group = new THREE.Group();
  group.name = 'productionAtmosphereGroup';
  group.add(main, near);

  return {
    object: group,
    material: { main: mainMaterial, near: nearMaterial },
    dispose: () => {
      mainGeometry.dispose();
      nearGeometry.dispose();
      mainMaterial.dispose();
      nearMaterial.dispose();
    },
  };
}
