export interface LocationData {
  province: string;
  city: string;
  district: string;
  lon: number;
  lat: number;
  timeZone?: string;
  alternateTimeZone?: string;
  aliases?: readonly string[];
  status?: 'international' | 'historical';
  note?: string;
  source?: string;
}

export interface LocationTree {
  provinces: {
    [key: string]: {
      name: string;
      cities: {
        [key: string]: {
          name: string;
          districts: {
            [key: string]: LocationData;
          };
        };
      };
    };
  };
}

export interface SearchIndex {
  names: ReadonlyMap<string, readonly LocationData[]>;
  qualifiedNames: ReadonlyMap<string, readonly LocationData[]>;
  entries: readonly {
    location: LocationData;
    names: string[];
    variants: ReadonlySet<string>[];
  }[];
}

export type SelectedLocation = LocationData;
