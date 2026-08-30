# 微信小程序原生渲染能力 Spike 报告

日期：2026-08-31
范围结论：`FEASIBILITY-PASS`
迁移决策：`PROCEED-TO-IMPLEMENTATION-PLAN`
生效范围：`iOS / 竖屏 / 2K / Three.js r160`

## 结论

LuBirth 的核心视觉链路可以迁移到原生微信小程序。真实 AppID、HTTPS 资源域名和物理 iOS 设备已经打通；Three.js r160 在小程序 WebGL Canvas 上能够以有界适配运行，并承载地球昼夜、城市灯光、六层云、大气内侧菲涅尔、外侧卡门线扩散、银河星空、真实月相、render-target PIP 和触摸相机。

本次 Spike 的目标已经从原计划的跨平台/多画质发布决策，收敛为用户确认的“快速证明 2K 生产特效能否搬运”。在该范围内，结论是通过，可以进入正式迁移计划。Android、横屏和 8K 已被用户明确排除，不再作为本轮缺失证据；60 秒性能、PIP 配对成本和生命周期长稳仍有产品价值，但改为正式迁移阶段的验收门，不阻塞架构和实现启动。

这不是 `GO-FULL`，也不表示小程序已经达到发布状态。准确口径是：

- **已证明：**iOS 竖屏、2K、r160 原生渲染路线在技术上可行，核心效果可以迁移，适配边界可枚举。
- **尚未证明：**最低支持 iPhone、发布级持续性能、长时间稳定性、全部 Web 产品参数零差异，以及登录/分享/音频/截图等业务能力。

## 最终验证范围

### 纳入并通过

- 原生 `canvas type="webgl"`，不使用 `web-view` 作为通过条件；
- Three.js `0.160.1`，Canvas facade、Canvas 作用域 RAF/Image、DPR 和 renderer 生命周期窄适配；
- `astronomy-engine` 与 LuBirth 天文源码打包运行，太阳、月球、月相与 Y-up 坐标路径保持单一事实源；
- 2K 远程纹理下载、解码、色彩空间、GPU 上传和 2:1 经度循环采样；
- 地球日夜纹理、城市灯光 glow、镜面、导数法线、位移和云影；
- 六层云、体积散射、厚度映射、边缘淡化与 Fresnel；
- 内侧地表菲涅尔与外侧卡门线/大气扩散分层；
- 银河星空贴图；
- 真实月相月球与同一 renderer 的 `WebGLRenderTarget` PIP；
- 单指旋转、双指缩放，PIP 保持固定屏幕锚点；
- 白昼、晨昏、夜面三个观察预设。

### 明确不在本轮范围

- Android；
- 横屏；
- 8K；
- 完整业务页面、登录、分享、音频、截图、城市搜索；
- 发布级最低机型承诺；
- Web 与小程序每一个视觉参数的逐项零差异证明。

## 证据摘要

### 真机运行时

验证设备为 iPhone Air（iPhone18,4）、iOS 26.3、微信 8.0.76、基础库 3.17.2、DPR 3。r160 能力 run 已确认：

- WebGL 1 上下文创建成功；
- fragment `highp`、`OES_standard_derivatives`、透明混合和 render target 可用；
- `MAX_TEXTURE_SIZE=16384`；
- renderer 销毁后可以重新创建；
- r160 适配没有修改 Three renderer、material、shader chunk 或色彩管理核心。

r108 对照代码保留在 Spike 中，但 r160 已满足当前正式路线，不应把 r108 打入正式产品主包。

### 天文与自动测试

2026-08-31 的新鲜本地验证结果：

- Spike 单元测试：`80/80`；
- 天文源码集成测试：`3/3`；
- 既有太阳 characterization：`6/6`；
- 全量光照 characterization：`40/40`；
- 月相 characterization：`6/6`；
- TypeScript `--noEmit`：通过；
- r160 真机构建：通过；
- 主包：`852,869 / 2,097,152 bytes`；
- 微信预览包：`967,008 bytes`。

命令：

```bash
cd spikes/wechat-miniprogram
SPIKE_RESOURCE_BASE_URL=https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures npm run verify
```

### 视觉证据

最终 v6 真机截图覆盖多个地球旋转位置和日夜角度。人工审查结论：

- 原先可见的经线接缝在最终截图中未再出现；
- 内侧菲涅尔与外侧大气不再出现垂直于地表的硬截断；
- 晨昏过渡比早期版本连续，夜面城市灯光方向与日照关系可读；
- 云层保持可见层次，没有遮蔽地表主体；
- 银河星空恢复且密度符合当前 Spike 目标；
- PIP 月球保持固定窗口，并使用真实月球纹理与月相光照。

最终截图由用户在真机侧提供，当前没有纳入 Git。若将来需要审计发布版本，应由正式客户端把截图与对应 run id 一同归档。

## Spike 中发现并解决的风险

| 风险 | 现象 | 结论/约束 |
|---|---|---|
| 小程序 Canvas 与 Three r160 宿主差异 | renderer 无法直接假定 DOM Canvas | 使用局部 Canvas facade，不注入全局 DOM |
| r108/r160 版本分叉 | 官方适配器基于 r108 | 正式路线固定 r160；r108 只保留为诊断对照 |
| 微信合法域名 | `downloadFile` 真机拒绝 CDN | `assets.aitoshuu.me` 必须登记为 downloadFile 合法域名 |
| GPU 错误归因 | 旧 run 在场景后读到遗留 `1281` | 每张纹理上传前清空旧错误，上传后立刻绑定错误到资源 |
| 2:1 纹理接缝 | 地球/云层出现垂直经线 | 所有等距柱状纹理强制 `wrapS=RepeatWrapping`、`wrapT=ClampToEdgeWrapping` |
| 晨昏硬截断 | 法线扰动直接参与昼夜混合 | 几何法线负责昼夜权重，导数法线只负责局部着色 |
| 大气尾部过硬 | additive RGB 与 alpha 重复衰减 | 使用预乘 alpha 的线性加法能量，并分离近地薄壳与外层扩散 |
| 黑屏误判 | 开发者工具缓存出现 `__wxAppCode__` 错误 | 清理编译缓存后恢复；不得把宿主代码包错误归因给 Shader |
| 包体膨胀 | r108 与诊断代码进入启动包 | 真机 profile 只包含 r160，并保留 2 MiB 构建 gate |

## 正式迁移采用的技术结论

1. **正式客户端使用 Three.js r160。**适配只允许覆盖 Canvas、RAF/Image、事件、DPR、纹理来源和生命周期。
2. **小程序不迁移 React DOM、R3F、Drei 或 OrbitControls。**正式客户端使用原生 Page + 命令式渲染核心。
3. **2K 是完整效果档。**它包含地球、夜景、云、大气、星空、月相和 PIP，不是删减版。
4. **纹理继续走腾讯 COS/CDN。**主包只保留启动代码和必要的极小占位资源。
5. **天文、坐标、视觉配置和 Shader 需要单一事实源。**Web 与小程序不能继续复制两套参数和公式。
6. **PIP 使用同一 renderer + render target。**不引入第二 WebGL Canvas 或像素读回链路。
7. **正式迁移保留 Spike 的固定场景与证据 schema。**它们从探索工具转为跨宿主回归和发布验收工具。

详细边界见 [`wechat-miniprogram-migration-boundary.md`](./wechat-miniprogram-migration-boundary.md)，正式执行步骤见 [`2026-08-31-001-feat-wechat-miniprogram-migration-plan.md`](../plans/2026-08-31-001-feat-wechat-miniprogram-migration-plan.md)。

## 剩余风险的处理位置

| 风险 | 是否阻塞规划 | 正式处理位置 |
|---|---|---|
| v6 没有对应的完整真机 JSON | 否 | 正式客户端保留诊断路由，在视觉基线冻结时补录 |
| 60 秒 2K 性能窗口 | 否 | 正式迁移计划的发布验收任务 |
| PIP 开/关三轮配对成本 | 否 | 正式迁移计划的发布验收任务 |
| 10 分钟运行与 10 次重入 | 否 | 正式迁移计划的生命周期验收任务 |
| 最低支持 iPhone/基础库 | 否，但阻塞发布 | 产品发布门，在首个候选版本前锁定 |
| Android、横屏、8K | 否 | 非本计划目标；若重新进入范围必须另开计划 |

## 最终判定

Spike 在用户确认的范围内完成，状态为 `FEASIBILITY-PASS`。可以开始正式迁移实现，但不得把该结论扩张为 Android、横屏、8K 或发布级稳定性已经通过。
