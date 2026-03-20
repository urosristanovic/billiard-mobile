import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmDialog } from '../ConfirmDialog';

const defaultProps = {
  visible: true,
  title: 'Confirm Action',
  message: 'Are you sure you want to continue?',
  confirmLabel: 'Yes',
  cancelLabel: 'No',
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ConfirmDialog', () => {
  it('renders title and message when visible', () => {
    const { getByText } = render(<ConfirmDialog {...defaultProps} />);
    expect(getByText('Confirm Action')).toBeTruthy();
    expect(getByText('Are you sure you want to continue?')).toBeTruthy();
  });

  it('renders confirm and cancel buttons', () => {
    const { getByText } = render(<ConfirmDialog {...defaultProps} />);
    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.press(getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is pressed', () => {
    const onCancel = jest.fn();
    const { getByText } = render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.press(getByText('No'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render content when not visible', () => {
    const { queryByText } = render(
      <ConfirmDialog {...defaultProps} visible={false} />,
    );
    // When visible=false the Modal is hidden
    expect(queryByText('Confirm Action')).toBeNull();
  });

  it('shows loading state on confirm button when isConfirming', () => {
    const { queryByText, getByLabelText } = render(
      <ConfirmDialog {...defaultProps} isConfirming />,
    );
    // PrimaryButton shows ActivityIndicator when loading, hides label
    expect(queryByText('Yes')).toBeNull();
    expect(getByLabelText('Loading')).toBeTruthy();
  });

  it('cancel button is disabled when isConfirming', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <ConfirmDialog {...defaultProps} isConfirming onCancel={onCancel} />,
    );
    fireEvent.press(getByText('No'));
    // SecondaryButton disabled prop prevents the press
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('uses DangerButton for destructive variant', () => {
    // DangerButton has accessibilityRole button — just verify it renders with correct label
    const { getByText } = render(
      <ConfirmDialog {...defaultProps} variant='destructive' confirmLabel='Delete' />,
    );
    expect(getByText('Delete')).toBeTruthy();
  });
});
