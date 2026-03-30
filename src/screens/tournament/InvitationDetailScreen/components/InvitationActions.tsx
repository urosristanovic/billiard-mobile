import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { shadows } from '@/constants/theme';
import { styles } from '../styles';

interface Props {
  isIncoming: boolean;
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: (reason?: string) => void;
  onCancel: () => void;
}

export const InvitationActions = ({
  isIncoming,
  isSubmitting,
  onAccept,
  onDecline,
  onCancel,
}: Props) => {
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { tk } = useTheme();

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    onDecline(declineReason);
  };

  return (
    <>
      <View style={styles.actionsRow}>
        {isSubmitting ? (
          <ActivityIndicator color={tk.primary[400]} style={styles.loader} />
        ) : isIncoming ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setDeclineReason('');
                setShowDeclineModal(true);
              }}
              style={[
                styles.actionBtn,
                { backgroundColor: tk.error.dark, borderColor: tk.error.border },
              ]}
              accessibilityRole='button'
            >
              <Text style={[styles.actionBtnText, { color: tk.error.text }]}>
                {t('invitation.rejectButton')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAccept}
              style={[
                styles.actionBtn,
                { backgroundColor: tk.primary[500], borderColor: tk.primary[700] },
              ]}
              accessibilityRole='button'
            >
              <Text style={[styles.actionBtnText, { color: tk.text.onPrimary }]}>
                {t('invitation.acceptButton')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={onCancel}
            style={[
              styles.actionBtn,
              styles.actionBtnFull,
              { backgroundColor: tk.error.dark, borderColor: tk.error.border },
            ]}
            accessibilityRole='button'
          >
            <Text style={[styles.actionBtnText, { color: tk.error.text }]}>
              {t('invitation.cancelButton')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showDeclineModal}
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={() => setShowDeclineModal(false)}
      >
        <View
          style={[styles.modalBackdrop, { backgroundColor: tk.background.overlay }]}
        >
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: tk.surface.default,
                borderColor: tk.error.border,
              },
              shadows.lg,
            ]}
            accessibilityRole='alert'
          >
            <Text style={[styles.modalTitle, { color: tk.text.primary }]}>
              {t('invitation.confirmDeclineTitle')}
            </Text>
            <Text style={[styles.modalMessage, { color: tk.text.secondary }]}>
              {t('invitation.confirmDeclineMessage')}
            </Text>

            <View style={styles.reasonSection}>
              <Text style={[styles.reasonLabel, { color: tk.text.muted }]}>
                {t('invitation.reasonLabel')}
              </Text>
              <TextInput
                value={declineReason}
                onChangeText={setDeclineReason}
                placeholder={t('invitation.reasonPlaceholder')}
                placeholderTextColor={tk.text.muted}
                multiline
                numberOfLines={3}
                style={[
                  styles.reasonInput,
                  {
                    backgroundColor: tk.surface.raised,
                    borderColor: tk.border.default,
                    color: tk.text.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowDeclineModal(false)}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: tk.surface.overlay,
                    borderColor: tk.border.default,
                  },
                ]}
              >
                <Text style={[styles.modalBtnText, { color: tk.text.secondary }]}>
                  {tCommon('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeclineConfirm}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: tk.error.dark,
                    borderColor: tk.error.border,
                  },
                ]}
              >
                <Text style={[styles.modalBtnText, { color: tk.error.text }]}>
                  {t('invitation.rejectButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
