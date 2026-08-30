import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { assertDevicePackageSize, listPackageFiles, sumPackageBytes } from './build-output.mjs';

const spikeRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(spikeRoot, '../..');
const sourceRoot = join(spikeRoot, 'src');
const outputRoot = join(spikeRoot, 'miniprogram');
const deviceBuild = process.env.SPIKE_DEVICE_BUILD === '1';

if (basename(outputRoot) !== 'miniprogram' || dirname(outputRoot) !== spikeRoot) {
  throw new Error(`Refusing to clean unexpected build directory: ${outputRoot}`);
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function assetFingerprint() {
  const textureRoot = join(repositoryRoot, 'public/textures');
  const entries = readdirSync(textureRoot)
    .filter((name) => statSync(join(textureRoot, name)).isFile())
    .sort()
    .map((name) => `${name}:${statSync(join(textureRoot, name)).size}`)
    .join('\n');
  return createHash('sha256').update(entries).digest('hex');
}

function astroSourceFingerprint() {
  const sourceFiles = [
    'src/astro/ephemeris.ts',
    'src/astro/autoTests.ts',
    'src/astro/fullLightingAutoTest.ts',
    'src/astro/moonPhaseAutoTests.ts',
  ];
  const hash = createHash('sha256');
  for (const path of sourceFiles) hash.update(readFileSync(join(repositoryRoot, path)));
  return hash.digest('hex');
}

function git(...args) {
  return execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8' }).trim();
}

const lockPath = join(spikeRoot, 'package-lock.json');
const buildMetadata = {
  builtAt: new Date().toISOString(),
  revision: git('rev-parse', 'HEAD'),
  dirty: git('status', '--porcelain').length > 0,
  dependencyLockSha256: sha256File(lockPath),
  assetManifestSha256: assetFingerprint(),
  astroSourceSha256: astroSourceFingerprint(),
  r160Version: '0.160.1',
  r108AdapterVersion: '0.0.8',
};

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

await build({
  absWorkingDir: spikeRoot,
  entryPoints: {
    app: 'src/app.ts',
    'pages/capability/index': 'src/pages/capability/index.ts',
  },
  outdir: outputRoot,
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: ['es2018'],
  sourcemap: deviceBuild ? false : true,
  minify: deviceBuild,
  legalComments: 'none',
  logLevel: 'info',
  define: {
    __SPIKE_BUILD__: JSON.stringify(buildMetadata),
    __RESOURCE_BASE_URL__: JSON.stringify(process.env.SPIKE_RESOURCE_BASE_URL ?? ''),
  },
});

for (const path of [
  'app.json',
  'app.wxss',
  'sitemap.json',
  'pages/capability/index.json',
  'pages/capability/index.wxml',
  'pages/capability/index.wxss',
]) {
  const destination = join(outputRoot, path);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(sourceRoot, path), destination);
}

if (deviceBuild) {
  const files = listPackageFiles(outputRoot);
  const packageSize = assertDevicePackageSize(sumPackageBytes(files));
  console.log(`Device main package: ${packageSize.bytes} / ${packageSize.limitBytes} bytes`);
}

console.log(`Built ${relative(repositoryRoot, outputRoot)} at ${buildMetadata.revision.slice(0, 8)}`);
