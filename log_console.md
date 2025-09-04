[plugin:vite:esbuild] Transform failed with 1 error:
F:/github/LuBirth/src/scenes/simple/utils/lightingUtils.ts:15:14: ERROR: Expected ";" but found ":"
F:/github/LuBirth/src/scenes/simple/utils/lightingUtils.ts:15:14
Expected ";" but found ":"
13 |      // console.log('[useLightDirection] Recalculating light direction:', { 
14 |        mode, 
15 |        sunWorld: { x: sunWorld.x, y: sunWorld.y, z: sunWorld.z },
   |                ^
16 |        lightAzimuth: composition.lightAzimuth,
17 |        lightElevation: composition.lightElevation
    at failureErrorWithLog (F:\github\LuBirth\node_modules\esbuild\lib\main.js:1472:15)
    at F:\github\LuBirth\node_modules\esbuild\lib\main.js:755:50
    at responseCallbacks.<computed> (F:\github\LuBirth\node_modules\esbuild\lib\main.js:622:9)
    at handleIncomingPacket (F:\github\LuBirth\node_modules\esbuild\lib\main.js:677:12)
    at Socket.readFromStdout (F:\github\LuBirth\node_modules\esbuild\lib\main.js:600:7)
    at Socket.emit (node:events:507:28)
    at addChunk (node:internal/streams/readable:559:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
    at Readable.push (node:internal/streams/readable:390:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.