import {
  AstroTime,
  Body,
  GeoVector,
  Observer,
  ObserverVector,
  RotateVector,
  Rotation_EQJ_EQD,
  Vector,
  Horizon
} from 'astronomy-engine';

export type Ephemeris = {
  time: Date;
  // 标准化坐标系命名
  sunWorld: { x: number; y: number; z: number };  // 世界坐标系太阳方向
  moonWorld: { x: number; y: number; z: number }; // 世界坐标系月球方向
  observerECEF: { x: number; y: number; z: number }; // 观测者地心坐标
  // 天文角度信息（用于验证和UI显示）
  altDeg: number;   // 太阳高度角
  azDeg: number;    // 太阳方位角（0°=北，顺时针）
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
  
  // 6. 黄道倾角
  const epsilon = 23.439291 - T * 0.0130042;
  const epsilonRad = epsilon * Math.PI / 180;
  
  // 7. 太阳赤经和赤纬（黄道→赤道坐标转换）
  const sinAlpha = Math.cos(epsilonRad) * Math.sin(Lrad);
  const cosAlpha = Math.cos(Lrad);
  const alpha = Math.atan2(sinAlpha, cosAlpha);  // 太阳赤经
  
  const sinDelta = Math.sin(epsilonRad) * Math.sin(Lrad);
  const delta = Math.asin(sinDelta);  // 太阳赤纬
  
  // 8. 格林威治平恒星时（地球自转）
  const theta0 = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
  
  // 9. 当地恒星时（考虑观测者经度）- 保持度数单位
  const localSiderealTimeDeg = (theta0 + lonDeg) % 360;
  const theta = localSiderealTimeDeg * Math.PI / 180;  // 当地恒星时（弧度）
  
  // 10. 时角（恒星时 - 赤经）
  const H = theta - alpha;  // 时角
  
  // 11. 地平坐标计算（球面天文学标准公式）
  const sinAlt = Math.sin(φ) * Math.sin(delta) + Math.cos(φ) * Math.cos(delta) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  
  const sinAz = -Math.sin(H) * Math.cos(delta) / Math.cos(altitude);
  const cosAz = (Math.sin(delta) - Math.sin(φ) * Math.sin(altitude)) / (Math.cos(φ) * Math.cos(altitude));
  let azimuth = Math.atan2(sinAz, cosAz);
  
  // 方位角转换为0-360度范围（0°=北，顺时针）
  if (azimuth < 0) azimuth += 2 * Math.PI;
  
  return { 
    azDeg: azimuth * 180 / Math.PI,    // 0°=北，顺时针
    altDeg: altitude * 180 / Math.PI   // 高度角
  };
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

export function computeEphemeris(dateUtc: Date, lat: number, lon: number): Ephemeris {
  console.log(`[computeEphemeris] ${dateUtc.toISOString()} at ${lat}°N,${lon}°E:`);
  
  // === 标准化天文学坐标转换算法 ===
  // 基于advice建议的稳定坐标转换链：Alt/Az → ENU → ECEF → World
  
  // 1. 标准太阳高度角/方位角计算
  const { azDeg, altDeg } = solarAltAz(dateUtc, lat, lon);
  console.log(`  Solar position: az=${azDeg.toFixed(1)}°, alt=${altDeg.toFixed(1)}°`);
  
  // 2. 转为ENU本地坐标系
  const sunENU = altAzToENU(azDeg, altDeg);
  console.log(`  Sun ENU: [${sunENU.x.toFixed(3)}, ${sunENU.y.toFixed(3)}, ${sunENU.z.toFixed(3)}]`);
  
  // 3. ENU → ECEF（地心地固坐标系）
  const sunECEF = enuToECEF(sunENU, lat, lon);
  console.log(`  Sun ECEF: [${sunECEF.x.toFixed(3)}, ${sunECEF.y.toFixed(3)}, ${sunECEF.z.toFixed(3)}]`);
  
  // 4. ECEF即为我们的世界坐标系（目前不施加构图旋转）
  const sunWorld = { ...sunECEF };
  
  // 5. 观测者ECEF坐标
  const latRad = lat * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;
  const observerECEF = {
    x: Math.cos(latRad) * Math.cos(lonRad),
    y: Math.cos(latRad) * Math.sin(lonRad),
    z: Math.sin(latRad)
  };
  
  // 6. 月亮简化计算（相对太阳位置）
  const moonWorld = {
    x: -sunWorld.x * 0.5,
    y: Math.abs(sunWorld.y) * 0.3,
    z: -sunWorld.z * 0.5
  };
  
  // 归一化月亮方向
  const moonLen = len(moonWorld);
  const moonWorldNormalized = {
    x: moonWorld.x / moonLen,
    y: moonWorld.y / moonLen,
    z: moonWorld.z / moonLen
  };
  
  // 7. 月相计算
  const cosPhase = dot(sunWorld, moonWorldNormalized);
  const phaseAngle = Math.acos(Math.min(1, Math.max(-1, cosPhase)));
  const illumination = (1 + Math.cos(phaseAngle)) / 2;
  
  console.log(`  Sun world direction: [${sunWorld.x.toFixed(3)}, ${sunWorld.y.toFixed(3)}, ${sunWorld.z.toFixed(3)}]`);
  
  return {
    time: dateUtc,
    sunWorld,
    moonWorld: moonWorldNormalized,
    observerECEF,
    altDeg,
    azDeg,
    illumination
  };
}

export function offsetHoursFromLongitude(lon: number): number {
  // Simple whole-hour time zone from longitude; Shanghai ~ +8
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
  
  // Create UTC date by subtracting the timezone offset from local time
  const utc = new Date(Date.UTC(y, mo, d, h - offset, mi, 0));
  
  console.log(`[toUTCFromLocal] ${localISO} (lon:${lon}) -> UTC: ${utc.toISOString()} (offset: ${offset}h)`);
  return utc;
}

