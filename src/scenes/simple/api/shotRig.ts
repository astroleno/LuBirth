import * as THREE from 'three';

export type ShotRigParams = {
  targetLatDeg: number; // 目标纬度，例如 80（表示80°N）
  targetLonDeg: number; // 目标经度，例如 180（表示经度在国际日期变更线附近）
};

// 创建一个ShotRig：包含一个组（地球与相机可统一旋转）以及一个帮助方法将指定经纬度旋到屏幕中心
export function createShotRig(): { rig: THREE.Group; alignToLatLon: (earth: THREE.Object3D, camera: THREE.Camera, params: ShotRigParams) => void } {
  const rig = new THREE.Group();

  // 将地球上经纬度转换为球面点
  function latLonToVector3(radius: number, latDeg: number, lonDeg: number): THREE.Vector3 {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lon);
    return new THREE.Vector3(x, y, z);
  }

  function alignToLatLon(earth: THREE.Object3D, camera: THREE.Camera, params: ShotRigParams) {
    try {
      // 1) 估计地球半径（按缩放最大分量）
      const radius = Math.max(earth.scale.x, earth.scale.y, earth.scale.z) || 1;
      const surface = latLonToVector3(radius, params.targetLatDeg, params.targetLonDeg).normalize();

      // 2) 第一步：将该地面法线旋到世界+Y（让目标点到屏幕上沿）
      const q1 = new THREE.Quaternion().setFromUnitVectors(surface, new THREE.Vector3(0, 1, 0));
      earth.quaternion.premultiply(q1);

      // 3) 第二步：绕世界+Y旋转，使经度方向（东向切线）指向屏幕中心（使目标点位于正上、经线指向-Z）
      // 经过q1后，目标点在+Y；其局部“东向”可以用 worldEast = normalize(cross(+Y, 原始法线))，再旋到-Z
      const originalNormal = surface.clone();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const east = new THREE.Vector3().crossVectors(worldUp, originalNormal).normalize();
      // 目标屏幕前向取 -Z（right-handed 摄像机常见朝 -Z 看原点）
      const screenForward = new THREE.Vector3(0, 0, -1);
      // 旋转角度 = 东向在XZ平面投影与 -Z 的夹角
      const eastXZ = new THREE.Vector3(east.x, 0, east.z).normalize();
      let yaw = Math.atan2(eastXZ.x, -eastXZ.z); // 将east指向-Z
      const q2 = new THREE.Quaternion().setFromAxisAngle(worldUp, -yaw);
      earth.quaternion.premultiply(q2);

      // 4) 相机对准地球中心
      if ('lookAt' in camera) (camera as THREE.PerspectiveCamera).lookAt(0, 0, 0);
    } catch (err) {
      console.error('[alignToLatLon] failed:', err);
    }
  }

  return { rig, alignToLatLon };
}


