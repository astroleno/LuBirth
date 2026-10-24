import manifest from './data/templates.json';
import { assetUrl } from '../utils/assetUrl';

export type TemplateId = 'first-meeting' | 'earth-and-you' | 'same-moon';
export type InkoMetadataChunk = { type: 'iTXt' | 'tEXt'; data: string };
export type HandwritingAsset = {
  id: TemplateId;
  text: string;
  width: number;
  height: number;
  inkRect: [number, number, number, number];
  card: string;
  loading: string;
  png: string;
  sourceJob: string;
  label: { path: string; width: number; height: number; textHeight: number };
  metadata: InkoMetadataChunk[];
};
export const KEEPSAKE_TEMPLATES: ReadonlyArray<{ id: TemplateId; text: string; description: string }> = [
  { id: 'first-meeting', text: '天地初见', description: '留住初次相逢' },
  { id: 'earth-and-you', text: '天地与你', description: '写给此刻的你' },
  { id: 'same-moon', text: '与古人同望', description: '走进另一段时光' },
];
const assets = new Map((manifest.templates as HandwritingAsset[]).map(asset => [asset.id, asset]));
export function handwritingAsset(id: TemplateId) { return assets.get(id); }
export function templateUrl(path: string) { return assetUrl('keepsake/templates/v1/' + path); }
export function defaultTemplate(history: boolean): TemplateId { return history ? 'same-moon' : 'first-meeting'; }
export function selectLoadingTemplate(value = Math.random()): TemplateId {
  const index = Math.min(KEEPSAKE_TEMPLATES.length - 1, Math.max(0, Math.floor((Number.isFinite(value) ? value : 0) * KEEPSAKE_TEMPLATES.length)));
  return KEEPSAKE_TEMPLATES[index].id;
}
