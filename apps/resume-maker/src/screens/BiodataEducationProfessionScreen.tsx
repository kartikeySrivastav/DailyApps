/**
 * BiodataEducationProfessionScreen — Screen 29: Education & Profession
 *
 * Reference: Highest Qualification (dropdown), College / University, Profession (dropdown),
 * Company / Organization, Annual Income, Work Location (with pin icon),
 * Additional Professional Details (multiline with char counter).
 * Bottom: gradient "Save & Continue →" CTA.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ScreenContainer, Input } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { MarriageBiodataProfile } from '../types/resume.types';

interface Props {
  navigation: any;
  route: any;
}

export const BiodataEducationProfessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const biodata: MarriageBiodataProfile = route.params?.biodata;
  const onSave: (updated: MarriageBiodataProfile) => void = route.params?.onSave;

  const [highestEducation, setHighestEducation] = useState(
    biodata?.educationAndCareer?.highestEducation || ''
  );
  const [college, setCollege] = useState(
    biodata?.educationAndCareer?.collegeOrUniversity || ''
  );
  const initialAdditionalCourses = biodata?.educationAndCareer?.additionalCourses || '';
  const [occupation, setOccupation] = useState(
    biodata?.educationAndCareer?.occupation || ''
  );
  const [companyName, setCompanyName] = useState(
    biodata?.educationAndCareer?.companyName || ''
  );
  const [annualIncome, setAnnualIncome] = useState(
    biodata?.educationAndCareer?.annualIncome || ''
  );
  const [jobLocation, setJobLocation] = useState(
    biodata?.educationAndCareer?.jobLocation || ''
  );
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleSaveAndContinue = () => {
    if (!biodata || !onSave) return;
    const updated: MarriageBiodataProfile = {
      ...biodata,
      educationAndCareer: {
        ...biodata.educationAndCareer,
        highestEducation,
        collegeOrUniversity: college,
        additionalCourses: additionalDetails || initialAdditionalCourses,
        occupation,
        companyName,
        annualIncome,
        jobLocation,
      },
    };
    onSave(updated);
    navigation.goBack();
  };

  const handleNavigation = (dest: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    const routeMap: Record<string, string> = {
      home: 'MainTabs',
      documents: 'MasterProfile',
      templates: 'TemplateGallery',
      tools: 'Tools',
      settings: 'Settings',
    };
    navigation.navigate(routeMap[dest] || 'MainTabs');
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="Education & Profession"
        subtitle="Add your education and professional details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Education Section */}
        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Highest Qualification *</Text>
          <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>
              {highestEducation || 'Select Qualification'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          <Input
            placeholder="e.g. Bachelor of Computer Applications"
            value={highestEducation}
            onChangeText={setHighestEducation}
          />
        </View>

        <Input
          label="College / University *"
          placeholder="e.g. ABC University"
          value={college}
          onChangeText={setCollege}
        />

        {/* Profession Section */}
        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Profession *</Text>
          <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>
              {occupation || 'Select Profession'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          <Input
            placeholder="e.g. Frontend Developer"
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>

        <Input
          label="Company / Organization *"
          placeholder="e.g. Lumor"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <Input
          label="Annual Income *"
          placeholder="₹8,00,000"
          value={annualIncome}
          onChangeText={setAnnualIncome}
        />

        <View style={styles.iconInputWrap}>
          <Text style={styles.inputIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Input
              label="Work Location *"
              placeholder="New Delhi, India"
              value={jobLocation}
              onChangeText={setJobLocation}
            />
          </View>
        </View>

        {/* Additional Professional Details */}
        <View style={styles.multilineWrap}>
          <Text style={styles.fieldLabel}>Additional Professional Details</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Add details..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            maxLength={500}
          />
          <Text style={styles.charCounter}>{additionalDetails.length} / 500</Text>
        </View>
      </ScrollView>

      {/* Save & Continue CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveAndContinue}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>Save & Continue  →</Text>
        </TouchableOpacity>
      </View>

      <ResumeBottomNav active="home" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  dropdownField: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1E293B',
  },
  chevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 4,
  },
  inputIcon: {
    fontSize: 16,
    marginTop: 30,
  },
  multilineWrap: {
    marginTop: 8,
    marginBottom: 20,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  ctaButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
