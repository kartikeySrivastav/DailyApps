import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarriageBiodataProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  biodata: MarriageBiodataProfile;
  scale?: number;
}

export const RoyalTraditionalBiodataSheet: React.FC<Props> = ({ biodata }) => {
  const accent = biodata.accentColor || '#881337';
  const p = biodata.personalInfo || {};
  const astro = biodata.astrology || {};
  const edu = biodata.educationAndCareer || {};
  const fam = biodata.family || {};
  const contact = biodata.contactDetails || {};

  const symbol =
    biodata.headerSymbol === 'om'
      ? 'ॐ'
      : biodata.headerSymbol === 'swastik'
      ? '卐'
      : biodata.headerSymbol === 'shree'
      ? '॥ श्री ॥'
      : '🕉️';

  return (
    <View style={[styles.sheetContainer, { borderColor: accent }]}>
      {/* Traditional Ornate Header */}
      <View style={[styles.headerBanner, { borderBottomColor: accent + '30' }]}>
        <View style={styles.symbolRow}>
          <Text style={[styles.sacredSymbol, { color: accent }]}>{symbol}</Text>
          <Text style={[styles.shlokaText, { color: accent }]}>
            {biodata.headerText || '॥ श्री गणेशाय नमः ॥'}
          </Text>
          <Text style={[styles.sacredSymbol, { color: accent }]}>{symbol}</Text>
        </View>

        {/* Traditional Medallion Avatar */}
        <View style={styles.avatarWrap}>
          <ResumeAvatar
            photoUri={p.photoUri}
            name={p.fullName || 'Candidate'}
            size={78}
            badgeBorderColor={accent}
          />
        </View>

        <Text style={styles.candidateName}>{p.fullName || 'Candidate Name'}</Text>
        <View style={[styles.badgePill, { backgroundColor: accent + '15' }]}>
          <Text style={[styles.badgeText, { color: accent }]}>विवाह बायोडाटा • MATRIMONIAL BIODATA</Text>
        </View>
      </View>

      {/* 1. Personal & Physical Details */}
      <View style={[styles.sectionHeading, { backgroundColor: accent + '10', borderLeftColor: accent }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>1. व्यक्तिगत विवरण / PERSONAL DETAILS</Text>
      </View>
      <View style={styles.table}>
        <BioRow label="Date of Birth (जन्म तिथि)" value={p.dateOfBirth} />
        <BioRow label="Time of Birth (जन्म समय)" value={p.timeOfBirth} />
        <BioRow label="Place of Birth (जन्म स्थान)" value={p.placeOfBirth} />
        <BioRow label="Height & Weight (कद एवं वजन)" value={`${p.height || '-'}${p.weight ? ` / ${p.weight}` : ''}`} />
        <BioRow label="Complexion (वर्ण)" value={p.complexion} />
        <BioRow label="Religion & Caste (धर्म एवं जाति)" value={`${p.religion || '-'} — ${p.caste || '-'}${p.subCaste ? ` (${p.subCaste})` : ''}`} />
        <BioRow label="Marital Status (वैवाहिक स्थिति)" value={p.maritalStatus} />
      </View>

      {/* 2. Horoscope / Kundali */}
      <View style={[styles.sectionHeading, { backgroundColor: accent + '10', borderLeftColor: accent }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>2. कुण्डली एवं ज्योतिष / KUNDALI DETAILS</Text>
      </View>
      <View style={styles.table}>
        <BioRow label="Gotra (गोत्र)" value={astro.gotra} highlight accent={accent} />
        <BioRow label="Rashi / Nakshatra (राशि / नक्षत्र)" value={`${astro.rashi || '-'} / ${astro.nakshatra || '-'}`} />
        <BioRow label="Manglik (मांगलिक)" value={astro.manglik} highlight accent={accent} />
        <BioRow label="Gan / Nadi / Charan" value={`${astro.gan || '-'} / ${astro.nadi || '-'} / ${astro.charan || '-'}`} />
      </View>

      {/* 3. Education & Profession */}
      <View style={[styles.sectionHeading, { backgroundColor: accent + '10', borderLeftColor: accent }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>3. शिक्षा एवं व्यवसाय / EDUCATION & CAREER</Text>
      </View>
      <View style={styles.table}>
        <BioRow label="Qualification (उच्चतम शिक्षा)" value={edu.highestEducation} highlight accent={accent} />
        <BioRow label="College / University" value={edu.collegeOrUniversity} />
        <BioRow label="Occupation (व्यवसाय)" value={edu.occupation} highlight accent={accent} />
        <BioRow label="Company & Location" value={`${edu.companyName || '-'}${edu.jobLocation ? ` (${edu.jobLocation})` : ''}`} />
        <BioRow label="Annual Income (वार्षिक आय)" value={edu.annualIncome} highlight accent={accent} />
      </View>

      {/* 4. Family Background */}
      <View style={[styles.sectionHeading, { backgroundColor: accent + '10', borderLeftColor: accent }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>4. पारिवारिक विवरण / FAMILY BACKGROUND</Text>
      </View>
      <View style={styles.table}>
        <BioRow label="Father (पिता)" value={`${fam.fatherName || '-'}${fam.fatherOccupation ? ` (${fam.fatherOccupation})` : ''}`} />
        <BioRow label="Mother (माता)" value={`${fam.motherName || '-'}${fam.motherOccupation ? ` (${fam.motherOccupation})` : ''}`} />
        <BioRow label="Siblings (भाई / बहन)" value={`Brothers: ${fam.brothersCount || '0'} | Sisters: ${fam.sistersCount || '0'}`} />
        <BioRow label="Family Type (परिवार प्रकार)" value={`${fam.familyType || 'Nuclear'}${fam.familyValues ? ` (${fam.familyValues})` : ''}`} />
        <BioRow label="Native Place (पैतृक निवास)" value={fam.nativePlace} />
      </View>

      {/* 5. Contact Details */}
      <View style={[styles.sectionHeading, { backgroundColor: accent + '10', borderLeftColor: accent }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>5. संपर्क सूत्र / CONTACT DETAILS</Text>
      </View>
      <View style={styles.table}>
        <BioRow label="Contact Person (संपर्क सूत्र)" value={contact.contactPerson || fam.fatherName} />
        <BioRow label="Phone (मोबाइल)" value={`${contact.phone1 || '-'}${contact.phone2 ? ` / ${contact.phone2}` : ''}`} highlight accent={accent} />
        <BioRow label="Address (पता)" value={contact.residenceAddress || p.placeOfBirth} />
      </View>

      {/* Auspicious Footer */}
      <View style={styles.footerNote}>
        <Text style={[styles.footerText, { color: accent }]}>॥ शुभम भवतु ॥ • Strictly for Matrimonial Alliance Consideration</Text>
      </View>
    </View>
  );
};

const BioRow: React.FC<{ label: string; value?: string; highlight?: boolean; accent?: string }> = ({
  label,
  value,
  highlight,
  accent,
}) => (
  <View style={styles.bioRow}>
    <Text style={styles.bioLabel}>{label}:</Text>
    <Text style={[styles.bioValue, highlight && { color: accent, fontWeight: '700' }]}>
      {value || '-'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    padding: 18,
    marginVertical: 8,
    elevation: 3,
  },
  headerBanner: {
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1.5,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sacredSymbol: {
    fontSize: 18,
  },
  shlokaText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  avatarWrap: {
    marginTop: 6,
    marginBottom: 6,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionHeading: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderLeftWidth: 4,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  table: {
    paddingHorizontal: 4,
  },
  bioRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  bioLabel: {
    width: '45%',
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  bioValue: {
    width: '55%',
    fontSize: 10.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
