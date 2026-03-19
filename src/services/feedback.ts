import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import type { ApiResponse } from '@/types/api';

export type FeedbackType = 'suggestion' | 'bug' | 'other';

export interface SubmitFeedbackInput {
  type: FeedbackType;
  message: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export const feedbackService = {
  submit: async (token: string, input: SubmitFeedbackInput): Promise<null> => {
    const res = await fetchWithTimeout(API_ENDPOINTS.feedback.submit, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return parseResponse<null>(res);
  },
};
