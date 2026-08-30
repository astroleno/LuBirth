# 微信小程序正式迁移边界（条件性草案）

状态：仅在 Spike 最终得到 `GO-FULL` 或 `GO-ADAPTIVE` 后生效。当前决策为 `INCONCLUSIVE`，本文不授权开始正式迁移。

## 建议目标边界

正式迁移应形成三个明确层次：

1. **共享纯核心**：天文计算、坐标映射、固定场景配置、结果 schema 和不依赖宿主的 Shader 源。
2. **渲染核心**：命令式 scene/pass、资源语义和 PIP，依赖注入后的 `THREE` 与 renderer，不直接访问 DOM 或 `wx`。
3. **宿主层**：Web 保留 React/R3F UI，小程序使用原生 Page/Canvas；各自负责输入、存储、网络、截图、音频和生命周期。

共享目标是业务和数学语义，不是强迫 Web 与小程序共用 UI 宿主。

## 可直接复用或抽取

| 模块 | 建议 | 条件 |
|---|---|---|
| `src/astro/` 天文算法与测试 | 单一源码共享 | 保持无 DOM 依赖；Web/小程序同 revision 比较 |
| 坐标、固定太阳、出生点对齐 | 抽为纯函数 | 明确 Y-up/ECEF 映射和方向向量语义 |
| Shader 源与 uniform schema | 同源管理 | 平台差异必须是显式 capability 分支并有测试 |
| 场景/资源/结果类型 | 共享类型 | 不把 `wx` 或 React 类型泄漏进核心 |
| PIP cadence 与性能统计 | 共享纯逻辑 | renderer 和 RAF 由宿主注入 |

## 必须重写或保留平台实现

| 现有 Web 能力 | 小程序边界 |
|---|---|
| React DOM、R3F Canvas、Drei、OrbitControls | 原生 Page + 命令式 Three + 触摸控制器 |
| `window`/`document`/DOM Image/URL 参数 | Canvas 作用域 API、页面 data/事件、构建期配置 |
| 浏览器纹理加载与缓存 | `wx.downloadFile`、Canvas Image、GPU 上传和资源域名 |
| `localStorage`/浏览器下载 | 小程序文件系统、剪贴板或后续上传接口 |
| 浏览器 RAF/visibility/unload | `onShow/onHide/onUnload/onMemoryWarning` |
| Web 截图与音频 | 后续独立需求，不属于本 Spike 的迁移通过条件 |

## 运行时选择规则

- r160 真机通过且适配仍限于 Canvas 边界时，正式路线优先 r160。
- 只有 r108 通过时，先完成 API/Shader/色彩管理差异清单和升级责任评审；不得把“能显示”直接等同于可维护。
- 任一路线若要求长期修改 renderer、shader chunk、material 或 Three 色彩管理核心，按私有 fork 处理，并重新评估 `NO-GO-NATIVE`。

## 画质策略规则

- 2K 是完整效果基线，不是删减效果档；必须包含地球、云层、大气、月相和 PIP。
- 8K 是独立压力档。若设备矩阵只支持部分设备，产品需确认分级画质、最低机型、默认档和用户提示，之后才可进入 `GO-ADAPTIVE` 迁移计划。
- 内存告警允许回到已建立的 2K 基线，但原始 8K 失败仍保留，不能被记录成 8K 通过。

## 正式迁移前的架构检查点

1. 锁定最低机型、微信版本和基础库版本。
2. 根据真机矩阵确认 r160 或 r108，并签署适配维护范围。
3. 决定 8K 是否强制、可选或不支持。
4. 设计共享核心包及 Web 回归策略；不直接搬运 `SimpleTest.tsx`。
5. 为 Shader、天文、资源和 PIP 建立跨宿主回归，保留 Spike 的固定场景与结果 schema。
6. 单独规划登录、分享、音频、截图、城市搜索和正式 UI；这些没有被本 Spike 验证。

## 粗粒度工作包（非排期）

- 共享天文/坐标/Shader 核心抽取与双宿主回归。
- 小程序 renderer、资源与生命周期平台层产品化。
- 命令式核心场景和 PIP 完整参数化。
- 原生页面交互与业务功能实现。
- 设备矩阵、长稳、包体、网络与发布验收。

在真机证据闭合前不提供人日承诺；否则估算会把运行时或 8K 风险错误当成已解决问题。
