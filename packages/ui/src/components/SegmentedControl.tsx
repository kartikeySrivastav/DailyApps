import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceSubtle,
          borderRadius: theme.borderRadius.md,
        },
        style,
      ]}
    >
      {options.map((option, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => onChange(idx)}
            style={[
              styles.segment,
              {
                backgroundColor: isSelected ? theme.colors.surface : 'transparent',
                borderRadius: theme.borderRadius.sm,
                ...(isSelected ? theme.shadows.sm : {}),
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? theme.colors.text : theme.colors.textMuted,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    height: 40,
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
  },
});
