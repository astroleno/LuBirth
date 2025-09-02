import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import React, { useMemo } from 'react';
import * as THREE from 'three';



type Vec3 = { x:number;y:number;z:number };
const v3 = (x:number,y:number,z:number) => new THREE.Vector3(x,y,z);

function CloudsLitSphere({ radius, texture, position, yawDeg, pitchDeg=0, lightDir, lightColor, strength, sunI, cloudGamma=1.0, cloudBlack=0.4, cloudWhite=0.85, cloudContrast=1.2 }:{ radius:number; texture:THREE.Texture; position:[number,number,number]; yawDeg:number; pitchDeg?:number; lightDir:THREE.Vector3; lightColor:THREE.Color; strength:number; sunI:number; cloudGamma?:number; cloudBlack?:number; cloudWhite?:number; cloudContrast?:number }){
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => { if (ref.current){ ref.current.rotation.y = THREE.MathUtils.degToRad(yawDeg); ref.current.rotation.x = THREE.MathUtils.degToRad(pitchDeg); } });
  const mat = React.useMemo(() => {
    const ld = (lightDir ?? new THREE.Vector3(1,0,0)).clone();
    const lc = (lightColor ?? new THREE.Color('#ffffff')).clone();
    const sm = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        lightDir: { value: ld },
        lightColor: { value: lc },
        strength: { value: strength ?? 0.5 },
        sunI: { value: sunI ?? 1.0 },
        cloudGamma: { value: cloudGamma ?? 1.0 },
        cloudBlack: { value: cloudBlack ?? 0.4 },
        cloudWhite: { value: cloudWhite ?? 0.85 },
        cloudContrast: { value: cloudContrast ?? 1.2 },
      },
    vertexShader: `
      varying vec2 vUv; varying vec3 vNormalW;
      void main(){ vUv = uv; vNormalW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform sampler2D map; uniform vec3 lightDir; uniform vec3 lightColor; uniform float strength; uniform float sunI; uniform float cloudGamma; uniform float cloudBlack; uniform float cloudWhite; uniform float cloudContrast;
      varying vec2 vUv; varying vec3 vNormalW;
      void main(){
        vec3 n = normalize(vNormalW);
        float ndl = max(dot(n, normalize(lightDir)), 0.0);
        vec3 src = texture2D(map, vUv).rgb;
        // Levels: black/white points + gamma + contrast
        float d = dot(src, vec3(0.299,0.587,0.114));
        float bw = max(0.0001, cloudWhite - cloudBlack);
        d = clamp((d - cloudBlack) / bw, 0.0, 1.0);
        d = pow(d, cloudGamma);
        d = clamp((d - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
        // Lighting weight on day side
        float dayW = smoothstep(0.0, 0.35, ndl);
        float l = pow(dayW, 0.8) * (0.7 + 0.3*sunI);
        vec3 c = pow(src, vec3(cloudGamma));
        c = clamp((c - vec3(cloudBlack)) / bw, 0.0, 1.0);
        c = clamp((c - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
        vec3 col = mix(c, vec3(1.0), 0.35) * l * lightColor;
        float a = clamp(dayW * strength * d, 0.0, 1.0);
        gl_FragColor = vec4(col, a);
      }
    `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    toneMapped: true,
    blending: THREE.NormalBlending,
  });
    return sm;
  }, [texture, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast]);
  React.useEffect(()=>{
    const ld = (lightDir ?? new THREE.Vector3(1,0,0));
    const lc = (lightColor ?? new THREE.Color('#ffffff'));
    if (mat.uniforms.lightDir?.value) (mat.uniforms.lightDir.value as THREE.Vector3).copy(ld);
    if (mat.uniforms.lightColor?.value) (mat.uniforms.lightColor.value as THREE.Color).copy(lc);
    if (mat.uniforms.strength) mat.uniforms.strength.value = strength ?? 0.5;
    if (mat.uniforms.sunI) mat.uniforms.sunI.value = sunI ?? 1.0;
    if (mat.uniforms.cloudGamma) mat.uniforms.cloudGamma.value = cloudGamma ?? 1.0;
    if (mat.uniforms.cloudBlack) mat.uniforms.cloudBlack.value = cloudBlack ?? 0.4;
    if (mat.uniforms.cloudWhite) mat.uniforms.cloudWhite.value = cloudWhite ?? 0.85;
    if (mat.uniforms.cloudContrast) mat.uniforms.cloudContrast.value = cloudContrast ?? 1.2;
  },[mat, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast]);

  return (
    <mesh ref={ref} position={position} renderOrder={10}>
      <sphereGeometry args={[radius, 96, 96]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// 轻量“加亮”版：在 NormalBlending 基础上适度前置，避免与地表过度相消
function CloudsOverlayFix({ radius, strength=0.15, color='#ffffff', position, lightDir = new THREE.Vector3(1,0,0) }:{ radius:number; strength?:number; color?:string; position:[number,number,number]; lightDir?:THREE.Vector3 }){
  const ref = React.useRef<THREE.Mesh>(null!);
  const mat = React.useMemo(()=> new THREE.ShaderMaterial({
    uniforms: { lightDir: { value: (lightDir ?? new THREE.Vector3(1,0,0)).clone() }, strength: { value: strength ?? 0.15 }, color: { value: new THREE.Color(color ?? '#ffffff') } },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 lightDir; uniform float strength; uniform vec3 color; varying vec3 vN; void main(){ float ndl = max(dot(normalize(vN), normalize(lightDir)), 0.0); float dayW = smoothstep(0.0, 0.35, ndl); float a = dayW * strength; gl_FragColor = vec4(color * a, a); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [lightDir, strength, color]);
  React.useEffect(()=>{ (mat.uniforms.lightDir.value as THREE.Vector3).copy(lightDir ?? new THREE.Vector3(1,0,0)); (mat.uniforms.strength.value as number) = strength ?? 0.15; },[ref, mat, lightDir, strength]);
  return (
    <mesh ref={ref} position={position} renderOrder={11}>
      <sphereGeometry args={[radius*1.0008, 64, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function useOptionalTexture(path?: string, enabled?: boolean) {
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  React.useEffect(() => {
    if (!enabled || !path) { setTex(null); return; }
    let canceled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      path,
      (t) => {
        if (canceled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => { if (!canceled) setTex(null); }
    );
    return () => { canceled = true; };
  }, [path, enabled]);
  return tex;
}

function useFirstAvailableTexture(paths: string[], enabled?: boolean) {
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  React.useEffect(() => {
    if (!enabled) { setTex(null); return; }
    let canceled = false;
    const loader = new THREE.TextureLoader();
    let idx = 0;
    const allPaths: string[] = [];
    for (const p of paths) {
      allPaths.push(p);
      if (p.startsWith('/')) allPaths.push(p.slice(1)); // 同时尝试相对路径
    }
    const tryNext = () => {
      if (canceled || idx >= allPaths.length) { setTex(null); return; }
      const p = allPaths[idx++];
      if (!p) { tryNext(); return; }
      loader.load(
        p,
        (t) => {
          if (canceled) return;
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.ClampToEdgeWrapping;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.anisotropy = 16;
          setTex(t);
        },
        undefined,
        () => { if (!canceled) tryNext(); }
      );
    };
    tryNext();
    return () => { canceled = true; };
  }, [enabled, JSON.stringify(paths)]);
  return tex;
}

function SceneContent({ sunEQD, moonEQD, observerEQD, moonDistance, moonRadius, comp, mode, onBaked }: {
  sunEQD: Vec3;
  moonEQD: Vec3;
  observerEQD: Vec3;
  moonDistance: number;
  moonRadius: number;
  comp?: Composition;
  mode?: 'art' | 'real';
  onBaked?: (texture: THREE.Texture) => void;
}) {
  // 月球烘焙纹理状态
  const [bakedMoonTexture, setBakedMoonTexture] = React.useState<THREE.Texture | null>(null);
  const isDebug = React.useMemo(() => new URLSearchParams(location.search).get('debug') === '1', []);
  const isSafe = React.useMemo(() => new URLSearchParams(location.search).get('safe') === '1', []);
  const isDecoupled = React.useMemo(() => new URLSearchParams(location.search).get('decoupled') === '1', []);
  
  // 调试日志：确认解耦模式检测
  React.useEffect(() => {
    console.log('[SceneContent] 解耦模式检测:', isDecoupled, 'URL:', location.search);
  }, [isDecoupled]);
  
  // 参数化：地球屏幕呈现（大小与上沿）
  const earthTopScreen = Math.min(Math.max(comp?.earthTopY ?? 0.333, 0.05), 0.95);
  // 允许占屏比例扩展到 3.0（300%）
  const earthScreenSize = Math.min(Math.max(comp?.earthSize ?? 0.33, 0.06), 3.0);
  const targetTopNdcY = earthTopScreen * 2 - 1;
  // 月球移动到“正中间的上方”：x 屏幕正中 0.5，默认 y=0.78 更靠上
  const moonScreen = { x: comp?.moonScreenX ?? 0.5, y: comp?.moonScreenY ?? 0.78, dist: moonDistance };
  // 相机距离按半径解析计算，确保大半径稳定
  const { camera, gl, scene } = useThree();
  const vfov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov);
  const t = Math.tan(vfov / 2);
  // 固定相机距离，用"占屏比例"换算地球半径：R = S * d * tan(fov/2)
  const baseCamZ = 12.0;
  const camZ = baseCamZ;
  const earthWorldR = Math.max(0.05, earthScreenSize * camZ * t);
  const glow = Math.min(Math.max(comp?.glow ?? 0.22, 0), 1);
  const earthTiltDeg = comp?.earthTiltDeg ?? 23.44;
  const earthYawDeg = comp?.earthYawDeg ?? 0;
  const moonYawDeg = comp?.moonYawDeg ?? 0;
  React.useEffect(() => {
    camera.position.set(0, 0, camZ);
    camera.lookAt(0, 0, 0);
    camera.near = 0.01;
    camera.far = Math.max(400, camZ + earthWorldR * 8);
    camera.updateProjectionMatrix();
    if (new URLSearchParams(location.search).get('debug') === '1') {
      console.log('[Camera]', { pos: camera.position.toArray(), fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : 'N/A', near: camera.near, far: camera.far, layersMask: camera.layers.mask });
    }
  }, [camera, camZ]);

  // 曝光（全局）
  React.useEffect(() => {
    const exposure = Math.min(Math.max((comp as any)?.exposure ?? 1.0, 0.2), 3.0);
    if (gl) {
      gl.toneMappingExposure = exposure;
    }
    if (isDebug) console.log('[Scene] exposure', exposure);
  }, [gl, (comp as any)?.exposure]);

  // 注意：双通道渲染暂时移除，避免将 camera.layers 置为 0 导致黑屏

  // 地球中心 y：center_ndc = top_ndc - S
  const centerNdcY = targetTopNdcY - earthScreenSize;
  const earthY = centerNdcY * camZ * t;
  const markerPos = v3(0, earthY + earthWorldR * 1.02, 0);

  if (isSafe) {
    if (isDebug) console.log('[Scene] SAFE MODE: drawing test cube');
    return (
      <group>
        {/* 移除全局DirectionalLight，使用分层光照 */}
        <mesh>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial color={'#44aa88'} />
        </mesh>
      </group>
    );
  }

  // 月亮位置（逐帧解析，不用 state，避免卡死）
  const moonPos = React.useMemo(() => {
    const ndc = new THREE.Vector3(moonScreen.x * 2 - 1, moonScreen.y * 2 - 1, 0.5);
    const p = ndc.unproject(camera);
    const dir = p.sub(camera.position).normalize();
    return camera.position.clone().add(dir.multiplyScalar(moonScreen.dist));
  }, [camera, moonScreen.x, moonScreen.y, moonScreen.dist]);

  // 可选贴图（存在则使用，不存在保持极简材质）
  const useTex = !!comp?.useTextures;
  const earthMap = useFirstAvailableTexture([
    '/textures/8k_earth_daymap.jpg',
    '/textures/2k_earth_daymap.jpg',
    '/textures/earth_day_2k.jpg.jpg'
  ], useTex);
  const earthNormal = useFirstAvailableTexture([
    '/textures/8k_earth_normal_map.jpg',
    '/textures/8k_earth_normal_map.png',
    // 如果只提供了 tif，需要用户转成 png/jpg
    '/textures/2k_earth_normal_map.jpg',
    '/textures/2k_earth_normal_map.png'
  ], useTex);
  const earthSpecular = useFirstAvailableTexture([
    '/textures/8k_earth_specular_map.jpg',
    '/textures/8k_earth_specular_map.png',
    '/textures/2k_earth_specular_map.jpg',
    '/textures/2k_earth_specular_map.png'
  ], useTex);
  const earthClouds = useFirstAvailableTexture([
    '/textures/8k_earth_clouds.jpg',
    '/textures/2k_earth_clouds.jpg'
  ], useTex && !!comp?.useClouds);
  const earthNight = useFirstAvailableTexture([
    '/textures/8k_earth_nightmap.jpg',
    '/textures/2k_earth_nightmap.jpg'
  ], useTex);
  const moonMap = useFirstAvailableTexture([
    '/textures/8k_moon.jpg',
    '/textures/2k_moon.jpg'
  ], useTex);
  const starsMilky = useFirstAvailableTexture([
    '/textures/8k_stars_milky_way.jpg',
    '/textures/2k_stars_milky_way.jpg'
  ], useTex && !!comp?.useMilkyWay);
  const bgScale = Math.min(Math.max((comp as any)?.bgScale ?? 0.5, 0.5), 2.0);
  const termEdge = Math.min(Math.max((comp as any)?.terminatorSoftness ?? 0.06, 0.0), 0.3);
  const nightFalloff = Math.min(Math.max((comp as any)?.nightFalloff ?? 1.6, 0.5), 4.0);
  const nightBoost = Math.min(Math.max((comp as any)?.nightIntensity ?? 1.0, 0.0), 3.0);
  const dayAmbient = Math.min(Math.max((comp as any)?.dayAmbient ?? 0.02, 0.0), 0.2);
  const termLift = Math.min(Math.max((comp as any)?.terminatorLift ?? 0.04, 0.0), 0.3);
  const rimRadius = Math.min(Math.max((comp as any)?.rimRadius ?? 0.002, 0.0005), 0.02); // 相对半径差
  const haloWidth = Math.min(Math.max((comp as any)?.haloWidth ?? 0.006, 0.0), 0.05);
  const earthGlowStrength = Math.min(Math.max((comp as any)?.earthGlowStrength ?? 0.12, 0.0), 5.0);
  const earthGlowHeight = Math.min(Math.max((comp as any)?.earthGlowHeight ?? 0.02, 0.001), 0.5);
  const cloudHeight = Math.min(Math.max((comp as any)?.cloudHeight ?? 0.01, 0.0005), 0.03);
  const cloudStrength = Math.min(Math.max((comp as any)?.cloudStrength ?? 0.35, 0), 1);
  const cloudYawDeg = (comp as any)?.cloudYawDeg ?? 0;
  const cloudPitchDeg = (comp as any)?.cloudPitchDeg ?? 0;
  // 色温（K）控制
  const tempK = Math.min(Math.max((comp as any)?.lightTempK ?? 5200, 2000), 10000);
  
  // 统一光照强度
  const lightIntensity = Math.min(Math.max((comp as any)?.lightIntensity ?? (comp as any)?.sunIntensity ?? 1.3, 0), 5);
  
  function kelvinToRGB(k:number){
    const t = k/100;
    let r:number,g:number,b:number;
    if (t <= 66){ r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t-10) - 305.0447927307; }
    else { r = 329.698727446 * Math.pow(t-60, -0.1332047592); g = 288.1221695283 * Math.pow(t-60, -0.0755148492); b = 255; }
    const clamp=(x:number)=>Math.max(0, Math.min(255, x));
    return new THREE.Color(clamp(r)/255, clamp(g)/255, clamp(b)/255);
  }
  const lightColor = React.useMemo(()=>kelvinToRGB(tempK),[tempK]);

  // 完全移除环境光和半球光，避免兜底光源干扰
  // const ambientI = useTex ? dayAmbient : 0.12;  // 已移除
  // const hemiI = useTex ? Math.min(0.5, dayAmbient * 2) : 0.08;  // 已移除

  // 统一光照方向计算
  const lightDir = React.useMemo(() => {
    if (mode === 'celestial') {
      // 天文模式：使用真实太阳位置
      return new THREE.Vector3(sunEQD.x, sunEQD.y, sunEQD.z).normalize();
    } else {
      // 手动模式：使用用户控制的光照方向
      const az = THREE.MathUtils.degToRad((comp as any)?.lightAzDeg ?? 180);
      const el = THREE.MathUtils.degToRad((comp as any)?.lightElDeg ?? 0);
      const x = Math.cos(el) * Math.cos(az);
      const z = Math.cos(el) * Math.sin(az);
      const y = Math.sin(el);
      return new THREE.Vector3(x, y, z).normalize();
    }
  }, [mode, sunEQD.x, sunEQD.y, sunEQD.z, (comp as any)?.lightAzDeg, (comp as any)?.lightElDeg]);

  // 月球高度贴图
  const moonDisplacementMap = useOptionalTexture('/textures/2k_moon_displacement.jpg', comp?.useTextures);
  
  // 月球烘焙材质（用于烘焙）
  const moonBakingMaterial = React.useMemo(() => {
    let material;
    try {
      if (moonMap) {
        material = new THREE.MeshStandardMaterial({
          map: moonMap,
          displacementMap: moonDisplacementMap,
          displacementScale: (comp as any)?.moonDisplacementScale ?? 0.02,
          displacementBias: (comp as any)?.moonDisplacementBias ?? 0,
          roughness: 1.0,
          metalness: 0.0,
          // 烘焙时使用月球独立光照
          envMapIntensity: 0,
          lightMapIntensity: 0,
          aoMapIntensity: 0,
          emissiveIntensity: 0
        });
        console.log('[Moon Baking Material] 创建烘焙材质');
      } else {
        material = new THREE.MeshPhongMaterial({
          color: new THREE.Color('#bdbdbd'),
          shininess: 4,
          specular: new THREE.Color('#1a1a1a'),
          emissive: new THREE.Color(0, 0, 0),
          emissiveIntensity: 0
        });
      }
      return material;
    } catch (error) {
      console.error('Error creating moon baking material:', error);
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color('#bdbdbd'),
        shininess: 4,
        specular: new THREE.Color('#1a1a1a'),
        emissive: new THREE.Color(0, 0, 0),
        emissiveIntensity: 0
      });
    }
  }, [moonMap, moonDisplacementMap, (comp as any)?.moonDisplacementScale, (comp as any)?.moonDisplacementBias]);

  // 月球展示材质（用于显示）
  const moonDisplayMaterial = React.useMemo(() => {
    let material;
    try {
      if (moonMap) {
        // 始终使用原始贴图，烘焙纹理通过遮罩层显示
        material = new THREE.MeshStandardMaterial({
          map: moonMap,
          displacementMap: moonDisplacementMap,
          displacementScale: (comp as any)?.moonDisplacementScale ?? 0.02,
          displacementBias: (comp as any)?.moonDisplacementBias ?? 0,
          roughness: 1.0,
          metalness: 0.0,
          envMapIntensity: 0,
          lightMapIntensity: 0,
          aoMapIntensity: 0,
          emissiveIntensity: 0
        });
        console.log('[Moon Display Material] 使用原始贴图');
      } else {
        // 回退到默认材质
        material = new THREE.MeshPhongMaterial({
          color: new THREE.Color('#bdbdbd'),
          shininess: 4,
          specular: new THREE.Color('#1a1a1a'),
          emissive: new THREE.Color(0, 0, 0),
          emissiveIntensity: 0
        });
        console.log('[Moon Display Material] 使用默认材质');
      }
      return material;
    } catch (error) {
      console.error('Error creating moon display material:', error);
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color('#bdbdbd'),
        shininess: 4,
        specular: new THREE.Color('#1a1a1a'),
        emissive: new THREE.Color(0, 0, 0),
        emissiveIntensity: 0
      });
    }
  }, [bakedMoonTexture, moonMap, moonDisplacementMap, (comp as any)?.moonDisplacementScale, (comp as any)?.moonDisplacementBias]);

  // Earth Day/Night 混合着色（当且仅当有日面贴图时启用）
  const earthDNMaterial = React.useMemo(() => {
    if (!earthMap) return null;
    const hasNight = !!earthNight;
    const hasSpec = !!earthSpecular;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: earthMap },
        nightMap: { value: earthNight ?? new THREE.Texture() },
        specMap: { value: earthSpecular ?? new THREE.Texture() },
        lightDir: { value: lightDir.clone() },
        lightColor: { value: lightColor.clone() },
        sunI: { value: lightIntensity },
        ambient: { value: 0 }, // 完全移除环境光，避免全局光照干扰
        nightBoost: { value: nightBoost },
        edge: { value: termEdge },
        lift: { value: termLift },
        hasNight: { value: hasNight ? 1 : 0 },
        hasSpec: { value: hasSpec ? 1 : 0 },
        specStrength: { value: Math.min(Math.max((comp as any)?.specStrength ?? 0.05, 0.0), 3.0) },
        shininess: { value: Math.min(Math.max((comp as any)?.shininess ?? 80.0, 1.0), 400.0) },
        broadStrength: { value: Math.min(Math.max((comp as any)?.broadStrength ?? 0.15, 0.0), 2.0) },
        broadShiny: { value: Math.min(Math.max((comp as any)?.broadShiny ?? 24.0, 1.0), 200.0) },
        nightGamma: { value: Math.min(Math.max((comp as any)?.nightGamma ?? 1.1, 0.5), 3.0) },
        nightFalloff: { value: Math.min(Math.max((comp as any)?.nightFalloff ?? 1.6, 0.5), 4.0) },
      },
      vertexShader: `
        varying vec2 vUv; varying vec3 vNormalW; varying vec3 vViewW;
        void main(){
          vUv = uv;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vec3 worldPos = (modelMatrix * vec4(position,1.0)).xyz;
          vViewW = normalize(cameraPosition - worldPos);
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D specMap; uniform vec3 lightDir; uniform vec3 lightColor; uniform float sunI;
        uniform float ambient; uniform float nightBoost; uniform float edge; uniform float lift; uniform float nightFalloff; 
        uniform int hasNight; uniform int hasSpec; uniform float specStrength; uniform float shininess; 
        uniform float broadStrength; uniform float broadShiny; uniform float nightGamma;
        varying vec2 vUv; varying vec3 vNormalW; varying vec3 vViewW;
        void main(){
          vec3 n = normalize(vNormalW);
          float ndl = dot(n, normalize(lightDir));
          float noise = fract(sin(dot(vUv, vec2(12.9898,78.233))) * 43758.5453);
          float ndl_d = ndl + (noise - 0.5) * edge * 0.25;
          float f = smoothstep(-edge, edge, ndl_d);
          float day = max(ndl, 0.0);
          float dayW = f;
          vec3 dayTex = texture2D(dayMap, vUv).rgb;
          vec3 dayCol = dayTex * (day * sunI + ambient) * lightColor * dayW;
          // 终止线软化 + 夜景随距离衰减
          float nightW = pow(1.0 - f, nightFalloff);
          float rim = 1.0 - smoothstep(0.0, edge*1.5, abs(ndl));
          vec3 nightCol = vec3(0.0);
          if (hasNight == 1) {
            vec3 nightTex = texture2D(nightMap, vUv).rgb;
            nightTex = pow(nightTex, vec3(nightGamma));
            nightCol = nightTex * nightW * nightBoost;
          }
          // 日侧高光（仅日面，受specMap影响）
          vec3 specCol = vec3(0.0);
          if (day > 0.0 && hasSpec == 1) {
            vec3 L = normalize(lightDir);
            vec3 V = normalize(vViewW);
            vec3 R = reflect(-L, n);
            float s1 = pow(max(dot(R, V), 0.0), shininess);
            float s2 = pow(max(dot(R, V), 0.0), broadShiny);
            float mask = texture2D(specMap, vUv).r; // 取红通道当mask
            specCol = lightColor * (s1 * specStrength + s2 * broadStrength) * mask * sunI;
          }
          // 在终止线附近做少量亮度提拉，便于手动调节“太暗”情况
          vec3 liftCol = vec3(lift) * rim;
          gl_FragColor = vec4(dayCol + nightCol + liftCol + specCol, 1.0);
        }
      `,
    });
    // 设置材质只响应layer 1（地球层）
    if (material && material.layers) {
      material.layers.set(1);
    }
    return material;
  }, [earthMap, earthNight, lightDir, lightIntensity, termEdge, nightBoost, dayAmbient, termLift, lightColor, (comp as any)?.specStrength, (comp as any)?.shininess, (comp as any)?.broadStrength, (comp as any)?.broadShiny, (comp as any)?.nightGamma, nightFalloff]);

  // 定向大气弧光（依光照方向 + Fresnel）
  const rimMaterial = React.useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        lightDir: { value: lightDir.clone() },
        strength: { value: Math.min(Math.max((comp as any)?.rimStrength ?? 0.15, 0.0), 2.0) },
        width: { value: Math.min(Math.max((comp as any)?.rimWidth ?? 0.08, 0.02), 0.3) },
        color: { value: new THREE.Color('#6ea6ff') }
      },
      vertexShader: `
        varying vec3 vNormalW; varying vec3 vViewW; varying vec3 vPosW;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vPosW = wp.xyz;
          vNormalW = normalize(mat3(modelMatrix)*normal);
          vViewW = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 lightDir; uniform float strength; uniform float width; uniform vec3 color;
        varying vec3 vNormalW; varying vec3 vViewW; varying vec3 vPosW;
        void main(){
          vec3 n = normalize(vNormalW);
          float ndl = max(dot(n, normalize(lightDir)), 0.0);
          float fres = pow(1.0 - max(dot(n, normalize(vViewW)), 0.0), 2.0);
          float rim = smoothstep(1.0 - width*2.0, 1.0 - width*0.2, ndl) * fres;
          gl_FragColor = vec4(color * rim * strength, rim * strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    // 设置材质只响应layer 1（地球层）
    if (material && material.layers) {
      material.layers.set(1);
    }
    return material;
  }, [lightDir, (comp as any)?.rimStrength, (comp as any)?.rimWidth]);

  // 地光（径向渐变）：从地表向外逐渐消失，受“高度/强度”控制
  const earthGlowMaterial = React.useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        strength: { value: earthGlowStrength },
        color: { value: new THREE.Color('#6ea6ff') },
        center: { value: new THREE.Vector3(0, earthY, 0) },
        innerR: { value: earthWorldR },
        outerR: { value: earthWorldR * (1.0 + earthGlowHeight) },
        lightDir: { value: new THREE.Vector3(lightDir.x, lightDir.y, lightDir.z) },
      },
      vertexShader: `
        varying vec3 vPosW; varying vec3 vViewW;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vPosW = wp.xyz;
          vViewW = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float strength; uniform vec3 color; uniform vec3 center; uniform float innerR; uniform float outerR; uniform vec3 lightDir;
        varying vec3 vPosW; varying vec3 vViewW;
        // 日侧边缘地光：仅在日侧边缘高亮，向外径向渐隐
        void main(){
          // 方向与边缘
          vec3 n = normalize(vPosW - center);            // 地表外法线
          float fres = pow(1.0 - max(dot(n, normalize(vViewW)), 0.0), 2.0);
          // 日侧权重：只在日侧起效，并在日侧中心逐步抑制，强调边缘
          float day = max(dot(n, normalize(lightDir)), 0.0);
          float w1 = smoothstep(0.02, 0.22, day);        // 远离夜侧
          float w2 = 1.0 - smoothstep(0.65, 0.92, day);  // 抑制正对日面的中心
          float dayEdge = clamp(w1 * w2, 0.0, 1.0);
          float limb = fres * dayEdge;

          // 径向渐隐（屏幕环带）：基于“视线到球心的最近距离”映射 annulus [innerR..outerR]
          vec3 ro = cameraPosition;
          vec3 rd = normalize(vPosW - cameraPosition);
          vec3 oc = ro - center;
          float b2 = dot(oc - rd * dot(oc, rd), oc - rd * dot(oc, rd));
          float b = sqrt(max(b2, 0.0));
          float t = clamp((b - innerR) / max(outerR - innerR, 1e-3), 0.0, 1.0);
          float radial = pow(1.0 - t, 2.4);

          float a = strength * limb * radial;
          gl_FragColor = vec4(color * a, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    // 设置材质只响应layer 1（地球层）
    if (material && material.layers) {
      material.layers.set(1);
    }
    return material;
  }, [earthGlowStrength, earthGlowHeight, earthWorldR, earthY, lightDir.x, lightDir.y, lightDir.z]);

  React.useEffect(() => {
    if (earthGlowMaterial && (earthGlowMaterial.uniforms as any)?.lightDir) {
      (earthGlowMaterial.uniforms.lightDir.value as THREE.Vector3).set(lightDir.x, lightDir.y, lightDir.z);
    }
  }, [earthGlowMaterial, lightDir.x, lightDir.y, lightDir.z]);

  React.useEffect(() => {
    if (rimMaterial) (rimMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDir);
  }, [lightDir, rimMaterial]);
  /* moved below after nightOverlayMat creation */

  const MilkySphere = React.useMemo(() => {
    if (!starsMilky) return null;
    return new THREE.ShaderMaterial({
      uniforms: { map: { value: starsMilky }, scale: { value: bgScale } },
      vertexShader: `
        varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform sampler2D map; uniform float scale; varying vec2 vUv;
        void main(){
          // 以中心为锚点缩放（避免视觉“滑动”感）并做环绕
          vec2 uv = vec2(0.5) + (vUv - vec2(0.5)) / scale;
          uv = fract(uv);
          vec3 c = texture2D(map, uv).rgb;
          gl_FragColor = vec4(c, 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, [starsMilky, bgScale]);

  // 光照方向已提前定义

  // 夜景覆盖材质（仅在提供 night map 时启用）
  const nightOverlayMat = React.useMemo(() => {
    if (!earthNight) return null;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: earthNight },
        lightDir: { value: lightDir.clone() },
        edge: { value: 0.08 },
      },
      vertexShader: `
        varying vec2 vUv; varying vec3 vNormalW;
        void main(){
          vUv = uv;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map; uniform vec3 lightDir; uniform float edge;
        varying vec2 vUv; varying vec3 vNormalW;
        void main(){
          float ndl = dot(normalize(vNormalW), normalize(lightDir));
          float a = smoothstep(0.0, edge, max(-ndl, 0.0));
          vec3 c = texture2D(map, vUv).rgb;
          gl_FragColor = vec4(c, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return mat;
  }, [earthNight]);

  // 校正法线/高光/云层色彩空间
  React.useEffect(() => {
    if (earthNormal) { earthNormal.colorSpace = THREE.NoColorSpace; earthNormal.needsUpdate = true; }
    if (earthSpecular) { earthSpecular.colorSpace = THREE.NoColorSpace; earthSpecular.needsUpdate = true; }
    if (earthClouds) { earthClouds.colorSpace = THREE.SRGBColorSpace; earthClouds.needsUpdate = true; }
  }, [earthNormal, earthSpecular]);

  React.useEffect(() => {
    if (nightOverlayMat) {
      (nightOverlayMat.uniforms.lightDir.value as THREE.Vector3).copy(lightDir);
    }
    if (earthDNMaterial) {
      (earthDNMaterial.uniforms.lightDir.value as THREE.Vector3).copy(lightDir);
      earthDNMaterial.uniforms.sunI.value = lightIntensity;
      earthDNMaterial.uniforms.lightColor.value.copy(lightColor);
    }
  }, [lightDir, nightOverlayMat, earthDNMaterial, lightIntensity, lightColor]);

  return (
    <group>
      
      {/* 统一光照系统 */}
      <directionalLight
        position={[lightDir.x*50, lightDir.y*50, lightDir.z*50]}
        intensity={lightIntensity}
        color={lightColor}
      />
      
      {/* 显式添加强度为0的环境光来覆盖任何默认光照 */}
      <ambientLight intensity={0} />
      
      {/* 移除全局环境光，避免跨层耦合；环境补光在地球材质内实现 */}
      {/* 完全移除半球光，避免全局光照干扰 */}
      {/* 环境补光通过材质内的ambient参数实现 */}

      {/* Earth */}
      {/* Earth group (tilt + yaw) */}
      <group position={[0, earthY, 0]} rotation={[THREE.MathUtils.degToRad(earthTiltDeg), 0, THREE.MathUtils.degToRad(earthYawDeg)]}>
      {/* Earth core */}
      <mesh>
        <sphereGeometry args={[earthWorldR, 144, 144]} />
        {earthDNMaterial ? (
          <primitive object={earthDNMaterial} attach="material" />
        ) : (
          <meshPhongMaterial 
            color={new THREE.Color('#9fb3c8')} 
            shininess={6} 
            specular={new THREE.Color('#2a2a2a')}
            ref={(m) => { if (m && m.layers) m.layers.set(1); }}
          />
        )}
      </mesh>
      {/* Atmosphere rim (directional, shader-based) */}
      <mesh ref={(m)=>{ if (m) m.layers.set(1); }}>
        <sphereGeometry args={[earthWorldR*(1.0 + rimRadius), 96, 96]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>
      {/* Soft halo near-surface */}
      {haloWidth > 0 && (
        <mesh ref={(m)=>{ if (m) m.layers.set(1); }}>
          <sphereGeometry args={[earthWorldR*(1.0 + Math.max(rimRadius*1.2, haloWidth)), 64, 64]} />
          <meshBasicMaterial 
            color={new THREE.Color('#6ea6ff')} 
            transparent 
            opacity={0.04} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
            ref={(m) => { if (m && m.layers) m.layers.set(1); }}
          />
        </mesh>
      )}
      {/* Earth glow (radial falloff) */}
      {earthGlowStrength > 0 && earthGlowHeight > 0 && (
        <mesh ref={(m)=>{ if (m) m.layers.set(1); }}>
          <sphereGeometry args={[earthWorldR*(1.0 + earthGlowHeight), 72, 72]} />
          <primitive object={earthGlowMaterial} attach="material" />
        </mesh>
      )}

      {/* Clouds layer (optional, lit by sun, with yaw control) */}
      {earthClouds && (
        <CloudsLitSphere
          radius={earthWorldR*(1.0 + cloudHeight)*1.0006}
          texture={earthClouds}
          position={[0, 0, 0]}
          yawDeg={cloudYawDeg}
          pitchDeg={cloudPitchDeg}
          lightDir={lightDir}
          lightColor={lightColor}
          strength={cloudStrength}
          sunI={lightIntensity}
          cloudGamma={(comp as any)?.cloudGamma ?? 1.15}
          cloudBlack={(comp as any)?.cloudBlack ?? 0.40}
          cloudWhite={(comp as any)?.cloudWhite ?? 0.85}
          cloudContrast={(comp as any)?.cloudContrast ?? 1.20}
        />
      )}
      {/* 叠加修正层已移除，避免亮度被冲淡 */}

      {/* Night lights overlay (fallback when无日面图) */}
      {!earthDNMaterial && nightOverlayMat && (
        <mesh>
          <sphereGeometry args={[earthWorldR*1.002, 128, 128]} />
          <primitive object={nightOverlayMat} attach="material" />
        </mesh>
      )}
      </group>

      {/* Location marker (subtle dark dot) */}
      <mesh position={markerPos} ref={(m)=>{ if (m) m.layers.set(1); }}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color('#0d0d0d')} 
          emissive={new THREE.Color('#151515')} 
          emissiveIntensity={0.6}
          ref={(m) => { if (m && m.layers) m.layers.set(1); }}
        />
      </mesh>

      {/* Moon */}
      <mesh position={moonPos.toArray()} ref={(m)=>{ 
        if (m) { 
          const lock = !!(comp as any)?.tideLock; 
          if (lock) { 
            m.lookAt(0, earthY, 0); 
          } 
          // 重置旋转
          m.rotation.set(0, 0, 0);
          
          // 应用月球经纬度调整（贴图对齐）
          const moonLatDeg = (comp as any)?.moonLatDeg ?? 0;
          const moonLonDeg = (comp as any)?.moonLonDeg ?? 0;
          
          // 先应用经纬度调整（纬度绕X轴，经度绕Y轴）
          m.rotateX(THREE.MathUtils.degToRad(moonLatDeg));
          m.rotateY(THREE.MathUtils.degToRad(moonLonDeg));
          
          // 再应用原有的微调
          m.rotateY(THREE.MathUtils.degToRad(moonYawDeg));
          m.rotateX(THREE.MathUtils.degToRad((comp as any)?.moonPitchDeg ?? 0));
        } 
      }}>
        <sphereGeometry args={[moonRadius, 64, 64]} />
        <primitive object={moonDisplayMaterial} attach="material" />
      </mesh>

      {/* Stars */}
      {starsMilky && MilkySphere ? (
        <mesh>
          <sphereGeometry args={[220, 64, 64]} />
          <primitive object={MilkySphere} attach="material" />
        </mesh>
      ) : (
        <group>
          <Stars radius={120} depth={60} count={600} factor={0.8} fade speed={0} saturation={0} />
        </group>
      )}
      

      

      

      

    </group>
  );
}

export type Composition = {
  earthTopY?: number;     // 屏幕比例 [0..1]，地球顶部位置（默认 0.333）
  earthSize?: number;     // 屏幕比例 [0..1]，地球占屏高度（直径/屏高，默认 0.33）
  moonScreenX?: number;   // 屏幕比例 x [0..1]，0.5 为居中
  moonScreenY?: number;   // 屏幕比例 y [0..1]，越大越靠上
  moonDist?: number;      // 月亮距离（从相机出发）
  moonRadius?: number;    // 月亮半径（世界单位）
  useTextures?: boolean;  // 是否启用贴图
  glow?: number;          // 光晕强度 [0..1]
  useClouds?: boolean;    // 是否显示云层
  useMilkyWay?: boolean;  // 是否使用银河星空
  earthTiltDeg?: number;  // 地轴倾角（视觉），默认 23.44
  earthYawDeg?: number;   // 地球自转角（对齐贴图经线）
  moonYawDeg?: number;    // 月球自转角微调（潮汐锁定偏移）
  moonPitchDeg?: number;  // 月球俯仰微调
  moonLatDeg?: number;    // 月球纬度调整（贴图对齐）
  moonLonDeg?: number;    // 月球经度调整（贴图对齐）
  bgScale?: number;       // 银河经度缩放
  terminatorSoftness?: number; // 晨昏线柔和度
  nightIntensity?: number;     // 夜景强度
  dayAmbient?: number;         // 日侧环境补光
  terminatorLift?: number;     // 晨昏线亮度补偿
  rimStrength?: number;        // 弧光强度
  rimWidth?: number;           // 弧光宽度
  rimRadius?: number;          // 弧光贴合半径差
  haloWidth?: number;          // 近表面halo宽度
  tideLock?: boolean;          // 月球潮汐锁定
  // 统一光照控制
  lightAzDeg?: number;         // 光源方位角 [0-360°]
  lightElDeg?: number;         // 光源仰角 [-90°到90°]
  lightIntensity?: number;     // 光照强度 [0-5]
  lightTempK?: number;         // 色温（K）
  shininess?: number;          // Spark 高光锐度
  specStrength?: number;       // Spark 高光强度
  broadStrength?: number;      // Broad 高光强度
  broadShiny?: number;         // Broad 高光锐度
  nightGamma?: number;         // 夜景伽马
  sunIntensity?: number;       // 太阳强度（兼容性）
  nightFalloff?: number;       // 夜景随终止线距离衰减
  cloudPitchDeg?: number;      // 云层纬度旋转
  exposure?: number;           // 全局曝光（toneMappingExposure）
  cloudGamma?: number;         // 云层Gamma（>1收敛灰度）
  cloudBlack?: number;         // 云层黑场（Levels 黑点）
  cloudWhite?: number;         // 云层白场（Levels 白点）
  cloudContrast?: number;      // 云层对比度
  cloudHeight?: number;        // 云层高度
  cloudStrength?: number;      // 云层强度
  cloudYawDeg?: number;        // 云层经度旋转
  cloudPitchDeg?: number;      // 云层纬度旋转
  // 地球辉光参数
  earthGlowStrength?: number;  // 地球辉光强度
  earthGlowHeight?: number;    // 地球辉光高度
  // 月球高度贴图参数
  moonDisplacementScale?: number; // 月球高度贴图强度
  moonDisplacementBias?: number;  // 月球高度贴图偏移
};

// 内部组件，用于访问useThree
function MoonWrapperWithPosition({ 
  bakedTexture, 
  moonRadius, 
  moonBakingEnabled, 
  moonOverlayEnabled,
  moonScreen, 
  moonDistance,
  moonMap
}: {
  bakedTexture: THREE.Texture | null;
  moonRadius: number;
  moonBakingEnabled: boolean;
  moonOverlayEnabled: boolean;
  moonScreen: { x: number; y: number; dist: number };
  moonDistance: number;
  moonMap: THREE.Texture | null;
}) {
  const { camera } = useThree();
  
  // 计算月球世界位置，用于包裹球定位 - 使用与月球本体完全相同的方法
  const moonPosition = React.useMemo(() => {
    // 使用与SceneContent中完全相同的计算逻辑
    const ndc = new THREE.Vector3(moonScreen.x * 2 - 1, moonScreen.y * 2 - 1, 0.5);
    const p = ndc.unproject(camera);
    const dir = p.sub(camera.position).normalize();
    const moonPos = camera.position.clone().add(dir.multiplyScalar(moonScreen.dist));
    
    console.log('[Scene] 月球位置计算:', {
      screen: { x: moonScreen.x, y: moonScreen.y },
      moonPos: moonPos.toArray(),
      distance: moonScreen.dist
    });
    
    // 包裹球应该与月球完全重合，不需要偏移
    return moonPos;
  }, [camera, moonScreen.x, moonScreen.y, moonScreen.dist]);

  // 包裹球显示条件：烘焙启用 + 显示开关启用
  const shouldShow = moonBakingEnabled && moonOverlayEnabled;

  return (
    <MoonWrapper
      bakedTexture={bakedTexture}
      moonPosition={moonPosition}
      moonRadius={moonRadius}
      enabled={shouldShow}
      // 正常模式：使用烘焙纹理
      debugMode={false}
      originalMoonTexture={null}
    />
  );
}

export function EarthMoonScene(props: {
  sunEQD: Vec3;
  moonEQD: Vec3;
  observerEQD: Vec3;
  composition?: Composition;
  mode?: 'debug' | 'celestial';
}) {
  const { sunEQD, moonEQD, observerEQD } = props;
  const comp = props.composition ?? {};
  const moonDistance = comp.moonDist ?? 14;
  const moonRadius = comp.moonRadius ?? 0.44;
  const mode = props.mode ?? 'celestial';



  // 计算月球屏幕位置
  const moonScreen = { x: comp?.moonScreenX ?? 0.5, y: comp?.moonScreenY ?? 0.78, dist: moonDistance };

  // 检测是否为解耦模式
  const isDecoupled = React.useMemo(() => new URLSearchParams(location.search).get('decoupled') === '1', []);
  
  const isSafe = React.useMemo(() => new URLSearchParams(location.search).get('safe') === '1', []);
  if (isSafe) {
    console.log('[EarthMoonScene] SAFE MODE canvas');
    return (
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={[0x101010]} />
        <ambientLight intensity={0.4} />
        {/* 移除全局DirectionalLight，使用分层光照 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color={'#44aa88'} />
        </mesh>
      </Canvas>
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 35 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        dpr={[1, 2]}
      >
        {/* 移除调试日志，避免频繁输出 */}
        <color attach="background" args={[0x000000]} />

        {/* 临时禁用双轨渲染以排除冲突 */}
        {/* <DualChannelRenderer
          enabled={!!comp.dualChannelEnabled}
          moonRenderTargetSize={comp.moonRenderTargetSize ?? 512}
          moonCacheEnabled={comp.moonCacheEnabled ?? true}
        > */}
          <SceneContent
            sunEQD={sunEQD}
            moonEQD={moonEQD}
            observerEQD={observerEQD}
            moonDistance={moonDistance}
            moonRadius={moonRadius}
            comp={comp}
            mode={mode}
          />
        {/* </DualChannelRenderer> */}



        <OrbitControls enabled={false} />
      </Canvas>
      

    </>
  );
}
