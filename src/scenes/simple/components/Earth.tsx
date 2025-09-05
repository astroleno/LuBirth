import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTextureLoader } from '../utils/textureLoader';

// 地球组件 - 完整移植earthDNMaterial着色器，移除分层渲染
export function Earth({ 
  position, 
  size, 
  lightDirection, 
  tiltDeg, 
  yawDeg,
  useTextures,
  lightColor,
  sunIntensity,
  terminatorSoftness,
  nightIntensity,
  shininess,
  specStrength,
  broadStrength,
  // 新增：地球材质色温和亮度控制
  earthLightTempK = 5600,
  earthLightIntensity = 1.0,
  nightFalloff = 1.6,
  dayAmbient = 0.02,
  terminatorLift = 0.01
}: {
  position: [number, number, number];
  size: number;
  lightDirection: THREE.Vector3;
  tiltDeg: number;
  yawDeg: number;
  useTextures: boolean;
  lightColor: THREE.Color;
  sunIntensity: number;
  terminatorSoftness: number;
  nightIntensity: number;
  shininess: number;
  specStrength: number;
  broadStrength: number;
  // 新增：地球材质色温和亮度控制
  earthLightTempK?: number;
  earthLightIntensity?: number;
  nightFalloff?: number;
  dayAmbient?: number;
  terminatorLift?: number;
}) {
  // 加载纹理
  const {
    earthMap,
    earthNight,
    earthNormal,
    earthSpecular
  } = useTextureLoader({ useTextures });

  // Earth Day/Night 混合着色器 - 完整移植自原Scene.tsx
  const earthDNMaterial = useMemo(() => {
    if (!earthMap) return null;
    
    const hasNight = !!earthNight;
    const hasSpec = !!earthSpecular;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: earthMap },
        nightMap: { value: earthNight ?? new THREE.Texture() },
        specMap: { value: earthSpecular ?? new THREE.Texture() },
        lightDir: { value: lightDirection.clone() },
        lightColor: { value: lightColor.clone() },
        sunI: { value: sunIntensity },
        ambient: { value: dayAmbient },
        nightBoost: { value: nightIntensity },
        edge: { value: terminatorSoftness },
        lift: { value: terminatorLift },
        hasNight: { value: hasNight ? 1 : 0 },
        hasSpec: { value: hasSpec ? 1 : 0 },
        specStrength: { value: specStrength },
        shininess: { value: shininess },
        broadStrength: { value: broadStrength },
        broadShiny: { value: 24.0 }, // 固定值
        nightGamma: { value: 1.1 }, // 固定值
        nightFalloff: { value: nightFalloff },
      },
      vertexShader: `
        varying vec2 vUv; 
        varying vec3 vNormalW; 
        varying vec3 vViewW;
        
        void main(){
          vUv = uv;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vec3 worldPos = (modelMatrix * vec4(position,1.0)).xyz;
          vViewW = normalize(cameraPosition - worldPos);
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap; 
        uniform sampler2D nightMap; 
        uniform sampler2D specMap; 
        uniform vec3 lightDir; 
        uniform vec3 lightColor; 
        uniform float sunI;
        uniform float ambient; 
        uniform float nightBoost; 
        uniform float edge; 
        uniform float lift; 
        uniform float nightFalloff; 
        uniform int hasNight; 
        uniform int hasSpec; 
        uniform float specStrength; 
        uniform float shininess; 
        uniform float broadStrength; 
        uniform float broadShiny; 
        uniform float nightGamma;
        
        varying vec2 vUv; 
        varying vec3 vNormalW; 
        varying vec3 vViewW;
        
        void main(){
          vec3 n = normalize(vNormalW);
          float ndl = dot(n, normalize(lightDir));
          float noise = fract(sin(dot(vUv, vec2(12.9898,78.233))) * 43758.5453);
          float ndl_d = ndl + (noise - 0.5) * edge * 0.25;
          float f = smoothstep(-edge, edge, ndl_d);
          float dayW = f;
          
          vec3 dayTex = texture2D(dayMap, vUv).rgb;
          // 修复：当太阳在背后时（ndl < 0），日面应该完全黑暗
          float dayLight = max(ndl, 0.0); // 只有面向太阳的面才有光照
          vec3 dayCol = dayTex * (dayLight * sunI + ambient) * lightColor * dayW;
          
          // 终止线软化 + 夜景随距离衰减
          float nightW = pow(1.0 - f, nightFalloff);
          float rim = 1.0 - smoothstep(0.0, edge*1.5, abs(ndl));
          
          vec3 nightCol = vec3(0.0);
          if (hasNight == 1) {
            vec3 nightTex = texture2D(nightMap, vUv).rgb;
            nightTex = pow(nightTex, vec3(nightGamma));
            // 夜景只在夜面显示
            nightCol = nightTex * nightW * nightBoost;
          }
          
          // 日侧高光（仅日面，受specMap影响）
          vec3 specCol = vec3(0.0);
          if (dayLight > 0.0 && hasSpec == 1) {
            vec3 L = normalize(lightDir);
            vec3 V = normalize(vViewW);
            vec3 R = reflect(-L, n);
            float s1 = pow(max(dot(R, V), 0.0), shininess);
            float s2 = pow(max(dot(R, V), 0.0), broadShiny);
            float mask = texture2D(specMap, vUv).r; // 取红通道当mask
            specCol = lightColor * (s1 * specStrength + s2 * broadStrength) * mask * sunI;
          }
          
          // 在终止线附近做少量亮度提拉，便于手动调节"太暗"情况
          vec3 liftCol = vec3(lift) * rim;
          
          gl_FragColor = vec4(dayCol + nightCol + liftCol + specCol, 1.0);
        }
      `,
    });
    
    // 移除分层渲染逻辑
    // if (material && material.layers) {
    //   material.layers.set(1);
    // }
    
    return material;
  }, [
    earthMap, 
    earthNight, 
    earthSpecular, 
    lightDirection, 
    lightColor, 
    sunIntensity, 
    terminatorSoftness, 
    nightIntensity, 
    dayAmbient, 
    terminatorLift, 
    specStrength, 
    shininess, 
    broadStrength, 
    nightFalloff
  ]);

  // 更新着色器uniforms
  useEffect(() => {
    if (earthDNMaterial) {
      try {
        if (earthDNMaterial.uniforms.lightDir?.value) {
          (earthDNMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDirection);
        }
        if (earthDNMaterial.uniforms.sunI) {
          earthDNMaterial.uniforms.sunI.value = sunIntensity;
        }
        if (earthDNMaterial.uniforms.lightColor?.value) {
          earthDNMaterial.uniforms.lightColor.value.copy(lightColor);
        }
      } catch (error) {
        console.error('[SimpleEarth] Error updating uniforms:', error);
      }
    }
  }, [earthDNMaterial, lightDirection, sunIntensity, lightColor]);

  // 调试信息
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleEarth]', {
        position,
        size,
        lightDirection: lightDirection.toArray(),
        useTextures,
        hasDayMap: !!earthMap,
        hasNightMap: !!earthNight,
        hasSpecMap: !!earthSpecular,
        mode: 'single-render-system'
      });
    }
  }, [position, size, lightDirection, useTextures, earthMap, earthNight, earthSpecular]);

  return (
    <group 
      position={position} 
      // 🔧 关键修复：移除rotation prop，避免与四元数旋转冲突
      // 地球旋转现在完全由earthRoot的四元数控制
    >
      {/* 地球核心 */}
      <mesh>
        <sphereGeometry args={[size, 144, 144]} />
        {earthDNMaterial ? (
          <primitive object={earthDNMaterial} attach="material" />
        ) : (
          <meshPhongMaterial 
            color={new THREE.Color('#9fb3c8')} 
            shininess={6} 
            specular={new THREE.Color('#2a2a2a')}
          />
        )}
      </mesh>
      
      {/* 位置标记 - 地球表面上方的小点 */}
      <mesh position={[0, size * 1.02, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color('#0d0d0d')} 
          emissive={new THREE.Color('#151515')} 
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}
