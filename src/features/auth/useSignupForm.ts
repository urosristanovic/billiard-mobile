import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SignupFormState {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  displayName: string;
}

const initialState: SignupFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  displayName: '',
};

export const useSignupForm = () => {
  const { t } = useTranslation('auth');
  const [form, setForm] = useState<SignupFormState>(initialState);
  const [errors, setErrors] = useState<Partial<SignupFormState>>({});

  const updateField = <K extends keyof SignupFormState>(
    key: K,
    value: string,
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<SignupFormState> = {};
    if (!form.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = t('validation.emailInvalid');
    if (!form.password) newErrors.password = t('validation.passwordRequired');
    else if (form.password.length < 8)
      newErrors.password = t('validation.passwordTooShort');
    if (!form.confirmPassword)
      newErrors.confirmPassword = t('validation.confirmPasswordRequired');
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = t('validation.passwordsDoNotMatch');
    if (!form.username.trim())
      newErrors.username = t('validation.usernameRequired');
    else if (form.username.length < 3)
      newErrors.username = t('validation.usernameTooShort');
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      newErrors.username = t('validation.usernameInvalid');
    if (!form.displayName.trim())
      newErrors.displayName = t('validation.displayNameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
  };

  const isValid =
    Object.keys(errors).length === 0 &&
    !!form.email &&
    !!form.password &&
    !!form.confirmPassword &&
    !!form.username &&
    !!form.displayName;

  return { form, errors, updateField, validate, resetForm, isValid };
};
