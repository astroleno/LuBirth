# 玉皇庙图绘：独立星空 spike 修订

日期：2026-10-22。用户明确答复「放进独立星空 spike」。本次修正两幅已制作样张的造型、实际合成和可检视入口；**完整 28 幅仍未完成**。原版地月主页面未接入本轮内容。

后续同日更新：[夜空高光线稿 + 点击完整淡彩原型](2026-10-22-yuhuang-line-art.md)。下文的淡彩直接入天空为上一版状态；来源、造型核对与初次投影验证仍保留为记录。

## 当前结果

打开 <http://127.0.0.1:5177/lubirth/sky-spike.html?view=yuhuang>，直接显示心月狐、尾火虎在上海夏夜的同框效果。该演示主动选用 **2026-07-21 14:00 UTC**，不是历史事件时间。普通入口仍保留原观测默认值，可点标题下「玉皇庙图绘」进入同一演示。

- 两幅根据玉皇庙实物近照重新转绘。心月狐保留披发、袒胸、举臂、腿侧小狐；尾火虎保留竖发、举拳、甲衣、足下小虎。撤下之前的文士 / 骑虎式样。
- 两幅均为 **1086×1448** 透明 PNG，作者与照片来源逐幅列入清单，采用 CC BY-SA 4.0。照片未见的细节有绘画解释，不声称扫描或文物复原。
- 投影沿既有恒星坐标和 HIP 控制点系统。修正注册配方对竖幅图片的横纵比例；原配方把不同长宽比都映成同宽同高的角域。当前宽度为 13° / 16°，保持每图像素近似等角尺度。
- 同框定位根据图绘四角、屏幕宽高和控制面板占位取景。名称放在图绘外，预留名称空间，尾宿标签不再被底栏挡住。标题处新增直接可见的演示入口。
- 点击图绘名称 →「实物对照」，在原有玻璃面板里并排查看照片与转绘、署名和许可；「查看另一幅」继续停留在对照中。
- 中国连线仍是 Stellarium 的宋代星官数据；玉皇庙彩塑转绘是另一视觉来源。界面和文档说明两者区别。星位、星等与色指数未改变。

## 信源与资产

详见 [28 尊实物参考与核实状态](../../reference/sky/yuhuang-temple/README.md) 和 [照片总览](../../reference/sky/yuhuang-temple/index.html)。

摄影者 Patrick20242023 的 28 个 Commons 文件，作者、CC BY-SA 4.0、时间及原图链接已逐项读取 API 元数据。拍摄日期跨 2024-02-13 / 14。整体照片已检视，两幅采用的照片另有大图比对；其余 26 尊尚未完成逐项释读，名称还应与馆方图录复核。

| 用途 | 文件 |
| --- | --- |
| 28 照片、作者、许可、来源哈希 | `reference/sky/yuhuang-temple/sources.json`、`commons-metadata.json` |
| 当前两幅、生成输入、解释边界、几何注册 | `src/spikes/sky/data/chinese-art/manifest.json`、`reference/sky/yuhuang-temple/art-generation.json` |
| 旧图与旧清单 | `reference/sky/yuhuang-temple/superseded/`、`superseded-manifest-v1.json` |
| 可重建参考总览 | `scripts/prepare-yuhuang-reference.mjs` |
| 可重建图绘注册清单 | `scripts/prepare-yuhuang-artwork.mjs` |

## 验证

- `test-sky-spike.mjs`：13 项通过。继续使用已冻结的 60 个 Stellarium 26.3 桌面采样；现代最大差 5.596″，坐标转换最大差 2.478″。没有声称本轮重新操作 Stellarium 取样。
- `test-sky-presentation.mjs`：8 项通过。保留 87 幅映射的三个 HIP 控制点跨日期 / 半球验证，新增竖幅图片横纵像素角尺度回归。
- 独立 spike TypeScript 检查通过；独立 Vite 构建输出到 `output/sky-yuhuang-20261022/build`。没有覆盖原版 `dist`。构建仍有约 2 MB 主包的大包提示。
- Ego 静音检查了桌面同框、实物对照、390×844 手机画幅与双指触摸事件。视场由 **72.831° → 52.022°**，网页缩放仍为 1；单画布，无横向溢出，照片和转绘均加载成功。
- 可见 IAB 的稳定采样如下；**这些是桌面浏览器和手机尺寸模拟，不是 iPhone Safari 真机测试，也不是完全冷加载测试。**

| 场景 | FPS | 绘制间隔 P95 | CPU P95 | GPU P95 | 纹理缓存估算 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 桌面 1280×800，双图 | 30.02 | 34.3 ms | 0.5 ms | 1.79 ms | 6.42 MB |
| 手机模拟 390×844，双图 | 30.00 | 34.1 ms | 0.2 ms | 1.23 ms | 3.28 MB |

两个稳定窗口均为 7 次绘制调用，长任务 0，纹理失败 0；检查时控制台无 warning/error。Ego 隐藏宿主的低频回调不作为帧率结论。首次加载在 Ego 中仍出现过约 126 ms 的提交峰值，不能用稳定窗口掩盖冷启动问题。

证据目录：[运行截图与数据](../../output/sky-yuhuang-20261022/)。关键文件：`desktop-integrated.png`、`mobile-integrated.png`、`ego-heart-reference.png`、`ego-mobile-reference.png`、`desktop-performance.json`、`mobile-performance.json`、`mobile-gesture.json`、`mobile-reference-check.json`、`astrometry-checks.log`、`build.log`。

## 仍未完成

1. 其余 26 幅转绘，以及逐尊照片身份、衣冠和动物细节与馆方资料的复核。当前两幅不是完整 28 幅交付。
2. 真实 iPhone Safari 的触摸、横竖屏、安全区、冷加载和长时间表现。
3. 完全冷缓存启动、更多图绘同时加载时的峰值处理；当前两幅约 4.52 MB 压缩 PNG，后续可在确认画质后另评估传输格式。
4. 既有古代双星差异、M7 / M44、IAU 边界、中国宿界与距星等缺口没有因增加艺术图层而解决。

本轮无提交、推送、发布，也未新增 agent、分支或 worktree。
