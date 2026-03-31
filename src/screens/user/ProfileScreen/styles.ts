import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing[8],
    gap: spacing[8],
  },
  headerRow: {
    paddingBottom: spacing[2],
    marginTop: -spacing[4],
  },
  backButton: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hero: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarInitial: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    letterSpacing: 1,
  },
  displayName: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  username: {
    fontSize: typography.size.base,
    fontFamily: typography.family.bodyMedium,
  },
  location: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  bio: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: typography.size.sm * 1.6,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
  },
  bottomBarButton: {
    flex: 1,
  },
  modalForm: {
    gap: spacing[4],
  },
  languageSection: {
    gap: spacing[2],
  },
  languageLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: typography.size.sm * 1.5,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  languageButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  languageButtonText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
