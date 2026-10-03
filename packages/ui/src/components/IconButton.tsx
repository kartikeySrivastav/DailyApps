import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const dimensions = {
    sm: 32,
    md: 40,
    lg: 48,
  }[size];

  const getBackgroundColor = () => {
    if (variant === 'filled') return theme.colors.surfaceSubtle;
    return 'transparent';
  };

  const containerStyle: ViewStyle = {
    width: dimensions,
    height: dimensions,
    borderRadius: theme.borderRadius.full,
    backgroundColor: getBackgroundColor(),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: theme.colors.border,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[containerStyle, style]}
    >
      {icon}
    </TouchableOpacity>
  );
};
