import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'elevated',
  padding = 'md',
}) => {
  const theme = useTheme();

  const paddings = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.surfaceSubtle,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.colors.surfaceCard,
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          ...theme.shadows.sm,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    padding: paddings[padding],
    ...getVariantStyles(),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
