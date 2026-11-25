import type { Vec3 } from '../../astro/referenceFrames';

function smoothstep(low: number, high: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}

/** Continuous display weights, driven by the Sun's geometric altitude in degrees. */
export function skyLight(sunAltitudeDeg: number) {
  const twilight = smoothstep(-18, -1, sunAltitudeDeg);
  const daylight = smoothstep(-6, 18, sunAltitudeDeg);
  return {
    starlight: smoothstep(0, 18, -sunAltitudeDeg),
    twilight,
    daylight,
    sunset: smoothstep(-10, 0, sunAltitudeDeg) * (1 - smoothstep(0, 15, sunAltitudeDeg)),
    moonScattering: Math.max(daylight, .88 * smoothstep(-6, -1, sunAltitudeDeg)),
  };
}

export type SkyLight = ReturnType<typeof skyLight>;
export type SkyAtmosphere = { sunDirection: Vec3; light: SkyLight; ground: boolean };

// Display-space colors shared by the background and the scattering in front of the Moon.
export const SKY_ATMOSPHERE_GLSL = `
  vec3 skyAtmosphereColor(vec3 direction, vec3 sunDirection, vec3 amounts, float ground) {
    if (ground > .5 && direction.y < 0.) return vec3(2., 6., 12.) / 255.;
    vec3 night = vec3(.002, .005, .011);
    if (amounts.x <= 0.) return night;
    vec3 ray = normalize(direction);
    float horizon = 1. - smoothstep(0., .7, ray.y);
    vec3 twilight = mix(vec3(.040, .082, .182), vec3(.22, .29, .43), horizon);
    vec3 blueSky = mix(vec3(.19, .40, .70), vec3(.46, .64, .81), horizon);
    vec3 sky = mix(mix(night, twilight, amounts.x), blueSky, amounts.y);
    float sunward = max(0., dot(ray, sunDirection));
    float glow = sunward * sunward * sunward;
    float warm = (1. - smoothstep(0., .48, ray.y)) * glow * glow * amounts.z;
    sky = mix(sky, vec3(.91, .59, .35), .78 * warm);
    sky = mix(sky, vec3(.88, .91, .88), .21 * amounts.y * pow(sunward, 36.));
    return mix(night, sky, smoothstep(-.35, 0., ray.y));
  }
`;
