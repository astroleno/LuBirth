import * as THREE from 'three';
import {
  getGlassMarkerOverlayDiagnostics,
  getGlassMarkerOverlays,
  type GlassMarkerOverlay,
} from './GlassOverlayRegistry';
import { layoutGlassMarker, projectCameraSphereBounds, type ScreenBounds } from './glassMarkerLayout';

const rectVertexShader = `
precision highp float;
attribute vec3 position;
uniform vec4 rect;
uniform vec2 viewport;
void main() {
  vec2 pixel = rect.xy + (position.xy + 0.5) * rect.zw;
  gl_Position = vec4(pixel / viewport * 2.0 - 1.0, 0.0, 1.0);
}`;

// The DOM stays above the canvas and remains crisp. This pass only replaces
// the pixels beneath each glass surface with a refracted version of the scene.
const uiFragmentShader = `
precision highp float;
uniform sampler2D backdrop;
uniform vec2 viewport;
uniform float pixelRatio;
uniform vec4 rect;
uniform float radius;
uniform float strength;
uniform float dispersion;
uniform float clarity;
uniform float bevelWidth;
uniform float blurRadius;
uniform float tintOpacity;

void main() {
  vec2 pixel = gl_FragCoord.xy / pixelRatio;
  vec2 halfSize = rect.zw * 0.5;
  vec2 p = pixel - rect.xy - halfSize;
  float r = min(radius, min(halfSize.x, halfSize.y));
  vec2 q = abs(p) - halfSize + r;
  float distance = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  if (distance > 0.65) discard;

  vec2 normal = normalize(p - clamp(p, -halfSize + r, halfSize - r) + vec2(0.0001));
  float depth = max(-distance, 0.0);
  float bevel = min(bevelWidth, min(halfSize.x, halfSize.y) * 0.72);
  float t = clamp(depth / max(bevel, 0.001), 0.0, 1.0);
  float lens = sin(t * 3.14159265) * (1.0 - t * 0.28);
  vec2 offset = -normal * lens * strength - p * 0.003;
  vec2 uv = clamp((pixel + offset) / viewport, 0.001, 0.999);
  vec2 fringe = normal * lens * dispersion / viewport;

  vec3 refracted = vec3(
    texture2D(backdrop, uv + fringe * 1.35).r,
    (texture2D(backdrop, uv + fringe * 0.2).g + texture2D(backdrop, uv - fringe * 0.2).g) * 0.5,
    texture2D(backdrop, uv - fringe * 1.35).b
  );
  vec2 blur = vec2(blurRadius) / viewport;
  vec3 soft = texture2D(backdrop, uv).rgb * 0.2;
  soft += (texture2D(backdrop, uv + vec2(blur.x, 0.0)).rgb
         + texture2D(backdrop, uv - vec2(blur.x, 0.0)).rgb
         + texture2D(backdrop, uv + vec2(0.0, blur.y)).rgb
         + texture2D(backdrop, uv - vec2(0.0, blur.y)).rgb) * 0.12;
  soft += (texture2D(backdrop, uv + blur * 0.707).rgb
         + texture2D(backdrop, uv + vec2(-blur.x, blur.y) * 0.707).rgb
         + texture2D(backdrop, uv + vec2(blur.x, -blur.y) * 0.707).rgb
         + texture2D(backdrop, uv - blur * 0.707).rgb) * 0.08;
  vec3 color = mix(soft, refracted, clarity);
  // Every UI shell shares the same clear material. Bright backdrops receive
  // additional tint so DOM labels stay readable without a permanent dark cover.
  float luminance = dot(soft, vec3(0.2126, 0.7152, 0.0722));
  float tint = tintOpacity + (1.0 - tintOpacity) * smoothstep(0.08, 0.7, luminance) * 0.45;
  color = mix(color, vec3(0.10, 0.125, 0.17), tint);
  vec2 face = p / max(halfSize, vec2(1.0));
  float sheen = pow(clamp(0.5 + dot(face, vec2(-0.3, 0.4)), 0.0, 1.0), 2.0);
  color += vec3(0.03, 0.035, 0.04) * sheen;

  float direction = dot(normal, normalize(vec2(-0.58, 0.82)));
  float specular = pow(max(direction, 0.0), 4.0)
                 + pow(max(-direction, 0.0), 7.0) * 0.58;
  // One narrow optical edge, without an inset caustic or a second DOM outline.
  vec3 reflection = mix(vec3(0.012, 0.018, 0.028), vec3(0.82, 0.90, 0.98), clamp(specular, 0.0, 1.0));
  color = mix(color, reflection, exp(-depth * 1.1) * 0.78);
  float coverage = 1.0 - smoothstep(-0.65, 0.65, distance);
  vec3 original = texture2D(backdrop, pixel / viewport).rgb;
  gl_FragColor = vec4(mix(original, color, coverage), 1.0);
}`;

const markerFragmentShader = `
precision highp float;
uniform sampler2D backdrop;
uniform vec2 viewport;
uniform float pixelRatio;
uniform vec4 rect;
uniform float markerScale;
uniform float pinScale;
uniform float anchorOffsetY;
uniform float labelCenterY;
uniform float labelWidth;
uniform float markerOpacity;
uniform float reveal;
uniform float highQuality;
uniform float fallback;

float sdRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float smoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float pinDistance(vec2 local) {
  if (pinScale < 0.001) return 10000.0;
  float u = pinScale;
  float x = local.x - rect.z * 0.5;
  float y = local.y - anchorOffsetY;
  float circle = length(vec2(x, y - 57.0 * u)) - 28.0 * u;
  float tailY = clamp(y, 0.0, 57.0 * u);
  float halfWidth = mix(1.0 * u, 21.0 * u, tailY / max(57.0 * u, 0.001));
  float tail = max(abs(x) - halfWidth, max(-y, y - 57.0 * u));
  float pin = smoothUnion(circle, tail, 7.0 * u);
  float hole = length(vec2(x, y - 57.0 * u)) - 8.2 * u;
  return max(pin, -hole);
}

float glassDistance(vec2 local) {
  float u = markerScale;
  float pin = pinDistance(local);
  vec2 labelCenter = vec2(rect.z * 0.5, labelCenterY);
  float pill = sdRoundedBox(local - labelCenter, vec2(labelWidth * 0.5, 20.0 * u), 20.0 * u);
  return min(pin, pill);
}

void main() {
  vec2 pixel = gl_FragCoord.xy / pixelRatio;
  vec2 local = pixel - rect.xy;
  float distance = glassDistance(local);
  float u = markerScale;
  if (fallback > 0.5 && distance > 0.0) discard;
  if (fallback < 0.5 && distance > 15.0 * u) discard;

  vec2 baseUv = clamp(pixel / viewport, 0.001, 0.999);
  vec3 base = fallback > 0.5 ? vec3(0.035, 0.055, 0.08) : texture2D(backdrop, baseUv).rgb;
  float inside = 1.0 - smoothstep(-0.7 * u, 0.7 * u, distance);
  float depth = max(-distance, 0.0);
  float bevel = 13.0 * u;
  float t = clamp(depth / max(bevel, 0.001), 0.0, 1.0);
  float lens = sin(t * 3.14159265) * (1.0 - t * 0.22);

  float epsilon = max(0.85, u);
  vec2 gradient = vec2(
    glassDistance(local + vec2(epsilon, 0.0)) - glassDistance(local - vec2(epsilon, 0.0)),
    glassDistance(local + vec2(0.0, epsilon)) - glassDistance(local - vec2(0.0, epsilon))
  );
  vec2 normal = normalize(gradient + vec2(0.0001));
  vec2 offset = -normal * lens * 17.0 * u;
  vec2 uv = clamp((pixel + offset) / viewport, 0.001, 0.999);
  // Subpixel dispersion keeps bright city lights from splitting into RGB bars
  // when a short-screen label sits over the globe. Refraction stays unchanged.
  vec2 fringe = normal * lens * 0.3 * u / viewport;

  vec3 low = vec3(
    texture2D(backdrop, uv + fringe * 1.35).r,
    texture2D(backdrop, uv).g,
    texture2D(backdrop, uv - fringe * 1.35).b
  );
  vec3 high = vec3(
    texture2D(backdrop, uv + fringe * 1.55).r * 0.72 + texture2D(backdrop, uv + fringe * 0.75).r * 0.28,
    texture2D(backdrop, uv + fringe * 0.18).g * 0.5 + texture2D(backdrop, uv - fringe * 0.18).g * 0.5,
    texture2D(backdrop, uv - fringe * 1.55).b * 0.72 + texture2D(backdrop, uv - fringe * 0.75).b * 0.28
  );
  vec3 glass = mix(low, high, step(0.5, highQuality));

  float rim = exp(-depth / max(2.2 * u, 0.001));
  float innerCaustic = exp(-pow((depth - 8.5 * u) / max(2.5 * u, 0.001), 2.0));
  float lightFacing = dot(normal, normalize(vec2(-0.62, 0.78)));
  float sparkle = pow(max(lightFacing, 0.0), 5.0) + pow(max(-lightFacing, 0.0), 8.0) * 0.52;
  vec3 spectral = vec3(
    0.45 + max(normal.x, 0.0) * 0.42,
    0.72 + max(normal.y, 0.0) * 0.22,
    1.0
  );
  glass *= 0.96 - lens * 0.075;
  glass += vec3(0.96, 0.985, 1.0) * rim * (0.12 + sparkle * 0.72);
  glass += spectral * innerCaustic * (0.045 + sparkle * 0.12);
  glass += vec3(0.025, 0.05, 0.075);
  if (fallback > 0.5) {
    glass = mix(vec3(0.035, 0.055, 0.08), vec3(0.92, 0.97, 1.0), rim * 0.8 + innerCaustic * 0.2);
  }

  float halo = exp(-pow((max(distance, 0.0) - 7.0 * u) / max(4.0 * u, 0.001), 2.0))
             * (1.0 - smoothstep(0.48, 1.0, reveal)) * markerOpacity;
  vec3 color = mix(base, glass, inside * markerOpacity);
  color += vec3(0.32, 0.72, 1.0) * halo * 0.22;
  gl_FragColor = vec4(color, 1.0);
}`;

const labelVertexShader = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform vec4 rect;
uniform vec2 viewport;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec2 pixel = rect.xy + (position.xy + 0.5) * rect.zw;
  gl_Position = vec4(pixel / viewport * 2.0 - 1.0, 0.0, 1.0);
}`;

const labelFragmentShader = `
precision highp float;
uniform sampler2D labelMap;
uniform float opacity;
varying vec2 vUv;
void main() {
  float alpha = texture2D(labelMap, vUv).a * opacity;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vec3(0.97, 0.99, 1.0), alpha);
}`;

type GlassRect = {
  rect: THREE.Vector4;
  radius: number;
  strength: number;
  dispersion: number;
  clarity: number;
  bevelWidth: number;
  blurRadius: number;
  tintOpacity: number;
};

export interface LiquidGlassRenderOptions {
  uiGlass: boolean;
  includeUi?: boolean;
  highQualityMarker: boolean;
  moon?: THREE.Object3D;
}

function smoothstep(min: number, max: number, value: number) {
  const t = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

/** A single framebuffer copy powers both DOM glass and the aligned birth marker. */
export class LiquidGlassRenderer {
  private texture: THREE.FramebufferTexture | null = null;
  private fallbackTexture = new THREE.DataTexture(new Uint8Array([8, 13, 20, 255]), 1, 1);
  private geometry = new THREE.PlaneGeometry(1, 1);
  private uiMaterial = new THREE.RawShaderMaterial({
    vertexShader: rectVertexShader,
    fragmentShader: uiFragmentShader,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      backdrop: { value: this.fallbackTexture },
      viewport: { value: new THREE.Vector2() },
      pixelRatio: { value: 1 },
      rect: { value: new THREE.Vector4() },
      radius: { value: 12 },
      strength: { value: 12 },
      dispersion: { value: 0.85 },
      clarity: { value: 0.88 },
      bevelWidth: { value: 10 },
      blurRadius: { value: 3 },
      tintOpacity: { value: 0.14 },
    },
  });
  private markerMaterial = new THREE.RawShaderMaterial({
    vertexShader: rectVertexShader,
    fragmentShader: markerFragmentShader,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      backdrop: { value: this.fallbackTexture },
      viewport: { value: new THREE.Vector2() },
      pixelRatio: { value: 1 },
      rect: { value: new THREE.Vector4() },
      markerScale: { value: 1 },
      pinScale: { value: 1 },
      anchorOffsetY: { value: 0 },
      labelCenterY: { value: 116 },
      labelWidth: { value: 100 },
      markerOpacity: { value: 0 },
      reveal: { value: 0 },
      highQuality: { value: 1 },
      fallback: { value: 0 },
    },
  });
  private labelMaterial = new THREE.RawShaderMaterial({
    vertexShader: labelVertexShader,
    fragmentShader: labelFragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      labelMap: { value: this.fallbackTexture },
      opacity: { value: 0 },
      viewport: { value: new THREE.Vector2() },
      rect: { value: new THREE.Vector4() },
    },
  });
  private uiScene = new THREE.Scene();
  private markerScene = new THREE.Scene();
  private camera = new THREE.Camera();
  private uiMesh = new THREE.Mesh(this.geometry, this.uiMaterial);
  private markerMesh = new THREE.Mesh(this.geometry, this.markerMaterial);
  private labelMesh = new THREE.Mesh(this.geometry, this.labelMaterial);
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
  private worldPosition = new THREE.Vector3();
  private worldNormal = new THREE.Vector3();
  private cameraDirection = new THREE.Vector3();
  private projected = new THREE.Vector3();
  private moonSphere = new THREE.Sphere();
  readonly stats = {
    active: false,
    uiDraws: 0,
    markerDraws: 0,
    registeredMarkers: 0,
    activeMarkers: 0,
    markerFacing: 0,
    markerNdc: [0, 0, 0] as [number, number, number],
    moonBounds: null as ScreenBounds | null,
    markerLabelBounds: null as ScreenBounds | null,
    markerBounds: null as ScreenBounds | null,
    markerLabelPlacement: null as 'above' | 'below' | null,
    markerPinScale: 1,
    copies: 0,
    textureBytes: 0,
  };
  private markDirty = () => { this.dirty = true; };

  constructor(private canvas: HTMLCanvasElement) {
    this.root = (canvas.closest('.canvas-wrap') ?? canvas.parentElement) as HTMLElement;
    this.fallbackTexture.needsUpdate = true;
    this.uiMesh.frustumCulled = false;
    this.markerMesh.frustumCulled = false;
    this.labelMesh.frustumCulled = false;
    this.markerMesh.renderOrder = 0;
    this.labelMesh.renderOrder = 1;
    this.uiScene.add(this.uiMesh);
    this.markerScene.add(this.markerMesh, this.labelMesh);
    this.observer = new ResizeObserver(this.markDirty);
    this.observer.observe(this.root);
    this.mutations = new MutationObserver(this.markDirty);
    this.mutations.observe(this.root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'style', 'data-glass-variant'],
    });
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
        radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) || 12,
        strength: 12,
        dispersion: 0.85,
        clarity: 0.88,
        bevelWidth: 10,
        blurRadius: 3,
        tintOpacity: 0.14,
      });
    }
    this.observed = elements;
  }

  private ensureBackdrop(gl: THREE.WebGLRenderer) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    if (!this.texture || this.texture.image.width !== width || this.texture.image.height !== height) {
      this.texture?.dispose();
      this.texture = new THREE.FramebufferTexture(width, height);
      this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
      this.uiMaterial.uniforms.backdrop.value = this.texture;
      this.markerMaterial.uniforms.backdrop.value = this.texture;
      this.stats.textureBytes = width * height * 4;
    }
    const copyFramebuffer = gl.copyFramebufferToTexture as unknown as (position: THREE.Vector2, texture: THREE.Texture) => void;
    copyFramebuffer.call(gl, this.origin, this.texture);
    this.stats.copies++;
  }

  private releaseBackdrop() {
    this.texture?.dispose();
    this.texture = null;
    this.uiMaterial.uniforms.backdrop.value = this.fallbackTexture;
    this.markerMaterial.uniforms.backdrop.value = this.fallbackTexture;
    this.stats.textureBytes = 0;
  }

  private renderMarker(
    gl: THREE.WebGLRenderer,
    renderCamera: THREE.Camera,
    overlay: GlassMarkerOverlay,
    highQuality: boolean,
    fallback: boolean,
  ) {
    const anchor = overlay.anchor;
    if (!anchor) return;
    anchor.getWorldPosition(this.worldPosition);
    this.worldNormal.copy(this.worldPosition).normalize();
    this.cameraDirection.copy(renderCamera.position).sub(this.worldPosition).normalize();
    // The aligned composition intentionally places the selected location at
    // the globe rim. Keep the callout legible through that shallow angle, then
    // remove it once the point is decisively on the far hemisphere.
    const surfaceVisibility = smoothstep(-0.62, -0.42, this.worldNormal.dot(this.cameraDirection));
    this.projected.copy(this.worldPosition).project(renderCamera);
    this.stats.markerFacing = this.worldNormal.dot(this.cameraDirection);
    this.stats.markerNdc = this.projected.toArray() as [number, number, number];
    if (this.projected.z < -1 || this.projected.z > 1
      || this.projected.x < -1 || this.projected.x > 1
      || this.projected.y < -1 || this.projected.y > 1
      || surfaceVisibility <= 0.001) return;

    const projectedAnchorX = (this.projected.x * 0.5 + 0.5) * this.width;
    const projectedAnchorY = (this.projected.y * 0.5 + 0.5) * this.height;
    const reveal = THREE.MathUtils.clamp(overlay.reveal, 0, 1.08);
    const opacity = THREE.MathUtils.clamp(overlay.reveal, 0, 1) * surfaceVisibility;
    if (opacity <= 0.001) return;
    const scale = 0.78 + 0.22 * reveal;
    const markerScale = overlay.sizePx / 92 * scale;
    const labelWidth = overlay.labelWidthPx * scale;
    // Preserve the true geographic projection. Off-screen anchors are rejected
    // above instead of being moved to an unrelated screen edge.
    const anchorX = projectedAnchorX;
    const anchorY = projectedAnchorY;
    const layout = layoutGlassMarker({ anchorX, anchorY: this.height - anchorY,
      scale: markerScale, maxScale: overlay.sizePx / 92 * 1.0176,
      labelWidth, moon: this.stats.moonBounds });
    const rectWidth = layout.bounds.right - layout.bounds.left;
    const rectHeight = layout.bounds.bottom - layout.bounds.top;
    const rectX = layout.bounds.left;
    const rectY = this.height - layout.bounds.bottom;
    const labelCenterY = this.height - (layout.label.top + layout.label.bottom) * 0.5;
    this.stats.markerLabelBounds = layout.label;
    this.stats.markerBounds = layout.bounds;
    this.stats.markerLabelPlacement = layout.labelPlacement;
    this.stats.markerPinScale = layout.pinScale;

    this.markerMaterial.uniforms.viewport.value.set(this.width, this.height);
    this.markerMaterial.uniforms.pixelRatio.value = this.canvas.width / Math.max(this.width, 1);
    this.markerMaterial.uniforms.rect.value.set(rectX, rectY, rectWidth, rectHeight);
    this.markerMaterial.uniforms.markerScale.value = markerScale;
    this.markerMaterial.uniforms.pinScale.value = layout.pinScale;
    this.markerMaterial.uniforms.anchorOffsetY.value = anchorY - rectY;
    this.markerMaterial.uniforms.labelCenterY.value = labelCenterY - rectY;
    this.markerMaterial.uniforms.labelWidth.value = labelWidth;
    this.markerMaterial.uniforms.markerOpacity.value = opacity;
    this.markerMaterial.uniforms.reveal.value = reveal;
    this.markerMaterial.uniforms.highQuality.value = highQuality ? 1 : 0;
    this.markerMaterial.uniforms.fallback.value = fallback ? 1 : 0;

    const labelHeight = 32 * markerScale;
    this.labelMaterial.uniforms.viewport.value.set(this.width, this.height);
    this.labelMaterial.uniforms.rect.value.set(
      anchorX - (labelWidth - 16 * markerScale) * 0.5,
      labelCenterY - labelHeight * 0.5,
      labelWidth - 16 * markerScale,
      labelHeight,
    );
    this.labelMaterial.uniforms.labelMap.value = overlay.labelTexture;
    this.labelMaterial.uniforms.opacity.value = opacity * smoothstep(0.48, 0.92, reveal);
    this.labelMesh.visible = this.labelMaterial.uniforms.opacity.value > 0.001;
    gl.render(this.markerScene, this.camera);
    this.stats.markerDraws += this.labelMesh.visible ? 2 : 1;
  }

  render(gl: THREE.WebGLRenderer, renderCamera: THREE.Camera, options: LiquidGlassRenderOptions) {
    this.stats.active = false;
    this.stats.uiDraws = 0;
    this.stats.markerDraws = 0;
    this.stats.markerLabelBounds = null;
    this.stats.markerBounds = null;
    this.stats.markerLabelPlacement = null;
    if (this.dirty || !this.width || !this.height) this.measure();
    const markers = getGlassMarkerOverlays(this.canvas);

    // Use the actual lunar model's silhouette, rather than a fixed offset or
    // its lit pixels, so all phases, cropped layouts and reveal frames clear it.
    this.stats.moonBounds = null;
    if (markers.length && options.moon instanceof THREE.Mesh && options.moon.visible && renderCamera instanceof THREE.PerspectiveCamera) {
      const geometry = options.moon.geometry as THREE.BufferGeometry;
      if (!geometry.boundingSphere) geometry.computeBoundingSphere();
      if (geometry.boundingSphere) {
        this.moonSphere.copy(geometry.boundingSphere).applyMatrix4(options.moon.matrixWorld)
          .applyMatrix4(renderCamera.matrixWorldInverse);
        this.stats.moonBounds = projectCameraSphereBounds(this.moonSphere, renderCamera.projectionMatrix.elements, this.width, this.height);
      }
    }

    const markerDiagnostics = getGlassMarkerOverlayDiagnostics(this.canvas);
    this.stats.registeredMarkers = markerDiagnostics.registered;
    this.stats.activeMarkers = markerDiagnostics.active;
    const accessibilityFallback = this.reducedTransparency.matches || this.contrast.matches;
    const drawUi = options.includeUi !== false && options.uiGlass && !accessibilityFallback && this.rects.length > 0;
    const needsBackdrop = drawUi || (markers.length > 0 && !accessibilityFallback);
    if (!drawUi && !markers.length) {
      this.releaseBackdrop();
      return;
    }
    if (needsBackdrop) this.ensureBackdrop(gl);
    else this.releaseBackdrop();

    const autoClear = gl.autoClear;
    gl.autoClear = false;
    try {
      for (const marker of markers) {
        this.renderMarker(gl, renderCamera, marker, options.highQualityMarker, accessibilityFallback);
      }
      if (drawUi) {
        this.uiMaterial.uniforms.viewport.value.set(this.width, this.height);
        this.uiMaterial.uniforms.pixelRatio.value = this.canvas.width / Math.max(this.width, 1);
        for (const region of this.rects) {
          this.uiMaterial.uniforms.rect.value.copy(region.rect);
          this.uiMaterial.uniforms.radius.value = region.radius;
          this.uiMaterial.uniforms.strength.value = region.strength;
          this.uiMaterial.uniforms.dispersion.value = region.dispersion;
          this.uiMaterial.uniforms.clarity.value = region.clarity;
          this.uiMaterial.uniforms.bevelWidth.value = region.bevelWidth;
          this.uiMaterial.uniforms.blurRadius.value = region.blurRadius;
          this.uiMaterial.uniforms.tintOpacity.value = region.tintOpacity;
          gl.render(this.uiScene, this.camera);
          this.stats.uiDraws++;
        }
      }
      this.stats.active = this.stats.uiDraws + this.stats.markerDraws > 0;
    } finally {
      gl.autoClear = autoClear;
      this.labelMesh.visible = true;
    }
  }

  dispose() {
    this.observer.disconnect();
    this.mutations.disconnect();
    this.root.removeEventListener('scroll', this.markDirty, true);
    this.root.removeEventListener('transitionend', this.markDirty, true);
    this.reducedTransparency.removeEventListener('change', this.markDirty);
    this.contrast.removeEventListener('change', this.markDirty);
    this.texture?.dispose();
    this.fallbackTexture.dispose();
    this.geometry.dispose();
    this.uiMaterial.dispose();
    this.markerMaterial.dispose();
    this.labelMaterial.dispose();
  }
}
