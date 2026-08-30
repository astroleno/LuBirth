---
title: "feat: 微信小程序正式迁移"
type: feat
status: planned
date: 2026-08-31
source_spike: "2026-08-30-001-feat-wechat-miniprogram-spike-plan.md"
---

# 微信小程序正式迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Repository execution rule:** 未经用户明确授权，不启动 subagent；默认在当前线程用 `superpowers:executing-plans` 按检查点执行。

**Goal:** 把已通过 Spike 的 iOS 竖屏 2K r160 视觉竖切片迁移为可维护、可回归、可发布验收的正式微信小程序客户端，同时保持 Web 端行为不回退。

**Architecture:** 仓库增加一个纯逻辑包、一个宿主无关的命令式 Three 渲染包和一个正式小程序客户端。Web 保留 React/R3F 宿主，但逐步消费共享天文、场景配置与 Shader；小程序只实现 r160 Canvas/网络/文件/生命周期平台层。Spike 保留为历史证据，不成为正式客户端运行时依赖。

**Tech Stack:** TypeScript 5.9、Three.js 0.160.1、astronomy-engine 2.1.19、esbuild、微信小程序原生 Page/WXML/WXSS、Node test runner、Vite/React/R3F（现有 Web）。

**Spec:** [`docs/spikes/wechat-miniprogram-migration-boundary.md`](../spikes/wechat-miniprogram-migration-boundary.md)

## Global Constraints

- 正式范围固定为 iOS、竖屏、2K；Android、横屏、8K 不进入代码路径、验收矩阵或依赖。
- 正式 Three.js 固定为 `0.160.1`；`threejs-miniprogram` r108 不进入正式客户端依赖或主包。
- 小程序使用原生 Page + 命令式 Three；不得引入 React DOM、R3F、Drei、OrbitControls 或全局 DOM polyfill。
- 世界坐标 Y-up；`World(x,y,z)=ECEF(x,z,y)`；光向量统一表示“从太阳射向地球”。
- 只允许一盏方向光；相机和星空不挂地球组；地球只绕世界 Y 旋转。
- PIP 必须使用主 renderer 的 `WebGLRenderTarget`，不得使用第二 WebGL Canvas 或像素读回。
- 2K 是完整效果档，必须包含地球昼夜、城市灯光、六层云、双层大气、星空、月相和 PIP。
- 2:1 等距柱状纹理在首次 GPU 上传前设置 `wrapS=RepeatWrapping`、`wrapT=ClampToEdgeWrapping`。
- CDN 域名为 `https://assets.aitoshuu.me`；资源路径由构建变量注入，源码和提交中不得出现腾讯密钥。
- 正式主包必须小于 2 MiB。
- 每个实现任务先写失败测试，确认失败原因，再实现、验证和提交；不得用占位纹理或跳过测试伪造通过。
- 每次共享抽取后都运行 Web 构建；Spike 和用户已有未提交改动不得被回退或覆盖。

---

## File and Ownership Map

| 路径 | 所有权与职责 |
|---|---|
| `packages/lubirth-core/` | 无 Three/React/DOM/wx 的天文、坐标、场景配置、资源语义与证据类型 |
| `packages/lubirth-render-core/` | 注入 THREE/renderer 后工作的 Shader、pass、主场景、PIP 与相机状态 |
| `clients/wechat-miniprogram/` | r160 运行时、wx 资源与缓存、页面生命周期、WXML UI、诊断和真机验收 |
| `src/` | 现有 Web 宿主；通过薄桥接消费共享包 |
| `spikes/wechat-miniprogram/` | 已完成的能力验证原型；只读参考和回归证据 |

稳定依赖方向：

```text
@lubirth/core
    ↑
@lubirth/render-core
    ↑
@lubirth/wechat-miniprogram

@lubirth/core ───────────→ Web src/
@lubirth/render-core ────→ Web Shader/config bridge
```

## Requirements Trace

| 要求 | 任务 |
|---|---|
| 正式 workspace 与产品客户端边界 | Task 1 |
| 天文/坐标单一事实源 | Task 2 |
| 场景配置和 2K manifest 单一事实源 | Task 3 |
| 共享生产 Shader/pass | Task 4 |
| r160 Canvas 与生命周期平台层 | Task 5 |
| COS/CDN 下载、缓存、解码和 GPU 上传 | Task 6 |
| 地球/云/大气/星空/PIP 场景 | Task 7 |
| 正式竖屏页面、触摸和错误恢复 | Task 8 |
| Web 消费共享实现与跨宿主回归 | Task 9 |
| iOS 性能、长稳、包体和发布证据 | Task 10 |

---

### Task 1: 建立 workspace 与正式小程序客户端骨架

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `packages/lubirth-core/package.json`
- Create: `packages/lubirth-core/tsconfig.json`
- Create: `packages/lubirth-core/src/index.ts`
- Create: `packages/lubirth-render-core/package.json`
- Create: `packages/lubirth-render-core/tsconfig.json`
- Create: `packages/lubirth-render-core/src/index.ts`
- Create: `clients/wechat-miniprogram/package.json`
- Create: `clients/wechat-miniprogram/tsconfig.json`
- Create: `clients/wechat-miniprogram/build.config.mjs`
- Create: `clients/wechat-miniprogram/project.config.json`
- Create: `clients/wechat-miniprogram/src/app.ts`
- Create: `clients/wechat-miniprogram/src/app.json`
- Create: `clients/wechat-miniprogram/src/app.wxss`
- Create: `clients/wechat-miniprogram/src/sitemap.json`
- Create: `test/wechat-workspace-contract.test.ts`

**Interfaces:**
- Consumes: 当前根 Web package 与 `spikes/wechat-miniprogram/build.config.mjs` 的已验证构建方式。
- Produces: workspace 包 `@lubirth/core`、`@lubirth/render-core`、`@lubirth/wechat-miniprogram`；根命令 `npm run verify:migration`。

- [ ] **Step 1: 写 workspace 边界失败测试**

```ts
// test/wechat-workspace-contract.test.ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const json = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

test('formal mini-program uses r160 workspaces and excludes r108', () => {
  const root = json('package.json');
  const client = json('clients/wechat-miniprogram/package.json');
  assert.deepEqual(root.workspaces, ['packages/*', 'clients/*']);
  assert.equal(client.dependencies.three, '0.160.1');
  assert.equal(client.dependencies['threejs-miniprogram'], undefined);
  assert.equal(client.dependencies['@lubirth/core'], 'workspace:*');
  assert.equal(client.dependencies['@lubirth/render-core'], 'workspace:*');
});
```

- [ ] **Step 2: 运行测试并确认因正式 workspace 不存在而失败**

Run:

```bash
node --test --experimental-strip-types test/wechat-workspace-contract.test.ts
```

Expected: FAIL，错误指向 `clients/wechat-miniprogram/package.json` 不存在或 `workspaces` 未定义。

- [ ] **Step 3: 增加 workspace 和统一验证命令**

```json
{
  "workspaces": ["packages/*", "clients/*"],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test:workspace-contract": "node --test --experimental-strip-types test/wechat-workspace-contract.test.ts",
    "test:core": "npm -w @lubirth/core test && npm -w @lubirth/render-core test",
    "verify:wechat": "npm -w @lubirth/wechat-miniprogram run verify",
    "verify:migration": "npm run test:workspace-contract && npm run test:core && npm run build && npm run verify:wechat"
  }
}
```

保留根 package 中既有 dependencies/devDependencies；只增加 `workspaces` 和脚本。

- [ ] **Step 4: 创建两个共享包的最小可编译入口**

```json
// packages/lubirth-core/package.json
{
  "name": "@lubirth/core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./astro": "./src/astro/index.ts",
    "./assets": "./src/assets/index.ts",
    "./coordinates": "./src/coordinates/world.ts",
    "./scene": "./src/scene/scene-config.ts"
  },
  "scripts": {
    "test": "node --test --experimental-strip-types test/*.test.ts",
    "check": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": { "astronomy-engine": "2.1.19" },
  "devDependencies": { "@types/node": "^24.3.0", "typescript": "^5.9.2" }
}
```

```json
// packages/lubirth-render-core/package.json
{
  "name": "@lubirth/render-core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./contracts": "./src/contracts.ts",
    "./scene": "./src/scene/index.ts",
    "./shaders": "./src/shaders/index.ts"
  },
  "scripts": {
    "test": "node --test --experimental-strip-types test/*.test.ts",
    "check": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": { "@lubirth/core": "workspace:*" },
  "peerDependencies": { "three": "0.160.1" },
  "devDependencies": { "@types/node": "^24.3.0", "@types/three": "^0.160.0", "three": "0.160.1", "typescript": "^5.9.2" }
}
```

两个 `src/index.ts` 先使用空导出：

```ts
export {};
```

- [ ] **Step 5: 创建正式客户端 package 和构建边界**

```json
// clients/wechat-miniprogram/package.json
{
  "name": "@lubirth/wechat-miniprogram",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.config.mjs",
    "build:device": "MINIAPP_DEVICE_BUILD=1 node build.config.mjs",
    "check": "tsc -p tsconfig.json --noEmit",
    "test": "node --test --experimental-strip-types test/*.test.ts",
    "verify": "npm run test && npm run check && npm run build:device"
  },
  "dependencies": {
    "@lubirth/core": "workspace:*",
    "@lubirth/render-core": "workspace:*",
    "three": "0.160.1"
  },
  "devDependencies": {
    "@types/node": "^24.3.0",
    "@types/three": "^0.160.0",
    "esbuild": "^0.25.9",
    "typescript": "^5.9.2"
  }
}
```

`build.config.mjs` 只允许 `r160`，复制 Page 静态文件，并复用 Spike 已验证的 2 MiB 包体求和逻辑；输出目录必须验证为客户端根下的 `miniprogram` 后才能清理。

- [ ] **Step 6: 安装 workspace 并验证骨架**

Run:

```bash
npm install
npm run test:workspace-contract
npm -w @lubirth/core run check
npm -w @lubirth/render-core run check
npm -w @lubirth/wechat-miniprogram run check
```

Expected: workspace 测试与三个 TypeScript check 全部 PASS。

- [ ] **Step 7: 提交 workspace 骨架**

```bash
git add package.json package-lock.json packages clients test/wechat-workspace-contract.test.ts
git commit -m "build: establish LuBirth mini-program workspaces"
```

---

### Task 2: 抽取天文与坐标单一事实源

**Files:**
- Create: `packages/lubirth-core/src/diagnostics.ts`
- Create: `packages/lubirth-core/src/astro/constants.ts`
- Create: `packages/lubirth-core/src/astro/ephemeris.ts`
- Create: `packages/lubirth-core/src/astro/moon-phase.ts`
- Create: `packages/lubirth-core/src/astro/index.ts`
- Create: `packages/lubirth-core/src/coordinates/world.ts`
- Create: `packages/lubirth-core/test/astro-parity.test.ts`
- Modify: `packages/lubirth-core/src/index.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/astro/constants.ts`
- Modify: `src/astro/ephemeris.ts`
- Modify: `src/scenes/simple/utils/moonPhaseCalculator.ts`
- Modify: `spikes/wechat-miniprogram/src/astro/entry.ts`

**Interfaces:**
- Consumes: 当前 `src/astro/` 实现和 Spike 的 `src/astro/web-baseline.json` 固定案例。
- Produces: `computeEphemeris(dateUtc, latDeg, lonDeg, diagnostics?)`、`toUTCFromLocal()`、`calculateMoonPhase()`、`ecefToWorldYUp()`、`latLonToWorld()`。

- [ ] **Step 1: 写共享核心与现有 Web 输出一致的失败测试**

```ts
// packages/lubirth-core/test/astro-parity.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import baseline from '../../../spikes/wechat-miniprogram/src/astro/web-baseline.json' with { type: 'json' };
import { angularDistanceDeg, computeEphemeris } from '../src/astro/index.ts';

test('shared ephemeris matches every checked-in Web baseline case', () => {
  for (const item of baseline.cases) {
    const actual = computeEphemeris(new Date(item.utc), item.latDeg, item.lonDeg);
    assert.ok(angularDistanceDeg(actual.sunWorld, item.sunWorld) <= 0.01);
    assert.ok(angularDistanceDeg(actual.moonWorld, item.moonWorld) <= 0.01);
    assert.ok(Math.abs(actual.illumination - item.illumination) <= 1e-6);
  }
});
```

- [ ] **Step 2: 运行测试并确认共享入口不存在**

Run:

```bash
npm -w @lubirth/core test
```

Expected: FAIL，错误为 `../src/astro/index.ts` 或导出函数不存在。

- [ ] **Step 3: 定义无宿主诊断接口**

```ts
// packages/lubirth-core/src/diagnostics.ts
export type DiagnosticsSink = {
  debug(event: string, payload?: unknown): void;
  warn(event: string, payload?: unknown): void;
};

export const NOOP_DIAGNOSTICS: DiagnosticsSink = {
  debug: () => undefined,
  warn: () => undefined,
};
```

- [ ] **Step 4: 移入天文实现并保留旧调用签名**

将 `src/astro/constants.ts`、`src/astro/ephemeris.ts` 中真正参与 `computeEphemeris()` 的完整实现移动到共享包；删除对 `src/utils/logger` 的依赖，改为可选 `DiagnosticsSink`。公开签名固定为：

```ts
export function computeEphemeris(
  dateUtc: Date,
  latDeg: number,
  lonDeg: number,
  diagnostics: DiagnosticsSink = NOOP_DIAGNOSTICS,
): Ephemeris;
```

函数体必须原样保留现有 astronomy-engine、Alt/Az、ECEF 和 Y-up 计算；只把现有 logger 调用改成 `diagnostics.debug/warn`，不得在抽取时改变公式或容差。

旧文件只保留 re-export：

```ts
// src/astro/ephemeris.ts
export * from '@lubirth/core/astro';
```

- [ ] **Step 5: 抽取坐标与月相纯函数**

```ts
// packages/lubirth-core/src/coordinates/world.ts
export type Vec3 = { x: number; y: number; z: number };

export function ecefToWorldYUp(v: Vec3): Vec3 {
  return { x: v.x, y: v.z, z: v.y };
}

export function latLonToWorld(latDeg: number, lonDeg: number, radius = 1): Vec3 {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;
  return {
    x: radius * Math.cos(lat) * Math.cos(lon),
    y: radius * Math.sin(lat),
    z: radius * Math.cos(lat) * Math.sin(lon),
  };
}

export function angularDistanceDeg(a: Vec3, b: Vec3): number {
  const denominator = Math.hypot(a.x, a.y, a.z) * Math.hypot(b.x, b.y, b.z);
  if (denominator === 0) throw new Error('Direction vectors must be non-zero');
  const cosine = (a.x * b.x + a.y * b.y + a.z * b.z) / denominator;
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}
```

`moon-phase.ts` 导出当前 `MoonPhaseResult` 和 `calculateMoonPhase()`，不得依赖 React、THREE 或页面状态。

- [ ] **Step 6: 让 Web 与 Spike 消费共享入口**

根 `package.json` 先增加 `"@lubirth/core": "workspace:*"` 并运行 `npm install`。然后将 Web 旧路径变成薄 re-export；将 Spike `entry.ts` 的天文导入改成 `@lubirth/core/astro`。运行 `rg` 确认仓库只剩一个 `computeEphemeris` 函数定义：

```bash
rg -n "function computeEphemeris" src packages spikes
```

Expected: 只有 `packages/lubirth-core/src/astro/ephemeris.ts` 定义实现。

- [ ] **Step 7: 运行跨宿主天文回归**

Run:

```bash
npm -w @lubirth/core test
npm run build
npm -w @lubirth/wechat-miniprogram run check
cd spikes/wechat-miniprogram && npm run test:astro
```

Expected: core parity、Web build、正式客户端 check、Spike 天文集成全部 PASS。

- [ ] **Step 8: 提交天文单一事实源**

```bash
git add packages/lubirth-core src/astro src/scenes/simple/utils/moonPhaseCalculator.ts spikes/wechat-miniprogram/src/astro/entry.ts
git commit -m "refactor: share astronomy and world coordinates"
```

---

### Task 3: 抽取正式场景配置与 2K 资源语义

**Files:**
- Create: `packages/lubirth-core/src/scene/scene-config.ts`
- Create: `packages/lubirth-core/src/scene/visual-profile.ts`
- Create: `packages/lubirth-core/src/assets/asset-manifest.ts`
- Create: `packages/lubirth-core/src/assets/asset-manifest.generated.ts`
- Create: `packages/lubirth-core/src/assets/index.ts`
- Create: `packages/lubirth-core/test/scene-config.test.ts`
- Create: `packages/lubirth-core/test/asset-manifest.test.ts`
- Create: `scripts/generate-2k-manifest.mjs`
- Modify: `packages/lubirth-core/src/index.ts`
- Modify: `src/types/SimpleComposition.ts`
- Create: `src/scenes/simple/utils/sharedSceneConfig.ts`
- Modify: `spikes/wechat-miniprogram/src/assets/asset-manifest.ts`
- Modify: `spikes/wechat-miniprogram/src/config/scenarios.ts`

**Interfaces:**
- Consumes: Spike v6 的 2K 参数、`DEFAULT_SIMPLE_COMPOSITION` 和 `public/textures/` 文件事实。
- Produces: `SceneConfig`、`DEFAULT_SCENE_CONFIG`、`TWILIGHT_PROFILE`、`ASSET_MANIFEST_2K`、`AssetKey`。

- [ ] **Step 1: 写配置不变量失败测试**

```ts
// packages/lubirth-core/test/scene-config.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENE_CONFIG, TWILIGHT_PROFILE } from '../src/scene/scene-config.ts';

test('formal profile is the complete iOS portrait 2K effect set', () => {
  assert.equal(DEFAULT_SCENE_CONFIG.assetTier, '2k');
  assert.equal(DEFAULT_SCENE_CONFIG.pip.enabled, true);
  assert.equal(DEFAULT_SCENE_CONFIG.pip.resolution, 256);
  assert.equal(DEFAULT_SCENE_CONFIG.cloud.layers, 6);
  assert.equal(DEFAULT_SCENE_CONFIG.atmosphere.nearShellEnabled, true);
  assert.ok(TWILIGHT_PROFILE.startCosine < TWILIGHT_PROFILE.endCosine);
  assert.equal('orientation' in DEFAULT_SCENE_CONFIG, false);
});
```

- [ ] **Step 2: 写 manifest 完整性失败测试**

```ts
// packages/lubirth-core/test/asset-manifest.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { ASSET_MANIFEST_2K } from '../src/assets/asset-manifest.ts';

test('2K manifest contains exactly the ten required production textures', () => {
  assert.equal(ASSET_MANIFEST_2K.length, 10);
  assert.ok(ASSET_MANIFEST_2K.every((asset) => asset.required));
  assert.ok(ASSET_MANIFEST_2K.every((asset) => asset.width === 2048 && asset.height === 1024));
  assert.ok(ASSET_MANIFEST_2K.every((asset) => /^[a-f0-9]{64}$/.test(asset.sha256)));
  assert.deepEqual(new Set(ASSET_MANIFEST_2K.map((asset) => asset.tier)), new Set(['2k']));
});
```

- [ ] **Step 3: 运行测试并确认配置与 manifest 尚未定义**

Run:

```bash
npm -w @lubirth/core test
```

Expected: 两个新测试因模块或导出不存在而 FAIL。

- [ ] **Step 4: 定义稳定场景配置**

```ts
export type SceneConfig = {
  assetTier: '2k';
  fixedSunRay: readonly [number, number, number];
  earth: { yawDeg: number; rotationPeriodMs: number };
  observer: { latDeg: number; lonDeg: number };
  camera: { fovDeg: number; azimuthDeg: number; elevationDeg: number; distance: number };
  pip: { enabled: boolean; resolution: 256; fps: 30; screenX: number; screenY: number; size: number };
  cloud: { layers: 6; strength: number; layerSpacing: number };
  atmosphere: { nearShellEnabled: true; intensity: number; thickness: number };
  stars: { enabled: true; scale: number };
};

export const TWILIGHT_PROFILE = Object.freeze({ startCosine: -0.24, endCosine: 0.3 });
```

`DEFAULT_SCENE_CONFIG` 使用最终 Spike v6 的数值；配置对象必须 `Object.freeze()`，每次页面实例通过纯函数复制，不共享可变引用。

- [ ] **Step 5: 生成带 SHA-256 的 2K manifest**

`scripts/generate-2k-manifest.mjs` 遍历确定的十个文件，读取真实字节、图片尺寸和 SHA-256，输出 TypeScript 常量；脚本只允许写 `packages/lubirth-core/src/assets/asset-manifest.generated.ts`：

```js
const textureNames = [
  '2k_earth_clouds.jpg',
  '2k_earth_daymap.jpg',
  '2k_earth_displacement_map.jpg',
  '2k_earth_nightmap.jpg',
  '2k_earth_normal_map.jpg',
  '2k_earth_specular_map.jpg',
  '2k_moon.jpg',
  '2k_moon_displacement.jpg',
  '2k_moon_normal.jpg',
  '2k_stars_milky_way.webp',
];
```

Run:

```bash
node scripts/generate-2k-manifest.mjs
```

Expected: 生成十条 `tier: '2k'` 且 SHA-256 为 64 位十六进制的记录。

- [ ] **Step 6: 建立 Web composition 到共享配置的显式映射**

先在 `SimpleComposition` 增加可选兼容字段，并在 `DEFAULT_SIMPLE_COMPOSITION` 中固定正式默认值：

```ts
enablePIP?: boolean;
pip?: { resolution: 256; fps: 30; screenX: number; screenY: number; size: number };
```

```ts
// src/scenes/simple/utils/sharedSceneConfig.ts
export function sceneConfigFromComposition(
  composition: SimpleComposition,
  observer: { latDeg: number; lonDeg: number },
): SceneConfig {
  return {
    ...DEFAULT_SCENE_CONFIG,
    observer,
    earth: {
      ...DEFAULT_SCENE_CONFIG.earth,
      yawDeg: composition.earthYawDeg,
    },
    pip: {
      ...DEFAULT_SCENE_CONFIG.pip,
      enabled: composition.enablePIP ?? true,
      ...(composition.pip ?? {}),
    },
  };
}
```

映射只覆盖两个宿主都支持的参数；Web 专属 UI 字段不得进入 `SceneConfig`。

- [ ] **Step 7: 让 Spike manifest/scenario 变成共享配置适配层**

Spike 文件改为从 `@lubirth/core` 导入 2K 资源和默认场景，再映射到旧证据类型；保留 8K 历史测试数据，但正式包与共享 manifest 不导出 8K。

- [ ] **Step 8: 运行配置、资源和 Web 回归**

Run:

```bash
npm -w @lubirth/core test
npm run build
cd spikes/wechat-miniprogram && npm run test
```

Expected: core 测试、Web build 和 Spike 单元测试全部 PASS。

- [ ] **Step 9: 提交配置和资源事实源**

```bash
git add packages/lubirth-core scripts/generate-2k-manifest.mjs src/types/SimpleComposition.ts src/scenes/simple/utils/sharedSceneConfig.ts spikes/wechat-miniprogram/src/assets/asset-manifest.ts spikes/wechat-miniprogram/src/config/scenarios.ts
git commit -m "refactor: share 2K scene and asset contracts"
```

---

### Task 4: 提取共享生产 Shader 与 pass

**Files:**
- Create: `packages/lubirth-render-core/src/contracts.ts`
- Create: `packages/lubirth-render-core/src/shaders/earth.ts`
- Create: `packages/lubirth-render-core/src/shaders/cloud.ts`
- Create: `packages/lubirth-render-core/src/shaders/atmosphere.ts`
- Create: `packages/lubirth-render-core/src/shaders/moon.ts`
- Create: `packages/lubirth-render-core/src/shaders/stars.ts`
- Create: `packages/lubirth-render-core/src/shaders/index.ts`
- Create: `packages/lubirth-render-core/src/passes/earth-pass.ts`
- Create: `packages/lubirth-render-core/src/passes/cloud-pass.ts`
- Create: `packages/lubirth-render-core/src/passes/atmosphere-pass.ts`
- Create: `packages/lubirth-render-core/src/passes/moon-pass.ts`
- Create: `packages/lubirth-render-core/src/passes/star-pass.ts`
- Create: `packages/lubirth-render-core/test/test-textures.ts`
- Create: `packages/lubirth-render-core/test/visual-contract.test.ts`
- Modify: `packages/lubirth-render-core/src/index.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/earth-pass.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/cloud-pass.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/atmosphere-pass.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/moon-pass.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/star-background.ts`

**Interfaces:**
- Consumes: `SceneConfig`、`TextureBundle`、Spike v6 中已在真机观察的 Shader 和 pass。
- Produces: `createEarthPass()`、`createCloudPass()`、`createAtmospherePass()`、`createMoonPass()`、`createStarPass()` 与 `ScenePass`。

- [ ] **Step 1: 写生产视觉合同失败测试**

```ts
// packages/lubirth-render-core/test/visual-contract.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createAtmospherePass, createCloudPass, createEarthPass } from '../src/index.ts';
import { createTestTextureBundle, disposeTestTextureBundle } from './test-textures.ts';

test('shared passes preserve the verified v6 visual contract', (t) => {
  const textures = createTestTextureBundle(THREE);
  t.after(() => disposeTestTextureBundle(textures));
  const earth = createEarthPass({ THREE, textures, sunRay: [-1, 0, 0] });
  const clouds = createCloudPass({ THREE, textures, sunRay: [-1, 0, 0] });
  const atmosphere = createAtmospherePass({ THREE, sunRay: [-1, 0, 0] });

  assert.equal(clouds.object.children.length, 6);
  assert.ok(earth.material.uniforms.twilightStart.value < earth.material.uniforms.twilightEnd.value);
  assert.equal(atmosphere.object.children.length, 2);
  assert.equal(atmosphere.outer.material.premultipliedAlpha, true);
  assert.match(earth.material.fragmentShader, /geometricNdl/);
  assert.doesNotMatch(earth.material.fragmentShader, /mod\s*\(\s*vUv/);
});
```

`test/test-textures.ts` 必须完整实现测试夹具，不读取网络或 DOM：

```ts
import type * as Three from 'three';
import type { TextureBundle } from '../src/contracts.ts';

export function createTestTextureBundle(THREE: typeof Three): TextureBundle {
  const make = (rgba: readonly [number, number, number, number]) => {
    const texture = new THREE.DataTexture(Uint8Array.from(rgba), 1, 1, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  };
  return {
    earthDay: make([32, 96, 192, 255]),
    earthNight: make([4, 4, 12, 255]),
    earthNormal: make([128, 128, 255, 255]),
    earthSpecular: make([64, 64, 64, 255]),
    earthDisplacement: make([128, 128, 128, 255]),
    clouds: make([255, 255, 255, 128]),
    moon: make([160, 160, 160, 255]),
    moonNormal: make([128, 128, 255, 255]),
    moonDisplacement: make([128, 128, 128, 255]),
    stars: make([8, 8, 16, 255]),
  };
}

export function disposeTestTextureBundle(bundle: TextureBundle): void {
  for (const texture of Object.values(bundle)) texture.dispose();
}
```

- [ ] **Step 2: 运行测试并确认共享 pass 尚未实现**

Run:

```bash
npm -w @lubirth/render-core test
```

Expected: FAIL，错误为 pass 导出不存在。

- [ ] **Step 3: 定义渲染核心的宿主无关合同**

```ts
// packages/lubirth-render-core/src/contracts.ts
export type ThreeNamespace = typeof import('three');

export type RendererLike = Pick<
  import('three').WebGLRenderer,
  'setRenderTarget' | 'render' | 'setViewport' | 'setScissor' | 'setScissorTest' | 'clear'
>;

export type TextureBundle = {
  earthDay: import('three').Texture;
  earthNight: import('three').Texture;
  earthNormal: import('three').Texture;
  earthSpecular: import('three').Texture;
  earthDisplacement: import('three').Texture;
  clouds: import('three').Texture;
  moon: import('three').Texture;
  moonNormal: import('three').Texture;
  moonDisplacement: import('three').Texture;
  stars: import('three').Texture;
};

export type ScenePass<TObject = import('three').Object3D> = {
  object: TObject;
  materials: readonly import('three').Material[];
  dispose(): void;
};
```

渲染核心不得使用 `any` 表示公开接口；平台差异只允许封装在客户端 runtime 类型中。

- [ ] **Step 4: 从 Spike v6 提取 Shader 源**

每个 Shader 文件导出 vertex/fragment 字符串和 uniform 创建函数。Earth 的昼夜权重必须继续使用未扰动几何法线：

```glsl
float geometricNdl = dot(normalize(vWorldNormal), toSun);
float surfaceBlend = smoothstep(twilightStart, twilightEnd, geometricNdl);
float shadingNdl = dot(derivativeNormal(normalMap, vUv), toSun);
```

Cloud 与 Earth 使用同一 `TWILIGHT_PROFILE`；Cloud UV 不调用 `mod(vUv, 1.0)`。大气的 near/outer 材质保留 `premultipliedAlpha: true` 和线性加法能量。

- [ ] **Step 5: 提取 pass 并建立幂等释放**

```ts
export function createEarthPass(options: {
  THREE: ThreeNamespace;
  textures: TextureBundle;
  sunRay: readonly [number, number, number];
}): ScenePass {
  const geometry = new options.THREE.SphereGeometry(1, 128, 64);
  const material = new options.THREE.ShaderMaterial(createEarthMaterialOptions(options));
  const object = new options.THREE.Mesh(geometry, material);
  let disposed = false;
  return {
    object,
    materials: [material],
    dispose() {
      if (disposed) return;
      disposed = true;
      geometry.dispose();
      material.dispose();
    },
  };
}
```

Cloud、Atmosphere、Moon、Stars 使用同样的幂等所有权规则；pass 只释放自己创建的 geometry/material，不释放注入的共享纹理。

- [ ] **Step 6: 把 Spike pass 改为共享包薄 re-export**

```ts
// spikes/wechat-miniprogram/src/scene/earth-pass.ts
export { createEarthPass } from '@lubirth/render-core';
```

其他四个 pass 同样改造。若旧 Spike 调用签名不同，在 Spike 文件中保留参数映射函数，但 Shader 和 material 只能来自共享包。

- [ ] **Step 7: 运行视觉合同与 Spike 回归**

Run:

```bash
npm -w @lubirth/render-core test
cd spikes/wechat-miniprogram && npm run test && npm run check
```

Expected: render-core 测试、Spike `80/80` 测试和 TypeScript check 全部 PASS。

- [ ] **Step 8: 提交共享 Shader/pass**

```bash
git add packages/lubirth-render-core spikes/wechat-miniprogram/src/scene
git commit -m "refactor: share verified LuBirth render passes"
```

---

### Task 5: 产品化 r160 Canvas、页面生命周期与 generation 状态机

**Files:**
- Create: `clients/wechat-miniprogram/src/runtime/runtime-contract.ts`
- Create: `clients/wechat-miniprogram/src/runtime/canvas-facade.ts`
- Create: `clients/wechat-miniprogram/src/runtime/r160-runtime.ts`
- Create: `clients/wechat-miniprogram/src/runtime/capability-probe.ts`
- Create: `clients/wechat-miniprogram/src/lifecycle/scene-lifecycle-controller.ts`
- Create: `clients/wechat-miniprogram/src/types/wechat.d.ts`
- Create: `clients/wechat-miniprogram/test/r160-runtime.test.ts`
- Create: `clients/wechat-miniprogram/test/scene-lifecycle-controller.test.ts`
- Create: `clients/wechat-miniprogram/test/helpers/runtime-fakes.ts`
- Create: `clients/wechat-miniprogram/test/helpers/lifecycle-fakes.ts`

**Interfaces:**
- Consumes: 微信 Canvas、Three.js 0.160.1、`SceneConfig`。
- Produces: `R160Runtime.create()`、`RuntimeSession`、`SceneLifecycleController` 与显式页面状态。

- [ ] **Step 1: 写 r160 运行时选择失败测试**

`test/helpers/runtime-fakes.ts` 提供具名 Canvas fake，记录 `getContext` 请求、RAF id 与取消次数；它必须实现 `width`、`height`、`getContext()`、`requestAnimationFrame()`、`cancelAnimationFrame()`、`createImage()` 和事件方法，未实现字段通过测试失败暴露，不能回退到全局 DOM。

```ts
test('formal runtime requests WebGL1 first and owns one renderer', () => {
  const canvas = fakeMiniProgramCanvas();
  const runtime = new R160Runtime().create(canvas, {
    cssWidth: 390,
    cssHeight: 700,
    dpr: 3,
  });
  assert.deepEqual(canvas.contextRequests.slice(0, 1), ['webgl']);
  assert.equal(runtime.route, 'r160');
  runtime.dispose();
  runtime.dispose();
  assert.equal(canvas.cancelledFrameCount, 0);
});
```

- [ ] **Step 2: 写旧异步加载不得覆盖新 generation 的失败测试**

`test/helpers/lifecycle-fakes.ts` 明确定义以下夹具：

```ts
export type Deferred<T> = {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(error: unknown): void;
};

export function deferred<T>(): Deferred<T>;
export function fakeScene(id: string): SceneHandle & { disposeCalls: number };
export function createControllerWithQueue(queue: Promise<SceneHandle>[]): SceneLifecycleController;
export const configA: SceneConfig;
export const configB: SceneConfig;
```

`createControllerWithQueue()` 每次 `load` 顺序消费一个 Promise；fake scene 的 `dispose()` 累加 `disposeCalls`，用于精确证明旧 generation 被释放。

```ts
test('stale scene generation cannot replace the active scene', async () => {
  const first = deferred<SceneHandle>();
  const second = deferred<SceneHandle>();
  const sceneA = fakeScene('sceneA');
  const sceneB = fakeScene('sceneB');
  const controller = createControllerWithQueue([first.promise, second.promise]);

  const firstLoad = controller.load(configA);
  const secondLoad = controller.load(configB);
  second.resolve(sceneB);
  await secondLoad;
  first.resolve(sceneA);
  await firstLoad;

  assert.equal(controller.snapshot().generation, 2);
  assert.equal(controller.snapshot().state, 'ready');
  assert.equal(sceneA.disposeCalls, 1);
  assert.equal(controller.snapshot().activeSceneId, sceneB.id);
});
```

- [ ] **Step 3: 运行测试并确认正式 runtime/controller 不存在**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
```

Expected: 两个测试因模块不存在而 FAIL。

- [ ] **Step 4: 移植并收紧 Canvas facade**

从 Spike 提取 `CanvasEventBridge`、`computeDrawingBufferSize()` 和 `createCanvasFacade()`；facade 只实现 Three 实际读取的字段，不写 `globalThis.window` 或 `globalThis.document`。WebGL 选择固定为：

```ts
export function selectContext(canvas: MiniProgramCanvas, attributes: WebGLContextAttributes) {
  return canvas.getContext('webgl', attributes) ?? canvas.getContext('webgl2', attributes);
}
```

- [ ] **Step 5: 创建正式 r160 session**

```ts
export type RuntimeSession = {
  route: 'r160';
  THREE: typeof import('three');
  renderer: import('three').WebGLRenderer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  requestFrame(callback: FrameRequestCallback): number;
  cancelFrame(id: number): void;
  createImage(): WechatCanvasImage;
  dispose(): void;
};
```

renderer 固定 `SRGBColorSpace`、`ACESFilmicToneMapping`、exposure `0.9`、`debug.checkShaderErrors=true`。`dispose()` 复用 Spike 已验证的跨 realm `cancelAnimationFrame` 缺失兼容，但其他异常必须重新抛出。

- [ ] **Step 6: 实现页面状态机与 generation**

```ts
export type SceneHandle = {
  id: string;
  render(timestampMs: number): void;
  resize(widthPx: number, heightPx: number): void;
  dispose(): void;
};

export type PageSceneState = 'idle' | 'loading' | 'ready' | 'hidden' | 'error' | 'disposing' | 'disposed';

export type PageSceneSnapshot = {
  state: PageSceneState;
  generation: number;
  activeSceneId: string | null;
  loadedAssets: number;
  totalAssets: 10;
  error: { stage: 'runtime' | 'asset' | 'scene' | 'shader'; message: string } | null;
  frameActive: boolean;
};
```

`SceneLifecycleController.load()` 每次递增 generation；异步结果只有在 generation 仍匹配时才能安装，否则立即 dispose。`onShow()`/`onHide()` 保证最多一个 RAF，`onUnload()` 幂等释放。

- [ ] **Step 7: 运行 runtime 和状态机测试**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
npm -w @lubirth/wechat-miniprogram run check
```

Expected: runtime、generation、重复 show/hide/unload 测试全部 PASS。

- [ ] **Step 8: 提交 r160 平台底座**

```bash
git add clients/wechat-miniprogram/src/runtime clients/wechat-miniprogram/src/lifecycle clients/wechat-miniprogram/src/types clients/wechat-miniprogram/test
git commit -m "feat: add production r160 mini-program runtime"
```

---

### Task 6: 实现版本化 2K COS/CDN 资源库

**Files:**
- Modify: `clients/wechat-miniprogram/package.json`
- Create: `clients/wechat-miniprogram/src/assets/asset-source.ts`
- Create: `clients/wechat-miniprogram/src/assets/wx-file-cache.ts`
- Create: `clients/wechat-miniprogram/src/assets/texture-repository.ts`
- Create: `clients/wechat-miniprogram/src/assets/gpu-upload.ts`
- Create: `clients/wechat-miniprogram/test/wx-file-cache.test.ts`
- Create: `clients/wechat-miniprogram/test/texture-repository.test.ts`
- Create: `clients/wechat-miniprogram/test/helpers/asset-fakes.ts`
- Modify: `clients/wechat-miniprogram/build.config.mjs`

**Interfaces:**
- Consumes: `ASSET_MANIFEST_2K`、`RuntimeSession`、构建变量 `__RESOURCE_BASE_URL__`。
- Produces: `WxAssetSource`、`WxFileCache`、`TextureRepository.loadRequired2K()`、`TextureBundle`。

- [ ] **Step 1: 写缓存版本与校验失败测试**

`test/helpers/asset-fakes.ts` 实现内存文件系统、下载源和固定 manifest 条目；每个 fake 暴露 `removeCalls`、`downloadCalls` 和最后一次上传时的 wrap 值。`assetWithSha()`/`asset()` 必须返回完整 `AssetManifestEntry`，不能用类型断言省略生产必填字段。

```ts
test('cache key includes manifest version and sha256', async () => {
  const cache = new WxFileCache(fakeFileSystem());
  const key = cache.keyFor({ id: 'earth-day-2k', sha256: 'a'.repeat(64) }, 'v1');
  assert.equal(key, 'v1-earth-day-2k-' + 'a'.repeat(64));
});

test('corrupt cached bytes are removed and downloaded again', async () => {
  const source = fakeSource({ cachedSha256: 'bad', downloadedSha256: 'a'.repeat(64) });
  const result = await source.resolve(assetWithSha('a'.repeat(64)));
  assert.equal(result.fromCache, false);
  assert.equal(source.removeCalls, 1);
  assert.equal(source.downloadCalls, 1);
});
```

- [ ] **Step 2: 写纹理首传采样与 GL 归因失败测试**

```ts
test('equirectangular texture repeats before its first upload', async () => {
  const repo = textureRepositoryHarness();
  const texture = await repo.load(asset('earth-day-2k', 2048, 1024));
  assert.equal(repo.wrapSAtUpload, repo.THREE.RepeatWrapping);
  assert.equal(repo.wrapTAtUpload, repo.THREE.ClampToEdgeWrapping);
});

test('GPU error names the exact asset id', async () => {
  const repo = textureRepositoryHarness({ uploadError: 1281 });
  await assert.rejects(repo.load(asset('earth-normal-2k', 2048, 1024)), /earth-normal-2k.*1281/);
});
```

- [ ] **Step 3: 运行测试并确认资源库尚未实现**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
```

Expected: 新资源测试因模块不存在而 FAIL。

- [ ] **Step 4: 添加纯 JS SHA-256 依赖与文件缓存**

将 `@noble/hashes` 固定为 `1.7.1`，只导入 `@noble/hashes/sha256` 和 `@noble/hashes/utils`。`WxFileCache` 使用 `wx.env.USER_DATA_PATH/lubirth-textures/<cache-key>`，写入采用先临时文件、校验后 rename 的原子顺序。

```ts
export type ResolvedAssetFile = {
  path: string;
  bytes: number;
  sha256: string;
  fromCache: boolean;
};
```

- [ ] **Step 5: 实现有界下载和错误保真**

`WxAssetSource.resolve()` 最多尝试两次；保留微信 `errMsg`、`errno`、HTTP status、URL 和 asset id。合法域名错误转换为可显示消息，但原始错误仍写入诊断证据。

```ts
throw new AssetLoadError({
  assetId: entry.id,
  stage: 'download',
  url,
  message: normalizeWechatError(error),
  cause: error,
});
```

- [ ] **Step 6: 实现解码、色彩空间和逐纹理上传**

顺序固定为 download/cache → SHA-256 → Canvas Image decode → 尺寸检查 → Texture colorSpace/wrap → GPU upload → `gl.getError()`。上传前最多清空 16 个遗留错误，上传后第一个非零错误归属当前 asset。

- [ ] **Step 7: 构建变量只注入 URL，不注入密钥**

```js
define: {
  __RESOURCE_BASE_URL__: JSON.stringify(process.env.MINIAPP_RESOURCE_BASE_URL ?? ''),
  __ASSET_VERSION__: JSON.stringify(process.env.MINIAPP_ASSET_VERSION ?? '2k-v1'),
}
```

构建缺少 HTTPS base URL 时直接失败，除非显式 `MINIAPP_ALLOW_EMPTY_RESOURCE_URL=1` 运行单元测试构建。

- [ ] **Step 8: 运行资源与包体测试**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
MINIAPP_RESOURCE_BASE_URL=https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures npm -w @lubirth/wechat-miniprogram run build:device
```

Expected: 缓存、SHA、wrap、GL 归因测试 PASS；主包小于 2 MiB，输出不包含 2K 图片文件。

- [ ] **Step 9: 提交正式 2K 资源库**

```bash
git add clients/wechat-miniprogram/package.json package-lock.json clients/wechat-miniprogram/src/assets clients/wechat-miniprogram/test clients/wechat-miniprogram/build.config.mjs
git commit -m "feat: add versioned 2K texture repository"
```

---

### Task 7: 组装正式场景、触摸相机与固定 PIP

**Files:**
- Modify: `packages/lubirth-render-core/src/contracts.ts`
- Create: `packages/lubirth-render-core/src/input/orbit-controller.ts`
- Create: `packages/lubirth-render-core/src/pip/moon-pip.ts`
- Create: `packages/lubirth-render-core/src/scene/lubirth-scene.ts`
- Create: `packages/lubirth-render-core/src/scene/scene-audit.ts`
- Create: `packages/lubirth-render-core/src/scene/index.ts`
- Create: `packages/lubirth-render-core/test/fake-renderer.ts`
- Create: `packages/lubirth-render-core/test/orbit-controller.test.ts`
- Create: `packages/lubirth-render-core/test/scene-graph.test.ts`
- Create: `packages/lubirth-render-core/test/render-order.test.ts`
- Modify: `packages/lubirth-render-core/src/index.ts`
- Modify: `spikes/wechat-miniprogram/src/input/touch-camera-controller.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/lubirth-capability-scene.ts`
- Modify: `spikes/wechat-miniprogram/src/scene/moon-pip-pass.ts`

**Interfaces:**
- Consumes: Task 3 的 `SceneConfig`、Task 4 的 `TextureBundle`/pass、注入的 `THREE`/renderer。
- Produces: `createLubirthScene()`、`LubirthScene`、`OrbitController`、`MoonPip`、`SceneAudit`。

- [ ] **Step 1: 写场景图不变量失败测试**

```ts
// packages/lubirth-render-core/test/scene-graph.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG } from '@lubirth/core/scene';
import { createLubirthScene } from '../src/scene/lubirth-scene.ts';
import { FakeRenderer } from './fake-renderer.ts';
import { createTestTextureBundle, disposeTestTextureBundle } from './test-textures.ts';

test('formal scene preserves the migration invariants', (t) => {
  const textures = createTestTextureBundle(THREE);
  t.after(() => disposeTestTextureBundle(textures));
  const scene = createLubirthScene({
    THREE,
    renderer: new FakeRenderer(),
    textures,
    config: DEFAULT_SCENE_CONFIG,
  });
  t.after(() => scene.dispose());

  assert.deepEqual(scene.audit(), {
    singleDirectionalLight: true,
    cameraIndependent: true,
    starsIndependent: true,
    moonAbsentFromMainScene: true,
    pipUsesRenderTarget: true,
    pipLayoutFixed: true,
    earthAxisYUp: true,
    complete2KEffects: true,
  });
});
```

- [ ] **Step 2: 写 PIP 渲染顺序和相机独立性失败测试**

```ts
// packages/lubirth-render-core/test/render-order.test.ts
test('PIP target renders before main scene and composites last', () => {
  const renderer = new FakeRenderer();
  const scene = createSceneHarness(renderer);
  scene.render(1_000);
  assert.deepEqual(renderer.frameTrace, [
    'target:moon-pip-256',
    'render:moonPipScene',
    'target:screen',
    'render:lubirthMainScene',
    'render:moonPipOverlayScene',
  ]);
});

test('main orbit input cannot mutate the PIP camera', () => {
  const scene = createSceneHarness(new FakeRenderer());
  const before = scene.debugSnapshot().pipCamera;
  scene.input.pointerStart([{ id: 1, x: 100, y: 100 }]);
  scene.input.pointerMove([{ id: 1, x: 180, y: 140 }]);
  scene.input.pointerEnd([]);
  assert.deepEqual(scene.debugSnapshot().pipCamera, before);
});
```

`test/fake-renderer.ts` 实现 `RendererLike` 的所有方法并记录 target、scene name、viewport 与 scissor；`createSceneHarness()` 固定使用 `DEFAULT_SCENE_CONFIG` 和 `createTestTextureBundle()`，测试结束时释放 scene 与纹理。

- [ ] **Step 3: 写轨道手势失败测试**

```ts
// packages/lubirth-render-core/test/orbit-controller.test.ts
test('one pointer rotates, two pointers zoom, and distance remains clamped', () => {
  const orbit = new OrbitController({ azimuthDeg: 0, elevationDeg: 0, distance: 3 }, {
    minDistance: 1.65,
    maxDistance: 8,
    rotateDegPerViewport: 180,
  });
  orbit.pointerStart([{ id: 1, x: 0, y: 0 }], { width: 400, height: 800 });
  orbit.pointerMove([{ id: 1, x: 100, y: 80 }]);
  assert.notEqual(orbit.snapshot().azimuthDeg, 0);
  orbit.pointerStart([{ id: 1, x: 0, y: 0 }, { id: 2, x: 100, y: 0 }], { width: 400, height: 800 });
  orbit.pointerMove([{ id: 1, x: 49, y: 0 }, { id: 2, x: 51, y: 0 }]);
  assert.equal(orbit.snapshot().distance, 8);
});
```

- [ ] **Step 4: 运行测试并确认正式场景尚未实现**

Run:

```bash
npm -w @lubirth/render-core test
```

Expected: 新的 scene、PIP 和 input 测试因模块或导出不存在而 FAIL。

- [ ] **Step 5: 扩展 renderer 与场景公开合同**

```ts
export type RendererLike = Pick<
  import('three').WebGLRenderer,
  | 'setRenderTarget'
  | 'getRenderTarget'
  | 'render'
  | 'setViewport'
  | 'setScissor'
  | 'setScissorTest'
  | 'clear'
  | 'clearDepth'
  | 'setClearColor'
  | 'getClearColor'
  | 'getClearAlpha'
  | 'setSize'
> & { autoClear: boolean };

export type LubirthScene = {
  readonly input: OrbitController;
  render(timestampMs: number): void;
  resize(widthPx: number, heightPx: number): void;
  update(config: SceneConfig): void;
  audit(): SceneAudit;
  debugSnapshot(): SceneDebugSnapshot;
  dispose(): void;
};
```

- [ ] **Step 6: 实现主场景和运行时审计**

`createLubirthScene()` 创建 `lubirthMainScene`、独立 PerspectiveCamera、独立 Stars、`earthGroup`、出生点和唯一 DirectionalLight。Earth/Cloud/Atmosphere 加入 `earthGroup`；相机、Stars 和光直接加入主 Scene。每帧只更新 `earthGroup.rotation.y`，不得改 `rotation.x/z`。

`SceneAudit` 固定返回 Step 1 的八个布尔字段。`complete2KEffects` 必须同时检查六层云、双层大气、昼夜纹理、城市灯光、银河纹理和 PIP；任一缺失都返回 `false`。

- [ ] **Step 7: 实现同 renderer PIP 与固定屏幕布局**

`MoonPip` 拥有独立 scene/camera/moon、256px render target 和正交 overlay。顺序必须为：按 30fps 节流渲染 PIP target → 恢复 screen target → 渲染主场景 → 关闭 depth 后合成 overlay。`resize()` 只重算 overlay 的纵横比例与屏幕锚点，不改变 PIP 相机姿态。

- [ ] **Step 8: 实现宿主无关 OrbitController**

`OrbitController` 只接收标准化 pointer 数组；不读取 DOM 或 `wx`。单指修改 azimuth/elevation，双指修改 distance，elevation clamp 到 `[-85°, 85°]`，distance clamp 到 `[1.65, 8]`。Spike 的 `TouchCameraController` 改为该控制器的事件适配层。

- [ ] **Step 9: 运行场景、PIP、Spike 与 Web 回归**

Run:

```bash
npm -w @lubirth/render-core test
npm -w @lubirth/render-core run check
cd spikes/wechat-miniprogram && npm run test && npm run check
cd ../.. && npm run build
```

Expected: render-core 测试与 check、Spike `80/80`、Spike check、Web build 全部 PASS。

- [ ] **Step 10: 提交正式渲染场景**

```bash
git add packages/lubirth-render-core spikes/wechat-miniprogram/src/input spikes/wechat-miniprogram/src/scene
git commit -m "feat: assemble shared LuBirth scene and PIP"
```

---

### Task 8: 建立正式竖屏页面、加载状态与错误恢复

**Files:**
- Modify: `clients/wechat-miniprogram/src/app.json`
- Create: `clients/wechat-miniprogram/src/pages/scene/index.ts`
- Create: `clients/wechat-miniprogram/src/pages/scene/index.json`
- Create: `clients/wechat-miniprogram/src/pages/scene/index.wxml`
- Create: `clients/wechat-miniprogram/src/pages/scene/index.wxss`
- Create: `clients/wechat-miniprogram/src/pages/diagnostics/index.ts`
- Create: `clients/wechat-miniprogram/src/pages/diagnostics/index.json`
- Create: `clients/wechat-miniprogram/src/pages/diagnostics/index.wxml`
- Create: `clients/wechat-miniprogram/src/pages/diagnostics/index.wxss`
- Create: `clients/wechat-miniprogram/src/controllers/scene-page-controller.ts`
- Create: `clients/wechat-miniprogram/src/ui/scene-view-model.ts`
- Create: `clients/wechat-miniprogram/test/scene-page-controller.test.ts`
- Create: `clients/wechat-miniprogram/test/scene-view-model.test.ts`
- Modify: `clients/wechat-miniprogram/build.config.mjs`

**Interfaces:**
- Consumes: `SceneLifecycleController`、`TextureRepository`、`createLubirthScene()`、小程序 Page 生命周期。
- Produces: `/pages/scene/index` 正式入口和 `/pages/diagnostics/index` 隐藏诊断入口。

- [ ] **Step 1: 写页面状态映射失败测试**

```ts
// clients/wechat-miniprogram/test/scene-view-model.test.ts
test('loading, ready and recoverable errors have explicit UI states', () => {
  assert.deepEqual(toSceneViewModel({ state: 'loading', loadedAssets: 3, totalAssets: 10, error: null }), {
    state: 'loading',
    progressPercent: 30,
    message: '正在加载 2K 地球资源 3/10',
    canRetry: false,
  });
  assert.equal(toSceneViewModel({ state: 'ready', loadedAssets: 10, totalAssets: 10, error: null }).state, 'ready');
  const failed = toSceneViewModel({
    state: 'error', loadedAssets: 4, totalAssets: 10,
    error: { stage: 'asset', message: 'earth-normal-2k 下载失败' },
  });
  assert.equal(failed.canRetry, true);
  assert.match(failed.message, /earth-normal-2k/);
});
```

- [ ] **Step 2: 写页面控制器与触摸桥失败测试**

```ts
// clients/wechat-miniprogram/test/scene-page-controller.test.ts
test('mount reaches ready, touch reaches the scene, and unload is idempotent', async () => {
  const harness = scenePageHarness();
  await harness.controller.mount(harness.canvas, { cssWidth: 390, cssHeight: 700, dpr: 3 });
  assert.equal(harness.lastViewModel().state, 'ready');
  harness.controller.onTouchStart({ touches: [{ identifier: 7, x: 10, y: 20 }] });
  assert.deepEqual(harness.scene.input.lastStart, [{ id: 7, x: 10, y: 20 }]);
  harness.controller.onUnload();
  harness.controller.onUnload();
  assert.equal(harness.scene.disposeCalls, 1);
  assert.equal(harness.runtime.disposeCalls, 1);
});

test('retry creates a new generation after a recoverable asset failure', async () => {
  const harness = scenePageHarness({ firstAssetLoadRejects: true });
  await assert.rejects(harness.controller.mount(harness.canvas, harness.viewport));
  assert.equal(harness.lastViewModel().canRetry, true);
  await harness.controller.retry();
  assert.equal(harness.lastViewModel().state, 'ready');
  assert.equal(harness.controller.snapshot().generation, 2);
});
```

`scenePageHarness()` 注入 fake runtime、repository、scene factory 和 `setData` recorder，不调用真实 `wx`。

- [ ] **Step 3: 运行测试并确认正式页面层尚未实现**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
```

Expected: view-model 和 controller 模块不存在，测试 FAIL。

- [ ] **Step 4: 实现 ScenePageController**

```ts
export type ScenePageController = {
  mount(canvas: MiniProgramCanvas, viewport: Viewport): Promise<void>;
  retry(): Promise<void>;
  onShow(): void;
  onHide(): void;
  onUnload(): void;
  onMemoryWarning(): void;
  onTouchStart(event: MiniProgramTouchEvent): void;
  onTouchMove(event: MiniProgramTouchEvent): void;
  onTouchEnd(event: MiniProgramTouchEvent): void;
  snapshot(): PageSceneSnapshot;
};
```

控制器严格按 runtime → 10 张必需纹理 → scene 的顺序进入 ready；错误保留阶段和资源 id。`retry()` 使用同一 Canvas 开启新 generation，先释放失败 generation 的部分资源。`onHide()` 只停 RAF，`onUnload()` 按 PIP/scene → texture → renderer → event 顺序幂等释放。

- [ ] **Step 5: 实现竖屏产品页面**

`index.json` 固定：

```json
{
  "navigationStyle": "custom",
  "pageOrientation": "portrait",
  "disableScroll": true
}
```

`index.wxml` 只有全屏 WebGL Canvas、加载进度层和可恢复错误层；PIP 由 WebGL overlay 合成，不创建第二 Canvas。产品页不保留 Spike 的 r108/r160、2K/8K、测试矩阵或 JSON 按钮。

- [ ] **Step 6: 实现触摸、尺寸和安全区域接线**

页面用 SelectorQuery 获取 Canvas，drawing buffer 尺寸由 `css × min(dpr, 3)` 计算；`touchstart/move/end/cancel` 映射为 `{id,x,y}`。Canvas 占满页面可用区域，WXML 不产生纵向滚动；顶部安全区域由 `wx.getWindowInfo()` 计算，不能把 WebGL viewport 裁到状态栏下。

- [ ] **Step 7: 建立隐藏诊断路由**

`app.json` 注册 `pages/scene/index` 为首路由、`pages/diagnostics/index` 为次路由，不加入 tabBar。诊断页只负责触发 Task 10 的场景矩阵、性能、PIP A/B、生命周期与 JSON 复制；产品页不引用诊断 UI 组件。

- [ ] **Step 8: 构建并验证页面合同**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
npm -w @lubirth/wechat-miniprogram run check
MINIAPP_RESOURCE_BASE_URL=https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures npm -w @lubirth/wechat-miniprogram run build:device
```

Expected: 页面状态、retry、触摸、生命周期测试 PASS；`miniprogram/pages/scene/` 和 `miniprogram/pages/diagnostics/` 静态文件齐全；主包仍小于 2 MiB。

- [ ] **Step 9: 提交正式页面**

```bash
git add clients/wechat-miniprogram/src/app.json clients/wechat-miniprogram/src/pages clients/wechat-miniprogram/src/controllers clients/wechat-miniprogram/src/ui clients/wechat-miniprogram/test clients/wechat-miniprogram/build.config.mjs
git commit -m "feat: add portrait LuBirth mini-program scene page"
```

---

### Task 9: 让 Web 消费共享配置与 Shader，并冻结跨宿主回归

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/scenes/simple/shared/renderUniforms.ts`
- Create: `src/scenes/simple/shared/textureBundle.ts`
- Modify: `src/scenes/simple/api/components/Earth.tsx`
- Modify: `src/scenes/simple/api/components/Clouds.tsx`
- Modify: `src/scenes/simple/api/components/AtmosphereEffects.tsx`
- Modify: `src/scenes/simple/api/components/Moon.tsx`
- Modify: `src/SimpleTest.tsx`
- Modify: `src/scenes/simple/utils/lightingUtils.ts`
- Modify: `src/scenes/simple/utils/textureLoader.ts`
- Create: `test/shared-render-contract.test.ts`
- Create: `test/cross-host-scene-config.test.ts`

**Interfaces:**
- Consumes: 共享 `SceneConfig`、Shader source、uniform schema、资源键和天文函数。
- Produces: 保留现有 React/R3F 场景的 Web 薄桥接；Web 与小程序共享视觉核心定义。

- [ ] **Step 1: 写单一视觉定义失败测试**

```ts
// test/shared-render-contract.test.ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('Web visual components consume shared shaders and twilight profile', () => {
  for (const path of [
    'src/scenes/simple/api/components/Earth.tsx',
    'src/scenes/simple/api/components/Clouds.tsx',
    'src/scenes/simple/api/components/AtmosphereEffects.tsx',
    'src/scenes/simple/api/components/Moon.tsx',
  ]) {
    assert.match(read(path), /@lubirth\/render-core\/shaders/);
  }
  assert.doesNotMatch(read('src/scenes/simple/api/components/Earth.tsx'), /const\s+fragmentShader\s*=/);
  assert.doesNotMatch(read('src/scenes/simple/api/components/Clouds.tsx'), /const\s+fragmentShader\s*=/);
});
```

- [ ] **Step 2: 写共享场景映射一致性失败测试**

```ts
// test/cross-host-scene-config.test.ts
test('Web defaults map to the formal iOS portrait 2K profile', () => {
  const actual = sceneConfigFromComposition(DEFAULT_SIMPLE_COMPOSITION, { latDeg: 31.2304, lonDeg: 121.4737 });
  assert.equal(actual.assetTier, '2k');
  assert.equal(actual.cloud.layers, 6);
  assert.equal(actual.atmosphere.nearShellEnabled, true);
  assert.equal(actual.pip.resolution, 256);
  assert.deepEqual(actual.fixedSunRay, DEFAULT_SCENE_CONFIG.fixedSunRay);
});
```

- [ ] **Step 3: 运行测试并确认 Web 仍有宿主内视觉定义**

Run:

```bash
node --test --experimental-strip-types test/shared-render-contract.test.ts test/cross-host-scene-config.test.ts
```

Expected: Web 组件尚未导入共享 Shader，测试 FAIL。

- [ ] **Step 4: 添加 Web 对共享 workspace 的显式依赖**

根 `package.json` 增加固定 workspace 依赖：

```json
{
  "dependencies": {
    "@lubirth/core": "workspace:*",
    "@lubirth/render-core": "workspace:*"
  }
}
```

保留现有 React/R3F/Drei/Three dependencies；不把正式小程序包导入 Web。

- [ ] **Step 5: 建立 React/R3F uniform 与纹理桥接**

`renderUniforms.ts` 把 R3F 的 `THREE.Texture` 和 `SimpleComposition` 映射到共享 uniform schema；所有数组向量显式转换成 `THREE.Vector3/Color`。`textureBundle.ts` 把 `useTextureLoader()` 结果映射成共享 `TextureBundle` 键，并在缺少必需纹理时返回带具体 asset key 的错误，不创建生产占位纹理。

- [ ] **Step 6: 让 Earth/Cloud/Atmosphere/Moon 使用共享 Shader**

四个组件继续由 R3F 挂载 Mesh，但 `vertexShader`、`fragmentShader`、twilight 参数和 uniform 名来自 `@lubirth/render-core/shaders`。Web 特有的 React memo、hook 和 UI 参数只留在 bridge；GLSL 字符串不能在 `src/` 再定义第二份。

- [ ] **Step 7: 让银河和天文路径使用共享语义**

`SimpleTest.tsx` 的 `MilkyWayMesh` 使用共享 Star Shader/采样约定；`textureLoader.ts` 使用共享 asset key/colorSpace，但保留 Web URL fallback。`lightingUtils.ts` 只调用 `@lubirth/core/astro`，不得复制太阳/月球公式。

- [ ] **Step 8: 运行跨宿主完整回归**

Run:

```bash
node --test --experimental-strip-types test/shared-render-contract.test.ts test/cross-host-scene-config.test.ts
npm -w @lubirth/core test
npm -w @lubirth/render-core test
npm run build
cd spikes/wechat-miniprogram && npm run test && npm run test:astro && npm run check
cd ../.. && MINIAPP_RESOURCE_BASE_URL=https://assets.aitoshuu.me/releases/lubirth-wechat-spike/textures npm run verify:wechat
```

Expected: 两个根合同测试、共享包测试、Web build、Spike `80/80` 与 `3/3`、正式客户端 verify 全部 PASS。

- [ ] **Step 9: 提交跨宿主共享迁移**

```bash
git add package.json package-lock.json src test/shared-render-contract.test.ts test/cross-host-scene-config.test.ts
git commit -m "refactor: make Web consume shared render contracts"
```

---

### Task 10: 完成 iOS 发布级性能、长稳、包体与证据验收

**Files:**
- Create: `clients/wechat-miniprogram/src/diagnostics/performance-probe.ts`
- Create: `clients/wechat-miniprogram/src/diagnostics/pip-paired-run.ts`
- Create: `clients/wechat-miniprogram/src/diagnostics/lifecycle-run.ts`
- Create: `clients/wechat-miniprogram/src/diagnostics/evidence-bundle.ts`
- Create: `clients/wechat-miniprogram/src/diagnostics/result-schema.ts`
- Create: `clients/wechat-miniprogram/test/performance-gates.test.ts`
- Create: `clients/wechat-miniprogram/test/lifecycle-gates.test.ts`
- Create: `clients/wechat-miniprogram/test/evidence-bundle.test.ts`
- Create: `clients/wechat-miniprogram/baselines/ios-portrait-2k-visual.json`
- Create: `clients/wechat-miniprogram/results/README.md`
- Create: `clients/wechat-miniprogram/README.md`
- Modify: `clients/wechat-miniprogram/src/pages/diagnostics/index.ts`
- Modify: `clients/wechat-miniprogram/src/pages/diagnostics/index.wxml`
- Modify: `clients/wechat-miniprogram/src/pages/diagnostics/index.wxss`
- Modify: `clients/wechat-miniprogram/build.config.mjs`
- Modify: `README.md`
- Modify: `docs/spikes/wechat-miniprogram-capability-report.md`
- Modify: `docs/spikes/wechat-miniprogram-migration-boundary.md`

**Interfaces:**
- Consumes: 正式场景运行时、Spike evidence schema、物理 iOS 设备、微信开发者工具上传/预览流程。
- Produces: `MigrationEvidenceBundle`、设备基线、三类性能/稳定性 gate、正式客户端运行说明与发布判定。

- [ ] **Step 1: 写发布 gate 失败测试**

```ts
// clients/wechat-miniprogram/test/performance-gates.test.ts
test('60 second performance gate requires median 30 FPS and p95 at most 50ms', () => {
  assert.equal(evaluatePerformance({ durationMs: 60_000, medianFps: 29.9, p95FrameMs: 40 }).pass, false);
  assert.equal(evaluatePerformance({ durationMs: 60_000, medianFps: 31, p95FrameMs: 50 }).pass, true);
  assert.equal(evaluatePerformance({ durationMs: 59_999, medianFps: 60, p95FrameMs: 10 }).pass, false);
});

test('PIP paired gate requires three pairs and at most 2ms median delta', () => {
  assert.equal(evaluatePipPairs([1.1, 1.8]).pass, false);
  assert.equal(evaluatePipPairs([1.6, 2.0, 2.4]).pass, true);
  assert.equal(evaluatePipPairs([2.1, 2.2, 2.3]).pass, false);
});
```

- [ ] **Step 2: 写生命周期与证据完整性失败测试**

```ts
// clients/wechat-miniprogram/test/lifecycle-gates.test.ts
test('release lifecycle requires ten minutes and ten reentries without faults', () => {
  assert.equal(evaluateLifecycle({ durationMs: 600_000, reentries: 10, blackScreens: 0, crashes: 0, contextLosses: 0, duplicateRaf: 0 }).pass, true);
  assert.equal(evaluateLifecycle({ durationMs: 600_000, reentries: 10, blackScreens: 1, crashes: 0, contextLosses: 0, duplicateRaf: 0 }).pass, false);
});

// clients/wechat-miniprogram/test/evidence-bundle.test.ts
test('evidence cannot pass without device identity, three presets and zero GPU faults', () => {
  const result = evaluateEvidence(validEvidence({ visualPresets: ['day', 'twilight'] }));
  assert.equal(result.pass, false);
  assert.deepEqual(result.missing, ['visualPresets:night']);
  assert.equal(evaluateEvidence(validEvidence({ shaderErrors: 1 })).pass, false);
  assert.equal(evaluateEvidence(validEvidence({ glErrors: 1 })).pass, false);
});
```

- [ ] **Step 3: 运行测试并确认发布诊断尚未实现**

Run:

```bash
npm -w @lubirth/wechat-miniprogram test
```

Expected: performance、lifecycle、evidence 模块不存在，测试 FAIL。

- [ ] **Step 4: 实现统计与判定纯函数**

`PerformanceProbe` 丢弃前 10 秒预热，仅统计随后 60 秒；输出帧间隔原始计数、median FPS、p95 frame ms、DPR、drawing buffer 和 PIP 设置。PIP A/B 固定顺序为 `off/on` × 3，每轮 30 秒并记录热身后样本；判定使用三组 `onMedianFrameMs - offMedianFrameMs` 的中位数。

`LifecycleRun` 记录开始/结束、10 次 hide/show 或 unload/reload、RAF 数、黑屏、崩溃、context loss、Shader/GL error。所有 evaluator 是无 `wx` 的纯函数，诊断页只负责采样和显示。

- [ ] **Step 5: 固定证据 schema 与视觉基线**

```ts
export type MigrationEvidenceBundle = {
  schemaVersion: '2.0.0';
  runId: string;
  build: { gitRevision: string; threeVersion: '0.160.1'; assetVersion: string; packageBytes: number };
  device: { model: string; platform: 'ios'; osVersion: string; wechatVersion: string; sdkVersion: string; dpr: number };
  runtime: { context: 'webgl' | 'webgl2'; maxTextureSize: number; shaderErrors: number; glErrors: number };
  assets: Array<{ id: AssetKey; sha256: string; decodedWidth: 2048; decodedHeight: 1024; uploaded: true }>;
  visualPresets: Array<'day' | 'twilight' | 'night'>;
  performance: PerformanceResult;
  pipPairs: PipPairResult;
  lifecycle: LifecycleResult;
  verdict: 'pass' | 'fail';
};
```

`baselines/ios-portrait-2k-visual.json` 固定三套 UTC、观察点、地球 yaw、相机和判定项：昼面纹理/六层云/内外大气；晨昏无垂直接断、无经线接缝；夜面城市灯光、暗面层次、银河和固定 PIP。它记录输入与准则，不伪造截图或设备结果。

- [ ] **Step 6: 把完整验收接入隐藏诊断页**

诊断页提供五个动作：运行白昼/晨昏/夜面矩阵、运行 60 秒性能、运行三轮 PIP A/B、运行 10 分钟生命周期、复制最新 JSON。每次运行显示剩余时间和当前阶段；离开页面时取消当前诊断且输出 `fail`，不得把未完成状态记为 `pass`。

- [ ] **Step 7: 增加包体和构建证据 gate**

`build.config.mjs` 在 device build 后递归统计 `miniprogram/`，若超过 `2,097,152` bytes 退出非零；同时扫描产物，命中 `threejs-miniprogram`、`r108-official-adapter`、`.pem`、`SecretId` 或 `SecretKey` 即失败。把 git revision、Three 版本和 asset version 生成到 `miniprogram/build-metadata.json`。

- [ ] **Step 8: 运行全部自动验证**

Run:

```bash
npm run verify:migration
git diff --check
```

Expected: 共享 core/render、Web build、正式小程序单测/check/device build 全部 PASS；主包 `< 2 MiB`；产物扫描无禁用依赖和密钥。

- [ ] **Step 9: 在物理 iOS 设备完成发布证据**

先用微信开发者工具 CLI 生成预览：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli preview \
  --project /Users/aitoshuu/Documents/GitHub/LuBirth/clients/wechat-miniprogram \
  --qr-format terminal
```

真机扫码后从隐藏诊断页依次运行三预设、60 秒性能、PIP 三轮配对和 10 分钟/10 次重入；复制 JSON 到：

```text
clients/wechat-miniprogram/results/<runId>.json
```

并把三张同一 `runId` 的真机截图放入：

```text
clients/wechat-miniprogram/results/<runId>-day.png
clients/wechat-miniprogram/results/<runId>-twilight.png
clients/wechat-miniprogram/results/<runId>-night.png
```

只有 JSON evaluator 为 `pass` 且人工对照 `ios-portrait-2k-visual.json` 三项全部通过，才允许进入 Step 10。

- [ ] **Step 10: 锁定支持矩阵并更新结论文档**

在 `clients/wechat-miniprogram/README.md` 记录本轮通过设备的精确 model、iOS、微信、基础库和 AppID 环境。单台设备只记为“已验证组合”，不能直接声明最低支持矩阵；如果产品尚未确认最低 iPhone/iOS/微信/基础库，发布状态保持 `RELEASE-BLOCKED`。根 README 增加正式客户端构建、预览、资源域名和诊断入口。

更新 Spike 报告：保留 `FEASIBILITY-PASS`，追加正式迁移 run id；更新迁移边界：将发布门逐条链接到证据字段。若任一 gate 失败，文档状态保持 `IMPLEMENTATION-COMPLETE / RELEASE-BLOCKED`，不得写成发布通过。

- [ ] **Step 11: 提交发布验收与证据**

```bash
git add clients/wechat-miniprogram/src/diagnostics clients/wechat-miniprogram/src/pages/diagnostics clients/wechat-miniprogram/test clients/wechat-miniprogram/baselines clients/wechat-miniprogram/results clients/wechat-miniprogram/README.md clients/wechat-miniprogram/build.config.mjs README.md docs/spikes
git commit -m "test: qualify iOS 2K mini-program migration"
```

---

## Execution Checkpoints

| 检查点 | 完成任务 | 必须满足后才能继续 |
|---|---:|---|
| A：共享事实源 | 1–3 | workspace 稳定；天文、坐标、场景配置和 2K manifest 只有一份实现；Web build 通过 |
| B：共享渲染竖切片 | 4–7 | v6 Shader/pass、完整场景、PIP 与触摸测试通过；Spike `80/80` 不回退 |
| C：正式双宿主 | 8–9 | 正式竖屏页面可构建；Web 消费共享合同；所有自动回归通过 |
| D：发布候选 | 10 | 物理 iOS 三视觉预设、60 秒性能、PIP A/B、10 分钟/10 次重入和 2 MiB gate 全部通过 |

每个检查点结束后审阅 `git diff --stat` 和 `git diff --check`。如果共享抽取需要修改 Three renderer/material/shader chunk 或全局色彩管理，立即停止并按迁移边界重新评审，不继续扩大适配层。

## Definition of Done

- `packages/lubirth-core` 是天文、坐标、场景配置和 2K 资源语义的唯一实现。
- `packages/lubirth-render-core` 是 Earth/Cloud/Atmosphere/Moon/Stars Shader、命令式场景和 PIP 的唯一实现。
- Web 保留 React/R3F 宿主但消费共享核心，`npm run build` 通过且既有视觉/天文路径不回退。
- 正式小程序只有 r160、一个 WebGL Canvas、一个 renderer 和 2K 完整效果档。
- 产品页可加载、可触摸、可隐藏/恢复、可卸载、可重试，所有异常都有可见错误而不是黑屏。
- CDN 十张 2K 纹理全部校验 SHA-256、尺寸、色彩空间、wrap 和逐张 GPU 上传。
- 三个视觉基线不存在经线接缝、晨昏硬切、内侧菲涅尔/外侧扩散截断或 PIP 漂移。
- 物理 iOS 的性能、PIP 成本、长稳、重入、Shader/GL 和包体 gate 全部通过并有同 run id 证据。
- Android、横屏、8K 没有进入正式依赖、构建、页面和验收矩阵。

## Deferred Scope Registry

| 项目 | 当前处理 | 重新进入条件 |
|---|---|---|
| Android | 不实现、不验收 | 有明确目标机型后单独做 GPU/纹理/性能 Spike 与计划 |
| 横屏 | 不实现、不验收 | 有确认的构图、PIP 锚点和安全区域设计后另开计划 |
| 8K | 不实现、不下载、不打包 | 2K 发布后有清晰质量收益和目标设备显存预算再评估 |
| 登录/分享/音频/截图/城市搜索 | 不混入渲染迁移 | 分别具备产品说明、权限和验收标准后独立规划 |
