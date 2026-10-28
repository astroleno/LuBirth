import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { LocationTree, SearchIndex, SelectedLocation } from './types';
import { parseCSVData, buildLocationTree, buildSearchIndex, getDistricts, getLocationCoords,
  searchLocations, getCitiesByProvinceName } from './dataProcessor';
import { provinces } from './administrativeData';
import { assetUrl } from '../../utils/assetUrl';
import { createLocationSearchDraft, locationLabel, selectedLocationDraft, type LocationSearchDraft } from './locationDraft';

type LocationDataset = { tree: LocationTree; index: SearchIndex };
let dataset: Promise<LocationDataset> | null = null;
function loadDataset() {
  if (!dataset) dataset = fetch(assetUrl('data/全国各地方省市经纬度及地方行政区号simple.csv'))
    .then(response => { if (!response.ok) throw new Error('地点表未能载入'); return response.text(); })
    .then(text => { const rows = parseCSVData(text); return { tree: buildLocationTree(rows), index: buildSearchIndex(rows) }; })
    .catch(error => { dataset = null; throw error; });
  return dataset;
}
const provinceList = provinces.map(province => province.name).sort();

interface LocationSelectorProps {
  onLocationChange: (location: SelectedLocation) => void;
  initialLocation?: { province?: string; city?: string; district?: string };
  draft?: LocationSearchDraft;
  onDraftChange?: (draft: LocationSearchDraft) => void;
  inputLabel?: string;
  onReady?: (input: HTMLInputElement) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange, initialLocation,
  draft: controlled, onDraftChange, inputLabel = '搜索地点', onReady, className = '' }) => {
  const id = useId();
  const [local, setLocal] = useState<LocationSearchDraft>(() => ({ ...createLocationSearchDraft(),
    province: initialLocation?.province ?? '', city: initialLocation?.city ?? '', district: initialLocation?.district ?? '' }));
  const draft = controlled ?? local;
  const [data, setData] = useState<LocationDataset | null>(null), [loadError, setLoadError] = useState(false), [attempt, setAttempt] = useState(0);
  const [showResults, setShowResults] = useState(false), [showCascader, setShowCascader] = useState(false), [activeIndex, setActiveIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null), container = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null);
  const composing = useRef(false), callback = useRef(onLocationChange), readyCallback = useRef(onReady);
  callback.current = onLocationChange;
  readyCallback.current = onReady;
  const results = useMemo(() => data && draft.query.trim() ? searchLocations(draft.query, data.index) : [], [data, draft.query]);
  const update = (next: LocationSearchDraft) => { if (controlled === undefined) setLocal(next); onDraftChange?.(next); };
  const commit = (place: SelectedLocation) => {
    update(selectedLocationDraft(place));
    setShowResults(false); setShowCascader(false);
    callback.current(place);
  };

  useEffect(() => {
    let active = true;
    setLoadError(false);
    void loadDataset().then(value => {
      if (!active) return;
      setData(value);
      if (initialLocation?.province && initialLocation.city && initialLocation.district) {
        const coords = getLocationCoords(value.tree, initialLocation.province, initialLocation.city, initialLocation.district);
        if (coords) {
          const place = { province: initialLocation.province, city: initialLocation.city, district: initialLocation.district, ...coords };
          if (controlled === undefined) setLocal(selectedLocationDraft(place));
          callback.current(place);
        }
      }
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [initialLocation?.province, initialLocation?.city, initialLocation?.district, attempt]);

  useLayoutEffect(() => {
    if (data && input.current) readyCallback.current?.(input.current);
  }, [data]);

  useEffect(() => {
    if (!showResults) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setShowResults(false);
    };
    const close = () => setShowResults(false);
    document.addEventListener('pointerdown', outside, true); window.addEventListener('blur', close);
    return () => { document.removeEventListener('pointerdown', outside, true); window.removeEventListener('blur', close); };
  }, [showResults]);
  useEffect(() => {
    const item = list.current?.children[activeIndex] as HTMLElement | undefined;
    const parent = list.current;
    if (!parent || !item) return;
    if (item.offsetTop < parent.scrollTop) parent.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > parent.scrollTop + parent.clientHeight)
      parent.scrollTop = item.offsetTop + item.offsetHeight - parent.clientHeight;
  }, [activeIndex, showResults]);

  if (loadError) return <div className={`location-selector ${className}`}>
    <p role="alert">地点加载失败，已保留你的输入。</p>
    <button type="button" className="btn" onClick={() => setAttempt(value => value + 1)}>重新加载地点</button>
  </div>;
  if (!data) return <div className={`location-selector loading ${className}`}><p role="status">加载地点…</p></div>;
  const cities = draft.province ? getCitiesByProvinceName(draft.province) : [];
  const districts = draft.province && draft.city ? getDistricts(data.tree, draft.province, draft.city) : [];
  const fieldLabel = inputLabel.replace(/^搜索/, '');
  return <div className={`location-selector ${className}`}>
    <div ref={container} className="location-search" onBlur={event => {
      // Keep Safari's tapped option mounted until click, including null relatedTarget.
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setShowResults(false);
    }}>
      <input ref={input} type="text" role="combobox" aria-label={inputLabel} aria-autocomplete="list"
        aria-expanded={showResults} aria-controls={id+'-results'}
        aria-activedescendant={showResults && results[activeIndex] ? id+'-option-'+activeIndex : undefined}
        autoComplete="off" placeholder="搜索城市或区县" value={draft.query} className="search-input"
        onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
        onChange={event => { update({ ...draft, query: event.target.value, pending: true }); setActiveIndex(0); setShowResults(!!event.target.value.trim()); }}
        onFocus={event => { if (draft.pending && draft.query.trim()) setShowResults(true); else event.currentTarget.select(); }}
        onKeyDown={event => {
          if (composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
            if (event.key === 'Enter') event.preventDefault();
            event.stopPropagation(); return;
          }
          if (event.key === 'Enter') {
            // IME confirmation and suggestion confirmation never submit the outer form.
            event.preventDefault(); event.stopPropagation();
            if (showResults && results[activeIndex]) commit(results[activeIndex]);
            else if (draft.pending && draft.query.trim()) setShowResults(true);
          } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); event.stopPropagation();
            if (!results.length) return;
            setActiveIndex(previous => !showResults ? (event.key === 'ArrowDown' ? 0 : results.length - 1)
              : (previous + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
            setShowResults(true);
          } else if (event.key === 'Escape' && showResults) {
            event.preventDefault(); event.stopPropagation(); setShowResults(false);
          }
        }} />
      {showResults && <div ref={list} id={id+'-results'} className="search-results" role="listbox" aria-label={fieldLabel+'候选'}>
        {!results.length && <p className="search-empty" role="status">没有找到地点，试试城市或区县名。</p>}
        {results.map((place, index) => <button type="button" role="option" id={id+'-option-'+index}
          key={`${place.province}/${place.city}/${place.district}`} aria-selected={index === activeIndex} tabIndex={-1}
          className="search-result-item" onPointerMove={() => setActiveIndex(index)} onClick={() => commit(place)}>
          <span className="result-name">{locationLabel(place)}</span>
          <span className="result-coords">{place.lat.toFixed(4)}°，{place.lon.toFixed(4)}°</span>
        </button>)}
      </div>}
    </div>
    <div className="location-picker-meta"><button type="button" className="location-cascader-toggle"
      aria-expanded={showCascader} aria-controls={id+'-administrative'} onClick={() => { setShowCascader(value => !value); setShowResults(false); }}>
      {showCascader ? '收起省市区选择' : '按省市区选择'}</button></div>
    {showCascader && <div id={id+'-administrative'} className="location-cascader"><div className="cascader-row">
      <select aria-label={fieldLabel+'省份'} className="cascader-select" value={draft.province}
        onChange={event => update({ ...draft, province: event.target.value, city: '', district: '', pending: true })}>
        <option value="">选择省份</option>{provinceList.map(province => <option key={province}>{province}</option>)}
      </select>
      <select aria-label={fieldLabel+'城市'} className="cascader-select" value={draft.city} disabled={!draft.province}
        onChange={event => update({ ...draft, city: event.target.value, district: '', pending: true })}>
        <option value="">选择城市</option>{cities.map(city => <option key={city}>{city}</option>)}
      </select>
      <select aria-label={fieldLabel+'区县'} className="cascader-select" value={draft.district} disabled={!draft.city}
        onChange={event => {
          const district = event.target.value;
          const coords = district ? getLocationCoords(data.tree, draft.province, draft.city, district) : null;
          if (coords) commit({ province: draft.province, city: draft.city, district, ...coords });
          else update({ ...draft, district, pending: true });
        }}>
        <option value="">选择区县</option>{districts.map(district => <option key={district}>{district}</option>)}
      </select>
    </div></div>}
  </div>;
};
