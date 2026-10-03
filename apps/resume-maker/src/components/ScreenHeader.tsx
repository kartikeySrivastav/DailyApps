/**
 * ScreenHeader — Shared header component for resume-maker screens.
 * Replaces the duplicated headerBar style across 10+ screens.
 *
 * Usage:
 *   <ScreenHeader title="Education" subtitle="Add qualifications" onBack={...} rightElement={...} />
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@dailyapps/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      {/* Back button (optional) */}
      {onBack ? (
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}

      {/* Title + Subtitle */}
      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right element (optional) */}
      <View style={styles.right}>
        {rightElement ?? <View style={styles.backBtn} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  right: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
