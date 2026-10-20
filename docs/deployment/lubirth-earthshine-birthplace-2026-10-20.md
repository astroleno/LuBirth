# Earthshine and birthplace marker release

## Source and validation

- Code commit: `ea2e41c8888f3eab2c24ecccd430be0ae9947603` (`feat: add birthplace marker and lunar earthshine`).
- The Moon shader adds phase-aware Earthshine without changing the geometric terminator or illuminated fraction.
- The birthplace locator is attached to the rotating Earth group, defaults to visible and has an independent client UI toggle.
- TypeScript production build and `git diff --check` passed.
- Adaptive resolution policy checks passed 8/8.
- Local lighting validation passed 40/40, lunar phase validation passed 11/11, and the 180-frame no-tilt test passed with a maximum tilt of 0 degrees.

## Performance validation

- A fixed-profile A/B comparison used the same browser, viewport, battery profile and 8-second sampling window for the code commit and its parent. The automated task space was background-throttled, so its absolute FPS is not a device benchmark; the paired result showed no regression: 3.62 FPS for the release versus 3.37 FPS for the parent.
- The expected scene delta is one texture, one geometry, one shader program, one draw call and two triangles for the locator sprite.
- The visible public browser sustained 29.90 FPS over 10 seconds against the 30 FPS balanced target. `getLuBirthPerformance()` reported 29.31 FPS, 97,730 triangles, 13 draw calls, an effective DPR of 1.249 and a 1599×899 drawing buffer.

## Release

- Release package: `/tmp/lubirth-release-20261020-ea2e41c`.
- Release ID: `lubirth-2f31091722ba6d19`.
- Source digest: `2f31091722ba6d198bb8b88eb09be06f2e1642d1dfc4a6bdee23fd5a7d019c6e`.
- COS upload created 38 immutable objects: 37 delivery objects plus the manifest, with no overwrite or deletion.
- CDN verification passed all 37 delivery objects / 30,958,176 bytes, including full SHA-256 hashes, CORS, immutable caching and media Range behavior. `Timing-Allow-Origin` coverage remains 0/37 and is reported separately from the successful delivery checks.
- The first CDN verification attempt encountered local temporary-disk exhaustion while retrying cold 8K downloads. Only temporary files created for this validation were removed; the complete verification was rerun and passed before the origin switch.
- Origin staging matched both file hashes. Nginx validation and the atomic `/www/wwwroot/lubirth-current` symlink switch completed successfully.
- Public verification passed for HTML and health hashes, trusted TLS, the `/lubirth` to `/lubirth/` 308 redirect, missing-resource 404 behavior and preservation of the site homepage.
- Public URL: <https://aitoshuu.me/lubirth/>.

## Public browser verification

- The public release marker points to `lubirth-2f31091722ba6d19` and code commit `ea2e41c8888f3eab2c24ecccd430be0ae9947603`.
- The page completed its base asset load with the birthplace marker control enabled by default and no console errors.
- Public lighting validation passed 40/40, lunar phase validation passed 11/11, and the 180-frame no-tilt test passed with maximum tilt 0 degrees.

## Rollback

The previous immutable releases remain in COS and on the origin. Rollback only requires switching `/www/wwwroot/lubirth-current` to a previously verified release directory after checking its hashes and Nginx configuration; no COS objects need to be deleted.
