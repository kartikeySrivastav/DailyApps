import { SupportedLanguage } from './languages';

export interface TranslationDictionary {
  // Common UI Actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  rename: string;
  duplicate: string;
  preview: string;
  share: string;
  exportPdf: string;
  back: string;
  next: string;
  add: string;
  remove: string;
  search: string;
  loading: string;
  emptyState: string;
  success: string;
  error: string;
  language: string;
  appLanguage: string;
  documentLanguage: string;
  theme: string;
  autosave: string;

  // Master Profile
  masterProfile: string;
  masterProfileDesc: string;
  importMaster: string;
  syncMaster: string;

  // Documents
  professionalResume: string;
  fresherResume: string;
  experiencedResume: string;
  curriculumVitae: string;
  internshipResume: string;
  academicCv: string;
  coverLetter: string;
  marriageBiodata: string;
  modernBiodata: string;
  traditionalBiodata: string;
  simpleBiodata: string;
  photoBiodata: string;

  // Resume Sections
  personalInfo: string;
  summary: string;
  workExperience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  achievements: string;
  languages: string;
  interests: string;
  socialLinks: string;
  customSection: string;
  hideSection: string;
  showSection: string;
  reorderSections: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  present: string;
  degree: string;
  institution: string;
  scoreOrGpa: string;

  // Matrimonial Fields
  astrologyDetails: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  manglik: string;
  familyBackground: string;
  fatherName: string;
  motherName: string;
  brothers: string;
  sisters: string;
  annualIncome: string;
  contactDetails: string;
  partnerPreferences: string;

  // AI & Smart Tools
  aiAssistant: string;
  aiSubtitle: string;
  comingSoon: string;
  aiFeatureSummary: string;
  aiFeatureBullets: string;
  aiFeatureWording: string;
  aiFeatureAts: string;
  aiFeatureReview: string;
  aiFeatureNotice: string;
  improveSummary: string;
  enhanceBullet: string;
  optimizeKeywords: string;
  actionVerbs: string;
}

export const BASE_ENGLISH: TranslationDictionary = {
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  rename: 'Rename',
  duplicate: 'Duplicate',
  preview: 'Preview',
  share: 'Share',
  exportPdf: 'Export PDF',
  back: 'Back',
  next: 'Next',
  add: 'Add',
  remove: 'Remove',
  search: 'Search',
  loading: 'Loading...',
  emptyState: 'No items yet',
  success: 'Success',
  error: 'Error',
  language: 'Language',
  appLanguage: 'App Language',
  documentLanguage: 'Document Language',
  theme: 'Theme',
  autosave: 'Draft Autosaved',

  masterProfile: 'Master Profile',
  masterProfileDesc: 'Store your complete history once and create tailored documents in 1-click.',
  importMaster: 'Import Master Profile',
  syncMaster: 'Sync to Master Profile',

  professionalResume: 'Professional Resume',
  fresherResume: 'Fresher Resume',
  experiencedResume: 'Experienced Tech Resume',
  curriculumVitae: 'Curriculum Vitae (CV)',
  internshipResume: 'Internship Resume',
  academicCv: 'Academic CV',
  coverLetter: 'Cover Letter',

  marriageBiodata: 'Marriage Biodata',
  modernBiodata: 'Modern Marriage Biodata',
  traditionalBiodata: 'Traditional Marriage Biodata',
  simpleBiodata: 'Simple One-Page Biodata',
  photoBiodata: 'Photo-Focused Biodata',

  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  workExperience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Proficiencies',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Key Achievements & Awards',
  languages: 'Languages',
  interests: 'Interests & Hobbies',
  socialLinks: 'Social & Web Links',
  customSection: 'Custom Section',
  hideSection: 'Hide',
  showSection: 'Show',
  reorderSections: 'Reorder Sections',
  jobTitle: 'Job Title',
  company: 'Company / Organization',
  location: 'Location (City, Country)',
  startDate: 'Start Date',
  endDate: 'End Date',
  present: 'Present',
  degree: 'Degree',
  institution: 'University / College',
  scoreOrGpa: 'GPA / Percentage',

  astrologyDetails: 'Kundali & Astrology',
  gotra: 'Gotra',
  rashi: 'Rashi (Zodiac)',
  nakshatra: 'Nakshatra',
  manglik: 'Manglik Status',
  familyBackground: 'Family Background',
  fatherName: "Father's Name & Occupation",
  motherName: "Mother's Name & Occupation",
  brothers: 'Brothers',
  sisters: 'Sisters',
  annualIncome: 'Annual Income (CTC)',
  contactDetails: 'Contact Details',
  partnerPreferences: 'Partner Preferences',

  aiAssistant: 'AI Resume Assistant',
  aiSubtitle: 'Improve your resume with AI',
  comingSoon: 'Coming Soon',
  aiFeatureSummary: 'Improve Resume Summary',
  aiFeatureBullets: 'Improve Experience Bullet Points',
  aiFeatureWording: 'Generate Professional Wording',
  aiFeatureAts: 'Job Description Based Suggestions',
  aiFeatureReview: 'Resume Review & Optimization',
  aiFeatureNotice: 'AI features are coming in a future update. V1 is optimized for 100% offline, private, and instant document creation without wait times or costs.',
  improveSummary: 'Polish Summary with AI',
  enhanceBullet: 'Boost with Action Verbs',
  optimizeKeywords: 'Match ATS Keywords',
  actionVerbs: 'Power Words',
};

export const BASE_HINDI: TranslationDictionary = {
  save: 'सुरक्षित करें (Save)',
  cancel: 'रद्द करें',
  delete: 'हटाएं',
  edit: 'संपादित करें',
  rename: 'नाम बदलें',
  duplicate: 'कॉपी बनाएं (Duplicate)',
  preview: 'पूर्वावलोकन (Preview)',
  share: 'साझा करें (Share)',
  exportPdf: 'PDF डाउनलोड करें',
  back: 'पीछे',
  next: 'आगे',
  add: 'जोड़ें',
  remove: 'हटाएं',
  search: 'खोजें',
  loading: 'लोड हो रहा है...',
  emptyState: 'कोई दस्तावेज़ उपलब्ध नहीं',
  success: 'सफलता',
  error: 'त्रुटि',
  language: 'भाषा (Language)',
  appLanguage: 'ऐप भाषा',
  documentLanguage: 'दस्तावेज़ भाषा',
  theme: 'थीम',
  autosave: 'ड्राफ्ट स्वतः सुरक्षित',

  masterProfile: 'मास्टर प्रोफाइल',
  masterProfileDesc: 'अपनी पूरी जानकारी एक बार दर्ज करें और 1-क्लिक में नए बायोडाटा या रिज्यूम बनाएं।',
  importMaster: 'मास्टर प्रोफाइल से लें',
  syncMaster: 'मास्टर प्रोफाइल में सेव करें',

  professionalResume: 'प्रोफेशनल रिज्यूम',
  fresherResume: 'फ्रेशर / स्टूडेंट रिज्यूम',
  experiencedResume: 'अनुभवी टेक रिज्यूम',
  curriculumVitae: 'विस्तृत सीवी (CV)',
  internshipResume: 'इंटर्नशिप रिज्यूम',
  academicCv: 'शैक्षणिक सीवी',
  coverLetter: 'कवर लेटर',

  marriageBiodata: 'विवाह बायोडाटा',
  modernBiodata: 'आधुनिक विवाह बायोडाटा',
  traditionalBiodata: 'पारंपरिक विवाह बायोडाटा',
  simpleBiodata: 'एक-पेज सरल बायोडाटा',
  photoBiodata: 'फोटो-युक्त बायोडाटा',

  personalInfo: 'व्यक्तिगत जानकारी',
  summary: 'संक्षिप्त विवरण (Summary)',
  workExperience: 'कार्य अनुभव (Work Experience)',
  education: 'शैक्षणिक योग्यता (Education)',
  skills: 'कौशल (Skills)',
  projects: 'परियोजनाएं (Projects)',
  certifications: 'प्रमाणपत्र (Certifications)',
  achievements: 'उपलब्धियां व पुरस्कार',
  languages: 'भाषाएं (Languages)',
  interests: 'रुचियां (Interests)',
  socialLinks: 'सोशल व वेब लिंक',
  customSection: 'कस्टम अनुभाग (Custom Section)',
  hideSection: 'छिपाएं',
  showSection: 'दिखाएं',
  reorderSections: 'क्रम बदलें (Reorder)',
  jobTitle: 'पद (Job Title)',
  company: 'कंपनी / संस्थान',
  location: 'स्थान (शहर, देश)',
  startDate: 'प्रारंभ तिथि',
  endDate: 'समाप्ति तिथि',
  present: 'वर्तमान',
  degree: 'डिग्री / योग्यता',
  institution: 'कॉलेज / विश्वविद्यालय',
  scoreOrGpa: 'अंक / GPA',

  astrologyDetails: 'कुंडली व ज्योतिष विवरण',
  gotra: 'गोत्र',
  rashi: 'राशि',
  nakshatra: 'नक्षत्र',
  manglik: 'मांगलिक स्थिति',
  familyBackground: 'पारिवारिक विवरण',
  fatherName: 'पिता का नाम व व्यवसाय',
  motherName: 'माता का नाम व व्यवसाय',
  brothers: 'भाई',
  sisters: 'बहनें',
  annualIncome: 'वार्षिक आय (CTC)',
  contactDetails: 'संपर्क विवरण व पता',
  partnerPreferences: 'जीवनसाथी से अपेक्षाएं',

  aiAssistant: 'AI रेज़्यूमे सहायक',
  aiSubtitle: 'एआई से अपना रेज़्यूमे बेहतर बनाएं',
  comingSoon: 'जल्द आ रहा है (Coming Soon)',
  aiFeatureSummary: 'रेज़्यूमे सारांश को बेहतर बनाएं',
  aiFeatureBullets: 'अनुभव के बुलेट पॉइंट्स सुधारें',
  aiFeatureWording: 'प्रोफेशनल भाषा व शब्द शैली',
  aiFeatureAts: 'जॉब विवरण के अनुसार सुझाव',
  aiFeatureReview: 'रेज़्यूमे समीक्षा व अनुकूलन',
  aiFeatureNotice: 'एआई सुविधाएं भविष्य के अपडेट में आ रही हैं। V1 संस्करण बिना किसी रुकावट, लागत या प्रतीक्षा के पूर्णतः सुरक्षित और त्वरित दस्तावेज़ निर्माण के लिए तैयार किया गया है।',
  improveSummary: 'विवरण बेहतर बनाएं',
  enhanceBullet: 'सशक्त क्रिया शब्द जोड़ें',
  optimizeKeywords: 'ATS कीवर्ड्स मिलाएं',
  actionVerbs: 'सशक्त क्रिया शब्द',
};

// Top 15 Indian Language Dictionary Map
export const DICTIONARIES: Record<SupportedLanguage, Partial<TranslationDictionary>> = {
  en: BASE_ENGLISH,
  hi: BASE_HINDI,
  hi_en: {
    ...BASE_ENGLISH,
    save: 'Save Karein',
    delete: 'Delete Karein',
    preview: 'Preview Karein',
    share: 'Share Karein',
    exportPdf: 'PDF Download Karein',
    add: '+ Naya Jodein',
    marriageBiodata: 'Vivah Biodata',
    masterProfile: 'Master Profile',
    aiAssistant: 'Smart AI Assistant',
  },
  bn: {
    ...BASE_HINDI,
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'সম্পাদনা করুন',
    preview: 'পূর্বরূপ',
    share: 'শেয়ার করুন',
    exportPdf: 'পিডিএফ ডাউনলোড',
    search: 'অনুসন্ধান করুন',
    language: 'ভাষা',
    marriageBiodata: 'বিবাহের বায়োডাটা',
    personalInfo: 'ব্যক্তিগত তথ্য',
    education: 'শিক্ষাগত যোগ্যতা',
    workExperience: 'কাজের অভিজ্ঞতা',
  },
  mr: {
    ...BASE_HINDI,
    save: 'जतन करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    preview: 'पूर्वावलोकन',
    share: 'शेअर करा',
    exportPdf: 'पीडीएफ डाउनलोड',
    language: 'भाषा',
    marriageBiodata: 'विवाह बायोडाटा',
    personalInfo: 'वैयक्तिक माहिती',
    familyBackground: 'कौटुंबिक माहिती',
  },
  te: {
    ...BASE_ENGLISH,
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    preview: 'ప్రివ్యూ',
    share: 'షేర్ చేయండి',
    exportPdf: 'పీడీఎఫ్ డౌన్‌లోడ్',
    language: 'భాష',
    marriageBiodata: 'వివాహ బయోడేటా',
    personalInfo: 'వ్యక్తిగత వివరాలు',
    education: 'విద్యార్హతలు',
  },
  ta: {
    ...BASE_ENGLISH,
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    preview: 'முன்னோட்டம்',
    share: 'பகிர்',
    exportPdf: 'பிடிஎஃப் பதிவிறக்கம்',
    language: 'மொழி',
    marriageBiodata: 'திருமண பயோடேட்டா',
    personalInfo: 'தனிப்பட்ட தகவல்',
    education: 'கல்வி தகுதி',
  },
  gu: {
    ...BASE_HINDI,
    save: 'સાચવો',
    cancel: 'રદ કરો',
    delete: 'કાઢી નાખો',
    edit: 'ફેરફાર કરો',
    preview: 'પૂર્વાવલોકન',
    share: 'શેર કરો',
    exportPdf: 'પીડીએફ ડાઉનલોડ',
    language: 'ભાષા',
    marriageBiodata: 'લગ્ન બાયોડેટા',
    personalInfo: 'વ્યક્તિગત માહિતી',
  },
  ur: {
    ...BASE_ENGLISH,
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    delete: 'حذف کریں',
    edit: 'ترمیم کریں',
    preview: 'پیش نظارہ',
    share: 'شیئر کریں',
    exportPdf: 'پی ڈی ایف ڈاؤن لوڈ',
    language: 'زبان',
    marriageBiodata: 'شادی بائیو ڈیٹا',
    personalInfo: 'ذاتی معلومات',
  },
  kn: {
    ...BASE_ENGLISH,
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ತಿದ್ದಿ',
    preview: 'ಮುನ್ನೋಟ',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    exportPdf: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್',
    language: 'ಭಾಷೆ',
    marriageBiodata: 'ಮದುವೆ ಬಯೋಡೇಟಾ',
  },
  or: {
    ...BASE_HINDI,
    save: 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
    cancel: 'ବାତିଲ କରନ୍ତୁ',
    delete: 'ଡିଲିଟ କରନ୍ତୁ',
    edit: 'ସମ୍ପାଦନ କରନ୍ତୁ',
    preview: 'ପୂର୍ବାବଲୋକନ',
    share: 'ସେୟାର କରନ୍ତୁ',
    language: 'ଭାଷା',
    marriageBiodata: 'ବିବାହ ବାୟୋଡାଟା',
  },
  ml: {
    ...BASE_ENGLISH,
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
    edit: 'തിരുത്തുക',
    preview: 'പ്രിവ്യൂ',
    share: 'പങ്കുവെക്കുക',
    language: 'ഭാഷ',
    marriageBiodata: 'വിവാഹ ബയോഡാറ്റ',
  },
  pa: {
    ...BASE_HINDI,
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    delete: 'ਹਟਾਓ',
    edit: 'ਸੋਧੋ',
    preview: 'ਝਲਕ',
    share: 'ਸਾਂਝਾ ਕਰੋ',
    exportPdf: 'ਪੀਡੀਐਫ ਡਾਊਨਲੋਡ',
    language: 'ਭਾਸ਼ਾ',
    marriageBiodata: 'ਵਿਆਹ ਬਾਇਓਡਾਟਾ',
  },
  as: {
    ...BASE_HINDI,
    save: 'সংৰক্ষণ কৰক',
    cancel: 'বাতিল কৰক',
    delete: 'মচি পেলাওক',
    edit: 'সম্পাদনা কৰক',
    preview: 'পূৰ্বরূপ',
    share: 'শ্বেয়াৰ কৰক',
    language: 'ভাষা',
    marriageBiodata: 'বিবাহৰ বায়োডাটা',
  },
  bho: {
    ...BASE_HINDI,
    save: 'सहेज लीं',
    cancel: 'काटीं',
    delete: 'हटा दीं',
    edit: 'सुधारीं',
    preview: 'देखीं (Preview)',
    share: 'भेजीं (Share)',
    exportPdf: 'PDF उतारीं',
    marriageBiodata: 'बियाह के बायोडाटा',
    personalInfo: 'निजी जानकारी',
  },
};
