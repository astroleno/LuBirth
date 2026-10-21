# Interactive glass controls

## Source and behavior

- Code: `a22adde5c155a12204ed3861b600abc6718dea93` (`feat: add interactive glass relief to UI controls`).
- Buttons use the established 8px rounded rectangles inside the 12px glass shells. Their local refraction, directional optical edge and moving highlight are combined with the existing shell shader before sampling the original scene. There is no extra button backdrop, framebuffer copy or draw call.
- Pointer and keyboard input drive the same press state for the material and crisp DOM text, reaching a restrained scale of 0.96. A paused native animation keeps the DOM transform synchronized without inline-style mutations, React frame state or repeated layout measurements.
- Pointer cancellation, lost focus, disabled controls and hidden-tab input reset correctly. Reduced motion retains static feedback with scale 1; reduced transparency and battery mode retain readable CSS surfaces. Closed settings do not register invisible buttons, and removed controls cancel their animations.
- Earth/Moon composition, the configured 70° birthplace alignment, annotation clearance, lunar lighting, night intensity 3.0 and the dedicated 4K close-up night texture remain unchanged.
- This remains a web implementation inspired by Liquid Glass. The work does not claim an exact reproduction of native iOS or the latest Weibo, QQ or WeChat builds.

## Validation

- TypeScript and whitespace checks passed. The production package built successfully; the existing large-chunk warning remains.
- Muted Ego Lite verified pointer hover, press/release, keyboard press and focus loss, disabling a held button, touch press/cancel, reduced motion, reduced transparency, battery/balanced switching and form restoration.
- The held button reached scale `0.960088`; release returned it to 1. The layout-measure counter stayed at 12 throughout hover/press/release. There was one framebuffer copy per rendered frame and two shell draws; buttons introduced no additional draws.
- Registered control and animation counts matched in 14 recorded states, including hidden/restored and fallback states.
- Night-scene screenshots were inspected at 390×844, 390×667, 320×568, 844×390 and 1280×800. Moon-to-annotation clearance remained at least 16px. The immersive marker remained at NDC `(0, -0.2797592192)`, the Moon at `(0, 0.5)` and Earth radius at `10.4381817718`.
- Deterministic regression: 1,090 marker/reveal cases, four independent sphere projections, 126 composition/alignment cases and eight adaptive-resolution cases passed.
- Full scene validation passed lighting 40/40, lunar phase 11/11 and 180 no-tilt samples with maximum tilt 0°. Optional fixed-sun azimuth and seasonal hooks are not counted as passed checks.
- Evidence: `output/ego-lite/interactive-glass-20261021/`. Verification uses Chromium device emulation; physical iPhone Safari performance remains unmeasured.

## Release package

- Package: `/tmp/lubirth-release-interactive-glass-20261021`.
- Release: `lubirth-680856601b456bb9`.
- Source digest: `680856601b456bb937ce93e24dcde60308688a7f5f57ebe855fadba9c530aa8b`.
- COS uploaded 44 new immutable objects, including the manifest, without overwriting or deleting existing releases.

## Publication and production verification

- Code was pushed to `origin/main` before publication. All 43 CDN resources / 31,504,017 bytes passed complete SHA-256, immutable-cache, CORS and media Range checks. Timing-Allow-Origin remains absent on these resources, as in the preceding release; delivery checks passed.
- Four origin files were staged with matching hashes. The existing wrapper verified the host key and Nginx configuration, then switched the LuBirth symlink atomically. Nginx configuration was not changed.
- Public URL: <https://aitoshuu.me/lubirth/>. Public HTML SHA-256: `de2b195a22c70277c791e0b544d3df5996cb834914f8faec8ed5814f20e50f9a`. Public health SHA-256: `9ef93a5a6f556221ce2251826a15613796351c9d8c36550185256f25cb8943d9`.
- Public HTML, release marker, trusted TLS, discovery summary, sitemap, canonical 308 redirect, missing-resource 404 and preservation of the existing homepage passed verification.
- Muted production Ego Lite verified all five viewport sizes, actual touch/cancel and mouse press/release, screenshot preview, independent Hide UI and native fullscreen. Touch scale reached 0.96 and mouse scale 0.960054. Native fullscreen was observed active; Hide UI left it inactive. The clean screenshot preview decoded at 1088×680 and its portal controls were not registered as panel glass. Date and Shanghai selection survived restoration; captured error lists were empty.
- An initial hover run was interrupted by the browser making the page hidden, correctly triggering input cleanup. The successful run emulated active-page focus during interaction checks and restored it afterwards. No application bypass of hidden-tab cleanup was introduced. Adaptive resolution changed the framebuffer during the public press sequence, accounting for a single cached-layout refresh; it did not create per-frame measurement.
- Production evidence: `public-controls.json`, `public-layouts.json` and `public-*.png` in the evidence directory above.
- An additional clean-render pixel check confirmed visibly lit lunar pixels in all five sizes (501–4,630 pixels above the luminance threshold). The phase fixture remained `0.5072260980013666`; details are in `public-moon-pixels.json`.

## Rollback

The preceding public release `lubirth-fa044616191689be` and its immutable assets remain available. The established origin wrapper can restore that verified release; this update did not overwrite or delete its objects.
