import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import { DISCIPLINES, DISCIPLINE_LABELS, type Discipline } from '@/types/match';
import type { LeaderboardScope } from '@/types/rating';
import type { Group, CustomLeaderboard } from '@/types/group';
export type LeaderboardScopeFilter = LeaderboardScope;

export interface LeaderboardFilters {
  scope: LeaderboardScopeFilter;
  discipline: Discipline;
  selectedGroupId: string | undefined;
  selectedLeaderboardId: string | undefined;
  includeProvisional: boolean;
}

export const DEFAULT_LB_FILTERS: LeaderboardFilters = {
  scope: 'global',
  discipline: '8ball',
  selectedGroupId: undefined,
  selectedLeaderboardId: undefined,
  includeProvisional: true,
};

export const countActiveLbFilters = (filters: LeaderboardFilters): number =>
  (filters.scope !== 'global' ? 1 : 0) +
  (filters.discipline !== '8ball' ? 1 : 0) +
  (!filters.includeProvisional ? 1 : 0);


const SCOPES: LeaderboardScopeFilter[] = ['global', 'country', 'city', 'group', 'custom'];

interface LeaderboardFilterModalProps {
  visible: boolean;
  applied: LeaderboardFilters;
  groups: Group[];
  customLeaderboards: CustomLeaderboard[];
  onClose: () => void;
  onApply: (filters: LeaderboardFilters) => void;
}

export const LeaderboardFilterModal = ({
  visible,
  applied,
  groups,
  customLeaderboards,
  onClose,
  onApply,
}: LeaderboardFilterModalProps) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();

  const [draft, setDraft] = useState<LeaderboardFilters>(applied);

  const handleScopeChange = (newScope: LeaderboardScopeFilter) => {
    setDraft(prev => ({
      ...prev,
      scope: newScope,
      selectedGroupId:
        newScope === 'group' && groups.length > 0
          ? (prev.selectedGroupId ?? groups[0].id)
          : undefined,
      selectedLeaderboardId:
        newScope === 'custom' && customLeaderboards.length > 0
          ? (prev.selectedLeaderboardId ?? customLeaderboards[0].id)
          : undefined,
    }));
  };

  const handleOpen = () => setDraft(applied);
  const handleReset = () => setDraft(DEFAULT_LB_FILTERS);
  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const scopeLabels = useMemo(
    () =>
      SCOPES.map(s => ({
        value: s,
        label: t(`scopes.${s === 'group' ? 'groups' : s}`),
      })),
    [t],
  );

  const pillStyle = (active: boolean) => [
    styles.pill,
    {
      borderColor: active ? tk.primary[500] : tk.border.default,
      backgroundColor: active ? tk.primary[500] : 'transparent',
    },
  ];

  const pillTextStyle = (active: boolean) => [
    styles.pillText,
    { color: active ? tk.background.primary : tk.text.secondary },
  ];

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
          <View style={[styles.sheetHeader, { borderBottomColor: tk.border.default }]}>
            <Text style={[styles.sheetTitle, { color: tk.text.primary }]}>
              {t('filters.title')}
            </Text>
            <TouchableOpacity
              onPress={handleReset}
              accessibilityRole='button'
              accessibilityLabel={t('filters.reset')}
            >
              <Text style={[styles.resetLabel, { color: tk.primary[400] }]}>
                {t('filters.reset')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Scope */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('filters.scope')}
              </Text>
              <View style={styles.pillRow}>
                {scopeLabels.map(({ value, label }) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleScopeChange(value)}
                    style={pillStyle(draft.scope === value)}
                  >
                    <Text style={pillTextStyle(draft.scope === value)}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Group picker — only when scope=group */}
            {draft.scope === 'group' && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                  {t('filters.group')}
                </Text>
                {groups.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pillRow}>
                      {groups.map(g => (
                        <TouchableOpacity
                          key={g.id}
                          onPress={() =>
                            setDraft(prev => ({ ...prev, selectedGroupId: g.id }))
                          }
                          style={pillStyle(draft.selectedGroupId === g.id)}
                        >
                          <Text style={pillTextStyle(draft.selectedGroupId === g.id)}>
                            {g.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <View style={[styles.emptyNote, { backgroundColor: tk.primary[900] }]}>
                    <Text style={[styles.emptyNoteText, { color: tk.text.muted }]}>
                      {t('blocked.noGroups')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Custom leaderboard picker — only when scope=custom */}
            {draft.scope === 'custom' && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                  {t('filters.selectLeaderboard')}
                </Text>
                {customLeaderboards.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pillRow}>
                      {customLeaderboards.map(lb => (
                        <TouchableOpacity
                          key={lb.id}
                          onPress={() =>
                            setDraft(prev => ({ ...prev, selectedLeaderboardId: lb.id }))
                          }
                          style={pillStyle(draft.selectedLeaderboardId === lb.id)}
                        >
                          <Text style={pillTextStyle(draft.selectedLeaderboardId === lb.id)}>
                            {lb.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <View style={[styles.emptyNote, { backgroundColor: tk.primary[900] }]}>
                    <Text style={[styles.emptyNoteText, { color: tk.text.muted }]}>
                      {t('blocked.noCustomLeaderboards')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Discipline */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('filters.discipline')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {DISCIPLINES.map(d => (
                    <TouchableOpacity
                      key={d}
                      onPress={() =>
                        setDraft(prev => ({ ...prev, discipline: d }))
                      }
                      style={pillStyle(draft.discipline === d)}
                    >
                      <Text style={pillTextStyle(draft.discipline === d)}>
                        {DISCIPLINE_LABELS[d]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Provisional toggle */}
            <View style={[styles.toggleRow, { borderTopColor: tk.border.default }]}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('filters.includeProvisional')}
              </Text>
              <Switch
                value={draft.includeProvisional}
                onValueChange={v =>
                  setDraft(prev => ({ ...prev, includeProvisional: v }))
                }
                trackColor={{ false: tk.primary[800], true: tk.primary[500] }}
                thumbColor={tk.text.onPrimary}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <SecondaryButton
              label={t('filters.close')}
              onPress={onClose}
              isDark={isDark}
              style={styles.actionButton}
            />
            <PrimaryButton
              label={t('filters.apply')}
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
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  emptyNote: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
    borderRadius: radius.md,
    overflow: 'visible',
  },
  emptyNoteText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    lineHeight: 20,
    includeFontPadding: false,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[3],
    borderTopWidth: 1,
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
