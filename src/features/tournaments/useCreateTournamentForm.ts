import { useState } from 'react';
import type {
  TournamentFormat,
  TournamentVisibility,
  CreateTournamentInput,
} from '@/types/tournament';
import type { Discipline } from '@/types/match';

export interface CreateTournamentFormState {
  name: string;
  description: string;
  discipline: Discipline;
  format: TournamentFormat;
  visibility: TournamentVisibility;
  maxParticipants: string;
  scheduledAt: string;
  location: string;
}

export interface CreateTournamentFormErrors {
  name?: string;
  discipline?: string;
  format?: string;
  visibility?: string;
  maxParticipants?: string;
  scheduledAt?: string;
}

const DEFAULT_STATE: CreateTournamentFormState = {
  name: '',
  description: '',
  discipline: '8ball',
  format: 'single_elimination',
  visibility: 'public',
  maxParticipants: '8',
  scheduledAt: '',
  location: '',
};

export const useCreateTournamentForm = () => {
  const [form, setForm] = useState<CreateTournamentFormState>(DEFAULT_STATE);
  const [errors, setErrors] = useState<CreateTournamentFormErrors>({});

  const setField = <K extends keyof CreateTournamentFormState>(
    field: K,
    value: CreateTournamentFormState[K],
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof CreateTournamentFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: CreateTournamentFormErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.discipline) newErrors.discipline = 'Select a discipline';
    if (!form.format) newErrors.format = 'Select a format';
    if (!form.visibility) newErrors.visibility = 'Select visibility';

    const maxP = parseInt(form.maxParticipants, 10);
    if (isNaN(maxP) || maxP < 2 || maxP > 128) {
      newErrors.maxParticipants = 'Must be between 2 and 128';
    }

    if (!form.scheduledAt) {
      newErrors.scheduledAt = 'Schedule date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildInput = (): CreateTournamentInput => ({
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    discipline: form.discipline,
    format: form.format,
    visibility: form.visibility,
    maxParticipants: parseInt(form.maxParticipants, 10),
    scheduledAt: form.scheduledAt,
    location: form.location.trim() || undefined,
  });

  const reset = () => {
    setForm(DEFAULT_STATE);
    setErrors({});
  };

  return { form, errors, setField, validate, buildInput, reset };
};
