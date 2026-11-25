import { useId } from 'react';
import type { MoonPlacement } from '../history/journeyStore';
import type { DiskVisibility } from '../astro/apparentHorizon';
import { LUNAR_ECLIPSE_LABELS } from '../astro/lunarShadow';
import type { LunarShadow } from '../astro/lunarShadow';
import './MoonPlacementControl.css';

export const MOON_HORIZON_NOTES = {
  below: '月面全部在当地地平线下。', partial: '部分月面已露出当地地平线。',
} as const;

export function moonEclipseNote(eclipse: LunarShadow['kind'], visibility?: DiskVisibility) {
  return `${LUNAR_ECLIPSE_LABELS[eclipse]}进行中，地影遮挡月面的直射阳光。${visibility === 'below' ? MOON_HORIZON_NOTES.below : ''}`;
}

export function MoonPlacementControl({ value, onChange, onLocate, visibility, eclipse, showPortraitHorizon = false }: {
  value: MoonPlacement; onChange: (value: MoonPlacement) => void; onLocate?: () => void;
  visibility?: DiskVisibility; eclipse?: LunarShadow['kind']; showPortraitHorizon?: boolean;
}) {
  const id = useId();
  const horizonNote = visibility && visibility !== 'above' && (value === 'physical' || showPortraitHorizon)
    ? MOON_HORIZON_NOTES[visibility] : undefined;
  return <fieldset className="moon-placement-control">
    <legend>月球位置</legend>
    <div className="moon-placement-options">
      <label htmlFor={id+'-portrait'}><input id={id+'-portrait'} name={id} type="radio" value="portrait"
        checked={value === 'portrait'} onChange={() => onChange('portrait')} />合影位置</label>
      <label htmlFor={id+'-physical'}><input id={id+'-physical'} name={id} type="radio" value="physical"
        checked={value === 'physical'} onChange={() => onChange('physical')} />真实位置</label>
    </div>
    <p>{value === 'portrait' ? '保持合影构图，月相随观察时刻变化。' : '按天文位置显示，月球可能在画面外。'}</p>
    {value === 'physical' && onLocate && <button type="button" className="journey-secondary" onClick={onLocate}>定位月球</button>}
    {horizonNote && <small>{value === 'portrait' && '按真实位置，'}{horizonNote}</small>}
    {eclipse && <small>{moonEclipseNote(eclipse, value === 'portrait' && !horizonNote ? visibility : undefined)}</small>}
  </fieldset>;
}
