import { useCallback, useMemo, useRef, useState } from 'react';
import type React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/theme';
import { styles } from './LocationPickerSheet.styles';

export type PickerItem = { id: string; name: string; code?: string };

interface Props {
  label: string;
  placeholder: string;
  items: PickerItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectOther: () => void;
  loading?: boolean;
  error?: string;
  required?: boolean;
  isDark?: boolean;
}

const OTHER_ID = '__other__';

export function LocationPickerSheet({
  label,
  placeholder,
  items,
  selectedId,
  onSelect,
  onSelectOther,
  loading = false,
  error,
  required = false,
  isDark: isDarkProp,
}: Props) {
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const sheetRef = useRef<BottomSheetModal>(null);
  const searchRef =
    useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
  const [query, setQuery] = useState('');

  const selectedName = useMemo(
    () => items.find(i => i.id === selectedId)?.name ?? null,
    [items, selectedId],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q));
  }, [items, query]);

  const openSheet = useCallback(() => {
    Keyboard.dismiss();
    setQuery('');
    sheetRef.current?.present();
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      sheetRef.current?.dismiss();
      setQuery('');
      if (id === OTHER_ID) {
        onSelectOther();
      } else {
        onSelect(id);
      }
    },
    [onSelect, onSelectOther],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: PickerItem | { id: string; name: string } }) => {
      const isOther = item.id === OTHER_ID;
      const isSelected = item.id === selectedId;
      return (
        <TouchableOpacity
          style={[
            styles.option,
            { borderBottomColor: tk.primary[900] },
            isSelected && { backgroundColor: tk.primary[900] },
          ]}
          onPress={() => handleSelect(item.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: isOther
                  ? tk.primary[400]
                  : isSelected
                    ? tk.text.primary
                    : tk.text.secondary,
                fontFamily: isOther
                  ? typography.family.bodySemibold
                  : typography.family.body,
              },
            ]}
          >
            {item.name}
          </Text>
          {'code' in item && item.code && !isOther ? (
            <Text style={[styles.optionCode, { color: tk.text.muted }]}>
              {item.code}
            </Text>
          ) : null}
          {isSelected && !isOther ? (
            <Text style={[styles.checkmark, { color: tk.primary[400] }]}>
              ✓
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    },
    [selectedId, handleSelect, tk],
  );

  const listData = useMemo<Array<PickerItem | { id: string; name: string }>>(
    () => [...filtered, { id: OTHER_ID, name: 'Other — request to add' }],
    [filtered],
  );

  return (
    <View>
      <Text
        style={[
          styles.label,
          { color: tk.text.secondary, fontFamily: typography.family.heading },
        ]}
      >
        {label}
        {required ? ' *' : ''}
      </Text>

      <TouchableOpacity
        onPress={openSheet}
        disabled={loading}
        style={[
          styles.trigger,
          {
            backgroundColor: tk.surface.raised,
            borderColor: error ? '#ef4444' : tk.primary[700],
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedName ? tk.text.primary : tk.text.muted },
          ]}
          numberOfLines={1}
        >
          {selectedName ?? placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size='small' color={tk.text.muted} />
        ) : (
          <Text style={[styles.triggerChevron, { color: tk.text.muted }]}>
            ▾
          </Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={['50%', '90%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: tk.background.secondary }}
        handleIndicatorStyle={{ backgroundColor: tk.text.muted }}
        keyboardBehavior='extend'
        keyboardBlurBehavior='restore'
        onChange={(index: number) => {
          if (index === 0) {
            setTimeout(() => searchRef.current?.focus(), 50);
          }
        }}
      >
        <View
          style={[
            styles.searchContainer,
            { borderBottomColor: tk.primary[800] },
          ]}
        >
          <Text
            style={[
              styles.sheetTitle,
              {
                color: tk.text.primary,
                fontFamily: typography.family.display,
              },
            ]}
          >
            {label.toUpperCase()}
          </Text>
          <BottomSheetTextInput
            ref={searchRef}
            style={[
              styles.search,
              {
                backgroundColor: tk.surface.raised,
                borderColor: tk.primary[700],
                color: tk.text.primary,
                fontFamily: typography.family.body,
              },
            ]}
            placeholder='Search...'
            placeholderTextColor={tk.text.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            clearButtonMode='while-editing'
            returnKeyType='search'
          />
        </View>

        <BottomSheetFlatList
          data={listData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.listContent}
        />
      </BottomSheetModal>
    </View>
  );
}
