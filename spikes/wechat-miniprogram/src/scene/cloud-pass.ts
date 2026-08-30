import type { ScenePass, SceneTextureBundle } from './scene-types.ts';
import { TWILIGHT_PROFILE } from './lighting-profile.ts';

const CLOUD_VERTEX_SHADER = `
  uniform sampler2D cloudMap;
  uniform float displacementScale;
  uniform float displacementBias;
  uniform vec2 uvOffset;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vec2 layerUv = vUv + uvOffset;
    float displacement = texture2D(cloudMap, layerUv).r;
    displacement = displacement * displacementScale + displacementBias;
    vec3 displaced = position + normal * displacement;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const CLOUD_FRAGMENT_SHADER = `
  uniform sampler2D cloudMap;
  uniform vec3 lightDir;
  uniform vec3 lightColor;
  uniform float strength;
  uniform float sunIntensity;
  uniform float cloudGamma;
  uniform float cloudBlack;
  uniform float cloudWhite;
  uniform float cloudContrast;
  uniform vec2 uvOffset;
  uniform bool useVolumeScattering;
  uniform float volumeDensity;
  uniform float scatteringStrength;
  uniform float scatteringG;
  uniform float rimEffect;
  uniform float densityEnhancement;
  uniform vec3 scatteringColor;
  uniform float noiseScale;
  uniform float noiseStrength;
  uniform bool useThicknessMapping;
  uniform float thicknessScale;
  uniform float thicknessBias;
  uniform float thicknessPower;
  uniform bool useFresnel;
  uniform float fresnelPower;
  uniform float fresnelStrength;
  uniform vec3 camPos;
  uniform vec3 sphereCenter;
  uniform float sphereRadius;
  uniform float rimPower;
  uniform float rimStart;
  uniform float rimEnd;
  uniform float curvePowerA;
  uniform float curvePowerB;
  uniform float curveMixPoint;
  uniform float opacity;
  uniform float twilightStart;
  uniform float twilightEnd;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosition;

  float henyeyGreenstein(float cosTheta, float g) {
    return (1.0 - g * g) / (4.0 * 3.14159 * pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5));
  }

  float blueNoise(vec2 uv) {
    return fract(sin(dot(uv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 calculateVolumeScattering(vec3 sourceColor, vec3 sunDirection, vec3 normal, float density) {
    if (!useVolumeScattering) return sourceColor;
    float cosTheta = dot(normal, normalize(sunDirection));
    float phase = henyeyGreenstein(cosTheta, scatteringG);
    float baseScattering = phase * scatteringStrength;
    float densityEnhancementFactor = pow(density, 0.5) * densityEnhancement;
    float scattering = baseScattering * densityEnhancementFactor;
    float rimEffectFactor = 1.0 - abs(cosTheta);
    scattering += rimEffectFactor * rimEffect * density;
    float scatteringWeight = clamp(scattering, 0.0, 0.65);
    return mix(sourceColor, scatteringColor, scatteringWeight);
  }

  float sampleVolumeDensity(vec2 uv, float depth) {
    float density = 1.0 - smoothstep(0.0, 0.8, depth);
    float noise = blueNoise(uv * noiseScale);
    density *= 0.6 + noiseStrength * noise;
    float noise2 = blueNoise(uv * noiseScale * 2.0 + 0.5);
    density *= 0.7 + noiseStrength * 0.6 * noise2;
    density *= volumeDensity;
    return max(density, 0.1);
  }

  float calculateThicknessMapping(vec2 uv) {
    if (!useThicknessMapping) return 1.0;
    float displacement = texture2D(cloudMap, uv).r;
    float thickness = pow(displacement, thicknessPower) * thicknessScale + thicknessBias;
    thickness = clamp(thickness, 0.2, 5.0);
    return pow(thickness, 0.7);
  }

  void main() {
    vec3 normal = normalize(vNormalW);
    float signedNdl = dot(normal, normalize(lightDir));
    vec2 uv = vUv + uvOffset;
    vec3 source = texture2D(cloudMap, uv).rgb;
    float luminance = dot(source, vec3(0.299, 0.587, 0.114));
    float range = max(0.0001, cloudWhite - cloudBlack);
    float densityMask = clamp((luminance - cloudBlack) / range, 0.0, 1.0);
    densityMask = pow(densityMask, cloudGamma);
    densityMask = clamp((densityMask - 0.5) * cloudContrast + 0.5, 0.0, 1.0);

    float dayWeight = smoothstep(twilightStart, twilightEnd, signedNdl);
    float terminatorZone = dayWeight;
    vec3 color = pow(source, vec3(cloudGamma));
    color = clamp((color - vec3(cloudBlack)) / range, 0.0, 1.0);
    color = clamp((color - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
    color = mix(color, color * vec3(1.0, 0.85, 0.75), (1.0 - terminatorZone) * 0.08);

    float volume = sampleVolumeDensity(uv, densityMask);
    float thickness = calculateThicknessMapping(uv);
    volume *= thickness;
    color = calculateVolumeScattering(color, lightDir, normal, volume);

    float edgeOpacity = 1.0;
    if (useFresnel) {
      vec3 rayDirection = normalize(vPosition - camPos);
      vec3 centerDirection = normalize(sphereCenter - camPos);
      float distanceToCenter = length(sphereCenter - camPos);
      float visibleHalfAngle = asin(clamp(sphereRadius / max(distanceToCenter, 1e-5), 0.0, 1.0));
      float pixelAngle = acos(clamp(dot(rayDirection, centerDirection), -1.0, 1.0));
      float u = clamp(pixelAngle / max(visibleHalfAngle, 1e-5), 0.0, 1.0);
      float rimCurve;
      if (u <= curveMixPoint) {
        rimCurve = pow(u / curveMixPoint, curvePowerA) * curveMixPoint;
      } else {
        rimCurve = curveMixPoint + pow((u - curveMixPoint) / (1.0 - curveMixPoint), curvePowerB) * (1.0 - curveMixPoint);
      }
      float rimFade = smoothstep(rimStart, rimEnd, pow(rimCurve, rimPower));
      edgeOpacity = clamp(1.0 - rimFade, 0.0, 1.0);
      float reflection = 0.03 + 0.97 * pow(1.0 - clamp(dot(normalize(vPosition - sphereCenter), normalize(camPos - vPosition)), 0.0, 1.0), 5.0);
      color = mix(color, color * reflection, fresnelStrength * 0.35);
    }

    if (useThicknessMapping) color = mix(color, color * 1.12, min(thickness * 0.12, 0.35));
    float silverRim = pow(1.0 - max(dot(normal, normalize(camPos - vPosition)), 0.0), 2.0) * 0.14 * max(signedNdl, 0.0);
    float lighting = 0.025 + pow(dayWeight, 0.9) * (0.64 + 0.14 * sunIntensity) + silverRim;
    float nightSilhouette = mix(0.05, 1.0, dayWeight);
    float alpha = clamp(nightSilhouette * strength * densityMask * opacity, 0.0, 1.0) * edgeOpacity;
    gl_FragColor = vec4(color * lighting * lightColor, alpha);
  }
`;

export function createCloudPass(
  THREE: any,
  textures: SceneTextureBundle,
  fallback: any,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const group = new THREE.Group();
  group.name = 'productionCloudStack';
  const geometries: any[] = [];
  const materials: any[] = [];
  const toSun = new THREE.Vector3(...lightRayDirection).multiplyScalar(-1).normalize();

  for (let layer = 0; layer < 6; layer += 1) {
    const radius = 1.003 + layer * 0.00055;
    const geometry = new THREE.SphereGeometry(radius, 144, 72);
    const material = new THREE.ShaderMaterial({
      name: `LuBirthCloudProductionMaterial${layer + 1}`,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      toneMapped: true,
      blending: THREE.NormalBlending,
      uniforms: {
        cloudMap: { value: textures.clouds ?? fallback.cloud },
        lightDir: { value: toSun.clone() },
        lightColor: { value: new THREE.Color(1, 1, 1) },
        strength: { value: 0.145 * (0.96 - layer * 0.025) },
        sunIntensity: { value: 2.45 },
        cloudGamma: { value: 0.64 },
        cloudBlack: { value: 0 },
        cloudWhite: { value: 0.82 },
        cloudContrast: { value: 1.04 },
        uvOffset: { value: new THREE.Vector2((layer - 2.5) * 0.00065, 0) },
        displacementScale: { value: 0.02 },
        displacementBias: { value: 0.03 },
        useVolumeScattering: { value: true },
        volumeDensity: { value: 0.65 },
        scatteringStrength: { value: 0.44 },
        scatteringG: { value: -0.5 },
        rimEffect: { value: 0.58 },
        densityEnhancement: { value: 1.55 },
        scatteringColor: { value: new THREE.Vector3(1, 0.95, 0.9) },
        noiseScale: { value: 2 },
        noiseStrength: { value: 0.55 },
        useThicknessMapping: { value: true },
        thicknessScale: { value: 3.2 },
        thicknessBias: { value: 1 },
        thicknessPower: { value: 1.5 },
        useFresnel: { value: true },
        fresnelPower: { value: 5 },
        fresnelStrength: { value: 0.5 },
        camPos: { value: new THREE.Vector3() },
        sphereCenter: { value: new THREE.Vector3() },
        sphereRadius: { value: radius },
        rimPower: { value: 3 },
        rimStart: { value: 0.2 },
        rimEnd: { value: 0.85 },
        curvePowerA: { value: 0.1 },
        curvePowerB: { value: 4.2 },
        curveMixPoint: { value: 0.8 },
        opacity: { value: 1 },
        twilightStart: { value: TWILIGHT_PROFILE.startCosine },
        twilightEnd: { value: TWILIGHT_PROFILE.endCosine },
      },
      vertexShader: CLOUD_VERTEX_SHADER,
      fragmentShader: CLOUD_FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `cloudLayer${layer + 1}`;
    mesh.renderOrder = 3 + layer;
    mesh.onBeforeRender = (_renderer: any, _scene: any, camera: any) => {
      material.uniforms.camPos.value.copy(camera.position);
      material.uniforms.sphereCenter.value.setFromMatrixPosition(mesh.matrixWorld);
    };
    group.add(mesh);
    geometries.push(geometry);
    materials.push(material);
  }

  return {
    object: group,
    material: materials,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
