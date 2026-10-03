/**
 * BiodataTypeSelectorScreen — Screen 24: Create Biodata / Choose Biodata Type
 *
 * Reference: Large radio-style cards for Marriage Biodata (selected), General Biodata,
 * Professional Biodata. Each card has a colored icon circle, title, description, and
 * a radio indicator. Bottom: gradient Continue → CTA.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

type BiodataType = 'marriage' | 'general' | 'professional';

interface TypeOption {
  id: BiodataType;
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
}

const TYPES: TypeOption[] = [
  {
    id: 'marriage',
    icon: '💍',
    iconBg: '#EDE9FE',
    title: 'Marriage Biodata',
    subtitle: 'For marriage and matrimonial purposes',
  },
  {
    id: 'general',
    icon: '📄',
    iconBg: '#E0F2FE',
    title: 'General Biodata',
    subtitle: 'For personal and general use',
  },
  {
    id: 'professional',
    icon: '💼',
    iconBg: '#F0FDF4',
    title: 'Professional Biodata',
    subtitle: 'For professional or formal purposes',
  },
];

interface Props {
  navigation: any;
  route: any;
}

export const BiodataTypeSelectorScreen: React.FC<Props> = ({ navigation }) => {
  const [selected, setSelected] = useState<BiodataType>('marriage');

  const handleContinue = () => {
    navigation.navigate('TemplateSelector', {
      schemaId: 'modern_marriage_biodata',
      category: 'marriage_biodata',
      biodataType: selected,
      title: 'Biodata Templates',
    });
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
        title="Create Biodata"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Text style={styles.heading}>Choose Biodata Type</Text>
        <Text style={styles.subheading}>Select the format that fits your needs</Text>

        {/* Type Cards */}
        <View style={styles.cardsContainer}>
          {TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.8}
                onPress={() => setSelected(type.id)}
                style={[
                  styles.typeCard,
                  isSelected && styles.typeCardSelected,
                ]}
              >
                {/* Icon */}
                <View style={[styles.iconCircle, { backgroundColor: type.iconBg }]}>
                  <Text style={styles.iconEmoji}>{type.icon}</Text>
                </View>

                {/* Text */}
                <View style={styles.typeTextWrap}>
                  <Text style={[styles.typeTitle, isSelected && styles.typeTitleSelected]}>
                    {type.title}
                  </Text>
                  <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
                </View>

                {/* Radio */}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <ResumeBottomNav active="home" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
  },
  cardsContainer: {
    gap: 14,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F5FF',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  typeTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  typeTitleSelected: {
    color: '#2563EB',
  },
  typeSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 3,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
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
