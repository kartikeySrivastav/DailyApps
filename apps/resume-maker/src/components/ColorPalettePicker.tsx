import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ACCENT_PALETTES } from '../templates/documentHtmlGenerator';

interface ColorPalettePickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>
        🎨 Choose Theme Accent Color:
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {ACCENT_PALETTES.map((palette) => {
          const isSelected = selectedColor.toLowerCase() === palette.value.toLowerCase();
          return (
            <TouchableOpacity
              key={palette.value}
              onPress={() => onSelectColor(palette.value)}
              style={[
                styles.colorCircle,
                { backgroundColor: palette.value },
                isSelected && styles.selectedCircle,
              ]}
              activeOpacity={0.8}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#ffffff',
    transform: [{ scale: 1.15 }],
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
