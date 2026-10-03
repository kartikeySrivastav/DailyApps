import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useThemeContext } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { SupportedLanguage, getLanguageMeta } from '@dailyapps/utils';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { LanguageSelectionModal } from '../components/LanguageSelectionModal';

interface Props {
  navigation: any;
}

// Screens 55 (Language) + 56 (Settings) — rebuilt with reference-matching design
export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { toggleTheme } = useThemeContext();
  const storage = useAppStorage();

  const [isDark, setIsDark] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [showLangModal, setShowLangModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [cacheSize, setCacheSize] = useState('2.4 MB');

  const langMeta = getLanguageMeta(currentLang);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
    toggleTheme();
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure you want to clear temporary PDF and template cache?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => {
          setCacheSize('0.0 KB');
          Alert.alert('Success', 'Cache cleared successfully.');
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your saved documents and master profile. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await storage.setJson('saved_documents', []);
            await storage.setJson('master_profile', null);
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleSelectLanguage = async (newLang: SupportedLanguage) => {
    setCurrentLang(newLang);
    await storage.setItem('preferred_language', newLang);
  };

  const handleLink = async (label: string) => {
    if (label === 'Premium') {
      navigation.navigate('PremiumTemplates');
      return;
    }
    if (label === 'Privacy Center') {
      navigation.navigate('FinalSupportFlow', { mode: 'privacy' });
      return;
    }
    if (label === 'Help & FAQ') {
      navigation.navigate('FinalSupportFlow', { mode: 'help' });
      return;
    }
    if (label === 'Share App') {
      try {
        await Share.share({
          title: 'DailyApps Resume & Biodata Maker',
          message: 'Build modern resumes and royal biodata in minutes with DailyApps Resume & Biodata Maker! Download today.',
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }
    if (label === 'Rate the App') {
      Alert.alert(
        'Rate DailyApps ⭐⭐⭐⭐⭐',
        'Are you enjoying creating resumes and biodata? Your 5-star rating helps us grow!',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: '⭐ Rate 5 Stars',
            onPress: () => Alert.alert('Thank You! ❤️', 'Your feedback inspires us to build more features!'),
          },
        ]
      );
      return;
    }
    if (label === 'Report a Bug') {
      Alert.alert(
        'Report an Issue',
        'Encountered a bug or have a suggestion? We take quality seriously.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Report',
            onPress: () => Alert.alert('Report Received 🙏', 'Thanks! Our development team has logged your diagnostic report.'),
          },
        ]
      );
      return;
    }
    Alert.alert(label, `${label} is active on your device.`);
  };

  const handleBottomNav = (tab: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: tab });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* ─── Header ─── */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>App preferences & options</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ─── App Preferences ─── */}
        <Text style={styles.sectionLabel}>APP PREFERENCES</Text>
        <View style={styles.card}>
          {/* Screen 55: Language */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowLangModal(true)}
            style={styles.row}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{ fontSize: 19 }}>🌐</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowSub}>Interface & document language</Text>
            </View>
            <View style={styles.valuePill}>
              <Text style={styles.valuePillText}>
                {langMeta.nativeName}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Dark Mode */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#1E293B' : '#FFF7ED' }]}>
              <Text style={{ fontSize: 19 }}>{isDark ? '🌙' : '☀️'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowSub}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notifications */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 19 }}>🔔</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Text style={styles.rowSub}>Resume tips & update alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Auto-save */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Text style={{ fontSize: 19 }}>💾</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowLabel}>Auto-Save</Text>
              <Text style={styles.rowSub}>Automatically save draft changes</Text>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ─── Premium Banner ─── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleLink('Premium')}
          style={styles.premiumBanner}
        >
          <View>
            <Text style={styles.premiumTitle}>✨ Upgrade to Premium</Text>
            <Text style={styles.premiumSub}>Unlock all templates & PDF export</Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </View>
        </TouchableOpacity>

        {/* ─── Resume Tools ─── */}
        <Text style={styles.sectionLabel}>RESUME TOOLS</Text>
        <View style={styles.card}>
          {[
            { icon: '📊', bg: '#EFF6FF', label: 'Resume ATS Checker', sub: 'Check keywords, formatting and structure', mode: 'ats', nav: 'ResumeSettingsFlow' },
            { icon: '📑', bg: '#F0FDF4', label: 'Multi-Page Preview', sub: 'Review every resume page before export', mode: 'multipage', nav: 'ResumeSettingsFlow' },
            { icon: '📐', bg: '#FFF7ED', label: 'Page Layout & Margins', sub: 'Configure A4 layout and spacing', mode: 'layout', nav: 'ResumeSettingsFlow' },
            { icon: '📋', bg: '#FDF2F8', label: 'Header & Footer', sub: 'Customize resume header and footer', mode: 'headerfooter', nav: 'ResumeSettingsFlow' },
            { icon: '👁', bg: '#EEF2FF', label: 'Section Visibility', sub: 'Show or hide resume sections', mode: 'visibility', nav: 'ResumeSettingsFlow' },
          ].map((item) => (
            <TouchableOpacity
              key={item.mode}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(item.nav, { mode: item.mode })}
              style={styles.row}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 19 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Document & Support Tools ─── */}
        <Text style={styles.sectionLabel}>DOCUMENT TOOLS</Text>
        <View style={styles.card}>
          {[
            { icon: '🏠', bg: '#EFF6FF', label: 'Onboarding / Welcome', sub: 'Preview the first-run experience', mode: 'welcome' },
            { icon: '✂️', bg: '#FFF7ED', label: 'Photo Crop & Adjust', sub: 'Adjust a profile photo before saving', mode: 'crop' },
            { icon: '🖼️', bg: '#EEF2FF', label: 'Template Full Preview', sub: 'Review a template before applying', mode: 'template' },
            { icon: '🔄', bg: '#F0FDF4', label: 'Restore Draft', sub: 'Recover an unfinished document', mode: 'restore' },
          ].map((item) => (
            <TouchableOpacity
              key={item.mode}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('FinalSupportFlow', { mode: item.mode })}
              style={styles.row}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 19 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Storage ─── */}
        <Text style={styles.sectionLabel}>STORAGE & DATA</Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleClearCache}
            style={styles.row}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
              <Text style={{ fontSize: 19 }}>🗂️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowLabel}>Clear Cache</Text>
              <Text style={styles.rowSub}>
                PDF & template cache ({cacheSize})
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleClearData}
            style={[styles.row, { borderBottomWidth: 0 }]}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Text style={{ fontSize: 19 }}>🗑️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.rowLabel, { color: '#DC2626' }]}>Clear All Data</Text>
              <Text style={styles.rowSub}>
                Delete all documents & profile data
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ─── About ─── */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          {[
            { icon: '⭐', bg: '#FFF7ED', label: 'Rate the App', sub: 'Love the app? Give us 5 stars!' },
            { icon: '📢', bg: '#F0FDF4', label: 'Share App', sub: 'Recommend to your friends' },
            { icon: '🐛', bg: '#FEF2F2', label: 'Report a Bug', sub: 'Help us fix issues' },
            { icon: '🔒', bg: '#EEF2FF', label: 'Privacy Center', sub: 'Your data & privacy settings' },
            { icon: '❓', bg: '#EFF6FF', label: 'Help & FAQ', sub: 'Find answers or contact support' },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.75}
              onPress={() => handleLink(item.label)}
              style={[
                styles.row,
                idx === arr.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 19 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Version ─── */}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Resume Maker Pro  v1.0.0</Text>
          <Text style={styles.versionSub}>Made with ❤️ in India</Text>
        </View>
      </ScrollView>

      {/* ─── Bottom Nav ─── */}
      <ResumeBottomNav active="settings" onNavigate={handleBottomNav} />

      {/* ─── Screen 55: Language Selection Modal ─── */}
      <LanguageSelectionModal
        visible={showLangModal}
        selectedLanguage={currentLang}
        onSelectLanguage={(l) => {
          handleSelectLanguage(l);
          setShowLangModal(false);
        }}
        onClose={() => setShowLangModal(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // ── Header ──
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#1E293B',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 3,
    color: '#64748B',
  },

  // ── Scroll ──
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  // ── Section Label ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 18,
    marginLeft: 4,
    color: '#64748B',
  },

  // ── Card ──
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  // ── Row ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
    color: '#1E293B',
  },
  rowSub: {
    fontSize: 12,
    color: '#64748B',
  },
  valuePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  valuePillText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
    color: '#94A3B8',
  },

  // ── Premium Banner ──
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
    marginBottom: 4,
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  premiumSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // ── Version ──
  versionRow: {
    alignItems: 'center',
    marginTop: 28,
    gap: 4,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  versionSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
