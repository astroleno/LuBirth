import { cardContext, type CardOptions, type KeepsakeDraft } from './draft';
import { layoutBirthCard, layoutInkoLabel } from './layout';
import { handwritingAsset, templateUrl } from './templates';
import { writeInkoPngMetadata } from './png-metadata';

function abortError() { return new DOMException('已取消', 'AbortError'); }
export function loadCardImage(url: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(abortError()); return; }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    const cleanup = () => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort);
      image.onload = null; image.onerror = null;
    };
    const abort = () => { cleanup(); image.src = ''; reject(abortError()); };
    const timer = setTimeout(() => { cleanup(); image.src = ''; reject(new Error('图片读取较慢，请稍后重试。')); }, 15000);
    image.onload = () => { cleanup(); resolve(image); };
    image.onerror = () => { cleanup(); reject(new Error('图片未能读取，请检查连接后重试。')); };
    signal?.addEventListener('abort', abort, { once: true }); image.src = url;
  });
}
export function wrapCardText(context: Pick<CanvasRenderingContext2D, 'measureText'>, text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const character of Array.from(text)) {
    if (character === '\n' || (line && context.measureText(line + character).width > width)) {
      lines.push(line); line = character === '\n' ? '' : character;
    } else line += character;
  }
  if (line) lines.push(line);
  return lines;
}
export async function composeBirthCard(draft: KeepsakeDraft, options: CardOptions, signal?: AbortSignal): Promise<Blob> {
  const asset = handwritingAsset(options.templateId);
  if (!asset) throw new Error('手写模板尚未准备好，原始截图仍可保存。');
  signal?.throwIfAborted();
  const [scene, handwriting, label] = await Promise.all([
    loadCardImage(draft.sceneImage, signal), loadCardImage(templateUrl(asset.card), signal),
    loadCardImage(templateUrl(asset.label.path), signal),
  ]);
  signal?.throwIfAborted();
  const canvas = document.createElement('canvas');
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('当前浏览器暂时不能合成图片。');
    const information = cardContext(draft, options);
    const base = layoutBirthCard(draft.sourceWidth, draft.sourceHeight, 0);
    const font = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
    context.font = `${28 * base.unit}px ${font}`;
    const headings = wrapCardText(context, information.heading, base.contentWidth);
    context.font = `${27 * base.unit}px ${font}`;
    const details = information.details.flatMap(line => wrapCardText(context, line, base.contentWidth));
    context.font = `${23 * base.unit}px ${font}`;
    const notes = information.notes.flatMap(line => wrapCardText(context, line, base.contentWidth));
    const signature = information.signature ? wrapCardText(context, '— ' + information.signature, base.contentWidth) : [];
    const layout = layoutBirthCard(draft.sourceWidth, draft.sourceHeight, headings.length + details.length + notes.length + signature.length);
    canvas.width = layout.width; canvas.height = layout.height;
    context.fillStyle = '#f4efe5'; context.fillRect(0, 0, layout.width, layout.height);
    context.drawImage(scene, 0, 0, layout.width, layout.imageHeight);
    const { unit, padding, contentWidth } = layout;
    let y = layout.footerY + 48 * unit;
    context.textBaseline = 'top'; context.fillStyle = '#5a615f'; context.font = `${28 * unit}px ${font}`;
    for (const line of headings) { context.fillText(line, padding, y); y += 38 * unit; }
    y += 16 * unit;
    const scale = Number.isFinite(options.textScale) ? Math.min(1.2, Math.max(.8, options.textScale)) : 1;
    const position = Number.isFinite(options.textPosition) ? Math.min(1, Math.max(0, options.textPosition)) : .5;
    const [inkX, inkY, inkWidth, inkHeight] = asset.inkRect;
    const ratio = Math.min(contentWidth * .94 * scale / inkWidth, 110 * unit * scale / inkHeight);
    const wordWidth = inkWidth * ratio, wordHeight = inkHeight * ratio;
    // Recompose the original mark at the full card's required size, separately
    // from the adjustable handwriting, as in Inko's official composition tools.
    context.drawImage(handwriting, inkX, inkY, inkWidth, inkHeight,
      padding + (contentWidth - wordWidth) * position, y, wordWidth, wordHeight);
    y += Math.max(110 * unit, wordHeight) + 28 * unit;
    context.fillStyle = '#293c42'; context.font = `${27 * unit}px ${font}`;
    for (const line of details) { context.fillText(line, padding, y); y += 38 * unit; }
    context.font = `${23 * unit}px ${font}`;
    for (const line of signature) { context.fillText(line, padding, y); y += 33 * unit; }
    y += 14 * unit; context.fillStyle = '#67706c';
    for (const line of notes) { context.fillText(line, padding, y); y += 33 * unit; }
    const mark = layoutInkoLabel(layout.width, layout.height, asset.label);
    if (y > mark.y - 22 * unit) throw new Error('卡片文字超出留白，请减少署名或显示项目。');
    context.drawImage(label, mark.x, mark.y, mark.width, mark.height);
    signal?.throwIfAborted();
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value)
      : reject(new Error('图片未能保存，请重试。')), 'image/png'));
    signal?.throwIfAborted();
    return await writeInkoPngMetadata(blob, asset.metadata);
  } finally { canvas.width = 1; canvas.height = 1; }
}
