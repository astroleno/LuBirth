# LuBirth parallax public release — 2026-09-28

- Public URL: https://aitoshuu.me/lubirth/
- Release ID: `lubirth-ae45b9692b770f8c`
- Source: current LuBirth worktree, recorded as `sourceMode: worktree` with `gitHead` and `sourceDigest` in the release manifest. No Git commit was created by this release.
- Model: `public/models/nasa-moon-topo-128.glb`, 1,019,204 bytes and 16,384 triangles. Resampled from [NASA SVS 14959](https://svs.gsfc.nasa.gov/14959/), `Moon_NASA_LRO_8k_Topo_Small.glb` (source SHA-256 `c4b65fb4df622a37fd75366c2ed9bf9e163e41c0fde178b3b27e31b0173e6953`). Credit: NASA's Goddard Space Flight Center.
- COS/CDN: 34 create-only objects uploaded by `deploy/upload-cos-release.py` under `releases/aitoshuu-me/lubirth-ae45b9692b770f8c/` in `tongye-1327162705` (`ap-shanghai`). `deploy/verify-cdn-release.mjs` passed for 33 delivery files, checking body hashes, CORS, immutable cache headers and media Range.
- Origin: `deploy/stage-origin.mjs` checked the two-file plan; `deploy/apply-origin-release.mjs` pinned the SSH host fingerprint, staged both files in `/www/wwwroot/lubirth-releases/lubirth-ae45b9692b770f8c/web`, verified their SHA-256 hashes, passed `nginx -t`, and atomically switched `/www/wwwroot/lubirth-current` to that directory. No ACL, other vhost, bucket, prefix or CDN configuration changed.
- Public: `deploy/verify-public-release.mjs` passed for HTML and health-marker hashes, TLS, canonical `/lubirth` redirect, missing-asset 404 and preservation of the `/` homepage. Browser inspection at 390×844 found no horizontal overflow; the default scene made zero GLB requests, and close-up loaded the new GLB from `assets.aitoshuu.me` with a 16,384-triangle moon.
- Local validation: TypeScript, Vite build, glTF validation, visual checks at desktop/portrait/landscape sizes, drag and synthetic orientation interaction, `runSolarFullTests()` 40/40, moon-phase tests 6/6, no-tilt result 0°. A physical-phone sensor and sustained frame-rate measurement remain untested.

Rollback target: the prior release is `lubirth-6264e6fba8de1114` under `/www/wwwroot/lubirth-releases/`. Rollback changes only the `lubirth-current` symlink after verifying that release directory and public response; immutable COS objects remain untouched.
