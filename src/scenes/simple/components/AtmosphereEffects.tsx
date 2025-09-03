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

  // 地光（圆环辉光）：从地球表面向外扩散的发光圆环
  const earthGlowMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        strength: { value: earthGlowStrength },
        color: { value: new THREE.Color('#6ea6ff') },
        center: { value: new THREE.Vector3(0, earthY, 0) },
        earthRadius: { value: earthSize },
        glowHeight: { value: earthGlowHeight },
        dayNightRatio: { value: earthGlowDayNightRatio },
        lightDir: { value: new THREE.Vector3(lightDirection.x, lightDirection.y, lightDirection.z) },
      },
      vertexShader: `
        varying vec3 vPosW; 
        varying vec3 vNormal;
        
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vPosW = wp.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float strength; 
        uniform vec3 color; 
        uniform vec3 center; 
        uniform float earthRadius; 
        uniform float glowHeight; 
        uniform float dayNightRatio;
        uniform vec3 lightDir;
        varying vec3 vPosW; 
        varying vec3 vNormal;
        
        void main(){
          // 1. 圆环辉光：基于视线方向创建圆环效果
          vec3 viewDir = normalize(cameraPosition - vPosW);
          vec3 toCenter = normalize(vPosW - center);
          
          // 计算视线与地球表面的切点距离
          float viewDotCenter = dot(viewDir, toCenter);
          float distanceFromSurface = length(vPosW - center) - earthRadius;
          
          // 圆环效果：在视线切点附近产生辉光
          float ringEffect = 1.0 - smoothstep(0.0, glowHeight, distanceFromSurface);
          
          // 2. 日侧夜侧对比
          vec3 n = normalize(vPosW - center);
          float dayWeight = max(dot(n, normalize(lightDir)), 0.0);
          float dayNightContrast = mix(1.0, smoothstep(0.0, 0.3, dayWeight), dayNightRatio);
          
          // 3. 边缘增强：在圆环边缘产生更强的辉光
          float edgeEnhance = 1.0 - smoothstep(0.0, glowHeight * 0.5, distanceFromSurface);
          
          // 4. 组合效果：圆环辉光 × 日侧夜侧对比 × 边缘增强
          float alpha = strength * ringEffect * dayNightContrast * edgeEnhance;
          
          // 确保最小可见性
          alpha = max(alpha, 0.1);
          alpha = min(alpha, 1.0);
          
          gl_FragColor = vec4(color * alpha, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    
    // 调试信息
    console.log('[AtmosphereEffects] 创建地球圆环辉光材质:', {
      strength: earthGlowStrength,
      height: earthGlowHeight,
      dayNightRatio: earthGlowDayNightRatio,
      earthSize,
      earthRadius: earthSize,
      glowHeight: earthGlowHeight
    });
    
    return material;
  }, [earthGlowStrength, earthGlowHeight, earthGlowDayNightRatio, earthSize, earthY, lightDirection]);

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
      
      {/* 地球辉光 (真正的渐变消失) */}
      {earthGlowStrength > 0 && earthGlowHeight > 0 && (
        <mesh>
          <sphereGeometry args={[earthSize * (1.0 + earthGlowHeight), 72, 72]} />
          <primitive object={earthGlowMaterial} attach="material" />
        </mesh>
      )}
    </>
  );
}
