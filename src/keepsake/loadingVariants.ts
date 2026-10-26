import manifest from './data/loading-variants.json';
import type { TemplateId } from './templates';

export type LoadingVariant = Readonly<{
  id: string; styleId: string; templateId: TemplateId; text: string;
  width: number; height: number; characters: number; durationMs: number;
  glyph: string; index: string;
}>;
export type LoadingBag = { remaining: string[]; last: string | null };
export const LOADING_VARIANTS = manifest.variants as LoadingVariant[];
export const LOADING_BAG_KEY = 'lubirth.loading-variants.v1';
const byId = new Map(LOADING_VARIANTS.map(variant => [variant.id, variant]));
const unit = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1 - Number.EPSILON, value)) : 0;

/** Every combination occurs once per bag; prefer a fresh style and phrase next. */
export function takeLoadingVariant(value: unknown, random = Math.random): { variant: LoadingVariant; bag: LoadingBag } {
  const input = value as Partial<LoadingBag> | null;
  const valid = input && Array.isArray(input.remaining) && input.remaining.length <= LOADING_VARIANTS.length
    && input.remaining.every(id => typeof id === 'string' && byId.has(id))
    && new Set(input.remaining).size === input.remaining.length
    && (input.last === null || typeof input.last === 'string' && byId.has(input.last));
  const remaining = valid ? [...input.remaining!] : [];
  const previous = valid && input.last ? byId.get(input.last) : undefined;
  if (!remaining.length) {
    remaining.push(...byId.keys());
    for (let index = remaining.length - 1; index > 0; index--) {
      const other = Math.floor(unit(random()) * (index + 1));
      [remaining[index], remaining[other]] = [remaining[other], remaining[index]];
    }
  }
  let next = previous ? remaining.findIndex(id => {
    const variant = byId.get(id)!;
    return variant.styleId !== previous.styleId && variant.templateId !== previous.templateId;
  }) : 0;
  if (next < 0 && previous) next = remaining.findIndex(id => byId.get(id)!.styleId !== previous.styleId);
  if (next < 0 && previous) next = remaining.findIndex(id => id !== previous.id);
  const id = remaining.splice(Math.max(0, next), 1)[0];
  return { variant: byId.get(id)!, bag: { remaining, last: id } };
}

export function chooseLoadingVariant(storage?: Pick<Storage, 'getItem' | 'setItem'>, random = Math.random) {
  let saved: unknown;
  try {
    storage ??= window.localStorage;
    const raw = storage.getItem(LOADING_BAG_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch { /* Private browsing or damaged preferences must not block the scene. */ }
  const selection = takeLoadingVariant(saved, random);
  try { storage?.setItem(LOADING_BAG_KEY, JSON.stringify(selection.bag)); } catch {}
  return { variant: selection.variant, seed: Math.floor(unit(random()) * 65536) };
}
