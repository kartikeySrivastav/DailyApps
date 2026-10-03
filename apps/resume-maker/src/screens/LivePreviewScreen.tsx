import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '@dailyapps/theme';
import { AnyDocumentProfile, ResumeProfile, MarriageBiodataProfile } from '../types/resume.types';
import { ShareBottomSheet } from '../components/ShareBottomSheet';
import { A4DocumentPreview } from '../components/A4DocumentPreview';
import { samplePriyaSharmaBiodata, sampleExperiencedResume } from '../data/sampleData';

interface Props {
  navigation?: any;
  route?: any;
}

export const LivePreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const document: AnyDocumentProfile = route.params?.document;
  const isBiodata = document?.type === 'marriage_biodata';
  const resume = document?.type === 'resume' ? (document as ResumeProfile) : null;
  const biodata = isBiodata ? (document as MarriageBiodataProfile) : null;
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const templateId = document?.templateId || (isBiodata ? 'royal_traditional' : 'modern_blue');

  const personName =
    resume?.personalInfo?.fullName ||
    (isBiodata ? biodata?.personalInfo?.fullName || 'Priya Sharma' : 'Rahul Sharma');

  // Build a complete display document (merging with demo fallback so empty drafts look stunning)
  const displayDoc: AnyDocumentProfile = useMemo(() => {
    if (isBiodata) {
      const base = samplePriyaSharmaBiodata;
      const b = biodata || ({} as Partial<MarriageBiodataProfile>);
      return {
        ...base,
        ...b,
        id: b.id || 'bio_preview',
        templateId: (b.templateId || templateId) as any,
        accentColor: b.accentColor || '#D97706',
        personalInfo: {
          ...base.personalInfo,
          ...b.personalInfo,
          fullName: b.personalInfo?.fullName || base.personalInfo.fullName,
        },
        educationAndCareer: {
          ...base.educationAndCareer,
          ...b.educationAndCareer,
        },
        family: {
          ...base.family,
          ...b.family,
        },
        astrology: {
          ...base.astrology,
          ...b.astrology,
        },
        contactDetails: {
          ...base.contactDetails,
          ...b.contactDetails,
        },
      } as MarriageBiodataProfile;
    } else {
      const base = sampleExperiencedResume;
      const r = resume || ({} as Partial<ResumeProfile>);
      return {
        ...base,
        ...r,
        id: r.id || 'resume_preview',
        templateId: (r.templateId || templateId) as any,
        accentColor: r.accentColor || '#2563EB',
        personalInfo: {
          ...base.personalInfo,
          ...r.personalInfo,
          fullName: r.personalInfo?.fullName || base.personalInfo.fullName,
          jobTitle: r.personalInfo?.jobTitle || base.personalInfo.jobTitle,
        },
        experience: r.experience && r.experience.length > 0 ? r.experience : base.experience,
        education: r.education && r.education.length > 0 ? r.education : base.education,
        skillCategories: r.skillCategories && r.skillCategories.length > 0 ? r.skillCategories : base.skillCategories,
        projects: r.projects && r.projects.length > 0 ? r.projects : base.projects,
        achievements: r.achievements && r.achievements.length > 0 ? r.achievements : base.achievements,
      } as ResumeProfile;
    }
  }, [document, isBiodata, biodata, resume, templateId]);

  const handleEdit = () => {
    if (isBiodata) {
      navigation.navigate('MarriageBiodataBuilder', { document: displayDoc });
    } else if (document?.type === 'cover_letter') {
      navigation.navigate('CoverLetterBuilder', { document: displayDoc });
    } else {
      navigation.navigate('ResumeBuilder', { document: displayDoc });
    }
  };

  const handleFullScreen = () => {
    navigation.navigate('PdfPreview', { document: displayDoc });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title={isBiodata ? 'Biodata Preview' : 'Resume Preview'}
        subtitle={`${personName} • ${templateId.replace(/_/g, ' ')}`}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowShareModal(true)}
            style={[styles.shareIconBtn, { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' }]}
          >
            <Text style={{ fontSize: 18 }}>⋮</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Render the specialized template JSX architecture */}
        <A4DocumentPreview document={displayDoc} />
      </ScrollView>

      {/* ─── Bottom Toolbar: Edit | Download PDF | Share ─── */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.colors.surfaceCard, borderTopColor: theme.colors.border },
        ]}
      >
        {/* Edit button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleEdit}
          style={[styles.editBtn, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.editBtnIcon}>✏️</Text>
          <Text style={[styles.editBtnLabel, { color: theme.colors.text }]}>Edit</Text>
        </TouchableOpacity>

        {/* Download PDF button — Primary CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleFullScreen}
          style={styles.downloadBtn}
        >
          <Text style={styles.downloadBtnText}>⬇ Download PDF</Text>
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowShareModal(true)}
          style={[styles.shareBtn, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.shareBtnIcon}>📤</Text>
          <Text style={[styles.shareBtnLabel, { color: theme.colors.text }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Share Bottom Sheet */}
      <ShareBottomSheet
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        fileName={`${personName.replace(/\s+/g, '_')}_${isBiodata ? 'Biodata' : 'Resume'}.pdf`}
        fileSize="2.4 MB"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 12,
    paddingBottom: 90,
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  editBtnIcon: {
    fontSize: 15,
  },
  editBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  shareBtnIcon: {
    fontSize: 15,
  },
  shareBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
