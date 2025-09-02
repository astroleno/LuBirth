import React, { useRef, useMemo, useEffect, useCallback } from 'react';
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
  // 新增：月球光照参数
  moonAzDeg?: number;
  moonElDeg?: number;
  moonSeparateLight?: boolean;
  sunIntensityMoon?: number;
  lightTempK?: number;
}

export function MoonBaker({
  enabled = false,
  moonRenderTargetSize = 512,
  onBaked,
  displacementMap,
  displacementScale = 0.02,
  displacementBias = 0,
  // 新增月球光照参数
  moonAzDeg = 180,
  moonElDeg = 0,
  moonSeparateLight = true,
  sunIntensityMoon = 1.2,
  lightTempK = 5200
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
  const bakeMoon = useCallback(() => {
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

      // 保存原始状态
      const originalBackground = scene.background;
      const originalAutoClear = gl.autoClear;
      
      // 创建可见性恢复映射
      const visibilityMap = new Map<THREE.Object3D, boolean>();
      
      // 第一步：保存所有对象的当前可见性，然后隐藏所有对象
      scene.traverse(obj => {
        visibilityMap.set(obj, obj.visible);
        obj.visible = false;
      });
      
      // 第二步：只显示月球对象和月球光
      moonObjects.current.forEach(obj => {
        obj.visible = true;
        console.log('[MoonBaker] 设置月球对象可见:', obj.name || obj.type, obj.visible, '位置:', obj.position, '缩放:', obj.scale);
      });
      moonLights.current.forEach(light => {
        light.visible = true;
        console.log('[MoonBaker] 设置月球光可见:', light.name || light.type, light.visible, '强度:', light.intensity, '位置:', light.position);
      });
      
      // 调试：检查场景状态
      console.log('[MoonBaker] 烘焙前场景状态:', {
        sceneChildren: scene.children.length,
        moonObjectsCount: moonObjects.current.size,
        moonLightsCount: moonLights.current.size,
        sceneBackground: scene.background,
        cameraPosition: camera.position.toArray(),
        cameraType: camera.type
      });
      
      // 调试：检查月球光是否正确照射月球
      moonLights.current.forEach(light => {
        if (light instanceof THREE.DirectionalLight) {
          // 修复：DirectionalLight的光照方向应该从光源位置指向目标位置
          const lightDirection = new THREE.Vector3().subVectors(light.target.position, light.position).normalize();
          moonObjects.current.forEach(obj => {
            if (obj instanceof THREE.Mesh) {
              const toMoon = obj.position.clone().sub(light.position).normalize();
              const dotProduct = lightDirection.dot(toMoon);
              console.log('[MoonBaker] 月球光照射检查:', {
                lightPosition: light.position.toArray(),
                moonPosition: obj.position.toArray(),
                lightDirection: lightDirection.toArray(),
                toMoonDirection: toMoon.toArray(),
                dotProduct: dotProduct,
                isIlluminated: dotProduct > 0.1,
                lightTarget: light.target.position.toArray()
              });
            }
          });
        }
      });
      
      // 第三步：设置烘焙环境
      gl.autoClear = true;
      scene.background = null; // 透明背景
      
      // 第四步：渲染主场景（只显示月球相关对象）
      gl.render(scene, camera);
      
      // 调试：检查渲染后的状态
      console.log('[MoonBaker] 渲染完成，检查RenderTarget状态:', {
        renderTargetWidth: moonRenderTarget.width,
        renderTargetHeight: moonRenderTarget.height,
        renderTargetTexture: !!moonRenderTarget.texture,
        renderTargetDepthTexture: !!moonRenderTarget.depthTexture
      });
      
      // 第五步：恢复所有对象的原始可见性
      scene.traverse(obj => {
        const wasVisible = visibilityMap.get(obj);
        if (wasVisible !== undefined) {
          obj.visible = wasVisible;
        }
      });
      
      // 第六步：恢复场景状态
      scene.background = originalBackground;
      gl.autoClear = originalAutoClear;

      // 恢复渲染状态
      gl.setRenderTarget(currentRenderTarget);
      gl.toneMapping = currentToneMapping;
      gl.toneMappingExposure = currentToneMappingExposure;

      // 创建烘焙纹理 - 转换为DataTexture避免循环
      try {
        // 从RenderTarget获取图像数据
        const renderTargetTexture = moonRenderTarget.texture;
        
        // 读取RenderTarget的像素数据
        const width = moonRenderTarget.width;
        const height = moonRenderTarget.height;
        const pixels = new Uint8Array(width * height * 4); // RGBA
        
        // 读取像素数据
        gl.readRenderTargetPixels(moonRenderTarget, 0, 0, width, height, pixels);
        
        // 验证像素数据是否有效
        let nonZeroCount = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] > 0 || pixels[i + 1] > 0 || pixels[i + 2] > 0) {
            nonZeroCount++;
          }
        }
        
        console.log('[MoonBaker] 像素数据读取成功:', {
          width,
          height,
          pixelsLength: pixels.length,
          nonZeroPixels: nonZeroCount,
          totalPixels: width * height,
          samplePixels: pixels.slice(0, 16) // 前4个像素的RGBA值
        });
        
        // 手动翻转Y轴 - WebGL readPixels 是bottom-up的，但Three.js纹理是top-down的
        const flippedPixels = new Uint8Array(pixels.length);
        for (let y = 0; y < height; y++) {
          const srcRow = (height - 1 - y) * width * 4;
          const dstRow = y * width * 4;
          for (let x = 0; x < width * 4; x++) {
            flippedPixels[dstRow + x] = pixels[srcRow + x];
          }
        }
        
        // 创建DataTexture
        const dataTexture = new THREE.DataTexture(
          flippedPixels,  // 使用翻转后的像素数据
          width,
          height,
          THREE.RGBAFormat,
          THREE.UnsignedByteType
        );
        
        // 设置DataTexture属性 - 关键修复
        dataTexture.needsUpdate = true;
        dataTexture.flipY = false; // 已经手动翻转了
        dataTexture.generateMipmaps = false;
        dataTexture.minFilter = THREE.LinearFilter;
        dataTexture.magFilter = THREE.LinearFilter;
        dataTexture.wrapS = THREE.ClampToEdgeWrapping;
        dataTexture.wrapT = THREE.ClampToEdgeWrapping;
        dataTexture.colorSpace = THREE.SRGBColorSpace; // 确保颜色空间正确
        
        console.log('[MoonBaker] DataTexture创建成功:', {
          width: dataTexture.image.width,
          height: dataTexture.image.height,
          format: dataTexture.format,
          type: dataTexture.type,
          hasValidData: !!dataTexture.image.data
        });
        
        // 回调烘焙结果
        if (onBaked) {
          onBaked(dataTexture);
        }
        
      } catch (error) {
        console.error('[MoonBaker] 烘焙纹理创建失败:', error);
        
        // 创建备用纹理
        const fallbackTexture = new THREE.DataTexture(
          new Uint8Array([255, 255, 255, 255]), // 白色像素
          1, 1, // 1x1 纹理
          THREE.RGBAFormat,
          THREE.UnsignedByteType
        );
        fallbackTexture.needsUpdate = true;
        
        if (onBaked) {
          onBaked(fallbackTexture);
        }
      }
      
      console.log('[MoonBaker] 月球烘焙完成');

    } catch (error) {
      console.error('[MoonBaker] 月球烘焙失败:', error);
    }
  }, [
    enabled,
    moonRenderTarget,
    gl,
    scene,
    camera,
    moonObjects,
    moonLights,
    onBaked,
    // 月球光照参数作为依赖项
    moonAzDeg,
    moonElDeg,
    moonSeparateLight,
    sunIntensityMoon,
    lightTempK
  ]);

  // 在启用时自动烘焙，并在月球光照参数变化时重新烘焙
  useEffect(() => {
    if (enabled) {
      // 延迟一帧执行烘焙，确保场景对象已准备好
      const timer = setTimeout(() => {
        bakeMoon();
      }, 16);
      
      return () => clearTimeout(timer);
    }
  }, [
    enabled, 
    bakeMoon // 现在 bakeMoon 是稳定的函数引用
  ]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (moonRenderTarget) {
        // 不要立即清理RenderTarget，让纹理保持有效
        // moonRenderTarget.dispose(); // 注释掉，避免纹理丢失
        console.log('[MoonBaker] 保持月球RenderTarget有效，纹理已创建');
      }
    };
  }, [moonRenderTarget]);

  // 这个组件不渲染任何可见内容
  return null;
}
