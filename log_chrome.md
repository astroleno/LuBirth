chunk-RC3YDMAO.js?v=f528f50b:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:10 [Main] React root created
main.tsx:12 [Main] App render called
SimpleTest.tsx:578 [LightInfo] Raw sunWorld: {x: 1, y: 0, z: 0}
SimpleTest.tsx:579 [LightInfo] Real sun angles from ephemeris: {azimuth: '0.0', altitude: '0.0'}
content.js:1286 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:146 [AeScape] URL检查: http://localhost:5173/?debug=1, 应排除: false
content.js:1328 [AeScape] 内容脚本已加载
ephemeris.ts:449 [toUTCFromLocal] 2025-09-06T23:45 (lon:121.5) -> UTC: 2025-09-06T15:45:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间15:45 对应本地时间23:45
constants.ts:50 ✅ 天文常数验证通过
App.tsx:7 [App] mounted - using SimpleTest scene
SimpleTest.tsx:578 [LightInfo] Raw sunWorld: {x: 0.5458525925122945, y: 0.11226573012196718, z: -0.8303260522757243}
SimpleTest.tsx:579 [LightInfo] Real sun angles from ephemeris: {azimuth: '357.0', altitude: '-52.3'}
content.js:157 [AeScape] 用户设置检查: false
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
ephemeris.ts:449 [toUTCFromLocal] 2025-09-06T23:45 (lon:121.5) -> UTC: 2025-09-06T15:45:00.000Z (offset: 8h)
ephemeris.ts:450 [toUTCFromLocal] 注意：UTC时间15:45 对应本地时间23:45
moonPhase.ts:67 [getMoonPhase] 固定月球系统月相计算: {localISO: '2025-09-06T23:45', utc: '2025-09-06T15:45:00.000Z', elongationDeg: '165.5', sunLon_deg: '165.2', moonLon_deg: '-27.7', …}
Moon.tsx:164 [Moon Phase] 固定月球系统计算: {currentDate: '2025-09-06T23:45', observerLat: 31.2, observerLon: 121.5, gamma_deg: '165.5°', renderSunDirection: Array(3), …}
Moon.tsx:227 [Moon Phase] 真实向量太阳方向计算完成: {currentDate: '2025-09-06T23:45', observerLat: 31.2, observerLon: 121.5, sunDirection: Array(3), positionAngle: '-13.0°', …}
Moon.tsx:247 === 真实向量太阳方向信息 ===
Moon.tsx:248 太阳方向: (3) ['0.224', '0.000', '0.975']
Moon.tsx:249 位置角: -13.0°
Moon.tsx:250 光照侧（基于真实向量）: 后方（满月）
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_daymap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_nightmap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_normal_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_specular_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_moon.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_normal.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_displacement.jpg
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '❌', earthNight: '❌', earthNormal: '❌', earthSpecular: '❌', earthClouds: '❌', …}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: false, …}
AtmosphereEffects.tsx:88 [SimpleAtmosphere] {earthSize: 2.0503571337468207, earthY: 0, rimStrength: 0.15, rimWidth: 0.08, earthGlowStrength: 0.8, …}
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_daymap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_nightmap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_normal_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_specular_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_moon.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_normal.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_displacement.jpg
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '❌', earthNight: '❌', earthNormal: '❌', earthSpecular: '❌', earthClouds: '❌', …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: false, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
positionUtils.ts:162 [SimpleExposure] {exposure: 1}
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_daymap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_nightmap.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_normal_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_specular_map.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_earth_clouds.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_moon.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_normal.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/2k_moon_displacement.jpg
textureLoader.ts:77 [TextureLoader] 尝试加载纹理: /textures/8k_stars_milky_way.jpg
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '❌', earthNight: '❌', earthNormal: '❌', earthSpecular: '❌', earthClouds: '❌', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: false, …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: false, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_nightmap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_nightmap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_nightmap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_nightmap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_nightmap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_nightmap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_specular_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_specular_map.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_specular_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_specular_map.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_specular_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_specular_map.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_normal.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_normal.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_normal.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_normal.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_normal.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_normal.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_daymap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_daymap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_daymap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_daymap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_daymap.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_daymap.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_displacement.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_displacement.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_displacement.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_displacement.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/2k_moon_displacement.jpg {width: 2048, height: 1024, src: 'http://localhost:5173/textures/2k_moon_displacement.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_stars_milky_way.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_stars_milky_way.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_normal_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_normal_map.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_normal_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_normal_map.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_normal_map.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_normal_map.jpg'}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_moon.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_moon.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_moon.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_moon.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_moon.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_moon.jpg'}
textureLoader.ts:83 [TextureLoader] ✅ 纹理加载成功: /textures/8k_earth_clouds.jpg {width: 8192, height: 4096, src: 'http://localhost:5173/textures/8k_earth_clouds.jpg'}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '✅', earthNight: '✅', earthNormal: '✅', earthSpecular: '✅', earthClouds: '❌', …}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '✅', earthNight: '✅', earthNormal: '✅', earthSpecular: '✅', earthClouds: '❌', …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
SimpleTest.tsx:35 [MilkyWay] texture loaded: {image: 'http://localhost:5173/textures/8k_stars_milky_way.jpg', repeat: Array(2), yawDeg: -61, pitchDeg: 0, sphereRadius: 120, …}
textureLoader.ts:216 [TextureLoader] 纹理加载状态: {earthMap: '✅', earthNight: '✅', earthNormal: '✅', earthSpecular: '✅', earthClouds: '✅', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
content_script.js:6998 Immersive Translate INFO: sync remote rules success, latest: 2025/9/6 23:26:10
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
content.js:1967 Preloaded 316 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
content.js:1972 Force preloading more content...
content.js:1995 Force preloading quotes: 7 cards needed
content.js:1995 Force preloading facts: 8 cards needed
content.js:1995 Force preloading advice: 8 cards needed
content.js:1995 Force preloading catfacts: 7 cards needed
content.js:1995 Force preloading cocktails: 11 cards needed
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.017, -1.000]', forward: '[0.000, 0.017, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, -0.017]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.017, -1.000]', forward: '[0.000, -0.017, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.017]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.035, -0.999]', forward: '[0.000, -0.035, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, 0.035]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.052, -0.999]', forward: '[0.000, -0.052, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, 0.052]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.070, -0.998]', forward: '[0.000, -0.070, 0.998]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.998, 0.070]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.105, -0.995]', forward: '[0.000, -0.105, 0.995]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.995, 0.105]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.122, -0.993]', forward: '[0.000, -0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, 0.122]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.156, -0.988]', forward: '[0.000, -0.156, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.988, 0.156]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.174, -0.985]', forward: '[0.000, -0.174, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.985, 0.174]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.191, -0.982]', forward: '[0.000, -0.191, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.982, 0.191]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.208, -0.978]', forward: '[0.000, -0.208, 0.978]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.978, 0.208]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.225, -0.974]', forward: '[0.000, -0.225, 0.974]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.974, 0.225]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.225, -0.974]', forward: '[0.000, -0.225, 0.974]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.974, 0.225]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.225, -0.974]', forward: '[0.000, -0.225, 0.974]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.974, 0.225]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.242, -0.970]', forward: '[0.000, -0.242, 0.970]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.970, 0.242]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.242, -0.970]', forward: '[0.000, -0.242, 0.970]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.970, 0.242]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.259, -0.966]', forward: '[0.000, -0.259, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.966, 0.259]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.259, -0.966]', forward: '[0.000, -0.259, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.966, 0.259]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.259, -0.966]', forward: '[0.000, -0.259, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.966, 0.259]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.259, -0.966]', forward: '[0.000, -0.259, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.966, 0.259]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.276, -0.961]', forward: '[0.000, -0.276, 0.961]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.961, 0.276]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.276, -0.961]', forward: '[0.000, -0.276, 0.961]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.961, 0.276]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.292, -0.956]', forward: '[0.000, -0.292, 0.956]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.956, 0.292]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.292, -0.956]', forward: '[0.000, -0.292, 0.956]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.956, 0.292]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.292, -0.956]', forward: '[0.000, -0.292, 0.956]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.956, 0.292]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.292, -0.956]', forward: '[0.000, -0.292, 0.956]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.956, 0.292]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.309, -0.951]', forward: '[0.000, -0.309, 0.951]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.951, 0.309]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.326, -0.946]', forward: '[0.000, -0.326, 0.946]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.946, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.326, -0.946]', forward: '[0.000, -0.326, 0.946]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.946, 0.326]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.342, -0.940]', forward: '[0.000, -0.342, 0.940]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.940, 0.342]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.358, -0.934]', forward: '[0.000, -0.358, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.934, 0.358]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.358, -0.934]', forward: '[0.000, -0.358, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.934, 0.358]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.375, -0.927]', forward: '[0.000, -0.375, 0.927]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.927, 0.375]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.375, -0.927]', forward: '[0.000, -0.375, 0.927]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.927, 0.375]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.391, -0.921]', forward: '[0.000, -0.391, 0.921]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.921, 0.391]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.423, -0.906]', forward: '[0.000, -0.423, 0.906]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.906, 0.423]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.438, -0.899]', forward: '[0.000, -0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, 0.438]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.469, -0.883]', forward: '[0.000, -0.469, 0.883]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.883, 0.469]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.485, -0.875]', forward: '[0.000, -0.485, 0.875]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.875, 0.485]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.485, -0.875]', forward: '[0.000, -0.485, 0.875]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.875, 0.485]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.515, -0.857]', forward: '[0.000, -0.515, 0.857]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.857, 0.515]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.545, -0.839]', forward: '[0.000, -0.545, 0.839]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.839, 0.545]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.574, -0.819]', forward: '[0.000, -0.574, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.819, 0.574]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.574, -0.819]', forward: '[0.000, -0.574, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.819, 0.574]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.588, -0.809]', forward: '[0.000, -0.588, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.809, 0.588]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.588, -0.809]', forward: '[0.000, -0.588, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.809, 0.588]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.602, -0.799]', forward: '[0.000, -0.602, 0.799]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.799, 0.602]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.602, -0.799]', forward: '[0.000, -0.602, 0.799]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.799, 0.602]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.616, -0.788]', forward: '[0.000, -0.616, 0.788]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.788, 0.616]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.616, -0.788]', forward: '[0.000, -0.616, 0.788]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.788, 0.616]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.616, -0.788]', forward: '[0.000, -0.616, 0.788]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.788, 0.616]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.629, -0.777]', forward: '[0.000, -0.629, 0.777]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.777, 0.629]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.629, -0.777]', forward: '[0.000, -0.629, 0.777]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.777, 0.629]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.629, -0.777]', forward: '[0.000, -0.629, 0.777]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.777, 0.629]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.629, -0.777]', forward: '[0.000, -0.629, 0.777]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.777, 0.629]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.669, -0.743]', forward: '[0.000, -0.669, 0.743]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.743, 0.669]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.669, -0.743]', forward: '[0.000, -0.669, 0.743]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.743, 0.669]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.669, -0.743]', forward: '[0.000, -0.669, 0.743]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.743, 0.669]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.682, -0.731]', forward: '[0.000, -0.682, 0.731]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.731, 0.682]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.719, -0.695]', forward: '[0.000, -0.719, 0.695]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.695, 0.719]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.731, -0.682]', forward: '[0.000, -0.731, 0.682]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.682, 0.731]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.743, -0.669]', forward: '[0.000, -0.743, 0.669]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.669, 0.743]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.743, -0.669]', forward: '[0.000, -0.743, 0.669]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.669, 0.743]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.755, -0.656]', forward: '[0.000, -0.755, 0.656]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.656, 0.755]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.755, -0.656]', forward: '[0.000, -0.755, 0.656]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.656, 0.755]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.755, -0.656]', forward: '[0.000, -0.755, 0.656]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.656, 0.755]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.755, -0.656]', forward: '[0.000, -0.755, 0.656]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.656, 0.755]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.766, -0.643]', forward: '[0.000, -0.766, 0.643]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.643, 0.766]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.766, -0.643]', forward: '[0.000, -0.766, 0.643]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.643, 0.766]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.766, -0.643]', forward: '[0.000, -0.766, 0.643]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.643, 0.766]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.777, -0.629]', forward: '[0.000, -0.777, 0.629]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.629, 0.777]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.777, -0.629]', forward: '[0.000, -0.777, 0.629]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.629, 0.777]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.777, -0.629]', forward: '[0.000, -0.777, 0.629]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.629, 0.777]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.788, -0.616]', forward: '[0.000, -0.788, 0.616]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.616, 0.788]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.777, -0.629]', forward: '[0.000, -0.777, 0.629]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.629, 0.777]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.755, -0.656]', forward: '[0.000, -0.755, 0.656]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.656, 0.755]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.719, -0.695]', forward: '[0.000, -0.719, 0.695]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.695, 0.719]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.695, -0.719]', forward: '[0.000, -0.695, 0.719]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.719, 0.695]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.695, -0.719]', forward: '[0.000, -0.695, 0.719]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.719, 0.695]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.695, -0.719]', forward: '[0.000, -0.695, 0.719]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.719, 0.695]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.682, -0.731]', forward: '[0.000, -0.682, 0.731]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.731, 0.682]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.669, -0.743]', forward: '[0.000, -0.669, 0.743]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.743, 0.669]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.656, -0.755]', forward: '[0.000, -0.656, 0.755]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.755, 0.656]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.643, -0.766]', forward: '[0.000, -0.643, 0.766]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.766, 0.643]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.629, -0.777]', forward: '[0.000, -0.629, 0.777]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.777, 0.629]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.602, -0.799]', forward: '[0.000, -0.602, 0.799]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.799, 0.602]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.574, -0.819]', forward: '[0.000, -0.574, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.819, 0.574]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.500, -0.866]', forward: '[0.000, -0.500, 0.866]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.866, 0.500]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.454, -0.891]', forward: '[0.000, -0.454, 0.891]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.891, 0.454]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.407, -0.914]', forward: '[0.000, -0.407, 0.914]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.914, 0.407]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.358, -0.934]', forward: '[0.000, -0.358, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.934, 0.358]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.292, -0.956]', forward: '[0.000, -0.292, 0.956]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.956, 0.292]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.208, -0.978]', forward: '[0.000, -0.208, 0.978]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.978, 0.208]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.156, -0.988]', forward: '[0.000, -0.156, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.988, 0.156]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.156, -0.988]', forward: '[0.000, -0.156, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.988, 0.156]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.139, -0.990]', forward: '[0.000, -0.139, 0.990]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.990, 0.139]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.105, -0.995]', forward: '[0.000, -0.105, 0.995]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.995, 0.105]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.087, -0.996]', forward: '[0.000, -0.087, 0.996]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.996, 0.087]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.052, -0.999]', forward: '[0.000, -0.052, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, 0.052]', …}
content.js:1995 Force preloading datafacts: 25 cards needed
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.035, -0.999]', forward: '[0.000, -0.035, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, 0.035]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.035, -0.999]', forward: '[0.000, -0.035, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, 0.035]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, 0.000, -1.000]', forward: '[0.000, 0.000, 1.000]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.052, -0.999]', forward: '[0.000, 0.052, 0.999]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.999, -0.052]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.087, -0.996]', forward: '[0.000, 0.087, 0.996]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.996, -0.087]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.122, -0.993]', forward: '[0.000, 0.122, 0.993]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.993, -0.122]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.156, -0.988]', forward: '[0.000, 0.156, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.988, -0.156]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.191, -0.982]', forward: '[0.000, 0.191, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.982, -0.191]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.259, -0.966]', forward: '[0.000, 0.259, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.966, -0.259]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.375, -0.927]', forward: '[0.000, 0.375, 0.927]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.927, -0.375]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.423, -0.906]', forward: '[0.000, 0.423, 0.906]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.906, -0.423]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
content.js:1995 Force preloading gathas: 15 cards needed
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
content.js:2024 Force preload completed. Total cache size: 371
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.000, -0.438, -0.899]', forward: '[0.000, 0.438, 0.899]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[1.000, 0.000, 0.000]', upCorrected: '[0.000, 0.899, -0.438]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.094, -0.438, -0.894]', forward: '[-0.094, 0.438, 0.894]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.995, 0.000, 0.105]', upCorrected: '[0.046, 0.899, -0.436]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[0.031, -0.438, -0.898]', forward: '[-0.031, 0.438, 0.898]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.999, 0.000, 0.035]', upCorrected: '[0.015, 0.899, -0.438]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.094, -0.438, -0.894]', forward: '[0.094, 0.438, 0.894]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.995, 0.000, -0.105]', upCorrected: '[-0.046, 0.899, -0.436]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.293, -0.438, -0.850]', forward: '[0.293, 0.438, 0.850]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.946, 0.000, -0.326]', upCorrected: '[-0.143, 0.899, -0.414]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.463, -0.438, -0.770]', forward: '[0.463, 0.438, 0.770]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.857, 0.000, -0.515]', upCorrected: '[-0.226, 0.899, -0.376]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, -0.668]', forward: '[0.601, 0.438, 0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, -0.326]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.636, -0.438, -0.636]', forward: '[0.636, 0.438, 0.636]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.707, 0.000, -0.707]', upCorrected: '[-0.310, 0.899, -0.310]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, -0.590]', forward: '[0.678, 0.438, 0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, -0.288]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.736, -0.438, -0.516]', forward: '[0.736, 0.438, 0.516]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.574, 0.000, -0.819]', upCorrected: '[-0.359, 0.899, -0.251]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.833, -0.438, -0.337]', forward: '[0.833, 0.438, 0.337]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.375, 0.000, -0.927]', upCorrected: '[-0.406, 0.899, -0.164]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.895, -0.438, -0.078]', forward: '[0.895, 0.438, 0.078]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.087, 0.000, -0.996]', upCorrected: '[-0.437, 0.899, -0.038]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.864, -0.438, 0.248]', forward: '[0.864, 0.438, -0.248]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.276, 0.000, -0.961]', upCorrected: '[-0.421, 0.899, 0.121]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, 0.351]', forward: '[0.827, 0.438, -0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, 0.171]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.821, -0.438, 0.366]', forward: '[0.821, 0.438, -0.366]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.407, 0.000, -0.914]', upCorrected: '[-0.400, 0.899, 0.178]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.794, -0.438, 0.422]', forward: '[0.794, 0.438, -0.422]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.469, 0.000, -0.883]', upCorrected: '[-0.387, 0.899, 0.206]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.727, -0.438, 0.528]', forward: '[0.727, 0.438, -0.528]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.588, 0.000, -0.809]', upCorrected: '[-0.355, 0.899, 0.258]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.698, -0.438, 0.566]', forward: '[0.698, 0.438, -0.566]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.629, 0.000, -0.777]', upCorrected: '[-0.341, 0.899, 0.276]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.678, -0.438, 0.590]', forward: '[0.678, 0.438, -0.590]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.656, 0.000, -0.755]', upCorrected: '[-0.331, 0.899, 0.288]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.636, -0.438, 0.636]', forward: '[0.636, 0.438, -0.636]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.707, 0.000, -0.707]', upCorrected: '[-0.310, 0.899, 0.310]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.601, -0.438, 0.668]', forward: '[0.601, 0.438, -0.668]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.743, 0.000, -0.669]', upCorrected: '[-0.293, 0.899, 0.326]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.624, -0.438, 0.647]', forward: '[0.624, 0.438, -0.647]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.719, 0.000, -0.695]', upCorrected: '[-0.305, 0.899, 0.315]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.647, -0.438, 0.624]', forward: '[0.647, 0.438, -0.624]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.695, 0.000, -0.719]', upCorrected: '[-0.315, 0.899, 0.305]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.689, -0.438, 0.578]', forward: '[0.689, 0.438, -0.578]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.643, 0.000, -0.766]', upCorrected: '[-0.336, 0.899, 0.282]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.745, -0.438, 0.503]', forward: '[0.745, 0.438, -0.503]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.559, 0.000, -0.829]', upCorrected: '[-0.363, 0.899, 0.245]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.833, -0.438, 0.337]', forward: '[0.833, 0.438, -0.337]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.375, 0.000, -0.927]', upCorrected: '[-0.406, 0.899, 0.164]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.882, -0.438, 0.171]', forward: '[0.882, 0.438, -0.171]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.191, 0.000, -0.982]', upCorrected: '[-0.430, 0.899, 0.084]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.898, -0.438, 0.031]', forward: '[0.898, 0.438, -0.031]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.035, 0.000, -0.999]', upCorrected: '[-0.438, 0.899, 0.015]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.899, -0.438, 0.016]', forward: '[0.899, 0.438, -0.016]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.017, 0.000, -1.000]', upCorrected: '[-0.438, 0.899, 0.008]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.899, -0.438, 0.016]', forward: '[0.899, 0.438, -0.016]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[-0.017, 0.000, -1.000]', upCorrected: '[-0.438, 0.899, 0.008]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.898, -0.438, -0.031]', forward: '[0.898, 0.438, 0.031]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.035, 0.000, -0.999]', upCorrected: '[-0.438, 0.899, -0.015]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.897, -0.438, -0.063]', forward: '[0.897, 0.438, 0.063]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.070, 0.000, -0.998]', upCorrected: '[-0.437, 0.899, -0.031]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.879, -0.438, -0.187]', forward: '[0.879, 0.438, 0.187]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.208, 0.000, -0.978]', upCorrected: '[-0.429, 0.899, -0.091]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.872, -0.438, -0.217]', forward: '[0.872, 0.438, 0.217]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.242, 0.000, -0.970]', upCorrected: '[-0.425, 0.899, -0.106]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.860, -0.438, -0.263]', forward: '[0.860, 0.438, 0.263]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.292, 0.000, -0.956]', upCorrected: '[-0.419, 0.899, -0.128]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.839, -0.438, -0.322]', forward: '[0.839, 0.438, 0.322]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.358, 0.000, -0.934]', upCorrected: '[-0.409, 0.899, -0.157]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, -0.351]', forward: '[0.827, 0.438, 0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, -0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, -0.351]', forward: '[0.827, 0.438, 0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, -0.171]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.827, -0.438, -0.351]', forward: '[0.827, 0.438, 0.351]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.391, 0.000, -0.921]', upCorrected: '[-0.404, 0.899, -0.171]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.801, -0.438, -0.408]', forward: '[0.801, 0.438, 0.408]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.454, 0.000, -0.891]', upCorrected: '[-0.391, 0.899, -0.199]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.708, -0.438, -0.553]', forward: '[0.708, 0.438, 0.553]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.616, 0.000, -0.788]', upCorrected: '[-0.345, 0.899, -0.270]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.566, -0.438, -0.698]', forward: '[0.566, 0.438, 0.698]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.777, 0.000, -0.629]', upCorrected: '[-0.276, 0.899, -0.341]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.476, -0.438, -0.762]', forward: '[0.476, 0.438, 0.762]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.848, 0.000, -0.530]', upCorrected: '[-0.232, 0.899, -0.372]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.449, -0.438, -0.778]', forward: '[0.449, 0.438, 0.778]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.866, 0.000, -0.500]', upCorrected: '[-0.219, 0.899, -0.380]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.366, -0.438, -0.821]', forward: '[0.366, 0.438, 0.821]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.914, 0.000, -0.407]', upCorrected: '[-0.178, 0.899, -0.400]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.278, -0.438, -0.855]', forward: '[0.278, 0.438, 0.855]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.951, 0.000, -0.309]', upCorrected: '[-0.135, 0.899, -0.417]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.144, -0.391, -0.909]', forward: '[0.144, 0.391, 0.909]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.061, 0.921, -0.386]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.148, -0.326, -0.934]', forward: '[0.148, 0.326, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.051, 0.946, -0.322]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.105, -0.982]', forward: '[0.156, 0.105, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.016, 0.995, -0.103]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, 0.122, -0.980]', forward: '[0.155, -0.122, 0.980]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.019, 0.993, 0.120]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.139, 0.454, -0.880]', forward: '[0.139, -0.454, 0.880]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.071, 0.891, 0.448]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.122, 0.629, -0.768]', forward: '[0.122, -0.629, 0.768]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.098, 0.777, 0.622]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.109, 0.719, -0.686]', forward: '[0.109, -0.719, 0.686]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.113, 0.695, 0.710]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.107, 0.731, -0.674]', forward: '[0.107, -0.731, 0.674]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.114, 0.682, 0.722]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.098, 0.777, -0.622]', forward: '[0.098, -0.777, 0.622]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.122, 0.629, 0.768]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.096, 0.788, -0.608]', forward: '[0.096, -0.788, 0.608]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.123, 0.616, 0.778]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.096, 0.788, -0.608]', forward: '[0.096, -0.788, 0.608]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.123, 0.616, 0.778]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.094, 0.799, -0.594]', forward: '[0.094, -0.799, 0.594]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.125, 0.602, 0.789]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.092, 0.809, -0.581]', forward: '[0.092, -0.809, 0.581]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.127, 0.588, 0.799]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.090, 0.819, -0.567]', forward: '[0.090, -0.819, 0.567]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.128, 0.574, 0.809]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.098, 0.777, -0.622]', forward: '[0.098, -0.777, 0.622]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.122, 0.629, 0.768]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.111, 0.707, -0.698]', forward: '[0.111, -0.707, 0.698]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.111, 0.707, 0.698]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.143, 0.407, -0.902]', forward: '[0.143, -0.407, 0.902]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.064, 0.914, 0.402]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.154, 0.174, -0.973]', forward: '[0.154, -0.174, 0.973]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.027, 0.985, 0.172]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.070, -0.985]', forward: '[0.156, -0.070, 0.985]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.011, 0.998, 0.069]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.017, -0.988]', forward: '[0.156, -0.017, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.003, 1.000, 0.017]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.035, -0.987]', forward: '[0.156, 0.035, 0.987]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.005, 0.999, -0.034]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.105, -0.982]', forward: '[0.156, 0.105, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.016, 0.995, -0.103]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, -0.156, -0.976]', forward: '[0.155, 0.156, 0.976]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.024, 0.988, -0.155]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.154, -0.191, -0.970]', forward: '[0.154, 0.191, 0.970]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.030, 0.982, -0.188]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.152, -0.242, -0.958]', forward: '[0.152, 0.242, 0.958]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.038, 0.970, -0.239]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.150, -0.292, -0.945]', forward: '[0.150, 0.292, 0.945]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.046, 0.956, -0.289]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.148, -0.326, -0.934]', forward: '[0.148, 0.326, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.051, 0.946, -0.322]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.145, -0.375, -0.916]', forward: '[0.145, 0.375, 0.916]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.059, 0.927, -0.370]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.143, -0.407, -0.902]', forward: '[0.143, 0.407, 0.902]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.064, 0.914, -0.402]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.142, -0.423, -0.895]', forward: '[0.142, 0.423, 0.895]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.066, 0.906, -0.417]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.142, -0.423, -0.895]', forward: '[0.142, 0.423, 0.895]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.066, 0.906, -0.417]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.142, -0.423, -0.895]', forward: '[0.142, 0.423, 0.895]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.066, 0.906, -0.417]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.135, -0.500, -0.855]', forward: '[0.135, 0.500, 0.855]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.078, 0.866, -0.494]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.133, -0.530, -0.838]', forward: '[0.133, 0.530, 0.838]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.083, 0.848, -0.523]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.131, -0.545, -0.828]', forward: '[0.131, 0.545, 0.828]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.085, 0.839, -0.538]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, -0.559, -0.819]', forward: '[0.130, 0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.087, 0.829, -0.552]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, -0.559, -0.819]', forward: '[0.130, 0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.087, 0.829, -0.552]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, -0.574, -0.809]', forward: '[0.128, 0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.090, 0.819, -0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, -0.574, -0.809]', forward: '[0.128, 0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.090, 0.819, -0.567]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.127, -0.588, -0.799]', forward: '[0.127, 0.588, 0.799]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.092, 0.809, -0.581]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.125, -0.602, -0.789]', forward: '[0.125, 0.602, 0.789]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.094, 0.799, -0.594]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.120, -0.643, -0.757]', forward: '[0.120, 0.643, 0.757]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.101, 0.766, -0.635]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.107, -0.731, -0.674]', forward: '[0.107, 0.731, 0.674]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.114, 0.682, -0.722]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.085, -0.839, -0.538]', forward: '[0.085, 0.839, 0.538]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.131, 0.545, -0.828]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.048, -0.951, -0.305]', forward: '[0.048, 0.951, 0.305]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.149, 0.309, -0.939]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.014, -0.996, -0.086]', forward: '[0.014, 0.996, 0.086]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.156, 0.087, -0.984]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.030, -0.982, -0.188]', forward: '[0.030, 0.982, 0.188]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.154, 0.191, -0.970]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.054, -0.940, -0.338]', forward: '[0.054, 0.940, 0.338]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.147, 0.342, -0.928]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.071, -0.891, -0.448]', forward: '[0.071, 0.891, 0.448]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.139, 0.454, -0.880]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.087, -0.829, -0.552]', forward: '[0.087, 0.829, 0.552]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.130, 0.559, -0.819]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.101, -0.766, -0.635]', forward: '[0.101, 0.766, 0.635]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.120, 0.643, -0.757]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, -0.695, -0.710]', forward: '[0.113, 0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.109, 0.719, -0.686]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.114, -0.682, -0.722]', forward: '[0.114, 0.682, 0.722]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.107, 0.731, -0.674]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.116, -0.669, -0.734]', forward: '[0.116, 0.669, 0.734]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.105, 0.743, -0.661]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.120, -0.643, -0.757]', forward: '[0.120, 0.643, 0.757]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.101, 0.766, -0.635]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.123, -0.616, -0.778]', forward: '[0.123, 0.616, 0.778]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.096, 0.788, -0.608]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, -0.559, -0.819]', forward: '[0.130, 0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.087, 0.829, -0.552]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.134, -0.515, -0.847]', forward: '[0.134, 0.515, 0.847]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.081, 0.857, -0.509]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.135, -0.500, -0.855]', forward: '[0.135, 0.500, 0.855]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.078, 0.866, -0.494]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.138, -0.469, -0.872]', forward: '[0.138, 0.469, 0.872]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.073, 0.883, -0.464]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, -0.438, -0.888]', forward: '[0.141, 0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.069, 0.899, -0.433]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.143, -0.407, -0.902]', forward: '[0.143, 0.407, 0.902]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.064, 0.914, -0.402]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.146, -0.358, -0.922]', forward: '[0.146, 0.358, 0.922]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.056, 0.934, -0.354]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.148, -0.326, -0.934]', forward: '[0.148, 0.326, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.051, 0.946, -0.322]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.149, -0.309, -0.939]', forward: '[0.149, 0.309, 0.939]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.048, 0.951, -0.305]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.150, -0.292, -0.945]', forward: '[0.150, 0.292, 0.945]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.046, 0.956, -0.289]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.152, -0.225, -0.962]', forward: '[0.152, 0.225, 0.962]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.035, 0.974, -0.222]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.154, -0.174, -0.973]', forward: '[0.154, 0.174, 0.973]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.027, 0.985, -0.172]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, -0.139, -0.978]', forward: '[0.155, 0.139, 0.978]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.022, 0.990, -0.137]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, -0.122, -0.980]', forward: '[0.155, 0.122, 0.980]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.019, 0.993, -0.120]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.105, -0.982]', forward: '[0.156, 0.105, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.016, 0.995, -0.103]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.087, -0.984]', forward: '[0.156, 0.087, 0.984]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.014, 0.996, -0.086]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, -0.052, -0.986]', forward: '[0.156, 0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[-0.008, 0.999, -0.052]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.000, -0.988]', forward: '[0.156, 0.000, 0.988]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.000, 1.000, 0.000]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.052, -0.986]', forward: '[0.156, -0.052, 0.986]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.008, 0.999, 0.052]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.087, -0.984]', forward: '[0.156, -0.087, 0.984]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.014, 0.996, 0.086]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.156, 0.105, -0.982]', forward: '[0.156, -0.105, 0.982]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.016, 0.995, 0.103]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, 0.122, -0.980]', forward: '[0.155, -0.122, 0.980]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.019, 0.993, 0.120]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.155, 0.156, -0.976]', forward: '[0.155, -0.156, 0.976]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.024, 0.988, 0.155]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.153, 0.208, -0.966]', forward: '[0.153, -0.208, 0.966]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.033, 0.978, 0.205]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.151, 0.259, -0.954]', forward: '[0.151, -0.259, 0.954]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.040, 0.966, 0.256]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.150, 0.292, -0.945]', forward: '[0.150, -0.292, 0.945]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.046, 0.956, 0.289]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.148, 0.326, -0.934]', forward: '[0.148, -0.326, 0.934]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.051, 0.946, 0.322]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.146, 0.358, -0.922]', forward: '[0.146, -0.358, 0.922]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.056, 0.934, 0.354]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.144, 0.391, -0.909]', forward: '[0.144, -0.391, 0.909]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.061, 0.921, 0.386]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.141, 0.438, -0.888]', forward: '[0.141, -0.438, 0.888]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.069, 0.899, 0.433]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.139, 0.454, -0.880]', forward: '[0.139, -0.454, 0.880]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.071, 0.891, 0.448]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.135, 0.500, -0.855]', forward: '[0.135, -0.500, 0.855]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.078, 0.866, 0.494]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.133, 0.530, -0.838]', forward: '[0.133, -0.530, 0.838]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.083, 0.848, 0.523]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.131, 0.545, -0.828]', forward: '[0.131, -0.545, 0.828]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.085, 0.839, 0.538]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, 0.559, -0.819]', forward: '[0.130, -0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.087, 0.829, 0.552]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, 0.559, -0.819]', forward: '[0.130, -0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.087, 0.829, 0.552]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.130, 0.559, -0.819]', forward: '[0.130, -0.559, 0.819]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.087, 0.829, 0.552]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.128, 0.574, -0.809]', forward: '[0.128, -0.574, 0.809]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.090, 0.819, 0.567]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.127, 0.588, -0.799]', forward: '[0.127, -0.588, 0.799]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.092, 0.809, 0.581]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.122, 0.629, -0.768]', forward: '[0.122, -0.629, 0.768]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.098, 0.777, 0.622]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.113, 0.695, -0.710]', forward: '[0.113, -0.695, 0.710]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.109, 0.719, 0.686]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.107, 0.731, -0.674]', forward: '[0.107, -0.731, 0.674]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.114, 0.682, 0.722]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.105, 0.743, -0.661]', forward: '[0.105, -0.743, 0.661]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.116, 0.669, 0.734]', …}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: true, useMilkyWay: true}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
textureLoader.ts:193 [TextureLoader] 开始加载纹理，配置: {useTextures: true, useClouds: false, useMilkyWay: false}
Earth.tsx:210 [SimpleEarth] {position: Array(3), size: 2.0503571337468207, lightDirection: Array(3), useTextures: true, hasDayMap: true, …}
Clouds.tsx:162 [SimpleClouds] {radius: 2.0680000468112856, position: Array(3), yawDeg: 0, pitchDeg: 0, lightDir: Array(3), …}
Moon.tsx:588 [SimpleMoon Debug] {position: Array(3), radius: 0.44, lightDirection: Array(3), useTextures: true, hasMap: true, …}
Moon.tsx:650 [SimpleMoon Lighting Analysis] {sunDirection: Array(3), x: '0.224', y: '0.000', z: '0.975', positionAngleChi: '-13.0°', …}
positionUtils.ts:51 [SimpleCamera] {position: Array(3), fov: 45, near: 0.01, far: 400, mode: 'single-render-system', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
Moon.tsx:519 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
 [Stable Billboard Fixed] {camDirection: '[-0.103, 0.755, -0.648]', forward: '[0.103, -0.755, 0.648]', worldUp: '[0.000, 1.000, 0.000]', camRight: '[0.988, 0.000, -0.156]', upCorrected: '[0.118, 0.656, 0.745]', …}
