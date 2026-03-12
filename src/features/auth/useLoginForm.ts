import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginFormState {
  email: string;
  password: string;
}

const initialState: LoginFormState = { email: '', password: '' };

export const useLoginForm = () => {
  const { t } = useTranslation('auth');
  const [form, setForm] = useState<LoginFormState>(initialState);
  const [errors, setErrors] = useState<Partial<LoginFormState>>({});

  const updateField = <K extends keyof LoginFormState>(
    key: K,
    value: string,
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormState> = {};
    if (!form.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = t('validation.emailInvalid');
    if (!form.password) newErrors.password = t('validation.passwordRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
  };

  const isValid =
    !errors.email && !errors.password && !!form.email && !!form.password;

  return { form, errors, updateField, validate, resetForm, isValid };
};
