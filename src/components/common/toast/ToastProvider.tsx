import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Toast, type ToastType } from './Toast';

interface ToastPayload {
  title: string;
  message?: string;
  type?: ToastType;
  durationMs?: number;
}

interface ToastState {
  title: string;
  message?: string;
  type: ToastType;
  durationMs: number;
}

interface ToastContextValue {
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
}

const DEFAULT_DURATION_MS = 3500;
const INITIAL_OFFSET = -140;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const translateY = useRef(new Animated.Value(INITIAL_OFFSET)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (!dismissTimerRef.current) return;
    clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = null;
  }, []);

  const hideToast = useCallback(() => {
    clearDismissTimer();
    Animated.timing(translateY, {
      toValue: INITIAL_OFFSET,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [clearDismissTimer, translateY]);

  const showToast = useCallback(
    ({
      title,
      message,
      type = 'info',
      durationMs = DEFAULT_DURATION_MS,
    }: ToastPayload) => {
      clearDismissTimer();
      setToast({ title, message, type, durationMs });
      translateY.setValue(INITIAL_OFFSET);

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      }).start();

      dismissTimerRef.current = setTimeout(() => {
        hideToast();
      }, durationMs);
    },
    [clearDismissTimer, hideToast, translateY],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy < -4 || Math.abs(gestureState.dy) > 8,
        onPanResponderMove: (_, gestureState) => {
          const nextValue = Math.min(0, gestureState.dy);
          translateY.setValue(nextValue);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -30) {
            hideToast();
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 180,
            mass: 0.8,
          }).start();
        },
      }),
    [hideToast, translateY],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View pointerEvents='box-none' style={StyleSheet.absoluteFill}>
          <View {...panResponder.panHandlers}>
            <Toast
              title={toast.title}
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
              topOffset={Math.max(insets.top + spacing[2], spacing[4])}
              translateY={translateY}
              closeLabel={t('close')}
              isDark={isDark}
            />
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
