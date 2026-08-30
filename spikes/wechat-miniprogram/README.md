# LuBirth 微信小程序原生渲染 Spike

本目录是独立、可删除的能力验证工程。它不改变 Web 端行为，也不把 `web-view` 计为通过条件。当前工程同时保留 Three.js r160 窄适配路线与官方 `threejs-miniprogram` r108 对照路线。

## 本地准备

```bash
cd spikes/wechat-miniprogram
npm install
npm run verify
```

`npm run verify` 最后生成无 source map、已压缩的真机包，并强制检查主包不超过 2 MiB；普通调试构建可使用 `npm run build`。构建输出位于 `miniprogram/`，微信开发者工具应导入本目录中的 `project.config.json`。项目固定使用基础库 `3.8.12`，但产品最低支持版本尚未确认，确认后还必须在该最低版本复测。默认 `touristappid` 只用于脚手架检查；真机证据必须在 `project.private.config.json` 中配置真实 AppID，且该文件不会提交。

远程纹理域名通过环境变量注入，不写入源码：

```bash
SPIKE_RESOURCE_BASE_URL=https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures npm run build:device
```

域名必须在小程序后台登记。没有真实 AppID、合法资源域名或物理设备时，结果契约会将相关 run 标记为 `inconclusive`。

## 证据规则

- 原始结果写入小程序用户目录 `results/runs/<run-id>.json`，同一 run id 不允许覆盖。
- 截图从临时文件复制到 `results/screenshots/<run-id>.png`，路径与同一 run id 一起进入 JSON。
- 生命周期事件逐条写入 `results/lifecycle/events/<event-run-id>.json`；活动会话跨页面重入恢复，最终汇总只引用原始事件 run id。
- 汇总文件只保存原始 run id，不复制或改写原始证据。
- Web/小程序比较要求源码 revision、dirty 状态、依赖锁摘要、资源摘要全部一致。
- 状态只有 `pass`、`fail`、`unsupported`、`inconclusive`。
- 开发者工具数据仅用于诊断；Go/No-Go 需要计划规定的真机矩阵。

## 当前 2K 生产特效验证

1. 记录设备型号、系统、微信版本、基础库、DPR 与 WebGL 信息。
2. 点击“运行 2K 特效完整验证”，等待运行时、天文、2K 远程纹理和三预设特效矩阵完成。
3. 依次选择“白昼 · 上海（2K）”“晨昏线 · 上海（2K）”“夜面 · 上海（2K）”，人工检查画面。
4. 拖拽、双指缩放，并在设备支持时切换横竖屏，确认主相机变化时 PIP 仍固定在屏幕位置且保持正方形。
5. 复制最新 JSON，并保存三种预设截图；提交前去标识化。

视觉检查重点：

- 白昼：日面漫反射、六层云的体积散射和边缘能辨认；
- 晨昏线：内外地弧、主大气层与近地薄壳的扩散和软边最明显；
- 夜面：城市灯光与模糊 glow 可见，日面颜色不应污染夜面；
- 全部预设：PIP 月球独立于主场景，拖拽/缩放/resize 后位置稳定；
- JSON：三条视觉测试与最终 matrix gate 均为 `pass`，`glError=0` 且 Shader 日志为空。

页面按钮的用途：

- “运行 2K 特效完整验证”执行运行时、天文、2K 远程资源和白昼/晨昏线/夜面生产特效矩阵。
- “白昼 / 晨昏线 / 夜面特效矩阵”可单独重跑三预设 Shader/GL 与不变量 gate。
- “当前预设 / PIP 测试”只重跑当前 picker 中的预设，便于定位某一种效果。
- r160/r108 仍分槽记录；当前优先验证 r160，不能把 r108 结果写成 r160 通过。

注入的 CDN 基地址所指目录应直接包含 `src/assets/asset-manifest.ts` 中列出的原始纹理文件名；当前腾讯 COS 对应目录是 `releases/lubirth-wechat-spike/textures/`。本轮 UI 固定为 2K；8K、长时间性能与生命周期能力代码仍保留，但按 2026-08-30 用户确认的范围延后，不参与这次“生产特效能否搬运”的判断。

仓库中的 `results/*.json` 是待填充的不可变证据索引模板，不是已完成的真机结果。当前没有真机 run id 时，最终状态必须保持 `inconclusive` / `INCONCLUSIVE`。

完整门槛与决策规则以 [`docs/plans/2026-08-30-001-feat-wechat-miniprogram-spike-plan.md`](../../docs/plans/2026-08-30-001-feat-wechat-miniprogram-spike-plan.md) 为准。
