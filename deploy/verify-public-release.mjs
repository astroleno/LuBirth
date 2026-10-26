#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
async function request(path, options = {}, host = 'aitoshuu.me') {
  const response = await fetch(`https://${host}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(15000), ...options });
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
}

async function main() {
  if (!process.argv[2]) throw new Error('usage: verify-public-release.mjs <package directory>');
  const root = resolve(process.argv[2]);
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) throw new Error('invalid release manifest');
  const canonicalUrl = 'https://aitoshuu.me/LuBirth/';
  const html = await request('/LuBirth/');
  const localHtml = await readFile(join(root, 'web/index.html'));
  if (html.response.status !== 200 || sha(html.bytes) !== sha(localHtml) || !html.bytes.toString().includes(manifest.assetsBase)
      || !html.bytes.toString().includes(`<link rel="canonical" href="${canonicalUrl}"`)) throw new Error('public HTML differs from the release');
  if (!html.response.headers.get('cache-control')?.includes('no-cache')) throw new Error('public HTML cache policy is invalid');
  const health = await request('/LuBirth/release-health.json');
  const localHealth = await readFile(join(root, 'web/release-health.json'));
  if (health.response.status !== 200 || sha(health.bytes) !== sha(localHealth) || JSON.parse(health.bytes).releaseId !== manifest.releaseId) throw new Error('public release marker differs from the release');
  if (health.response.headers.get('cache-control') !== 'no-store') throw new Error('release marker cache policy is invalid');
  const discoveryPaths = new Set(manifest.entries.filter(entry => entry.channel === 'origin').map(entry => entry.packagePath));
  const hasDiscoveryFiles = discoveryPaths.has('web/llms.txt') && discoveryPaths.has('web/sitemap.xml');
  if (hasDiscoveryFiles) {
    const llms = await request('/LuBirth/llms.txt');
    const localLlms = await readFile(join(root, 'web/llms.txt'));
    if (llms.response.status !== 200 || sha(llms.bytes) !== sha(localLlms) || !llms.bytes.includes(Buffer.from(canonicalUrl))) throw new Error('public LuBirth discovery summary differs from the release');
    if (!llms.response.headers.get('cache-control')?.includes('no-cache')) throw new Error('discovery summary cache policy is invalid');
    const sitemap = await request('/LuBirth/sitemap.xml');
    const localSitemap = await readFile(join(root, 'web/sitemap.xml'));
    if (sitemap.response.status !== 200 || sha(sitemap.bytes) !== sha(localSitemap) || !sitemap.bytes.includes(Buffer.from(`<loc>${canonicalUrl}</loc>`))) throw new Error('public LuBirth sitemap differs from the release');
    if (!sitemap.response.headers.get('cache-control')?.includes('no-cache')) throw new Error('LuBirth sitemap cache policy is invalid');
  } else if (discoveryPaths.has('web/llms.txt') || discoveryPaths.has('web/sitemap.xml')) {
    throw new Error('public discovery package is incomplete');
  }
  const redirects = [];
  const query = '?scene=sky&history=1&place=%E4%B8%8A%E6%B5%B7';
  for (const host of ['aitoshuu.me', 'tongye.me']) {
    for (const [path, suffix] of [
      ['/LuBirth', ''], ['/lubirth', ''], ['/lubirth/', ''], ['/LUBIRTH/', ''],
      ['/lubirth/' + query, query], ['/lubirth/release-health.json', 'release-health.json'],
      ...(host === 'tongye.me' ? [['/LuBirth/', ''], ['/LuBirth/' + query, query], ['/LuBirth/release-health.json', 'release-health.json']] : []),
    ]) {
      const result = await request(path, {}, host);
      if (result.response.status !== 308 || result.response.headers.get('location') !== canonicalUrl + suffix) throw new Error(`invalid LuBirth redirect: ${host}${path}`);
      redirects.push({ host, path, status: 308, location: result.response.headers.get('location') });
    }
  }
  const missing = await request('/LuBirth/assets/does-not-exist.js');
  if (missing.response.status !== 404) throw new Error('missing asset does not return 404');
  const home = await request('/');
  if (home.response.status !== 200 || home.bytes.includes(Buffer.from(manifest.releaseId))) throw new Error('site home was replaced by LuBirth');
  console.log(JSON.stringify({ url: canonicalUrl, releaseId: manifest.releaseId, htmlSha256: sha(html.bytes), healthSha256: sha(health.bytes), discovery: hasDiscoveryFiles ? ['llms.txt', 'sitemap.xml'] : [], redirects, missingAsset: 404, homePreserved: true, tls: 'trusted' }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
