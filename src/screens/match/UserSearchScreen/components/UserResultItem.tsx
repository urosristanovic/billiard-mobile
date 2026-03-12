import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { theme, typography, spacing, radius } from "@/constants/theme";
import type { UserSearchResult } from "@/services/user";

interface UserResultItemProps {
  item: UserSearchResult;
  onSelect: (user: UserSearchResult) => void;
  isDark: boolean;
}

export const UserResultItem = ({ item, onSelect, isDark }: UserResultItemProps) => {
  const { t } = useTranslation("matches");
  const tk = isDark ? theme.dark : theme.light;

  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t("selectOpponentA11y")}
      style={[styles.item, { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] }]}
    >
      <View style={[styles.avatar, { backgroundColor: tk.background.secondary, borderColor: tk.primary[600] }]}>
        <Text style={[styles.avatarText, { color: tk.primary[300] }]}>
          {item.displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.displayName, { color: tk.text.primary }]}>{item.displayName}</Text>
        <Text style={[styles.username, { color: tk.text.muted }]}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  info: { flex: 1, gap: 2 },
  displayName: { fontSize: typography.size.base, fontWeight: typography.weight.semibold, fontFamily: typography.family.bodySemibold },
  username: { fontSize: typography.size.sm, fontFamily: typography.family.body },
});
