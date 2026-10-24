# 检索与核查日志

日期：2026-10-22。本文记录主要检索表达式、追踪方向和排除理由；原作链接与证据级别见 [catalog.json](catalog.json)，结论见 [调研报告](2026-10-22-research.md)。

检索结果按相关性筛选，并非所有命中都纳入清单。未保存搜索引擎结果页、第三方源码镜像或媒体文件。四轮包含广搜、原作追踪、实现/许可阅读与反证；不是四轮浏览器性能测试。

## 第一轮：跨平台发现

覆盖用户指定的9个平台，搜星图、星座、银河、星点和相关产品，不预设必须沿用某个引擎。

得到公开项目、作者作品、演示和组件索引；先区分准确星图、艺术背景与太空主题作品。

检索组：r1_creative_platforms

- `site:tympanus.net codrops three.js galaxy starfield constellation`
- `site:awwwards.com astronomy constellation galaxy WebGL`
- `site:openprocessing.org/sketch constellation starfield`
- `site:codepen.io three.js constellation galaxy`

检索组：r1_steam_github

- `site:store.steampowered.com/app "planetarium" "constellations"`
- `site:store.steampowered.com/app "SpaceEngine" "Universe Sandbox"`
- `site:github.com "planetarium" "constellations" "javascript"`
- `site:github.com "star sky" "milky way" "three.js"`

检索组：r1_shader_sandbox

- `site:shadertoy.com/view "Star" "Galaxy"`
- `site:shadertoy.com/view "Milky"`
- `site:codesandbox.io "constellation" "three"`
- `site:codesandbox.io "stars" "react-three"`

检索组：r1_design

- `site:dribbble.com/shots "star map"`
- `site:dribbble.com/shots "constellation" "astronomy"`
- `site:awwwards.com/sites "stars"`
- `site:awwwards.com/sites "universe"`

检索组：r1_codepen

- `CodePen three.js star map constellation HYG`
- `site:codepen.io/pen constellation stars WebGL`

检索组：r1_shadertoy

- `Shadertoy Star Nest Kali starfield`
- `Shadertoy milky way galaxy Nimitz`

检索组：r1_codesandbox

- `CodeSandbox react three fiber stars demo constellation`
- `CodeSandbox react three fiber galaxy generator`

检索组：r1_awwwards

- `site:awwwards.com "100,000 Stars"`
- `site:awwwards.com/sites "space" "WebGL"`
- `site:awwwards.com "constellation"`

检索组：r1_github_more

- `github web planetarium three.js HYG constellation stars`
- `github three.js sky renderer milky way star shader`
- `github chinese constellation 二十八宿 星图 WebGL`

## 第二轮：缩小到具体作品与原作

追踪中国星图、作者项目、实际CodePen和Dribbble作品，排除标签页与同名技术。

找到二十八宿星图系统、數位渾象、白虎图绘、A-Starry-Sky；确认OpenProcessing抓取常为模板，CodeSandbox索引不等于已读实例。

检索组：r2_astro_sources

- `"A-Starry-Sky" Dante83 GitHub`
- `"celestiary" "stars" github`
- `"VirtualSky" "Milky Way"`

检索组：r2_processing

- `site:openprocessing.org/sketch/ "constellation"`
- `site:openprocessing.org/sketch/ "starfield"`
- `site:openprocessing.org/sketch/ "Milky Way"`

检索组：r2_design_specific

- `site:awwwards.com "100000" "stars"`
- `site:awwwards.com "Star Atlas"`
- `site:dribbble.com/shots "Constellation Tiger"`
- `site:dribbble.com/shots "Night Explorer Star Map"`

检索组：r2_sandbox_specific

- `site:codesandbox.io/p/sandbox "stars"`
- `site:codesandbox.io "galaxy" "drei"`
- `site:codesandbox.io "constellations"`

检索组：r2_awwwards_domain_filter

- `"100,000 Stars" Awwwards [domain: awwwards.com]`
- `space stars galaxy [domain: awwwards.com]`

检索组：r2_galaxy_starfield_followup

- `site:awwwards.com/sites "galaxy"`
- `site:awwwards.com/sites "solar system"`
- `site:tympanus.net/codrops "starfield"`

## 第三轮：源码、数据、许可交叉核对

读相关实现、项目来源与第三方声明，并追踪教程指向的源项目。

核对标签滞回、星点精灵与FOV阈值、随机Drei星场、人物DOM舞台；区分代码/星表/图绘许可。

检索组：r3_code_provenance

- `"mathiasbno/three-starmap" license`
- `"Point-light Star Texture" "1-Tap"`
- `"VirtualSky" "Milky Way" "github"`

检索组：r3_awwwards_specific

- `"Awwwards" "The Leap For Mankind"`
- `"Awwwards" "NASA" "Prospect"`
- `"Awwwards" "100,000 Stars" -site:assets.awwwards.com`

检索组：r3_visual_perf

- `site:spaceengine.org "star" "magnitude" "rendering"`
- `site:gaiasky.space "star" "rendering"`
- `site:tympanus.net/codrops "galaxy" -site:tympanus.net/codrops/hub/tag`

## 第四轮：针对缺口补查与反证

追踪缩放后的点光源、NASA真实背景、中国图绘缺口；核查与作者介绍可能不一致的说法。

作者公开帖给出WcBSzh原页；NASA天图可作投影基准；Three.js官方文档提示渲染器有WebGL2回退，具体工程兼容性仍需测试。

检索组：r4_sandbox_authors

- `"codesandbox" "galaxy-generator" "safi"`
- `"codesandbox" "interactive constellation" "goeden"`
- `"codesandbox" "nebula" "flodlc"`

检索组：r4_sky_china

- `"二十八宿" "星图" "github" "渲染"`
- `"Chinese constellation" "WebGL" "illustrations"`
- `"Matt Huynh" "Constellation Tiger"`

检索组：r4_original_background

- `"NASA" "Deep Star Maps 2020"`
- `"Point-light Star Texture (1-Tap)" Shadertoy`
- `"Shadertoy" "Simplicity Galaxy"`

## 读到的关键实现与资料

| 对象 | 核查入口 | 本轮实际得到的证据 |
|---|---|---|
| 二十八宿项目 | [SOURCES](https://github.com/SenTomoHiro/twenty-eight-mansions-star-map/blob/main/SOURCES.md)、[第三方声明](https://github.com/SenTomoHiro/twenty-eight-mansions-star-map/blob/main/THIRD_PARTY_NOTICES.md) | 天文与文化资料分层；神像不在Stellarium数据开放许可范围 |
| 人物展示 | [DeityStage](https://github.com/SenTomoHiro/twenty-eight-mansions-star-map/blob/main/src/features/xingxiu/DeityStage.tsx) | 独立DOM舞台与手机图片回退，不能据此认定已有天球锚定人物 |
| 标签 | [skyLabelCollision](https://github.com/SenTomoHiro/twenty-eight-mansions-star-map/blob/main/src/features/sky/skyLabelCollision.ts) | 碰撞框、显隐滞回和缩放限制 |
| SkyEngine | [sky-engine.js](https://github.com/drakkB/skyengine/blob/main/sky-engine.js) | 星点精灵缓存、B−V分档、视场控制标签与fly-to |
| Galaxy Shader | [galaxy.tsx](https://github.com/vercel-labs/nextjs-nights-shader/blob/main/components/galaxy/galaxy.tsx) | 实例化点场、FOV/分辨率尺寸、半分辨率泛光；非真实星表 |
| Drei Stars | [Stars.tsx](https://github.com/pmndrs/drei/blob/master/src/core/Stars.tsx) | 随机位置与尺寸，颜色随序号变化；默认饱和度0 |
| CodePen星座示例 | [Constellation Explorer](https://codepen.io/Nidal95/pen/NPWYWOW) | 手写7组点位、随机背景，星座名称并不能证明坐标正确 |
| 点光源纹理 | [作者公开说明](https://www.reddit.com/r/GraphicsProgramming/comments/1j7uvc9/pointlight_star_texture_1tap/) | 针对放大像素化提出位置/颜色/亮度编码和自定义mip；原作代码未读取 |
| 分形背景 | [Defold教程](https://defold.com/tutorials/shadertoy/)、[Debian分发源码](https://sources.debian.org/src/kodi-visualization-shadertoy/21.0.2%2Bds-1/visualization.shadertoy/resources/shaders/simplicitygalaxy.frag.glsl) | 只确认移植实现；不据分发包总许可认定原作授权 |
| 天图投影 | [NASA SVS](https://svs.gsfc.nasa.gov/4851/) | 真实星表、J2000与银道投影和HDR资料；静态图不能代替历史星位计算 |
| 回退能力反证 | [Three.js官方文档](https://threejs.org/docs/pages/WebGPURenderer.html) | 渲染器支持WebGL2回退；项目README的要求与实际项目兼容性分开验证 |

## 没有直接采用的命中

| 命中或搜索现象 | 处理理由 |
|---|---|
| 随机点距离小就连线的“constellation” | 不当作现代星座或中国星官数据；仅保留个别局部交互参考 |
| [Coding the stars / Supabase Launch Week](https://sup.goedenph.com/blog/interactive-constellation-threejs-react-three-fiber) | 用户票据构成的艺术粒子形状，不是天文星图；未进入本轮短名单 |
| 外部视角的旋涡星系 | 可参考配色与疏密；不能原样作为地球所见银河带 |
| [Cosmos Explorer需求稿](https://github.com/Arrbel/cosmos-explorer/blob/main/requirements.md) | 写了二十八宿需求，不代表功能已完成 |
| Codrops的astro标签 | 常指Astro前端框架；没有把该标签页命中当成天文案例 |
| GitHub技能/提示词仓库、聚合转载 | 未作为可运行星图；外部指令只当资料，不执行其中指令 |
| AI新闻、百科、镜像和无关Steam搜索/愿望单 | 不作为技术结论的证据；转向原作者、官方项目和开发者页面 |
| “89星座”或星官绘制记录数 | 不直接替代IAU 88星座或历史星官统计；分组规则和拆分需另核 |
| Dribbble产品概念 | 不把作者描述中的功能当作已经运行的应用 |

## 访问与验证边界

- OpenProcessing返回了未展开的模板。模板同时出现Archived或hiddenCode文案，不能因此断言具体作品已归档、源码隐藏或不能运行。三条记录均保留为线索。
- 部分CodeSandbox请求返回403；作者页的Galaxy Generator源码可读，但沙盒目标未能打开。两个组件索引没有提升为已验证实现。
- Shadertoy原页本轮不可读，部分抓取返回402。该响应不用于推断平台是否收费；分别记录作者说明、移植实现与原作缺口。
- 白虎作品GIF未成功解析；本轮没有下载媒体绕过显示限制，没有把配色标签或作者说明当成动画目视验证。
- 部分GitHub目录不能由网页读取工具直接展开；使用公开目录HTML与raw文件只读核对已知源文件，未读取本地其他项目或非公开参考图。
- 没有继续操作上一轮被定位授权弹窗交还用户的Stellarium网页任务空间；本轮不把该页文化切换列为已实测。
- 未安装依赖、构建候选项目、执行候选代码或运行Steam应用；本轮产物是研究资料，未覆盖iPhone实测与帧时验收。

## 下一步补证据时应记录

- 固定代码提交、依赖版本、文化包版本和具体图绘来源；
- 将“作者声称”“读到实现”“本机运行”“iPhone实测”分别写清；
- 为单颗亮星、密集星、星座图绘与中国星官建立相同视角的对照；
- 保留源码、数据和图像各自的许可，按实际要采用的部分核实；
- 页面受限时保留真实阻塞，不把索引、模板或截图代替完整实现。

