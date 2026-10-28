import type { SelectedLocation } from './types';

export type LocationSearchDraft = {
  query: string;
  province: string;
  city: string;
  district: string;
  pending: boolean;
};

export function locationLabel(location: Pick<SelectedLocation, 'province' | 'city' | 'district'>) {
  // City-centre rows repeat the city as a district (广州市 / 广州).
  // Keep province/city distinctions such as 吉林省 / 吉林市.
  const district = location.district.replace(/市$/, '') === location.city.replace(/市$/, '') ? '' : location.district;
  return [location.province, location.city, district]
    .filter((part, index, parts) => part && part !== parts[index - 1]).join(' · ');
}

export function createLocationSearchDraft(query = ''): LocationSearchDraft {
  return { query, province: '', city: '', district: '', pending: false };
}

export function selectedLocationDraft(location: SelectedLocation): LocationSearchDraft {
  return { query: locationLabel(location), province: location.province, city: location.city,
    district: location.district, pending: false };
}
