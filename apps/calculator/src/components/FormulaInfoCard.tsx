import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface FormulaInfoCardProps {
  title: string;
  formula?: string;
  explanation: string;
  defaultExpanded?: boolean;
  style?: ViewStyle;
}

export const FormulaInfoCard: React.FC<FormulaInfoCardProps> = ({
  title,
  formula,
  explanation,
  defaultExpanded = false,
  style,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme.colors.borderSubtle,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        style={styles.headerRow}
      >
        <View style={styles.titleWrap}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(245, 158, 11, 0.12)',
                borderColor: theme.isDark
                  ? 'rgba(245, 158, 11, 0.3)'
                  : 'rgba(245, 158, 11, 0.25)',
              },
            ]}
          >
            <Text style={styles.icon}>💡</Text>
          </View>
          <View style={styles.titleTextColumn}>
            <Text style={[styles.titleText, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.subHintText, { color: theme.colors.textMuted }]}>
              {isExpanded ? 'Formula & calculation logic' : 'Tap to view formula & rules'}
            </Text>
          </View>
        </View>

        {/* Sleek Toggle Pill */}
        <View
          style={[
            styles.togglePill,
            {
              backgroundColor: isExpanded
                ? theme.isDark
                  ? 'rgba(59, 130, 246, 0.25)'
                  : '#EFF6FF'
                : theme.isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : '#F1F5F9',
              borderColor: isExpanded
                ? theme.isDark
                  ? '#60A5FA'
                  : '#2563EB'
                : theme.isDark
                ? 'rgba(255, 255, 255, 0.18)'
                : '#CBD5E1',
            },
          ]}
        >
          <Text
            style={[
              styles.togglePillText,
              {
                color: isExpanded
                  ? theme.isDark
                    ? '#93C5FD'
                    : '#1D4ED8'
                  : theme.isDark
                  ? '#CBD5E1'
                  : '#334155',
                fontWeight: isExpanded ? '800' : '700',
              },
            ]}
          >
            {isExpanded ? '✕ Close' : 'View Formula'}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[
            styles.contentWrap,
            {
              borderTopColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        >
          {formula ? (
            <View
              style={[
                styles.formulaBox,
                {
                  backgroundColor: theme.isDark ? '#0B1120' : '#EFF6FF',
                  borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : '#BFDBFE',
                },
              ]}
            >
              <View style={styles.formulaHeaderRow}>
                <View
                  style={[
                    styles.formulaTag,
                    {
                      backgroundColor: theme.isDark
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(37, 99, 235, 0.12)',
                    },
                  ]}
                >
                  <Text style={[styles.formulaLabel, { color: theme.isDark ? '#60A5FA' : '#2563EB' }]}>
                    FORMULA & EQUATION
                  </Text>
                </View>
              </View>

              <Text
                selectable
                style={[
                  styles.formulaText,
                  { color: theme.isDark ? '#93C5FD' : '#1E40AF' },
                ]}
              >
                {formula}
              </Text>
            </View>
          ) : null}

          <View style={styles.explanationWrap}>
            <Text style={[styles.explanationText, { color: theme.isDark ? '#CBD5E1' : '#334155' }]}>
              {explanation}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.2,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  titleTextColumn: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  subHintText: {
    fontSize: 11,
    fontWeight: '500',
  },
  togglePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  formulaBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    marginBottom: 10,
  },
  formulaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formulaTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  formulaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  formulaText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  explanationWrap: {
    paddingHorizontal: 2,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});

