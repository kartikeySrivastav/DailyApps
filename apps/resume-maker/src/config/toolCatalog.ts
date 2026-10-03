import { AppFeature } from '@dailyapps/config';

export const resume_makerToolCatalog: AppFeature[] = [
  {
    id: 'marriage_biodata',
    title: 'विवाह बायोडाटा (Marriage Biodata)',
    description: 'Traditional Hindu, Kundali match & modern matrimonial profiles',
    icon: '💍',
    route: 'MarriageBiodataBuilder',
    category: 'Matrimonial',
    isFeatured: true,
    keywords: [
      'biodata',
      'marriage',
      'shaadi',
      'kundali',
      'matrimonial',
      'horoscope',
      'gotra',
      'rishta'
    ],
  },
  {
    id: 'resume_builder',
    title: 'ATS Resume & CV Builder',
    description: 'Create ATS-compliant tech, fresher, and executive PDF resumes',
    icon: '💼',
    route: 'ResumeBuilder',
    category: 'Career',
    isFeatured: true,
    keywords: [
      'resume',
      'cv',
      'pdf',
      'job',
      'ats',
      'fresher',
      'engineer'
    ],
  },
  {
    id: 'cover_letter',
    title: 'Cover Letter Maker',
    description: 'Generate matching tailored cover letters for job applications',
    icon: '✉️',
    route: 'CoverLetterBuilder',
    category: 'Career',
    keywords: [
      'cover letter',
      'job',
      'application',
      'hiring'
    ],
  },
  {
    id: 'templates',
    title: 'Template Studio',
    description: 'Explore Royal Maroon, Modern Pastel, ATS Single-Column, and Tech layouts',
    icon: '🎨',
    route: 'TemplateGallery',
    category: 'Templates',
    isFeatured: true,
    keywords: [
      'design',
      'layout',
      'template',
      'royal',
      'ats'
    ],
  },
];
