import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface MoonBakerProps {
  enabled?: boolean;
  moonRenderTargetSize?: number;
  onBaked?: (texture: THREE.Texture) => void;
  // 新增：高度贴图支持
  displacementMap?: THREE.Texture;
  displacementScale?: number;
  displacementBias?: number;
}

export function MoonBaker({
  enabled = false,
  moonRenderTargetSize = 512,
  onBaked,
  displacementMap,
  displacementScale = 0.02,
  displacementBias = 0
}: MoonBakerProps) {
  const { gl, scene, camera } = useThree();
  
  // 月球RenderTarget
  const moonRenderTarget = useMemo(() => {
    if (!enabled) return null;
    
    const renderTarget = new THREE.WebGLRenderTarget(
      moonRenderTargetSize, 
      moonRenderTargetSize,
      {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        colorSpace: THREE.SRGBColorSpace,
        depthBuffer: true,
        depthTexture: new THREE.DepthTexture(moonRenderTargetSize, moonRenderTargetSize)
      }
    );
    
    console.log('[MoonBaker] 创建月球RenderTarget:', moonRenderTargetSize, 'x', moonRenderTargetSize);
    return renderTarget;
  }, [enabled, moonRenderTargetSize]);

  // 月球对象收集
  const moonObjects = useRef<Set<THREE.Object3D>>(new Set());
  const earthObjects = useRef<Set<THREE.Object3D>>(new Set());
  const earthLights = useRef<Set<THREE.Light>>(new Set());
  const moonLights = useRef<Set<THREE.Light>>(new Set());

  // 收集月球和地球对象及光照
  useEffect(() => {
    if (!enabled) return;

    const moonObjs = new Set<THREE.Object3D>();
    const earthObjs = new Set<THREE.Object3D>();
    const earthLightsSet = new Set<THREE.Light>();
    const moonLightsSet = new Set<THREE.Light>();

    // 遍历场景中的所有对象，根据layer分类
    scene.traverse((object) => {
      try {
        if (object.layers) {
          const moonLayer = new THREE.Layers();
          moonLayer.set(2);
          const earthLayer = new THREE.Layers();
          earthLayer.set(1);
          
          if (object.layers.mask & moonLayer.mask) {
            moonObjs.add(object);
            // 收集月球层的光照
            if (object instanceof THREE.Light) {
              moonLightsSet.add(object);
            }
          } else if (object.layers.mask & earthLayer.mask) {
            earthObjs.add(object);
            // 收集地球层的光照
            if (object instanceof THREE.Light) {
              earthLightsSet.add(object);
            }
          }
        }
      } catch (error) {
        console.warn('[MoonBaker] 对象layer检查失败:', object, error);
      }
    });

    moonObjects.current = moonObjs;
    earthObjects.current = earthObjs;
    earthLights.current = earthLightsSet;
    moonLights.current = moonLightsSet;

    console.log('[MoonBaker] 对象分类完成:', {
      moonObjects: moonObjs.size,
      earthObjects: earthObjs.size,
      moonLights: moonLightsSet.size,
      earthLights: earthLightsSet.size
    });
  }, [scene, enabled]);

  // 烘焙月球
  const bakeMoon = () => {
    if (!enabled || !moonRenderTarget) return;

    try {
      console.log('[MoonBaker] 开始烘焙月球...');
      
      // 保存当前渲染状态
      const currentRenderTarget = gl.getRenderTarget();
      const currentToneMapping = gl.toneMapping;
      const currentToneMappingExposure = gl.toneMappingExposure;

      // 设置月球渲染状态
      gl.setRenderTarget(moonRenderTarget);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;

      // 保存光照状态
      const earthLightsVisible = new Map<THREE.Light, boolean>();
      const moonLightsVisible = new Map<THREE.Light, boolean>();
      
      // 隐藏地球对象和地球光，显示月球对象和月球光
      earthObjects.current.forEach(obj => {
        obj.visible = false;
      });
      earthLights.current.forEach(light => {
        earthLightsVisible.set(light, light.visible);
        light.visible = false; // 关闭地球光
      });
      
      moonObjects.current.forEach(obj => {
        obj.visible = true;
        console.log('[MoonBaker] 设置月球对象可见:', obj.name || obj.type, obj.visible);
      });
      moonLights.current.forEach(light => {
        moonLightsVisible.set(light, light.visible);
        light.visible = true; // 确保月球光开启
        console.log('[MoonBaker] 设置月球光可见:', light.name || light.type, light.visible);
      });

      // 渲染月球通道（只使用月球光）
      gl.render(scene, camera);

      // 恢复所有对象和光照的可见性
      earthObjects.current.forEach(obj => {
        obj.visible = true;
      });
      earthLights.current.forEach(light => {
        const wasVisible = earthLightsVisible.get(light);
        if (wasVisible !== undefined) {
          light.visible = wasVisible;
        }
      });
      
      moonLights.current.forEach(light => {
        const wasVisible = moonLightsVisible.get(light);
        if (wasVisible !== undefined) {
          light.visible = wasVisible;
        }
      });

      // 恢复渲染状态
      gl.setRenderTarget(currentRenderTarget);
      gl.toneMapping = currentToneMapping;
      gl.toneMappingExposure = currentToneMappingExposure;

      // 创建烘焙纹理 - 使用克隆避免反馈循环
      const bakedTexture = moonRenderTarget.texture.clone();
      bakedTexture.needsUpdate = true;
      bakedTexture.flipY = false; // 确保纹理方向正确
      bakedTexture.generateMipmaps = false; // 禁用mipmap避免错误
      
      console.log('[MoonBaker] 月球烘焙完成');
      
      // 回调烘焙结果
      if (onBaked) {
        onBaked(bakedTexture);
      }

    } catch (error) {
      console.error('[MoonBaker] 月球烘焙失败:', error);
    }
  };

  // 在启用时自动烘焙
  useEffect(() => {
    if (enabled) {
      // 延迟一帧执行烘焙，确保场景对象已准备好
      const timer = setTimeout(() => {
        bakeMoon();
      }, 16);
      
      return () => clearTimeout(timer);
    }
  }, [enabled, displacementMap, displacementScale, displacementBias]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (moonRenderTarget) {
        moonRenderTarget.dispose();
        console.log('[MoonBaker] 清理月球RenderTarget');
      }
    };
  }, [moonRenderTarget]);

  // 这个组件不渲染任何可见内容
  return null;
}
