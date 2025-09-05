import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

// 改进的月球 PIP 相机系统 - 基于物理的月相显示
export function PhysicalMoonPIP({ 
  pip, 
  lightDirection, 
  lightColor,
  moonPosition,      // 月球世界坐标位置
  earthPosition      // 地球世界坐标位置（用于计算地月方向）
}: { 
  pip: NonNullable<any['pip']>;
  lightDirection: THREE.Vector3;
  lightColor: THREE.Color;
  moonPosition: [number, number, number];
  earthPosition: [number, number, number];
}) {
  const { gl, camera, scene, size } = useThree();
  const pipCam = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(30, 1, 0.1, 1000));
  const overlayGroupRef = useRef<THREE.Group>(null!);
  const lastTs = useRef<number>(0);
  const ambientRef = useRef<THREE.AmbientLight | null>(null);
  
  // 月球相关向量计算
  const moonVectors = useMemo(() => {
    const moonPos = new THREE.Vector3(...moonPosition);
    const earthPos = new THREE.Vector3(...earthPosition);
    
    // 地球到月球的方向（单位向量）
    const earthToMoon = moonPos.clone().sub(earthPos).normalize();
    
    // 太阳到月球的方向（单位向量）
    const sunToMoon = lightDirection.clone().negate().normalize();
    
    // 计算月相角（太阳-月球-地球的夹角）
    const phaseAngle = earthToMoon.angleTo(sunToMoon);
    
    // 计算月球明暗比例（0=新月，1=满月）
    const illumination = (1 + Math.cos(phaseAngle)) / 2;
    
    return {
      earthToMoon,
      sunToMoon,
      phaseAngle,
      illumination,
      moonPos
    };
  }, [moonPosition, earthPosition, lightDirection]);
  
  // 初始化 FBO 和环境光
  const rt = useMemo(() => {
    const maxAniso = (gl.capabilities as any)?.getMaxAnisotropy?.() ?? 0;
    const glctx: any = (gl as any)?.getContext?.() ?? (gl as any)?.context;
    const maxSamples = glctx?.getParameter?.(glctx.MAX_SAMPLES) || 4;
    const samples = Math.min(8, maxSamples);
    
    const fbo = gl.getRenderTarget(pip.resolution, pip.resolution, { 
      samples, 
      depthBuffer: true, 
      stencilBuffer: false 
    });
    
    // 设置纹理参数
    if (fbo.texture) {
      const isPoT = (n: number) => (n & (n - 1)) === 0;
      if (isPoT(pip.resolution)) {
        fbo.texture.generateMipmaps = true;
        fbo.texture.minFilter = THREE.LinearMipmapLinearFilter;
      } else {
        fbo.texture.generateMipmaps = false;
        fbo.texture.minFilter = THREE.LinearFilter;
      }
      fbo.texture.magFilter = THREE.LinearFilter;
      // @ts-ignore
      fbo.texture.colorSpace = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding;
      if (maxAniso > 0) fbo.texture.anisotropy = Math.min(maxAniso, 4);
      fbo.texture.needsUpdate = true;
    }
    
    return fbo;
  }, [gl, pip.resolution]);
  
  // 设置相机和环境光
  useEffect(() => {
    pipCam.current.layers.set(2);
    
    // 设置环境光（仅影响 layer 2）
    try {
      if (!ambientRef.current) {
        const amb = new THREE.AmbientLight(0xffffff, (pip as any).ambient ?? 0);
        amb.layers.set(2);
        scene.add(amb);
        ambientRef.current = amb;
      }
    } catch (e) {
      console.warn('[PhysicalMoonPIP] 环境光设置失败:', e);
    }
  }, [scene, pip.ambient]);
  
  // 更新环境光强度
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.intensity = (pip as any).ambient ?? 0;
    }
  }, [pip.ambient]);
  
  // 清理函数
  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        scene.remove(ambientRef.current);
        ambientRef.current = null;
      }
      if (rt) {
        gl.setRenderTarget(null);
        rt.dispose();
      }
    };
  }, [scene, gl, rt]);
  
  // 渲染循环
  useFrame(() => {
    const ts = performance.now();
    const interval = 1000 / pip.fps;
    
    if (ts - (lastTs.current || 0) < interval) {
      return;
    }
    lastTs.current = ts;
    
    try {
      const moon = scene.getObjectByName('moonMesh') as THREE.Mesh | undefined;
      if (!moon) return;
      
      // 🔧 关键改进：基于物理的相机位置计算
      // 1. 将月球移到原点进行渲染
      const originalPosition = moon.position.clone();
      moon.position.set(0, 0, 0);
      moon.updateMatrixWorld();
      
      // 2. 计算月球半径
      let moonRadius = 0.5;
      const geo: any = (moon as any).geometry;
      if (geo?.parameters?.radius) {
        moonRadius = geo.parameters.radius;
      }
      const scale = new THREE.Vector3();
      moon.getWorldScale(scale);
      const radiusWorld = moonRadius * Math.max(scale.x, scale.y, scale.z);
      
      // 3. 计算相机距离（使月球充满视场）
      const fov = (pipCam.current.fov * Math.PI) / 180;
      const distance = (radiusWorld / Math.tan(fov / 2)) * 1.1;
      
      // 4. 🔧 关键改进：相机从地球方向看向月球
      // 这样确保看到的月相与从地球上看到的一致
      const cameraPosition = moonVectors.earthToMoon.clone().multiplyScalar(-distance);
      pipCam.current.position.copy(cameraPosition);
      pipCam.current.lookAt(0, 0, 0);
      pipCam.current.updateMatrixWorld();
      
      // 5. 渲染到 FBO
      gl.setRenderTarget(rt);
      gl.clear();
      gl.render(scene, pipCam.current);
      gl.setRenderTarget(null);
      
      // 6. 恢复月球原始位置
      moon.position.copy(originalPosition);
      moon.updateMatrixWorld();
      
      // 7. 更新 PIP 覆盖层位置
      updateOverlayPosition();
      
      // 8. 调试信息
      if (new URLSearchParams(location.search).get('debug') === '1') {
        console.log('[PhysicalMoonPIP]', {
          phaseAngle: (moonVectors.phaseAngle * 180 / Math.PI).toFixed(1) + '°',
          illumination: moonVectors.illumination.toFixed(3),
          cameraDistance: distance.toFixed(2)
        });
      }
      
    } catch (error) {
      console.error('[PhysicalMoonPIP] 渲染错误:', error);
    }
  });
  
  // 更新覆盖层位置
  const updateOverlayPosition = () => {
    if (!overlayGroupRef.current) return;
    
    const z = -1.0;
    const fovMain = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180;
    const halfH = Math.tan(fovMain / 2) * Math.abs(z);
    const worldPerPixel = (halfH * 2) / size.height;
    const radius = (pip.size / 2) * worldPerPixel;
    
    const halfW = halfH * (size.width / size.height);
    const rNdcX = Math.min(0.95, radius / halfW + 0.02);
    const rNdcY = Math.min(0.95, radius / halfH + 0.02);
    
    const xClamped = Math.min(1 - rNdcX, Math.max(-1 + rNdcX, pip.x * 2 - 1));
    const yClamped = Math.min(1 - rNdcY, Math.max(-1 + rNdcY, 1 - pip.y * 2));
    
    const xNdc = xClamped;
    const yNdc = yClamped;
    const x = xNdc * halfW;
    const y = yNdc * halfH;
    
    const local = new THREE.Vector3(x, y, z);
    const world = (camera as THREE.PerspectiveCamera).localToWorld(local);
    
    overlayGroupRef.current.position.copy(world);
    overlayGroupRef.current.scale.set(radius, radius, 1);
    overlayGroupRef.current.quaternion.copy((camera as THREE.PerspectiveCamera).quaternion);
  };
  
  return (
    <group ref={overlayGroupRef}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          map={rt.texture} 
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// 辅助函数：计算基于真实轨道的月球位置
export function calculateOrbitalMoonPosition(
  utc: Date,
  earthPosition: [number, number, number],
  orbitalRadius: number = 3.0,
  orbitalPeriod: number = 27.32 // 天
): [number, number, number] {
  // 简化的圆形轨道计算
  const dayOfYear = (d: Date) => {
    const start = Date.UTC(d.getUTCFullYear(), 0, 1);
    return Math.floor((d.getTime() - start) / 86400000) + 1;
  };
  
  const doy = dayOfYear(utc);
  const phase = (doy % orbitalPeriod) / orbitalPeriod * 2 * Math.PI;
  
  // 月球在轨道平面上的位置
  const x = Math.cos(phase) * orbitalRadius;
  const z = Math.sin(phase) * orbitalRadius;
  
  // 添加一些倾斜角使轨道更真实
  const inclination = 5.14 * Math.PI / 180; // 月球轨道倾角
  const y = Math.sin(phase) * Math.sin(inclination) * orbitalRadius * 0.3;
  
  return [
    earthPosition[0] + x,
    earthPosition[1] + y,
    earthPosition[2] + z
  ];
}