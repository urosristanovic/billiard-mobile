import { View, Text, StyleSheet } from 'react-native';
import { Loading } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';
import type { PlayerRating } from '@/types/rating';

interface RatingsSectionProps {
  ratings: PlayerRating[];
  isDark: boolean;
  isLoading?: boolean;
}

interface RatingCardProps {
  rating: PlayerRating;
  isDark: boolean;
}

const RatingCard = ({ rating, isDark: _isDark }: RatingCardProps) => {
  const { t } = useTranslation('ratings');
  const { tk } = useTheme();

  const displayRating = Math.round(rating.rating);
  const displayRD = Math.round(rating.ratingDeviation);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.raised,
          borderColor: rating.isProvisional
            ? tk.rating.provisional
            : tk.primary[800],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.disciplineName, { color: tk.text.primary }]}>
          {t(`disciplines.${rating.discipline}`)}
        </Text>
        {rating.isProvisional && (
          <View
            style={[
              styles.provisionalBadge,
              {
                backgroundColor: tk.background.secondary,
                borderColor: tk.rating.provisional,
              },
            ]}
          >
            <Text
              style={[
                styles.provisionalText,
                { color: tk.rating.provisional },
              ]}
            >
              {t('provisional')}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.ratingNumber, { color: tk.text.primary }]}>
        {displayRating}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={[styles.rdText, { color: tk.text.muted }]}>
          {t('rd', { value: displayRD })}
        </Text>
        <View style={styles.wlRow}>
          <Text style={[styles.wlText, { color: tk.rating.trendUp }]}>
            {t('wins', { count: rating.wins })}
          </Text>
          <Text style={[styles.wlSeparator, { color: tk.text.muted }]}>
            {' / '}
          </Text>
          <Text style={[styles.wlText, { color: tk.rating.trendDown }]}>
            {t('losses', { count: rating.losses })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const RatingsSection = ({ ratings, isDark, isLoading }: RatingsSectionProps) => {
  const { t } = useTranslation('ratings');
  const { tk } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
        {t('title').toUpperCase()}
      </Text>
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <Loading size='large' />
        </View>
      ) : ratings.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: tk.surface.raised, borderColor: tk.border.subtle },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: tk.text.secondary }]}>
            {t('noRatings')}
          </Text>
          <Text style={[styles.emptyDescription, { color: tk.text.muted }]}>
            {t('noRatingsDescription')}
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {ratings.map(rating => (
            <RatingCard
              key={`${rating.userId}-${rating.discipline}`}
              rating={rating}
              isDark={isDark}
            />
          ))}
        </View>
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  section: {
    gap: spacing[3],
  },
  loadingWrapper: {
    paddingVertical: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    letterSpacing: 1,
  },
  grid: {
    gap: spacing[3],
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disciplineName: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  provisionalBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  provisionalText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingNumber: {
    fontSize: typography.size['3xl'],
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rdText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  wlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wlText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodySemibold,
  },
  wlSeparator: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  emptyCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[5],
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyTitle: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyDescription: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: typography.size.sm * 1.6,
  },
});
