import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface AtmosphereEffectsProps {
  earthSize: number;
  earthY: number;
  rimStrength: number;
  rimWidth: number;
  rimRadius: number;
  haloWidth: number;
  earthGlowStrength: number;
  earthGlowHeight: number;
  earthGlowDayNightRatio: number;
  lightDirection: THREE.Vector3;
}

// 大气效果组件 - 完整移植rimMaterial和earthGlowMaterial，移除分层渲染
export function AtmosphereEffects({
  earthSize,
  earthY,
  rimStrength,
  rimWidth,
  rimRadius,
  haloWidth,
  earthGlowStrength,
  earthGlowHeight,
  earthGlowDayNightRatio,
  lightDirection
}: AtmosphereEffectsProps) {
  // 定向大气弧光（依光照方向 + Fresnel）- 完整移植自原Scene.tsx
  const rimMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        lightDir: { value: lightDirection.clone() },
        strength: { value: rimStrength },
        width: { value: rimWidth },
        color: { value: new THREE.Color('#6ea6ff') }
      },
      vertexShader: `
        varying vec3 vNormalW; 
        varying vec3 vViewW; 
        varying vec3 vPosW;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vPosW = wp.xyz;
          vNormalW = normalize(mat3(modelMatrix)*normal);
          vViewW = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 lightDir; 
        uniform float strength; 
        uniform float width; 
        uniform vec3 color;
        varying vec3 vNormalW; 
        varying vec3 vViewW; 
        varying vec3 vPosW;
        void main(){
          vec3 n = normalize(vNormalW);
          float ndl = max(dot(n, normalize(lightDir)), 0.0);
          float fres = pow(1.0 - max(dot(n, normalize(vViewW)), 0.0), 2.0);
          float rim = smoothstep(1.0 - width*2.0, 1.0 - width*0.2, ndl) * fres;
          gl_FragColor = vec4(color * rim * strength, rim * strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [lightDirection, rimStrength, rimWidth]);

  // 根据用户要求：完全移除地球辉光实现（保持参数以兼容现有调用）
  // 此处不再创建任何辉光材质或几何体

  // 更新着色器uniforms
  useEffect(() => {
    if (rimMaterial && rimMaterial.uniforms.lightDir?.value) {
      (rimMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDirection);
    }
  }, [rimMaterial, lightDirection]);

  // 无辉光可更新

  // 调试信息
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleAtmosphere]', {
        earthSize,
        earthY,
        rimStrength,
        rimWidth,
        earthGlowStrength,
        earthGlowHeight,
        lightDirection: lightDirection.toArray(),
        mode: 'single-render-system'
      });
    }
  }, [earthSize, earthY, rimStrength, rimWidth, earthGlowStrength, earthGlowHeight, lightDirection]);

  return (
    <>
      {/* 大气弧光 (directional, shader-based) */}
      <mesh>
        <sphereGeometry args={[earthSize * (1.0 + rimRadius), 96, 96]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>
      
      {/* 软光晕近表面 */}
      {haloWidth > 0 && (
        <mesh>
          <sphereGeometry args={[earthSize * (1.0 + Math.max(rimRadius * 1.2, haloWidth)), 64, 64]} />
          <meshBasicMaterial 
            color={new THREE.Color('#6ea6ff')} 
            transparent 
            opacity={0.04} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* 用户要求：移除地球辉光渲染 */}
    </>
  );
}
