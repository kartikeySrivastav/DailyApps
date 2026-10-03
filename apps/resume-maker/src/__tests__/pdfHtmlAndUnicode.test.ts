import { generateDocumentPrintableHtml } from '../templates/documentHtmlGenerator';
import { sampleGroomBiodata, sampleExperiencedResume } from '../data/sampleData';
import { RESUME_TEMPLATES, BIODATA_TEMPLATES } from '../templates/templateCatalog';

describe('Resume & Biodata Maker - PDF HTML & Unicode Tests', () => {
  describe('Template Catalog', () => {
    it('should include 3 free and 2 premium-ready resume templates', () => {
      const freeResume = RESUME_TEMPLATES.filter((t) => !t.isPremium);
      const premiumResume = RESUME_TEMPLATES.filter((t) => t.isPremium);

      expect(freeResume.length).toBeGreaterThanOrEqual(3);
      expect(premiumResume.length).toBeGreaterThanOrEqual(2);
    });

    it('should include 2 free and 2 premium-ready biodata templates', () => {
      const freeBiodata = BIODATA_TEMPLATES.filter((t) => !t.isPremium);
      const premiumBiodata = BIODATA_TEMPLATES.filter((t) => t.isPremium);

      expect(freeBiodata.length).toBeGreaterThanOrEqual(2);
      expect(premiumBiodata.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('HTML & A4 PDF Generator', () => {
    it('generates valid standalone HTML with A4 print CSS', () => {
      const html = generateDocumentPrintableHtml(sampleExperiencedResume);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('@page');
      expect(html).toContain('size: A4');
      expect(html).toContain('margin:');
      expect(html).toContain(sampleExperiencedResume.personalInfo.fullName);
      expect(html).toContain(sampleExperiencedResume.personalInfo.email);
    });

    it('renders Hindi Unicode and Matrimonial auspicious symbols accurately', () => {
      const hindiBiodata = {
        ...sampleGroomBiodata,
        headerText: '॥ श्री गणेशाय नमः ॥',
        personalInfo: {
          ...sampleGroomBiodata.personalInfo,
          fullName: 'राहुल शर्मा (Rahul Sharma)',
          subCaste: 'गौड़ ब्राह्मण',
        },
        astrology: {
          ...sampleGroomBiodata.astrology,
          gotra: 'कश्यप (Kashyap)',
          rashi: 'मेष (Aries)',
          manglik: 'Non-Manglik / मांगलिक नहीं',
        },
      };

      const html = generateDocumentPrintableHtml(hindiBiodata as any);

      // Verify Hindi characters exist untouched in the HTML output
      expect(html).toContain('॥ श्री गणेशाय नमः ॥');
      expect(html).toContain('राहुल शर्मा (Rahul Sharma)');
      expect(html).toContain('कश्यप (Kashyap)');
      expect(html).toContain('मेष (Aries)');
      expect(html).toContain('Non-Manglik / मांगलिक नहीं');
    });

    it('supports independent Document Language and App UI Language', () => {
      // Document is in Hindi while App UI can be English
      const resumeInHindi = {
        ...sampleExperiencedResume,
        language: 'hi' as const,
        personalInfo: {
          ...sampleExperiencedResume.personalInfo,
          fullName: 'आकाश वर्मा',
          summary: 'अनुभवी सॉफ्टवेयर इंजीनियर',
        },
      };

      const html = generateDocumentPrintableHtml(resumeInHindi);
      expect(html).toContain('lang="hi"');
      expect(html).toContain('आकाश वर्मा');
      expect(html).toContain('अनुभवी सॉफ्टवेयर इंजीनियर');
    });

    it('includes page-break utilities to prevent awkward section clipping in print', () => {
      const html = generateDocumentPrintableHtml(sampleExperiencedResume);
      expect(html).toContain('page-break-inside: avoid');
    });
  });
});
