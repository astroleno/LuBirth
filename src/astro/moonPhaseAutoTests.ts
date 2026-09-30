import { AstroTime, Body, Illumination } from 'astronomy-engine';
import { getMoonPhase, getMoonPhaseAtTime } from '../scenes/simple/api/moonPhase';
import { calculateMoonPhase } from '../scenes/simple/utils/moonPhaseCalculator';

type TestResult = { name: string; ok: boolean; info?: any; issues?: string[] };

function findExtremaInMonth(year: number, monthIndex0: number) {
  const samples: { date: string; frac: number; angleDeg: number }[] = [];
  const daysInMonth = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(Date.UTC(year, monthIndex0, d, 12, 0, 0)); // 每天中午采样，减少昼夜影响
    const info = Illumination(Body.Moon, new AstroTime(dt));
    samples.push({ date: dt.toISOString(), frac: info.phase_fraction, angleDeg: info.phase_angle });
  }
  let minI = 0, maxI = 0, minF = +Infinity, maxF = -Infinity;
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].frac < minF) { minF = samples[i].frac; minI = i; }
    if (samples[i].frac > maxF) { maxF = samples[i].frac; maxI = i; }
  }
  // 寻找两个最接近 0.5 的候选（近似上弦、下弦）
  const byHalf = [...samples].map((s, idx) => ({ idx, diff: Math.abs(s.frac - 0.5) }))
    .sort((a, b) => a.diff - b.diff).slice(0, 4).map(x => x.idx).sort((a, b) => a - b);
  const quarters = byHalf.map(i => samples[i]);
  return { samples, newMoon: samples[minI], fullMoon: samples[maxI], quarters };
}

export function runMoonPhaseAutoTests() {
  const results: TestResult[] = [];
  const push = (r: TestResult) => { results.push(r); console[(r.ok?'log':'error')](`[MoonPhaseTest] ${r.ok?'✅':'❌'} ${r.name}`, r.ok? r.info : r.issues); };

  try {
    // Independent phase dates: USNO 2026 table, https://aa.usno.navy.mil/api/moon/phases/year?year=2026
    const fixtures = [
      { name: 'Last quarter', utc: '2026-09-04T07:51:00Z', cycle: 270, fraction: 0.5 },
      { name: 'New moon', utc: '2026-09-11T03:27:00Z', cycle: 0, fraction: 0 },
      { name: 'First quarter', utc: '2026-09-18T20:44:00Z', cycle: 90, fraction: 0.5 },
      { name: 'Full moon', utc: '2026-09-26T16:49:00Z', cycle: 180, fraction: 1 },
    ];
    for (const sample of fixtures) {
      const date = new Date(sample.utc);
      const phase = getMoonPhaseAtTime(date);
      const cycleError = Math.abs(((phase.cycleAngleDeg - sample.cycle + 540) % 360) - 180);
      const angleFraction = (1 + Math.cos(phase.phaseAngleRad)) / 2;
      const expectedSide = sample.cycle === 90 ? 1 : sample.cycle === 270 ? -1 : 0;
      const issues: string[] = [];
      if (cycleError > 0.1) issues.push('cycle differs from USNO event by >0.1 degrees');
      if (Math.abs(phase.illumination - sample.fraction) > 0.01) issues.push('incorrect phase fraction');
      if (Math.abs(angleFraction - phase.illumination) > 1e-10) issues.push('phase angle is inverted');
      if (expectedSide && Math.sign(phase.sunDirection.x) !== expectedSide) issues.push('wrong bright side');
      // Rasterize the geometric terminator over a projected sphere, not just the ephemeris return value.
      let visible = 0, lit = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const nx = (x + 0.5) / 128 - 1, ny = (y + 0.5) / 128 - 1;
        const r2 = nx * nx + ny * ny;
        if (r2 >= 1) continue;
        visible++;
        if (nx * phase.sunDirection.x + ny * phase.sunDirection.y + Math.sqrt(1 - r2) * phase.sunDirection.z > 0) lit++;
      }
      if (Math.abs(lit / visible - phase.illumination) > 0.002) issues.push('render direction gives wrong lit area');
      const label = calculateMoonPhase(date, 31, 121.5);
      if (Math.abs(label.illumination - phase.illumination) > 1e-10) issues.push('UI and material phase differ');
      push({ name: `Application / ${sample.name}`, ok: !issues.length,
        info: { utc: sample.utc, cycleError, fraction: phase.illumination, rasterFraction: lit / visible, brightSide: Math.sign(phase.sunDirection.x) }, issues });
    }
    const localPhase = getMoonPhase('2026-09-19T04:44', 31.23, 121.5);
    const utcPhase = getMoonPhaseAtTime(new Date('2026-09-18T20:44:00Z'));
    push({ name: 'Application / selected local time matches UTC',
      ok: Math.abs(localPhase.illumination - utcPhase.illumination) < 1e-12 });
    const months = [ { y: 2024, m: 2 }, { y: 2024, m: 5 } ]; // 2024-03 与 2024-06（0基索引）
    for (const mm of months) {
      const ext = findExtremaInMonth(mm.y, mm.m);
      const okNew = ext.newMoon.frac <= 0.05;
      const okFull = ext.fullMoon.frac >= 0.95;
      push({ name:`${mm.y}-${String(mm.m+1).padStart(2,'0')} NewMoon`, ok: okNew, info: ext.newMoon, issues: okNew? undefined : [ `min phase_fraction=${ext.newMoon.frac.toFixed(3)}` ] });
      push({ name:`${mm.y}-${String(mm.m+1).padStart(2,'0')} FullMoon`, ok: okFull, info: ext.fullMoon, issues: okFull? undefined : [ `max phase_fraction=${ext.fullMoon.frac.toFixed(3)}` ] });
      // 四分相：相位角应接近90°，给较宽容差
      const qOk = ext.quarters.some(q => Math.abs(q.angleDeg - 90) <= 15);
      push({ name:`${mm.y}-${String(mm.m+1).padStart(2,'0')} QuarterNear90deg`, ok: qOk, info: ext.quarters, issues: qOk? undefined : ['no quarter near 90° found'] });
    }
  } catch (e) {
    push({ name:'Runner', ok:false, issues:[ String(e) ] });
  }

  const passed = results.filter(r=>r.ok).length;
  const payload = { when: new Date().toISOString(), passed, total: results.length, results };
  console.log('[MoonPhaseTest:JSON]', JSON.stringify(payload, null, 2));
  return payload;
}
