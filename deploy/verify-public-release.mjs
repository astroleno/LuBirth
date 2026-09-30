#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
async function request(path, options = {}) {
  const response = await fetch(`https://aitoshuu.me${path}`, { redirect: 'manual', signal: AbortSignal.timeout(15000), ...options });
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
}

async function main() {
  if (!process.argv[2]) throw new Error('usage: verify-public-release.mjs <package directory>');
  const root = resolve(process.argv[2]);
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) throw new Error('invalid release manifest');
  const html = await request('/lubirth/');
  const localHtml = await readFile(join(root, 'web/index.html'));
  if (html.response.status !== 200 || sha(html.bytes) !== sha(localHtml) || !html.bytes.toString().includes(manifest.assetsBase)) throw new Error('public HTML differs from the release');
  if (!html.response.headers.get('cache-control')?.includes('no-cache')) throw new Error('public HTML cache policy is invalid');
  const health = await request('/lubirth/release-health.json');
  const localHealth = await readFile(join(root, 'web/release-health.json'));
  if (health.response.status !== 200 || sha(health.bytes) !== sha(localHealth) || JSON.parse(health.bytes).releaseId !== manifest.releaseId) throw new Error('public release marker differs from the release');
  if (health.response.headers.get('cache-control') !== 'no-store') throw new Error('release marker cache policy is invalid');
  const canonical = await request('/lubirth');
  if (canonical.response.status !== 308 || new URL(canonical.response.headers.get('location')).pathname !== '/lubirth/') throw new Error('canonical route is invalid');
  const missing = await request('/lubirth/assets/does-not-exist.js');
  if (missing.response.status !== 404) throw new Error('missing asset does not return 404');
  const home = await request('/');
  if (home.response.status !== 200 || home.bytes.includes(Buffer.from(manifest.releaseId))) throw new Error('site home was replaced by LuBirth');
  console.log(JSON.stringify({ url: 'https://aitoshuu.me/lubirth/', releaseId: manifest.releaseId, htmlSha256: sha(html.bytes), healthSha256: sha(health.bytes), canonical: 308, missingAsset: 404, homePreserved: true, tls: 'trusted' }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
