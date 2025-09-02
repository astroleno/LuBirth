import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simplified Composition interface for testing
export interface SimpleComposition {
  earthSize: number;        // Earth size (0.5-3.0)
  earthY: number;          // Earth Y position (-2 to 2)
  moonX: number;           // Moon X position (-5 to 5)
  moonY: number;           // Moon Y position (-3 to 3)
  moonDistance: number;    // Moon distance from camera (8-20)
  moonRadius: number;      // Moon radius (0.2-1.0)
  lightIntensity: number;  // Directional light intensity (0.5-3.0)
  lightAzimuth: number;    // Light azimuth in degrees (0-360)
  lightElevation: number;  // Light elevation in degrees (-45 to 45)
  useStars: boolean;       // Enable star background
  enableControls: boolean; // Enable orbit controls
}

// Default composition settings
const DEFAULT_COMPOSITION: SimpleComposition = {
  earthSize: 1.5,
  earthY: -0.5,
  moonX: 2.5,
  moonY: 1.2,
  moonDistance: 12,
  moonRadius: 0.35,
  lightIntensity: 1.8,
  lightAzimuth: 135,
  lightElevation: 25,
  useStars: true,
  enableControls: true,
};

// Simple Earth component with basic material
function SimpleEarth({ 
  radius, 
  position, 
  lightDirection, 
  lightColor, 
  lightIntensity 
}: {
  radius: number;
  position: [number, number, number];
  lightDirection: THREE.Vector3;
  lightColor: THREE.Color;
  lightIntensity: number;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Basic earth material with day/night simulation
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        lightDir: { value: lightDirection.clone() },
        lightColor: { value: lightColor.clone() },
        lightIntensity: { value: lightIntensity },
        dayColor: { value: new THREE.Color('#4a90e2') },
        nightColor: { value: new THREE.Color('#0f1419') },
        atmosphereColor: { value: new THREE.Color('#87ceeb') }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 lightDir;
        uniform vec3 lightColor;
        uniform float lightIntensity;
        uniform vec3 dayColor;
        uniform vec3 nightColor;
        uniform vec3 atmosphereColor;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 normal = normalize(vNormal);
          float lightDot = dot(normal, normalize(lightDir));
          
          // Day/night transition
          float dayFactor = smoothstep(-0.1, 0.1, lightDot);
          vec3 baseColor = mix(nightColor, dayColor, dayFactor);
          
          // Basic lighting
          float diffuse = max(lightDot, 0.1); // Minimum ambient
          vec3 color = baseColor * diffuse * lightColor * lightIntensity;
          
          // Simple atmosphere effect
          float fresnel = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
          vec3 atmosphere = atmosphereColor * fresnel * 0.3;
          
          gl_FragColor = vec4(color + atmosphere, 1.0);
        }
      `
    });
  }, [lightDirection, lightColor, lightIntensity]);

  // Update uniforms when props change
  React.useEffect(() => {
    if (earthMaterial.uniforms) {
      earthMaterial.uniforms.lightDir.value.copy(lightDirection);
      earthMaterial.uniforms.lightColor.value.copy(lightColor);
      earthMaterial.uniforms.lightIntensity.value = lightIntensity;
    }
  }, [earthMaterial, lightDirection, lightColor, lightIntensity]);

  // Simple rotation animation
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={earthRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={earthMaterial} />
    </mesh>
  );
}

// Simple Moon component with basic material
function SimpleMoon({ 
  radius, 
  position, 
  lightDirection, 
  lightColor, 
  lightIntensity 
}: {
  radius: number;
  position: [number, number, number];
  lightDirection: THREE.Vector3;
  lightColor: THREE.Color;
  lightIntensity: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhongMaterial 
        color="#c0c0c0" 
        shininess={4}
        specular="#404040"
      />
    </mesh>
  );
}

// Scene content component
function SceneContent({ composition }: { composition: SimpleComposition }) {
  const { camera } = useThree();
  
  // Calculate light direction from azimuth and elevation
  const lightDirection = useMemo(() => {
    const azRad = THREE.MathUtils.degToRad(composition.lightAzimuth);
    const elRad = THREE.MathUtils.degToRad(composition.lightElevation);
    
    const x = Math.cos(elRad) * Math.cos(azRad);
    const z = Math.cos(elRad) * Math.sin(azRad);
    const y = Math.sin(elRad);
    
    return new THREE.Vector3(x, y, z).normalize();
  }, [composition.lightAzimuth, composition.lightElevation]);

  const lightColor = useMemo(() => new THREE.Color('#ffffff'), []);

  // Set camera position
  React.useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <group>
      {/* Lighting */}
      <directionalLight 
        position={[lightDirection.x * 20, lightDirection.y * 20, lightDirection.z * 20]}
        intensity={composition.lightIntensity}
        color={lightColor}
      />
      <ambientLight intensity={0.1} />

      {/* Earth */}
      <SimpleEarth
        radius={composition.earthSize}
        position={[0, composition.earthY, 0]}
        lightDirection={lightDirection}
        lightColor={lightColor}
        lightIntensity={composition.lightIntensity}
      />

      {/* Moon */}
      <SimpleMoon
        radius={composition.moonRadius}
        position={[composition.moonX, composition.moonY, -composition.moonDistance]}
        lightDirection={lightDirection}
        lightColor={lightColor}
        lightIntensity={composition.lightIntensity}
      />

      {/* Stars background */}
      {composition.useStars && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      )}

      {/* Camera controls */}
      {composition.enableControls && (
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
      )}
    </group>
  );
}

// Control panel component
function ControlPanel({ 
  composition, 
  onChange 
}: { 
  composition: SimpleComposition; 
  onChange: (comp: SimpleComposition) => void;
}) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1000,
        }}
      >
        Show Controls
      </button>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>Simple Earth-Moon Test</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {/* Earth controls */}
        <label>
          Earth Size: {composition.earthSize.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={composition.earthSize}
            onChange={(e) => onChange({ ...composition, earthSize: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        <label>
          Earth Y: {composition.earthY.toFixed(1)}
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={composition.earthY}
            onChange={(e) => onChange({ ...composition, earthY: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        {/* Moon controls */}
        <label>
          Moon X: {composition.moonX.toFixed(1)}
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={composition.moonX}
            onChange={(e) => onChange({ ...composition, moonX: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        <label>
          Moon Y: {composition.moonY.toFixed(1)}
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={composition.moonY}
            onChange={(e) => onChange({ ...composition, moonY: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        <label>
          Moon Distance: {composition.moonDistance.toFixed(1)}
          <input
            type="range"
            min={8}
            max={20}
            step={0.5}
            value={composition.moonDistance}
            onChange={(e) => onChange({ ...composition, moonDistance: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        <label>
          Moon Radius: {composition.moonRadius.toFixed(2)}
          <input
            type="range"
            min={0.2}
            max={1.0}
            step={0.05}
            value={composition.moonRadius}
            onChange={(e) => onChange({ ...composition, moonRadius: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        {/* Light controls */}
        <label>
          Light Intensity: {composition.lightIntensity.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={composition.lightIntensity}
            onChange={(e) => onChange({ ...composition, lightIntensity: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
        
        <label>
          Light Azimuth: {composition.lightAzimuth}°
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            value={composition.lightAzimuth}
            onChange={(e) => onChange({ ...composition, lightAzimuth: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>
      </div>
      
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={composition.useStars}
            onChange={(e) => onChange({ ...composition, useStars: e.target.checked })}
          />
          Stars
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={composition.enableControls}
            onChange={(e) => onChange({ ...composition, enableControls: e.target.checked })}
          />
          Controls
        </label>
      </div>
      
      <button
        onClick={() => onChange(DEFAULT_COMPOSITION)}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '6px',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset to Default
      </button>
    </div>
  );
}

// Main SimpleTest component
export default function SimpleTest() {
  const [composition, setComposition] = React.useState<SimpleComposition>(DEFAULT_COMPOSITION);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0 
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000011']} />
        <SceneContent composition={composition} />
      </Canvas>
      
      <ControlPanel 
        composition={composition} 
        onChange={setComposition}
      />
      
      {/* Info panel */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '11px',
        maxWidth: '200px',
      }}>
        <div>Simple Earth-Moon Scene Test</div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          • Drag to orbit camera<br/>
          • Scroll to zoom<br/>
          • Use controls to adjust scene
        </div>
      </div>
    </div>
  );
}

// Usage example component with presets
export function SimpleTestWithPresets() {
  const [currentPreset, setCurrentPreset] = React.useState(0);
  
  const presets: SimpleComposition[] = [
    DEFAULT_COMPOSITION,
    {
      ...DEFAULT_COMPOSITION,
      earthSize: 2.2,
      earthY: -0.8,
      moonX: 1.8,
      moonY: 1.8,
      lightAzimuth: 180,
      lightElevation: 30,
    },
    {
      ...DEFAULT_COMPOSITION,
      earthSize: 1.0,
      earthY: 0,
      moonX: -3.0,
      moonY: 0.5,
      moonDistance: 15,
      lightAzimuth: 90,
      lightElevation: 10,
    }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0 
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000011']} />
        <SceneContent composition={presets[currentPreset]} />
      </Canvas>
      
      {/* Preset selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
      }}>
        <div style={{ marginBottom: '8px' }}>Presets:</div>
        {presets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPreset(index)}
            style={{
              margin: '2px',
              padding: '4px 8px',
              background: currentPreset === index ? '#4a90e2' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}