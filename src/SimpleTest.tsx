import React, { useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SimpleComposition, DEFAULT_SIMPLE_COMPOSITION } from './types/SimpleComposition';
import { useLightDirection, useLightColor, useLightIntensity, useAmbientIntensity } from './scenes/simple/utils/lightingUtils';
import { useCameraControl, useEarthPosition, useMoonPosition, useExposureControl } from './scenes/simple/utils/positionUtils';
import { useTextureLoader } from './scenes/simple/utils/textureLoader';
import { Earth } from './scenes/simple/components/Earth';
import { Moon } from './scenes/simple/components/Moon';
import { Clouds } from './scenes/simple/components/Clouds';
import { CloudsOverlayFix } from './scenes/simple/components/Clouds';
import { AtmosphereEffects } from './scenes/simple/components/AtmosphereEffects';
import { getEarthState, type TimeInterpretation } from './scenes/simple/api/earthState';
import { logger } from './utils/logger';
import { alignLongitudeOnly } from './scenes/simple/api/shotRig';
import { getMoonPhase } from './scenes/simple/api/moonPhase';

// 场景内容组件
function SceneContent({ 
  composition, 
  mode, 
  sunWorld,
  altDeg
}: { 
  composition: SimpleComposition;
  mode: 'debug' | 'celestial';
  sunWorld: { x: number; y: number; z: number };
  altDeg?: number;
}) {
  const { camera } = useThree();
  
  // 光照系统 - 单光照，与日期时间计算耦合
  const lightDirection = useLightDirection(mode, sunWorld, composition, altDeg);
  const lightColor = useLightColor(composition);
  const lightIntensity = useLightIntensity(composition);
  const ambientIntensity = useAmbientIntensity(composition);
  
  // 相机控制
  useCameraControl(composition);
  useExposureControl(composition);
  
  // 位置计算
  const earthInfo = useEarthPosition(composition, composition.cameraDistance);
  const moonInfo = useMoonPosition(composition, camera);
  
  // 纹理加载
  const {
    earthClouds,
    starsMilky
  } = useTextureLoader(composition);
  
  // 调试信息（统一经 logger 输出）
  React.useEffect(() => {
    if (!logger.isEnabled()) return;
    logger.log('scene/init', {
      mode,
      lightDirection: lightDirection.toArray(),
      lightColor: lightColor.getHexString(),
      lightIntensity,
      earthPosition: earthInfo.position,
      earthSize: earthInfo.size,
      moonPosition: moonInfo.position,
      moonDistance: moonInfo.distance,
      composition
    });
  }, [mode, lightDirection, lightColor, lightIntensity, earthInfo, moonInfo, composition]);

  // 光照方向变化监听
  React.useEffect(() => {
    if (!logger.isEnabled()) return;
    logger.log('lighting/updated', {
      dir: lightDirection.toArray(),
      pos: [lightDirection.x * 50, lightDirection.y * 50, lightDirection.z * 50],
      mode,
      t: new Date().toISOString()
    });
  }, [lightDirection, mode]);

  // 单光常亮：不再按 altDeg 关灯，夜面由着色器控制
  const finalIntensity = lightIntensity;
  const finalCastShadow = true;

  return (
    <>
      {/* 统一光照系统 - 单光照 */}
      <directionalLight 
        position={[
          lightDirection.x * 50, 
          lightDirection.y * 50, 
          lightDirection.z * 50
        ]}
        intensity={finalIntensity}
        color={lightColor}
        castShadow={finalCastShadow}
      />
      
      <ambientLight intensity={ambientIntensity} />
      
      {/* 地球组 */}
      <group 
        position={earthInfo.position}
        name="earthRoot"
        // 🔧 关键修复：不使用rotation prop，完全通过四元数控制旋转
        // 这样可以避免与alignLongitudeOnly的四元数操作冲突
      >
        {/* 地球核心 */}
        <Earth 
          position={[0, 0, 0]}
          size={earthInfo.size}
          lightDirection={lightDirection}
          tiltDeg={0}
          yawDeg={0}
          useTextures={composition.useTextures}
          lightColor={lightColor}
          sunIntensity={lightIntensity}
          terminatorSoftness={composition.terminatorSoftness}
          nightIntensity={composition.nightIntensity}
          shininess={composition.shininess}
          specStrength={composition.specStrength}
          broadStrength={composition.broadStrength}
        />
        
        {/* 大气效果 */}
        <AtmosphereEffects
          earthSize={earthInfo.size}
          earthY={0}
          rimStrength={composition.rimStrength}
          rimWidth={composition.rimWidth}
          rimRadius={composition.rimRadius}
          haloWidth={composition.haloWidth}
          earthGlowStrength={composition.earthGlowStrength}
          earthGlowHeight={composition.earthGlowHeight}
          earthGlowDayNightRatio={composition.earthGlowDayNightRatio}
        lightDirection={lightDirection}
        />
        
        {/* 云层 */}
        {composition.useClouds && earthClouds && (
          <>
            <Clouds
              radius={earthInfo.size * (1.0 + composition.cloudHeight) * 1.0006}
              texture={earthClouds}
              position={[0, 0, 0]}
              yawDeg={composition.cloudYawDeg}
              pitchDeg={composition.cloudPitchDeg}
              lightDir={lightDirection}
        lightColor={lightColor}
              strength={composition.cloudStrength}
              sunI={lightIntensity}
              cloudGamma={composition.cloudGamma}
              cloudBlack={composition.cloudBlack}
              cloudWhite={composition.cloudWhite}
              cloudContrast={composition.cloudContrast}
            />
            
            {/* 云层叠加修正 */}
            <CloudsOverlayFix
              radius={earthInfo.size * (1.0 + composition.cloudHeight)}
              strength={0.15}
              color="#ffffff"
              position={[0, 0, 0]}
              lightDir={lightDirection}
            />
          </>
        )}
      </group>
      
      {/* 月球 */}
      <Moon
        position={moonInfo.position}
        radius={composition.moonRadius}
        lightDirection={lightDirection}
        useTextures={composition.useTextures}
        lightColor={lightColor}
        sunIntensity={lightIntensity}
        tiltDeg={0}
        yawDeg={0}
        latDeg={composition.moonLatDeg}
        lonDeg={composition.moonLonDeg}
      />
      
      {/* 星空背景 */}
      {composition.showStars && (
        composition.useMilkyWay && starsMilky ? (
          <mesh>
            <sphereGeometry args={[220, 64, 64]} />
            <meshBasicMaterial 
              map={starsMilky}
              side={THREE.BackSide}
            />
          </mesh>
        ) : (
          <Stars 
            radius={120} 
            depth={60} 
            count={600} 
            factor={0.8} 
            fade 
            speed={0} 
            saturation={0} 
          />
        )
      )}
      
      {/* 相机控制 */}
      {composition.enableControls && (
        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={50}
        />
      )}
    </>
  );
}

// 🔧 关键修复：在Canvas内部按需触发一次对齐，将指定经度旋到屏幕中心
// 只依赖tick避免重复对齐，不依赖latDeg/lonDeg避免叠加旋转
function AlignOnDemand({ tick, latDeg, lonDeg, sunWorld, useFixedSun, fixedSunDir }: { tick: number; latDeg: number; lonDeg: number; sunWorld: {x:number;y:number;z:number}; useFixedSun?: boolean; fixedSunDir?: [number,number,number] }) {
  const { scene, camera } = useThree();
  React.useEffect(() => {
    try {
      const earth = scene.getObjectByName('earthRoot');
      if (earth) {
        // 固定太阳模式：仅绕世界Y轴旋转，避免多轴联动
        if (useFixedSun) {
          const worldUp = new THREE.Vector3(0,1,0);
          // 计算 -sunWorld 与 fixedSunDir 的平面方位角（XZ平面），以Y轴为上
          const negSun = new THREE.Vector3(-sunWorld.x, -sunWorld.y, -sunWorld.z).normalize();
          const yawSun = Math.atan2(negSun.x, negSun.z); // [-pi,pi]
          const f = fixedSunDir ?? [-1,0,0];
          const fixed = new THREE.Vector3(f[0], f[1], f[2]).normalize();
          const yawFixed = Math.atan2(fixed.x, fixed.z);
          let deltaYaw = yawFixed - yawSun;
          // 规范化到 [-pi, pi]
          while (deltaYaw > Math.PI) deltaYaw -= 2*Math.PI;
          while (deltaYaw < -Math.PI) deltaYaw += 2*Math.PI;
          // 重置旋转，只施加绕Y的偏航
          (earth as THREE.Object3D).quaternion.identity();
          (earth as THREE.Object3D).rotateOnWorldAxis(worldUp, deltaYaw);
        }
        if (logger.isEnabled()) logger.log('align/trigger', { tick, lonDeg, useFixedSun: !!useFixedSun });
        alignLongitudeOnly(earth as THREE.Object3D, camera, lonDeg);
      } else {
        if (logger.isEnabled()) logger.warn('align/earthRoot-missing');
      }
    } catch (err) {
      if (logger.isEnabled()) logger.error('align/fail', String(err));
    }
  }, [tick, useFixedSun, sunWorld.x, sunWorld.y, sunWorld.z, lonDeg]);
  return null;
}

// 主测试组件
export default function SimpleTest() {
  const [composition, setComposition] = useState<SimpleComposition>(DEFAULT_SIMPLE_COMPOSITION);
  const [uiHidden, setUiHidden] = useState(false);
  // 改进的本地时间转换函数
  const toLocalInputValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  // 获取当前本地时间（考虑时区）
  const getCurrentLocalTime = () => {
    const now = new Date();
    return toLocalInputValue(now);
  };
  
  const [dateISO, setDateISO] = useState(() => getCurrentLocalTime());
  const [latDeg, setLatDeg] = useState<number>(31.2);   // 上海默认
  const [lonDeg, setLonDeg] = useState<number>(121.5);
  const [timeMode, setTimeMode] = useState<TimeInterpretation>('byLongitude');
  
  // 天文数据状态
  const [sunWorld, setSunWorld] = useState<{ x:number; y:number; z:number }>({ x: 1, y: 0, z: 0 });
  const [moonEQD, setMoonEQD] = useState<{ x:number; y:number; z:number }>({ x: 0, y: 0, z: 0 });
  const [illumination, setIllumination] = useState<number>(0.5);
  // 存储真实的太阳角度信息
  const [sunAngles, setSunAngles] = useState<{ azDeg: number; altDeg: number }>({ azDeg: 0, altDeg: 0 });
  const [mode, setMode] = useState<'debug' | 'celestial'>('celestial');
  const [alignTick, setAlignTick] = useState(0);
  
  // 新增：实时更新控制
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [debugEnabled, setDebugEnabled] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [realTimeUpdate, setRealTimeUpdate] = useState<boolean>(false);
  const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);

  // 统一调试日志开关
  React.useEffect(() => {
    logger.setEnabled(debugEnabled);
  }, [debugEnabled]);

  // 改进的光照更新函数 - 使用 useRef 避免无限循环
  const updateSunlight = React.useCallback(() => {
    try {
      if (logger.isEnabled()) logger.log('sunlight/start', { dateISO, latDeg, lonDeg, timeMode });
      
      const state = getEarthState(dateISO, latDeg, lonDeg, timeMode);
      if (logger.isEnabled()) logger.log('sunlight/ephemeris', state);
      
      const newSunWorld = { 
        x: state.sunDirWorld.x, 
        y: state.sunDirWorld.y, 
        z: state.sunDirWorld.z 
      };
      const newMoonEQD = { 
        x: state.moonDirWorld.x, 
        y: state.moonDirWorld.y, 
        z: state.moonDirWorld.z 
      };
      
      // 验证光照方向数据
      const sunMagnitude = Math.sqrt(newSunWorld.x * newSunWorld.x + newSunWorld.y * newSunWorld.y + newSunWorld.z * newSunWorld.z);
      if (logger.isEnabled()) logger.log('sunlight/magnitude', { sunMagnitude });
      
      if (sunMagnitude < 0.1) {
        if (logger.isEnabled()) logger.warn('sunlight/fallback-small-mag');
        // 使用兜底值
        setSunWorld({ x: 1, y: 0, z: 0 });
        setMoonEQD({ x: 0, y: 0, z: 0 });
        setIllumination(0.5);
        setSunAngles({ azDeg: 0, altDeg: 0 });
      } else {
        // 归一化光照方向
        const normalizedSunWorld = {
          x: newSunWorld.x / sunMagnitude,
          y: newSunWorld.y / sunMagnitude,
          z: newSunWorld.z / sunMagnitude
        };
        
        setSunWorld(normalizedSunWorld);
        setMoonEQD(newMoonEQD);
        setIllumination(state.illumination);
        setSunAngles({ azDeg: state.azDeg, altDeg: state.altDeg });
        
        if (logger.isEnabled()) logger.log('sunlight/normalized', normalizedSunWorld);
        if (logger.isEnabled()) logger.log('sunlight/angles', { az: +state.azDeg.toFixed(1), alt: +state.altDeg.toFixed(1) });
      }
      
      setLastUpdateTime(new Date().toLocaleTimeString());
      
      // 自动切换到天相模式
      if (mode === 'debug') {
        setMode('celestial');
        console.log('[Sunlight Update] Auto-switched to celestial mode');
      }
      
      // 计算并显示光照角度信息
      if (logger.isEnabled()) logger.log('sunlight/done');
      
    } catch (err) {
      if (logger.isEnabled()) logger.error('sunlight/error', String(err));
      // 使用兜底值
      setSunWorld({ x: 1, y: 0, z: 0 });
      setMoonEQD({ x: 0, y: 0, z: 0 });
      setIllumination(0.5);
      setSunAngles({ azDeg: 0, altDeg: 0 });
    }
  }, [dateISO, latDeg, lonDeg, mode, timeMode]);

  // 当日期或经纬度变化时，自动计算 sunWorld 以驱动光照
  React.useEffect(() => {
    if (autoUpdate) {
      if (logger.isEnabled()) logger.log('effect/auto-update', { dateISO, latDeg, lonDeg, autoUpdate });
      updateSunlight();
    }
  }, [dateISO, latDeg, lonDeg, autoUpdate]); // 移除 updateSunlight 依赖项避免无限循环

  // 实时时间更新逻辑 - 优化依赖项管理
  React.useEffect(() => {
    if (realTimeUpdate) {
      if (logger.isEnabled()) logger.log('realtime/start');
      // 启动实时更新
      const interval = setInterval(() => {
        const now = new Date();
        const newTime = toLocalInputValue(now);
        if (logger.isEnabled()) logger.log('realtime/tick', { newTime });
        setDateISO(newTime);
      }, 60000); // 每分钟更新一次
      
      setRealTimeInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
          setRealTimeInterval(null);
        }
      };
    } else {
      // 停止实时更新
      if (realTimeInterval) {
        if (logger.isEnabled()) logger.log('realtime/stop');
        clearInterval(realTimeInterval);
        setRealTimeInterval(null);
      }
    }
  }, [realTimeUpdate]); // 移除 realTimeInterval 依赖项避免无限循环

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
      }
    };
  }, [realTimeInterval]);

  // 手动更新光照
  const handleManualUpdate = () => {
    if (logger.isEnabled()) logger.log('manual/update');
    updateSunlight();
  };

  // 重置为当前时间
  const handleResetToCurrentTime = () => {
    if (logger.isEnabled()) logger.log('manual/reset-to-now');
    setDateISO(getCurrentLocalTime());
  };

  // 旧的测试入口已移除，改为独立自动化测试套件（见 src/astro/autoTests.ts）

  // 计算光照方向的角度信息 - 使用真实的天文角度数据
  const lightInfo = React.useMemo(() => {
    const { x, y, z } = sunWorld;
    const { azDeg, altDeg } = sunAngles;
    
    console.log('[LightInfo] Raw sunWorld:', { x, y, z });
    console.log('[LightInfo] Real sun angles from ephemeris:', { azimuth: azDeg.toFixed(1), altitude: altDeg.toFixed(1) });
    
    return {
      azimuth: azDeg.toFixed(1),
      elevation: altDeg.toFixed(1),
      intensity: Math.sqrt(x*x + y*y + z*z).toFixed(3)
    };
  }, [sunWorld, sunAngles]);

  const updateValue = (key: keyof SimpleComposition, value: number | boolean) => {
    setComposition(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="canvas-wrap">
      <Canvas
        camera={{ 
          position: [0, 0, composition.cameraDistance], 
          fov: 45 
        }}
        style={{ background: '#000011' }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: composition.exposure 
        }}
      >
        <SceneContent 
          composition={composition} 
          mode={mode}
          sunWorld={sunWorld}
          altDeg={sunAngles.altDeg}
        />
        <NoTiltProbe />
        <AlignOnDemand 
          tick={alignTick} 
          latDeg={latDeg} 
          lonDeg={lonDeg} 
          sunWorld={sunWorld}
          useFixedSun={composition.useFixedSun}
          fixedSunDir={composition.fixedSunDir}
        />
      </Canvas>
      
      {/* 控制面板 - 使用与原版本一致的样式 */}
      {uiHidden && (
        <div style={{ position:'absolute', top: 10, left: 10, zIndex: 40 }}>
          <button className="btn" onClick={()=>setUiHidden(false)}>显示 UI</button>
        </div>
      )}

      {!uiHidden && (
        <div className="panel">
          {/* 顶部控制栏 */}
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="label">构图模式</span>
              <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
                <label>
                  <input type="radio" name="mode" checked={mode === 'celestial'} onChange={() => setMode('celestial')} /> 天相模式
                </label>
                <label>
                  <input type="radio" name="mode" checked={mode === 'debug'} onChange={() => setMode('debug')} /> 调试模式
                </label>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn" onClick={() => setComposition(DEFAULT_SIMPLE_COMPOSITION)}>重置默认</button>
              <button className="btn" onClick={() => setUiHidden(true)}>隐藏 UI</button>
            </div>
          </div>

          {/* 时间同步状态指示器 */}
          <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 16, padding: '8px 12px', background: realTimeUpdate ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', border: realTimeUpdate ? '1px solid rgba(0,255,0,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div className="col">
              <span className="label" style={{ color: realTimeUpdate ? '#00ff00' : 'inherit' }}>
                {realTimeUpdate ? '🕐 实时同步中' : '⏰ 手动控制'}
              </span>
            </div>
            <div className="col">
              <span className="label">当前时间: {dateISO}</span>
            </div>
            <div className="col">
              <span className="label">位置: {latDeg.toFixed(1)}°N, {lonDeg.toFixed(1)}°E</span>
            </div>
            <div className="col">
              <span className="label">模式: {mode === 'celestial' ? '🌞 天相模式' : '🔧 调试模式'}</span>
            </div>
            <div className="col">
              <span className="label">时间解释: {timeMode === 'byLongitude' ? '按经度推时区' : '按系统时区'}</span>
            </div>
            <div className="col">
              <label>
                <input type="checkbox" checked={debugEnabled} onChange={(e)=>setDebugEnabled(e.target.checked)} /> 调试日志
              </label>
              {debugEnabled && (
                <>
                  <button className="btn" style={{marginLeft:8}} onClick={()=>{ try{ navigator.clipboard.writeText(JSON.stringify((window as any).__LuBirthLogs ?? [], null, 2)); }catch{} }}>复制日志</button>
                </>
              )}
            </div>
          </div>

          {/* 天文与构图 - 真实光照系统 */}
          <div className="row" style={{ gap: 12, alignItems: 'flex-end', marginBottom: 16 }}>
            <div className="col">
              <label className="label">日期时间(本地)</label>
              <input className="input" type="datetime-local" value={dateISO} onChange={(e)=>setDateISO(e.target.value)} />
            </div>
            <div className="col">
              <label className="label">出生地纬度(°)</label>
              <input className="input" type="number" step={0.1} value={latDeg}
                     onChange={(e)=>setLatDeg(parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">出生地经度(°E为正)</label>
              <input className="input" type="number" step={0.1} value={lonDeg}
                     onChange={(e)=>setLonDeg(parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">时间解释模式</label>
              <div className="row" style={{ gap: 8 }}>
                <label>
                  <input type="radio" name="timeMode" checked={timeMode==='byLongitude'} onChange={()=>setTimeMode('byLongitude')} /> 按经度
                </label>
                <label>
                  <input type="radio" name="timeMode" checked={timeMode==='bySystem'} onChange={()=>setTimeMode('bySystem')} /> 按系统
                </label>
              </div>
            </div>
            <div className="col">
              <button className="btn" onClick={handleManualUpdate}>手动更新光照</button>
            </div>
            <div className="col">
              <button className="btn" onClick={handleResetToCurrentTime}>重置当前时间</button>
            </div>
          </div>

          {/* 快速时间跳转 - 测试明显光照变化 */}
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <div className="col">
              <span className="label">快速测试明显光照变化：</span>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}} 
                      onClick={() => setDateISO('2024-03-21T07:00')}>春分日出</button>
            </div>
            <div className="col">  
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => setDateISO('2024-06-21T12:00')}>夏至正午</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => setDateISO('2024-09-23T18:00')}>秋分日落</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => setDateISO('2024-12-21T12:00')}>冬至正午</button>
            </div>
          </div>

          {/* 极地测试 - 验证极端纬度的日夜变化 */}
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <div className="col">
              <span className="label">极地测试 - 北极圈(66°N)：</span>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}} 
                      onClick={() => {setLatDeg(66); setLonDeg(0); setDateISO('2024-06-21T06:00');}}>夏至06:00</button>
            </div>
            <div className="col">  
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(66); setLonDeg(0); setDateISO('2024-06-21T12:00');}}>夏至正午</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(66); setLonDeg(0); setDateISO('2024-06-21T18:00');}}>夏至18:00</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(66); setLonDeg(0); setDateISO('2024-06-21T00:00');}}>夏至午夜</button>
            </div>
          </div>

          {/* 赤道测试 - 应该有明显的东西方向变化 */}
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <div className="col">
              <span className="label">赤道测试(0°N)：</span>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}} 
                      onClick={() => {setLatDeg(0); setLonDeg(0); setDateISO('2024-03-21T06:00');}}>春分06:00</button>
            </div>
            <div className="col">  
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(0); setLonDeg(0); setDateISO('2024-03-21T12:00');}}>春分正午</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(0); setLonDeg(0); setDateISO('2024-03-21T18:00');}}>春分18:00</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(0); setLonDeg(0); setDateISO('2024-03-21T00:00');}}>春分午夜</button>
            </div>
          </div>
          
          {/* 高纬度测试 - 应该有明显的日夜差异 */}
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <div className="col">
              <span className="label">北京纬度测试(40°N)：</span>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}} 
                      onClick={() => {setLatDeg(40); setLonDeg(116); setDateISO('2024-12-21T06:00');}}>冬至日出</button>
            </div>
            <div className="col">  
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(40); setLonDeg(116); setDateISO('2024-12-21T12:00');}}>冬至正午</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(40); setLonDeg(116); setDateISO('2024-12-21T18:00');}}>冬至日落</button>
            </div>
            <div className="col">
              <button className="btn" style={{padding: '4px 8px', fontSize: '12px'}}
                      onClick={() => {setLatDeg(40); setLonDeg(116); setDateISO('2024-12-21T00:00');}}>冬至午夜</button>
            </div>
          </div>

          {/* 光照状态显示 */}
          <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="col">
              <span className="label">光照方向: 方位角 {lightInfo.azimuth}° · 仰角 {lightInfo.elevation}°</span>
            </div>
            <div className="col">
              <span className="label">光照强度: {lightInfo.intensity}</span>
            </div>
            <div className="col">
              <span className="label">月面明暗: {(illumination * 100).toFixed(1)}%</span>
            </div>
            <div className="col">
              <span className="label">最后更新: {lastUpdateTime || '未更新'}</span>
            </div>
            <div className="col">
              <label>
                <input type="checkbox" checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} />
                自动更新
              </label>
            </div>
            <div className="col">
              <label>
                <input type="checkbox" checked={realTimeUpdate} onChange={(e) => setRealTimeUpdate(e.target.checked)} />
                实时时间
              </label>
            </div>
          </div>

          {/* 功能按钮行 */}
          <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div className="col">
              <button className="btn" onClick={() => {
                try {
                  const phase = getMoonPhase(dateISO, latDeg, lonDeg);
                  console.log('[MoonPhase]', phase);
                  alert(`月相明亮比例: ${phase.illumination.toFixed(2)}\n相位角: ${(phase.phaseAngleRad*180/Math.PI).toFixed(1)}°`);
                } catch (err) {
                  console.error(err);
                }
              }}>计算月相</button>
            </div>
            <div className="col">
              <button className="btn" onClick={() => setAlignTick(t=>t+1)}>对齐到当前经度（仅方位角）</button>
            </div>
            <div className="col">
              <button className="btn" onClick={() => {
                // 显示当前地球四元数状态
                const earth = document.querySelector('canvas')?.parentElement?.querySelector('[name="earthRoot"]');
                if (earth) {
                  console.log('[Debug] 当前earthRoot状态:', {
                    position: earth.getAttribute('position'),
                    quaternion: (earth as any).quaternion,
                    matrix: (earth as any).matrix,
                    matrixWorld: (earth as any).matrixWorld
                  });
                }
              }}>显示地球状态</button>
            </div>
            <div className="col">
              <button className="btn" onClick={() => {
                console.log('[Current State]', {
                  dateISO,
                  latDeg,
                  lonDeg,
                  sunWorld,
                  moonEQD,
                  illumination,
                  mode
                });
              }}>打印当前状态</button>
            </div>
            <div className="col">
              <button className="btn" onClick={() => {
                // 测试真正有明显差异的时间点 - 重点测试方位角变化
                const testTimes = [
                  '2024-03-21T07:00', // 春分日出 (东方)
                  '2024-03-21T12:00', // 春分正午 (南方)
                  '2024-03-21T18:00', // 春分日落 (西方)  
                  '2024-06-21T12:00', // 夏至正午 (高角度南方)
                  '2024-12-21T12:00'  // 冬至正午 (低角度或地平线下)
                ];
                console.log('[Test] Testing dramatically different sun positions...');
                
                let index = 0;
                const testInterval = setInterval(() => {
                  if (index >= testTimes.length) {
                    clearInterval(testInterval);
                    console.log('[Test] Dramatic sun position test completed');
                    return;
                  }
                  
                  const time = testTimes[index];
                  try {
                    console.log(`[Test] Setting time to ${time}...`);
                    setDateISO(time);
                    const state = getEarthState(time, latDeg, lonDeg, timeMode);
                    const azimuth = Math.atan2(state.sunDirWorld.z, state.sunDirWorld.x) * 180 / Math.PI;
                    const elevation = Math.asin(state.sunDirWorld.y) * 180 / Math.PI;
                    console.log(`[Test] ${time}:`, {
                      sunWorld: state.sunDirWorld,
                      azimuth: azimuth < 0 ? azimuth + 360 : azimuth,
                      elevation
                    });
                  } catch (err) {
                    console.error(`[Test] ${time} failed:`, err);
                  }
                  index++;
                }, 3000); // 每3秒切换一次
              }}>测试季节光照</button>
            </div>
            {/* 旧测试入口已移除；使用 URL 参数 ?autotest=1 触发新的自动测试 */}
          </div>

          {/* 地球位置控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">地球上沿位置 (0-1): {composition.earthTopY.toFixed(3)}</label>
              <input className="input" type="range" min={0.05} max={0.8} step={0.005}
                     value={composition.earthTopY}
                     onChange={(e) => updateValue('earthTopY', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">地球大小(占屏): {Math.round((composition.earthSize * 100))}%</label>
              <input className="input" type="range" min={0.08} max={3.0} step={0.01}
                     value={composition.earthSize}
                     onChange={(e) => updateValue('earthSize', parseFloat(e.target.value))} />
            </div>
          </div>

          {/* 地球姿态控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">地轴倾角: 0°（固定）</label>
              <input className="input" type="range" min={0} max={0} step={0.1}
                     value={0}
                     disabled />
            </div>
            <div className="col">
              <label className="label">地球经线对齐(自转角): {composition.earthYawDeg}°</label>
              <input className="input" type="range" min={-180} max={180} step={1}
                     value={composition.earthYawDeg}
                     onChange={(e) => updateValue('earthYawDeg', parseInt(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">🔧 当前真实经度: {lonDeg.toFixed(1)}°E</label>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                基于天文计算的真实位置
              </div>
            </div>
          </div>
          
          {/* 月球位置控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">月球距离: {composition.moonDistance.toFixed(1)}</label>
              <input className="input" type="range" min={3} max={20} step={0.5}
                     value={composition.moonDistance}
                     onChange={(e) => updateValue('moonDistance', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">月球半径: {composition.moonRadius.toFixed(2)}</label>
              <input className="input" type="range" min={0.1} max={1.0} step={0.01}
                     value={composition.moonRadius}
                     onChange={(e) => updateValue('moonRadius', parseFloat(e.target.value))} />
            </div>
          </div>
          
          {/* 月球姿态控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">月球纬度调整: {composition.moonLatDeg}°</label>
              <input className="input" type="range" min={-90} max={90} step={1}
                     value={composition.moonLatDeg}
                     onChange={(e) => updateValue('moonLatDeg', parseInt(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">月球经度调整: {composition.moonLonDeg}°</label>
              <input className="input" type="range" min={-180} max={180} step={1}
                     value={composition.moonLonDeg}
                     onChange={(e) => updateValue('moonLonDeg', parseInt(e.target.value))} />
            </div>
          </div>
          
          {/* 光照控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">阳光强度: {composition.sunIntensity.toFixed(2)}</label>
              <input className="input" type="range" min={0} max={6} step={0.05}
                     value={composition.sunIntensity}
                     onChange={(e) => updateValue('sunIntensity', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">色温: {composition.lightTempK}K</label>
              <input className="input" type="range" min={2000} max={10000} step={100}
                     value={composition.lightTempK}
                     onChange={(e) => updateValue('lightTempK', parseInt(e.target.value))} />
            </div>
          </div>
          
          {/* 光照方向控制 - 根据模式显示不同内容 */}
          {mode === 'debug' ? (
            // 调试模式：显示手动控制滑块
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="col">
                <label className="label">手动光照方位角: {composition.lightAzimuth}°</label>
                <input className="input" type="range" min={0} max={360} step={5}
                       value={composition.lightAzimuth}
                       onChange={(e) => updateValue('lightAzimuth', parseInt(e.target.value))} />
              </div>
              <div className="col">
                <label className="label">手动光照仰角: {composition.lightElevation}°</label>
                <input className="input" type="range" min={-90} max={90} step={5}
                       value={composition.lightElevation}
                       onChange={(e) => updateValue('lightElevation', parseInt(e.target.value))} />
              </div>
            </div>
          ) : (
            // 天相模式：显示实时计算的光照方向（只读）
            <div className="row" style={{ marginBottom: 16, padding: '12px', background: 'rgba(0,255,0,0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,0,0.2)' }}>
              <div className="col">
                <label className="label" style={{ color: '#00ff00' }}>🌞 实时光照方位角: {lightInfo.azimuth}°</label>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  基于当前时间自动计算 · 0°=北，顺时针为正
                </div>
              </div>
              <div className="col">
                <label className="label" style={{ color: '#00ff00' }}>🌞 实时光照仰角: {lightInfo.elevation}°</label>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  基于当前时间自动计算 · 正值=地平线上，负值=地平线下
                </div>
              </div>
              <div className="col">
                <label className="label" style={{ color: '#00ff00' }}>🔧 坐标约定</label>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  方位角：北=0°，东=90°，南=180°，西=270°
                </div>
              </div>
            </div>
          )}
          
          {/* 地球材质控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">镜面高光: 强度 {Math.round((composition.specStrength * 100))}% · 锐度 {composition.shininess}</label>
              <div className="row">
                <input className="input" type="range" min={0} max={300} step={1}
                       value={Math.round((composition.specStrength * 100))}
                       onChange={(e) => updateValue('specStrength', parseFloat(e.target.value) / 100)} />
                <input className="input" type="range" min={1} max={400} step={1}
                       value={composition.shininess}
                       onChange={(e) => updateValue('shininess', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="col">
              <label className="label">高光铺展: 强度 {Math.round((composition.broadStrength * 100))}%</label>
              <input className="input" type="range" min={0} max={200} step={1}
                     value={Math.round((composition.broadStrength * 100))}
                     onChange={(e) => updateValue('broadStrength', parseFloat(e.target.value) / 100)} />
            </div>
          </div>
          
          {/* 晨昏线控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">晨昏线柔和度: {composition.terminatorSoftness.toFixed(3)}</label>
              <input className="input" type="range" min={0} max={0.3} step={0.005}
                     value={composition.terminatorSoftness}
                     onChange={(e) => updateValue('terminatorSoftness', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">夜景强度: {composition.nightIntensity.toFixed(1)}</label>
              <input className="input" type="range" min={0} max={10} step={0.1}
                     value={composition.nightIntensity}
                     onChange={(e) => updateValue('nightIntensity', parseFloat(e.target.value))} />
            </div>
          </div>
          
          {/* 大气效果控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">大气弧光: 强度 {composition.rimStrength.toFixed(2)} · 宽度 {composition.rimWidth.toFixed(2)}</label>
              <div className="row">
                <input className="input" type="range" min={0} max={2} step={0.01}
                       value={composition.rimStrength}
                       onChange={(e) => updateValue('rimStrength', parseFloat(e.target.value))} />
                <input className="input" type="range" min={0} max={0.5} step={0.01}
                       value={composition.rimWidth}
                       onChange={(e) => updateValue('rimWidth', parseFloat(e.target.value))} />
              </div>
            </div>
            {/* 地球辉光控制 */}
            <div className="row" style={{ marginBottom: 20, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="col" style={{ flex: 1, marginRight: 16 }}>
                <div className="label" style={{ marginBottom: 8, fontSize: '14px', fontWeight: 500 }}>地球辉光: 强度</div>
                <input
                  type="range"
                  min={0} max={3} step={0.01}
                  value={composition.earthGlowStrength}
                  onChange={(e) => updateValue('earthGlowStrength', parseFloat(e.target.value))}
                  className="input"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{composition.earthGlowStrength.toFixed(2)}</span>
              </div>
              <div className="col" style={{ flex: 1, marginRight: 16 }}>
                <div className="label" style={{ marginBottom: 8, fontSize: '14px', fontWeight: 500 }}>高度</div>
                <input
                  type="range"
                  min={0.001} max={0.2} step={0.001}
                  value={composition.earthGlowHeight}
                  onChange={(e) => updateValue('earthGlowHeight', parseFloat(e.target.value))}
                  className="input"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{composition.earthGlowHeight.toFixed(3)}</span>
              </div>
              <div className="col" style={{ flex: 1 }}>
                <div className="label" style={{ marginBottom: 8, fontSize: '14px', fontWeight: 500 }}>日侧夜侧对比</div>
                <input
                  type="range"
                  min={0} max={1} step={0.01}
                  value={composition.earthGlowDayNightRatio}
                  onChange={(e) => updateValue('earthGlowDayNightRatio', parseFloat(e.target.value))}
                  className="input"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{composition.earthGlowDayNightRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* 地球材质控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">地球材质亮度: {composition.earthLightIntensity.toFixed(2)}</label>
              <input className="input" type="range" min={0} max={3} step={0.05}
                     value={composition.earthLightIntensity}
                     onChange={(e) => updateValue('earthLightIntensity', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">地球材质色温: {composition.earthLightTempK}K</label>
              <input className="input" type="range" min={2000} max={10000} step={100}
                     value={composition.earthLightTempK}
                     onChange={(e) => updateValue('earthLightTempK', parseInt(e.target.value))} />
            </div>
          </div>
          
          {/* 月球材质控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">月球材质亮度: {composition.moonLightIntensity.toFixed(2)}</label>
              <input className="input" type="range" min={0} max={3} step={0.05}
                     value={composition.moonLightIntensity}
                     onChange={(e) => updateValue('moonLightIntensity', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">月球材质色温: {composition.moonLightTempK}K</label>
              <input className="input" type="range" min={2000} max={10000} step={100}
                     value={composition.moonLightTempK}
                     onChange={(e) => updateValue('moonLightTempK', parseInt(e.target.value))} />
            </div>
          </div>
          
          {/* 保存和重置按钮 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <button className="btn" onClick={() => setComposition(DEFAULT_SIMPLE_COMPOSITION)}>
                重置为默认
              </button>
            </div>
            <div className="col">
              <button className="btn" onClick={() => {
                localStorage.setItem('simpleComposition', JSON.stringify(composition));
                alert('参数已保存为默认值！');
              }}>
                保存为默认
          </button>
            </div>
          </div>
          
          {/* 云层控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">云层强度: {composition.cloudStrength.toFixed(2)} · 高度: {composition.cloudHeight.toFixed(3)}</label>
              <div className="row">
                <input className="input" type="range" min={0} max={1} step={0.01}
                       value={composition.cloudStrength}
                       onChange={(e) => updateValue('cloudStrength', parseFloat(e.target.value))} />
                <input className="input" type="range" min={0.0005} max={0.03} step={0.0005}
                       value={composition.cloudHeight}
                       onChange={(e) => updateValue('cloudHeight', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="col">
              <label className="label">云层旋转: 经度 {composition.cloudYawDeg}° · 纬度 {composition.cloudPitchDeg}°</label>
              <div className="row">
                <input className="input" type="range" min={-180} max={180} step={1}
                       value={composition.cloudYawDeg}
                       onChange={(e) => updateValue('cloudYawDeg', parseInt(e.target.value))} />
                <input className="input" type="range" min={-90} max={90} step={1}
                       value={composition.cloudPitchDeg}
                       onChange={(e) => updateValue('cloudPitchDeg', parseInt(e.target.value))} />
              </div>
            </div>
          </div>
          
          {/* 云层材质控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">云层Gamma: {composition.cloudGamma.toFixed(2)} · 对比度: {composition.cloudContrast.toFixed(1)}</label>
              <div className="row">
                <input className="input" type="range" min={0.5} max={2} step={0.01}
                       value={composition.cloudGamma}
                       onChange={(e) => updateValue('cloudGamma', parseFloat(e.target.value))} />
                <input className="input" type="range" min={0.5} max={2} step={0.1}
                       value={composition.cloudContrast}
                       onChange={(e) => updateValue('cloudContrast', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="col">
              <label className="label">云层黑点: {composition.cloudBlack.toFixed(2)} · 白点: {composition.cloudWhite.toFixed(2)}</label>
              <div className="row">
                <input className="input" type="range" min={0} max={1} step={0.01}
                       value={composition.cloudBlack}
                       onChange={(e) => updateValue('cloudBlack', parseFloat(e.target.value))} />
                <input className="input" type="range" min={0} max={1} step={0.01}
                       value={composition.cloudWhite}
                       onChange={(e) => updateValue('cloudWhite', parseFloat(e.target.value))} />
              </div>
            </div>
          </div>
          
          {/* 相机和曝光控制 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">曝光: {composition.exposure.toFixed(2)}</label>
              <input className="input" type="range" min={0.2} max={3.0} step={0.05}
                     value={composition.exposure}
                     onChange={(e) => updateValue('exposure', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">相机距离: {composition.cameraDistance.toFixed(1)}</label>
              <input className="input" type="range" min={3} max={50} step={0.5}
                     value={composition.cameraDistance}
                     onChange={(e) => updateValue('cameraDistance', parseFloat(e.target.value))} />
            </div>
          </div>
          
          {/* 显示选项 */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <span className="label">显示选项</span>
              <div className="row" style={{ gap: 12, pointerEvents: 'auto' }}>
                <label>
                  <input type="checkbox" checked={composition.useTextures} onChange={(e) => updateValue('useTextures', e.target.checked)} /> 使用贴图
                </label>
                <label>
                  <input type="checkbox" checked={composition.useClouds} onChange={(e) => updateValue('useClouds', e.target.checked)} /> 显示云层
                </label>
                <label>
                  <input type="checkbox" checked={composition.showStars} onChange={(e) => updateValue('showStars', e.target.checked)} /> 显示星空
                </label>
                <label>
                  <input type="checkbox" checked={composition.useMilkyWay} onChange={(e) => updateValue('useMilkyWay', e.target.checked)} /> 银河星空
                </label>
                <label>
                  <input type="checkbox" checked={false} disabled readOnly /> 相机控制 (已禁用，保持理想构图)
                </label>
              </div>
            </div>
          </div>
      </div>
      )}

      {!uiHidden && (
        <>
          <div className="credit">视觉基调：极简·低饱和·苹果风（MVP） · 构图：地球下1/3 + 右上小月亮</div>
          <div className="caption">SimpleTest v2.1 | 地球-月球完整场景测试 | 真实光照系统 | 相机锁定保持理想构图</div>
        </>
      )}
    </div>
  );
}

// 在渲染上下文中提供一个自动化"无倾斜"检测脚本
function NoTiltProbe() {
  const { scene } = useThree();
  React.useEffect(() => {
    (window as any).runNoTiltAutoTest = async (frames: number = 120) => {
      const worldUp = new THREE.Vector3(0,1,0);
      let maxDeg = 0;
      let samples = 0;
      const getTiltDeg = () => {
        const earth = scene.getObjectByName('earthRoot') as THREE.Object3D | undefined;
        if (!earth) return null;
        const up = new THREE.Vector3(0,1,0).applyQuaternion(earth.quaternion).normalize();
        const dot = THREE.MathUtils.clamp(up.dot(worldUp), -1, 1);
        const ang = Math.acos(dot) * 180 / Math.PI; // 与世界Y的夹角
        return ang;
      };
      await new Promise<void>((resolve) => {
        let count = 0;
        const step = () => {
          const deg = getTiltDeg();
          if (deg != null) {
            maxDeg = Math.max(maxDeg, deg);
            samples++;
          }
          count++;
          if (count >= frames) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      const ok = maxDeg <= 0.5; // 容差0.5°以内视为无倾斜
      const payload = { when: new Date().toISOString(), ok, maxTiltDeg: +maxDeg.toFixed(3), samples };
      console[ok?'log':'error']('[NoTiltTest] ' + (ok?'✅ PASS':'❌ FAIL'), payload);
      console.log('[NoTiltTest:JSON]', JSON.stringify(payload, null, 2));
      return payload;
    };
  }, [scene]);
  return null;
}
