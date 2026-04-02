import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { FormField } from '@/components/common/forms';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { useToast } from '@/components/common/toast';
import { useFeedbackMutation } from '@/features/feedback/useFeedbackMutation';
import { useTheme } from '@/hooks/useTheme';
import type { FeedbackType } from '@/services/feedback';
import { styles } from './styles';

interface FeedbackScreenProps {
  navigation: {
    goBack: () => void;
  };
  isDark?: boolean;
}

type FeedbackTypeOption = {
  value: FeedbackType;
  labelKey: 'feedback.typeSuggestion' | 'feedback.typeBug' | 'feedback.typeOther';
};

const TYPE_OPTIONS: FeedbackTypeOption[] = [
  { value: 'suggestion', labelKey: 'feedback.typeSuggestion' },
  { value: 'bug', labelKey: 'feedback.typeBug' },
  { value: 'other', labelKey: 'feedback.typeOther' },
];

const FeedbackScreen = ({
  navigation,
  isDark: isDarkProp,
}: FeedbackScreenProps) => {
  const { t } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const { showToast } = useToast();
  const { submitFeedback } = useFeedbackMutation();
  const isDark = isDarkProp ?? systemDark;

  const [type, setType] = useState<FeedbackType>('suggestion');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState<string>();

  const validate = () => {
    if (!message.trim()) {
      setMessageError(tAuth('feedback.messageRequired'));
      return false;
    }
    if (message.trim().length < 10) {
      setMessageError(tAuth('feedback.messageTooShort'));
      return false;
    }
    setMessageError(undefined);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    submitFeedback.mutate(
      { type, message: message.trim() },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: t('successTitle'),
            message: tAuth('feedback.successMessage'),
          });
          navigation.goBack();
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={tAuth('feedback.title')}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.subtitle, { color: tk.text.muted }]}>
              {tAuth('feedback.subtitle')}
            </Text>
            <View style={[styles.divider, { backgroundColor: tk.primary[500] }]} />
          </View>

          <View style={styles.form}>
            <View>
              <Text style={[styles.typeLabel, { color: tk.text.primary }]}>
                {tAuth('feedback.typeLabel')}
              </Text>
              <View style={styles.typeOptions}>
                {TYPE_OPTIONS.map(option => {
                  const selected = type === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.typeOption,
                        {
                          borderColor: selected ? tk.primary[500] : tk.border.default,
                          backgroundColor: selected ? tk.primary[900] : tk.background.secondary,
                        },
                      ]}
                      onPress={() => setType(option.value)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.typeRadio,
                          { borderColor: selected ? tk.primary[400] : tk.border.default },
                        ]}
                      >
                        {selected && (
                          <View
                            style={[
                              styles.typeRadioInner,
                              { backgroundColor: tk.primary[400] },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.typeOptionText,
                          { color: selected ? tk.primary[300] : tk.text.secondary },
                        ]}
                      >
                        {tAuth(option.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <FormField
              label={tAuth('feedback.messageLabel')}
              value={message}
              onChangeText={v => {
                setMessage(v);
                if (messageError) setMessageError(undefined);
              }}
              error={messageError}
              multiline
              numberOfLines={5}
              placeholder={tAuth('feedback.messagePlaceholder')}
              style={styles.messageInput}
              isDark={isDark}
            />
          </View>

          <View style={styles.buttons}>
            <SecondaryButton
              label={t('cancel')}
              onPress={() => navigation.goBack()}
              isDark={isDark}
              style={styles.button}
            />
            <PrimaryButton
              label={tAuth('feedback.submitButton')}
              onPress={handleSubmit}
              loading={submitFeedback.isPending}
              isDark={isDark}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default FeedbackScreen;
