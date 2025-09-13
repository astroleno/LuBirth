import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 性能监控工具
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private memoryUsage: number[] = [];
  
  update() {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
      
      // 记录内存使用（如果可用）
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        this.memoryUsage.push(memory.usedJSHeapSize / 1024 / 1024); // MB
        if (this.memoryUsage.length > 60) this.memoryUsage.shift(); // 保留最近60秒
      }
      
      // 每10秒输出一次性能报告 - 已关闭
      // if (this.frameCount === 0 && this.memoryUsage.length > 0) {
      //   const avgMemory = this.memoryUsage.reduce((a, b) => a + b, 0) / this.memoryUsage.length;
      //   console.log(`[Clouds Performance] FPS: ${this.fps}, Memory: ${avgMemory.toFixed(1)}MB`);
      // }
    }
  }
  
  getStats() {
    const avgMemory = this.memoryUsage.length > 0 
      ? this.memoryUsage.reduce((a, b) => a + b, 0) / this.memoryUsage.length 
      : 0;
    return { fps: this.fps, avgMemory };
  }
}

const perfMonitor = new PerformanceMonitor();

// 控制台调试命令
if (typeof window !== 'undefined') {
  (window as any).cloudLayersDebug = {
    // 获取性能统计
    getPerformance: () => {
      const stats = perfMonitor.getStats();
      console.log(`[Clouds Debug] FPS: ${stats.fps}, Memory: ${stats.avgMemory.toFixed(1)}MB`);
      return stats;
    },
    
    // 测试不同层数
    testLayers: (layers: number) => {
      console.log(`[Clouds Debug] 测试 ${layers} 层云系统`);
      // 这里可以通过全局状态更新层数
      return `建议测试 ${layers} 层云系统`;
    },
    
    // 性能基准测试
    benchmark: () => {
      console.log('[Clouds Debug] 开始性能基准测试...');
      const startTime = performance.now();
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      setTimeout(() => {
        const endTime = performance.now();
        const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
        const stats = perfMonitor.getStats();
        
        console.log(`[Clouds Benchmark] 测试完成:`);
        console.log(`- 运行时间: ${(endTime - startTime).toFixed(0)}ms`);
        console.log(`- 平均FPS: ${stats.fps}`);
        console.log(`- 内存使用: ${stats.avgMemory.toFixed(1)}MB`);
        console.log(`- 内存变化: ${((endMemory - startMemory) / 1024 / 1024).toFixed(1)}MB`);
        
        // 性能评估
        if (stats.fps >= 45) {
          console.log('✅ 性能达标: FPS >= 45');
        } else {
          console.log('⚠️ 性能警告: FPS < 45');
        }
        
        if (stats.avgMemory < 200) {
          console.log('✅ 内存使用正常: < 200MB');
        } else {
          console.log('⚠️ 内存使用较高: >= 200MB');
        }
      }, 10000); // 10秒测试
    },
    
    // 近距离观察优化测试
    testCloseView: () => {
      console.log('[Clouds Debug] 近距离观察优化说明:');
      console.log('- 当相机距离 < 8 时，自动启用近距离优化');
      console.log('- 层间距减少到 30%');
      console.log('- 置换强度差异最小化');
      console.log('- UV滚动保持同步');
      console.log('- 建议将相机距离调整到 5-8 之间测试效果');
    },
    
    // 参数建议
    getRecommendations: () => {
      console.log('[Clouds Debug] Z轴叠加优化说明:');
      console.log('问题分析: 之前多层云层在XY平面上产生位移，导致拉伸变形');
      console.log('解决方案: 真正的Z轴（径向）叠加，避免XY平面错位');
      console.log('');
      console.log('近距离观察 (相机距离 < 8):');
      console.log('- 层间距: 0.0005 * 0.3 = 0.00015 (减少视觉分离)');
      console.log('- 置换强度: 所有层相同 (避免XY平面位移)');
      console.log('- UV滚动: 完全同步 (避免层间错位)');
      console.log('- 强度递减: 2% (轻微差异)');
      console.log('');
      console.log('远距离观察 (相机距离 >= 8):');
      console.log('- 层间距: 0.0005 (正常间距)');
      console.log('- 置换强度: 最小化差异 5% (保持Z轴叠加)');
      console.log('- UV滚动: 完全同步 (避免拉伸)');
      console.log('- 强度递减: 3% (轻微差异)');
    },
    
    // 快速清晰度调整
    adjustClarity: (level: 'low' | 'medium' | 'high') => {
      console.log(`[Clouds Debug] 调整云层清晰度为: ${level}`);
      const settings = {
        low: {
          strength: 0.8,
          gamma: 0.5,
          black: 0.0,
          white: 0.95,
          contrast: 1.2,
          displacementScale: 0.05
        },
        medium: {
          strength: 1.0,
          gamma: 0.6,
          black: 0.05,
          white: 0.92,
          contrast: 1.5,
          displacementScale: 0.06
        },
        high: {
          strength: 1.2,
          gamma: 0.7,
          black: 0.1,
          white: 0.9,
          contrast: 1.8,
          displacementScale: 0.08
        }
      };
      
      const config = settings[level];
      console.log('建议的云层参数:');
      console.log(`- 云层强度: ${config.strength}`);
      console.log(`- 云层Gamma: ${config.gamma}`);
      console.log(`- 云层黑点: ${config.black}`);
      console.log(`- 云层白点: ${config.white}`);
      console.log(`- 云层对比度: ${config.contrast}`);
      console.log(`- 置换强度: ${config.displacementScale}`);
      console.log('请在UI中手动调整这些参数');
    },
    
    // Z轴叠加测试
    testZAxisLayering: () => {
      console.log('[Clouds Debug] Z轴叠加测试说明:');
      console.log('✅ 正确的Z轴叠加效果:');
      console.log('- 云层只在径向（Z轴）上叠加不同高度');
      console.log('- 所有层使用相同的UV坐标和置换参数');
      console.log('- 没有XY平面上的位移或拉伸');
      console.log('- 云层看起来像真正的体积云');
      console.log('');
      console.log('❌ 错误的XY平面位移效果:');
      console.log('- 云层在XY平面上产生错位');
      console.log('- 出现拉伸、变形、不自然的条纹');
      console.log('- 层间UV滚动速度不同导致视觉冲突');
      console.log('- 置换强度差异过大导致变形');
      console.log('');
      console.log('测试方法:');
      console.log('1. 将相机距离调整到 5-8 之间');
      console.log('2. 观察云层是否只在径向叠加');
      console.log('3. 检查是否有XY平面上的拉伸变形');
      console.log('4. 运行 cloudLayersDebug.getPerformance() 监控性能');
    }
  };
}

// 云层组件 - 支持Triplanar采样
export function Clouds({ 
  radius, 
  texture, 
  position, 
  yawDeg = 0, 
  pitchDeg = 0, 
  lightDir, 
  lightColor, 
  strength = 0.5, 
  sunI = 1.0, 
  cloudGamma = 1.0, 
  cloudBlack = 0.4, 
  cloudWhite = 0.85, 
  cloudContrast = 1.2,
  // 置换贴图参数
  displacementScale = 0.05,
  displacementBias = 0.02,
  // UV滚动速度参数
  scrollSpeedU = 0.0003,
  scrollSpeedV = 0.00015,
  // Triplanar采样参数
  useTriplanar = false,
  triplanarScale = 0.1,
  // 体积散射参数
  useVolumeScattering = false,
  volumeDensity = 0.3,
  scatteringStrength = 0.5,
  scatteringG = 0.3,
  rimEffect = 0.3,
  densityEnhancement = 1.5,
  scatteringColor = [1.0, 0.95, 0.9],
  noiseScale = 1.0,
  noiseStrength = 0.8,
  
  // 厚度映射参数
  useThicknessMapping = false,
  thicknessScale = 1.0,
  thicknessBias = 0.0,
  thicknessPower = 1.0,
  
  // 自身阴影参数
  useSelfShadow = false,
  selfShadowStrength = 0.5,
  selfShadowSteps = 8,
  selfShadowDistance = 0.02,
  
  // 混合参数
  blendMode = "alpha",
  opacity = 1.0,
  // UV更新回调
  onUvUpdate
}: {
  radius: number;
  texture: THREE.Texture | null;
  position: [number, number, number];
  yawDeg?: number;
  pitchDeg?: number;
  lightDir?: THREE.Vector3;
  lightColor?: THREE.Color;
  strength?: number;
  sunI?: number;
  cloudGamma?: number;
  cloudBlack?: number;
  cloudWhite?: number;
  cloudContrast?: number;
  // 置换贴图参数
  displacementScale?: number;
  displacementBias?: number;
  // UV滚动速度参数
  scrollSpeedU?: number;
  scrollSpeedV?: number;
  // Triplanar采样参数
  useTriplanar?: boolean;
  triplanarScale?: number;
  // 体积散射参数
  useVolumeScattering?: boolean;
  volumeDensity?: number;
  scatteringStrength?: number;
  scatteringG?: number;
  rimEffect?: number;
  densityEnhancement?: number;
  scatteringColor?: [number, number, number];
  noiseScale?: number;
  noiseStrength?: number;
  
  // 厚度映射参数
  useThicknessMapping?: boolean;
  thicknessScale?: number;
  thicknessBias?: number;
  thicknessPower?: number;
  
  // 自身阴影参数
  useSelfShadow?: boolean;
  selfShadowStrength?: number;
  selfShadowSteps?: number;
  selfShadowDistance?: number;
  
  // 混合参数
  blendMode?: "additive" | "alpha" | "multiply";
  opacity?: number;
  // UV更新回调
  onUvUpdate?: (offset: THREE.Vector2) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const tAccum = useRef({ u: 0, v: 0 });
  
  // 云层材质
  const cloudMaterial = useMemo(() => {
    if (!texture) return null;
    try {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          lightDir: { value: (lightDir ?? new THREE.Vector3(1,0,0)).clone() },
          lightColor: { value: (lightColor ?? new THREE.Color('#ffffff')).clone() },
          strength: { value: strength ?? 0.5 },
          sunI: { value: sunI ?? 1.0 },
          cloudGamma: { value: cloudGamma ?? 1.0 },
          cloudBlack: { value: cloudBlack ?? 0.4 },
          cloudWhite: { value: cloudWhite ?? 0.85 },
          cloudContrast: { value: cloudContrast ?? 1.2 },
          uvOffset: { value: new THREE.Vector2(0, 0) },
          polarSlowdown: { value: 0.85 },
          // 置换贴图参数
          displacementMap: { value: texture }, // 使用同一张云层贴图
          displacementScale: { value: displacementScale ?? 0.05 },
          displacementBias: { value: displacementBias ?? 0.02 },
          // Triplanar参数
          useTriplanar: { value: useTriplanar ?? false },
          triplanarScale: { value: triplanarScale ?? 0.1 },
          // 体积散射参数
          useVolumeScattering: { value: useVolumeScattering ?? false },
          volumeDensity: { value: volumeDensity ?? 0.3 },
          scatteringStrength: { value: scatteringStrength ?? 0.5 },
          scatteringG: { value: scatteringG ?? 0.3 },
          rimEffect: { value: rimEffect ?? 0.3 },
          densityEnhancement: { value: densityEnhancement ?? 1.5 },
          scatteringColor: { value: new THREE.Vector3(...(scatteringColor ?? [1.0, 0.95, 0.9])) },
          noiseScale: { value: noiseScale ?? 1.0 },
          noiseStrength: { value: noiseStrength ?? 0.8 },
          
          // 厚度映射参数
          useThicknessMapping: { value: useThicknessMapping ?? false },
          thicknessScale: { value: thicknessScale ?? 1.0 },
          thicknessBias: { value: thicknessBias ?? 0.0 },
          thicknessPower: { value: thicknessPower ?? 1.0 },
          
          // 自身阴影参数
          useSelfShadow: { value: useSelfShadow ?? false },
          selfShadowStrength: { value: selfShadowStrength ?? 0.5 },
          selfShadowSteps: { value: selfShadowSteps ?? 8 },
          selfShadowDistance: { value: selfShadowDistance ?? 0.02 },
          
          // 混合参数
          opacity: { value: opacity ?? 1.0 }
        },
        vertexShader: `
          uniform sampler2D displacementMap;
          uniform float displacementScale;
          uniform float displacementBias;
          uniform vec2 uvOffset;
          varying vec2 vUv; 
          varying vec3 vNormalW;
          varying vec3 vPosition;
          varying vec3 vViewPosition;
          void main(){ 
            vUv = uv; 
            
            // 置换计算使用原始UV，避免跟随滚动导致抖动
            float displacement = texture2D(displacementMap, vUv).r;
            displacement = displacement * displacementScale + displacementBias;
            
            // 应用置换
            vec3 displaced = position + normal * displacement;
            
            vNormalW = normalize(mat3(modelMatrix) * normal); 
            vPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            vViewPosition = mvPosition.xyz;
            
            gl_Position = projectionMatrix * mvPosition; 
          }
        `,
        fragmentShader: `
          uniform sampler2D map;
          uniform vec3 lightDir; 
          uniform vec3 lightColor; 
          uniform float strength; 
          uniform float sunI;
          uniform float cloudGamma;
          uniform float cloudBlack;
          uniform float cloudWhite;
          uniform float cloudContrast;
          uniform vec2 uvOffset;
          uniform float polarSlowdown;
          uniform bool useTriplanar;
          uniform float triplanarScale;
          uniform bool useVolumeScattering;
          uniform float volumeDensity;
          uniform float scatteringStrength;
          uniform float scatteringG;
          uniform float rimEffect;
          uniform float densityEnhancement;
          uniform vec3 scatteringColor;
          uniform float noiseScale;
          uniform float noiseStrength;
          
          uniform bool useThicknessMapping;
          uniform float thicknessScale;
          uniform float thicknessBias;
          uniform float thicknessPower;
          
          uniform bool useSelfShadow;
          uniform float selfShadowStrength;
          uniform int selfShadowSteps;
          uniform float selfShadowDistance;
          
          uniform float opacity;
          varying vec2 vUv; 
          varying vec3 vNormalW;
          varying vec3 vPosition;
          varying vec3 vViewPosition;
          
          // Triplanar采样函数
          vec3 triplanarSample(sampler2D tex, vec3 worldPos, vec3 normal) {
            vec3 blend = abs(normal);
            blend = normalize(max(blend, 0.00001));
            float b = blend.x + blend.y + blend.z;
            blend /= vec3(b, b, b);
            
            vec3 triplanarUV = worldPos * triplanarScale;
            
            vec4 texX = texture2D(tex, triplanarUV.yz);
            vec4 texY = texture2D(tex, triplanarUV.xz);
            vec4 texZ = texture2D(tex, triplanarUV.xy);
            
            return texX.rgb * blend.x + texY.rgb * blend.y + texZ.rgb * blend.z;
          }
          
          // Henyey-Greenstein相位函数
          float henyeyGreenstein(float cosTheta, float g) {
            return (1.0 - g * g) / (4.0 * 3.14159 * pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5));
          }
          
          // 蓝噪声抖动
          float blueNoise(vec2 uv) {
            return fract(sin(dot(uv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          // 体积散射计算（增强版）
          vec3 calculateVolumeScattering(vec3 color, vec3 lightDir, vec3 normal, float density) {
            if (!useVolumeScattering) return color;
            
            // 计算光照方向与法线的夹角
            float cosTheta = dot(normal, normalize(lightDir));
            
            // 使用Henyey-Greenstein相位函数
            float phase = henyeyGreenstein(cosTheta, scatteringG);
            
            // 增强散射强度：基础强度 + 密度增强
            float baseScattering = phase * scatteringStrength;
            float densityEnhancementFactor = pow(density, 0.5) * densityEnhancement;
            float scattering = baseScattering * densityEnhancementFactor;
            
            // 添加边缘增强效果
            float rimEffectFactor = 1.0 - abs(cosTheta);
            scattering += rimEffectFactor * rimEffect * density;
            
            // 散射颜色混合 - 使用可配置的散射颜色
            vec3 scatteredColor = mix(color, scatteringColor, scattering);
            
            return scatteredColor;
          }
          
          // 体积密度采样（增强版）
          float sampleVolumeDensity(vec2 uv, float depth) {
            // 基于深度的密度变化 - 增强对比度
            float density = 1.0 - smoothstep(0.0, 0.8, depth); // 调整阈值让更多区域有密度
            
            // 添加蓝噪声变化 - 使用可配置的噪声参数
            float noise = blueNoise(uv * noiseScale);
            density *= (0.6 + noiseStrength * noise); // 使用可配置的噪声强度
            
            // 添加多层噪声
            float noise2 = blueNoise(uv * noiseScale * 2.0 + 0.5);
            density *= (0.7 + noiseStrength * 0.6 * noise2);
            
            // 应用体积密度参数
            density *= volumeDensity;
            
            // 确保最小密度
            density = max(density, 0.1);
            
            return density;
          }
          
          // 厚度映射函数 - 基于置换贴图计算厚度（增强版）
          float calculateThicknessMapping(vec2 uv, float depth) {
            if (!useThicknessMapping) return 1.0;
            
            // 使用置换贴图作为厚度基础
            float displacement = texture2D(map, uv).r;
            
            // 增强厚度映射：让亮的地方明显更厚
            float thickness = pow(displacement, thicknessPower) * thicknessScale + thicknessBias;
            
            // 大幅增强厚度范围：0.2-5.0倍
            thickness = clamp(thickness, 0.2, 5.0);
            
            // 添加对比度增强：让厚薄差异更明显
            thickness = pow(thickness, 0.7); // 增强对比度
            
            return thickness;
          }
          
          // 云层自身阴影计算函数
          float calculateSelfShadow(vec2 uv, vec3 lightDir, vec3 normal) {
            if (!useSelfShadow) return 1.0;
            
            // 计算光照方向在UV空间的投影
            vec3 lightDirNormalized = normalize(lightDir);
            vec2 lightDirUV = lightDirNormalized.xz * selfShadowDistance;
            
            // 步进采样计算阴影
            float shadow = 1.0;
            float stepSize = 1.0 / float(selfShadowSteps);
            
            for (int i = 0; i < 16; i++) {
              if (i >= selfShadowSteps) break;
              
              float t = float(i) * stepSize;
              vec2 shadowUV = uv - lightDirUV * t;
              
              // 检查UV边界
              if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
                break;
              }
              
              // 采样云层密度
              float cloudDensity = texture2D(map, shadowUV).r;
              
              // 如果遇到高密度云层，产生阴影
              if (cloudDensity > 0.3) {
                float shadowFactor = cloudDensity * selfShadowStrength * (1.0 - t);
                shadow = min(shadow, 1.0 - shadowFactor);
              }
            }
            
            return shadow;
          }
          
          void main(){ 
            vec3 n = normalize(vNormalW);
            float ndl = max(dot(n, normalize(lightDir)), 0.0);
            
            vec3 src;
            if (useTriplanar) {
              // 使用Triplanar采样
              src = triplanarSample(map, vPosition, n);
            } else {
              // 使用传统UV采样
              float latFactor = clamp(sqrt(max(0.0, 1.0 - n.y*n.y)), 0.2, 1.0);
              vec2 uv = vUv + uvOffset * (polarSlowdown * latFactor);
              
              src = texture2D(map, uv).rgb;
            }
            
            // Levels: black/white points + gamma + contrast
            float d = dot(src, vec3(0.299,0.587,0.114));
            float bw = max(0.0001, cloudWhite - cloudBlack);
            d = clamp((d - cloudBlack) / bw, 0.0, 1.0);
            d = pow(d, cloudGamma);
            d = clamp((d - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
            
            // 轻量光照近似：wrap光照 + 终止线柔化
            float wrap = 0.25; // wrap光照参数
            float ndlWrapped = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
            
            // 终止线柔化：在晨昏线附近增加暖色调
            float terminatorSoftness = 0.15;
            float terminatorZone = smoothstep(-terminatorSoftness, terminatorSoftness, ndl);
            vec3 warmTint = vec3(1.0, 0.85, 0.75);
            float tintStrength = (1.0 - terminatorZone) * 0.08; // 轻微暖色偏移
            
            // 背光银边效果（仅昼侧且太阳高度>10°时）
            float silverRim = 0.0;
            if (ndl > 0.0) {
              vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0)); // 简化视角方向
              vec3 halfVector = normalize(normalize(lightDir) + viewDir);
              float rimFactor = 1.0 - max(dot(n, viewDir), 0.0);
              silverRim = pow(rimFactor, 2.0) * 0.12 * ndl;
            }
            
            // 最终光照计算
            float dayW = smoothstep(0.0, 0.35, ndlWrapped);
            float l = pow(dayW, 0.8) * (0.7 + 0.3*sunI) + silverRim;
            
            vec3 c = pow(src, vec3(cloudGamma));
            c = clamp((c - vec3(cloudBlack)) / bw, 0.0, 1.0);
            c = clamp((c - 0.5) * cloudContrast + 0.5, 0.0, 1.0);
            
            // 应用暖色调偏移
            c = mix(c, c * warmTint, tintStrength);
            
            // 计算体积密度
            float density = sampleVolumeDensity(vUv, d);
            
            // 计算厚度映射
            float thickness = calculateThicknessMapping(vUv, d);
            
            // 应用厚度映射到密度
            density *= thickness;
            
            // 应用体积散射
            c = calculateVolumeScattering(c, lightDir, n, density);
            
            // 计算自身阴影
            float selfShadow = calculateSelfShadow(vUv, lightDir, n);
            
            // 厚度映射直接影响云层颜色和透明度
            float finalOpacity = opacity;
            if (useThicknessMapping) {
              // 厚的地方更亮更不透明
              float thicknessEffect = thickness * 0.3; // 厚度对颜色的影响
              c = mix(c, c * 1.2, thicknessEffect); // 厚的地方更亮
              
              // 厚度影响透明度
              float thicknessAlpha = 1.0 + thicknessEffect;
              finalOpacity *= thicknessAlpha;
            }
            
            // 应用自身阴影到光照
            float shadowedLight = l * selfShadow;
            
            vec3 col = c * shadowedLight * lightColor;
            float a = clamp(dayW * strength * d * finalOpacity, 0.0, 1.0);
            gl_FragColor = vec4(col, a);
          }
        `,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        toneMapped: true,
        blending: blendMode === "additive" ? THREE.AdditiveBlending : 
                 blendMode === "multiply" ? THREE.MultiplyBlending : 
                 THREE.NormalBlending,
      });
      
      console.log('[Clouds] ✅ 云层材质创建成功');
      return material;
    } catch (error) {
      console.error('[Clouds] ❌ 云层材质创建失败:', error);
      return null;
    }
  }, [texture, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast, displacementScale, displacementBias, scrollSpeedU, scrollSpeedV, useTriplanar, triplanarScale, useVolumeScattering, volumeDensity, scatteringStrength, scatteringG, opacity]);

  // 更新着色器uniforms
  useEffect(() => {
    if (cloudMaterial) {
      try {
        const ld = (lightDir ?? new THREE.Vector3(1,0,0));
        const lc = (lightColor ?? new THREE.Color('#ffffff'));
        
        if (cloudMaterial.uniforms.lightDir?.value) {
          (cloudMaterial.uniforms.lightDir.value as THREE.Vector3).copy(ld);
        }
        if (cloudMaterial.uniforms.lightColor?.value) {
          (cloudMaterial.uniforms.lightColor.value as THREE.Color).copy(lc);
        }
        if (cloudMaterial.uniforms.strength) {
          cloudMaterial.uniforms.strength.value = strength ?? 0.5;
        }
        if (cloudMaterial.uniforms.sunI) {
          cloudMaterial.uniforms.sunI.value = sunI ?? 1.0;
        }
        if (cloudMaterial.uniforms.cloudGamma) {
          cloudMaterial.uniforms.cloudGamma.value = cloudGamma ?? 1.0;
        }
        if (cloudMaterial.uniforms.cloudBlack) {
          cloudMaterial.uniforms.cloudBlack.value = cloudBlack ?? 0.4;
        }
        if (cloudMaterial.uniforms.cloudWhite) {
          cloudMaterial.uniforms.cloudWhite.value = cloudWhite ?? 0.85;
        }
        if (cloudMaterial.uniforms.cloudContrast) {
          cloudMaterial.uniforms.cloudContrast.value = cloudContrast ?? 1.2;
        }
        if (cloudMaterial.uniforms.displacementScale) {
          cloudMaterial.uniforms.displacementScale.value = displacementScale ?? 0.05;
        }
        if (cloudMaterial.uniforms.displacementBias) {
          cloudMaterial.uniforms.displacementBias.value = displacementBias ?? 0.02;
        }
        if (cloudMaterial.uniforms.uvOffset) {
          (cloudMaterial.uniforms.uvOffset.value as THREE.Vector2).set(tAccum.current.u, tAccum.current.v);
        }
        if (cloudMaterial.uniforms.useVolumeScattering) {
          cloudMaterial.uniforms.useVolumeScattering.value = useVolumeScattering ?? false;
        }
        if (cloudMaterial.uniforms.volumeDensity) {
          cloudMaterial.uniforms.volumeDensity.value = volumeDensity ?? 0.3;
        }
        if (cloudMaterial.uniforms.scatteringStrength) {
          cloudMaterial.uniforms.scatteringStrength.value = scatteringStrength ?? 0.5;
        }
        if (cloudMaterial.uniforms.scatteringG) {
          cloudMaterial.uniforms.scatteringG.value = scatteringG ?? 0.3;
        }
        if (cloudMaterial.uniforms.rimEffect) {
          cloudMaterial.uniforms.rimEffect.value = rimEffect ?? 0.3;
        }
        if (cloudMaterial.uniforms.densityEnhancement) {
          cloudMaterial.uniforms.densityEnhancement.value = densityEnhancement ?? 1.5;
        }
        if (cloudMaterial.uniforms.scatteringColor) {
          (cloudMaterial.uniforms.scatteringColor.value as THREE.Vector3).set(...(scatteringColor ?? [1.0, 0.95, 0.9]));
        }
        if (cloudMaterial.uniforms.noiseScale) {
          cloudMaterial.uniforms.noiseScale.value = noiseScale ?? 1.0;
        }
        if (cloudMaterial.uniforms.noiseStrength) {
          cloudMaterial.uniforms.noiseStrength.value = noiseStrength ?? 0.8;
        }
        if (cloudMaterial.uniforms.useThicknessMapping) {
          cloudMaterial.uniforms.useThicknessMapping.value = useThicknessMapping ?? false;
        }
        if (cloudMaterial.uniforms.thicknessScale) {
          cloudMaterial.uniforms.thicknessScale.value = thicknessScale ?? 1.0;
        }
        if (cloudMaterial.uniforms.thicknessBias) {
          cloudMaterial.uniforms.thicknessBias.value = thicknessBias ?? 0.0;
        }
        if (cloudMaterial.uniforms.thicknessPower) {
          cloudMaterial.uniforms.thicknessPower.value = thicknessPower ?? 1.0;
        }
        if (cloudMaterial.uniforms.useSelfShadow) {
          cloudMaterial.uniforms.useSelfShadow.value = useSelfShadow ?? false;
        }
        if (cloudMaterial.uniforms.selfShadowStrength) {
          cloudMaterial.uniforms.selfShadowStrength.value = selfShadowStrength ?? 0.5;
        }
        if (cloudMaterial.uniforms.selfShadowSteps) {
          cloudMaterial.uniforms.selfShadowSteps.value = selfShadowSteps ?? 8;
        }
        if (cloudMaterial.uniforms.selfShadowDistance) {
          cloudMaterial.uniforms.selfShadowDistance.value = selfShadowDistance ?? 0.02;
        }
      } catch (error) {
        console.error('[SimpleClouds] Error updating uniforms:', error);
      }
    }
  }, [cloudMaterial, texture, lightDir, lightColor, strength, sunI, cloudGamma, cloudBlack, cloudWhite, cloudContrast, displacementScale, displacementBias, scrollSpeedU, scrollSpeedV, useTriplanar, triplanarScale, useVolumeScattering, volumeDensity, scatteringStrength, scatteringG, rimEffect, densityEnhancement, scatteringColor, noiseScale, noiseStrength, useThicknessMapping, thicknessScale, thicknessBias, thicknessPower, useSelfShadow, selfShadowStrength, selfShadowSteps, selfShadowDistance, opacity]);

  // UV滚动动画
  useFrame((_, delta) => {
    if (!ref.current || !cloudMaterial) return;
    
    try {
      // 简单的UV滚动（使用参数控制速度）
      tAccum.current.u += (scrollSpeedU ?? 0.0001) * delta; // U方向滚动
      tAccum.current.v += (scrollSpeedV ?? 0.00005) * delta; // V方向滚动
      
      // 更新材质uniforms
      if (cloudMaterial.uniforms.uvOffset) {
        (cloudMaterial.uniforms.uvOffset.value as THREE.Vector2).set(tAccum.current.u, tAccum.current.v);
      }
      
      // 调用UV更新回调
      if (onUvUpdate) {
        onUvUpdate(new THREE.Vector2(tAccum.current.u, tAccum.current.v));
      }
    } catch (error) {
      console.error('[Clouds] UV滚动更新失败:', error);
    }
  });

  if (!cloudMaterial) return null;

  return (
    <mesh ref={ref} position={position} material={cloudMaterial}>
      <sphereGeometry args={[radius, 64, 32]} />
    </mesh>
  );
}

// 多层云层组件 - 支持两套并存系统
export function CloudsWithLayers({ 
  radius, 
  texture, 
  position, 
  yawDeg = 0, 
  pitchDeg = 0, 
  lightDir, 
  lightColor, 
  strength = 0.5, 
  sunI = 1.0, 
  cloudGamma = 1.0, 
  cloudBlack = 0.4, 
  cloudWhite = 0.85, 
  cloudContrast = 1.2,
  // 置换贴图参数
  displacementScale = 0.05,
  displacementBias = 0.02,
  // UV滚动速度参数
  scrollSpeedU = 0.0003,
  scrollSpeedV = 0.00015,
  // 多层参数
  numLayers = 3,
  layerSpacing = 0.002,
  // Triplanar参数
  useTriplanar = false,
  triplanarScale = 0.1,
  // 体积散射参数
  useVolumeScattering = false,
  volumeDensity = 0.3,
  scatteringStrength = 0.5,
  scatteringG = 0.3,
  rimEffect = 0.3,
  densityEnhancement = 1.5,
  scatteringColor = [1.0, 0.95, 0.9],
  noiseScale = 1.0,
  noiseStrength = 0.8,
  
  // 厚度映射参数
  useThicknessMapping = false,
  thicknessScale = 1.0,
  thicknessBias = 0.0,
  thicknessPower = 1.0,
  
  // 自身阴影参数
  useSelfShadow = false,
  selfShadowStrength = 0.5,
  selfShadowSteps = 8,
  selfShadowDistance = 0.02,
  
  // 混合参数
  blendMode = "alpha",
  opacity = 1.0,
  // UV更新回调
  onUvUpdate
}: {
  radius: number;
  texture: THREE.Texture | null;
  position: [number, number, number];
  yawDeg?: number;
  pitchDeg?: number;
  lightDir?: THREE.Vector3;
  lightColor?: THREE.Color;
  strength?: number;
  sunI?: number;
  cloudGamma?: number;
  cloudBlack?: number;
  cloudWhite?: number;
  cloudContrast?: number;
  // 置换贴图参数
  displacementScale?: number;
  displacementBias?: number;
  // UV滚动速度参数
  scrollSpeedU?: number;
  scrollSpeedV?: number;
  // 多层参数
  numLayers?: number;
  layerSpacing?: number;
  // Triplanar参数
  useTriplanar?: boolean;
  triplanarScale?: number;
  // 体积散射参数
  useVolumeScattering?: boolean;
  volumeDensity?: number;
  scatteringStrength?: number;
  scatteringG?: number;
  rimEffect?: number;
  densityEnhancement?: number;
  scatteringColor?: [number, number, number];
  noiseScale?: number;
  noiseStrength?: number;
  
  // 厚度映射参数
  useThicknessMapping?: boolean;
  thicknessScale?: number;
  thicknessBias?: number;
  thicknessPower?: number;
  
  // 自身阴影参数
  useSelfShadow?: boolean;
  selfShadowStrength?: number;
  selfShadowSteps?: number;
  selfShadowDistance?: number;
  
  // 混合参数
  blendMode?: "additive" | "alpha" | "multiply";
  opacity?: number;
  // UV更新回调
  onUvUpdate?: (offset: THREE.Vector2) => void;
}) {
  // 相机距离检测（用于近距离优化）
  const cameraRef = useRef<THREE.Camera>();
  const [cameraDistance, setCameraDistance] = React.useState(15);
  
  useFrame((state) => {
    if (state.camera) {
      cameraRef.current = state.camera;
      const distance = state.camera.position.length();
      setCameraDistance(distance);
    }
  });

  // 根据相机距离调整参数 - 修复Z轴叠加问题
  const getOptimizedParams = (layerIndex: number) => {
    const isCloseView = cameraDistance < 8; // 近距离观察阈值
    
    if (isCloseView) {
      // 近距离观察：真正的Z轴叠加，避免XY平面位移
      return {
        strength: strength * (0.95 - layerIndex * 0.02), // 轻微强度递减
        displacementScale: displacementScale, // 所有层使用相同的置换强度
        displacementBias: displacementBias, // 所有层使用相同的置换偏移
        scrollSpeedU: scrollSpeedU, // 所有层使用相同的UV滚动速度
        scrollSpeedV: scrollSpeedV, // 保持完全同步
        layerSpacing: layerSpacing * 0.3 // 减少层间距，避免视觉分离
      };
    } else {
      // 远距离观察：保持Z轴叠加，所有层完全同步
      return {
        strength: strength * (0.9 - layerIndex * 0.03), // 轻微强度递减
        displacementScale: displacementScale, // 所有层使用相同的置换强度
        displacementBias: displacementBias, // 所有层使用相同的置换偏移
        scrollSpeedU: scrollSpeedU, // 保持同步滚动
        scrollSpeedV: scrollSpeedV, // 避免XY平面错位
        layerSpacing: layerSpacing
      };
    }
  };
  // 性能监控
  useFrame(() => {
    perfMonitor.update();
  });

  // 组件挂载时输出性能信息
  useEffect(() => {
    console.log(`[CloudsWithLayers] 初始化 ${numLayers} 层云系统，层间距: ${layerSpacing}`);
    
    // 5秒后输出性能报告 - 已关闭
    // const timer = setTimeout(() => {
    //   const stats = perfMonitor.getStats();
    //   console.log(`[CloudsWithLayers] 性能报告 - FPS: ${stats.fps}, 内存: ${stats.avgMemory.toFixed(1)}MB`);
    // }, 5000);
    
    // return () => clearTimeout(timer);
  }, [numLayers, layerSpacing]);

  return (
    <>
      {Array.from({ length: numLayers }).map((_, i) => {
        const params = getOptimizedParams(i);
        return (
          <Clouds 
            key={i}
            radius={radius + i * params.layerSpacing}
            texture={texture}
            position={position}
            yawDeg={yawDeg}
            pitchDeg={pitchDeg}
            lightDir={lightDir}
            lightColor={lightColor}
            // 使用优化后的参数 - 真正的Z轴叠加
            strength={params.strength}
            sunI={sunI}
            cloudGamma={cloudGamma}
            cloudBlack={cloudBlack}
            cloudWhite={cloudWhite}
            cloudContrast={cloudContrast}
            // 置换贴图参数 - 所有层使用相同参数，避免XY平面位移
            displacementScale={params.displacementScale}
            displacementBias={params.displacementBias}
            // UV滚动速度参数 - 完全同步，避免层间错位
            scrollSpeedU={params.scrollSpeedU}
            scrollSpeedV={params.scrollSpeedV}
            // Triplanar和混合参数
            useTriplanar={useTriplanar}
            triplanarScale={triplanarScale}
            // 体积散射参数
            useVolumeScattering={useVolumeScattering ?? false}
            volumeDensity={volumeDensity ?? 0.3}
            scatteringStrength={scatteringStrength ?? 0.5}
            scatteringG={scatteringG ?? 0.3}
            rimEffect={rimEffect ?? 0.3}
            densityEnhancement={densityEnhancement ?? 1.5}
            scatteringColor={scatteringColor ?? [1.0, 0.95, 0.9]}
            noiseScale={noiseScale ?? 1.0}
            noiseStrength={noiseStrength ?? 0.8}
            
            // 厚度映射参数
            useThicknessMapping={useThicknessMapping ?? false}
            thicknessScale={thicknessScale ?? 1.0}
            thicknessBias={thicknessBias ?? 0.0}
            thicknessPower={thicknessPower ?? 1.0}
            
            useSelfShadow={useSelfShadow ?? false}
            selfShadowStrength={selfShadowStrength ?? 0.5}
            selfShadowSteps={selfShadowSteps ?? 8}
            selfShadowDistance={selfShadowDistance ?? 0.02}
            
            blendMode={blendMode}
            opacity={opacity}
            // 只有第一层报告UV偏移，避免重复回调
            onUvUpdate={i === 0 ? onUvUpdate : undefined}
          />
        );
      })}
    </>
  );
}