#!/usr/bin/env node
/** Constrained LuBirth origin staging and symlink cutover over existing SSH access. */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const HOST = '47.103.120.24';
const USER = 'codex_audit';
const HOST_FINGERPRINT = 'SHA256:u8+4eQijiilG5YF1F80YnTJjSrmTkVejVpHDPoGl2q0';
const RELEASE_ROOT = '/www/wwwroot/lubirth-releases';
const CURRENT_LINK = '/www/wwwroot/lubirth-current';
const sha = data => createHash('sha256').update(data).digest('hex');
const fail = message => { throw new Error(message); };

function run(command, args, input) {
  const result = spawnSync(command, args, { input, encoding: 'utf8', timeout: 15000 });
  return { status: result.status, stdout: result.stdout ?? '' };
}

async function checkedPackage(root) {
  const manifest = JSON.parse(await readFile(join(root, 'manifests/release-manifest.json'), 'utf8'));
  if (manifest.site !== 'LuBirth' || !/^lubirth-[0-9a-f]{16}$/.test(manifest.releaseId)) fail('invalid LuBirth release');
  const files = manifest.entries.filter(entry => entry.channel === 'origin');
  if (files.length !== 2 || files.some(entry => !['web/index.html', 'web/release-health.json'].includes(entry.packagePath))) fail('invalid origin package');
  for (const entry of files) {
    const bytes = await readFile(join(root, entry.packagePath));
    if (bytes.length !== entry.bytes || sha(bytes) !== entry.sha256) fail('origin package hash mismatch');
  }
  return { manifest, files };
}

async function main() {
  const [mode, packageFlag, packageDir] = process.argv.slice(2);
  if (!['--probe', '--stage', '--switch'].includes(mode) || packageFlag !== '--package' || !packageDir) {
    fail('usage: apply-origin-release.mjs --probe|--stage|--switch --package <release directory>');
  }
  const root = resolve(packageDir);
  const { manifest, files } = await checkedPackage(root);
  const destination = `${RELEASE_ROOT}/${manifest.releaseId}/web`;
  const scan = run('ssh-keyscan', ['-T', '5', '-t', 'ed25519', HOST]);
  if (scan.status !== 0 || !scan.stdout.trim()) fail('origin host key is unavailable');
  const keyLine = scan.stdout.trim().split('\n').find(line => line.startsWith(`${HOST} ssh-ed25519 `));
  if (!keyLine) fail('origin ED25519 host key is unavailable');
  const fingerprint = run('ssh-keygen', ['-lf', '-', '-E', 'sha256'], `${keyLine}\n`);
  if (fingerprint.status !== 0 || !fingerprint.stdout.includes(HOST_FINGERPRINT)) fail('origin host fingerprint differs from inventory');
  const temporary = await mkdtemp(join(tmpdir(), 'lubirth-origin-host-'));
  const knownHosts = join(temporary, 'known_hosts');
  await writeFile(knownHosts, `${keyLine}\n`, { mode: 0o600 });
  const options = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=yes',
    '-o', `UserKnownHostsFile=${knownHosts}`];
  const ssh = command => run('ssh', [...options, `${USER}@${HOST}`, command]);
  const remoteHashes = () => ssh(`sudo -n sha256sum -- '${destination}/index.html' '${destination}/release-health.json'`);
  try {
    const access = ssh('true');
    if (access.status !== 0) fail('origin SSH access is unavailable');
    if (mode === '--probe') {
      const writable = ssh(`test -d '${RELEASE_ROOT}' && test -L '${CURRENT_LINK}' && test -w '${RELEASE_ROOT}' && test -w '/www/wwwroot'`);
      const sudo = ssh('sudo -n true');
      console.log(JSON.stringify({ mode: 'probe', releaseId: manifest.releaseId, hostKey: 'matched',
        ssh: 'available', stagingWritable: writable.status === 0, existingPasswordlessSudo: sudo.status === 0 }));
      return;
    }
    if (mode === '--stage') {
      if (ssh(`sudo -n mkdir -- '${RELEASE_ROOT}/${manifest.releaseId}' && sudo -n mkdir -- '${destination}'`).status !== 0) fail('origin release staging directory could not be created');
      for (const entry of files) {
        const name = entry.packagePath.slice(4);
        const bytes = await readFile(join(root, entry.packagePath));
        const copy = run('ssh', [...options, `${USER}@${HOST}`, `sudo -n tee '${destination}/${name}' >/dev/null`], bytes);
        if (copy.status !== 0) fail(`origin staging copy failed: ${name}`);
      }
      const hashes = remoteHashes();
      if (hashes.status !== 0 || files.some(entry => !hashes.stdout.includes(entry.sha256))) fail('origin staged file hash mismatch');
      console.log(JSON.stringify({ mode: 'staged', releaseId: manifest.releaseId, files: files.length, hashes: 'matched' }));
      return;
    }
    const hashes = remoteHashes();
    if (hashes.status !== 0 || files.some(entry => !hashes.stdout.includes(entry.sha256))) fail('origin release is not staged or hashes differ');
    const previous = ssh(`readlink '${CURRENT_LINK}'`);
    if (previous.status !== 0 || !previous.stdout.trim().startsWith(`${RELEASE_ROOT}/lubirth-`)) fail('active LuBirth symlink is outside its release root');
    if (ssh('sudo -n nginx -t').status !== 0) fail('origin Nginx configuration test failed');
    const next = `/www/wwwroot/lubirth-current.next-${manifest.releaseId}`;
    const switchCommand = `test -L '${CURRENT_LINK}' && test ! -L '${next}' && sudo -n ln -s '${destination}' '${next}' && sudo -n mv -Tf '${next}' '${CURRENT_LINK}' && test "$(readlink '${CURRENT_LINK}')" = '${destination}'`;
    if (ssh(switchCommand).status !== 0) fail('origin symlink switch failed');
    console.log(JSON.stringify({ mode: 'switched', releaseId: manifest.releaseId, currentLink: CURRENT_LINK, target: destination }));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
