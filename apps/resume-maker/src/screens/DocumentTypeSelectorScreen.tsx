import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props { navigation: any; route?: any; }
type DocumentFamily = 'resume' | 'biodata';

export const DocumentTypeSelectorScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<DocumentFamily>(route?.params?.initialType === 'biodata' ? 'biodata' : 'resume');
  const continueToTemplates = () => {
    if (selected === 'biodata') {
      // Screen 24: Choose Biodata Type first
      navigation.navigate('BiodataTypeSelector');
    } else {
      navigation.navigate('TemplateSelector', {
        schemaId: 'professional_resume',
        category: 'resume',
        documentType: 'Resume',
      });
    }
  };
  const goToTab = (tab: string) => navigation.navigate('MainTabs', { initialTab: tab });

  const typeCard = (type: DocumentFamily, title: string, description: string, symbol: string, tint: string) => {
    const active = selected === type;
    return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected: active }} onPress={() => setSelected(type)} style={[styles.typeCard, active && styles.typeCardActive]}>
      <View style={[styles.typeIcon, { backgroundColor: tint }]}><Text style={styles.typeIconText}>{symbol}</Text></View>
      <View style={styles.typeText}><Text style={[styles.typeTitle, { color: theme.colors.text }]}>{title}</Text><Text style={[styles.typeDescription, { color: theme.colors.textMuted }]}>{description}</Text></View>
      {active && <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>}
    </TouchableOpacity>;
  };

  return <ScreenContainer scrollable={false} withPadding={false}>
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      <TouchableOpacity accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.backButton}><Text style={[styles.back, { color: theme.colors.text }]}>‹</Text></TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Document</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Choose Document Type</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>What would you like to create?</Text>
      {typeCard('resume', 'Resume', 'Create a modern resume for jobs and career opportunities.', '▤', '#EAF1FF')}
      {typeCard('biodata', 'Biodata', 'Create a personal, marriage or professional biodata.', '♙', '#F1EAFF')}
    </ScrollView>
    <View style={[styles.footer, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.border }]}><TouchableOpacity accessibilityLabel="Continue to templates" onPress={continueToTemplates} style={styles.primaryButton}><Text style={styles.primaryText}>Continue</Text></TouchableOpacity></View>
    <ResumeBottomNav onNavigate={goToTab as any} />
  </ScreenContainer>;
};

const styles = StyleSheet.create({
  header: { height: 64, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingHorizontal: 18 },
  backButton: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  back: { fontSize: 38, fontWeight: '300', lineHeight: 36 },
  headerTitle: { fontSize: 19, fontWeight: '900' },
  content: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 160 },
  title: { fontSize: 23, lineHeight: 29, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 29 },
  typeCard: { minHeight: 128, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderRadius: 17, borderWidth: 1, borderColor: '#D6E2F7', backgroundColor: '#FFFFFF', marginBottom: 24 },
  typeCardActive: { borderWidth: 2, borderColor: '#3567F2', backgroundColor: '#FCFDFF' },
  typeIcon: { width: 67, height: 67, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginRight: 18 },
  typeIconText: { color: '#3E67F3', fontSize: 34, fontWeight: '900' },
  typeText: { flex: 1 },
  typeTitle: { fontSize: 18, fontWeight: '900', marginBottom: 7 },
  typeDescription: { fontSize: 12.5, lineHeight: 19, paddingRight: 8 },
  check: { width: 25, height: 25, borderRadius: 13, backgroundColor: '#4265F4', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  footer: { position: 'absolute', bottom: 62, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1 },
  primaryButton: { height: 51, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3E86F6' },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
