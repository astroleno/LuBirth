export function createFallbackTextures(THREE: any) {
  const make = (rgba: [number, number, number, number], colorSpace: unknown) => {
    const texture = new THREE.DataTexture(new Uint8Array(rgba), 1, 1, THREE.RGBAFormat);
    if ('colorSpace' in texture) texture.colorSpace = colorSpace;
    else if ('encoding' in texture) texture.encoding = colorSpace === THREE.SRGBColorSpace ? THREE.sRGBEncoding : THREE.LinearEncoding;
    texture.needsUpdate = true;
    return texture;
  };
  return {
    day: make([45, 92, 130, 255], THREE.SRGBColorSpace),
    night: make([4, 8, 18, 255], THREE.SRGBColorSpace),
    normal: make([128, 128, 255, 255], THREE.NoColorSpace),
    displacement: make([128, 128, 128, 255], THREE.NoColorSpace),
    specular: make([50, 50, 50, 255], THREE.NoColorSpace),
    cloud: make([210, 220, 230, 120], THREE.SRGBColorSpace),
    moon: make([170, 166, 158, 255], THREE.SRGBColorSpace),
    stars: make([8, 12, 28, 255], THREE.SRGBColorSpace),
  };
}
