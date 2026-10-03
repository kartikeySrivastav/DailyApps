/**
 * ResumeAdvancedScreen — Screens 16–19 (Reference-accurate rewrite)
 *
 * 16  Languages — language cards with proficiency, add/edit form
 * 17  Additional Sections — 2-column tile grid, custom section entries
 * 18  Reorder Sections — drag handles, section list, save order
 * 19  Customize Template — mini-preview, color/typography/spacing/shape selectors
 *
 * Also supports the `interests` mode (add/remove interest chips).
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useAppStorage } from '@dailyapps/storage';
import { ResumeProfile, ResumeSectionId } from '../types/resume.types';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { ResumeAvatar } from '../components/ResumeAvatar';

type Mode = 'languages' | 'interests' | 'additional' | 'reorder' | 'customize';

interface Props {
  navigation?: any;
  route?: { params?: { mode?: Mode; document?: ResumeProfile } };
}

const DEFAULT_ORDER: ResumeSectionId[] = [
  'personalInfo', 'summary', 'workExperience', 'education', 'skills',
  'projects', 'certifications', 'achievements', 'languages',
  'interests',
];

const LABELS: Record<string, string> = {
  personalInfo: 'Personal Details', summary: 'Professional Summary', workExperience: 'Work Experience',
  education: 'Education', skills: 'Skills', projects: 'Projects', certifications: 'Certifications',
  achievements: 'Achievements', languages: 'Languages', interests: 'Interests',
};

// ── Language flag colors (stylized circles) ──
const LANGUAGE_COLORS: Record<string, string> = {
  english: '#2563EB', hindi: '#F59E0B', spanish: '#EF4444', french: '#3B82F6',
  german: '#1E293B', japanese: '#DC2626', chinese: '#EF4444', arabic: '#10B981',
  portuguese: '#22C55E', russian: '#6366F1', korean: '#8B5CF6', italian: '#10B981',
};


// ── Additional section tiles ──
const SECTION_TILES = [
  { name: 'Hobbies', icon: '♥', color: '#8B5CF6' },
  { name: 'Interests', icon: '♡', color: '#8B5CF6' },
  { name: 'Volunteer Experience', icon: '👥', color: '#64748B' },
  { name: 'Publications', icon: '📄', color: '#64748B' },
  { name: 'References', icon: '👤', color: '#64748B' },
  { name: 'Awards', icon: '🏆', color: '#64748B' },
];

// ── Color palette for Screen 19 ──
const COLOR_OPTIONS = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Green', value: '#059669' },
  { name: 'Black', value: '#1E293B' },
];

export const ResumeAdvancedScreen: React.FC<Props> = ({ navigation, route }) => {
  const storage = useAppStorage();
  const mode = route?.params?.mode || 'additional';
  const [resume, setResume] = useState<ResumeProfile>(route?.params?.document as ResumeProfile);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [order, setOrder] = useState<ResumeSectionId[]>(resume?.sectionOrder || DEFAULT_ORDER);
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState('Professional');
  const [newInterest, setNewInterest] = useState('');
  const [showLangForm, setShowLangForm] = useState(false);
  const [editingLangIndex, setEditingLangIndex] = useState<number | null>(null);

  // ── Customize state ──
  const [selectedColor, setSelectedColor] = useState(resume?.accentColor || '#2563EB');
  const [selectedTypography, setSelectedTypography] = useState('Modern');
  const [selectedSpacing, setSelectedSpacing] = useState(resume?.fontSize || 'standard');
  const [selectedPhotoShape, setSelectedPhotoShape] = useState('Circle');
  const [selectedSectionStyle, setSelectedSectionStyle] = useState('Modern');

  const persist = async (updated: ResumeProfile) => {
    setResume(updated);
    const existing = await storage.getJson<ResumeProfile[]>('saved_documents', []);
    await storage.setJson('saved_documents', [updated, ...existing.filter((item) => item.id !== updated.id)]);
  };

  const saveAndBack = async (updated: ResumeProfile = resume) => {
    await persist(updated);
    navigation.goBack();
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  const getLangColor = (lang: string) => {
    const key = lang.toLowerCase().split(' ')[0];
    return LANGUAGE_COLORS[key] || '#2563EB';
  };

  const title = mode === 'languages' ? 'Languages' : mode === 'interests' ? 'Interests' : mode === 'reorder' ? 'Reorder Sections' : mode === 'customize' ? 'Customize Template' : 'Additional Sections';
  const subtitle = mode === 'languages' ? 'Add languages you know' : mode === 'interests' ? 'Add interests that show more about you' : mode === 'reorder' ? 'Drag to arrange your resume sections' : mode === 'customize' ? 'Personalize your resume design' : 'Add more information to your resume';

  // ════════════════════════════════════════════════
  // SCREEN 16 — LANGUAGES
  // ════════════════════════════════════════════════
  const renderLanguages = () => (
    <View>
      {/* Language cards */}
      {(resume.languages || []).map((language, idx) => {
        const color = getLangColor(language);
        return (
          <View key={language + idx} style={st.langCard}>
            {/* Colored flag circle */}
            <View style={[st.langFlag, { backgroundColor: color + '18' }]}>
              <View style={[st.langFlagInner, { backgroundColor: color }]} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={st.langName}>{language}</Text>
              <Text style={st.langProf}>Professional</Text>
            </View>
            {/* Edit + Delete */}
            <View style={st.langActions}>
              <TouchableOpacity activeOpacity={0.7}
                onPress={() => {
                  setNewLanguage(language);
                  setEditingLangIndex(idx);
                  setShowLangForm(true);
                }}
                style={st.editBtn}>
                <Text style={st.editBtnEmoji}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}
                onPress={() => void persist({ ...resume, languages: resume.languages.filter((_, i) => i !== idx) })}
                style={st.deleteBtn}>
                <Text style={st.deleteBtnEmoji}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* + Add Language button */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => { setNewLanguage(''); setNewProficiency('Professional'); setEditingLangIndex(null); setShowLangForm(true); }} style={st.addEntryBtn}>
        <Text style={st.addEntryIcon}>+</Text>
        <Text style={st.addEntryText}>Add Language</Text>
      </TouchableOpacity>

      {/* Add / Edit Language form */}
      {showLangForm && (
        <View style={st.formCard}>
          <Text style={st.formCardTitle}>Add / Edit Language</Text>

          <Text style={st.label}>Language *</Text>
          <View style={st.dropdown}>
            <TextInput value={newLanguage} onChangeText={setNewLanguage}
              placeholder="Select Language" placeholderTextColor="#94A3B8"
              style={st.dropdownInput} />
            <Text style={st.dropdownArrow}>▾</Text>
          </View>

          <Text style={st.label}>Proficiency Level *</Text>
          <View style={st.dropdown}>
            <TextInput value={newProficiency} onChangeText={setNewProficiency}
              placeholder="Select Proficiency" placeholderTextColor="#94A3B8"
              style={st.dropdownInput} />
            <Text style={st.dropdownArrow}>▾</Text>
          </View>

          {/* Info note */}
          <View style={st.infoNote}>
            <Text style={st.infoIcon}>ⓘ</Text>
            <Text style={st.infoText}>Document language can be different from your app language.</Text>
          </View>

          {/* Cancel + Save buttons */}
          <View style={st.formBtns}>
            <TouchableOpacity activeOpacity={0.8}
              onPress={() => { setShowLangForm(false); setNewLanguage(''); setEditingLangIndex(null); }}
              style={st.cancelBtn}>
              <Text style={st.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85}
              onPress={() => {
                if (!newLanguage.trim()) return;
                if (editingLangIndex !== null) {
                  const updated = [...resume.languages];
                  updated[editingLangIndex] = newLanguage.trim();
                  void persist({ ...resume, languages: updated });
                } else {
                  void persist({ ...resume, languages: [...resume.languages, newLanguage.trim()] });
                }
                setNewLanguage(''); setShowLangForm(false); setEditingLangIndex(null);
              }}
              style={st.saveBtn}>
              <Text style={st.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Save & Continue */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => void saveAndBack()} style={st.saveContinue}>
        <Text style={st.saveContinueText}>Save & Continue  →</Text>
      </TouchableOpacity>
    </View>
  );

  // ════════════════════════════════════════════════
  // SCREEN 17 — ADDITIONAL SECTIONS
  // ════════════════════════════════════════════════
  const renderAdditional = () => (
    <View>
      {/* 2-column tile grid */}
      <View style={st.tileGrid}>
        {SECTION_TILES.map((tile) => {
          const hasContent = (resume.customSections || []).some((s) => s.title.toLowerCase() === tile.name.toLowerCase());
          return (
            <TouchableOpacity key={tile.name}
              style={[st.tile, hasContent && st.tileActive]}
              onPress={() => setCustomTitle(tile.name)}>
              <View style={[st.tileIconBox, { backgroundColor: hasContent ? '#8B5CF6' : '#EEF2FF' }]}>
                <Text style={[st.tileIcon, { color: hasContent ? '#FFFFFF' : '#8B5CF6' }]}>{tile.icon}</Text>
              </View>
              <Text style={st.tileLabel}>{tile.name}</Text>
              {hasContent && (
                <View style={st.tileCheckmark}>
                  <Text style={st.tileCheckmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Section button */}
      <TouchableOpacity style={st.customSectionBtn} onPress={() => { setCustomTitle(''); setCustomContent(''); }}>
        <View style={st.customSectionIconBox}>
          <Text style={st.customSectionIcon}>+</Text>
        </View>
        <Text style={st.customSectionText}>Custom Section</Text>
      </TouchableOpacity>

      {/* + Create Custom Section */}
      <TouchableOpacity style={st.addEntryBtn} onPress={() => { setCustomTitle(''); setCustomContent(''); }}>
        <Text style={st.addEntryIcon}>+</Text>
        <Text style={st.addEntryText}>Create Custom Section</Text>
      </TouchableOpacity>

      {/* Existing custom sections */}
      {(resume.customSections || []).map((section) => (
        <View key={section.id} style={st.customEntryCard}>
          <View style={st.customEntryIconBox}>
            <Text style={st.customEntryIcon}>📝</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.customEntryTitle}>{section.title}</Text>
            <Text style={st.customEntrySub} numberOfLines={1}>{section.content}</Text>
          </View>
          <View style={st.langActions}>
            <TouchableOpacity onPress={() => { setCustomTitle(section.title); setCustomContent(section.content); }} style={st.editBtn}>
              <Text style={st.editBtnEmoji}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => void persist({ ...resume, customSections: resume.customSections?.filter((item) => item.id !== section.id) })} style={st.deleteBtn}>
              <Text style={st.deleteBtnEmoji}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add/edit section form */}
      {customTitle !== undefined && customTitle !== '' && (
        <View style={st.formCard}>
          <Text style={st.formCardTitle}>{customTitle}</Text>
          <TextInput value={customContent} onChangeText={setCustomContent}
            placeholder="Add details..." placeholderTextColor="#94A3B8"
            multiline numberOfLines={4}
            style={st.textArea} />
          <TouchableOpacity style={st.primaryCta} onPress={() => {
            if (!customTitle.trim() || !customContent.trim()) return;
            void persist({ ...resume, customSections: [...(resume.customSections || []), { id: `custom_${Date.now()}`, title: customTitle.trim(), content: customContent.trim() }] });
            setCustomTitle(''); setCustomContent('');
          }}>
            <Text style={st.primaryCtaText}>Add Section</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Continue */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => void saveAndBack()} style={st.saveContinue}>
        <Text style={st.saveContinueText}>Continue  →</Text>
      </TouchableOpacity>
    </View>
  );

  // ════════════════════════════════════════════════
  // INTERESTS
  // ════════════════════════════════════════════════
  const renderInterests = () => (
    <View>
      {/* Existing interest chips */}
      {(resume.interests || []).length > 0 && (
        <View style={st.interestChipWrap}>
          {(resume.interests || []).map((interest) => (
            <TouchableOpacity key={interest} activeOpacity={0.7}
              onPress={() => void persist({ ...resume, interests: resume.interests?.filter((item) => item !== interest) })}
              style={st.interestChip}>
              <Text style={st.interestChipText}>{interest}</Text>
              <Text style={st.interestChipX}>  ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Add interest form */}
      <View style={st.formCard}>
        <Text style={st.formCardTitle}>Add an interest</Text>
        <TextInput value={newInterest} onChangeText={setNewInterest}
          placeholder="e.g. Photography, volunteering, chess" placeholderTextColor="#94A3B8"
          style={st.field} />
        <TouchableOpacity style={st.primaryCta} onPress={() => {
          const interest = newInterest.trim();
          if (!interest || resume.interests?.some((item) => item.toLowerCase() === interest.toLowerCase())) return;
          void persist({ ...resume, interests: [...(resume.interests || []), interest] });
          setNewInterest('');
        }}>
          <Text style={st.primaryCtaText}>Add Interest</Text>
        </TouchableOpacity>
      </View>

      {/* Save & Continue */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => void saveAndBack()} style={st.saveContinue}>
        <Text style={st.saveContinueText}>Save & Continue  →</Text>
      </TouchableOpacity>
    </View>
  );

  // ════════════════════════════════════════════════
  // SCREEN 18 — REORDER SECTIONS
  // ════════════════════════════════════════════════
  const renderReorder = () => (
    <View>
      {order.map((section, index) => {
        const hasData = section === 'personalInfo' ? Boolean(resume.personalInfo.fullName) :
          section === 'summary' ? Boolean(resume.personalInfo.summary) :
            section === 'workExperience' ? Boolean(resume.experience?.length) :
              section === 'education' ? Boolean(resume.education?.length) :
                section === 'skills' ? Boolean(resume.skillCategories?.some(c => c.skills.length)) :
                  section === 'projects' ? Boolean(resume.projects?.length) :
                    section === 'certifications' ? Boolean(resume.certifications?.length) :
                      section === 'achievements' ? Boolean(resume.achievements?.length) :
                        section === 'languages' ? Boolean(resume.languages?.length) :
                          Boolean(resume.interests?.length);
        return (
          <View key={section} style={st.reorderRow}>
            {/* Drag handle */}
            <Text style={st.dragHandle}>⁝⁝</Text>

            {/* Completion checkmark */}
            <View style={[st.reorderCheck, hasData && st.reorderCheckDone]}>
              {hasData && <Text style={st.reorderCheckText}>✓</Text>}
            </View>

            {/* Section name */}
            <Text style={st.reorderLabel}>{LABELS[section]}</Text>

            {/* Up/Down */}
            <View style={st.reorderActions}>
              <TouchableOpacity onPress={() => moveSection(index, -1)} style={st.reorderArrowBtn}>
                <Text style={st.reorderArrow}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveSection(index, 1)} style={st.reorderArrowBtn}>
                <Text style={st.reorderArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Info box */}
      <View style={st.reorderInfo}>
        <Text style={st.reorderInfoIcon}>ⓘ</Text>
        <Text style={st.reorderInfoText}>Your resume will use this order.</Text>
      </View>

      {/* Save Order CTA */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => void saveAndBack({ ...resume, sectionOrder: order })} style={st.saveContinue}>
        <Text style={st.saveContinueText}>Save Order  →</Text>
      </TouchableOpacity>
    </View>
  );

  // ════════════════════════════════════════════════
  // SCREEN 19 — CUSTOMIZE TEMPLATE
  // ════════════════════════════════════════════════
  const renderCustomize = () => (
    <View>
      {/* Mini resume preview */}
      <View style={st.previewCard}>
        {/* Accent left bar */}
        <View style={[st.previewAccent, { backgroundColor: selectedColor }]} />

        {/* Avatar + name */}
        <View style={st.previewHeader}>
          <ResumeAvatar photoUri={resume.personalInfo.photoUri} name={resume.personalInfo.fullName} size={54} />
          <View style={st.previewHeaderText}>
            <Text style={st.previewName}>{resume.personalInfo.fullName || 'Rahul Kumar'}</Text>
            <Text style={st.previewRole}>{resume.personalInfo.jobTitle || 'Frontend Developer'}</Text>
          </View>
        </View>

        {/* Section label */}
        <View style={[st.previewSectionBar, { backgroundColor: selectedColor + '15' }]}>
          <Text style={[st.previewSectionLabel, { color: selectedColor }]}>Professional Summary</Text>
        </View>

        {/* Skeleton lines */}
        <View style={st.previewLines}>
          <View style={st.lineWide} />
          <View style={st.lineShort} />
          <View style={st.lineMedium} />
        </View>

        {/* Two-column skeleton */}
        <View style={st.previewTwoCol}>
          <View style={{ flex: 1 }}>
            <Text style={[st.previewSmallLabel, { color: selectedColor }]}>Experience</Text>
            <View style={[st.lineShort, { marginTop: 4 }]} />
            <View style={[st.lineWide, { marginTop: 3 }]} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[st.previewSmallLabel, { color: selectedColor }]}>Skills</Text>
            <View style={st.previewSkillChips}>
              {['React', 'JS', 'HTML', 'CSS'].map((s) => (
                <View key={s} style={[st.previewChip, { borderColor: selectedColor + '40' }]}>
                  <Text style={[st.previewChipText, { color: selectedColor }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ── Color ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Color</Text>
        <View style={st.colorRow}>
          {COLOR_OPTIONS.map((c) => (
            <TouchableOpacity key={c.name} onPress={() => setSelectedColor(c.value)}
              style={[st.colorDot, { backgroundColor: c.value, borderWidth: selectedColor === c.value ? 3 : 0, borderColor: '#FFFFFF' }]}>
              {selectedColor === c.value && <Text style={st.colorCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={st.colorLabelRow}>
          {COLOR_OPTIONS.map((c) => (
            <Text key={c.name} style={[st.colorLabel, selectedColor === c.value && { color: c.value, fontWeight: '800' }]}>{c.name}</Text>
          ))}
        </View>
      </View>

      {/* ── Typography ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Typography</Text>
        <View style={st.optionRow}>
          {['Modern', 'Classic', 'Professional'].map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setSelectedTypography(opt)}
              style={[st.optionPill, selectedTypography === opt && st.optionPillActive]}>
              <Text style={[st.optionPillText, selectedTypography === opt && st.optionPillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Font Size ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Font Size</Text>
        <View style={st.fontSizeRow}>
          <TouchableOpacity style={st.fontSizeBtn} onPress={() => setSelectedSpacing('compact')}>
            <Text style={st.fontSizeBtnText}>−</Text>
          </TouchableOpacity>
          <View style={st.fontSizeDisplay}>
            <Text style={st.fontSizeDisplayText}>A</Text>
          </View>
          <TouchableOpacity style={st.fontSizeBtn} onPress={() => setSelectedSpacing('relaxed')}>
            <Text style={st.fontSizeBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Spacing ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Spacing</Text>
        <View style={st.optionRow}>
          {[{ key: 'compact', label: 'Compact' }, { key: 'standard', label: 'Comfortable' }, { key: 'relaxed', label: 'Spacious' }].map((opt) => (
            <TouchableOpacity key={opt.key} onPress={() => setSelectedSpacing(opt.key as any)}
              style={[st.optionPill, selectedSpacing === opt.key && st.optionPillActive]}>
              <Text style={[st.optionPillText, selectedSpacing === opt.key && st.optionPillTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Photo Shape ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Photo Shape</Text>
        <View style={st.optionRow}>
          {['Circle', 'Square', 'Rounded Square'].map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setSelectedPhotoShape(opt)}
              style={[st.optionPill, selectedPhotoShape === opt && st.optionPillActive]}>
              <Text style={[st.optionPillText, selectedPhotoShape === opt && st.optionPillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Section Style ── */}
      <View style={st.settingGroup}>
        <Text style={st.settingLabel}>Section Style</Text>
        <View style={st.optionRow}>
          {['Modern', 'Classic', 'Minimal'].map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setSelectedSectionStyle(opt)}
              style={[st.optionPill, selectedSectionStyle === opt && st.optionPillActive]}>
              <Text style={[st.optionPillText, selectedSectionStyle === opt && st.optionPillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Apply Changes */}
      <TouchableOpacity activeOpacity={0.85}
        onPress={() => void saveAndBack({ ...resume, accentColor: selectedColor, fontSize: selectedSpacing as any })}
        style={st.saveContinue}>
        <Text style={st.saveContinueText}>Apply Changes</Text>
      </TouchableOpacity>

      {/* Reset to Default */}
      <TouchableOpacity style={st.resetBtn}
        onPress={() => { setSelectedColor('#2563EB'); setSelectedTypography('Modern'); setSelectedSpacing('standard'); setSelectedPhotoShape('Circle'); setSelectedSectionStyle('Modern'); }}>
        <Text style={st.resetBtnText}>Reset to Default</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader title={title} subtitle={subtitle} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        {mode === 'languages' ? renderLanguages() : mode === 'interests' ? renderInterests() : mode === 'additional' ? renderAdditional() : mode === 'reorder' ? renderReorder() : renderCustomize()}
      </ScrollView>
      <ResumeBottomNav
        active="home"
        onNavigate={(tab) => navigation?.navigate('MainTabs', { initialTab: tab })}
      />
    </ScreenContainer>
  );
};

// ═════════════════════════════════════════════
// STYLES — Light reference-accurate design
// ═════════════════════════════════════════════
const st = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },

  // ── Shared form elements ──
  formCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 14,
  },
  formCardTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 6, marginTop: 12 },
  field: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    minHeight: 90,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  dropdownInput: { flex: 1, fontSize: 14, color: '#1E293B' },
  dropdownArrow: { color: '#94A3B8', fontSize: 16 },
  formBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C7D5EC',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  // ── Add entry button (dashed) ──
  addEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7D5EC',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 14,
    backgroundColor: '#FAFBFE',
  },
  addEntryIcon: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginRight: 6 },
  addEntryText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  // ── Primary CTA (inline) ──
  primaryCta: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryCtaText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  // ── Save & Continue CTA ──
  saveContinue: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  saveContinueText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // ══════════════════════════════
  // SCREEN 16 — LANGUAGES
  // ══════════════════════════════
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
  },
  langFlag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langFlagInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  langName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  langProf: { fontSize: 12, color: '#64748B', marginTop: 2 },
  langActions: { flexDirection: 'row', gap: 6 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnEmoji: { fontSize: 14 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnEmoji: { fontSize: 14 },

  // Info note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    gap: 8,
  },
  infoIcon: { color: '#2563EB', fontSize: 14 },
  infoText: { flex: 1, color: '#475569', fontSize: 12, lineHeight: 17 },

  // ══════════════════════════════
  // SCREEN 17 — ADDITIONAL SECTIONS
  // ══════════════════════════════
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: '48%',
    minHeight: 104,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  tileActive: { borderColor: '#8B5CF6', borderWidth: 2 },
  tileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tileIcon: { fontSize: 20 },
  tileLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  tileCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileCheckmarkText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },

  customSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  customSectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customSectionIcon: { color: '#8B5CF6', fontSize: 18, fontWeight: '700' },
  customSectionText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },

  customEntryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginTop: 10,
  },
  customEntryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customEntryIcon: { fontSize: 18 },
  customEntryTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  customEntrySub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  // ── Interests ──
  interestChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  interestChipText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  interestChipX: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  // ══════════════════════════════
  // SCREEN 18 — REORDER SECTIONS
  // ══════════════════════════════
  reorderRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  dragHandle: { fontSize: 18, color: '#94A3B8', marginRight: 12, fontWeight: '900' },
  reorderCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reorderCheckDone: { backgroundColor: '#10B981', borderColor: '#10B981' },
  reorderCheckText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  reorderLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1E293B' },
  reorderActions: { flexDirection: 'row', gap: 8 },
  reorderArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderArrow: { color: '#2563EB', fontSize: 10, fontWeight: '900' },
  reorderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 13,
    marginTop: 8,
    gap: 8,
  },
  reorderInfoIcon: { color: '#4F46E5', fontSize: 14 },
  reorderInfoText: { color: '#4F46E5', fontSize: 12, fontWeight: '600' },

  // ══════════════════════════════
  // SCREEN 19 — CUSTOMIZE TEMPLATE
  // ══════════════════════════════
  previewCard: {
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  previewAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  previewHeaderText: { marginLeft: 12 },
  previewName: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  previewRole: { fontSize: 12, color: '#64748B', marginTop: 2 },
  previewSectionBar: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  previewSectionLabel: { fontSize: 11, fontWeight: '800' },
  previewLines: { marginTop: 10, marginLeft: 8, gap: 5 },
  lineWide: { height: 4, width: '90%', backgroundColor: '#E2E8F0', borderRadius: 2 },
  lineShort: { height: 4, width: '55%', backgroundColor: '#E2E8F0', borderRadius: 2 },
  lineMedium: { height: 4, width: '72%', backgroundColor: '#E2E8F0', borderRadius: 2 },
  previewTwoCol: { flexDirection: 'row', marginTop: 12, marginLeft: 8 },
  previewSmallLabel: { fontSize: 10, fontWeight: '800' },
  previewSkillChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  previewChip: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  previewChipText: { fontSize: 8, fontWeight: '700' },

  // ── Color selector ──
  settingGroup: { marginTop: 20 },
  settingLabel: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
  colorRow: { flexDirection: 'row', gap: 16, justifyContent: 'flex-start' },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  colorCheck: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  colorLabelRow: { flexDirection: 'row', gap: 16, marginTop: 6 },
  colorLabel: { width: 36, textAlign: 'center', fontSize: 10, color: '#64748B', fontWeight: '600' },

  // ── Option pills ──
  optionRow: { flexDirection: 'row', gap: 8 },
  optionPill: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D6E2F7',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionPillActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optionPillText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  optionPillTextActive: { color: '#4F46E5' },

  // ── Font size control ──
  fontSizeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  fontSizeBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D6E2F7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  fontSizeBtnText: { fontSize: 18, color: '#64748B', fontWeight: '700' },
  fontSizeDisplay: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },
  fontSizeDisplayText: { fontSize: 22, color: '#4F46E5', fontWeight: '800' },

  // ── Reset button ──
  resetBtn: {
    borderWidth: 1.5,
    borderColor: '#A5B4FC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  resetBtnText: { color: '#4F46E5', fontSize: 14, fontWeight: '800' },
});
