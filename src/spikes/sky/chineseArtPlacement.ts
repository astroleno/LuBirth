import { starDirection } from './skyModel';
import type { SkyCatalog, SkyCulture, SkyIllustration } from './skyModel';

export type FigureControl = { hip: number; uv: number[]; feature: string };
export type FigurePlacement = { number: number; controls: FigureControl[]; rationale: string };
const dot = (a: number[], b: number[]) => a.reduce((s, n, i) => s + n * b[i], 0);
const unit = (v: number[]) => { const length = Math.hypot(...v); return v.map(n => n / length); };
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Two authored figure landmarks determine a similarity, never a mirror or anisotropic warp.
 * The third HIP fixes the projection plane; it is not an extra historical member.
 * These are contemporary compositional correspondences, not historical anatomical claims.
 */
export function registerChineseFigure(catalog: SkyCatalog, item: SkyCulture, file: string, size: number[], placement: FigurePlacement) {
  if (placement.controls.length !== 2 || size.some(n => !Number.isFinite(n) || n <= 0)) throw new Error('Invalid figure controls: ' + item.id);
  const members = new Set(item.lines.flat());
  const stars = new Map(catalog.stars.filter(s => s[1] !== null).map(s => [s[1]!, s]));
  const controls = placement.controls.map(control => {
    const star = stars.get(control.hip);
    if (!star || !members.has(control.hip) || control.uv.length !== 2 || control.uv.some(n => !Number.isFinite(n) || n < 0 || n > 1)) {
      throw new Error('Figure landmarks must use known asterism members and image coordinates: ' + item.id);
    }
    return { ...control, p: starDirection(star, 0, false), pixel: [control.uv[0] * size[0], control.uv[1] * size[1]] };
  });
  if (controls[0].hip === controls[1].hip) throw new Error('Figure controls must be distinct: ' + item.id);
  const center = unit(controls[0].p.map((n, i) => n + controls[1].p[i]));
  const east = unit([-center[1], center[0], 0]), north = cross(center, east);
  // A view from inside the celestial sphere: east is left, north is up.
  const project = (p: number[]) => [-dot(p, east) / dot(p, center), -dot(p, north) / dot(p, center)];
  const q = controls.map(c => project(c.p));
  const dx = controls[1].pixel[0] - controls[0].pixel[0], dy = controls[1].pixel[1] - controls[0].pixel[1];
  const qx = q[1][0] - q[0][0], qy = q[1][1] - q[0][1];
  const denominator = dx * dx + dy * dy;
  if (denominator < 1 || Math.hypot(qx, qy) < 1e-7) throw new Error('Degenerate figure axis: ' + item.id);
  const a = (qx * dx + qy * dy) / denominator, b = (qy * dx - qx * dy) / denominator;
  const scale2 = a * a + b * b;
  const origin = [q[0][0] - a * controls[0].pixel[0] + b * controls[0].pixel[1],
    q[0][1] - b * controls[0].pixel[0] - a * controls[0].pixel[1]];
  const pixelAt = (p: number[]) => {
    const t = project(p), x = t[0] - origin[0], y = t[1] - origin[1];
    return [(a * x + b * y) / scale2, (-b * x + a * y) / scale2];
  };
  const candidates = [...stars].filter(([hip]) => !controls.some(c => c.hip === hip)).map(([hip, star]) => {
    const p = starDirection(star, 0, false), cosine = dot(p, center), t = project(p);
    const area = Math.abs(qx * (t[1] - q[0][1]) - qy * (t[0] - q[0][0]));
    const altitude = area / Math.hypot(qx, qy);
    return { hip, p, cosine, altitude, member: members.has(hip) };
  }).filter(c => c.cosine > .9 && c.altitude > Math.hypot(qx, qy) * .08);
  // Prefer a third member; two-star / almost collinear groups need an explicitly marked helper.
  const preferred = candidates.filter(c => c.member);
  const third = (preferred.length ? preferred.sort((a, b) => b.altitude - a.altitude)
    : candidates.sort((a, b) => b.cosine - a.cosine))[0];
  if (!third) throw new Error('No stable third projection control: ' + item.id);
  const anchors = [...controls, third].map(c => ({ hip: c.hip, pos: pixelAt(c.p), planeScale: 1 / dot(c.p, center) }));
  const memberPixels = [...members].filter((hip): hip is number => typeof hip === 'number' && stars.has(hip)).map(hip => ({
    hip, uv: pixelAt(starDirection(stars.get(hip)!, 0, false)).map((v, i) => v / size[i]),
  }));
  return { image: { file, size, anchors } as SkyIllustration,
    calibration: { method: 'two-member-landmarks-similarity-v1', controls: placement.controls,
      rotationDeg: Math.atan2(b, a) * 180 / Math.PI,
      angularWidthDeg: 2 * Math.atan(Math.sqrt(scale2) * size[0] / 2) * 180 / Math.PI,
      thirdControl: { hip: third.hip, role: third.member ? 'asterism-member' : 'projection-helper' },
      memberPixels, rationale: placement.rationale, historicalStatus: 'Contemporary authored placement; not a historical anatomical mapping.' } };
}
