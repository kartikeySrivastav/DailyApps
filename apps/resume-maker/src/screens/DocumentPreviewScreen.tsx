import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ScreenContainer, Header, Button } from '@dailyapps/ui';
import { useAnalytics } from '@dailyapps/analytics';
import { AnyDocumentProfile } from '../types/resume.types';
import { A4DocumentPreview } from '../components/A4DocumentPreview';
import { ColorPalettePicker } from '../components/ColorPalettePicker';
import { generateDocumentHtml } from '../templates/documentHtmlGenerator';
import { BIODATA_TEMPLATES, RESUME_TEMPLATES } from '../templates/templateCatalog';

interface Props {
  navigation: any;
  route: any;
}

export const DocumentPreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();

  const [document, setDocument] = useState<AnyDocumentProfile>(route.params.document);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const isBiodata = document.type === 'marriage_biodata';
  const templates = isBiodata ? BIODATA_TEMPLATES : RESUME_TEMPLATES;

  const handleShare = async () => {
    try {
      analytics.logEvent('document_shared', { type: document.type, title: document.title });
      let message = '';
      if (isBiodata) {
        const bio = document as any;
        message = `*${bio.headerText || '॥ श्री गणेशाय नमः ॥'}*\n\n` +
          `*विवाह बायोडाटा (Matrimonial Profile)*\n` +
          `*Name:* ${bio.personalInfo.fullName}\n` +
          `*DOB:* ${bio.personalInfo.dateOfBirth} (${bio.personalInfo.timeOfBirth})\n` +
          `*Height:* ${bio.personalInfo.height} | *Complexion:* ${bio.personalInfo.complexion}\n` +
          `*Gotra:* ${bio.astrology.gotra} | *Manglik:* ${bio.astrology.manglik}\n` +
          `*Education:* ${bio.educationAndCareer.highestEducation} (${bio.educationAndCareer.collegeOrUniversity})\n` +
          `*Occupation:* ${bio.educationAndCareer.occupation} at ${bio.educationAndCareer.companyName}\n` +
          `*Income:* ${bio.educationAndCareer.annualIncome}\n` +
          `*Father:* ${bio.family.fatherName} (${bio.family.fatherOccupation})\n` +
          `*Mother:* ${bio.family.motherName} (${bio.family.motherOccupation})\n` +
          `*Native Place:* ${bio.family.nativePlace}\n` +
          `*Contact:* ${bio.contactDetails.phone1} (${bio.contactDetails.contactPerson})\n\n` +
          `Generated via DailyApps Resume & Biodata Studio.`;
      } else {
        const res = document as any;
        message = `*${res.personalInfo.fullName}* - ${res.personalInfo.jobTitle}\n` +
          `Email: ${res.personalInfo.email} | Phone: ${res.personalInfo.phone}\n` +
          `Location: ${res.personalInfo.location}\n\n` +
          `Summary: ${res.personalInfo.summary}\n\n` +
          `Generated via ProResume Builder.`;
      }

      await Share.share({
        message,
        title: document.title,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportHtml = () => {
    analytics.logEvent('document_html_exported', { type: document.type });
    generateDocumentHtml(document);
    Alert.alert(
      'Printable Document Ready! 🎉',
      `Full print-ready A4 document is generated with custom styling for ${document.title}. You can print or share directly.`,
      [
        { text: 'Share Document Text', onPress: handleShare },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <Header
        title={isBiodata ? '💍 Biodata Preview' : '💼 Resume Preview'}
        subtitle={document.title}
        onBack={() => navigation.goBack()}
        rightAction={
          <Button title="📤 Share" size="sm" variant="primary" onPress={handleShare} />
        }
      />

      {/* Floating Toolbar for quick template & color styling */}
      <View style={[styles.toolbar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tplScroll}>
          <Text style={[styles.toolbarLabel, { color: theme.colors.textMuted }]}>Style:</Text>
          {templates.map((tpl) => {
            const isSelected = document.templateId === tpl.id;
            return (
              <TouchableOpacity
                key={tpl.id}
                onPress={() => setDocument({ ...document, templateId: tpl.id as any })}
                style={[
                  styles.tplPill,
                  { borderColor: theme.colors.border },
                  isSelected && {
                    backgroundColor: document.accentColor,
                    borderColor: document.accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tplPillText,
                    { color: isSelected ? '#ffffff' : theme.colors.text },
                  ]}
                >
                  {tpl.name.split('(')[0].trim()}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setShowColorPicker(!showColorPicker)}
            style={[styles.colorToggleBtn, { backgroundColor: document.accentColor }]}
          >
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>🎨 Color</Text>
          </TouchableOpacity>
        </ScrollView>

        {showColorPicker && (
          <ColorPalettePicker
            selectedColor={document.accentColor}
            onSelectColor={(c) => {
              setDocument({ ...document, accentColor: c });
              setShowColorPicker(false);
            }}
          />
        )}
      </View>

      {/* Live A4 Page Preview */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <A4DocumentPreview document={document} />

        {/* Export & Actions Bar */}
        <View style={styles.actionSection}>
          <Button
            title="🖨️ Export Print-Ready Document"
            variant="primary"
            onPress={handleExportHtml}
          />
          <Button
            title="📲 Share via WhatsApp / Message"
            variant="secondary"
            onPress={handleShare}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tplScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  toolbarLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  tplPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tplPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  colorToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
});
