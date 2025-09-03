chunk-RC3YDMAO.js?v=5f28bd19:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:6 [Main] React root created
main.tsx:8 [Main] App render called
content.js:1286 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:146 [AeScape] URL检查: http://localhost:5173/?test=1, 应排除: false
content.js:1328 [AeScape] 内容脚本已加载
App.tsx:22 [App] mounted
content.js:157 [AeScape] 用户设置检查: false
AtmosphereEffects.tsx:152 Uncaught ReferenceError: earthGlowDayNightRatio is not defined
    at AtmosphereEffects (AtmosphereEffects.tsx:152:43)
    at renderWithHooks (chunk-F5XGK2DS.js?v=5f28bd19:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=5f28bd19:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=5f28bd19:10358:22)
    at HTMLUnknownElement.callCallback2 (chunk-F5XGK2DS.js?v=5f28bd19:10589:22)
    at Object.invokeGuardedCallbackDev (chunk-F5XGK2DS.js?v=5f28bd19:10614:24)
    at invokeGuardedCallback (chunk-F5XGK2DS.js?v=5f28bd19:10646:39)
    at beginWork$1 (chunk-F5XGK2DS.js?v=5f28bd19:14200:15)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=5f28bd19:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=5f28bd19:13604:13)
AtmosphereEffects.tsx:152 Uncaught ReferenceError: earthGlowDayNightRatio is not defined
    at AtmosphereEffects (AtmosphereEffects.tsx:152:43)
    at renderWithHooks (chunk-F5XGK2DS.js?v=5f28bd19:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=5f28bd19:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=5f28bd19:10358:22)
    at HTMLUnknownElement.callCallback2 (chunk-F5XGK2DS.js?v=5f28bd19:10589:22)
    at Object.invokeGuardedCallbackDev (chunk-F5XGK2DS.js?v=5f28bd19:10614:24)
    at invokeGuardedCallback (chunk-F5XGK2DS.js?v=5f28bd19:10646:39)
    at beginWork$1 (chunk-F5XGK2DS.js?v=5f28bd19:14200:15)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=5f28bd19:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=5f28bd19:13604:13)
chunk-F5XGK2DS.js?v=5f28bd19:17705 The above error occurred in the <AtmosphereEffects> component:

    at AtmosphereEffects (http://localhost:5173/src/scenes/simple/components/AtmosphereEffects.tsx?t=1756864142552:21:3)
    at group
    at SceneContent (http://localhost:5173/src/SimpleTest.tsx?t=1756864176095:32:3)
    at Suspense
    at ErrorBoundary (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=5f28bd19:16028:5)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=5f28bd19:17708:21)
    at Provider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=5f28bd19:17317:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
console.error @ chunk-F5XGK2DS.js?v=5f28bd19:17705
chunk-F5XGK2DS.js?v=5f28bd19:17814 Uncaught ReferenceError: earthGlowDayNightRatio is not defined
    at AtmosphereEffects (AtmosphereEffects.tsx:152:43)
    at renderWithHooks (chunk-F5XGK2DS.js?v=5f28bd19:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=5f28bd19:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=5f28bd19:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=5f28bd19:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=5f28bd19:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=5f28bd19:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=5f28bd19:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=5f28bd19:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=5f28bd19:13121:30)
chunk-F5XGK2DS.js?v=5f28bd19:17814 Uncaught ReferenceError: earthGlowDayNightRatio is not defined
    at AtmosphereEffects (AtmosphereEffects.tsx:152:43)
    at renderWithHooks (chunk-F5XGK2DS.js?v=5f28bd19:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=5f28bd19:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=5f28bd19:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=5f28bd19:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=5f28bd19:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=5f28bd19:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=5f28bd19:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=5f28bd19:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=5f28bd19:13121:30)
chunk-F5XGK2DS.js?v=5f28bd19:17705 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=5f28bd19:17774:3)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-F5XGK2DS.js?v=5f28bd19:17708:21)
    at CanvasWrapper
    at div
    at SimpleTest (http://localhost:5173/src/SimpleTest.tsx?t=1756864176095:308:41)
    at App (http://localhost:5173/src/App.tsx?t=1756864176095:31:9)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
console.error @ chunk-F5XGK2DS.js?v=5f28bd19:17705
chunk-RC3YDMAO.js?v=5f28bd19:19413 Uncaught ReferenceError: earthGlowDayNightRatio is not defined
    at AtmosphereEffects (AtmosphereEffects.tsx:152:43)
    at renderWithHooks (chunk-F5XGK2DS.js?v=5f28bd19:5892:26)
    at mountIndeterminateComponent (chunk-F5XGK2DS.js?v=5f28bd19:9375:21)
    at beginWork (chunk-F5XGK2DS.js?v=5f28bd19:10358:22)
    at beginWork$1 (chunk-F5XGK2DS.js?v=5f28bd19:14188:22)
    at performUnitOfWork (chunk-F5XGK2DS.js?v=5f28bd19:13664:20)
    at workLoopSync (chunk-F5XGK2DS.js?v=5f28bd19:13604:13)
    at renderRootSync (chunk-F5XGK2DS.js?v=5f28bd19:13583:15)
    at recoverFromConcurrentError (chunk-F5XGK2DS.js?v=5f28bd19:13173:28)
    at performConcurrentWorkOnRoot (chunk-F5XGK2DS.js?v=5f28bd19:13121:30)
chunk-SMQVUEJW.js?v=5f28bd19:17501 THREE.WebGLRenderer: Context Lost.
content.js:1967 Preloaded 316 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
content.js:1972 Force preloading more content...
content.js:1995 Force preloading facts: 8 cards needed
content.js:1995 Force preloading advice: 8 cards needed
content.js:1995 Force preloading catfacts: 8 cards needed
content.js:1995 Force preloading cocktails: 7 cards needed
content.js:1995 Force preloading datafacts: 25 cards needed
