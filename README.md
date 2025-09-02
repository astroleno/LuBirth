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