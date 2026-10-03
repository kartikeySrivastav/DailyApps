import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { AnyDocumentProfile } from '../types/resume.types';

interface Props { navigation: any; }

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const [recentDocuments, setRecentDocuments] = useState<AnyDocumentProfile[]>([]);
  const loadRecentDocuments = useCallback(async () => {
    const documents = await storage.getJson<AnyDocumentProfile[]>('saved_documents', []);
    setRecentDocuments(documents.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 2));
  }, [storage]);
  useEffect(() => {
    void loadRecentDocuments();
    return navigation.addListener('focus', loadRecentDocuments);
  }, [navigation, loadRecentDocuments]);
  const openDocument = (document: AnyDocumentProfile) => {
    if (document.type === 'resume') navigation.navigate('ResumeBuilder', { document });
    else if (document.type === 'marriage_biodata') navigation.navigate('MarriageBiodataBuilder', { document });
    else navigation.navigate('CoverLetterBuilder', { document });
  };
  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>DailyApps</Text>
          <Text style={[styles.appSub, { color: theme.colors.textMuted }]}>Resume &amp; Biodata Maker</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.profileButton}>
          <Text style={styles.profileSymbol}>◎</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Create documents{`\n`}that stand out.</Text>
            <Text style={styles.heroText}>Build professional resumes{`\n`}and biodata in minutes.</Text>
          </View>
          <View style={styles.documentGraphic}>
            <View style={styles.documentSheet}>
              <View style={styles.avatarDot} />
              <View style={styles.lineStrong} />
              <View style={styles.lineSoft} />
              <View style={styles.lineSoft} />
            </View>
          </View>
        </View>
        <View style={styles.cards}>
          <TouchableOpacity onPress={() => navigation.navigate('DocumentTypeSelector', { initialType: 'resume' })} style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#EAF1FF' }]}><Text style={{ fontSize: 26 }}>📄</Text></View>
            <Text style={styles.resumeLabel}>CREATE RESUME</Text>
            <Text style={[styles.cardDescription, { color: theme.colors.textMuted }]}>Build an ATS-optimized professional resume</Text>
            <Text style={styles.resumeArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DocumentTypeSelector', { initialType: 'biodata' })} style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#F3EAFF' }]}><Text style={{ fontSize: 26 }}>💍</Text></View>
            <Text style={styles.biodataLabel}>CREATE BIODATA</Text>
            <Text style={[styles.cardDescription, { color: theme.colors.textMuted }]}>Create a royal marriage or personal biodata</Text>
            <Text style={styles.biodataArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* AI Assistant Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AiAssistant')}
          style={styles.aiBanner}
        >
          <View style={styles.aiBannerIconBox}>
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.aiTagRow}>
              <Text style={styles.aiBannerTitle}>Smart AI Assistant</Text>
              <View style={styles.aiPill}><Text style={styles.aiPillText}>FREE</Text></View>
            </View>
            <Text style={styles.aiBannerSub}>Generate summaries, action bullets & ATS matches</Text>
          </View>
          <Text style={styles.aiBannerArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Documents</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { initialTab: 'documents' })}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        {recentDocuments.length === 0 ? (
          <Text style={[styles.fileMeta, { color: theme.colors.textMuted, paddingVertical: 13 }]}>
            No documents yet. Create your first resume or biodata to see it here.
          </Text>
        ) : recentDocuments.map((document) => (
          <TouchableOpacity key={document.id} onPress={() => openDocument(document)} style={styles.fileRow}>
            <View style={[styles.pdfBox, document.type === 'marriage_biodata' && { backgroundColor: '#9333EA' }]}>
              <Text style={styles.pdfText}>{document.type === 'resume' ? 'CV' : document.type === 'marriage_biodata' ? 'BIO' : 'LET'}</Text>
            </View>
            <View style={styles.fileCopy}>
              <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>{document.title || 'Untitled document'}</Text>
              <Text style={[styles.fileMeta, { color: theme.colors.textMuted }]}>
                {document.type === 'marriage_biodata' ? 'Marriage Biodata' : document.type === 'cover_letter' ? 'Cover Letter' : 'Professional Resume'} • Updated recently
              </Text>
            </View>
            <Text style={styles.fileArrow}>→</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, styles.toolsHeading, { color: theme.colors.text }]}>Quick Tools</Text>
        <View style={styles.tools}>
          <TouchableOpacity onPress={() => navigation.navigate('Tools')} style={styles.tool}>
            <Text style={styles.toolIcon}>⚒️</Text>
            <Text style={[styles.toolText, { color: theme.colors.text }]}>PDF Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { initialTab: 'templates' })} style={styles.tool}>
            <Text style={styles.toolIcon}>🎨</Text>
            <Text style={[styles.toolText, { color: theme.colors.text }]}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { initialTab: 'documents' })} style={styles.tool}>
            <Text style={styles.toolIcon}>📁</Text>
            <Text style={[styles.toolText, { color: theme.colors.text }]}>My Documents</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('PremiumTemplates')} style={styles.premium}>
          <Text style={{ fontSize: 26 }}>👑</Text>
          <View style={styles.premiumCopy}>
            <Text style={styles.premiumTitle}>Premium Templates</Text>
            <Text style={styles.premiumDescription}>Unlock 30+ executive & royal matrimonial templates</Text>
          </View>
          <Text style={styles.premiumArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { height: 77, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFFFFF' }, appName: { fontSize: 25, fontWeight: '900' }, appSub: { fontSize: 12, marginTop: 2 }, profileButton: { width: 37, height: 37, borderRadius: 19, borderWidth: 1, borderColor: '#99B2FF', alignItems: 'center', justifyContent: 'center' }, profileSymbol: { color: '#315CF3', fontSize: 26 },
  content: { padding: 16, paddingBottom: 34 }, hero: { minHeight: 127, borderRadius: 15, padding: 18, backgroundColor: '#EEF1FF', flexDirection: 'row' }, heroCopy: { flex: 1 }, heroTitle: { color: '#142C72', fontSize: 19, fontWeight: '900', lineHeight: 24 }, heroText: { color: '#4966BA', fontSize: 12, lineHeight: 17, marginTop: 9 }, documentGraphic: { width: 94, justifyContent: 'center', alignItems: 'center' }, documentSheet: { width: 56, height: 78, padding: 8, backgroundColor: '#FFFFFF', borderRadius: 7, transform: [{ rotate: '-8deg' }] }, avatarDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#6B8AF8', marginBottom: 7 }, lineStrong: { height: 4, borderRadius: 2, backgroundColor: '#3C65F2', marginBottom: 5 }, lineSoft: { height: 3, borderRadius: 2, backgroundColor: '#CAD7FF', marginBottom: 5 },
  cards: { flexDirection: 'row', gap: 12, marginTop: 16 }, card: { flex: 1, minHeight: 145, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: '#D8E4F8', backgroundColor: '#FFFFFF', position: 'relative' }, cardIcon: { width: 49, height: 49, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, resumeIcon: { color: '#3567F2', fontSize: 27, fontWeight: '900' }, biodataIcon: { color: '#A04DF5', fontSize: 27, fontWeight: '900' }, resumeLabel: { color: '#2854DD', fontSize: 11, fontWeight: '900' }, biodataLabel: { color: '#8631D5', fontSize: 11, fontWeight: '900' }, cardDescription: { fontSize: 10, lineHeight: 14, marginTop: 5 }, resumeArrow: { color: '#3567F2', fontSize: 25, position: 'absolute', bottom: 8, right: 12 }, biodataArrow: { color: '#A04DF5', fontSize: 25, position: 'absolute', bottom: 8, right: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '900' },
  viewAll: { color: '#315CF3', fontSize: 12, fontWeight: '800' },
  fileRow: { minHeight: 61, borderWidth: 1, borderColor: '#DAE5F7', borderRadius: 10, padding: 9, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pdfBox: { width: 35, height: 35, borderRadius: 7, backgroundColor: '#FF5054', alignItems: 'center', justifyContent: 'center' },
  pdfText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900' },
  fileCopy: { flex: 1, marginLeft: 10 },
  fileName: { fontSize: 12, fontWeight: '800' },
  fileMeta: { fontSize: 10, marginTop: 3 },
  fileArrow: { color: '#4B72E9', fontSize: 18, fontWeight: '900' },
  toolsHeading: { marginTop: 21, marginBottom: 10 },
  tools: { flexDirection: 'row', gap: 10 },
  tool: { flex: 1, height: 79, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#DAE5F7' },
  toolIcon: { fontSize: 22, marginBottom: 5 },
  toolText: { fontSize: 10, fontWeight: '700' },
  premium: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 11, backgroundColor: '#7146EF', marginTop: 16 },
  crown: { color: '#FFD24E', fontSize: 25 },
  premiumCopy: { flex: 1, marginLeft: 11 },
  premiumTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  premiumDescription: { color: '#E4DDFE', fontSize: 10, marginTop: 2 },
  premiumArrow: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  aiBanner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#C7D2FE', marginTop: 16 },
  aiBannerIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiBannerTitle: { color: '#1E1B4B', fontSize: 14, fontWeight: '900' },
  aiPill: { backgroundColor: '#4F46E5', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  aiPillText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  aiBannerSub: { color: '#4338CA', fontSize: 11, marginTop: 2 },
  aiBannerArrow: { color: '#4F46E5', fontSize: 18, fontWeight: '900', marginLeft: 8 },
});
