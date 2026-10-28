# 古今同月输入体验发布

2026-10-28，经用户批准在 main 提交推送，并通过腾讯云控制面板同步公网。输入、地点撤回及焦点修复已发布；性能与实体设备的未完成验收见[功能验收](../reviews/2026-10-28-lubirth-followup-acceptance.md)。

## 版本与入口

| 项目 | 结果 |
| --- | --- |
| 应用修复提交 | `9ce1042cbf59fa27f000a3e31a0f0b49ec7398bf` |
| 打包源提交 | `3ce40c0565f438387c274a8abfdba9f849e39e50`，包含腾讯目标与维护入口修正 |
| release ID | `lubirth-8881c69a17037c9e` |
| source digest | `8881c69a17037c9e4fa76e2a758b072b1117b77c4c5c1dbe572883678bfb34cc` |
| 源站 | 腾讯上海 `122.51.59.89`；公网响应 `X-Project-Origin: tencent-shanghai` |
| 活动链接 | `/www/wwwroot/lubirth-current` → `/www/wwwroot/lubirth-releases/lubirth-8881c69a17037c9e/web` |
| 正式公网 | [aitoshuu.me/LuBirth/](https://aitoshuu.me/LuBirth/)、[tongye.me/LuBirth/](https://tongye.me/LuBirth/) |
| 健康标记 | 两域 `release-health.json` 均为本版本，SHA-256 `42e6cd1dcd121f1a37d0f316bd3198651120cd3428a2b4f6a5d6409bdf65efab` |
| 旧版回滚候选 | `lubirth-137a37a16727791d`，目录保留 |

两域保持各自的地址和元数据；大小写变体在同域 308 到 `/LuBirth/`，保留子路径、编码与查询参数。这沿用腾讯迁移后的现网规则。本轮纠正 README 下方仍描述旧跨域跳转的段落，没有改变 Nginx 路由。后续验收文档及 CDN 检查工具提交不属于应用构建输入，因此健康标记继续保留上述实际打包源提交。

## 发布操作与核对

1. 应用及测试先提交、推送，再从已提交源生成独立发布包。沿用既有 `media.aitoshuu.me` 资源入口，不覆盖仓库原有 dist。
2. 使用既有 Keychain 包装器上传 COS，本轮临时环境提供 SDK，未安装全局工具或改变凭证。262 个对象为 261 个资源及一个清单，只创建本版本对象，上传后 HEAD 核对通过。
3. CDN 完整下载并核对 261 个资源，共 160,817,360 字节，逐文件字节数／SHA-256、CORS、immutable 缓存通过；音频 Range 返回 206。未放宽 HTTPS 校验。完整结果见 [CDN 记录](../reviews/assets/2026-10-28-history-followup/cdn-validation.json)。
4. 源站沿用腾讯控制台「轻量云 → 上海 Ubuntu-W5AD → 登录 → OrcaTerm 免密连接 TAT → ubuntu」。默认本机 SSH 身份不可用后使用现有控制台会话，没有增加密钥或改授权。暂存仅四个源站文件，逐文件校验后运行 Nginx 配置检查，再带旧目标校验原子切换 LuBirth 链接。
5. 一次切换指令遇到 TAT 闲置断开，未执行；重连后重发同一带保护的操作，随后双域健康标记与 HTML 哈希确认切换生效。没有把断开会话截图当成成功凭据。
6. 双域正式入口、16 条大小写／斜杠／子路径／查询参数规则、当前域名 canonical 与 sitemap、llms、真实缺失资源 404、可信 TLS 和腾讯来源标记通过。见[公开入口核对](../reviews/assets/2026-10-28-history-followup/public-release-check.json)。

CDN 的原串行检查遇到本机磁盘耗尽；只删除本轮已上传的本地资源副本与临时 SDK，改用最多四个并发校验、响应体保存在内存后，重新完整验证 261 项通过。系统 HTTPS 请求带实际站点的 Origin／Referer，兼容现有防盗链规则；没有关闭 CORS、证书或浏览器安全策略。发布交付检查完整复跑 11/11 通过。

本地生产候选首次受 localhost Referer 的现有防盗链规则影响；仅测试服务响应使用 `no-referrer` 后验证原构建字节。最终出生、历史、星空和实际 PNG 下载均在正式公网另外复核，未用本地服务结果代替公网结果。

## 共享站点边界与回滚

双域共 18 个首页／邻项目地址最终均为 200，保留各自项目，没有指向 LuBirth；其中 14 个 HTML 哈希与发布前相同，OutSet／InfiDao 的两域共四个哈希不同。对四个变化项复取仍稳定为各自项目标题，未含本轮 LuBirth 版本。**其变化原因没有查明，不能宣称所有邻站内容逐字不变。** 本轮服务器写入仅 LuBirth 候选目录和活动链接，没有修改共享 Nginx、DNS、证书或其他项目。见[发布后记录](../reviews/assets/2026-10-28-history-followup/public-after.json)及[差异复核](../reviews/assets/2026-10-28-history-followup/neighbor-hash-recheck.json)。

回滚前重新读取活动链接，确认没有覆盖后续发布，再核对旧版四个源站文件及其依赖存在；只将 LuBirth 活动链接切回保留的 `lubirth-137a37a16727791d/web`。本轮没有需要恢复的 Nginx 配置。切换后复核两个公网健康标记、HTML 和关键功能，保留共享项目的并行维护。

测试 TaskSpace 27、5183／5184 服务、临时传输命令、包与 SDK 已清理；仅保留仓库内最终验收证据。原有未提交文件、归档分支及旧回滚版本保留。默认合影、蓝色弧光、沉浸体验及手写加载保持。
