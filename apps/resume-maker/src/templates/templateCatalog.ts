export interface TemplateMeta {
  id: string;
  category: 'resume' | 'marriage_biodata' | 'cover_letter';
  name: string;
  description: string;
  badge?: string;
  isPremium?: boolean;
  primaryColor: string;
  accentColor: string;
  recommendedFor: string;
  style?: 'modern' | 'professional' | 'creative' | 'minimal';
}

export const RESUME_TEMPLATES: TemplateMeta[] = [
  {
    id: 'modern_blue',
    category: 'resume',
    name: 'Modern Blue',
    description: 'Clean modern header with accent blue styling, candidate photo, and skill badges.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#2563EB',
    accentColor: '#3B82F6',
    recommendedFor: 'Developers, Designers, Tech Professionals',
    style: 'modern',
  },
  {
    id: 'clean_minimal',
    category: 'resume',
    name: 'Clean Professional',
    description: 'Clean single-column layout optimized for ATS parsers and corporate jobs.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#0F172A',
    accentColor: '#64748B',
    recommendedFor: 'Corporate, Freshers, Government, Finance',
    style: 'professional',
  },
  {
    id: 'creative_bold',
    category: 'resume',
    name: 'Creative Design',
    description: 'Creative bold layout with colored accent cards for design and marketing roles.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#7C3AED',
    accentColor: '#A855F7',
    recommendedFor: 'Creatives, Freelancers, Product Designers',
    style: 'creative',
  },
  {
    id: 'minimal_clean',
    category: 'resume',
    name: 'Minimal Clean',
    description: 'Ultra-minimal whitespace-focused layout for modern professionals.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#334155',
    accentColor: '#94A3B8',
    recommendedFor: 'Minimalists, Writers, Consultants',
    style: 'minimal',
  },
  {
    id: 'executive_pro',
    category: 'resume',
    name: 'Executive Pro',
    description: 'High-contrast bold headings tailored for Senior Leaders, Directors, and Managers.',
    badge: 'Premium',
    isPremium: true,
    primaryColor: '#1E293B',
    accentColor: '#D97706',
    recommendedFor: 'Managers, Directors, Consultants',
    style: 'professional',
  },
  {
    id: 'creative_pro',
    category: 'resume',
    name: 'Creative Pro',
    description: 'Distinctive infographic layout for senior designers and creative executives.',
    badge: 'Premium',
    isPremium: true,
    primaryColor: '#4F46E5',
    accentColor: '#818CF8',
    recommendedFor: 'Art Directors, Architects, Media Leaders',
    style: 'creative',
  },
];

export const BIODATA_TEMPLATES: TemplateMeta[] = [
  {
    id: 'modern_clean',
    category: 'marriage_biodata',
    name: 'Modern Clean',
    description: 'Contemporary elegant marriage biodata with photo frame and clean typography.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#D97706',
    accentColor: '#F59E0B',
    recommendedFor: 'Working Professionals, Modern Families',
  },
  {
    id: 'elegant_photo',
    category: 'marriage_biodata',
    name: 'Elegant Photo',
    description: 'Prominent photo showcase with soft floral gold accents and structured career details.',
    badge: 'Free',
    isPremium: false,
    primaryColor: '#BE185D',
    accentColor: '#F43F5E',
    recommendedFor: 'Photo-focused matrimonial proposals',
  },
  {
    id: 'royal_traditional',
    category: 'marriage_biodata',
    name: 'Royal Traditional',
    description: 'Classic Hindu Matrimonial layout with Ganesh Ji symbol and double ornate borders.',
    badge: 'Premium',
    isPremium: true,
    primaryColor: '#881337',
    accentColor: '#F59E0B',
    recommendedFor: 'Traditional Hindu, Brahmin, Rajput, Jain, Marwari',
  },
  {
    id: 'premium_classic',
    category: 'marriage_biodata',
    name: 'Premium Classic',
    description: 'Deep navy and sandalwood aesthetic with structured astrological details.',
    badge: 'Premium',
    isPremium: true,
    primaryColor: '#1E3A8A',
    accentColor: '#D97706',
    recommendedFor: 'Astrology & Horoscope Match seekers',
  },
];
