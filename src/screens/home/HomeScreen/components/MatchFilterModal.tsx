import { useMemo, useState } from 'react';
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
import { useOpponents } from '@/features/matches/useOpponents';
import { getOpponentLabel } from '@/features/matches/opponentLabel';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  MATCH_STATUS_LABELS,
  type Discipline,
  type MatchStatus,
} from '@/types/match';

export type DisciplineFilter = Discipline | 'all';
export type OpponentFilter = 'all' | string;
export type StatusFilter = MatchStatus | 'all';

export interface MatchFilters {
  discipline: DisciplineFilter;
  opponent: OpponentFilter;
  status: StatusFilter;
}

export const DEFAULT_FILTERS: MatchFilters = {
  discipline: 'all',
  opponent: 'all',
  status: 'all',
};

export const countActiveFilters = (filters: MatchFilters): number =>
  (filters.discipline !== 'all' ? 1 : 0) +
  (filters.opponent !== 'all' ? 1 : 0) +
  (filters.status !== 'all' ? 1 : 0);

interface MatchFilterModalProps {
  visible: boolean;
  applied: MatchFilters;
  onClose: () => void;
  onApply: (filters: MatchFilters) => void;
}

export const MatchFilterModal = ({
  visible,
  applied,
  onClose,
  onApply,
}: MatchFilterModalProps) => {
  const { t } = useTranslation('matches');
  const { t: tHome } = useTranslation('home');
  const { isDark, tk } = useTheme();

  const [draft, setDraft] = useState<MatchFilters>(applied);

  const { data: opponents = [] } = useOpponents();

  const disciplineOptions = useMemo(
    () => [
      { value: 'all' as DisciplineFilter, label: t('disciplines.all') },
      ...DISCIPLINES.map(d => ({
        value: d as DisciplineFilter,
        label: DISCIPLINE_LABELS[d],
      })),
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all' as StatusFilter, label: t('disciplines.all') },
      ...Object.entries(MATCH_STATUS_LABELS).map(([value, label]) => ({
        value: value as StatusFilter,
        label,
      })),
    ],
    [t],
  );

  const opponentOptions = useMemo(
    () => [
      { value: 'all', label: t('history.filters.allOpponents') },
      ...opponents
        .map(o => ({ value: o.id, label: getOpponentLabel(o) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ],
    [opponents, t],
  );

  const handleOpen = () => setDraft(applied);
  const handleReset = () => setDraft(DEFAULT_FILTERS);
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
            style={[
              styles.sheetHeader,
              { borderBottomColor: tk.border.default },
            ]}
          >
            <Text style={[styles.sheetTitle, { color: tk.text.primary }]}>
              {tHome('filters.title')}
            </Text>
            <TouchableOpacity
              onPress={handleReset}
              accessibilityRole='button'
              accessibilityLabel={tHome('filters.reset')}
            >
              <Text style={[styles.resetLabel, { color: tk.primary[600] }]}>
                {tHome('filters.reset')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Opponent */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('history.filters.user')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {opponentOptions.map(({ value, label }) =>
                    draft.opponent === value ? (
                      <PrimaryButton
                        key={value}
                        label={label}
                        compact
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, opponent: value }))
                        }
                      />
                    ) : (
                      <SecondaryButton
                        key={value}
                        label={label}
                        size='xs'
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, opponent: value }))
                        }
                      />
                    ),
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Discipline */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('history.filters.discipline')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {disciplineOptions.map(({ value, label }) =>
                    draft.discipline === value ? (
                      <PrimaryButton
                        key={value}
                        label={label}
                        compact
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, discipline: value }))
                        }
                      />
                    ) : (
                      <SecondaryButton
                        key={value}
                        label={label}
                        size='xs'
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, discipline: value }))
                        }
                      />
                    ),
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: tk.text.secondary }]}>
                {t('history.filters.status')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {statusOptions.map(({ value, label }) =>
                    draft.status === value ? (
                      <PrimaryButton
                        key={value}
                        label={label}
                        compact
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, status: value }))
                        }
                      />
                    ) : (
                      <SecondaryButton
                        key={value}
                        label={label}
                        size='xs'
                        isDark={isDark}
                        onPress={() =>
                          setDraft(prev => ({ ...prev, status: value }))
                        }
                      />
                    ),
                  )}
                </View>
              </ScrollView>
            </View>
          </View>

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
