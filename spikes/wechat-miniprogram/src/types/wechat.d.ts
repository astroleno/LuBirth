declare const wx: any;
declare function App(options: any): void;
declare function Page(options: any): void;
declare function getApp<T = any>(): T;

declare const __RESOURCE_BASE_URL__: string;
declare const __SPIKE_BUILD__: {
  builtAt: string;
  revision: string;
  dirty: boolean;
  dependencyLockSha256: string;
  assetManifestSha256: string;
  astroSourceSha256: string;
  r160Version: string;
  r108AdapterVersion: string;
};

declare module 'threejs-miniprogram' {
  export function createScopedThreejs(canvas: unknown): any;
}
