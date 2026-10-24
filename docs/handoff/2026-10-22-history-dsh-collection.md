# 古人同望：DSH 50条采集续跑交接

> 后续更新：四条西历日期的数值对应关系、独立上下文并发与自动返修结果，见[专项复核交接](2026-10-22-history-dsh-parallel.md)。原网页明确声明历法的覆盖率仍为0/4。本文保留上一轮基线与当时评价，不倒改原运行结果。

2026-10-22。继续使用DSH及硅基流动 `deepseek-ai/DeepSeek-V4.1-Flash`。**已补齐50条通过采集初核的资料：30条出生、20条事件，相对原种子新增35条；50条历法运算数值一致。4条网页西历约定仍待核，不能称为50条正式入库终审通过。**

本轮证明的是：在主线程分批编排、提供线索、脚本校验和语义纠正的条件下，模型能够继续采集，并实际运行归并、校历、检查、导出。它没有一次无干预完成全流程，仍会沿用错误证据路径、写出不统一的来源类型，或把成长地句子当出生地证据。最后一次DSH运行已经在自身沙箱内执行两条命令并返回PASS。

**交付与验收**

| 项目 | 实际结果 |
| --- | --- |
| JSON / CSV / 唯一记录 | 50 / 50 / 50 |
| 类型与相对原种子新增 | 出生30、事件20；新增35 |
| 不同来源网址 | 61；有对应正文缓存，未据搜索摘要直接通过 |
| 字段、引文与完整缓存、CSV一致性 | 50条通过 |
| 历法数值复核 | 50条一致；含干支、月长与跨年检查 |
| 网页西历约定待核 | H001欧阳修、H002苏轼、H020岳飞、H021文天祥 |
| 原候选留档与替代 | 10条，原输入及旧评价保留 |
| 正式入库终审 | 未执行；不把采集通过标签当作终审 |

[50条JSON](../../output/history-dsh-collection-20261022/workspace/records.json) · [CSV](../../output/history-dsh-collection-20261022/workspace/records.csv) · [检查结果](../../output/history-dsh-collection-20261022/workspace/validation.json) · [主线程核查回执](../../output/history-dsh-collection-20261022/main-review-receipt.json) · [排除/替代记录](../../output/history-dsh-collection-20261022/workspace/excluded-replaced.json)

**规范与执行改动**

采用[采集作业规范v2](../../output/history-dsh-collection-20261022/collection-spec.md)：原历具体日、实际出生/事件地点、可信正文和可对照的短引构成采集门槛；坐标精化、观测时刻、版本及正式入库另列。每次派4–5条，提交事实与证据补丁，由控制器统一合并、计算和导出。无法证实的候选留档，用其他有据资料补足。

之前整轮扩搜和深层模板复写没有形成稳定检查点。本轮也发现报告默认写到工作区外，会触发DSH沙箱；现用 `--reports-in-workspace` 在原沙箱范围内输出报告，没有放宽数据验收或扩大到应用目录。模型能力声明和请求角色的兼容调整仅位于本任务配置，未修改全局DSH设置。

主线程纠正了5条旧证据路径，恢复既有新增标志，将文天祥地点改为机构明确证明的庐陵县范围，避免把李鸿章旧网页的现代区划括注当现行归属，并为达尔文改用正文明确的出生句。来源类型的同义值统一为既定枚举；没有把百科或未读摘要归一成可信机构。

[控制器修正记录](../../output/history-dsh-collection-20261022/controller-corrections.json) · [原始首批模型输出](../../output/history-dsh-collection-20261022/workspace/batch-1.json) · [末批原始模型主表](../../output/history-dsh-collection-20261022/attempt-8/raw-model-records.json) · [最后DSH运行记录](../../output/history-dsh-collection-20261022/attempt-10/run-metadata.json) · [最后DSH输出](../../output/history-dsh-collection-20261022/attempt-10/stdout.txt)

**逐条名单**

日期列保留所引原历记载；PG列是前推格里高利历计算结果。†表示网页西历约定另待核，不能把计算值冒充该网页明确写出的历法声明。所有JDN都是名义民用日的日序，未据此生成出生/观测UTC。地点精度按资料保留；例如张之洞只到贵州，不补兴义府或安龙出生地。

| ID | 类型 / 名称 | 来源原历日期 | 地点 | PG计算日期 | 信源 |
| --- | --- | --- | --- | --- | --- |
| H001 | 出生 · 欧阳修 | 北宋景德四年六月二十一日（原历） | 绵州（今四川绵阳） | 1007-08-12 † | [1](<https://www.aisixiang.com/data/104732.html>) [2](<https://m.thepaper.cn/newsDetail_forward_8941589>) |
| H002 | 出生 · 苏轼 | 景祐三年十二月十九日（中国原历） | 眉州眉山县城纱縠行 | 1037-01-14 † | [1](<https://fns.pdsu.edu.cn/info/1062/1655.htm>) |
| H005 | 出生 · 沈复 | 清乾隆二十八年十一月二十二日（原文乾隆癸未冬） | 长洲（今江苏苏州） | 1763-12-26 | [1](<https://zh.wikisource.org/zh-hans/閨房記樂>) [2](<http://diqing.difangzhi.cssn.cn/gjmr/202005/t20200522_5132984.shtml>) |
| H006 | 出生 · 康熙帝 | 顺治十一年三月十八日（中国原历） | 紫禁城景仁宫 | 1654-05-04 | [1](<https://www.dpm.org.cn/court/lineage/226256.html>) |
| H007 | 出生 · 乾隆帝 | 康熙五十年八月十三日（中国原历） | 雍亲王府（今雍和宫） | 1711-09-25 | [1](<https://www.dpm.org.cn/court/lineage/226263.html>) |
| H008 | 出生 · 嘉庆帝 | 乾隆二十五年十月初六日（中国原历） | 圆明园天地一家春 | 1760-11-13 | [1](<https://www.dpm.org.cn/court/lineage/226238.html>) |
| H009 | 出生 · 道光帝 | 乾隆四十七年八月初十日（中国原历） | 紫禁城撷芳殿中所 | 1782-09-16 | [1](<https://www.dpm.org.cn/court/lineage/226239.html>) |
| H010 | 出生 · 顺治帝 | 崇德三年正月三十日（中国原历） | 盛京永福宫（今沈阳） | 1638-03-15 | [1](<https://www.dpm.org.cn/court/lineage/226262.html>) |
| H012 | 出生 · 宋太祖 | 后唐天成二年二月十六日（中国原历） | 西京大内甲马营（洛阳） | 0927-03-26 | [1](<https://zh.wikisource.org/wiki/%E5%AE%8B%E6%9C%9D%E4%BA%8B%E5%AF%A6_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B701>) |
| H013 | 出生 · 明太祖 | 元天历元年九月十八日子丑（中国原历） | 濠州钟离东乡 | 1328-10-29 | [1](<https://zh.wikisource.org/wiki/%E5%A4%A7%E6%98%8E%E5%A4%AA%E7%A5%96%E9%AB%98%E7%9A%87%E5%B8%9D%E5%AF%A6%E9%8C%84/%E5%8D%B7001>) |
| H014 | 出生 · 多尔衮 | 明万历四十年十月二十五日（中国原历） | 赫图阿拉（今辽宁新宾老城） | 1612-11-17 | [1](<https://www.dpm.org.cn/lemmas/243192.html>) |
| H015 | 出生 · 雍正帝 | 康熙十七年十月三十日（中国原历） | 紫禁城 | 1678-12-13 | [1](<https://www.dpm.org.cn/court/lineage/226259.html>) |
| H016 | 出生 · 咸丰帝 | 道光十一年六月初九日（中国原历） | 圆明园湛静斋（后更名基福堂） | 1831-07-17 | [1](<https://www.dpm.org.cn/court/lineage/226247.html>) |
| H017 | 出生 · 同治帝 | 咸丰六年三月二十三日（中国原历） | 紫禁城储秀宫 | 1856-04-27 | [1](<https://www.dpm.org.cn/court/lineage/226248.html>) |
| H018 | 出生 · 光绪帝 | 同治十年六月二十六日（中国原历） | 太平湖醇王府邸槐荫斋 | 1871-08-12 | [1](<https://www.dpm.org.cn/court/lineage/226254.html>) |
| H019 | 出生 · 宣统帝 | 光绪三十二年正月十四日（中国原历） | 什刹海醇王府邸 | 1906-02-07 | [1](<https://www.dpm.org.cn/court/lineage/226255.html>) |
| H020 | 出生 · 岳飞 | 崇宁二年二月十五日（中国原历） | 相州汤阴县（今河南安阳汤阴县） | 1103-03-31 † | [1](<https://zh.wikisource.org/zh-hant/%E9%87%91%E4%BD%97%E7%A8%A1%E7%B7%A8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B704>) [2](<https://www.hzarchives.org.cn/info/4732>) |
| H021 | 出生 · 文天祥 | 端平三年五月初二日子时（中国原历） | 江西吉州庐陵县（今江西吉安地区） | 1236-06-13 † | [1](<https://zh.wikisource.org/zh/%E5%AE%8B%E5%B0%91%E4%BF%9D%E3%80%81%E5%8F%B3%E4%B8%9E%E7%9B%B8%E5%85%BC%E6%A8%9E%E5%AF%86%E4%BD%BF%E3%80%81%E4%BF%A1%E5%9C%8B%E5%85%AC%E6%96%87%E5%B1%B1%E5%85%88%E7%94%9F%E7%B4%80%E5%B9%B4%E9%8C%84>) [2](<https://www.shanwei.gov.cn/shanwei/swzdly/whjg/whjg03/gzdt/content/post_1211811.html>) |
| H022 | 出生 · 李鸿章 | 道光三年正月初五日（中国原历） | 清安徽合肥县东乡磨店乡 | 1823-02-15 | [1](<http://lihongzhang.org.cn/a/yjyhd/xszz/265.html>) |
| H023 | 出生 · 曾国藩 | 嘉庆十六年十月十一日亥时（中国原历） | 湖南湘乡荷塘都白杨坪（清代湘乡县） | 1811-11-26 | [1](<https://zh.wikisource.org/zh-hans/%E6%9B%BE%E6%96%87%E6%AD%A3%E5%85%AC%E5%B9%B4%E8%AD%9C>) |
| H024 | 出生 · 左宗棠 | 嘉庆十七年十月初七日寅时（中国原历） | 湘阴东乡左家塅（今湖南湘阴界头铺镇新光村左家段） | 1812-11-10 | [1](<https://www.shidianguji.com/mid-page/7530033373696409638>) [2](<https://www.xiangyin.gov.cn/31165/57978/57981/content_1597278.html>) [3](<https://www.xiangyin.gov.cn/31165/31172/content_978011.html>) |
| H025 | 出生 · 林则徐 | 乾隆五十年七月二十六日（中国原历） | 福建侯官鼓东街（今福州鼓楼区） | 1785-08-30 | [1](<https://www.minhou.gov.cn/xjwz/mlmh/rwls/gjmr/201706/t20170619_949982.htm>) |
| H026 | 出生 · 张之洞 | 道光十七年八月初三日（中国原历） | 贵州（具体出生县份未由来源证明；兴义府为成长地） | 1837-09-02 | [1](<https://www.gzal.gov.cn/zjal/lsyg/202603/t20260319_89886888.html>) |
| H027 | 出生 · 康有为 | 咸丰八年二月初五日（中国原历） | 南海丹灶银塘苏村敦仁里 | 1858-03-19 | [1](<http://www.nanhai.gov.cn/fsnhq/rwnh/nhyj/nhmr/content/post_1087145.html>) |
| H028 | 出生 · 梁启超 | 同治十二年正月二十六日（中国原历） | 广东新会熊子乡茶坑村 | 1873-02-23 | [1](<https://daj.fuzhou.gov.cn/zz/wszt/tslm/fzmr/202104/t20210428_4087947.htm>) [2](<https://www.chinawriter.com.cn/n1/2023/0309/c404064-32640031.html>) |
| H029 | 出生 · 孙中山 | 同治五年十月初六日（中国原历） | 广东香山（今中山市）翠亨村孙中山故居前院祖屋遗址（1866年11月12日出生于此） | 1866-11-12 | [1](<https://www.macaumemory.mo/entries_cc80c6d7104c45cf8f3ed8553463344c?lgType=zh-cn>) [2](<https://sunyat-sen.org/index.php/portal/list/index.html?id=98>) |
| H030 | 出生 · 蔡元培 | 同治六年十二月十七日（中国原历） | 浙江绍兴城内笔飞弄 | 1868-01-11 | [1](<https://www.zjda.gov.cn/art/2009/4/15/art_1378529_12510739.html>) |
| H051 | 出生 · 龚自珍 | 1792年8月22日（网页Gregorian） | 杭州 | 1792-08-22 | [1](<https://www.hzarchives.org.cn/info/4742>) |
| H052 | 出生 · 鲁迅 | 1881年9月25日（网页Gregorian） | 绍兴城内东昌坊新台门周家 | 1881-09-25 | [1](<https://sz.sx.gov.cn/col/col1228978002/art/2026/art_d2d157c46b6e427d992da7b521790e4d.html>) |
| H060 | 出生 · 查尔斯·达尔文出生 | 1809年2月12日 | 英格兰什鲁斯伯里（Shrewsbury） | 1809-02-12 | [1](<https://darwinproject.ac.uk/people/about-darwin>) |
| H031 | 事件 · 兰亭雅集 | 东晋永和九年三月初三日（中国原历） | 会稽山阴兰亭（今浙江绍兴） | 0353-04-23 | [1](<https://www.dpm.org.cn/collection/impres/228604.html>) |
| H032 | 事件 · 柳宗元始得西山宴游 | 唐元和四年九月二十八日（中国原历） | 永州西山 | 0809-11-13 | [1](<https://zh.wikisource.org/wiki/%E5%85%A8%E5%94%90%E6%96%87/%E5%8D%B70581>) |
| H033 | 事件 · 承天寺夜游 | 北宋元丰六年十月十二日夜（中国原历） | 黄州承天寺 | 1083-11-30 | [1](<https://zh.wikisource.org/wiki/%E8%A8%98%E6%89%BF%E5%A4%A9%E5%AF%BA%E5%A4%9C%E9%81%8A>) |
| H037 | 事件 · 袁宏道满井游 | 明万历二十七年二月二十二日（中国原历；文末己亥） | 北京东直门外满井 | 1599-03-18 | [1](<https://zh.wikisource.org/zh-hans/%E6%BB%BF%E4%BA%95%E9%81%8A%E8%A8%98>) |
| H038 | 事件 · 徐霞客游记开篇出发 | 明万历四十一年三月晦（中国原历；癸丑年） | 宁海西门 | 1613-05-19 | [1](<https://zh.wikisource.org/wiki/%E5%BE%90%E9%9C%9E%E5%AE%A2%E9%81%8A%E8%A8%98/%E9%81%8A%E5%A4%A9%E5%8F%B0%E5%B1%B1%E6%97%A5%E8%A8%98>) |
| H040 | 事件 · 赫歇尔发现天王星 | 1781-03-13（Gregorian） | 英国巴斯 New King Street 19 号住宅后花园 | 1781-03-13 | [1](<https://herschelmuseum.org.uk/about/explore/>) |
| H041 | 事件 · 玄武门之变 | 唐武德九年六月初四日（中国原历） | 长安宫城玄武门 | 0626-07-05 | [1](<https://zh.wikisource.org/wiki/%E8%88%8A%E5%94%90%E6%9B%B8/%E5%8D%B72>) |
| H042 | 事件 · 安禄山范阳起兵 | 唐天宝十四载十一月甲子（中国原历） | 范阳（唐幽州蓟城，安禄山起兵地） | 0755-12-20 | [1](<https://zh.wikisource.org/wiki/%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91/%E5%8D%B7217>) [2](<https://www.bjrd.gov.cn/fwhd/bjrdzz/2025n/d2q/bjsq02/202503/t20250318_4037622.html>) |
| H043 | 事件 · 陈桥兵变（黄袍加身） | 后周显德七年（宋建隆元年）正月癸卯夜宿陈桥驿，翌日甲辰黄袍加身（中国原历） | 陈桥驿 | 0960-02-08 | [1](<https://zh.wikisource.org/wiki/%E7%BA%8C%E8%B3%87%E6%B2%BB%E9%80%9A%E9%91%91%E9%95%B7%E7%B7%A8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B7001>) |
| H044 | 事件 · 靖康之变汴京城陷 | 北宋靖康元年闰十一月丙辰（中国原历） | 汴京（今河南开封） | 1127-01-16 | [1](<https://zh.wikisource.org/zh-hant/%E5%AE%8B%E5%8F%B2%E7%B4%80%E4%BA%8B%E6%9C%AC%E6%9C%AB_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B713>) |
| H046 | 事件 · 土木堡之变 | 明正统十四年八月壬戌（中国原历） | 土木堡（今河北怀来境内） | 1449-09-10 | [1](<https://zh.wikisource.org/wiki/%E6%98%8E%E5%8F%B2/%E5%8D%B7304>) |
| H048 | 事件 · 中英《南京条约》签订 | 1842年8月29日（道光二十二年七月二十四日） | 南京下关江面英舰康华丽号 | 1842-08-29 | [1](<https://njjhs.cn/Collection/54.html>) |
| H049 | 事件 · 武昌起义 | 1911-10-10晚（Gregorian） | 武昌湖北新军工程第八营 | 1911-10-10 | [1](<https://www.ezhou.gov.cn/zjez/ezrw/ezss/201408/t20140829_44630.html>) |
| H053 | 事件 · 虎门销烟开始 | 1839年6月3日（销烟开始日） | 广东虎门海滩 | 1839-06-03 | [1](<https://www.chnmuseum.cn/zp/zpml/gmww/202104/t20210402_249493.shtml>) |
| H054 | 事件 · 皮亚齐首次发现谷神星 | 1801年1月1日（网页日期） | 意大利西西里巴勒莫天文台 | 1801-01-01 | [1](<https://www.jpl.nasa.gov/news/ceres-keeping-well-guarded-secrets-for-215-years/>) |
| H055 | 事件 · 伽勒辨认海王星 | 1846年9月23日（机构采用发现纪念日期） | 柏林天文台 | 1846-09-23 | [1](<https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html>) [2](<https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet/>) |
| H056 | 事件 · 伽利略首次记下木星附近星点 | 1610年1月7日 | 意大利帕多瓦（Padua） | 1610-01-07 | [1](<https://www.nasa.gov/general/415-years-ago-astronomer-galileo-discovers-jupiters-moons/>) [2](<https://www.jpl.nasa.gov/videos/whats-up-february-2010-galileos-first-telescopic-view-of-jupiter/>) |
| H057 | 事件 · 孟德尔首次报告豌豆杂交研究 | 1865年2月8日 | 布尔诺（Brno） | 1865-02-08 | [1](<https://mendelzije.mendelu.cz/en/g-j-mendel>) |
| H058 | 事件 · 郑荷投降协议签订 | 1662年2月1日 | 大员热兰遮城 | 1662-02-01 | [1](<https://zh.wikisource.org/wiki/鄭荷之戰荷蘭降書>) |
| H059 | 事件 · 广州三二九起义发动 | 1911年4月27日 | 广州两广总督署（两广总督衙门）一带 | 1911-04-27 | [1](<https://www.cppcc.gov.cn/zxww/xinhai100/gmfc/index.shtml>) |

**原候选如何处理**

| 原ID / 名称 | 本轮处理依据 | 替代ID |
| --- | --- | --- |
| H003 · 王阳明 | 原年谱九月三十与丁亥不合，未找到足以校正原文的版本依据，保留冲突。 | H051 |
| H004 · 唐寅 | 墓志原历日已读；出生范围及另见机构日期表述线索仍需对照，本次不将未读摘要当确定结论，也不强行升级为无争议样本。 | H052 |
| H011 · 唐太宗 | 《旧唐书》原历记载已读；复核发现出生年存在异说线索，未完成版本考证，本次替换，保留所引原文而不改史书年份。 | H060 |
| H034 · 陆游入蜀启行 | 《入蜀记》提要/正文闰月记载的差异未完成版本核对，本轮不强行消除，原候选留档。 | H053 |
| H035 · 陆游入蜀次日行程 | 同一《入蜀记》闰月记载差异未完成版本核对，保留连续行程的原始候选。 | H054 |
| H036 · 陆游渡钱塘江 | 同一《入蜀记》闰月记载差异未完成版本核对，保留原始路线和时段。 | H055 |
| H039 · 沈复陈芸成婚 | 婚日有原文，婚礼地点只见苏州生活背景，不能自动等同婚礼发生地。 | H056 |
| H045 · 郑和首次下西洋奉使（受命） | 受命日与后续出航路线不同；原资料未证明同日颁诏地点，未合并为确定事件。 | H057 |
| H047 · 袁崇焕被磔 | 所读《明史》仅到崇祯三年八月，无具体日，不从通俗介绍补日。 | H058 |
| H050 · 戊戌变法开始 | 变法始日可核，所引页面未直接证明颁诏发生地；本次不据北京为首都的常识补成已证地点。 | H059 |

欧阳修保留学术考辨的处理依据，采集原历六月二十一，不将网页未声明约定的西历日期直接标成PG。沈复复用上轮已改正的乾隆二十八年，并补入明确出生长洲的机构资料。朱元璋出生区域依据原书“父迁东乡—生上—后迁西乡”的叙事，未定位房间；柳宗元西山的永州对应使用同卷法华寺西亭文章的上下文关联，不等于已经核定现代山体坐标。

**仍需交给后续专项工作的部分**

4条西历表述的约定、古籍版次与历史校历仍需继续复核。sxtwl和YT Liu表的历史修正资料存在渊源交叉，两实现同值证明的是计算一致性，不能称为两份独立历史证词。区域代表方式、观测时刻假设及正式产品日期接口尚未接入；没有补午夜UTC或猜宅址坐标。少数页面直连受限，已保留先前实际取得的正文缓存和访问情况，不宣称所有网址此刻都能直连。

旧[首轮初筛](2026-10-22-history-dsh-sample.md)和[扩展资料链试跑](2026-10-22-history-dsh-fullflow.md)保持原结论；本轮“50条采集初核”与旧“8条扩展资料链”不是同一验收层级，不能比较成同一通过率。累计10次DSH调用的主动执行时间为3011.50秒，其中包含超时和启动/权限失败；这不是一次顺畅无人接管的基准成绩。

**复现**

在本实验workspace运行：

```sh
python3 ../assemble-collection.py --reports-in-workspace
python3 ../check-collection.py --reports-in-workspace
```

[归并/校历/导出脚本](../../output/history-dsh-collection-20261022/assemble-collection.py) · [检查脚本](../../output/history-dsh-collection-20261022/check-collection.py) · [逐条历法输入输出](../../output/history-dsh-collection-20261022/workspace/calendar-results/) · [DSH摘要](../../output/history-dsh-collection-20261022/workspace/summary.md)

全部操作限于研究资料与交接文件。本轮未修改LuBirth应用、创建分支/worktree、启动协作子agent，未提交、推送或发布。
