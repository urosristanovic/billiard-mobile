import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';
import type { Country, City, SuggestCityInput } from '@/types/location';

function buildHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const locationService = {
  async getCountries(token: string): Promise<Country[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.locations.countries, {
      headers: buildHeaders(token),
    });
    return parseResponse<Country[]>(res);
  },

  async getCities(token: string, countryId: string): Promise<City[]> {
    const res = await fetchWithTimeout(API_ENDPOINTS.locations.cities(countryId), {
      headers: buildHeaders(token),
    });
    return parseResponse<City[]>(res);
  },

  async suggestCity(token: string, input: SuggestCityInput): Promise<City> {
    const res = await fetchWithTimeout(API_ENDPOINTS.locations.suggestCity, {
      method: 'POST',
      headers: { ...buildHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return parseResponse<City>(res);
  },
};
