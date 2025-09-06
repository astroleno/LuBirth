// 简化的构图参数类型
export interface SimpleComposition {
  // 地球参数
  earthSize: number;           // 地球大小
  earthTiltDeg: number;        // 地球倾角（固定为0，我们转阳光）
  earthYawDeg: number;         // 地球自转角
  earthTopY: number;           // 地球上沿位置 (0-1)
  
  // 月球参数
  moonDistance: number;        // 月球距离
  moonRadius: number;          // 月球半径
  moonLatDeg: number;          // 月球纬度调整
  moonLonDeg: number;          // 月球经度调整
  moonScreenX: number;         // 月球屏幕X位置 (0-1)
  moonScreenY: number;         // 月球屏幕Y位置 (0-1)
  
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
  earthGlowDayNightRatio: number; // 地球辉光日侧夜侧对比度 (0=无对比, 1=完全对比)
  
  // 地球材质控制
  earthLightIntensity: number; // 地球材质亮度
  earthLightTempK: number;     // 地球材质色温
  
  // 月球材质控制
  moonLightIntensity: number;  // 月球材质亮度
  moonLightTempK: number;      // 月球材质色温
  // 月球外观增强
  moonTintH: number;           // 月球色调 Hue (0-360)
  moonTintS: number;           // 月球色调 Saturation (0-1)
  moonTintL: number;           // 月球色调 Lightness (0-1)
  moonTintStrength: number;    // 色调混合强度 (0-1)
  moonShadingGamma: number;    // 朗伯项Gamma (0.5-2)
  moonSurgeStrength: number;   // 满月亮度增强强度 (0-0.5)
  moonSurgeSigmaDeg: number;   // 满月增强宽度(度)
  moonDisplacementScale: number; // 高度贴图位移强度
  moonNormalScale?: number;      // 法线贴图强度 (0-2)
  normalFlipY?: boolean;         // 法线贴图Y翻转（有些贴图绿色通道需要翻）
  normalFlipX?: boolean;         // 法线贴图X翻转（少见，保险项）
  terminatorRadius?: number;     // 晨昏线软半径（附加宽度）
  phaseCoupleStrength?: number;  // 相位耦合强度（0-1）
  displacementMid?: number;      // 位移中点（通常0.5，决定正负起伏平衡）
  nightLift?: number;            // 夜面抬升（0-0.2），避免新月过亮
  
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
  // 相机极坐标（最小接入）
  cameraAzimuthDeg?: number;   // 相机方位角 λ（绕世界+Y），0=面向 -Z
  cameraElevationDeg?: number; // 相机仰角 φ（绕相机右轴），正为向上
  viewOffsetY?: number;        // 视口主点纵向偏移（-1..+1，上为正）
  smooth?: { enable: boolean; timeConstantMs: number } | undefined; // 可选平滑参数（占位）
  
  // 显示选项
  useTextures: boolean;        // 使用贴图
  useClouds: boolean;          // 显示云层
  showStars: boolean;          // 显示星空
  useMilkyWay: boolean;        // 使用银河星空
  // 银河背景控制
  bgYawDeg?: number;           // 银河经度旋转
  bgPitchDeg?: number;         // 银河纬度旋转
  bgScale?: number;            // 银河经度缩放（纹理重复）
  enableControls: boolean;     // 启用相机控制

  // 月相模式
  moonUseCameraLockedPhase?: boolean; // 月相是否使用“相机锁定”模式（默认 true）

  // PIP 配置（最小接入）
  enablePIP?: boolean;         // 启用画中画
  pip?: {
    x: number;                 // 屏幕位置X（0..1）左到右
    y: number;                 // 屏幕位置Y（0..1）下到上
    size: number;              // 贴片像素尺寸（正方形）
    resolution: number;        // 离屏渲染分辨率（纹理边长）
    fps: number;               // 离屏渲染帧率上限
  };

  // 固定太阳模式
  useFixedSun?: boolean;        // 是否使用固定太阳方向 + 旋转地球
  fixedSunDir?: [number, number, number]; // 固定太阳方向（世界系），默认 [-1,0,0]

}

// 默认值
export const DEFAULT_SIMPLE_COMPOSITION: SimpleComposition = {
  // 地球参数
  earthSize: 0.33,             // 占屏33%
  earthTiltDeg: 0,             // 固定为0（我们转阳光，不再可调）
  earthYawDeg: 0,              // 自转角
  earthTopY: 0.333,            // 地球下1/3位置
  
  // 月球参数
  moonDistance: 14,            // 月球距离
  moonRadius: 0.44,            // 月球半径
  moonLatDeg: 0,               // 月球纬度调整
  moonLonDeg: -90,             // 月球经度调整
  moonScreenX: 0.5,            // 月球屏幕X位置 (屏幕中央)
  moonScreenY: 0.75,           // 月球屏幕Y位置 (屏幕上方)
  
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
  earthGlowDayNightRatio: 0.5, // 地球辉光日侧夜侧对比度 (0=无对比, 1=完全对比)
  
  // 地球材质控制
  earthLightIntensity: 1.0,    // 地球材质亮度
  earthLightTempK: 5600,        // 地球材质色温
  
  // 月球材质控制
  moonLightIntensity: 1.0,     // 月球材质亮度
  moonLightTempK: 5600,        // 月球材质色温
  // 月球外观增强默认
  moonTintH: 0,
  moonTintS: 0.75,
  moonTintL: 0.5,
  moonTintStrength: 0.0,
  moonShadingGamma: 1.0,
  moonSurgeStrength: 0.15,
  moonSurgeSigmaDeg: 18,
  moonDisplacementScale: 0.015,
  moonNormalScale: 0.1,
  normalFlipY: true,
  normalFlipX: false,
  terminatorRadius: 0.02,
  phaseCoupleStrength: 0.0,
  displacementMid: 0.5,
  nightLift: 0.02,
  
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
  cameraAzimuthDeg: 0,         // 默认不偏航
  cameraElevationDeg: 0,       // 默认不俯仰
  viewOffsetY: 0,              // 默认不偏移
  smooth: { enable: false, timeConstantMs: 200 },
  
  // 显示选项
  useTextures: true,           // 使用贴图
  useClouds: true,             // 显示云层
  showStars: true,             // 显示星空
  useMilkyWay: true,           // 使用银河星空
  bgYawDeg: -61,
  bgPitchDeg: 0,
  bgScale: 1.0,                // 银河贴图缩放（1.0 = 正常大小，<1.0 = 放大，>1.0 = 缩小）
  enableControls: false,       // 禁用相机控制（保持理想构图）

  // 月相模式
  moonUseCameraLockedPhase: true,

  // PIP 默认关闭
  enablePIP: true,
  pip: { x: 0.5, y: 0.75, size: 192, resolution: 1024, fps: 30 },

  // 固定太阳模式（默认开启）
  useFixedSun: true,
  // 默认从屏幕左上方打光（相机看向 -Z，左= -X，上= +Y）
  fixedSunDir: [-0.7071, 0.7071, 0],


  // 季节模式默认关闭
  useSeasonalVariation: false,
  obliquityDeg: 23.44,
  seasonOffsetDays: 0,
};

// 从原始Composition转换为SimpleComposition
export function convertToSimpleComposition(original: any): SimpleComposition {
  return {
      // 地球参数
  earthSize: original.earthSize ?? DEFAULT_SIMPLE_COMPOSITION.earthSize,
  earthTiltDeg: 0, // 🔧 关键修复：始终为0，避免与阳光旋转冲突
  earthYawDeg: original.earthYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.earthYawDeg,
  earthTopY: original.earthTopY ?? DEFAULT_SIMPLE_COMPOSITION.earthTopY,
    
    // 月球参数
    moonDistance: original.moonDistance ?? DEFAULT_SIMPLE_COMPOSITION.moonDistance,
    moonRadius: original.moonRadius ?? DEFAULT_SIMPLE_COMPOSITION.moonRadius,
    moonLatDeg: original.moonLatDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonLatDeg,
    moonLonDeg: original.moonLonDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonLonDeg,
    moonScreenX: original.moonScreenX ?? DEFAULT_SIMPLE_COMPOSITION.moonScreenX,
    moonScreenY: original.moonScreenY ?? DEFAULT_SIMPLE_COMPOSITION.moonScreenY,
    
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
    earthGlowDayNightRatio: original.earthGlowDayNightRatio ?? DEFAULT_SIMPLE_COMPOSITION.earthGlowDayNightRatio,
    
    // 地球材质控制
    earthLightIntensity: original.earthLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.earthLightIntensity,
    earthLightTempK: original.earthLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.earthLightTempK,
    
    // 月球材质控制
    moonLightIntensity: original.moonLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.moonLightIntensity,
    moonLightTempK: original.moonLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.moonLightTempK,
    moonTintH: original.moonTintH ?? DEFAULT_SIMPLE_COMPOSITION.moonTintH,
    moonTintS: original.moonTintS ?? DEFAULT_SIMPLE_COMPOSITION.moonTintS,
    moonTintL: original.moonTintL ?? DEFAULT_SIMPLE_COMPOSITION.moonTintL,
    moonTintStrength: original.moonTintStrength ?? DEFAULT_SIMPLE_COMPOSITION.moonTintStrength,
    moonShadingGamma: original.moonShadingGamma ?? DEFAULT_SIMPLE_COMPOSITION.moonShadingGamma,
    moonSurgeStrength: original.moonSurgeStrength ?? DEFAULT_SIMPLE_COMPOSITION.moonSurgeStrength,
    moonSurgeSigmaDeg: original.moonSurgeSigmaDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonSurgeSigmaDeg,
    moonDisplacementScale: original.moonDisplacementScale ?? DEFAULT_SIMPLE_COMPOSITION.moonDisplacementScale,
    moonNormalScale: original.moonNormalScale ?? DEFAULT_SIMPLE_COMPOSITION.moonNormalScale,
    normalFlipY: original.normalFlipY ?? DEFAULT_SIMPLE_COMPOSITION.normalFlipY,
    normalFlipX: original.normalFlipX ?? DEFAULT_SIMPLE_COMPOSITION.normalFlipX,
    terminatorRadius: original.terminatorRadius ?? DEFAULT_SIMPLE_COMPOSITION.terminatorRadius,
    phaseCoupleStrength: original.phaseCoupleStrength ?? DEFAULT_SIMPLE_COMPOSITION.phaseCoupleStrength,
    displacementMid: original.displacementMid ?? DEFAULT_SIMPLE_COMPOSITION.displacementMid,
    
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
    cameraAzimuthDeg: original.cameraAzimuthDeg ?? DEFAULT_SIMPLE_COMPOSITION.cameraAzimuthDeg,
    cameraElevationDeg: original.cameraElevationDeg ?? DEFAULT_SIMPLE_COMPOSITION.cameraElevationDeg,
    viewOffsetY: original.viewOffsetY ?? DEFAULT_SIMPLE_COMPOSITION.viewOffsetY,
    smooth: original.smooth ?? DEFAULT_SIMPLE_COMPOSITION.smooth,
    
    // 显示选项
    useTextures: original.useTextures ?? DEFAULT_SIMPLE_COMPOSITION.useTextures,
    useClouds: original.useClouds ?? DEFAULT_SIMPLE_COMPOSITION.useClouds,
    showStars: original.showStars ?? DEFAULT_SIMPLE_COMPOSITION.showStars,
    useMilkyWay: original.useMilkyWay ?? DEFAULT_SIMPLE_COMPOSITION.useMilkyWay,
    bgYawDeg: original.bgYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.bgYawDeg,
    bgPitchDeg: original.bgPitchDeg ?? DEFAULT_SIMPLE_COMPOSITION.bgPitchDeg,
    bgScale: original.bgScale ?? DEFAULT_SIMPLE_COMPOSITION.bgScale,
    enableControls: false,     // 始终禁用相机控制，保持理想构图

    // 月相模式
    moonUseCameraLockedPhase: original.moonUseCameraLockedPhase ?? DEFAULT_SIMPLE_COMPOSITION.moonUseCameraLockedPhase,

    // PIP
    enablePIP: original.enablePIP ?? DEFAULT_SIMPLE_COMPOSITION.enablePIP,
    pip: original.pip ?? DEFAULT_SIMPLE_COMPOSITION.pip,

    // 固定太阳模式（保持可回退能力）
    useFixedSun: original.useFixedSun ?? DEFAULT_SIMPLE_COMPOSITION.useFixedSun,
    fixedSunDir: original.fixedSunDir ?? DEFAULT_SIMPLE_COMPOSITION.fixedSunDir,


    // 季节模式
    useSeasonalVariation: original.useSeasonalVariation ?? DEFAULT_SIMPLE_COMPOSITION.useSeasonalVariation,
    obliquityDeg: original.obliquityDeg ?? DEFAULT_SIMPLE_COMPOSITION.obliquityDeg,
    seasonOffsetDays: original.seasonOffsetDays ?? DEFAULT_SIMPLE_COMPOSITION.seasonOffsetDays,
  };
}
