import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@/types/user';

interface ProfileFormState {
  displayName: string;
  location: string;
  bio: string;
}

const initialState: ProfileFormState = {
  displayName: '',
  location: '',
  bio: '',
};

export const useProfileForm = () => {
  const { t } = useTranslation('auth');
  const [form, setForm] = useState<ProfileFormState>(initialState);
  const [errors, setErrors] = useState<Partial<ProfileFormState>>({});

  const updateField = <K extends keyof ProfileFormState>(
    key: K,
    value: string,
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const loadForEdit = (user: User) => {
    setForm({
      displayName: user.displayName,
      location: user.location ?? '',
      bio: user.bio ?? '',
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileFormState> = {};
    if (!form.displayName.trim())
      newErrors.displayName = t('validation.displayNameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
  };

  const isValid = !errors.displayName && !!form.displayName.trim();

  return {
    form,
    errors,
    updateField,
    loadForEdit,
    validate,
    resetForm,
    isValid,
  };
};
