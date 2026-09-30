# LuBirth lunar color and phase — 2026-09-29

## Change

- Lunar shading now uses neutral light color independently of the Earth's warm material treatment. The lunar shader retains 15% of the source texture's color variation and includes Three.js tone mapping and output color-space conversion.
- Phase calculations and UI share Astronomy Engine `Illumination` and `MoonPhase`. Physical phase angle (full = 0°, new = 180°) is separate from cycle longitude (new/first/full/last = 0/90/180/270°).
- The terminator uses a signed normal/light dot product. The light direction is transformed from the Moon-to-camera presentation frame into the render camera's view space, including off-centre anchors. Night-side lift changed from 0.12 to 0.002.
- Existing lightweight GLB and texture files are unchanged. No additional model downloads are introduced.

## Validation

- TypeScript, release Vite build, and `git diff --check` passed.
- Browser `runSolarFullTests()`: lighting 40/40; lunar 11/11; no-tilt 180 samples, maximum tilt 0°. The existing optional fixed-sun-azimuth and seasonal browser hooks were absent (`null`), so those were not executed or counted as passes.
- Four independent fixtures from [USNO's 2026 phase table](https://aa.usno.navy.mil/api/moon/phases/year?year=2026): last quarter September 4 07:51 UTC, new moon September 11 03:27 UTC, first quarter September 18 20:44 UTC, full moon September 26 16:49 UTC. Cycle error was below 0.007°. Tests cover phase fraction, phase-angle convention, quarter bright side, projected sphere lit area, UI consistency, and local-to-UTC conversion.
- Browser visual checks confirmed gray lunar color, right-lit first quarter, left-lit last quarter, almost-dark new moon, and full disk at full moon. No browser error logs were captured during those checks.

## Presentation limits

This is a geocentric phase diagram with waxing on the right and waning on the left. It does not reproduce local sky orientation, libration, or eclipse shadows. Existing longitude-derived timezone conversion remains in place. Physical-phone sensor behavior was not retested in this color/phase change.

## Release

- Package: `/tmp/lubirth-release-moon-20260929`; release ID `lubirth-7ad5f5e5db60c10c`.
- Built from the current worktree; no Git commit created. Source digest and Git HEAD are recorded in the package manifest.
- 34 create-only objects uploaded via the repository Keychain wrapper to `tongye-1327162705`, `ap-shanghai`, prefix `releases/aitoshuu-me/lubirth-7ad5f5e5db60c10c/`.
- CDN verification passed for all 33 delivery resources, including content hashes, CORS, immutable caching and media Range.
- Origin staging matched both file hashes. Public cutover completed just after midnight on September 30 (Asia/Shanghai): `/www/wwwroot/lubirth-current` now points to `/www/wwwroot/lubirth-releases/lubirth-7ad5f5e5db60c10c/web`.
- `verify-public-release.mjs` passed: trusted TLS, matching HTML and release-health hashes, canonical 308 redirect, missing-asset 404, and preserved home page.
- Public browser verification confirmed the new CDN release, neutral lunar color and waning-gibbous phase at 2026-09-30 00:01 UTC+8 (illumination 0.890928). At 390×844, the existing panel folded correctly and the Moon remained visible above Earth. No browser errors were reported.
- Previous release `lubirth-29e8697c0e0c09c3` remains available for rollback; existing immutable COS objects were not modified or deleted.
