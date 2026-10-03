import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ResumeProfile } from '../../../types/resume.types';
import { ResumeAvatar } from '../../ResumeAvatar';

interface Props {
  resume: ResumeProfile;
  scale?: number;
}

export const CreativeBoldResumeSheet: React.FC<Props> = ({ resume }) => {
  const hidden = new Set(resume.hiddenSections || []);
  const accent = resume.accentColor || '#7C3AED';
  const p = resume.personalInfo || {};
  const experiences = resume.experience || [];
  const educations = resume.education || [];
  const skillsList = resume.skillCategories?.flatMap((c) => c.skills) || [];
  const projects = resume.projects || [];
  const achievements = resume.achievements || [];

  return (
    <View style={styles.sheetContainer}>
      {/* ======================================================== */}
      {/* CREATIVE HERO BANNER WITH OVERLAPPING AVATAR            */}
      {/* ======================================================== */}
      {!hidden.has('personalInfo') && (
        <View style={[styles.heroBanner, { backgroundColor: accent }]}>
          <ResumeAvatar
            photoUri={p.photoUri}
            name={p.fullName || 'Creative'}
            size={74}
            badgeBorderColor="#DDD6FE"
          />
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName}>{p.fullName || 'Creative Designer'}</Text>
            <Text style={styles.bannerJob}>{p.jobTitle || 'UI/UX & Visual Designer'}</Text>
            <View style={styles.bannerPillRow}>
              {p.location ? <Text style={styles.bannerPill}>📍 {p.location}</Text> : null}
              {p.email ? <Text style={styles.bannerPill}>✉ {p.email}</Text> : null}
              {p.phone ? <Text style={styles.bannerPill}>📞 {p.phone}</Text> : null}
            </View>
          </View>
        </View>
      )}

      <View style={styles.bodyContent}>
        {/* About Me Card */}
        {!hidden.has('summary') && p.summary ? (
          <View style={[styles.creativeCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
            <Text style={[styles.cardHeading, { color: accent }]}>✨ About Me</Text>
            <Text style={styles.summaryText}>{p.summary}</Text>
          </View>
        ) : null}

        {/* Experience Timeline */}
        {!hidden.has('workExperience') && experiences.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.secHeading, { color: accent }]}>💼 Experience Timeline</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.expJob}>{exp.jobTitle}</Text>
                  <Text style={[styles.expDates, { color: accent }]}>
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.expCompany}>{exp.company} • {exp.location || 'Remote'}</Text>
                {exp.description ? <Text style={styles.summaryText}>{exp.description}</Text> : null}
                {exp.highlights?.map((h, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={[styles.bulletArrow, { color: accent }]}>▹</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Key Capabilities Pill Badges */}
        {!hidden.has('skills') && skillsList.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.secHeading, { color: accent }]}>⚡ Key Capabilities</Text>
            <View style={styles.pillContainer}>
              {skillsList.map((skill, index) => (
                <View key={index} style={[styles.skillChip, { backgroundColor: accent + '15', borderColor: accent + '30' }]}>
                  <Text style={[styles.skillChipText, { color: accent }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects Showcase */}
        {!hidden.has('projects') && projects.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.secHeading, { color: accent }]}>🚀 Featured Projects</Text>
            <View style={styles.projectsGrid}>
              {projects.map((proj) => (
                <View key={proj.id} style={[styles.projectCard, { borderColor: '#E2E8F0' }]}>
                  <Text style={styles.projTitle}>{proj.title}</Text>
                  {proj.techStack ? <Text style={[styles.projTech, { color: accent }]}>{proj.techStack}</Text> : null}
                  {proj.description ? <Text style={styles.summaryText}>{proj.description}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education & Honors */}
        {!hidden.has('education') && educations.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.secHeading, { color: accent }]}>🎓 Education & Honors</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={styles.eduRow}>
                <Text style={styles.eduDegree}>{edu.degree} — <Text style={styles.eduInst}>{edu.institution}</Text></Text>
                <Text style={styles.eduDates}>{edu.startDate} – {edu.endDate || 'Present'}</Text>
              </View>
            ))}
            {achievements.map((ach) => (
              <Text key={ach.id} style={styles.achieveLine}>
                🏆 {ach.title} ({ach.year})
              </Text>
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 3,
    marginVertical: 8,
  },
  heroBanner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  bannerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerJob: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E9D5FF',
    marginTop: 2,
  },
  bannerPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  bannerPill: {
    fontSize: 9.5,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 99,
  },
  bodyContent: {
    padding: 14,
  },
  creativeCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
  sectionWrap: {
    marginBottom: 12,
  },
  secHeading: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  expCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  expJob: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  expDates: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  expCompany: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  bulletArrow: {
    fontSize: 10,
    marginRight: 5,
    lineHeight: 14,
  },
  bulletText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 14,
    flex: 1,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 0.5,
  },
  skillChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  projectsGrid: {
    gap: 6,
  },
  projectCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  projTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  projTech: {
    fontSize: 9.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  eduRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eduDegree: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  eduInst: {
    fontWeight: '500',
    color: '#475569',
  },
  eduDates: {
    fontSize: 9.5,
    color: '#64748B',
  },
  achieveLine: {
    fontSize: 10,
    color: '#334155',
    marginTop: 2,
  },
});
