import { act } from '@testing-library/react-native';
import { useAuthStore } from '../useAuthStore';
import type { User } from '@/types/user';

const fakeUser: User = {
  id: 'user-1',
  email: 'alice@test.com',
  username: 'alice',
  displayName: 'Alice',
  avatarUrl: null,
  location: null,
  bio: null,
  role: 'member',
  countryId: null,
  cityId: null,
  countryName: null,
  cityName: null,
  locationChangedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

beforeEach(() => {
  // Reset store to initial state between tests
  act(() => {
    useAuthStore.setState({ user: null, isLoading: false, isInitialized: false });
  });
});

describe('useAuthStore', () => {
  it('initializes with null user, not loading, not initialized', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isInitialized).toBe(false);
  });

  it('setUser stores the user', () => {
    act(() => {
      useAuthStore.getState().setUser(fakeUser);
    });
    expect(useAuthStore.getState().user).toEqual(fakeUser);
  });

  it('setUser with null clears the user', () => {
    act(() => {
      useAuthStore.getState().setUser(fakeUser);
      useAuthStore.getState().setUser(null);
    });
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setLoading updates isLoading', () => {
    act(() => {
      useAuthStore.getState().setLoading(true);
    });
    expect(useAuthStore.getState().isLoading).toBe(true);
    act(() => {
      useAuthStore.getState().setLoading(false);
    });
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('setInitialized updates isInitialized', () => {
    act(() => {
      useAuthStore.getState().setInitialized(true);
    });
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it('clearAuth resets user and isLoading', () => {
    act(() => {
      useAuthStore.getState().setUser(fakeUser);
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().clearAuth();
    });
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('clearAuth does not reset isInitialized', () => {
    act(() => {
      useAuthStore.getState().setInitialized(true);
      useAuthStore.getState().clearAuth();
    });
    // clearAuth only resets user and isLoading
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });
});
