/**
 * BiodataLifestyleScreen — Screen 30: Lifestyle & Expectations
 *
 * Reference: Diet (dropdown: Vegetarian/Non-Veg/Eggetarian/Vegan),
 * Smoking + Drinking row (dropdown: No/Yes/Occasionally),
 * Hobbies (removable chips + add), Interests (removable chips + add),
 * About Me (multiline with 500-char counter),
 * Partner Expectations (multiline with 500-char counter).
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
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { MarriageBiodataProfile } from '../types/resume.types';

interface Props {
  navigation: any;
  route: any;
}

const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];
const HABIT_OPTIONS = ['No', 'Yes', 'Occasionally'];

export const BiodataLifestyleScreen: React.FC<Props> = ({ navigation, route }) => {
  const biodata: MarriageBiodataProfile = route.params?.biodata;
  const onSave: (updated: MarriageBiodataProfile) => void = route.params?.onSave;

  const [diet, setDiet] = useState('Vegetarian');
  const [smoking, setSmoking] = useState('No');
  const [drinking, setDrinking] = useState('No');
  const [hobbies, setHobbies] = useState<string[]>(
    ['Travel', 'Reading', 'Photography', 'Music', 'Fitness']
  );
  const [interests, setInterests] = useState<string[]>(
    ['Technology', 'Movies', 'Sports']
  );
  const [hobbyInput, setHobbyInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [expectations, setExpectations] = useState(biodata?.partnerExpectations || '');

  const addHobby = () => {
    if (hobbyInput.trim()) {
      setHobbies([...hobbies, hobbyInput.trim()]);
      setHobbyInput('');
    }
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const cycleOption = (current: string, options: string[]) => {
    const idx = options.indexOf(current);
    return options[(idx + 1) % options.length];
  };

  const handleSaveAndContinue = () => {
    if (!biodata || !onSave) return;
    const updated: MarriageBiodataProfile = {
      ...biodata,
      partnerExpectations: expectations,
      family: {
        ...biodata.family,
        familyValues: biodata.family.familyValues || aboutMe,
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
        title="Lifestyle & Expectations"
        subtitle="Tell us about your lifestyle and preferences"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Diet */}
        <View style={styles.dropdownField}>
          <Text style={styles.fieldLabel}>Diet *</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            activeOpacity={0.8}
            onPress={() => setDiet(cycleOption(diet, DIET_OPTIONS))}
          >
            <View style={styles.dropdownLeft}>
              <Text style={styles.dropdownIcon}>🍽</Text>
              <Text style={styles.dropdownText}>{diet}</Text>
            </View>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
        </View>

        {/* Smoking + Drinking */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <View style={styles.dropdownField}>
              <Text style={styles.fieldLabel}>Smoking *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.8}
                onPress={() => setSmoking(cycleOption(smoking, HABIT_OPTIONS))}
              >
                <View style={styles.dropdownLeft}>
                  <Text style={styles.dropdownIcon}>🚭</Text>
                  <Text style={styles.dropdownText}>{smoking}</Text>
                </View>
                <Text style={styles.chevron}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.halfField}>
            <View style={styles.dropdownField}>
              <Text style={styles.fieldLabel}>Drinking *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.8}
                onPress={() => setDrinking(cycleOption(drinking, HABIT_OPTIONS))}
              >
                <View style={styles.dropdownLeft}>
                  <Text style={styles.dropdownIcon}>🥃</Text>
                  <Text style={styles.dropdownText}>{drinking}</Text>
                </View>
                <Text style={styles.chevron}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hobbies Chips */}
        <View style={styles.chipSection}>
          <Text style={styles.fieldLabel}>Hobbies *</Text>
          <View style={styles.chipWrap}>
            {hobbies.map((h, i) => (
              <TouchableOpacity
                key={`${h}-${i}`}
                style={styles.chip}
                activeOpacity={0.8}
                onPress={() => setHobbies(hobbies.filter((_, idx) => idx !== i))}
              >
                <Text style={styles.chipText}>{h}</Text>
                <Text style={styles.chipRemove}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chipInputRow}>
            <TextInput
              style={styles.chipInput}
              placeholder="Add hobby..."
              placeholderTextColor="#94A3B8"
              value={hobbyInput}
              onChangeText={setHobbyInput}
              onSubmitEditing={addHobby}
            />
            <TouchableOpacity style={styles.addChipBtn} onPress={addHobby}>
              <Text style={styles.addChipText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interests Chips */}
        <View style={styles.chipSection}>
          <Text style={styles.fieldLabel}>Interests *</Text>
          <View style={styles.chipWrap}>
            {interests.map((h, i) => (
              <TouchableOpacity
                key={`${h}-${i}`}
                style={styles.chip}
                activeOpacity={0.8}
                onPress={() => setInterests(interests.filter((_, idx) => idx !== i))}
              >
                <Text style={styles.chipText}>{h}</Text>
                <Text style={styles.chipRemove}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chipInputRow}>
            <TextInput
              style={styles.chipInput}
              placeholder="Add interest..."
              placeholderTextColor="#94A3B8"
              value={interestInput}
              onChangeText={setInterestInput}
              onSubmitEditing={addInterest}
            />
            <TouchableOpacity style={styles.addChipBtn} onPress={addInterest}>
              <Text style={styles.addChipText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Me */}
        <View style={styles.multilineWrap}>
          <Text style={styles.fieldLabel}>About Me *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Simple, family-oriented and career-focused person who enjoys learning new technologies and travelling."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={aboutMe}
            onChangeText={setAboutMe}
            maxLength={500}
          />
          <Text style={styles.charCounter}>{aboutMe.length} / 500</Text>
        </View>

        {/* Partner Expectations */}
        <View style={styles.multilineWrap}>
          <Text style={styles.fieldLabel}>Partner Expectations *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Looking for a kind, understanding and family-oriented partner."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={expectations}
            onChangeText={setExpectations}
            maxLength={500}
          />
          <Text style={styles.charCounter}>{expectations.length} / 500</Text>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  dropdownField: {
    marginBottom: 10,
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
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownIcon: {
    fontSize: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1E293B',
  },
  chevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
  chipSection: {
    marginBottom: 16,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 10,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
  },
  chipRemove: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  chipInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  addChipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  multilineWrap: {
    marginBottom: 16,
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
