import React, { useState, useEffect, useCallback } from 'react';
import { LocationTree, SearchIndex, SelectedLocation } from './types';
import { 
  parseCSVData,
  buildLocationTree,
  buildSearchIndex,
  getProvinces, 
  getCities, 
  getDistricts, 
  getLocationCoords,
  searchLocations,
  getCitiesByProvinceName
} from './dataProcessor';
import { provinces } from './administrativeData';
import { assetUrl } from '../../utils/assetUrl';

interface LocationSelectorProps {
  onLocationChange: (location: SelectedLocation) => void;
  initialLocation?: {
    province?: string;
    city?: string;
    district?: string;
  };
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
  initialLocation,
  className = ''
}) => {
  const [locationTree, setLocationTree] = useState<LocationTree | null>(null);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialLocation?.province || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialLocation?.city || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialLocation?.district || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const onLocationChangeRef = React.useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  // 加载数据
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(false);
    const loadData = async () => {
      try {
        const response = await fetch(assetUrl('data/全国各地方省市经纬度及地方行政区号simple.csv'), { signal: controller.signal });
        if (!response.ok) throw new Error(`Location data: ${response.status}`);
        const csvText = await response.text();
        
        const data = parseCSVData(csvText);
        const tree = buildLocationTree(data);
        const index = buildSearchIndex(data);
        
        setLocationTree(tree);
        setSearchIndex(index);
        setIsLoading(false);
        
        // 如果有初始位置，触发回调
        if (initialLocation?.province && initialLocation?.city && initialLocation?.district) {
          const coords = getLocationCoords(tree, initialLocation.province, initialLocation.city, initialLocation.district);
          if (coords) {
            onLocationChangeRef.current({
              province: initialLocation.province,
              city: initialLocation.city,
              district: initialLocation.district,
              ...coords
            });
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to load location data:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };
    
    loadData();
    return () => controller.abort();
  }, [initialLocation?.province, initialLocation?.city, initialLocation?.district, loadAttempt]);

  // 省份选择
  const handleProvinceChange = useCallback((province: string) => {
    setSelectedProvince(province);
    setSelectedCity('');
    setSelectedDistrict('');
  }, []);

  // 城市选择
  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setSelectedDistrict('');
  }, []);

  // 区县选择
  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    
    if (locationTree && selectedProvince && selectedCity && district) {
      const coords = getLocationCoords(locationTree, selectedProvince, selectedCity, district);
      if (coords) {
        onLocationChange({
          province: selectedProvince,
          city: selectedCity,
          district,
          ...coords
        });
      }
    }
  }, [locationTree, selectedProvince, selectedCity, onLocationChange]);

  // 搜索处理
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim() && searchIndex) {
      const results = searchLocations(query, searchIndex);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchIndex]);

  // 搜索结果选择
  const handleSearchResultSelect = useCallback((result: any) => {
    // Focus can reopen suggestions through onFocus; close them after restoring it.
    searchInputRef.current?.focus();
    setSelectedProvince(result.province);
    setSelectedCity(result.city);
    setSelectedDistrict(result.district);
    setSearchQuery('');
    setShowSearchResults(false);
    
    onLocationChange({
      province: result.province,
      city: result.city,
      district: result.district,
      lon: result.lon,
      lat: result.lat
    });
  }, [onLocationChange]);

  if (isLoading) {
    return (
      <div className={`location-selector loading ${className}`}>
        <div role="status">加载地点…</div>
      </div>
    );
  }

  if (loadError) return <div className={`location-selector ${className}`}>
    <p role="alert">地点加载失败，请检查网络后重试。</p>
    <button type="button" className="btn" onClick={() => setLoadAttempt(value => value + 1)}>重新加载地点</button>
  </div>;

  // 使用固定的省份数据，确保层级正确
  const provinceList = provinces.map(p => p.name).sort();
  const cities = selectedProvince ? getCitiesByProvinceName(selectedProvince) : [];
  const districts = selectedProvince && selectedCity && locationTree ? getDistricts(locationTree, selectedProvince, selectedCity) : [];

  return (
    <div className={`location-selector ${className}`}>
      {/* 搜索框 */}
      <div className="location-search" onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShowSearchResults(false);
      }} onKeyDown={event => {
        if (event.key === 'Escape') {
          searchInputRef.current?.focus();
          setShowSearchResults(false);
        }
      }}>
        <input
          ref={searchInputRef}
          type="text"
          aria-label="搜索出生地点"
          placeholder="搜索城市或地区..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setShowSearchResults(true)}
          className="search-input"
        />
        {showSearchResults && (
          <div className="search-results">
            {searchResults.length === 0 && <div className="search-empty" role="status">没有找到地点，试试城市或区县名。</div>}
            {searchResults.map((result, index) => (
              <button
                type="button"
                key={index}
                className="search-result-item"
                onClick={() => handleSearchResultSelect(result)}
              >
                <span className="result-name">
                  {result.province} {result.city} {result.district}
                </span>
                <span className="result-coords">
                  {result.lon.toFixed(4)}, {result.lat.toFixed(4)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="location-divider">
        <span>或</span>
      </div>

      {/* 三级联动选择器 */}
      <div className="location-cascader">
        <div className="cascader-row">
          <select
            aria-label="出生省份"
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="cascader-select"
          >
            <option value="">选择省份</option>
            {provinceList.map(province => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            aria-label="出生城市"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!selectedProvince}
            className="cascader-select"
          >
            <option value="">选择城市</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            aria-label="出生区县"
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!selectedCity}
            className="cascader-select"
          >
            <option value="">选择区县</option>
            {districts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* 当前选择显示 */}
        {selectedProvince && selectedCity && selectedDistrict && (
          <div className="selected-location">
            <span className="selected-text">
              {selectedProvince} {selectedCity} {selectedDistrict}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
