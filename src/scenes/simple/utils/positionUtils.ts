import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// 相机控制工具 - 移除分层渲染逻辑
export function useCameraControl(composition: any) {
  const { camera } = useThree();
  
  React.useEffect(() => {
    try {
      // 相机距离计算
      const cameraDistance = composition?.cameraDistance ?? 12.0;
      
      // 设置相机位置
      camera.position.set(0, 0, cameraDistance);
      camera.lookAt(0, 0, 0);
      
      // 设置近远平面
      camera.near = 0.01;
      camera.far = Math.max(400, cameraDistance + 20);
      
      // 移除分层渲染逻辑
      // camera.layers.enable(1);
      // camera.layers.enable(2);
      
      camera.updateProjectionMatrix();
      
      // 调试信息
      if (new URLSearchParams(location.search).get('debug') === '1') {
        console.log('[SimpleCamera]', {
          position: camera.position.toArray(),
          fov: camera.fov,
          near: camera.near,
          far: camera.far,
          mode: 'single-render-system'
        });
      }
    } catch (error) {
      console.error('[SimpleCamera] Error:', error);
    }
  }, [camera, composition?.cameraDistance]);
}

// 地球位置计算
export function useEarthPosition(composition: any, cameraDistance: number = 12.0) {
  return React.useMemo(() => {
    try {
      // 地球屏幕位置计算
      const earthTopScreen = Math.min(Math.max(composition?.earthTopY ?? 0.333, 0.05), 0.95);
      const earthScreenSize = Math.min(Math.max(composition?.earthSize ?? 0.33, 0.06), 3.0);
      
      // 计算地球世界位置
      const vfov = THREE.MathUtils.degToRad(45); // 默认FOV
      const t = Math.tan(vfov / 2);
      const targetTopNdcY = earthTopScreen * 2 - 1;
      const centerNdcY = targetTopNdcY - earthScreenSize;
      const earthY = centerNdcY * cameraDistance * t;
      
      return {
        position: [0, earthY, 0] as [number, number, number],
        size: Math.max(0.05, earthScreenSize * cameraDistance * t),
        topScreen: earthTopScreen,
        screenSize: earthScreenSize
      };
    } catch (error) {
      console.error('[SimpleEarthPosition] Error:', error);
      return {
        position: [0, 0, 0] as [number, number, number],
        size: 2.0,
        topScreen: 0.333,
        screenSize: 0.33
      };
    }
  }, [composition?.earthTopY, composition?.earthSize, cameraDistance]);
}

// 月球位置计算 - 移除分层渲染逻辑
export function useMoonPosition(composition: any, camera: THREE.Camera) {
  return React.useMemo(() => {
    try {
      // 月球屏幕位置
      const moonScreen = {
        x: composition?.moonScreenX ?? 0.5,
        y: composition?.moonScreenY ?? 0.78,
        dist: composition?.moonDistance ?? 14
      };
      
      // 计算月球世界位置
      const ndc = new THREE.Vector3(moonScreen.x * 2 - 1, moonScreen.y * 2 - 1, 0.5);
      const p = ndc.unproject(camera);
      const dir = p.sub(camera.position).normalize();
      const moonPos = camera.position.clone().add(dir.multiplyScalar(moonScreen.dist));
      
      return {
        position: moonPos.toArray() as [number, number, number],
        screen: moonScreen,
        distance: moonScreen.dist
      };
    } catch (error) {
      console.error('[SimpleMoonPosition] Error:', error);
      return {
        position: [3, 1, 8] as [number, number, number],
        screen: { x: 0.5, y: 0.78, dist: 8 },
        distance: 8
      };
    }
  }, [composition?.moonScreenX, composition?.moonScreenY, composition?.moonDistance, camera]);
}

// 位置标记计算
export function useMarkerPosition(earthPosition: [number, number, number], earthSize: number) {
  return React.useMemo(() => {
    try {
      // 位置标记：地球表面上方的小点
      const markerPos = [
        earthPosition[0],
        earthPosition[1] + earthSize * 1.02,
        earthPosition[2]
      ] as [number, number, number];
      
      return markerPos;
    } catch (error) {
      console.error('[SimpleMarkerPosition] Error:', error);
      return [0, 2.04, 0] as [number, number, number];
    }
  }, [earthPosition, earthSize]);
}

// 相机曝光控制
export function useExposureControl(composition: any) {
  const { gl } = useThree();
  
  React.useEffect(() => {
    try {
      const exposure = Math.min(Math.max(composition?.exposure ?? 1.0, 0.2), 3.0);
      if (gl) {
        gl.toneMappingExposure = exposure;
      }
      
      if (new URLSearchParams(location.search).get('debug') === '1') {
        console.log('[SimpleExposure]', { exposure });
      }
    } catch (error) {
      console.error('[SimpleExposure] Error:', error);
    }
  }, [gl, composition?.exposure]);
}

// 位置验证工具
export function validatePositionParams(composition: any) {
  const errors: string[] = [];
  
  if (composition.earthSize < 0.06 || composition.earthSize > 3.0) {
    errors.push('earthSize should be between 0.06 and 3.0');
  }
  
  if (composition.moonDistance < 1 || composition.moonDistance > 50) {
    errors.push('moonDistance should be between 1 and 50');
  }
  
  if (composition.cameraDistance < 3 || composition.cameraDistance > 50) {
    errors.push('cameraDistance should be between 3 and 50');
  }
  
  return errors;
}

// 位置预设
export const POSITION_PRESETS = {
  closeUp: {
    earthSize: 3.0,
    moonDistance: 5.0,
    cameraDistance: 8.0
  },
  medium: {
    earthSize: 2.0,
    moonDistance: 8.0,
    cameraDistance: 12.0
  },
  distant: {
    earthSize: 1.0,
    moonDistance: 15.0,
    cameraDistance: 20.0
  },
  eclipse: {
    earthSize: 2.5,
    moonDistance: 4.0,
    cameraDistance: 10.0
  }
};

// 应用位置预设
export function applyPositionPreset(composition: any, presetName: keyof typeof POSITION_PRESETS) {
  const preset = POSITION_PRESETS[presetName];
  return {
    ...composition,
    earthSize: preset.earthSize,
    moonDistance: preset.moonDistance,
    cameraDistance: preset.cameraDistance
  };
}
