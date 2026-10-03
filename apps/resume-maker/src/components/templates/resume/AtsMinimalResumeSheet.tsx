import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ResumeProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  resume: ResumeProfile;
  scale?: number;
}

export const AtsMinimalResumeSheet: React.FC<Props> = ({ resume }) => {
  const hidden = new Set(resume.hiddenSections || []);
  const p = resume.personalInfo || {};
  const experiences = resume.experience || [];
  const educations = resume.education || [];
  const skillsList = resume.skillCategories?.flatMap((c) => c.skills) || [];
  const projects = resume.projects || [];
  const achievements = resume.achievements || [];

  const contactItems = [
    p.location,
    p.phone,
    p.email,
    p.linkedin,
  ].filter(Boolean);

  return (
    <View style={styles.sheetContainer}>
      {/* Centered ATS Clean Header */}
      {!hidden.has('personalInfo') && (
        <View style={styles.header}>
          {p.photoUri ? (
            <View style={{ marginBottom: 8, alignItems: 'center' }}>
              <ResumeAvatar
                photoUri={p.photoUri}
                name={p.fullName}
                size={54}
                badgeBorderColor="#475569"
              />
            </View>
          ) : null}
          <Text style={styles.nameText}>{(p.fullName || 'YOUR NAME').toUpperCase()}</Text>
          {p.jobTitle ? <Text style={styles.jobText}>{p.jobTitle}</Text> : null}
          {contactItems.length > 0 && (
            <Text style={styles.contactLine}>{contactItems.join('   •   ')}</Text>
          )}
          <View style={styles.headerRule} />
        </View>
      )}

      {/* Summary */}
      {!hidden.has('summary') && p.summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PROFESSIONAL SUMMARY</Text>
          <View style={styles.sectionHairline} />
          <Text style={styles.bodyText}>{p.summary}</Text>
        </View>
      ) : null}

      {/* Experience */}
      {!hidden.has('workExperience') && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>WORK EXPERIENCE</Text>
          <View style={styles.sectionHairline} />
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.itemBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldTitle}>{exp.jobTitle}</Text>
                <Text style={styles.dateText}>
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </Text>
              </View>
              <Text style={styles.italicCompany}>
                {exp.company}{exp.location ? ` — ${exp.location}` : ''}
              </Text>
              {exp.description ? <Text style={styles.bodyText}>{exp.description}</Text> : null}
              {exp.highlights?.map((h, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>{h}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {!hidden.has('education') && educations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EDUCATION</Text>
          <View style={styles.sectionHairline} />
          {educations.map((edu) => (
            <View key={edu.id} style={styles.itemBlock}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.boldTitle}>{edu.degree}</Text>
                  <Text style={styles.italicCompany}>
                    {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                    {edu.scoreOrGpa ? ` (GPA: ${edu.scoreOrGpa})` : ''}
                  </Text>
                </View>
                <Text style={styles.dateText}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Technical Skills */}
      {!hidden.has('skills') && skillsList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TECHNICAL SKILLS</Text>
          <View style={styles.sectionHairline} />
          <Text style={styles.bodyText}>
            <Text style={{ fontWeight: '700' }}>Competencies: </Text>
            {skillsList.join(', ')}
          </Text>
        </View>
      )}

      {/* Key Projects */}
      {!hidden.has('projects') && projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PROJECTS</Text>
          <View style={styles.sectionHairline} />
          {projects.map((proj) => (
            <View key={proj.id} style={styles.itemBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldTitle}>{proj.title}</Text>
                {proj.techStack ? <Text style={styles.dateText}>{proj.techStack}</Text> : null}
              </View>
              {proj.description ? <Text style={styles.bodyText}>{proj.description}</Text> : null}
              {proj.highlights?.map((h, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>{h}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Achievements */}
      {!hidden.has('achievements') && achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>HONORS & AWARDS</Text>
          <View style={styles.sectionHairline} />
          {achievements.map((ach) => (
            <View key={ach.id} style={styles.bulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: '700' }}>{ach.title}</Text> ({ach.year})
                {ach.organization ? ` — ${ach.organization}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    elevation: 2,
    marginVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
  },
  jobText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  contactLine: {
    fontSize: 10,
    color: '#475569',
    marginTop: 5,
    textAlign: 'center',
  },
  headerRule: {
    height: 1,
    backgroundColor: '#0F172A',
    width: '100%',
    marginTop: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.2,
  },
  sectionHairline: {
    height: 0.75,
    backgroundColor: '#CBD5E1',
    marginTop: 2,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  itemBlock: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  boldTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  italicCompany: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: '#475569',
    marginTop: 1,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  bulletSymbol: {
    fontSize: 12,
    color: '#0F172A',
    marginRight: 6,
    lineHeight: 15,
  },
  bulletText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
    flex: 1,
  },
});
