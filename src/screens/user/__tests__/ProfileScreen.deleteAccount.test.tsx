import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@/test/test-utils';
import ProfileScreen from '../ProfileScreen/index';
import type { User } from '@/types/user';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { resolvedLanguage: 'en', language: 'en', changeLanguage: jest.fn() } }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

const tk = {
  text: { primary: '#000', secondary: '#666', muted: '#999', onPrimary: '#fff' },
  primary: { 300: '#93c5fd', 400: '#60a5fa', 500: '#0070f3', 600: '#006ae0', 700: '#005bc4', 900: '#1e3a8a' },
  surface: { default: '#fff', raised: '#f9f9f9' },
  border: { default: '#ddd' },
  error: { default: '#f00', border: '#f00' },
  background: { default: '#fff', secondary: '#f5f5f5', overlay: 'rgba(0,0,0,0.5)' },
};

jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, tk }),
}));

const fakeUser: User = {
  id: 'user-1',
  email: 'alice@example.com',
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

jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ user: fakeUser }),
}));

const mockUpdateProfile = { mutate: jest.fn(), isPending: false };
const mockDeleteAccount = { mutate: jest.fn(), isPending: false };

jest.mock('@/features/auth/useAuthMutations', () => ({
  useAuthMutations: () => ({
    updateProfile: mockUpdateProfile,
    deleteAccount: mockDeleteAccount,
  }),
}));

jest.mock('@/features/auth/useProfileForm', () => ({
  useProfileForm: () => ({
    form: { displayName: 'Alice', bio: '' },
    errors: {},
    updateField: jest.fn(),
    loadForEdit: jest.fn(),
    validate: jest.fn(() => true),
  }),
}));

jest.mock('@/features/locations/useLocations', () => ({
  useCountries: () => ({ data: [], isLoading: false }),
  useCities: () => ({ data: [], isLoading: false }),
}));

jest.mock('@/i18n', () => ({
  setStoredLanguage: jest.fn(),
}));

jest.mock('@/components/common/layout', () => ({
  ScreenLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/common/states', () => ({
  LoadingState: () => null,
}));

// Render FormModal children only when visible so we can control the edit modal
jest.mock('@/components/common/forms', () => ({
  FormField: ({ label }: { label: string }) => {
    const { Text } = require('react-native');
    return <Text accessibilityLabel={label}>{label}</Text>;
  },
  FormModal: ({ visible, children, title }: { visible: boolean; children: React.ReactNode; title?: string; footer?: React.ReactNode }) => {
    const { View, Text } = require('react-native');
    if (!visible) return null;
    return <View><Text>{title}</Text>{children}</View>;
  },
  FormButtons: ({ submitLabel, cancelLabel, onSubmit, onCancel }: { submitLabel: string; cancelLabel: string; onSubmit: () => void; onCancel: () => void }) => {
    const { Text, TouchableOpacity } = require('react-native');
    return (
      <>
        <TouchableOpacity onPress={onSubmit}><Text>{submitLabel}</Text></TouchableOpacity>
        <TouchableOpacity onPress={onCancel}><Text>{cancelLabel}</Text></TouchableOpacity>
      </>
    );
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const navigation = { navigate: jest.fn(), setParams: jest.fn() };
const route = { params: {} };

function renderScreen() {
  return render(
    <ProfileScreen
      navigation={navigation as any}
      route={route as any}
    />,
  );
}

function openEditModal(getByText: ReturnType<typeof render>['getByText']) {
  fireEvent.press(getByText('profile.editButton'));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProfileScreen -- Delete Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  it('renders the Delete Account button inside the edit modal', () => {
    const { getByText } = renderScreen();
    openEditModal(getByText);
    expect(getByText('profile.deleteAccount')).toBeTruthy();
  });

  it('shows a confirmation Alert when Delete Account is pressed', () => {
    const { getByText } = renderScreen();
    openEditModal(getByText);
    fireEvent.press(getByText('profile.deleteAccount'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'deleteAccount.title',
      'deleteAccount.message',
      expect.arrayContaining([
        expect.objectContaining({ text: 'deleteAccount.cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'deleteAccount.confirm', style: 'destructive' }),
      ]),
    );
  });

  it('does NOT call deleteAccount.mutate immediately when button is pressed', () => {
    const { getByText } = renderScreen();
    openEditModal(getByText);
    fireEvent.press(getByText('profile.deleteAccount'));

    expect(mockDeleteAccount.mutate).not.toHaveBeenCalled();
  });

  it('calls deleteAccount.mutate when the destructive confirm action is invoked', () => {
    const { getByText } = renderScreen();
    openEditModal(getByText);
    fireEvent.press(getByText('profile.deleteAccount'));

    // Simulate the user pressing "Delete" in the Alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons: Array<{ text: string; style?: string; onPress?: () => void }> = alertCall[2];
    const confirmButton = buttons.find(b => b.style === 'destructive');
    confirmButton?.onPress?.();

    expect(mockDeleteAccount.mutate).toHaveBeenCalledTimes(1);
  });

  it('does not call deleteAccount.mutate when cancel is chosen', () => {
    const { getByText } = renderScreen();
    openEditModal(getByText);
    fireEvent.press(getByText('profile.deleteAccount'));

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons: Array<{ text: string; style?: string; onPress?: () => void }> = alertCall[2];
    const cancelButton = buttons.find(b => b.style === 'cancel');
    cancelButton?.onPress?.();

    expect(mockDeleteAccount.mutate).not.toHaveBeenCalled();
  });

  it('disables the Delete Account button while deletion is pending', () => {
    mockDeleteAccount.isPending = true;

    const { getByText, getByRole } = renderScreen();
    openEditModal(getByText);

    // DangerButton sets accessibilityRole='button' and accessibilityLabel=label on TouchableOpacity
    const btn = getByRole('button', { name: 'profile.deleteAccount' });
    expect(btn.props.accessibilityState?.disabled).toBe(true);

    mockDeleteAccount.isPending = false;
  });
});
