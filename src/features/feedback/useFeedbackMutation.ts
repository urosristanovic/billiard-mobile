import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/common/toast';
import { feedbackService, type SubmitFeedbackInput } from '@/services/feedback';
import { getAccessToken } from '@/features/auth/getAccessToken';

export const useFeedbackMutation = () => {
  const { t } = useTranslation('common');
  const { showToast } = useToast();

  const submitFeedback = useMutation({
    mutationFn: async (input: SubmitFeedbackInput) => {
      const token = await getAccessToken();
      return feedbackService.submit(token, input);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : t('error');
      showToast({ type: 'error', title: t('errorTitle'), message });
    },
  });

  return { submitFeedback };
};
