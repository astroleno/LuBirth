# 微信小程序正式迁移边界

状态：`ACTIVE`
生效日期：2026-08-31
依据：[`wechat-miniprogram-capability-report.md`](./wechat-miniprogram-capability-report.md)
实现计划：[`2026-08-31-001-feat-wechat-miniprogram-migration-plan.md`](../plans/2026-08-31-001-feat-wechat-miniprogram-migration-plan.md)

## 决策

正式迁移可以启动，采用以下已经过 Spike 验证的产品边界：

- 平台：微信小程序原生 Canvas；
- 设备：iOS；
- 方向：竖屏；
- 画质：固定 2K 完整效果；
- Three.js：`0.160.1`；
- PIP：同一 renderer 的 `WebGLRenderTarget`；
- 资源：腾讯 COS/CDN，经 `wx.downloadFile` 获取；
- UI 宿主：原生 Page/WXML/WXSS，不迁移 React DOM、R3F 或 Drei。

Android、横屏和 8K 不属于本次正式迁移。将来若重新进入范围，必须重新评估设备、资源、布局和性能，不能把本计划的通过结论直接外推。

## 目标架构

正式迁移分为四个所有权清晰的区域：

| 区域 | 建议路径 | 职责 | 禁止依赖 |
|---|---|---|---|
| 共享纯核心 | `packages/lubirth-core/` | 天文、坐标、场景配置、资源语义、证据类型 | `three`、React、DOM、`wx` |
| 共享渲染核心 | `packages/lubirth-render-core/` | Shader、pass、命令式场景、PIP、触摸相机纯状态 | React、DOM、`wx` |
| 正式小程序宿主 | `clients/wechat-miniprogram/` | r160 Canvas 适配、资源下载、文件缓存、页面生命周期、WXML UI | R3F、Drei、全局 DOM polyfill、r108 |
| 现有 Web 宿主 | 根目录 `src/` | React/R3F 页面和浏览器平台能力 | `wx`、小程序 Page 类型 |

依赖方向固定为：

```text
packages/lubirth-core
        ↑
packages/lubirth-render-core
        ↑
clients/wechat-miniprogram

packages/lubirth-core ──→ Web src/
packages/lubirth-render-core ──→ Web Shader/配置适配
```

共享包不得反向导入任一宿主。正式小程序可以导入共享包；Spike 只作为迁移参考和回归原型，不得成为正式客户端的运行时依赖。

## 共享纯核心边界

`packages/lubirth-core` 只包含可在 Node、浏览器和小程序中以相同输入得到相同输出的模块：

- `computeEphemeris()`、`toUTCFromLocal()` 和月相计算；
- ECEF/ENU/Y-up 映射；
- 固定太阳方向、出生点对齐和相机极坐标纯计算；
- 固定场景输入与 `SceneConfig`；
- 2K 资源键、尺寸、色彩空间和完整性元数据；
- 运行证据与性能摘要的宿主无关类型。

核心中的诊断能力必须通过 `DiagnosticsSink` 注入，不能直接访问 console、DOM 或 `wx`：

```ts
export type DiagnosticsSink = {
  debug(event: string, payload?: unknown): void;
  warn(event: string, payload?: unknown): void;
};
```

Web 与小程序必须从同一个包调用天文和坐标实现。旧路径可以保留薄 re-export 以控制迁移风险，但不能保留第二套公式。

## 共享渲染核心边界

`packages/lubirth-render-core` 接收依赖注入后的 `THREE`、renderer、纹理和场景配置，拥有：

- Earth、Cloud、Atmosphere、Stars 和 Moon pass；
- 统一的几何晨昏 profile；
- 内侧菲涅尔与外侧大气扩散；
- 2:1 纹理采样约定；
- 主场景与 PIP 的 render/composite 顺序；
- 地球绕世界 Y 旋转；
- 相机轨道状态和手势数学；
- `createLubirthScene()`、`resize()`、`render()`、`dispose()`；
- 运行时不变量审计。

稳定接口为：

```ts
export type LubirthScene = {
  render(timestampMs: number): void;
  resize(widthPx: number, heightPx: number): void;
  update(config: SceneConfig): void;
  audit(): SceneAudit;
  dispose(): void;
};

export function createLubirthScene(options: {
  THREE: ThreeNamespace;
  renderer: RendererLike;
  textures: TextureBundle;
  config: SceneConfig;
}): LubirthScene;
```

渲染核心不能创建网络请求、读取文件、监听页面事件或修改 WXML data。所有宿主能力均通过参数传入。

## 正式小程序宿主边界

`clients/wechat-miniprogram` 负责：

- 用 r160 创建和销毁 renderer；
- 提供 Canvas facade、Canvas RAF/Image、事件桥和 DPR clamp；
- 用 `wx.downloadFile` 和文件系统加载/缓存 2K 纹理；
- 检查合法域名、HTTP 状态、解码尺寸、色彩空间和逐纹理 GPU 上传；
- 把 `onShow/onHide/onUnload/onMemoryWarning` 转换为显式状态机；
- 把 touch 事件转换成渲染核心手势输入；
- 显示加载、可恢复错误和主场景；
- 在隐藏诊断路由中运行性能、生命周期和证据导出。

正式启动包只包含 r160，不得包含 `threejs-miniprogram` r108 对照适配器或 Spike 调试矩阵。r108 代码继续留在 `spikes/wechat-miniprogram` 作为历史诊断证据。

## Web 宿主边界

Web 端继续使用 React、R3F 和 Drei，不要求改成命令式场景。正式迁移只要求它逐步消费共享的：

- 天文与坐标函数；
- `SceneConfig` 与默认视觉参数；
- Shader 源和 uniform schema；
- 资源键和色彩空间语义；
- 固定验证场景。

每完成一次共享抽取，都必须运行 Web 构建和原有天文测试，防止为了小程序破坏现有产品。

## 不变量

以下约束对全部任务和平台生效：

1. 世界坐标 Y-up；`World(x,y,z)=ECEF(x,z,y)`。
2. 光照方向统一表示“从太阳射向地球”的方向。
3. 场景只有一盏方向光，不增加月球专用光。
4. 相机和星空不挂到地球组。
5. 地球只绕世界 Y 旋转，不通过旋转相机伪造自转。
6. PIP 月球不进入主场景；PIP 与主场景共用同一 renderer。
7. 几何法线负责昼夜混合，扰动法线只负责局部着色。
8. 等距柱状 2:1 纹理使用水平 Repeat、垂直 Clamp。
9. 2K 是完整效果，不允许用删除云层、大气、夜景或 PIP 换取通过。
10. 微信开发者工具只能用于诊断，发布验收必须使用物理 iOS 设备。

## 资源和网络边界

- CDN 基地址由构建环境注入，生产值为 `https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures`；迁移完成后允许改为新的版本化路径，但不得硬编码密钥。
- 域名 `https://assets.aitoshuu.me` 必须保持在 `downloadFile` 合法域名中。
- manifest 是资源事实源，必须记录文件名、字节、像素、色彩空间、用途和 SHA-256。
- 核心 2K 纹理全部成功后才创建生产场景；不得把占位纹理当成成功状态。
- 纹理上传前清理遗留 GL error，上传后立即检查并把错误绑定到资源 id。
- 2:1 纹理在首次 GPU 上传前设置 wrap 模式。
- 文件缓存以资源版本和 SHA-256 为键；校验失败或 manifest 版本变化时重新下载。
- 主包保持低于 2 MiB，2K 纹理不进入主包。

## 生命周期和错误边界

页面状态机只允许：

```text
idle → loading → ready ↔ hidden → disposing → disposed
                 ↘ error ────────────────↗
```

- `onHide` 停止 RAF，不销毁已加载的 2K 基线；
- `onShow` 只恢复一个 RAF；
- `onUnload` 按 PIP → scene → texture → renderer → event 的顺序幂等释放；
- `onMemoryWarning` 释放非必要缓存和 render target 临时资源，但不能把场景留在半释放状态；
- 新加载请求必须带 generation id，旧请求完成时不得覆盖新场景；
- 网络、解码、GPU 和 Shader 错误必须保留阶段、资源 id 和原始 `errMsg`；
- 错误页面提供重试，不允许静默显示黑屏。

## 本次正式迁移包含

- 两个共享包及其跨宿主测试；
- r160 正式小程序客户端；
- 2K COS/CDN 资源管线与缓存；
- 地球、云层、大气、星空、出生点、月相和 PIP；
- 竖屏触摸相机；
- 页面生命周期和可恢复错误 UI；
- 隐藏诊断路由、性能与生命周期证据；
- Web 构建与关键视觉/天文回归；
- iOS 2K 发布候选验收。

## 本次正式迁移不包含

- Android；
- 横屏；
- 8K 或自动画质分档；
- 第二 WebGL Canvas；
- R3F 小程序 reconciler；
- 登录、支付、分享、订阅消息；
- 音乐播放器；
- 产品截图保存；
- 城市搜索和完整控制面板重做；
- 未经需求确认的 UI 重设计。

这些需求需要各自的产品说明和实施计划，不能混入核心迁移造成验收范围漂移。

## 发布前验收门

正式迁移可以立即开始，但候选版本必须满足：

- 共享天文固定样例 Web/小程序差值不超过 `0.01°`；
- 2K 必需纹理全部通过下载、解码和 GPU 上传；
- Shader 编译/链接日志为空，完整场景 `glError=0`；
- 白昼、晨昏、夜面视觉基线通过；
- 预热后 60 秒 FPS 中位数不低于 30，p95 帧间隔不高于 50ms；
- PIP 256px/30fps 三轮配对中位帧时间增量不高于 2ms/frame；
- 连续运行 10 分钟和页面重入 10 次无黑屏、崩溃、context loss 或重复 RAF；
- 主包小于 2 MiB；
- 最低支持 iPhone、iOS、微信版本和基础库版本在候选版本前明确记录。

## 变更控制

以下情况必须暂停当前计划并重新评审边界：

- 需要修改 Three renderer、material、shader chunk 或色彩管理核心；
- 产品重新要求 Android、横屏或 8K；
- PIP 必须改成第二上下文或像素读回；
- CDN 无法满足合法域名、缓存或版本管理；
- 正式场景在目标 iOS 上持续低于性能门槛且只能通过删除核心效果恢复。
