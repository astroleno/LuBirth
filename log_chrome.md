chunk-RC3YDMAO.js?v=d905a87e:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:10 [Main] React root created
main.tsx:12 [Main] App render called
SimpleTest.tsx:419 [EarthRotation] 初始化: UTC=2025-09-12T09:53:15.000Z, hours=9.887, yaw=148.3°
SimpleTest.tsx:419 [EarthRotation] 初始化: UTC=2025-09-12T09:53:15.001Z, hours=9.888, yaw=148.3°
SimpleTest.tsx:708 Uncaught ReferenceError: Cannot access 'updateValue' before initialization
    at SimpleTest (SimpleTest.tsx:708:23)
    at renderWithHooks (chunk-RC3YDMAO.js?v=d905a87e:11548:26)
    at mountIndeterminateComponent (chunk-RC3YDMAO.js?v=d905a87e:14926:21)
    at beginWork (chunk-RC3YDMAO.js?v=d905a87e:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-RC3YDMAO.js?v=d905a87e:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-RC3YDMAO.js?v=d905a87e:3699:24)
    at invokeGuardedCallback (chunk-RC3YDMAO.js?v=d905a87e:3733:39)
    at beginWork$1 (chunk-RC3YDMAO.js?v=d905a87e:19765:15)
    at performUnitOfWork (chunk-RC3YDMAO.js?v=d905a87e:19198:20)
    at workLoopSync (chunk-RC3YDMAO.js?v=d905a87e:19137:13)
SimpleTest @ SimpleTest.tsx:708
renderWithHooks @ chunk-RC3YDMAO.js?v=d905a87e:11548
mountIndeterminateComponent @ chunk-RC3YDMAO.js?v=d905a87e:14926
beginWork @ chunk-RC3YDMAO.js?v=d905a87e:15914
callCallback2 @ chunk-RC3YDMAO.js?v=d905a87e:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=d905a87e:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=d905a87e:3733
beginWork$1 @ chunk-RC3YDMAO.js?v=d905a87e:19765
performUnitOfWork @ chunk-RC3YDMAO.js?v=d905a87e:19198
workLoopSync @ chunk-RC3YDMAO.js?v=d905a87e:19137
renderRootSync @ chunk-RC3YDMAO.js?v=d905a87e:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=d905a87e:18678
workLoop @ chunk-RC3YDMAO.js?v=d905a87e:197
flushWork @ chunk-RC3YDMAO.js?v=d905a87e:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=d905a87e:384
SimpleTest.tsx:419 [EarthRotation] 初始化: UTC=2025-09-12T09:53:15.002Z, hours=9.888, yaw=148.3°
SimpleTest.tsx:419 [EarthRotation] 初始化: UTC=2025-09-12T09:53:15.002Z, hours=9.888, yaw=148.3°
SimpleTest.tsx:708 Uncaught ReferenceError: Cannot access 'updateValue' before initialization
    at SimpleTest (SimpleTest.tsx:708:23)
    at renderWithHooks (chunk-RC3YDMAO.js?v=d905a87e:11548:26)
    at mountIndeterminateComponent (chunk-RC3YDMAO.js?v=d905a87e:14926:21)
    at beginWork (chunk-RC3YDMAO.js?v=d905a87e:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-RC3YDMAO.js?v=d905a87e:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-RC3YDMAO.js?v=d905a87e:3699:24)
    at invokeGuardedCallback (chunk-RC3YDMAO.js?v=d905a87e:3733:39)
    at beginWork$1 (chunk-RC3YDMAO.js?v=d905a87e:19765:15)
    at performUnitOfWork (chunk-RC3YDMAO.js?v=d905a87e:19198:20)
    at workLoopSync (chunk-RC3YDMAO.js?v=d905a87e:19137:13)
SimpleTest @ SimpleTest.tsx:708
renderWithHooks @ chunk-RC3YDMAO.js?v=d905a87e:11548
mountIndeterminateComponent @ chunk-RC3YDMAO.js?v=d905a87e:14926
beginWork @ chunk-RC3YDMAO.js?v=d905a87e:15914
callCallback2 @ chunk-RC3YDMAO.js?v=d905a87e:3674
invokeGuardedCallbackDev @ chunk-RC3YDMAO.js?v=d905a87e:3699
invokeGuardedCallback @ chunk-RC3YDMAO.js?v=d905a87e:3733
beginWork$1 @ chunk-RC3YDMAO.js?v=d905a87e:19765
performUnitOfWork @ chunk-RC3YDMAO.js?v=d905a87e:19198
workLoopSync @ chunk-RC3YDMAO.js?v=d905a87e:19137
renderRootSync @ chunk-RC3YDMAO.js?v=d905a87e:19116
recoverFromConcurrentError @ chunk-RC3YDMAO.js?v=d905a87e:18736
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=d905a87e:18684
workLoop @ chunk-RC3YDMAO.js?v=d905a87e:197
flushWork @ chunk-RC3YDMAO.js?v=d905a87e:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=d905a87e:384
chunk-F5XGK2DS.js?v=d905a87e:17705 The above error occurred in the <SimpleTest> component:

    at SimpleTest (http://localhost:5173/src/SimpleTest.tsx?t=1757670657760:470:29)
    at App (http://localhost:5173/src/App.tsx?t=1757670657760:22:9)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
console.error @ chunk-F5XGK2DS.js?v=d905a87e:17705
logCapturedError @ chunk-RC3YDMAO.js?v=d905a87e:14032
update.callback @ chunk-RC3YDMAO.js?v=d905a87e:14052
callCallback @ chunk-RC3YDMAO.js?v=d905a87e:11248
commitUpdateQueue @ chunk-RC3YDMAO.js?v=d905a87e:11265
commitLayoutEffectOnFiber @ chunk-RC3YDMAO.js?v=d905a87e:17093
commitLayoutMountEffects_complete @ chunk-RC3YDMAO.js?v=d905a87e:17980
commitLayoutEffects_begin @ chunk-RC3YDMAO.js?v=d905a87e:17969
commitLayoutEffects @ chunk-RC3YDMAO.js?v=d905a87e:17920
commitRootImpl @ chunk-RC3YDMAO.js?v=d905a87e:19353
commitRoot @ chunk-RC3YDMAO.js?v=d905a87e:19277
finishConcurrentRender @ chunk-RC3YDMAO.js?v=d905a87e:18760
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=d905a87e:18718
workLoop @ chunk-RC3YDMAO.js?v=d905a87e:197
flushWork @ chunk-RC3YDMAO.js?v=d905a87e:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=d905a87e:384
chunk-RC3YDMAO.js?v=d905a87e:19413 Uncaught ReferenceError: Cannot access 'updateValue' before initialization
    at SimpleTest (SimpleTest.tsx:708:23)
    at renderWithHooks (chunk-RC3YDMAO.js?v=d905a87e:11548:26)
    at mountIndeterminateComponent (chunk-RC3YDMAO.js?v=d905a87e:14926:21)
    at beginWork (chunk-RC3YDMAO.js?v=d905a87e:15914:22)
    at beginWork$1 (chunk-RC3YDMAO.js?v=d905a87e:19753:22)
    at performUnitOfWork (chunk-RC3YDMAO.js?v=d905a87e:19198:20)
    at workLoopSync (chunk-RC3YDMAO.js?v=d905a87e:19137:13)
    at renderRootSync (chunk-RC3YDMAO.js?v=d905a87e:19116:15)
    at recoverFromConcurrentError (chunk-RC3YDMAO.js?v=d905a87e:18736:28)
    at performConcurrentWorkOnRoot (chunk-RC3YDMAO.js?v=d905a87e:18684:30)
SimpleTest @ SimpleTest.tsx:708
renderWithHooks @ chunk-RC3YDMAO.js?v=d905a87e:11548
mountIndeterminateComponent @ chunk-RC3YDMAO.js?v=d905a87e:14926
beginWork @ chunk-RC3YDMAO.js?v=d905a87e:15914
beginWork$1 @ chunk-RC3YDMAO.js?v=d905a87e:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=d905a87e:19198
workLoopSync @ chunk-RC3YDMAO.js?v=d905a87e:19137
renderRootSync @ chunk-RC3YDMAO.js?v=d905a87e:19116
recoverFromConcurrentError @ chunk-RC3YDMAO.js?v=d905a87e:18736
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=d905a87e:18684
workLoop @ chunk-RC3YDMAO.js?v=d905a87e:197
flushWork @ chunk-RC3YDMAO.js?v=d905a87e:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=d905a87e:384
content.js:1286 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:146 [AeScape] URL检查: http://localhost:5173/, 应排除: false
content.js:1328 [AeScape] 内容脚本已加载
content.js:157 [AeScape] 用户设置检查: false
content.js:1967 Preloaded 317 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
