# High-DPR performance and loading iteration

## Code and measured changes

- `26b8c6d`: cache view-independent Earth AO and night-glow kernels in UV space, bound framebuffer pixels, add sustained-load DPR adaptation and measured-frame diagnostics. Balanced targets 30 FPS, detail 60, battery 24; Earth rim, atmospheric arc, Fresnel, geometry/cloud presets and refractive glass remain.
- `0954085`: pre-script branded shell, real base-texture completion progress, slow/failure retry or manual entry, Moon terrain loading/fallback status, WebP preference and staged detail loading, metadata and 44px NASA target.
- Apple M4 / Metal browser, 916×1201 CSS viewport with DPR 2: earlier unoptimized local baseline was 5.996 scene renders/s at 1832×2402. Disabling AO alone gave 12.76; disabling AO plus night-glow sampling gave 17.99. The retained-effect cache reached 21.33 at the same framebuffer size before adding the pixel budget.
- Disabling glass alone in the original profile gave 6.78 FPS. The selected glass strategy therefore retains one framebuffer copy and existing optics while bounding its dimensions through the pixel budget; regional-copy changes were not needed to address the dominant measured cost.
- Production-preview balanced sample: 26.23 scene renders/s over four seconds at 1173×1538 (effective DPR 1.281), compared with the prior 4.4 MP buffer. Adaptive resolution reduces pixels, so this is a combined optimization comparison, not a same-resolution speedup. Glass framebuffer memory decreased from 17,601,856 to 7,216,296 bytes in that sample.
- Mobile simulation, 390×844 CSS / device DPR 3: actual buffer 585×1266, 30.32 scene renders/s over three seconds in the aligned close view, 126,304 triangles / 9 scene draws plus 2 glass draws, NASA Moon 16,384 triangles. No 8K resource requested, no horizontal overflow, NASA target 44px high. This is browser simulation, not a physical iPhone measurement.
- Eight selected 2K source resources: 5,966,760 → 4,624,613 preferred transfer bytes, 22.5% smaller. Height/specular/normal data are not lossily recompressed; two conversions were larger and retain the original JPEGs. Six smaller WebP assets ship alongside original fallbacks.

## Validation

- TypeScript and production builds passed. Adaptive-resolution tests cover pixel ceiling, device-DPR cap, transient stalls, sustained overload, lower bound, slow recovery, invalid samples and resize.
- Local lighting 40/40, lunar phase 11/11, no-tilt 180 samples / max 0° passed.
- With JavaScript disabled, the HTML shell still displays LuBirth and the loading/enable-JavaScript prompt. With all Earth day-map candidates blocked, the overlay reports the failed resource and actual 1/2 completion; retry and manual-entry actions remain available. Blocking and script overrides were then removed.
- Moon near-view loading status was observed, followed by the loaded 16,384-triangle model. Mobile Hide UI did not enter native fullscreen; restoring settings and returning from native fullscreen preserved Shanghai / Shanghai / Huangpu. PNG screenshot loaded at 585×1266. Battery mode released the glass copy and used zero glass draws/bytes.
- A local production first-contentful-paint sample was 324ms; it is not comparable to a public cold-network measurement and is not a public performance promise.

## Release

- Package `/tmp/lubirth-release-performance-20261001`, release `lubirth-3fab3b0eb52ea2b2`, built from committed source `0954085539a41ab2790c26c8d950bce2ec17e3e4` with clean release inputs.
- Source SHA-256 `3fab3b0eb52ea2b2948b5476a6bdc539ea0a5fff1922d33f3f06031517c07191`.
- HTML SHA-256 `bb4cc5a39b85dee8a26d097477b64a790c079666fb5411b173f0a59942b59729`; health SHA-256 `591babf616912f4c120e0e23198182810383773b76d1fcf3e5de3a198e337507`.
- Created 38 immutable COS objects (37 delivery resources plus manifest), without overwrite or deletion. All 37 delivery resources / 30,954,892 bytes passed full SHA-256, CORS, immutable-cache and media-Range checks. Timing-header coverage was 0/37, reported separately.
- Both staged origin files matched their hashes; Nginx configuration validation and atomic symlink cutover succeeded. Public HTML and health hashes matched, TLS was trusted, `/lubirth` returned the expected 308, missing resources returned 404, and the original homepage remained available.

## Final public browser verification

- Public entry `index-BtLx5SE9.js` loads from `lubirth-3fab3b0eb52ea2b2`.
- At 916×1201 CSS / DPR 2, after assets stabilized: 28.98 scene renders/s over four seconds, actual buffer 1173×1538 / effective DPR 1.281, original 579,808 triangles / 12 scene draws plus 2 glass draws. This combines cached shading with fewer framebuffer pixels; the original 1832×2402 baseline was about 5.9 FPS.
- With browser cache disabled for that navigation, HTML TTFB was 1.041s and FCP 3.100s. This is one observed public sample, not a cross-device or cold-CDN guarantee. Browser caching was then restored.
- At 390×844 CSS / DPR 3, aligned near view: 30.24 scene renders/s over four seconds, 585×1266 buffer, 126,304 triangles / 9 scene draws plus 2 glass draws. NASA Moon uses 16,384 triangles; no 8K requests, no horizontal overflow, NASA link hit area 44px. Visual inspection retained the blue Earth arc, lunar detail and refractive rectangular glass.
- Public lighting 40/40, lunar phase 11/11, no-tilt 180 samples / max 0° passed. No captured public console warnings or errors.
- Public Hide UI leaves native fullscreen inactive and hides music/settings; restoring settings retains Shanghai / Shanghai / Huangpu. Native fullscreen was observed active, then Escape restored the same form. Screenshot PNG loaded at 585×1266.

## Outstanding external configuration

The existing Keychain credential was rejected by the CDN API with `UnauthorizedOperation.CdnCamUnauthorized` during the read-only header plan. No CDN configuration was changed and no alternate credential was sought. `deploy/configure-cdn-timing.py` is scoped to appending `Timing-Allow-Origin: https://aitoshuu.me` only for `/releases/aitoshuu-me/` on the two existing asset/media domains, preserving other response rules. Offline preservation/idempotence/disabled-rule guards passed. The user has been asked to configure it in the console or explicitly defer it. The CDN verifier reports actual timing-header coverage separately; missing TAO is not recorded as a pass.

Physical iPhone Safari sustained FPS, thermal behavior and gyroscope operation remain unmeasured.
