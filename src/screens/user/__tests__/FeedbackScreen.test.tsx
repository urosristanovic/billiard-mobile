import React from 'react';
import { render, fireEvent } from '@/test/test-utils';
// Import directly to avoid barrel triggering i18n side-effects from other screens
import FeedbackScreen from '../FeedbackScreen/index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
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

const mockSubmitFeedback = jest.fn();
jest.mock('@/features/feedback/useFeedbackMutation', () => ({
  useFeedbackMutation: () => ({
    submitFeedback: { mutate: mockSubmitFeedback, isPending: false },
  }),
}));

jest.mock('@/components/common/layout', () => ({
  ScreenLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/common/toast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const navigation = { goBack: jest.fn() };

describe('FeedbackScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the feedback message field', () => {
    const { getByLabelText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    // FormField label = tAuth('feedback.messageLabel') = 'feedback.messageLabel'
    expect(getByLabelText('feedback.messageLabel')).toBeTruthy();
  });

  it('renders the submit button', () => {
    const { getByText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    // PrimaryButton label = tAuth('feedback.submitButton') = 'feedback.submitButton'
    expect(getByText('feedback.submitButton')).toBeTruthy();
  });

  it('renders all 3 feedback type options', () => {
    const { getByText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    expect(getByText('feedback.typeSuggestion')).toBeTruthy();
    expect(getByText('feedback.typeBug')).toBeTruthy();
    expect(getByText('feedback.typeOther')).toBeTruthy();
  });

  it('shows validation error when submitting empty message', () => {
    const { getByText, getByRole } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    fireEvent.press(getByText('feedback.submitButton'));
    expect(getByRole('alert')).toBeTruthy();
  });

  it('does not call submitFeedback when message is empty', () => {
    const { getByText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    fireEvent.press(getByText('feedback.submitButton'));
    expect(mockSubmitFeedback).not.toHaveBeenCalled();
  });

  it('calls submitFeedback when form is valid', () => {
    const { getByText, getByLabelText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    fireEvent.changeText(
      getByLabelText('feedback.messageLabel'),
      'This is a valid feedback message with enough length.',
    );
    fireEvent.press(getByText('feedback.submitButton'));
    expect(mockSubmitFeedback).toHaveBeenCalledWith(
      { type: 'suggestion', message: 'This is a valid feedback message with enough length.' },
      expect.any(Object),
    );
  });

  it('calls navigation.goBack when cancel is pressed', () => {
    const { getByText } = render(<FeedbackScreen navigation={navigation} isDark={false} />);
    fireEvent.press(getByText('cancel'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
