import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarriageBiodataProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  biodata: MarriageBiodataProfile;
  scale?: number;
}

export const ModernCleanBiodataSheet: React.FC<Props> = ({ biodata }) => {
  const accent = biodata.accentColor || '#D97706';
  const p = biodata.personalInfo || {};
  const edu = biodata.educationAndCareer || {};
  const fam = biodata.family || {};
  const contact = biodata.contactDetails || {};
  const partner = biodata.partnerExpectations || '';

  return (
    <View style={styles.sheetContainer}>
      {/* ======================================================== */}
      {/* CONTEMPORARY TOP PROFILE HEADER (PHOTO + NAME + OCCUP)   */}
      {/* ======================================================== */}
      <View style={styles.headerRow}>
        <ResumeAvatar
          photoUri={p.photoUri}
          name={p.fullName || 'Candidate'}
          size={72}
          badgeBorderColor={accent}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.candidateName}>{p.fullName || 'Candidate Name'}</Text>
          <Text style={[styles.occupationSub, { color: accent }]}>
            {edu.occupation || 'Working Professional'}
          </Text>
          <Text style={styles.locationSub}>
            📍 {contact.residenceAddress || p.placeOfBirth || 'New Delhi, India'}
          </Text>
        </View>
      </View>

      {/* ======================================================== */}
      {/* QUICK SNAPSHOT PILL BAR (DOB | Height | Caste | CTC)     */}
      {/* ======================================================== */}
      <View style={styles.snapshotBar}>
        <View style={styles.snapItem}>
          <Text style={styles.snapLabel}>DOB</Text>
          <Text style={styles.snapVal}>{p.dateOfBirth || '-'}</Text>
        </View>
        <View style={styles.snapDivider} />
        <View style={styles.snapItem}>
          <Text style={styles.snapLabel}>Height</Text>
          <Text style={styles.snapVal}>{p.height || '-'}</Text>
        </View>
        <View style={styles.snapDivider} />
        <View style={styles.snapItem}>
          <Text style={styles.snapLabel}>Community</Text>
          <Text style={styles.snapVal}>{p.caste || p.religion || '-'}</Text>
        </View>
        <View style={styles.snapDivider} />
        <View style={styles.snapItem}>
          <Text style={styles.snapLabel}>Package</Text>
          <Text style={[styles.snapVal, { color: accent, fontWeight: '700' }]}>
            {edu.annualIncome || '-'}
          </Text>
        </View>
      </View>

      {/* ======================================================== */}
      {/* MODULAR SECTION CARDS                                    */}
      {/* ======================================================== */}
      {/* 1. Education & Profession */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: accent }]}>🎓 Education & Career Overview</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Highest Degree:</Text>
          <Text style={styles.gridValBold}>{edu.highestEducation || '-'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>University / College:</Text>
          <Text style={styles.gridVal}>{edu.collegeOrUniversity || '-'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Designation:</Text>
          <Text style={styles.gridValBold}>{edu.occupation || '-'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Company / Org:</Text>
          <Text style={styles.gridVal}>{edu.companyName || '-'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Work City:</Text>
          <Text style={styles.gridVal}>{edu.jobLocation || '-'}</Text>
        </View>
      </View>

      {/* 2. Personal & Lifestyle */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: accent }]}>👤 Personal Profile & Lifestyle</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Marital Status:</Text>
          <Text style={styles.gridVal}>{p.maritalStatus || 'Never Married'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Birth Place & Time:</Text>
          <Text style={styles.gridVal}>{p.placeOfBirth || '-'}{p.timeOfBirth ? ` (${p.timeOfBirth})` : ''}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Complexion & Diet:</Text>
          <Text style={styles.gridVal}>{p.complexion || 'Fair'} • {fam.familyValues || 'Vegetarian'}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Mother Tongue:</Text>
          <Text style={styles.gridVal}>{p.motherTongue || 'Hindi / English'}</Text>
        </View>
      </View>

      {/* 3. Family Details */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: accent }]}>👨‍👩‍👦 Family Background</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Father's Profile:</Text>
          <Text style={styles.gridVal}>{fam.fatherName || '-'}{fam.fatherOccupation ? ` (${fam.fatherOccupation})` : ''}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Mother's Profile:</Text>
          <Text style={styles.gridVal}>{fam.motherName || '-'}{fam.motherOccupation ? ` (${fam.motherOccupation})` : ''}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Siblings:</Text>
          <Text style={styles.gridVal}>{fam.brothersCount || '0'} Brother(s) • {fam.sistersCount || '0'} Sister(s)</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Family Settled In:</Text>
          <Text style={styles.gridVal}>{fam.nativePlace || fam.currentCity || '-'}</Text>
        </View>
      </View>

      {/* 4. Partner Expectations (if provided) */}
      {partner ? (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: accent }]}>💫 Partner Preferences</Text>
          <Text style={styles.partnerText}>{partner}</Text>
        </View>
      ) : null}

      {/* 5. Contact Details */}
      <View style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
        <Text style={[styles.cardTitle, { color: accent }]}>📞 Connect With Family</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Primary Phone:</Text>
          <Text style={[styles.gridValBold, { color: accent }]}>{contact.phone1 || '-'}</Text>
        </View>
        {contact.email ? (
          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Email Address:</Text>
            <Text style={styles.gridVal}>{contact.email}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  occupationSub: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  locationSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  snapshotBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  snapItem: {
    alignItems: 'center',
  },
  snapLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  snapVal: {
    fontSize: 10.5,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 1,
  },
  snapDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: 'row',
    paddingVertical: 2.5,
  },
  gridLabel: {
    width: '42%',
    fontSize: 10.5,
    color: '#64748B',
  },
  gridVal: {
    width: '58%',
    fontSize: 10.5,
    color: '#0F172A',
  },
  gridValBold: {
    width: '58%',
    fontSize: 10.5,
    color: '#0F172A',
    fontWeight: '700',
  },
  partnerText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
});
