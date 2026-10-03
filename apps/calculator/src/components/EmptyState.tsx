import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@dailyapps/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState Component
 * 
 * Reusable component for displaying empty states throughout the app.
 * Usage: Empty favorites, empty history, no search results, etc.
 * 
 * @example
 * <EmptyState
 *   icon="⭐"
 *   title="No favorites yet"
 *   message="Tap the star icon in any calculator to add it here."
 *   actionLabel="Explore Calculators"
 *   onAction={() => navigation.navigate('Home')}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Icon Circle */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: theme.isDark
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(59, 130, 246, 0.1)',
            borderColor: theme.isDark
              ? 'rgba(59, 130, 246, 0.3)'
              : 'rgba(59, 130, 246, 0.2)',
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>

      {/* Message */}
      <Text style={[styles.message, { color: theme.colors.textMuted }]}>
        {message}
      </Text>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.8}
          style={[
            styles.actionBtn,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  actionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
