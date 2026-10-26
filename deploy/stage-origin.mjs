#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const originRoot = '/www/wwwroot/lubirth-releases';
const currentLink = '/www/wwwroot/lubirth-current';
const nginxConfig = '/www/server/panel/vhost/nginx/html_aitoshuu.me.conf';
const legacyOriginPaths = ['web/index.html', 'web/release-health.json'];
const discoveryOriginPaths = [
  'web/index.html',
  'web/llms.txt',
  'web/release-health.json',
  'web/sitemap.xml',
];
function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function samePaths(actual, expected) {
  return actual.length === expected.length && actual.every((path, index) => path === expected[index]);
}

async function main() {
  if (process.argv[2] !== '--package' || !process.argv[3]) throw new Error('usage: stage-origin.mjs --package <release directory>');
  const root = resolve(process.argv[3]);
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) throw new Error('invalid LuBirth release manifest');
  const origin = manifest.entries.filter(entry => entry.channel === 'origin');
  const originPaths = origin.map(entry => entry.packagePath).sort();
  const hasDiscoveryFiles = samePaths(originPaths, discoveryOriginPaths);
  if (!hasDiscoveryFiles && !samePaths(originPaths, legacyOriginPaths)) throw new Error('origin package is incomplete');
  for (const entry of origin) {
    const path = join(root, entry.packagePath);
    if ((await stat(path)).size !== entry.bytes || sha(await readFile(path)) !== entry.sha256) throw new Error(`origin hash mismatch: ${entry.packagePath}`);
  }
  const html = await readFile(join(root, 'web/index.html'), 'utf8');
  if (!html.includes(manifest.assetsBase) || /\/lubirth\/assets\//i.test(html)) throw new Error('origin HTML is not pinned to the CDN release');
  const health = JSON.parse(await readFile(join(root, 'web/release-health.json'), 'utf8'));
  if (health.releaseId !== manifest.releaseId || health.sourceDigest !== manifest.sourceDigest) throw new Error('origin health marker mismatch');
  if (hasDiscoveryFiles) {
    const llms = await readFile(join(root, 'web/llms.txt'), 'utf8');
    if (!llms.includes('https://aitoshuu.me/LuBirth/') || !llms.includes('https://tongye.me/LuBirth/')) throw new Error('LuBirth discovery summary is incomplete');
    const sitemap = await readFile(join(root, 'web/sitemap.xml'), 'utf8');
    if (!sitemap.includes('<loc>https://aitoshuu.me/LuBirth/</loc>')) throw new Error('LuBirth sitemap canonical URL is missing');
  }
  console.log(JSON.stringify({
    mode: 'staging-plan', releaseId: manifest.releaseId,
    originProvider: 'tencent', originHost: '122.51.59.89',
    originNginxConfig: '/www/server/panel/vhost/nginx/extension/aitoshuu.art/lubirth-migration.conf',
    gatewayProvider: 'aliyun', gatewayHost: '47.103.120.24',
    source: join(root, 'web'), destination: `${originRoot}/${manifest.releaseId}/web`,
    currentLink, nginxConfig,
    files: origin.map(entry => ({ path: entry.packagePath.slice(4), bytes: entry.bytes, sha256: entry.sha256 })),
    nginxLocations: [
      'include /www/server/panel/vhost/nginx/aitoshuu-lubirth-routes.inc;',
    ],
    additionalNginxConfig: '/www/server/panel/vhost/nginx/html_tongye.me.conf',
    additionalNginxLocations: [
      'include /www/server/panel/vhost/nginx/tongye-lubirth-routes.inc;',
    ],
  }, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
