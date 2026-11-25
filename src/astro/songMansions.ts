import { AstroTime, Rotation_EQJ_EQD } from 'astronomy-engine';
import { astronomyFrame } from './celestialState';
import { applyFrame, DEG } from './referenceFrames';
import type { Frame3, Vec3 } from './referenceFrames';

// Shinkai (2025), Table A.1, Huangyou column, in historical order.
// The paper uses these stars in its 1080 reconstruction of Su Song's charts.
export const SONG_MANSION_STARS = [
  ['角', 65474], ['亢', 69427], ['氐', 72603], ['房', 78265], ['心', 80112], ['尾', 82514], ['箕', 88635],
  ['斗', 92041], ['牛', 100345], ['女', 102618], ['虚', 106278], ['危', 109074], ['室', 113963], ['壁', 1067],
  ['奎', 3693], ['娄', 8903], ['胃', 12719], ['昴', 17499], ['毕', 20889], ['觜', 26207], ['参', 25930],
  ['井', 30343], ['鬼', 41822], ['柳', 42313], ['星', 46390], ['张', 48356], ['翼', 53740], ['轸', 59803],
] as const;

export const SONG_MANSION_EPOCH = '1080-07-01T00:00:00Z';
let songEpoch: { frame: Frame3; years: number } | undefined;
export const SONG_MANSION_YEARS = [1078, 1085] as const;

export function supportsSongMansionDate(date: Date) {
  const year = date.getUTCFullYear();
  return year >= SONG_MANSION_YEARS[0] && year <= SONG_MANSION_YEARS[1];
}

function raDegrees(directionEqj: Vec3) {
  const [x, y] = applyFrame(getSongEpoch().frame, directionEqj);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

function getSongEpoch() {
  if (!songEpoch) {
    const epoch = new AstroTime(new Date(SONG_MANSION_EPOCH));
    songEpoch = { frame: astronomyFrame(Rotation_EQJ_EQD(epoch)), years: epoch.tt / 365.25 };
  }
  return songEpoch;
}

export function songMansionBoundaries(starDirectionAt: (hip: number, yearsSinceJ2000: number) => Vec3 | undefined) {
  const boundaries = SONG_MANSION_STARS.map(([name, hip]) => {
    const direction = starDirectionAt(hip, getSongEpoch().years);
    if (!direction) throw new Error(`宋代宿界缺少距星 HIP ${hip}`);
    return { name, hip, raDeg: raDegrees(direction) };
  });
  const first = boundaries[0].raDeg;
  const wrapped = boundaries.map(entry => ({ ...entry, offset: (entry.raDeg - first + 360) % 360 }));
  if (wrapped.some((entry, index) => index > 0 && entry.offset <= wrapped[index - 1].offset)) {
    throw new Error('距星赤经与宋代二十八宿顺序不符');
  }
  return wrapped;
}

export function reconstructedSongMansion(directionEqj: Vec3, date: Date, boundaries: ReturnType<typeof songMansionBoundaries>) {
  if (!supportsSongMansionDate(date)) return null;
  const ra = raDegrees(directionEqj);
  const offset = (ra - boundaries[0].raDeg + 360) % 360;
  const next = boundaries.findIndex(entry => offset < entry.offset);
  const index = next < 0 ? boundaries.length - 1 : next - 1;
  const start = boundaries[index], end = boundaries[(index + 1) % boundaries.length];
  const marginDeg = Math.min(offset - start.offset, (next < 0 ? 360 : end.offset) - offset);
  return { name: start.name, hip: start.hip, marginDeg };
}
