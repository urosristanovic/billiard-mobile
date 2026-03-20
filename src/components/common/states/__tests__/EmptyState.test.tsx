import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

// Mock react-i18next for tests
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('EmptyState', () => {
  it('renders the title when provided', () => {
    const { getByText } = render(<EmptyState title='No matches found' />);
    expect(getByText('No matches found')).toBeTruthy();
  });

  it('renders a fallback i18n key when no title provided', () => {
    const { getByText } = render(<EmptyState />);
    // t('emptyState') returns 'emptyState' in our mock
    expect(getByText('emptyState')).toBeTruthy();
  });

  it('renders description when provided', () => {
    const { getByText } = render(
      <EmptyState title='Empty' description='Start by creating a match.' />,
    );
    expect(getByText('Start by creating a match.')).toBeTruthy();
  });

  it('does not render description when not provided', () => {
    const { queryByText } = render(<EmptyState title='Empty' />);
    expect(queryByText('Start by creating a match.')).toBeNull();
  });

  it('renders action button and fires onPress', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <EmptyState title='Empty' action={{ label: 'Create Match', onPress }} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when action is not provided', () => {
    const { queryByRole } = render(<EmptyState title='Empty' />);
    expect(queryByRole('button')).toBeNull();
  });
});
