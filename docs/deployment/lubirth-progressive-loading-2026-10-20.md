# Progressive loading release

## Source and validation

- Code commit: `26c28e9a18c812574bc7b316f952695677f1a2f5` (`perf: streamline scene and lunar loading`).
- Startup now preloads 1K Earth and Moon maps (154,816 bytes combined), then upgrades the balanced profile to 2K after the first scene is available.
- The loading screen retains the public Vercel design: a black field with static `LuBirth` and `Moon Earth You` glow text. Visible progress is reserved for slow or failed loads.
- Fonts, location controls, audio and browser diagnostics no longer compete with the two base textures during startup.
- The close view loads the NASA GLB first. Moon normal and displacement maps are requested only when that model fails, avoiding about 2.4 MB on the successful path.
- TypeScript, production build, `git diff --check` and adaptive-resolution checks passed. Targeted browser checks covered both the NASA success path and a blocked-GLB fallback path.

## Release

- Release package: `/tmp/lubirth-release-20261020-26c28e9`.
- Release ID: `lubirth-996b699a19bca700`.
- Source digest: `996b699a19bca7000f3e36a0d86abf394df71f0e666d6ee1d88c0c7e245d267f`.
- COS upload created 42 immutable objects: 41 delivery objects plus the manifest, with no overwrite or deletion.
- CDN verification passed all 41 delivery objects / 31,115,466 bytes, including full SHA-256 hashes, CORS, immutable caching and media Range behavior. `Timing-Allow-Origin` coverage remains 0/41 and is reported separately from the successful delivery checks.
- Origin staging matched both file hashes. Nginx validation and the atomic `/www/wwwroot/lubirth-current` symlink switch completed successfully.
- Public verification passed for HTML and health hashes, trusted TLS, the `/lubirth` to `/lubirth/` 308 redirect, missing-resource 404 behavior and preservation of the site homepage.
- Public URL: <https://aitoshuu.me/lubirth/>.

## Public browser verification

- The public release marker returned `lubirth-996b699a19bca700` and Git commit `26c28e9a18c812574bc7b316f952695677f1a2f5`.
- A cache-disabled load requested the two 1K base textures first. Fonts followed after the base scene, and 2K Earth and Moon upgrades began after about 6.9 and 8.0 seconds respectively.
- The loading overlay reached 2/2 and disappeared; the resulting scene retained Earth atmosphere, clouds, night lighting, Moon phase, birthplace marker and glass controls.
- Aligned close view requested only the split GLTF loader and `nasa-moon-topo-128.glb`; it did not request Moon normal or displacement maps.
- The close view reported the 16,384-triangle NASA Moon, 162,016 total triangles and 30.26 FPS in the sampled visible-browser window.
- Public lighting validation passed 40/40, lunar phase validation passed 11/11, and the 180-frame no-tilt test passed with maximum tilt 0 degrees.

## Rollback

The previous immutable releases remain in COS and on the origin. Rollback only requires switching `/www/wwwroot/lubirth-current` to a previously verified release directory after checking its hashes and Nginx configuration; no COS objects need to be deleted.
