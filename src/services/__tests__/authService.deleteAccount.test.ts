import { authService } from '../auth';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/features/auth/getAccessToken', () => ({
  getAccessToken: jest.fn().mockResolvedValue('test-access-token'),
}));

const mockFetch = jest.fn();
jest.mock('@/lib/fetchWithTimeout', () => ({
  fetchWithTimeout: (...args: unknown[]) => mockFetch(...args),
}));

jest.mock('@/lib/tokenStorage', () => ({
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

function makeResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('authService.deleteAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends a DELETE request with the Bearer token', async () => {
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: null }));

    await authService.deleteAccount();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/delete-account'),
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-access-token',
        }),
      }),
    );
  });

  it('returns null on success', async () => {
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: null }));

    const result = await authService.deleteAccount();

    expect(result).toBeNull();
  });

  it('throws when the API returns a non-ok response', async () => {
    mockFetch.mockResolvedValue(
      makeResponse({ success: false, error: 'Unauthorized' }, false, 401),
    );

    await expect(authService.deleteAccount()).rejects.toThrow('Unauthorized');
  });

  it('throws with the API error message on failure', async () => {
    mockFetch.mockResolvedValue(
      makeResponse({ success: false, error: 'Failed to delete account' }, false, 500),
    );

    await expect(authService.deleteAccount()).rejects.toThrow(
      'Failed to delete account',
    );
  });
});
