import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface BreakdownRowProps {
  label: string;
  value: string;
  subLabel?: string;
  dotColor?: string;
  isBold?: boolean;
  isHighlight?: boolean;
  valueColor?: string;
  showDivider?: boolean;
  style?: ViewStyle;
}

export const BreakdownRow: React.FC<BreakdownRowProps> = ({
  label,
  value,
  subLabel,
  dotColor,
  isBold = false,
  isHighlight = false,
  valueColor,
  showDivider = false,
  style,
}) => {
  const theme = useTheme();

  const labelColor = isHighlight
    ? theme.colors.text
    : isBold
    ? theme.isDark ? '#F1F5F9' : '#1E293B'
    : theme.isDark ? '#94A3B8' : '#64748B';

  const finalValueColor =
    valueColor ||
    (isHighlight
      ? theme.colors.primary
      : theme.isDark
      ? '#F8FAFC'
      : '#0F172A');

  return (
    <>
      <View
        style={[
          styles.row,
          isHighlight && [
            styles.highlightRow,
            {
              backgroundColor: theme.isDark
                ? 'rgba(37, 99, 235, 0.12)'
                : '#EFF6FF',
              borderColor: theme.isDark ? '#1D4ED8' : '#BFDBFE',
            },
          ],
          style,
        ]}
      >
        <View style={styles.leftCol}>
          <View style={styles.labelContainer}>
            {dotColor ? (
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
            ) : null}
            <Text
              style={[
                styles.label,
                {
                  color: labelColor,
                  fontWeight: isBold || isHighlight ? '800' : '600',
                  fontSize: isBold ? 14 : 13,
                },
              ]}
            >
              {label}
            </Text>
          </View>
          {subLabel ? (
            <Text
              style={[
                styles.subLabel,
                { color: theme.isDark ? '#64748B' : '#94A3B8' },
              ]}
            >
              {subLabel}
            </Text>
          ) : null}
        </View>

        <Text
          style={[
            styles.value,
            {
              color: finalValueColor,
              fontWeight: isBold || isHighlight ? '900' : '700',
              fontSize: isBold ? 16 : 14,
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>

      {showDivider ? (
        <View
          style={[
            styles.divider,
            {
              backgroundColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : '#E2E8F0',
            },
          ]}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  highlightRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4,
  },
  leftCol: {
    flex: 1.2,
    paddingRight: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  label: {
    letterSpacing: 0.1,
    flex: 1,
  },
  subLabel: {
    fontSize: 11,
    marginTop: 2,
    marginLeft: 16,
    fontWeight: '500',
  },
  value: {
    flex: 1,
    letterSpacing: 0.2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
