import { API_CONFIG } from '@/config/api';

export async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `Request timed out. Is the API reachable at ${API_CONFIG.baseURL}?`,
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
