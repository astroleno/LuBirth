 # 🌍 地球月球场景 - 单一光源版本

这是从原项目迁移的单一光源地球月球场景，保留了所有核心渲染效果，简化了光照系统架构。

## 🎯 项目特点

- **单一光源管理** - 简化的光照系统，易于控制和调节
- **完整的地球渲染** - 日/夜景混合、云层、大气效果、晨昏线
- **真实的月球系统** - 基于天文数据的月相和位置
- **灵活的相机控制** - 支持多种构图和视角
- **高质量贴图支持** - 8K/2K地球、月球、云层贴图

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 手机网页与发布

手机竖屏使用上方场景和底部可收起的面板，横屏使用左右布局。地点、时间、对齐、截图及音乐均可在手机上使用。面板中的“画面品质”提供均衡、省电、细腻三档；手机默认均衡档使用 2K 贴图、最多 192 段地球网格、3 层云与 30 FPS 渲染目标。切到后台会暂停渲染。画质配置集中在 `src/performance/renderProfile.ts`，贴图加载策略在 `src/scenes/simple/utils/textureLoader.ts`。

按“Xiu!!!”进入放大后的月地同框；手机可在折叠面板中点“开启体感”，允许浏览器访问设备姿态后用倾斜驱动视差。“重校准”以当前手持角度为中心；无法获取传感器时，画面保持静态。视差仅改变观察相机及月球的展示偏移，不修改天文位置、月相或太阳方向。近景按需加载 `public/models/nasa-moon-topo-128.glb`，普通视图仍使用原有球体。模型从 [NASA SVS 14959](https://svs.gsfc.nasa.gov/14959/) 的地形 GLB 重采样为 16,384 个三角面，并将内嵌彩色图降为 2K；生成脚本为 `scripts/build_nasa_moon.py`（需 numpy、scipy、Pillow）。模型署名：NASA's Goddard Space Flight Center；此署名不表示 NASA 对本站背书。

本地构建产物位于 `dist/`，Vite 的 `base` 为 `/lubirth/`。正式发布通过 `deploy/package-release.mjs --output <仓库外目录>` 生成不可变版本：HTML 和版本标记放在阿里源站，资源通过腾讯 COS 的约定前缀及 `assets.aitoshuu.me`、`media.aitoshuu.me` 提供。依次运行仓库的上传 wrapper、CDN 验证、源站暂存与切换、公开地址验证；凭证仅由 wrapper 在进程内从 Keychain 使用。`--source-ref <HEAD commit>` 要求发布输入已提交。未被页面引用的 `public/sfx/` 音效草稿不进入发布包。

界面玻璃通过当前帧的 GPU 纹理副本实现局部折射，文字保持独立清晰，控件保留小圆角矩形。每帧不重复渲染地月场景；省电、减少透明度及增强对比设置会跳过折射并释放副本。“隐藏 UI”与“全屏查看”是独立操作，恢复设置会保留地点和时间输入。截图调用 `captureLuBirth()`，只输出干净场景。`getLuBirthPerformance()` 可检查玻璃绘制次数、纹理字节数与场景资源。

海面反光包含正视角的低反射底值，并保留原有菲涅尔高光铺展；地缘 rim 与大气弧光沿用原有强度和厚度，手机与桌面使用同一套效果参数。月面结合 Lambert 与 Lommel–Seeliger 近似保留地形层次；这属于视觉材质近似，不是辐射标定模型，几何月相仍由原天文算法确定。

### 性能诊断

均衡档统一以 30 FPS 为目标，细腻档为 60 FPS，省电档为 24 FPS。高 DPI 窗口受总像素预算约束，并按持续帧率缓慢调整实际 DPR；界面文字仍由浏览器按原生分辨率绘制。`getLuBirthPerformance()` 的 `frames`、`measuredFps`、`effectiveDpr` 可用于实测，目标帧率不等于实际帧率。运行 `node --experimental-strip-types scripts/test-adaptive-resolution.mjs` 可验证分辨率策略边界。

地形 AO 与夜光模糊使用 UV 缓存，相关纹理/参数改变时重算；太阳方向、地形法线和边缘光保持实时。2K 资源先加载基础地月画面，再加载细节；`scripts/compress-textures.py` 可用 libwebp 重建优先 WebP，高度/高光/法线保持无损，压缩后更大则保留 JPEG。加载提示显示真实基础资源完成数，并提供慢连接重试及月球地形状态。

普通访问不加载天文测试模块；需要时在控制台 `await runSolarFullTests()` 或 `await runMoonPhaseAutoTests()`，首次调用会按需加载。`?autotest=1`、`?fulltest=1` 仍可触发测试。`cloudLayersDebug.getPerformance()` 的 `reactRenders` 可检查体感运动是否触发云层重复更新；`getLuBirthPerformance()` 可观察纹理、几何与绘制次数。

云层仅在相机跨越近远景阈值时更新 React 状态；月球逐帧计算复用向量与四元数。地球使用现有 DEM 法线，不再下载未启用的传统法线图。关闭云层时先解除阴影贴图引用再释放资源，避免反复开关后显存占用增长。

## 📁 项目结构

```
neo/
├── src/
│   ├── scene/           # 场景组件
│   │   ├── Scene.tsx   # 主场景（单一光源版本）
│   │   ├── MoonBaker.tsx # 月球烘焙器
│   │   └── MoonWrapper.tsx # 月球包裹球
│   ├── astro/          # 天文计算
│   │   └── ephemeris.ts # 星历计算
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 应用入口
│   └── styles.css      # 样式文件
├── public/             # 静态资源
│   └── textures/       # 贴图文件
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
└── README.md           # 项目说明
```

## 🎨 核心功能

### 地球渲染
- **日/夜景混合** - 基于光照方向的自动切换
- **云层系统** - 带光照的云层渲染，支持偏移控制
- **大气效果** - 弧光、辉光、近表面halo
- **晨昏线** - 可调节的晨昏线柔和度和亮度

### 月球系统
- **真实位置** - 基于天文数据的月球位置计算
- **月相显示** - 自动计算月相和光照
- **高度贴图** - 支持月球表面细节
- **烘焙渲染** - 高质量月球渲染

### 相机控制
- **灵活构图** - 支持多种地球和月球位置
- **分层渲染** - 地球和月球独立渲染层
- **视角控制** - 支持多种观察角度

## ⚙️ 配置参数

### 基础设置
- `earthSize` - 地球屏幕大小比例
- `moonScreenX/Y` - 月球屏幕位置
- `moonDist` - 月球距离
- `useTextures` - 是否启用贴图

### 光照控制
- `lightAzDeg` - 光源方位角 [0-360°]
- `lightElDeg` - 光源仰角 [-90°到90°]
- `lightIntensity` - 光照强度 [0-5]
- `lightTempK` - 色温 [2000K-10000K]

### 渲染效果
- `cloudStrength` - 云层强度
- `rimStrength` - 弧光强度
- `earthGlowStrength` - 地球辉光强度
- `terminatorSoftness` - 晨昏线柔和度

## 🔧 技术栈

- **React 18** - 用户界面框架
- **Three.js** - 3D图形库
- **React Three Fiber** - React的Three.js集成
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速构建工具

## 📚 使用说明

### 1. 基础场景设置
```typescript
import { EarthMoonScene } from './scene/Scene';

<EarthMoonScene
  comp={{
    earthSize: 0.33,
    moonScreenX: 0.5,
    moonScreenY: 0.78,
    lightAzDeg: 180,
    lightElDeg: 23.44,
    lightIntensity: 1.3
  }}
  mode="celestial"
/>
```

### 2. 天文模式
天文模式会自动计算太阳和月球位置，适合展示真实的天文现象。

### 3. 手动模式
手动模式允许精确控制光照方向和强度，适合艺术创作和教学演示。

## 🧩 新增接口与接入指南（2024-12-19）

本版本在移除“地球辉光”渲染后，新增了三套可直接调用的接口，分别用于：

- 日期→地球/日月状态（世界系方向向量）
- 构图对齐：将某经纬度（如出生点）旋到画面上沿并居中（ShotRig）
- 日期→月相（明亮比例与相位角）

### 1) 日期→地球状态

文件：`src/scenes/simple/api/earthState.ts`

导出：

```ts
type EarthState = {
  sunDirEQD: { x: number; y: number; z: number };
  moonDirEQD: { x: number; y: number; z: number };
  illumination: number; // 月面明亮比例 0..1
};

function getEarthState(localISO: string, latDeg: number, lonDeg: number): EarthState;
```

说明：
- 传入“本地时间字符串（形如 YYYY-MM-DDTHH:mm）+ 观察者经纬度”，自动换算为 UTC 并调用 `astronomy-engine`，返回世界系（EQD）中的太阳/日月方向向量（已归一化）与月相明亮比例。
- 这些向量可直接用于单光照系统（如 `directionalLight` 的方向或材质 uniform）。

使用示例：

```ts
import { getEarthState } from '@/scenes/simple/api/earthState';

const state = getEarthState('2024-12-19T12:00', 31.2, 121.5);
// state.sunDirEQD 可直接作为光照方向来源
```

### 2) 构图对齐 ShotRig（将经纬度旋到屏幕上沿并居中）

文件：`src/scenes/simple/api/shotRig.ts`

导出：

```ts
type ShotRigParams = { targetLatDeg: number; targetLonDeg: number };

function createShotRig(): {
  rig: THREE.Group;
  alignToLatLon: (earth: THREE.Object3D, camera: THREE.Camera, params: ShotRigParams) => void;
};
```

说明：
- 两步四元数对齐：先把目标地面法线旋到世界 +Y（画面上沿），再绕世界 +Y 旋转，使经线指向屏幕正前，从而保证“目标经纬位于画面上沿且地球居中”。
- 适用于一键“出生点→80°N, 180°E 并居中”的构图需求。

使用示例：

```ts
import { createShotRig } from '@/scenes/simple/api/shotRig';

const { rig, alignToLatLon } = createShotRig();
// 假设 earthMesh 是地球根节点对象，camera 为主相机
alignToLatLon(earthMesh, camera, { targetLatDeg: 80, targetLonDeg: 180 });
```

### 3) 日期→月相

文件：`src/scenes/simple/api/moonPhase.ts`

导出：

```ts
type MoonPhaseInfo = {
  illumination: number;     // 0..1 明亮比例
  phaseAngleRad: number;    // 相位角（弧度）
};

function getMoonPhase(localISO: string, latDeg: number, lonDeg: number): MoonPhaseInfo;
```

说明：
- 月相统一使用 `astronomy-engine` 的 `Illumination` 与 `MoonPhase`：物理相位角为满月 0°、新月 180°；月相周期角为新月 0°、上弦 90°、满月 180°、下弦 270°。UI 与材质共用同一结果。
- 相机锁定展示采用盈月右亮、亏月左亮的固定图示方向，明亮比例按地心月相计算；不模拟当地地平线倾角、天平动或月食。输入时间仍按现有经度时区规则转换为 UTC。
- 月面使用中性光色，NASA 贴图保留少量原始色差，并经过标准色彩空间输出；夜面仅保留极弱轮廓，避免将新月显示成亮球。
- `runMoonPhaseAutoTests()` 包含 [USNO 2026 年月相时刻](https://aa.usno.navy.mil/api/moon/phases/year?year=2026) 的独立日期对照、明亮面积、盈亏方向及本地时间转换回归。

使用示例：

```ts
import { getMoonPhase } from '@/scenes/simple/api/moonPhase';

const phase = getMoonPhase('2024-12-19T12:00', 31.2, 121.5);
// phase.illumination / phase.phaseAngleRad
```

### 4) 接入主程序建议

在 `SimpleTest.tsx` 中：
- 使用 `getEarthState()` 更新光照方向（例如保存到 `sunEQD` 状态后传入 `useLightDirection`）。
- 提供按钮调用 `createShotRig().alignToLatLon(earth, camera, { targetLatDeg: 80, targetLonDeg: 180 })` 完成一键构图。
- 使用 `getMoonPhase()` 将 `illumination/phaseAngle` 同步到 UI，或透传给月球材质以控制明暗过渡与高光。

### 5) 变更说明

- 按需求“完全移除地球辉光渲染”。保留大气弧光与近表面软光晕。UI 如需同步隐藏辉光滑条，可在 `SimpleTest.tsx` 去除对应控件。

## 🎯 迁移说明

### 从原项目迁移的优势
- **架构简化** - 从复杂的双光照系统简化为单一光源
- **功能完整** - 保留了所有核心渲染效果
- **易于维护** - 简化的代码结构，更容易理解和修改
- **性能提升** - 减少光照计算复杂度

### 主要变化
1. **光照系统** - 统一为单一光源管理
2. **参数简化** - 减少了光照相关的复杂参数
3. **代码清理** - 移除了双光照相关的复杂逻辑

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

本项目采用MIT许可证。
