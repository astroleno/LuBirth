import type { ScenePass, SceneTextureBundle } from './scene-types.ts';
import { TWILIGHT_PROFILE } from './lighting-profile.ts';

export function createEarthPass(
  THREE: any,
  textures: SceneTextureBundle,
  fallback: ReturnType<typeof import('./texture-fallbacks.ts')['createFallbackTextures']>,
  lightRayDirection: readonly [number, number, number],
): ScenePass {
  const geometry = new THREE.SphereGeometry(1, 144, 72);
  const material = new THREE.ShaderMaterial({
    name: 'LuBirthEarthProductionEffectMaterial',
    extensions: { derivatives: true },
    uniforms: {
      dayMap: { value: textures.earthDay ?? fallback.day },
      nightMap: { value: textures.earthNight ?? fallback.night },
      normalMap: { value: textures.earthNormal ?? fallback.normal },
      specularMap: { value: textures.earthSpecular ?? fallback.specular },
      displacementMap: { value: textures.earthDisplacement ?? fallback.displacement },
      cloudMap: { value: textures.clouds ?? fallback.cloud },
      lightDir: { value: new THREE.Vector3(...lightRayDirection).normalize() },
      displacementScale: { value: textures.earthDisplacement ? 0.0035 : 0 },
      normalStrength: { value: 0.35 },
      terminatorSoftness: { value: TWILIGHT_PROFILE.endCosine - TWILIGHT_PROFILE.startCosine },
      twilightStart: { value: TWILIGHT_PROFILE.startCosine },
      twilightEnd: { value: TWILIGHT_PROFILE.endCosine },
      terminatorLift: { value: 0.008 },
      terminatorTint: { value: new THREE.Vector4(1, 0.88, 0.76, 0.012) },
      cloudShadowStrength: { value: 0.4 },
      sunIntensity: { value: 2.45 },
      dayDiffuseMax: { value: 1 },
      dayDiffuseGamma: { value: 1 },
      nightBoost: { value: 2.7 },
      nightGamma: { value: 1.1 },
      nightFalloff: { value: 1.45 },
      nightHemisphereBrightness: { value: 0.5 },
      nightGlowBlur: { value: 0.01 },
      nightGlowOpacity: { value: 0.42 },
      nightEarthMapIntensity: { value: 0.09 },
      nightEarthMapHue: { value: 200 },
      nightEarthMapSaturation: { value: 0.3 },
      nightEarthMapLightness: { value: 0.4 },
      specStrength: { value: 0.8 },
      shininess: { value: 80 },
      broadStrength: { value: 0.4 },
      specFresnelK: { value: 1.8 },
      rimStrength: { value: 0.78 },
      rimWidth: { value: 3.2 },
      rimHeight: { value: 0.01 },
      rimRadius: { value: 0.005 },
      haloWidth: { value: 0.01 },
    },
    vertexShader: `
      uniform sampler2D displacementMap;
      uniform float displacementScale;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying vec3 vViewDirection;
      void main() {
        vUv = uv;
        float height = (texture2D(displacementMap, uv).r - 0.5) * displacementScale;
        vec3 displaced = position + normal * height;
        vec4 world = modelMatrix * vec4(displaced, 1.0);
        vWorldPosition = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vViewDirection = normalize(cameraPosition - vWorldPosition);
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
      uniform float twilightStart;
      uniform float twilightEnd;
      uniform float terminatorLift;
      uniform vec4 terminatorTint;
      uniform float cloudShadowStrength;
      uniform float sunIntensity;
      uniform float dayDiffuseMax;
      uniform float dayDiffuseGamma;
      uniform float nightBoost;
      uniform float nightGamma;
      uniform float nightFalloff;
      uniform float nightHemisphereBrightness;
      uniform float nightGlowBlur;
      uniform float nightGlowOpacity;
      uniform float nightEarthMapIntensity;
      uniform float nightEarthMapHue;
      uniform float nightEarthMapSaturation;
      uniform float nightEarthMapLightness;
      uniform float specStrength;
      uniform float shininess;
      uniform float broadStrength;
      uniform float specFresnelK;
      uniform float rimStrength;
      uniform float rimWidth;
      uniform float rimHeight;
      uniform float rimRadius;
      uniform float haloWidth;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      varying vec3 vViewDirection;

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

      vec3 hslToRgb(float h, float s, float l) {
        h = h / 360.0;
        float c = (1.0 - abs(2.0 * l - 1.0)) * s;
        float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
        float m = l - c / 2.0;
        vec3 rgb;
        if (h < 1.0/6.0) rgb = vec3(c, x, 0.0);
        else if (h < 2.0/6.0) rgb = vec3(x, c, 0.0);
        else if (h < 3.0/6.0) rgb = vec3(0.0, c, x);
        else if (h < 4.0/6.0) rgb = vec3(0.0, x, c);
        else if (h < 5.0/6.0) rgb = vec3(x, 0.0, c);
        else rgb = vec3(c, 0.0, x);
        return rgb + m;
      }

      vec3 sampleNightGlow(sampler2D source, vec2 uv, float blur) {
        if (blur <= 0.0) return texture2D(source, uv).rgb;
        vec3 color = vec3(0.0);
        float totalWeight = 0.0;
        if (blur < 0.003) {
          float weights[9];
          weights[0] = 0.0625; weights[1] = 0.125; weights[2] = 0.0625;
          weights[3] = 0.125; weights[4] = 0.25; weights[5] = 0.125;
          weights[6] = 0.0625; weights[7] = 0.125; weights[8] = 0.0625;
          float scale = blur * 0.1;
          for (int i = 0; i < 9; i++) {
            int x = i / 3 - 1;
            int y = i - (i / 3) * 3 - 1;
            color += texture2D(source, uv + vec2(float(x), float(y)) * scale).rgb * weights[i];
            totalWeight += weights[i];
          }
        } else if (blur < 0.008) {
          float weights[25];
          weights[0] = 0.003765; weights[1] = 0.015019; weights[2] = 0.023792; weights[3] = 0.015019; weights[4] = 0.003765;
          weights[5] = 0.015019; weights[6] = 0.059912; weights[7] = 0.094907; weights[8] = 0.059912; weights[9] = 0.015019;
          weights[10] = 0.023792; weights[11] = 0.094907; weights[12] = 0.150342; weights[13] = 0.094907; weights[14] = 0.023792;
          weights[15] = 0.015019; weights[16] = 0.059912; weights[17] = 0.094907; weights[18] = 0.059912; weights[19] = 0.015019;
          weights[20] = 0.003765; weights[21] = 0.015019; weights[22] = 0.023792; weights[23] = 0.015019; weights[24] = 0.003765;
          float scale = blur * 0.05;
          for (int i = 0; i < 25; i++) {
            int x = i / 5 - 2;
            int y = i - (i / 5) * 5 - 2;
            color += texture2D(source, uv + vec2(float(x), float(y)) * scale).rgb * weights[i];
            totalWeight += weights[i];
          }
        } else {
          float weights[49];
          weights[0] = 0.000843; weights[1] = 0.003898; weights[2] = 0.009949; weights[3] = 0.013690; weights[4] = 0.009949; weights[5] = 0.003898; weights[6] = 0.000843;
          weights[7] = 0.003898; weights[8] = 0.018016; weights[9] = 0.045991; weights[10] = 0.063242; weights[11] = 0.045991; weights[12] = 0.018016; weights[13] = 0.003898;
          weights[14] = 0.009949; weights[15] = 0.045991; weights[16] = 0.117380; weights[17] = 0.161509; weights[18] = 0.117380; weights[19] = 0.045991; weights[20] = 0.009949;
          weights[21] = 0.013690; weights[22] = 0.063242; weights[23] = 0.161509; weights[24] = 0.222242; weights[25] = 0.161509; weights[26] = 0.063242; weights[27] = 0.013690;
          weights[28] = 0.009949; weights[29] = 0.045991; weights[30] = 0.117380; weights[31] = 0.161509; weights[32] = 0.117380; weights[33] = 0.045991; weights[34] = 0.009949;
          weights[35] = 0.003898; weights[36] = 0.018016; weights[37] = 0.045991; weights[38] = 0.063242; weights[39] = 0.045991; weights[40] = 0.018016; weights[41] = 0.003898;
          weights[42] = 0.000843; weights[43] = 0.003898; weights[44] = 0.009949; weights[45] = 0.013690; weights[46] = 0.009949; weights[47] = 0.003898; weights[48] = 0.000843;
          float scale = blur * 0.03;
          for (int i = 0; i < 49; i++) {
            int x = i / 7 - 3;
            int y = i - (i / 7) * 7 - 3;
            color += texture2D(source, uv + vec2(float(x), float(y)) * scale).rgb * weights[i];
            totalWeight += weights[i];
          }
        }
        return color / max(totalWeight, 0.0001);
      }

      void main() {
        vec3 normal = derivativeNormal(normalize(vWorldNormal));
        vec3 toSun = -normalize(lightDir);
        float geometricNdl = dot(normalize(vWorldNormal), toSun);
        float shadingNdl = dot(normal, toSun);
        float edge = terminatorSoftness;
        float surfaceBlend = smoothstep(twilightStart, twilightEnd, geometricNdl);
        float dayWeight = surfaceBlend;
        float nightGate = 1.0 - surfaceBlend;
        float glowGate = 1.0 - surfaceBlend;
        vec3 dayTex = texture2D(dayMap, vUv).rgb;
        vec3 moonTint = hslToRgb(nightEarthMapHue, nightEarthMapSaturation, nightEarthMapLightness);
        float nightSurfaceAmbient = nightEarthMapIntensity * nightHemisphereBrightness * 0.45;
        float surfaceAmbient = mix(nightSurfaceAmbient, 0.055, dayWeight);
        vec3 surfaceBase = dayTex * mix(moonTint, vec3(1.0), dayWeight) * surfaceAmbient;
        float diffuseRamp = smoothstep(twilightStart, 0.58, shadingNdl);
        float lightFactor = diffuseRamp * sunIntensity;
        if (dayDiffuseGamma != 1.0) lightFactor = pow(max(lightFactor, 0.0), max(dayDiffuseGamma, 0.0001));
        if (dayDiffuseMax > 0.0) lightFactor = min(lightFactor, dayDiffuseMax);
        float clouds = texture2D(cloudMap, vUv).r;
        float cloudShadow = 1.0 - cloudShadowStrength * clouds;
        vec3 dayColor = dayTex * lightFactor * cloudShadow * dayWeight;

        vec3 nightTex = pow(texture2D(nightMap, vUv).rgb, vec3(nightGamma));
        float cityLightGate = smoothstep(0.38, 0.92, nightGate);
        cityLightGate = pow(cityLightGate, nightFalloff);
        vec3 nightColor = nightTex * cityLightGate * nightBoost * nightHemisphereBrightness;
        vec3 glowTex = pow(sampleNightGlow(nightMap, vUv, nightGlowBlur), vec3(nightGamma));
        float glowWeight = smoothstep(0.28, 0.92, glowGate);
        glowWeight = pow(glowWeight, 1.2);
        vec3 nightGlow = glowTex * glowWeight * nightBoost * nightGlowOpacity * nightHemisphereBrightness;

        vec3 viewDir = normalize(vViewDirection);
        vec3 halfDir = normalize(toSun + viewDir);
        float specMask = texture2D(specularMap, vUv).r;
        float specFresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), specFresnelK);
        float narrowSpec = pow(max(dot(normal, halfDir), 0.0), shininess);
        float broadSpec = pow(max(dot(normal, halfDir), 0.0), 24.0);
        vec3 specular = vec3(0.55, 0.68, 0.82) * (narrowSpec * specStrength + broadSpec * broadStrength) * specMask * diffuseRamp * specFresnel;

        float terminatorCenter = (twilightStart + twilightEnd) * 0.5;
        float terminatorHalfWidth = max((twilightEnd - twilightStart) * 0.5, 0.001);
        float terminator = 1.0 - smoothstep(0.0, terminatorHalfWidth, abs(geometricNdl - terminatorCenter));
        vec3 lift = vec3(terminatorLift) * terminator;
        float tintZone = 1.0 - smoothstep(0.0, terminatorHalfWidth * 1.4, abs(geometricNdl - terminatorCenter));
        vec3 tint = terminatorTint.rgb * terminatorTint.a * tintZone;

        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float innerRim = pow(fresnel, max(rimWidth * 2.2, 0.8));
        float outerRim = pow(fresnel, max(rimWidth * 1.15, 0.3));
        float rimEffect = (innerRim * 0.82 + outerRim * 0.18) * rimStrength;
        float rimSunPhase = clamp(0.5 + 0.5 * geometricNdl, 0.0, 1.0);
        rimSunPhase = rimSunPhase * rimSunPhase * (3.0 - 2.0 * rimSunPhase);
        float dayNightRim = mix(0.12, 1.0, rimSunPhase);
        rimEffect *= dayNightRim;
        vec3 rimColor = mix(vec3(0.02, 0.12, 0.4), vec3(0.12, 0.52, 1.0), innerRim) * rimEffect;

        gl_FragColor = vec4(surfaceBase + dayColor + nightColor + nightGlow + specular + lift + tint + rimColor, 1.0);
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
