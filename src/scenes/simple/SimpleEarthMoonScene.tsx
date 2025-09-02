import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SimpleComposition } from '../../types/SimpleComposition';
import { Earth } from './components/Earth';
import { Moon } from './components/Moon';
import { Clouds } from './components/Clouds';
import { CloudsOverlayFix } from './components/Clouds';
import { AtmosphereEffects } from './components/AtmosphereEffects';
import { useLightDirection, useLightColor, useLightIntensity, useAmbientIntensity } from './utils/lightingUtils';
import { useCameraControl, useEarthPosition, useMoonPosition, useExposureControl } from './utils/positionUtils';
import { useTextureLoader } from './utils/textureLoader';

// 场景内容组件
function SceneContent({ 
  composition, 
  mode, 
  sunEQD, 
  moonEQD, 
  observerEQD 
}: { 
  composition: SimpleComposition;
  mode: 'debug' | 'celestial';
  sunEQD: { x: number; y: number; z: number };
  moonEQD: { x: number; y: number; z: number };
  observerEQD: { x: number; y: number; z: number };
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
  useEffect(() => {
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[SimpleEarthMoonScene] Scene initialized:', {
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
              yawDeg={0}
              pitchDeg={0}
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

// 主场景组件
export function SimpleEarthMoonScene({ 
  composition, 
  mode = 'debug',
  sunEQD = { x: 1, y: 0, z: 0 },
  moonEQD = { x: 0, y: 0, z: 0 },
  observerEQD = { x: 0, y: 0, z: 0 }
}: {
  composition: SimpleComposition;
  mode?: 'debug' | 'celestial';
  sunEQD?: { x: number; y: number; z: number };
  moonEQD?: { x: number; y: number; z: number };
  observerEQD?: { x: number; y: number; z: number };
}) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
          moonEQD={moonEQD}
          observerEQD={observerEQD}
        />
      </Canvas>
      
      {/* 调试信息显示 */}
      {new URLSearchParams(location.search).get('debug') === '1' && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '10px',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          <div>SimpleEarthMoonScene v1.0</div>
          <div>Mode: {mode}</div>
          <div>Light Direction: [{lightDirection?.x.toFixed(2)}, {lightDirection?.y.toFixed(2)}, {lightDirection?.z.toFixed(2)}]</div>
          <div>Earth Size: {composition.earthSize}</div>
          <div>Moon Distance: {composition.moonDistance}</div>
        </div>
      )}
    </div>
  );
}
