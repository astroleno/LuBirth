import type { InkoMetadataChunk } from './templates';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const table = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
export function crc32(bytes: Uint8Array) {
  let value = 0xffffffff;
  for (const byte of bytes) value = table[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}
type PngChunk = { type: string; data: Uint8Array };
export function readPngChunks(bytes: Uint8Array): PngChunk[] {
  if (!signature.every((byte, index) => bytes[index] === byte)) throw new Error('PNG 文件头无效。');
  const chunks: PngChunk[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('PNG 文件不完整。');
    const length = view.getUint32(offset);
    if (length > bytes.length - offset - 12) throw new Error('PNG 数据长度无效。');
    const type = decoder.decode(bytes.subarray(offset + 4, offset + 8));
    const data = bytes.slice(offset + 8, offset + 8 + length);
    if (view.getUint32(offset + 8 + length) !== crc32(bytes.subarray(offset + 4, offset + 8 + length)))
      throw new Error('PNG 校验失败。');
    chunks.push({ type, data }); offset += length + 12;
    if (type === 'IEND') {
      if (offset !== bytes.length) throw new Error('PNG 末尾数据无效。');
      return chunks;
    }
  }
  throw new Error('PNG 缺少结束标记。');
}
function serializeChunk(chunk: PngChunk) {
  const bytes = new Uint8Array(chunk.data.length + 12), view = new DataView(bytes.buffer);
  view.setUint32(0, chunk.data.length); bytes.set(encoder.encode(chunk.type), 4); bytes.set(chunk.data, 8);
  view.setUint32(bytes.length - 4, crc32(bytes.subarray(4, bytes.length - 4)));
  return bytes;
}
function keyword(chunk: PngChunk) {
  return decoder.decode(chunk.data.subarray(0, chunk.data.indexOf(0)));
}
export function inkoMetadataFromPng(bytes: Uint8Array) {
  return readPngChunks(bytes).filter(chunk => ['iTXt', 'tEXt'].includes(chunk.type)
    && ['AIGC', 'XML:com.adobe.xmp', 'InkoEdited'].includes(keyword(chunk)));
}
export async function writeInkoPngMetadata(blob: Blob, source: InkoMetadataChunk[]): Promise<Blob> {
  const original = readPngChunks(new Uint8Array(await blob.arrayBuffer()));
  const metadata: PngChunk[] = source.map(chunk => ({ type: chunk.type,
    data: Uint8Array.from(atob(chunk.data), character => character.charCodeAt(0)) }));
  if (metadata.some(chunk => !['iTXt', 'tEXt'].includes(chunk.type)
    || !['AIGC', 'XML:com.adobe.xmp', 'InkoEdited'].includes(keyword(chunk)))
    || !metadata.some(chunk => keyword(chunk) === 'AIGC')
    || !metadata.some(chunk => keyword(chunk) === 'XML:com.adobe.xmp'))
    throw new Error('模板的生成标识不完整，暂时不能导出。');
  const chunks = original.filter(chunk => chunk.type !== 'IEND'
    && !(['iTXt', 'tEXt'].includes(chunk.type) && ['AIGC', 'XML:com.adobe.xmp', 'InkoEdited'].includes(keyword(chunk))));
  const output = [signature, ...chunks.map(serializeChunk),
    ...metadata.filter(chunk => keyword(chunk) !== 'InkoEdited').map(serializeChunk),
    serializeChunk({ type: 'tEXt', data: encoder.encode('InkoEdited\0true') }),
    serializeChunk({ type: 'IEND', data: new Uint8Array() })];
  const result = new Blob(output, { type: 'image/png' });
  const readback = inkoMetadataFromPng(new Uint8Array(await result.arrayBuffer()));
  for (const chunk of metadata.filter(chunk => keyword(chunk) !== 'InkoEdited')) {
    const actual = readback.find(value => value.type === chunk.type && keyword(value) === keyword(chunk));
    if (!actual || actual.data.length !== chunk.data.length || actual.data.some((value, index) => value !== chunk.data[index]))
      throw new Error('生成标识回读未通过，请重新保存。');
  }
  return result;
}
