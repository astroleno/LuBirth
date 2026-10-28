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
  const localHtml = await readFile(join(root, 'web/index.html'));
  const localHealth = await readFile(join(root, 'web/release-health.json'));
  const discoveryPaths = new Set(manifest.entries.filter(entry => entry.channel === 'origin').map(entry => entry.packagePath));
  const hasDiscoveryFiles = discoveryPaths.has('web/llms.txt') && discoveryPaths.has('web/sitemap.xml');
  if (!hasDiscoveryFiles && (discoveryPaths.has('web/llms.txt') || discoveryPaths.has('web/sitemap.xml'))) {
    throw new Error('public discovery package is incomplete');
  }
  const localLlms = hasDiscoveryFiles ? await readFile(join(root, 'web/llms.txt')) : null;
  const localSitemap = hasDiscoveryFiles ? await readFile(join(root, 'web/sitemap.xml')) : null;
  const siteResults = [];
  const redirects = [];
  const query = '?scene=sky&history=1&place=%E4%B8%8A%E6%B5%B7';
  for (const host of ['aitoshuu.me', 'tongye.me']) {
    const canonicalUrl = `https://${host}/LuBirth/`;
    const onCurrentHost = bytes => Buffer.from(bytes.toString().replaceAll('https://aitoshuu.me/LuBirth/', canonicalUrl));
    const html = await request('/LuBirth/', {}, host);
    if (html.response.status !== 200 || sha(html.bytes) !== sha(onCurrentHost(localHtml)) || !html.bytes.toString().includes(manifest.assetsBase)
        || !html.bytes.toString().includes(`<link rel="canonical" href="${canonicalUrl}"`)) throw new Error(`${host}: public HTML differs from the release`);
    if (!html.response.headers.get('cache-control')?.includes('no-cache')) throw new Error(`${host}: public HTML cache policy is invalid`);
    const health = await request('/LuBirth/release-health.json', {}, host);
    if (health.response.status !== 200 || sha(health.bytes) !== sha(localHealth) || JSON.parse(health.bytes).releaseId !== manifest.releaseId) throw new Error(`${host}: public release marker differs from the release`);
    if (html.response.headers.get('x-project-origin') !== 'tencent-shanghai'
        || health.response.headers.get('x-project-origin') !== 'tencent-shanghai') throw new Error(`${host}: public response is not marked as the Tencent origin`);
    if (health.response.headers.get('cache-control') !== 'no-store') throw new Error(`${host}: release marker cache policy is invalid`);
    if (hasDiscoveryFiles) {
      const llms = await request('/LuBirth/llms.txt', {}, host);
      if (llms.response.status !== 200 || sha(llms.bytes) !== sha(localLlms) || !llms.bytes.includes(Buffer.from(canonicalUrl))) throw new Error(`${host}: public discovery summary differs from the release`);
      if (!llms.response.headers.get('cache-control')?.includes('no-cache')) throw new Error(`${host}: discovery summary cache policy is invalid`);
      const sitemap = await request('/LuBirth/sitemap.xml', {}, host);
      if (sitemap.response.status !== 200 || sha(sitemap.bytes) !== sha(onCurrentHost(localSitemap)) || !sitemap.bytes.includes(Buffer.from(`<loc>${canonicalUrl}</loc>`))) throw new Error(`${host}: public sitemap differs from the release`);
      if (!sitemap.response.headers.get('cache-control')?.includes('no-cache')) throw new Error(`${host}: sitemap cache policy is invalid`);
    }
    for (const [path, suffix] of [
      ['/LuBirth', ''], ['/lubirth', ''], ['/lubirth/', ''], ['/LUBIRTH/', ''],
      ['/lUbIrTh', ''], ['/lubirth/' + query, query], ['/lubirth/release-health.json', 'release-health.json'],
      ['/lUbIrTh/release-health.json' + query, 'release-health.json' + query],
    ]) {
      const result = await request(path, {}, host);
      const location = result.response.headers.get('location');
      if (result.response.status !== 308 || !location || new URL(location, `https://${host}`).href !== canonicalUrl + suffix) throw new Error(`invalid LuBirth redirect: ${host}${path}`);
      redirects.push({ host, path, status: 308, location: result.response.headers.get('location') });
    }
    const missing = await request('/LuBirth/assets/does-not-exist.js', {}, host);
    if (missing.response.status !== 404) throw new Error(`${host}: missing asset does not return 404`);
    const home = await request('/', { redirect: 'follow' }, host);
    if (home.response.status !== 200 || new URL(home.response.url).hostname !== host || home.bytes.includes(Buffer.from(manifest.releaseId))) throw new Error(`${host}: site home was replaced by LuBirth`);
    siteResults.push({ url: canonicalUrl, htmlSha256: sha(html.bytes), healthSha256: sha(health.bytes), origin: 'tencent-shanghai', missingAsset: 404, homePreserved: true });
  }
  console.log(JSON.stringify({ sites: siteResults, releaseId: manifest.releaseId, discovery: hasDiscoveryFiles ? ['llms.txt', 'sitemap.xml'] : [], redirects, tls: 'trusted' }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
