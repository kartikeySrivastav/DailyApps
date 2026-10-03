import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  AnyDocumentProfile,
  MarriageBiodataProfile,
  ResumeProfile,
  CoverLetterProfile,
} from '../types/resume.types';

// Specialized Multi-Layout Template Sheets
import { ModernSplitResumeSheet } from './templates/resume/ModernSplitResumeSheet';
import { AtsMinimalResumeSheet } from './templates/resume/AtsMinimalResumeSheet';
import { ExecutiveProResumeSheet } from './templates/resume/ExecutiveProResumeSheet';
import { CreativeBoldResumeSheet } from './templates/resume/CreativeBoldResumeSheet';
import { MinimalCleanResumeSheet } from './templates/resume/MinimalCleanResumeSheet';

import { RoyalTraditionalBiodataSheet } from './templates/biodata/RoyalTraditionalBiodataSheet';
import { ModernCleanBiodataSheet } from './templates/biodata/ModernCleanBiodataSheet';
import { ElegantPhotoBiodataSheet } from './templates/biodata/ElegantPhotoBiodataSheet';
import { PremiumClassicBiodataSheet } from './templates/biodata/PremiumClassicBiodataSheet';

interface A4DocumentPreviewProps {
  document: AnyDocumentProfile;
  scale?: number;
}

export const A4DocumentPreview: React.FC<A4DocumentPreviewProps> = ({
  document,
  scale = 1.0,
}) => {
  if (document.type === 'marriage_biodata') {
    const bio = document as MarriageBiodataProfile;
    switch (bio.templateId) {
      case 'modern_clean':
      case 'modern_pastel':
        return <ModernCleanBiodataSheet biodata={bio} scale={scale} />;
      case 'elegant_photo':
      case 'minimal_gold':
        return <ElegantPhotoBiodataSheet biodata={bio} scale={scale} />;
      case 'premium_classic':
        return <PremiumClassicBiodataSheet biodata={bio} scale={scale} />;
      case 'royal_traditional':
      case 'royal_maroon':
      case 'vedic_classic':
      default:
        return <RoyalTraditionalBiodataSheet biodata={bio} scale={scale} />;
    }
  } else if (document.type === 'resume') {
    const res = document as ResumeProfile;
    switch (res.templateId) {
      case 'clean_minimal':
      case 'ats_classic':
        return <AtsMinimalResumeSheet resume={res} scale={scale} />;
      case 'executive_pro':
      case 'executive_slate':
        return <ExecutiveProResumeSheet resume={res} scale={scale} />;
      case 'creative_bold':
      case 'creative_pro':
      case 'creative_infographic':
        return <CreativeBoldResumeSheet resume={res} scale={scale} />;
      case 'minimal_clean':
      case 'fresher_academic':
        return <MinimalCleanResumeSheet resume={res} scale={scale} />;
      case 'modern_blue':
      case 'modern_tech':
      default:
        return <ModernSplitResumeSheet resume={res} scale={scale} />;
    }
  } else {
    return <CoverLetterA4Sheet letter={document as CoverLetterProfile} scale={scale} />;
  }
};

// ---------------------------------------------------------------------------
// Cover Letter A4 Sheet View
// ---------------------------------------------------------------------------
const CoverLetterA4Sheet: React.FC<{ letter: CoverLetterProfile; scale: number }> = ({ letter }) => {
  const accent = letter.accentColor || '#1d4ed8';

  return (
    <View style={[styles.a4Page, { borderColor: '#e2e8f0' }]}>
      <View style={[styles.resumeHeader, { borderBottomColor: accent }]}>
        <Text style={styles.resumeName}>{letter.sender.name}</Text>
        <Text style={[styles.resumeJobTitle, { color: accent }]}>{letter.sender.title}</Text>
        <Text style={styles.resumeContactLine}>
          {letter.sender.email} • {letter.sender.phone} • {letter.sender.location}
        </Text>
      </View>

      <Text style={styles.letterDate}>{letter.date}</Text>

      <View style={styles.letterRecipient}>
        <Text style={{ fontWeight: '700', fontSize: 13 }}>{letter.recipient.hiringManager}</Text>
        {letter.recipient.department ? <Text style={{ fontSize: 12 }}>{letter.recipient.department}</Text> : null}
        <Text style={{ fontSize: 12 }}>{letter.recipient.company}</Text>
        <Text style={{ fontSize: 12 }}>{letter.recipient.location}</Text>
      </View>

      <Text style={styles.letterSalutation}>{letter.salutation}</Text>

      <Text style={styles.letterParagraph}>{letter.openingParagraph}</Text>
      <Text style={styles.letterParagraph}>{letter.bodyParagraph}</Text>
      <Text style={styles.letterParagraph}>{letter.closingParagraph}</Text>

      <View style={styles.letterSignoff}>
        <Text style={{ fontSize: 13 }}>{letter.signOff}</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', marginTop: 18 }}>{letter.sender.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  a4Page: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    padding: 24,
    marginVertical: 12,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  resumeHeader: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 2,
  },
  resumeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  resumeJobTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  resumeContactLine: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
  },
  letterDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 10,
  },
  letterRecipient: {
    marginTop: 10,
    marginBottom: 12,
  },
  letterSalutation: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  letterParagraph: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  letterSignoff: {
    marginTop: 16,
  },
});
