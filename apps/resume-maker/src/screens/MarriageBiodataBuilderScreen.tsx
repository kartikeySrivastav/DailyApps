import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ScreenContainer, Header, Input, Button, Card } from '@dailyapps/ui';
import { useAppStorage } from '@dailyapps/storage';
import { MarriageBiodataProfile } from '../types/resume.types';
import { sampleGroomBiodata, sampleBrideBiodata, samplePriyaSharmaBiodata } from '../data/sampleData';
import { PhotoUploadModal } from '../components/PhotoUploadModal';
import { ResumeAvatar } from '../components/ResumeAvatar';

const EMPTY_BIODATA: MarriageBiodataProfile = samplePriyaSharmaBiodata;

interface Props {
  navigation: any;
  route: any;
}

export const MarriageBiodataBuilderScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();

  const initialData: MarriageBiodataProfile =
    route.params?.document || {
      ...EMPTY_BIODATA,
      id: 'bio_' + Date.now(),
      templateId: route.params?.templateId || 'royal_maroon',
    };

  const [biodata, setBiodata] = useState<MarriageBiodataProfile>(initialData);
  const [activeSectionModal, setActiveSectionModal] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showMoreModal, setShowMoreModal] = useState<boolean>(false);
  const [showTitleModal, setShowTitleModal] = useState<boolean>(false);
  const [editTitleText, setEditTitleText] = useState<string>(biodata.title || 'My Marriage Biodata');

  const isCompleted = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personalDetails':
        return !!(biodata.personalInfo.fullName && biodata.personalInfo.dateOfBirth);
      case 'education':
        return !!biodata.educationAndCareer.highestEducation;
      case 'profession':
        return !!biodata.educationAndCareer.occupation;
      case 'familyDetails':
        return !!(biodata.family.fatherName || biodata.family.motherName);
      case 'lifestyle':
        return !!biodata.family.familyType;
      case 'expectations':
        return !!biodata.partnerExpectations?.trim();
      case 'additional':
        return !!(biodata.contactDetails.phone1 || biodata.astrology?.gotra);
      default:
        return false;
    }
  };

  const sectionsList = [
    { id: 'personalDetails', label: 'Personal Details', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'profession', label: 'Profession', icon: '💼' },
    { id: 'familyDetails', label: 'Family Details', icon: '👨‍👩‍👦' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🏡' },
    { id: 'expectations', label: 'Expectations', icon: '💫' },
    { id: 'additional', label: 'Additional Information', icon: 'ℹ️' },
  ];

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', async () => {
      try {
        const saved = await storage.getJson<MarriageBiodataProfile[]>('saved_documents', []);
        const found = saved.find((d) => d.id === biodata.id);
        if (found) {
          setBiodata(found);
          setEditTitleText(found.title || 'My Marriage Biodata');
        }
      } catch (err) {
        console.warn('Error reloading biodata on focus', err);
      }
    });
    return unsubscribe;
  }, [navigation, biodata.id, storage]);

  const handleSaveToStorage = async (silent = false, overrideData?: MarriageBiodataProfile) => {
    try {
      const dataToSave = overrideData || biodata;
      const updated: MarriageBiodataProfile = {
        ...dataToSave,
        title: editTitleText || dataToSave.title,
        updatedAt: Date.now(),
      };
      const existing = await storage.getJson<MarriageBiodataProfile[]>('saved_documents', []);
      const filtered = existing.filter((d) => d.id !== updated.id);
      await storage.setJson('saved_documents', [updated, ...filtered]);
      if (!silent) {
        Alert.alert('Saved', 'Marriage Biodata saved successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = () => {
    handleSaveToStorage(true);
    navigation.navigate('LivePreview', { document: biodata });
  };

  const handleLoadSample = (type: 'groom' | 'bride') => {
    const sample = type === 'groom' ? sampleGroomBiodata : sampleBrideBiodata;
    const loaded: MarriageBiodataProfile = {
      ...sample,
      id: biodata.id || 'bio_' + Date.now(),
      templateId: biodata.templateId || 'royal_maroon',
      accentColor: biodata.accentColor || '#D97706',
      title: type === 'groom' ? 'Rahul Sharma - Groom Biodata' : 'Priya Sharma - Bride Biodata',
      updatedAt: Date.now(),
    };
    setBiodata(loaded);
    setEditTitleText(loaded.title);
    handleSaveToStorage(true, loaded);
    setShowMoreModal(false);
    Alert.alert('Loaded!', `${type === 'groom' ? 'Groom' : 'Bride'} sample data loaded.`);
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* Screen 26: Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Biodata Editor</Text>
        </View>
        <TouchableOpacity onPress={() => setShowMoreModal(true)} style={{ padding: 6 }}>
          <Text style={{ fontSize: 18, color: '#1E293B' }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Build Your Biodata heading */}
        <Text style={styles.buildTitle}>Build Your Biodata</Text>
        <Text style={styles.buildSub}>Complete the sections below</Text>

        {/* Progress bar */}
        {(() => {
          const completedCount = sectionsList.filter((s) => isCompleted(s.id)).length;
          const pct = Math.round((completedCount / sectionsList.length) * 100);
          return (
            <View style={styles.progressWrap}>
              <Text style={styles.progressLabel}>{pct}% Complete</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${pct}%` as any }]} />
              </View>
            </View>
          );
        })()}

        {/* Section Checklist (Screen 26) */}
        <View style={styles.sectionListContainer}>
          {sectionsList.map((sec) => {
            const completed = isCompleted(sec.id);
            const statusLabel = completed ? 'Completed' : 'Pending';
            const statusColor = completed ? '#10B981' : '#94A3B8';
            return (
              <TouchableOpacity
                key={sec.id}
                activeOpacity={0.75}
                onPress={() => {
                  const onSave = (updated: MarriageBiodataProfile) => {
                    setBiodata(updated);
                    handleSaveToStorage(true, updated);
                  };
                  // Navigate to dedicated step screens (Screens 27-30)
                  switch (sec.id) {
                    case 'personalDetails':
                      navigation.navigate('BiodataPersonalDetails', { biodata, onSave });
                      return;
                    case 'familyDetails':
                      navigation.navigate('BiodataFamilyDetails', { biodata, onSave });
                      return;
                    case 'education':
                    case 'profession':
                      navigation.navigate('BiodataEducationProfession', { biodata, onSave });
                      return;
                    case 'lifestyle':
                    case 'expectations':
                      navigation.navigate('BiodataLifestyle', { biodata, onSave });
                      return;
                    default:
                      setActiveSectionModal(sec.id);
                      return;
                  }
                }}
                style={styles.sectionItemCard}
              >
                {/* Left: Icon circle */}
                <View style={[styles.secIconCircle, completed && styles.secIconCircleDone]}>
                  <Text style={styles.secEmoji}>{sec.icon}</Text>
                </View>

                {/* Middle: Label + Status */}
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.secLabel}>{sec.label}</Text>
                  <Text style={[styles.secStatus, { color: statusColor }]}>{statusLabel}</Text>
                </View>

                {/* Right: Checkmark */}
                <View style={[styles.statusBadge, completed ? styles.statusBadgeDone : styles.statusBadgePending]}>
                  <Text style={[styles.statusIconText, { color: completed ? '#FFFFFF' : '#94A3B8' }]}>
                    {completed ? '✓' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preview Biodata → (primary CTA) */}
        <TouchableOpacity activeOpacity={0.85} onPress={handlePreview} style={styles.previewBtn}>
          <Text style={styles.previewBtnText}>Preview Biodata  →</Text>
        </TouchableOpacity>

        {/* Save Draft (outlined) */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleSaveToStorage(false)} style={styles.saveDraftBtn}>
          <Text style={styles.saveDraftText}>📑 Save Draft</Text>
        </TouchableOpacity>
      </ScrollView>


      {/* Title Edit Modal */}
      <Modal visible={showTitleModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surfaceCard }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Edit Biodata Title
            </Text>
            <TextInput
              style={[
                styles.titleTextInput,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.isDark ? '#0F172A' : '#F8FAFC',
                },
              ]}
              value={editTitleText}
              onChangeText={setEditTitleText}
              placeholder="e.g. My Marriage Biodata"
              placeholderTextColor={theme.colors.textMuted}
            />
            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="sm"
                onPress={() => setShowTitleModal(false)}
              />
              <Button
                title="Save"
                variant="primary"
                size="sm"
                onPress={() => {
                  setBiodata({ ...biodata, title: editTitleText });
                  setShowTitleModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* More Options Modal */}
      <Modal visible={showMoreModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.moreSheet, { backgroundColor: theme.colors.surfaceCard }]}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>More Actions</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleLoadSample('groom')}
              style={styles.moreActionItem}
            >
              <Text style={styles.moreActionIcon}>🤵</Text>
              <View>
                <Text style={[styles.moreActionTitle, { color: theme.colors.text }]}>
                  Load Groom Demo Profile
                </Text>
                <Text style={[styles.moreActionSub, { color: theme.colors.textMuted }]}>
                  Prefill with standard groom biodata
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleLoadSample('bride')}
              style={styles.moreActionItem}
            >
              <Text style={styles.moreActionIcon}>👰</Text>
              <View>
                <Text style={[styles.moreActionTitle, { color: theme.colors.text }]}>
                  Load Bride Demo Profile
                </Text>
                <Text style={[styles.moreActionSub, { color: theme.colors.textMuted }]}>
                  Prefill with standard bride biodata
                </Text>
              </View>
            </TouchableOpacity>

            <Button
              title="Close"
              variant="outline"
              size="md"
              onPress={() => setShowMoreModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Section Editor Modal */}
      <Modal visible={!!activeSectionModal} animationType="slide">
        <ScreenContainer scrollable={false} withPadding={false}>
          <Header
            title={
              sectionsList.find((s) => s.id === activeSectionModal)?.label || 'Edit Section'
            }
            subtitle="Fill details and save"
            onBack={() => setActiveSectionModal(null)}
          />

          <ScrollView
            contentContainerStyle={styles.sectionEditScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Personal Details Form */}
            {activeSectionModal === 'personalDetails' && (
              <Card variant="outlined" style={styles.formCard}>
                {/* Candidate Photo Picker Card */}
                <View
                  style={[
                    styles.photoPickerRow,
                    { backgroundColor: theme.isDark ? '#0F172A' : '#FFFBEB', borderColor: '#FDE68A' },
                  ]}
                >
                  <ResumeAvatar
                    photoUri={biodata.personalInfo.photoUri}
                    name={biodata.personalInfo.fullName}
                    size={68}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.photoPickerTitle, { color: theme.colors.text }]}>
                      Candidate Photograph
                    </Text>
                    <Text style={[styles.photoPickerSub, { color: theme.colors.textMuted }]}>
                      {biodata.personalInfo.photoUri
                        ? 'Photo is displayed on biodata'
                        : 'Upload photo for marriage biodata'}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowPhotoModal(true)}
                        style={[styles.photoActionBtn, { backgroundColor: '#B45309' }]}
                      >
                        <Text style={styles.photoActionBtnText}>
                          {biodata.personalInfo.photoUri ? '📷 Change Photo' : '📷 Choose Photo'}
                        </Text>
                      </TouchableOpacity>
                      {biodata.personalInfo.photoUri ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            setBiodata({
                              ...biodata,
                              personalInfo: { ...biodata.personalInfo, photoUri: '' },
                            })
                          }
                          style={styles.photoRemoveBtn}
                        >
                          <Text style={styles.photoRemoveBtnText}>✕ Remove</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>

                <Input
                  label="Candidate Full Name *"
                  placeholder="e.g. Priya Sharma"
                  value={biodata.personalInfo.fullName}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, fullName: val },
                    })
                  }
                />
                <Input
                  label="Date of Birth *"
                  placeholder="e.g. 15 May 1998"
                  value={biodata.personalInfo.dateOfBirth}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, dateOfBirth: val },
                    })
                  }
                />
                <Input
                  label="Height *"
                  placeholder={"e.g. 5'4\""}
                  value={biodata.personalInfo.height}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, height: val },
                    })
                  }
                />
                <Input
                  label="Religion & Caste *"
                  placeholder="e.g. Hindu - Sharma / Brahmin"
                  value={biodata.personalInfo.caste}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, caste: val },
                    })
                  }
                />
                <Input
                  label="Mother Tongue"
                  placeholder="e.g. Hindi"
                  value={biodata.personalInfo.motherTongue}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, motherTongue: val },
                    })
                  }
                />
                <Input
                  label="Marital Status"
                  placeholder="e.g. Never Married"
                  value={biodata.personalInfo.maritalStatus}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      personalInfo: { ...biodata.personalInfo, maritalStatus: val as any },
                    })
                  }
                />
              </Card>
            )}

            {/* Education Form */}
            {activeSectionModal === 'education' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Highest Qualification *"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={biodata.educationAndCareer.highestEducation}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        highestEducation: val,
                      },
                    })
                  }
                />
                <Input
                  label="College / University"
                  placeholder="e.g. XYZ University, Pune"
                  value={biodata.educationAndCareer.collegeOrUniversity}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        collegeOrUniversity: val,
                      },
                    })
                  }
                />
                <Input
                  label="Additional Qualifications"
                  placeholder="e.g. Diploma in Web Design"
                  value={biodata.educationAndCareer.additionalCourses}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        additionalCourses: val,
                      },
                    })
                  }
                />
              </Card>
            )}

            {/* Profession Form */}
            {activeSectionModal === 'profession' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Occupation / Designation *"
                  placeholder="e.g. Senior Software Engineer"
                  value={biodata.educationAndCareer.occupation}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        occupation: val,
                      },
                    })
                  }
                />
                <Input
                  label="Company Name"
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  value={biodata.educationAndCareer.companyName}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        companyName: val,
                      },
                    })
                  }
                />
                <Input
                  label="Job Location"
                  placeholder="e.g. Bengaluru / Pune"
                  value={biodata.educationAndCareer.jobLocation}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        jobLocation: val,
                      },
                    })
                  }
                />
                <Input
                  label="Annual Income"
                  placeholder="e.g. 18 LPA"
                  value={biodata.educationAndCareer.annualIncome}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      educationAndCareer: {
                        ...biodata.educationAndCareer,
                        annualIncome: val,
                      },
                    })
                  }
                />
              </Card>
            )}

            {/* Family Details Form */}
            {activeSectionModal === 'familyDetails' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Father's Name *"
                  placeholder="e.g. Shri Rajesh Sharma"
                  value={biodata.family.fatherName}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, fatherName: val },
                    })
                  }
                />
                <Input
                  label="Father's Occupation"
                  placeholder="e.g. Businessman / Retired Govt Officer"
                  value={biodata.family.fatherOccupation}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, fatherOccupation: val },
                    })
                  }
                />
                <Input
                  label="Mother's Name *"
                  placeholder="e.g. Smt. Sunita Sharma"
                  value={biodata.family.motherName}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, motherName: val },
                    })
                  }
                />
                <Input
                  label="Mother's Occupation"
                  placeholder="e.g. Homemaker"
                  value={biodata.family.motherOccupation}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, motherOccupation: val },
                    })
                  }
                />
                <Input
                  label="Brothers & Sisters"
                  placeholder="e.g. 1 Younger Brother (Studying)"
                  value={biodata.family.brothersCount}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, brothersCount: val },
                    })
                  }
                />
              </Card>
            )}

            {/* Lifestyle Form */}
            {activeSectionModal === 'lifestyle' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Family Type"
                  placeholder="Nuclear / Joint Family"
                  value={biodata.family.familyType}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, familyType: val as any },
                    })
                  }
                />
                <Input
                  label="Family Values"
                  placeholder="Traditional with Modern Outlook"
                  value={biodata.family.familyValues}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, familyValues: val },
                    })
                  }
                />
                <Input
                  label="Native Place"
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={biodata.family.nativePlace}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      family: { ...biodata.family, nativePlace: val },
                    })
                  }
                />
              </Card>
            )}

            {/* Expectations Form */}
            {activeSectionModal === 'expectations' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Partner Expectations"
                  placeholder="Looking for a well-educated, understanding and family-oriented partner with similar values..."
                  multiline
                  numberOfLines={5}
                  value={biodata.partnerExpectations}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      partnerExpectations: val,
                    })
                  }
                />
              </Card>
            )}

            {/* Additional Information Form */}
            {activeSectionModal === 'additional' && (
              <Card variant="outlined" style={styles.formCard}>
                <Input
                  label="Gotra"
                  placeholder="e.g. Kashyap"
                  value={biodata.astrology?.gotra}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      astrology: { ...(biodata.astrology || {}), gotra: val },
                    })
                  }
                />
                <Input
                  label="Contact Number"
                  placeholder="e.g. +91 98765 43210"
                  keyboardType="phone-pad"
                  value={biodata.contactDetails.phone1}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      contactDetails: { ...biodata.contactDetails, phone1: val },
                    })
                  }
                />
                <Input
                  label="Contact Email"
                  placeholder="e.g. family@example.com"
                  keyboardType="email-address"
                  value={biodata.contactDetails.email}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      contactDetails: { ...biodata.contactDetails, email: val },
                    })
                  }
                />
                <Input
                  label="Residence Address"
                  placeholder="e.g. Sector 14, Noida, UP"
                  value={biodata.contactDetails.residenceAddress}
                  onChangeText={(val) =>
                    setBiodata({
                      ...biodata,
                      contactDetails: {
                        ...biodata.contactDetails,
                        residenceAddress: val,
                      },
                    })
                  }
                />
              </Card>
            )}

            {/* Save & Done Action */}
            <View style={{ marginTop: 24, marginBottom: 40 }}>
              <Button
                title="✓ Save & Return"
                variant="primary"
                size="lg"
                onPress={() => {
                  handleSaveToStorage(true);
                  setActiveSectionModal(null);
                }}
              />
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>

      {/* Candidate Photo Upload Modal */}
      <PhotoUploadModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhotoUri={biodata.personalInfo.photoUri}
        candidateName={biodata.personalInfo.fullName}
        onSavePhoto={(photoUri) =>
          setBiodata((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, photoUri },
          }))
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // ── Header ──
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, fontWeight: '600', color: '#1E293B' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // ── Build heading ──
  buildTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  buildSub: { fontSize: 13, color: '#64748B', marginBottom: 16 },

  // ── Progress bar ──
  progressWrap: { marginBottom: 20 },
  progressLabel: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  progressBarBg: { height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  progressBarFill: { height: 8, borderRadius: 4, backgroundColor: '#2563EB' },

  // ── Section list ──
  sectionListContainer: { gap: 12 },
  sectionItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
  },
  secIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#C7D5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secIconCircleDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  secEmoji: { fontSize: 18 },
  secLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  secStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeDone: { backgroundColor: '#10B981' },
  statusBadgePending: { borderWidth: 1.5, borderColor: '#CBD5E1' },
  statusIconText: { fontSize: 13, fontWeight: 'bold' },

  // ── Preview + Save buttons ──
  previewBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  previewBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  saveDraftBtn: {
    borderWidth: 1.5,
    borderColor: '#C7D5EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  saveDraftText: { fontSize: 14, fontWeight: '700', color: '#475569' },

  // ── Legacy styles kept for modals ──
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  titleLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  titleValue: { fontSize: 17, fontWeight: '800' },
  pencilBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  pencilIcon: { fontSize: 16 },
  secLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  secIconBox: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  addSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 6,
  },
  addSectionText: { fontSize: 15, fontWeight: '700' },
  bottomToolbar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    borderTopWidth: 1, elevation: 8,
    shadowColor: '#000000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: -2 }, shadowRadius: 6,
  },
  toolBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  toolIcon: { fontSize: 19, marginBottom: 2 },
  toolLabel: { fontSize: 11, fontWeight: '600' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  titleTextInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  moreSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    elevation: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  moreActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  moreActionIcon: {
    fontSize: 22,
  },
  moreActionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  moreActionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionEditScroll: {
    padding: 16,
  },
  formCard: {
    padding: 16,
  },
  photoPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  photoPickerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  photoPickerSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  photoActionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  photoActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  photoRemoveBtn: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  photoRemoveBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
