import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarriageBiodataProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  biodata: MarriageBiodataProfile;
  scale?: number;
}

export const ElegantPhotoBiodataSheet: React.FC<Props> = ({ biodata }) => {
  const accent = biodata.accentColor || '#BE185D';
  const p = biodata.personalInfo || {};
  const edu = biodata.educationAndCareer || {};
  const fam = biodata.family || {};
  const contact = biodata.contactDetails || {};

  return (
    <View style={[styles.sheetContainer, { borderColor: accent + '40' }]}>
      {/* ======================================================== */}
      {/* PROMINENT SPOTLIGHT PHOTO BANNER                         */}
      {/* ======================================================== */}
      <View style={[styles.photoSpotlightBanner, { backgroundColor: '#FDF2F8' }]}>
        <View style={styles.avatarGlowWrap}>
          <ResumeAvatar
            photoUri={p.photoUri}
            name={p.fullName || 'Candidate'}
            size={90}
            badgeBorderColor={accent}
          />
        </View>
        <Text style={styles.candidateName}>{p.fullName || 'Candidate Name'}</Text>
        <Text style={[styles.jobSubtitle, { color: accent }]}>
          {edu.occupation || 'Working Professional'}
        </Text>
        <Text style={styles.quoteSub}>
          Seeking a caring, compatible partner for a harmonious life journey
        </Text>
      </View>

      <View style={styles.contentWrap}>
        {/* ======================================================== */}
        {/* VITAL ATTRIBUTES 2-COLUMN GRID                           */}
        {/* ======================================================== */}
        <View style={styles.vitalsBox}>
          <View style={styles.vitalCol}>
            <Text style={styles.vitalLabel}>Date of Birth</Text>
            <Text style={styles.vitalVal}>{p.dateOfBirth || '-'}</Text>

            <Text style={styles.vitalLabel}>Height</Text>
            <Text style={styles.vitalVal}>{p.height || '-'}</Text>

            <Text style={styles.vitalLabel}>Religion / Caste</Text>
            <Text style={styles.vitalVal}>{p.religion || '-'} • {p.caste || '-'}</Text>
          </View>
          <View style={styles.vitalCol}>
            <Text style={styles.vitalLabel}>Highest Degree</Text>
            <Text style={[styles.vitalVal, { color: accent, fontWeight: '700' }]}>
              {edu.highestEducation || '-'}
            </Text>

            <Text style={styles.vitalLabel}>Annual Package</Text>
            <Text style={[styles.vitalVal, { color: accent, fontWeight: '700' }]}>
              {edu.annualIncome || '-'}
            </Text>

            <Text style={styles.vitalLabel}>Current Location</Text>
            <Text style={styles.vitalVal}>{edu.jobLocation || fam.nativePlace || '-'}</Text>
          </View>
        </View>

        {/* Education & Employment */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.secTitle, { color: accent }]}>Education & Career Journey</Text>
          <Text style={styles.entryBold}>{edu.highestEducation}</Text>
          <Text style={styles.entrySub}>{edu.collegeOrUniversity || '-'}</Text>
          <Text style={[styles.entryBold, { marginTop: 4 }]}>
            {edu.occupation} — <Text style={{ fontWeight: '500' }}>{edu.companyName}</Text>
          </Text>
        </View>

        {/* Family Background */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.secTitle, { color: accent }]}>Family Roots & Heritage</Text>
          <Text style={styles.familyText}>
            • Father: <Text style={{ fontWeight: '700' }}>{fam.fatherName}</Text> ({fam.fatherOccupation || 'Retired'})
          </Text>
          <Text style={styles.familyText}>
            • Mother: <Text style={{ fontWeight: '700' }}>{fam.motherName}</Text> ({fam.motherOccupation || 'Homemaker'})
          </Text>
          <Text style={styles.familyText}>
            • Siblings: {fam.brothersCount || '0'} Brother(s), {fam.sistersCount || '0'} Sister(s)
          </Text>
          <Text style={styles.familyText}>
            • Family Home: {fam.nativePlace || fam.currentCity || '-'}
          </Text>
        </View>

        {/* Contact Strip */}
        <View style={[styles.contactCard, { borderColor: accent + '30', backgroundColor: '#FDF2F8' }]}>
          <Text style={[styles.contactCardTitle, { color: accent }]}>Contact & Residence</Text>
          <Text style={styles.contactText}>📞 {contact.phone1 || '-'}  {contact.phone2 ? `| 📞 ${contact.phone2}` : ''}</Text>
          <Text style={styles.contactText}>✉️ {contact.email || '-'}  |  📍 {contact.residenceAddress || p.placeOfBirth || '-'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 3,
  },
  photoSpotlightBanner: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
  },
  avatarGlowWrap: {
    padding: 3,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    marginBottom: 8,
  },
  candidateName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  jobSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  quoteSub: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  contentWrap: {
    padding: 14,
  },
  vitalsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 12,
  },
  vitalCol: {
    width: '50%',
  },
  vitalLabel: {
    fontSize: 9.5,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 4,
  },
  vitalVal: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: 12,
  },
  secTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 2,
  },
  entryBold: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  entrySub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  familyText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 16,
  },
  contactCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  contactCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
});
