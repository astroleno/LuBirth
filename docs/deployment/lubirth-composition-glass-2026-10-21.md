# Close-up composition and glass release

## Source and behavior

- Published code: `3f7b274ace833ca1317ec350163f13206001c346` (`fix: preserve Earth-Moon framing and prevent marker overlap`).
- Preserve the established Earth/Moon proportions, centered Moon and configured 70° birthplace placement. The geographic tip remains at radius scale 1.004.
- Project the actual lunar model's bounding sphere to reserve at least 16 CSS pixels, including the annotation's optical edge. Compact layouts shorten the pin independently of the text; short portrait layouts put the label below its anchor. Entrance overshoot does not flip the label placement.
- Retain clear framebuffer refraction, 12px shell / 8px button corners and independent Screenshot, Hide UI and Fullscreen actions inside picture settings. Subpixel marker dispersion prevents bright night lights from splitting into RGB bars.
- Preserve night intensity 3.0. Balanced close-up uses the dedicated 4096×2048 night map; battery uses 2048×1024. Keep the screen-anchored Moon in the transparent render queue above the sky, and retain the controlled camera projection across DPR changes.

## Validation

- TypeScript, production build and whitespace checks passed. The existing large-bundle warning remains.
- Deterministic checks: 1,090 annotation/reveal cases with 16px clearance and unchanged text size; four independent sphere projections; 126 original-framing/geographic alignment cases; eight adaptive-resolution cases.
- Muted Ego Lite checks covered 390×844, 390×667, 320×568, 844×390 and 1280×800. Production preview also exercised location search, battery/ balanced switching, independent Hide UI, native fullscreen, screenshot preview and form restoration. Native fullscreen was observed active; Hide UI left it inactive. All three scene actions retained 8px corners.
- Public night-scene checks used a committed input of `2026-10-21T00:30`, with material phase ratio `0.5072260980013666`. An initial automation run had not committed that date fixture; the successful rerun explicitly checked the input and lunar phase before taking evidence. No application change was needed for the fixture.

| Public viewport | Label placement | Moon-to-annotation clearance, including optical edge |
| --- | --- | --- |
| 390×844 | Above anchor | 16.0314px |
| 390×667 | Below anchor | 16.0314px |
| 320×568 | Below anchor | 16.0314px |
| 844×390 | Above anchor | 16.0352px |
| 1280×800 | Above anchor | 108.6124px |

- Public clean-capture pixel checks confirmed a visibly rendered Moon in each viewport and after battery switching. NASA terrain remained 16,384 triangles. Balanced night maps reported 4096×2048, intensity 3.0; battery reported 2048×1024.
- The immersive scene retained Moon NDC `(0, 0.5)`, marker NDC `(0, -0.2797592192)`, Earth center NDC `(0, -2.7702988011)` and Earth radius `10.4381817718`. Projection aspect matched the CSS canvas dimensions throughout.
- Public lighting validation passed 40/40, lunar phase math passed 11/11 and no-tilt validation passed 180 samples with maximum tilt 0°. Optional fixed-sun azimuth and seasonal hooks returned null and were not counted as passed tests.
- The public compositor made 12 framebuffer copies over 12 rendered frames. Captured runtime error lists were empty. Location and date survived hiding/restoring settings and quality switches; HTML media remained muted at zero volume.
- Evidence is in `output/ego-lite/annotation-release-20261021/`; generated screenshots and scripts are local QA artifacts. Physical iPhone Safari and sensor performance remain unmeasured.

## Publication

- Package: `/tmp/lubirth-release-composition-20261021`, built from committed source.
- Release ID: `lubirth-fa044616191689be`.
- Source digest: `fa044616191689beeca78cfdd99daada9d7d41eac4d7451507c79d17cb26633d`.
- COS created 44 immutable objects: 43 delivery resources plus the manifest; no overwrites or deletions.
- All 43 CDN delivery resources / 31,495,042 bytes passed full SHA-256, CORS, immutable cache and media Range checks. Timing-Allow-Origin coverage remains 0/43 and is separate from successful delivery validation.
- Four origin files staged with matching hashes. Nginx validation and the atomic LuBirth symlink switch passed. No Nginx configuration was edited.
- Public HTML SHA-256: `214e7a536bbce8af1e03fb124f09476a73a45aec0d41a3453224caf5b944181d`.
- Public health SHA-256: `3d22ba98c147020c8a2f291ba9738b68ecd0b6300163415b50288dab9eb643f5`.
- Public HTML, release marker, discovery summary, sitemap, trusted TLS, 308 canonical redirect, missing-resource 404 and homepage preservation all passed verification.
- Public URL: <https://aitoshuu.me/lubirth/>.

## Rollback

The previous public release `lubirth-996b699a19bca700` and earlier immutable releases remain available. Rollback uses the existing LuBirth origin wrapper and a previously verified package after checking hashes and Nginx configuration; COS objects need not be deleted.

Generated dist, `.DS_Store`, unrelated plans, reference material and sound prototypes were excluded from the source commit.
