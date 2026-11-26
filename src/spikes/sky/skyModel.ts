import { createCelestialState, createObserverState } from '../../astro/celestialState';
import type { CelestialState, ObserverState } from '../../astro/celestialState';
import type { EarthSceneFrame, Frame3 } from '../../astro/referenceFrames';
import { apparentHorizonDisk } from '../../astro/apparentHorizon';
import { lunarShadow } from '../../astro/lunarShadow';

// Field units and source versions are recorded alongside the derived catalog.
export type StarRow = [number, number | null, number, number, number, number | null,
  number | null, number | null, number | null, number | null, number | null, number | null];
type SkyIllustrationSource = { file: string; size: number[] };
export type SkyIllustration = SkyIllustrationSource & { mobileDelivery?: SkyIllustrationSource; anchors: { pos: number[]; hip: number; planeScale?: number }[] };
export type SkyCulture = { id: string; name: string; english: string; lines: (number | string)[][]; image?: SkyIllustration };
export type SkyCatalog = { stars: StarRow[]; culture: SkyCulture[]; maxMagnitude: number;
  hipAliases: { hip: number; hyg: number; hd: number; status: string }[] };
export type SkyLocation = { latitude: number; longitude: number };
export type SkyFrame = {
  positions: Float32Array; hipIndex: ReadonlyMap<number, number>; aboveHorizon: number;
  sunAlt: number; date: Date; years: number; eqjBasis: number[][];
  apparentSun: ReturnType<typeof apparentHorizonDisk>; apparentMoon: ReturnType<typeof apparentHorizonDisk>;
  earthShadow: ReturnType<typeof lunarShadow>;
  key: string; projection: 'horizon' | 'earth'; celestial: CelestialState; observer: ObserverState; motion: boolean;
};

/** This input is explicitly proleptic Gregorian UTC, never an original lunar date. */
export function parseUtcInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('请填写完整的 UTC 年月日与时分。');
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, 0, 0);
  if (year < 1 || year > 2999 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute) {
    throw new Error('请输入 0001–2999 年之间有效的公历 UTC 日期。');
  }
  return date;
}

/** Linear space motion where HYG has a usable state; otherwise retain J2000 direction. */
export function starDirection(star: StarRow, years: number, motion: boolean): [number, number, number] {
  const [, , ra, dec, , , x, y, z, vx, vy, vz] = star;
  if (motion && x !== null && y !== null && z !== null && vx !== null && vy !== null && vz !== null) {
    const px = x + vx * years, py = y + vy * years, pz = z + vz * years;
    const length = Math.hypot(px, py, pz);
    if (length > 0) return [px / length, py / length, pz / length];
  }
  const a = ra * Math.PI / 12, d = dec * Math.PI / 180;
  return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
}

/** Astronomy Engine HOR: North, West, Zenith → Three: East, Zenith, South. */
export function horizonToWorld(north: number, west: number, zenith: number): [number, number, number] {
  return [-west, zenith, -north];
}

// A catalog is an immutable snapshot. Each frame shares its ordered HIP lookup.
const hipIndices = new WeakMap<SkyCatalog, ReadonlyMap<number, number>>();
// Keep one private EQJ direction buffer per catalog for the active epoch.
const epochDirections = new WeakMap<SkyCatalog, { epochYears: number | null; directions: Float64Array }>();

function catalogHipIndex(catalog: SkyCatalog) {
  const cached = hipIndices.get(catalog);
  if (cached) return cached;
  const hipIndex = new Map<number, number>();
  const hygIndex = new Map<number, number>();
  catalog.stars.forEach(([hyg, hip], index) => {
    if (!hygIndex.has(hyg)) hygIndex.set(hyg, index);
    if (hip !== null) hipIndex.set(hip, index);
  });
  for (const alias of catalog.hipAliases) {
    const index = hygIndex.get(alias.hyg);
    if (index !== undefined) hipIndex.set(alias.hip, index);
  }
  hipIndices.set(catalog, hipIndex);
  return hipIndex;
}

function projectCatalog(catalog: SkyCatalog, celestial: CelestialState, observer: ObserverState,
  transform: Frame3, motion: boolean, projection: SkyFrame['projection'], key: string): SkyFrame {
  const positions = new Float32Array(catalog.stars.length * 3);
  const hipIndex = catalogHipIndex(catalog);
  const years = celestial.years;
  const epochYears = motion ? years : null;
  const cached = epochDirections.get(catalog);
  const recalculate = cached?.epochYears !== epochYears;
  const directions = cached?.directions ?? new Float64Array(positions.length);
  if (recalculate) epochDirections.delete(catalog);
  const [a, b, c] = transform;
  let aboveHorizon = 0;
  for (let index = 0, offset = 0; index < catalog.stars.length; index++, offset += 3) {
    if (recalculate) {
      const [x, y, z] = starDirection(catalog.stars[index], years, motion);
      directions[offset] = x;
      directions[offset + 1] = y;
      directions[offset + 2] = z;
    }
    const x = directions[offset], y = directions[offset + 1], z = directions[offset + 2];
    positions[offset] = a[0] * x + b[0] * y + c[0] * z;
    const height = a[1] * x + b[1] * y + c[1] * z;
    positions[offset + 1] = height;
    positions[offset + 2] = a[2] * x + b[2] * y + c[2] * z;
    if (height > 0) aboveHorizon++;
  }
  if (recalculate) epochDirections.set(catalog, { epochYears, directions });
  return { positions, hipIndex, aboveHorizon, sunAlt: observer.sun.altitudeDeg, date: celestial.date,
    apparentSun: apparentHorizonDisk(observer.sun), apparentMoon: apparentHorizonDisk(observer.moon),
    earthShadow: lunarShadow(celestial),
    years, eqjBasis: transform, key, projection, celestial, observer, motion };
}

export function createSkyFrame(catalog: SkyCatalog, date: Date, location: SkyLocation, motion = true,
  shared?: CelestialState): SkyFrame {
  const celestial = shared || createCelestialState(date);
  if (celestial.utc !== date.toISOString()) throw new Error('星空与观察时刻不一致。');
  const observer = createObserverState(celestial, location);
  return projectCatalog(catalog, celestial, observer, observer.eqjToSky, motion, 'horizon', observer.key);
}

export function createWorldSkyFrame(catalog: SkyCatalog, celestial: CelestialState, observer: ObserverState,
  frame: EarthSceneFrame, motion = true): SkyFrame {
  return projectCatalog(catalog, celestial, observer, frame.eqjToScene, motion, 'earth', frame.key);
}

/** Curved great-circle segments avoid chords dipping through the horizon. */
export function cultureGeometry(culture: SkyCulture[], frame: SkyFrame, selected: string) {
  const segments: number[] = [];
  const selectedCulture = selected === 'all' ? culture : culture.filter(item => item.id === selected);
  for (const item of selectedCulture) for (const polyline of item.lines) {
    for (let j = 1; j < polyline.length; j++) {
      const ai = frame.hipIndex.get(polyline[j - 1] as number);
      const bi = frame.hipIndex.get(polyline[j] as number);
      if (ai === undefined || bi === undefined || ai === bi) continue;
      const a = Array.from(frame.positions.slice(ai * 3, ai * 3 + 3));
      const b = Array.from(frame.positions.slice(bi * 3, bi * 3 + 3));
      const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, k) => sum + value * b[k], 0))));
      const steps = Math.max(1, Math.ceil(angle / (Math.PI / 90)));
      let previous = a;
      for (let step = 1; step <= steps; step++) {
        const f = step / steps;
        const p = a.map((value, k) => value * (1 - f) + b[k] * f);
        const length = Math.hypot(...p);
        const next = p.map(value => value / length);
        segments.push(...previous, ...next);
        previous = next;
      }
    }
  }
  return new Float32Array(segments);
}

export function cultureCenter(item: SkyCulture, frame: SkyFrame): [number, number, number] | null {
  const indices = [...new Set(item.lines.flat())].map(hip => frame.hipIndex.get(hip as number))
    .filter((index): index is number => index !== undefined);
  if (!indices.length) return null;
  const p = [0, 0, 0];
  for (const i of indices) for (let k = 0; k < 3; k++) p[k] += frame.positions[i * 3 + k];
  const length = Math.hypot(...p);
  return length > 0 ? [p[0] / length, p[1] / length, p[2] / length] : null;
}

/** Three source pixel/HIP anchors define the image plane; project it onto the sphere. */
export function illustrationDirection(image: SkyIllustration, frame: SkyFrame, x: number, y: number): [number, number, number] | null {
  if (image.anchors.length !== 3) return null;
  const [a, b, c] = image.anchors;
  const indices = image.anchors.map(anchor => frame.hipIndex.get(anchor.hip));
  if (indices.some(index => index === undefined)) return null;
  const bx = b.pos[0] - a.pos[0], by = b.pos[1] - a.pos[1];
  const cx = c.pos[0] - a.pos[0], cy = c.pos[1] - a.pos[1];
  const determinant = bx * cy - by * cx;
  if (Math.abs(determinant) < 1e-9) return null;
  const u = ((x - a.pos[0]) * cy - (y - a.pos[1]) * cx) / determinant;
  const v = (bx * (y - a.pos[1]) - by * (x - a.pos[0])) / determinant;
  const weights = [1 - u - v, u, v];
  const p = [0, 0, 0];
  // Authored tangent-plane art stores the distance of each unit star to that plane.
  // Interpolating those coplanar vectors preserves the portrait's aspect and rotation;
  // interpolating unit vectors alone introduces shear when controls are far apart.
  // Existing Stellarium artwork has no planeScale and retains its original mapping.
  for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) {
    p[k] += weights[i] * (image.anchors[i].planeScale ?? 1) * frame.positions[indices[i]! * 3 + k];
  }
  const length = Math.hypot(...p);
  return length > 0 ? [p[0] / length, p[1] / length, p[2] / length] : null;
}
