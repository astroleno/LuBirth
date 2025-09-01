# 出生纪念 · 地月合影（MVP）

npm run build && npm run preview 正式版

极简版「地月合照」生成：基于出生地与时间，计算真实太阳/月球方向与月相，并以艺术化比例呈现地球弧线与完整月亮的同框静帧画面（2K）。

## 技术栈

- 前端框架: React 18 + TypeScript + Vite
- 3D 渲染: Three.js, React Three Fiber (`@react-three/fiber`), drei（基础特效：ACES 色调映射、轻半球光、星空）
- 天文计算: `astronomy-engine`（Sun/Moon 向量、坐标变换、月相）
- 样式: 极简原子化样式（`src/styles.css`），系统字体/Inter

## MVP 范围

- 目标：静态海报式地月同框画面，素雅高级、低饱和、苹果风。
- 输入：经纬度（默认上海 31.2304, 121.4737），日期与时间（本地），时区由经度整点推导（`round(lon/15)`）。
- 物理约束：
  - 真实太阳方向与月相（来自 Astronomy Engine），同一方向光用于地球与月球。
  - 允许艺术化压缩月地距离（默认 ~10R）、放大月球相对尺寸（默认 0.33R）。
  - 画面保持"北朝上"：将给定地点对准画面中心（经纬可见），不滚转。

## 构图参数（艺术模式，当前默认）

- 地球：半径约 3.0（单位），自动将地球顶部对齐至屏幕 1/3 高度；
- 月亮：屏幕位置约 (x=72%, y=70%)，距相机约 14 单位，较小、完整可见（满月效果）；
- 光照：主光沿相机方向，确保可见半球明亮；
- 模式切换：后续提供"真实方位模式"，基于 Astronomy Engine 放置 Sun/Moon，入框时做最小偏置。

## 项目结构

- `src/astro/ephemeris.ts` 天文/时间核心：
  - `computeEphemeris(dateUtc, lat, lon)` → Sun/Moon/Observer 的 EQD 向量与月相。
  - `toUTCFromLocal(localISO, lon)` 根据经度粗略推时区，转 UTC。
- `src/scene/Scene.tsx` 场景：
  - 以观察者向量构建朝向基（右、上、前），对齐地点到画面中心并保持北朝上（上北下南）。
  - 地球/月球球体、方向光 + 轻半球光、星空背景、暗色地点 marker（极简）。
- `src/App.tsx` UI：输入经纬度与时间，小面板"应用"。

## 开发与运行

1) 安装依赖

```bash
npm i
```

2) 启动开发服务器

```bash
npm run dev
```

3) 打包

```bash
npm run build && npm run preview
```

## 资产（可选增强）

当前为极简材质（无贴图），通过方向光表现晨昏线与月相，保证风格统一。若需更真实：

- 将以下文件放入 `public/textures/` 目录，然后在面板勾选"贴图增强"：
  - 地球：`2k_earth_daymap.jpg`，可选 `8k_earth_daymap.jpg`
  - 月球：`2k_moon.jpg`，可选 `8k_moon.jpg`
  - 云层（可选）：`2k_earth_clouds.jpg` 或 `8k_earth_clouds.jpg`
  - 银河星空（可选）：`2k_stars_milky_way.jpg` 或 `8k_stars_milky_way.jpg`
  - 法线/高光（可选）：将 `*_normal_map.tif`、`*_specular_map.tif` 转成 PNG/JPG（浏览器不支持 TIF），文件名保持 `*_normal_map.png/.jpg`、`*_specular_map.png/.jpg`
 贴图缺失时自动回退到极简材质，不会报错。
- `public/textures/stars_2k.hdr`（静态星空）

接入贴图后，建议保持低饱和与柔和对比，避免喧宾夺主。

## 关键算法说明

- 坐标系：使用 Astronomy Engine 的 EQD（equator-of-date）。
- 方向变换：`Rotation_EQJ_EQD(time) + RotateVector` 将 Sun/Moon 由 EQJ 转至 EQD。
- 视图对齐：
  - 观察者向量 `ObserverVector(time, {lat, lon, h:0}, true)` 在 EQD 中指向给定地表点。
  - 构造基向量：`f = -observer`, `right = normalize(cross(north, f))`（north=+Z），`up = cross(f,right)`。
  - 以该基构造旋转，使地点处于画面中心且"北朝上"。

## 解耦渲染系统 (test/decoupled/)

### 问题背景
原始场景中存在多种环境光作为"兜底光源"：
- `hemisphereLight` (半球光) - 影响所有物体
- `ambientLight` (环境光) - 全局环境补光
- `dayAmbient` 参数控制的日侧环境补光

这些环境光会干扰解耦渲染，导致无法实现真正的光照隔离。

### 解决方案
创建了完全隔离的双画布渲染系统：

#### 核心文件
- `IsolatedDualCanvas.tsx` - 完全隔离的双画布渲染系统
- `isolated-test.tsx` - 测试入口文件，包含交互控制面板
- `ambient-diagnostic.tsx` - 环境光诊断工具

#### 技术特点
1. **完全隔离的光照系统**
   - 地球层：只受左侧定向光影响，无任何环境光
   - 月球层：只受太阳→月球定向光影响，无任何环境光
   - 使用自定义Shader，避免Three.js内置光照系统

2. **环境光清理机制**
   - 自动检测和清理所有环境光
   - 实时监控环境光变化
   - 确保两层渲染完全独立

3. **独立的光照计算**
   - 地球层：使用 `sunAzDeg` 和 `sunElDeg` 计算左侧光源方向
   - 月球层：使用真实的天文数据计算太阳→月球方向
   - 强度控制：`sunIntensityEarth` 和 `sunIntensityMoon` 独立控制

#### 使用方法
```bash
# 启动开发服务器
npm run dev

# 访问测试页面
# 完全隔离解耦测试: test/decoupled/isolated-test.html
# 环境光诊断工具: test/decoupled/ambient-diagnostic.html
```

#### 验证效果
1. 将地球光照强度设为0，月球光照强度设为1
   - 结果：地球完全黑暗，月球正常发光
2. 将月球光照强度设为0，地球光照强度设为1
   - 结果：月球完全黑暗，地球正常发光
3. 调整左侧光角度
   - 结果：只有地球的光照方向改变，月球不受影响

### 技术优势
- **完全隔离**：两层渲染完全独立，无光照干扰
- **精确控制**：每个球体只受指定的光源影响
- **性能优化**：使用自定义Shader，避免Three.js内置光照系统的开销

## 待办/下一步（建议）

- 加入 2K 贴图与简易大气辉光（后处理轻量 bloom）。
- 为移动端横屏优化尺寸与像素密度，提供 2K 导出 PNG。
- 允许切换模板（左月/右月、文案排版）。
- 将完全隔离的解耦渲染系统集成到主应用中。

## 免责声明

本版本为 MVP 演示，未包含地理编码、视频导出与社交卡片等功能。月地距离做艺术化压缩，月相与光照方向保持真实。
