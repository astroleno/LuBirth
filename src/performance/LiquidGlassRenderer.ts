import * as THREE from 'three';

const vertexShader = `
precision highp float;
attribute vec3 position;
uniform vec4 rect;
uniform vec2 viewport;
void main() {
  vec2 pixel = rect.xy + (position.xy + 0.5) * rect.zw;
  gl_Position = vec4(pixel / viewport * 2.0 - 1.0, 0.0, 1.0);
}`;

// Sample the final display-referred framebuffer: do not tone-map or recolor the scene a second time.
const fragmentShader = `
precision highp float;
uniform sampler2D backdrop;
uniform vec2 viewport;
uniform float pixelRatio;
uniform vec4 rect;
uniform float radius;
uniform float strength;
void main() {
  vec2 pixel = gl_FragCoord.xy / pixelRatio;
  vec2 halfSize = rect.zw * 0.5;
  vec2 p = pixel - rect.xy - halfSize;
  float r = min(radius, min(halfSize.x, halfSize.y));
  vec2 q = abs(p) - halfSize + r;
  float distance = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  if (distance > 0.0) discard;
  vec2 normal = normalize(p - clamp(p, -halfSize + r, halfSize - r) + vec2(0.0001));
  float depth = -distance;
  float bevel = min(20.0, r);
  float lens = sin(clamp(depth / bevel, 0.0, 1.0) * 3.14159265);
  vec2 offset = -normal * lens * strength - p * 0.018;
  vec2 uv = clamp((pixel + offset) / viewport, 0.001, 0.999);
  vec2 fringe = normal * lens * 0.65 / viewport;
  vec3 color = vec3(texture2D(backdrop, uv + fringe).r,
                    texture2D(backdrop, uv).g,
                    texture2D(backdrop, uv - fringe).b);
  // Subtle optical transmission and opposing light rims; the readable tint lives in CSS.
  float rim = exp(-depth * 0.72);
  float glint = pow(abs(dot(normal, normalize(vec2(-0.65, 0.76)))), 5.0);
  color = color * 0.98 + vec3(0.78, 0.88, 1.0) * rim * (0.06 + 0.36 * glint);
  color += vec3(0.36, 0.49, 0.65) * lens * 0.035;
  gl_FragColor = vec4(color, 1.0);
}`;

type GlassRect = { rect: THREE.Vector4; radius: number; strength: number };

/** One framebuffer copy and at most three small glass draws, in the existing WebGL context. */
export class LiquidGlassRenderer {
  private texture: THREE.FramebufferTexture | null = null;
  private geometry = new THREE.PlaneGeometry(1, 1);
  private material = new THREE.RawShaderMaterial({
    vertexShader, fragmentShader, depthTest: false, depthWrite: false,
    uniforms: {
      backdrop: { value: null }, viewport: { value: new THREE.Vector2() },
      pixelRatio: { value: 1 }, rect: { value: new THREE.Vector4() },
      radius: { value: 26 }, strength: { value: 13 },
    },
  });
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private mesh = new THREE.Mesh(this.geometry, this.material);
  private origin = new THREE.Vector2();
  private rects: GlassRect[] = [];
  private dirty = true;
  private width = 0;
  private height = 0;
  private root: HTMLElement;
  private observer: ResizeObserver;
  private observed = new Set<HTMLElement>();
  private mutations: MutationObserver;
  private reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
  private contrast = window.matchMedia('(prefers-contrast: more)');
  readonly stats = { active: false, draws: 0, copies: 0, textureBytes: 0 };
  private markDirty = () => { this.dirty = true; };

  constructor(private canvas: HTMLCanvasElement) {
    this.root = canvas.closest('.canvas-wrap') as HTMLElement;
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    this.observer = new ResizeObserver(this.markDirty);
    this.observer.observe(this.root);
    this.mutations = new MutationObserver(this.markDirty);
    this.mutations.observe(this.root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
    this.root.addEventListener('scroll', this.markDirty, true);
    this.root.addEventListener('transitionend', this.markDirty, true);
    this.reducedTransparency.addEventListener('change', this.markDirty);
    this.contrast.addEventListener('change', this.markDirty);
  }

  private measure() {
    this.dirty = false;
    this.rects = [];
    const canvasRect = this.canvas.getBoundingClientRect();
    this.width = canvasRect.width;
    this.height = canvasRect.height;
    const elements = new Set(this.root.querySelectorAll<HTMLElement>('[data-liquid-glass]'));
    for (const element of this.observed) {
      if (!elements.has(element)) this.observer.unobserve(element);
    }
    for (const element of elements) {
      if (!this.observed.has(element)) this.observer.observe(element);
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height || box.bottom <= 0 || box.top >= this.height || element.closest('[hidden]')) continue;
      this.rects.push({
        rect: new THREE.Vector4(box.left - canvasRect.left, canvasRect.bottom - box.bottom, box.width, box.height),
        radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 26,
        strength: element.classList.contains('client-panel') ? 16 : 10,
      });
    }
    this.observed = elements;
  }

  render(gl: THREE.WebGLRenderer, enabled: boolean) {
    this.stats.active = false;
    this.stats.draws = 0;
    if (this.dirty) this.measure();
    if (!enabled || this.reducedTransparency.matches || this.contrast.matches || !this.rects.length) {
      this.texture?.dispose();
      this.texture = null;
      this.stats.textureBytes = 0;
      return;
    }
    const width = this.canvas.width, height = this.canvas.height;
    if (!this.texture || this.texture.image.width !== width || this.texture.image.height !== height) {
      this.texture?.dispose();
      this.texture = new THREE.FramebufferTexture(width, height);
      this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
      this.material.uniforms.backdrop.value = this.texture;
      this.stats.textureBytes = width * height * 4;
    }
    // Runtime is Three r160; installed ambient types describe the newer reversed argument order.
    const copyFramebuffer = gl.copyFramebufferToTexture as unknown as (position: THREE.Vector2, texture: THREE.Texture) => void;
    copyFramebuffer.call(gl, this.origin, this.texture);
    this.stats.copies++;
    this.material.uniforms.viewport.value.set(this.width, this.height);
    this.material.uniforms.pixelRatio.value = width / this.width;
    const autoClear = gl.autoClear;
    gl.autoClear = false;
    try {
      for (const region of this.rects) {
        this.material.uniforms.rect.value.copy(region.rect);
        this.material.uniforms.radius.value = region.radius;
        this.material.uniforms.strength.value = region.strength;
        gl.render(this.scene, this.camera);
        this.stats.draws++;
      }
      this.stats.active = true;
    } finally { gl.autoClear = autoClear; }
  }

  dispose() {
    this.observer.disconnect();
    this.mutations.disconnect();
    this.root.removeEventListener('scroll', this.markDirty, true);
    this.root.removeEventListener('transitionend', this.markDirty, true);
    this.reducedTransparency.removeEventListener('change', this.markDirty);
    this.contrast.removeEventListener('change', this.markDirty);
    this.texture?.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }
}
