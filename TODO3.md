# TODO3 — 固定太阳模式落地与部署计划（2025-09）

参考文档：
- 根目录：《固定太阳模式对比分析.md》
- docs：《固定太阳模式与相机极坐标方案暨后续规划.md》

目标：
- 以“固定太阳方向 + 旋转地球”的稳定方案替代“每帧变光”，相机绑定地心极坐标；后续以 PIP 方式固定月球在屏幕位置。

里程碑：
- M1（今日）：useFixedSun 核心落地，单光常亮；自动测试通过。
- M2（+2 天）：PIP α 版完成（小相机 + FBO + 屏幕叠加 + 配置）。
- M3（+1–2 天）：legacy 场景接入、自动测试完善、文档与示例。

任务清单（完成后请打勾销项）：

-## M1：固定太阳模式（核心）
- [x] 在 `SimpleTest` 引入 `composition.useFixedSun`（默认 true）、`composition.fixedSunDir`（默认 `[-1,0,0]`）
- [x] 统一为“单一方向光常亮”（不再按 `altDeg` 关灯）；移除“月球专用光”及相关代码
- [x] 实现 `qSun = setFromUnitVectors(-sunWorld, fixedSunDir)`，`earthRoot.quaternion.premultiply(qSun)`（绕世界轴）
- [x] 调整对齐顺序：先 `qSun`，后 `alignLongitudeOnly`（经度对齐依旧绕世界 +Y）
- [x] 确认星空不在地球组下，避免随地球旋转
- [x] 自动化测试跑通（`?autotest=1` 或 `runSolarAutoTests()`）：极昼/东西象限/春分近天顶/南北对称/午夜负仰角
- [x] 更新文档：新增《docs/自动化测试方案与结果摘要.md》，并固化一键测试入口（window.runSolarAutoTests）

验收标准（M1）：
- [x] 北极圈 66.6°N 夏至 00/06/12/18 UTC 均为白天
- [x] 赤道春分 06Z 在东象限、18Z 在西象限（正午方位角可不判）
- [x] 赤道春分 12Z 仰角 > 85°
- [x] 南半球选定经度的当地午夜仰角 < 0
- [x] 相机任意旋转下，地球构图稳定（相机不随地球转）

- [x] 集成无倾斜检测：`runNoTiltAutoTest()` 纳入 `runSolarFullTests()` 汇总（打印 [FullTest+NoTilt:JSON]）

## M2：月球 PIP（α 版）
- [ ] 新建 `usePIP` 模块（R3F `useFBO`）渲染“月球层”到纹理（256–512px，可调）
- [ ] 第二个小相机：支持 `observer`（观察者视角）与 `fixed` 两种模式
- [ ] 屏幕叠加：圆形裁剪 + 可选描边；位置/尺寸/分辨率/降帧（fps）可配置
- [ ] 配置接口：`composition.enablePIP`、`composition.pip{ x,y,size,round,border,resolution,fps,camera }`
- [ ] 自动测试补充：PIP 性能/帧时监测（目标 < 2ms/f）

验收标准（M2）：
- [ ] PIP 显示月球相位正确、位置固定；主画面相机旋转不影响 PIP
- [ ] 在降帧（30fps）与 256–512px 分辨率下，主渲染帧时无显著上升

## M3：一致性与发布
- [ ] legacy 场景接入 `useFixedSun` 与 PIP，保持功能一致
- [ ] 自动测试扩展：
  - [ ] Az/El ↔ ENU/ECEF 往返一致性（非天顶 < 0.5°）
  - [ ] astronomy-engine vs 本地实现差值分布（< 0.5°）
- [ ] 完整文档与示例，README 增补“固定太阳模式”说明

部署与回退计划：
- 发布策略：先开 `useFixedSun` 为默认，保留 `useFixedSun=false` 回退路径；PIP 默认为关闭（配置开启）。
- 回退机制：出现异常可一键关闭 `useFixedSun` 恢复旧的“变光”模式；PIP 出现异常默认不影响主画面。
- 验收流程：功能自测 + 自动化测试 + 目视验证三项均通过方可发布。

风险与缓解：
- 旋转顺序/轴系混用风险：统一“先 qSun 再经度对齐”，两者都绕世界轴；相机不挂地球组。
- PIP 性能风险：默认低分辨率/降帧，可在配置中调优。
- 交互冲突：对齐、相机控制、PIP 都在独立模块；通过开关/层隔离。

备注：
- 每完成一个勾选项，请在本文件对应条目前打勾并提交；保持文档和实现同步。
