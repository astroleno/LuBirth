#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

// Some CDN connections fail in Node's transport while the system HTTPS client succeeds.
// --system-http selects that transport directly. All verification rules stay below.
const systemHTTP = process.argv.includes('--system-http');
async function requestCDN(url, options) {
  if (url.protocol !== 'https:' || !['assets.aitoshuu.me', 'media.aitoshuu.me'].includes(url.hostname)
      || !/^\/releases\/aitoshuu-me\/lubirth-[0-9a-f]{16}\//.test(url.pathname)) {
    throw new Error('CDN URL outside approved release scope');
  }
  if (!systemHTTP) {
    try {
      const response = await fetch(url, options);
      const bytes = Buffer.from(await response.arrayBuffer());
      return { status: response.status, headers: response.headers, arrayBuffer: async () => bytes };
    } catch { /* Retry transport failures with the system HTTPS client. */ }
  }
    const temporary = await mkdtemp(join(tmpdir(), 'lubirth-cdn-check-'));
    try {
      const headersFile = join(temporary, 'headers');
      const bodyFile = join(temporary, 'body');
      // Cold CDN audio downloads can exceed 20 seconds; keep full-hash checks with a bounded retry budget.
      const args = ['--silent', '--show-error', '--proto', '=https', '--connect-timeout', '10', '--max-time', '60',
        '--retry', '2', '--retry-delay', '1', '--retry-max-time', '180',
        '--dump-header', headersFile, '--output', bodyFile, '--write-out', '%{http_code}'];
      for (const [name, value] of Object.entries(options.headers ?? {})) args.push('--header', `${name}: ${value}`);
      args.push(url.href);
      const result = spawnSync('curl', args, { encoding: 'utf8', timeout: 185000, maxBuffer: 1024 * 1024 });
      if (result.status !== 0) throw new Error(`system HTTPS transport failed (exit ${result.status})`);
      const blocks = (await readFile(headersFile, 'utf8')).trim().split(/\r?\n\r?\n/);
      const finalHeaders = blocks.filter(block => block.startsWith('HTTP/')).at(-1);
      if (!finalHeaders) throw new Error('missing fallback response headers');
      const headers = new Headers();
      for (const line of finalHeaders.split(/\r?\n/).slice(1)) {
        const colon = line.indexOf(':');
        if (colon > 0) headers.append(line.slice(0, colon), line.slice(colon + 1).trim());
      }
      const bytes = await readFile(bodyFile);
      if (!systemHTTP) console.warn(`[CDN] system HTTPS fallback used: ${url.pathname}`);
      return { status: Number(result.stdout.trim()), headers, arrayBuffer: async () => bytes };
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
}

async function main() {
  const root = resolve(process.argv[2] || '');
  if (!process.argv[2]) throw new Error('usage: verify-cdn-release.mjs <package directory> [--system-http]');
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) throw new Error('invalid release manifest');
  const entries = manifest.entries.filter(entry => ['assets', 'media'].includes(entry.channel));
  const problems = [];
  let timingAllowed = 0;
  for (const entry of entries) {
    const host = entry.channel === 'media' ? 'media.aitoshuu.me' : 'assets.aitoshuu.me';
    const url = new URL(`https://${host}/${entry.objectKey}`);
    try {
      const response = await requestCDN(url, { headers: { Origin: 'https://aitoshuu.me' }, signal: AbortSignal.timeout(30000) });
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error('content hash mismatch');
      const cache = response.headers.get('cache-control') || '';
      if (!cache.includes('immutable') || !cache.includes('max-age=31536000')) throw new Error(`invalid cache-control: ${cache}`);
      const cors = response.headers.get('access-control-allow-origin');
      if (cors !== '*' && cors !== 'https://aitoshuu.me') throw new Error(`invalid CORS: ${cors}`);
      const timing = response.headers.get('timing-allow-origin');
      if (timing === '*' || timing?.split(',').map(value => value.trim()).includes('https://aitoshuu.me')) timingAllowed++;
      else if (process.argv.includes('--require-timing')) throw new Error('missing Timing-Allow-Origin');
    } catch (error) {
      problems.push(`${entry.objectKey}: ${error.message}`);
    }
  }
  const media = entries.find(entry => entry.channel === 'media' && /\.(?:mp3|mp4|webm|wav)$/.test(entry.objectKey));
  if (media) {
    const url = new URL(`https://media.aitoshuu.me/${media.objectKey}`);
    try {
      const response = await requestCDN(url, { headers: { Origin: 'https://aitoshuu.me', Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(15000) });
      if (response.status !== 206 || !response.headers.get('content-range')?.startsWith('bytes 0-1023/')) throw new Error(`invalid Range response: HTTP ${response.status}`);
    } catch (error) {
      problems.push(`${media.objectKey}: ${error.message}`);
    }
  }
  if (problems.length) throw new Error(problems.join('\n'));
  console.log(JSON.stringify({ releaseId: manifest.releaseId, checked: entries.length, bytes: entries.reduce((sum, entry) => sum + entry.bytes, 0), range: Boolean(media), cors: 'passed', cache: 'passed', timingAllowed }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
