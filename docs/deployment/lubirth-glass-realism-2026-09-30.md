# Refractive glass and Earth–Moon material refinement

Historical release record. Subsequent user corrections restore rectangular controls, a separate Hide UI action, clearer glass and the original Earth rim/arc/Fresnel appearance. See `lubirth-public-regression-2026-09-30.md` for the current release and verification; the earlier narrowed atmosphere described below is superseded.

## Scope

- Full-bleed scene with cached DOM glass bounds, rounded lens displacement, edge highlights and subtle color separation. Native DOM labels remain sharp. Uses one GPU framebuffer copy and two visible glass draws in the tested layouts; no second scene render.
- Existing mobile folding/fullscreen/screenshot flow preserved. Portrait moon anchor clears the music pill, including 320px screens. Desktop selector row fits the glass panel.
- Water-mask reflection retains a 2% face-on floor and stronger grazing reflection; broad highlight reduced. Thin atmospheric shells emphasize the lit limb. Replaced atmosphere materials are disposed.
- Lunar-Lambert reflectance blends Lambert and Lommel–Seeliger terms. Neutral albedo, actual render-camera view direction, existing geometric terminator and 16,384-triangle NASA terrain remain. These are visual approximations, not calibrated radiometry.
- Unused local `public/sfx/` prototypes are excluded from release inputs/delivery. No source prototypes or cloud objects were deleted.

## Verification

- TypeScript and production build passed. Existing bundle-size and public-font build warnings remain; the font file exists in the public package.
- `runSolarFullTests`: lighting **40/40**, lunar phase **11/11**, no-tilt **180 samples / 0°**. Optional fixed-sun azimuth/seasonal hooks returned null and are not counted as passed.
- CUA browser visual checks: 320×568, 390×844, 844×390, 1440×900. Quarter-moon direction, close terrain, day/night limb, glass distortion over terrain and responsive controls checked. No horizontal overflow in measured mobile layouts. Desktop selector bounds corrected after visual review.
- Fullscreen screenshot generated **844×390** PNG without UI. Reduced-transparency emulation and battery mode disabled glass and released its framebuffer texture.
- Mobile balanced close view: **126,304 scene triangles / 9 scene draws**, **16,384 lunar triangles**, **10 geometries / 11 textures / 8 programs**. After three battery/balanced cycles these counts returned unchanged. Glass adds **2 draws** and **1,316,640 bytes** at the tested 390×844 drawing buffer; actual memory scales with device pixel ratio.
- Battery close view: **67,232 triangles / 8 draws**, glass **0 draws / 0 texture bytes**. Existing target budgets remain 30 FPS balanced mobile / 24 FPS battery; this is not a measured physical-phone FPS claim.
- No browser shader/runtime errors observed. Physical iPhone Safari thermal, sustained frame rate and gyroscope testing were not available.

## Release

- Package: `/tmp/lubirth-release-glass-final-20260930`.
- Release: `lubirth-83b52dedb1aff62d`, working-tree source snapshot published before commits. The user subsequently approved direct main commits/push; public regression follow-up is recorded in `lubirth-public-regression-2026-09-30.md`.
- COS: 31 delivery objects plus manifest, create-only, approved `releases/aitoshuu-me/` prefix.
- Origin HTML SHA-256: `47745831a29aedf2c6f4da912eb935bfcb01dd198d764a2ac1dfa61182794dad`.
- Previous public release retained: `lubirth-347582169750266d`.
- Upload wrapper: **32 created / 0 overwritten** (31 resources plus manifest). CDN verification: **31/31**, 28,200,693 resource bytes, content hashes, Range, CORS and immutable cache rules passed.
- Origin staging: both HTML and health marker hashes matched. Wrapper switched `/www/wwwroot/lubirth-current` to the new release; no Nginx configuration edits required.
- Public verification passed at `https://aitoshuu.me/lubirth/`: HTML and release-health hashes match, trusted TLS, `/lubirth` redirects 308, missing asset returns 404, site homepage preserved.
- Live browser loaded CDN entry `index-B0oSeP2i.js`, rendered mobile close view without runtime errors, and repeated **40/40 lighting, 11/11 lunar, 180-frame no-tilt** checks successfully. Live desktop panel width is 400px; all three selectors fit at about 112.7px each.

## Commit groups

1. `e24e061`: mobile, lunar/parallax/performance foundation and refractive glass UI.
2. `8c6aab6`: Earth/Moon material refinement and design record.
3. Fullscreen form-state regression fix discovered during public retesting.
4. Scoped deployment wrappers, README and release evidence. Exclude generated `dist`, `.DS_Store`, unrelated WeChat plan, `ref`, sound prototypes and Python cache.
