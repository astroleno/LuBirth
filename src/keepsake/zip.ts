import { crc32 } from './png-metadata';

/** A small stored ZIP: PNG entries already carry their own compression. */
export async function createCardZip(files: { name: string; blob: Blob }[], signal?: AbortSignal) {
  const local: ArrayBuffer[] = [], central: ArrayBuffer[] = [];
  let offset = 0;
  for (const file of files) {
    signal?.throwIfAborted();
    const name = new TextEncoder().encode(file.name);
    const bytes = new Uint8Array(await file.blob.arrayBuffer()), checksum = crc32(bytes);
    if (!name.length || name.length > 65535 || bytes.length > 0xffffffff) throw new Error('文件过大，不能打包。');
    const header = new Uint8Array(30 + name.length), view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true); view.setUint16(12, 33, true);
    view.setUint32(14, checksum, true); view.setUint32(18, bytes.length, true); view.setUint32(22, bytes.length, true);
    view.setUint16(26, name.length, true); header.set(name, 30);
    const entry = new Uint8Array(46 + name.length), directory = new DataView(entry.buffer);
    directory.setUint32(0, 0x02014b50, true); directory.setUint16(4, 20, true); directory.setUint16(6, 20, true);
    directory.setUint16(14, 33, true);
    directory.setUint16(8, 0x800, true); directory.setUint32(16, checksum, true);
    directory.setUint32(20, bytes.length, true); directory.setUint32(24, bytes.length, true);
    directory.setUint16(28, name.length, true); directory.setUint32(42, offset, true); entry.set(name, 46);
    local.push(header.buffer as ArrayBuffer, bytes.buffer as ArrayBuffer); central.push(entry.buffer as ArrayBuffer); offset += header.length + bytes.length;
  }
  signal?.throwIfAborted();
  const centralLength = central.reduce((sum, bytes) => sum + bytes.byteLength, 0);
  const end = new Uint8Array(22), view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true); view.setUint16(8, files.length, true); view.setUint16(10, files.length, true);
  view.setUint32(12, centralLength, true); view.setUint32(16, offset, true);
  return new Blob([...local, ...central, end.buffer], { type: 'application/zip' });
}
