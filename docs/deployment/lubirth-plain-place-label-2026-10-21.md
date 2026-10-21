# Plain place labels and mobile scrolling

## Changes

- `cba2528` removes the capsule, border, fill and refractive surface around location names. Text retains its original placement and subtle dark shadow; the geographic pin retains glass.
- Search results remain mounted when an input blur has a null related target, allowing selection to finish. Outside pointer input, outside focus and window blur dismiss results; native result buttons and keyboard selection remain available.
- `772e7b6` fixes the mobile title overlapping form text during scrolling. The existing content element scrolls beneath the fixed title and collapse button. Its visible bounds also clip button optics inside the existing glass shader, with no additional surface, backdrop copy or draw.
- Original Earth/Moon framing, the configured 70° alignment, exact geographic tip, Moon brightness, night intensity 3.0 and the dedicated 4096×2048 close-up night map are preserved.

## Validation

- TypeScript, whitespace checks and the committed-source production build passed.
- Marker validation passed 1,090 reveal/layout cases and four independent sphere projections; composition validation passed 126 cases.
- Full scene validation passed lighting 40/40, lunar phase 11/11 and 180 no-tilt samples with maximum tilt 0°. Optional azimuth and seasonal hooks were not counted as passed checks.
- Muted Ego Lite tested the following CSS viewports and safe-area overrides. These are Chromium simulations, not physical iPhone measurements.

| Viewport | DPR | Safe area: top / right / bottom / left |
| --- | --- | --- |
| 320×568 | 2 | 0 / 0 / 0 / 0 |
| 375×667 | 2 | 0 / 0 / 0 / 0 |
| 390×844 | 3 | 47 / 0 / 34 / 0 |
| 393×852 | 3 | 59 / 0 / 34 / 0 |
| 402×874 | 3 | 62 / 0 / 34 / 0 |
| 430×932 | 3 | 59 / 0 / 34 / 0 |
| 440×956 | 3 | 62 / 0 / 34 / 0 |
| 844×390 | 3 | 0 / 47 / 21 / 47 |

- Each layout retained at least 16px Moon-to-annotation clearance, no document overflow, safe-area positioning and matching DOM/GPU panel and content-clip rectangles. The hidden-UI marker stayed at NDC `(0, -0.2797592192)` and the Moon at `(0, 0.5)`.
- Touch press/cancel reached scale 0.96; folding, a reduced 390×500 viewport, battery/balanced texture switching, screenshot preview and date/location restoration passed. The reduced viewport is not a native software-keyboard test.
- The null-related-target event sequence reproduced the old failed selection, then passed after the fix, alongside keyboard selection and outside-pointer/focus dismissal.
- A separate portrait/landscape flow passed native protocol touch scrolling to reach the primary action, press/cancel, screenshot and independent Hide UI restoration. The fixed header stayed outside the scrolling content and no extra glass layer was introduced.
- Evidence: `output/ego-lite/plain-place-label-20261021/`, including `iphone-layouts.json`, the before/after blur regression, `full-scene-tests.json` and `local-header/`.

## Safari coverage limit

Physical iPhone Safari remains unverified. The iOS WebDriver request returned “Some devices were found, but could not be used.” Earlier macOS Safari 18.6 rendering and trusted pointer observations were diagnostic only; its full flow did not complete, and the final connection attempt required enabling remote automation. The final build has not passed a WebKit or physical iPhone suite. No system or device settings were changed to bypass this limit.

## Release

- Package: `/tmp/lubirth-release-mobile-header-20261021`.
- Source: `772e7b6afa20f5bb5237c0423bc31d1a5e6315de`, including `cba2528`.
- Release: `lubirth-5d483f6832582438`.
- Source digest: `5d483f6832582438f71ec6192277dab0e32374658091516ab2c9e8472dc8b2a7`.
- Both code commits were pushed to `origin/main` before publication.
- COS created 44 immutable objects, including the manifest. All 43 CDN resources / 31,504,706 bytes passed SHA-256, immutable-cache, CORS and media Range verification. Timing-Allow-Origin remains absent, as in previous releases.
- The intermediate label-only release `lubirth-60a1dd4d41fbb3a2` and preceding `lubirth-680856601b456bb9` remain available; existing release objects were not overwritten or deleted.

## Publication

- Four origin files were staged with matching hashes; the existing wrapper checked the host key and Nginx configuration, then switched the LuBirth symlink atomically. Nginx configuration was not changed.
- Public URL: <https://aitoshuu.me/lubirth/>. HTML SHA-256: `9a8b21d643be0a2c79f27f389b82020c922995217b84a545e9ee613b88515e62`. Health SHA-256: `8f7380d7f0a9ef87cd05aff14083b8ae3de1173ba24816e6538086d16a57f457`.
- Public HTML/release marker, trusted TLS, discovery files, canonical 308 redirect, missing-resource 404 and preservation of the existing homepage passed verification.
- Muted production Ego Lite verified the exact final release at 390×844 and 844×390, including null-related-target selection, actual protocol touch scrolling, press/cancel, DOM/GPU content clipping, 4K night-map loading, screenshot preview and independent Hide UI restoration. Press scales were `0.960368` and `0.960123`; captured error lists were empty. Date `2026-10-21T00:30` and Shanghai selection survived restoration.
- Production portrait and scrolled landscape screenshots were visually inspected: location names are unframed, the title no longer overlaps form text, and the original Moon/marker composition and glass surfaces remain visible. The clean screenshot decoded at 305×660 on the test host's adaptive renderer; this is not an iPhone performance measurement.
- Production evidence: `public-smoke.json`, `public-portrait.png`, `public-landscape.png`, `public-immersive.png` and `public-clean.png` in the evidence directory above. The initial cold-load observation waited for the asynchronous 2K-to-4K texture swap before the final checks; an existing paused media element was explicitly muted along with future playback.
