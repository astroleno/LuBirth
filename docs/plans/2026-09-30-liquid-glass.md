# LuBirth — refractive glass UI

User direction: iOS 27 glass with visible refraction/distortion, not only translucent blur. Existing folding, fullscreen, screenshot and astronomy behavior remain.

Final clarification: retain small rectangular corners (8px buttons, 10–12px shells), not capsule shapes. Keep Hide UI as an independent action alongside Screenshot and Fullscreen; reuse the existing hidden/restore state, including the music player. Keep controls mounted while hidden so form selections survive.

## Design and modules

- Existing CSS/React UI gains floating rectangular glass shells, lens rims, lightly tinted transparent interiors and small-corner controls. Typography stays system-native; no font/image dependency.
- Material correction: use the same clear material across UI shells with a 14% base dark tint and adaptive darkening only over bright content. Retain the confirmed 8px button / 12px shell rectangular corners and a translucent primary action. Use one directional reflective edge and a gentle face reflection; do not add inset caustic rings, capsule shapes or a second button refraction pass. Keep actual framebuffer displacement, sharp DOM labels and the existing render/compositor interface.
- `LiquidGlassRenderer` samples the already rendered WebGL framebuffer. One GPU texture copy, then bounded panel rectangles distort those pixels with a rounded-edge lens shader. No second 3D render, CPU readback, animation library or additional WebGL context. Text remains native DOM above the refractive surface.
- `RenderRuntime` owns this optional final pass and continues the existing frame budget/hidden-tab behavior. Screenshots render the clean scene directly and exclude the glass UI. GPU resources dispose on resize/unmount. Battery and reduced-transparency modes skip the pass.
- Canvas becomes full-bleed behind the glass. `useCameraControl` accepts an optional visible composition frame: its existing projection is extended beneath the panel. Moon screen coordinates map from that visible frame into the full canvas, preserving the principal composition while allowing real content beneath the glass.
- Interface: frame `{width,height}`; compositor `render(gl)` and `dispose()`; diagnostics expose glass draw/copy state. DOM rectangles are cached and updated on resize/scroll/layout changes, not read each frame.
- Interactive controls: keep 8px rectangular buttons as relief in the same shell shader. Combine their local lens with the shell before the single background sample sequence; add pointer-following reflective light and a restrained press-depth change. `GlassControlInteractions` delegates pointer/keyboard/cancel events and synchronizes the DOM label's 0.96 press scale with that same GPU rectangle through a paused native animation. It adds no React frame state, scene render, framebuffer copy or per-button draw. Resize/scroll/details changes refresh cached bounds; animation never mutates observed inline styles. Reduced motion keeps static state feedback without scale, and battery/reduced-transparency modes retain readable CSS surfaces. Existing scene framing, marker layout and astronomy stay unchanged.
- Birthplace annotations preserve the exact geographic tip and original celestial framing. `glassMarkerLayout` projects the lunar model's bounding sphere and reserves 16 CSS pixels below it. The pin can shorten independently of the label; short viewports place the label below the anchor. Maximum entrance scale determines placement to prevent flipping during reveal. `RenderRuntime` supplies the existing Moon mesh to the same compositor; diagnostics expose actual label and Moon bounds. Screenshot, Hide UI and Fullscreen remain independently available inside the collapsed-by-default picture settings.
- Location names such as Shanghai are plain text with the existing subtle dark shadow, without a capsule, border, background fill or refractive label surface. Only the geographic pin retains glass. Text placement, size, conservative Moon clearance, exact tip and main scene composition stay unchanged; the label shader preserves the texture's RGB shadow instead of recoloring its alpha white.
- Safari result selection must survive input blur with a null related target. Keep results mounted for that click; close on outside pointer input, window blur, focus moving to an outside element, Escape or selection. Retain native result buttons and keyboard selection without suppressing touch scrolling.
- Mobile panels keep their existing outer dimensions and fixed header. The existing content element scrolls below that header, so form text cannot pass behind its title. The same glass pass clips control optics to the visible content rectangle, without another surface, draw or backdrop copy. Portrait, landscape, folding, touch scrolling and screenshots must retain the original scene framing.

## Acceptance

- Visibly displaced background at rounded panel edges; foreground labels remain sharp.
- Mobile portrait/landscape and desktop usable; native search, focus, folding, fullscreen and screenshot regression pass.
- Original scene color outside glass unchanged; lunar phase tests pass. Clean screenshots exclude refraction.
- Mobile keeps the existing 30 FPS request budget; no second scene rendering, unnecessary React frame updates or resource growth from folding/quality changes.
- Scope-limited repository COS/origin wrappers, immutable upload, CDN verification then public cutover and smoke test.

References: [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials), [iOS 27](https://images.apple.com/os/ios/), [Three.js renderer](https://threejs.org/docs/pages/WebGLRenderer.html). This is a web implementation inspired by the material, not Apple's native compositor.
