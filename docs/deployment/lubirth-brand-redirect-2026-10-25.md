# LuBirth 品牌入口跳转验收（2026-10-25）

## 目标与实现

按用户要求，访问 `https://tongye.me/LuBirth` 后跳转到
`https://aitoshuu.me/lubirth/`，浏览器地址栏显示目标地址。

- 模块：仅修改 tongye.me 已有的 LuBirth 路由片段；应用无需重新构建。
- 接口：`/lubirth` 大小写不敏感，兼容有、无末尾斜杠；子路径映射到目标站同一子路径。
- 返回：HTTP 308，目标主机固定为 `aitoshuu.me`，保留查询参数。
- 浏览器保留原 URL 片段（`#…`）；服务端跳转不依赖 JavaScript。
- 配置源：`deploy/nginx/tongye-lubirth-routes.inc`。

验收要求为入口跳转、参数和锚点保留、实际浏览器 URL 更新，以及原首页和当前应用版本保持一致。

## 发布

- 源站：仓库现有部署主机；SSH 主机指纹校验通过。
- 安装文件：`/www/server/panel/vhost/nginx/tongye-lubirth-routes.inc`。
- 修改前 SHA-256：`4339bc728f133eca43e8925fbf78426f6a5f370da07576bbf1c689a2cf5e1356`。
- 修改后 SHA-256：`0369766f819a36e13b2c42c4192ed55eac573d3e2371c9d9c9a11dbc84f310f2`。
- 变更前校验路由和父级配置摘要，保留原权限及属主，备份后原子替换。
- 替换前、后 `nginx -t` 均通过，平滑重载成功。
- 父级 `html_tongye.me.conf` 摘要保持不变；本次只替换上述 LuBirth 片段。
- 回退备份：`/www/server/panel/vhost/nginx/tongye-lubirth-routes.inc.bak-lubirth-redirect-20261025-4339bc728f133eca`。
  恢复该文件后须通过 `nginx -t` 再平滑重载。

## 验收结果

| 检查 | 结果 |
| --- | --- |
| `/LuBirth`、`/LuBirth/`、`/lubirth`、`/lubirth/`、`/LUBIRTH/` | 均返回 308，指向规范地址 |
| `scene=sky&history=1`、中文地点和编码时刻参数 | 原样保留 |
| `/LuBirth/release-health.json` 与缺失资源子路径 | 保留子路径；缺失资源最终返回 404 |
| HTTP、HTTPS www 入口 | 经原 HTTPS/主机规范化后跳转，最终 200，无循环 |
| tongye.me 首页、`/experience/`、近似但不匹配的路径 | 状态码、Location、响应体 SHA-256 均与修改前一致 |
| 目标站 HTML 与 release-health | 状态码和响应体 SHA-256 与修改前一致 |
| Chrome for Testing 实际导航 | 最终 URL 为规范地址，页面正常显示，截图已查看 |
| 带查询参数及 `#redirect-check` 的浏览器导航 | 完整保留；启用、禁用 JavaScript 均通过 |
| 浏览器运行状态 | 无页面异常；合影位置为 `portrait`，背景星点与连线可见 |

HTTP 检查共 7 个跳转用例、5 个保持一致用例、2 条完整跳转链，最终全部通过。
其中健康文件入口首轮出现一次网络请求失败，单独重试后状态码与 Location 均通过。

应用仍为已验收版本 `lubirth-a4d0bbfd76774f67`，应用源码提交
`008898379ca0aed8656755820b192e22fe87d792`；默认合影、沉浸体验及事件缺少时刻时按当地 20:00 的规则沿用原发布。
本次只验收入口配置，完整功能和性能结果见 `lubirth-ui-consolidation-2026-10-25.md`。

本机证据目录：
`/Users/aitoshuu/.codex/visualizations/2026/10/01/01a0f54e-fb46-7bb3-a023-44df5232a20e/lubirth-brand-redirect-20261025/`。
包含 `deployment-plan.json`、`deployment-result.json`、`http-before.json`、
`http-after.json`、`browser-check.json` 和 `canonical-desktop.png`。
