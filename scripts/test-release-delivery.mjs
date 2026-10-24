import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const temporary = await mkdtemp(join(tmpdir(), 'lubirth-release-delivery-'));
const releaseId = 'lubirth-0123456789abcdef';
const objectPrefix = `releases/aitoshuu-me/${releaseId}/`;
const content = Buffer.from('LuBirth release scope fixture');
const original = {
  schemaVersion: 1, site: 'LuBirth', releaseId, objectPrefix,
  assetsBase: `https://assets.aitoshuu.me/${objectPrefix}`,
  mediaBase: `https://media.aitoshuu.me/${objectPrefix}`,
  entries: [{ channel: 'assets', packagePath: 'assets/probe.txt', objectKey: objectPrefix + 'probe.txt',
    bytes: content.length, sha256: createHash('sha256').update(content).digest('hex'),
    mime: 'text/plain', cacheControl: 'public, max-age=31536000, immutable' }],
};
let checks = 0;
const run = (command, args) => spawnSync(command, args, { encoding: 'utf8', timeout: 10000 });
const manifestPath = join(temporary, 'manifests/release-manifest.json');
async function check(name, mutate, accepted) {
  const manifest = structuredClone(original);
  mutate(manifest);
  await writeFile(manifestPath, JSON.stringify(manifest));
  const result = run('python3', ['deploy/upload-cos-release.py', temporary]);
  assert.equal(result.status === 0, accepted, `${name}: ${result.stdout} ${result.stderr}`);
  if (accepted) assert.equal(JSON.parse(result.stdout).mode, 'offline-plan');
  checks++; console.log('PASS ' + name);
}
try {
  await mkdir(join(temporary, 'assets'));
  await mkdir(join(temporary, 'manifests'));
  await writeFile(join(temporary, 'assets/probe.txt'), content);
  await check('default CDN accepts a hash-matched immutable package', () => {}, true);
  await check('existing media CDN accepts the same scoped asset objects', manifest => {
    manifest.assetsBase = manifest.mediaBase;
  }, true);
  for (const host of ['unrelated.example', 'media.aitoshuu.me.evil.example', 'media.aitoshuu.me@evil.example']) {
    await check('unapproved asset host is rejected: ' + host, manifest => {
      manifest.assetsBase = `https://${host}/${objectPrefix}`;
    }, false);
  }
  await check('asset base cannot name a different release', manifest => {
    manifest.assetsBase = 'https://media.aitoshuu.me/releases/aitoshuu-me/lubirth-ffffffffffffffff/';
  }, false);
  await check('object key cannot escape its immutable release', manifest => {
    manifest.entries[0].objectKey = objectPrefix + '../probe.txt';
  }, false);
  await check('unapproved media base is rejected', manifest => {
    manifest.mediaBase = `https://unrelated.example/${objectPrefix}`;
  }, false);
  await check('modified package bytes are rejected', manifest => {
    manifest.entries[0].sha256 = '0'.repeat(64);
  }, false);
  const invalid = structuredClone(original);
  invalid.assetsBase = `https://unrelated.example/${objectPrefix}`;
  await writeFile(manifestPath, JSON.stringify(invalid));
  const cdn = run(process.execPath, ['deploy/verify-cdn-release.mjs', temporary]);
  assert.notEqual(cdn.status, 0);
  assert.match(cdn.stderr, /CDN base outside approved release scope/);
  checks++; console.log('PASS CDN verification rejects an unapproved base before requesting it');
  const output = join(temporary, 'invalid-output');
  const pack = run(process.execPath, ['deploy/package-release.mjs', '--output', output, '--assets-host', 'unrelated.example']);
  assert.notEqual(pack.status, 0);
  assert.match(pack.stderr, /outside the approved CDN hosts/);
  await assert.rejects(access(output));
  checks++; console.log('PASS packaging rejects an unapproved host before building');
  console.log(JSON.stringify({ checks, passed: checks }));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
