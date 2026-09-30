# 高像素密度性能与加载反馈迭代

用户在 findings 复核后批准实现、commit、push 和公网同步；沿用 main 及既有发布目录，不创建分支或 agent。

## 目标与模块

- 保留 Earth rim、地弧光、海面菲涅尔和小圆角玻璃折射。天文坐标与单光源约定不变。
- Earth：将不随相机/太阳改变的 AO 和夜光模糊核移到 1024×512 UV 缓存，仅在输入纹理、相关参数变化或 WebGL 上下文恢复时重建。实时方向阴影、DEM 法线、太阳及边缘光继续在原材质中计算。
- RenderRuntime：按 CSS 尺寸和像素上限计算实际 DPR；连续两段低帧率才降低，十段稳定帧率才尝试恢复，前后台切换后重新预热。均衡目标 30 FPS，细腻 60，省电 24。桌面均衡上限 250 万像素、手机 150 万，细腻 350 万、省电 100 万。原画质选项和几何/云层参数保留。
- textureLoader：基础地月贴图先行，法线/高度/高光/云层随后。能节省体积的 2K WebP 优先，JPEG 保留回退。高度/高光/法线不做有损二次压缩；转换更大的文件继续用原图。
- index、LoadingOverlay、App、Moon：脚本执行前已有品牌提示；地月基础资源完成数驱动进度，慢连接/失败允许重试或进入基础场景，近景月球模型提供加载与回退状态。补充分享信息及 NASA 链接 44px 点击高度。
- CDN：仅为两个已有域名的 `/releases/aitoshuu-me/` 添加 `Timing-Allow-Origin: https://aitoshuu.me`；不改 CORS、ACL、源站或其他目录。现有凭证被 CDN API 拒绝访问，等待用户处理或明确延期，不更换凭证绕过限制。

## 接口和验收

- `getLuBirthPerformance()` 增加累计场景帧数、实测窗口帧率和有效 DPR，保留玻璃/资源统计。
- `lubirth:asset-progress` 传递 `{loaded,total}`，`lubirth:asset-error` 标明失败资源；`lubirth:moon-terrain` 为 loading/ready/error。
- 高 DPR 916×1201 场景与手机布局实测；保留效果目视验证、无着色器错误、切换品质和隐藏 UI 后资源回收。
- 自适应策略边界测试、TypeScript、生产构建；40 项光照、11 项月相、180 帧无倾斜；隐藏/恢复、全屏、截图、地点保留。
- 发布包源码与提交一致；CDN 内容散列/CORS/缓存/Range、源站两文件散列、公网版本及浏览器回归；TAO 单独报告，不把缺失项计为通过。
