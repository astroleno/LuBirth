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

// 场景内容组件
function SceneContent({ 
  composition, 
  mode, 
  sunEQD 
}: { 
  composition: SimpleComposition;
  mode: 'debug' | 'celestial';
  sunEQD: { x: number; y: number; z: number };
}) {
  const { camera } = useThree();
  
  // 光照系统 - 单光照，与日期时间计算耦合
  const lightDirection = useLightDirection(mode, sunEQD, composition);
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

// 主测试组件
export default function SimpleTest() {
  const [composition, setComposition] = useState<SimpleComposition>(DEFAULT_SIMPLE_COMPOSITION);
  const [uiHidden, setUiHidden] = useState(false);
  
  // 模拟天文数据
  const sunEQD = { x: 1, y: 0, z: 0 };
  const [mode, setMode] = useState<'debug' | 'celestial'>('debug');

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
          sunEQD={sunEQD}
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
              <label className="label">光照方位角: {composition.lightAzimuth}°</label>
              <input className="input" type="range" min={0} max={360} step={5}
                     value={composition.lightAzimuth}
                     onChange={(e) => updateValue('lightAzimuth', parseInt(e.target.value))} />
            </div>
          </div>
          
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="col">
              <label className="label">光照仰角: {composition.lightElevation}°</label>
              <input className="input" type="range" min={-90} max={90} step={5}
                     value={composition.lightElevation}
                     onChange={(e) => updateValue('lightElevation', parseInt(e.target.value))} />
            </div>
            <div className="col">
              <label className="label">色温: {composition.lightTempK}K</label>
              <input className="input" type="range" min={2000} max={10000} step={100}
                     value={composition.lightTempK}
                     onChange={(e) => updateValue('lightTempK', parseInt(e.target.value))} />
            </div>
          </div>
          
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
            <div className="col">
              <label className="label">地球辉光: 强度 {composition.earthGlowStrength.toFixed(2)} · 高度 {composition.earthGlowHeight.toFixed(3)}</label>
              <div className="row">
                <input className="input" type="range" min={0} max={1} step={0.01}
                       value={composition.earthGlowStrength}
                       onChange={(e) => updateValue('earthGlowStrength', parseFloat(e.target.value))} />
                <input className="input" type="range" min={0.001} max={0.1} step={0.001}
                       value={composition.earthGlowHeight}
                       onChange={(e) => updateValue('earthGlowHeight', parseFloat(e.target.value))} />
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
          <div className="caption">SimpleTest v2.0 | 地球-月球完整场景测试 | 单光照系统 | 相机锁定保持理想构图</div>
        </>
      )}
    </div>
  );
}