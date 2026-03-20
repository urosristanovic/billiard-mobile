import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from '../PrimaryButton';

describe('PrimaryButton', () => {
  it('renders the label text', () => {
    const { getByText } = render(<PrimaryButton label='Submit' onPress={() => {}} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<PrimaryButton label='Submit' onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<PrimaryButton label='Submit' onPress={onPress} disabled />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator and not label text when loading', () => {
    const { queryByText, getByLabelText } = render(
      <PrimaryButton label='Submit' onPress={() => {}} loading />,
    );
    expect(queryByText('Submit')).toBeNull();
    expect(getByLabelText('Loading')).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<PrimaryButton label='Submit' onPress={onPress} loading />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('has accessible role=button', () => {
    const { getByRole } = render(<PrimaryButton label='Press me' onPress={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('has accessibility label matching the label prop', () => {
    const { getByLabelText } = render(<PrimaryButton label='Save Changes' onPress={() => {}} />);
    expect(getByLabelText('Save Changes')).toBeTruthy();
  });
});
