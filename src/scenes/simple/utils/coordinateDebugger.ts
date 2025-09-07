import * as THREE from 'three';

/**
 * 坐标系调试工具
 * 用于验证和调试地球坐标系转换问题
 */
export class CoordinateSystemDebugger {
  
  /**
   * 测试已知地点的坐标映射
   */
  static testKnownLocations() {
    const locations = [
      { name: '上海', lon: 121.47, lat: 31.23 },
      { name: '北京', lon: 116.41, lat: 39.90 },
      { name: '纽约', lon: -74.01, lat: 40.71 },
      { name: '伦敦', lon: -0.13, lat: 51.51 },
      { name: '东京', lon: 139.69, lat: 35.69 },
      { name: '悉尼', lon: 151.21, lat: -33.87 },
      { name: '本初子午线', lon: 0, lat: 0 },
      { name: '国际日期变更线', lon: 180, lat: 0 }
    ];

    console.group('🌍 坐标系映射测试');
    
    locations.forEach(location => {
      // 使用当前的坐标计算方法
      const lat = THREE.MathUtils.degToRad(location.lat);
      const lon = THREE.MathUtils.degToRad(location.lon);
      
      // 当前公式
      const p = new THREE.Vector3(
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(lon)
      );
      
      // 计算屏幕投影（模拟相机在 [0,0,15] 位置）
      const cameraPosition = new THREE.Vector3(0, 0, 15);
      const screenPos = this.projectToScreen(p, cameraPosition);
      
      console.log(`${location.name}:`, {
        经度: location.lon.toFixed(2) + '°',
        纬度: location.lat.toFixed(2) + '°',
        世界坐标: { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) },
        屏幕坐标: { x: +screenPos.x.toFixed(3), y: +screenPos.y.toFixed(3) },
        期望位置: this.getExpectedScreenPosition(location.name)
      });
    });
    
    console.groupEnd();
  }
  
  /**
   * 测试不同的经度计算公式
   */
  static testLongitudeFormulas() {
    console.group('🔄 经度计算公式测试');
    
    const testPoint = { lon: 121.47, lat: 31.23 }; // 上海
    const lat = THREE.MathUtils.degToRad(testPoint.lat);
    const lon = THREE.MathUtils.degToRad(testPoint.lon);
    
    const formulas = [
      {
        name: '当前公式',
        calculate: (lon: number, lat: number) => new THREE.Vector3(
          Math.cos(lat) * Math.sin(lon),
          Math.sin(lat),
          Math.cos(lat) * Math.cos(lon)
        )
      },
      {
        name: '标准地理公式',
        calculate: (lon: number, lat: number) => new THREE.Vector3(
          Math.cos(lat) * Math.cos(lon),
          Math.sin(lat),
          Math.cos(lat) * Math.sin(lon)
        )
      },
      {
        name: 'Z轴为0°经度',
        calculate: (lon: number, lat: number) => new THREE.Vector3(
          Math.cos(lat) * Math.sin(lon - Math.PI/2),
          Math.sin(lat),
          Math.cos(lat) * Math.cos(lon - Math.PI/2)
        )
      },
      {
        name: 'X轴为0°经度',
        calculate: (lon: number, lat: number) => new THREE.Vector3(
          Math.cos(lat) * Math.cos(lon - Math.PI),
          Math.sin(lat),
          Math.cos(lat) * Math.sin(lon - Math.PI)
        )
      }
    ];
    
    formulas.forEach(formula => {
      const result = formula.calculate(lon, lat);
      const screenPos = this.projectToScreen(result, new THREE.Vector3(0, 0, 15));
      
      console.log(`${formula.name}:`, {
        世界坐标: { x: +result.x.toFixed(3), y: +result.y.toFixed(3), z: +result.z.toFixed(3) },
        屏幕坐标: { x: +screenPos.x.toFixed(3), y: +screenPos.y.toFixed(3) }
      });
    });
    
    console.groupEnd();
  }
  
  /**
   * 测试相机位置对映射的影响
   */
  static testCameraPositions() {
    console.group('📷 相机位置测试');
    
    const testPoint = { lon: 121.47, lat: 31.23 }; // 上海
    const lat = THREE.MathUtils.degToRad(testPoint.lat);
    const lon = THREE.MathUtils.degToRad(testPoint.lon);
    
    const p = new THREE.Vector3(
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon)
    );
    
    const cameraPositions = [
      { name: '默认位置', position: new THREE.Vector3(0, 0, 15) },
      { name: '左侧视角', position: new THREE.Vector3(-10, 0, 10) },
      { name: '右侧视角', position: new THREE.Vector3(10, 0, 10) },
      { name: '上方视角', position: new THREE.Vector3(0, 10, 10) },
      { name: '前方视角', position: new THREE.Vector3(0, 0, 20) }
    ];
    
    cameraPositions.forEach(camera => {
      const screenPos = this.projectToScreen(p, camera.position);
      console.log(`${camera.name}:`, {
        相机位置: { x: +camera.position.x.toFixed(1), y: +camera.position.y.toFixed(1), z: +camera.position.z.toFixed(1) },
        屏幕坐标: { x: +screenPos.x.toFixed(3), y: +screenPos.y.toFixed(3) }
      });
    });
    
    console.groupEnd();
  }
  
  /**
   * 将3D坐标投影到屏幕坐标
   */
  private static projectToScreen(worldPos: THREE.Vector3, cameraPos: THREE.Vector3): THREE.Vector2 {
    // 简化的正交投影
    const direction = worldPos.clone().sub(cameraPos);
    const distance = direction.length();
    
    // 简单的透视投影
    const fov = 45 * Math.PI / 180;
    const scale = Math.tan(fov / 2) * distance;
    
    const screenX = direction.x / scale;
    const screenY = direction.y / scale;
    
    return new THREE.Vector2(screenX, screenY);
  }
  
  /**
   * 获取期望的屏幕位置
   */
  private static getExpectedScreenPosition(locationName: string): string {
    const expectations: Record<string, string> = {
      '上海': '屏幕右侧',
      '北京': '屏幕右侧',
      '纽约': '屏幕左侧',
      '伦敦': '屏幕中心左侧',
      '东京': '屏幕右侧',
      '悉尼': '屏幕右下角',
      '本初子午线': '屏幕中心',
      '国际日期变更线': '屏幕左侧边缘'
    };
    
    return expectations[locationName] || '未知';
  }
  
  /**
   * 验证相位差修正
   */
  static testPhaseShift() {
    console.group('🔧 相位差修正测试');
    
    const testPoint = { lon: 121.47, lat: 31.23 }; // 上海
    const lat = THREE.MathUtils.degToRad(testPoint.lat);
    
    const phaseShifts = [0, 30, 60, 90, 120, 150, 180];
    
    phaseShifts.forEach(shift => {
      const adjustedLon = THREE.MathUtils.degToRad(testPoint.lon + shift);
      const p = new THREE.Vector3(
        Math.cos(lat) * Math.sin(adjustedLon),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(adjustedLon)
      );
      
      const screenPos = this.projectToScreen(p, new THREE.Vector3(0, 0, 15));
      
      console.log(`相位差 ${shift}°:`, {
        调整后经度: (testPoint.lon + shift).toFixed(2) + '°',
        世界坐标: { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) },
        屏幕坐标: { x: +screenPos.x.toFixed(3), y: +screenPos.y.toFixed(3) }
      });
    });
    
    console.groupEnd();
  }
  
  /**
   * 运行所有测试
   */
  static runAllTests() {
    console.log('🚀 开始坐标系调试测试...');
    this.testKnownLocations();
    this.testLongitudeFormulas();
    this.testCameraPositions();
    this.testPhaseShift();
    console.log('✅ 坐标系调试测试完成');
  }
}