# Repository Guidelines
## 最高准则（测试环境）
- 所有测试环境 `test/` 文件夹下面进行的修改必须是复制到该文件夹后进行，不要破坏已测试好的根目录环境；任何合并到主线的需求都必须先征得我的同意。
## 始终用简体中文回答

## Project Structure & Modules
- `src/astro/ephemeris.ts`: Ephemeris utilities (`computeEphemeris`, `toUTCFromLocal`).
- `src/scene/Scene.tsx`: Three.js/R3F scene (`EarthMoonScene`) and shaders.
- `src/App.tsx`, `src/main.tsx`: React UI, entry; styles in `src/styles.css`.
- `public/textures/`: Optional assets (earth, moon, clouds, stars). Loaded by path, not imported.
- `vite.config.ts`: React plugin + alias `@ -> ./src`; TS paths in `tsconfig.json`.

## Build, Run, Preview
- Install: `npm i`
- Dev server: `npm run dev` (Vite). Open `http://localhost:5173/?debug=1` to show layout helpers.
- Production build: `npm run build`
- Static preview: `npm run preview` (serves `dist/`).

## Coding Style & Naming
- Language: TypeScript, React 18 (function components, hooks).
- Imports: prefer alias paths (`@/astro/…`, `@/scene/…`).
- Files: PascalCase for React components (`Scene.tsx`), camelCase for functions/vars.
- Formatting: 2‑space indent, semicolons, single quotes. No ESLint/Prettier configured; please keep diffs minimal and consistent with existing style.

## Testing Guidelines
- Automated tests are not configured yet. For manual QA:
  - Run `npm run dev` and validate Sun/Moon lighting, controls, and ephemeris updates after clicking “应用”.
  - Use `?debug=1` to reveal alignment guides and canvas bounds.
- If adding tests, prefer Vitest + React Testing Library, and colocate under `src/**/__tests__/*.test.tsx`.

## Commit & Pull Requests
- Commits: keep atomic with clear imperative subject (e.g., `scene: refine rim lighting falloff`). Conventional Commits are welcome but not required.
- PRs should include:
  - Purpose and scope; link any issues.
  - Screenshots or short clips for visual changes.
  - Steps to run and verify (commands, URLs, flags like `?debug=1`).
  - Notes on assets added under `public/textures/` (file names used by loaders; avoid TIF; prefer JPG/PNG, <10MB each).

## Asset & Configuration Tips
- Place optional textures in `public/textures/` using expected names (e.g., `2k_earth_daymap.jpg`, `2k_moon.jpg`, `2k_earth_clouds.jpg`, `2k_stars_milky_way.jpg`). Missing assets gracefully fallback to minimalist materials.
- Keep TypeScript strict; retain path aliases in `tsconfig.json` and `vite.config.ts` when moving files.

## Decoupling Workflow (Agents Only)
- Scope: All decoupled rendering/photography work must live strictly under `test/decoupled/` (and optional test toggles). Do not modify main scene files except to add a non-invasive feature flag (e.g., `?decoupled=1`).
- Isolation: Earth and Moon layers render in separate canvases with synchronized camera/tone mapping. Composition happens in DOM overlay; no cross‑layer lighting.
- Toggles: Use query params or a temporary UI switch to enable decoupled mode; default remains the main pipeline.
- Docs: Update `TODO.md` as progress is made; keep changes reversible and contained.
