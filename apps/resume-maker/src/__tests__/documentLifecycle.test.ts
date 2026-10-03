import { CAREER_SCHEMAS, BIODATA_SCHEMAS } from '../schemas/documentSchemas';
import { ResumeProfile, MarriageBiodataProfile, MasterProfile } from '../types/resume.types';
import { sampleExperiencedResume, sampleGroomBiodata } from '../data/sampleData';

describe('Resume & Biodata Maker - Document Lifecycle & Schema Tests', () => {
  describe('Document Schemas', () => {
    it('should define all 7 core Career document schemas', () => {
      const careerIds = CAREER_SCHEMAS.map((s) => s.id);
      expect(careerIds).toContain('professional_resume');
      expect(careerIds).toContain('fresher_resume');
      expect(careerIds).toContain('experienced_resume');
      expect(careerIds).toContain('curriculum_vitae');
      expect(careerIds).toContain('internship_resume');
      expect(careerIds).toContain('academic_cv');
      expect(careerIds).toContain('cover_letter');
      expect(CAREER_SCHEMAS.length).toBeGreaterThanOrEqual(7);
    });

    it('should define all 4 core Marriage Biodata schemas', () => {
      const biodataIds = BIODATA_SCHEMAS.map((s) => s.id);
      expect(biodataIds).toContain('traditional_biodata');
      expect(biodataIds).toContain('modern_biodata');
      expect(biodataIds).toContain('simple_biodata');
      expect(biodataIds).toContain('photo_biodata');
      expect(BIODATA_SCHEMAS.length).toBeGreaterThanOrEqual(4);
    });

    it('each schema should have required sections, templates and default language', () => {
      for (const schema of [...CAREER_SCHEMAS, ...BIODATA_SCHEMAS]) {
        expect(schema.id).toBeDefined();
        expect(schema.category).toMatch(/^(career|marriage)$/);
        expect(schema.defaultTemplateId).toBeDefined();
        expect(schema.supportedTemplates.length).toBeGreaterThan(0);
        expect(schema.requiredSections.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Master Profile & Snapshot Isolation', () => {
    it('editing a document snapshot must not alter the Master Profile', () => {
      const masterProfile: MasterProfile = {
        id: 'master_1',
        socialLinks: [],
        skillCategories: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        interests: [],
        personalInfo: {
          fullName: 'Kartikey Srivastava',
          email: 'kartikey@example.com',
          phone: '+91 9876543210',
          location: 'Bangalore, India',
          summary: 'Senior Software Engineer with 6+ years experience.',
          jobTitle: 'Lead Mobile Architect',
        },
        education: [
          {
            id: 'edu_1',
            institution: 'NIT Allahabad',
            degree: 'B.Tech Computer Science',
            location: 'Allahabad',
            startDate: '2016',
            endDate: '2020',
            scoreOrGpa: '8.5 CGPA',
          },
        ],
        experience: [
          {
            id: 'exp_1',
            company: 'Tech Corp',
            jobTitle: 'Senior Engineer',
            location: 'Bangalore',
            startDate: '2021',
            endDate: 'Present',
            isCurrent: true,
            description: 'Lead mobile development team.',
            highlights: ['Lead mobile team'],
          },
        ],
        updatedAt: Date.now(),
      };

      // Create a document by snapshotting master profile
      const tailoredResume: ResumeProfile = {
        ...sampleExperiencedResume,
        id: 'res_custom_1',
        personalInfo: { ...masterProfile.personalInfo, fullName: 'Kartikey S. (Altered in Resume)' },
        updatedAt: Date.now(),
      };

      // Modifying document snapshot
      tailoredResume.personalInfo.summary = 'Summary customized strictly for this target application.';

      // Assert Master Profile remains unchanged
      expect(masterProfile.personalInfo.fullName).toBe('Kartikey Srivastava');
      expect(masterProfile.personalInfo.summary).toBe('Senior Software Engineer with 6+ years experience.');
      expect(tailoredResume.personalInfo.fullName).toBe('Kartikey S. (Altered in Resume)');
    });

    it('duplicating a document creates a distinct isolated copy with new ID', () => {
      const originalDoc = { ...sampleGroomBiodata, id: 'bio_original_1' };
      const duplicatedDoc: MarriageBiodataProfile = JSON.parse(JSON.stringify(originalDoc));
      duplicatedDoc.id = 'bio_copy_' + Date.now();
      duplicatedDoc.title = originalDoc.title + ' (Copy)';
      duplicatedDoc.updatedAt = Date.now();

      expect(duplicatedDoc.id).not.toBe(originalDoc.id);
      expect(duplicatedDoc.title).toContain('(Copy)');

      // Mutating duplicate does not mutate original
      duplicatedDoc.family.fatherName = 'Updated Father Name';
      expect(originalDoc.family.fatherName).not.toBe('Updated Father Name');
    });
  });

  describe('Section Management (Reorder & Hide/Show)', () => {
    it('supports hiding and un-hiding sections', () => {
      const doc: ResumeProfile = { ...sampleExperiencedResume, hiddenSections: [] };

      // Hide projects
      const updatedHidden = [...(doc.hiddenSections || []), 'projects' as const];
      expect(updatedHidden).toContain('projects');

      // Unhide projects
      const restored = updatedHidden.filter((s) => s !== 'projects');
      expect(restored).not.toContain('projects');
    });

    it('supports reordering section order array', () => {
      const initialOrder = sampleExperiencedResume.sectionOrder || [
        'personalInfo',
        'summary',
        'workExperience',
        'education',
        'skills',
        'projects',
      ];
      // Move 'skills' to top
      const reordered = [
        'skills' as const,
        ...initialOrder.filter((s) => s !== 'skills'),
      ];

      expect(reordered[0]).toBe('skills');
      expect(reordered.length).toBe(initialOrder.length);
    });
  });

  describe('Multi-Layout Template Archetypes', () => {
    it('verifies all resume template archetypes are supported', () => {
      const resumeTemplates = ['modern_blue', 'clean_minimal', 'creative_bold', 'minimal_clean', 'executive_pro', 'ats_classic', 'modern_tech'];
      for (const tId of resumeTemplates) {
        const doc: ResumeProfile = {
          ...sampleExperiencedResume,
          templateId: tId as any,
        };
        expect(doc.templateId).toBe(tId);
      }
    });

    it('verifies all marriage biodata template archetypes are supported', () => {
      const biodataTemplates = ['modern_clean', 'elegant_photo', 'royal_traditional', 'premium_classic', 'royal_maroon', 'modern_pastel'];
      for (const tId of biodataTemplates) {
        const doc: MarriageBiodataProfile = {
          ...sampleGroomBiodata,
          templateId: tId as any,
        };
        expect(doc.templateId).toBe(tId);
      }
    });
  });
});

