# 月面朝向与月食验证

月面的本初子午线、东向、北极按 Astronomy Engine 的月球自转轴与自转角得到，统一投影到地月、观天或当地合影坐标。真实位置中的月面姿态固定在对应天文坐标中。合影仍使用屏幕锚点，取当地地平坐标在月盘上的投影。普通球面与 NASA 地形网格均以 +X 为经度 0°、+Y 为月北极、−Z 为东。普通球面与 glTF 的纹理纵坐标原点各按格式处理。[Astronomy Engine 自转轴接口](https://github.com/cosinekitty/astronomy/blob/master/source/js/astronomy.ts) · [NASA 月球地形模型](https://svs.gsfc.nasa.gov/14959/)

`node scripts/test-moon-placement.mjs` 核验网格坐标、投影方向及独立星历样本。`lunar-orientation.json` 的 8 个 SVS 样本采用地心视角与 J2000 天北，4 个 Horizons 样本采用台北、霍巴特的海平面观测点与真当日天北。经度、纬度、月北极位置角与来源的最大差为 0.0054°。这些误差统计只覆盖记录的样本。[NASA SVS 2025 地心月相数据](https://svs.gsfc.nasa.gov/vis/a000000/a005400/a005415/mooninfo_2025.json) · [JPL Horizons 观测量说明](https://ssd.jpl.nasa.gov/horizons/manual.html#observer-table)

地影按 Danjon 半径约定计算。以地球赤道半径 `R`、太阳半径 `S`、日地距离 `D` 表示，半影和本影共用 `1.01R` 的基底半径，斜率分别为 `(R+S)/D` 与 `(R−S)/D`。阴影轴采用含光行差的地心太阳方向。地影遮挡的比例随月面位置变化，月全食的铜红色为视觉近似。几何月相仍表示无遮挡时的日照几何，当地地平线判断独立于食相。[NASA GSFC 地影半径说明](https://eclipse.gsfc.nasa.gov/LEcat5/shadow.html)

`node scripts/test-apparent-horizon-lunar-eclipse.mjs` 核验 2022 年 11 月 8 日六次接触及食典中的临界个例。2022 年的计算接触与 NASA 公布的整分时刻相差不超过 24 秒。2015 年 4 月 4 日的模型全食持续约 322 秒，NASA 食典为 283 秒。2042 年 9 月 29 日按半影月食归类。[NASA GSFC 2022 年月食预报](https://eclipse.gsfc.nasa.gov/OH/OH2022.html) · [NASA GSFC 2001–2100 年月食目录](https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html)

下载 NASA 食典 HTML，作为同一脚本的首个参数可复验全世纪。食甚时刻用表中的 ΔT 从力学时换算，228 场全部匹配分类。其余 1,009 次满月在各自最接近半影的时刻均未触发月食。食典用于验证，浏览器中的计算由观测时刻与当前星历驱动。[NASA GSFC 2001–2100 年月食目录](https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html)
