# 自转、晨昏、相机对齐相关代码文件

本文件夹包含了与地球自转、晨昏线、相机对齐功能相关的所有核心代码文件。

## 📁 文件说明

### 核心组件
- **SimpleTest.tsx** - 主测试组件，包含地球自转逻辑、AlignOnDemand系统、出生点对齐功能
- **Earth.tsx** - 地球组件，负责地球渲染和自转应用
- **SimpleComposition.ts** - 类型定义，包含所有配置参数

### 自转相关
- **ephemeris.ts** - 天文计算核心，包含太阳/月球位置计算、坐标转换
- **lightingUtils.ts** - 光照工具，处理太阳光方向和季节变化

### 相机对齐相关
- **birthPointAlignment.ts** - 出生点对齐核心算法
- **positionUtils.ts** - 相机位置和朝向计算工具
- **shotRig.ts** - 相机对齐和地球旋转控制

### 坐标系统相关
- **coordinateDebugger.ts** - 坐标系调试工具
- **coordinateVerifier.ts** - 坐标验证工具

### 月球相关
- **moonPhase.ts** - 月球相位计算
- **moonPhaseCalculator.ts** - 月球相位计算工具

## 🔧 关键修复点

### 地球自转修复
1. **SimpleTest.tsx:205** - 修复硬编码 `yawDeg={0}` → `yawDeg={composition.earthYawDeg}`
2. **Earth.tsx:226** - 添加 `rotation={[0, THREE.MathUtils.degToRad(yawDeg), 0]}`
3. **SimpleTest.tsx:608-610** - 修复时间计算使用UTC时间

### 系统协调修复
4. **SimpleTest.tsx:371-372** - AlignOnDemand不覆盖基础自转
5. **SimpleTest.tsx:758-760** - 出生点对齐不重置地球状态

## 🎯 设计约束

所有修改严格遵循以下设计约束：
1. **太阳光固定原则**：太阳光方向保持不变，只有季相变化
2. **地球自转原则**：地球沿地轴（Y轴）旋转，符合真实物理
3. **时区支持原则**：正确处理不同时区的时间转换
4. **月球解耦原则**：月球位置和相位独立于地球时间系统
5. **纹理映射原则**：贴图seam位于国际日期变更线
6. **相机控制原则**：支持完整的俯仰角、方位角和视点控制

## 📊 文件大小统计

```
SimpleTest.tsx        99,694 bytes  - 主组件
SimpleComposition.ts   18,902 bytes  - 类型定义
ephemeris.ts           19,378 bytes  - 天文计算
birthPointAlignment.ts  9,822 bytes  - 出生点对齐
coordinateDebugger.ts   9,866 bytes  - 坐标调试
coordinateVerifier.ts   9,676 bytes  - 坐标验证
positionUtils.ts        9,192 bytes  - 位置工具
shotRig.ts              5,695 bytes  - 相机控制
lightingUtils.ts        7,483 bytes  - 光照工具
moonPhaseCalculator.ts  6,984 bytes  - 月球计算
Earth.tsx               8,111 bytes  - 地球组件
moonPhase.ts            4,566 bytes  - 月球相位
```

## 🔍 问题分析

这些文件包含了导致以下问题的核心代码：
1. **地球自转失效** - 多套旋转系统相互冲突
2. **晨昏线位置错误** - 时间基准和坐标系统不一致
3. **相机对齐失败** - 坐标转换公式不统一

## 🛠️ 修复状态

- ✅ 地球自转参数传递修复
- ✅ Earth组件yawDeg应用修复
- ✅ UTC时间基准修复
- ✅ AlignOnDemand系统协调修复
- ✅ 出生点对齐状态保持修复

---

**创建时间**：2025-01-14  
**修复状态**：核心问题已修复  
**下一步**：功能验证和测试
