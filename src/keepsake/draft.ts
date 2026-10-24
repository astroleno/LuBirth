import { readObservation, timeBasisLabel, type Observation } from '../history/observation';
import type { MoonPlacement } from '../history/journeyStore';
import { defaultTemplate, type TemplateId } from './templates';

export type KeepsakeDraft = Readonly<{
  id: string;
  observation: Observation;
  sceneImage: string;
  sourceWidth: number;
  sourceHeight: number;
  moonPlacement: MoonPlacement;
  templateId: TemplateId;
  layoutVersion: 'birth-card-v1';
}>;
export type CardOptions = {
  templateId: TemplateId;
  showClock: boolean;
  showPlace: boolean;
  signature: string;
  textScale: number;
  textPosition: number;
};

function freeze<T extends object>(object: T): T {
  Object.values(object).forEach(value => { if (value && typeof value === 'object') freeze(value); });
  return Object.freeze(object);
}
export function pngDimensions(image: string) {
  if (!image.startsWith('data:image/png;base64,')) throw new Error('截图格式不受支持，请重新截图。');
  const header = atob(image.slice(image.indexOf(',') + 1, image.indexOf(',') + 45));
  const bytes = Uint8Array.from(header, character => character.charCodeAt(0));
  if (bytes.length < 24 || bytes[0] !== 137 || String.fromCharCode(...bytes.slice(1, 4)) !== 'PNG')
    throw new Error('截图未能读取，请重新截图。');
  const view = new DataView(bytes.buffer);
  const width = view.getUint32(16), height = view.getUint32(20);
  if (!width || !height || width > 16384 || height > 16384) throw new Error('截图尺寸无效，请重新截图。');
  return { width, height };
}
export function captureKeepsakeDraft(input: {
  image: string; observation: Observation; moonPlacement: MoonPlacement; renderedFrameKey: string | null;
  renderedObservation: { utc: string; observer: { latitude: number; longitude: number }; placement: MoonPlacement; earthReady: boolean } | null;
}): KeepsakeDraft {
  const observation = readObservation(input.observation);
  const rendered = input.renderedObservation;
  if (!observation || !input.renderedFrameKey?.startsWith(observation.utc + '/') || !rendered?.earthReady
    || rendered.utc !== observation.utc || rendered.observer.latitude !== observation.observer.latitude
    || rendered.observer.longitude !== observation.observer.longitude || rendered.placement !== input.moonPlacement)
    throw new Error('画面正在同步，稍后重新截图即可制作纪念卡。');
  if (!['portrait', 'physical'].includes(input.moonPlacement)) throw new Error('月球展示方式无效，请重新截图。');
  const size = pngDimensions(input.image);
  return freeze({ id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `card-${Date.now()}-${Math.random().toString(36).slice(2)}`, observation, sceneImage: input.image,
    sourceWidth: size.width, sourceHeight: size.height, moonPlacement: input.moonPlacement,
    templateId: defaultTemplate(observation.source.kind === 'history'), layoutVersion: 'birth-card-v1' as const });
}
export function initialCardOptions(draft: KeepsakeDraft): CardOptions {
  return { templateId: draft.templateId, showClock: false, showPlace: false, signature: '', textScale: 1, textPosition: .5 };
}
export function cardContext(draft: KeepsakeDraft, options: CardOptions) {
  const { observation, moonPlacement } = draft;
  const history = observation.source.kind === 'history';
  const heading = history ? observation.source.label + ' · 历史演示'
    : observation.source.kind === 'example' ? '此时的地月 · 示例' : '你的出生天空';
  const details = [observation.civilDate];
  if (options.showClock) details.push(observation.clock + ' · ' + timeBasisLabel(observation.timeBasis));
  if (options.showPlace) details.push(observation.observer.name
    + (observation.observer.precision === 'representative' ? ' · 地区代表点' : ''));
  const notes = [moonPlacement === 'portrait' ? '月球 · 合影位置' : '月球 · 物理位置'];
  if (history) {
    notes.push(observation.timeSelection.origin === 'event-default-20'
      ? '默认当地 20:00 演示，并非事件发生钟点。' : '所选当地时刻演示，并非史料认定钟点。');
    notes.push(timeBasisLabel(observation.timeBasis));
    if (observation.assumptions.some(item => item.includes('前推格里高利历'))) notes.push('日期按前推格里高利历作条件性解释。');
  } else if (observation.source.kind === 'example') notes.push('当前示例，不代表真实出生时刻。');
  return { heading, details, notes, signature: Array.from(options.signature.trim()).slice(0, 32).join('') };
}
