import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  size,
  color,
  style,
}) => {
  const theme = useTheme();
  const dividerColor = color || theme.colors.borderSubtle;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {
            backgroundColor: dividerColor,
            width: size || 1,
            marginHorizontal: theme.spacing.sm,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          backgroundColor: dividerColor,
          height: size || 1,
          marginVertical: theme.spacing.sm,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});
