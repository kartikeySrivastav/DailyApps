import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { ResumeAvatar } from '../components/ResumeAvatar';
import { sampleExperiencedResume } from '../data/sampleData';

type Mode = 'welcome' | 'crop' | 'template' | 'unsaved' | 'restore' | 'failed' | 'error' | 'search' | 'privacy' | 'help';
interface Props {
  navigation?: any;
  route?: { params?: { mode?: Mode } };
}

const DOCS = ['My_Resume.pdf', 'My_Biodata.pdf', 'Project_Details.docx', 'Cover_Letter.pdf', 'Profile_Photo.jpg'];

const FAQ_ITEMS = [
  { icon: '🚀', title: 'Getting Started', desc: 'Setup and create your first resume', items: ['How to create a new resume', 'Using templates', 'Saving your work'] },
  { icon: '📄', title: 'Resume & Biodata', desc: 'Templates, editing, exporting', items: ['Editing sections', 'Adding profile photo', 'Exporting to PDF'] },
  { icon: '🔧', title: 'PDF Tools', desc: 'Convert, merge, split, etc.', items: ['Merging PDFs', 'Splitting pages', 'Compressing files'] },
  { icon: '⚙️', title: 'Account & Settings', desc: 'App settings and preferences', items: ['Changing language', 'Theme settings', 'Clearing data'] },
  { icon: '🐛', title: 'Troubleshooting', desc: 'Fix common issues', items: ['App crashes', 'PDF not generating', 'Template not loading'] },
];

const PRIVACY_ITEMS = [
  { icon: '📊', title: 'Data We Collect', desc: 'What information we store', details: 'We only store the data you enter for your resume on your device.' },
  { icon: '🔍', title: 'How We Use Your Data', desc: 'Purpose and usage', details: 'Your data is used only to generate your documents.' },
  { icon: '💾', title: 'Data Storage', desc: 'Local storage only', details: 'All data stays on your device. Nothing is sent to our servers.' },
  { icon: '🎛', title: 'Your Choices', desc: 'Manage your data', details: 'You can delete all data at any time from Settings.' },
  { icon: '🛡', title: 'Security Measures', desc: 'How we protect your data', details: 'Data is stored in the app\'s private sandbox, inaccessible to other apps.' },
];

// Screens 62-71 — rebuilt with reference-matching design
export const FinalSupportFlowScreen: React.FC<Props> = ({ navigation, route }) => {
  const mode = route?.params?.mode || 'welcome';
  const [search, setSearch] = useState('');
  const [cropShape, setCropShape] = useState('Circle');
  const [selectedTemplate, setSelectedTemplate] = useState('Modern Blue');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [expandedPrivacy, setExpandedPrivacy] = useState<string | null>(null);
  const filteredDocs = DOCS.filter((doc) => doc.toLowerCase().includes(search.toLowerCase()));

  const titles: Record<Mode, [string, string]> = {
    welcome: ['DailyApps', 'Resume & Biodata Maker'],
    crop: ['Crop & Adjust', 'Adjust your profile photo'],
    template: ['Template Preview', 'Review before applying'],
    unsaved: ['Confirm', 'You have unsaved changes'],
    restore: ['Restore Draft', 'Resume draft found'],
    failed: ['Processing Failed', 'We could not process your PDF'],
    error: ['PDF Error', 'Something went wrong'],
    search: ['My Documents', 'Search and filter documents'],
    privacy: ['Privacy Center', 'Your privacy matters'],
    help: ['Help & FAQ', 'Find answers or contact support'],
  };
  const [title, subtitle] = titles[mode];

  const action = (message: string) => Alert.alert(message, 'This action is ready in the document workflow.');

  // Screen 62: Onboarding / Welcome
  const renderWelcome = () => (
    <View style={styles.welcomeCenter}>
      {/* App Icon */}
      <View style={styles.welcomeIconOuter}>
        <View style={styles.welcomeIcon}>
          <Text style={styles.welcomeIconText}>▤</Text>
        </View>
      </View>

      <Text style={styles.brand}>DailyApps</Text>
      <Text style={styles.brandSub}>Resume & Biodata Maker</Text>

      {/* Feature Cards */}
      <View style={styles.welcomeFeatures}>
        {[
          { icon: '📄', title: 'Professional Resumes', sub: 'ATS-optimized templates' },
          { icon: '💍', title: 'Marriage Biodata', sub: 'Beautiful traditional designs' },
          { icon: '🔧', title: 'PDF Tools', sub: 'Merge, split, compress & more' },
        ].map((f) => (
          <View key={f.title} style={styles.welcomeFeatureRow}>
            <View style={styles.welcomeFeatureIcon}>
              <Text style={{ fontSize: 20 }}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeFeatureTitle}>{f.title}</Text>
              <Text style={styles.welcomeFeatureSub}>{f.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.welcomeHeadline}>
        Your Professional{'\n'}Documents, Made Easy
      </Text>
      <Text style={styles.bodyText}>
        Create stunning resumes and biodata with beautiful templates and powerful tools.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation?.navigate('DocumentTypeSelector', { initialType: 'resume' })}
      >
        <Text style={styles.primaryButtonText}>Get Started  →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation?.goBack()}>
        <Text style={styles.skipLink}>Skip</Text>
      </TouchableOpacity>
    </View>
  );

  // Screen 63: Photo Crop & Adjust
  const renderCrop = () => (
    <View>
      {/* Crop Canvas */}
      <View style={styles.cropCanvas}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' }}
          style={styles.cropImage}
        />
        <View style={[
          styles.cropFrame,
          cropShape === 'Circle' && { borderRadius: 110 },
          cropShape === 'Rounded' && { borderRadius: 24 },
        ]} />
      </View>

      {/* Tools Row */}
      <View style={styles.cropTools}>
        {[
          { icon: '↔', label: 'Move' },
          { icon: '🔍', label: 'Zoom' },
          { icon: '↻', label: 'Rotate' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.cropTool} onPress={() => action(item.label)}>
            <View style={styles.cropToolCircle}>
              <Text style={styles.cropToolIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.cropToolText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Crop Shape */}
      <Text style={styles.sectionLabel}>CROP SHAPE</Text>
      <View style={styles.shapeOptions}>
        {['Circle', 'Square', 'Rounded', 'Original'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setCropShape(item)}
            style={[
              styles.shapeOption,
              cropShape === item && styles.shapeOptionActive,
            ]}
          >
            <View style={[
              styles.shapePreview,
              item === 'Circle' && { borderRadius: 14 },
              item === 'Rounded' && { borderRadius: 6 },
              cropShape === item && styles.shapePreviewActive,
            ]} />
            <Text style={[
              styles.shapeLabel,
              cropShape === item && { color: '#4F46E5' },
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation?.goBack()}>
        <Text style={styles.primaryButtonText}>✓ Done</Text>
      </TouchableOpacity>
    </View>
  );

  // Screen 64: Template Full Preview
  const renderTemplate = () => (
    <View>
      {/* Template Preview Paper */}
      <View style={styles.templatePaper}>
        <View style={styles.templateSide}>
          <ResumeAvatar name={sampleExperiencedResume.personalInfo.fullName} size={54} />
          <Text style={styles.templateSideName}>{sampleExperiencedResume.personalInfo.fullName}</Text>
          <Text style={styles.templateSideRole}>Frontend Developer</Text>
          <View style={styles.templateSideDivider} />
          {['Contact', 'Skills'].map((s) => (
            <View key={s} style={styles.templateSideBlock}>
              <Text style={styles.templateSideBlockTitle}>{s}</Text>
              <View style={styles.templateSideLine} />
              <View style={[styles.templateSideLine, { width: '70%' }]} />
            </View>
          ))}
        </View>
        <View style={styles.templateBody}>
          <Text style={styles.templateBodyName}>Professional Resume</Text>
          {['Profile', 'Work Experience', 'Education', 'Projects'].map((section) => (
            <View key={section} style={styles.templateSection}>
              <Text style={styles.templateHeading}>{section}</Text>
              <View style={styles.templateLine} />
              <View style={styles.templateLineShort} />
            </View>
          ))}
        </View>
      </View>

      {/* Template Name */}
      <Text style={styles.templateNameLabel}>{selectedTemplate}</Text>

      {/* Template Options */}
      <View style={styles.templateOptions}>
        {['Modern Blue', 'Clean Professional', 'Creative Design'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedTemplate(item)}
            style={[
              styles.templateOptionPill,
              selectedTemplate === item && styles.templateOptionActive,
            ]}
          >
            <Text style={[
              styles.templateOptionText,
              selectedTemplate === item && { color: '#FFFFFF' },
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dots */}
      <View style={styles.templateDots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => action('Template selected')}>
        <Text style={styles.primaryButtonText}>Use This Template</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation?.goBack()}>
        <Text style={styles.secondaryButtonText}>Browse More</Text>
      </TouchableOpacity>
    </View>
  );

  // Screens 65-68: Recovery / Confirmation states
  const renderRecovery = () => {
    const isRestore = mode === 'restore';
    const isError = mode === 'failed' || mode === 'error';

    const config = {
      icon: isError ? '⚠️' : isRestore ? '↻' : '💾',
      iconBg: isError ? '#FEE2E2' : isRestore ? '#EEF2FF' : '#FFF7ED',
      headline: isError
        ? (mode === 'failed' ? 'Processing Failed' : 'Something Went Wrong')
        : isRestore ? 'Resume Draft Found' : 'Unsaved Changes',
      body: isError
        ? 'We could not process your PDF file. Please check the file format and try again.'
        : isRestore
        ? 'You have an unfinished resume from your last session. Would you like to restore it and continue?'
        : 'You have unsaved changes in your resume. Do you want to save them before leaving?',
      fileName: isRestore ? 'Rahul_Kumar_Draft' : isError ? 'My_Document.pdf' : 'My_Resume.pdf',
      primaryLabel: isRestore ? '↻ Restore Draft' : isError ? '🔄 Try Again' : '💾 Save & Continue',
      secondaryLabel: isRestore ? 'Start New' : 'Go Back',
    };

    return (
      <View style={styles.recoveryCenter}>
        <View style={[styles.statusIcon, { backgroundColor: config.iconBg }]}>
          <Text style={{ fontSize: 38 }}>{config.icon}</Text>
        </View>
        <Text style={styles.recoveryHeadline}>{config.headline}</Text>
        <Text style={styles.recoveryBody}>{config.body}</Text>

        {/* File Card */}
        <View style={styles.fileCard}>
          <View style={[styles.fileBadge, isError && { backgroundColor: '#EF4444' }]}>
            <Text style={styles.fileBadgeText}>PDF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName}>{config.fileName}</Text>
            <Text style={styles.fileMeta}>PDF  •  2.4 MB  •  2 Pages</Text>
          </View>
        </View>

        {isRestore && (
          <View style={styles.draftInfo}>
            <Text style={styles.draftInfoText}>
              📅 Last edited: Today at 3:45 PM{'\n'}
              📊 Progress: 8/12 sections completed
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={() => action(config.primaryLabel)}>
          <Text style={styles.primaryButtonText}>{config.primaryLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.secondaryButtonText}>{config.secondaryLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 69: Search & Filter Documents
  const renderSearch = () => (
    <View>
      {/* Search Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search documents..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['All', 'Resume', 'Biodata', 'PDF', 'Cover Letter'].map((filter) => (
          <TouchableOpacity key={filter} style={styles.filterChip}>
            <Text style={styles.filterChipText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Count */}
      <Text style={styles.resultCount}>{filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''} found</Text>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <View style={styles.searchEmpty}>
          <Text style={{ fontSize: 36, marginBottom: 12 }}>🔍</Text>
          <Text style={styles.searchEmptyTitle}>No documents found</Text>
          <Text style={styles.searchEmptyText}>Try a different search term</Text>
        </View>
      ) : (
        filteredDocs.map((doc) => (
          <TouchableOpacity
            key={doc}
            style={styles.docRow}
            onPress={() => action(doc)}
          >
            <View style={[
              styles.docBadge,
              doc.endsWith('.pdf') ? { backgroundColor: '#EF4444' }
                : doc.endsWith('.docx') ? { backgroundColor: '#2563EB' }
                : { backgroundColor: '#F59E0B' },
            ]}>
              <Text style={styles.docBadgeText}>
                {doc.endsWith('.pdf') ? 'PDF' : doc.endsWith('.docx') ? 'DOC' : 'IMG'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doc}</Text>
              <Text style={styles.docMeta}>Resume  •  2.4 MB  •  Today</Text>
            </View>
            <TouchableOpacity style={styles.docMenu}>
              <Text style={styles.docMenuText}>⋮</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  // Screen 70: Privacy Center
  const renderPrivacy = () => (
    <View>
      {/* Shield Icon */}
      <View style={styles.privacyHero}>
        <View style={styles.privacyIconCircle}>
          <Text style={{ fontSize: 32 }}>🛡</Text>
        </View>
        <Text style={styles.privacyHeroTitle}>Your Data is Safe</Text>
        <Text style={styles.privacyHeroSub}>All data stays on your device</Text>
      </View>

      {/* Privacy Items */}
      {PRIVACY_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.title}
          activeOpacity={0.75}
          onPress={() => setExpandedPrivacy(expandedPrivacy === item.title ? null : item.title)}
          style={styles.privacyCard}
        >
          <View style={styles.privacyCardHeader}>
            <View style={styles.privacyCardIcon}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyCardTitle}>{item.title}</Text>
              <Text style={styles.privacyCardDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.chevron}>{expandedPrivacy === item.title ? '▾' : '›'}</Text>
          </View>
          {expandedPrivacy === item.title && (
            <View style={styles.privacyExpanded}>
              <Text style={styles.privacyExpandedText}>{item.details}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Info Note */}
      <View style={styles.privacyNote}>
        <Text style={styles.privacyNoteIcon}>ℹ️</Text>
        <Text style={styles.privacyNoteText}>
          Your documents and personal data are stored only on your device. We never upload or share your information.
        </Text>
      </View>
    </View>
  );

  // Screen 71: Help & FAQ
  const renderHelp = () => (
    <View>
      {/* Help Hero */}
      <View style={styles.helpHero}>
        <View style={styles.helpIconCircle}>
          <Text style={{ fontSize: 32 }}>❓</Text>
        </View>
        <Text style={styles.helpHeroTitle}>How can we help?</Text>
      </View>

      {/* Search Help */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search help topics..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      {/* FAQ Sections */}
      {FAQ_ITEMS.map((faq) => (
        <TouchableOpacity
          key={faq.title}
          activeOpacity={0.75}
          onPress={() => setExpandedFaq(expandedFaq === faq.title ? null : faq.title)}
          style={styles.faqCard}
        >
          <View style={styles.faqHeader}>
            <View style={styles.faqIcon}>
              <Text style={{ fontSize: 18 }}>{faq.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.faqTitle}>{faq.title}</Text>
              <Text style={styles.faqDesc}>{faq.desc}</Text>
            </View>
            <Text style={styles.chevron}>{expandedFaq === faq.title ? '▾' : '›'}</Text>
          </View>
          {expandedFaq === faq.title && (
            <View style={styles.faqExpanded}>
              {faq.items.map((q) => (
                <TouchableOpacity key={q} style={styles.faqItem} onPress={() => action(q)}>
                  <Text style={styles.faqItemDot}>•</Text>
                  <Text style={styles.faqItemText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Contact Support */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Still need help?</Text>
        <Text style={styles.contactSub}>Our support team is here to assist you.</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={() => action('Contact Support')}>
          <Text style={styles.contactBtnText}>📧 Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const render = mode === 'welcome'
    ? renderWelcome()
    : mode === 'crop'
    ? renderCrop()
    : mode === 'template'
    ? renderTemplate()
    : mode === 'search'
    ? renderSearch()
    : mode === 'privacy'
    ? renderPrivacy()
    : mode === 'help'
    ? renderHelp()
    : renderRecovery();

  const handleBottomNav = (tab: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation?.navigate('MainTabs', { initialTab: tab });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {mode !== 'welcome' ? (
        <ScreenHeader title={title} subtitle={subtitle} onBack={() => navigation?.goBack()} />
      ) : null}
      <ScrollView
        contentContainerStyle={[styles.content, mode === 'welcome' && styles.welcomeContent]}
        showsVerticalScrollIndicator={false}
      >
        {render}
      </ScrollView>
      <ResumeBottomNav
        active={
          mode === 'template' ? 'templates'
          : mode === 'search' ? 'documents'
          : mode === 'welcome' ? 'home'
          : 'settings'
        }
        onNavigate={handleBottomNav}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  // ── Screen 62: Welcome ──
  welcomeCenter: {
    alignItems: 'center',
    paddingTop: 8,
  },
  welcomeIconOuter: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeIcon: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  welcomeIconText: {
    color: '#FFF',
    fontSize: 42,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 4,
  },
  brandSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  welcomeFeatures: {
    width: '100%',
    gap: 10,
    marginTop: 28,
    marginBottom: 20,
  },
  welcomeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  welcomeFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeFeatureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  welcomeFeatureSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  welcomeHeadline: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 10,
    lineHeight: 30,
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: 10,
    maxWidth: 290,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  skipLink: {
    color: '#4F46E5',
    fontWeight: '800',
    marginTop: 16,
    fontSize: 14,
  },

  // ── Screen 63: Crop ──
  cropCanvas: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropFrame: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 0,
  },
  cropTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  cropTool: {
    alignItems: 'center',
  },
  cropToolCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cropToolIcon: {
    color: '#4F46E5',
    fontSize: 20,
    fontWeight: '700',
  },
  cropToolText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#64748B',
    marginBottom: 10,
    marginLeft: 2,
  },
  shapeOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  shapeOption: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  shapeOptionActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  shapePreview: {
    width: 28,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginBottom: 6,
  },
  shapePreviewActive: {
    backgroundColor: '#4F46E5',
  },
  shapeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },

  // ── Screen 64: Template Preview ──
  templatePaper: {
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
  templateSide: {
    width: '32%',
    backgroundColor: '#2563EB',
    padding: 14,
    alignItems: 'center',
  },
  templateSideName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  templateSideRole: {
    color: '#DBEAFE',
    fontSize: 8,
    marginTop: 3,
  },
  templateSideDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    marginVertical: 12,
  },
  templateSideBlock: {
    width: '100%',
    marginBottom: 10,
  },
  templateSideBlockTitle: {
    color: '#DBEAFE',
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 4,
  },
  templateSideLine: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
    borderRadius: 2,
    width: '100%',
  },
  templateBody: {
    flex: 1,
    padding: 14,
  },
  templateBodyName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  templateSection: {
    marginTop: 22,
  },
  templateHeading: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
  },
  templateLine: {
    height: 5,
    backgroundColor: '#CBD5E1',
    marginTop: 8,
    borderRadius: 2,
  },
  templateLineShort: {
    height: 5,
    width: '70%',
    backgroundColor: '#E2E8F0',
    marginTop: 6,
    borderRadius: 2,
  },
  templateNameLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 10,
  },
  templateOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  templateOptionPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  templateOptionActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  templateOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  templateDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    backgroundColor: '#4F46E5',
    width: 20,
  },

  // ── Screens 65-68: Recovery ──
  recoveryCenter: {
    alignItems: 'center',
    paddingTop: 32,
  },
  statusIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  recoveryHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  recoveryBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 20,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    width: '100%',
    gap: 12,
    marginBottom: 8,
  },
  fileBadge: {
    width: 40,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  fileMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  draftInfo: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 4,
  },
  draftInfoText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#4F46E5',
  },

  // ── Screen 69: Search ──
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    paddingVertical: 10,
  },
  searchClear: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  docBadge: {
    width: 40,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  docMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  docMenu: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docMenuText: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
  },
  searchEmpty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchEmptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  searchEmptyText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  // ── Screen 70: Privacy ──
  privacyHero: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 14,
  },
  privacyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  privacyHeroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  privacyHeroSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  privacyCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    overflow: 'hidden',
  },
  privacyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  privacyCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  privacyCardDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chevron: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  privacyExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  privacyExpandedText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  privacyNoteIcon: {
    fontSize: 16,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#4F46E5',
    fontWeight: '500',
  },

  // ── Screen 71: Help & FAQ ──
  helpHero: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  helpIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  helpHeroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  faqCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  faqIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  faqDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  faqExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    gap: 4,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  faqItemDot: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
  faqItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  contactCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  contactSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  contactBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
