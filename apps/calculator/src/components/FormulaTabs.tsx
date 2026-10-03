import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface FormulaTabsProps {
  formula?: string;
  formulaLabel?: string;
  howItWorks?: string | string[];
  example?: string | { input: string; calculation: string; output: string };
  defaultTab?: 'formula' | 'how_it_works' | 'example';
  style?: ViewStyle;
}

export const FormulaTabs: React.FC<FormulaTabsProps> = ({
  formula,
  formulaLabel = 'FORMULA & EQUATION',
  howItWorks,
  example,
  defaultTab,
  style,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'formula' | 'how_it_works' | 'example' | null>(
    defaultTab || 'formula'
  );

  const toggleTab = (tab: 'formula' | 'how_it_works' | 'example') => {
    setActiveTab(tab);
  };

  const tabs: { key: 'formula' | 'how_it_works' | 'example'; label: string }[] = [
    { key: 'formula', label: 'Formula' },
    { key: 'how_it_works', label: 'How it works' },
    { key: 'example', label: 'Example' },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* 3 Pills Row */}
      <View
        style={[
          styles.tabsRow,
          {
            backgroundColor: theme.isDark ? '#101726' : '#F1F5F9',
            borderColor: theme.isDark ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => toggleTab(tab.key)}
              activeOpacity={0.7}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  borderColor: isActive ? (theme.isDark ? '#60A5FA' : '#1D4ED8') : 'transparent',
                  borderWidth: isActive ? 1 : 0,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                style={[
                  styles.tabBtnText,
                  {
                    color: isActive ? '#FFFFFF' : theme.isDark ? '#94A3B8' : '#475569',
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Expanded Content Box */}
      {activeTab && (
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
            },
          ]}
        >
          {/* TAB 1: FORMULA */}
          {activeTab === 'formula' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)',
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: theme.isDark ? '#60A5FA' : '#2563EB' }]}>
                  {formulaLabel}
                </Text>
              </View>
              {formula ? (
                <Text style={[styles.formulaEquation, { color: theme.colors.text }]}>
                  {formula}
                </Text>
              ) : null}
            </View>
          )}

          {/* TAB 2: HOW IT WORKS */}
          {activeTab === 'how_it_works' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor: theme.isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)',
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: '#10B981' }]}>
                  HOW IT WORKS
                </Text>
              </View>
              {Array.isArray(howItWorks) ? (
                howItWorks.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepBullet}>
                      <Text style={styles.stepBulletText}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.stepText, { color: theme.colors.text }]}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.stepText, { color: theme.colors.text }]}>
                  {howItWorks || 'Input values are computed using compounding and standard economic formulas.'}
                </Text>
              )}
            </View>
          )}

          {/* TAB 3: EXAMPLE */}
          {activeTab === 'example' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.12)',
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: '#F59E0B' }]}>
                  PRACTICAL EXAMPLE
                </Text>
              </View>
              {typeof example === 'object' && example !== null ? (
                <View style={styles.exampleBox}>
                  <Text style={[styles.exampleLabel, { color: theme.colors.textMuted }]}>Inputs:</Text>
                  <Text style={[styles.exampleText, { color: theme.colors.text }]}>{example.input}</Text>
                  <Text style={[styles.exampleLabel, { color: theme.colors.textMuted, marginTop: 6 }]}>Calculation:</Text>
                  <Text style={[styles.exampleText, { color: theme.colors.text }]}>{example.calculation}</Text>
                  <Text style={[styles.exampleLabel, { color: theme.colors.textMuted, marginTop: 6 }]}>Result:</Text>
                  <Text style={[styles.exampleResultText, { color: '#10B981' }]}>{example.output}</Text>
                </View>
              ) : (
                <Text style={[styles.stepText, { color: theme.colors.text }]}>
                  {example || 'E.g., An initial investment at 12% p.a. doubles in approximately 6 years.'}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 4,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 12.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  contentCard: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.2,
  },
  sectionWrap: {
    gap: 8,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  formulaEquation: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 2,
  },
  stepBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepBulletText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepText: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  exampleBox: {
    gap: 2,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  exampleText: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  exampleResultText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
