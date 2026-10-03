/**
 * Future-Ready AI Service Abstraction for DailyApps Resume & Biodata Maker.
 *
 * ARCHITECTURAL RULE:
 * In V1, this layer does NOT execute network requests, does NOT use API keys,
 * and does NOT call external AI providers (OpenAI, Gemini, Claude, etc.).
 *
 * All methods return a 'coming_soon' status.
 * This guarantees zero API cost, zero network overhead, and zero privacy leakage for V1 launch.
 */

export interface AiServiceConfig {
  provider?: 'gemini' | 'openai' | 'claude' | 'local';
  isEnabled: boolean;
}

export interface AiResult<T> {
  success: boolean;
  status: 'coming_soon' | 'not_configured' | 'success' | 'error';
  data?: T;
  message: string;
}

export interface ResumeReviewResult {
  overallScore: number;
  grammarFeedback: string[];
  impactSuggestions: string[];
  atsReadiness: string;
}

export interface AtsMatchResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface IAiService {
  readonly isAvailable: boolean;
  improveSummary(summary: string, targetRole?: string): Promise<AiResult<string>>;
  enhanceBulletPoint(bullet: string): Promise<AiResult<string>>;
  generateProfessionalWording(context: string): Promise<AiResult<string>>;
  reviewResume(content: Record<string, unknown>): Promise<AiResult<ResumeReviewResult>>;
  matchJobDescription(jobDescription: string, skills: string[]): Promise<AiResult<AtsMatchResult>>;
}

/**
 * Default V1 Implementation:
 * Pure stub that confirms AI features are scheduled for future versions.
 * Makes ZERO network calls, requires ZERO API keys.
 */
class V1ComingSoonAiService implements IAiService {
  public readonly isAvailable: boolean = false;

  public async improveSummary(_summary: string, _targetRole?: string): Promise<AiResult<string>> {
    return {
      success: false,
      status: 'coming_soon',
      message: 'AI Resume Summary Polish is coming soon in an upcoming update.',
    };
  }

  public async enhanceBulletPoint(_bullet: string): Promise<AiResult<string>> {
    return {
      success: false,
      status: 'coming_soon',
      message: 'AI Experience Bullet Enhancement is coming soon in an upcoming update.',
    };
  }

  public async generateProfessionalWording(_context: string): Promise<AiResult<string>> {
    return {
      success: false,
      status: 'coming_soon',
      message: 'AI Professional Wording generation is coming soon in an upcoming update.',
    };
  }

  public async reviewResume(_content: Record<string, unknown>): Promise<AiResult<ResumeReviewResult>> {
    return {
      success: false,
      status: 'coming_soon',
      message: 'AI Resume Review & Score is coming soon in an upcoming update.',
    };
  }

  public async matchJobDescription(_jobDescription: string, _skills: string[]): Promise<AiResult<AtsMatchResult>> {
    return {
      success: false,
      status: 'coming_soon',
      message: 'AI Job Description Matcher is coming soon in an upcoming update.',
    };
  }
}

/**
 * Singleton instance of the future AI Service.
 */
export const AIService: IAiService = new V1ComingSoonAiService();
