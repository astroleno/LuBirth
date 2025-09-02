import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTextureLoader } from '../utils/textureLoader';

// 月球组件 - 完整功能版本，移除烘焙系统
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
  lonDeg = 0
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
}) {
  // 加载月球纹理
  const { moonMap, moonDisplacementMap } = useTextureLoader({ useTextures });
  
  // 月球材质 - 使用标准材质替代烘焙
  const moonMaterial = useMemo(() => {
    if (!moonMap) {
      // 回退到默认材质
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color('#bdbdbd'),
        shininess: 4,
        specular: new THREE.Color('#1a1a1a'),
        emissive: new THREE.Color(0, 0, 0),
        emissiveIntensity: 0
      });
    }
    
    // 使用完整纹理的材质
    return new THREE.MeshStandardMaterial({
      map: moonMap,
      displacementMap: moonDisplacementMap,
      displacementScale: 0.02,
      displacementBias: 0,
      roughness: 1.0,
      metalness: 0.0,
      envMapIntensity: 0,
      lightMapIntensity: 0,
      aoMapIntensity: 0,
      emissiveIntensity: 0
    });
  }, [moonMap, moonDisplacementMap]);

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
        mode: 'single-render-system'
      });
    }
  }, [position, radius, lightDirection, useTextures, moonMap, moonDisplacementMap]);

  return (
    <mesh 
      position={position}
      rotation={[
        THREE.MathUtils.degToRad(tiltDeg),
        THREE.MathUtils.degToRad(yawDeg),
        0
      ]}
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={moonMaterial} attach="material" />
      
      {/* 月球经纬度调整 - 贴图对齐 */}
      <group
        rotation={[
          THREE.MathUtils.degToRad(latDeg),
          THREE.MathUtils.degToRad(lonDeg),
          0
        ]}
      >
        {/* 月球表面细节可以在这里添加 */}
      </group>
    </mesh>
  );
}
