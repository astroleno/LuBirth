import { CULTURE_INFO } from '../../history/cultureVersions';
import { CULTURE_VERSIONS, type CultureVersion } from '../../history/journeyStore';

export function CulturePicker({ value, onChange }: { value: CultureVersion; onChange: (value: CultureVersion) => void }) {
  const info = CULTURE_INFO[value];
  return <section className="experience-culture">
    <label htmlFor="experience-culture">星空文化</label>
    <select id="experience-culture" value={value} onChange={event => onChange(event.target.value as CultureVersion)}>
      {CULTURE_VERSIONS.map(key => <option value={key} key={key}>{CULTURE_INFO[key].name}</option>)}
    </select>
    <p>{info.description}</p>
    <details className="journey-details"><summary>版本与图绘依据</summary>
      <p>{info.author} · <a href={info.source} target="_blank" rel="noreferrer">查看资料 ↗</a></p>
      <p>唐代敦煌星图可阅读原图与历史说明，尚未建立独立逐星映射，陈卓体系也不是它的完整数字复刻。</p>
      <a href="https://idp.bl.uk/discover/learning/chinese-astronomy/articles/the-chinese-sky/the-dunhuang-star-atlas/" target="_blank" rel="noreferrer">国际敦煌项目 · 敦煌星图 ↗</a>
    </details>
  </section>;
}
