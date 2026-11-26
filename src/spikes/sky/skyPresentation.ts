import type { Matrix4 } from 'three';
import { illustrationDirection, starDirection } from './skyModel';
import type { SkyCatalog, SkyCulture, SkyFrame, SkyIllustration } from './skyModel';
import type { Vec3 } from '../../astro/referenceFrames';

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
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]]
    .map(([x, y]) => illustrationDirection(image, frame, x * image.size[0], y * image.size[1]))
    .filter((point): point is Vec3 => point !== null);
  return corners.length === 4 ? { item, center, corners } : null;
}

/** Clip the projected image as a whole so the same patch intersects the view and the horizon. */
function intersectsArtwork(corners: Vec3[], planes: number[][]) {
  let polygon: number[][] = corners;
  for (const plane of planes) {
    const distances = polygon.map(point => dot(point, plane));
    if (distances.every(distance => distance <= 0)) return false;
    if (distances.every(distance => distance > 0)) continue;
    const clipped: number[][] = [];
    let previous = polygon.length - 1;
    for (let index = 0; index < polygon.length; index++) {
      if ((distances[previous] > 0) !== (distances[index] > 0)) {
        const weight = distances[previous] / (distances[previous] - distances[index]);
        clipped.push(polygon[previous].map((value, axis) => value + weight * (polygon[index][axis] - value)));
      }
      if (distances[index] > 0) clipped.push(polygon[index]);
      previous = index;
    }
    if (clipped.length < 3) return false;
    polygon = clipped;
  }
  return true;
}

export function visibleArtwork(bounds: NonNullable<ReturnType<typeof artBounds>>[], projection: Matrix4, ground: boolean, selected: string, limit: number) {
  const { elements } = projection;
  // Clip-space side planes are w ± x and w ± y. Perspective w also ranks forward alignment.
  const forward = [elements[3], elements[7], elements[11]];
  const planes = [0, 1].flatMap(row => [-1, 1].map(sign =>
    forward.map((component, column) => component + sign * elements[column * 4 + row])));
  if (ground) planes.push([0, 1, 0]);
  return bounds.filter(bound => intersectsArtwork(bound.corners, planes))
    .map(({ item, center }) => ({ item, alignment: dot(center, forward) }))
    .sort((a, b) => Number(b.item.id === selected) - Number(a.item.id === selected) || b.alignment - a.alignment)
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
