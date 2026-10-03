/**
 * BiodataPersonalDetailsScreen — Screen 27: Personal Details
 *
 * Reference: Avatar with camera badge, Change Photo button, Full Name, DOB + Age row,
 * Gender + Height row (dropdown-style), Religion + Community row, Location, Phone, Email.
 * Bottom: gradient "Save & Continue →" CTA.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer, Input } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { ResumeAvatar } from '../components/ResumeAvatar';
import { PhotoUploadModal } from '../components/PhotoUploadModal';
import { MarriageBiodataProfile } from '../types/resume.types';

interface Props {
  navigation: any;
  route: any;
}

export const BiodataPersonalDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const biodata: MarriageBiodataProfile = route.params?.biodata;
  const onSave: (updated: MarriageBiodataProfile) => void = route.params?.onSave;

  const [fullName, setFullName] = useState(biodata?.personalInfo?.fullName || '');
  const [dob, setDob] = useState(biodata?.personalInfo?.dateOfBirth || '');
  const [height, setHeight] = useState(biodata?.personalInfo?.height || '');
  const [gender, setGender] = useState(biodata?.personalInfo?.gender || 'Male');
  const [religion, setReligion] = useState(biodata?.personalInfo?.religion || '');
  const [caste, setCaste] = useState(biodata?.personalInfo?.caste || '');
  const [motherTongue, setMotherTongue] = useState(biodata?.personalInfo?.motherTongue || '');
  const [maritalStatus, setMaritalStatus] = useState(biodata?.personalInfo?.maritalStatus || 'Never Married');
  const [placeOfBirth, setPlaceOfBirth] = useState(biodata?.personalInfo?.placeOfBirth || '');
  const [timeOfBirth, setTimeOfBirth] = useState(biodata?.personalInfo?.timeOfBirth || '');
  const [complexion, setComplexion] = useState(biodata?.personalInfo?.complexion || '');
  const [photoUri, setPhotoUri] = useState(biodata?.personalInfo?.photoUri || '');
  const [phone, setPhone] = useState(biodata?.contactDetails?.phone1 || '');
  const [email, setEmail] = useState(biodata?.contactDetails?.email || '');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleSaveAndContinue = () => {
    if (!biodata || !onSave) return;
    const updated: MarriageBiodataProfile = {
      ...biodata,
      personalInfo: {
        ...biodata.personalInfo,
        fullName,
        dateOfBirth: dob,
        height,
        gender: gender as any,
        religion,
        caste,
        motherTongue,
        maritalStatus: maritalStatus as any,
        placeOfBirth,
        timeOfBirth,
        complexion,
        photoUri,
      },
      contactDetails: {
        ...biodata.contactDetails,
        phone1: phone,
        email,
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
        title="Personal Details"
        subtitle="Enter your basic information"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarWrap}>
            <ResumeAvatar
              photoUri={photoUri}
              name={fullName}
              size={90}
            />
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraBadgeIcon}>📷</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowPhotoModal(true)}
            style={styles.changePhotoBtn}
          >
            <Text style={styles.changePhotoBtnText}>
              {photoUri ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Input
            label="Full Name *"
            placeholder="e.g. Rahul Kumar"
            value={fullName}
            onChangeText={setFullName}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Date of Birth *"
                placeholder="15 May 2000"
                value={dob}
                onChangeText={setDob}
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Time of Birth"
                placeholder="10:30 AM"
                value={timeOfBirth}
                onChangeText={setTimeOfBirth}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <View style={styles.dropdownField}>
                <Text style={styles.fieldLabel}>Gender *</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  activeOpacity={0.8}
                  onPress={() => setGender(gender === 'Male' ? 'Female' : 'Male')}
                >
                  <Text style={styles.dropdownText}>{gender}</Text>
                  <Text style={styles.chevron}>⌄</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.halfField}>
              <Input
                label="Height *"
                placeholder={"5'8\""}
                value={height}
                onChangeText={setHeight}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Religion *"
                placeholder="Hindu"
                value={religion}
                onChangeText={setReligion}
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Community *"
                placeholder="General"
                value={caste}
                onChangeText={setCaste}
              />
            </View>
          </View>

          <Input
            label="Mother Tongue"
            placeholder="Hindi"
            value={motherTongue}
            onChangeText={setMotherTongue}
          />

          <Input
            label="Complexion"
            placeholder="Fair / Wheatish"
            value={complexion}
            onChangeText={setComplexion}
          />

          <View style={styles.dropdownField}>
            <Text style={styles.fieldLabel}>Marital Status</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              activeOpacity={0.8}
              onPress={() => {
                const statuses = ['Never Married', 'Divorced', 'Awaiting Divorce', 'Widowed'] as const;
                const idx = statuses.indexOf(maritalStatus as any);
                setMaritalStatus(statuses[(idx + 1) % statuses.length]);
              }}
            >
              <Text style={styles.dropdownText}>{maritalStatus}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconInputWrap}>
            <Text style={styles.inputIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Input
                label="Location *"
                placeholder="New Delhi, India"
                value={placeOfBirth}
                onChangeText={setPlaceOfBirth}
              />
            </View>
          </View>

          <View style={styles.iconInputWrap}>
            <Text style={styles.inputIcon}>📞</Text>
            <View style={{ flex: 1 }}>
              <Input
                label="Phone *"
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.iconInputWrap}>
            <Text style={styles.inputIcon}>✉️</Text>
            <View style={{ flex: 1 }}>
              <Input
                label="Email *"
                placeholder="rahul@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
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

      {/* Photo Modal */}
      <PhotoUploadModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhotoUri={photoUri}
        candidateName={fullName}
        onSavePhoto={(uri) => setPhotoUri(uri)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadgeIcon: {
    fontSize: 14,
  },
  changePhotoBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  changePhotoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  formSection: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  dropdownField: {
    marginBottom: 12,
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
