import {
  compareFingerprints,
  type ResultStatus,
  type SourceFingerprint,
} from '../metrics/result-schema.ts';

export type Vector3Value = { x: number; y: number; z: number };

export type AstroSnapshot = {
  id: string;
  utc: string;
  latDeg: number;
  lonDeg: number;
  altDeg: number;
  azDeg: number;
  azDefined: boolean;
  illumination: number;
  sunWorld: Vector3Value;
  moonWorld: Vector3Value;
};

export type AstroCaseComparison = {
  id: string;
  status: 'pass' | 'fail';
  web: AstroSnapshot;
  miniprogram: AstroSnapshot;
  differences: {
    sunDirectionDeg: number;
    moonDirectionDeg: number;
    altDeg: number;
    azDeg: number | null;
    illumination: number;
  };
  issues: string[];
};

export function angularDistanceDeg(a: Vector3Value, b: Vector3Value): number {
  const aLength = Math.hypot(a.x, a.y, a.z);
  const bLength = Math.hypot(b.x, b.y, b.z);
  if (aLength === 0 || bLength === 0) throw new Error('Direction vectors must be non-zero');
  const cosine = (a.x * b.x + a.y * b.y + a.z * b.z) / (aLength * bLength);
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}

function circularDifferenceDeg(a: number, b: number): number {
  const delta = Math.abs(((a - b + 540) % 360) - 180);
  return delta;
}

export function compareAstroCase(web: AstroSnapshot, miniprogram: AstroSnapshot): AstroCaseComparison {
  const differences = {
    sunDirectionDeg: angularDistanceDeg(web.sunWorld, miniprogram.sunWorld),
    moonDirectionDeg: angularDistanceDeg(web.moonWorld, miniprogram.moonWorld),
    altDeg: Math.abs(web.altDeg - miniprogram.altDeg),
    azDeg: web.azDefined && miniprogram.azDefined
      ? circularDifferenceDeg(web.azDeg, miniprogram.azDeg)
      : null,
    illumination: Math.abs(web.illumination - miniprogram.illumination),
  };
  const issues: string[] = [];
  if (differences.sunDirectionDeg > 0.01) issues.push('sun-direction-drift');
  if (differences.moonDirectionDeg > 0.01) issues.push('moon-direction-drift');
  if (differences.altDeg > 0.01) issues.push('solar-altitude-drift');
  if (differences.azDeg !== null && differences.azDeg > 0.01) issues.push('solar-azimuth-drift');
  if (differences.illumination > 1e-6) issues.push('moon-illumination-drift');
  return {
    id: web.id,
    status: issues.length === 0 ? 'pass' : 'fail',
    web,
    miniprogram,
    differences,
    issues,
  };
}

export function createAstroParityReport(input: {
  webCases: AstroSnapshot[];
  miniprogramCases: AstroSnapshot[];
  webFingerprint: SourceFingerprint;
  miniprogramFingerprint: SourceFingerprint;
}): {
  status: ResultStatus;
  fingerprint: ReturnType<typeof compareFingerprints>;
  cases: AstroCaseComparison[];
  missingCaseIds: string[];
} {
  const fingerprint = compareFingerprints(input.webFingerprint, input.miniprogramFingerprint);
  const miniById = new Map(input.miniprogramCases.map((entry) => [entry.id, entry]));
  const missingCaseIds = input.webCases
    .filter((entry) => !miniById.has(entry.id))
    .map((entry) => entry.id);
  const cases = input.webCases
    .filter((entry) => miniById.has(entry.id))
    .map((entry) => compareAstroCase(entry, miniById.get(entry.id)!));
  let status: ResultStatus = 'pass';
  if (cases.some((entry) => entry.status === 'fail')) status = 'fail';
  else if (fingerprint.status === 'inconclusive' || missingCaseIds.length > 0) status = 'inconclusive';
  return { status, fingerprint, cases, missingCaseIds };
}
