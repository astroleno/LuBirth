import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useTextureLoader } from '../../utils/textureLoader';
import { calculateMoonPhase } from '../../utils/moonPhaseCalculator';
import { getMoonPhase } from '../moonPhase';

// 月球组件 - 支持潮汐锁定和Uniform照明
export function Moon({ 
  position, 
  radius, 
  lightDirection, 
  useTextures,
  lightColor,
  sunIntensity,
  tiltDeg = 0,
  yawDeg = 0,
  latDeg = 0,
  lonDeg = 0,
  name = 'moonMesh',
  earthPosition,           // 地球位置，用于潮汐锁定计算
  sunDirWorldForShading,   // 真实太阳方向向量，用于Uniform照明
  enableTidalLock = false, // 是否启用潮汐锁定
  enableUniformShading = false, // 是否启用Uniform照明
  currentDate = '',          // 当前日期时间，用于月球自转计算
  observerLat,             // 观察者纬度
  observerLon,              // 观察者经度
  useCameraLockedPhase = true, // 是否使用相机锁定月相
  renderLayer = 0,          // 渲染图层，PIP 时可放到 2
  customCameraForTideLock,
  customCameraForPhase,
  // 外观增强参数
  terminatorSoftness = 0.06,
  moonTintH = 0,
  moonTintS = 0.75,
  moonTintL = 0.5,
  moonTintStrength = 0,
  moonShadingGamma = 1.0,
  moonSurgeStrength = 0.15,
  moonSurgeSigmaDeg = 18,
  moonDisplacementScale = 0.02,
  moonNormalScale = 0.2,
  normalFlipY = true,
  normalFlipX = false,
  terminatorRadius = 0.02,
  phaseCoupleStrength = 0.0
}: {
  position: [number, number, number];
  radius: number;
  lightDirection: THREE.Vector3;
  useTextures: boolean;
  lightColor: THREE.Color;
  sunIntensity: number;
  tiltDeg?: number;
  yawDeg?: number;
  latDeg?: number;
  lonDeg?: number;
  name?: string;
  earthPosition?: [number, number, number]; // 地球位置
  sunDirWorldForShading?: THREE.Vector3; // 真实太阳方向
  enableTidalLock?: boolean; // 潮汐锁定开关
  enableUniformShading?: boolean; // Uniform照明开关
  currentDate?: string; // 当前日期时间
  observerLat?: number; // 观察者纬度
  observerLon?: number; // 观察者经度
  useCameraLockedPhase?: boolean;
  renderLayer?: number;
  customCameraForTideLock?: THREE.Camera;
  customCameraForPhase?: THREE.Camera;
  terminatorSoftness?: number;
  moonTintH?: number;
  moonTintS?: number;
  moonTintL?: number;
  moonTintStrength?: number;
  moonShadingGamma?: number;
  moonSurgeStrength?: number;
  moonSurgeSigmaDeg?: number;
  moonDisplacementScale?: number;
  moonNormalScale?: number;
  normalFlipY?: boolean;
  normalFlipX?: boolean;
  terminatorRadius?: number;
  phaseCoupleStrength?: number;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const tideCam = customCameraForTideLock || camera;
  const phaseCam = customCameraForPhase || camera;
  // 加载月球纹理
  const { moonMap, moonDisplacementMap, moonNormalMap } = useTextureLoader({ useTextures });
  
  // 使用 astronomy-engine 获取相位角（优先），本地算法降级仅用于显示
  const phaseAngleRad: number | null = useMemo(() => {
    try {
      if (currentDate && observerLat !== undefined && observerLon !== undefined) {
        const info = getMoonPhase(currentDate, observerLat, observerLon);
        return info.phaseAngleRad;
      }
    } catch {}
    return null;
  }, [currentDate, observerLat, observerLon]);

  // 本地月相信息仅用于 UI 日志（不驱动渲染向量）
  const moonPhaseResult = useMemo(() => {
    try {
      if (currentDate && observerLat !== undefined && observerLon !== undefined) {
        return calculateMoonPhase(new Date(currentDate), observerLat, observerLon);
      }
    } catch {}
    return null;
  }, [currentDate, observerLat, observerLon]);

  // 基于相机与月球位置构建 R/U/F 并按相位角生成 S_world（仅方位角旋转）
  const sdirWorld: THREE.Vector3 | undefined = useMemo(() => {
    if (!meshRef.current || phaseAngleRad == null) return undefined;
    // 构建正交基
    const moonPos = new THREE.Vector3(...position);
    const cam = phaseCam as THREE.Camera;
    const F = new THREE.Vector3().subVectors(cam.position, moonPos).normalize();
    // 相机 up 去除与 F 的分量，稳健正交化
    const camUp = (cam as any).up ? (cam as any).up.clone().normalize() : new THREE.Vector3(0,1,0);
    const Uprime = camUp.sub(F.clone().multiplyScalar(camUp.dot(F)));
    let U = Uprime.lengthSq() > 1e-6 ? Uprime.normalize() : new THREE.Vector3(0,1,0);
    const R = new THREE.Vector3().crossVectors(F, U).normalize();
    U = new THREE.Vector3().crossVectors(R, F).normalize();

    // astronomy-engine 的 phase_angle 定义：0≈满月，~180≈新月。
    // 为满足“满月→S=+F；新月→S=−F”，使用：S = cos(a)·F + sin(a)·R。
    const a = phaseAngleRad; // 0≈满月, π≈新月
    // S = cos(a) F + sin(a) R（不含 U 分量，方位角旋转）
    const S = new THREE.Vector3()
      .add(F.clone().multiplyScalar(Math.cos(a)))
      .add(R.clone().multiplyScalar(Math.sin(a)))
      .normalize();
    return S;
  }, [phaseCam, position, phaseAngleRad]);
  
    
  // 从 HSL 计算色调
  const tintColor = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL((((moonTintH % 360) + 360) % 360) / 360, Math.max(0, Math.min(1, moonTintS)), Math.max(0, Math.min(1, moonTintL)));
    return c;
  }, [moonTintH, moonTintS, moonTintL]);

  // 月球材质 - 支持Uniform照明
  const moonMaterial = useMemo(() => {
    // 如果没有纹理，使用更明显的默认材质
    if (!moonMap) {
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color('#e8e8e8'), // 使用更自然的月球颜色
        shininess: 5,
        specular: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#333333'), // 添加一些自发光
        emissiveIntensity: 0.05
      });
    }
    
    if (enableUniformShading && (sdirWorld || sunDirWorldForShading)) {
      // 创建支持Uniform照明的自定义着色器材质
      const dispScale = Math.max(0, moonDisplacementScale) * 0.05; // 线性映射，响应更灵敏
      return new THREE.ShaderMaterial({
        uniforms: {
          moonMap: { value: moonMap },
          displacementMap: { value: moonDisplacementMap },
          // 选择相机锁定或真实几何月相
          sunDirWorldForShading: { value: (useCameraLockedPhase ? (sdirWorld ?? sunDirWorldForShading) : (sunDirWorldForShading ?? sdirWorld)) },
          lightColor: { value: lightColor },
          sunIntensity: { value: sunIntensity },
          displacementScale: { value: dispScale },
          displacementBias: { value: 0 },
          normalMap: { value: moonNormalMap ?? null },
          normalScale: { value: moonNormalScale },
          normalFlipY: { value: normalFlipY ? 1.0 : 0.0 },
          normalFlipX: { value: normalFlipX ? 1.0 : 0.0 },
          hasNormalMap: { value: moonNormalMap ? 1.0 : 0.0 },
          terminatorSoftness: { value: terminatorSoftness },
          terminatorRadius: { value: terminatorRadius },
          shadingGamma: { value: moonShadingGamma },
          tintColor: { value: tintColor },
          tintStrength: { value: moonTintStrength },
          phaseAngleRad: { value: phaseAngleRad ?? 0 },
          phaseCoupleStrength: { value: phaseCoupleStrength },
          surgeStrength: { value: moonSurgeStrength },
          surgeSigmaRad: { value: (moonSurgeSigmaDeg * Math.PI) / 180 }
        },
        extensions: { derivatives: true },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vViewPosition;
          uniform sampler2D displacementMap;
          uniform float displacementScale;
          uniform float displacementBias;
          uniform float phaseAngleRad;
          uniform float phaseCoupleStrength;
          uniform float displacementMid;
          
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            // 顶点位移（沿法线）
            float disp = 0.0;
            if (displacementScale != 0.0) {
              float fullness = 0.5 + 0.5 * cos(phaseAngleRad);
              float couple = 1.0 + phaseCoupleStrength * 0.5 * fullness;
              float dscale = displacementScale * couple;
              float h = texture2D(displacementMap, vUv).r - displacementMid;
              disp = h * dscale + displacementBias;
            }
            vec3 displaced = position + normal * disp;
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            vViewPosition = mvPosition.xyz;
            vPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          #ifdef GL_OES_standard_derivatives
          #extension GL_OES_standard_derivatives : enable
          #endif
          uniform sampler2D moonMap;
          uniform sampler2D displacementMap;
          uniform sampler2D normalMap;
          uniform vec3 sunDirWorldForShading;
          uniform vec3 lightColor;
          uniform float sunIntensity;
          uniform float displacementScale;
          uniform float displacementBias;
          uniform float normalScale;
          uniform float normalFlipY;
          uniform float normalFlipX;
          uniform float hasNormalMap;
          uniform float terminatorSoftness;
          uniform float terminatorRadius;
          uniform float shadingGamma;
          uniform vec3 tintColor;
          uniform float tintStrength;
          uniform float phaseAngleRad;
          uniform float phaseCoupleStrength;
          uniform float surgeStrength;
          uniform float surgeSigmaRad;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vViewPosition;

          vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
            vec3 q0 = dFdx( eye_pos );
            vec3 q1 = dFdy( eye_pos );
            vec2 st0 = dFdx( uv );
            vec2 st1 = dFdy( uv );
            vec3 S = normalize( q0 * st1.t - q1 * st0.t );
            vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
            vec3 N = normalize( surf_norm );
            vec3 mapN = texture2D( normalMap, uv ).xyz * 2.0 - 1.0;
            if (normalFlipY > 0.5) mapN.y = -mapN.y;
            if (normalFlipX > 0.5) mapN.x = -mapN.x;
            float fullness = 0.5 + 0.5 * cos(phaseAngleRad);
            float couple = 1.0 + phaseCoupleStrength * 0.5 * fullness;
            float ns = normalScale * couple;
            mapN.xy *= ns;
            mat3 tsn = mat3( S, T, N );
            return normalize( tsn * mapN );
          }
          
          void main() {
            // 基础纹理颜色
            vec3 moonColor = texture2D(moonMap, vUv).rgb;
            
            // 计算朗伯漫反射
            vec3 normal = normalize(vNormal);
            if (normalScale != 0.0 && hasNormalMap > 0.5) {
              normal = perturbNormal2Arb( vViewPosition, normal, vUv );
            }
            // 将光方向从世界变换到视图空间
            vec3 lightDir = normalize( (viewMatrix * vec4(sunDirWorldForShading, 0.0)).xyz );
            float ndl = max(dot(normal, lightDir), 0.0);
            ndl = pow(ndl, max(0.001, shadingGamma));
            
            // 晨昏线过渡（软半径叠加）
            float edge = clamp(terminatorSoftness + terminatorRadius, 0.0, 0.5);
            float terminator = smoothstep(0.0 - edge, 0.0 + edge, ndl);
            
            // 增强暗部细节，提高对比度
            float shadowEnhancement = 1.0 - terminator;
            vec3 enhancedColor = mix(moonColor * 0.3, moonColor * 1.5, terminator);
            
            // Opposition surge（满月增强）
            float a = clamp(phaseAngleRad, 0.0, 3.14159265);
            float surge = 1.0 + surgeStrength * exp(-pow(a / max(1e-4, surgeSigmaRad), 2.0));
            // 相位耦合亮度：允许小幅影响整体亮度（可选，默认 phaseCoupleStrength=0 即无影响）
            float fullness = 0.5 + 0.5 * cos(phaseAngleRad);
            float coupleL = mix(1.0, fullness, clamp(phaseCoupleStrength, 0.0, 1.0));
            vec3 litColor = enhancedColor * lightColor * sunIntensity * (ndl * 1.2 + 0.1) * surge * coupleL;
            
            // 确保暗部足够暗，亮部足够亮
            vec3 finalColor = mix(litColor, enhancedColor * 0.15, shadowEnhancement * 0.8);
            // 色调混合
            finalColor = mix(finalColor, finalColor * tintColor, clamp(tintStrength, 0.0, 1.0));
            
            // 最终调整，确保整体可见性
            finalColor = max(finalColor, moonColor * 0.08);
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      });
    }
    
    // 使用标准材质（非Uniform照明模式）
    const dispScaleStd = Math.max(0, moonDisplacementScale) * 0.05;
    return new THREE.MeshStandardMaterial({
      map: moonMap,
      displacementMap: moonDisplacementMap,
      displacementScale: dispScaleStd,
      displacementBias: 0,
      normalMap: moonNormalMap ?? undefined,
      normalScale: new THREE.Vector2(moonNormalScale, moonNormalScale),
      roughness: 0.9,
      metalness: 0.0,
      envMapIntensity: 0,
      lightMapIntensity: 0,
      aoMapIntensity: 0,
      emissive: new THREE.Color('#222222'),
      emissiveIntensity: 0.02
    });
  }, [moonMap, moonDisplacementMap, enableUniformShading, sdirWorld, sunDirWorldForShading, lightColor, sunIntensity, terminatorSoftness, moonShadingGamma, tintColor, moonTintStrength, phaseAngleRad, moonSurgeStrength, moonSurgeSigmaDeg, moonDisplacementScale, moonNormalScale]);

  // 每帧更新 Uniform 照明方向，使其随着相机基向量(F/R)重算，但相位角保持不变
  useFrame(() => {
    if (!meshRef.current || !enableUniformShading) return;
    const mat = (meshRef.current.material as any) as THREE.ShaderMaterial;
    if (!mat || !(mat instanceof THREE.ShaderMaterial) || !mat.uniforms || !mat.uniforms.sunDirWorldForShading) return;
    try {
      if (useCameraLockedPhase) {
        // 相机锁定：用相机基向量构造光向量，保持月相外观不随相机旋转而改变
        const moonPos = new THREE.Vector3(position[0], position[1], position[2]);
        const cam = phaseCam as THREE.Camera;
        const F = new THREE.Vector3().subVectors(cam.position, moonPos).normalize();
        const camUp = (cam as any).up ? (cam as any).up.clone().normalize() : new THREE.Vector3(0,1,0);
        const Uprime = camUp.sub(F.clone().multiplyScalar(camUp.dot(F)));
        let U = Uprime.lengthSq() > 1e-6 ? Uprime.normalize() : new THREE.Vector3(0, 1, 0);
        const R = new THREE.Vector3().crossVectors(F, U).normalize();
        U = new THREE.Vector3().crossVectors(R, F).normalize();
        const a = phaseAngleRad ?? 0; // 0≈满月, π≈新月
        const S = new THREE.Vector3()
          .add(F.clone().multiplyScalar(Math.cos(a)))
          .add(R.clone().multiplyScalar(Math.sin(a)))
          .normalize();
        mat.uniforms.sunDirWorldForShading.value.copy(S);
      } else if (sunDirWorldForShading) {
        // 真实几何：直接使用世界太阳方向（由上层传入），随时间/季节变化
        mat.uniforms.sunDirWorldForShading.value.copy(sunDirWorldForShading);
      }
    } catch {}
  });

  // 潮汐锁定四元数（每帧更新）：使月球 +Z 指向“潮锁相机”，并应用贴图经纬度微调
  useFrame(() => {
    if (!meshRef.current || !enableTidalLock) return;
    const moon = meshRef.current;
    // 月球与相机位置（世界系）
    const moonPos = new THREE.Vector3(position[0], position[1], position[2]);
    const camPos = new THREE.Vector3();
    tideCam.getWorldPosition(camPos);
    // 目标方向：从月球指向相机
    const targetDir = camPos.sub(moonPos).normalize();
    // 基础对齐：将局部+Z旋到 targetDir
    const qBase = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), targetDir);
    // 贴图经纬度修正：先绕Y（经度），再绕X（纬度）
    const qLon = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(lonDeg || 0));
    const qLat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(latDeg || 0));
    const qFinal = qBase.clone().multiply(qLon).multiply(qLat);
    moon.quaternion.copy(qFinal);
  });

  // 调试信息
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleMoon]', {
        position,
        radius,
        lightDirection: lightDirection.toArray(),
        useTextures,
        hasMap: !!moonMap,
        hasDisplacement: !!moonDisplacementMap,
        moonNormalScale,
        moonDisplacementScale,
        normalFlipY,
        terminatorRadius,
        phaseCoupleStrength,
        enableTidalLock,
        enableUniformShading,
        sunDirWorldForShading: (sdirWorld ?? sunDirWorldForShading)?.toArray(),
        moonPhaseResult: moonPhaseResult ? {
          phaseAngle: moonPhaseResult.phaseAngle.toFixed(1) + '°',
          illumination: moonPhaseResult.illumination.toFixed(3),
          phaseName: moonPhaseResult.phaseName,
          moonRotation: (moonPhaseResult.moonRotation * 180 / Math.PI).toFixed(1) + '°'
        } : null,
        observerLat,
        observerLon,
        currentDate,
        mode: 'enhanced-moon-system'
      });
    }
  }, [position, radius, lightDirection, useTextures, moonMap, moonDisplacementMap, 
      enableTidalLock, enableUniformShading, sdirWorld, moonPhaseResult, observerLat, observerLon, currentDate, sunDirWorldForShading]);

  // 图层设置（PIP 时可切换至 layer 2）
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.layers.set(renderLayer || 0);
    }
  }, [renderLayer]);

  // 月球自转逻辑 - 非潮汐锁定时才生效，避免日期变更导致的小角度抖动
  React.useEffect(() => {
    if (!meshRef.current) return;
    if (enableTidalLock) return; // 潮汐锁定时不做任何自转/贴图旋转，这些在前面的潮锁effect里完成
    
    // 重置旋转
    meshRef.current.rotation.set(0, 0, 0);
    
    // 如果不启用潮汐锁定，则应用基于时间的自转（用于演示月相变化）
    if (currentDate) {
      const date = new Date(currentDate);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // 月球自转：每天约13.2度（360度/27.3天）
      const dailyRotation = (dayOfYear % 27.3) * 13.2;
      // 加上当天的时间影响：每小时0.55度（13.2度/24小时）
      const hourlyRotation = hours * 0.55 + minutes * 0.0092;
      
      const moonRotationY = (dailyRotation + hourlyRotation) * Math.PI / 180;
      meshRef.current.rotateY(moonRotationY);
    }
    
    // 应用经纬度调整（贴图对齐）- 仅非潮汐锁定分支需要
    meshRef.current.rotateY(THREE.MathUtils.degToRad(lonDeg));
    meshRef.current.rotateX(THREE.MathUtils.degToRad(latDeg));
    
    // 调试信息
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[Moon Rotation]', {
        currentDate,
        enableTidalLock,
        finalRotation: {
          x: meshRef.current.rotation.x * 180 / Math.PI,
          y: meshRef.current.rotation.y * 180 / Math.PI,
          z: meshRef.current.rotation.z * 180 / Math.PI
        }
      });
    }
    
  }, [currentDate, enableTidalLock, latDeg, lonDeg]);

  return (
    <mesh 
      ref={meshRef}
      name={name}
      position={position}
      // 🔧 关键修复：移除rotation prop，避免与四元数旋转冲突
      // 月球旋转现在完全由position控制
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={moonMaterial} attach="material" />
      
      {/* 月球经纬度调整 - 贴图对齐 */}
      <group
        // 🔧 关键修复：移除rotation prop，避免与四元数旋转冲突
        // 月球贴图对齐现在通过position计算
      >
        {/* 月球表面细节可以在这里添加 */}
      </group>
    </mesh>
  );
}
