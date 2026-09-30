# LuBirth performance iteration — 2026-09-30

## Scope and changes

Preserve the current visual design, resolution profiles, cloud layers, geometry, lunar phase, sensor interaction, folded UI and screenshots.

- Cloud React state now stores only the near/far classification (`distance < 8`), updating only when that boundary changes. Continuous camera motion no longer schedules a cloud subtree update every frame.
- Moon screen anchoring reuses its output vector; tidal offsets are memoized; relief and view calculations reuse scratch vectors/quaternions. Cloud camera uniforms are filled in place.
- Cloud materials are disposed when replaced/unmounted. Earth light uniforms are cloned separately so loader-owned texture references are not cloned.
- Texture consumers detach before disabled resources are disposed. Earth shadow/displacement/normal uniforms reset to placeholders when their maps disappear. This fixes cloud textures being uploaded again through stale shadow references after disposal.
- Earth continues using DEM-derived normals. The unused 420,471-byte traditional normal image is no longer requested.
- Browser diagnostics load only on explicit console calls or test query flags. Initial console calls are awaitable; regular navigation avoids the diagnostic chunk.

Lossless WebP conversion was tested on the Moon color/normal JPEGs but made both files larger, so the original assets were retained. No quality reductions or new model assets were introduced.

## Evidence

- TypeScript, production build and `git diff --check` passed.
- 27 anchor projection cases passed across portrait/landscape aspect ratios, camera azimuths and screen positions, checking output-vector reuse, camera distance and projected coordinates.
- Browser lighting regression 40/40, lunar regression 11/11, and no-tilt 180 samples with maximum 0°. The pre-existing optional seasonal/fixed-azimuth hooks remain unavailable and are not counted as passes.
- Diagnostics network requests: zero during normal startup; one after the first console test. The `?fulltest=1` entry also executes successfully. The unused Earth normal image is absent from requests.
- At 390×844 in the desktop browser's mobile layout, simulated orientation events at approximately 30 Hz maintained the 30 FPS target. Cloud render count stayed at 11 during the measured motion window; camera position changed. Both old and new close views use 126,304 triangles, 9 draw calls and the 16,384-triangle lunar GLB.
- Before the stale-reference fix, repeated cloud toggles produced texture counts 12 → 13 → 14. After the fix, four toggles yielded 11 → 11 → 11 → 11, with 9 geometries each time.
- Screenshot preview still opens with the generated scene image. Mobile near-view screenshots retain neutral Moon color and the right-lit first-quarter phase.
- Packaged entry JS: 1,280,379 → 1,265,735 bytes; local gzip estimate 358,352 → 353,557 bytes. In addition, normal-image requests save 420,471 bytes. Total immutable package size is nearly unchanged because original assets are retained for compatibility and diagnostics are deferred, not removed.
- Three short, otherwise idle-browser motion samples gave script time approximately 21.3–22.0 ms/s before and 19.7–20.8 ms/s after. Earlier concurrent-build samples varied dramatically, so these desktop measurements are observations rather than a claimed phone speedup. Physical-phone frame time, thermal behavior and battery consumption were not measured.

## Release

- Public URL: https://aitoshuu.me/lubirth/
- Release ID: `lubirth-032f356ec4b5c045`; package `/tmp/lubirth-release-perf-20260930`, built from the working tree without a new Git commit.
- Approved COS destination: `tongye-1327162705`, `ap-shanghai`, `releases/aitoshuu-me/lubirth-032f356ec4b5c045/`. Only repository deployment wrappers use the existing scoped credentials.
- 35 create-only COS objects uploaded successfully. Initial checks encountered intermittent audio transport failures; independent full audio downloads matched the release hash. The repository verifier now supports scoped system-HTTPS transport (`--system-http`) with bounded retries while retaining all verification rules and TLS validation. The complete run passed for all 34 delivery files, including hashes, CORS, immutable caching and media Range.
- Origin staging hashes matched; `/www/wwwroot/lubirth-current` switched to `/www/wwwroot/lubirth-releases/lubirth-032f356ec4b5c045/web`. Public verification passed for trusted TLS, HTML/health hashes, canonical 308 redirect, missing-file 404 and home preservation.
- Public mobile-layout browser verification loaded the new release entry, requested neither the diagnostic chunk nor the unused Earth normal image, and entered the folded-panel near view.
- Previous release `lubirth-7ad5f5e5db60c10c` remains available for rollback. Existing COS objects were not overwritten or deleted.
