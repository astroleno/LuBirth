# 公农历对照资料

浏览器用 `src/calendar/hkoLunarMonths.json` 在本地换算公历 1901-01-01 至 2100-12-31。农历纪年在正月初一切换，月份以正数表示常月，以负数表示同月的闰月。区间起点是农历 1900 年十一月十一。区间末日是农历 2100 年十二月初一，该月大小由下一次朔推得，可换算日期仍以区间末日为限。

`scripts/generate-chinese-lunar-data.mjs` 通过项目已有的 MIT 许可 Astronomy Engine 离线计算朔和中气，再按北京时间的日界与冬至后的置闰规则排布农历月。生成器记录计算库版本，并依香港天文台公农历对照表校准五个月首日期。香港特别行政区政府及香港天文台是所参照原表资料的权利人。[香港天文台公农历对照表](https://www.hko.gov.hk/tc/gts/time/conversion.htm) · [香港天文台资料使用条件](https://www.hko.gov.hk/en/readme/readme.htm) · [GB/T 33661-2017《农历的编算和颁行》](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=E107EA4DE9725EDF819F33C60A44B296) · [Astronomy Engine MIT 许可](https://github.com/cosinekitty/astronomy/blob/master/LICENSE)

2026-11-25 核对了香港天文台 200 份年度纯文字表的 73,049 天。月份编号、闰月编号及 2,475 个首日全部一致。年表 SHA-256 按公历年升序合并 `YYYY:sha256\n` 后再次计算，结果记录在 JSON。

`src/calendar/hkoNewMoonDates.json` 记录五处模型朔在 UTC+8 的日期与天文台历表初一的差异，另记录天文台注明接近午夜、两者当前同为 9 月 4 日的 2089 年朔。生成器与天文日历共用这份记录。公农历换算遵循已核对的历表版本。天文日历并列显示相关的历表初一、UTC+8 推算朔及需要时的当地时间，保留模型计算的 UTC。天文台指出，数十年后接近午夜的朔可能因数分钟的推算误差而相差一个公历日。[香港天文台公农历对照表注释](https://www.hko.gov.hk/tc/gts/time/conversion.htm)

历史历表日期沿用当时日界。民国历书使用的北京地方平时比今 UTC+8 慢约 14 分钟。《一百六十年历表》序第 ii 页以 1916 年正月初一为例，列出香港天文台历表采用的旧历日期 2 月 3 日及按今制所得的 2 月 4 日。[科学出版社《一百六十年历表》](https://www.ecsponline.com/yz/B85F68F80F9344CA383FFD69174AFA6DD000.pdf)

运行 `node scripts/generate-chinese-lunar-data.mjs` 重建 JSON。将公农历对照表的 `T1901c.txt` 至 `T2100c.txt` 保存到本地资料目录后，运行 `python3 scripts/verify-hko-lunar-data.py <资料目录>` 核对。源年表可按年份替换下载地址中的 `2025`。[香港天文台 2025 年年表](https://www.hko.gov.hk/tc/gts/time/calendar/text/files/T2025c.txt)
