import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface AtmosphereEffectsProps {
  earthSize: number;
  earthY: number;
  rimStrength: number;
  rimWidth: number;
  earthGlowStrength: number;
  earthGlowHeight: number;
  lightDirection: THREE.Vector3;
  // 新增：原版本的精细控制参数
  rimRadius?: number;
  haloWidth?: number;
}

// 大气效果组件 - 完整移植rimMaterial和earthGlowMaterial，移除分层渲染
export function AtmosphereEffects({
  earthSize,
  earthY,
  rimStrength,
  rimWidth,
  earthGlowStrength,
  earthGlowHeight,
  lightDirection,
  // 新增：原版本的精细控制参数
  rimRadius = 0.002,
  haloWidth = 0.006
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

  // 地光（径向渐变）：从地表向外逐渐消失，受"高度/强度"控制 - 完整移植自原Scene.tsx
  const earthGlowMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        strength: { value: earthGlowStrength },
        color: { value: new THREE.Color('#6ea6ff') },
        center: { value: new THREE.Vector3(0, earthY, 0) },
        innerR: { value: earthSize },
        outerR: { value: earthSize * (1.0 + earthGlowHeight) },
        lightDir: { value: new THREE.Vector3(lightDirection.x, lightDirection.y, lightDirection.z) },
      },
      vertexShader: `
        varying vec3 vPosW; 
        varying vec3 vViewW;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vPosW = wp.xyz;
          vViewW = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float strength; 
        uniform vec3 color; 
        uniform vec3 center; 
        uniform float innerR; 
        uniform float outerR; 
        uniform vec3 lightDir;
        varying vec3 vPosW; 
        varying vec3 vViewW;
        // 日侧边缘地光：仅在日侧边缘高亮，向外径向渐隐
        void main(){
          // 方向与边缘
          vec3 n = normalize(vPosW - center);            // 地表外法线
          float fres = pow(1.0 - max(dot(n, normalize(vViewW)), 0.0), 1.5); // 降低Fresnel指数，增强效果
          
          // 日侧权重：只在日侧起效，并在日侧中心逐步抑制，强调边缘
          float day = max(dot(n, normalize(lightDir)), 0.0);
          float w1 = smoothstep(0.01, 0.15, day);        // 更早开始日侧权重
          float w2 = 1.0 - smoothstep(0.6, 0.9, day);    // 更晚抑制中心
          float dayEdge = clamp(w1 * w2, 0.0, 1.0);
          float limb = fres * dayEdge;

          // 径向渐隐（屏幕环带）：基于"视线到球心的最近距离"映射 annulus [innerR..outerR]
          vec3 ro = cameraPosition;
          vec3 rd = normalize(vPosW - cameraPosition);
          vec3 oc = ro - center;
          float b2 = dot(oc - rd * dot(oc, rd), oc - rd * dot(oc, rd));
          float b = sqrt(max(b2, 0.0));
          float t = clamp((b - innerR) / max(outerR - innerR, 1e-3), 0.0, 1.0);
          float radial = pow(1.0 - t, 1.8); // 降低径向衰减指数，增强效果

          // 物理规律：日侧亮，夜侧暗
          float physicalWeight = smoothstep(0.0, 0.25, day); // 更早开始日侧权重
          
          // 增强整体效果
          float a = strength * limb * radial * physicalWeight * 1.5; // 乘以1.5增强效果
          gl_FragColor = vec4(color * a, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    return material;
  }, [earthGlowStrength, earthGlowHeight, earthSize, earthY, lightDirection]);

  // 更新着色器uniforms
  useEffect(() => {
    if (rimMaterial && rimMaterial.uniforms.lightDir?.value) {
      (rimMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDirection);
    }
  }, [rimMaterial, lightDirection]);

  useEffect(() => {
    if (earthGlowMaterial && earthGlowMaterial.uniforms.lightDir?.value) {
      (earthGlowMaterial.uniforms.lightDir.value as THREE.Vector3).set(lightDirection.x, lightDirection.y, lightDirection.z);
    }
  }, [earthGlowMaterial, lightDirection.x, lightDirection.y, lightDirection.z]);

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
      
      {/* 地球辉光 (径向渐隐) */}
      {earthGlowStrength > 0 && earthGlowHeight > 0 && (
        <mesh>
          <sphereGeometry args={[earthSize * (1.0 + earthGlowHeight), 72, 72]} />
          <primitive object={earthGlowMaterial} attach="material" />
        </mesh>
      )}
    </>
  );
}
