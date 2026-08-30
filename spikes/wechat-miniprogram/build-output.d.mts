export const DEVICE_PACKAGE_LIMIT_BYTES: number;

export function sumPackageBytes(files: Array<{ size: number }>): number;

export function listPackageFiles(root: string): Array<{ path: string; size: number }>;

export function assertDevicePackageSize(
  bytes: number,
  limitBytes?: number,
): { status: 'pass'; bytes: number; limitBytes: number };
