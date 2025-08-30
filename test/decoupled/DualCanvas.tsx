import React from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { EarthMoonScene, type Composition } from '@/scene/Scene';

export type DecoupledProps = {
  sunEQD: { x:number;y:number;z:number };
  moonEQD: { x:number;y:number;z:number };
  observerEQD: { x:number;y:number;z:number };
  composition?: Composition;
};

function MoonPhase({ sunEQD, moonEQD, radius }:{ sunEQD:THREE.Vector3; moonEQD:THREE.Vector3; radius:number }){
  const lightDir = React.useMemo(()=> new THREE.Vector3(sunEQD.x, sunEQD.y, sunEQD.z).normalize(), [sunEQD.x, sunEQD.y, sunEQD.z]);
  const mat = React.useMemo(()=> new THREE.ShaderMaterial({
    uniforms: { lightDir: { value: lightDir.clone() } },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 lightDir; varying vec3 vN; void main(){ float ndl = max(dot(normalize(vN), normalize(lightDir)), 0.0); vec3 albedo = vec3(0.78); vec3 col = albedo * (0.15 + 0.85*ndl); gl_FragColor = vec4(col, 1.0); }`,
  }), [lightDir]);
  React.useEffect(()=>{ (mat.uniforms.lightDir.value as THREE.Vector3).copy(lightDir); },[mat, lightDir]);
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function MoonCanvas({ sunEQD, moonEQD, comp }:{ sunEQD:{x:number;y:number;z:number}, moonEQD:{x:number;y:number;z:number}, comp:Composition }){
  const radius = comp.moonRadius ?? 0.44;
  // 将月亮放到与主相机一致的位置（屏幕坐标），这里用屏幕居中上方的默认方案进行验证
  return (
    <MoonPhase sunEQD={new THREE.Vector3(sunEQD.x,sunEQD.y,sunEQD.z)} moonEQD={new THREE.Vector3(moonEQD.x,moonEQD.y,moonEQD.z)} radius={radius} />
  );
}

// Experimental dual-canvas shell: lower canvas renders Earth (existing scene), upper canvas renders a simplified Moon with its own lighting
export function DualCanvasShell(props: DecoupledProps) {
  const common = { dpr: [1, 2] as [number, number], style: { position: 'absolute', inset: 0 } as React.CSSProperties };
  const comp = props.composition ?? {};
  return (
    <div style={{ position: 'relative', inset: 0, width: '100%', height: '100%' }}>
      {/* Earth layer (reuse existing scene; later we can add an Earth-only flag) */}
      <Canvas camera={{ position: [0,0,12], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} {...common}>
        <color attach="background" args={[0x000000]} />
        <EarthMoonScene sunEQD={props.sunEQD} moonEQD={props.moonEQD} observerEQD={props.observerEQD} composition={comp} mode={'real'} />
      </Canvas>
      {/* Moon layer (decoupled lighting/camera) */}
      <Canvas camera={{ position: [0,0,12], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} {...common}>
        <MoonCanvas sunEQD={props.sunEQD} moonEQD={props.moonEQD} comp={comp} />
        <directionalLight position={[props.sunEQD.x*50, props.sunEQD.y*50, props.sunEQD.z*50]} intensity={1.0} />
      </Canvas>
    </div>
  );
}
