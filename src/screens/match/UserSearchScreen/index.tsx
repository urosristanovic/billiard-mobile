import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useUserSearch } from "@/features/matches/useUserSearch";
import { ScreenLayout } from "@/components/common/layout";
import { EmptyState } from "@/components/common/states";
import { useTheme } from "@/hooks/useTheme";
import { UserResultItem } from "./components";
import { styles } from "./styles";
import type { UserSearchResult } from "@/services/user";

type LocalStackParamList = {
  CreateMatch: { selectedOpponent?: UserSearchResult };
  UserSearch: { excludeId?: string };
};

type Props = NativeStackScreenProps<LocalStackParamList, "UserSearch">;

const UserSearchScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation("matches");
  const { isDark, tk } = useTheme();
  const { query, setQuery, results, isFetching, isSearchMode } = useUserSearch(
    route.params.excludeId,
  );

  const handleSelect = (user: UserSearchResult) =>
    navigation.navigate("CreateMatch", { selectedOpponent: user });

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: tk.text.primary }]}>{t("search.title")}</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: tk.surface.raised, borderColor: tk.primary[700], color: tk.text.primary }]}
          placeholder={t("search.placeholder")}
          placeholderTextColor={tk.text.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          accessibilityLabel={t("selectOpponentA11y")}
        />
      </View>

      {isFetching ? (
        <ActivityIndicator style={styles.loader} color={tk.primary[600]} size="large" />
      ) : results.length === 0 && isSearchMode ? (
        <EmptyState title={t("search.empty")} description={t("search.emptyDesc")} isDark={isDark} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <UserResultItem item={item} onSelect={handleSelect} isDark={isDark} />
          )}
        />
      )}
    </ScreenLayout>
  );
};

export default UserSearchScreen;
