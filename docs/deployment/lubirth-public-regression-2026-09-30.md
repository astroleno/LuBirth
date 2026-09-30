# Public regression and main commit follow-up

User approved direct main commits and requested another public test.

## Findings and fix

- On public release `lubirth-83b52dedb1aff62d`, location search, aligned Moon/Earth view, battery mode and clean 390×844 screenshot worked. Lighting 40/40, lunar phase 11/11 and no-tilt 180 samples / 0° passed. All 31 CDN resources passed full-hash, CORS, cache and media Range validation; public HTML/version, TLS, canonical redirect and 404 behavior matched.
- Fullscreen unmounted the controls. Returning to settings cleared the displayed location selection while the scene retained its coordinates. The controls now remain mounted inside a native hidden container. This retains complete/partial form state and avoids fetching/parsing the location data again. The existing glass compositor already excludes hidden ancestors.
- Local regression: select Shanghai / Shanghai / Huangpu, enter fullscreen, exit with Escape. All three selections remain and the CSV request count remains one. TypeScript and production build passed.

## Commits

- `e24e061` — mobile, parallax, lunar model and refractive UI.
- `8c6aab6` — Earth/Moon material refinement.
- `58d9517` — fullscreen form preservation.
- `4970a7f` — restore small rectangular corners and the separate Hide UI action.
- `5be71f5` — expose glass transmission and broaden optical edge highlights.
- `d47dfde` — restore the established Earth rim, atmospheric arc and Fresnel defaults.
- Deployment wrappers and this evidence are collected in the following release-record commit. Unrelated local files and generated dist are excluded.

## Replacement release

- Package: `/tmp/lubirth-release-fullscreen-state-20260930`.
- Release: `lubirth-5328605cc5f8676a` (working-tree package; published source inputs will be compared with the committed tree).
- HTML SHA-256: `26839a384049940189d93085d109d06ef8332cc33d3bed9a763696ded807982c`.
- Previous release `lubirth-83b52dedb1aff62d` retained for rollback. No objects deleted or overwritten.
- Upload: 32 objects created, none overwritten. CDN: all 31 delivery resources passed full SHA-256/content-length checks, CORS, immutable cache and media Range validation.
- The package identifies code commit `58d9517731345191ba4e4c96bd771a759efedaee`. Its source digest `5328605cc5f8676a937bec4202aab86b1f19d80d3067140f76d9f7dcb1bca27d` matches all 81 local release input files.
- This intermediate release was staged with matching hashes and switched successfully. The final UI correction release below supersedes it.

## UI correction

- User clarified that capsule-shaped controls were unwanted and the independent Hide UI action must remain. Buttons now use 8px corners, glass shells 10–12px corners; framebuffer refraction remains.
- Screenshot, Hide UI and Fullscreen are separate actions in the existing panel. Hide UI uses the existing state without requesting fullscreen. Music is hidden with the native hidden attribute, avoiding mobile positioning rules that overrode its offscreen position.
- Local 320×568 verification: all three action buttons are 82px wide, no horizontal overflow, native fullscreen remains false when hiding UI, only screenshot/restore controls remain, and restoring settings preserves Shanghai / Shanghai / Huangpu. TypeScript passed; the release packager runs the production build.
- Final package: `/tmp/lubirth-release-rectangular-ui-20260930`, release `lubirth-b4f051ef379eafb1`, based on code commit `4970a7f` and repository deployment wrappers. HTML SHA-256: `7164c3e2ca2f0b8743e6f7e039a70ad54e22376cee81487286d9163aea49d4cb`.
- All 31 CDN resources passed full hashes, CORS, immutable cache and media Range checks. Origin staging matched both hashes; public HTML/health, TLS, 308 canonical redirect, missing-resource 404 and homepage preservation passed.
- Public 320×568 verification: Hide UI did not enter native fullscreen; music and settings hid correctly; restoring retained Shanghai / Shanghai / Huangpu with one CSV request. Native fullscreen was observed active; returning retained the selection. Screenshot preview loaded a 320×568 PNG. Action buttons retained 8px corners and no horizontal overflow.

## Separate UI material and Earth-effect corrections

- User clarified two independent requirements: iOS-inspired glass material for UI, and preservation of the established Earth rim/arc/Fresnel appearance. Both are required.
- UI: reduced dark cover from 62% to 14%, removed the opaque mobile header and solid primary fill, separated optical bevel width from the small corner radius, and added directional reflection/inner caustics with a lightly diffused interior. The desktop close view visibly displaces the Earth horizon at the panel edge. Native labels remain sharp; rectangular controls and Hide UI remain.
- Earth: restored the prior rim strength/width, atmosphere thickness/intensity/scale height/contrasts/near strength, ocean broad highlight and Fresnel exponent, plus the original 15% surface-rim night floor. Mobile and desktop use the same effect defaults. Lunar improvements, material disposal and mobile rendering budgets remain.
- Local validation: TypeScript and production package build passed. Mobile 390×844 and desktop 1280×900 show the restored blue atmospheric arc; mobile initial and aligned close views were inspected. Lighting 40/40, lunar phase 11/11, no-tilt 180 samples / 0° passed with no captured console errors. Balanced mobile remains 126,304 triangles / 9 scene draws plus 2 glass draws; battery mode remains 67,232 triangles / 8 scene draws and releases the glass texture (0 glass draws/bytes).
- Package: `/tmp/lubirth-release-glass-rim-20260930`; release `lubirth-396743256e6dcf98`; code commit `d47dfde`.
- All 81 release source inputs match the Git index. Source digest: `396743256e6dcf986b5d3e0717ea8105f83d0ba6d6b1473797c7925da0bc43de`.
- HTML SHA-256: `ddebaadd8efe5ca9844aba4d96ab164e22ecd87d8add321331f232969cdf81b8`; health SHA-256: `fa60a83de150990a0111a1d34e171bbb4ae7053ee43a41112d2f6e54e6ea1c11`.
- Upload created 32 immutable objects. All 31 CDN delivery resources / 28,202,005 bytes passed full hashes, CORS, immutable cache and media Range validation. Both origin staging hashes matched; the wrapper switched successfully, retaining previous releases for rollback.
- Public verification passed: exact HTML and health hashes, trusted TLS, canonical redirect 308, missing-resource 404 and preserved homepage.
- Live browser loaded `index-DbKdDYmP.js` from this release. At 390×844, the restored blue Earth limb is visible, glass fill is 14%, buttons retain 8px corners and no horizontal overflow. Hide UI does not request fullscreen and hides music/settings; restoration preserves Shanghai / Shanghai / Huangpu. Native fullscreen was observed active and Escape restored the same selection. Clean screenshot PNG loaded at 390×844.
- Final live regression: lighting 40/40, lunar phase 11/11, no-tilt 180 samples / 0°, no captured console errors. Local 1280×900 close-view inspection also confirms the restored arc and its optical displacement through the glass panel edge.

Physical iPhone Safari sustained performance and gyroscope testing remain unmeasured; browser viewport checks are not a substitute for those measurements.
