# 古人同望：DSH完整资料流程试跑

2026-10-22。沿用[50条搜集试跑](2026-10-22-history-dsh-sample.md)，实际调用已安装的DSH及硅基流动`deepseek-ai/DeepSeek-V4.1-Flash`。本次处理研究资料，不接入正式页面，不提交或发布。

## 当前结论

**可以让它执行补证、纠错、历法计算、地点核对、检查返修和导出；本次尚未证明它能独立交付50条全部合格的数据。**

本次实际运行了这些环节，并由主线程逐轮检查、将错误退回同一DSH会话修复。最终50条仍为30条出生、20条事件；模型将8条列入资料链通过组、37条待补证、5条冲突。主线程另写的字段与数值检查也得到8条通过，但这不代替史料真实性的终审。

上一轮的30条是“信源候选初筛”，本轮8条使用更完整的资料链要求，两个数字不能当成同一层级的通过率比较。**50条全部合格的验收结果仍是FAIL。**

| 检查 | 实际结果 |
| --- | --- |
| 主表JSON / CSV / 唯一ID | 各50条，30出生 / 20事件 |
| 模型验证器的结构、数值与引用检查 | 3047项，0项失败，schema PASS |
| 主线程另写的字段 / JDN / 证据引用检查 | 8条达到所设字段检查条件 |
| 模型资料链状态 | verified 8 / pending 37 / conflicting 5 |
| 50条整体质量门槛 | FAIL |
| 主线程实际运行一键检查 / 导出 | 验证器退出1，导出退出0，整体命令退出1 |

模型验证器“结构PASS”和“整体FAIL”同时存在是正确的：待核记录可以合法保存，但不能混入50条全部合格的交付结果。最后的一键脚本已经传播质量门禁的非零退出码，不会因为CSV生成成功就报全部通过。

## 实际执行过程

| 轮次 | DSH主动执行时间 | 结果 |
| --- | ---: | --- |
| 1 | 1200.08秒 | 建立主表、历法程序、来源摘录、地点查询及验证器；窗口超时，检查失败 |
| 2 | 807.79秒 | 根据外审修地名与来源语义，生成CSV、排除表、变更记录、版本和复现文件；整体质量仍失败 |
| 3 | 198.82秒 | 修外部日期锚点、来源历法推定、方法说明、条件状态和门禁退出码 |
| 4 | 112.00秒 | 补孙中山明确出生地点的机构原文，纠正余下方法说明并重跑 |

主动执行累计2318.69秒，约38分39秒，不含主线程核查及轮次间隔。本结果包含多次明确反馈，不能称作模型一次无干预的自主交付。

每轮的提示、运行记录及先前输出快照保存在[实验目录](../../output/history-dsh-fullflow-20261022/)。全程使用同一模型路由，没有启动其他协作agent。使用任务内独立DSH状态和本地计算依赖，没有修改全局模型配置或LuBirth应用。

## 确实完成的工作

- **来源与角色**：补读机构资料，区分生日、籍贯、祖居、实际出生地点、事件日期与后续路线。没有把缺日补成1日，也没有为日期级记录补午夜UTC。
- **历法计算**：实际运行sxtwl历史历实现、YT Liu历史历表及明确的Julian / Gregorian / proleptic-Gregorian日序运算，保存输入、输出、版本和JDN。格里高利日序另用convertdate与自写公式核对。
- **地点与精度**：保存OSM/Nominatim来源、代表点、范围或路线说明；明确代表点不是出生宅址。出生或事件地点语义不足的条目保留待核。
- **返修**：自动检查实际报错后继续修复，保留旧问题和更改记录。主线程核查发现的问题也退给DSH处理。
- **交付**：50条JSON、CSV、未达标表、检查JSON、变更记录、依赖/版本/哈希、复现脚本和说明均已落盘。

8条资料链通过组为：**多尔衮、林则徐、康有为、梁启超、孙中山、蔡元培出生，以及赫歇尔发现天王星、武昌起义**。这些条目使用明确日期和标注精度的地理代表点；没有据此声称所有历史观测时刻或出生宅址均已精确确定。

## 外部核查拦住的问题

1. **自评不能作验收。** 初轮曾自评37条verified，但自己的验证器报错；主线程又发现部分出生地和历史地名对应没有充分依据。
2. **实现一致不等于两份独立史料。** YT Liu的说明明确提到古代主表及寿星历作者修正，sxtwl也含历史修正表。两者的共同来源已披露，不能只凭两个程序同值宣布历史校历完成。[YT Liu编算说明](https://ytliu0.github.io/ChineseCalendar/computation_simp.html)、[sxtwl历史修正实现](https://raw.githubusercontent.com/yuangu/sxtwl_cpp/master/src/SSQ.cpp)
3. **苏轼日期不能靠1582年规则替来源作声明。** 年谱网页称1037-01-08为“公历”，并未明说Julian；模型最初自行赋予Julian约定。现已降为待核，保留原历换算结果的条件性，不把来源未说的历法当事实。
4. **范阳不能直接匹配现代房山。** 已补读北京市人大关于起兵地蓟城与幽州城位置的资料，修正先前错误地点对应。[北京市人大《北京从这里走来》](https://www.bjrd.gov.cn/fwhd/bjrdzz/2025n/d2q/bjsq02/202503/t20250318_4037622.html)
5. **孙中山条目必须另补出生地证据。** 澳门记忆中的籍贯式介绍不足以单独证明出生地；DSH后来读到故居纪念馆对祖居遗址的明确出生记载。主线程独立HTTP读取该页，确认相关地点与出生句存在；没有拿1892年建成的故居主楼当1866年的出生房。[故居纪念馆原状陈列](https://sunyat-sen.org/index.php/portal/list/index.html?id=98)、[主线程读取记录](../../output/history-dsh-fullflow-20261022/independent-source-checks/sun-museum.json)
6. **元数据也需验。** 曾出现日期锚点URL没有对应到已读证据、格里高利算法说明被写成中国历法、verified同时残留conditional、占位题名及重复来源等，已经过返修。

这些问题说明外部验收仍有必要，不能让它仅凭自己的status字段决定资料是否可用。

## 尚未达到的要求

37条待补证、5条冲突仍没有消失；模型本次没有以可证条目替换掉这些困难候选，**因此50条全合格目标没有完成**。主要缺口包括缺月日、生日异说、干支与数字日不合、闰月版本差异、历史地点语义与对应，以及充分的历法外部对照。不同缺口会同时出现在同一条记录上，数量不可直接相加。

部分自由文本notes仍保留前轮审查意见，需结合新增sources、resolved和change_log阅读；例如孙中山原来的“无来源”旧备注并不反映后来已补入的机构证据。这也是正式入库前需要统一清理的项目。复用条件记录不代表已批准商业发布。

主页面接入、日期适配器、示范观测时间选择、产品展示及发布都未执行。本次文件适合继续复核和交接，不能把模型verified标签当作无条件入库许可。

## 可复查交付

- [50条JSON](../../output/history-dsh-fullflow-20261022/workspace/records.json) · [50条CSV](../../output/history-dsh-fullflow-20261022/workspace/records.csv)
- [42条未达标及原因](../../output/history-dsh-fullflow-20261022/workspace/excluded-or-pending.json) · [模型摘要](../../output/history-dsh-fullflow-20261022/workspace/summary.md)
- [模型检查结果](../../output/history-dsh-fullflow-20261022/workspace/validation.json) · [主线程另写的检查结果](../../output/history-dsh-fullflow-20261022/external-checks.json)
- [主线程独立重跑日志](../../output/history-dsh-fullflow-20261022/independent-reproduction.log) · [一键脚本](../../output/history-dsh-fullflow-20261022/workspace/reproduce.sh) · [复现说明](../../output/history-dsh-fullflow-20261022/workspace/reproduce.md)
- [变更记录](../../output/history-dsh-fullflow-20261022/workspace/change_log.json) · [版本与哈希](../../output/history-dsh-fullflow-20261022/workspace/versions.json)
- [首轮完整任务接口与要求](../../output/history-dsh-fullflow-20261022/workspace/task.md) · [外审反馈](../../output/history-dsh-fullflow-20261022/external-review.md) · [后续具体核查反馈](../../output/history-dsh-fullflow-20261022/external-final-review.md)

原50条输入及46份来源正文/元数据快照的95个输入文件哈希保持不变。未保存API密钥值到交付文件，也没有将模型内部推理日志作为资料出处。
