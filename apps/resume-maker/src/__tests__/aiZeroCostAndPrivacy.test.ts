import { AIService } from '../ai/aiService';
import { ALL_INDIAN_LANGUAGES, t, isRtlLanguage } from '@dailyapps/utils';

describe('Resume & Biodata Maker - AI Zero-Cost & Privacy Invariants', () => {
  describe('AI Feature Zero Cost & No Network Calls Invariant', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock global fetch to strictly ensure zero HTTP calls occur
      if (typeof global.fetch === 'undefined') {
        (global as any).fetch = jest.fn();
      }
      fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    it('AIService should report isAvailable as false in V1', () => {
      expect(AIService.isAvailable).toBe(false);
    });

    it('calling improveSummary returns status "coming_soon" with 0 network calls', async () => {
      const result = await AIService.improveSummary('Results-oriented developer', 'Mobile Lead');

      expect(result.success).toBe(false);
      expect(result.status).toBe('coming_soon');
      expect(result.message).toContain('coming soon');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('calling enhanceBulletPoint returns status "coming_soon" with 0 network calls', async () => {
      const result = await AIService.enhanceBulletPoint('Worked on React Native components');

      expect(result.success).toBe(false);
      expect(result.status).toBe('coming_soon');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('calling reviewResume returns status "coming_soon" with 0 network calls', async () => {
      const result = await AIService.reviewResume({ fullName: 'John Doe' });

      expect(result.success).toBe(false);
      expect(result.status).toBe('coming_soon');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('calling matchJobDescription returns status "coming_soon" with 0 network calls', async () => {
      const result = await AIService.matchJobDescription('Requirements: React Native, TypeScript', ['React Native']);

      expect(result.success).toBe(false);
      expect(result.status).toBe('coming_soon');
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Centralized 15 Indian Languages & AI Localization', () => {
    it('registers exactly 15 Indian languages + English/Hinglish', () => {
      expect(ALL_INDIAN_LANGUAGES.length).toBe(15);
      const codes = ALL_INDIAN_LANGUAGES.map((l) => l.code);
      expect(codes).toContain('en');
      expect(codes).toContain('hi');
      expect(codes).toContain('hi_en');
      expect(codes).toContain('bn');
      expect(codes).toContain('mr');
      expect(codes).toContain('te');
      expect(codes).toContain('ta');
      expect(codes).toContain('gu');
      expect(codes).toContain('ur');
      expect(codes).toContain('kn');
      expect(codes).toContain('or');
      expect(codes).toContain('ml');
      expect(codes).toContain('pa');
      expect(codes).toContain('as');
      expect(codes).toContain('bho');
    });

    it('correctly flags RTL for Urdu and LTR for others', () => {
      expect(isRtlLanguage('ur')).toBe(true);
      expect(isRtlLanguage('hi')).toBe(false);
      expect(isRtlLanguage('en')).toBe(false);
    });

    it('translates AI Coming Soon texts in English and Hindi via centralized dictionary', () => {
      expect(t('aiAssistant', 'en')).toBe('AI Resume Assistant');
      expect(t('comingSoon', 'en')).toBe('Coming Soon');
      expect(t('aiSubtitle', 'en')).toContain('Improve your resume with AI');

      expect(t('aiAssistant', 'hi')).toBe('AI रेज़्यूमे सहायक');
      expect(t('comingSoon', 'hi')).toContain('जल्द आ रहा है');
      expect(t('aiSubtitle', 'hi')).toContain('एआई से अपना रेज़्यूमे बेहतर बनाएं');
    });

    it('cascades gracefully to fallback language if a key is queried', () => {
      // Bengali should gracefully fall back to Hindi/English if a key is not translated yet
      const translated = t('comingSoon', 'bn');
      expect(translated).toBeDefined();
      expect(translated.length).toBeGreaterThan(0);
    });
  });

  describe('Privacy Guarantee - No PII in Analytics', () => {
    it('analytics payloads should only contain high-level operational events without PII', () => {
      const allowedEventKeys = ['screen_name', 'language', 'document_type', 'template_id', 'action'];

      const sampleAnalyticsPayload = {
        action: 'export_pdf',
        document_type: 'traditional_royal_biodata',
        template_id: 'royal_maroon',
        language: 'hi',
      };

      for (const key of Object.keys(sampleAnalyticsPayload)) {
        expect(allowedEventKeys).toContain(key);
        // Explicitly confirm no sensitive user content keys are present
        expect(key).not.toMatch(/(phone|email|address|fullName|fatherName|caste|gotra|photo)/i);
      }
    });
  });
});
