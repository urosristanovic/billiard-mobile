import { StyleSheet } from "react-native";
import { typography, spacing, radius } from "@/constants/theme";

export const styles = StyleSheet.create({
  header: {
    padding: spacing[4],
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  searchInput: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  loader: {
    marginTop: spacing[8],
  },
  list: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
});
