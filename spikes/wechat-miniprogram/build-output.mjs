import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const DEVICE_PACKAGE_LIMIT_BYTES = 2 * 1024 * 1024;

export function sumPackageBytes(files) {
  return files.reduce((total, file) => total + file.size, 0);
}

export function listPackageFiles(root) {
  const files = [];
  const visit = (directory) => {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name);
      const stats = statSync(path);
      if (stats.isDirectory()) visit(path);
      else files.push({ path, size: stats.size });
    }
  };
  visit(root);
  return files;
}

export function assertDevicePackageSize(bytes, limitBytes = DEVICE_PACKAGE_LIMIT_BYTES) {
  if (bytes > limitBytes) {
    throw new Error(`device package is ${bytes} bytes, above the 2 MiB main-package gate (${limitBytes} bytes)`);
  }
  return { status: 'pass', bytes, limitBytes };
}
