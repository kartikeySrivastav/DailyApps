import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ResumeProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  resume: ResumeProfile;
  scale?: number;
}

export const ModernSplitResumeSheet: React.FC<Props> = ({ resume }) => {
  const accent = resume.accentColor || '#2563EB';
  const hidden = new Set(resume.hiddenSections || []);

  const p = resume.personalInfo || {};
  const experiences = resume.experience || [];
  const educations = resume.education || [];
  const skillsList = resume.skillCategories?.flatMap((c) => c.skills) || [];
  const projects = resume.projects || [];
  const achievements = resume.achievements || [];
  const languages = resume.languages || [];

  return (
    <View style={[styles.sheetContainer, { borderColor: '#E2E8F0' }]}>
      {/* Top Accent Strip */}
      <View style={[styles.topAccentBar, { backgroundColor: accent }]} />

      <View style={styles.twoColumnContainer}>
        {/* ======================================================== */}
        {/* LEFT SIDEBAR (38% width): Photo, Contact, Skills, Edu    */}
        {/* ======================================================== */}
        <View style={styles.leftSidebar}>
          {/* Photo Frame */}
          {!hidden.has('personalInfo') && (
            <View style={styles.avatarWrap}>
              <ResumeAvatar
                photoUri={p.photoUri}
                name={p.fullName || 'User'}
                size={74}
                badgeBorderColor={accent}
              />
            </View>
          )}

          {/* Contact Details */}
          {!hidden.has('personalInfo') && (
            <View style={styles.sidebarSection}>
              <Text style={[styles.sidebarSecTitle, { color: accent }]}>CONTACT</Text>
              {p.phone ? (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>📞</Text>
                  <Text style={styles.contactText}>{p.phone}</Text>
                </View>
              ) : null}
              {p.email ? (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>✉️</Text>
                  <Text style={styles.contactText}>{p.email}</Text>
                </View>
              ) : null}
              {p.location ? (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>📍</Text>
                  <Text style={styles.contactText}>{p.location}</Text>
                </View>
              ) : null}
              {p.linkedin ? (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>🔗</Text>
                  <Text style={styles.contactText}>{p.linkedin}</Text>
                </View>
              ) : null}
              {resume.socialLinks?.map((s, idx) => (
                <View key={idx} style={styles.contactRow}>
                  <Text style={styles.contactIcon}>🌐</Text>
                  <Text style={styles.contactText}>{s.platform}: {s.url}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills in Sidebar */}
          {!hidden.has('skills') && skillsList.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={[styles.sidebarSecTitle, { color: accent }]}>KEY SKILLS</Text>
              <View style={styles.skillWrap}>
                {skillsList.map((skill, index) => (
                  <View key={index} style={[styles.skillBadge, { borderColor: accent + '40', backgroundColor: accent + '10' }]}>
                    <Text style={[styles.skillBadgeText, { color: '#0F172A' }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education in Sidebar */}
          {!hidden.has('education') && educations.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={[styles.sidebarSecTitle, { color: accent }]}>EDUCATION</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={styles.sidebarEduBlock}>
                  <Text style={styles.sidebarEduDegree}>{edu.degree}</Text>
                  <Text style={styles.sidebarEduInst}>{edu.institution}</Text>
                  <Text style={styles.sidebarEduDate}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
                  {edu.scoreOrGpa ? <Text style={styles.sidebarEduGrade}>GPA: {edu.scoreOrGpa}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {!hidden.has('languages') && languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={[styles.sidebarSecTitle, { color: accent }]}>LANGUAGES</Text>
              <Text style={styles.sidebarSubText}>{languages.join(' • ')}</Text>
            </View>
          )}
        </View>

        {/* ======================================================== */}
        {/* RIGHT MAIN COLUMN (62% width): Name, Summary, Exp, Proj */}
        {/* ======================================================== */}
        <View style={styles.rightMain}>
          {/* Header Title */}
          {!hidden.has('personalInfo') && (
            <View style={styles.mainHeader}>
              <Text style={styles.candidateName}>{p.fullName || 'Your Name'}</Text>
              <Text style={[styles.candidateJobTitle, { color: accent }]}>
                {p.jobTitle || 'Professional Title'}
              </Text>
            </View>
          )}

          {/* Professional Summary */}
          {!hidden.has('summary') && p.summary ? (
            <View style={styles.mainSection}>
              <Text style={[styles.mainSecTitle, { color: accent }]}>PROFESSIONAL SUMMARY</Text>
              <View style={[styles.accentDivider, { backgroundColor: accent }]} />
              <Text style={styles.summaryText}>{p.summary}</Text>
            </View>
          ) : null}

          {/* Work Experience */}
          {!hidden.has('workExperience') && experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={[styles.mainSecTitle, { color: accent }]}>WORK EXPERIENCE</Text>
              <View style={[styles.accentDivider, { backgroundColor: accent }]} />

              {experiences.map((exp) => (
                <View key={exp.id} style={styles.expBlock}>
                  <Text style={styles.expRole}>{exp.jobTitle}</Text>
                  <Text style={styles.expCompanyDate}>
                    {exp.company} • {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                  {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
                  {exp.highlights?.map((h, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={[styles.bulletDot, { color: accent }]}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {!hidden.has('projects') && projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={[styles.mainSecTitle, { color: accent }]}>KEY PROJECTS</Text>
              <View style={[styles.accentDivider, { backgroundColor: accent }]} />

              {projects.map((proj) => (
                <View key={proj.id} style={styles.projBlock}>
                  <Text style={styles.projTitle}>
                    {proj.title}
                    {proj.techStack ? <Text style={[styles.techStackText, { color: accent }]}> ({proj.techStack})</Text> : null}
                  </Text>
                  {proj.description ? <Text style={styles.projDesc}>{proj.description}</Text> : null}
                  {proj.highlights?.map((h, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={[styles.bulletDot, { color: accent }]}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Achievements */}
          {!hidden.has('achievements') && achievements.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={[styles.mainSecTitle, { color: accent }]}>HONORS & ACHIEVEMENTS</Text>
              <View style={[styles.accentDivider, { backgroundColor: accent }]} />
              {achievements.map((ach) => (
                <Text key={ach.id} style={styles.achieveText}>
                  🏆 <Text style={{ fontWeight: '700' }}>{ach.title}</Text> ({ach.year}) {ach.organization ? `— ${ach.organization}` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 8,
  },
  topAccentBar: {
    height: 7,
    width: '100%',
  },
  twoColumnContainer: {
    flexDirection: 'row',
  },
  leftSidebar: {
    width: '38%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    padding: 12,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarSecTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactIcon: {
    fontSize: 11,
    marginRight: 6,
  },
  contactText: {
    fontSize: 10.5,
    color: '#334155',
    flex: 1,
    fontWeight: '500',
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  skillBadgeText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  sidebarEduBlock: {
    marginBottom: 8,
  },
  sidebarEduDegree: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  sidebarEduInst: {
    fontSize: 10,
    color: '#475569',
  },
  sidebarEduDate: {
    fontSize: 9.5,
    color: '#64748B',
  },
  sidebarEduGrade: {
    fontSize: 9.5,
    color: '#0284C7',
    fontWeight: '600',
  },
  sidebarSubText: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 14,
  },
  rightMain: {
    width: '62%',
    padding: 14,
  },
  mainHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  candidateJobTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  mainSection: {
    marginBottom: 12,
  },
  mainSecTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  accentDivider: {
    height: 1.5,
    width: 32,
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  expBlock: {
    marginBottom: 10,
  },
  expRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  expCompanyDate: {
    fontSize: 10.5,
    color: '#475569',
    marginBottom: 3,
    fontWeight: '500',
  },
  expDesc: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 12,
    marginRight: 5,
    lineHeight: 15,
  },
  bulletText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
    flex: 1,
  },
  projBlock: {
    marginBottom: 8,
  },
  projTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  techStackText: {
    fontSize: 10,
    fontWeight: '600',
  },
  projDesc: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 1,
  },
  achieveText: {
    fontSize: 10.5,
    color: '#334155',
    marginTop: 3,
  },
});
