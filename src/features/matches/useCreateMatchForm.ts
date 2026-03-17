import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Discipline, CreateMatchInput } from '@/types/match';
import type { UserSearchResult } from '@/services/user';

interface CreateMatchFormState {
  discipline: Discipline;
  opponent: UserSearchResult | null;
  myScore: string;
  opponentScore: string;
  isRated: boolean;
  isTournament: boolean;
}

const initialState: CreateMatchFormState = {
  discipline: '8ball',
  opponent: null,
  myScore: '0',
  opponentScore: '0',
  isRated: true,
  isTournament: false,
};

interface FormErrors {
  opponent?: string;
  myScore?: string;
  opponentScore?: string;
}

export const useCreateMatchForm = () => {
  const { t } = useTranslation('matches');
  const [form, setForm] = useState<CreateMatchFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = <K extends keyof CreateMatchFormState>(
    key: K,
    value: CreateMatchFormState[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key in errors) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.opponent) {
      newErrors.opponent = t('create.opponentRequired');
    }
    const myHasScore = form.myScore.trim() !== '';
    const oppHasScore = form.opponentScore.trim() !== '';

    if (!myHasScore) {
      newErrors.myScore = t('create.scoresRequired');
    }
    if (!oppHasScore) {
      newErrors.opponentScore = t('create.scoresRequired');
    }
    if (myHasScore && isNaN(Number(form.myScore))) {
      newErrors.myScore = t('create.scoreMustBeNumber');
    }
    if (oppHasScore && isNaN(Number(form.opponentScore))) {
      newErrors.opponentScore = t('create.scoreMustBeNumber');
    }

    if (
      myHasScore &&
      oppHasScore &&
      !isNaN(Number(form.myScore)) &&
      !isNaN(Number(form.opponentScore)) &&
      Number(form.myScore) === Number(form.opponentScore)
    ) {
      newErrors.myScore = t('create.scoresMustDiffer');
      newErrors.opponentScore = t('create.scoresMustDiffer');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toInput = (): CreateMatchInput => ({
    discipline: form.discipline,
    opponentId: form.opponent!.id,
    myScore: form.myScore !== '' ? Number(form.myScore) : null,
    opponentScore:
      form.opponentScore !== '' ? Number(form.opponentScore) : null,
    isRated: form.isRated,
    isTournament: form.isTournament,
  });

  const reset = () => {
    setForm(initialState);
    setErrors({});
  };

  return { form, errors, updateField, validate, toInput, reset };
};
