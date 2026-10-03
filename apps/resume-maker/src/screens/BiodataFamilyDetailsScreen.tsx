/**
 * BiodataFamilyDetailsScreen — Screen 28: Family Details
 *
 * Reference: Father's Name, Father's Occupation (dropdown), Mother's Name,
 * Mother's Occupation (dropdown). Siblings section: Brother & Sister counts (dropdown),
 * "+ Add Sibling Details" dashed entry. Family Type (dropdown), Family Location.
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
import { MarriageBiodataProfile } from '../types/resume.types';

interface Props {
  navigation: any;
  route: any;
}

export const BiodataFamilyDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const biodata: MarriageBiodataProfile = route.params?.biodata;
  const onSave: (updated: MarriageBiodataProfile) => void = route.params?.onSave;

  const [fatherName, setFatherName] = useState(biodata?.family?.fatherName || '');
  const [fatherOccupation, setFatherOccupation] = useState(biodata?.family?.fatherOccupation || '');
  const [motherName, setMotherName] = useState(biodata?.family?.motherName || '');
  const [motherOccupation, setMotherOccupation] = useState(biodata?.family?.motherOccupation || '');
  const [brothersCount, setBrothersCount] = useState(biodata?.family?.brothersCount || '0');
  const [sistersCount, setSistersCount] = useState(biodata?.family?.sistersCount || '0');
  const [familyType, setFamilyType] = useState(biodata?.family?.familyType || 'Nuclear');
  const [familyValues, setFamilyValues] = useState(biodata?.family?.familyValues || '');
  const [nativePlace, setNativePlace] = useState(biodata?.family?.nativePlace || '');
  const [currentCity, setCurrentCity] = useState(biodata?.family?.currentCity || '');

  const handleSaveAndContinue = () => {
    if (!biodata || !onSave) return;
    const updated: MarriageBiodataProfile = {
      ...biodata,
      family: {
        ...biodata.family,
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        brothersCount,
        sistersCount,
        familyType: familyType as 'Nuclear' | 'Joint',
        familyValues,
        nativePlace,
        currentCity,
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
        title="Family Details"
        subtitle="Add information about your family"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Father */}
        <Input
          label="Father's Name *"
          placeholder="e.g. Rajesh Kumar"
          value={fatherName}
          onChangeText={setFatherName}
        />

        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Father's Occupation *</Text>
          <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>
              {fatherOccupation || 'Select Occupation'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          {/* Quick input fallback */}
          <Input
            placeholder="Or type: Business, Govt. Officer, etc."
            value={fatherOccupation}
            onChangeText={setFatherOccupation}
          />
        </View>

        {/* Mother */}
        <Input
          label="Mother's Name *"
          placeholder="e.g. Sunita Kumar"
          value={motherName}
          onChangeText={setMotherName}
        />

        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Mother's Occupation *</Text>
          <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.8}>
            <Text style={styles.dropdownText}>
              {motherOccupation || 'Select Occupation'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          <Input
            placeholder="Or type: Homemaker, Teacher, etc."
            value={motherOccupation}
            onChangeText={setMotherOccupation}
          />
        </View>

        {/* Siblings */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionIcon}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.sectionTitle}>Siblings</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <View style={styles.dropdownField}>
              <Text style={styles.fieldLabel}>Brother *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.8}
                onPress={() => {
                  const n = parseInt(brothersCount, 10) || 0;
                  setBrothersCount(String((n + 1) % 6));
                }}
              >
                <Text style={styles.dropdownText}>{brothersCount}</Text>
                <Text style={styles.chevron}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.halfField}>
            <View style={styles.dropdownField}>
              <Text style={styles.fieldLabel}>Sister *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.8}
                onPress={() => {
                  const n = parseInt(sistersCount, 10) || 0;
                  setSistersCount(String((n + 1) % 6));
                }}
              >
                <Text style={styles.dropdownText}>{sistersCount}</Text>
                <Text style={styles.chevron}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add Sibling Details */}
        <TouchableOpacity style={styles.addSiblingBtn} activeOpacity={0.8}>
          <Text style={styles.addSiblingText}>+ Add Sibling Details</Text>
        </TouchableOpacity>

        {/* Family Type */}
        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Family Type *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            activeOpacity={0.8}
            onPress={() => setFamilyType(familyType === 'Nuclear' ? 'Joint' : 'Nuclear')}
          >
            <Text style={styles.dropdownText}>{familyType} Family</Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Family Values"
          placeholder="Traditional with Modern Outlook"
          value={familyValues}
          onChangeText={setFamilyValues}
        />

        <View style={styles.iconInputWrap}>
          <Text style={styles.inputIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Input
              label="Family Location *"
              placeholder="New Delhi, India"
              value={nativePlace}
              onChangeText={setNativePlace}
            />
          </View>
        </View>

        <Input
          label="Current City"
          placeholder="e.g. Bengaluru"
          value={currentCity}
          onChangeText={setCurrentCity}
        />
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
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
  addSiblingBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7D5EC',
    alignItems: 'center',
    marginBottom: 16,
  },
  addSiblingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
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
