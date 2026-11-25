# 星座区域与中国宿界

| 版本 | 界面提供 | 资料依据 |
| --- | --- | --- |
| 现代 88 星座 | 可选 IAU 区域边界，按所选地点的月心方向查询所属星座。| [IAU 星座定义](https://www.iau.org/IAU/Astronomy-FAQs/Constellations.aspx)、[Roman 1987 坐标查找表](https://cdsarc.cds.unistra.fr/viz-bin/ReadMe/VI/42?format=html) |
| 陈卓体系 | 保留冻结的星官连线。现有产品数据缺少逐宿距星的现代同定、赤道历元与误差记录，因此不计算落宿。 | [杨伯顺、褚龙飞《〈续后汉书〉所载陈卓星表探析》](https://zgks.cbpt.cnki.net/portal/journal/portal/client/paper/f67378cb369ce700253150abea848d5e)、[Stellarium 26.3 陈卓重建](https://github.com/Stellarium/stellarium/tree/v26.3/skycultures/chinese_chenzhuo) |
| 宋代星官与二十八宿 | 冻结的星官连线可用于任意产品日期。元丰观测期间（1078–1085）另呈现按苏颂星图重建推算的月心落宿。 | [真贝寿明 2025《新儀象法要》星图重建，第 2–3 节、表 A.1](https://www.oit.ac.jp/labs/is/system/shinkai/Papers/20251119_GishouHouyou.pdf) |
| 元代星官 | 保留《天文汇钞》相关星官连线。坐标表含入宿度与去极度，现有产品数据缺少按该版本核对的全套距星、边界框架与误差记录，因此不计算落宿。 | [元末星表整理《天文汇钞》坐标数据](https://github.com/Guanjin0562/stellarium/blob/chinese-skyculture-enhancement/starcatalog/English%20titles/Tianwen_Huichao_%2814th_century%29.json)、[Stellarium 26.3 元代重建](https://github.com/Stellarium/stellarium/tree/v26.3/skycultures/chinese_yuan_dynasty) |

IAU 边界采用 Delporte 的 B1875 赤经与赤纬分割，经 Roman 1987 查找表恢复相邻天区的公共边。`scripts/prepare-iau-constellation-boundaries.mjs` 读取本项目锁定的 Astronomy Engine 2.1.19。生成数据的一个单位为 1/24°，末端两列给出每条线以西/以南与以东/以北的星座缩写。赤纬边在 B1875 小圆上细分，再按 Astronomy Engine 查找所用的历元变换进入天空坐标。使用圆心的无折射位置进行区域归属，地平线遮挡和大气折射仅影响看到的月盘。查找表亦可与 [Astropy 7.2.0 的 Roman 1987 转录](https://github.com/astropy/astropy/blob/v7.2.0/astropy/coordinates/data/constellation_data_roman87.dat) 复核。

宋图另据真贝采用的皇祐距星，使用 HYG 的 J2000 恒星状态和自行，换算到固定的 1080 年 7 月 1 日真赤道与真春分点。按传统顺序取起始距星赤经至下一距星赤经的半开区间，跨过 0° 时循环。角宿以 HIP 65474 起界，氐用 HIP 72603，觜用 HIP 26207，参用 HIP 25930。氐和觜采用独立研究给出的同定。该结果是所选观测地点的月心在宋代重建坐标中的估计，包含星表、自行、月球星历与史料重建的不确定性。

`node scripts/test-celestial-regions.mjs` 检查 IAU 边界两侧的 1,556 个位置、两极、0 时接缝，以及宋代距星的顺序和观测年代。JPL 的黄州样例与项目月球方向均落在胃宿。Roman 1987 的 357 行数据与 Astropy 7.2.0 转录比较后，坐标最大差为 1.8 角秒。 [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)

## Astronomy Engine license

Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
