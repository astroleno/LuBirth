#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const originRoot = '/www/wwwroot/lubirth-releases';
const currentLink = '/www/wwwroot/lubirth-current';
const nginxConfig = '/www/server/panel/vhost/nginx/html_aitoshuu.me.conf';
function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }

async function main() {
  if (process.argv[2] !== '--package' || !process.argv[3]) throw new Error('usage: stage-origin.mjs --package <release directory>');
  const root = resolve(process.argv[3]);
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) throw new Error('invalid LuBirth release manifest');
  const origin = manifest.entries.filter(entry => entry.channel === 'origin');
  if (origin.length !== 2 || !origin.some(entry => entry.packagePath === 'web/index.html') || !origin.some(entry => entry.packagePath === 'web/release-health.json')) throw new Error('origin package is incomplete');
  for (const entry of origin) {
    const path = join(root, entry.packagePath);
    if ((await stat(path)).size !== entry.bytes || sha(await readFile(path)) !== entry.sha256) throw new Error(`origin hash mismatch: ${entry.packagePath}`);
  }
  const html = await readFile(join(root, 'web/index.html'), 'utf8');
  if (!html.includes(manifest.assetsBase) || html.includes('/lubirth/assets/')) throw new Error('origin HTML is not pinned to the CDN release');
  const health = JSON.parse(await readFile(join(root, 'web/release-health.json'), 'utf8'));
  if (health.releaseId !== manifest.releaseId || health.sourceDigest !== manifest.sourceDigest) throw new Error('origin health marker mismatch');
  console.log(JSON.stringify({
    mode: 'staging-plan', releaseId: manifest.releaseId,
    source: join(root, 'web'), destination: `${originRoot}/${manifest.releaseId}/web`,
    currentLink, nginxConfig,
    files: origin.map(entry => ({ path: entry.packagePath.slice(4), bytes: entry.bytes, sha256: entry.sha256 })),
    nginxLocations: [
      'location = /lubirth { return 308 /lubirth/; }',
      `location ^~ /lubirth/ { alias ${currentLink}/; index index.html; try_files $uri $uri/ =404; }`,
    ],
  }, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
