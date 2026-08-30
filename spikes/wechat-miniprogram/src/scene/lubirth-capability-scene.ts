import type { AssetTier, ExperimentScenario } from '../config/scenarios.ts';
import { TouchCameraController } from '../input/touch-camera-controller.ts';
import { createAtmospherePass } from './atmosphere-pass.ts';
import { createCloudPass } from './cloud-pass.ts';
import { createEarthPass } from './earth-pass.ts';
import { moonLightRayInPip } from './moon-pass.ts';
import { MoonPipPass } from './moon-pip-pass.ts';
import type { SceneTextureBundle } from './scene-types.ts';
import { createStarBackground } from './star-background.ts';
import { createFallbackTextures } from './texture-fallbacks.ts';

type AstroVectors = {
  sunWorld: { x: number; y: number; z: number };
  moonWorld: { x: number; y: number; z: number };
};

type SceneOptions = {
  THREE: any;
  renderer: any;
  scenario: ExperimentScenario;
  assetTier: AssetTier;
  textures?: SceneTextureBundle;
  astro?: AstroVectors;
  pipEnabled: boolean;
  pipResolution: 256 | 512;
  viewportWidth?: number;
  viewportHeight?: number;
};

export function latLonToWorld(latDeg: number, lonDeg: number, radius: number) {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;
  return {
    x: radius * Math.cos(lat) * Math.cos(lon),
    y: radius * Math.sin(lat),
    z: radius * Math.cos(lat) * Math.sin(lon),
  };
}

export function resizeCapabilityViewport(
  renderer: any,
  scene: LubirthCapabilityScene,
  scenario: ExperimentScenario,
  width: number,
  height: number,
) {
  renderer.setSize(width, height, false);
  scene.resize(width, height, scenario);
  return scene.pip.layoutSnapshot();
}

export class LubirthCapabilityScene {
  readonly scene: any;
  readonly camera: any;
  readonly earthGroup: any;
  readonly earth: any;
  readonly clouds: any;
  readonly atmosphere: any;
  readonly stars: any;
  readonly birthMarker: any;
  readonly directionalLight: any;
  readonly pip: MoonPipPass;
  readonly touchController: TouchCameraController;
  private readonly THREE: any;
  private readonly renderer: any;
  private readonly fallbacks: ReturnType<typeof createFallbackTextures>;
  private readonly passes: Array<{ dispose(): void }>;
  private disposed = false;
  private lastFrameAt: number | null = null;

  constructor(options: SceneOptions) {
    this.THREE = options.THREE;
    this.renderer = options.renderer;
    const textures = options.textures ?? {};
    this.fallbacks = createFallbackTextures(options.THREE);
    this.scene = new options.THREE.Scene();
    this.scene.name = 'lubirthCapabilityMainScene';
    this.scene.background = new options.THREE.Color(0x000000);

    this.camera = new options.THREE.PerspectiveCamera(
      options.scenario.camera.fovDeg,
      Math.max(1, options.viewportWidth ?? 1) / Math.max(1, options.viewportHeight ?? 1),
      0.01,
      100,
    );
    this.camera.name = 'mainCamera';
    this.touchController = new TouchCameraController(this.camera, {
      azimuthDeg: options.scenario.camera.azimuthDeg,
      elevationDeg: options.scenario.camera.elevationDeg,
      distance: options.scenario.camera.distance,
      minDistance: 1.65,
      maxDistance: 8,
    });
    this.touchController.setViewport(options.viewportWidth ?? 1, options.viewportHeight ?? 1);

    this.earthGroup = new options.THREE.Group();
    this.earthGroup.name = 'earthGroup';
    this.earthGroup.rotation.order = 'YXZ';
    this.earthGroup.rotation.set(0, options.scenario.earthYawDeg * Math.PI / 180, 0);
    this.scene.add(this.earthGroup);

    const rayDirection = options.scenario.fixedSunDirection;
    const earthPass = createEarthPass(options.THREE, textures, this.fallbacks, rayDirection);
    const cloudPass = createCloudPass(options.THREE, textures, this.fallbacks, rayDirection);
    const atmospherePass = createAtmospherePass(options.THREE, rayDirection);
    const starPass = createStarBackground(options.THREE, textures, this.fallbacks);
    this.earth = earthPass.object;
    this.clouds = cloudPass.object;
    this.atmosphere = atmospherePass.object;
    this.stars = starPass.object;
    this.earthGroup.add(this.earth, this.clouds, this.atmosphere);
    this.scene.add(this.stars);

    const markerPosition = latLonToWorld(
      options.scenario.observer.latDeg,
      options.scenario.observer.lonDeg,
      1.025,
    );
    const markerGeometry = new options.THREE.SphereGeometry(0.018, 16, 8);
    const markerMaterial = new options.THREE.MeshBasicMaterial({ color: 0xffb75a, toneMapped: false });
    this.birthMarker = new options.THREE.Mesh(markerGeometry, markerMaterial);
    this.birthMarker.name = 'birthPointMarker';
    this.birthMarker.position.set(markerPosition.x, markerPosition.y, markerPosition.z);
    this.earthGroup.add(this.birthMarker);

    this.directionalLight = new options.THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.name = 'singleSunDirectionalLight';
    this.directionalLight.position.set(-rayDirection[0], -rayDirection[1], -rayDirection[2]).multiplyScalar(10);
    this.scene.add(this.directionalLight);

    const defaultAstro = {
      sunWorld: { x: -rayDirection[0], y: -rayDirection[1], z: -rayDirection[2] },
      moonWorld: { x: 0, y: 0, z: -1 },
    };
    const moonRay = moonLightRayInPip(
      options.THREE,
      (options.astro ?? defaultAstro).sunWorld,
      (options.astro ?? defaultAstro).moonWorld,
    );
    this.pip = new MoonPipPass({
      THREE: options.THREE,
      renderer: options.renderer,
      textures,
      fallback: this.fallbacks,
      lightRayDirection: moonRay,
      resolution: options.pipResolution,
      fps: options.scenario.pip.fps,
      enabled: options.pipEnabled,
      screenX: options.scenario.pip.screenX,
      screenY: options.scenario.pip.screenY,
      size: options.scenario.pip.size,
      viewportWidth: options.viewportWidth ?? 1,
      viewportHeight: options.viewportHeight ?? 1,
    });
    this.passes = [earthPass, cloudPass, atmospherePass, starPass];
    this.passes.push({
      dispose: () => {
        markerGeometry.dispose();
        markerMaterial.dispose();
      },
    });
  }

  render(now: number): void {
    if (this.disposed) return;
    if (this.lastFrameAt !== null) {
      const deltaMs = Math.max(0, Math.min(100, now - this.lastFrameAt));
      this.earthGroup.rotation.y += deltaMs / 240_000 * Math.PI * 2;
    }
    this.lastFrameAt = now;
    this.pip.render(now);
    this.renderer.setRenderTarget(null);
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    this.pip.composite();
  }

  resize(width: number, height: number, scenario: ExperimentScenario): void {
    this.camera.aspect = Math.max(1, width) / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.touchController.setViewport(width, height);
    this.pip.setLayout(scenario.pip.screenX, scenario.pip.screenY, scenario.pip.size, width, height);
  }

  auditInvariants() {
    const directionalLights: any[] = [];
    const mainMoons: any[] = [];
    this.scene.traverse((object: any) => {
      if (object.isDirectionalLight) directionalLights.push(object);
      if (/moon/i.test(object.name ?? '')) mainMoons.push(object);
    });
    const pipLayout = this.pip.layoutSnapshot();
    const earthUniforms = this.earth.material?.uniforms ?? {};
    const atmosphereMain = this.atmosphere.getObjectByName?.('atmosphereMainShell');
    const atmosphereNear = this.atmosphere.getObjectByName?.('atmosphereNearShell');
    const firstCloudLayer = this.clouds.children?.[0];
    const cloudUniforms = firstCloudLayer?.material?.uniforms ?? {};
    return {
      singleDirectionalLight: directionalLights.length === 1,
      cameraIndependent: this.camera.parent !== this.earthGroup,
      starsIndependent: this.stars.parent === this.scene,
      moonAbsentFromMainScene: mainMoons.length === 0,
      pipUsesRenderTarget: Boolean(this.pip.renderTarget?.isWebGLRenderTarget),
      pipLayoutFixed: Number.isFinite(pipLayout.screenX)
        && Number.isFinite(pipLayout.screenY)
        && Math.abs(pipLayout.widthPx - pipLayout.heightPx) <= 0.01,
      earthAxisYUp: this.earthGroup.rotation.x === 0 && this.earthGroup.rotation.z === 0,
      productionEarthEffects: earthUniforms.nightGlowBlur?.value > 0
        && earthUniforms.nightGlowOpacity?.value > 0
        && earthUniforms.rimStrength?.value > 0
        && earthUniforms.dayDiffuseMax?.value > 0,
      productionAtmosphereEffects: Boolean(
        atmosphereMain?.material?.uniforms?.scaleHeight?.value > 0
        && atmosphereMain?.material?.uniforms?.softBoundaryDelta?.value > 0
        && atmosphereNear?.material?.uniforms?.nearStrength?.value > 0,
      ),
      productionCloudEffects: this.clouds.children?.length === 6
        && cloudUniforms.useVolumeScattering?.value === true
        && cloudUniforms.useThicknessMapping?.value === true
        && cloudUniforms.useFresnel?.value === true,
    };
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.pip.dispose();
    for (const pass of this.passes) pass.dispose();
    for (const texture of Object.values(this.fallbacks) as any[]) texture.dispose();
    if (typeof this.scene.clear === 'function') this.scene.clear();
    else while (this.scene.children.length > 0) this.scene.remove(this.scene.children[0]);
  }
}
