import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme, useThemeContext } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { calculatorToolCatalog, SMARTCALC_CATEGORIES } from '../config/toolCatalog';
import { setHapticsEnabled, isHapticsEnabled, haptic } from '../utils/hapticUtils';
import { useCalculationHistory } from '../hooks';

interface MoreScreenProps {
  navigation?: any;
  onGoBack?: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ navigation, onGoBack }) => {
  const theme = useTheme();
  const { mode, setMode } = useThemeContext();
  const storage = useAppStorage();
  const { clearHistory: clearCalcHistory } = useCalculationHistory();

  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());
  const [precision, setPrecision] = useState<number>(2);

  useEffect(() => {
    async function loadSettings() {
      const savedHaptics = await storage.getJson<boolean>('haptics_enabled', false);
      setHapticsOn(savedHaptics);
      setHapticsEnabled(savedHaptics);

      const savedPrecision = await storage.getJson<number>('calc_decimal_precision', 2);
      setPrecision(savedPrecision);
    }
    loadSettings();
  }, [storage]);

  const handleToggleHaptics = async (val: boolean) => {
    setHapticsOn(val);
    setHapticsEnabled(val);
    if (val) haptic.light();
    await storage.setJson('haptics_enabled', val);
  };

  const handleSelectPrecision = async (p: number) => {
    setPrecision(p);
    haptic.selection();
    await storage.setJson('calc_decimal_precision', p);
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleClearCalculations = () => {
    Alert.alert(
      'Clear Calculation Records?',
      'All saved calculations from loan, tax, trading, and math screens will be permanently cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Calculations',
          style: 'destructive',
          onPress: async () => {
            await clearCalcHistory();
            haptic.heavy();
            Alert.alert('Cleared', 'Calculation history has been cleared.');
          },
        },
      ]
    );
  };

  const handleClearAllRecents = () => {
    Alert.alert(
      'Clear Recent Tools & Cache?',
      'This will reset your recently used calculator shortcut list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Recents',
          style: 'destructive',
          onPress: async () => {
            await storage.clearRecentTools();
            await storage.setJson('recent_tool_timestamps', {});
            haptic.heavy();
            Alert.alert('Cleared', 'Recent tools history has been reset.');
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: 'SmartCalc - All-in-One Calculator',
        message:
          'SmartCalc: Fast, accurate All-in-One Calculator with EMI, SIP, Stock P&L, GST, and 30+ tools. Clean, private, and 100% offline!',
      });
    } catch {
      // Ignore share cancellation
    }
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'SmartCalc runs 100% locally on your device. Your financial, loan, salary, and calculation inputs are stored strictly on your phone and are NEVER sent to any remote server or third-party backend.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderBottomColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.backBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Text style={[styles.backArrow, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings & About</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Branding Card */}
        <View
          style={[
            styles.brandCard,
            {
              backgroundColor: theme.isDark ? '#0F172A' : '#EFF6FF',
              borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
            },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <View style={[styles.calcIconBadge, { backgroundColor: '#2563EB' }]}>
                <View style={styles.calcScreen} />
                <View style={styles.calcKeysRow}>
                  <View style={styles.calcKey} />
                  <View style={styles.calcKey} />
                </View>
                <View style={styles.calcKeysRow}>
                  <View style={styles.calcKey} />
                  <View style={[styles.calcKey, { backgroundColor: '#F59E0B' }]} />
                </View>
              </View>
            </View>
            <View style={styles.brandInfo}>
              <Text style={[styles.brandTitle, { color: theme.colors.text }]}>SmartCalc</Text>
              <Text style={[styles.brandSubtitle, { color: theme.colors.textMuted }]}>
                Production All-in-One Calculator Suite
              </Text>
              <Text style={[styles.brandBadge, { color: theme.colors.primary }]}>
                {calculatorToolCatalog.length} Verified V1 Tools • 100% Offline
              </Text>
            </View>
          </View>
        </View>

        {/* 1. APPEARANCE */}
        <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>APPEARANCE</Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.themeSelectorRow}>
            {(['system', 'light', 'dark'] as const).map((t) => {
              const isSelected = mode === t;
              const label = t === 'system' ? '💻 System' : t === 'light' ? '☀️ Light' : '🌙 Dark';
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    setMode(t);
                    haptic.selection();
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.themeBtn,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surfaceSubtle,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.themeBtnText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. CALCULATOR BEHAVIOR */}
        <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>CALCULATOR PREFERENCES</Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          {/* Haptic feedback switch */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Haptic Feedback</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                Tactile vibration on keypad taps and actions
              </Text>
            </View>
            <Switch
              value={hapticsOn}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          {/* Decimal Precision */}
          <View style={styles.settingCol}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Decimal Precision</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                Display decimal places for currency and results
              </Text>
            </View>
            <View style={styles.precisionRow}>
              {[2, 3, 4].map((p) => {
                const isSelected = precision === p;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => handleSelectPrecision(p)}
                    activeOpacity={0.7}
                    style={[
                      styles.precisionBtn,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.surfaceSubtle,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.precisionBtnText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.colors.text,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {p} Decimals
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* 3. DATA & HISTORY */}
        <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>DATA & STORAGE</Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <TouchableOpacity onPress={handleClearCalculations} style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Clear Calculation History</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                Remove all saved calculation records
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          <TouchableOpacity onPress={handleClearAllRecents} style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Clear Recent Tools & Cache</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                Reset recently opened calculator history
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 4. ABOUT & LEGAL */}
        <Text style={[styles.sectionHeading, { color: theme.colors.textMuted }]}>ABOUT & SUPPORT</Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <TouchableOpacity onPress={handleShareApp} style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Share SmartCalc</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                Recommend to friends and colleagues
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>↗</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          <TouchableOpacity onPress={handlePrivacyPolicy} style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Privacy Policy</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>
                100% on-device calculations • No cloud tracking
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Application ID</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>com.dailyapps.calculator</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Catalog Size</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {calculatorToolCatalog.length} Tools in {SMARTCALC_CATEGORIES.length} Categories
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>App Version</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>v1.0.0 (DailyApps Bare CLI)</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  brandCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    padding: 3,
    justifyContent: 'space-between',
  },
  calcScreen: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 2,
  },
  calcKeysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  calcKey: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1.5,
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  themeSelectorRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBtnText: {
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingCol: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  precisionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  precisionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  precisionBtnText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});
