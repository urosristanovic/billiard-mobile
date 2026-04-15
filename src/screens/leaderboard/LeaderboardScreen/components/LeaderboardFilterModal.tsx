import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { ToggleSwitch } from '@/components/common/forms';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import type { CustomLeaderboard } from '@/types/group';

export interface LeaderboardFilters {
  includeProvisional: boolean;
  selectedLeaderboardId?: string;
}

export const DEFAULT_LB_FILTERS: LeaderboardFilters = {
  includeProvisional: true,
  selectedLeaderboardId: undefined,
};

export const countActiveLbFilters = (
  f: LeaderboardFilters,
  defaultLeaderboardId?: string | null,
): number => {
  let count = 0;
  if (!f.includeProvisional) count += 1;
  if (
    f.selectedLeaderboardId &&
    f.selectedLeaderboardId !== (defaultLeaderboardId ?? undefined)
  )
    count += 1;
  return count;
};

interface Props {
  visible: boolean;
  applied: LeaderboardFilters;
  leaderboards: CustomLeaderboard[];
  defaultLeaderboardId?: string | null;
  onClose: () => void;
  onApply: (filters: LeaderboardFilters) => void;
}

export const LeaderboardFilterModal = ({
  visible,
  applied,
  leaderboards,
  defaultLeaderboardId,
  onClose,
  onApply,
}: Props) => {
  const { t } = useTranslation('leaderboard');
  const { t: tHome } = useTranslation('home');
  const { isDark, tk } = useTheme();

  const [draft, setDraft] = useState<LeaderboardFilters>(applied);

  const handleOpen = () => {
    if (!applied.selectedLeaderboardId && defaultLeaderboardId) {
      const defaultLb = leaderboards.find(lb => lb.id === defaultLeaderboardId);
      if (defaultLb) {
        setDraft({ ...applied, selectedLeaderboardId: defaultLb.id });
        return;
      }
    }
    setDraft(applied);
  };

  const handleReset = () => {
    const defaultLb =
      (defaultLeaderboardId &&
        leaderboards.find(lb => lb.id === defaultLeaderboardId)) ||
      leaderboards[0] ||
      null;
    setDraft({
      ...DEFAULT_LB_FILTERS,
      selectedLeaderboardId: defaultLb?.id,
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={StyleSheet.absoluteFill}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: tk.background.primary,
              borderColor: tk.primary[800],
            },
          ]}
        >
          {/* Header */}
          <View
            style={[styles.sheetHeader, { borderBottomColor: tk.border.default }]}
          >
            <Text style={[styles.sheetTitle, { color: tk.text.primary }]}>
              {tHome('filters.title')}
            </Text>
            <TouchableOpacity onPress={handleReset} accessibilityRole='button'>
              <Text style={[styles.resetLabel, { color: tk.primary[600] }]}>
                {tHome('filters.reset')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Include provisional */}
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: tk.text.primary }]}>
                {t('filterIncludeProvisional')}
              </Text>
              <ToggleSwitch
                value={draft.includeProvisional}
                onValueChange={v =>
                  setDraft(prev => ({ ...prev, includeProvisional: v }))
                }
                trackColor={{ false: tk.border.default, true: tk.primary[600] }}
                thumbColor={tk.text.onPrimary}
              />
            </View>

            {/* Leaderboard */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('filterLeaderboard')}
              </Text>

              {leaderboards.length === 0 ? (
                <Text style={[styles.noneLabel, { color: tk.text.muted }]}>
                  NONE
                </Text>
              ) : (
                <View style={styles.lbList}>
                  {leaderboards.map(lb => {
                    const selected = draft.selectedLeaderboardId === lb.id;
                    return (
                      <Pressable
                        key={lb.id}
                        onPress={() =>
                          setDraft(prev => ({
                            ...prev,
                            selectedLeaderboardId: lb.id,
                          }))
                        }
                        style={({ pressed }) => [
                          styles.lbRow,
                          {
                            borderColor: selected
                              ? tk.primary[500]
                              : tk.border.default,
                            backgroundColor: selected
                              ? `${tk.primary[500]}14`
                              : tk.surface.default,
                          },
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.lbName,
                            {
                              color: selected
                                ? tk.primary[400]
                                : tk.text.primary,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {lb.name}
                        </Text>
                        <View
                          style={[
                            styles.visiBadge,
                            {
                              backgroundColor: lb.isPublic
                                ? `${tk.success.default}20`
                                : `${tk.primary[500]}20`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.visiBadgeText,
                              {
                                color: lb.isPublic
                                  ? tk.success.default
                                  : tk.primary[500],
                              },
                            ]}
                          >
                            {lb.isPublic ? t('filterPublic') : t('filterPrivate')}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <SecondaryButton
              label={tHome('filters.close')}
              onPress={onClose}
              isDark={isDark}
              style={styles.actionButton}
            />
            <PrimaryButton
              label={tHome('filters.apply')}
              onPress={handleApply}
              isDark={isDark}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: spacing[8],
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resetLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[4],
  },
  section: {
    gap: spacing[2],
  },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
  },
  toggleLabel: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  noneLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingVertical: spacing[2],
  },
  lbList: {
    gap: spacing[2],
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing[3],
  },
  lbName: {
    flex: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
  },
  visiBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  visiBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
});
