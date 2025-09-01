import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface MoonOverlayProps {
  bakedTexture: THREE.Texture | null;
  moonPosition: THREE.Vector3;
  moonRadius: number;
  enabled: boolean;
}

export function MoonOverlay({
  bakedTexture,
  moonPosition,
  moonRadius,
  enabled
}: MoonOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // 创建圆形遮罩材质
  const overlayMaterial = useMemo(() => {
    if (!enabled) return null;
    
    console.log('[MoonOverlay] 创建圆形遮罩材质');
    
    // 创建圆形alpha贴图
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // 绘制圆形
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    
    const alphaMap = new THREE.CanvasTexture(canvas);
    alphaMap.generateMipmaps = false;
    
    // 使用MeshBasicMaterial，带圆形alpha贴图
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff0000), // 红色用于可见性
      alphaMap: alphaMap,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide
    });
    
    console.log('[MoonOverlay] 圆形遮罩材质创建完成:', material);
    
    return material;
  }, [enabled]);

  if (!enabled || !overlayMaterial) {
    console.log('[MoonOverlay] 遮罩未启用或材质未创建，enabled:', enabled, 'overlayMaterial:', overlayMaterial);
    return null;
  }

  console.log('[MoonOverlay] 渲染遮罩，位置:', moonPosition, '半径:', moonRadius);

  return (
    <mesh ref={meshRef} position={moonPosition.toArray()} renderOrder={999}>
      {/* 使用平面几何体作为遮罩，比月球稍大 */}
      <planeGeometry args={[moonRadius * 2.5, moonRadius * 2.5]} />
      <primitive object={overlayMaterial} attach="material" />
    </mesh>
  );
}
