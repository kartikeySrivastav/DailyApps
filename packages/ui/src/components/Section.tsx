import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface SectionProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
}

export const Section: React.FC<SectionProps> = ({
  title,
  actionText,
  onActionPress,
  children,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
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
        {actionText && onActionPress && (
          <TouchableOpacity onPress={onActionPress}>
            <Text
              style={[
                styles.action,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.sm,
                },
              ]}
            >
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
  },
  action: {
    fontWeight: '600',
  },
  content: {},
});
