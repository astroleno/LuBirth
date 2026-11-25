import { offsetSecondsLabel, readObservation, timeBasisLabel, type Observation } from '../history/observation';
import type { MoonPlacement } from '../history/journeyStore';
import { formatCivilDate } from '../utils/formatCivilDate';
import type { KeepsakeHistorySummary } from './historySummary';
import { defaultTemplate, type TemplateId } from './templates';

export type KeepsakeDraft = Readonly<{
  id: string;
  observation: Observation;
  sceneImage: string;
  cleanSceneImage?: string;
  historySummary?: KeepsakeHistorySummary;
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

export function matchingHistorySummary(observation: Observation, summary?: KeepsakeHistorySummary) {
  const { source, civilDate } = observation;
  return summary && source.kind === 'history' && !!source.recordHash && summary.recordId === source.recordId
    && summary.recordHash === source.recordHash && summary.civilDate === civilDate ? summary : undefined;
}

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
  image: string; cleanImage?: string; historySummary?: KeepsakeHistorySummary;
  observation: Observation; moonPlacement: MoonPlacement; renderedFrameKey: string | null;
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
  if (input.cleanImage !== undefined) {
    const cleanSize = pngDimensions(input.cleanImage);
    if (cleanSize.width !== size.width || cleanSize.height !== size.height) throw new Error('纪念卡取景尺寸已变化，请重新截图。');
  }
  const historySummary = matchingHistorySummary(observation, input.historySummary);
  return freeze({ id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `card-${Date.now()}-${Math.random().toString(36).slice(2)}`, observation, sceneImage: input.image,
    ...(input.cleanImage === undefined ? {} : { cleanSceneImage: input.cleanImage }),
    ...(historySummary ? { historySummary: { ...historySummary, time: historySummary.time && { ...historySummary.time } } } : {}),
    sourceWidth: size.width, sourceHeight: size.height, moonPlacement: input.moonPlacement,
    templateId: defaultTemplate(observation.source.kind === 'history'), layoutVersion: 'birth-card-v1' as const });
}
export function cardSceneImage(draft: KeepsakeDraft) {
  return draft.cleanSceneImage ?? draft.sceneImage;
}

const HISTORY_CLOCK_NOTES: Record<Observation['timeSelection']['origin'], string> = {
  'history-recorded-point': '按史载钟点演示。',
  'history-related-point': '按史载相关情节的钟点演示。',
  'history-window-midpoint': '取史载时段中点演示。',
  'history-window-example': '在史载时段中选点演示。',
  'event-default-20': '史料仅载日期，默认当地 20:00 演示。',
  'user-input': '按自选钟点演示。',
  'legacy-demo': '沿用此前保存的演示钟点。',
  'system-example': '按示例钟点演示。',
};

function historyClockNote(origin: Observation['timeSelection']['origin'], time: KeepsakeHistorySummary['time']) {
  if (origin === 'history-window-example' || origin === 'history-window-midpoint') {
    if (time?.dayBoundary === 'unverified') return '史载时段的日界待核，按换算日期选点演示。';
    if (time?.scope === 'related') return '在史载相关时段中选点演示。';
    if (!time) return '按史载时段演示。';
  }
  return HISTORY_CLOCK_NOTES[origin];
}
export function initialCardOptions(draft: KeepsakeDraft): CardOptions {
  return { templateId: draft.templateId, showClock: false, showPlace: false, signature: '', textScale: 1, textPosition: .5 };
}
export function cardContext(draft: KeepsakeDraft, options: CardOptions, historySummary = draft.historySummary) {
  const { observation, moonPlacement } = draft;
  const history = observation.source.kind === 'history';
  const heading = history ? observation.source.label + ' · 历史演示'
    : observation.source.kind === 'example' ? '此时的地月 · 示例' : '你的出生天空';
  const summary = matchingHistorySummary(observation, historySummary);
  const date = formatCivilDate(observation.civilDate);
  const details = summary?.originalDate ? [summary.originalDate, '换算公历 ' + date] : [date];
  if (options.showClock) details.push(observation.clock + ' · ' + (observation.timeBasis.kind === 'iana'
    ? offsetSecondsLabel(observation.timeBasis.offsetSeconds) : timeBasisLabel(observation.timeBasis)));
  if (options.showPlace) details.push(observation.observer.name
    + (observation.observer.precision === 'representative' && !observation.observer.name.endsWith('代表点') ? ' · 地区代表点' : ''));
  const notes = moonPlacement === 'portrait' ? ['月球位置已为合影调整。'] : [];
  if (history) {
    const origin = observation.timeSelection?.origin ?? 'legacy-demo';
    notes.push(historyClockNote(origin, summary?.time));
    if (origin.startsWith('history-') && summary?.time) {
      const { offsetMinutes } = summary.time;
      if (offsetMinutes === null) notes.push('原记时制待核。');
      if (offsetMinutes !== null && observation.timeBasis.kind === 'offset' && observation.timeBasis.offsetMinutes === offsetMinutes)
        notes.push('按有史料依据的时制换算。');
      else if (offsetMinutes !== null || observation.timeBasis.kind !== 'local-mean-solar') notes.push('演示采用自选时制。');
    }
    if (!options.showClock && observation.timeBasis.kind === 'local-mean-solar') notes.push('按地方平太阳时换算。');
    if (summary?.conditionalDate || observation.assumptions.some(item => item.includes('前推格里高利历')))
      notes.push('日期按前推公历作条件性解释。');
  } else if (observation.source.kind === 'example') notes.push('当前示例，不代表真实出生时刻。');
  return { heading, details, notes, signature: Array.from(options.signature.trim()).slice(0, 32).join('') };
}
