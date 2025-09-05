import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTextureLoader } from '../../utils/textureLoader';

// 云层组件 - 完整移植CloudsLitSphere着色器，移除分层渲染
export function Clouds({ 
  radius, 
  texture, 
  position, 
  yawDeg = 0, 
  pitchDeg = 0, 
  lightDir, 
  lightColor, 
  strength = 0.5, 
  sunI = 1.0, 
  cloudGamma = 1.0, 
  cloudBlack = 0.4, 
  cloudWhite = 0.85, 
  cloudContrast = 1.2 
}: {
  radius: number;
  texture: THREE.Texture | null;
  position: [number, number, number];
  yawDeg?: number;
  pitchDeg?: number;
  lightDir: THREE.Vector3;
  lightColor: THREE.Color;
  strength?: number;
  sunI?: number;
  cloudGamma?: number;
  cloudBlack?: number;
  cloudWhite?: number;
  cloudContrast?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  
  // 🔧 关键修复：移除useFrame旋转，避免与四元数控制冲突
  // 云层旋转现在通过position计算，不再使用rotation
  // useFrame((_, delta) => { 
  //   if (ref.current) { 
  //     ref.current.rotation.y = THREE.MathUtils.degToRad(yawDeg); 
  //     ref.current.rotation.x = THREE.MathUtils.degToRad(pitchDeg); 
  //   } 
  // });
  
  // 云层着色器材质 - 完整移植自原Scene.tsx
  const cloudMaterial = useMemo(() => {
    if (!texture) return null;
    
    const ld = (lightDir ?? new THREE.Vector3(1,0,0)).clone();
    const lc = (lightColor ?? new THREE.Color('#ffffff')).clone();
    
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        lightDir: { value: ld },
        lightColor: { value: lc },
        strength: { value: strength ?? 0.5 },
        sunI: { value: sunI ?? 1.0 },
        cloudGamma: { value: cloudGamma ?? 1.0 },
        cloudBlack: { value: cloudBlack ?? 0.4 },
        cloudWhite: { value: cloudWhite ?? 0.85 },
        cloudContrast: { value: cloudContrast ?? 1.2 },
      },
      vertexShader: `
        varying vec2 vUv; 
        varying vec3 vNormalW;
        void main(){ 
          vUv = uv; 
          vNormalW = normalize(mat3(modelMatrix) * normal); 
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); 
        }
      `,
      fragmentShader: `
        uniform sampler2D map; 
        uniform vec3 lightDir; 
        uniform vec3 lightColor; 
        uniform float strength; 
        uniform float sunI; 
        uniform float cloudGamma; 
        uniform float cloudBlack; 
        uniform float cloudWhite; 
        uniform float cloudContrast;
        varying vec2 vUv; 
        varying vec3 vNormalW;
        
        void main(){
          vec3 n = normalize(vNormalW);
          float ndl = max(dot(n, normalize(lightDir)), 0.0);
          vec3 src = texture2D(map, vUv).rgb;
          
          // Levels: black/white points + gamma + contrast
          float d = dot(src, vec3(0.299,0.587,0.114));
          float bw = max(0.0001, cloudWhite - cloudBlack);
          d = clamp((d - cloudBlack) / bw, 0.0, 1.0);
          d = pow(d, cloudGamma);
          d = clamp((d - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
          
          // Lighting weight on day side
          float dayW = smoothstep(0.0, 0.35, ndl);
          float l = pow(dayW, 0.8) * (0.7 + 0.3*sunI);
          
          vec3 c = pow(src, vec3(cloudGamma));
          c = clamp((c - vec3(cloudBlack)) / bw, 0.0, 1.0);
          c = clamp((c - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
          
          vec3 col = mix(c, vec3(1.0), 0.35) * l * lightColor;
          float a = clamp(dayW * strength * d, 0.0, 1.0);
          
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      toneMapped: true,
      blending: THREE.NormalBlending,
    });
  }, [texture, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast]);

  // 更新着色器uniforms
  useEffect(() => {
    if (cloudMaterial) {
      try {
        const ld = (lightDir ?? new THREE.Vector3(1,0,0));
        const lc = (lightColor ?? new THREE.Color('#ffffff'));
        
        if (cloudMaterial.uniforms.lightDir?.value) {
          (cloudMaterial.uniforms.lightDir.value as THREE.Vector3).copy(ld);
        }
        if (cloudMaterial.uniforms.lightColor?.value) {
          (cloudMaterial.uniforms.lightColor.value as THREE.Color).copy(lc);
        }
        if (cloudMaterial.uniforms.strength) {
          cloudMaterial.uniforms.strength.value = strength ?? 0.5;
        }
        if (cloudMaterial.uniforms.sunI) {
          cloudMaterial.uniforms.sunI.value = sunI ?? 1.0;
        }
        if (cloudMaterial.uniforms.cloudGamma) {
          cloudMaterial.uniforms.cloudGamma.value = cloudGamma ?? 1.0;
        }
        if (cloudMaterial.uniforms.cloudBlack) {
          cloudMaterial.uniforms.cloudBlack.value = cloudBlack ?? 0.4;
        }
        if (cloudMaterial.uniforms.cloudWhite) {
          cloudMaterial.uniforms.cloudWhite.value = cloudWhite ?? 0.85;
        }
        if (cloudMaterial.uniforms.cloudContrast) {
          cloudMaterial.uniforms.cloudContrast.value = cloudContrast ?? 1.2;
        }
      } catch (error) {
        console.error('[SimpleClouds] Error updating uniforms:', error);
      }
    }
  }, [cloudMaterial, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast]);

  // 调试信息
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleClouds]', {
        radius,
        position,
        yawDeg,
        pitchDeg,
        lightDir: lightDir.toArray(),
        lightColor: lightColor.getHexString(),
        strength,
        sunI,
        hasTexture: !!texture,
        mode: 'single-render-system'
      });
    }
  }, [radius, position, yawDeg, pitchDeg, lightDir, lightColor, strength, sunI, texture]);

  if (!cloudMaterial) return null;

  return (
    <mesh 
      ref={ref} 
      position={position} 
      renderOrder={10}
    >
      <sphereGeometry args={[radius, 96, 96]} />
      <primitive object={cloudMaterial} attach="material" />
    </mesh>
  );
}

// 云层叠加修正组件 - 轻量"加亮"版
export function CloudsOverlayFix({ 
  radius, 
  strength = 0.15, 
  color = '#ffffff', 
  position, 
  lightDir = new THREE.Vector3(1,0,0) 
}: {
  radius: number;
  strength?: number;
  color?: string;
  position: [number, number, number];
  lightDir?: THREE.Vector3;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  
  const overlayMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { 
      lightDir: { value: (lightDir ?? new THREE.Vector3(1,0,0)).clone() }, 
      strength: { value: strength ?? 0.15 }, 
      color: { value: new THREE.Color(color ?? '#ffffff') } 
    },
    vertexShader: `
      varying vec3 vN; 
      void main(){ 
        vN = normalize(mat3(modelMatrix)*normal); 
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); 
      }
    `,
    fragmentShader: `
      uniform vec3 lightDir; 
      uniform float strength; 
      uniform vec3 color; 
      varying vec3 vN; 
      void main(){ 
        float ndl = max(dot(normalize(vN), normalize(lightDir)), 0.0); 
        float dayW = smoothstep(0.0, 0.35, ndl); 
        float a = dayW * strength; 
        gl_FragColor = vec4(color * a, a); 
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [lightDir, strength, color]);

  // 更新uniforms
  useEffect(() => {
    if (ref.current && overlayMaterial.uniforms.lightDir?.value) {
      (overlayMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDir ?? new THREE.Vector3(1,0,0));
      (overlayMaterial.uniforms.strength.value as number) = strength ?? 0.15;
    }
  }, [ref, overlayMaterial, lightDir, strength]);

  return (
    <mesh 
      ref={ref} 
      position={position} 
      renderOrder={11}
    >
      <sphereGeometry args={[radius * 1.0008, 64, 64]} />
      <primitive object={overlayMaterial} attach="material" />
    </mesh>
  );
}
