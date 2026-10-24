import { illustrationDirection, starDirection } from './skyModel';
import type { SkyCatalog, SkyCulture, SkyFrame, SkyIllustration } from './skyModel';

export const CHINESE_GROUPS = [
  ['all', '全部天区'], ['purple', '紫微垣'], ['supreme', '太微垣'], ['market', '天市垣'],
  ['dragon', '青龙七宿'], ['tortoise', '玄武七宿'], ['tiger', '白虎七宿'], ['bird', '朱雀七宿'],
] as const;
export function cultureGroup(item: SkyCulture) {
  const code = item.id.split(' ').pop() || '';
  if (code.startsWith('P')) return 'purple';
  if (code.startsWith('S')) return 'supreme';
  if (code.startsWith('H')) return 'market';
  const mansion = Number(code.slice(0, 2));
  return mansion >= 1 && mansion <= 28 ? ['dragon', 'tortoise', 'tiger', 'bird'][Math.floor((mansion - 1) / 7)] : 'all';
}
export function isMajorCulture(item: SkyCulture) {
  return !item.id.includes('chinese_') || /垣[东西]蕃$/.test(item.name)
    || /\d{2}A$/.test(item.id);
}
const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const normalized = (v: number[]) => { const n = Math.hypot(...v); return v.map(x => x / n); };

/** Contemporary composition registration. Helper HIP stars are NOT added to historical lines. */
export function createChineseIllustration(catalog: SkyCatalog, item: SkyCulture, file: string, size: number[], widthDeg: number): SkyIllustration {
  const members = catalog.stars.filter(star => item.lines.flat().includes(star[1]!));
  const center = normalized(members.map(star => starDirection(star, 0, false)).reduce<number[]>((a, b) => a.map((v, i) => v + b[i]), [0, 0, 0]));
  const east = normalized([-center[1], center[0], 0]);
  const north = [center[1] * east[2] - center[2] * east[1], center[2] * east[0] - center[0] * east[2], center[0] * east[1] - center[1] * east[0]];
  const tangent = Math.tan(widthDeg * Math.PI / 360);
  const verticalTangent = tangent * size[1] / size[0];
  const candidates = catalog.stars.filter(star => star[1] !== null && star[4] < 5.5).map(star => {
    const p = starDirection(star, 0, false), denominator = dot(p, center);
    return { hip: star[1]!, pos: [(1 - dot(p, east) / denominator / tangent) * size[0] / 2,
      (1 - dot(p, north) / denominator / verticalTangent) * size[1] / 2], distance: 1 - denominator };
  }).filter(p => p.distance < .15).sort((a, b) => a.distance - b.distance).slice(0, 24);
  let anchors = candidates.slice(0, 3), best = -1;
  for (let a = 0; a < candidates.length; a++) for (let b = a + 1; b < candidates.length; b++) for (let c = b + 1; c < candidates.length; c++) {
    const [p, q, r] = [candidates[a], candidates[b], candidates[c]];
    const area = Math.abs((q.pos[0] - p.pos[0]) * (r.pos[1] - p.pos[1]) - (q.pos[1] - p.pos[1]) * (r.pos[0] - p.pos[0]));
    if (area > best) { best = area; anchors = [p, q, r]; }
  }
  if (best <= 0) throw new Error('Cannot register artwork: ' + item.id);
  return { file, size, anchors: anchors.map(({ hip, pos }) => ({ hip, pos })) };
}
export function artBounds(item: SkyCulture, frame: SkyFrame) {
  if (!item.image) return null;
  const image = item.image, center = illustrationDirection(image, frame, image.size[0] / 2, image.size[1] / 2);
  if (!center) return null;
  const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => illustrationDirection(image, frame, x * image.size[0], y * image.size[1]));
  const radius = Math.max(...corners.filter((p): p is [number, number, number] => !!p).map(p => Math.acos(Math.max(-1, Math.min(1, dot(center, p))))));
  return { item, center, radius };
}
export function visibleArtwork(bounds: NonNullable<ReturnType<typeof artBounds>>[], view: { azimuth: number; altitude: number; fov: number }, aspect: number, ground: boolean, selected: string, limit: number) {
  const az = view.azimuth * Math.PI / 180, alt = view.altitude * Math.PI / 180;
  const forward = [Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt)];
  const right = [Math.cos(az), 0, Math.sin(az)];
  const up = [-Math.sin(az) * Math.sin(alt), Math.cos(alt), Math.cos(az) * Math.sin(alt)];
  const halfV = view.fov * Math.PI / 360, halfH = Math.atan(Math.tan(halfV) * aspect);
  const planes = [[right, halfH], [up, halfV]].flatMap(([axis, half]) => [-1, 1].map(sign =>
    forward.map((f, i) => f * Math.sin(half as number) + sign * (axis as number[])[i] * Math.cos(half as number))));
  const halfDiagonal = Math.atan(Math.tan(view.fov * Math.PI / 360) * Math.hypot(1, aspect));
  return bounds.map(b => ({ ...b, angle: Math.acos(Math.max(-1, Math.min(1, dot(b.center, forward)))) }))
    .filter(b => b.angle < halfDiagonal + Math.min(b.radius, 1.3) + .05
      && planes.every(plane => dot(b.center, plane) > -Math.sin(Math.min(1.5, b.radius + .04)))
      && (!ground || Math.asin(b.center[1]) + b.radius > 0))
    .sort((a, b) => Number(b.item.id === selected) - Number(a.item.id === selected) || a.angle - b.angle)
    .slice(0, limit).map(b => b.item);
}

export const SOURCE_LINKS = {
  stars: 'https://codeberg.org/astronexus/hyg/src/commit/53e3df311869e813ace5f1ad2ec4ce909f13256c',
  song: 'https://github.com/Stellarium/stellarium/tree/023040b5241badc9ea0b29428e3ef3f35d2fc65b/skycultures/chinese_song_dynasty',
  modern: 'https://github.com/Stellarium/stellarium/tree/v26.3/skycultures/modern',
  animals: 'https://ctext.org/wiki.pl?chapter=603024&if=gb',
  yuhuang: 'https://commons.wikimedia.org/wiki/Category:Statues_of_the_Twenty-Eight_Mansions_in_Jade_Emperor_Temple,_Fucheng',
  nasa: 'https://svs.gsfc.nasa.gov/4851/',
};
