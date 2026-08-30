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
SPIKE_RESOURCE_BASE_URL=https://your-approved-cdn.example npm run build:device
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

## 真机执行

1. 记录设备型号、系统、微信版本、基础库、DPR 与 WebGL 信息。
2. 依次执行三个固定场景的 2K/8K 档位。
3. 每档先预热，再执行 60 秒基线；PIP 256/512 各做三轮开/关配对。
4. 执行 10 分钟前后台压力和 10 次页面重入。
5. 导出 JSON、固定时刻截图和人工视觉检查表；提交前去标识化。

页面按钮的用途：

- “运行完整验证”执行运行时、天文、代表性场景与远程资源链路，不自动启动长时间性能基准。
- “真机性能基准”仅在真实 AppID、合法资源域名、物理设备和生产纹理都就绪时启动；每个档位约 15 分钟。
- “开始 / 继续 10 分钟与 10 次重入测试”创建可跨页面恢复的会话；完成 10 次重入且总时长达到 10 分钟后，用“完成生命周期测试并写入汇总”固化结果。
- 2K/8K 与 r160/r108 是独立选择，不能把一条路线或一个资源档位的结果写到另一个槽位。

CDN 根目录应直接包含 `src/assets/asset-manifest.ts` 中列出的原始纹理文件名。加载器先依据真机 `MAX_TEXTURE_SIZE` 做预判，不支持 8K 的设备不会先下载或解码 8K；支持时先建立完整 2K 基线，再逐项上传 8K 替换。内存告警会停止高画质升级并释放已加载的 8K 纹理。

仓库中的 `results/*.json` 是待填充的不可变证据索引模板，不是已完成的真机结果。当前没有真机 run id 时，最终状态必须保持 `inconclusive` / `INCONCLUSIVE`。

完整门槛与决策规则以 [`docs/plans/2026-08-30-001-feat-wechat-miniprogram-spike-plan.md`](../../docs/plans/2026-08-30-001-feat-wechat-miniprogram-spike-plan.md) 为准。
