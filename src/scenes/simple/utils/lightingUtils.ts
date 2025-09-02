import React from 'react';
import * as THREE from 'three';
import { kelvinToRGB } from './textureLoader';

// 光照方向计算 - 与日期时间计算耦合
export function useLightDirection(
  mode: 'debug' | 'celestial',
  sunEQD: { x: number; y: number; z: number },
  composition: any
) {
  return React.useMemo(() => {
    if (mode === 'celestial') {
      // 使用真实天文计算的光照方向
      return new THREE.Vector3(sunEQD.x, sunEQD.y, sunEQD.z).normalize();
    } else {
      // 使用手动控制的光照方向
      const azRad = (composition.lightAzimuth * Math.PI) / 180;
      const elRad = (composition.lightElevation * Math.PI) / 180;
      return new THREE.Vector3(
        Math.cos(elRad) * Math.cos(azRad),
        Math.sin(elRad),
        Math.cos(elRad) * Math.sin(azRad)
      );
    }
  }, [mode, sunEQD.x, sunEQD.y, sunEQD.z, composition.lightAzimuth, composition.lightElevation]);
}

// 光照颜色计算 (色温控制)
export function useLightColor(composition: any) {
  return React.useMemo(() => {
    const tempK = Math.min(Math.max(composition.lightTempK ?? 5200, 2000), 10000);
    return kelvinToRGB(tempK);
  }, [composition.lightTempK]);
}

// 光照强度计算
export function useLightIntensity(composition: any) {
  return React.useMemo(() => {
    return Math.min(Math.max(composition.sunIntensity ?? 1.3, 0), 5);
  }, [composition.sunIntensity]);
}

// 环境光强度计算
export function useAmbientIntensity(composition: any) {
  return React.useMemo(() => {
    return Math.min(Math.max(composition.dayAmbient ?? 0.02, 0), 0.2);
  }, [composition.dayAmbient]);
}

// 夜景强度计算
export function useNightIntensity(composition: any) {
  return React.useMemo(() => {
    return Math.min(Math.max(composition.nightIntensity ?? 3.0, 0), 10);
  }, [composition.nightIntensity]);
}

// 光照组件 - 统一的光照系统
export function createSimpleLighting(
  lightDirection: THREE.Vector3,
  lightColor: THREE.Color,
  lightIntensity: number,
  ambientIntensity: number
) {
  return {
    directionalLight: {
      position: [
        lightDirection.x * 50, 
        lightDirection.y * 50, 
        lightDirection.z * 50
      ] as [number, number, number],
      intensity: lightIntensity,
      color: lightColor,
      castShadow: true
    },
    ambientLight: {
      intensity: ambientIntensity
    }
  };
}

// 光照调试信息
export function useLightingDebug(lightDirection: THREE.Vector3, lightColor: THREE.Color, lightIntensity: number) {
  React.useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleLighting]', {
        direction: lightDirection.toArray(),
        color: lightColor.getHexString(),
        intensity: lightIntensity,
        mode: 'single-light-system'
      });
    }
  }, [lightDirection, lightColor, lightIntensity]);
}

// 光照参数验证
export function validateLightingParams(composition: any) {
  const errors: string[] = [];
  
  if (composition.sunIntensity < 0 || composition.sunIntensity > 5) {
    errors.push('sunIntensity should be between 0 and 5');
  }
  
  if (composition.lightTempK < 2000 || composition.lightTempK > 10000) {
    errors.push('lightTempK should be between 2000 and 10000');
  }
  
  if (composition.dayAmbient < 0 || composition.dayAmbient > 0.2) {
    errors.push('dayAmbient should be between 0 and 0.2');
  }
  
  if (composition.nightIntensity < 0 || composition.nightIntensity > 10) {
    errors.push('nightIntensity should be between 0 and 10');
  }
  
  return errors;
}

// 光照预设
export const LIGHTING_PRESETS = {
  daylight: {
    lightTempK: 5500,
    sunIntensity: 1.5,
    dayAmbient: 0.1,
    nightIntensity: 2.0
  },
  sunset: {
    lightTempK: 3000,
    sunIntensity: 1.0,
    dayAmbient: 0.05,
    nightIntensity: 3.0
  },
  moonlight: {
    lightTempK: 4000,
    sunIntensity: 0.3,
    dayAmbient: 0.02,
    nightIntensity: 5.0
  },
  studio: {
    lightTempK: 5200,
    sunIntensity: 1.0,
    dayAmbient: 0.15,
    nightIntensity: 1.5
  }
};

// 应用光照预设
export function applyLightingPreset(composition: any, presetName: keyof typeof LIGHTING_PRESETS) {
  const preset = LIGHTING_PRESETS[presetName];
  return {
    ...composition,
    lightTempK: preset.lightTempK,
    sunIntensity: preset.sunIntensity,
    dayAmbient: preset.dayAmbient,
    nightIntensity: preset.nightIntensity
  };
}
