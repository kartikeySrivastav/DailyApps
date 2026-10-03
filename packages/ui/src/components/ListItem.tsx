import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  onPress?: () => void;
  badge?: string;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightAction,
  onPress,
  badge,
  style,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.left}>{leftIcon}</View>}
      <View style={styles.middle}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.base,
              },
            ]}
          >
            {title}
          </Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: theme.colors.surfaceSubtle }]}>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text
            numberOfLines={2}
            style={[
              styles.subtitle,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.fontSize.sm,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        {rightAction ? (
          rightAction
        ) : onPress ? (
          <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  left: {
    marginRight: 12,
  },
  middle: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
  },
  right: {
    marginLeft: 12,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
});
