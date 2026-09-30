#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cp, lstat, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const prefix = 'releases/aitoshuu-me/';
const sourceInputs = ['src', 'public', 'index.html', 'vite.config.ts', 'package.json', 'package-lock.json', 'deploy/package-release.mjs'];
// Unreferenced sound prototypes are local authoring material, not site resources.
const sourceExclusions = [':(exclude)public/sfx'];
const isPrototype = path => path === 'sfx' || path.startsWith('sfx/');
const deployableExtensions = new Set([
  '.avif', '.css', '.csv', '.gif', '.glb', '.ico', '.jpeg', '.jpg', '.js', '.json', '.mjs',
  '.mp3', '.mp4', '.ogg', '.png', '.svg', '.vtt', '.wav', '.webm', '.webp', '.woff', '.woff2',
]);
const mime = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.gif': 'image/gif', '.glb': 'model/gltf-binary', '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.ogg': 'audio/ogg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.vtt': 'text/vtt; charset=utf-8', '.wav': 'audio/wav', '.webm': 'video/webm',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function fail(message) { throw new Error(message); }
function git(...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail(`git ${args[0]} failed`);
  return result.stdout.trim();
}
async function walk(path) {
  const info = await lstat(path);
  if (info.isFile()) return [path];
  if (!info.isDirectory()) fail(`unsupported source path: ${path}`);
  const names = (await readdir(path)).sort();
  const nested = await Promise.all(names.filter(name => name !== '.DS_Store').map(name => walk(join(path, name))));
  return nested.flat();
}
function ext(path) { return path.slice(path.lastIndexOf('.')).toLowerCase(); }
function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!['--output', '--source-ref'].includes(argv[i]) || !argv[i + 1]) fail('usage: package-release.mjs --output <directory> [--source-ref <HEAD-commit>]');
    options[argv[i].slice(2)] = argv[i + 1];
  }
  if (!options.output) fail('--output is required');
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const output = resolve(options.output);
  if (output === root || output.startsWith(`${root}${sep}`)) fail('release output must be outside the source tree');
  const head = git('rev-parse', 'HEAD');
  if (options['source-ref'] && git('rev-parse', `${options['source-ref']}^{commit}`) !== head) fail('--source-ref must be the checked-out HEAD');
  const files = (await Promise.all(sourceInputs.map(name => walk(join(root, name))))).flat()
    .filter(file => !isPrototype(relative(join(root, 'public'), file).split(sep).join('/'))).sort();
  const sourceHash = createHash('sha256');
  for (const file of files) {
    sourceHash.update(relative(root, file)); sourceHash.update('\0');
    sourceHash.update(await readFile(file)); sourceHash.update('\0');
  }
  const sourceDigest = sourceHash.digest('hex');
  if (options['source-ref'] && git('status', '--porcelain', '--', ...sourceInputs, ...sourceExclusions)) fail('--source-ref requires clean release inputs');
  const releaseId = `lubirth-${sourceDigest.slice(0, 16)}`;
  const objectPrefix = `${prefix}${releaseId}/`;
  const assetsBase = `https://assets.aitoshuu.me/${objectPrefix}`;
  const mediaBase = `https://media.aitoshuu.me/${objectPrefix}`;
  await mkdir(output);
  const buildDir = join(output, '.build');
  const result = spawnSync('npm', ['run', 'build', '--', '--outDir', buildDir], {
    cwd: root, encoding: 'utf8', env: {
      ...process.env,
      LUBIRTH_ASSET_BASE: assetsBase,
      VITE_LUBIRTH_MEDIA_BASE: mediaBase,
    },
  });
  if (result.status !== 0) fail(`Vite build failed:\n${result.stdout}\n${result.stderr}`);
  const entries = [];
  for (const file of await walk(buildDir)) {
    const path = relative(buildDir, file).split(sep).join('/');
    if (path === 'index.html') continue;
    if (isPrototype(path)) continue;
    if (!deployableExtensions.has(ext(path))) continue;
    const channel = /^(?:bgm|sfx)\//.test(path) ? 'media' : 'assets';
    const packagePath = `${channel}/${path}`;
    const bytes = await readFile(file);
    if (!bytes.length) fail(`empty delivery object: ${path}`);
    await mkdir(dirname(join(output, packagePath)), { recursive: true });
    await cp(file, join(output, packagePath));
    entries.push({ channel, packagePath, objectKey: `${objectPrefix}${path}`, bytes: bytes.length,
      sha256: sha(bytes), mime: mime[ext(path)], cacheControl: 'public, max-age=31536000, immutable' });
  }
  const html = await readFile(join(buildDir, 'index.html'));
  if (!html.toString().includes(assetsBase)) fail('HTML does not reference the CDN release');
  await mkdir(join(output, 'web'), { recursive: true });
  await writeFile(join(output, 'web/index.html'), html);
  entries.push({ channel: 'origin', packagePath: 'web/index.html', bytes: html.length,
    sha256: sha(html), mime: 'text/html; charset=utf-8', cacheControl: 'no-cache' });
  const health = Buffer.from(JSON.stringify({ site: 'LuBirth', releaseId, sourceDigest, gitHead: head }) + '\n');
  await writeFile(join(output, 'web/release-health.json'), health);
  entries.push({ channel: 'origin', packagePath: 'web/release-health.json', bytes: health.length,
    sha256: sha(health), mime: 'application/json; charset=utf-8', cacheControl: 'no-store' });
  const manifest = { schemaVersion: 1, site: 'LuBirth', releaseId, gitHead: head,
    sourceMode: options['source-ref'] ? 'commit' : 'worktree', sourceDigest,
    assetsBase, mediaBase, objectPrefix, entries: entries.sort((a,b) => a.packagePath.localeCompare(b.packagePath)) };
  await mkdir(join(output, 'manifests'), { recursive: true });
  await writeFile(join(output, 'manifests/release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await rm(buildDir, { recursive: true, force: true });
  console.log(JSON.stringify({ output, releaseId, sourceMode: manifest.sourceMode,
    objects: entries.filter(entry => entry.objectKey).length,
    bytes: entries.reduce((sum, entry) => sum + entry.bytes, 0) }, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
