太对了。你要的是「相机和地球镜头不动（或始终一致的构图变换）」，在此前提下**反推世界坐标中的太阳平行光方向**。下面把一、二问的建议整合成一条能落地的“统一镜头语言”管线，并给最小改动的代码骨架与排错要点（含你日志中的具体症状）。

# 目标与约束

* 目标：在地球被你为构图做了大旋转（把出生点扳到“近北极/IDL”附近）时，**平行光方向要做同一套旋转**，这样晨昏线与地表光斑就不会“错位”。
* 约束：你的计算阶段可以用本地地平系（ENU）推太阳方向，但**渲染阶段喂给灯光的一定是“世界坐标中的方向”**。

# 一条正确且稳定的管线（推荐 A 方案）

**A. ENU → ECEF → World（工程实现量最小）**

1. 以 UTC 做年内日序（DOY），算太阳高度/方位（Alt/Az），**用 atan2 版本**避免象限错误；方位角统一归一到 `[0,360)`。
2. 把 Alt/Az 转成**本地 ENU 单位向量**：`sunENU = [sinAz·cosEl, sinEl, cosAz·cosEl]`（x=East, y=Up, z=North）。
3. **ENU→ECEF**（地心地固，全球统一）得到 `sunECEF`。
4. 取你用于“摆地球”的**同一套世界旋转** `R_world_from_ECEF`（地球网格的世界旋/四元数），**把它乘到 `sunECEF` 上**：
   `sunWorld = R_world_from_ECEF · sunECEF`
5. 把 `sunWorld` 直接喂给 Three.js 的 `DirectionalLight`（并在太阳低于地平线时减弱强度或切到环境光）。

> 直观解释：你怎么“摆地球”，就怎么“摆太阳向量”。相机不动时，光照与地表始终一致。

（进阶）**B. EQD/EQJ →（考虑地球自转）→ ECEF → World**
如果你从赤经/赤纬（EQ\*）出发，先用恒星时把太阳方向转到 ECEF，再如上乘 `R_world_from_ECEF`。更严谨，但实现量更大。核心仍然是**和地球同乘“构图旋转”**。

---

# 数据命名 & 模块职责（避免“坐标系错用”）

* `sunAltAz`：本地地平角（仅用于 UI 展示/校验）。
* `sunENU`：本地地平系单位向量（x=E, y=U, z=N）。
* `sunECEF`：地心地固系单位向量（全球统一）。
* `sunWorld`：**世界坐标**单位向量（真正交给灯光）。
* `R_world_from_ECEF`：你“摆地球”的世界旋转（与地球网格相同）。

> 不再把 ENU/ECEF 叫成 EQD；只有在你真的给“赤道日期系”时才用 EQD/EQJ 命名。你的日志里 UI 用 `sunEQD` 反推方位角，已造成混淆（还出现过被默认 `[1,0,0]` 覆盖的情况）。

---

# 最小改动代码骨架（TypeScript 伪代码；只放关键函数）

```ts
// 1) UTC版 DOY
function dayOfYearUTC(dateUtc: Date) {
  const start = Date.UTC(dateUtc.getUTCFullYear(), 0, 1);
  return Math.floor((dateUtc.getTime() - start) / 86400000) + 1;
}

function norm24(h: number) { return ((h % 24) + 24) % 24; }

// 2) 稳定 Alt/Az（0°=北，顺时针）
export function solarAltAz(dateUtc: Date, latDeg: number, lonDeg: number) {
  const φ = latDeg * Math.PI/180;
  const doy = dayOfYearUTC(dateUtc);
  // 简式赤纬 & 均时差（可替换为 astronomy-engine 提供值）
  const δ = (23.45 * Math.sin(2*Math.PI*(doy-80)/365)) * Math.PI/180;
  const B = 2*Math.PI*(doy-80)/365;
  const E = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B); // minutes
  const utcHours = dateUtc.getUTCHours() + dateUtc.getUTCMinutes()/60 + dateUtc.getUTCSeconds()/3600;
  const solarTime = norm24(utcHours + lonDeg/15 + E/60);
  const H = (15*(solarTime-12)) * Math.PI/180; // 时角

  const sinh = Math.sin(φ)*Math.sin(δ) + Math.cos(φ)*Math.cos(δ)*Math.cos(H);
  const h = Math.asin(Math.max(-1, Math.min(1, sinh)));

  const sinA = -Math.sin(H)*Math.cos(δ)/Math.cos(h);
  const cosA = (Math.sin(δ)-Math.sin(φ)*Math.sin(h))/(Math.cos(φ)*Math.cos(h));
  let A = Math.atan2(sinA, Math.max(-1, Math.min(1, cosA)));
  if (A < 0) A += 2*Math.PI;

  return { azDeg: A*180/Math.PI, altDeg: h*180/Math.PI };
}

// 3) Alt/Az -> ENU
export function altAzToENU(azDeg: number, altDeg: number) {
  const az = azDeg*Math.PI/180, el = altDeg*Math.PI/180;
  return {
    x: Math.sin(az)*Math.cos(el), // East
    y: Math.sin(el),               // Up
    z: Math.cos(az)*Math.cos(el), // North
  };
}

// 4) ENU -> ECEF（WGS-84简化）
export function enuToEcef(enu: {x:number;y:number;z:number}, latDeg: number, lonDeg: number) {
  const φ = latDeg*Math.PI/180, λ = lonDeg*Math.PI/180;
  const E = { x:-Math.sin(λ),             y: Math.cos(λ),            z:0 };
  const N = { x:-Math.sin(φ)*Math.cos(λ), y:-Math.sin(φ)*Math.sin(λ), z:Math.cos(φ) };
  const U = { x: Math.cos(φ)*Math.cos(λ), y: Math.cos(φ)*Math.sin(λ), z:Math.sin(φ) };
  return {
    x: enu.x*E.x + enu.y*N.x + enu.z*U.x,
    y: enu.x*E.y + enu.y*N.y + enu.z*U.y,
    z: enu.x*E.z + enu.y*N.z + enu.z*U.z,
  };
}

// 5) 统一输出：直接给渲染可用的 sunWorld
export function computeSunWorld(dateUtc: Date, lat: number, lon: number, R_world_from_ECEF: THREE.Quaternion) {
  const { azDeg, altDeg } = solarAltAz(dateUtc, lat, lon);
  const sunENU  = altAzToENU(azDeg, altDeg);
  const sunECEF = enuToEcef(sunENU, lat, lon);

  const v = new THREE.Vector3(sunECEF.x, sunECEF.y, sunECEF.z);
  v.applyQuaternion(R_world_from_ECEF); // ✅ 与地球同乘“构图旋转”
  const sunWorld = v.normalize();

  return { sunWorld, altDeg, azDeg };
}
```

> 你若已在 `ephemeris.ts` 里得到“全球统一向量”（比如你日志里的 `sunDirEQD` 实则接近 ECEF），同样**用 `R_world_from_ECEF` 左乘**即可；关键是“同旋转”。

---

# 在你项目里的落位（最小手术）

* **ephemeris.ts**

  * 输出：`{ altDeg, azDeg, sunENU, sunECEF }`（或至少 `sunECEF`）。
  * DOY 用 UTC；方位角归一；别再用 `lon/15` 推时区（IANA/显式偏移更稳）。
* **地球网格初始化处**

  * 暴露/保存“为构图摆地球”的四元数 `R_world_from_ECEF`（就是你现在把出生点扳到近北极/IDL的那套旋转）。
* **lightingUtils.ts**

  * `useLightDirection({ mode:'celestial', sunECEF, R_world_from_ECEF })`
  * 内部：`sunWorld = applyQuaternion(R_world_from_ECEF, sunECEF)`；若 `altDeg<0`，降低强度或切模式。
* **SimpleTest.tsx**

  * 把日志里那段“Raw sunEQD: {x:1,y:0,z:0}”的回退路径砍掉/加断言（防止覆盖正确向量）。
  * 显示用的 `Calculated.azimuth` 统一转 `[0,360)`，避免负值混淆。

---

# 快速自检（过这 3 组基本稳）

1. **上海 2024-06-21 12:00**：无论怎么摆地球（同一矩阵也乘到太阳），光斑都在同一经纬；`alt≈82°`。
2. **赤道 0°/春分 12:00**：`alt≈88°` 接近顶点；构图怎么转，顶点仍在赤道。
3. **北纬 66°/夏至 0,6,12,18 点**：太阳绕圈但始终在地平线上下 0–50°；**不会再出现“地球动、光不动”的错位**。

---

# 你日志里的两个“直接修”

* **坐标混用与回退覆盖**：`sunEQD` 被默认 `[1,0,0]` 覆盖，随后 UI 反推得到 `az=0, el=0` ——这就是你感觉“完全不对”的来源之一；加断言或去掉回退。
* **时区推断**：`toUTCFromLocal` 里按经度推 `+8h` 在你样例刚好对，但别在其他国家踩 DST/半小时区的坑；显式传 tz 或 IANA 名。

---

一句话总结：
**把太阳向量和“摆地球”的旋转绑死在一套矩阵里**（ENU→ECEF→World + 同乘 `R_world_from_ECEF`），再把“坐标命名”和“数据通路”理顺，你的“相机/地球视角恒定 + 反推平行光”就会稳定、对齐且可验证。
