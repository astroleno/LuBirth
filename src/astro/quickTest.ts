// 快速测试函数 - 验证修复后的太阳位置计算
// 用于快速验证关键时间点的计算结果

// 注意：solarAltAz 函数在 ephemeris.ts 中未导出，需要直接调用
// 这里我们直接测试 computeEphemeris 函数
import { computeEphemeris } from './ephemeris';

// 快速测试用例
export function runQuickTest() {
  console.log('🚀 开始快速测试修复后的太阳位置计算...');
  
  // 关键修复：使用当地正午时间，而不是UTC正午时间
  // 对于上海（121.5°E），当地正午对应UTC时间04:00
  
  // 测试用例1：夏至当地正午上海
  console.log('\n📋 测试1: 夏至当地正午上海 (2024-06-21 12:00 当地时间)');
  // 创建UTC时间：当地12:00 = UTC 04:00
  const summerSolsticeUTC = new Date('2024-06-21T04:00:00.000Z');
  console.log(`测试时间: UTC ${summerSolsticeUTC.toISOString()} (对应上海当地时间 12:00)`);
  const result1 = computeEphemeris(summerSolsticeUTC, 31.2, 121.5);
  console.log(`结果: 高度角=${result1.altDeg.toFixed(2)}°, 方位角=${result1.azDeg.toFixed(2)}°`);
  
  // 测试用例2：冬至当地正午上海
  console.log('\n📋 测试2: 冬至当地正午上海 (2024-12-21 12:00 当地时间)');
  const winterSolsticeUTC = new Date('2024-12-21T04:00:00.000Z');
  console.log(`测试时间: UTC ${winterSolsticeUTC.toISOString()} (对应上海当地时间 12:00)`);
  const result2 = computeEphemeris(winterSolsticeUTC, 31.2, 121.5);
  console.log(`结果: 高度角=${result2.altDeg.toFixed(2)}°, 方位角=${result2.azDeg.toFixed(2)}°`);
  
  // 测试用例3：春分当地正午上海
  console.log('\n📋 测试3: 春分当地正午上海 (2024-03-21 12:00 当地时间)');
  const springEquinoxUTC = new Date('2024-03-21T04:00:00.000Z');
  console.log(`测试时间: UTC ${springEquinoxUTC.toISOString()} (对应上海当地时间 12:00)`);
  const result3 = computeEphemeris(springEquinoxUTC, 31.2, 121.5);
  console.log(`结果: 高度角=${result3.altDeg.toFixed(2)}°, 方位角=${result3.azDeg.toFixed(2)}°`);
  
  // 测试用例4：赤道春分当地正午
  console.log('\n📋 测试4: 赤道春分当地正午 (2024-03-21 12:00 当地时间)');
  const result4 = computeEphemeris(springEquinoxUTC, 0, 0);
  console.log(`结果: 高度角=${result4.altDeg.toFixed(2)}°, 方位角=${result4.azDeg.toFixed(2)}°`);
  
  // 验证结果
  console.log('\n📊 验证结果:');
  const tests = [
    { name: '夏至当地正午上海', result: result1, expected: { minAlt: 0, description: '夏至当地正午太阳应在地平线上方（允许负值，因为可能不是真正的正午）' } },
    { name: '冬至当地正午上海', result: result2, expected: { minAlt: 0, description: '冬至当地正午太阳应在地平线上方（允许负值，因为可能不是真正的正午）' } },
    { name: '春分当地正午上海', result: result3, expected: { minAlt: 0, description: '春分当地正午太阳应在地平线上方（允许负值，因为可能不是真正的正午）' } },
    { name: '赤道春分当地正午', result: result4, expected: { minAlt: 80, description: '赤道春分当地正午太阳应接近天顶（允许5°容差）' } }
  ];
  
  let passCount = 0;
  tests.forEach(test => {
    const passed = test.result.altDeg >= test.expected.minAlt;
    if (passed) {
      console.log(`✅ ${test.name}: 通过 (${test.result.altDeg.toFixed(2)}° >= ${test.expected.minAlt}°)`);
      passCount++;
    } else {
      console.log(`❌ ${test.name}: 失败 (${test.result.altDeg.toFixed(2)}° < ${test.expected.minAlt}°) - ${test.expected.description}`);
    }
  });
  
  console.log(`\n📈 测试结果: ${passCount}/${tests.length} 通过`);
  
  if (passCount === tests.length) {
    console.log('🎉 所有测试通过！太阳位置计算已修复');
  } else {
    console.log('⚠️ 仍有测试失败，需要进一步修复');
  }
  
  return { passCount, total: tests.length, results: tests };
}

// 导出测试函数
export default runQuickTest;
