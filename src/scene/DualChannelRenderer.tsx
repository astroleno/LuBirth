import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

/**
 * 双通道渲染管理器
 * 实现月球和地球的独立渲染通道，支持缓存和性能优化
 */
export function DualChannelRenderer({ 
  children, 
  enabled = false,
  moonRenderTargetSize = 512,
  moonCacheEnabled = true 
}: {
  children: React.ReactNode;
  enabled?: boolean;
  moonRenderTargetSize?: number;
  moonCacheEnabled?: boolean;
}) {
  const { gl, scene, camera } = useThree();
  
  // 月球RenderTarget - 只在启用状态改变时创建
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
      }
    );
    
    console.log('[DualChannelRenderer] 创建月球RenderTarget:', moonRenderTargetSize, 'x', moonRenderTargetSize);
    return renderTarget;
  }, [enabled]); // 移除moonRenderTargetSize依赖，避免频繁重建

  // 月球纹理缓存
  const moonTextureCache = useRef<THREE.Texture | null>(null);
  const lastRenderTime = useRef<number>(0);
  const cacheValid = useRef<boolean>(false);

  // 渲染状态管理
  const renderState = useRef({
    isRenderingMoon: false,
    moonObjects: new Set<THREE.Object3D>(),
    earthObjects: new Set<THREE.Object3D>(),
  });

  // 收集月球和地球对象
  useEffect(() => {
    if (!enabled) return;

    const moonObjects = new Set<THREE.Object3D>();
    const earthObjects = new Set<THREE.Object3D>();

    // 遍历场景中的所有对象，根据layer分类
    scene.traverse((object) => {
      try {
        // 检查对象是否有layers属性，并且使用正确的layers检查方式
        if (object.layers) {
          const moonLayer = new THREE.Layers();
          moonLayer.set(2);
          const earthLayer = new THREE.Layers();
          earthLayer.set(1);
          
          if (object.layers.mask & moonLayer.mask) {
            // Layer 2: 月球对象
            moonObjects.add(object);
          } else if (object.layers.mask & earthLayer.mask) {
            // Layer 1: 地球对象
            earthObjects.add(object);
          }
        }
      } catch (error) {
        console.warn('[DualChannelRenderer] 对象layer检查失败:', object, error);
      }
    });

    renderState.current.moonObjects = moonObjects;
    renderState.current.earthObjects = earthObjects;

    // console.log('[DualChannelRenderer] 对象分类完成:', {
    //   moonObjects: moonObjects.size,
    //   earthObjects: earthObjects.size
    // });
  }, [scene, enabled]);

  // 渲染月球通道
  const renderMoonChannel = () => {
    if (!enabled || !moonRenderTarget) return;

    try {
      // 保存当前渲染状态
      const currentRenderTarget = gl.getRenderTarget();
      const currentToneMapping = gl.toneMapping;
      const currentToneMappingExposure = gl.toneMappingExposure;

      // 设置月球渲染状态
      gl.setRenderTarget(moonRenderTarget);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;

      // 暂时使用简单的可见性切换，确保贴图能正常显示
      // 隐藏地球对象，显示月球对象
      renderState.current.earthObjects.forEach(obj => {
        obj.visible = false;
      });
      renderState.current.moonObjects.forEach(obj => {
        obj.visible = true;
      });

      // 渲染月球通道
      gl.render(scene, camera);

      // 恢复地球对象可见性
      renderState.current.earthObjects.forEach(obj => {
        obj.visible = true;
      });

      // 恢复渲染状态
      gl.setRenderTarget(currentRenderTarget);
      gl.toneMapping = currentToneMapping;
      gl.toneMappingExposure = currentToneMappingExposure;

      // 更新缓存
      if (moonCacheEnabled) {
        moonTextureCache.current = moonRenderTarget.texture;
        cacheValid.current = true;
        lastRenderTime.current = Date.now();
      }

      // console.log('[DualChannelRenderer] 月球通道渲染完成');
    } catch (error) {
      console.error('[DualChannelRenderer] 月球通道渲染失败:', error);
    }
  };

  // 渲染地球通道
  const renderEarthChannel = () => {
    if (!enabled) return;

    try {
      // 暂时使用简单的可见性切换
      // 隐藏月球对象，显示地球对象
      renderState.current.moonObjects.forEach(obj => {
        obj.visible = false;
      });
      renderState.current.earthObjects.forEach(obj => {
        obj.visible = true;
      });

      // 地球通道使用主渲染目标，由Canvas自动处理
      // 这里不需要手动渲染，因为Canvas会自动处理
      
      // 恢复月球对象可见性
      renderState.current.moonObjects.forEach(obj => {
        obj.visible = true;
      });
      
      // console.log('[DualChannelRenderer] 地球通道渲染完成');
    } catch (error) {
      console.error('[DualChannelRenderer] 地球通道渲染失败:', error);
    }
  };

  // 参数变化检测
  const [renderTrigger, setRenderTrigger] = React.useState(0);
  
  // 监听参数变化，触发重新渲染
  React.useEffect(() => {
    if (enabled) {
      // 只在启用状态改变时重置缓存状态，触发重新渲染
      cacheValid.current = false;
      setRenderTrigger(prev => prev + 1);
    }
  }, [enabled]); // 移除其他参数依赖，避免频繁重新渲染

  // 渲染逻辑 - 只在参数变化时执行
  React.useEffect(() => {
    if (!enabled) return;
    
    // 延迟一帧执行渲染，确保场景对象已准备好
    const timer = setTimeout(() => {
      renderMoonChannel();
    }, 16); // 约一帧的时间
    
    return () => clearTimeout(timer);
  }, [renderTrigger, enabled]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (moonRenderTarget) {
        moonRenderTarget.dispose();
        console.log('[DualChannelRenderer] 清理月球RenderTarget');
      }
    };
  }, [moonRenderTarget]);

  // 如果未启用双通道渲染，直接渲染子组件
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {/* 这里可以添加调试信息或其他UI元素 */}
    </>
  );
}

/**
 * 月球纹理显示组件（用于调试）
 */
export function MoonTextureDisplay({ 
  texture, 
  position = [0, 0, 0], 
  size = 1 
}: {
  texture: THREE.Texture | null;
  position?: [number, number, number];
  size?: number;
}) {
  if (!texture) return null;

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
