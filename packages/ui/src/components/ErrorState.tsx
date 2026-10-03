import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { Button } from './Button';

export interface ErrorStateProps {
  icon?: string;
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon = '⚠️',
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.lg,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.textMuted,
            fontSize: theme.typography.fontSize.sm,
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="primary"
          size="sm"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 18,
  },
});
