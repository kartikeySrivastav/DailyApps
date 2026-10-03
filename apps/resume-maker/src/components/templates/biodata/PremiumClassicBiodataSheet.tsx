import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarriageBiodataProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  biodata: MarriageBiodataProfile;
  scale?: number;
}

export const PremiumClassicBiodataSheet: React.FC<Props> = ({ biodata }) => {
  const accent = biodata.accentColor || '#1E3A8A';
  const gold = '#D97706';
  const p = biodata.personalInfo || {};
  const astro = biodata.astrology || {};
  const edu = biodata.educationAndCareer || {};
  const fam = biodata.family || {};
  const contact = biodata.contactDetails || {};

  return (
    <View style={[styles.sheetContainer, { borderColor: accent }]}>
      {/* Symmetrical Regal Top Banner */}
      <View style={[styles.regalHeader, { backgroundColor: accent }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.regalTag}>MATRIMONIAL PROFILE</Text>
          <Text style={styles.candidateName}>{p.fullName || 'Candidate Name'}</Text>
          <Text style={styles.occupationText}>{edu.highestEducation} • {edu.occupation}</Text>
        </View>
        <ResumeAvatar
          photoUri={p.photoUri}
          name={p.fullName || 'Candidate'}
          size={70}
          badgeBorderColor={gold}
        />
      </View>

      <View style={styles.bodyWrap}>
        {/* ======================================================== */}
        {/* Symmetrical Dual-Table Layout                            */}
        {/* Left: Horoscope & Astrological                           */}
        {/* Right: Personal & Physical                               */}
        {/* ======================================================== */}
        <View style={styles.dualTableContainer}>
          {/* Left Table: Kundali & Gotra */}
          <View style={[styles.quadrantBox, { marginRight: 6 }]}>
            <Text style={[styles.quadrantHeading, { color: accent, borderBottomColor: gold }]}>
              ASTROLOGICAL VITALS
            </Text>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Gotra:</Text><Text style={styles.quadVal}>{astro.gotra || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Rashi:</Text><Text style={styles.quadVal}>{astro.rashi || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Nakshatra:</Text><Text style={styles.quadVal}>{astro.nakshatra || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Manglik:</Text><Text style={[styles.quadVal, { color: gold, fontWeight: '700' }]}>{astro.manglik || 'No'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Birth Time:</Text><Text style={styles.quadVal}>{p.timeOfBirth || '-'}</Text></View>
          </View>

          {/* Right Table: Physical & Community */}
          <View style={[styles.quadrantBox, { marginLeft: 6 }]}>
            <Text style={[styles.quadrantHeading, { color: accent, borderBottomColor: gold }]}>
              PERSONAL & PHYSICAL
            </Text>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Date of Birth:</Text><Text style={styles.quadVal}>{p.dateOfBirth || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Height:</Text><Text style={styles.quadVal}>{p.height || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Complexion:</Text><Text style={styles.quadVal}>{p.complexion || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Community:</Text><Text style={styles.quadVal}>{p.caste || p.religion || '-'}</Text></View>
            <View style={styles.quadRow}><Text style={styles.quadLabel}>Birth Place:</Text><Text style={styles.quadVal}>{p.placeOfBirth || '-'}</Text></View>
          </View>
        </View>

        {/* Education & Career Block */}
        <View style={[styles.fullSectionBox, { borderColor: '#E2E8F0' }]}>
          <Text style={[styles.sectionHeading, { color: accent }]}>CAREER & FINANCIAL CREDENTIALS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Highest Degree:</Text>
            <Text style={styles.detailValBold}>{edu.highestEducation} ({edu.collegeOrUniversity || '-'})</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occupation:</Text>
            <Text style={styles.detailValBold}>{edu.occupation} at {edu.companyName || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Annual CTC:</Text>
            <Text style={[styles.detailValBold, { color: gold }]}>{edu.annualIncome || '-'}</Text>
          </View>
        </View>

        {/* Ancestral Heritage & Family Tree */}
        <View style={[styles.fullSectionBox, { borderColor: '#E2E8F0' }]}>
          <Text style={[styles.sectionHeading, { color: accent }]}>FAMILY HERITAGE & BACKGROUND</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Father:</Text>
            <Text style={styles.detailVal}>{fam.fatherName} ({fam.fatherOccupation || 'Self-Employed'})</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mother:</Text>
            <Text style={styles.detailVal}>{fam.motherName} ({fam.motherOccupation || 'Homemaker'})</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Siblings:</Text>
            <Text style={styles.detailVal}>{fam.brothersCount || '0'} Brother(s) • {fam.sistersCount || '0'} Sister(s)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ancestral Roots:</Text>
            <Text style={styles.detailVal}>{fam.nativePlace || fam.currentCity || '-'}</Text>
          </View>
        </View>

        {/* Direct Contact */}
        <View style={[styles.contactBar, { backgroundColor: '#F8FAFC', borderLeftColor: accent }]}>
          <Text style={styles.contactTitle}>Direct Family Contact:</Text>
          <Text style={styles.contactText}>
            📞 {contact.phone1} {contact.phone2 ? ` / ${contact.phone2}` : ''}  |  📍 {contact.residenceAddress || p.placeOfBirth}
          </Text>
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
  regalHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  regalTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 2,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  occupationText: {
    fontSize: 11.5,
    color: '#E2E8F0',
    marginTop: 2,
  },
  bodyWrap: {
    padding: 14,
  },
  dualTableContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  quadrantBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  quadrantHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    borderBottomWidth: 1.5,
    paddingBottom: 2,
    marginBottom: 4,
  },
  quadRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  quadLabel: {
    width: '45%',
    fontSize: 9.5,
    color: '#64748B',
  },
  quadVal: {
    width: '55%',
    fontSize: 9.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  fullSectionBox: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  detailLabel: {
    width: '32%',
    fontSize: 10,
    color: '#64748B',
  },
  detailVal: {
    width: '68%',
    fontSize: 10,
    color: '#0F172A',
  },
  detailValBold: {
    width: '68%',
    fontSize: 10,
    color: '#0F172A',
    fontWeight: '700',
  },
  contactBar: {
    padding: 8,
    borderLeftWidth: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  contactTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactText: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
});
