# LuBirth UI/UX acceptance — 2026-09-30

## Scope and Coverage

Full review of the bounded client flow: location/time → Xiu → folded view → fullscreen → screenshot preview. React 18, R3F/Three, existing CSS tokens and native controls. Conventions: repository AGENTS.md, README, previous mobile/fold/fullscreen/performance deployment records. This is an implementation self-review, not an independent design review or a complete accessibility certification. Developer controls, music playback design and physical-device system dialogs are outside this iteration.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Location keyboard path, select names, focus outlines, screenshot focus isolation, reduced-motion preference | Findings fixed |
| Layout | 320×568, 390×844, 844×390, 1440×900; fold, fullscreen and preview | Clipped landscape preview fixed |
| Writing | Search empty/error/retry, fullscreen action, return action | Feedback and action labels clarified |
| Typography | Mobile input computed font size, wrapping and main action | 16px inputs preserved; no new font |
| Colors | Computed mobile main-action and panel-label pairs | 8.71:1 and 7.10:1 respectively; existing accent reused |
| UI | Primary/secondary actions, touch labels, loading and CSS transitions | Main action emphasized, checkbox labels 44px high |

## Findings

All rows below describe resolved findings. File lines refer to the post-iteration source.

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Accessibility | `src/components/LocationSelector/LocationSelector.tsx:172` | Clickable div results; input blur timer dismissed results during keyboard navigation | Native result buttons; focus stays within search group; Tab/Enter and Escape work; selection restores input focus then closes results | Keyboard users can select the same places as pointer users |
| 2 | HIGH | Accessibility | `src/components/LocationSelector/LocationSelector.tsx:222` | Three selects had no accessible name | Birth province/city/district labels | Values remain understandable after selection |
| 3 | HIGH | Accessibility | `src/styles.css:95` | Input/select outline suppression overrode global keyboard focus ring | Removed suppression; result buttons use an inset 2px focus ring | Focus remains visible in the scrollable list |
| 4 | HIGH | Layout | `src/styles.css:86` | At 844×390, screenshot controls ended at y=411.5 and were clipped | Preview image shrinks to remaining height; controls end at y=374 with safe margins | Save and close stay reachable |
| 5 | HIGH | Accessibility | `src/performance/renderProfile.ts:36`, `src/SimpleTest.tsx:238` | Decorative WebGL motion did not follow reduced-motion preference | Live preference stops panorama rotation, cloud scrolling and parallax; existing CSS transitions also reduce | Respects system motion preference without changing normal rendering |
| 6 | MEDIUM | Accessibility | `src/components/SceneScreenshot.tsx:9` | Modal trapped Tab but background remained exposed to accessibility navigation | Background becomes inert and restores its prior state on close | Modal focus and accessibility tree agree |
| 7 | MEDIUM | Writing | `src/components/LocationSelector/LocationSelector.tsx:160` | Failed load left unusable selectors; no-match search had no feedback | Inline error and retry, loading status, no-match suggestion | Users can recover and distinguish empty results from a fault |
| 8 | MEDIUM | Writing | `src/SimpleTest.tsx:3790`, `src/SimpleTest.tsx:1422` | “全屏截图” only entered fullscreen; “显示 UI” used implementation terminology | “全屏查看” and “显示设置” | Labels match their actions |
| 9 | LOW | UI | `src/styles.css:61`, `src/SimpleTest.tsx:3609` | Xiu had the same emphasis as secondary actions | Existing accent fill on Xiu, explanatory accessible name, larger mobile checkbox-label target | Main action is easier to find; brand wording remains |

## Considered but Rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| Existing folded/fullscreen view | Add a floating gesture tutorial or another fold button | Duplicates the interaction the user already approved; no new toolbar added |
| Xiu main action | Replace the visible brand wording | The existing wording is intentional; hierarchy and accessible description suffice |
| Mobile location selectors | Replace native selectors with a custom picker | Existing scrollable layout works at 320px; a new picker adds scope and interaction complexity |

## Verification

Passed:

- `npx tsc --noEmit`, `git diff --check`, production release build.
- CUA browser at 320×568: search → Tab to a result → Enter selects location; Escape dismisses results and focuses the search field. Result count is zero after either selection or dismissal.
- Search unmatched text displays recovery wording. Blocking only the location CSV produces an inline error; unblocking and selecting “重新加载地点” restores selectors without a page reload. Test network override was cleared.
- Keyboard focus on a result computes to `rgb(159, 179, 200) solid 2px`.
- 844×390 screenshot preview: button bottom moves from 411.5px to 374px; background is inert and absent from the accessibility tree. Tab wraps from close to save; Escape returns focus to screenshot.
- Native fullscreen observed true at 320×568; generated screenshot dimensions are 320×568. Preview controls remain within the viewport (bottom 552px).
- Xiu still folds the existing mobile panel. No horizontal page overflow at 320px or 390px; desktop 1440×900 layout inspected visually.
- Setting the example time `2024-04-08T12:00` then selecting Xiu retains the entered value, renders the scene and folds the existing panel.
- Emulated reduced-motion preference updates the UI live; transition duration is 0.00001s and sensor controls are replaced by the system-preference status. Preference override was cleared. WebGL gates were checked in source; physical sensor motion was not exercised in this UI iteration.
- Mobile primary contrast 8.71:1; secondary label against opaque panel 7.10:1. Search input remains 16px.
- `await runSolarFullTests()`: lighting 40/40, lunar phase 11/11, no-tilt 180 samples with maximum 0°. Optional fixed-azimuth and seasonal hooks returned null and are not counted as passes.
- Close-view rendering retains 126,304 triangles, 9 draw calls and the 16,384-triangle lunar GLB. No rendering dependency or asset added.

Not verified: physical iOS/Android browser UI and download sheet, VoiceOver/TalkBack announcements, browser-level 200% zoom, physical-device performance/thermal behavior. Viewport simulation is not a substitute for these checks. Approval below applies only to the stated browser flow and inspected states.

## Release

Package: `/tmp/lubirth-release-ui-final-20260930`; release `lubirth-347582169750266d`, built from the working tree without a new commit. Public target: https://aitoshuu.me/lubirth/.

- Repository Keychain upload wrapper created 35 new objects, without overwrite, under `tongye-1327162705 / ap-shanghai / releases/aitoshuu-me/lubirth-347582169750266d/`.
- Initial CDN validation encountered a full-audio-download timeout. The repository verifier now allows 60 seconds per system-HTTPS attempt, a 10-second connection deadline and a bounded 180-second retry budget. Syntax check passed; TLS, scope, full hashes, CORS, immutable caching and media Range checks remain unchanged.
- Complete CDN revalidation passed: 34 delivery files, 28,269,895 bytes, Range/CORS/cache passed.
- Origin staged-file hashes matched; existing LuBirth symlink switched to `/www/wwwroot/lubirth-releases/lubirth-347582169750266d/web`.
- Public verification passed: trusted TLS, matching HTML/health hashes, canonical 308, missing-asset 404 and home preservation.
- Public 390×844 browser loaded `index-BPflMgQx.js` from the new CDN prefix. Pointer selection of Hangzhou closed suggestions, Xiu entered the folded near view, and screenshot preview opened with the isolated modal. No console errors. Mobile balanced profile still targets 30 FPS. Temporary tabs and viewport overrides were cleaned up.
- Previous `lubirth-032f356ec4b5c045` remains available for rollback. No old COS objects or releases were removed.

## Verdict

Approve
