# 月相实现方案评审与建议（LuBirth）

本文评审根目录 `advice月相实现方案.md` 的可行性，并给出与当前仓库实现/约束一致的落地建议（对应 TODO3：M1 固定太阳 → M2 月球 PIP α → M3 一致性与发布）。

## 结论概览
- 可行性：总体方向可行，但应避免“自研天文轨道计算”和“把季节直接并入月相计算”的两类误区。
- 与现状对齐：仓库已集成 astronomy-engine 并提供 `getEarthState()`、`getMoonPhase()`，应优先复用而非重写。
- 关键约束：保持“单一方向光”与轴系/对齐顺序，PIP 不应引入第二盏“月球专用光”（建议用材质/Uniform 实现月相，而非新建 Light）。

## 与仓库现状/约束的对齐
- 固定太阳模式与旋转顺序：已在 `src/SimpleTest.tsx` 的 `AlignOnDemand` 实现“先按 fixedSun yaw 锁定，再 `alignLongitudeOnly()`”；与指南一致。
- 光照方向：统一使用从太阳射向地球的方向 `-sunWorld`；固定模式 `useLightDirection()` 直接使用 `fixedSunDir`；已满足指南。
- 月相/天文：
  - 矢量与方位：`src/astro/ephemeris.ts`、`src/scenes/simple/api/earthState.ts` 输出 `sunDirWorld`、`moonDirWorld`；
  - 月相计算：`src/scenes/simple/api/moonPhase.ts` 直接用 astronomy-engine 的 `Illumination()`；可靠且精度足够。
- PIP：已有两套实现雏形（`SimpleTest.tsx` 内部 `MoonPIP` 与 `src/scenes/simple/components/PhysicalMoonPIP.tsx`）。

## 主要风险与需要修正的观点
- 重新实现轨道/相位（高风险）：方案中定义了 `calculateMoonOrbitalState`/`calculateMoonRotationAngle` 等自研轨道逻辑，易引入偏差；应改为完全复用 astronomy-engine 输出的太阳/月球世界向量与相位。
- “季节影响月相”表述需更严谨：季节（地轴倾角导致的太阳高度变化）不改变“月相明亮比例”，它只影响太阳在天球上的位置与观测几何。使用真实 `sunDirWorld` 和 `moonDirWorld` 后，无需再额外做“季节性月相补偿”。
- EarthYaw ↔ 时间的双向映射：当前实现以真实时间驱动天文向量，再将地球构图对齐至期望经度；反向“由 yaw 推时间”会与对齐逻辑冲突，且引入多源真值。建议避免。
- PIP 专用光源：指南要求“单一方向光”，不要增加第二盏“月球专用光”。若需让 PIP 在 fixedSun 模式下仍呈现真实月相，不应新增 Light；建议用 PIP 材质自带的 `sunWorld` Uniform 做漫反射/晨昏线，而非再挂一盏光。

## 建议的最小实现路线（与 TODO3 对齐）

### M1 固定太阳（保持现状）
- 继续使用 `useLightDirection()` 与 `AlignOnDemand` 的顺序：先 yaw 锁定固定太阳 → 再 `alignLongitudeOnly()`；
- 不在渲染层做“按 altDeg 关灯”；夜面由材质控制；
- 相机与星空保持在地球组之外。

### M2 月球 PIP（α）
- 向量来源：仅使用 `getEarthState()` 的 `sunDirWorld`、`moonDirWorld` 与 `getMoonPhase()` 的 `illumination/phaseAngleRad`。
- PIP 相机：从“地球→月球”的方向看向月球中心（现有 `MoonPIP` 已按 `moonDirWorld` 实现，方向正确）。
- 图层与离屏：沿用 layer=2 + FBO 叠加，主相机仅看 layer 0，PIP 相机只拍 layer 2。
- 光照与月相：为遵循“单一方向光”，不要新增第二盏 PIP 用 Light。
  - 方案A（推荐）：为 PIP 月球材质增加 `sunWorldForPIP` Uniform（真实物理向量），在材质里计算朗伯漫反射与 terminator 过渡，避免依赖 three 的直射光；
  - 方案B（折中）：主直射光在启用 PIP 时 `layers.enable(2)`，但 fixedSun 模式下 PIP 的相位会与真实不符；因此仍推荐方案A。
- 性能：默认低分辨率/降帧（已有 `pip.resolution` 与 `pip.fps`）；目标 <2ms/f。
- 稳定性：避免在 PIP 渲染时直接改动主场景 `moonMesh` 的世界位姿。建议在 layer=2 下维护一个 clone 的 PIP 月球网格，减少在每帧“搬动→还原”的副作用窗口。

### M3 一致性与发布
- Legacy 场景接入固定太阳与 PIP 的同一套向量/材质接口；
- 扩展测试：保留现有 `runSolarAutoTests()`/`runSolarFullTests()`，补充 `moonPhaseAutoTests` 的汇总输出；
- README 增补“固定太阳/季节/PIP”的启用方式与用于截图/导出的参数。

## 验收与测试（建议）
- 入口：地址栏 `?autotest=1|fulltest=1` 或控制台 `runSolarAutoTests()/runSolarFullTests()`；
- 固定太阳方位锁定：`runFixedSunAzimuthLockTest()`，检查 `[FixedSunAzTest:JSON] diff <= 1.0`；
- 季节摆动：`runSeasonalAutoTest()`，夏至/冬至仰角约 ±ε（容差 3°）；
- 无倾斜检测：`runNoTiltAutoTest(180)`，检查 `maxTiltDeg ≤ 0.5°`；
- 月相回归：`runMoonPhaseAutoTests()`，检查 `[MoonPhaseTest]` 中新月/满月阈值与四分相近 90°；
- 一键汇总：`runSolarFullTests()` 输出整合 JSON（full + noTilt + fixedSunAz + seasonal + moonPhase）。

## 代码指引（锚点）
- PIP（现有）：
  - `src/SimpleTest.tsx` 中内置 `MoonPIP`（layer=2 + FBO 叠加，方向取 `moonEQD`）。
  - `src/scenes/simple/components/PhysicalMoonPIP.tsx`（可对齐到统一实现：去除 PIP 专用 Light，改 Uniform 着色）。
- 天文/月相：
  - `src/astro/ephemeris.ts`、`src/scenes/simple/api/earthState.ts`、`src/scenes/simple/api/moonPhase.ts`。
- 光照/季节：
  - `src/scenes/simple/utils/lightingUtils.ts` 的 `useLightDirection()` 与 `seasonalSunDirWorldYUp()`。
- 对齐顺序：
  - `src/SimpleTest.tsx` → `AlignOnDemand`。

## 小结
- 方案的总体意图与仓库目标一致，但实现应“少造轮子、强约束一致性”：
  - 用 astronomy-engine 提供的太阳/月球向量与月相；
  - PIP 不新增专用光，以材质 Uniform 计算相位；
  - 保持固定太阳与对齐顺序，星空/相机不入地球组；
  - 以自动化测试兜底，逐步推进 M2 性能与一致性。

