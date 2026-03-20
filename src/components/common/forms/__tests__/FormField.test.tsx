import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('renders the label', () => {
    const { getByText } = render(<FormField label='Email' />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders required asterisk when required prop is set', () => {
    const { getByText } = render(<FormField label='Email' required />);
    expect(getByText(' *')).toBeTruthy();
  });

  it('does not render asterisk when not required', () => {
    const { queryByText } = render(<FormField label='Email' />);
    expect(queryByText(' *')).toBeNull();
  });

  it('renders the error message when error prop is provided', () => {
    const { getByRole } = render(<FormField label='Email' error='Invalid email' />);
    const alert = getByRole('alert');
    expect(alert).toBeTruthy();
  });

  it('renders helper text when helperText prop is provided and no error', () => {
    const { getByText } = render(<FormField label='Email' helperText='Enter your email address' />);
    expect(getByText('Enter your email address')).toBeTruthy();
  });

  it('shows error over helperText when both are provided', () => {
    const { getByRole, queryByText } = render(
      <FormField label='Email' error='Invalid' helperText='Enter your email' />,
    );
    expect(getByRole('alert')).toBeTruthy();
    // helperText should not appear when error is present
    expect(queryByText('Enter your email')).toBeNull();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(<FormField label='Email' onChangeText={onChangeText} />);
    fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('has an accessible TextInput labeled by the label prop', () => {
    const { getByLabelText } = render(<FormField label='Password' />);
    expect(getByLabelText('Password')).toBeTruthy();
  });
});
