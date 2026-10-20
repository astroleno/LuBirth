# Loading and close-view performance release

## Source and validation

- Code commit: `306cf261b96cd521ac13d03e14ec3aaec2aa9bba` (`perf: smooth scene loading and close-up rendering`).
- TypeScript, production build, render-profile policy assertions and `git diff --check` passed before release.
- Local lighting validation passed 40/40, lunar phase validation passed 11/11, and the 180-frame no-tilt test passed with a maximum tilt of 0 degrees.
- Balanced and battery profiles remain on 2K textures. Desktop detail mode is the only profile that permits 8K upgrades. Texture requests are prioritized and bounded; detail upgrades run one at a time.

## Release

- Release package: `/tmp/lubirth-release-performance-20261020-306cf26`.
- Release ID: `lubirth-ae2259ed24ec0242`.
- Source digest: `ae2259ed24ec0242609bff51cb4242ef62b589469b8157e9cd25663b281f4e94`.
- COS upload created 38 immutable objects (37 delivery objects plus the manifest), with 0 skipped and no overwrite or deletion.
- CDN verification passed all 37 delivery objects / 30,956,715 bytes, including full SHA-256 hashes, CORS, immutable caching and media Range behavior. `Timing-Allow-Origin` coverage remains 0/37 and is reported separately from the successful delivery checks.
- Origin staging matched both file hashes. Nginx validation and the atomic `/www/wwwroot/lubirth-current` symlink switch completed successfully.
- Public verification passed for HTML and health hashes, trusted TLS, the `/lubirth` to `/lubirth/` 308 redirect, missing-resource 404 behavior and preservation of the site homepage.
- Public URL: <https://aitoshuu.me/lubirth/>.

## Public browser verification

- The public health marker returned `lubirth-ae2259ed24ec0242` and Git commit `306cf261b96cd521ac13d03e14ec3aaec2aa9bba`.
- Balanced startup reached 2/2 base assets and removed the loading overlay. It requested the 2K texture set with no 8K resources.
- Normal view measured 30.50 FPS in the sampled window, with 97,728 triangles and the adaptive framebuffer at 2248×1111.
- Aligned close view measured 30.25 FPS, with 162,016 total triangles, the 16,384-triangle NASA Moon model and no 8K requests.
- The public NASA Moon GLB loaded from the release CDN prefix. Visual inspection retained the Earth atmosphere, clouds, night lighting, Moon phase and glass controls.
- Public lighting validation passed 40/40, lunar phase validation passed 11/11, and the 180-frame no-tilt test passed with maximum tilt 0 degrees.

## Rollback

The previous immutable releases remain in COS and on the origin. Rollback only requires switching `/www/wwwroot/lubirth-current` to a previously verified release directory after checking its hashes and Nginx configuration; no COS objects need to be deleted.
