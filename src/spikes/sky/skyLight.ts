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
export type SkyAtmosphere = { sunDirection: Vec3; apparentSunDirection: Vec3; light: SkyLight; ground: boolean };

// Display-space colors shared by the background and the scattering in front of the Moon.
export const SKY_ATMOSPHERE_GLSL = `
  const float SKY_HAZE_WIDTH = .052336; // sin(3 degrees)

  vec3 skyAtmosphereColor(vec3 direction, vec3 sunDirection, vec3 apparentSunDirection, vec3 amounts, float ground) {
    vec3 groundColor = vec3(2., 6., 12.) / 255.;
    bool belowGround = ground > .5 && direction.y < 0.;
    vec3 night = vec3(.002, .005, .011);
    if (amounts.x <= 0.) return belowGround ? groundColor : night;
    vec3 ray = normalize(direction);
    float horizon = pow(1. - clamp(ray.y, 0., 1.), 1.10);
    vec3 twilight = mix(vec3(.040, .082, .182), vec3(.22, .29, .43), horizon);
    vec3 blueSky = mix(vec3(.19, .40, .70), vec3(.46, .64, .81), horizon);
    vec3 sky = mix(mix(night, twilight, amounts.x), blueSky, amounts.y);
    float sunward = max(0., dot(ray, sunDirection));
    float glow = sunward * sunward * sunward;
    float warm = (1. - smoothstep(0., .48, ray.y)) * glow * glow * amounts.z;
    sky = mix(sky, vec3(.91, .59, .35), .78 * warm);

    float haze = 1. - smoothstep(0., SKY_HAZE_WIDTH, abs(ray.y));
    vec3 hazeColor = mix(vec3(.57, .63, .69), vec3(.82, .65, .49), amounts.z * sunward);
    sky = mix(sky, hazeColor, .13 * amounts.x * haze);

    // The halo follows the refracted solar disc. Only the solar mesh sets its angular diameter.
    float chordSquared = max(0., 2. * (1. - dot(ray, apparentSunDirection)));
    float halo = .40 * exp2(-7200. * chordSquared) + .22 * exp2(-350. * chordSquared);
    halo *= smoothstep(-.052336, .012, apparentSunDirection.y);
    vec3 haloColor = mix(vec3(.98, .79, .55), vec3(.91, .95, 1.), amounts.y);
    sky = mix(sky, haloColor, halo);

    if (belowGround) {
      float hazeWidth = SKY_HAZE_WIDTH * sqrt(amounts.x);
      return mix(groundColor, sky, smoothstep(-hazeWidth, 0., ray.y));
    }
    return mix(night, sky, smoothstep(-.35, 0., ray.y));
  }
`;
