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
import { getEarthState } from './scenes/simple/api/earthState';
import { createShotRig } from './scenes/simple/api/shotRig';
import { getMoonPhase } from './scenes/simple/api/moonPhase';

// 场景内容组件
function SceneContent({ 
  composition, 
  mode, 
  sunWorld 
}: { 
  composition: SimpleComposition;
  mode: 'debug' | 'celestial';
  sunWorld: { x: number; y: number; z: number };
}) {
  const { camera } = useThree();
  
  // 光照系统 - 单光照，与日期时间计算耦合
  const lightDirection = useLightDirection(mode, sunWorld, composition);
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
  
  // 调试信息
  React.useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleTest] Scene initialized:', {
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
    }
  }, [mode, lightDirection, lightColor, lightIntensity, earthInfo, moonInfo, composition]);

  // 光照方向变化监听
  React.useEffect(() => {
    console.log('[SceneContent] Light direction updated:', {
      direction: lightDirection.toArray(),
      position: [lightDirection.x * 50, lightDirection.y * 50, lightDirection.z * 50],
      mode,
      timestamp: new Date().toLocaleTimeString()
    });
  }, [lightDirection, mode]);

  return (
    <>
      {/* 统一光照系统 - 单光照 */}
      <directionalLight 
        position={[
          lightDirection.x * 50, 
          lightDirection.y * 50, 
          lightDirection.z * 50
        ]}
        intensity={lightIntensity}
        color={lightColor}
        castShadow
      />
      
      <ambientLight intensity={ambientIntensity} />
      
      {/* 地球组 */}
      <group 
        position={earthInfo.position}
        rotation={[
          THREE.MathUtils.degToRad(composition.earthTiltDeg), 
          0, 
          THREE.MathUtils.degToRad(composition.earthYawDeg)
        ]}
        name="earthRoot"
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

// 在Canvas内部按需触发一次对齐，将指定经纬旋到屏幕上沿并居中
function AlignOnDemand({ tick }: { tick: number }) {
  const { scene, camera } = useThree();
  React.useEffect(() => {
    try {
      const earth = scene.getObjectByName('earthRoot');
      if (earth) {
        const { alignToLatLon } = createShotRig();
        alignToLatLon(earth as THREE.Object3D, camera, { targetLatDeg: 80, targetLonDeg: 180 });
      }
    } catch (err) {
      console.error('[AlignOnDemand] failed:', err);
    }
  }, [tick, scene, camera]);
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
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [realTimeUpdate, setRealTimeUpdate] = useState<boolean>(false);
  const [realTimeInterval, setRealTimeInterval] = useState<number | null>(null);

  // 改进的光照更新函数 - 使用 useRef 避免无限循环
  const updateSunlight = React.useCallback(() => {
    try {
      console.log('[Sunlight Update] Starting update for:', { dateISO, latDeg, lonDeg });
      
      const state = getEarthState(dateISO, latDeg, lonDeg);
      console.log('[Sunlight Update] Raw ephemeris result:', state);
      
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
      console.log('[Sunlight Update] Sun direction magnitude:', sunMagnitude);
      
      if (sunMagnitude < 0.1) {
        console.warn('[Sunlight Update] Warning: Sun direction magnitude too small, using fallback');
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
        
        console.log('[Sunlight Update] Normalized sun direction:', normalizedSunWorld);
        console.log('[Sunlight Update] Real sun angles:', { az: state.azDeg.toFixed(1), alt: state.altDeg.toFixed(1) });
        console.log('[Sunlight Update] Setting sunAngles state:', { azDeg: state.azDeg, altDeg: state.altDeg });
      }
      
      setLastUpdateTime(new Date().toLocaleTimeString());
      
      // 自动切换到天相模式
      if (mode === 'debug') {
        setMode('celestial');
        console.log('[Sunlight Update] Auto-switched to celestial mode');
      }
      
      // 计算并显示光照角度信息
      console.log('[Sunlight Update] Light direction info calculated');
      
    } catch (err) {
      console.error('[Sunlight Update] failed:', err);
      // 使用兜底值
      setSunWorld({ x: 1, y: 0, z: 0 });
      setMoonEQD({ x: 0, y: 0, z: 0 });
      setIllumination(0.5);
      setSunAngles({ azDeg: 0, altDeg: 0 });
    }
  }, [dateISO, latDeg, lonDeg, mode]);

  // 当日期或经纬度变化时，自动计算 sunWorld 以驱动光照
  React.useEffect(() => {
    if (autoUpdate) {
      console.log('[Effect] Auto-updating sunlight due to change in:', { dateISO, latDeg, lonDeg, autoUpdate });
      updateSunlight();
    }
  }, [dateISO, latDeg, lonDeg, autoUpdate]); // 移除 updateSunlight 依赖项避免无限循环

  // 实时时间更新逻辑 - 优化依赖项管理
  React.useEffect(() => {
    if (realTimeUpdate) {
      console.log('[Effect] Starting real-time updates');
      // 启动实时更新
      const interval = setInterval(() => {
        const now = new Date();
        const newTime = toLocalInputValue(now);
        console.log('[RealTime] Updating time to:', newTime);
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
        console.log('[RealTime] Stopping real-time updates');
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
    console.log('[Manual] Manual update triggered');
    updateSunlight();
  };

  // 重置为当前时间
  const handleResetToCurrentTime = () => {
    console.log('[Reset] Resetting to current time');
    setDateISO(getCurrentLocalTime());
  };

  // 物理一致性测试
  const consistencyTest = () => {
    console.log('[Consistency Test] Starting physical consistency validation...');
    
    const testCases = [
      // 春分日测试 - 同一时刻全球太阳方向应该一致
      { name: '春分赤道正午', time: '2024-03-20T12:00', lat: 0, lon: 0 },
      { name: '春分北半球正午', time: '2024-03-20T12:00', lat: 45, lon: 0 },
      { name: '春分南半球正午', time: '2024-03-20T12:00', lat: -45, lon: 0 },
      
      // 夏至极圈测试 - 北极圈夏至应该有午夜太阳
      { name: '北极圈夏至午夜', time: '2024-06-21T00:00', lat: 66.55, lon: 0 },
      { name: '北极圈夏至正午', time: '2024-06-21T12:00', lat: 66.55, lon: 0 },
      
      // 经度测试 - 同一纬度不同经度的日夜循环
      { name: '赤道0°E午夜', time: '2024-03-20T00:00', lat: 0, lon: 0 },
      { name: '赤道180°E午夜', time: '2024-03-20T00:00', lat: 0, lon: 180 },
    ];
    
    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        console.log(`[Consistency Test] ${index + 1}/${testCases.length}: Testing ${testCase.name}...`);
        
        try {
          const state = getEarthState(testCase.time, testCase.lat, testCase.lon);
          const sunElevation = Math.asin(state.sunDirWorld.y) * 180 / Math.PI;
          const sunAzimuth = Math.atan2(state.sunDirWorld.x, state.sunDirWorld.z) * 180 / Math.PI;
          const azimuthNorm = sunAzimuth < 0 ? sunAzimuth + 360 : sunAzimuth;
          
          // 物理一致性检查
          const issues = [];
          
          // 检查极端仰角
          if (Math.abs(sunElevation) > 90.1) {
            issues.push(`异常仰角: ${sunElevation.toFixed(1)}° (应在-90°到+90°之间)`);
          }
          
          // 检查春分日极端情况
          if (testCase.time.includes('2024-03-20') && testCase.lat === 0) {
            if (testCase.time.includes('T12:00') && sunElevation < 85) {
              issues.push(`春分赤道正午仰角过低: ${sunElevation.toFixed(1)}° (应接近90°)`);
            }
            if (testCase.time.includes('T00:00') && Math.abs(sunElevation) > 30) {
              issues.push(`春分赤道午夜仰角异常: ${sunElevation.toFixed(1)}° (应接近0°)`);
            }
          }
          
          // 检查北极圈夏至午夜太阳
          if (testCase.time.includes('2024-06-21T00:00') && testCase.lat >= 66) {
            if (sunElevation < 0) {
              issues.push(`北极圈夏至午夜太阳在地平线下: ${sunElevation.toFixed(1)}° (应为正值)`);
            }
          }
          
          console.log(`[Consistency Test] ${testCase.name}:`, {
            elevation: sunElevation.toFixed(1) + '°',
            azimuth: azimuthNorm.toFixed(1) + '°',
            sunDir: [state.sunDirWorld.x.toFixed(3), state.sunDirWorld.y.toFixed(3), state.sunDirWorld.z.toFixed(3)],
            issues: issues.length > 0 ? issues : '✓ 物理合理'
          });
          
          // 最后一个测试用例时设置到界面
          if (index === testCases.length - 1) {
            setLatDeg(testCase.lat);
            setLonDeg(testCase.lon);
            setDateISO(testCase.time);
          }
          
        } catch (err) {
          console.error(`[Consistency Test] ${testCase.name} 失败:`, err);
        }
      }, index * 1000); // 每秒一个测试
    });
    
    setTimeout(() => {
      console.log('[Consistency Test] 物理一致性测试完成，请查看控制台结果');
    }, testCases.length * 1000 + 500);
  };

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
        />
        <AlignOnDemand tick={alignTick} />
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
              <button className="btn" onClick={() => setAlignTick(t=>t+1)}>对齐出生点到 80°N, 180°E 并居中</button>
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
                    const state = getEarthState(time, latDeg, lonDeg);
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
            <div className="col">
              <button className="btn" onClick={() => {
                console.log('[Extreme Test] Setting extreme sunWorld positions...');
                // 测试极端光照位置以验证视觉变化
                const positions = [
                  { x: 1, y: 0, z: 0, name: '东方' },   // 东方
                  { x: 0, y: 1, z: 0, name: '正上方' }, // 正上方
                  { x: -1, y: 0, z: 0, name: '西方' },  // 西方
                  { x: 0, y: -1, z: 0, name: '正下方' } // 正下方
                ];
                
                let index = 0;
                const testInterval = setInterval(() => {
                  if (index >= positions.length) {
                    clearInterval(testInterval);
                    console.log('[Extreme Test] Test completed');
                    return;
                  }
                  
                  const pos = positions[index];
                  console.log(`[Extreme Test] Setting sunWorld to ${pos.name}:`, pos);
                  setSunWorld({ x: pos.x, y: pos.y, z: pos.z });
                  setMode('celestial'); // 确保在天相模式
                  index++;
                }, 2000); // 每2秒切换一次
              }}>极端光照测试</button>
            </div>
            <div className="col">
              <button className="btn" onClick={consistencyTest}>物理一致性测试</button>
            </div>
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
              <label className="label">地轴倾角: {composition.earthTiltDeg.toFixed(2)}°</label>
              <input className="input" type="range" min={-45} max={45} step={0.1}
                     value={composition.earthTiltDeg}
                     onChange={(e) => updateValue('earthTiltDeg', parseFloat(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">地球经线对齐(自转角): {composition.earthYawDeg}°</label>
              <input className="input" type="range" min={-180} max={180} step={1}
                     value={composition.earthYawDeg}
                     onChange={(e) => updateValue('earthYawDeg', parseInt(e.target.value))} />
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
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>基于当前时间自动计算</div>
              </div>
              <div className="col">
                <label className="label" style={{ color: '#00ff00' }}>🌞 实时光照仰角: {lightInfo.elevation}°</label>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>基于当前时间自动计算</div>
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