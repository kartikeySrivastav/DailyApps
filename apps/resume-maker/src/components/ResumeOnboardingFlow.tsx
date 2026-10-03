import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { ResumeAvatar } from './ResumeAvatar';
import { ScreenHeader } from './ScreenHeader';
import { ResumeBottomNav } from './ResumeBottomNav';
import { ResumeProfile } from '../types/resume.types';
import { getFilePickerAdapter } from '@dailyapps/media';

interface Props {
  resume: ResumeProfile;
  initialStep?: number;
  onUpdate: (resume: ResumeProfile) => void;
  onComplete: () => void;
  onBack: () => void;
  onNavigate?: (destination: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => void;
}

const steps = ['Personal Details', 'Add Profile Photo', 'Professional Summary', 'Work Experience', 'Add Experience'];

export const ResumeOnboardingFlow: React.FC<Props> = ({ resume, initialStep = 0, onUpdate, onComplete, onBack, onNavigate }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const [step, setStep] = useState(initialStep);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState('');
  const [experienceCompany, setExperienceCompany] = useState('');
  const [experienceLocation, setExperienceLocation] = useState('');
  const [experienceType, setExperienceType] = useState('');
  const [experienceStart, setExperienceStart] = useState('');
  const [experienceEnd, setExperienceEnd] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [isCurrentRole, setIsCurrentRole] = useState(false);
  const [isCroppingPhoto, setIsCroppingPhoto] = useState(false);
  const [cropShape, setCropShape] = useState<'Circle' | 'Square' | 'Rounded' | 'Original'>('Circle');
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);
  const [photoUriToCrop, setPhotoUriToCrop] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const personalInfo = resume.personalInfo;
  const previewPhoto = photoUriToCrop || personalInfo.photoUri;
  const updatePersonalInfo = (patch: Partial<ResumeProfile['personalInfo']>) =>
    onUpdate({ ...resume, personalInfo: { ...personalInfo, ...patch } });

  useEffect(() => {
    setStep(initialStep);
    setShowExperienceForm(initialStep === 4);
  }, [initialStep]);

  const selectPhoto = async (source: 'gallery' | 'camera') => {
    const picker = getFilePickerAdapter();
    if (!picker) {
      setValidationMessage('Photo picker is not configured on this device yet.');
      return;
    }
    try {
      const image = source === 'gallery'
        ? await picker.pickImage({ maxWidth: 1200, maxHeight: 1200, quality: 0.9 })
        : await picker.takePhoto({ maxWidth: 1200, maxHeight: 1200, quality: 0.9 });
      if (!image?.uri) return;
      setValidationMessage(null);
      setPhotoUriToCrop(image.uri);
      setCropZoom(1);
      setCropRotation(0);
      setIsCroppingPhoto(true);
    } catch {
      setValidationMessage('Could not open the photo picker. Please try again.');
    }
  };

  const appendSummarySuggestion = (suggestion: string) => {
    const current = personalInfo.summary || '';
    const nextSummary = current ? `${current}${current.endsWith(' ') ? '' : ' '}${suggestion}` : suggestion;
    updatePersonalInfo({ summary: nextSummary.slice(0, 500) });
  };

  const next = () => {
    if (step === 0) {
      const missing = [
        !personalInfo.fullName.trim() && 'full name',
        !personalInfo.jobTitle.trim() && 'professional title',
        !personalInfo.phone.trim() && 'phone number',
        !personalInfo.email.trim() && 'email address',
      ].filter(Boolean);
      if (missing.length > 0) {
        setValidationMessage(`Please add your ${missing.slice(0, 2).join(' and ')} before continuing.`);
        return;
      }
    }
    setValidationMessage(null);
    if (step === 3) {
      setShowExperienceForm(true);
      setStep(4);
      return;
    }
    if (step === steps.length - 1) {
      onComplete();
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 0) {
      onBack();
      return;
    }
    if (step === 4) setShowExperienceForm(false);
    setStep(step - 1);
  };

  const saveExperience = () => {
    if (!experienceTitle.trim() || !experienceCompany.trim() || !experienceType || !experienceStart.trim() || (!isCurrentRole && !experienceEnd.trim()) || !experienceDescription.trim()) {
      setValidationMessage('Add job title, company, employment type, dates, and a short description.');
      return;
    }
    onUpdate({
      ...resume,
      experience: [
        ...(resume.experience || []),
        {
          id: `exp_${Date.now()}`,
          jobTitle: experienceTitle.trim(),
          company: experienceCompany.trim(),
          startDate: experienceStart.trim(),
          endDate: isCurrentRole ? 'Present' : experienceEnd.trim(),
          location: experienceLocation.trim(),
          isCurrent: isCurrentRole,
          employmentType: experienceType,
          description: experienceDescription.trim(),
          highlights: responsibilities.filter(Boolean),
        },
      ],
    });
    setValidationMessage(null);
    onComplete();
  };

  const removeExperience = (id: string) => onUpdate({ ...resume, experience: resume.experience.filter((experience) => experience.id !== id) });

  const field = (label: string, value: string, onChangeText: (value: string) => void, placeholder: string, multiline = false) => (
    <View style={[styles.fieldGroup, multiline ? styles.flexField : null]}>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline ? styles.descriptionInput : null, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]}
      />
    </View>
  );

  const profileCard = (
    <View style={[styles.profileCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]}>
      <ResumeAvatar photoUri={personalInfo.photoUri} name={personalInfo.fullName} size={72} />
      <View style={styles.profileCopy}>
        <Text style={[styles.profileLabel, { color: theme.colors.textMuted }]}>Profile Photo</Text>
        <TouchableOpacity onPress={() => selectPhoto('gallery')} style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>{personalInfo.photoUri ? '📷  Change Photo' : '📷  Add Photo'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const personalField = (
    icon: string,
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    placeholder: string,
    options: { multiline?: boolean; required?: boolean; accessory?: string } = {},
  ) => (
    <View style={styles.personalField}>
      <View style={styles.fieldIcon}><Text style={styles.fieldIconText}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.personalLabel, { color: theme.colors.text }]}>{label}{options.required ? <Text style={styles.requiredMark}> *</Text> : null}</Text>
        <View style={[styles.personalInputWrap, options.multiline && styles.personalInputMultiline, { borderColor: '#C7D7FF', backgroundColor: theme.colors.surfaceCard }]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted}
            multiline={options.multiline}
            textAlignVertical={options.multiline ? 'top' : 'center'}
            style={[styles.personalInput, options.multiline && styles.personalTextArea, { color: theme.colors.text }]}
          />
          {options.accessory ? <Text style={styles.inputAccessory}>{options.accessory}</Text> : null}
        </View>
      </View>
    </View>
  );

  const profilePanel = (
    <View style={[styles.profilePanel, { backgroundColor: theme.colors.surfaceCard, borderColor: '#C7D7FF' }]}>
      <Text style={[styles.profilePanelTitle, { color: theme.colors.text }]}>Profile Photo</Text>
      <View style={styles.largeAvatarWrap}><ResumeAvatar photoUri={personalInfo.photoUri} name={personalInfo.fullName} size={isWide ? 160 : 112} /><View style={styles.cameraBadge}><Text style={styles.cameraBadgeText}>◉</Text></View></View>
      <TouchableOpacity onPress={() => selectPhoto('gallery')} style={styles.changePhotoWide}><Text style={styles.changePhotoWideText}>▧  Change Photo</Text></TouchableOpacity>
      {personalInfo.photoUri ? <TouchableOpacity onPress={() => updatePersonalInfo({ photoUri: '' })} style={styles.removePhotoWide}><Text style={styles.removePhotoWideText}>⌫  Remove</Text></TouchableOpacity> : null}
      <View style={styles.photoTip}><Text style={styles.photoTipIcon}>♧</Text><Text style={styles.photoTipText}>Use a clear, professional photo for better results.</Text></View>
    </View>
  );

  const renderStep = () => {
    if (step === 0) {
      return (
        <View style={isWide ? styles.personalWideLayout : undefined}>
          <View style={isWide ? styles.personalFieldsWide : undefined}>
            {!isWide ? <><Text style={[styles.title, { color: theme.colors.text }]}>Personal Details</Text><Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Tell us about yourself</Text>{profileCard}</> : null}
            {personalField('●', 'Full Name', personalInfo.fullName, (value) => updatePersonalInfo({ fullName: value }), 'Rahul Kumar', { required: true })}
            {personalField('✉', 'Email Address', personalInfo.email, (value) => updatePersonalInfo({ email: value }), 'rahul@example.com', { required: true })}
            {personalField('◒', 'Phone Number', personalInfo.phone, (value) => updatePersonalInfo({ phone: value }), '+91 98765 43210', { required: true })}
            {personalField('▣', 'Date of Birth', personalInfo.dateOfBirth || '', (value) => updatePersonalInfo({ dateOfBirth: value }), 'DD/MM/YYYY', { required: isWide, accessory: '▣' })}
            {personalField('◎', 'Nationality', personalInfo.nationality || '', (value) => updatePersonalInfo({ nationality: value }), 'Indian', { required: isWide, accessory: '⌄' })}
            {personalField('●', 'Address', personalInfo.address || personalInfo.location, (value) => updatePersonalInfo({ address: value, location: value }), 'New Delhi, India', { required: isWide, multiline: true })}
            {!isWide ? <><View style={styles.socialDivider} /><Text style={[styles.optionalHeading, { color: theme.colors.textMuted }]}>Professional links (optional)</Text>{personalField('in', 'LinkedIn', personalInfo.linkedin || '', (value) => updatePersonalInfo({ linkedin: value }), 'linkedin.com/in/rahul')}{personalField('◉', 'Portfolio / Website', personalInfo.githubOrPortfolio || '', (value) => updatePersonalInfo({ githubOrPortfolio: value }), 'www.example.com')}</> : null}
            <View style={styles.personalInfoNote}><Text style={styles.personalInfoNoteIcon}>i</Text><Text style={styles.personalInfoNoteText}>You can edit or update your details anytime.</Text></View>
          </View>
          {isWide ? profilePanel : null}
        </View>
      );
    }

    if (step === 1) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Add Profile Photo</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Add a professional photo to your resume</Text>
          <ResumeAvatar photoUri={personalInfo.photoUri} name={personalInfo.fullName} size={150} />
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoAction} onPress={() => selectPhoto('gallery')}>
              <Text style={styles.photoActionIcon}>▧</Text>
              <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoAction} onPress={() => selectPhoto('camera')}>
              <Text style={styles.photoActionIcon}>◉</Text>
              <Text style={styles.secondaryButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.helpText, { color: theme.colors.textMuted }]}>Your photo can be cropped and adjusted before saving.</Text>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Professional Summary</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Write a short introduction</Text>
          <TextInput
            multiline
            maxLength={500}
            value={personalInfo.summary || ''}
            onChangeText={(value) => updatePersonalInfo({ summary: value })}
            placeholder="Describe your professional experience, strengths and career goals..."
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.summaryInput, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]}
          />
          <Text style={[styles.characterCount, { color: theme.colors.textMuted }]}>{(personalInfo.summary || '').length} / 500</Text>
          <View style={styles.suggestionRow}>
            {['Professional', 'Experienced', 'Career Objective'].map((suggestion) => (
              <TouchableOpacity key={suggestion} onPress={() => appendSummarySuggestion(suggestion)} style={styles.suggestion}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.aiHint, { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' }]}><Text style={styles.aiHintIcon}>✦</Text><Text style={[styles.aiHintText, { color: theme.colors.textMuted }]}>AI suggestions will help you improve this summary in the editor.</Text></View>
        </View>
      );
    }

    if (step === 3 && !showExperienceForm) {
      return (
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Work Experience</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Add your professional experience</Text>
          {(resume.experience || []).map((experience) => (
            <View key={experience.id} style={[styles.experienceCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]}>
              <View style={styles.experienceCardTop}><View style={styles.experienceBadge}><Text style={styles.experienceBadgeText}>▣</Text></View><View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: theme.colors.text }]}>{experience.jobTitle}</Text><Text style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}>{experience.company}</Text></View><TouchableOpacity accessibilityLabel={`Remove ${experience.jobTitle}`} onPress={() => removeExperience(experience.id)} style={styles.deleteButton}><Text style={styles.deleteText}>×</Text></TouchableOpacity></View>
              <Text style={[styles.experienceMeta, { color: theme.colors.textMuted }]}>{experience.startDate || 'Start date'} – {experience.isCurrent ? 'Present' : experience.endDate || 'End date'}{experience.location ? `  ·  ${experience.location}` : ''}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.outlineButton} onPress={() => { setShowExperienceForm(true); setStep(4); }}>
            <Text style={styles.outlineButtonText}>+ Add Experience</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Add Experience</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Add your professional experience</Text>
        {field('Job Title *', experienceTitle, setExperienceTitle, 'e.g. Frontend Developer')}
        {field('Company *', experienceCompany, setExperienceCompany, 'e.g. Lumor')}
        {field('Location *', experienceLocation, setExperienceLocation, 'e.g. New Delhi, India')}
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Employment Type *</Text>
        <View style={styles.employmentTypes}>{['Full-time', 'Part-time', 'Internship'].map((type) => <TouchableOpacity key={type} onPress={() => setExperienceType(type)} style={[styles.employmentChip, experienceType === type && styles.employmentChipActive]}><Text style={[styles.employmentChipText, { color: experienceType === type ? '#FFFFFF' : theme.colors.textMuted }]}>{type}</Text></TouchableOpacity>)}</View>
        <View style={styles.twoCol}>
          {field('Start Date *', experienceStart, setExperienceStart, 'Select Date')}
          {field('End Date *', experienceEnd, setExperienceEnd, 'Select Date')}
        </View>
        <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: isCurrentRole }} onPress={() => { setIsCurrentRole(!isCurrentRole); if (!isCurrentRole) setExperienceEnd(''); }} style={styles.currentRoleRow}><View style={[styles.checkbox, isCurrentRole && styles.checkboxSelected]}>{isCurrentRole ? <Text style={styles.checkboxTick}>✓</Text> : null}</View><Text style={[styles.currentRoleText, { color: theme.colors.textMuted }]}>I currently work here</Text></TouchableOpacity>
        {field('Description', experienceDescription, setExperienceDescription, 'Describe your role, achievements and key responsibilities...', true)}
        {responsibilities.map((responsibility, index) => <View key={index} style={styles.responsibilityField}><TextInput value={responsibility} onChangeText={(value) => setResponsibilities(responsibilities.map((item, itemIndex) => itemIndex === index ? value : item))} placeholder={`Responsibility ${index + 1}`} placeholderTextColor={theme.colors.textMuted} style={[styles.input, { flex: 1, color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]} /><TouchableOpacity onPress={() => setResponsibilities(responsibilities.filter((_, itemIndex) => itemIndex !== index))} style={styles.responsibilityRemove}><Text style={styles.deleteText}>×</Text></TouchableOpacity></View>)}
        <TouchableOpacity onPress={() => setResponsibilities([...responsibilities, ''])} style={styles.responsibilityButton}><Text style={styles.outlineButtonText}>＋ Add Responsibility</Text></TouchableOpacity>
      </View>
    );
  };

  if (isCroppingPhoto) {
    return (
      <ScreenContainer scrollable={false} withPadding={false}>
        <View style={styles.cropHeader}>
          <TouchableOpacity onPress={() => setIsCroppingPhoto(false)} style={styles.cropBack}><Text style={styles.cropBackText}>‹</Text></TouchableOpacity>
          <Text style={styles.cropHeaderTitle}>Crop & Adjust</Text>
          <TouchableOpacity disabled={!previewPhoto} onPress={() => { if (previewPhoto) updatePersonalInfo({ photoUri: previewPhoto }); setPhotoUriToCrop(null); setIsCroppingPhoto(false); }}><Text style={styles.doneText}>Done</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.cropContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cropCanvas}>
            {previewPhoto ? <Image source={{ uri: previewPhoto }} resizeMode="cover" style={[styles.cropImage, { transform: [{ scale: cropZoom }, { rotate: `${cropRotation}deg` }] }]} /> : null}
            <View style={[styles.cropFrame, cropShape === 'Circle' && styles.cropCircle, cropShape === 'Rounded' && styles.cropRounded]} />
          </View>
          <View style={styles.cropTools}>
            <TouchableOpacity onPress={() => setCropZoom(Math.max(0.85, cropZoom - 0.08))} style={styles.cropTool}><Text style={styles.cropToolIcon}>−</Text><Text style={styles.cropToolText}>Zoom</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCropZoom(Math.min(1.35, cropZoom + 0.08))} style={styles.cropTool}><Text style={styles.cropToolIcon}>+</Text><Text style={styles.cropToolText}>Zoom</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCropRotation(cropRotation + 90)} style={styles.cropTool}><Text style={styles.cropToolIcon}>↻</Text><Text style={styles.cropToolText}>Rotate</Text></TouchableOpacity>
          </View>
          <Text style={styles.cropLabel}>Crop Shape</Text>
          <View style={styles.shapeRow}>{(['Circle', 'Square', 'Rounded', 'Original'] as const).map((shape) => <TouchableOpacity key={shape} onPress={() => setCropShape(shape)} style={[styles.shapeOption, cropShape === shape && styles.shapeOptionActive]}><View style={[styles.shapeSample, shape === 'Circle' && styles.shapeSampleCircle, shape === 'Rounded' && styles.shapeSampleRounded]} /><Text style={[styles.shapeText, cropShape === shape && styles.shapeTextActive]}>{shape}</Text></TouchableOpacity>)}</View>
          <View style={styles.cropHint}><Text style={styles.cropHintIcon}>i</Text><Text style={styles.cropHintText}>Move, zoom or rotate your photo. The selected frame is saved with your resume.</Text></View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader title={steps[step]} subtitle={step === 0 ? 'Add your basic information' : step === 1 ? 'Add a professional photo to your resume' : step === 2 ? 'Write a short introduction' : step === 3 ? 'Add your professional experience' : 'Add your professional experience'} onBack={back} rightElement={<View style={styles.headerStepPill}><Text style={styles.headerStepText}>Step {step + 1} of 12</Text></View>} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{renderStep()}</ScrollView>
      <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surfaceCard }]}>
        {validationMessage ? <Text accessibilityLiveRegion="polite" style={styles.validationText}>{validationMessage}</Text> : null}
        <View style={styles.stepDots}>{steps.map((_, index) => <View key={index} style={[styles.stepDot, index <= step && styles.stepDotActive]} />)}</View>
        <View style={isWide ? styles.footerActionsWide : undefined}>
        {isWide ? <TouchableOpacity style={styles.backFooterButton} onPress={back}><Text style={styles.backFooterText}>←  Back</Text></TouchableOpacity> : null}
        <TouchableOpacity style={[styles.primaryButton, isWide && styles.primaryButtonWide]} onPress={step === 4 ? saveExperience : next}>
          <Text style={styles.primaryButtonText}>{step === 0 || step === 2 || step === 3 ? 'Save & Continue  →' : step === 4 ? 'Save Experience  →' : 'Continue  →'}</Text>
        </TouchableOpacity>
        </View>
        {step === 1 && <TouchableOpacity onPress={next}><Text style={styles.skipText}>Skip for now</Text></TouchableOpacity>}
      </View>
      <ResumeBottomNav onNavigate={onNavigate} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  cropHeader: { height: 64, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  cropBack: { width: 42, height: 42, justifyContent: 'center' },
  cropBackText: { fontSize: 38, color: '#142C6E', fontWeight: '300', lineHeight: 36 },
  cropHeaderTitle: { fontSize: 18, color: '#102B72', fontWeight: '900' },
  doneText: { color: '#315CF3', fontSize: 13, fontWeight: '900', padding: 9 },
  cropContent: { padding: 18, paddingBottom: 50 },
  cropCanvas: { height: 305, borderRadius: 10, overflow: 'hidden', backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  cropImage: { width: '100%', height: '100%' },
  cropFrame: { position: 'absolute', width: '74%', aspectRatio: 1, borderWidth: 3, borderColor: '#FFFFFF', borderRadius: 4 },
  cropCircle: { borderRadius: 999 },
  cropRounded: { borderRadius: 22 },
  cropTools: { flexDirection: 'row', borderWidth: 1, borderColor: '#DDE8FA', borderRadius: 11, marginTop: 16, backgroundColor: '#FFFFFF' },
  cropTool: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRightWidth: 1, borderRightColor: '#E5EDF9' },
  cropToolIcon: { color: '#4265F4', fontSize: 22, fontWeight: '900', height: 26 },
  cropToolText: { color: '#4265F4', fontSize: 11, fontWeight: '700', marginTop: 3 },
  cropLabel: { color: '#142C6E', fontSize: 15, fontWeight: '900', marginTop: 22, marginBottom: 12 },
  shapeRow: { flexDirection: 'row', gap: 8 },
  shapeOption: { flex: 1, minHeight: 82, borderWidth: 1, borderColor: '#DCE7F8', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  shapeOptionActive: { borderColor: '#4265F4', borderWidth: 2, backgroundColor: '#F5F7FF' },
  shapeSample: { width: 23, height: 23, borderWidth: 2, borderColor: '#8391AC', borderRadius: 3, marginBottom: 7 },
  shapeSampleCircle: { borderRadius: 999, backgroundColor: '#7262F3', borderColor: '#7262F3' },
  shapeSampleRounded: { borderRadius: 8 },
  shapeText: { fontSize: 10, color: '#607090', fontWeight: '700' },
  shapeTextActive: { color: '#4265F4' },
  cropHint: { flexDirection: 'row', gap: 9, padding: 13, marginTop: 22, backgroundColor: '#EEF3FF', borderRadius: 10 },
  cropHintIcon: { width: 19, height: 19, borderWidth: 2, borderColor: '#4265F4', borderRadius: 10, color: '#4265F4', textAlign: 'center', fontWeight: '900', lineHeight: 15 },
  cropHintText: { flex: 1, color: '#4962AA', fontSize: 12, lineHeight: 18 },
  content: { padding: 20, paddingBottom: 208 },
  title: { fontSize: 27, fontWeight: '900', marginBottom: 5, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, marginBottom: 22, lineHeight: 20 },
  fieldGroup: { marginBottom: 16, flex: 1 },
  flexField: { flex: 1 },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  descriptionInput: { minHeight: 96, paddingTop: 12 },
  centered: { alignItems: 'center' },
  profileCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, padding: 14, marginBottom: 20 },
  personalWideLayout: { flexDirection: 'row', gap: 32, alignItems: 'flex-start', maxWidth: 980, alignSelf: 'center', width: '100%' },
  personalFieldsWide: { flex: 1, paddingTop: 10 },
  personalField: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  fieldIcon: { width: 48, height: 48, marginTop: 21, borderRadius: 24, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  fieldIconText: { color: '#4265F4', fontSize: 19, fontWeight: '900' },
  personalLabel: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  requiredMark: { color: '#EF4444' },
  personalInputWrap: { minHeight: 52, borderWidth: 1, borderRadius: 11, flexDirection: 'row', alignItems: 'center', paddingRight: 13 },
  personalInputMultiline: { minHeight: 108, alignItems: 'flex-start' },
  personalInput: { flex: 1, fontSize: 15, paddingHorizontal: 14, paddingVertical: 10 },
  personalTextArea: { minHeight: 104, paddingTop: 13 },
  inputAccessory: { color: '#47618C', fontSize: 18 },
  socialDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  optionalHeading: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 14 },
  personalInfoNote: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EEF2FF', borderRadius: 12, padding: 13, marginLeft: 62, marginTop: -4 },
  personalInfoNoteIcon: { width: 20, height: 20, borderWidth: 2, borderColor: '#3158DE', borderRadius: 10, color: '#3158DE', textAlign: 'center', fontWeight: '900', lineHeight: 17 },
  personalInfoNoteText: { color: '#3B5BCE', fontSize: 12, fontWeight: '600', flex: 1 },
  profilePanel: { width: 302, borderWidth: 1, borderRadius: 15, padding: 24, alignItems: 'center', marginTop: 10 },
  profilePanelTitle: { alignSelf: 'flex-start', fontSize: 19, fontWeight: '900', marginBottom: 20 },
  largeAvatarWrap: { position: 'relative', marginBottom: 20 },
  cameraBadge: { position: 'absolute', right: -6, bottom: 3, width: 46, height: 46, borderRadius: 23, backgroundColor: '#3567F2', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  cameraBadgeText: { color: '#FFFFFF', fontSize: 20 },
  changePhotoWide: { borderColor: '#758FFF', borderWidth: 1, borderRadius: 10, width: '100%', paddingVertical: 13, alignItems: 'center', marginBottom: 12 },
  changePhotoWideText: { color: '#3567F2', fontSize: 14, fontWeight: '800' },
  removePhotoWide: { borderColor: '#FDA4AF', borderWidth: 1, borderRadius: 10, width: '100%', paddingVertical: 13, alignItems: 'center', marginBottom: 18 },
  removePhotoWideText: { color: '#EF4444', fontSize: 14, fontWeight: '800' },
  photoTip: { flexDirection: 'row', gap: 9, backgroundColor: '#EEF2FF', padding: 12, borderRadius: 10 },
  photoTipIcon: { color: '#3567F2', fontSize: 20 },
  photoTipText: { color: '#3B5BCE', fontSize: 12, flex: 1, lineHeight: 18 },
  profileCopy: { marginLeft: 14, flex: 1 },
  profileLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  changePhotoButton: { borderWidth: 1, borderColor: '#A5B4FC', borderRadius: 7, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' },
  changePhotoText: { color: '#4F46E5', fontSize: 11, fontWeight: '800' },
  photoActions: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 24 },
  photoAction: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 14, paddingVertical: 18, backgroundColor: '#FFFFFF' },
  photoActionIcon: { color: '#4F46E5', fontSize: 24, marginBottom: 5 },
  secondaryButtonText: { color: '#2563EB', fontWeight: '800', fontSize: 13 },
  helpText: { textAlign: 'center', fontSize: 12, marginTop: 20 },
  summaryInput: { height: 180, borderWidth: 1, borderRadius: 14, padding: 14, textAlignVertical: 'top', fontSize: 15, lineHeight: 22 },
  characterCount: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  suggestion: { borderWidth: 1, borderColor: '#A5B4FC', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  suggestionText: { color: '#4F46E5', fontSize: 11, fontWeight: '700' },
  aiHint: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, marginTop: 22 },
  aiHintIcon: { color: '#2563EB', fontSize: 18 },
  aiHintText: { flex: 1, fontSize: 11.5, lineHeight: 16 },
  experienceCard: { borderWidth: 1, borderRadius: 15, padding: 15, marginBottom: 12 },
  experienceCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  experienceBadge: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  experienceBadgeText: { color: '#2563EB', fontSize: 20, fontWeight: '900' },
  cardTitle: { fontWeight: '800', fontSize: 14 },
  cardSubtitle: { fontSize: 12, marginTop: 5 },
  experienceMeta: { fontSize: 11, lineHeight: 17, marginTop: 12, marginLeft: 52 },
  deleteButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2' },
  deleteText: { color: '#DC2626', fontSize: 20, fontWeight: '700', lineHeight: 21 },
  outlineButton: { borderWidth: 1, borderColor: '#6366F1', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  outlineButtonText: { color: '#4F46E5', fontWeight: '800', fontSize: 13 },
  twoCol: { flexDirection: 'row', gap: 10 },
  employmentTypes: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  employmentChip: { flex: 1, borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 11, alignItems: 'center', paddingVertical: 11 },
  employmentChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  employmentChipText: { fontSize: 11, fontWeight: '800' },
  currentRoleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: -4, marginBottom: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkboxTick: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  currentRoleText: { fontSize: 12, fontWeight: '700' },
  responsibilityField: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  responsibilityRemove: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  responsibilityButton: { backgroundColor: '#EEF2FF', borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  footer: { position: 'absolute', bottom: 62, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1 },
  footerActionsWide: { flexDirection: 'row', gap: 14, maxWidth: 980, width: '100%', alignSelf: 'center' },
  backFooterButton: { flex: 1, height: 52, borderRadius: 13, borderColor: '#6381FF', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  backFooterText: { color: '#4668F5', fontSize: 15, fontWeight: '800' },
  validationText: { color: '#DC2626', fontSize: 12, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  stepDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 10 },
  stepDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#CBD5E1' },
  stepDotActive: { backgroundColor: '#2563EB', width: 20 },
  primaryButton: { backgroundColor: '#2563EB', borderRadius: 13, paddingVertical: 15, alignItems: 'center', shadowColor: '#2563EB', shadowOpacity: 0.24, shadowRadius: 7, elevation: 3 },
  primaryButtonWide: { flex: 1, height: 52, justifyContent: 'center', paddingVertical: 0, backgroundColor: '#4F46E5' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  skipText: { textAlign: 'center', color: '#4F46E5', fontWeight: '700', fontSize: 12, marginTop: 10 },
  headerStepPill: { borderWidth: 1, borderColor: '#C7D2FE', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#F5F3FF' },
  headerStepText: { color: '#4F46E5', fontSize: 11, fontWeight: '800' },
});
