import * as THREE from 'three';

export type StarAppearance = { brightness: number; colorStrength: number; glow: number };
export const DEFAULT_STAR_APPEARANCE: StarAppearance = { brightness: 1, colorStrength: 1.1, glow: .85 };

// Our display palette, ordered by catalog B−V. These are perceptual colors,
// not spectral measurements or Stellarium's color table. Unknown B−V stays neutral.
const COLOR_STOPS = [
  [-.4, '#91baff'], [-.05, '#bed8ff'], [.3, '#e9eeff'], [.65, '#fff0ce'],
  [1, '#ffd09b'], [1.5, '#ffa568'], [2, '#ff794d'],
] as const;
const PALETTE = COLOR_STOPS.map(([bv, hex]) => ({ bv, color: new THREE.Color(hex) }));

export function starColor(bv: number | null): THREE.Color {
  if (bv === null || !Number.isFinite(bv)) return new THREE.Color(1, 1, 1);
  const value = THREE.MathUtils.clamp(bv, PALETTE[0].bv, PALETTE[PALETTE.length - 1].bv);
  const upper = PALETTE.findIndex(stop => stop.bv >= value);
  if (upper === 0) return PALETTE[0].color.clone();
  const a = PALETTE[upper - 1], b = PALETTE[upper];
  return a.color.clone().lerp(b.color, (value - a.bv) / (b.bv - a.bv));
}

// One point-source pass: screen-space core + chromatic halo + restrained bright-star rays.
// The projection matrix supplies the *current* zoom, including during a drag/pinch,
// so this never waits for React's pointer-up state or adds a render loop.
export function createStarMaterial(maxPointSize: number) {
  return new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    uniforms: {
      limit: { value: 6.5 }, daylight: { value: 1 }, dpr: { value: 1 }, ground: { value: 1 },
      brightness: { value: DEFAULT_STAR_APPEARANCE.brightness },
      colorStrength: { value: DEFAULT_STAR_APPEARANCE.colorStrength }, glow: { value: DEFAULT_STAR_APPEARANCE.glow },
      maxPointSize: { value: maxPointSize },
    },
    vertexShader: `
      attribute float magnitude;
      attribute vec3 tint;
      uniform float limit, dpr, ground, brightness, colorStrength, glow, maxPointSize;
      varying vec3 stellarColor;
      varying vec4 profile;
      varying vec3 light;
      void main() {
        float visible = step(magnitude, limit) * (ground > .5 ? smoothstep(0.0, .018, position.y) : 1.0);
        // Magnitude remains catalog V; the 0.60 exponent compresses flux for a display.
        // Bright sources gain area and halo rather than all hitting a fixed alpha=1.
        float flux = pow(10.0, -.4 * .60 * magnitude);
        float zoom = clamp(pow(projectionMatrix[1][1] / 1.0913085, .17), .90, 1.28);
        float sigma = (.45 + .65 * sqrt(flux)) * zoom;
        float haloSigma = sigma * 2.6 + .35 * sqrt(flux);
        float peak = 1.0 - exp(-2.7 * flux * brightness * pow(zoom, 1.3));
        float halo = .16 * sqrt(flux) * (1.0 - smoothstep(1.0, 4.0, magnitude)) * glow * brightness;
        float rays = .035 * sqrt(flux) * (1.0 - smoothstep(-.3, 1.0, magnitude)) * glow * brightness;
        float radius = max(sigma * 3.5, haloSigma * 3.0 * step(.0001, halo));
        float diameter = min(radius * 2.0 * dpr, maxPointSize);
        float grey = dot(tint, vec3(.2126, .7152, .0722));
        stellarColor = clamp(mix(vec3(grey), tint, colorStrength), 0.0, 1.0);
        profile = vec4(sigma, haloSigma, peak, diameter / dpr);
        light = vec3(halo, rays, visible);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 100.0, 1.0);
        gl_PointSize = max(1.0, diameter);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float daylight;
      varying vec3 stellarColor;
      varying vec4 profile;
      varying vec3 light;
      void main() {
        if (light.z < .0001 || daylight < .0001) discard;
        vec2 p = (gl_PointCoord - .5) * profile.w;
        float distanceSq = dot(p, p);
        float core = exp(-.5 * distanceSq / (profile.x * profile.x)) * profile.z;
        float halo = exp(-.5 * distanceSq / (profile.y * profile.y)) * light.x;
        float crossDistance = min(abs(p.x), abs(p.y));
        float rays = exp(-crossDistance * crossDistance / .055)
          * exp(-sqrt(distanceSq) / (profile.x * 2.0)) * light.y;
        float energy = core + halo + rays;
        float opacity = min(1.0, energy * light.z * daylight);
        if (opacity < .001) discard;
        // Whiten only the tiny central peak. Whitening the entire Gaussian would
        // wash the cold/warm difference out again on low-DPR phone/desktop screens.
        float whitePeak = .72 * exp(-2.0 * distanceSq / (profile.x * profile.x));
        vec3 color = (mix(stellarColor, vec3(1.0), whitePeak) * core + stellarColor * (halo + rays)) / energy;
        gl_FragColor = vec4(color, opacity);
        #include <colorspace_fragment>
      }
    `,
  });
}
