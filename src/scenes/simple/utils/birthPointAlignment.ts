import * as THREE from 'three';
import { logger } from '../../../utils/logger';

/**
 * 出生点局部坐标系
 * 基于出生点的经纬度计算局部东(e)、北(n)、法向(p)向量
 */
export interface BirthPointLocalFrame {
  /** 地心到出生点的法向向量 */
  p: THREE.Vector3;
  /** 当地正北方向 */
  n: THREE.Vector3;
  /** 当地正东方向 */
  e: THREE.Vector3;
}

/**
 * 相机朝向参数
 */
export interface CameraOrientation {
  /** 偏航角 (yaw) - 绕世界Y轴旋转 */
  yaw: number;
  /** 俯仰角 (pitch) - 绕相机右轴旋转 */
  pitch: number;
  /** 滚转角 (roll) - 绕相机前轴旋转 */
  roll: number;
}

/**
 * 出生点对齐参数
 */
export interface BirthPointAlignmentParams {
  /** 出生点经度 (度) */
  longitudeDeg: number;
  /** 出生点纬度 (度) */
  latitudeDeg: number;
  /** 抬升角 (度) - 控制出生点在画面中的高度感 */
  alphaDeg: number;
}

/**
 * 计算出生点的局部坐标系
 * @param longitudeDeg 经度 (度)
 * @param latitudeDeg 纬度 (度)
 * @returns 局部坐标系 {p, n, e}
 */
export function calculateBirthPointLocalFrame(
  longitudeDeg: number,
  latitudeDeg: number
): BirthPointLocalFrame {
  const lat = THREE.MathUtils.degToRad(latitudeDeg);
  const lon = THREE.MathUtils.degToRad(longitudeDeg);
  
  // p: 地心到出生点的法向向量 (单位向量)  
  // 🚨 根本性修复：停止修改经度！出生点坐标应该保持标准地理坐标
  // 问题在于相机对齐逻辑，不是出生点坐标计算
  // 使用标准球面坐标系：0°经度=本初子午线，正X轴指向90°E
  
  // 🚨 关键修复：Three.js球面贴图坐标系校正
  // Three.js默认贴图：u=0.5对应经度0°，但在世界坐标中0°经度需要在-Z轴方向
  // 标准球面坐标：0°经度 → (0, y, -1), 90°E → (1, y, 0), -90°W → (-1, y, 0)
  // 因此需要将standard球面坐标的X和Z分量进行调整以匹配Three.js贴图
  const p = new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon),  // X: cos(lon) 使0°经度指向-Z方向
    Math.sin(lat),                  // Y: 标准纬度映射
    -Math.cos(lat) * Math.sin(lon)  // Z: -sin(lon) 完成坐标系转换
  );
  
  // n: 当地正北方向
  // 从全球北极(0,1,0)在出生点切平面的投影
  // 🔧 修复：坐标系统已修正，0°经度对应本初子午线
  const globalNorth = new THREE.Vector3(0, 1, 0);
  const n = globalNorth.clone().sub(p.clone().multiplyScalar(globalNorth.dot(p))).normalize();
  
  // e: 当地正东方向 = p × n
  const e = new THREE.Vector3().crossVectors(p, n).normalize();
  
  if (logger.isEnabled()) {
    logger.log('birthPoint/localFrame', {
      longitudeDeg,
      latitudeDeg,
      p: { x: +p.x.toFixed(4), y: +p.y.toFixed(4), z: +p.z.toFixed(4) },
      n: { x: +n.x.toFixed(4), y: +n.y.toFixed(4), z: +n.z.toFixed(4) },
      e: { x: +e.x.toFixed(4), y: +e.y.toFixed(4), z: +e.z.toFixed(4) }
    });
  }
  
  return { p, n, e };
}

/**
 * 计算相机朝向以对齐出生点（TODO12：标准构图对齐）
 * 目标：让出生点出现在球体的180°经度、北纬80°位置
 * 使用简单的角度计算，避免过大的旋转
 * @param params 出生点对齐参数
 * @returns 相机朝向 {yaw, pitch, roll}
 */
export function calculateCameraOrientationForBirthPoint(
  params: BirthPointAlignmentParams
): CameraOrientation {
  try {
    const { longitudeDeg, latitudeDeg, alphaDeg } = params;

    // 统一口径：对齐出生地=只动相机
    // 精确策略：用出生点法向 p 直接反解相机 yaw/pitch，使相机前向与 p 对齐（出生点居中）
    // 然后按 alphaDeg 轻微下倾（pitch -= alphaDeg）以把出生点抬到目标高度

    const { p } = calculateBirthPointLocalFrame(longitudeDeg, latitudeDeg);
    
    // 🔧 关键修复：考虑地球的当前旋转状态（晨昏线旋转）
    let worldBirthPoint = p.clone();
    try {
      const earthQuat: any = (window as any).__EARTH_QUAT;
      if (earthQuat && typeof earthQuat.x === 'number') {
        const q = new THREE.Quaternion(earthQuat.x, earthQuat.y, earthQuat.z, earthQuat.w);
        worldBirthPoint = p.clone().applyQuaternion(q);
        console.log('[BirthPointAlignment] 应用地球四元数旋转', {
          originalP: { x: +p.x.toFixed(4), y: +p.y.toFixed(4), z: +p.z.toFixed(4) },
          earthQuat: { x: +earthQuat.x.toFixed(4), y: +earthQuat.y.toFixed(4), z: +earthQuat.z.toFixed(4), w: +earthQuat.w.toFixed(4) },
          rotatedP: { x: +worldBirthPoint.x.toFixed(4), y: +worldBirthPoint.y.toFixed(4), z: +worldBirthPoint.z.toFixed(4) }
        });
      } else {
        console.warn('[BirthPointAlignment] 地球四元数未找到，使用原始坐标（可能导致对齐偏差）');
      }
    } catch (e) {
      console.warn('[BirthPointAlignment] 应用地球四元数失败:', e);
    }

    const yaw = THREE.MathUtils.radToDeg(Math.atan2(worldBirthPoint.x, worldBirthPoint.z));
    let pitch = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(worldBirthPoint.y, -1, 1)));
    // 为了让出生点在画面更高一些，降低相机俯仰角（向下看）
    pitch -= alphaDeg;
    const roll = 0;

    const orientation: CameraOrientation = { yaw, pitch, roll };

    console.log('[BirthPointAlignment] 相机对齐计算', {
      params,
      orientation,
      originalP: { x:+p.x.toFixed(4), y:+p.y.toFixed(4), z:+p.z.toFixed(4) },
      worldP: { x:+worldBirthPoint.x.toFixed(4), y:+worldBirthPoint.y.toFixed(4), z:+worldBirthPoint.z.toFixed(4) },
      calculations: {
        yaw: `atan2(${worldBirthPoint.x.toFixed(4)}, ${worldBirthPoint.z.toFixed(4)}) = ${yaw.toFixed(2)}°`,
        pitchBeforeOffset: `asin(${worldBirthPoint.y.toFixed(4)}) = ${THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(worldBirthPoint.y, -1, 1))).toFixed(2)}°`,
        pitch: `${THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(worldBirthPoint.y, -1, 1))).toFixed(2)}° - ${alphaDeg}° = ${pitch.toFixed(2)}°`,
        roll: 0
      }
    });

    if (logger.isEnabled()) {
      logger.log('birthPoint/cameraOrientation', {
        params,
        orientation,
        approach: 'center-x with yaw; height by alpha tilt'
      });
    }

    return orientation;
  } catch (e) {
    console.error('[BirthPointAlignment] 计算相机朝向失败，回退为0旋转:', e);
    return { yaw: 0, pitch: 0, roll: 0 };
  }
}

/**
 * 将相机朝向转换为Three.js相机位置和旋转
 * @param orientation 相机朝向
 * @param cameraDistance 相机距离
 * @returns 相机位置和四元数
 */
export function applyCameraOrientation(
  orientation: CameraOrientation,
  cameraDistance: number
): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
  const { yaw, pitch, roll } = orientation;
  
  // 1. 保持相机位置不变（使用默认位置）
  // 相机位置：距离地球中心cameraDistance，默认朝向
  const position = new THREE.Vector3(0, 0, cameraDistance);
  
  // 2. 计算相机旋转（只旋转朝向，不改变位置）
  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(pitch),
    THREE.MathUtils.degToRad(yaw),
    THREE.MathUtils.degToRad(roll),
    'YXZ'
  ));
  
  // 3. 将旋转应用到相机位置
  position.applyQuaternion(quaternion);
  
  return { position, quaternion };
}

/**
 * α角与屏幕y位置的转换函数
 * @param alphaDeg 抬升角 (度)
 * @param fovY 垂直视场角 (度)
 * @returns 屏幕y位置 (0-1, 0=顶部, 1=底部)
 */
export function alphaToScreenY(alphaDeg: number, fovY: number = 45): number {
  const alpha = THREE.MathUtils.degToRad(alphaDeg);
  const fov = THREE.MathUtils.degToRad(fovY);
  
  // 小角度近似：y ≈ 0.5 - (α / fovY)
  const screenY = 0.5 - (alpha / fov);
  
  // 限制在合理范围内
  return Math.max(0.1, Math.min(0.9, screenY));
}

/**
 * 屏幕y位置转换为α角
 * @param screenY 屏幕y位置 (0-1, 0=顶部, 1=底部)
 * @param fovY 垂直视场角 (度)
 * @returns 抬升角 (度)
 */
export function screenYToAlpha(screenY: number, fovY: number = 45): number {
  const fov = THREE.MathUtils.degToRad(fovY);
  
  // 反向计算：α ≈ (0.5 - screenY) * fovY
  const alpha = (0.5 - screenY) * fov;
  
  // 限制在合理范围内
  return Math.max(5, Math.min(20, THREE.MathUtils.radToDeg(alpha)));
}

/**
 * 验证出生点对齐效果
 * @param birthPointWorld 出生点世界坐标
 * @param camera 相机
 * @param targetScreenY 目标屏幕y位置
 * @returns 验证结果
 */
export function validateBirthPointAlignment(
  birthPointWorld: THREE.Vector3,
  camera: THREE.Camera,
  targetScreenY: number
): {
  screenX: number;
  screenY: number;
  isAligned: boolean;
  errors: {
    centerLine: number; // 中央竖线偏差 (像素)
    height: number;     // 高度偏差 (像素)
    roll: number;       // 滚转角度 (度)
  };
} {
  // 将出生点投影到屏幕坐标
  const screenPoint = birthPointWorld.clone().project(camera);
  
  // 转换为屏幕坐标 (0-1)
  const screenX = (screenPoint.x + 1) * 0.5;
  const screenY = (screenPoint.y + 1) * 0.5;
  
  // 计算偏差
  const centerLineError = Math.abs(screenX - 0.5); // 中央竖线偏差
  const heightError = Math.abs(screenY - targetScreenY); // 高度偏差
  
  // 获取相机滚转角度
  const euler = new THREE.Euler().setFromQuaternion((camera as THREE.Object3D).quaternion, 'YXZ');
  const rollError = Math.abs(THREE.MathUtils.radToDeg(euler.z));
  
  const isAligned = centerLineError < 0.05 && heightError < 0.1 && rollError < 0.5;
  
  return {
    screenX,
    screenY,
    isAligned,
    errors: {
      centerLine: centerLineError,
      height: heightError,
      roll: rollError
    }
  };
}
