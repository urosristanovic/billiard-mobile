import { useQuery, useMutation } from '@tanstack/react-query';
import { locationService } from '@/services/location';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { SuggestCityInput } from '@/types/location';

export const useCountries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COUNTRIES,
    queryFn: async () => {
      const token = await getAccessToken();
      return locationService.getCountries(token);
    },
    staleTime: 24 * 60 * 60 * 1000, // countries rarely change
  });
};

export const useCities = (countryId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.CITIES(countryId ?? ''),
    queryFn: async () => {
      const token = await getAccessToken();
      return locationService.getCities(token, countryId!);
    },
    enabled: !!countryId,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useSuggestCity = () => {
  return useMutation({
    mutationFn: async (input: SuggestCityInput) => {
      const token = await getAccessToken();
      return locationService.suggestCity(token, input);
    },
  });
};
