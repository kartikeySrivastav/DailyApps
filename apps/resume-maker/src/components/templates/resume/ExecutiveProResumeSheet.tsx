import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ResumeProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  resume: ResumeProfile;
  scale?: number;
}

export const ExecutiveProResumeSheet: React.FC<Props> = ({ resume }) => {
  const hidden = new Set(resume.hiddenSections || []);
  const p = resume.personalInfo || {};
  const experiences = resume.experience || [];
  const educations = resume.education || [];
  const skillsList = resume.skillCategories?.flatMap((c) => c.skills) || [];
  const projects = resume.projects || [];
  const achievements = resume.achievements || [];

  return (
    <View style={styles.sheetContainer}>
      {/* ======================================================== */}
      {/* EXECUTIVE FULL-WIDTH DEEP SLATE BANNER                   */}
      {/* ======================================================== */}
      {!hidden.has('personalInfo') && (
        <View style={styles.execBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.execName}>{(p.fullName || 'EXECUTIVE LEADER').toUpperCase()}</Text>
            <Text style={styles.execTitle}>{p.jobTitle || 'Chief Technology Officer / Senior Director'}</Text>
            <View style={styles.goldDivider} />
            <Text style={styles.execContact}>
              📍 {p.location || 'New Delhi'}   |   ✉ {p.email || 'leader@corp.com'}   |   📞 {p.phone || '+91 98765 43210'}
            </Text>
          </View>
          <View style={styles.avatarWrap}>
            <ResumeAvatar
              photoUri={p.photoUri}
              name={p.fullName || 'Leader'}
              size={66}
              badgeBorderColor="#F59E0B"
            />
          </View>
        </View>
      )}

      <View style={styles.bodyContent}>
        {/* Executive Summary */}
        {!hidden.has('summary') && p.summary ? (
          <View style={styles.section}>
            <Text style={styles.secTitle}>EXECUTIVE PROFILE</Text>
            <Text style={styles.summaryText}>{p.summary}</Text>
          </View>
        ) : null}

        {/* Core Competencies & Expertise Grid */}
        {!hidden.has('skills') && skillsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>CORE COMPETENCIES & STRATEGIC EXPERTISE</Text>
            <View style={styles.competencyGrid}>
              {skillsList.map((skill, index) => (
                <View key={index} style={styles.competencyCell}>
                  <Text style={styles.goldCheck}>✓</Text>
                  <Text style={styles.competencyLabel}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Professional Leadership History */}
        {!hidden.has('workExperience') && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>PROFESSIONAL EXPERIENCE & ACHIEVEMENTS</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.jobRoleText}>{exp.jobTitle}</Text>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeText}>
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                <Text style={styles.companySub}>{exp.company} • {exp.location || 'HQ'}</Text>
                {exp.description ? <Text style={styles.summaryText}>{exp.description}</Text> : null}
                {exp.highlights?.map((h, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.goldBullet}>▪</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education & Credentials */}
        {!hidden.has('education') && educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>EDUCATION & EXECUTIVE CREDENTIALS</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={styles.eduBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.jobRoleText}>{edu.degree}</Text>
                  <Text style={styles.dateBadgeText}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
                </View>
                <Text style={styles.companySub}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Projects or Strategic Initiatives */}
        {!hidden.has('projects') && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>STRATEGIC INITIATIVES & VENTURES</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projBlock}>
                <Text style={styles.jobRoleText}>{proj.title}</Text>
                {proj.description ? <Text style={styles.summaryText}>{proj.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Achievements / Board Honors */}
        {!hidden.has('achievements') && achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>BOARD APPOINTMENTS & HONORS</Text>
            {achievements.map((ach) => (
              <View key={ach.id} style={styles.bulletRow}>
                <Text style={styles.goldBullet}>🏆</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontWeight: '700', color: '#0F172A' }}>{ach.title}</Text> ({ach.year})
                  {ach.organization ? ` — ${ach.organization}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 3,
    marginVertical: 8,
  },
  execBanner: {
    backgroundColor: '#0F172A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  execName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  execTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 2,
  },
  goldDivider: {
    height: 1.5,
    backgroundColor: '#D97706',
    width: 44,
    marginVertical: 5,
  },
  execContact: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  avatarWrap: {
    marginLeft: 12,
  },
  bodyContent: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  secTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 3,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  competencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
    marginTop: 2,
  },
  competencyCell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldCheck: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '800',
    marginRight: 5,
  },
  competencyLabel: {
    fontSize: 10.5,
    color: '#1E293B',
    fontWeight: '600',
  },
  expBlock: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  jobRoleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  dateBadgeText: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  companySub: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  goldBullet: {
    fontSize: 8,
    color: '#D97706',
    marginRight: 6,
    lineHeight: 14,
  },
  bulletText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
    flex: 1,
  },
  eduBlock: {
    marginBottom: 6,
  },
  projBlock: {
    marginBottom: 6,
  },
});
