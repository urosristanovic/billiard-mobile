import React from 'react';
import { render, fireEvent } from '@/test/test-utils';
// Import directly from the screen file to avoid barrel index triggering unrelated modules
import LoginScreen from '../LoginScreen/index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    tk: {
      text: { primary: '#000', secondary: '#666', muted: '#999', onPrimary: '#fff' },
      primary: { 500: '#0070f3', 600: '#006ae0', 700: '#005bc4' },
      surface: { default: '#fff', raised: '#f9f9f9' },
      border: { default: '#ddd' },
      error: { default: '#f00', border: '#f00' },
      background: { overlay: 'rgba(0,0,0,0.5)' },
    },
  }),
}));

jest.mock('@/features/auth/useLoginForm', () => ({
  useLoginForm: () => ({
    form: { email: '', password: '' },
    errors: { email: undefined, password: undefined },
    updateField: jest.fn(),
    validate: jest.fn(() => false),
  }),
}));

const mockLoginMutate = jest.fn();
jest.mock('@/features/auth/useAuthMutations', () => ({
  useAuthMutations: () => ({
    login: { mutate: mockLoginMutate, isPending: false, isError: false, error: null },
  }),
}));

jest.mock('@/components/common/layout', () => ({
  ScreenLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LoginScreen', () => {
  const defaultProps = {
    onNavigateSignup: jest.fn(),
    onNavigateForgotPassword: jest.fn(),
    isDark: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login title', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    // useTranslation returns the key as the value
    expect(getByText('login.title')).toBeTruthy();
  });

  it('renders email and password input fields', () => {
    const { getByLabelText } = render(<LoginScreen {...defaultProps} />);
    // FormField accessibilityLabel = label = t('fields.email')
    expect(getByLabelText('fields.email')).toBeTruthy();
    expect(getByLabelText('fields.password')).toBeTruthy();
  });

  it('renders submit button with translated label', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    // FormButtons passes submitLabel to PrimaryButton which renders it as Text
    expect(getByText('login.submitButton')).toBeTruthy();
  });

  it('renders forgot password link', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('login.forgotPasswordLink')).toBeTruthy();
  });

  it('calls onNavigateForgotPassword when forgot password link is pressed', () => {
    const onNavigateForgotPassword = jest.fn();
    const { getByText } = render(
      <LoginScreen {...defaultProps} onNavigateForgotPassword={onNavigateForgotPassword} />,
    );
    fireEvent.press(getByText('login.forgotPasswordLink'));
    expect(onNavigateForgotPassword).toHaveBeenCalled();
  });

  it('calls onNavigateSignup when signup link is pressed', () => {
    const onNavigateSignup = jest.fn();
    const { getByText } = render(
      <LoginScreen {...defaultProps} onNavigateSignup={onNavigateSignup} />,
    );
    fireEvent.press(getByText('login.signupLink'));
    expect(onNavigateSignup).toHaveBeenCalled();
  });
});
