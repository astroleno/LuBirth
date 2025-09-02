import React, { useMemo } from 'react';
import * as THREE from 'three';

interface MoonWrapperProps {
  bakedTexture: THREE.Texture | null;
  moonPosition: THREE.Vector3;
  moonRadius: number;
  enabled: boolean;
  // 调试模式：使用原始月球贴图
  debugMode?: boolean;
  originalMoonTexture?: THREE.Texture | null;
}

export function MoonWrapper({
  bakedTexture,
  moonPosition,
  moonRadius,
  enabled,
  debugMode = false,
  originalMoonTexture = null
}: MoonWrapperProps) {
  
  // 创建包裹球材质 - 完全不受光照影响
  const wrapperMaterial = useMemo(() => {
    // 调试模式下强制创建材质，正常模式下需要enabled
    if (!enabled && !debugMode) return null;
    
    // 调试模式：使用原始月球贴图或红色材质
    if (debugMode) {
      if (originalMoonTexture) {
        console.log('[MoonWrapper] 调试模式：使用原始月球贴图');
        const material = new THREE.MeshBasicMaterial({
          map: originalMoonTexture,
          transparent: false,
          color: 0xffffff,
          depthTest: true,
          depthWrite: true,
          side: THREE.FrontSide,
          wireframe: false
        });
        console.log('[MoonWrapper] 调试材质创建完成:', material);
        return material;
      } else {
        console.log('[MoonWrapper] 调试模式：使用红色材质（无原始贴图）');
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000, // 红色
          transparent: false,
          depthTest: true,
          depthWrite: true,
          side: THREE.FrontSide,
          wireframe: false
        });
        console.log('[MoonWrapper] 红色调试材质创建完成:', material);
        return material;
      }
    }
    
    // 正常模式：使用烘焙纹理
    if (!bakedTexture) {
      console.log('[MoonWrapper] 烘焙纹理为空，无法创建材质');
      return null;
    }
    
    // 验证纹理数据
    const hasData = bakedTexture.image?.data;
    const dataLength = hasData ? (bakedTexture.image.data as Uint8Array).length : 0;
    const sampleData = hasData ? Array.from((bakedTexture.image.data as Uint8Array).slice(0, 16)) : [];
    
    console.log('[MoonWrapper] 创建包裹球材质，bakedTexture:', {
      type: bakedTexture.type,
      format: bakedTexture.format,
      width: bakedTexture.image?.width || 'N/A',
      height: bakedTexture.image?.height || 'N/A',
      hasValidData: !!hasData,
      dataLength: dataLength,
      sampleData: sampleData,
      needsUpdate: bakedTexture.needsUpdate,
      colorSpace: bakedTexture.colorSpace,
      flipY: bakedTexture.flipY
    });
    
    const material = new THREE.MeshBasicMaterial({
      map: bakedTexture,
      // 简化材质设置，使用默认值
      color: 0xffffff,        // 白色，让纹理原色显示
      transparent: false,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide,
      wireframe: false
      // 移除所有其他属性，使用默认值
    });
    
    // 确保纹理更新
    if (bakedTexture.needsUpdate) {
      bakedTexture.needsUpdate = false;
    }
    
    console.log('[MoonWrapper] 包裹球材质创建完成:', material, '材质贴图:', material.map);
    return material;
  }, [enabled, debugMode, originalMoonTexture, bakedTexture]);

  // 正常启用检查
  if (!enabled) {
    console.log('[MoonWrapper] 包裹球未启用，enabled:', enabled);
    return null;
  }
  
  if (!wrapperMaterial) {
    console.log('[MoonWrapper] 包裹球材质未创建，wrapperMaterial:', wrapperMaterial);
    return null;
  }

  // 包裹球半径稍大，避免Z-fighting
  const wrapperRadius = moonRadius * 1.001;
  
  console.log('[MoonWrapper] 渲染包裹球，位置:', moonPosition, '半径:', wrapperRadius, '调试模式:', debugMode, '烘焙纹理:', !!bakedTexture);

  return (
    <>
      {/* 主包裹球 - 显示烘焙纹理 */}
      <mesh 
        position={moonPosition}
        renderOrder={1000}        // 确保最后渲染，在最前面
        ref={(mesh) => {
          if (mesh) {
            // 设置为默认层，确保被主相机渲染
            mesh.layers.set(0);
          }
        }}
      >
        {/* 使用最基础的立方体几何体，排除几何体问题 */}
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={wrapperMaterial} attach="material" />
      </mesh>
    </>
  );
}