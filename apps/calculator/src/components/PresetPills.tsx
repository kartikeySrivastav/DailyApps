import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface PillOption {
  label: string;
  value: string | number;
}

export interface PresetPillsProps {
  options: (PillOption | string | number)[];
  selectedValue: string | number;
  onSelect: (value: any) => void;
  scrollable?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const PresetPills: React.FC<PresetPillsProps> = ({
  options,
  selectedValue,
  onSelect,
  scrollable = false,
  size = 'md',
  style,
}) => {
  const theme = useTheme();

  const normalizedOptions: PillOption[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
      return opt as PillOption;
    }
    return {
      label: String(opt),
      value: opt,
    };
  });

  const renderPill = (option: PillOption) => {
    const isSelected = String(option.value) === String(selectedValue);

    const pillBg = isSelected
      ? '#2563EB'
      : theme.isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : '#F1F5F9';

    const pillBorder = isSelected
      ? theme.isDark
        ? '#60A5FA'
        : '#1D4ED8'
      : theme.isDark
      ? 'rgba(255, 255, 255, 0.16)'
      : '#CBD5E1';

    const pillText = isSelected
      ? '#FFFFFF'
      : theme.isDark
      ? '#F1F5F9'
      : '#1E293B';

    return (
      <TouchableOpacity
        key={String(option.value)}
        onPress={() => onSelect(option.value)}
        activeOpacity={0.7}
        style={[
          styles.pill,
          size === 'sm' ? styles.pillSm : styles.pillMd,
          {
            backgroundColor: pillBg,
            borderColor: pillBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.pillText,
            size === 'sm' ? styles.pillTextSm : styles.pillTextMd,
            { color: pillText, fontWeight: isSelected ? '800' : '600' },
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, style]}
      >
        {normalizedOptions.map(renderPill)}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.wrapContainer, style]}>
      {normalizedOptions.map(renderPill)}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSm: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillMd: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  pillText: {
    textAlign: 'center',
  },
  pillTextSm: {
    fontSize: 12,
  },
  pillTextMd: {
    fontSize: 13,
  },
});
