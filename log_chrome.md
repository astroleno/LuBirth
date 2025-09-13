chunk-RC3YDMAO.js?v=ac53425d:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:10 [Main] React root created
main.tsx:12 [Main] App render called
SimpleTest.tsx:696 [EarthRotation] 初始化: UTC=2025-09-13T17:30:49.707Z, hours=17.514, yaw=262.7°
SimpleTest.tsx:1158 [LightInfo] Raw sunWorld: Object
SimpleTest.tsx:1159 [LightInfo] Real sun angles from ephemeris: Object
SimpleTest.tsx:1160 [LightInfo] Earth rotation: 262.7071125
SimpleTest.tsx:1161 [LightInfo] Using unified duskLongitude: 0.0
content.js:1286 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:146 [AeScape] URL检查: http://localhost:5173/, 应排除: false
content.js:1328 [AeScape] 内容脚本已加载
ephemeris.ts:449 [toUTCFromLocal] 2025-09-14T01:30 (lon:121.5) -> UTC: 2025-09-13T17:30:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间17:30 对应本地时间1:30
constants.ts:50 ✅ 天文常数验证通过
ephemeris.ts:449 [toUTCFromLocal] 2025-09-14T01:30 (lon:121.5) -> UTC: 2025-09-13T17:30:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间17:30 对应本地时间1:30
ephemeris.ts:449 [toUTCFromLocal] 2025-09-14T01:30 (lon:121.5) -> UTC: 2025-09-13T17:30:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间17:30 对应本地时间1:30
ephemeris.ts:464 [TerminatorDebug] Starting calculation: Object
ephemeris.ts:472 [TerminatorDebug] Astronomy objects created: Object
ephemeris.ts:479 [TerminatorDebug] Sun equatorial coordinates: Object
chunk-F5XGK2DS.js?v=ac53425d:17705 [TerminatorDebug] Error in calculation: TypeError: Cannot read properties of undefined (reading 'toFixed')
    at calculateTerminatorLongitude (ephemeris.ts:496:23)
    at calculateDuskLongitude (SimpleTest.tsx:14:10)
    at SimpleTest.tsx:993:27
    at SimpleTest.tsx:1037:5
    at commitHookEffectListMount (chunk-RC3YDMAO.js?v=ac53425d:16915:34)
    at commitPassiveMountOnFiber (chunk-RC3YDMAO.js?v=ac53425d:18156:19)
    at commitPassiveMountEffects_complete (chunk-RC3YDMAO.js?v=ac53425d:18129:17)
    at commitPassiveMountEffects_begin (chunk-RC3YDMAO.js?v=ac53425d:18119:15)
    at commitPassiveMountEffects (chunk-RC3YDMAO.js?v=ac53425d:18109:11)
    at flushPassiveEffectsImpl (chunk-RC3YDMAO.js?v=ac53425d:19490:11)
console.error @ chunk-F5XGK2DS.js?v=ac53425d:17705
ephemeris.ts:514 [TerminatorDebug] Falling back to simple calculation
SimpleTest.tsx:995 [Unified Dusk Longitude] Calculated: Object
App.tsx:7 [App] mounted - using SimpleTest scene
SimpleTest.tsx:1158 [LightInfo] Raw sunWorld: Object
SimpleTest.tsx:1159 [LightInfo] Real sun angles from ephemeris: Object
SimpleTest.tsx:1160 [LightInfo] Earth rotation: 262.7071125
SimpleTest.tsx:1161 [LightInfo] Using unified duskLongitude: -7.5
content.js:157 [AeScape] 用户设置检查: false
Earth.tsx:1101 Uncaught ReferenceError: cloudYawDeg is not defined
    at Earth (Earth.tsx:1101:352)
    at renderWithHooks (chunk-F5XGK2DS.js?v=ac53425d:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=ac53425d:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=ac53425d:10358:22)
    at HTMLUnknownElement.callCallback2 (chunk-F5XGK2DS.js?v=ac53425d:10589:22)
    at Object.invokeGuardedCallbackDev (chunk-F5XGK2DS.js?v=ac53425d:10614:24)
    at invokeGuardedCallback (chunk-F5XGK2DS.js?v=ac53425d:10646:39)
    at beginWork$1 (chunk-F5XGK2DS.js?v=ac53425d:14200:15)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=ac53425d:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=ac53425d:13604:13)
ephemeris.ts:449 [toUTCFromLocal] 2025-09-14T01:30 (lon:121.5) -> UTC: 2025-09-13T17:30:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间17:30 对应本地时间1:30
moonPhase.ts:67 [getMoonPhase] 固定月球系统月相计算: Object
Moon.tsx:202 [Moon Phase] 固定月球系统计算: Object
Moon.tsx:265 [Moon Phase] 真实向量太阳方向计算完成: Object
Moon.tsx:285 === 真实向量太阳方向信息 ===
Moon.tsx:286 太阳方向: Array(3)
Moon.tsx:287 位置角: 77.6°
Moon.tsx:288 光照侧（基于真实向量）: 左侧（下弦）
Earth.tsx:1101 Uncaught ReferenceError: cloudYawDeg is not defined
    at Earth (Earth.tsx:1101:352)
    at renderWithHooks (chunk-F5XGK2DS.js?v=ac53425d:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=ac53425d:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=ac53425d:10358:22)
    at HTMLUnknownElement.callCallback2 (chunk-F5XGK2DS.js?v=ac53425d:10589:22)
    at Object.invokeGuardedCallbackDev (chunk-F5XGK2DS.js?v=ac53425d:10614:24)
    at invokeGuardedCallback (chunk-F5XGK2DS.js?v=ac53425d:10646:39)
    at beginWork$1 (chunk-F5XGK2DS.js?v=ac53425d:14200:15)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=ac53425d:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=ac53425d:13604:13)
ephemeris.ts:449 [toUTCFromLocal] 2025-09-14T01:30 (lon:121.5) -> UTC: 2025-09-13T17:30:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间17:30 对应本地时间1:30
moonPhase.ts:67 [getMoonPhase] 固定月球系统月相计算: Object
Moon.tsx:202 [Moon Phase] 固定月球系统计算: Object
Moon.tsx:265 [Moon Phase] 真实向量太阳方向计算完成: Object
Moon.tsx:285 === 真实向量太阳方向信息 ===
Moon.tsx:286 太阳方向: Array(3)
Moon.tsx:287 位置角: 77.6°
Moon.tsx:288 光照侧（基于真实向量）: 左侧（下弦）
chunk-F5XGK2DS.js?v=ac53425d:17705 The above error occurred in the <Earth> component:

    at Earth (http://localhost:5173/src/scenes/simple/api/components/Earth.tsx?t=1757784646006:37:3)
    at group
    at SceneContent (http://localhost:5173/src/SimpleTest.tsx?t=1757784646008:140:3)
    at Suspense
    at ErrorBoundary (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=ac53425d:16028:5)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=ac53425d:17708:21)
    at Provider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=ac53425d:17317:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
console.error @ chunk-F5XGK2DS.js?v=ac53425d:17705
chunk-F5XGK2DS.js?v=ac53425d:17814 Uncaught ReferenceError: cloudYawDeg is not defined
    at Earth (Earth.tsx:1101:352)
    at renderWithHooks (chunk-F5XGK2DS.js?v=ac53425d:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=ac53425d:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=ac53425d:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=ac53425d:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=ac53425d:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=ac53425d:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=ac53425d:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=ac53425d:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=ac53425d:13121:30)
chunk-F5XGK2DS.js?v=ac53425d:17814 Uncaught ReferenceError: cloudYawDeg is not defined
    at Earth (Earth.tsx:1101:352)
    at renderWithHooks (chunk-F5XGK2DS.js?v=ac53425d:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=ac53425d:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=ac53425d:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=ac53425d:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=ac53425d:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=ac53425d:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=ac53425d:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=ac53425d:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=ac53425d:13121:30)
chunk-F5XGK2DS.js?v=ac53425d:17705 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=ac53425d:17774:3)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=ac53425d:17708:21)
    at CanvasWrapper
    at div
    at SimpleTest (http://localhost:5173/src/SimpleTest.tsx?t=1757784646008:645:29)
    at App (http://localhost:5173/src/App.tsx?t=1757784646008:22:9)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
console.error @ chunk-F5XGK2DS.js?v=ac53425d:17705
chunk-RC3YDMAO.js?v=ac53425d:19413 Uncaught ReferenceError: cloudYawDeg is not defined
    at Earth (Earth.tsx:1101:352)
    at renderWithHooks (chunk-F5XGK2DS.js?v=ac53425d:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=ac53425d:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=ac53425d:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=ac53425d:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=ac53425d:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=ac53425d:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=ac53425d:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=ac53425d:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=ac53425d:13121:30)
chunk-SMQVUEJW.js?v=ac53425d:17501 THREE.WebGLRenderer: Context Lost.
content.js:1967 Preloaded 316 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
content.js:1972 Force preloading more content...
content.js:1995 Force preloading quotes: 8 cards needed
content.js:1995 Force preloading facts: 8 cards needed
content.js:1995 Force preloading advice: 8 cards needed
content.js:1995 Force preloading catfacts: 11 cards needed
