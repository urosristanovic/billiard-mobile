import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useMemo, useRef, useState } from 'react';
import { theme, typography, radius, spacing } from '@/constants/theme';

export interface FilterOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  options: FilterOption[];
  value: string;
  onSelect: (value: string) => void;
  isDark?: boolean;
}

export function DropdownFilter({
  options,
  value,
  onSelect,
  isDark = false,
}: DropdownFilterProps) {
  const t = isDark ? theme.dark : theme.light;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = useRef<View | null>(null);
  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  const close = () => {
    setIsOpen(false);
    setDropdownPosition(null);
  };

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const dropdownHeight = 320;
      const verticalGap = spacing[1];
      const screenPadding = spacing[4];
      const opensAbove =
        y + height + verticalGap + dropdownHeight >
        windowHeight - screenPadding;
      const top = opensAbove
        ? Math.max(screenPadding, y - dropdownHeight - verticalGap)
        : y + height + verticalGap;
      const left = Math.min(
        Math.max(screenPadding, x),
        windowWidth - width - screenPadding,
      );

      setDropdownPosition({ top, left, width });
      setIsOpen(true);
    });
  };

  const handleSelect = (nextValue: string) => {
    onSelect(nextValue);
    close();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={triggerRef}
        onPress={open}
        accessibilityRole='button'
        accessibilityLabel={selectedOption?.label ?? value}
        style={[
          styles.trigger,
          {
            backgroundColor: t.surface.raised,
            borderColor: t.primary[700],
          },
        ]}
      >
        <Text style={[styles.triggerLabel, { color: t.primary[200] }]}>
          {selectedOption?.label ?? value}
        </Text>
        <Text style={[styles.triggerIcon, { color: t.primary[300] }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={close}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={close} />
          {dropdownPosition ? (
            <View
              style={[
                styles.dropdown,
                {
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  backgroundColor: t.surface.raised,
                  borderColor: t.primary[700],
                },
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {options.map(option => {
                  const isSelected = option.value === value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleSelect(option.value)}
                      accessibilityRole='button'
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        styles.optionRow,
                        isSelected && {
                          backgroundColor: t.primary[500],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          {
                            color: isSelected
                              ? t.text.onPrimary
                              : t.text.primary,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[1],
  },
  trigger: {
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
  triggerIcon: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    marginLeft: spacing[2],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    borderRadius: radius.lg,
    borderWidth: 1,
    maxHeight: 320,
    paddingVertical: spacing[1],
  },
  optionRow: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    marginHorizontal: spacing[1],
    marginVertical: spacing[1] / 2,
  },
  optionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
});
