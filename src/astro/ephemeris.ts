import { AstroTime, Body, Observer, SiderealTime, Equator as EquatorFn, Horizon as HorizonFn, Illumination as IlluminationFn, Search } from 'astronomy-engine';
import { logger } from '../utils/logger';

// 导入验证函数
import { validateAstronomicalConstants, validatePhysicalLimits, validateSeasonalConsistency } from './constants';

export type Ephemeris = {
  time: Date;
  // 标准化坐标系命名
  sunWorld: { x: number; y: number; z: number };  // 世界坐标系太阳方向
  moonWorld: { x: number; y: number; z: number }; // 世界坐标系月球方向
  observerECEF: { x: number; y: number; z: number }; // 观测者地心坐标
  // 天文角度信息（用于验证和UI显示）
  altDeg: number;   // 太阳高度角
  azDeg: number;    // 太阳方位角（0°=北，顺时针）
  azDefined?: boolean; // 方位角是否稳定定义（天顶附近为false）
  // Moon illumination fraction
  illumination: number;
};

function len(v: {x:number;y:number;z:number}) { return Math.hypot(v.x, v.y, v.z); }
function dot(a: {x:number;y:number;z:number}, b:{x:number;y:number;z:number}) { return a.x*b.x + a.y*b.y + a.z*b.z; }

// 儒略日计算
function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  return date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 +
         (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
}

// 标准天文学坐标转换函数（基于advice建议）
function dayOfYearUTC(dateUtc: Date): number {
  const start = Date.UTC(dateUtc.getUTCFullYear(), 0, 1);
  return Math.floor((dateUtc.getTime() - start) / 86400000) + 1;
}

function norm24(h: number): number { 
  return ((h % 24) + 24) % 24; 
}

// 改用更准确的太阳位置算法，基于地球自转和恒星时
function solarAltAz(dateUtc: Date, latDeg: number, lonDeg: number) {
  const φ = latDeg * Math.PI / 180;
  const λ = lonDeg * Math.PI / 180;
  
  // 1. 儒略日计算（使用已有函数）
  const jd = dateToJulianDay(dateUtc);
  const T = (jd - 2451545.0) / 36525.0;  // 儒略世纪数
  
  // 2. 太阳平黄经（地球公转）
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const L0rad = L0 * Math.PI / 180;
  
  // 3. 太阳平近点角
  const M = (357.52911 + T * (35999.05029 - T * 0.0001537)) % 360;
  const Mrad = M * Math.PI / 180;
  
  // 4. 中心方程（椭圆轨道修正）
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad) +
            (0.019993 - T * 0.000101) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  // 5. 太阳真黄经
  const L = (L0 + C) % 360;
  const Lrad = L * Math.PI / 180;
  
  // 6. 黄道倾角（地球自转轴倾角）- 修复：使用正确的天文常数
  // 当前时刻的黄赤交角，考虑岁差效应
  const epsilon0 = 23.439291;  // J2000时刻的黄赤交角（度）
  const deltaEpsilon = 0.0130042;  // 黄赤交角变化率（度/世纪）
  const epsilon = epsilon0 - T * deltaEpsilon;
  const epsilonRad = epsilon * Math.PI / 180;
  
  // 调试信息
  console.log(`[solarAltAz] 地球自转轴倾角: ${epsilon.toFixed(6)}° (T=${T.toFixed(6)})`);
  
  // 7. 太阳赤经和赤纬（黄道→赤道坐标转换）- 修复：使用正确的转换公式
  // 太阳赤经计算
  const sinAlpha = Math.cos(epsilonRad) * Math.sin(Lrad);
  const cosAlpha = Math.cos(Lrad);
  const alpha = Math.atan2(sinAlpha, cosAlpha);  // 太阳赤经
  
  // 太阳赤纬计算
  const sinDelta = Math.sin(epsilonRad) * Math.sin(Lrad);
  const delta = Math.asin(sinDelta);  // 太阳赤纬
  
  // 调试信息
  console.log(`[solarAltAz] 太阳位置: 黄经=${L.toFixed(2)}°, 赤经=${(alpha * 180 / Math.PI).toFixed(2)}°, 赤纬=${(delta * 180 / Math.PI).toFixed(2)}°`);
  
  // 8. 格林威治平恒星时（地球自转）- 修复：使用标准天文公式
  // 格林威治平恒星时 = 格林威治恒星时 + 地球自转修正
  const T0 = 6.697374558;  // 2000年1月1日0时UT的格林威治恒星时（小时）
  const T1 = 0.0657098244;  // 恒星时变化率（小时/天）
  const T2 = 0.000002;  // 恒星时二次项（小时/天²）
  
  const daysSince2000 = jd - 2451545.0;
  const theta0Hours = T0 + T1 * daysSince2000 + T2 * daysSince2000 * daysSince2000;
  const theta0Deg = (theta0Hours * 15) % 360;  // 转换为度
  
  // 9. 当地恒星时（考虑观测者经度）- 修复：使用标准天文公式
  // 当地恒星时 = 格林威治恒星时 + 经度
  let localSiderealTimeDeg = theta0Deg + lonDeg;
  
  // 确保在0-360度范围内
  while (localSiderealTimeDeg < 0) localSiderealTimeDeg += 360;
  while (localSiderealTimeDeg >= 360) localSiderealTimeDeg -= 360;
  
  const theta = localSiderealTimeDeg * Math.PI / 180;  // 当地恒星时（弧度）
  
  // 10. 时角计算 - 修复：使用真实计算的时角
  // 时角 = 当地恒星时 - 太阳赤经
  let H = theta - alpha;  // 时角
  
  // 🔧 关键修复：确保时角在-180到+180度范围内（标准天文做法）
  while (H > Math.PI) H -= 2 * Math.PI;
  while (H < -Math.PI) H += 2 * Math.PI;
  
  // 调试信息
  console.log(`[solarAltAz] 时角: ${(H * 180 / Math.PI).toFixed(2)}° (范围: -180° 到 +180°, 0°=正午)`);
  
  // 验证：时角应该在合理范围内
  if (Math.abs(H * 180 / Math.PI) > 180) {
    console.log(`[solarAltAz] 🚨 时角异常！时角应为-180°到+180°，实际为${(H * 180 / Math.PI).toFixed(2)}°`);
  }
  
  // 调试信息
  console.log(`[solarAltAz] 恒星时: 格林威治=${theta0Deg.toFixed(2)}°, 经度=${lonDeg.toFixed(2)}°`);
  

  
  // 11. 地平坐标计算（球面天文学标准公式）
  const sinAlt = Math.sin(φ) * Math.sin(delta) + Math.cos(φ) * Math.cos(delta) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  
  const sinAz = -Math.sin(H) * Math.cos(delta) / Math.cos(altitude);
  const cosAz = (Math.sin(delta) - Math.sin(φ) * Math.sin(altitude)) / (Math.cos(φ) * Math.cos(altitude));
  let azimuth = Math.atan2(sinAz, cosAz);
  
  // 🔧 关键修复：方位角转换为0-360度范围（0°=北，顺时针）
  if (azimuth < 0) azimuth += 2 * Math.PI;
  
  // 调试信息
  console.log(`[solarAltAz] 地平坐标: 高度角=${(altitude * 180 / Math.PI).toFixed(2)}°, 方位角=${(azimuth * 180 / Math.PI).toFixed(2)}°`);
  console.log(`[solarAltAz] 计算参数: φ=${(φ * 180 / Math.PI).toFixed(2)}°, δ=${(delta * 180 / Math.PI).toFixed(2)}°, H=${(H * 180 / Math.PI).toFixed(2)}°`);
  
  const result = { 
    azDeg: azimuth * 180 / Math.PI,    // 0°=北，顺时针
    altDeg: altitude * 180 / Math.PI   // 高度角
  };
  
  // 添加物理验证
  if (!validatePhysicalLimits(result.altDeg, result.azDeg)) {
    console.warn(`[solarAltAz] 物理验证失败: alt=${result.altDeg}°, az=${result.azDeg}°`);
  }
  
  // 添加季节一致性验证
  const seasonalValidation = validateSeasonalConsistency(dateUtc, latDeg, result.altDeg);
  if (!seasonalValidation.isValid) {
    console.warn(`[solarAltAz] 季节一致性验证失败:`, seasonalValidation.issues);
  }
  
  return result;
}

// Alt/Az转为ENU本地坐标系
function altAzToENU(azDeg: number, altDeg: number) {
  const az = azDeg * Math.PI / 180;
  const el = altDeg * Math.PI / 180;
  return {
    x: Math.sin(az) * Math.cos(el),  // East
    y: Math.sin(el),                 // Up  
    z: Math.cos(az) * Math.cos(el)   // North
  };
}

// ENU转为ECEF地心地固坐标系
function enuToECEF(enu: {x:number;y:number;z:number}, latDeg: number, lonDeg: number) {
  const φ = latDeg * Math.PI / 180;
  const λ = lonDeg * Math.PI / 180;
  
  // ENU基向量在ECEF中的表示
  const E = { x: -Math.sin(λ),              y: Math.cos(λ),             z: 0 };
  const N = { x: -Math.sin(φ) * Math.cos(λ), y: -Math.sin(φ) * Math.sin(λ), z: Math.cos(φ) };
  const U = { x: Math.cos(φ) * Math.cos(λ),  y: Math.cos(φ) * Math.sin(λ),  z: Math.sin(φ) };
  
  return {
    x: enu.x * E.x + enu.y * U.x + enu.z * N.x,
    y: enu.x * E.y + enu.y * U.y + enu.z * N.y,
    z: enu.x * E.z + enu.y * U.z + enu.z * N.z
  };
}

// 新实现：更正恒星时/时角的太阳高度/方位角计算（修复GMST/LST）
function solarAltAz2(dateUtc: Date, latDeg: number, lonDeg: number) {
  const phi = latDeg * Math.PI / 180;
  // 1) 儒略日/世纪
  const jd = dateToJulianDay(dateUtc);
  const T = (jd - 2451545.0) / 36525.0;
  // 2) 太阳平黄经/近点角
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = (357.52911 + T * (35999.05029 - T * 0.0001537)) % 360;
  const Mrad = M * Math.PI / 180;
  // 3) 椭圆轨道修正
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad)
          + (0.019993 - T * 0.000101) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  // 4) 真黄经与黄赤交角
  const L = (L0 + C) % 360;
  const Lrad = L * Math.PI / 180;
  const epsilon = (23.439291 - 0.0130042 * T) * Math.PI / 180;
  // 5) 赤经/赤纬
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(Lrad), Math.cos(Lrad));
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(Lrad));
  // 6) 恒星时（度）与时角 - 使用更精确的GMST公式
  const D = jd - 2451545.0;
  // 🔧 使用更精确的GMST公式：280.46061837 + 360.98564736629·D
  let theta0Deg = 280.46061837 + 360.98564736629 * D;
  theta0Deg = ((theta0Deg % 360) + 360) % 360;
  let lstDeg = theta0Deg + lonDeg;
  lstDeg = ((lstDeg % 360) + 360) % 360;
  let H = (lstDeg * Math.PI / 180) - alpha;
  while (H > Math.PI) H -= 2 * Math.PI;
  while (H < -Math.PI) H += 2 * Math.PI;
  // 调试：打印关键天文量
  logger.log('solarAltAz2/key', {
    GMST_deg: +theta0Deg.toFixed(2),
    LST_deg: +lstDeg.toFixed(2),
    H_deg: +(H * 180 / Math.PI).toFixed(2),
    ra_deg: +(alpha * 180 / Math.PI).toFixed(2),
    dec_deg: +(delta * 180 / Math.PI).toFixed(2)
  });
  // 7) 地平坐标（矢量法，确保方位角以北为0°顺时针增加）
  const x_east = Math.cos(delta) * Math.sin(H);
  const y_north = Math.cos(phi) * Math.sin(delta) - Math.sin(phi) * Math.cos(delta) * Math.cos(H);
  const z_up = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, z_up)));
  
  // 🔧 修复：当天顶附近时，方位角计算不稳定，需要特殊处理
  const horizontalProjection = Math.sqrt(x_east * x_east + y_north * y_north);
  let azDeg: number;
  let azDefined: boolean = true;
  
  if (horizontalProjection < 1e-3) {
    // 太阳接近天顶时，方位角无定义或使用时角估算
    azDefined = false;
    // 在赤道春分中午，太阳应该过子午线，方位角应为0°（北）或180°（南）
    if (Math.abs(latDeg) < 5) {
      // 赤道附近，根据时角判断：H接近0时为正午，方位角应为0°
      azDeg = Math.abs(H * 180 / Math.PI) < 5 ? 0 : 180;
    } else {
      // 其他地区，根据纬度判断
      azDeg = latDeg > 0 ? 0 : 180;
    }
    logger.log('solarAltAz2/zenith', {
      horizontalProjection: +horizontalProjection.toFixed(6),
      H_deg: +(H * 180 / Math.PI).toFixed(2),
      lat_deg: +latDeg.toFixed(2),
      az_zenith: +azDeg.toFixed(2),
      azDefined: false
    });
  } else {
    // 正常情况下的方位角计算
    let az = Math.atan2(x_east, y_north); // 0=北, 90=东, 180=南, 270=西
    if (az < 0) az += 2 * Math.PI;
    azDeg = az * 180 / Math.PI;
  }
  const altDeg = altitude * 180 / Math.PI;
  const res = { azDeg, altDeg, azDefined };
  logger.log('solarAltAz2/altaz', {
    alt_deg: +altDeg.toFixed(2),
    az_deg: +azDeg.toFixed(2),
    az_defined: azDefined,
    lat_deg: +latDeg.toFixed(2),
    lon_deg: +lonDeg.toFixed(2)
  });
  return res;
}

// 更稳健：使用 astronomy-engine 直接计算地平坐标（优先使用）
function solarAltAzEngine(dateUtc: Date, latDeg: number, lonDeg: number) {
  try {
    const t = new AstroTime(dateUtc);
    const obs = new (Observer as unknown as { new(lat:number, lon:number, height:number): Observer })(latDeg, lonDeg, 0);
    // 先计算太阳的赤道坐标（对日期的RA/DEC，含像差）
    const equator = (EquatorFn as unknown as (body: Body, time: AstroTime, observer?: Observer, ofdate?: boolean, aberration?: boolean) => any)(Body.Sun, t, obs, true, true);
    const ra = equator.ra as number;
    const dec = equator.dec as number;
    // 再从RA/DEC 转为地平坐标 Alt/Az
    const horizon = (HorizonFn as unknown as (time: AstroTime, obs: Observer, ra: number, dec: number, refraction: string) => any)(t, obs, ra, dec, 'normal');
    const azDeg = ((horizon.azimuth % 360) + 360) % 360;
    const altDeg = horizon.altitude as number;
    logger.log('solarAltAzEngine/altaz', { alt_deg: +altDeg.toFixed(2), az_deg: +azDeg.toFixed(2) });
    return { azDeg, altDeg };
  } catch (e) {
    logger.warn('solarAltAzEngine/fallback', String(e));
    return solarAltAz2(dateUtc, latDeg, lonDeg);
  }
}

// 计算月亮地平坐标（使用 astronomy-engine，稳定一致）
function moonAltAzEngine(dateUtc: Date, latDeg: number, lonDeg: number) {
  const t = new AstroTime(dateUtc);
  const obs = new (Observer as unknown as { new(lat:number, lon:number, height:number): Observer })(latDeg, lonDeg, 0);
  const equator = (EquatorFn as unknown as (body: Body, time: AstroTime, observer?: Observer, ofdate?: boolean, aberration?: boolean) => any)(Body.Moon, t, obs, true, true);
  const ra = equator.ra as number;
  const dec = equator.dec as number;
  const horizon = (HorizonFn as unknown as (time: AstroTime, obs: Observer, ra: number, dec: number, refraction: string) => any)(t, obs, ra, dec, 'normal');
  const azDeg = ((horizon.azimuth % 360) + 360) % 360;
  const altDeg = horizon.altitude as number;
  return { azDeg, altDeg };
}

// 配置开关：选择太阳位置计算算法
const USE_LOCAL_ALGORITHM = false; // 默认使用 astronomy-engine，保证等效正确性

export function computeEphemeris(dateUtc: Date, lat: number, lon: number): Ephemeris {
  // 验证天文常数
  if (!validateAstronomicalConstants()) {
    console.error('[computeEphemeris] 天文常数验证失败');
  }
  
  logger.log('computeEphemeris/begin', { utc: dateUtc.toISOString(), lat, lon, algorithm: USE_LOCAL_ALGORITHM ? 'local' : 'astronomy-engine' });
  
  // === 标准化天文学坐标转换算法 ===
  // 基于advice建议的稳定坐标转换链：Alt/Az → ENU → ECEF → World
  
  // 1. 标准太阳高度角/方位角计算
  // 🔧 修复：切换到本地算法作为主算法，保留astronomy-engine作为备选
  let azDeg: number, altDeg: number, azDefined: boolean = true;
  
  if (USE_LOCAL_ALGORITHM) {
    // 使用本地算法（solarAltAz2）- 主算法
    const result = solarAltAz2(dateUtc, lat, lon);
    azDeg = result.azDeg;
    altDeg = result.altDeg;
    azDefined = result.azDefined ?? true; // 向后兼容
    logger.log('computeEphemeris/altaz', { 
      algorithm: 'local', 
      az_deg: +azDeg.toFixed(1), 
      alt_deg: +altDeg.toFixed(1),
      az_defined: azDefined
    });
  } else {
    // 使用astronomy-engine作为备选
    const result = solarAltAzEngine(dateUtc, lat, lon);
    azDeg = result.azDeg;
    altDeg = result.altDeg;
    azDefined = true; // astronomy-engine不提供此信息
    logger.log('computeEphemeris/altaz', { 
      algorithm: 'astronomy-engine', 
      az_deg: +azDeg.toFixed(1), 
      alt_deg: +altDeg.toFixed(1),
      az_defined: azDefined
    });
  }
  
  // 2. 转为ENU本地坐标系（太阳）
  const sunENU = altAzToENU(azDeg, altDeg);
  logger.log('computeEphemeris/sunENU', { x: +sunENU.x.toFixed(3), y: +sunENU.y.toFixed(3), z: +sunENU.z.toFixed(3) });
  
  // 3. ENU → ECEF（地心地固坐标系）
  const sunECEF = enuToECEF(sunENU, lat, lon);
  logger.log('computeEphemeris/sunECEF', { x: +sunECEF.x.toFixed(3), y: +sunECEF.y.toFixed(3), z: +sunECEF.z.toFixed(3) });
  
  // 4. 坐标对齐：当前three.js世界为 Y-up，而上游计算的ECEF为 Z-up
  //    ECEF(x, y, z) 映射到 World(x, z, y)
  const sunWorld = { x: sunECEF.x, y: sunECEF.z, z: sunECEF.y };

  // 月亮方向（世界坐标）
  const mAltAz = moonAltAzEngine(dateUtc, lat, lon);
  const moonENU = altAzToENU(mAltAz.azDeg, mAltAz.altDeg);
  const moonECEF = enuToECEF(moonENU, lat, lon);
  const moonWorld = { x: moonECEF.x, y: moonECEF.z, z: moonECEF.y };
  
  // 5. 观测者ECEF坐标
  const latRad = lat * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;
  // 观测者在世界坐标的方向（同样进行 Z-up → Y-up 的轴映射）
  const observerECEF_Zup = {
    x: Math.cos(latRad) * Math.cos(lonRad),
    y: Math.cos(latRad) * Math.sin(lonRad),
    z: Math.sin(latRad)
  };
  const observerECEF = { x: observerECEF_Zup.x, y: observerECEF_Zup.z, z: observerECEF_Zup.y };
  
  // 归一化月亮方向
  const moonLen = len(moonWorld) || 1;
  const moonWorldNormalized = { x: moonWorld.x / moonLen, y: moonWorld.y / moonLen, z: moonWorld.z / moonLen };
  
  // 7. 月相计算（使用 astronomy-engine 更准确的相位函数）
  let illumination = 0.5;
  try {
    const info = IlluminationFn(Body.Moon, new AstroTime(dateUtc));
    illumination = Math.min(1, Math.max(0, info.phase_fraction));
  } catch {}
  
  logger.log('computeEphemeris/sunWorld', { x: +sunWorld.x.toFixed(3), y: +sunWorld.y.toFixed(3), z: +sunWorld.z.toFixed(3) });
  
  return {
    time: dateUtc,
    sunWorld,
    moonWorld: moonWorldNormalized,
    observerECEF,
    altDeg,
    azDeg,
    azDefined, // 🔧 新增：方位角稳定性状态
    illumination
  };
}

export function offsetHoursFromLongitude(lon: number): number {
  // 正确的时区计算：每15度一个时区
  // 上海（121.5°E）≈ +8小时
  // 180°E = +12小时
  // 0°E = 0小时
  return Math.round(lon / 15);
}

export function toUTCFromLocal(localISO: string, lon: number): Date {
  // localISO like '1993-08-01T11:00'
  // Parse the string as if it were in the specified timezone (not browser's timezone)
  const offset = offsetHoursFromLongitude(lon);
  
  // Parse the date components manually to avoid browser timezone interpretation
  const match = localISO.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid date format: ${localISO}. Expected YYYY-MM-DDTHH:mm`);
  }
  
  const [, year, month, day, hour, minute] = match;
  const y = parseInt(year, 10);
  const mo = parseInt(month, 10) - 1; // Month is 0-indexed
  const d = parseInt(day, 10);
  const h = parseInt(hour, 10);
  const mi = parseInt(minute, 10);
  
  // 🔧 关键修复：时区转换逻辑
  // 经度121.5°E = +8小时时区
  // 当地正午12:00 = UTC时间04:00（12:00 - 8 = 04:00）
  // 这是正确的时区转换！
  
  // 创建UTC日期
  const utc = new Date(Date.UTC(y, mo, d, h - offset, mi, 0));
  
  console.log(`[toUTCFromLocal] ${localISO} (lon:${lon}) -> UTC: ${utc.toISOString()} (offset: ${offset}h)`);
  console.log(`[toUTCFromLocal] 注意：UTC时间${utc.getUTCHours()}:${utc.getUTCMinutes()} 对应本地时间${h}:${mi}`);
  return utc;
}

/**
 * 计算黄昏点经度 - 使用 astronomy-engine 准确计算
 * @param dateUtc UTC时间
 * @param latDeg 观测者纬度
 * @param lonDeg 观测者经度
 * @returns 黄昏点经度（-180到180度）
 */
export function calculateTerminatorLongitude(dateUtc: Date, latDeg: number, lonDeg: number): number {
  try {
    // 启用临时日志来调试
    console.log('[TerminatorDebug] Starting calculation:', { dateUtc: dateUtc.toISOString(), latDeg, lonDeg });
    
    // 黄昏点定义为太阳高度角为0°（刚好在地平线）的点
    // 我们需要找到当前时刻地球上哪些位置的太阳高度角为0°
    
    const observer = new (Observer as unknown as { new(lat:number, lon:number, height:number): Observer })(latDeg, lonDeg, 0);
    const time = new AstroTime(dateUtc);
    
    console.log('[TerminatorDebug] Astronomy objects created:', { observer: typeof observer, time: typeof time });
    
    // 首先获取太阳在观测者位置的高度角
    const sunEquator = (EquatorFn as unknown as (body: Body, time: AstroTime, observer?: Observer, ofdate?: boolean, aberration?: boolean) => any)(Body.Sun, time, observer, true, true);
    const sunRa = sunEquator.ra as number;
    const sunDec = sunEquator.dec as number;
    
    console.log('[TerminatorDebug] Sun equatorial coordinates:', { sunRa: sunRa * 180 / Math.PI, sunDec: sunDec * 180 / Math.PI });
    
    // 黄昏点经度是太阳位置经度减去90°（黄昏线在太阳子午线西侧90°）
    // 但这是近似值，准确的计算需要考虑地球曲率和大气折射
    
    // 将太阳赤经赤经转换为经度（简化计算）
    const sunGst = SiderealTime(time); // 格林威治恒星时，单位为小时
    let sunLongitude = (((sunRa - sunGst) * 15) % 360 + 360) % 360;
    if (sunLongitude > 180) sunLongitude -= 360;
    
    // 黄昏点在太阳西侧90°
    let terminatorLon = sunLongitude - 90;
    if (terminatorLon > 180) terminatorLon -= 360;
    if (terminatorLon < -180) terminatorLon += 360;
    
    console.log('[TerminatorDebug] Calculation result:', {
      sunRa: +(sunRa * 180 / Math.PI).toFixed(2),
      sunGst: +sunGst.toFixed(2),
      sunLongitude: +sunLongitude.toFixed(2),
      terminatorLon: +terminatorLon.toFixed(2)
    });
    
    logger.log('terminator/calculation', {
      sunRa: +(sunRa * 180 / Math.PI).toFixed(2),
      sunGst: +sunGst.toFixed(2),
      sunLongitude: +sunLongitude.toFixed(2),
      terminatorLon: +terminatorLon.toFixed(2)
    });
    
    return terminatorLon;
  } catch (error) {
    console.error('[TerminatorDebug] Error in calculation:', error);
    logger.warn('terminator/calculation-error', String(error));
    
    // 回退到基于太阳方向的简单计算
    console.log('[TerminatorDebug] Falling back to simple calculation');
    try {
      // 使用太阳方向向量计算黄昏点（简化版本）
      // 太阳的方位角 + 90° = 黄昏点经度（近似）
      const earthRotation = (dateUtc.getUTCHours() + dateUtc.getUTCMinutes() / 60) * 15; // 地球旋转角度
      const terminatorLon = (earthRotation + 90) % 360;
      return terminatorLon > 180 ? terminatorLon - 360 : terminatorLon;
    } catch (fallbackError) {
      console.error('[TerminatorDebug] Fallback calculation also failed:', fallbackError);
      return 0;
    }
  }
}
