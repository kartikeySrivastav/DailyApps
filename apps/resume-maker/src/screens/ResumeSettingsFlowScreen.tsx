import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ResumeProfile, ResumeSectionId } from '../types/resume.types';
import { sampleExperiencedResume } from '../data/sampleData';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

type Mode = 'ats' | 'multipage' | 'layout' | 'headerfooter' | 'visibility';
interface Props {
  navigation?: any;
  route?: { params?: { mode?: Mode; document?: ResumeProfile } };
}

const SECTIONS: { id: ResumeSectionId; label: string; description: string; icon: string }[] = [
  { id: 'personalInfo', label: 'Personal Details', description: 'Basic information about you', icon: '👤' },
  { id: 'summary', label: 'Professional Summary', description: 'Your career objective', icon: '📝' },
  { id: 'workExperience', label: 'Work Experience', description: 'Your professional history', icon: '💼' },
  { id: 'education', label: 'Education', description: 'Your academic background', icon: '🎓' },
  { id: 'skills', label: 'Skills', description: 'Your key skills and expertise', icon: '⚡' },
  { id: 'projects', label: 'Projects', description: 'Your notable projects', icon: '📱' },
  { id: 'certifications', label: 'Certifications', description: 'Your certifications', icon: '📜' },
  { id: 'achievements', label: 'Achievements', description: 'Your achievements and awards', icon: '🏆' },
  { id: 'languages', label: 'Languages', description: 'Languages you know', icon: '🌐' },
];

const ATS_CRITERIA = [
  { label: 'Keywords', score: 9, icon: '🔑' },
  { label: 'Formatting', score: 8, icon: '📋' },
  { label: 'Skills Match', score: 9, icon: '🎯' },
  { label: 'File Format', score: 10, icon: '📄' },
  { label: 'Structure', score: 8, icon: '🏗️' },
];

// Screens 57-61: Resume Settings Flow — rebuilt with reference UI
export const ResumeSettingsFlowScreen: React.FC<Props> = ({ navigation, route }) => {
  const mode = route?.params?.mode || 'ats';
  const document = route?.params?.document || sampleExperiencedResume;
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((section) => [section.id, !document.hiddenSections?.includes(section.id)])),
  );
  const [pageSize, setPageSize] = useState('A4 (210 × 297 mm)');
  const [margins, setMargins] = useState('15 mm');
  const [layout, setLayout] = useState('Single Column');
  const [fontSize, setFontSize] = useState('12 pt');
  const [headerEnabled, setHeaderEnabled] = useState(true);
  const [footerEnabled, setFooterEnabled] = useState(true);
  const [headerAlign, setHeaderAlign] = useState('Center');
  const [headerContent, setHeaderContent] = useState('Name');
  const [score] = useState(85);

  const titles: Record<Mode, [string, string]> = {
    ats: ['Resume ATS Checker', 'Analyze your resume for ATS compatibility'],
    multipage: ['Resume Preview', 'Multi-page resume preview'],
    layout: ['Page Layout Settings', 'Configure page size, margins and layout'],
    headerfooter: ['Header & Footer', 'Customize your resume header and footer'],
    visibility: ['Section Visibility', 'Show or hide sections in your resume'],
  };
  const [title, subtitle] = titles[mode];

  const save = () => Alert.alert('Settings saved', 'Your resume display settings have been updated.');
  const toggleSection = (id: string) => setVisibleSections((current) => ({ ...current, [id]: !current[id] }));

  const selector = (label: string, value: string, options: string[], onSelect: (next: string) => void) => (
    <View style={styles.settingGroup}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.optionPill,
              value === option && styles.optionPillActive,
            ]}
          >
            <Text style={[styles.optionText, value === option && styles.optionTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Screen 57: ATS Checker
  const renderAts = () => (
    <View>
      {/* Score Circle */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreCircleOuter}>
          <View style={styles.scoreCircleInner}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreOf}>/100</Text>
          </View>
        </View>
        <View style={styles.scoreStatusPill}>
          <Text style={styles.scoreStatusText}>✓ Good Score</Text>
        </View>
        <Text style={styles.scoreSub}>Your resume is well optimized for ATS.</Text>
      </View>

      {/* Criteria Cards */}
      <View style={styles.card}>
        {ATS_CRITERIA.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.criteriaRow,
              index === ATS_CRITERIA.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.criteriaIconBox}>
              <Text style={{ fontSize: 16 }}>{item.icon}</Text>
            </View>
            <Text style={styles.criteriaLabel}>{item.label}</Text>
            <View style={styles.criteriaScoreBox}>
              <Text style={styles.criteriaScore}>{item.score}/10</Text>
            </View>
            <View style={[styles.criteriaBar, { width: `${item.score * 10}%` }]} />
          </View>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Tips to Improve</Text>
        <Text style={styles.tipsText}>• Add more industry-specific keywords{'\n'}• Use standard section headings{'\n'}• Ensure consistent date formatting</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('ATS analysis', 'Your resume already has a strong ATS score.')}>
        <Text style={styles.primaryButtonText}>📊 Detailed Analysis</Text>
      </TouchableOpacity>
    </View>
  );

  // Screen 58: Multi-Page Preview
  const renderPreview = () => (
    <View>
      <View style={styles.previewPaper}>
        <View style={styles.previewSide}>
          <View style={styles.previewAvatar}>
            <Text style={styles.previewAvatarText}>
              {document.personalInfo.fullName?.charAt(0) || 'R'}
            </Text>
          </View>
          <Text style={styles.previewSideName}>{document.personalInfo.fullName}</Text>
          <Text style={styles.previewSideRole}>{document.personalInfo.jobTitle}</Text>
          <View style={styles.previewSideDivider} />
          {['Contact', 'Skills', 'Languages'].map((s) => (
            <View key={s} style={styles.previewSideSection}>
              <Text style={styles.previewSideSectionTitle}>{s}</Text>
              <View style={styles.previewSideLine} />
              <View style={[styles.previewSideLine, { width: '70%' }]} />
            </View>
          ))}
        </View>
        <View style={styles.previewMain}>
          <Text style={styles.previewName}>{document.personalInfo.fullName}</Text>
          <Text style={styles.previewRole}>{document.personalInfo.jobTitle}</Text>
          {['Profile', 'Work Experience', 'Education', 'Projects'].map((section) => (
            <View key={section} style={styles.previewSection}>
              <Text style={styles.previewHeading}>{section}</Text>
              <View style={styles.previewLine} />
              <View style={styles.previewLineShort} />
            </View>
          ))}
        </View>
      </View>

      {/* Page Controls */}
      <View style={styles.pageControls}>
        <TouchableOpacity style={styles.pageArrowBtn}>
          <Text style={styles.pageArrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>Page 1 of 2</Text>
        <TouchableOpacity style={styles.pageArrowBtn}>
          <Text style={styles.pageArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Download', 'PDF download started.')}>
          <Text style={styles.secondaryButtonText}>⬇️ Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonSmall} onPress={() => Alert.alert('Share', 'Share sheet opened.')}>
          <Text style={styles.primaryButtonText}>📤 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Screen 59: Page Layout & Margins
  const renderLayout = () => (
    <View>
      <View style={styles.card}>
        {selector('Page Size', pageSize, ['A4 (210 × 297 mm)', 'Letter (8.5 × 11 in)'], setPageSize)}
        <View style={styles.settingDivider} />
        {selector('Margins', margins, ['10 mm', '15 mm', '20 mm'], setMargins)}
        <View style={styles.settingDivider} />
        {selector('Layout Style', layout, ['Single Column', 'Two Column', 'Compact'], setLayout)}
        <View style={styles.settingDivider} />
        {selector('Font Size', fontSize, ['11 pt', '12 pt', '13 pt'], setFontSize)}
      </View>

      {/* Mini Preview */}
      <View style={styles.miniPreviewCard}>
        <Text style={styles.miniPreviewTitle}>Preview</Text>
        <View style={styles.miniPreviewBox}>
          <View style={[styles.miniPreviewPage, layout === 'Two Column' && styles.miniPreviewTwoCol]}>
            {layout === 'Two Column' && <View style={styles.miniPreviewSidebar} />}
            <View style={styles.miniPreviewContent}>
              <View style={[styles.miniLine, { width: '80%' }]} />
              <View style={[styles.miniLine, { width: '60%' }]} />
              <View style={[styles.miniLine, { width: '90%' }]} />
              <View style={[styles.miniLine, { width: '70%' }]} />
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={save}>
        <Text style={styles.primaryButtonText}>💾 Save Settings</Text>
      </TouchableOpacity>
    </View>
  );

  // Screen 60: Header & Footer
  const renderHeaderFooter = () => (
    <View>
      <View style={styles.card}>
        {/* Header Toggle */}
        <View style={styles.toggleRow}>
          <View style={[styles.toggleIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={{ fontSize: 17 }}>📋</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.toggleLabel}>Show Header</Text>
            <Text style={styles.toggleSub}>Display header on each page</Text>
          </View>
          <Switch value={headerEnabled} onValueChange={setHeaderEnabled} trackColor={{ false: '#E2E8F0', true: '#2563EB' }} thumbColor="#FFFFFF" />
        </View>

        {/* Footer Toggle */}
        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <View style={[styles.toggleIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={{ fontSize: 17 }}>📄</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.toggleLabel}>Show Footer</Text>
            <Text style={styles.toggleSub}>Display footer with page numbers</Text>
          </View>
          <Switch value={footerEnabled} onValueChange={setFooterEnabled} trackColor={{ false: '#E2E8F0', true: '#2563EB' }} thumbColor="#FFFFFF" />
        </View>
      </View>

      {headerEnabled && (
        <View style={styles.card}>
          {selector('Header Alignment', headerAlign, ['Left', 'Center', 'Right'], setHeaderAlign)}
          <View style={styles.settingDivider} />
          {selector('Header Content', headerContent, ['Name', 'Job Title', 'Contact'], setHeaderContent)}
        </View>
      )}

      {/* Preview */}
      <View style={styles.miniPreviewCard}>
        <Text style={styles.miniPreviewTitle}>Preview</Text>
        <View style={styles.hfPreviewBox}>
          {headerEnabled && (
            <View style={[styles.hfBar, { justifyContent: headerAlign === 'Left' ? 'flex-start' : headerAlign === 'Right' ? 'flex-end' : 'center' }]}>
              <Text style={styles.hfBarText}>{headerContent === 'Name' ? document.personalInfo.fullName : headerContent === 'Job Title' ? document.personalInfo.jobTitle : document.personalInfo.email}</Text>
            </View>
          )}
          <View style={styles.hfBody}>
            <View style={[styles.miniLine, { width: '80%' }]} />
            <View style={[styles.miniLine, { width: '60%' }]} />
            <View style={[styles.miniLine, { width: '90%' }]} />
          </View>
          {footerEnabled && (
            <View style={styles.hfFooterBar}>
              <Text style={styles.hfFooterText}>Page 1 of 2</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={save}>
        <Text style={styles.primaryButtonText}>💾 Save Changes</Text>
      </TouchableOpacity>
    </View>
  );

  // Screen 61: Section Visibility
  const renderVisibility = () => (
    <View>
      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ⓘ</Text>
        <Text style={styles.infoText}>Hidden sections will not appear in your final resume PDF.</Text>
      </View>

      <View style={styles.card}>
        {SECTIONS.map((section, index) => (
          <View
            key={section.id}
            style={[
              styles.visibilityRow,
              index === SECTIONS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={[styles.visIconBox, { backgroundColor: visibleSections[section.id] ? '#EEF2FF' : '#F8FAFC' }]}>
              <Text style={{ fontSize: 17 }}>{section.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.visLabel, !visibleSections[section.id] && { color: '#94A3B8' }]}>
                {section.label}
              </Text>
              <Text style={styles.visDesc}>{section.description}</Text>
            </View>
            <Switch
              value={visibleSections[section.id]}
              onValueChange={() => toggleSection(section.id)}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          {Object.values(visibleSections).filter(Boolean).length} of {SECTIONS.length} sections visible
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={save}>
        <Text style={styles.primaryButtonText}>💾 Save Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBottomNav = (tab: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation?.navigate('MainTabs', { initialTab: tab });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader title={title} subtitle={subtitle} onBack={() => navigation?.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {mode === 'ats'
          ? renderAts()
          : mode === 'multipage'
          ? renderPreview()
          : mode === 'layout'
          ? renderLayout()
          : mode === 'headerfooter'
          ? renderHeaderFooter()
          : renderVisibility()}
      </ScrollView>
      <ResumeBottomNav active="settings" onNavigate={handleBottomNav} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 80,
  },

  // ── Cards ──
  card: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 14,
  },

  // ── Screen 57: ATS Score ──
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  scoreCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  scoreCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: '#2563EB',
    fontSize: 38,
    fontWeight: '900',
  },
  scoreOf: {
    color: '#64748B',
    fontSize: 13,
  },
  scoreStatusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  scoreStatusText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '800',
  },
  scoreSub: {
    color: '#64748B',
    fontSize: 12,
  },

  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  criteriaIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  criteriaScoreBox: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  criteriaScore: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
  criteriaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: '#2563EB',
    borderRadius: 1,
  },

  tipsCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#78350F',
  },

  // ── Screen 58: Preview ──
  previewPaper: {
    flexDirection: 'row',
    minHeight: 420,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  previewSide: {
    width: '32%',
    backgroundColor: '#2563EB',
    padding: 14,
    alignItems: 'center',
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  previewAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  previewSideName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewSideRole: {
    color: '#DBEAFE',
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  previewSideDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    marginVertical: 12,
  },
  previewSideSection: {
    width: '100%',
    marginBottom: 12,
  },
  previewSideSectionTitle: {
    color: '#DBEAFE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  previewSideLine: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
    borderRadius: 2,
    width: '100%',
  },
  previewMain: {
    flex: 1,
    padding: 14,
  },
  previewName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E293B',
  },
  previewRole: {
    fontSize: 10,
    marginTop: 3,
    color: '#64748B',
  },
  previewSection: {
    marginTop: 22,
  },
  previewHeading: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
  },
  previewLine: {
    height: 5,
    backgroundColor: '#CBD5E1',
    marginTop: 8,
    width: '95%',
    borderRadius: 2,
  },
  previewLineShort: {
    height: 5,
    backgroundColor: '#E2E8F0',
    marginTop: 6,
    width: '72%',
    borderRadius: 2,
  },
  pageControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  pageArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageArrowText: {
    color: '#4F46E5',
    fontSize: 22,
    fontWeight: '700',
  },
  pageText: {
    fontWeight: '800',
    color: '#1E293B',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 13,
  },
  primaryButtonSmall: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },

  // ── Screen 59: Layout Settings ──
  settingGroup: {
    marginBottom: 4,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1E293B',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
  },
  optionPill: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  optionPillActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  optionTextActive: {
    color: '#4F46E5',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },

  miniPreviewCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 14,
  },
  miniPreviewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  miniPreviewBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  miniPreviewPage: {
    width: 120,
    height: 160,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    padding: 10,
  },
  miniPreviewTwoCol: {
    flexDirection: 'row',
    padding: 0,
  },
  miniPreviewSidebar: {
    width: '30%',
    backgroundColor: '#2563EB',
  },
  miniPreviewContent: {
    flex: 1,
    padding: 8,
    gap: 6,
  },
  miniLine: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },

  // ── Screen 60: Header/Footer ──
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  hfPreviewBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  hfBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  hfBarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  hfBody: {
    padding: 16,
    gap: 8,
  },
  hfFooterBar: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  hfFooterText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },

  // ── Screen 61: Visibility ──
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  infoIcon: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '800',
  },
  infoText: {
    flex: 1,
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },

  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  visIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  visDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  summaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // ── Shared Buttons ──
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
