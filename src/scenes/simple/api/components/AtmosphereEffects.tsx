import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 大气辉光增强组件 - A1任务：更自然与近地渐变
export function AtmosphereEffects({ 
  radius, 
  lightDirection, 
  intensity = 1.0,
  thickness = 0.05,
  color = [0.43, 0.65, 1.0],
  fresnelPower = 2.0,
  mainContrast = 0.5,
  mainSoftness = 0.5,
  nearShell = true,
  nearStrength = 1.0,
  nearThicknessFactor = 0.35,
  nearContrast = 0.6,
  nearSoftness = 0.5,
  visible = true,
  renderOrder = 5
}: {
  radius: number;
  lightDirection: THREE.Vector3;
  intensity?: number;
  thickness?: number;
  color?: [number, number, number];
  fresnelPower?: number;
  mainContrast?: number;
  mainSoftness?: number;
  nearShell?: boolean;
  nearStrength?: number;
  nearThicknessFactor?: number;
  nearContrast?: number;
  nearSoftness?: number;
  visible?: boolean;
  renderOrder?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const nearShellRef = useRef<THREE.Mesh>(null!);

  // 主大气层材质
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        uniform float thickness;
        uniform float earthRadius;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vViewDirection;
        varying float vFresnel;
        varying float vHeight;
        
        void main() {
          // 世界空间法线用于与世界空间光线计算
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDirection = normalize(-mvPosition.xyz);
          
          // Fresnel计算：视角与法线的夹角（视空间）
          vec3 viewNormal = normalize(normalMatrix * normal);
          vFresnel = pow(1.0 - max(dot(viewNormal, vViewDirection), 0.0), 2.0);
          
          // 高度计算：从地表(0)到高空(1)的渐变，使用动态厚度
          float atmosphereRadius = earthRadius * (1.0 + thickness);
          float currentRadius = length((modelMatrix * vec4(position, 1.0)).xyz);
          vHeight = (currentRadius - earthRadius) / (atmosphereRadius - earthRadius);
          vHeight = clamp(vHeight, 0.0, 1.0); // 地表=0，高空=1
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 lightDir;
        uniform float intensity;
        uniform vec3 color;
        uniform float thickness;
        uniform float fresnelPower;
        uniform float mainContrast;
        uniform float mainSoftness;
        uniform float earthRadius;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vViewDirection;
        varying float vFresnel;
        varying float vHeight;

        void main() {
          // 光照方向计算
          float ndl = max(dot(normalize(vWorldNormal), normalize(lightDir)), 0.0);
          
          // 基础大气颜色
          vec3 baseColor = color;
          
          // 昼夜对比（主层）：0=均匀，1=仅昼侧
          float day = smoothstep(0.0, 0.3, ndl);
          float dayNightFactor = mix(1.0 - mainContrast, 1.0, day);
          float baseIntensity = intensity * dayNightFactor;
          
          // 边缘效果：Fresnel边缘增强（可调）
          float edgeEffect = pow(vFresnel, 1.0 / max(0.1, fresnelPower));
          
          // 沿视线的近地高度（解析几何）：ray 到地心的最近距离 b
          float outerRadius = earthRadius * (1.0 + thickness);
          vec3 oc = cameraPosition; // 地心在(0,0,0)
          vec3 rd = normalize(vWorldPos - cameraPosition);
          float b = length(cross(oc, rd));
          // 近似光学路径长度（主层），用于更自然扩散
          float tO = sqrt(max(outerRadius*outerRadius - b*b, 0.0));
          float tI = sqrt(max(earthRadius*earthRadius - b*b, 0.0));
          float pathLen = max(tO - tI, 0.0);
          float pathMax = max(sqrt(max(outerRadius*outerRadius - earthRadius*earthRadius, 0.0)), 1e-5);
          float optical = clamp(pathLen / pathMax, 0.0, 1.0);
          float sMain = clamp(mainSoftness / 3.0, 0.0, 1.0);
          float expoMain = mix(1.2, 0.35, sMain);
          float heightEffect = pow(optical, expoMain);

          // 最终强度（基于 Fresnel 与路径长度）
          float finalIntensity = baseIntensity * edgeEffect * heightEffect;

          // 颜色：基础蓝色
          vec3 finalColor = baseColor * finalIntensity;

          // 极小屏幕噪声抖动，减少条带（在暗弱渐变区尤为明显）
          float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
          finalColor *= 1.0 + (n - 0.5) * 0.004; // 保持极小幅度

          // 透明度：保持与强度一致的权重
          float alpha = clamp(finalIntensity * 0.8, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        lightDir: { value: lightDirection },
        intensity: { value: intensity },
        color: { value: new THREE.Color(color[0], color[1], color[2]) },
        thickness: { value: thickness },
        fresnelPower: { value: fresnelPower },
        mainContrast: { value: mainContrast },
        mainSoftness: { value: mainSoftness },
        earthRadius: { value: radius }
      },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }, [lightDirection, intensity, color, thickness, fresnelPower, mainContrast, mainSoftness]);

  // 近地薄壳材质
  const nearShellMaterial = useMemo(() => {
    if (!nearShell) return null;
    
    return new THREE.ShaderMaterial({
      vertexShader: `
        uniform float thickness;
        uniform float nearFactor;
        uniform float earthRadius;
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
          
          // 高度计算：从地表(0)到高空(1)的渐变，使用动态厚度
          float atmosphereRadius = earthRadius * (1.0 + thickness * nearFactor);
          float currentRadius = length((modelMatrix * vec4(position, 1.0)).xyz);
          vHeight = (currentRadius - earthRadius) / (atmosphereRadius - earthRadius);
          vHeight = clamp(vHeight, 0.0, 1.0); // 地表=0，高空=1
          
          // Fresnel计算（视空间）
          vec3 viewNormal = normalize(normalMatrix * normal);
          vFresnel = pow(1.0 - max(dot(viewNormal, vViewDirection), 0.0), 2.0);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
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
        
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vViewDirection;
        varying float vFresnel;
        varying float vHeight;
        
        void main() {
          // 光照方向计算
          float ndl = max(dot(normalize(vWorldNormal), normalize(lightDir)), 0.0);
          
          // 昼夜对比（0=均匀，1=仅昼侧），在光照项基础上保留夜侧底亮
          float day = smoothstep(0.0, 0.3, ndl);
          float dayNightFactor = mix(1.0 - nearContrast, 1.0, day);
          
          // 近地薄壳：使用视线最近高度，集中在地表
          float outerRadius = earthRadius * (1.0 + thickness * nearFactor);
          vec3 oc = cameraPosition;
          vec3 rd = normalize(vWorldPos - cameraPosition);
          float b = length(cross(oc, rd));
          float heightT = clamp((b - earthRadius) / max(outerRadius - earthRadius, 1e-5), 0.0, 1.0);
          float s = clamp(nearSoftness / 3.0, 0.0, 1.0);
          // 使用近似光学路径长度获得更自然的扩散
          float Ro = earthRadius * (1.0 + thickness * nearFactor);
          float tO2 = sqrt(max(Ro*Ro - b*b, 0.0));
          float tI2 = sqrt(max(earthRadius*earthRadius - b*b, 0.0));
          float pathN = max(tO2 - tI2, 0.0);
          float pathMaxN = max(sqrt(max(Ro*Ro - earthRadius*earthRadius, 0.0)), 1e-5);
          float opticalN = clamp(pathN / pathMaxN, 0.0, 1.0);
          float expo = mix(1.2, 0.35, s); // s越大越柔
          float heightEffect = pow(opticalN, expo);

          // 边缘效果
          float edgeEffect = pow(vFresnel, 1.0 / max(0.1, fresnelPower));

          // 最终强度
          float finalIntensity = intensity * nearStrength * heightEffect * dayNightFactor * edgeEffect;

          // 颜色：地表增强
          vec3 finalColor = color * finalIntensity * 2.0;

          // 轻微抖动降低条带
          float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
          finalColor *= 1.0 + (n - 0.5) * 0.004;

          // 透明度
          float alpha = clamp(finalIntensity * 0.75, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        lightDir: { value: lightDirection },
        intensity: { value: intensity },
        color: { value: new THREE.Color(color[0], color[1], color[2]) },
        thickness: { value: thickness },
        nearFactor: { value: nearThicknessFactor },
        nearStrength: { value: nearStrength },
        fresnelPower: { value: fresnelPower },
        nearContrast: { value: nearContrast },
        nearSoftness: { value: nearSoftness },
        earthRadius: { value: radius }
      },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }, [lightDirection, intensity, color, thickness, nearShell, radius, nearThicknessFactor, nearStrength, fresnelPower, nearContrast, nearSoftness]);

  // 更新uniforms
  useFrame(() => {
    if (atmosphereMaterial.uniforms.lightDir) {
      atmosphereMaterial.uniforms.lightDir.value.copy(lightDirection);
    }
    if (atmosphereMaterial.uniforms.intensity) {
      atmosphereMaterial.uniforms.intensity.value = intensity;
    }
    if (atmosphereMaterial.uniforms.color) {
      atmosphereMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
    }
    if (atmosphereMaterial.uniforms.thickness) {
      atmosphereMaterial.uniforms.thickness.value = thickness;
    }
    if (atmosphereMaterial.uniforms.fresnelPower) {
      atmosphereMaterial.uniforms.fresnelPower.value = fresnelPower;
    }
    if (atmosphereMaterial.uniforms.mainContrast) {
      atmosphereMaterial.uniforms.mainContrast.value = mainContrast;
    }
    if (atmosphereMaterial.uniforms.mainSoftness) {
      atmosphereMaterial.uniforms.mainSoftness.value = mainSoftness;
    }
    if (atmosphereMaterial.uniforms.earthRadius) {
      atmosphereMaterial.uniforms.earthRadius.value = radius;
    }
    
    if (nearShellMaterial?.uniforms.lightDir) {
      nearShellMaterial.uniforms.lightDir.value.copy(lightDirection);
    }
    if (nearShellMaterial?.uniforms.intensity) {
      nearShellMaterial.uniforms.intensity.value = intensity;
    }
    if (nearShellMaterial?.uniforms.color) {
      nearShellMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
    }
    if (nearShellMaterial?.uniforms.thickness) {
      nearShellMaterial.uniforms.thickness.value = thickness;
    }
    if (nearShellMaterial?.uniforms.nearFactor) {
      nearShellMaterial.uniforms.nearFactor.value = nearThicknessFactor;
    }
    if (nearShellMaterial?.uniforms.nearStrength) {
      nearShellMaterial.uniforms.nearStrength.value = nearStrength;
    }
    if (nearShellMaterial?.uniforms.fresnelPower) {
      nearShellMaterial.uniforms.fresnelPower.value = fresnelPower;
    }
    if (nearShellMaterial?.uniforms.nearContrast) {
      nearShellMaterial.uniforms.nearContrast.value = nearContrast;
    }
    if (nearShellMaterial?.uniforms.nearSoftness) {
      nearShellMaterial.uniforms.nearSoftness.value = nearSoftness;
    }
    if (nearShellMaterial?.uniforms.earthRadius) {
      nearShellMaterial.uniforms.earthRadius.value = radius;
    }
  });

  if (!visible) return null;

  return (
    <>
      {/* 主大气层 */}
      <mesh ref={ref} renderOrder={renderOrder}>
        <sphereGeometry args={[radius * (1.0 + thickness), 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
      
      {/* 近地薄壳 */}
      {nearShell && nearShellMaterial && (
        <mesh ref={nearShellRef} renderOrder={renderOrder + 1}>
          <sphereGeometry args={[radius * (1.0 + thickness * Math.max(0.0, nearThicknessFactor)), 64, 64]} />
          <primitive object={nearShellMaterial} attach="material" />
        </mesh>
      )}
    </>
  );
}

// 大气辉光控制台命令
export function setupAtmosphereConsoleCommands(
  setComposition: (updater: (prev: any) => any) => void,
  composition: any
) {
  // 大气辉光控制台命令
  (window as any).setAtmosphereIntensity = (intensity: number) => { 
    try { 
      setComposition((prev: any) => ({ ...prev, atmoIntensity: intensity })); 
      console.log('[Atmosphere] Intensity set to', intensity); 
    } catch {} 
  };
  
  (window as any).setAtmosphereThickness = (thickness: number) => { 
    try { 
      setComposition((prev: any) => ({ ...prev, atmoThickness: thickness })); 
      console.log('[Atmosphere] Thickness set to', thickness); 
    } catch {} 
  };
  
  (window as any).setAtmosphereColor = (r: number, g: number, b: number) => { 
    try { 
      setComposition((prev: any) => ({ ...prev, atmoColor: [r, g, b] })); 
      console.log('[Atmosphere] Color set to', r, g, b); 
    } catch {} 
  };
  
  (window as any).setAtmosphereFresnelPower = (power: number) => { 
    try { 
      setComposition((prev: any) => ({ ...prev, atmoFresnelPower: power })); 
      console.log('[Atmosphere] Fresnel power set to', power); 
    } catch {} 
  };

  (window as any).setAtmosphereContrast = (c: number) => {
    try {
      setComposition((prev: any) => ({ ...prev, atmoContrast: c }));
      console.log('[Atmosphere] Main contrast =', c);
    } catch {}
  };
  
  (window as any).setAtmosphereNearShell = (enabled: boolean) => { 
    try { 
      setComposition((prev: any) => ({ ...prev, atmoNearShell: enabled })); 
      console.log('[Atmosphere] Near shell', enabled ? 'enabled' : 'disabled'); 
    } catch {} 
  };

  (window as any).setNearShellStrength = (v: number) => {
    try {
      setComposition((prev: any) => ({ ...prev, atmoNearStrength: v }));
      console.log('[Atmosphere] Near shell strength =', v);
    } catch {}
  };

  (window as any).setNearShellThicknessFactor = (f: number) => {
    try {
      setComposition((prev: any) => ({ ...prev, atmoNearThickness: f }));
      console.log('[Atmosphere] Near shell thickness factor =', f);
    } catch {}
  };

  (window as any).setNearShellContrast = (c: number) => {
    try {
      setComposition((prev: any) => ({ ...prev, atmoNearContrast: c }));
      console.log('[Atmosphere] Near shell contrast =', c);
    } catch {}
  };
  
  (window as any).getAtmosphereSettings = () => { 
    try { 
      return {
        enableAtmosphere: composition.enableAtmosphere,
        atmoIntensity: composition.atmoIntensity,
        atmoThickness: composition.atmoThickness,
        atmoColor: composition.atmoColor,
        atmoFresnelPower: composition.atmoFresnelPower,
        atmoSoftness: composition.atmoSoftness,
        atmoContrast: composition.atmoContrast,
        atmoNearShell: composition.atmoNearShell,
        atmoNearStrength: composition.atmoNearStrength,
        atmoNearThickness: composition.atmoNearThickness,
        atmoNearContrast: composition.atmoNearContrast,
        atmoNearSoftness: composition.atmoNearSoftness
      }; 
    } catch { return null; } 
  };
}
