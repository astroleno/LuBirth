# LuBirth — refractive glass UI

User direction: iOS 27 glass with visible refraction/distortion, not only translucent blur. Existing folding, fullscreen, screenshot and astronomy behavior remain.

Final clarification: retain small rectangular corners (8px buttons, 10–12px shells), not capsule shapes. Keep Hide UI as an independent action alongside Screenshot and Fullscreen; reuse the existing hidden/restore state, including the music player. Keep controls mounted while hidden so form selections survive.

## Design and modules

- Existing CSS/React UI gains floating rectangular glass shells, lens rims, lightly tinted transparent interiors and small-corner controls. Typography stays system-native; no font/image dependency.
- Material correction after public review: reduce the dark cover from 62% to 14%, remove the opaque mobile header and solid primary button, separate optical bevel width from corner radius, and add broader directional reflection/inner caustics. Keep actual framebuffer displacement, sharp DOM labels and the existing render/compositor interface.
- `LiquidGlassRenderer` samples the already rendered WebGL framebuffer. One GPU texture copy, then bounded panel rectangles distort those pixels with a rounded-edge lens shader. No second 3D render, CPU readback, animation library or additional WebGL context. Text remains native DOM above the refractive surface.
- `RenderRuntime` owns this optional final pass and continues the existing frame budget/hidden-tab behavior. Screenshots render the clean scene directly and exclude the glass UI. GPU resources dispose on resize/unmount. Battery and reduced-transparency modes skip the pass.
- Canvas becomes full-bleed behind the glass. `useCameraControl` accepts an optional visible composition frame: its existing projection is extended beneath the panel. Moon screen coordinates map from that visible frame into the full canvas, preserving the principal composition while allowing real content beneath the glass.
- Interface: frame `{width,height}`; compositor `render(gl)` and `dispose()`; diagnostics expose glass draw/copy state. DOM rectangles are cached and updated on resize/scroll/layout changes, not read each frame.

## Acceptance

- Visibly displaced background at rounded panel edges; foreground labels remain sharp.
- Mobile portrait/landscape and desktop usable; native search, focus, folding, fullscreen and screenshot regression pass.
- Original scene color outside glass unchanged; lunar phase tests pass. Clean screenshots exclude refraction.
- Mobile keeps the existing 30 FPS request budget; no second scene rendering, unnecessary React frame updates or resource growth from folding/quality changes.
- Scope-limited repository COS/origin wrappers, immutable upload, CDN verification then public cutover and smoke test.

References: [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials), [iOS 27](https://images.apple.com/os/ios/), [Three.js renderer](https://threejs.org/docs/pages/WebGLRenderer.html). This is a web implementation inspired by the material, not Apple's native compositor.
