export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  countryId: string;
  name: string;
  approved: boolean;
}

export interface SuggestCityInput {
  countryId: string;
  name: string;
}
