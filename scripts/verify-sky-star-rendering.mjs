// Browser-only GPU regression probe, deliberately absent from both application entries.
// In the local spike browser: await (await import('/lubirth/scripts/verify-sky-star-rendering.mjs')).verifyStarRendering()
import * as THREE from 'three';
import { createStarMaterial, starColor, DEFAULT_STAR_APPEARANCE } from '../src/spikes/sky/starAppearance.ts';

export function verifyStarRendering() {
  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const gl = renderer.getContext();
  const shaderErrors = [];
  renderer.debug.onShaderError = (_gl, program, vertex, fragment) => {
    shaderErrors.push([gl.getProgramInfoLog(program), gl.getShaderInfoLog(vertex), gl.getShaderInfoLog(fragment)]);
  };
  const material = createStarMaterial(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -1], 3));
  geometry.setAttribute('magnitude', new THREE.Float32BufferAttribute([0], 1));
  geometry.setAttribute('tint', new THREE.Float32BufferAttribute([1, 1, 1], 3));
  const scene = new THREE.Scene();
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  const camera = new THREE.PerspectiveCamera(85, 1, .1, 200);
  const checks = [];
  function check(name, pass) {
    checks.push({ name, pass });
  }
  function sample({ magnitude = 1, bv = null, fov = 85, dpr = 1, daylight = 1, ground = 0, y = 0,
    limit = 6.5, brightness = DEFAULT_STAR_APPEARANCE.brightness,
    colorStrength = DEFAULT_STAR_APPEARANCE.colorStrength, glow = DEFAULT_STAR_APPEARANCE.glow } = {}) {
    renderer.setPixelRatio(dpr); renderer.setSize(96, 96, false);
    camera.fov = fov; camera.updateProjectionMatrix();
    geometry.attributes.position.setXYZ(0, 0, y, -1); geometry.attributes.position.needsUpdate = true;
    geometry.attributes.magnitude.setX(0, magnitude); geometry.attributes.magnitude.needsUpdate = true;
    const color = starColor(bv);
    geometry.attributes.tint.setXYZ(0, color.r, color.g, color.b); geometry.attributes.tint.needsUpdate = true;
    for (const [key, value] of Object.entries({ dpr, daylight, ground, limit, brightness, colorStrength, glow })) {
      material.uniforms[key].value = value;
    }
    renderer.render(scene, camera);
    const w = renderer.domElement.width, h = renderer.domElement.height;
    const bytes = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    const rgb = [0, 0, 0], corona = [0, 0, 0], radial = [];
    let energy = 0, peak = 0, monochromeError = 0;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4, r = bytes[k], g = bytes[k + 1], b = bytes[k + 2];
      const luminance = .2126 * r + .7152 * g + .0722 * b;
      const radius = Math.hypot((i + .5 - w / 2) / dpr, (j + .5 - h / 2) / dpr);
      energy += luminance; peak = Math.max(peak, luminance);
      rgb[0] += r; rgb[1] += g; rgb[2] += b;
      if (radius >= 2 && radius < 8) { corona[0] += r; corona[1] += g; corona[2] += b; }
      monochromeError = Math.max(monochromeError, Math.abs(r - g), Math.abs(g - b));
      if (luminance > 0) radial.push({ radius, luminance });
    }
    radial.sort((a, b) => a.radius - b.radius);
    const radiusAt = fraction => {
      let sum = 0;
      for (const point of radial) { sum += point.luminance; if (sum >= energy * fraction) return point.radius; }
      return 0;
    };
    return { magnitude, bv, fov, dpr, energy: energy / (dpr * dpr), peak,
      radius50: radiusAt(.5), radius90: radiusAt(.9), rgb, corona, monochromeError };
  }
  try {
    const magnitudes = [-1.44, -.05, .5, 1, 3, 5, 6.5].map(magnitude => sample({ magnitude }));
    check('the actual shader compiles', shaderErrors.length === 0);
    check('integrated star light strictly follows V magnitude, including negative magnitudes',
      magnitudes.every((item, i) => i === 0 || item.energy < magnitudes[i - 1].energy * .98));
    check('faint stars remain visible and materially dimmer than bright stars',
      magnitudes[6].energy > 0 && magnitudes[3].energy / magnitudes[6].energy > 8);
    const cold = sample({ bv: -.1 }), warm = sample({ bv: 1.8 });
    check('blue and orange are distinguishable in the rendered halo', cold.corona[2] > cold.corona[0] * 1.2
      && warm.corona[0] > warm.corona[2] * 1.5);
    const unknown = sample(), monochrome = sample({ bv: 1.8, colorStrength: 0 });
    check('missing B−V stays neutral; zero color strength actually removes chroma',
      unknown.monochromeError <= 1 && monochrome.monochromeError <= 1);
    const zoom = [110, 85, 70, 40, 25].map(fov => sample({ fov, bv: .3 }));
    check('zoom reveals light progressively without turning points into enlarged disks',
      zoom.every((item, i) => i === 0 || item.energy >= zoom[i - 1].energy * .99)
      && zoom[4].radius50 / zoom[0].radius50 < 1.8 && zoom[4].radius90 < 14);
    const restored = sample({ fov: 110, bv: .3 });
    check('zooming back restores the same profile without stale uniforms', restored.energy === zoom[0].energy);
    const resolution = [1, 1.5, 2, 3].map(dpr => sample({ dpr, magnitude: 3 }));
    check('DPR changes preserve CSS point size and light within raster sampling tolerance',
      resolution.every(item => Math.abs(item.radius50 - resolution[0].radius50) < .4
        && Math.abs(item.energy / resolution[0].energy - 1) < .25));
    const faintResolution = [1, 1.5, 2, 3].map(dpr => sample({ dpr, magnitude: 6.5 }));
    check('the faintest catalog stars survive every supported DPR', faintResolution.every(item => item.energy > 0));
    check('magnitude limit, daylight and the ground mask still hide stars', sample({ magnitude: 7 }).energy === 0
      && sample({ daylight: 0 }).energy === 0 && sample({ ground: 1, y: -.01 }).energy === 0);
    const dim = sample({ magnitude: 4, brightness: .6 }), bright = sample({ magnitude: 4, brightness: 1.5 });
    check('brightness control changes rendered light without changing catalog values', bright.energy > dim.energy * 1.7);
    const clean = sample({ bv: 1.8, glow: 0 });
    check('turning off glow removes the broad corona and preserves the core', clean.energy > 0 && clean.radius90 < warm.radius90);
    return { passed: checks.every(item => item.pass), checks, magnitudes, cold, warm, zoom, resolution, faintResolution, shaderErrors,
      interpretation: 'Perceptual GPU rendering checks; neither calibrated photometry nor a live Stellarium pixel match.' };
  } finally {
    geometry.dispose(); material.dispose(); renderer.dispose();
  }
}
