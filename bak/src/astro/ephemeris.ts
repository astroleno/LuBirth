import {
  AstroTime,
  Body,
  GeoVector,
  Observer,
  ObserverVector,
  RotateVector,
  Rotation_EQJ_EQD,
  Vector
} from 'astronomy-engine';

export type Ephemeris = {
  time: Date;
  // EQD (equator-of-date) frame vectors
  sunEQD: { x: number; y: number; z: number };
  moonEQD: { x: number; y: number; z: number };
  observerEQD: { x: number; y: number; z: number };
  // Moon illumination fraction, rough: based on sun/moon angle
  illumination: number;
};

function len(v: {x:number;y:number;z:number}) { return Math.hypot(v.x, v.y, v.z); }
function dot(a: {x:number;y:number;z:number}, b:{x:number;y:number;z:number}) { return a.x*b.x + a.y*b.y + a.z*b.z; }

export function computeEphemeris(dateUtc: Date, lat: number, lon: number): Ephemeris {
  const time = new AstroTime(dateUtc);
  const rot = Rotation_EQJ_EQD(time);

  const sunEQJ = GeoVector(Body.Sun, time, true);
  const moonEQJ = GeoVector(Body.Moon, time, true);

  const sunEQD = RotateVector(rot, sunEQJ);
  const moonEQD = RotateVector(rot, moonEQJ);

  const observer = new Observer(lat, lon, 0);
  const obsEQD = ObserverVector(time, observer, true);

  const s = sunEQD;
  const m = moonEQD;
  // illumination fraction via phase angle
  const cosPhase = dot(s, m) / (len(s) * len(m));
  const phaseAngle = Math.acos(Math.min(1, Math.max(-1, cosPhase)));
  const illumination = (1 + Math.cos(phaseAngle)) / 2;

  return {
    time: dateUtc,
    sunEQD: { x: s.x, y: s.y, z: s.z },
    moonEQD: { x: m.x, y: m.y, z: m.z },
    observerEQD: { x: obsEQD.x, y: obsEQD.y, z: obsEQD.z },
    illumination
  };
}

export function offsetHoursFromLongitude(lon: number): number {
  // Simple whole-hour time zone from longitude; Shanghai ~ +8
  return Math.round(lon / 15);
}

export function toUTCFromLocal(localISO: string, lon: number): Date {
  // localISO like '1993-08-01T11:00'
  const local = new Date(localISO);
  const offset = offsetHoursFromLongitude(lon);
  // Date stores in local TZ; convert by building a UTC date manually
  const y = local.getFullYear();
  const mo = local.getMonth();
  const d = local.getDate();
  const h = local.getHours();
  const mi = local.getMinutes();
  // subtract offset to get UTC
  const utc = new Date(Date.UTC(y, mo, d, h - offset, mi, 0));
  return utc;
}

