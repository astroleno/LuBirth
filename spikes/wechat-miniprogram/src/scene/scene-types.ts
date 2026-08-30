export type SceneTextureBundle = {
  earthDay?: any;
  earthNight?: any;
  earthNormal?: any;
  earthSpecular?: any;
  earthDisplacement?: any;
  clouds?: any;
  moon?: any;
  moonNormal?: any;
  moonDisplacement?: any;
  stars?: any;
};

export type ScenePass<T = any> = {
  object: T;
  material: any;
  dispose(): void;
};
