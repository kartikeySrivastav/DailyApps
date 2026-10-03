import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ResumeProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  resume: ResumeProfile;
  scale?: number;
}

export const MinimalCleanResumeSheet: React.FC<Props> = ({ resume }) => {
  const hidden = new Set(resume.hiddenSections || []);
  const accent = resume.accentColor || '#334155';
  const p = resume.personalInfo || {};
  const experiences = resume.experience || [];
  const educations = resume.education || [];
  const skillsList = resume.skillCategories?.flatMap((c) => c.skills) || [];
  const projects = resume.projects || [];
  const achievements = resume.achievements || [];

  return (
    <View style={styles.sheetContainer}>
      {/* Clean Minimal Header */}
      {!hidden.has('personalInfo') && (
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.candidateName}>{p.fullName || 'Candidate Name'}</Text>
              <Text style={[styles.jobTitle, { color: accent }]}>{p.jobTitle || 'Graduate / Professional'}</Text>
            </View>
            {p.photoUri ? (
              <ResumeAvatar
                photoUri={p.photoUri}
                name={p.fullName}
                size={58}
                badgeBorderColor={accent}
              />
            ) : null}
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{p.email}</Text>
            {p.phone ? <Text style={styles.dot}>•</Text> : null}
            <Text style={styles.contactItem}>{p.phone}</Text>
            {p.location ? <Text style={styles.dot}>•</Text> : null}
            <Text style={styles.contactItem}>{p.location}</Text>
          </View>
          <View style={[styles.subtleLine, { backgroundColor: accent + '30' }]} />
        </View>
      )}

      {/* Summary */}
      {!hidden.has('summary') && p.summary ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>OBJECTIVE & SUMMARY</Text>
          <Text style={styles.bodyText}>{p.summary}</Text>
        </View>
      ) : null}

      {/* Education First (Academic / Fresher priority) */}
      {!hidden.has('education') && educations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>EDUCATION & ACADEMIC CREDENTIALS</Text>
          {educations.map((edu) => (
            <View key={edu.id} style={styles.eduBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldRole}>{edu.degree}</Text>
                <Text style={styles.dateText}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
              </View>
              <Text style={styles.subText}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
              {edu.scoreOrGpa ? <Text style={styles.gradeText}>Score / Honors: {edu.scoreOrGpa}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {!hidden.has('skills') && skillsList.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>TECHNICAL SKILLS & TOOLS</Text>
          <View style={styles.skillWrap}>
            {skillsList.map((skill, index) => (
              <View key={index} style={[styles.skillPill, { borderColor: accent + '30' }]}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Academic Projects */}
      {!hidden.has('projects') && projects.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>PROJECTS & CODE REPOSITORIES</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.projBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldRole}>{proj.title}</Text>
                {proj.techStack ? <Text style={[styles.dateText, { color: accent }]}>{proj.techStack}</Text> : null}
              </View>
              {proj.description ? <Text style={styles.bodyText}>{proj.description}</Text> : null}
              {proj.highlights?.map((h, i) => (
                <Text key={i} style={styles.bulletText}>• {h}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Experience / Internships */}
      {!hidden.has('workExperience') && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>EXPERIENCE & INTERNSHIPS</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.expBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldRole}>{exp.jobTitle}</Text>
                <Text style={styles.dateText}>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</Text>
              </View>
              <Text style={styles.subText}>{exp.company}</Text>
              {exp.highlights?.map((h, i) => (
                <Text key={i} style={styles.bulletText}>• {h}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Honors & Awards */}
      {!hidden.has('achievements') && achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>HONORS & CERTIFICATIONS</Text>
          {achievements.map((ach) => (
            <Text key={ach.id} style={styles.bodyText}>
              🏅 <Text style={{ fontWeight: '700' }}>{ach.title}</Text> ({ach.year})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    elevation: 2,
    marginVertical: 8,
  },
  header: {
    marginBottom: 14,
  },
  candidateName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 6,
  },
  contactItem: {
    fontSize: 10.5,
    color: '#64748B',
  },
  dot: {
    marginHorizontal: 5,
    color: '#CBD5E1',
    fontSize: 12,
  },
  subtleLine: {
    height: 1,
    marginTop: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
  eduBlock: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  boldRole: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 10,
    color: '#64748B',
  },
  subText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  gradeText: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    backgroundColor: '#F8FAFC',
  },
  skillText: {
    fontSize: 9.5,
    color: '#334155',
    fontWeight: '600',
  },
  projBlock: {
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 10,
    color: '#334155',
    marginLeft: 6,
    marginTop: 1,
  },
  expBlock: {
    marginBottom: 8,
  },
});
