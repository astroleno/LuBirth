import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { calculateMoonPhase } from '../../utils/moonPhaseCalculator';
import { getMoonPhase } from '../moonPhase';
import { toUTCFromLocal } from '../../../../astro/ephemeris';
import { getScreenAnchoredPosition } from '../../utils/positionUtils';
import { assetUrl } from '../../../../utils/assetUrl';
import type { ParallaxOffset } from '../../../../performance/useParallaxInput';

// 🌙 计算UV旋转矩阵（实现潮汐锁定）
function calculateUVRotation(moonYawDeg: number, lonDeg: number, latDeg: number): THREE.Matrix3 {
  // 将潮汐锁定参数转换为UV旋转
  // 主要使用经度旋转，绕UV中心点(0.5, 0.5)旋转
  const rotationRad = THREE.MathUtils.degToRad(lonDeg);
  
  // 标准的2D旋转矩阵（绕中心点旋转）
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  
  // 正确的UV旋转矩阵：绕中心点(0.5, 0.5)旋转
  // 变换链：T(0.5,0.5) * R(θ) * T(-0.5,-0.5)
  const matrix = new THREE.Matrix3().set(
    cos, -sin, 0.5 * (1 - cos) + 0.5 * sin,
    sin,  cos, 0.5 * (1 - cos) - 0.5 * sin,
    0,    0,   1
  );
  
  // 调试输出
  if (new URLSearchParams(location.search).get('debug') === '1') {
    console.log('[UV Rotation Matrix Fixed]', {
      lonDeg,
      rotationRad: rotationRad * 180 / Math.PI,
      cos: cos.toFixed(3),
      sin: sin.toFixed(3),
      matrix: matrix.elements.map(x => x.toFixed(3))
    });
  }
  
  return matrix;
}

// 全局测试函数
(window as any).testMoonPhaseFormula = (angleDeg: number, R: THREE.Vector3, F: THREE.Vector3) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  const testS = new THREE.Vector3()
    .add(R.clone().multiplyScalar(-Math.sin(angleRad)))
    .add(F.clone().multiplyScalar(-Math.cos(angleRad)))
    .normalize();
  
  console.log(`测试角度 ${angleDeg}°:`, {
    angleRad: angleRad.toFixed(3),
    sin: Math.sin(angleRad).toFixed(3),
    cos: Math.cos(angleRad).toFixed(3),
    neg_sin: (-Math.sin(angleRad)).toFixed(3),
    neg_cos: (-Math.cos(angleRad)).toFixed(3),
    sunDirection: testS.toArray(),
    lightingSide: testS.x > 0.3 ? '右侧' : testS.x < -0.3 ? '左侧' : testS.z > 0.3 ? '前方' : testS.z < -0.3 ? '后方' : '其他方向'
  });
  
  return testS;
};

// 月球组件 - 支持潮汐锁定和Uniform照明
export function Moon({ 
  position, 
  radius, 
  lightDirection, 
  useTextures,
  lightColor,
  sunIntensity,
  // 月球光照强度极值控制
  moonLightMinRatio = 0.3,
  moonLightMaxRatio = 0.6,
  tiltDeg = 0,
  yawDeg = 0,
  latDeg = 0,
  lonDeg = 0,
  moonYawDeg = 0,
  name = 'moonMesh',
  // earthPosition,           // 移除地球位置参数，让月球朝向相机实现真正的潮汐锁定
  sunDirWorldForShading,   // 真实太阳方向向量，用于Uniform照明
  enableTidalLock = false, // 是否启用潮汐锁定
  enableUniformShading = false, // 是否启用Uniform照明
  currentDate = '',          // 当前日期时间，用于月球自转计算
  observerLat,             // 观察者纬度
  observerLon,              // 观察者经度
  useCameraLockedPhase = false, // 是否使用相机锁定月相
  renderLayer = 0,          // 渲染图层
  customCameraForTideLock,
  customCameraForPhase,
  // 外观增强参数
  terminatorSoftness = 0.06,
  moonTintH = 0,
  moonTintS = 0.75,
  moonTintL = 0.5,
  moonTintStrength = 0,
  moonShadingGamma = 0.6,
  moonSurgeStrength = 0.15,
  moonSurgeSigmaDeg = 18,
  moonDisplacementScale = 0.02,
  moonNormalScale = 0.2,
  normalFlipY = true,
  normalFlipX = false,
  terminatorRadius = 0.02,
  phaseCoupleStrength = 0.0,
  nightLift = 0.002,
  // 🌙 屏幕锚定参数
  enableScreenAnchor = false,
  screenX = 0.5,
  screenY = 0.75,
  anchorDistance = 14,
  // 纹理参数 - 从父组件传入
  moonMap = undefined,
  moonNormalMap = undefined,
  moonDisplacementMap = undefined,
  terrainEnabled = false,
  parallaxOffset,
}: {
  position: [number, number, number];
  radius: number;
  lightDirection: THREE.Vector3;
  useTextures: boolean;
  lightColor: THREE.Color;
  sunIntensity: number;
  // 月球光照强度极值控制
  moonLightMinRatio?: number;
  moonLightMaxRatio?: number;
  tiltDeg?: number;
  yawDeg?: number;
  latDeg?: number;
  lonDeg?: number;
  moonYawDeg?: number;
  name?: string;
  // earthPosition?: [number, number, number]; // 移除地球位置参数
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
  displacementMid?: number;      // 位移中点（通常0.5，决定正负起伏平衡）
  nightLift?: number;            // 夜面抬升（0-0.2），避免新月过亮
  // 🌙 屏幕锚定参数
  enableScreenAnchor?: boolean;  // 是否启用屏幕锚定
  screenX?: number;              // 屏幕X位置 (0-1)
  screenY?: number;              // 屏幕Y位置 (0-1)
  anchorDistance?: number;       // 锚定距离
  // 纹理参数
  moonMap?: THREE.Texture;
  moonNormalMap?: THREE.Texture;
  moonDisplacementMap?: THREE.Texture;
  terrainEnabled?: boolean;
  parallaxOffset?: React.MutableRefObject<ParallaxOffset>;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const tideCam = customCameraForTideLock || camera;
  const phaseCam = customCameraForPhase || camera;
  const lightBasis = useMemo(() => ({
    towardViewer: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(),
    moon: new THREE.Vector3(), direction: new THREE.Vector3(),
  }), []);
  const frameScratch = useMemo(() => ({
    anchor: new THREE.Vector3(), target: new THREE.Vector3(),
    forward: new THREE.Vector3(0, 0, 1), relief: new THREE.Quaternion(), euler: new THREE.Euler(),
  }), []);
  const tidalOffset = useMemo(() => {
    const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(moonYawDeg || 0));
    const lon = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(lonDeg || 0));
    const lat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(latDeg || 0));
    return yaw.multiply(lon).multiply(lat);
  }, [moonYawDeg, lonDeg, latDeg]);
  // 纹理从父组件传入，不再在这里加载
  const [terrain, setTerrain] = React.useState<{ geometry: THREE.BufferGeometry; map: THREE.Texture } | null>(null);
  const terrainReady = terrainEnabled && terrain !== null;
  const activeMoonMap = terrainReady ? terrain.map : moonMap;
  const activeDisplacementMap = terrainReady ? undefined : moonDisplacementMap;
  const activeNormalMap = terrainReady ? undefined : moonNormalMap;

  React.useEffect(() => {
    if (!terrainEnabled) return;
    let active = true;
    let resource: { geometry: THREE.BufferGeometry; map: THREE.Texture } | null = null;
    setTerrain(null);
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      if (!active) return null;
      return new GLTFLoader().loadAsync(assetUrl('models/nasa-moon-topo-128.glb'));
    }).then(gltf => {
      if (!active || !gltf) return;
      gltf.scene.updateMatrixWorld(true);
      let source: THREE.Mesh | null = null;
      gltf.scene.traverse(object => {
        if (!source && object instanceof THREE.Mesh) source = object;
      });
      if (!source) throw new Error('NASA Moon GLB contains no mesh');
      const mesh = source as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
      if (!mesh.material.map) throw new Error('NASA Moon GLB contains no color map');
      const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      geometry.computeBoundingSphere();
      const bounds = geometry.boundingSphere!;
      geometry.translate(-bounds.center.x, -bounds.center.y, -bounds.center.z);
      geometry.scale(1 / bounds.radius, 1 / bounds.radius, 1 / bounds.radius);
      resource = { geometry, map: mesh.material.map };
      setTerrain(resource);
    }).catch(error => {
      if (active) console.warn('[Moon] Terrain model unavailable; using sphere', error);
    });
    return () => {
      active = false;
      resource?.geometry.dispose();
      resource?.map.dispose();
      setTerrain(null);
    };
  }, [terrainEnabled]);
  
  const sunDirectionInfo = useMemo(() => {
    if (!currentDate || observerLat === undefined || observerLon === undefined) return null;
    const phase = getMoonPhase(currentDate, observerLat, observerLon);
    return { ...phase, moonIntensityRatio:
      moonLightMinRatio + (moonLightMaxRatio - moonLightMinRatio) * phase.illumination };
  }, [currentDate, observerLat, observerLon, moonLightMinRatio, moonLightMaxRatio]);

  const sdirWorld = sunDirectionInfo?.sunDirection;
  const moonPhaseResult = useMemo(() => {
    if (!currentDate || observerLon === undefined) return null;
    return calculateMoonPhase(toUTCFromLocal(currentDate, observerLon), observerLat ?? 0, observerLon);
  }, [currentDate, observerLat, observerLon]);

  useEffect(() => {
    if (!sunDirectionInfo) return;
    (window as any).moonPhaseDebug = {
      currentDate,
      illumination: sunDirectionInfo.illumination,
      phaseAngleDeg: THREE.MathUtils.radToDeg(sunDirectionInfo.phaseAngleRad),
      cycleAngleDeg: sunDirectionInfo.cycleAngleDeg,
      sunDirection: sunDirectionInfo.sunDirection.toArray(),
      brightSide: sunDirectionInfo.cycleAngleDeg < 180 ? 'RIGHT' : 'LEFT',
      source: 'astronomy-engine geocentric phase; screen-relative presentation',
    };
  }, [sunDirectionInfo, currentDate]);

  // 从 HSL 计算色调
  const tintColor = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL((((moonTintH % 360) + 360) % 360) / 360, Math.max(0, Math.min(1, moonTintS)), Math.max(0, Math.min(1, moonTintL)));
    return c;
  }, [moonTintH, moonTintS, moonTintL]);

  // 月球材质 - 支持Uniform照明
  const moonMaterial = useMemo(() => {
    // 如果没有纹理，使用更明显的默认材质
    if (!activeMoonMap) {
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
      const dispScale = terrainReady ? 0 : Math.max(0, moonDisplacementScale) * 0.05;
      
      // 🔍 调试：确认使用自定义Shader
      if (new URLSearchParams(location.search).get('debug') === '1') {
        console.log('[Moon Material] Using custom ShaderMaterial with UV rotation');
      }
      
      return new THREE.ShaderMaterial({
        uniforms: {
          moonMap: { value: activeMoonMap },
          displacementMap: { value: activeDisplacementMap },
          // 🌙 新增：UV旋转角度（简化传递）
          uvRotationAngle: { value: THREE.MathUtils.degToRad(lonDeg || 0) },
          // 选择相机锁定或真实几何月相
          sunDirView: { value: new THREE.Vector3(0, 0, 1) },
          lightColor: { value: lightColor },
          sunIntensity: { value: sunIntensity },
          moonIntensityRatio: { value: 1.0 }, // 将在useEffect中动态更新
          nightLift: { value: nightLift },
          displacementScale: { value: dispScale },
          displacementBias: { value: 0 },
          normalMap: { value: activeNormalMap ?? null },
          normalScale: { value: moonNormalScale },
          normalFlipY: { value: normalFlipY ? 1.0 : 0.0 },
          normalFlipX: { value: normalFlipX ? 1.0 : 0.0 },
          hasNormalMap: { value: activeNormalMap ? 1.0 : 0.0 },
          terminatorSoftness: { value: terminatorSoftness },
          terminatorRadius: { value: terminatorRadius },
          shadingGamma: { value: moonShadingGamma },
          tintColor: { value: tintColor },
          tintStrength: { value: moonTintStrength },
            phaseAngleRad: { value: sunDirectionInfo?.phaseAngleRad ?? 0 },
          phaseCoupleStrength: { value: phaseCoupleStrength },
          surgeStrength: { value: moonSurgeStrength },
          surgeSigmaRad: { value: (moonSurgeSigmaDeg * Math.PI) / 180 }
        },
        extensions: { clipCullDistance: true, multiDraw: false },
        vertexShader: `
          varying vec2 vUv;
          varying vec2 vUvRotated;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vViewPosition;
          uniform sampler2D displacementMap;
          uniform float displacementScale;
          uniform float displacementBias;
          uniform float phaseAngleRad;
          uniform float phaseCoupleStrength;
          uniform float displacementMid;
          uniform float uvRotationAngle;
          
          void main() {
            vUv = uv;
            
            // 🌙 放弃UV旋转，直接使用原始UV（无拉伸）
            vUvRotated = uv;
            vNormal = normalize(normalMatrix * normal);
            // 顶点位移（沿法线）
            float disp = 0.0;
            if (displacementScale != 0.0) {
              float fullness = 0.5 + 0.5 * cos(phaseAngleRad);
              float couple = 1.0 + phaseCoupleStrength * 0.5 * fullness;
              float dscale = displacementScale * couple;
              float h = texture2D(displacementMap, vUvRotated).r - displacementMid;
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

          uniform vec3 sunDirView;
          uniform vec3 lightColor;
          uniform float sunIntensity;
          uniform float moonIntensityRatio;
          uniform float nightLift;
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
          varying vec2 vUvRotated;
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
            // 🌙 基础纹理颜色（使用旋转后的UV实现潮汐锁定）
            vec3 moonColor = texture2D(moonMap, vUvRotated).rgb;
            // Neutral lunar albedo; retain a little of the NASA map's subtle color variation.
            float albedo = dot(moonColor, vec3(0.2126, 0.7152, 0.0722));
            moonColor = mix(vec3(albedo), moonColor, 0.15);
            
            // Regolith: a bounded Lunar-Lambert approximation, retaining crater normals.
            vec3 normal = normalize(vNormal);
            if (normalScale != 0.0 && hasNormalMap > 0.5) {
              normal = perturbNormal2Arb( vViewPosition, normal, vUvRotated );
            }
            // Both vectors are in the actual render camera's view space.
            vec3 lightDir = normalize(sunDirView);
            float signedNdl = dot(normalize(vNormal), lightDir);
            float edge = clamp(terminatorSoftness + terminatorRadius, 0.001, 0.03);
            float terminator = smoothstep(-edge, edge, signedNdl);
            float incidence = max(dot(normal, lightDir), 0.0);
            float emission = max(dot(normal, normalize(-vViewPosition)), 0.0);
            // Lommel-Seeliger single scattering reduces the artificial dark rim at full moon.
            // The geometric terminator above still owns which hemisphere is sunlit.
            float singleScatter = 2.0 * incidence / max(incidence + emission, 0.001);
            float reflectance = mix(incidence, singleScatter, 0.55);
            float diffuse = pow(max(reflectance, 0.0), max(0.001, shadingGamma));
            float a = clamp(phaseAngleRad, 0.0, 3.14159265);
            float surge = 1.0 + surgeStrength * exp(-pow(a / max(1e-4, surgeSigmaRad), 2.0));
            float fullness = 0.5 + 0.5 * cos(phaseAngleRad);
            float coupleL = mix(1.0, fullness, clamp(phaseCoupleStrength, 0.0, 1.0));
            vec3 finalColor = moonColor * lightColor * sunIntensity * moonIntensityRatio
              * diffuse * terminator * surge * coupleL;
            finalColor += moonColor * nightLift * (1.0 - terminator);
            finalColor = mix(finalColor, finalColor * tintColor, clamp(tintStrength, 0.0, 1.0));

            gl_FragColor = vec4(finalColor, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `
      });
    }
    
    // 使用标准材质（非Uniform照明模式）
    const dispScaleStd = terrainReady ? 0 : Math.max(0, moonDisplacementScale) * 0.05;
    return new THREE.MeshStandardMaterial({
      map: activeMoonMap,
      displacementMap: activeDisplacementMap,
      displacementScale: dispScaleStd,
      displacementBias: 0,
      normalMap: activeNormalMap ?? undefined,
      normalScale: new THREE.Vector2(moonNormalScale, moonNormalScale),
      roughness: 0.9,
      metalness: 0.0,
      envMapIntensity: 0,
      lightMapIntensity: 0,
      aoMapIntensity: 0,
      emissive: new THREE.Color('#222222'),
      emissiveIntensity: 0.02,
      // 🌙 深度控制：屏幕锚定时禁用深度测试，确保月球始终在前景
      depthTest: enableScreenAnchor ? false : true,
      depthWrite: enableScreenAnchor ? false : true
    });
  }, [activeMoonMap, activeDisplacementMap, activeNormalMap, terrainReady, enableUniformShading, sdirWorld, sunDirWorldForShading, lightColor, sunIntensity, terminatorSoftness, moonShadingGamma, tintColor, moonTintStrength, sunDirectionInfo, moonSurgeStrength, moonSurgeSigmaDeg, moonDisplacementScale, moonNormalScale, enableScreenAnchor, lonDeg, nightLift, useCameraLockedPhase, terminatorRadius, phaseCoupleStrength]);

  React.useEffect(() => () => moonMaterial.dispose(), [moonMaterial]);

  // 🌙 每帧更新屏幕锚定位置
  useFrame(() => {
    if (!meshRef.current) return;
    
    // 屏幕锚定逻辑
    if (enableScreenAnchor) {
      try {
        const offset = parallaxOffset?.current;
        const newPosition = getScreenAnchoredPosition(
          screenX + (offset?.x ?? 0) * 0.004,
          screenY - (offset?.y ?? 0) * 0.003,
          anchorDistance,
          camera,
          frameScratch.anchor,
        );
        meshRef.current.position.copy(newPosition);
        
        // 🌙 方案B：几何旋转潮汐锁定（放弃UV旋转）
        if (enableTidalLock) {
          // 先面向相机
          meshRef.current.lookAt(camera.position);
          
          // 再应用潮汐锁定偏移
          meshRef.current.quaternion.multiply(tidalOffset);
          if (terrainReady && offset) {
            frameScratch.euler.set(offset.y * 0.035, -offset.x * 0.045, 0);
            frameScratch.relief.setFromEuler(frameScratch.euler);
            meshRef.current.quaternion.multiply(frameScratch.relief);
          }
          
          // 调试信息已移除，避免控制台刷屏
        }
      } catch (error) {
        console.error('[MoonScreenAnchor] Update failed:', error);
      }
    } else if (enableTidalLock) {
      // 🌙 传统模式潮汐锁定（合并到主useFrame中，避免执行顺序冲突）
      try {
        const moon = meshRef.current;
        tideCam.getWorldPosition(frameScratch.target);
        frameScratch.anchor.set(...position);
        frameScratch.target.sub(frameScratch.anchor).normalize();
        moon.quaternion.setFromUnitVectors(frameScratch.forward, frameScratch.target).multiply(tidalOffset);
      } catch (error) {
        console.error('[Traditional Tidal Lock] Update failed:', error);
      }
    }
    
    if (enableUniformShading && meshRef.current.material instanceof THREE.ShaderMaterial) {
      const mat = meshRef.current.material;
      if (mat.uniforms.sunDirView) {
        camera.updateMatrixWorld();
        if (useCameraLockedPhase && sunDirectionInfo) {
          // Align the phase with the Moon-to-camera line, including off-centre screen anchors.
          phaseCam.updateMatrixWorld();
          meshRef.current.getWorldPosition(lightBasis.moon);
          phaseCam.getWorldPosition(lightBasis.towardViewer);
          lightBasis.towardViewer.sub(lightBasis.moon).normalize();
          lightBasis.right.setFromMatrixColumn(phaseCam.matrixWorld, 0);
          lightBasis.right.addScaledVector(lightBasis.towardViewer,
            -lightBasis.right.dot(lightBasis.towardViewer)).normalize();
          lightBasis.up.crossVectors(lightBasis.towardViewer, lightBasis.right);
          const phase = sunDirectionInfo.sunDirection;
          lightBasis.direction.copy(lightBasis.right).multiplyScalar(phase.x)
            .addScaledVector(lightBasis.up, phase.y)
            .addScaledVector(lightBasis.towardViewer, phase.z);
        } else {
          lightBasis.direction.copy(sunDirWorldForShading ?? lightDirection);
        }
        mat.uniforms.sunDirView.value.copy(lightBasis.direction).transformDirection(camera.matrixWorldInverse);
      }
    }
  });

  // 🌙 屏幕尺寸恒定缩放：仅在必要事件变化时更新
  React.useEffect(() => {
    try {
      if (!meshRef.current) return;
      if (!enableScreenAnchor) return; // 仅屏幕锚定模式需要锁尺寸
      const cam = camera as THREE.PerspectiveCamera;
      if (!('fov' in cam)) return;
      const fovY = THREE.MathUtils.degToRad((cam as THREE.PerspectiveCamera).fov || 45);
      const d = anchorDistance;
      // 目标屏幕高度占比（0-1），若未指定则回退为以半径为准
      const s = (typeof (window as any)?.__LuBirthMoonScreenSize === 'number') ? (window as any).__LuBirthMoonScreenSize : undefined;
      const screenSize = s ?? 0; // 若未提供参数则不改缩放
      if (screenSize > 0) {
        const targetRadius = d * Math.tan((screenSize * fovY) / 2);
        const baseRadius = terrainReady ? 1 : radius;
        const scale = Math.max(0.01, targetRadius / Math.max(1e-6, baseRadius));
        meshRef.current.scale.setScalar(scale);
      }
    } catch (e) {
      console.error('[Moon] screen-size lock failed:', e);
    }
    // 依赖：FOV、画布尺寸、锚定距离、半径、以及用户参数
  }, [camera, (camera as any)?.fov, (camera as any)?.aspect, anchorDistance, radius, enableScreenAnchor, terrainReady]);

  // 🌙 屏幕锚定模式的旋转现在在 useFrame 中处理，无需单独的 useEffect

  // 🌙 传统模式潮汐锁定现在已合并到主 useFrame 中，避免执行顺序冲突

  // 详细调试信息
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleMoon Debug]', {
        // 基础参数
        position,
        radius,
        lightDirection: lightDirection.toArray(),
        useTextures,
        hasMap: !!moonMap,
        hasDisplacement: !!moonDisplacementMap,
        
        // 月相相关
          chi: sunDirectionInfo ? '已计算' : null,
        observerLat,
        observerLon,
        currentDate,
        
        // 正交基和太阳方向
        sdirWorld: sdirWorld?.toArray(),
        sunDirWorldForShading: sunDirWorldForShading?.toArray(),
        finalSunDir: (sdirWorld ?? sunDirWorldForShading)?.toArray(),
        
        // 渲染设置
        enableTidalLock,
        enableUniformShading,
        useCameraLockedPhase,
        
        // 材质参数
        moonNormalScale,
        moonDisplacementScale,
        normalFlipY,
        terminatorRadius,
        phaseCoupleStrength,
        
        // 本地计算的月相（仅对比）
        moonPhaseResult: moonPhaseResult ? {
          phaseAngle: moonPhaseResult.phaseAngle.toFixed(1) + '°',
          illumination: moonPhaseResult.illumination.toFixed(3),
          phaseName: moonPhaseResult.phaseName,
          moonRotation: (moonPhaseResult.moonRotation * 180 / Math.PI).toFixed(1) + '°'
        } : null,
        
        mode: 'enhanced-moon-system'
      });
      
      // 额外调试：分析光照方向
      if (sdirWorld ?? sunDirWorldForShading) {
        const sunDir = sdirWorld ?? sunDirWorldForShading;
        if (sunDir) {
          // 计算准确的位置角和光照侧
          const F = new THREE.Vector3(0, 0, -1);
          const U = new THREE.Vector3(0, 1, 0);
          const R = new THREE.Vector3().crossVectors(U, F);
          
          const sR = sunDir.dot(R);
          const sF = sunDir.dot(F.clone().multiplyScalar(-1));
          const chi = Math.atan2(sR, sF) * 180 / Math.PI;
          
          let accurateSide: string;
          if (Math.abs(chi) < 45) accurateSide = '前方（朔月）';
          else if (chi >= 45 && chi < 135) accurateSide = '右侧（上弦）';  // X轴翻转后，正角度对应右侧
          else if (Math.abs(chi) >= 135) accurateSide = '后方（满月）';
          else accurateSide = '左侧（下弦）';  // X轴翻转后，负角度对应左侧
          
          console.log('[SimpleMoon Lighting Analysis]', {
            sunDirection: sunDir.toArray(),
            x: sunDir.x.toFixed(3),
            y: sunDir.y.toFixed(3),
            z: sunDir.z.toFixed(3),
            positionAngleChi: chi.toFixed(1) + '°',
            lightingSideAccurate: accurateSide,
            legacyLightingSide: sunDir.x > 0.3 ? '右侧' : sunDir.x < -0.3 ? '左侧' : sunDir.z > 0.3 ? '前方' : sunDir.z < -0.3 ? '后方' : '其他方向',
            expectedLighting: '基于真实太阳方向和位置角计算'
          });
        }
      }
    }
  }, [position, radius, lightDirection, useTextures, moonMap, moonDisplacementMap, 
       enableTidalLock, enableUniformShading, sdirWorld, moonPhaseResult, observerLat, observerLon, currentDate, sunDirWorldForShading, sunDirectionInfo]);
  
  // 辅助函数：根据相位角判断期望的光照方向
  function getExpectedLightingSide(angleRad: number): string {
    const angle = angleRad * 180 / Math.PI;
    if (angle < 45) return '前方';
    else if (angle < 135) return '右侧';
    else if (angle < 225) return '后方';
    else if (angle < 315) return '左侧';
    else return '前方';
  }

  // 图层设置
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.layers.set(renderLayer || 0);
    }
  }, [renderLayer]);

  // 更新月球光照强度比例
  React.useEffect(() => {
    if (moonMaterial && 'uniforms' in moonMaterial && sunDirectionInfo?.moonIntensityRatio !== undefined) {
      (moonMaterial as THREE.ShaderMaterial).uniforms.moonIntensityRatio.value = sunDirectionInfo.moonIntensityRatio;
    }
  }, [moonMaterial, sunDirectionInfo?.moonIntensityRatio]);

  // 月球自转逻辑 - 非潮汐锁定时才生效，避免日期变更导致的小角度抖动
  React.useEffect(() => {
    if (!meshRef.current) return;
    if (enableTidalLock) return; // 潮汐锁定时不做任何自转/贴图旋转，这些在前面的潮锁effect里完成
    if (enableScreenAnchor) return; // 🌙 屏幕锚定模式下完全跳过旋转逻辑
    
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
    
    // 调试信息已移除，避免控制台刷屏
    
  }, [currentDate, enableTidalLock, latDeg, lonDeg]);

  return (
    <mesh 
      ref={meshRef}
      name={name}
      position={position}
      scale={terrainReady ? radius : 1}
      // 🌙 渲染层级控制：确保月球始终在前景显示
      renderOrder={999}
      // 🔧 关键修复：移除rotation prop，避免与四元数旋转冲突
      // 月球旋转现在完全由position控制
    >
      {terrainReady ? <primitive object={terrain.geometry} attach="geometry" /> : <sphereGeometry args={[radius, 64, 64]} />}
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
