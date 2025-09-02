// 简化的构图参数类型
export interface SimpleComposition {
  // 地球参数
  earthSize: number;           // 地球大小
  earthTiltDeg: number;        // 地球倾角
  earthYawDeg: number;         // 地球自转角
  earthTopY: number;           // 地球上沿位置 (0-1)
  
  // 月球参数
  moonDistance: number;        // 月球距离
  moonRadius: number;          // 月球半径
  moonLatDeg: number;          // 月球纬度调整
  moonLonDeg: number;          // 月球经度调整
  
  // 光照参数
  sunIntensity: number;        // 阳光强度
  lightAzimuth: number;        // 光照方位角
  lightElevation: number;      // 光照仰角
  lightTempK: number;          // 光照色温
  
  // 视觉效果参数
  specStrength: number;        // 镜面高光强度
  shininess: number;           // 镜面高光锐度
  broadStrength: number;       // 高光铺展强度
  terminatorSoftness: number;  // 晨昏线柔和度
  nightIntensity: number;      // 夜景强度
  
  // 大气效果参数
  rimStrength: number;         // 大气弧光强度
  rimWidth: number;            // 大气弧光宽度
  rimRadius: number;           // 弧光贴合半径差 (0.001-0.01)
  haloWidth: number;           // 近表面halo宽度
  earthGlowStrength: number;   // 地球辉光强度
  earthGlowHeight: number;     // 地球辉光高度
  
  // 地球材质控制
  earthLightIntensity: number; // 地球材质亮度
  earthLightTempK: number;     // 地球材质色温
  
  // 月球材质控制
  moonLightIntensity: number;  // 月球材质亮度
  moonLightTempK: number;      // 月球材质色温
  
  // 云层参数
  cloudStrength: number;       // 云层强度
  cloudHeight: number;         // 云层高度
  cloudYawDeg: number;         // 云层经度旋转
  cloudPitchDeg: number;       // 云层纬度旋转
  cloudGamma: number;          // 云层Gamma值
  cloudBlack: number;          // 云层黑场
  cloudWhite: number;          // 云层白场
  cloudContrast: number;       // 云层对比度
  
  // 控制参数
  exposure: number;            // 曝光
  cameraDistance: number;      // 相机距离
  
  // 显示选项
  useTextures: boolean;        // 使用贴图
  useClouds: boolean;          // 显示云层
  showStars: boolean;          // 显示星空
  useMilkyWay: boolean;        // 使用银河星空
  enableControls: boolean;     // 启用相机控制
}

// 默认值
export const DEFAULT_SIMPLE_COMPOSITION: SimpleComposition = {
  // 地球参数
  earthSize: 0.33,             // 占屏33%
  earthTiltDeg: 23.44,         // 地球实际倾角
  earthYawDeg: 0,              // 自转角
  earthTopY: 0.333,            // 地球下1/3位置
  
  // 月球参数
  moonDistance: 14,            // 月球距离
  moonRadius: 0.44,            // 月球半径
  moonLatDeg: 0,               // 月球纬度调整
  moonLonDeg: 0,               // 月球经度调整
  
  // 光照参数
  sunIntensity: 1.2,           // 阳光强度
  lightAzimuth: 180,           // 光照方位角
  lightElevation: 0,           // 光照仰角
  lightTempK: 5600,            // 标准日光色温
  
  // 视觉效果参数
  specStrength: 0.8,           // 镜面高光强度
  shininess: 80,               // 镜面高光锐度
  broadStrength: 0.4,          // 高光铺展强度
  terminatorSoftness: 0.06,    // 晨昏线柔和度
  nightIntensity: 3.0,         // 夜景强度
  
  // 大气效果参数
  rimStrength: 0.15,           // 大气弧光强度
  rimWidth: 0.08,              // 大气弧光宽度
  rimRadius: 0.005,            // 弧光贴合半径差 (0.001-0.01)
  haloWidth: 0.01,             // 近表面halo宽度
  earthGlowStrength: 0.8,      // 地球辉光强度 (调整到更明显的值)
  earthGlowHeight: 0.05,       // 地球辉光高度 (调整到更明显的值)
  
  // 地球材质控制
  earthLightIntensity: 1.0,    // 地球材质亮度
  earthLightTempK: 5600,        // 地球材质色温
  
  // 月球材质控制
  moonLightIntensity: 1.0,     // 月球材质亮度
  moonLightTempK: 5600,        // 月球材质色温
  
  // 云层参数
  cloudStrength: 0.8,          // 云层强度
  cloudHeight: 0.008,          // 云层高度
  cloudYawDeg: 0,              // 云层经度旋转
  cloudPitchDeg: 0,            // 云层纬度旋转
  cloudGamma: 1.15,            // 云层Gamma值
  cloudBlack: 0.4,             // 云层黑场
  cloudWhite: 0.85,            // 云层白场
  cloudContrast: 1.2,          // 云层对比度
  
  // 控制参数
  exposure: 1.0,               // 曝光
  cameraDistance: 15,          // 相机距离
  
  // 显示选项
  useTextures: true,           // 使用贴图
  useClouds: true,             // 显示云层
  showStars: true,             // 显示星空
  useMilkyWay: false,          // 不使用银河星空
  enableControls: false,       // 禁用相机控制（保持理想构图）
};

// 从原始Composition转换为SimpleComposition
export function convertToSimpleComposition(original: any): SimpleComposition {
  return {
    // 地球参数
    earthSize: original.earthSize ?? DEFAULT_SIMPLE_COMPOSITION.earthSize,
    earthTiltDeg: original.earthTiltDeg ?? DEFAULT_SIMPLE_COMPOSITION.earthTiltDeg,
    earthYawDeg: original.earthYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.earthYawDeg,
    earthTopY: original.earthTopY ?? DEFAULT_SIMPLE_COMPOSITION.earthTopY,
    
    // 月球参数
    moonDistance: original.moonDistance ?? DEFAULT_SIMPLE_COMPOSITION.moonDistance,
    moonRadius: original.moonRadius ?? DEFAULT_SIMPLE_COMPOSITION.moonRadius,
    moonLatDeg: original.moonLatDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonLatDeg,
    moonLonDeg: original.moonLonDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonLonDeg,
    
    // 光照参数
    sunIntensity: original.sunIntensity ?? DEFAULT_SIMPLE_COMPOSITION.sunIntensity,
    lightAzimuth: original.lightAzimuth ?? DEFAULT_SIMPLE_COMPOSITION.lightAzimuth,
    lightElevation: original.lightElevation ?? DEFAULT_SIMPLE_COMPOSITION.lightElevation,
    lightTempK: original.lightTempK ?? DEFAULT_SIMPLE_COMPOSITION.lightTempK,
    
    // 视觉效果参数
    specStrength: original.specStrength ?? DEFAULT_SIMPLE_COMPOSITION.specStrength,
    shininess: original.shininess ?? DEFAULT_SIMPLE_COMPOSITION.shininess,
    broadStrength: original.broadStrength ?? DEFAULT_SIMPLE_COMPOSITION.broadStrength,
    terminatorSoftness: original.terminatorSoftness ?? DEFAULT_SIMPLE_COMPOSITION.terminatorSoftness,
    nightIntensity: original.nightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.nightIntensity,
    
    // 大气效果参数
    rimStrength: original.rimStrength ?? DEFAULT_SIMPLE_COMPOSITION.rimStrength,
    rimWidth: original.rimWidth ?? DEFAULT_SIMPLE_COMPOSITION.rimWidth,
    rimRadius: original.rimRadius ?? DEFAULT_SIMPLE_COMPOSITION.rimRadius,
    haloWidth: original.haloWidth ?? DEFAULT_SIMPLE_COMPOSITION.haloWidth,
    earthGlowStrength: original.earthGlowStrength ?? DEFAULT_SIMPLE_COMPOSITION.earthGlowStrength,
    earthGlowHeight: original.earthGlowHeight ?? DEFAULT_SIMPLE_COMPOSITION.earthGlowHeight,
    
    // 地球材质控制
    earthLightIntensity: original.earthLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.earthLightIntensity,
    earthLightTempK: original.earthLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.earthLightTempK,
    
    // 月球材质控制
    moonLightIntensity: original.moonLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.moonLightIntensity,
    moonLightTempK: original.moonLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.moonLightTempK,
    
    // 云层参数
    cloudStrength: original.cloudStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudStrength,
    cloudHeight: original.cloudHeight ?? DEFAULT_SIMPLE_COMPOSITION.cloudHeight,
    cloudYawDeg: original.cloudYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.cloudYawDeg,
    cloudPitchDeg: original.cloudPitchDeg ?? DEFAULT_SIMPLE_COMPOSITION.cloudPitchDeg,
    cloudGamma: original.cloudGamma ?? DEFAULT_SIMPLE_COMPOSITION.cloudGamma,
    cloudBlack: original.cloudBlack ?? DEFAULT_SIMPLE_COMPOSITION.cloudBlack,
    cloudWhite: original.cloudWhite ?? DEFAULT_SIMPLE_COMPOSITION.cloudWhite,
    cloudContrast: original.cloudContrast ?? DEFAULT_SIMPLE_COMPOSITION.cloudContrast,
    
    // 控制参数
    exposure: original.exposure ?? DEFAULT_SIMPLE_COMPOSITION.exposure,
    cameraDistance: original.cameraDistance ?? DEFAULT_SIMPLE_COMPOSITION.cameraDistance,
    
    // 显示选项
    useTextures: original.useTextures ?? DEFAULT_SIMPLE_COMPOSITION.useTextures,
    useClouds: original.useClouds ?? DEFAULT_SIMPLE_COMPOSITION.useClouds,
    showStars: original.showStars ?? DEFAULT_SIMPLE_COMPOSITION.showStars,
    useMilkyWay: original.useMilkyWay ?? DEFAULT_SIMPLE_COMPOSITION.useMilkyWay,
    enableControls: false,     // 始终禁用相机控制，保持理想构图
  };
}
