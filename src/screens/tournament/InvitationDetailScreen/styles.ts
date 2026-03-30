import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  back: {
    fontSize: 22,
    fontFamily: typography.family.display,
    width: 32,
  },
  backPlaceholder: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[12],
  },
  intro: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    textAlign: 'center',
  },
  tournamentCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  tournamentName: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  tournamentMeta: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  ratedBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1] + 2,
    paddingVertical: 2,
  },
  ratedBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tournamentDescription: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.55,
    marginTop: spacing[1],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  loader: {
    flex: 1,
    paddingVertical: spacing[4],
  },
  actionBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnFull: {
    flex: 1,
  },
  actionBtnText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  modalDialog: {
    borderRadius: radius.xl,
    borderWidth: 2,
    padding: spacing[6],
    gap: spacing[4],
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  modalMessage: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  reasonSection: {
    gap: spacing[2],
  },
  reasonLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonInput: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  modalBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
