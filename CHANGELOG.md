# Changelog

## v0.1.0
- Cloud rendering: Levels + alpha compositing (black/white points, gamma, contrast) with clear thickness and non-bleeding over ground.
- Earth glow: day-side limb-only radial falloff. Strength and height controls. Additive with visible inner-to-outer fade.
- Layered lighting separation retained; removed faulty manual dual-pass that caused black screen.
- Debug aids removed; UI refined; exposure and nightFalloff controls added.
- Safe mode and diagnostics used during bring-up (not part of the build).

Notes: tag this version after review: `git add -A && git commit -m "v0.1.0" && git tag v0.1.0`.
