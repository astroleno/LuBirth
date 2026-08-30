import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const spikeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('2K r160 device profile keeps the startup entry below one MiB and excludes r108', async () => {
  const result = await build({
    absWorkingDir: spikeRoot,
    entryPoints: ['src/pages/capability/index.ts'],
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: ['es2018'],
    minify: true,
    legalComments: 'none',
    logLevel: 'silent',
    write: false,
    define: {
      __RESOURCE_BASE_URL__: JSON.stringify('https://assets.example/textures'),
      __SPIKE_RUNTIME_PROFILE__: JSON.stringify('r160'),
      __SPIKE_BUILD__: JSON.stringify({
        builtAt: '2026-08-31T00:00:00.000Z',
        revision: 'test-revision',
        dirty: false,
        dependencyLockSha256: 'lock',
        assetManifestSha256: 'assets',
        astroSourceSha256: 'astro',
        r160Version: '0.160.1',
        r108AdapterVersion: '0.0.8',
      }),
    },
  });

  const output = result.outputFiles[0];
  assert.ok(output.contents.byteLength < 1024 * 1024, `startup entry is ${output.contents.byteLength} bytes`);
  assert.doesNotMatch(output.text, /threejs-miniprogram/);
});
