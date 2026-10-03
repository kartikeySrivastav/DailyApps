import { DocumentLanguage } from '@dailyapps/utils';

export type DocumentCategoryId = 'career' | 'marriage';

export interface DocumentSchemaDefinition {
  id: string;
  category: DocumentCategoryId;
  titleKey: string;
  subtitleKey: string;
  icon: string;
  defaultTemplateId: string;
  supportedTemplates: string[];
  defaultSections: string[];
  requiredSections: string[];
  photoSupported: boolean;
  defaultLanguage: DocumentLanguage;
}

export const CAREER_SCHEMAS: DocumentSchemaDefinition[] = [
  {
    id: 'professional_resume',
    category: 'career',
    titleKey: 'professionalResume',
    subtitleKey: 'professionalResume',
    icon: '💼',
    defaultTemplateId: 'ats_classic',
    supportedTemplates: ['ats_classic', 'modern_tech', 'executive_slate'],
    defaultSections: [
      'personalInfo',
      'summary',
      'workExperience',
      'education',
      'skills',
      'projects',
      'certifications',
    ],
    requiredSections: ['personalInfo', 'education', 'skills'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'fresher_resume',
    category: 'career',
    titleKey: 'fresherResume',
    subtitleKey: 'fresherResume',
    icon: '🎓',
    defaultTemplateId: 'fresher_academic',
    supportedTemplates: ['fresher_academic', 'ats_classic'],
    defaultSections: [
      'personalInfo',
      'education',
      'skills',
      'projects',
      'certifications',
      'achievements',
      'languages',
    ],
    requiredSections: ['personalInfo', 'education', 'skills'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'experienced_resume',
    category: 'career',
    titleKey: 'experiencedResume',
    subtitleKey: 'experiencedResume',
    icon: '👨‍💻',
    defaultTemplateId: 'modern_tech',
    supportedTemplates: ['modern_tech', 'executive_slate', 'ats_classic'],
    defaultSections: [
      'personalInfo',
      'summary',
      'workExperience',
      'skills',
      'projects',
      'education',
      'certifications',
      'socialLinks',
    ],
    requiredSections: ['personalInfo', 'workExperience', 'skills'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'curriculum_vitae',
    category: 'career',
    titleKey: 'curriculumVitae',
    subtitleKey: 'curriculumVitae',
    icon: '📜',
    defaultTemplateId: 'ats_classic',
    supportedTemplates: ['ats_classic', 'executive_slate'],
    defaultSections: [
      'personalInfo',
      'summary',
      'education',
      'workExperience',
      'projects',
      'certifications',
      'achievements',
      'languages',
      'customSections',
    ],
    requiredSections: ['personalInfo', 'education'],
    photoSupported: true,
    defaultLanguage: 'en',
  },
  {
    id: 'internship_resume',
    category: 'career',
    titleKey: 'internshipResume',
    subtitleKey: 'internshipResume',
    icon: '🚀',
    defaultTemplateId: 'fresher_academic',
    supportedTemplates: ['fresher_academic', 'ats_classic'],
    defaultSections: ['personalInfo', 'education', 'skills', 'projects', 'interests'],
    requiredSections: ['personalInfo', 'education'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'academic_cv',
    category: 'career',
    titleKey: 'academicCv',
    subtitleKey: 'academicCv',
    icon: '🏛️',
    defaultTemplateId: 'fresher_academic',
    supportedTemplates: ['fresher_academic', 'ats_classic'],
    defaultSections: ['personalInfo', 'education', 'projects', 'certifications', 'achievements', 'customSections'],
    requiredSections: ['personalInfo', 'education'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'cover_letter',
    category: 'career',
    titleKey: 'coverLetter',
    subtitleKey: 'coverLetter',
    icon: '✉️',
    defaultTemplateId: 'classic_letter',
    supportedTemplates: ['classic_letter'],
    defaultSections: ['sender', 'recipient', 'content'],
    requiredSections: ['sender', 'recipient'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
];

export const MARRIAGE_SCHEMAS: DocumentSchemaDefinition[] = [
  {
    id: 'traditional_biodata',
    category: 'marriage',
    titleKey: 'traditionalBiodata',
    subtitleKey: 'traditionalBiodata',
    icon: '🕉️',
    defaultTemplateId: 'royal_maroon',
    supportedTemplates: ['royal_maroon', 'vedic_classic'],
    defaultSections: ['header', 'personalInfo', 'astrology', 'educationAndCareer', 'family', 'contact'],
    requiredSections: ['personalInfo', 'contact'],
    photoSupported: true,
    defaultLanguage: 'hi',
  },
  {
    id: 'modern_biodata',
    category: 'marriage',
    titleKey: 'modernBiodata',
    subtitleKey: 'modernBiodata',
    icon: '💍',
    defaultTemplateId: 'modern_pastel',
    supportedTemplates: ['modern_pastel', 'minimal_gold'],
    defaultSections: ['header', 'personalInfo', 'educationAndCareer', 'family', 'expectations', 'contact'],
    requiredSections: ['personalInfo', 'contact'],
    photoSupported: true,
    defaultLanguage: 'en',
  },
  {
    id: 'simple_biodata',
    category: 'marriage',
    titleKey: 'simpleBiodata',
    subtitleKey: 'simpleBiodata',
    icon: '📄',
    defaultTemplateId: 'minimal_gold',
    supportedTemplates: ['minimal_gold', 'modern_pastel'],
    defaultSections: ['personalInfo', 'educationAndCareer', 'family', 'contact'],
    requiredSections: ['personalInfo', 'contact'],
    photoSupported: false,
    defaultLanguage: 'en',
  },
  {
    id: 'photo_biodata',
    category: 'marriage',
    titleKey: 'photoBiodata',
    subtitleKey: 'photoBiodata',
    icon: '📷',
    defaultTemplateId: 'modern_pastel',
    supportedTemplates: ['modern_pastel', 'royal_maroon'],
    defaultSections: ['photo', 'personalInfo', 'astrology', 'educationAndCareer', 'family', 'contact'],
    requiredSections: ['personalInfo', 'contact'],
    photoSupported: true,
    defaultLanguage: 'hi',
  },
];

export const BIODATA_SCHEMAS = MARRIAGE_SCHEMAS;
