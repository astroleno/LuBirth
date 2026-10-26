# LuBirth 腾讯源站与双域名部署

2026-10-26 正式源站已迁到腾讯上海 `122.51.59.89`，阿里 `47.103.120.24` 保留两个主域名的 DNS、证书和 HTTPS 入口。公网地址为 `https://tongye.me/LuBirth/`、`https://aitoshuu.me/LuBirth/`，不跳到源站域名或另一个主域名。

迁移使用当时线上最新的 `lubirth-137a37a16727791d`，对应源提交 `d8b3cb16cf24df642457c3986df3057f24314819`。腾讯 `/www/wwwroot/lubirth-current` 指向 `/www/wwwroot/lubirth-releases/<release-id>/web`。HTML、版本标记、sitemap 和 llms 在腾讯；既有 COS/CDN 中的脚本、模型、贴图、音频及其不可变版本保持。

## 正式规则

- 腾讯在 `aitoshuu.art` HTTPS server 的扩展目录引入 `deploy/nginx/tencent-lubirth-origin.inc`，只接受阿里 IP 和回环请求。共享 `$nine_public_host` map 在 http 上下文仅安装一次，模板随 InfiDao 的 `deploy/nginx/tencent-public-host-map.conf` 维护。
- 腾讯 HTML、OG、canonical 与 sitemap 按白名单中的当前公网域名生成；不信任任意传入域名。`llms.txt` 保留两个正式入口的共同说明。
- 阿里两个站点通过原有 `aitoshuu-lubirth-routes.inc`、`tongye-lubirth-routes.inc` 引入 `snippets/lubirth-tencent-gateway.inc`，对应 `deploy/nginx/aliyun-lubirth-gateway.inc`。HTTPS 上游固定腾讯 IP，验证 `aitoshuu.art` 的证书和 SNI。
- 大小混写及纯小写同域 308 到 `/LuBirth/`；保留后缀和完整查询参数。缺失资源仍为 404，两个首页及其他项目不由本项目接管。
- 后续打包与 COS/CDN 上传流程保持；源站暂存和版本链接切换放在腾讯。`stage-origin.mjs` 的计划明确分别标识腾讯源站与阿里网关。静态 alias 属于腾讯源站，不得再套回阿里。

## 验收与回滚

三个迁移项目 4939 个运行文件核对一致，九项目双域名公网回归 219/219 通过，其中正式/小写/混写入口 54/54、脚本样式 94/94、深层/404/私有路径 26/26、接口 14/14。HTML、版本标记、sitemap、llms 和两域首页均已复验；两个域名的浏览器中地球、月球、星空与探索面板正常，canonical 分别使用当前域名。

原阿里目录及受影响 Nginx 配置备份保留在 `/var/backups/nine-projects-migration-20261026/`。静态回滚先核对最新共享配置，再恢复本项目版本或路由，通过 `nginx -t` 后重载，保留其他维护。临时访问凭据和测试服务在验收后清理。

本轮只迁移运行位置，没有改网站名称、性质、页面功能、DNS 或备案材料；未重新完成 iPhone Safari、长时运行及峰值压力验收。
