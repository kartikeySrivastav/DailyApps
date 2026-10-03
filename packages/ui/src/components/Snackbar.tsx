import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
  variant?: 'info' | 'success' | 'error';
  style?: ViewStyle;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  actionText,
  onAction,
  onDismiss,
  duration = 3500,
  variant = 'info',
  style,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const getBorderColor = () => {
    if (variant === 'success') return theme.colors.success;
    if (variant === 'error') return theme.colors.error;
    return theme.colors.primary;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark ? '#1e293b' : '#0f172a',
          borderLeftColor: getBorderColor(),
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.md,
        },
        style,
      ]}
    >
      <Text style={styles.message}>{message}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction} style={styles.action}>
          <Text style={[styles.actionText, { color: theme.colors.primaryLight }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  message: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  action: {
    marginLeft: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
