chunk-RC3YDMAO.js?v=a4230b98:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:6 [Main] React root created
main.tsx:8 [Main] App render called
ephemeris.ts:312 [toUTCFromLocal] 1993-08-01T11:00 (lon:121.4737) -> UTC: 1993-08-01T03:00:00.000Z (offset: 8h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间3:0 对应本地时间11:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 1993-08-01T03:00:00.000Z at 31.2304°N,121.4737°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.440126° (T=-0.064172)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=-230.63°, 赤经=131.80°, 赤纬=17.91°
ephemeris.ts:131 [solarAltAz] 时角: 104.71° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=-244.96°, 经度=121.47°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-2.70°, 方位角=292.87°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.23°, δ=17.91°, H=104.71°
ephemeris.ts:171 [solarAltAz] 季节一致性验证失败: ['北半球夏季中午太阳不应在地平线下 (月份: 8, 高度角: -2.7016139722075287°)']
solarAltAz @ ephemeris.ts:171
computeEphemeris @ ephemeris.ts:217
(anonymous) @ App.tsx:27
mountState @ chunk-RC3YDMAO.js?v=a4230b98:12005
useState @ chunk-RC3YDMAO.js?v=a4230b98:12545
useState @ chunk-DRWLMN53.js?v=a4230b98:1066
App @ App.tsx:25
renderWithHooks @ chunk-RC3YDMAO.js?v=a4230b98:11548
mountIndeterminateComponent @ chunk-RC3YDMAO.js?v=a4230b98:14926
beginWork @ chunk-RC3YDMAO.js?v=a4230b98:15914
beginWork$1 @ chunk-RC3YDMAO.js?v=a4230b98:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=a4230b98:19198
workLoopSync @ chunk-RC3YDMAO.js?v=a4230b98:19137
renderRootSync @ chunk-RC3YDMAO.js?v=a4230b98:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=a4230b98:18678
workLoop @ chunk-RC3YDMAO.js?v=a4230b98:197
flushWork @ chunk-RC3YDMAO.js?v=a4230b98:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=a4230b98:384
ephemeris.ts:218   Solar position: az=292.9°, alt=-2.7°
ephemeris.ts:222   Sun ENU: [-0.920, -0.047, 0.388]
ephemeris.ts:226   Sun ECEF: [0.911, 0.274, 0.308]
ephemeris.ts:260   Sun world direction: [0.911, 0.274, 0.308]
SimpleTest.tsx:529 [LightInfo] Raw sunWorld: {x: 1, y: 0, z: 0}
SimpleTest.tsx:530 [LightInfo] Real sun angles from ephemeris: {azimuth: '0.0', altitude: '0.0'}
content.js:1286 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:146 [AeScape] URL检查: http://localhost:5173/, 应排除: false
content.js:1328 [AeScape] 内容脚本已加载
SimpleTest.tsx:342 [Effect] Auto-updating sunlight due to change in: {dateISO: '2025-09-04T13:45', latDeg: 31.2, lonDeg: 121.5, autoUpdate: true}
SimpleTest.tsx:273 [Sunlight Update] Starting update for: {dateISO: '2025-09-04T13:45', latDeg: 31.2, lonDeg: 121.5}
ephemeris.ts:312 [toUTCFromLocal] 2025-09-04T13:45 (lon:121.5) -> UTC: 2025-09-04T05:45:00.000Z (offset: 8h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间5:45 对应本地时间13:45
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2025-09-04T05:45:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.435952° (T=0.256762)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=162.45°, 赤经=163.82°, 赤纬=6.89°
ephemeris.ts:131 [solarAltAz] 时角: 60.32° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=102.64°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=28.86°, 方位角=260.00°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=6.89°, H=60.32°
ephemeris.ts:218   Solar position: az=260.0°, alt=28.9°
ephemeris.ts:222   Sun ENU: [-0.863, 0.483, -0.152]
ephemeris.ts:226   Sun ECEF: [0.479, 0.870, 0.120]
ephemeris.ts:260   Sun world direction: [0.479, 0.870, 0.120]
SimpleTest.tsx:276 [Sunlight Update] Raw ephemeris result: {sunDirWorld: {…}, moonDirWorld: {…}, illumination: 0.6465930484104874, altDeg: 28.85665547230328, azDeg: 259.9997689118972}
SimpleTest.tsx:291 [Sunlight Update] Sun direction magnitude: 1
SimpleTest.tsx:313 [Sunlight Update] Normalized sun direction: {x: 0.47856055583842, y: 0.8698272574706094, z: 0.11991804099792744}
SimpleTest.tsx:314 [Sunlight Update] Real sun angles: {az: '260.0', alt: '28.9'}
SimpleTest.tsx:315 [Sunlight Update] Setting sunAngles state: {azDeg: 259.9997689118972, altDeg: 28.85665547230328}
SimpleTest.tsx:327 [Sunlight Update] Light direction info calculated
App.tsx:22 [App] mounted
SimpleTest.tsx:529 [LightInfo] Raw sunWorld: {x: 0.47856055583842, y: 0.8698272574706094, z: 0.11991804099792744}
SimpleTest.tsx:530 [LightInfo] Real sun angles from ephemeris: {azimuth: '260.0', altitude: '28.9'}
content.js:157 [AeScape] 用户设置检查: false
lightingUtils.ts:12 [useLightDirection] Recalculating light direction: {mode: 'celestial', sunWorld: {…}, lightAzimuth: 180, lightElevation: 0}
lightingUtils.ts:27 [useLightDirection] Celestial mode result: {direction: Array(3), elevation: '60.44°', belowHorizon: false}
SimpleTest.tsx:69 [SceneContent] Light direction updated: {direction: Array(3), position: Array(3), mode: 'celestial', timestamp: '13:45:21'}
content.js:1967 Preloaded 316 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
content.js:1972 Force preloading more content...
content.js:1995 Force preloading quotes: 10 cards needed
content.js:1995 Force preloading facts: 8 cards needed
content.js:1995 Force preloading advice: 5 cards needed
content.js:1995 Force preloading catfacts: 9 cards needed
SimpleTest.tsx:861 🔍 运行快速测试...
quickTest.ts:10 🚀 开始快速测试修复后的太阳位置计算...
quickTest.ts:16 
📋 测试1: 夏至当地正午上海 (2024-06-21 12:00 当地时间)
quickTest.ts:19 测试时间: UTC 2024-06-21T04:00:00.000Z (对应上海当地时间 12:00)
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244714)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.77°, 赤经=90.84°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 177.73° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=147.07°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-35.32°, 方位角=357.44°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=23.43°, H=177.73°
ephemeris.ts:171 [solarAltAz] 季节一致性验证失败: ['北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -35.32277504572256°)']
solarAltAz @ ephemeris.ts:171
computeEphemeris @ ephemeris.ts:217
runQuickTest @ quickTest.ts:20
(anonymous) @ SimpleTest.tsx:863
Promise.then
onClick @ SimpleTest.tsx:862
callCallback2 @ chunk-RC3YDMAO.js?v=a4230b98:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=a4230b98:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=a4230b98:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-RC3YDMAO.js?v=a4230b98:3736
executeDispatch @ chunk-RC3YDMAO.js?v=a4230b98:7014
processDispatchQueueItemsInOrder @ chunk-RC3YDMAO.js?v=a4230b98:7034
processDispatchQueue @ chunk-RC3YDMAO.js?v=a4230b98:7043
dispatchEventsForPlugins @ chunk-RC3YDMAO.js?v=a4230b98:7051
(anonymous) @ chunk-RC3YDMAO.js?v=a4230b98:7174
batchedUpdates$1 @ chunk-RC3YDMAO.js?v=a4230b98:18913
batchedUpdates @ chunk-RC3YDMAO.js?v=a4230b98:3579
dispatchEventForPluginEventSystem @ chunk-RC3YDMAO.js?v=a4230b98:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-RC3YDMAO.js?v=a4230b98:5478
dispatchEvent @ chunk-RC3YDMAO.js?v=a4230b98:5472
dispatchDiscreteEvent @ chunk-RC3YDMAO.js?v=a4230b98:5449
ephemeris.ts:218   Solar position: az=357.4°, alt=-35.3°
ephemeris.ts:222   Sun ENU: [-0.036, -0.578, 0.815]
ephemeris.ts:226   Sun ECEF: [0.510, -0.763, 0.398]
ephemeris.ts:260   Sun world direction: [0.510, -0.763, 0.398]
quickTest.ts:21 结果: 高度角=-35.32°, 方位角=357.44°
quickTest.ts:24 
📋 测试2: 冬至当地正午上海 (2024-12-21 12:00 当地时间)
quickTest.ts:26 测试时间: UTC 2024-12-21T04:00:00.000Z (对应上海当地时间 12:00)
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-12-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436044° (T=0.249724)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=270.29°, 赤经=-89.68°, 赤纬=-23.44°
ephemeris.ts:131 [solarAltAz] 时角: -82.23° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=66.58°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-5.74°, 方位角=113.98°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=-23.44°, H=-82.23°
ephemeris.ts:218   Solar position: az=114.0°, alt=-5.7°
ephemeris.ts:222   Sun ENU: [0.909, -0.100, -0.404]
ephemeris.ts:226   Sun ECEF: [-0.840, -0.369, -0.398]
ephemeris.ts:260   Sun world direction: [-0.840, -0.369, -0.398]
quickTest.ts:28 结果: 高度角=-5.74°, 方位角=113.98°
quickTest.ts:31 
📋 测试3: 春分当地正午上海 (2024-03-21 12:00 当地时间)
quickTest.ts:33 测试时间: UTC 2024-03-21T04:00:00.000Z (对应上海当地时间 12:00)
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436141° (T=0.242195)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=1.54°, 赤经=1.41°, 赤纬=0.61°
ephemeris.ts:131 [solarAltAz] 时角: 127.39° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=7.30°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-30.92°, 方位角=292.17°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=0.61°, H=127.39°
ephemeris.ts:218   Solar position: az=292.2°, alt=-30.9°
ephemeris.ts:222   Sun ENU: [-0.794, -0.514, 0.324]
ephemeris.ts:226   Sun ECEF: [0.995, -0.103, 0.011]
ephemeris.ts:260   Sun world direction: [0.995, -0.103, 0.011]
quickTest.ts:35 结果: 高度角=-30.92°, 方位角=292.17°
quickTest.ts:38 
📋 测试4: 赤道春分当地正午 (2024-03-21 12:00 当地时间)
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-21T04:00:00.000Z at 0°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436141° (T=0.242195)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=1.54°, 赤经=1.41°, 赤纬=0.61°
ephemeris.ts:131 [solarAltAz] 时角: 5.89° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=7.30°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=84.08°, 方位角=275.93°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=0.61°, H=5.89°
ephemeris.ts:218   Solar position: az=275.9°, alt=84.1°
ephemeris.ts:222   Sun ENU: [-0.103, 0.995, 0.011]
ephemeris.ts:226   Sun ECEF: [0.995, -0.103, 0.011]
ephemeris.ts:260   Sun world direction: [0.995, -0.103, 0.011]
quickTest.ts:40 结果: 高度角=84.08°, 方位角=275.93°
quickTest.ts:43 
📊 验证结果:
quickTest.ts:58 ❌ 夏至当地正午上海: 失败 (-35.32° < 60°) - 夏至当地正午太阳高度角应大于60°
quickTest.ts:58 ❌ 冬至当地正午上海: 失败 (-5.74° < 30°) - 冬至当地正午太阳高度角应大于30°
quickTest.ts:58 ❌ 春分当地正午上海: 失败 (-30.92° < 45°) - 春分当地正午太阳高度角应大于45°
quickTest.ts:58 ❌ 赤道春分当地正午: 失败 (84.08° < 85°) - 赤道春分当地正午太阳高度角应接近90°
quickTest.ts:62 
📈 测试结果: 0/4 通过
quickTest.ts:67 ⚠️ 仍有测试失败，需要进一步修复
content.js:1995 Force preloading cocktails: 9 cards needed
content.js:1995 Force preloading datafacts: 25 cards needed
SimpleTest.tsx:491 🔍 快速验证测试...
ephemeris.ts:312 [toUTCFromLocal] 2024-06-21T12:00 (lon:121.5) -> UTC: 2024-06-21T04:00:00.000Z (offset: 8h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间4:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244714)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.77°, 赤经=90.84°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 177.73° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=147.07°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-35.32°, 方位角=357.44°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=23.43°, H=177.73°
ephemeris.ts:171 [solarAltAz] 季节一致性验证失败: ['北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -35.32277504572256°)']
solarAltAz @ ephemeris.ts:171
computeEphemeris @ ephemeris.ts:217
getEarthState @ earthState.ts:17
(anonymous) @ SimpleTest.tsx:503
setTimeout
(anonymous) @ SimpleTest.tsx:501
quickValidationTest @ SimpleTest.tsx:500
callCallback2 @ chunk-RC3YDMAO.js?v=a4230b98:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=a4230b98:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=a4230b98:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-RC3YDMAO.js?v=a4230b98:3736
executeDispatch @ chunk-RC3YDMAO.js?v=a4230b98:7014
processDispatchQueueItemsInOrder @ chunk-RC3YDMAO.js?v=a4230b98:7034
processDispatchQueue @ chunk-RC3YDMAO.js?v=a4230b98:7043
dispatchEventsForPlugins @ chunk-RC3YDMAO.js?v=a4230b98:7051
(anonymous) @ chunk-RC3YDMAO.js?v=a4230b98:7174
batchedUpdates$1 @ chunk-RC3YDMAO.js?v=a4230b98:18913
batchedUpdates @ chunk-RC3YDMAO.js?v=a4230b98:3579
dispatchEventForPluginEventSystem @ chunk-RC3YDMAO.js?v=a4230b98:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-RC3YDMAO.js?v=a4230b98:5478
dispatchEvent @ chunk-RC3YDMAO.js?v=a4230b98:5472
dispatchDiscreteEvent @ chunk-RC3YDMAO.js?v=a4230b98:5449
ephemeris.ts:218   Solar position: az=357.4°, alt=-35.3°
ephemeris.ts:222   Sun ENU: [-0.036, -0.578, 0.815]
ephemeris.ts:226   Sun ECEF: [0.510, -0.763, 0.398]
ephemeris.ts:260   Sun world direction: [0.510, -0.763, 0.398]
SimpleTest.tsx:506 [Quick Test] 夏至中午上海: {elevation: '-49.7°', sunDir: Array(3), status: '❌ 黑夜'}
SimpleTest.tsx:514 ❌ 严重问题：夏至中午上海 太阳在地平线下！
console.error @ chunk-I65IVJFY.js?v=a4230b98:17705
(anonymous) @ SimpleTest.tsx:514
setTimeout
(anonymous) @ SimpleTest.tsx:501
quickValidationTest @ SimpleTest.tsx:500
callCallback2 @ chunk-RC3YDMAO.js?v=a4230b98:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=a4230b98:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=a4230b98:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-RC3YDMAO.js?v=a4230b98:3736
executeDispatch @ chunk-RC3YDMAO.js?v=a4230b98:7014
processDispatchQueueItemsInOrder @ chunk-RC3YDMAO.js?v=a4230b98:7034
processDispatchQueue @ chunk-RC3YDMAO.js?v=a4230b98:7043
dispatchEventsForPlugins @ chunk-RC3YDMAO.js?v=a4230b98:7051
(anonymous) @ chunk-RC3YDMAO.js?v=a4230b98:7174
batchedUpdates$1 @ chunk-RC3YDMAO.js?v=a4230b98:18913
batchedUpdates @ chunk-RC3YDMAO.js?v=a4230b98:3579
dispatchEventForPluginEventSystem @ chunk-RC3YDMAO.js?v=a4230b98:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-RC3YDMAO.js?v=a4230b98:5478
dispatchEvent @ chunk-RC3YDMAO.js?v=a4230b98:5472
dispatchDiscreteEvent @ chunk-RC3YDMAO.js?v=a4230b98:5449
ephemeris.ts:312 [toUTCFromLocal] 2024-12-21T12:00 (lon:121.5) -> UTC: 2024-12-21T04:00:00.000Z (offset: 8h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间4:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-12-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436044° (T=0.249724)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=270.29°, 赤经=-89.68°, 赤纬=-23.44°
ephemeris.ts:131 [solarAltAz] 时角: -82.23° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=66.58°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-5.74°, 方位角=113.98°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=-23.44°, H=-82.23°
ephemeris.ts:218   Solar position: az=114.0°, alt=-5.7°
ephemeris.ts:222   Sun ENU: [0.909, -0.100, -0.404]
ephemeris.ts:226   Sun ECEF: [-0.840, -0.369, -0.398]
ephemeris.ts:260   Sun world direction: [-0.840, -0.369, -0.398]
SimpleTest.tsx:506 [Quick Test] 冬至中午上海: {elevation: '-21.7°', sunDir: Array(3), status: '❌ 黑夜'}
ephemeris.ts:312 [toUTCFromLocal] 2024-03-21T12:00 (lon:121.5) -> UTC: 2024-03-21T04:00:00.000Z (offset: 8h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间4:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436141° (T=0.242195)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=1.54°, 赤经=1.41°, 赤纬=0.61°
ephemeris.ts:131 [solarAltAz] 时角: 127.39° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=7.30°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-30.92°, 方位角=292.17°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=0.61°, H=127.39°
ephemeris.ts:218   Solar position: az=292.2°, alt=-30.9°
ephemeris.ts:222   Sun ENU: [-0.794, -0.514, 0.324]
ephemeris.ts:226   Sun ECEF: [0.995, -0.103, 0.011]
ephemeris.ts:260   Sun world direction: [0.995, -0.103, 0.011]
SimpleTest.tsx:506 [Quick Test] 春分中午上海: {elevation: '-5.9°', sunDir: Array(3), status: '❌ 黑夜'}
content.js:1995 Force preloading gathas: 15 cards needed
content.js:2024 Force preload completed. Total cache size: 371
SimpleTest.tsx:479 🚀 开始运行关键验证测试...
validation.ts:89 🚀 开始运行关键验证测试...
validation.ts:94 
📋 测试 1: 夏至中午上海
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244714)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.77°, 赤经=90.84°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 177.73° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=147.07°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-35.32°, 方位角=357.44°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=23.43°, H=177.73°
ephemeris.ts:171 [solarAltAz] 季节一致性验证失败: ['北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -35.32277504572256°)']
solarAltAz @ ephemeris.ts:171
computeEphemeris @ ephemeris.ts:217
runSingleTest @ validation.ts:147
(anonymous) @ validation.ts:98
runCriticalValidationTests @ validation.ts:93
(anonymous) @ SimpleTest.tsx:483
Promise.then
criticalValidationTest @ SimpleTest.tsx:482
callCallback2 @ chunk-RC3YDMAO.js?v=a4230b98:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=a4230b98:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=a4230b98:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-RC3YDMAO.js?v=a4230b98:3736
executeDispatch @ chunk-RC3YDMAO.js?v=a4230b98:7014
processDispatchQueueItemsInOrder @ chunk-RC3YDMAO.js?v=a4230b98:7034
processDispatchQueue @ chunk-RC3YDMAO.js?v=a4230b98:7043
dispatchEventsForPlugins @ chunk-RC3YDMAO.js?v=a4230b98:7051
(anonymous) @ chunk-RC3YDMAO.js?v=a4230b98:7174
batchedUpdates$1 @ chunk-RC3YDMAO.js?v=a4230b98:18913
batchedUpdates @ chunk-RC3YDMAO.js?v=a4230b98:3579
dispatchEventForPluginEventSystem @ chunk-RC3YDMAO.js?v=a4230b98:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-RC3YDMAO.js?v=a4230b98:5478
dispatchEvent @ chunk-RC3YDMAO.js?v=a4230b98:5472
dispatchDiscreteEvent @ chunk-RC3YDMAO.js?v=a4230b98:5449
ephemeris.ts:218   Solar position: az=357.4°, alt=-35.3°
ephemeris.ts:222   Sun ENU: [-0.036, -0.578, 0.815]
ephemeris.ts:226   Sun ECEF: [0.510, -0.763, 0.398]
ephemeris.ts:260   Sun world direction: [0.510, -0.763, 0.398]
validation.ts:105 ❌ 夏至中午上海 失败: (2) ['高度角过低: -35.32277504572256° < 59° (容差: 1°)', '北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -35.32277504572256°)']
validation.ts:94 
📋 测试 2: 冬至中午上海
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-12-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436044° (T=0.249724)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=270.29°, 赤经=-89.68°, 赤纬=-23.44°
ephemeris.ts:131 [solarAltAz] 时角: -82.23° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=66.58°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-5.74°, 方位角=113.98°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=-23.44°, H=-82.23°
ephemeris.ts:218   Solar position: az=114.0°, alt=-5.7°
ephemeris.ts:222   Sun ENU: [0.909, -0.100, -0.404]
ephemeris.ts:226   Sun ECEF: [-0.840, -0.369, -0.398]
ephemeris.ts:260   Sun world direction: [-0.840, -0.369, -0.398]
validation.ts:105 ❌ 冬至中午上海 失败: ['高度角过低: -5.7381380993869024° < 29° (容差: 1°)']
validation.ts:94 
📋 测试 3: 春分中午上海
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-21T04:00:00.000Z at 31.2°N,121.5°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436141° (T=0.242195)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=1.54°, 赤经=1.41°, 赤纬=0.61°
ephemeris.ts:131 [solarAltAz] 时角: 127.39° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=7.30°, 经度=121.50°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-30.92°, 方位角=292.17°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=0.61°, H=127.39°
ephemeris.ts:218   Solar position: az=292.2°, alt=-30.9°
ephemeris.ts:222   Sun ENU: [-0.794, -0.514, 0.324]
ephemeris.ts:226   Sun ECEF: [0.995, -0.103, 0.011]
ephemeris.ts:260   Sun world direction: [0.995, -0.103, 0.011]
validation.ts:105 ❌ 春分中午上海 失败: ['高度角过低: -30.92334171783774° < 44° (容差: 1°)']
validation.ts:94 
📋 测试 4: 北极圈夏至午夜
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-20T16:00:00.000Z at 66.55°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244700)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.29°, 赤经=90.32°, 赤纬=23.44°
ephemeris.ts:131 [solarAltAz] 时角: 55.99° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=146.30°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=34.69°, 方位角=247.66°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=66.55°, δ=23.44°, H=55.99°
ephemeris.ts:218   Solar position: az=247.7°, alt=34.7°
ephemeris.ts:222   Sun ENU: [-0.761, 0.569, -0.313]
ephemeris.ts:226   Sun ECEF: [0.513, -0.761, 0.398]
ephemeris.ts:260   Sun world direction: [0.513, -0.761, 0.398]
validation.ts:103 ✅ 北极圈夏至午夜 通过
validation.ts:94 
📋 测试 5: 北极圈冬至中午
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-12-21T04:00:00.000Z at 66.55°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436044° (T=0.249724)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=270.29°, 赤经=-89.68°, 赤纬=-23.44°
ephemeris.ts:131 [solarAltAz] 时角: 156.27° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=66.58°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-44.36°, 方位角=328.90°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=66.55°, δ=-23.44°, H=156.27°
ephemeris.ts:218   Solar position: az=328.9°, alt=-44.4°
ephemeris.ts:222   Sun ENU: [-0.369, -0.699, 0.612]
ephemeris.ts:226   Sun ECEF: [-0.840, -0.369, -0.398]
ephemeris.ts:260   Sun world direction: [-0.840, -0.369, -0.398]
validation.ts:103 ✅ 北极圈冬至中午 通过
validation.ts:94 
📋 测试 6: 赤道春分正午
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-21T04:00:00.000Z at 0°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436141° (T=0.242195)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=1.54°, 赤经=1.41°, 赤纬=0.61°
ephemeris.ts:131 [solarAltAz] 时角: 5.89° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=7.30°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=84.08°, 方位角=275.93°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=0.61°, H=5.89°
ephemeris.ts:218   Solar position: az=275.9°, alt=84.1°
ephemeris.ts:222   Sun ENU: [-0.103, 0.995, 0.011]
ephemeris.ts:226   Sun ECEF: [0.995, -0.103, 0.011]
ephemeris.ts:260   Sun world direction: [0.995, -0.103, 0.011]
validation.ts:103 ✅ 赤道春分正午 通过
validation.ts:94 
📋 测试 7: 0°E中午
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T04:00:00.000Z at 31.2°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244714)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.77°, 赤经=90.84°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 56.23° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=147.07°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=39.96°, 方位角=275.69°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=23.43°, H=56.23°
ephemeris.ts:218   Solar position: az=275.7°, alt=40.0°
ephemeris.ts:222   Sun ENU: [-0.763, 0.642, 0.076]
ephemeris.ts:226   Sun ECEF: [0.510, -0.763, 0.398]
ephemeris.ts:260   Sun world direction: [0.510, -0.763, 0.398]
validation.ts:103 ✅ 0°E中午 通过
validation.ts:94 
📋 测试 8: 180°E午夜
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-20T16:00:00.000Z at 31.2°N,180°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244700)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.29°, 赤经=90.32°, 赤纬=23.44°
ephemeris.ts:131 [solarAltAz] 时角: -124.01° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=146.30°, 经度=180.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-13.47°, 方位角=51.45°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=31.20°, δ=23.44°, H=-124.01°
ephemeris.ts:171 [solarAltAz] 季节一致性验证失败: ['北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -13.472465468696402°)']
solarAltAz @ ephemeris.ts:171
computeEphemeris @ ephemeris.ts:217
runSingleTest @ validation.ts:147
(anonymous) @ validation.ts:98
runCriticalValidationTests @ validation.ts:93
(anonymous) @ SimpleTest.tsx:483
Promise.then
criticalValidationTest @ SimpleTest.tsx:482
callCallback2 @ chunk-RC3YDMAO.js?v=a4230b98:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=a4230b98:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=a4230b98:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-RC3YDMAO.js?v=a4230b98:3736
executeDispatch @ chunk-RC3YDMAO.js?v=a4230b98:7014
processDispatchQueueItemsInOrder @ chunk-RC3YDMAO.js?v=a4230b98:7034
processDispatchQueue @ chunk-RC3YDMAO.js?v=a4230b98:7043
dispatchEventsForPlugins @ chunk-RC3YDMAO.js?v=a4230b98:7051
(anonymous) @ chunk-RC3YDMAO.js?v=a4230b98:7174
batchedUpdates$1 @ chunk-RC3YDMAO.js?v=a4230b98:18913
batchedUpdates @ chunk-RC3YDMAO.js?v=a4230b98:3579
dispatchEventForPluginEventSystem @ chunk-RC3YDMAO.js?v=a4230b98:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-RC3YDMAO.js?v=a4230b98:5478
dispatchEvent @ chunk-RC3YDMAO.js?v=a4230b98:5472
dispatchDiscreteEvent @ chunk-RC3YDMAO.js?v=a4230b98:5449
ephemeris.ts:218   Solar position: az=51.4°, alt=-13.5°
ephemeris.ts:222   Sun ENU: [0.761, -0.233, 0.606]
ephemeris.ts:226   Sun ECEF: [0.513, -0.761, 0.398]
ephemeris.ts:260   Sun world direction: [0.513, -0.761, 0.398]
validation.ts:105 ❌ 180°E午夜 失败: ['北半球夏季中午太阳不应在地平线下 (月份: 6, 高度角: -13.472465468696402°)']
validation.ts:125 
📊 测试结果统计:
validation.ts:126 ✅ 通过: 4/8
validation.ts:127 ❌ 失败: 4/8
validation.ts:132 ⚠️ 部分测试失败，需要进一步修复
SimpleTest.tsx:400 [Consistency Test] Starting physical consistency validation...
SimpleTest.tsx:419 [Consistency Test] 1/7: Testing 春分赤道正午...
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T12:00 (lon:0) -> UTC: 2024-03-20T12:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-20T12:00:00.000Z at 0°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242177)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=0.87°, 赤经=0.80°, 赤纬=0.35°
ephemeris.ts:131 [solarAltAz] 时角: 5.49° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=6.29°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=84.50°, 方位角=273.63°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=0.35°, H=5.49°
ephemeris.ts:218   Solar position: az=273.6°, alt=84.5°
ephemeris.ts:222   Sun ENU: [-0.096, 0.995, 0.006]
ephemeris.ts:226   Sun ECEF: [0.995, -0.096, 0.006]
ephemeris.ts:260   Sun world direction: [0.995, -0.096, 0.006]
SimpleTest.tsx:452 [Consistency Test] 春分赤道正午: {elevation: '-5.5°', azimuth: '89.7°', sunDir: Array(3), issues: Array(1)}
SimpleTest.tsx:419 [Consistency Test] 2/7: Testing 春分北半球正午...
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T12:00 (lon:0) -> UTC: 2024-03-20T12:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-20T12:00:00.000Z at 45°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242177)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=0.87°, 赤经=0.80°, 赤纬=0.35°
ephemeris.ts:131 [solarAltAz] 时角: 5.49° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=6.29°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=45.08°, 方位角=187.79°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=45.00°, δ=0.35°, H=5.49°
ephemeris.ts:218   Solar position: az=187.8°, alt=45.1°
ephemeris.ts:222   Sun ENU: [-0.096, 0.708, -0.700]
ephemeris.ts:226   Sun ECEF: [0.995, -0.096, 0.006]
ephemeris.ts:260   Sun world direction: [0.995, -0.096, 0.006]
SimpleTest.tsx:452 [Consistency Test] 春分北半球正午: {elevation: '-5.5°', azimuth: '89.7°', sunDir: Array(3), issues: '✓ 物理合理'}
SimpleTest.tsx:419 [Consistency Test] 3/7: Testing 春分南半球正午...
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T12:00 (lon:0) -> UTC: 2024-03-20T12:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-20T12:00:00.000Z at -45°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242177)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=0.87°, 赤经=0.80°, 赤纬=0.35°
ephemeris.ts:131 [solarAltAz] 时角: 5.49° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=6.29°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=44.39°, 方位角=352.31°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=-45.00°, δ=0.35°, H=5.49°
ephemeris.ts:218   Solar position: az=352.3°, alt=44.4°
ephemeris.ts:222   Sun ENU: [-0.096, 0.700, 0.708]
ephemeris.ts:226   Sun ECEF: [0.995, -0.096, 0.006]
ephemeris.ts:260   Sun world direction: [0.995, -0.096, 0.006]
SimpleTest.tsx:452 [Consistency Test] 春分南半球正午: {elevation: '-5.5°', azimuth: '89.7°', sunDir: Array(3), issues: '✓ 物理合理'}
SimpleTest.tsx:419 [Consistency Test] 4/7: Testing 北极圈夏至午夜...
ephemeris.ts:312 [toUTCFromLocal] 2024-06-21T00:00 (lon:0) -> UTC: 2024-06-21T00:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间0:0 对应本地时间0:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T00:00:00.000Z at 66.55°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244709)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=90.61°, 赤经=90.66°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 56.15° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=146.81°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=34.63°, 方位角=247.82°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=66.55°, δ=23.43°, H=56.15°
ephemeris.ts:218   Solar position: az=247.8°, alt=34.6°
ephemeris.ts:222   Sun ENU: [-0.762, 0.568, -0.311]
ephemeris.ts:226   Sun ECEF: [0.511, -0.762, 0.398]
ephemeris.ts:260   Sun world direction: [0.511, -0.762, 0.398]
SimpleTest.tsx:452 [Consistency Test] 北极圈夏至午夜: {elevation: '-49.6°', azimuth: '52.1°', sunDir: Array(3), issues: Array(1)}
SimpleTest.tsx:419 [Consistency Test] 5/7: Testing 北极圈夏至正午...
ephemeris.ts:312 [toUTCFromLocal] 2024-06-21T12:00 (lon:0) -> UTC: 2024-06-21T12:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间12:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-06-21T12:00:00.000Z at 66.55°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436109° (T=0.244723)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=91.09°, 赤经=91.18°, 赤纬=23.43°
ephemeris.ts:131 [solarAltAz] 时角: 56.39° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=147.57°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=34.54°, 方位角=248.07°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=66.55°, δ=23.43°, H=56.39°
ephemeris.ts:218   Solar position: az=248.1°, alt=34.5°
ephemeris.ts:222   Sun ENU: [-0.764, 0.567, -0.308]
ephemeris.ts:226   Sun ECEF: [0.508, -0.764, 0.398]
ephemeris.ts:260   Sun world direction: [0.508, -0.764, 0.398]
SimpleTest.tsx:452 [Consistency Test] 北极圈夏至正午: {elevation: '-49.8°', azimuth: '51.9°', sunDir: Array(3), issues: '✓ 物理合理'}
SimpleTest.tsx:419 [Consistency Test] 6/7: Testing 赤道0°E午夜...
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T00:00 (lon:0) -> UTC: 2024-03-20T00:00:00.000Z (offset: 0h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间0:0 对应本地时间0:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-20T00:00:00.000Z at 0°N,0°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242163)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=0.38°, 赤经=0.35°, 赤纬=0.15°
ephemeris.ts:131 [solarAltAz] 时角: 5.19° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=5.53°, 经度=0.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=84.81°, 方位角=271.66°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=0.15°, H=5.19°
ephemeris.ts:218   Solar position: az=271.7°, alt=84.8°
ephemeris.ts:222   Sun ENU: [-0.090, 0.996, 0.003]
ephemeris.ts:226   Sun ECEF: [0.996, -0.090, 0.003]
ephemeris.ts:260   Sun world direction: [0.996, -0.090, 0.003]
SimpleTest.tsx:452 [Consistency Test] 赤道0°E午夜: {elevation: '-5.2°', azimuth: '89.8°', sunDir: Array(3), issues: '✓ 物理合理'}
SimpleTest.tsx:419 [Consistency Test] 7/7: Testing 赤道180°E午夜...
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T00:00 (lon:180) -> UTC: 2024-03-19T12:00:00.000Z (offset: 12h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间0:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-19T12:00:00.000Z at 0°N,180°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242149)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=359.88°, 赤经=-0.11°, 赤纬=-0.05°
ephemeris.ts:131 [solarAltAz] 时角: -175.12° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=4.77°, 经度=180.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-85.12°, 方位角=90.56°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=-0.05°, H=-175.12°
ephemeris.ts:218   Solar position: az=90.6°, alt=-85.1°
ephemeris.ts:222   Sun ENU: [0.085, -0.996, -0.001]
ephemeris.ts:226   Sun ECEF: [0.996, -0.085, -0.001]
ephemeris.ts:260   Sun world direction: [0.996, -0.085, -0.001]
SimpleTest.tsx:452 [Consistency Test] 赤道180°E午夜: {elevation: '-4.9°', azimuth: '90.0°', sunDir: Array(3), issues: '✓ 物理合理'}
SimpleTest.tsx:342 [Effect] Auto-updating sunlight due to change in: {dateISO: '2024-03-20T00:00', latDeg: 0, lonDeg: 180, autoUpdate: true}
SimpleTest.tsx:273 [Sunlight Update] Starting update for: {dateISO: '2024-03-20T00:00', latDeg: 0, lonDeg: 180}
ephemeris.ts:312 [toUTCFromLocal] 2024-03-20T00:00 (lon:180) -> UTC: 2024-03-19T12:00:00.000Z (offset: 12h)
ephemeris.ts:313 [toUTCFromLocal] 注意：UTC时间12:0 对应本地时间0:0
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:211 [computeEphemeris] 2024-03-19T12:00:00.000Z at 0°N,180°E:
ephemeris.ts:87 [solarAltAz] 地球自转轴倾角: 23.436142° (T=0.242149)
ephemeris.ts:100 [solarAltAz] 太阳位置: 黄经=359.88°, 赤经=-0.11°, 赤纬=-0.05°
ephemeris.ts:131 [solarAltAz] 时角: -175.12° (范围: -180° 到 +180°, 0°=正午)
ephemeris.ts:139 [solarAltAz] 恒星时: 格林威治=4.77°, 经度=180.00°
ephemeris.ts:155 [solarAltAz] 地平坐标: 高度角=-85.12°, 方位角=90.56°
ephemeris.ts:156 [solarAltAz] 计算参数: φ=0.00°, δ=-0.05°, H=-175.12°
ephemeris.ts:218   Solar position: az=90.6°, alt=-85.1°
ephemeris.ts:222   Sun ENU: [0.085, -0.996, -0.001]
ephemeris.ts:226   Sun ECEF: [0.996, -0.085, -0.001]
ephemeris.ts:260   Sun world direction: [0.996, -0.085, -0.001]
SimpleTest.tsx:276 [Sunlight Update] Raw ephemeris result: {sunDirWorld: {…}, moonDirWorld: {…}, illumination: 0.00028930845769886693, altDeg: -85.11541692655072, azDeg: 90.56100788453048}
SimpleTest.tsx:291 [Sunlight Update] Sun direction magnitude: 1
SimpleTest.tsx:313 [Sunlight Update] Normalized sun direction: {x: 0.9963682437769675, y: -0.08514474564330536, z: -0.0008337158618264256}
SimpleTest.tsx:314 [Sunlight Update] Real sun angles: {az: '90.6', alt: '-85.1'}
SimpleTest.tsx:315 [Sunlight Update] Setting sunAngles state: {azDeg: 90.56100788453048, altDeg: -85.11541692655072}
SimpleTest.tsx:327 [Sunlight Update] Light direction info calculated
SimpleTest.tsx:529 [LightInfo] Raw sunWorld: {x: 0.9963682437769675, y: -0.08514474564330536, z: -0.0008337158618264256}
SimpleTest.tsx:530 [LightInfo] Real sun angles from ephemeris: {azimuth: '90.6', altitude: '-85.1'}
lightingUtils.ts:12 [useLightDirection] Recalculating light direction: {mode: 'celestial', sunWorld: {…}, lightAzimuth: 180, lightElevation: 0}
lightingUtils.ts:27 [useLightDirection] Celestial mode result: {direction: Array(3), elevation: '-4.88°', belowHorizon: true}
lightingUtils.ts:35 [useLightDirection] WARNING: Sun is below horizon! Elevation: -4.8843483586087615
SimpleTest.tsx:69 [SceneContent] Light direction updated: {direction: Array(3), position: Array(3), mode: 'celestial', timestamp: '13:45:46'}
SimpleTest.tsx:473 [Consistency Test] 物理一致性测试完成，请查看控制台结果
