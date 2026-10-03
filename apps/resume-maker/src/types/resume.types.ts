export type DocumentType = 'resume' | 'marriage_biodata' | 'cover_letter';

export type ResumeTemplateId =
  | 'ats_classic'
  | 'modern_tech'
  | 'fresher_academic'
  | 'executive_slate'
  | 'creative_infographic'
  | 'modern_blue'
  | 'clean_minimal'
  | 'minimal_clean'
  | 'creative_bold'
  | 'executive_pro'
  | 'creative_pro';

export type BiodataTemplateId =
  | 'royal_maroon'
  | 'modern_pastel'
  | 'vedic_classic'
  | 'minimal_gold'
  | 'modern_clean'
  | 'elegant_photo'
  | 'royal_traditional'
  | 'premium_classic';


export type ResumeSectionId =
  | 'personalInfo'
  | 'summary'
  | 'workExperience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'interests'
  | 'socialLinks'
  | 'customSections';

// ---------------------------------------------------------------------------
// Resume Data Model Components
// ---------------------------------------------------------------------------

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  employmentType?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  scoreOrGpa: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  link?: string;
  description: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  year: string;
  description?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'LinkedIn' | 'GitHub' | 'Portfolio' | 'Twitter' | 'Other';
  url: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
}

// ---------------------------------------------------------------------------
// Master Profile (Source of Truth for User)
// ---------------------------------------------------------------------------

export interface MasterProfile {
  id: string;
  updatedAt: number;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  socialLinks: SocialLinkItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: string[];
  interests: string[];
}

// ---------------------------------------------------------------------------
// Resume Document (Specific version derived or customized)
// ---------------------------------------------------------------------------

export interface ResumeProfile {
  id: string;
  type: 'resume';
  title: string;
  targetRole?: string;
  templateId: ResumeTemplateId;
  isPremium?: boolean;
  accentColor: string;
  fontSize?: 'compact' | 'standard' | 'relaxed';
  language?: string;
  updatedAt: number;
  sectionOrder?: ResumeSectionId[];
  hiddenSections?: ResumeSectionId[];
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    photoUri?: string;
    linkedin?: string;
    githubOrPortfolio?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    summary: string;
  };
  socialLinks?: SocialLinkItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements?: AchievementItem[];
  languages: string[];
  interests?: string[];
  customSections?: CustomSectionItem[];
}

// ---------------------------------------------------------------------------
// Marriage Biodata Data Model (विवाह बायोडाटा)
// ---------------------------------------------------------------------------

export interface AstrologicalDetails {
  gotra: string;
  rashi: string;
  nakshatra: string;
  gan: string;
  nadi: string;
  charan: string;
  manglik: 'Yes' | 'No' | 'Anshik';
}

export interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothersCount: string;
  sistersCount: string;
  marriedBrothers: string;
  marriedSisters: string;
  familyType: 'Nuclear' | 'Joint';
  familyValues: string;
  nativePlace: string;
  currentCity: string;
}

export interface MarriageBiodataProfile {
  id: string;
  type: 'marriage_biodata';
  title: string;
  templateId: BiodataTemplateId;
  accentColor: string;
  language?: string;
  updatedAt: number;
  headerSymbol: 'ganesh' | 'om' | 'shree' | 'swastik' | 'none';
  headerText: string;
  personalInfo: {
    fullName: string;
    gender: 'Male' | 'Female';
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    height: string;
    photoUri?: string;
    weight?: string;
    complexion: string;
    bloodGroup?: string;
    maritalStatus: 'Never Married' | 'Divorced' | 'Awaiting Divorce' | 'Widowed';
    religion: string;
    caste: string;
    subCaste?: string;
    motherTongue: string;
  };
  astrology: AstrologicalDetails;
  educationAndCareer: {
    highestEducation: string;
    collegeOrUniversity: string;
    additionalCourses?: string;
    occupation: string;
    companyName: string;
    jobLocation: string;
    annualIncome: string;
  };
  family: FamilyDetails;
  contactDetails: {
    contactPerson: string;
    relation: string;
    phone1: string;
    phone2?: string;
    email?: string;
    residenceAddress: string;
  };
  partnerExpectations?: string;
}

// ---------------------------------------------------------------------------
// Cover Letter Data Model
// ---------------------------------------------------------------------------

export interface CoverLetterProfile {
  id: string;
  type: 'cover_letter';
  title: string;
  templateId: string;
  accentColor: string;
  language?: string;
  updatedAt: number;
  sender: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  recipient: {
    hiringManager: string;
    company: string;
    department?: string;
    location: string;
  };
  date: string;
  targetRole: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraph: string;
  closingParagraph: string;
  signOff: string;
}

export type AnyDocumentProfile = ResumeProfile | MarriageBiodataProfile | CoverLetterProfile;
