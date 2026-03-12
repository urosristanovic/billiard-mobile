import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { ConfirmDialog, type ConfirmDialogVariant } from './ConfirmDialog';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  onConfirm?: () => void;
}

interface ConfirmDialogContextValue {
  confirm: (options: ConfirmDialogOptions) => void;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined);

export const ConfirmDialogProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();
  const [currentOptions, setCurrentOptions] =
    useState<ConfirmDialogOptions | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setCurrentOptions(options);
  }, []);

  const handleCancel = useCallback(() => {
    setCurrentOptions(null);
  }, []);

  const handleConfirm = useCallback(() => {
    const onConfirm = currentOptions?.onConfirm;
    setCurrentOptions(null);
    onConfirm?.();
  }, [currentOptions]);

  const value = useMemo<ConfirmDialogContextValue>(
    () => ({
      confirm,
    }),
    [confirm],
  );

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        visible={!!currentOptions}
        title={currentOptions?.title ?? ''}
        message={currentOptions?.message ?? ''}
        confirmLabel={currentOptions?.confirmLabel ?? ''}
        cancelLabel={currentOptions?.cancelLabel ?? t('cancel')}
        variant={currentOptions?.variant}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isDark={isDark}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);

  if (!context) {
    throw new Error(
      'useConfirmDialog must be used within ConfirmDialogProvider',
    );
  }

  return context;
};
