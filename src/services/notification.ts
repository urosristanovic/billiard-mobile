import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type { AppNotification, NotificationPref, NotificationCategory } from '@/types/notification';

function buildHeaders(token: string, includeJson = false): Record<string, string> {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const notificationService = {
  list: async (
    token: string,
    params?: { page?: number; pageSize?: number },
  ) => {
    const url = new URL(API_ENDPOINTS.notifications.list);
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize));

    const res = await fetchWithTimeout(url.toString(), {
      headers: buildHeaders(token),
    });
    const result: ApiPaginatedResponse<AppNotification> = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.success ? `HTTP ${res.status}` : result.error);
    }
    return result.data;
  },

  unreadCount: async (token: string): Promise<number> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.notifications.unreadCount, {
      headers: buildHeaders(token),
    });
    const result: ApiResponse<{ count: number }> = await res.json();
    if (!res.ok || !result.success) return 0;
    return result.data.count;
  },

  markRead: async (token: string, id: string): Promise<void> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.notifications.markRead(id), {
      method: 'PATCH',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },

  markAllRead: async (token: string): Promise<void> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.notifications.markAllRead, {
      method: 'PATCH',
      headers: buildHeaders(token),
    });
    await parseResponse<null>(res);
  },

  getPrefs: async (token: string): Promise<NotificationPref[]> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.notifications.prefs, {
      headers: buildHeaders(token),
    });
    return parseResponse<NotificationPref[]>(res);
  },

  updatePref: async (
    token: string,
    category: NotificationCategory,
    updates: { pushEnabled?: boolean; inboxEnabled?: boolean },
  ): Promise<void> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.notifications.prefs, {
      method: 'PATCH',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ category, ...updates }),
    });
    await parseResponse<null>(res);
  },

  registerDevice: async (
    token: string,
    body: { expoToken: string; platform: 'ios' | 'android'; appVersion?: string },
  ): Promise<void> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.devices.register, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify(body),
    });
    await parseResponse<null>(res);
  },

  unregisterDevice: async (token: string, expoToken: string): Promise<void> => {
    const res = await fetchWithTimeout(
      API_ENDPOINTS.devices.unregister(expoToken),
      {
        method: 'DELETE',
        headers: buildHeaders(token),
      },
    );
    await parseResponse<null>(res);
  },
};
