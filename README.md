 # 🌍 地球月球场景 - 单一光源版本

这是从原项目迁移的单一光源地球月球场景，保留了所有核心渲染效果，简化了光照系统架构。

## 🎯 项目特点

- **单一光源管理** - 简化的光照系统，易于控制和调节
- **完整的地球渲染** - 日/夜景混合、云层、大气效果、晨昏线
- **真实的月球系统** - 基于天文数据的月相和位置
- **灵活的相机控制** - 支持多种构图和视角
- **高质量贴图支持** - 8K/2K地球、月球、云层贴图

## 🚀 快速开始

### 公网地址与大小写规则（交接约定）

**统一主地址：[https://aitoshuu.me/LuBirth/](https://aitoshuu.me/LuBirth/)。公开路径固定使用驼峰 `LuBirth`，并以 `/` 结尾。**

| 入口 | 访问规则 |
| --- | --- |
| `aitoshuu.me/LuBirth/` | 主地址，直接提供应用 |
| `tongye.me/LuBirth`、`tongye.me/LuBirth/` | 通过 HTTP 308 跳转到主地址，地址栏同步显示主地址 |
| 两个域名的 `/lubirth`、`/lubirth/` 及其他大小写变体 | 保持可访问，通过 HTTP 308 统一到 `/LuBirth/` |
| `aitoshuu.me/LuBirth` | 通过 HTTP 308 补齐末尾 `/` |

跳转必须保留子路径和查询参数；浏览器继承原链接的锚点（`#...`，不会发送给服务器）。例如，`https://tongye.me/lubirth?scene=sky&history=1#case-check` 最终显示为 `https://aitoshuu.me/LuBirth/?scene=sky&history=1#case-check`。

新增导航、分享链接、canonical、Open Graph、结构化数据、`llms.txt`、`sitemap.xml` 和本地 Vite 默认 `base` 均统一使用 `/LuBirth/`。小写路径仅作为公网兼容入口，不再作为新的主地址。

维护入口：[主站路由](deploy/nginx/aitoshuu-lubirth-routes.inc)、[转发站路由](deploy/nginx/tongye-lubirth-routes.inc)、[公网发布校验](deploy/verify-public-release.mjs)。调整路由后须验证两个域名、大小写兼容、末尾斜杠、子路径、查询参数与锚点，确认无跳转循环；已验证行为见[上线验收记录](docs/deployment/lubirth-camel-route-2026-10-26.md)。

### 地月与当地天空联动

地月和观天共用一份 UTC 与地点。太阳保持固定方位，仰角随真实太阳赤纬变化；地球、恒星背景和真实月球通过同一个天文坐标变换对齐。地轴保持直立，相机与星空独立于地球。

月球默认采用「合影位置」，方便沉浸观看；「画面设置／画面 → 月球位置」可切换为「真实位置」。真实模式保持物理位置、月距和尺寸比例，可能不在当前画面中；点「定位月球」主动转向当地天空，地平线下会提示。两种模式共用月相与天文状态；月面姿态和纹理仍有近似，真实位置不代表完整模拟天平动。

古今同源中，只有缺少时刻的具体事件默认按所选地点晚上 20:00 演示，并明确标记「默认演示」；人物出生及个人出生输入不自动补时刻。默认沿用地方平太阳时解释，也可指定 UTC 偏移。默认演示不会改写史料记录，地点与日期确认仍然必需。

选择历史记录后，沿用出生合照的构图呈现所选地理位置与对应月相，直接进入沉浸地月近景；可再从「从此地观天」进入当地天空。地月背景默认开启所选文化的星官连线及可用图绘，保持真实星位与视场裁切；切换文化保持当前视图。

「观天」保留已有视角；「从出生点观天」首次进入面向当地北方；「定位月球」才主动改变目标。个人和历史观察分别保存地月／观天的构图，月球位置偏好跨视图保留。

地月画面中的「截图 → 制作纪念卡」会冻结当前截图、观测信息和月球模式，在浏览器内合成图片。提供「天地初见」「天地与你」「与古人同望」三套固定手写模板，可保存 PNG 或三套 ZIP；历史卡保留演示时刻说明。Loading 共用这三套离线笔迹资源，支持减少动态；当前没有自定义手写生成服务。

设计及验收见 `docs/plans/2026-10-23-002-feat-earth-sky-spatial-link-plan.md` 和 `docs/handoff/2026-10-24-earth-sky-spatial-integration.md`。核心回归：`node scripts/test-celestial-frames.mjs`、`node scripts/test-view-bridge.mjs`、`node scripts/test-moon-placement.mjs`、`node scripts/compare-celestial-reference.mjs`。日月独立参考冻结于 NASA/JPL Horizons；离线比较不会发起网络请求。

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

手机竖屏使用上方场景和底部可收起的面板，横屏使用左右布局。地点、时间、对齐、截图及音乐均可在手机上使用。面板中的“画面品质”提供均衡、省电、细腻三档；手机默认均衡档全景使用 2K 贴图、最多 192 段地球网格、3 层云与 30 FPS 渲染目标。放大后仅夜景升级为 4K，强度保持 3.0；省电档仍使用 2K。切到后台会暂停渲染。画质配置集中在 `src/performance/renderProfile.ts`，贴图加载策略在 `src/scenes/simple/utils/textureLoader.ts`。

按“Xiu!!!”进入放大后的月地同框；手机可在折叠面板中点“开启体感”，允许浏览器访问设备姿态后用倾斜驱动视差。“重校准”以当前手持角度为中心；无法获取传感器时，画面保持静态。视差仅改变观察相机及月球的展示偏移，不修改天文位置、月相或太阳方向。近景按需加载 `public/models/nasa-moon-topo-128.glb`，普通视图仍使用原有球体。模型从 [NASA SVS 14959](https://svs.gsfc.nasa.gov/14959/) 的地形 GLB 重采样为 16,384 个三角面，并将内嵌彩色图降为 2K；生成脚本为 `scripts/build_nasa_moon.py`（需 numpy、scipy、Pillow）。模型署名：NASA's Goddard Space Flight Center；此署名不表示 NASA 对本站背书。

进入放大视图时会清除全景动画累积的自转余量，恢复日期对应的地球朝向，使出生地标继续按既定 70° 参数左右居中。

地名标注按月球模型的实际投影边界保留至少 16px 间距；空间较紧时缩短针身，矮屏则将地名放到锚点下方。文字大小、地理锚点、月球位置和地球占比不随避让改变。`node --experimental-strip-types scripts/verify-marker-layout.mjs` 验证标注布局，`scripts/verify-closeup-composition.mjs` 验证原构图与地标参数。

手机面板使用独立的可见构图区域；相机控制模块持有该区域的投影，避免自适应分辨率或品质切换将宽高比覆盖为整块画布，造成地月画面被拉伸。`getLuBirthPerformance().projectionAspect` 可与画布的 CSS 宽高比对照检查。

本地构建产物位于 `dist/`，Vite 的 `base` 为 `/LuBirth/`，公网地址遵循上方「公网地址与大小写规则」。正式发布通过 `deploy/package-release.mjs --output <仓库外目录>` 生成不可变版本：HTML 和版本标记放在阿里源站，资源通过腾讯 COS 的约定前缀及 `assets.aitoshuu.me`、`media.aitoshuu.me` 提供。依次运行仓库的上传 wrapper、CDN 验证、源站暂存与切换、公开地址验证；凭证仅由 wrapper 在进程内从 Keychain 使用。`--source-ref <HEAD commit>` 要求发布输入已提交。未被页面引用的 `public/sfx/` 音效草稿不进入发布包。

若默认资源域名证书异常，可用 `--assets-host media.aitoshuu.me` 让静态资源经同一存储桶已有的媒体 CDN 交付。仅允许这两个既有域名；所选域名计入版本摘要，上传和校验仍限定本次不可变版本前缀，保持 HTTPS 验证。

界面玻璃通过当前帧的 GPU 纹理副本实现局部折射；材质、背景扩散与唯一的光学边缘统一由 `LiquidGlassRenderer` 绘制，DOM 负责文字和普通控件，不再叠加玻璃边框、内阴影或内圈高光。面板、音乐按钮外壳和工具条统一使用清透材质，基础深色覆盖率为 14%，亮背景时自适应加深；外壳为 12px 小圆角矩形，按钮为 8px 小圆角矩形。Xiu 使用半透明填充和一条边缘，共享面板已有的玻璃，不额外叠加折射层。每帧不重复渲染地月场景；省电、减少透明度及增强对比设置会跳过界面折射，使用单层 CSS 实色后备；地标仍按自己的透明度偏好决定是否复用副本。“隐藏 UI”与“全屏查看”是独立操作，恢复设置会保留地点和时间输入。截图调用 `captureLuBirth()`，只输出干净场景。`getLuBirthPerformance()` 可检查玻璃绘制次数、纹理字节数与场景资源。

海面反光包含正视角的低反射底值，并保留原有菲涅尔高光铺展；地缘 rim 与大气弧光沿用原有强度和厚度，手机与桌面使用同一套效果参数。月面结合 Lambert 与 Lommel–Seeliger 近似保留地形层次；这属于视觉材质近似，不是辐射标定模型，几何月相仍由原天文算法确定。

### 性能诊断

均衡档统一以 30 FPS 为目标，细腻档为 60 FPS，省电档为 24 FPS。高 DPI 窗口受总像素预算约束，并按持续帧率缓慢调整实际 DPR；界面文字仍由浏览器按原生分辨率绘制。`getLuBirthPerformance()` 的 `frames`、`measuredFps`、`effectiveDpr` 可用于实测，目标帧率不等于实际帧率。运行 `node --experimental-strip-types scripts/test-adaptive-resolution.mjs` 可验证分辨率策略边界。

地形 AO 与夜光模糊使用 UV 缓存，相关纹理/参数改变时重算；太阳方向、地形法线和边缘光保持实时。2K 资源先加载基础地月画面，再加载细节；`scripts/compress-textures.py` 可用 libwebp 重建优先 WebP，高度/高光/法线保持无损，压缩后更大则保留 JPEG。`scripts/build_closeup_night_texture.py` 用 libwebp 从已有 8K 夜景生成独立 4K 资源，避免放大时解码整张 8K 图；升级就绪前继续显示 2K，随后释放旧纹理。夜光模糊为 0.002、发光层不透明度为 0.35，保留城市灯点。加载提示显示真实基础资源完成数，并提供慢连接重试及月球地形状态。

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
- 构图对齐：将某经纬度（如出生点）放到中央经线、约北纬 70° 的构图区（ShotRig）
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

### 2) 构图对齐 ShotRig（中央经线 + 约北纬 70° 构图）

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
- 横向把目标经度放到中央经线；纵向按目标纬度构图，客户端放大视图默认使用约 70°N。
- 适用于一键把出生点放到画面上部中央的构图需求。

使用示例：

```ts
import { createShotRig } from '@/scenes/simple/api/shotRig';

const { rig, alignToLatLon } = createShotRig();
// 假设 earthMesh 是地球根节点对象，camera 为主相机
alignToLatLon(earthMesh, camera, { targetLatDeg: 70, targetLonDeg: 180 });
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
- 月面使用中性光色，NASA 贴图保留少量原始色差，并经过标准色彩空间输出；屏幕锚定月球在透明星空之后绘制，避免星空层压暗月面。夜面仅保留极弱轮廓，避免将新月显示成亮球。
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
