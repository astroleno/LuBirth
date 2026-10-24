import { useId } from 'react';
import type { MoonPlacement } from '../history/journeyStore';
import './MoonPlacementControl.css';

export function MoonPlacementControl({ value, onChange, onLocate, belowHorizon }: {
  value: MoonPlacement; onChange: (value: MoonPlacement) => void; onLocate?: () => void; belowHorizon?: boolean;
}) {
  const id = useId();
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
    {value === 'physical' && belowHorizon && <small>月球此时在当地地平线下。</small>}
  </fieldset>;
}
