# Earth and Moon material refinement

Authorized goal: improve realism while preserving mobile performance, lunar phase, existing composition and glass UI.

## Modules and interfaces

- Earth shader: water-mask-only Schlick-like reflection with a 2% normal-incidence floor, horizon-weighted Fresnel and daylight visibility. Retain the existing lighting direction and texture interfaces.
- Atmosphere: narrower shell and surface rim, signed solar direction for a smooth day/twilight transition. Keep a small night-side floor for composition readability. Dispose replaced shader materials.
- Moon shader: combine Lambert and Lommel–Seeliger reflectance for regolith, using the actual camera direction. Keep the geometric terminator and neutral NASA albedo. Existing phase/sun interfaces and GLB remain unchanged; modest normal-map adjustment only.
- No new textures, mesh subdivisions, lights or frame loops. This remains an artistic approximation, not calibrated radiometry or a full atmospheric scattering simulation.

## Acceptance

Mobile and desktop close views have a restrained blue atmospheric limb, water glint rather than plastic sheen, and neutral textured lunar terrain. Quarter/full/new-moon regression tests pass. Draw calls and triangle count remain at the prior scene budget; quality/folding cycles do not retain materials. Glass UI, fullscreen and clean screenshots continue working. Build, type checking, CDN and public checks must pass before delivery.

Sources: [USGS Lunar-Lambert photometry](https://isis.astrogeology.usgs.gov/8.0.0/Application/presentation/PrinterFriendly/photemplate/photemplate.html), [NASA thin blue atmosphere](https://www.nasa.gov/image-article/thin-blue-line/).
