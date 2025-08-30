import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

// Experimental dual-canvas shell. Earth/Moon content will be added incrementally.
export function DualCanvasShell() {
  const common = { dpr: [1, 2] as [number, number], style: { position: 'absolute', inset: 0 } as React.CSSProperties };
  return (
    <div style={{ position: 'relative', inset: 0, width: '100%', height: '100%' }}>
      {/* Earth layer */}
      <Canvas camera={{ position: [0,0,12], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} {...common}>
        <color attach="background" args={[0x000000]} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[8,10,8]} intensity={1.2} />
        <mesh position={[0,-1,0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color={'#406080'} />
        </mesh>
      </Canvas>
      {/* Moon layer */}
      <Canvas camera={{ position: [0,0,12], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} {...common}>
        <mesh position={[3,2,-2]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={'#bdbdbd'} />
        </mesh>
        <directionalLight position={[-8,10,8]} intensity={1.0} />
      </Canvas>
    </div>
  );
}

