# LuBirth 驼峰地址与小写兼容

日期：2026-10-26。

## 地址约定与实现

- 主地址：<https://aitoshuu.me/LuBirth/>。`/LuBirth` 补齐尾斜杠。
- 两个域名的 `/lubirth`、`/lubirth/` 及其他大小写变体通过 HTTP 308 到主地址，保留子路径与查询参数；浏览器继承原有锚点。
- <https://tongye.me/LuBirth> 继续转发到主地址，地址栏显示驼峰路径。
- 源站精确匹配驼峰页面及健康标记，之后才由大小写兼容规则处理其他拼写。健康标记维持 `no-store`，页面和发现文件维持 `no-cache`。
- `index.html` 的 canonical、Open Graph、结构化数据、发现文件及本地 Vite base 一并更新。应用交互、月相与开场逻辑沿用上版。
- 路由源文件：`deploy/nginx/aitoshuu-lubirth-routes.inc`、`deploy/nginx/tongye-lubirth-routes.inc`。暂存计划与公网校验器使用同一地址约定。

## 发布与回退

- 源码：`3a1d714819a36d0a98b6d6d40ad650829775a755`，已推送 `origin/main`。
- 版本：`lubirth-30804fba22f3a26f`。
- 源码及交付配置摘要：`30804fba22f3a26f011c56dd8047bf4abe2a1bc8341651c585478793d5211cdb`。
- 干净的已提交输入构建通过，创建 230 个不可变对象。229 个资源、160,404,187 字节的完整 SHA-256、TLS、CORS、缓存及音乐 Range 校验通过；继续使用 `media.aitoshuu.me`。
- 源站四个文件哈希一致后，通过原有工具原子切换发布软链接。
- Nginx 修改前后检查通过并平滑重载；只修改 LuBirth 路由和目标站原有三处 LuBirth location。部署前发现同一服务器另有独立配置更新，重新核对后保留该更新，没有覆盖它。
- 回退配置：`html_aitoshuu.me.conf.bak-lubirth-camel-20261026`、`tongye-lubirth-routes.inc.bak-lubirth-camel-20261026`，位于 `/www/server/panel/vhost/nginx/`。恢复时同步移除新目标站 include，检查 Nginx 后重载；应用前版为 `lubirth-729d77411b4e8a9e`。

## 验收

- TypeScript、差异格式及部署脚本语法检查通过；既有发布范围测试 11/11。
- 公网校验器通过 15 个跳转用例，另有 4 个无尾斜杠且带编码查询参数的用例；Camel、全小写、全大写、子路径与查询参数均按约定处理。
- HTTP 与 HTTPS www 入口共 4 条完整跳转链，最终均为驼峰主地址的 200，无循环。
- 公网 HTML、健康标记、canonical、发现文件、缺失资源 404 通过。两个站点首页、原 `/experience/` 及近似但不匹配的 `/LuBirthExtra` 的状态、Location 和响应体哈希保持一致。
- Chrome for Testing 156：桌面 1280×720、手机模拟 390×844、禁用 JavaScript 三组实际导航均显示 `/LuBirth/`，保留查询与 `#case-check`。`scene=sky&history=1` 仍进入对应界面；默认合影、手机面板操作及无横向溢出检查通过，页面异常为 0。
- 本轮为地址规范与启动冒烟验收，未重新评估月相精度、性能或真机 Safari。
- HTML SHA-256：`90397fd8942818287ec334959ef40add417af7dfe8c3c9b2f3aee4b24751001c`。
- 健康标记 SHA-256：`e66c64c5c51eaf109648bb8f4dca5ebef29817d3de1b88576a987ec641464b09`。

证据目录：`/Users/aitoshuu/.codex/visualizations/2026/10/01/01a0f54e-fb46-7bb3-a023-44df5232a20e/lubirth-camel-route-20261026/`。保留结构化校验、发布清单与源站文件；本次浏览器目录、过程截图、临时脚本和重复资源副本已清理。原有本地草稿未纳入提交。
