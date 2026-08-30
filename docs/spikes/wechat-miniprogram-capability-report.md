# 微信小程序原生渲染能力 Spike 报告

日期：2026-08-30
当前决策：`INCONCLUSIVE`

## 结论

工程竖切片、证据格式和真机执行入口已完成，本地构建与自动测试通过；但当前没有真实 AppID、合法 HTTPS 资源域名以及规定的三台物理设备数据。因此不能输出 `GO-FULL`、`GO-ADAPTIVE` 或 `NO-GO-NATIVE`，也不能把开发者工具或 Node 测试当作真机能力证据。

当前可以确认的是“Spike 已具备采证能力”，不能确认“原生微信小程序已满足发布前迁移门槛”。

## 已完成的可审计实现

| 维度 | 本地状态 | 真机状态 | 证据入口 |
|---|---|---|---|
| 独立工程与结果契约 | 通过 | 待执行 | [`spikes/wechat-miniprogram/README.md`](../../spikes/wechat-miniprogram/README.md)、[`result-schema.ts`](../../spikes/wechat-miniprogram/src/metrics/result-schema.ts) |
| r160 窄适配与官方 r108 对照 | 构建/单测通过 | `inconclusive` | [`runtime-comparison.json`](../../spikes/wechat-miniprogram/results/runtime-comparison.json) |
| 天文单一源码与 Web 基线 | 本地 characterization 通过 | `inconclusive` | [`astro-parity.json`](../../spikes/wechat-miniprogram/results/astro-parity.json) |
| 地球/云层/大气/月球/PIP/触摸 | 构建/单测通过 | `inconclusive` | [`lubirth-capability-scene.ts`](../../spikes/wechat-miniprogram/src/scene/lubirth-capability-scene.ts) |
| 2K/8K 下载、解码、GPU 上传 | 测试桩通过 | `inconclusive` | [`asset-matrix.json`](../../spikes/wechat-miniprogram/results/asset-matrix.json) |
| RAF、前后台、卸载与内存告警 | 跨页面持久会话与生命周期单测通过 | `inconclusive` | [`lifecycle-evidence-session.ts`](../../spikes/wechat-miniprogram/src/lifecycle/lifecycle-evidence-session.ts) |
| 60 秒性能与 PIP 三轮配对 | 统计门槛单测通过 | `inconclusive` | [`device-matrix.json`](../../spikes/wechat-miniprogram/results/device-matrix.json) |
| 真机主包 | 压缩构建 1,421,008 bytes，2 MiB gate 通过 | 待开发者工具/真机复测 | [`build.config.mjs`](../../spikes/wechat-miniprogram/build.config.mjs) |

这里的“本地通过”只说明代码路径、统计规则和不变量在自动测试中成立，不代表设备 GPU、驱动、微信基础库或纹理解码器通过。

## 关键实现观察

### 运行时

- r160 路线只适配小程序 Canvas、Canvas 作用域 RAF/Image、尺寸/DPR 和 renderer 生命周期，没有注入全局 DOM。
- r108 路线使用官方 `threejs-miniprogram@0.0.8` 的 `createScopedThreejs(canvas)`，结果与 r160 分槽记录。
- 当前优先候选仍是 r160；在两条路线完成 iOS/Android 真机 Shader、render target 和销毁重建前，不做最终路线选择。

### 天文一致性

- Spike 构建直接打包仓库现有 `src/astro/` 源码，不复制太阳或月相算法。
- 本地固定样例包含春分/夏至/冬至、近天顶、极区与日期变更线；方向角门槛为 `0.01°`。
- Web 基线保存独立的完整 source fingerprint；真机结果必须与相同 revision、dirty 状态、依赖锁、资源和天文源码指纹的 Web 基线比较，否则自动降为 `inconclusive`，不再用当前小程序指纹代替 Web 指纹。

### 代表性场景与 PIP

- 竖切片保留多纹理昼夜、导数法线、位移、云影、透明云层、大气 Fresnel、真实月相、星空和出生点。
- 保持单一方向光、地球绕世界 Y、相机与星空不挂地球组、PIP 月球不进入主场景。
- PIP 使用同一 renderer 的 `WebGLRenderTarget`，支持 256/512 和 30fps 更新；两档都必须完成三轮配对，任一档失败时总结果失败，中断或数据不全时总结果为 `inconclusive`。

Shader 竖切片保留当前生产实现的主要平台风险特征，但不是生产 Shader 的逐字副本：Earth 保留昼夜、多纹理、导数法线、位移、镜面和云影；Cloud 保留纹理位移、透明混合和昼夜着色，但未搬入生产端全部体积散射、三平面与调参分支；Moon 保留真实月相方向、导数法线和位移，但未搬入全部生产调参；Atmosphere 使用背面、Fresnel、昼夜权重和加法混合。因而本地或真机“代表性 Shader 通过”只能证明这些风险特征可运行，不能独立证明完整生产 Shader 零差异迁移。正式 Go 前仍需把生产 Shader 同源抽取纳入迁移检查点。

### 资源与生命周期

- 清单记录真实文件名、文件字节、像素尺寸、色彩空间与 RGBA 解码体积；单张 8K RGBA 纹理约 128 MiB。
- 8K 在下载/解码前先与运行时 `MAX_TEXTURE_SIZE` 比较；超限直接记录为 `unsupported`，避免用网络和解码内存去证明硬件已知不支持的尺寸。
- 加载顺序是完整 2K 基线后再逐项 8K 替换。8K 失败保留在高画质结果中，不覆盖 2K 原始证据。
- 页面隐藏暂停 RAF；显示恢复；卸载释放 scene、render target、material、geometry、texture 与 renderer；内存告警停止高画质并释放 8K 纹理。10 分钟/10 次重入使用跨页面 session id，原始事件独立落盘，最终汇总只引用事件 run id。
- 场景选择、资源档与运行时路线改变时会销毁旧实例；结果 JSON 同时记录请求配置和实际加载配置，避免把旧场景或旧档位误标为当前选择。
- 截图从临时路径复制到小程序用户目录下的 run-id 文件名，便于与原始 JSON 一一核对。

## 未完成证据与阻塞

以下三项缺一不可：

1. 可真机预览的真实 AppID。
2. 已登记、可访问清单中全部纹理的 HTTPS 资源域名。
3. 至少一台主流 iOS、一台 Android 中档和一台 Android 低档设备；每台记录系统、微信、基础库、DPR、WebGL 能力。

由于这些是外部执行条件，本报告没有填造 run id、截图、FPS、内存或设备型号。

## 真机执行与判定

每台设备按相同场景和缓存状态执行：2K 冷/热加载、8K 逐项压力、三个固定天文时刻、Shader/PIP、2K 60 秒基线、PIP 256/512 三轮交替 A/B、10 分钟稳定性和 10 次页面重入。原始结果由页面写入 `results/runs/<run-id>.json`，再把 run id 和截图路径填入设备矩阵。

判定顺序：

1. 前置条件或设备矩阵不全：`INCONCLUSIVE`。
2. 2K 核心竖切片在目标平台失败，或需要无界 Three.js fork：`NO-GO-NATIVE`。
3. 2K 全部门槛通过但 8K 只支持部分设备：`GO-ADAPTIVE`，画质与最低机型必须再次由产品确认。
4. 2K/8K、性能、稳定性和维护性全部通过：`GO-FULL`。

`GO-*` 仅表示可以开始正式迁移架构与排期，不表示小程序已达到发布状态。

## 参考

- [微信 Canvas 文档](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)
- [微信运行时资源优化](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/runtime_resource.html)
- [微信运行时内存优化](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/runtime_memory.html)
- [微信 threejs-miniprogram](https://github.com/wechat-miniprogram/threejs-miniprogram)
