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
  moonYawDeg?: number;         // 月球水平转角调整
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
  specFresnelK: number;        // 海面高光菲涅尔幂次（0关闭，默认1.8）
  terminatorSoftness: number;  // 晨昏线柔和度
  nightIntensity: number;      // 夜景强度
  nightFalloff: number;        // 夜景衰减系数（0.5-3.0，默认1.6）
  terminatorLift: number;      // 终止线提亮（0.0-0.05，默认0.01）
  terminatorTint: [number, number, number, number]; // 终止线暖色调 [r,g,b,a]
  nightEarthMapIntensity: number; // 月光下地球贴图强度（0.0-0.8，默认0.3）
  nightEarthMapHue: number;       // 月光地球贴图色调（0-360，默认200）
  nightEarthMapSaturation: number; // 月光地球贴图饱和度（0-2，默认1.0）
  nightEarthMapLightness: number;  // 月光地球贴图亮度（0-2，默认1.0）
  nightHemisphereBrightness: number; // 夜半球整体明度（0.2-2.0，默认1.0）
  dayEarthMapHue: number;         // 日半球地球贴图色调（0-360，默认200）
  dayEarthMapSaturation: number;   // 日半球地球贴图饱和度（0-2，默认0.30）
  dayEarthMapLightness: number;    // 日半球地球贴图亮度（0-2，默认0.30）
  nightGlowBlur: number;           // 夜景灯光高斯模糊值（0-0.1，默认0.02）
  nightGlowOpacity: number;        // 夜景灯光发光层不透明度（0-1，默认0.3）
  
  // 日面漫反射顶亮控制（A方案）
  dayDiffuseMax?: number;        // 日面漫反射上限（0.2-3.0，默认1.0，1=不变）
  dayDiffuseGamma?: number;      // 日面漫反射Gamma压缩（0.6-2.0，默认1.0）
  
  // 大气效果参数
  rimStrength: number;         // 大气弧光强度
  rimWidth: number;            // 大气弧光宽度
  rimHeight: number;           // 大气弧光高度
  rimRadius: number;           // 弧光贴合半径差 (0.001-0.01)
  haloWidth: number;           // 近表面halo宽度
  
  // 大气辉光增强参数
  enableAtmosphere?: boolean;  // 启用大气辉光增强
  atmoIntensity?: number;      // 大气辉光强度 (0-2)
  atmoThickness?: number;      // 大气厚度 (0.02-0.08)
  atmoColor?: [number, number, number]; // 大气颜色 RGB
  atmoFresnelPower?: number;   // Fresnel曲线幂次
  atmoContrast?: number;       // 主层昼夜对比(0=均匀,1=仅昼侧)
  atmoSoftness?: number;       // 主层柔度(0=陡、3=柔)
  atmoNearShell?: boolean;     // 启用近地薄壳渐变
  atmoNearStrength?: number;   // 近地薄壳强度(0-4)
  atmoNearThickness?: number;  // 近地薄壳厚度系数(0-1)，乘以 thickness
  atmoNearContrast?: number;   // 近地昼夜对比(0=均匀,1=仅昼侧)
  atmoNearSoftness?: number;   // 近地渐变柔度(0=陡、1=柔)
  // 大气外缘融合实验参数（默认0关闭，不改变观感）
  atmoSoftBoundary?: number;   // 外半径软边比例（0=关，建议0.005-0.01）
  atmoPerceptualFloor?: number; // 感知地板（线性域，0=关，建议0.003-0.006）
  atmoBlendUseAlpha?: boolean;  // Alpha加权加法混合（默认false）
  atmoScaleHeight?: number;     // 指数尺度高度（地球半径比例，0=关，建议0.02-0.04）
  atmoOffset?: number;          // 大气辉光起始偏移（0-0.02，默认0.001）
                                // 用于填补高度贴图调整后产生的空隙，让大气辉光从地表向内偏移开始发光
                                // 0=从地表开始，0.001=从地表向内0.1%地球半径开始，0.02=最大偏移2%
  
  // 地球材质控制
  earthLightIntensity: number; // 地球材质亮度
  earthLightTempK: number;     // 地球材质色温
  // 地球法线贴图控制
  earthUseNormalMap?: boolean; // 启用地球法线贴图
  earthNormalStrength?: number; // 法线强度 (0-2)
  earthNormalFlipY?: boolean;   // Y翻转
  earthNormalFlipX?: boolean;   // X翻转
  // 地球置换贴图控制（高度）
  earthDisplacementScale?: number; // 相对半径比例（0-0.02）
  earthDisplacementMid?: number;   // 中点 (0-1)
  earthDisplacementContrast?: number; // 对比 (0-4)
  
  // 月球材质控制
  moonLightIntensity: number;  // 月球材质亮度
  moonLightTempK: number;      // 月球材质色温
  // 月球光照强度极值控制（基于月相动态调整）
  moonLightMinRatio: number;   // 新月时月球光照强度比例 (0-1, 默认0.3)
  moonLightMaxRatio: number;   // 满月时月球光照强度比例 (0-1, 默认0.6)
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
  
  // 置换贴图参数
  cloudDisplacementScale?: number; // 置换强度
  cloudDisplacementBias?: number;  // 置换偏移
  // UV滚动速度参数
  cloudScrollSpeedU?: number;      // U方向滚动速度
  cloudScrollSpeedV?: number;      // V方向滚动速度
  
  // 云层厚度参数
  cloudNumLayers?: number;         // 云层层数（默认3）
  cloudLayerSpacing?: number;      // 层间距（默认0.002）
  cloudEnablePatch?: boolean;      // 启用动态patch（默认false）
  cloudPatchSize?: number;         // patch大小（默认0.15）
  cloudPatchDistance?: number;     // patch显示距离（默认10）
  
  // 体积散射参数
  cloudUseVolumeScattering?: boolean;  // 启用体积散射（默认false）
  cloudVolumeDensity?: number;         // 体积密度（默认0.3）
  cloudScatteringStrength?: number;    // 散射强度（默认0.5）
  cloudScatteringG?: number;           // 相位函数参数（默认0.3）
  cloudRimEffect?: number;             // 边缘增强效果（默认0.3）
  cloudDensityEnhancement?: number;    // 密度增强倍数（默认1.5）
  cloudScatteringColor?: [number, number, number]; // 散射颜色RGB（默认[1.0, 0.95, 0.9]）
  cloudNoiseScale?: number;            // 噪声缩放（默认1.0）
  cloudNoiseStrength?: number;         // 噪声强度（默认0.8）
  
  // 厚度映射参数
  cloudUseThicknessMapping?: boolean;  // 启用厚度映射（默认false）
  cloudThicknessScale?: number;        // 厚度缩放（默认1.0）
  cloudThicknessBias?: number;         // 厚度偏移（默认0.0）
  cloudThicknessPower?: number;        // 厚度幂次（默认1.0）
  
  // 菲涅尔效果参数
  cloudUseFresnel?: boolean;           // 启用菲涅尔效果（默认true）
  cloudFresnelPower?: number;          // 菲涅尔幂次（默认2.0）
  cloudFresnelStrength?: number;       // 菲涅尔强度（默认0.7）
  // 菲涅尔曲线控制参数
  cloudCurvePowerA?: number;           // 前半段幂次（平缓，默认1.0）
  cloudCurvePowerB?: number;           // 后半段幂次（陡峭，默认3.0）
  cloudCurveMixPoint?: number;         // 混合点位置（默认0.6）
  
  // 夜半球地球贴图光照控制
  nightEarthLightInfluence?: number;   // 夜半球地球贴图受太阳光影响程度（0-1）
  
  
  // 控制参数
  exposure: number;            // 曝光
  cameraDistance: number;      // 相机距离
  // 相机极坐标（最小接入）
  cameraAzimuthDeg?: number;   // 相机方位角 λ（绕世界+Y），0=面向 -Z
  cameraElevationDeg?: number; // 相机仰角 φ（绕相机右轴），正为向上
  lookAtDistanceRatio?: number; // 相机朝向上下倍率（倍数，-10到10，0=地心，正数=上方，负数=下方）
  viewOffsetY?: number;        // 视口主点纵向偏移（-5..+5，上为正）
  smooth?: { enable: boolean; timeConstantMs: number } | undefined; // 可选平滑参数（占位）
  // 贴图/坐标零点微调（用于绝对经度对齐的常数校准）
  seamOffsetDeg?: number;      // 经度零点校准（度，正值向东偏移），默认0
  
  // 显示选项
  useTextures: boolean;        // 使用贴图
  useClouds: boolean;          // 显示云层
  showStars: boolean;          // 显示星空
  useMilkyWay: boolean;        // 使用银河星空
  showMoon?: boolean;          // 显示月球（新增，默认true）
  // 银河背景控制
  bgYawDeg?: number;           // 银河经度旋转
  bgPitchDeg?: number;         // 银河纬度旋转
  bgScale?: number;            // 银河经度缩放（纹理重复）
  bgAutoRotateDegPerSec?: number; // 银河自动自转角速度（度/秒，0=关闭）
  enableControls: boolean;     // 启用相机控制

  // 月相模式
  moonUseCameraLockedPhase?: boolean; // 月相是否使用“相机锁定”模式（默认 true）

  
  // 固定太阳模式
  useFixedSun?: boolean;        // 是否使用固定太阳方向 + 旋转地球
  fixedSunDir?: [number, number, number]; // 固定太阳方向（世界系），默认 [-1,0,0]
  // 固定太阳仰角策略
  // 当 useSeasonalVariation=true 时：
  // - strongAltitudeConsistency=false → 仰角由太阳赤纬δ驱动（推荐，长期稳定）
  // - strongAltitudeConsistency=true  → 仰角直接取 ephemeris.altDeg（仅仰角，保持 yaw 锁定），用于强一致验证
  strongAltitudeConsistency?: boolean;
  // 季相/仰角更新的最小间隔（分钟）。不需要每帧更新，分钟级即可
  seasonalUpdateIntervalMin?: number;

  // 出生点对齐（可选接入）
  enableBirthPointAlignment?: boolean;   // 是否启用"对齐出生点"（只动相机）
  birthPointAlignmentMode?: boolean;     // 🔧 新增：出生点对齐模式（禁用其他旋转系统干扰）
  showBirthPointMarker?: boolean;        // 是否显示出生点标记
  birthPointLongitudeDeg?: number;       // 出生点经度（°E 为正）
  birthPointLatitudeDeg?: number;        // 出生点纬度（°N 为正）
  birthPointMarkerSize?: number;         // 出生点标记大小（相对单位）
  birthPointMarkerColor?: string;        // 出生点标记颜色
  birthPointAlphaDeg?: number;           // 抬升角α（控制出生点在画面高度）

  // 月球屏幕尺寸（弱解耦）：占屏高度比例（0-1）
  moonScreenSize?: number;

  // 纬度对齐（仅动相机俯仰）
  latitudeAlignTargetDeg?: number; // 目标纬度（°N为正，默认80），对齐时将相机俯仰设置为 -target

  // 季节模式参数
  useSeasonalVariation?: boolean;   // 是否使用季节变化
  obliquityDeg?: number;           // 地轴倾角（度）
  seasonOffsetDays?: number;       // 季节偏移天数

  // 地表细节 LOD（预留，便于置换并存）
  earthDetailLOD?: 'auto' | 'normal' | 'displacement';
  earthNearDistance?: number; // 近景阈值（使用置换）
  earthFarDistance?: number;  // 远景阈值（仅法线）

  // 阴影与细分控制
  enableTerrainShadow?: boolean; // 地形阴影（地球接收定向光阴影）
  enableCloudShadow?: boolean;   // 云层阴影（用云贴图对地表做暗化）
  cloudShadowStrength?: number;  // 云层阴影强度（0-1）
  useSegLOD?: boolean;           // 启用细分段数LOD
  earthSegmentsBase?: number;    // 基础段数（默认144）
  earthSegmentsHigh?: number;    // 放大/近景段数（默认288）
  segLODTriggerSize?: number;    // 当地球半径size>=此值或对齐放大时使用高段数
  
  // 地形投影参数扩展
  directionalShadowSharpness?: number;  // 投影锐利度（控制边缘清晰度）
  directionalShadowContrast?: number;   // 投影对比度（调节阴影强度差异）

  // 云层场景感知控制
  cloudSceneAware?: boolean;          // 启用场景感知，默认true
  cloudPanoramaLayers?: number;       // 全景场景层数，默认3
  cloudCloseupLayers?: number;        // 近景场景层数，默认12
  cloudSceneTransitionDistance?: number; // 场景切换距离，默认8
  
  // 全景场景参数
  cloudPanoramaThickness?: number;    // 全景厚度倍数，默认1.0
  cloudPanoramaThicknessLayers?: number; // 全景厚度模拟层数，默认8
  cloudPanoramaThicknessVariation?: number; // 全景厚度变化，默认0.3
  
  // 近景场景参数
  cloudCloseupUseVolumeScattering?: boolean; // 近景启用体积散射，默认true
  cloudCloseupVolumeDensity?: number; // 体积密度，默认0.3
  cloudCloseupScatteringStrength?: number; // 散射强度，默认0.5
  
  // 性能控制
  cloudLODEnabled?: boolean;        // 启用LOD，默认true
  cloudPerformanceMode?: 'low' | 'medium' | 'high' | 'auto'; // 性能模式

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
  moonRadius: 0.68,            // 月球半径
  moonLatDeg: 90,              // 月球纬度调整（潮汐锁定面）
  moonLonDeg: -90,             // 月球经度调整（潮汐锁定面）
  moonYawDeg: -90,             // 月球水平转角调整（潮汐锁定面）
  moonScreenX: 0.5,            // 月球屏幕X位置 (屏幕中央)
  moonScreenY: 0.75,           // 月球屏幕Y位置 (屏幕上方)
  
  // 光照参数
  sunIntensity: 2.45,           // 阳光强度（默认 2.45）
  lightAzimuth: 180,           // 光照方位角
  lightElevation: 0,           // 光照仰角
  lightTempK: 5000,            // 标准日光色温
  
  // 视觉效果参数
  specStrength: 0.8,           // 镜面高光强度
  shininess: 80,               // 镜面高光锐度
  broadStrength: 0.4,          // 保留原有海面高光铺展
  specFresnelK: 1.8,           // 保留原有掠射角菲涅尔表现（0关闭）
  terminatorSoftness: 0.160,   // 晨昏线柔和度
  nightIntensity: 3.0,         // 夜景强度
  nightFalloff: 1.0,           // 夜景衰减系数（0.5-3.0，默认1.0）
  terminatorLift: 0.006,       // 终止线提亮（0.0-0.05，默认0.006）
  terminatorTint: [1.0, 0.9, 0.8, 0.01], // 终止线暖色调 [r,g,b,a]
  nightEarthMapIntensity: 0.80, // 月光下地球贴图强度（默认 0.80）
  nightEarthMapHue: 200,       // 月光地球贴图色调（0-360，默认200）
  nightEarthMapSaturation: 0.30, // 月光地球贴图饱和度（0-2，默认0.30）
  nightEarthMapLightness: 0.40,  // 月光地球贴图亮度（默认 0.40）
  nightHemisphereBrightness: 0.80, // 夜半球整体明度（0.2-2.0，默认0.80）
  dayEarthMapHue: 200,         // 日半球地球贴图色调（0-360，默认200）
  dayEarthMapSaturation: 0.30,   // 日半球地球贴图饱和度（0-2，默认0.30）
  dayEarthMapLightness: 0.30,    // 日半球地球贴图亮度（0-2，默认0.30）
  nightGlowBlur: 0.010,           // 夜景灯光高斯模糊值（0-0.1，默认0.010）
  nightGlowOpacity: 1.00,         // 夜景灯光发光层不透明度（0-1，默认1.00）
  
  // 日面漫反射顶亮控制默认
  dayDiffuseMax: 1.0,
  dayDiffuseGamma: 1.0,
  
  // 大气效果参数
  rimStrength: 2.00,           // 原有地缘弧光强度，两端保持一致
  rimWidth: 1.86,              // 原有弧光宽度
  rimHeight: 0.01,             // 大气弧光高度
  rimRadius: 0.005,            // 弧光贴合半径差 (0.001-0.01)
  haloWidth: 0.01,             // 近表面halo宽度
  
  // 大气辉光增强参数
  enableAtmosphere: true,      // 启用大气辉光增强
  atmoIntensity: 1.2,          // 保留原有大气辉光强度
  atmoThickness: 0.14,         // 保留原有外层弧光厚度
  atmoColor: [0.43, 0.65, 1.0], // 大气颜色 RGB (蓝色)
  atmoFresnelPower: 3.0,       // Fresnel曲线幂次默认
  atmoContrast: 0.48,          // 保留原有夜侧轮廓
  atmoSoftness: 1.00,          // 主层柔度默认（增加柔度，改善边缘过渡）
  atmoNearShell: true,         // 启用近地薄壳渐变
  atmoNearStrength: 0.6,       // 原有近地薄壳强度
  atmoNearThickness: 0.30,     // 近地薄壳厚度默认（更新）
  atmoNearContrast: 0.40,      // 原有近地昼夜对比
  atmoNearSoftness: 1.0,       // 近地渐变柔度默认（增加柔度，改善边缘过渡）
  // 大气外缘融合实验参数（默认启用，解决边界融合问题）
  atmoSoftBoundary: 0.008,      // 外半径软边比例，解决边界硬边
  atmoPerceptualFloor: 0.004,    // 感知地板，去除极低强度灰尾
  atmoBlendUseAlpha: true,       // Alpha加权加法混合
  atmoScaleHeight: 0.025,        // 保留原有高空辉光过渡
  atmoOffset: 0.001,             // 大气辉光起始偏移，填补高度贴图空隙
                                // 当高度贴图调整产生地形凸起时，此参数让大气辉光从更内层开始发光
                                // 避免大气层与凸起地形之间的视觉空隙
  
  // 地球材质控制
  earthLightIntensity: 1.0,    // 地球材质亮度
  earthLightTempK: 5600,        // 地球材质色温
  // 地球法线默认
  earthUseNormalMap: true,
  earthNormalStrength: 0.35,
  earthNormalFlipY: true,
  earthNormalFlipX: false,
  // 地球置换默认（关闭）
  earthDisplacementScale: 0.0035,
  earthDisplacementMid: 0.30,
  earthDisplacementContrast: 4.0,

  // 阴影与细分控制默认
  enableTerrainShadow: true,
  enableCloudShadow: true,   // 默认启用云层投影
  cloudShadowStrength: 0.4,  // 云层投影强度（默认启用）
  useSegLOD: true,
  earthSegmentsBase: 144,
  earthSegmentsHigh: 2048,
  segLODTriggerSize: 1.0,
  
  // 地形投影参数扩展默认
  directionalShadowSharpness: 0.2,  // 投影锐利度默认值
  directionalShadowContrast: 1.5,   // 投影对比度默认值
  
  // 云层场景感知控制默认
  cloudSceneAware: true,            // 启用场景感知
  cloudPanoramaLayers: 3,           // 全景场景层数
  cloudCloseupLayers: 16,           // 近景场景层数
  cloudSceneTransitionDistance: 8,  // 场景切换距离
  
  // 全景场景参数默认
  cloudPanoramaThickness: 1.0,      // 全景厚度倍数
  cloudPanoramaThicknessLayers: 8,  // 全景厚度模拟层数
  cloudPanoramaThicknessVariation: 0.3, // 全景厚度变化
  
  // 近景场景参数默认
  cloudCloseupUseVolumeScattering: true, // 近景启用体积散射
  cloudCloseupVolumeDensity: 0.3,   // 体积密度
  cloudCloseupScatteringStrength: 0.5, // 散射强度
  
  // 性能控制默认
  cloudLODEnabled: true,            // 启用LOD
  cloudPerformanceMode: 'auto',     // 性能模式
  
  // 月球材质控制
  moonLightIntensity: 0.10,    // 月球材质亮度
  moonLightTempK: 5600,        // 月球材质色温
  // 月球光照强度极值控制默认
  moonLightMinRatio: 0.3,      // 新月时月球光照强度比例 (0-1, 默认0.3)
  moonLightMaxRatio: 0.6,      // 满月时月球光照强度比例 (0-1, 默认0.6)
  // 月球外观增强默认
  moonTintH: 0,
  moonTintS: 0.75,
  moonTintL: 0.5,
  moonTintStrength: 0.0,
  moonShadingGamma: 1.0,
  moonSurgeStrength: 0.15,
  moonSurgeSigmaDeg: 18,
  moonDisplacementScale: 0.015,
  moonNormalScale: 0.22,
  normalFlipY: true,
  normalFlipX: false,
  terminatorRadius: 0.02,
  phaseCoupleStrength: 0.0,
  displacementMid: 0.5,
  nightLift: 0.002,
  
  // 云层参数
  cloudStrength: 0.20,          // 云层强度
  cloudHeight: 0.003,          // 云层高度
  cloudYawDeg: 0,              // 云层经度旋转
  cloudPitchDeg: 0,            // 云层纬度旋转
  cloudGamma: 0.64,            // 云层Gamma值
  cloudBlack: 0.00,            // 云层黑点
  cloudWhite: 0.81,            // 云层白点
  cloudContrast: 1.0,          // 云层对比度
  
  // 置换贴图参数
  cloudDisplacementScale: 0.02,     // 置换强度 2.0%
  cloudDisplacementBias: 0.03,     // 置换偏移 3.0%
  // UV滚动速度参数
  cloudScrollSpeedU: 0.003,        // U方向滚动速度（水平/经度）
  cloudScrollSpeedV: 0.0005,       // V方向滚动速度（垂直/纬度）
  
  // 云层厚度参数
  cloudNumLayers: 6,            // 云层层数（全景模式用6层，平衡效果和性能）
  cloudLayerSpacing: 0.0010,    // 层间距（默认0.0010，放大模式）
  cloudEnablePatch: false,      // 启用动态patch（默认false）
  cloudPatchSize: 0.15,         // patch大小（默认0.15）
  cloudPatchDistance: 10,       // patch显示距离（默认10）
  
  // 体积散射参数
  cloudUseVolumeScattering: true,   // 启用体积散射（默认true）
  cloudVolumeDensity: 0.60,         // 体积密度（默认0.60）
  cloudScatteringStrength: 0.40,     // 散射强度（默认0.40）
  cloudScatteringG: -0.50,          // 相位函数参数（默认-0.50，后向散射）
  cloudRimEffect: 0.60,             // 边缘增强效果（默认0.60）
  cloudDensityEnhancement: 1.60,    // 密度增强倍数（默认1.60）
  cloudScatteringColor: [1.0, 0.95, 0.9], // 散射颜色RGB（默认暖白色）
  cloudNoiseScale: 2.00,            // 噪声缩放（默认2.00）
  cloudNoiseStrength: 0.70,          // 噪声强度（默认0.70）
  
  // 厚度映射参数
  cloudUseThicknessMapping: true,   // 启用厚度映射（默认true）
  cloudThicknessScale: 4.00,         // 厚度缩放（默认4.00）
  cloudThicknessBias: 1.00,          // 厚度偏移（默认1.00）
  cloudThicknessPower: 1.50,         // 厚度幂次（默认1.50）
  
  // 菲涅尔效果参数
  cloudUseFresnel: true,            // 启用菲涅尔效果（默认true）
  cloudFresnelPower: 5.00,          // 菲涅尔幂次（默认5.00）
  cloudFresnelStrength: 0.50,        // 菲涅尔强度（默认0.50）
  // 菲涅尔曲线控制参数
  cloudCurvePowerA: 0.10,           // 前半段幂次（平缓，默认0.10）
  cloudCurvePowerB: 4.20,           // 后半段幂次（陡峭，默认4.20）
  cloudCurveMixPoint: 0.80,          // 混合点位置（默认0.80）
  
  // 夜半球地球贴图光照控制
  nightEarthLightInfluence: 0.3,    // 夜半球地球贴图受太阳光影响程度（0-1，默认0.3）
  
  
  // 控制参数
  exposure: 1.0,               // 曝光
  cameraDistance: 15,          // 相机距离
  cameraAzimuthDeg: 0,         // 默认不偏航
  cameraElevationDeg: 0,       // 默认不俯仰
  lookAtDistanceRatio: 0,     // 默认看向地心
  viewOffsetY: 0,              // 默认不偏移
  smooth: { enable: false, timeConstantMs: 200 },
  
  // 显示选项
  useTextures: true,           // 使用贴图
  useClouds: true,             // 显示云层
  showStars: true,             // 显示星空
  useMilkyWay: true,           // 使用银河星空
  showMoon: true,              // 显示月球
  bgYawDeg: -61,
  bgPitchDeg: 0,
  bgScale: 0.5,                // 银河贴图缩放（50% 默认）
  bgAutoRotateDegPerSec: 0.2, // 默认很慢的自动自转（仅全景工作，放大暂停）
  enableControls: false,       // 禁用相机控制（保持理想构图）

  // 月相模式
  // 月相默认使用相机锁定模式（启用相机锁相位）
  moonUseCameraLockedPhase: true,

  
  // 固定太阳模式（默认开启）
  useFixedSun: true,
  // 默认从屏幕左上方打光（相机看向 -Z，左= -X，上= +Y）
  fixedSunDir: [-0.7071, 0.7071, 0],
  // 仰角策略默认：使用δ驱动（更稳更符合季相），强一致开关默认关闭
  strongAltitudeConsistency: false,
  seasonalUpdateIntervalMin: 1,

  // 出生点对齐默认（关闭，仅显示标记用于调试可选）
  enableBirthPointAlignment: false,
  birthPointAlignmentMode: false,     // 🔧 新增：默认关闭出生点对齐模式
  showBirthPointMarker: false,
  birthPointLongitudeDeg: 121.5,
  birthPointLatitudeDeg: 31.2,
  birthPointMarkerSize: 0.06,
  birthPointMarkerColor: '#ff3b30',
  birthPointAlphaDeg: 12,
  // 贴图 seam/零点校准（可选）：若绝对经度对齐存在恒定偏差，可调此值
  seamOffsetDeg: 0,

  // 月球屏幕尺寸默认：占屏高度 18%
  moonScreenSize: 0.18,


  // 季节模式默认打开
  useSeasonalVariation: true,
  obliquityDeg: 23.44,
  seasonOffsetDays: 0,

  // 纬度对齐默认目标（北纬28）
  latitudeAlignTargetDeg: 28,

  // 地表细节 LOD 默认：自动，根据相机距离
  earthDetailLOD: 'auto',
  earthNearDistance: 8,
  earthFarDistance: 18,
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
    moonYawDeg: original.moonYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.moonYawDeg,
    moonScreenX: original.moonScreenX ?? DEFAULT_SIMPLE_COMPOSITION.moonScreenX,
    moonScreenY: original.moonScreenY ?? DEFAULT_SIMPLE_COMPOSITION.moonScreenY,
    
    // 光照参数
    sunIntensity: original.sunIntensity ?? DEFAULT_SIMPLE_COMPOSITION.sunIntensity,
    lightAzimuth: original.lightAzimuth ?? DEFAULT_SIMPLE_COMPOSITION.lightAzimuth,
    lightElevation: original.lightElevation ?? DEFAULT_SIMPLE_COMPOSITION.lightElevation,
    lightTempK: original.lightTempK ?? DEFAULT_SIMPLE_COMPOSITION.lightTempK,
    // 地球法线贴图控制
    earthUseNormalMap: original.earthUseNormalMap ?? DEFAULT_SIMPLE_COMPOSITION.earthUseNormalMap,
    earthNormalStrength: original.earthNormalStrength ?? DEFAULT_SIMPLE_COMPOSITION.earthNormalStrength,
    earthNormalFlipY: original.earthNormalFlipY ?? DEFAULT_SIMPLE_COMPOSITION.earthNormalFlipY,
    earthNormalFlipX: original.earthNormalFlipX ?? DEFAULT_SIMPLE_COMPOSITION.earthNormalFlipX,
    earthDisplacementScale: original.earthDisplacementScale ?? DEFAULT_SIMPLE_COMPOSITION.earthDisplacementScale,
    earthDisplacementMid: original.earthDisplacementMid ?? DEFAULT_SIMPLE_COMPOSITION.earthDisplacementMid,
    earthDisplacementContrast: original.earthDisplacementContrast ?? DEFAULT_SIMPLE_COMPOSITION.earthDisplacementContrast,
    
    // 视觉效果参数
    specStrength: original.specStrength ?? DEFAULT_SIMPLE_COMPOSITION.specStrength,
    shininess: original.shininess ?? DEFAULT_SIMPLE_COMPOSITION.shininess,
    broadStrength: original.broadStrength ?? DEFAULT_SIMPLE_COMPOSITION.broadStrength,
    specFresnelK: original.specFresnelK ?? DEFAULT_SIMPLE_COMPOSITION.specFresnelK,
    terminatorSoftness: original.terminatorSoftness ?? DEFAULT_SIMPLE_COMPOSITION.terminatorSoftness,
    nightIntensity: original.nightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.nightIntensity,
    nightFalloff: original.nightFalloff ?? DEFAULT_SIMPLE_COMPOSITION.nightFalloff,
    terminatorLift: original.terminatorLift ?? DEFAULT_SIMPLE_COMPOSITION.terminatorLift,
    terminatorTint: original.terminatorTint ?? DEFAULT_SIMPLE_COMPOSITION.terminatorTint,
    nightEarthMapIntensity: original.nightEarthMapIntensity ?? DEFAULT_SIMPLE_COMPOSITION.nightEarthMapIntensity,
    nightEarthMapHue: original.nightEarthMapHue ?? DEFAULT_SIMPLE_COMPOSITION.nightEarthMapHue,
    nightEarthMapSaturation: original.nightEarthMapSaturation ?? DEFAULT_SIMPLE_COMPOSITION.nightEarthMapSaturation,
    nightEarthMapLightness: original.nightEarthMapLightness ?? DEFAULT_SIMPLE_COMPOSITION.nightEarthMapLightness,
    nightHemisphereBrightness: original.nightHemisphereBrightness ?? DEFAULT_SIMPLE_COMPOSITION.nightHemisphereBrightness,
    dayEarthMapHue: original.dayEarthMapHue ?? DEFAULT_SIMPLE_COMPOSITION.dayEarthMapHue,
    dayEarthMapSaturation: original.dayEarthMapSaturation ?? DEFAULT_SIMPLE_COMPOSITION.dayEarthMapSaturation,
    dayEarthMapLightness: original.dayEarthMapLightness ?? DEFAULT_SIMPLE_COMPOSITION.dayEarthMapLightness,
    nightGlowBlur: original.nightGlowBlur ?? DEFAULT_SIMPLE_COMPOSITION.nightGlowBlur,
    nightGlowOpacity: original.nightGlowOpacity ?? DEFAULT_SIMPLE_COMPOSITION.nightGlowOpacity,
    
    // 大气效果参数
    rimStrength: original.rimStrength ?? DEFAULT_SIMPLE_COMPOSITION.rimStrength,
    rimWidth: original.rimWidth ?? DEFAULT_SIMPLE_COMPOSITION.rimWidth,
    rimHeight: original.rimHeight ?? DEFAULT_SIMPLE_COMPOSITION.rimHeight,
    rimRadius: original.rimRadius ?? DEFAULT_SIMPLE_COMPOSITION.rimRadius,
    haloWidth: original.haloWidth ?? DEFAULT_SIMPLE_COMPOSITION.haloWidth,
    
    // 大气辉光增强参数
    enableAtmosphere: original.enableAtmosphere ?? DEFAULT_SIMPLE_COMPOSITION.enableAtmosphere,
    atmoIntensity: original.atmoIntensity ?? DEFAULT_SIMPLE_COMPOSITION.atmoIntensity,
    atmoThickness: original.atmoThickness ?? DEFAULT_SIMPLE_COMPOSITION.atmoThickness,
    atmoColor: original.atmoColor ?? DEFAULT_SIMPLE_COMPOSITION.atmoColor,
    atmoFresnelPower: original.atmoFresnelPower ?? DEFAULT_SIMPLE_COMPOSITION.atmoFresnelPower,
    atmoContrast: original.atmoContrast ?? DEFAULT_SIMPLE_COMPOSITION.atmoContrast,
    atmoNearShell: original.atmoNearShell ?? DEFAULT_SIMPLE_COMPOSITION.atmoNearShell,
    atmoNearStrength: original.atmoNearStrength ?? DEFAULT_SIMPLE_COMPOSITION.atmoNearStrength,
    atmoNearThickness: original.atmoNearThickness ?? DEFAULT_SIMPLE_COMPOSITION.atmoNearThickness,
    atmoNearContrast: original.atmoNearContrast ?? DEFAULT_SIMPLE_COMPOSITION.atmoNearContrast,
    atmoNearSoftness: original.atmoNearSoftness ?? DEFAULT_SIMPLE_COMPOSITION.atmoNearSoftness,
    atmoSoftBoundary: original.atmoSoftBoundary ?? DEFAULT_SIMPLE_COMPOSITION.atmoSoftBoundary,
    atmoPerceptualFloor: original.atmoPerceptualFloor ?? DEFAULT_SIMPLE_COMPOSITION.atmoPerceptualFloor,
    atmoBlendUseAlpha: original.atmoBlendUseAlpha ?? DEFAULT_SIMPLE_COMPOSITION.atmoBlendUseAlpha,
    atmoScaleHeight: original.atmoScaleHeight ?? DEFAULT_SIMPLE_COMPOSITION.atmoScaleHeight,
    atmoOffset: original.atmoOffset ?? DEFAULT_SIMPLE_COMPOSITION.atmoOffset,
    
    // 地球材质控制
    earthLightIntensity: original.earthLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.earthLightIntensity,
    earthLightTempK: original.earthLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.earthLightTempK,
    
    // 月球材质控制
    moonLightIntensity: original.moonLightIntensity ?? DEFAULT_SIMPLE_COMPOSITION.moonLightIntensity,
    moonLightTempK: original.moonLightTempK ?? DEFAULT_SIMPLE_COMPOSITION.moonLightTempK,
    // 月球光照强度极值控制
    moonLightMinRatio: original.moonLightMinRatio ?? DEFAULT_SIMPLE_COMPOSITION.moonLightMinRatio,
    moonLightMaxRatio: original.moonLightMaxRatio ?? DEFAULT_SIMPLE_COMPOSITION.moonLightMaxRatio,
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
    
    // 置换贴图参数
    cloudDisplacementScale: original.cloudDisplacementScale ?? DEFAULT_SIMPLE_COMPOSITION.cloudDisplacementScale,
    cloudDisplacementBias: original.cloudDisplacementBias ?? DEFAULT_SIMPLE_COMPOSITION.cloudDisplacementBias,
    // UV滚动速度参数
    cloudScrollSpeedU: original.cloudScrollSpeedU ?? DEFAULT_SIMPLE_COMPOSITION.cloudScrollSpeedU,
    cloudScrollSpeedV: original.cloudScrollSpeedV ?? DEFAULT_SIMPLE_COMPOSITION.cloudScrollSpeedV,
    
    // 云层厚度参数
    cloudNumLayers: original.cloudNumLayers ?? DEFAULT_SIMPLE_COMPOSITION.cloudNumLayers,
    cloudLayerSpacing: original.cloudLayerSpacing ?? DEFAULT_SIMPLE_COMPOSITION.cloudLayerSpacing,
    cloudEnablePatch: original.cloudEnablePatch ?? DEFAULT_SIMPLE_COMPOSITION.cloudEnablePatch,
    cloudPatchSize: original.cloudPatchSize ?? DEFAULT_SIMPLE_COMPOSITION.cloudPatchSize,
    cloudPatchDistance: original.cloudPatchDistance ?? DEFAULT_SIMPLE_COMPOSITION.cloudPatchDistance,
    
    // 控制参数
    exposure: original.exposure ?? DEFAULT_SIMPLE_COMPOSITION.exposure,
    cameraDistance: original.cameraDistance ?? DEFAULT_SIMPLE_COMPOSITION.cameraDistance,
    cameraAzimuthDeg: original.cameraAzimuthDeg ?? DEFAULT_SIMPLE_COMPOSITION.cameraAzimuthDeg,
    cameraElevationDeg: original.cameraElevationDeg ?? DEFAULT_SIMPLE_COMPOSITION.cameraElevationDeg,
    lookAtDistanceRatio: original.lookAtDistanceRatio ?? DEFAULT_SIMPLE_COMPOSITION.lookAtDistanceRatio,
    viewOffsetY: original.viewOffsetY ?? DEFAULT_SIMPLE_COMPOSITION.viewOffsetY,
    smooth: original.smooth ?? DEFAULT_SIMPLE_COMPOSITION.smooth,
    seamOffsetDeg: original.seamOffsetDeg ?? DEFAULT_SIMPLE_COMPOSITION.seamOffsetDeg,
    
    // 显示选项
    useTextures: original.useTextures ?? DEFAULT_SIMPLE_COMPOSITION.useTextures,
    useClouds: original.useClouds ?? DEFAULT_SIMPLE_COMPOSITION.useClouds,
    showStars: original.showStars ?? DEFAULT_SIMPLE_COMPOSITION.showStars,
    useMilkyWay: original.useMilkyWay ?? DEFAULT_SIMPLE_COMPOSITION.useMilkyWay,
    bgYawDeg: original.bgYawDeg ?? DEFAULT_SIMPLE_COMPOSITION.bgYawDeg,
    bgPitchDeg: original.bgPitchDeg ?? DEFAULT_SIMPLE_COMPOSITION.bgPitchDeg,
    bgScale: original.bgScale ?? DEFAULT_SIMPLE_COMPOSITION.bgScale,
    bgAutoRotateDegPerSec: original.bgAutoRotateDegPerSec ?? DEFAULT_SIMPLE_COMPOSITION.bgAutoRotateDegPerSec,
    enableControls: false,     // 始终禁用相机控制，保持理想构图

    // 月相模式
    moonUseCameraLockedPhase: original.moonUseCameraLockedPhase ?? DEFAULT_SIMPLE_COMPOSITION.moonUseCameraLockedPhase,

    
    // 固定太阳模式（保持可回退能力）
    useFixedSun: original.useFixedSun ?? DEFAULT_SIMPLE_COMPOSITION.useFixedSun,
    fixedSunDir: original.fixedSunDir ?? DEFAULT_SIMPLE_COMPOSITION.fixedSunDir,
    strongAltitudeConsistency: original.strongAltitudeConsistency ?? DEFAULT_SIMPLE_COMPOSITION.strongAltitudeConsistency,
    seasonalUpdateIntervalMin: original.seasonalUpdateIntervalMin ?? DEFAULT_SIMPLE_COMPOSITION.seasonalUpdateIntervalMin,

    // 出生点对齐
    enableBirthPointAlignment: original.enableBirthPointAlignment ?? DEFAULT_SIMPLE_COMPOSITION.enableBirthPointAlignment,
    birthPointAlignmentMode: original.birthPointAlignmentMode ?? DEFAULT_SIMPLE_COMPOSITION.birthPointAlignmentMode,
    showBirthPointMarker: original.showBirthPointMarker ?? DEFAULT_SIMPLE_COMPOSITION.showBirthPointMarker,
    birthPointLongitudeDeg: original.birthPointLongitudeDeg ?? DEFAULT_SIMPLE_COMPOSITION.birthPointLongitudeDeg,
    birthPointLatitudeDeg: original.birthPointLatitudeDeg ?? DEFAULT_SIMPLE_COMPOSITION.birthPointLatitudeDeg,
    birthPointMarkerSize: original.birthPointMarkerSize ?? DEFAULT_SIMPLE_COMPOSITION.birthPointMarkerSize,
    birthPointMarkerColor: original.birthPointMarkerColor ?? DEFAULT_SIMPLE_COMPOSITION.birthPointMarkerColor,
    birthPointAlphaDeg: original.birthPointAlphaDeg ?? DEFAULT_SIMPLE_COMPOSITION.birthPointAlphaDeg,


    // 季节模式
    useSeasonalVariation: original.useSeasonalVariation ?? DEFAULT_SIMPLE_COMPOSITION.useSeasonalVariation,
    obliquityDeg: original.obliquityDeg ?? DEFAULT_SIMPLE_COMPOSITION.obliquityDeg,
    seasonOffsetDays: original.seasonOffsetDays ?? DEFAULT_SIMPLE_COMPOSITION.seasonOffsetDays,

    // 地表细节 LOD
    earthDetailLOD: original.earthDetailLOD ?? DEFAULT_SIMPLE_COMPOSITION.earthDetailLOD,
    earthNearDistance: original.earthNearDistance ?? DEFAULT_SIMPLE_COMPOSITION.earthNearDistance,
    earthFarDistance: original.earthFarDistance ?? DEFAULT_SIMPLE_COMPOSITION.earthFarDistance,

    // 阴影与细分控制
    enableTerrainShadow: original.enableTerrainShadow ?? DEFAULT_SIMPLE_COMPOSITION.enableTerrainShadow,
    enableCloudShadow: original.enableCloudShadow ?? DEFAULT_SIMPLE_COMPOSITION.enableCloudShadow,
    cloudShadowStrength: original.cloudShadowStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudShadowStrength,
    useSegLOD: original.useSegLOD ?? DEFAULT_SIMPLE_COMPOSITION.useSegLOD,
    earthSegmentsBase: original.earthSegmentsBase ?? DEFAULT_SIMPLE_COMPOSITION.earthSegmentsBase,
    earthSegmentsHigh: original.earthSegmentsHigh ?? DEFAULT_SIMPLE_COMPOSITION.earthSegmentsHigh,
    segLODTriggerSize: original.segLODTriggerSize ?? DEFAULT_SIMPLE_COMPOSITION.segLODTriggerSize,
    
    // 地形投影参数扩展
    directionalShadowSharpness: original.directionalShadowSharpness ?? DEFAULT_SIMPLE_COMPOSITION.directionalShadowSharpness,
    directionalShadowContrast: original.directionalShadowContrast ?? DEFAULT_SIMPLE_COMPOSITION.directionalShadowContrast,
    
    // 云层场景感知控制
    cloudSceneAware: original.cloudSceneAware ?? DEFAULT_SIMPLE_COMPOSITION.cloudSceneAware,
    cloudPanoramaLayers: original.cloudPanoramaLayers ?? DEFAULT_SIMPLE_COMPOSITION.cloudPanoramaLayers,
    cloudCloseupLayers: original.cloudCloseupLayers ?? DEFAULT_SIMPLE_COMPOSITION.cloudCloseupLayers,
    cloudSceneTransitionDistance: original.cloudSceneTransitionDistance ?? DEFAULT_SIMPLE_COMPOSITION.cloudSceneTransitionDistance,
    
    // 全景场景参数
    cloudPanoramaThickness: original.cloudPanoramaThickness ?? DEFAULT_SIMPLE_COMPOSITION.cloudPanoramaThickness,
    cloudPanoramaThicknessLayers: original.cloudPanoramaThicknessLayers ?? DEFAULT_SIMPLE_COMPOSITION.cloudPanoramaThicknessLayers,
    cloudPanoramaThicknessVariation: original.cloudPanoramaThicknessVariation ?? DEFAULT_SIMPLE_COMPOSITION.cloudPanoramaThicknessVariation,
    
    // 近景场景参数
    cloudCloseupUseVolumeScattering: original.cloudCloseupUseVolumeScattering ?? DEFAULT_SIMPLE_COMPOSITION.cloudCloseupUseVolumeScattering,
    cloudCloseupVolumeDensity: original.cloudCloseupVolumeDensity ?? DEFAULT_SIMPLE_COMPOSITION.cloudCloseupVolumeDensity,
    cloudCloseupScatteringStrength: original.cloudCloseupScatteringStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudCloseupScatteringStrength,
    
    // 体积散射参数
    cloudUseVolumeScattering: original.cloudUseVolumeScattering ?? DEFAULT_SIMPLE_COMPOSITION.cloudUseVolumeScattering,
    cloudVolumeDensity: original.cloudVolumeDensity ?? DEFAULT_SIMPLE_COMPOSITION.cloudVolumeDensity,
    cloudScatteringStrength: original.cloudScatteringStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudScatteringStrength,
    cloudScatteringG: original.cloudScatteringG ?? DEFAULT_SIMPLE_COMPOSITION.cloudScatteringG,
    cloudRimEffect: original.cloudRimEffect ?? DEFAULT_SIMPLE_COMPOSITION.cloudRimEffect,
    cloudDensityEnhancement: original.cloudDensityEnhancement ?? DEFAULT_SIMPLE_COMPOSITION.cloudDensityEnhancement,
    cloudScatteringColor: original.cloudScatteringColor ?? DEFAULT_SIMPLE_COMPOSITION.cloudScatteringColor,
    cloudNoiseScale: original.cloudNoiseScale ?? DEFAULT_SIMPLE_COMPOSITION.cloudNoiseScale,
    cloudNoiseStrength: original.cloudNoiseStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudNoiseStrength,
    
    // 厚度映射参数
    cloudUseThicknessMapping: original.cloudUseThicknessMapping ?? DEFAULT_SIMPLE_COMPOSITION.cloudUseThicknessMapping,
    cloudThicknessScale: original.cloudThicknessScale ?? DEFAULT_SIMPLE_COMPOSITION.cloudThicknessScale,
    cloudThicknessBias: original.cloudThicknessBias ?? DEFAULT_SIMPLE_COMPOSITION.cloudThicknessBias,
    cloudThicknessPower: original.cloudThicknessPower ?? DEFAULT_SIMPLE_COMPOSITION.cloudThicknessPower,
    
    // 菲涅尔效果参数
    cloudUseFresnel: original.cloudUseFresnel ?? DEFAULT_SIMPLE_COMPOSITION.cloudUseFresnel,
    cloudFresnelPower: original.cloudFresnelPower ?? DEFAULT_SIMPLE_COMPOSITION.cloudFresnelPower,
    cloudFresnelStrength: original.cloudFresnelStrength ?? DEFAULT_SIMPLE_COMPOSITION.cloudFresnelStrength,
    // 菲涅尔曲线控制参数
    cloudCurvePowerA: original.cloudCurvePowerA ?? DEFAULT_SIMPLE_COMPOSITION.cloudCurvePowerA,
    cloudCurvePowerB: original.cloudCurvePowerB ?? DEFAULT_SIMPLE_COMPOSITION.cloudCurvePowerB,
    cloudCurveMixPoint: original.cloudCurveMixPoint ?? DEFAULT_SIMPLE_COMPOSITION.cloudCurveMixPoint,
    
    // 性能控制
    cloudLODEnabled: original.cloudLODEnabled ?? DEFAULT_SIMPLE_COMPOSITION.cloudLODEnabled,
    cloudPerformanceMode: original.cloudPerformanceMode ?? DEFAULT_SIMPLE_COMPOSITION.cloudPerformanceMode,
  };
}
