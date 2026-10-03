import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { ResumeProfile, ResumeSectionId } from '../types/resume.types';
import { createEmptyResume } from '../data/documentDefaults';
import { sampleExperiencedResume } from '../data/sampleData';
import { ResumeAvatar } from '../components/ResumeAvatar';
import { ResumeOnboardingFlow } from '../components/ResumeOnboardingFlow';
import { SectionEditorModal } from '../components/SectionEditorModal';
import { PhotoUploadModal } from '../components/PhotoUploadModal';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props {
  navigation: any;
  route: any;
}

type EditorSectionId = ResumeSectionId | 'profilePhoto';

interface SectionConfig {
  id: EditorSectionId;
  label: string;
  icon: string;
  bg: string;
  tint: string;
  desc: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'personalInfo', label: 'Personal Details', icon: '👤', bg: '#EEF2FF', tint: '#4F46E5', desc: 'Name, email, phone, location' },
  { id: 'profilePhoto', label: 'Profile Photo', icon: '📸', bg: '#F5F3FF', tint: '#7C3AED', desc: 'Professional portrait headshot' },
  { id: 'summary', label: 'Professional Summary', icon: '📝', bg: '#E0F2FE', tint: '#0284C7', desc: 'Career overview & key highlights' },
  { id: 'workExperience', label: 'Work Experience', icon: '💼', bg: '#ECFDF5', tint: '#059669', desc: 'Roles, companies, impact' },
  { id: 'education', label: 'Education', icon: '🎓', bg: '#EFF6FF', tint: '#2563EB', desc: 'Degrees, colleges, grades' },
  { id: 'skills', label: 'Skills & Tools', icon: '⚡', bg: '#FFFBEB', tint: '#D97706', desc: 'Technical & professional skills' },
  { id: 'projects', label: 'Key Projects', icon: '🚀', bg: '#FAF5FF', tint: '#9333EA', desc: 'Notable projects & achievements' },
  { id: 'certifications', label: 'Certifications', icon: '📜', tint: '#0D9488', bg: '#F0FDFA', desc: 'Licenses & online certificates' },
  { id: 'achievements', label: 'Achievements', icon: '🏆', tint: '#EA580C', bg: '#FFF7ED', desc: 'Honors, awards, milestones' },
  { id: 'languages', label: 'Languages', icon: '🌐', tint: '#E11D48', bg: '#FFF1F2', desc: 'Languages & proficiency' },
  { id: 'interests', label: 'Interests & Hobbies', icon: '🎯', tint: '#DB2777', bg: '#FDF2F8', desc: 'Personal pursuits' },
  { id: 'customSections', label: 'Additional Sections', icon: '➕', tint: '#475569', bg: '#F1F5F9', desc: 'Volunteer, publications, etc.' },
];

export const ResumeBuilderScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();

  const initial = route.params?.document || createEmptyResume(route.params?.templateId || 'modern_blue');
  const [resume, setResume] = useState<ResumeProfile>(initial);
  const [editor, setEditor] = useState<ResumeSectionId | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  // Auto-sync: reload latest state when screen gains focus
  const reloadFromStorage = useCallback(async () => {
    try {
      const documents = await storage.getJson<ResumeProfile[]>('saved_documents', []);
      const found = documents.find((d) => d.id === resume.id);
      if (found) {
        setResume(found);
      }
    } catch (e) {
      console.error(e);
    }
  }, [storage, resume.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', reloadFromStorage);
    return unsubscribe;
  }, [navigation, reloadFromStorage]);

  // Persist resume changes immediately
  const persistResume = useCallback(async (updated: ResumeProfile) => {
    setResume(updated);
    try {
      const documents = await storage.getJson<ResumeProfile[]>('saved_documents', []);
      const updatedList = [updated, ...documents.filter((d) => d.id !== updated.id)];
      await storage.setJson('saved_documents', updatedList);
    } catch (e) {
      console.error(e);
    }
  }, [storage]);

  const isComplete = (id: EditorSectionId): boolean => {
    if (id === 'profilePhoto') return Boolean(resume.personalInfo.photoUri);
    if (id === 'personalInfo') return Boolean(resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone);
    if (id === 'summary') return Boolean(resume.personalInfo.summary?.trim());
    if (id === 'workExperience') return Boolean(resume.experience?.length);
    if (id === 'education') return Boolean(resume.education?.length);
    if (id === 'skills') return Boolean(resume.skillCategories?.some((category) => category.skills.length));
    if (id === 'projects') return Boolean(resume.projects?.length);
    if (id === 'certifications') return Boolean(resume.certifications?.length);
    if (id === 'achievements') return Boolean(resume.achievements?.length);
    if (id === 'languages') return Boolean(resume.languages?.length);
    if (id === 'interests') return Boolean(resume.interests?.length);
    return Boolean(resume.customSections?.length);
  };

  const getSectionSummary = (id: EditorSectionId): string => {
    if (id === 'profilePhoto') return resume.personalInfo.photoUri ? 'Headshot uploaded' : 'Tap to add photo';
    if (id === 'personalInfo') return resume.personalInfo.fullName ? `${resume.personalInfo.fullName}` : 'Not added';
    if (id === 'summary') return resume.personalInfo.summary ? `${resume.personalInfo.summary.slice(0, 35)}...` : 'Not added';
    if (id === 'workExperience') return resume.experience?.length ? `${resume.experience.length} ${resume.experience.length === 1 ? 'role' : 'roles'} added` : 'Not added';
    if (id === 'education') return resume.education?.length ? `${resume.education.length} degree${resume.education.length > 1 ? 's' : ''}` : 'Not added';
    if (id === 'skills') {
      const count = resume.skillCategories?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0;
      return count ? `${count} skills added` : 'Not added';
    }
    if (id === 'projects') return resume.projects?.length ? `${resume.projects.length} projects` : 'Not added';
    if (id === 'certifications') return resume.certifications?.length ? `${resume.certifications.length} certificates` : 'Not added';
    if (id === 'achievements') return resume.achievements?.length ? `${resume.achievements.length} honors` : 'Not added';
    if (id === 'languages') return resume.languages?.length ? `${resume.languages.length} languages` : 'Not added';
    if (id === 'interests') return resume.interests?.length ? `${resume.interests.length} interests` : 'Not added';
    return resume.customSections?.length ? `${resume.customSections.length} custom sections` : 'Not added';
  };

  const completedCount = SECTIONS.filter((section) => isComplete(section.id)).length;
  const completionPercent = Math.round((completedCount / SECTIONS.length) * 100);

  // Dynamic ATS Score Calculation
  const atsScore = useMemo(() => {
    let score = 0;
    if (resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone) score += 20;
    if (resume.personalInfo.summary && resume.personalInfo.summary.length > 30) score += 20;
    if (resume.experience && resume.experience.length > 0) score += 25;
    if (resume.education && resume.education.length > 0) score += 15;
    if (resume.skillCategories && resume.skillCategories.some((c) => c.skills.length > 0)) score += 10;
    if ((resume.projects && resume.projects.length > 0) || (resume.certifications && resume.certifications.length > 0)) score += 10;
    return Math.min(100, score);
  }, [resume]);

  const atsLabel = atsScore >= 80 ? 'ATS Optimized' : atsScore >= 50 ? 'Moderate ATS Match' : 'Basic Match';
  const atsColor = atsScore >= 80 ? '#059669' : atsScore >= 50 ? '#D97706' : '#2563EB';

  const nextSection = SECTIONS.find((section) => !isComplete(section.id)) || SECTIONS[0];

  const openSection = (section: SectionConfig) => {
    if (section.id === 'profilePhoto') {
      setShowPhotoModal(true);
      return;
    }
    if (section.id === 'languages') {
      navigation.navigate('ResumeAdvanced', { mode: 'languages', document: resume });
      return;
    }
    if (section.id === 'interests') {
      navigation.navigate('ResumeAdvanced', { mode: 'interests', document: resume });
      return;
    }
    if (section.id === 'customSections') {
      navigation.navigate('ResumeAdvanced', { mode: 'additional', document: resume });
      return;
    }
    setEditor(section.id);
  };

  const handleLoadSample = () => {
    setShowMoreActions(false);
    Alert.alert(
      'Load Sample Resume',
      'This will populate your resume with realistic software engineer data (Rahul Sharma). Existing fields will be updated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load Sample',
          onPress: async () => {
            const sample: ResumeProfile = {
              ...sampleExperiencedResume,
              id: resume.id,
              templateId: resume.templateId,
              accentColor: resume.accentColor,
              updatedAt: Date.now(),
            };
            await persistResume(sample);
            Alert.alert('Loaded! 🎉', 'Sample profile data successfully loaded.');
          },
        },
      ]
    );
  };

  const handleReset = () => {
    setShowMoreActions(false);
    Alert.alert(
      'Reset Resume',
      'Are you sure you want to clear all sections and start fresh?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const empty = createEmptyResume(resume.templateId, resume.accentColor);
            await persistResume({ ...empty, id: resume.id });
          },
        },
      ]
    );
  };

  // If first-time onboarding mode requested
  if (route.params?.onboarding) {
    return (
      <ResumeOnboardingFlow
        resume={resume}
        initialStep={route.params?.onboardingStep || 0}
        onUpdate={persistResume}
        onBack={() => navigation.goBack()}
        onNavigate={(tab) => navigation.navigate('MainTabs', { initialTab: tab })}
        onComplete={() => {
          void persistResume(resume);
          navigation.setParams({ onboarding: false, onboardingStep: undefined });
        }}
      />
    );
  }

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* ─── Modern App Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Resume Editor</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {resume.personalInfo.fullName || 'Untitled Resume'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('LivePreview', { document: resume })}
          style={styles.previewBtn}
        >
          <Text style={styles.previewBtnText}>👁️ Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="More actions"
          onPress={() => setShowMoreActions(true)}
          style={styles.moreBtn}
        >
          <Text style={styles.moreText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── ATS Score & Progress Hero Card ─── */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsTitle}>{completedCount} of {SECTIONS.length} Sections</Text>
              <Text style={styles.statsSub}>{completionPercent}% completed</Text>
            </View>
            <View style={[styles.atsBadge, { backgroundColor: atsColor + '15', borderColor: atsColor + '40' }]}>
              <Text style={[styles.atsBadgeScore, { color: atsColor }]}>🎯 ATS {atsScore}%</Text>
              <Text style={[styles.atsBadgeSub, { color: atsColor }]}>{atsLabel}</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(5, completionPercent)}%` }]} />
          </View>
        </View>

        {/* ─── Template Selector Banner ─── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TemplateSelector', { schemaId: 'professional_resume', category: 'resume' })}
          style={styles.resumeBanner}
        >
          <View style={styles.bannerDocument}>
            <Text style={styles.bannerDocumentText}>📄</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle} numberOfLines={1}>{resume.title || 'Professional Resume'}</Text>
            <Text style={styles.bannerSub}>Tap to change template or colors</Text>
          </View>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>Change ›</Text>
          </View>
        </TouchableOpacity>

        {/* ─── Candidate Profile Card ─── */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => setShowPhotoModal(true)}>
            <ResumeAvatar
              photoUri={resume.personalInfo.photoUri}
              name={resume.personalInfo.fullName}
              size={54}
            />
          </TouchableOpacity>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName} numberOfLines={1}>
              {resume.personalInfo.fullName || 'Add Your Full Name'}
            </Text>
            <Text style={styles.profileRole} numberOfLines={1}>
              {resume.personalInfo.jobTitle || 'Add your professional title'}
            </Text>
            <Text style={styles.profileMeta} numberOfLines={1}>
              {resume.personalInfo.location || 'Location not added'} • {resume.personalInfo.phone || 'No phone'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => openSection(SECTIONS[0])}
            style={styles.profileEditBtn}
          >
            <Text style={styles.profileEditBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Section Checklist ─── */}
        <Text style={styles.sectionHeaderTitle}>RESUME SECTIONS</Text>
        <View style={styles.list}>
          {SECTIONS.map((section) => {
            const done = isComplete(section.id);
            const summary = getSectionSummary(section.id);
            return (
              <TouchableOpacity
                key={section.id}
                activeOpacity={0.75}
                onPress={() => openSection(section)}
                style={[styles.row, done && styles.rowDone]}
              >
                <View style={[styles.rowIconBox, { backgroundColor: section.bg }]}>
                  <Text style={styles.rowIconEmoji}>{section.icon}</Text>
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowLabel}>{section.label}</Text>
                  <Text style={[styles.rowSub, done && { color: '#059669' }]} numberOfLines={1}>
                    {done ? `✓ ${summary}` : section.desc}
                  </Text>
                </View>
                <View style={[styles.stateCircle, done && styles.stateCircleDone]}>
                  <Text style={[styles.stateCircleText, done && styles.stateCircleTextDone]}>
                    {done ? '✓' : '›'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ─── Sticky Bottom Action Bar ─── */}
      <View style={[styles.stickyBar, { backgroundColor: theme.colors.surfaceCard, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('LivePreview', { document: resume })}
          style={styles.barPreviewBtn}
        >
          <Text style={styles.barPreviewText}>👁️ Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openSection(nextSection)}
          style={styles.barNextBtn}
        >
          <Text style={styles.barNextText}>
            {completedCount === SECTIONS.length ? '🎉 All Done • Preview' : `Next: ${nextSection.label} →`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── Unified Bottom Navigation ─── */}
      <ResumeBottomNav
        active="home"
        onNavigate={(tab) => navigation.navigate('MainTabs', { initialTab: tab })}
      />

      {/* ─── Section Editor Modal ─── */}
      <SectionEditorModal
        visible={Boolean(editor)}
        sectionId={editor}
        sectionLabel={SECTIONS.find((section) => section.id === editor)?.label || ''}
        resume={resume}
        onUpdate={persistResume}
        onClose={() => setEditor(null)}
        onSaveAndContinue={() => {
          void persistResume(resume);
          setEditor(null);
        }}
      />

      {/* ─── Photo Upload & Crop Modal ─── */}
      <PhotoUploadModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhotoUri={resume.personalInfo.photoUri}
        candidateName={resume.personalInfo.fullName}
        onSavePhoto={(uri) => {
          void persistResume({
            ...resume,
            personalInfo: { ...resume.personalInfo, photoUri: uri },
          });
          setShowPhotoModal(false);
        }}
      />

      {/* ─── Header More Actions Sheet ─── */}
      <Modal visible={showMoreActions} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMoreActions(false)}
          style={styles.sheetBackdrop}
        >
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Resume Options</Text>
              <TouchableOpacity onPress={() => setShowMoreActions(false)}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {[
              { id: 'preview', icon: '👁️', label: 'Full A4 Live Preview', action: () => { setShowMoreActions(false); navigation.navigate('LivePreview', { document: resume }); } },
              { id: 'export', icon: '🖨️', label: 'Export PDF Document', action: () => { setShowMoreActions(false); navigation.navigate('ExportPdf', { document: resume }); } },
              { id: 'customize', icon: '🎨', label: 'Customize Colors & Fonts', action: () => { setShowMoreActions(false); navigation.navigate('ResumeAdvanced', { mode: 'customize', document: resume }); } },
              { id: 'reorder', icon: '📐', label: 'Reorder Resume Sections', action: () => { setShowMoreActions(false); navigation.navigate('ResumeAdvanced', { mode: 'reorder', document: resume }); } },
              { id: 'ai', icon: '🤖', label: 'AI Resume Assistant', action: () => { setShowMoreActions(false); navigation.navigate('AiAssistant'); } },
              { id: 'sample', icon: '📋', label: 'Load Sample Data (Software Engineer)', action: handleLoadSample },
              { id: 'reset', icon: '🗑️', label: 'Reset / Clear All Fields', action: handleReset, danger: true },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={item.action}
                style={styles.sheetRow}
              >
                <Text style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</Text>
                <Text style={[styles.sheetRowLabel, item.danger && { color: '#DC2626' }]}>
                  {item.label}
                </Text>
                <Text style={styles.sheetChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backText: {
    color: '#1E293B',
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 34,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 4,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  headerSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  previewBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  previewBtnText: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 12,
  },
  moreBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  statsCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statsSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  atsBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  atsBadgeScore: {
    fontSize: 12,
    fontWeight: '900',
  },
  atsBadgeSub: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1,
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  resumeBanner: {
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerDocument: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerDocumentText: {
    fontSize: 20,
  },
  bannerTitle: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '900',
  },
  bannerSub: {
    color: '#3B82F6',
    fontSize: 11,
    marginTop: 2,
  },
  bannerBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  bannerBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 16,
  },
  profileCopy: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '800',
  },
  profileRole: {
    color: '#475569',
    fontSize: 12,
    marginTop: 2,
  },
  profileMeta: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 2,
  },
  profileEditBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileEditBtnText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  list: {
    gap: 8,
  },
  row: {
    minHeight: 62,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  rowDone: {
    borderColor: '#CBD5E1',
  },
  rowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconEmoji: {
    fontSize: 18,
  },
  rowCopy: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '800',
  },
  rowSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  stateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stateCircleDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stateCircleText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '900',
  },
  stateCircleTextDone: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
  },
  barPreviewBtn: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  barPreviewText: {
    color: '#334155',
    fontSize: 13.5,
    fontWeight: '800',
  },
  barNextBtn: {
    flex: 2,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  barNextText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sheetClose: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
    padding: 4,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetRowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  sheetChevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
});
