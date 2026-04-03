import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  metaSection: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[3],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  statusBadge: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  statusText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaItem: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  dot: {
    fontSize: typography.size.sm,
  },
  metaDetails: {
    gap: spacing[2],
  },
  metaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  metaDetailIcon: {
    fontSize: typography.size.base,
    width: 22,
  },
  metaDetailText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.bodyMedium,
  },
  metaDetailLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.55,
    marginTop: spacing[1],
  },
  actionsWrapper: {
    paddingBottom: spacing[1],
    gap: spacing[2],
  },
  participantActionsWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  participantInviteBtn: {
    flex: 0,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  actionBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  actionBtnPrimary: {},
  actionBtnText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: spacing[4],
  },
  tab: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  noBracket: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
  participantsTab: {
    gap: spacing[5],
  },
  requestsSection: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[1],
  },
  requestsHeader: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  requestsEmpty: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    paddingVertical: spacing[2],
    textAlign: 'center',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  reqAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqAvatarText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
  },
  reqInfo: {
    flex: 1,
    gap: 2,
  },
  reqName: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  reqType: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  reqActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  reqAccept: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
  },
  reqReject: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  reqActionText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reqLoadingIndicator: {
    paddingHorizontal: spacing[4],
  },
  startHint: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
});
