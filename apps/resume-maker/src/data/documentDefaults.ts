import { ResumeProfile, ResumeTemplateId } from '../types/resume.types';

/** Creates a private, blank document. Example fixtures must never enter user flows. */
export const createEmptyResume = (
  templateId: ResumeTemplateId = 'modern_blue',
  accentColor = '#2563EB',
): ResumeProfile => ({
  id: `res_${Date.now()}`,
  type: 'resume',
  title: 'My Resume',
  templateId,
  accentColor,
  updatedAt: Date.now(),
  sectionOrder: [
    'personalInfo', 'summary', 'workExperience', 'education', 'skills',
    'projects', 'certifications', 'achievements', 'languages', 'interests', 'customSections',
  ],
  hiddenSections: [],
  personalInfo: {
    fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '',
  },
  socialLinks: [],
  experience: [],
  education: [],
  skillCategories: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: [],
  customSections: [],
});
