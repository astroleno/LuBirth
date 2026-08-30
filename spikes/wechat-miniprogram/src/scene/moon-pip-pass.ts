import { createMoonPass } from './moon-pass.ts';
import type { SceneTextureBundle } from './scene-types.ts';

export function shouldRenderPip(lastRenderedAt: number, now: number, fps: number): boolean {
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('PIP fps must be positive');
  return !Number.isFinite(lastRenderedAt) || now - lastRenderedAt >= 1000 / fps;
}

type MoonPipOptions = {
  THREE: any;
  renderer: any;
  textures: SceneTextureBundle;
  fallback: any;
  lightRayDirection: any;
  resolution: 256 | 512;
  fps: number;
  enabled: boolean;
  screenX: number;
  screenY: number;
  size: number;
  viewportWidth: number;
  viewportHeight: number;
};

export class MoonPipPass {
  readonly scene: any;
  readonly camera: any;
  readonly overlayScene: any;
  readonly overlayCamera: any;
  readonly moon: any;
  renderTarget: any;
  private readonly THREE: any;
  private readonly renderer: any;
  private readonly moonPass: ReturnType<typeof createMoonPass>;
  private readonly overlayMaterial: any;
  private readonly overlayGeometry: any;
  private readonly overlayQuad: any;
  private enabled: boolean;
  private fps: number;
  private lastRenderedAt = Number.NEGATIVE_INFINITY;

  constructor(options: MoonPipOptions) {
    this.THREE = options.THREE;
    this.renderer = options.renderer;
    this.enabled = options.enabled;
    this.fps = options.fps;
    this.scene = new options.THREE.Scene();
    this.scene.name = 'moonPipScene';
    this.camera = new options.THREE.PerspectiveCamera(34, 1, 0.1, 10);
    this.camera.position.set(0, 0, 3);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    this.moonPass = createMoonPass(
      options.THREE,
      options.textures,
      options.fallback,
      options.lightRayDirection,
    );
    this.moon = this.moonPass.object;
    this.scene.add(this.moon);

    this.renderTarget = this.createRenderTarget(options.resolution);
    this.overlayScene = new options.THREE.Scene();
    this.overlayScene.name = 'moonPipOverlayScene';
    this.overlayCamera = new options.THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.overlayGeometry = new options.THREE.PlaneGeometry(2, 2);
    this.overlayMaterial = new options.THREE.MeshBasicMaterial({
      map: this.renderTarget.texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    this.overlayQuad = new options.THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
    this.overlayQuad.name = 'moonPipOverlayQuad';
    this.overlayScene.add(this.overlayQuad);
    this.setLayout(options.screenX, options.screenY, options.size, options.viewportWidth, options.viewportHeight);
  }

  render(now: number): boolean {
    if (!this.enabled || !shouldRenderPip(this.lastRenderedAt, now, this.fps)) return false;
    const previousTarget = this.renderer.getRenderTarget?.() ?? null;
    const previousAutoClear = this.renderer.autoClear;
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.autoClear = true;
    this.renderer.clear?.(true, true, true);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(previousTarget);
    this.renderer.autoClear = previousAutoClear;
    this.lastRenderedAt = now;
    return true;
  }

  composite(): void {
    if (!this.enabled) return;
    const previousAutoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.clearDepth?.();
    this.renderer.render(this.overlayScene, this.overlayCamera);
    this.renderer.autoClear = previousAutoClear;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.overlayQuad.visible = enabled;
  }

  setFps(fps: number): void {
    if (!Number.isFinite(fps) || fps <= 0) throw new Error('PIP fps must be positive');
    this.fps = fps;
  }

  setResolution(resolution: 256 | 512): void {
    if (this.renderTarget.width === resolution && this.renderTarget.height === resolution) return;
    const previous = this.renderTarget;
    this.renderTarget = this.createRenderTarget(resolution);
    this.overlayMaterial.map = this.renderTarget.texture;
    this.overlayMaterial.needsUpdate = true;
    previous.dispose();
    this.lastRenderedAt = Number.NEGATIVE_INFINITY;
  }

  setLayout(screenX: number, screenY: number, size: number, viewportWidth: number, viewportHeight: number): void {
    const aspect = Math.max(1, viewportWidth) / Math.max(1, viewportHeight);
    this.overlayQuad.position.set(screenX * 2 - 1, 1 - screenY * 2, 0);
    this.overlayQuad.scale.set(size, size * aspect, 1);
  }

  updateLightRay(direction: any): void {
    this.moonPass.material.uniforms.lightDir.value.copy(direction).normalize();
    this.lastRenderedAt = Number.NEGATIVE_INFINITY;
  }

  dispose(): void {
    this.renderTarget.dispose();
    this.overlayGeometry.dispose();
    this.overlayMaterial.dispose();
    this.moonPass.dispose();
  }

  private createRenderTarget(resolution: number): any {
    const target = new this.THREE.WebGLRenderTarget(resolution, resolution, {
      minFilter: this.THREE.LinearFilter,
      magFilter: this.THREE.LinearFilter,
      format: this.THREE.RGBAFormat,
      depthBuffer: true,
      stencilBuffer: false,
    });
    target.texture.name = `moon-pip-${resolution}`;
    return target;
  }
}
