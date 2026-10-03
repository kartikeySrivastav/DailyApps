/**
 * SectionEditorModal — Screens 10–15 (Reference-accurate rewrite)
 *
 * 10  Education List
 * 11  Add / Edit Education form
 * 12  Skills — chips, proficiency bars, suggested skills
 * 13  Projects — coloured-icon cards, tech chips, add/edit form
 * 14  Certifications — brand-initial cards, add form
 * 15  Achievements — trophy/medal cards, add form
 *
 * Also keeps the earlier personalInfo / summary / workExperience sections
 * for backward compatibility with ResumeBuilderScreen.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { ScreenContainer, Input, Card } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { ScreenHeader } from './ScreenHeader';
import {
  ResumeProfile,
  EducationItem,
} from '../types/resume.types';
import { ResumeAvatar } from './ResumeAvatar';
import { PhotoUploadModal } from './PhotoUploadModal';


// ── Types ──
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface Props {
  visible: boolean;
  sectionId: string | null;
  sectionLabel: string;
  resume: ResumeProfile;
  onUpdate: (updated: ResumeProfile) => void;
  onClose: () => void;
  onSaveAndContinue: () => void;
}

const SUGGESTED_SKILLS = ['TypeScript', 'Node.js', 'UI/UX', 'Communication'];

// Colors for project icons
const PROJECT_COLORS = ['#EF4444', '#8B5CF6', '#0EA5E9', '#F59E0B', '#10B981', '#EC4899'];
const PROJECT_ICONS = ['📱', '💻', '</>', '🎨', '🔧', '📊'];

// Achievement icons
const ACHIEVEMENT_ICONS = ['🏆', '⭐', '🏅', '🎖️', '🥇', '🌟'];
const ACHIEVEMENT_COLORS = ['#F59E0B', '#8B5CF6', '#0EA5E9', '#10B981', '#EF4444', '#EC4899'];

export const SectionEditorModal: React.FC<Props> = ({
  visible, sectionId, sectionLabel, resume, onUpdate, onClose, onSaveAndContinue,
}) => {
  useTheme();

  // ── Education ──
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');
  const [eduGrade, setEduGrade] = useState('');
  const [eduDesc, setEduDesc] = useState('');
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);

  // ── Skills ──
  const [newSkill, setNewSkill] = useState('');
  const [skillLevels, setSkillLevels] = useState<Record<string, SkillLevel>>({});

  // ── Projects ──
  const [projTitle, setProjTitle] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);

  // ── Certifications ──
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('');
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);

  // ── Work Experience ──
  const [expCompany, setExpCompany] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // ── Achievements ──
  const [achTitle, setAchTitle] = useState('');
  const [achOrg, setAchOrg] = useState('');
  const [achYear, setAchYear] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [editingAchIndex, setEditingAchIndex] = useState<number | null>(null);

  // ── Photo ──
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // ════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════

  const resetEdu = () => {
    setEduDegree(''); setEduInstitution(''); setEduField('');
    setEduStart(''); setEduEnd(''); setEduGrade(''); setEduDesc('');
    setEditingEducationIndex(null);
  };

  const openEducationEditor = (education?: EducationItem, index?: number) => {
    setEduDegree(education?.degree || '');
    setEduInstitution(education?.institution || '');
    setEduField(education?.location || '');
    setEduStart(education?.startDate || '');
    setEduEnd(education?.endDate || '');
    setEduGrade(education?.scoreOrGpa || '');
    setEditingEducationIndex(index ?? null);
    setShowAddEdu(true);
  };

  const resetProject = () => {
    setProjTitle(''); setProjTech(''); setProjDesc('');
    setEditingProjectIndex(null);
  };

  const openProjectEditor = (proj?: { title: string; techStack: string; description: string }, index?: number) => {
    setProjTitle(proj?.title || '');
    setProjTech(proj?.techStack || '');
    setProjDesc(proj?.description || '');
    setEditingProjectIndex(index ?? null);
    setShowProjectForm(true);
  };

  const resetCert = () => {
    setCertName(''); setCertIssuer(''); setCertYear('');
    setEditingCertIndex(null);
  };

  const openCertEditor = (cert?: { name: string; issuer: string; year: string }, index?: number) => {
    setCertName(cert?.name || '');
    setCertIssuer(cert?.issuer || '');
    setCertYear(cert?.year || '');
    setEditingCertIndex(index ?? null);
    setShowCertificationForm(true);
  };

  const resetAch = () => {
    setAchTitle(''); setAchOrg(''); setAchYear(''); setAchDesc('');
    setEditingAchIndex(null);
  };

  const openAchEditor = (ach?: { title: string; organization?: string; year: string; description?: string }, index?: number) => {
    setAchTitle(ach?.title || '');
    setAchOrg(ach?.organization || '');
    setAchYear(ach?.year || '');
    setAchDesc(ach?.description || '');
    setEditingAchIndex(index ?? null);
    setShowAchievementForm(true);
  };

  const getSub = () => {
    const m: Record<string, string> = {
      education: 'Add your educational qualifications',
      skills: 'Add skills relevant to your career',
      projects: 'Showcase your important projects',
      certifications: 'Add relevant certifications',
      workExperience: 'Add your work history',
      personalInfo: 'Your personal information',
      summary: 'A brief professional summary',
      achievements: 'Highlight your accomplishments',
    };
    return m[sectionId || ''] || 'Fill in the details below';
  };

  const cycleLevel = (skill: string) => {
    const levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
    const current = skillLevels[skill] || 'Intermediate';
    const next = levels[(levels.indexOf(current) + 1) % 3];
    setSkillLevels({ ...skillLevels, [skill]: next });
  };

  const getLevelColor = (level: SkillLevel) => {
    if (level === 'Advanced') return '#2563EB';
    if (level === 'Intermediate') return '#8B5CF6';
    return '#94A3B8';
  };

  const getLevelWidth = (level: SkillLevel) => {
    if (level === 'Advanced') return '85%';
    if (level === 'Intermediate') return '55%';
    return '30%';
  };

  const getCertBrandColor = (issuer: string) => {
    const brandColors: Record<string, string> = {
      google: '#4285F4', amazon: '#FF9900', microsoft: '#0078D4',
      meta: '#0866FF', coursera: '#0056D2', udemy: '#A435F0',
      freecodecamp: '#0A0A23', online: '#F59E0B', aws: '#FF9900',
      adobe: '#FF0000', apple: '#555555', ibm: '#0530AD',
    };
    const key = (issuer || '').toLowerCase().split(' ')[0];
    return brandColors[key] || '#2563EB';
  };

  // ════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════
  return (
    <Modal visible={visible} animationType="slide">
      <ScreenContainer scrollable={false} withPadding={false}>
        <ScreenHeader
          title={
            sectionId === 'education' && showAddEdu
              ? (editingEducationIndex === null ? 'Add Education' : 'Edit Education')
              : sectionId === 'projects' && showProjectForm
                ? (editingProjectIndex === null ? 'Add Project' : 'Edit Project')
                : sectionId === 'certifications' && showCertificationForm
                  ? (editingCertIndex === null ? 'Add Certification' : 'Edit Certification')
                  : sectionId === 'achievements' && showAchievementForm
                    ? (editingAchIndex === null ? 'Add Achievement' : 'Edit Achievement')
                    : sectionLabel
          }
          subtitle={
            sectionId === 'education' && showAddEdu ? 'Add your qualification details'
              : sectionId === 'projects' && showProjectForm ? 'Add project details'
                : sectionId === 'certifications' && showCertificationForm ? 'Add certification details'
                  : sectionId === 'achievements' && showAchievementForm ? 'Add achievement details'
                    : getSub()
          }
          onBack={() => {
            if (sectionId === 'education' && showAddEdu) { setShowAddEdu(false); resetEdu(); return; }
            if (sectionId === 'projects' && showProjectForm) { setShowProjectForm(false); resetProject(); return; }
            if (sectionId === 'certifications' && showCertificationForm) { setShowCertificationForm(false); resetCert(); return; }
            if (sectionId === 'achievements' && showAchievementForm) { setShowAchievementForm(false); resetAch(); return; }
            onClose();
          }}
        />

        <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 10 — EDUCATION LIST                 */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'education' && !showAddEdu && (
            <View>
              {/* Step indicator */}
              <View style={st.stepIndicator}>
                <View style={st.stepDotActive} />
                <View style={st.stepLine} />
                <View style={st.stepDot} />
              </View>

              {(resume.education || []).map((edu, idx) => (
                <View key={edu.id} style={st.eduCard}>
                  {/* Graduation cap icon */}
                  <View style={st.eduIconBox}>
                    <Text style={st.eduIconText}>🎓</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={st.eduTitle} numberOfLines={2}>
                      {edu.degree || 'Degree'}
                    </Text>
                    <Text style={st.eduSub}>
                      {edu.institution || 'Institution'}
                    </Text>
                    <Text style={st.eduDate}>
                      {edu.startDate || ''}{edu.endDate ? ` – ${edu.endDate}` : ''}
                    </Text>
                  </View>
                  {/* Edit + Delete */}
                  <View style={st.cardActions}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => openEducationEditor(edu, idx)} style={st.editBtn}>
                      <Text style={st.editBtnText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}
                      onPress={() => Alert.alert('Delete', 'Remove this education?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => onUpdate({ ...resume, education: resume.education?.filter((_, i) => i !== idx) }) },
                      ])}
                      style={st.deleteBtn}>
                      <Text style={st.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* + Add Education button */}
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => openEducationEditor()}
                style={st.addEntryBtn}>
                <Text style={st.addEntryIcon}>+</Text>
                <Text style={st.addEntryText}>Add Education</Text>
              </TouchableOpacity>

              {/* Save & Continue */}
              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 11 — ADD EDUCATION FORM              */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'education' && showAddEdu && (
            <View>
              {/* Avatar at top */}
              <View style={st.avatarRow}>
                <ResumeAvatar
                  photoUri={resume.personalInfo.photoUri}
                  name={resume.personalInfo.fullName}
                  size={72}
                />
              </View>

              <View style={st.formCard}>
                {/* Degree / Qualification */}
                <Text style={st.label}>Degree / Qualification *</Text>
                <View style={st.dropdown}>
                  <TextInput style={st.dropdownInput}
                    placeholder="Bachelor of Computer Applications"
                    placeholderTextColor="#94A3B8"
                    value={eduDegree} onChangeText={setEduDegree} />
                  <Text style={st.dropdownArrow}>▾</Text>
                </View>

                {/* Institution */}
                <Text style={st.label}>Institution *</Text>
                <TextInput style={st.field}
                  placeholder="ABC University" placeholderTextColor="#94A3B8"
                  value={eduInstitution} onChangeText={setEduInstitution} />

                {/* Field of Study */}
                <Text style={st.label}>Field of Study *</Text>
                <TextInput style={st.field}
                  placeholder="Computer Applications" placeholderTextColor="#94A3B8"
                  value={eduField} onChangeText={setEduField} />

                {/* Start Year / End Year side by side with calendar icon */}
                <View style={st.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={st.label}>Start Year *</Text>
                    <View style={st.fieldWithIcon}>
                      <TextInput style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
                        placeholder="2021" placeholderTextColor="#94A3B8"
                        keyboardType="number-pad" value={eduStart} onChangeText={setEduStart} />
                      <Text style={st.calendarIcon}>📅</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.label}>End Year *</Text>
                    <View style={st.fieldWithIcon}>
                      <TextInput style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
                        placeholder="2024" placeholderTextColor="#94A3B8"
                        keyboardType="number-pad" value={eduEnd} onChangeText={setEduEnd} />
                      <Text style={st.calendarIcon}>📅</Text>
                    </View>
                  </View>
                </View>

                {/* Grade */}
                <Text style={st.label}>Grade / Percentage *</Text>
                <TextInput style={st.field}
                  placeholder="78%" placeholderTextColor="#94A3B8"
                  value={eduGrade} onChangeText={setEduGrade} />

                {/* Description with char count */}
                <Text style={st.label}>Description (Optional)</Text>
                <View>
                  <TextInput style={st.textArea}
                    placeholder="Add details about your education..."
                    placeholderTextColor="#94A3B8"
                    multiline numberOfLines={4}
                    maxLength={500}
                    value={eduDesc} onChangeText={setEduDesc} />
                  <Text style={st.charCount}>
                    {eduDesc.length} / 500
                  </Text>
                </View>
              </View>

              {/* Cancel + Save Education buttons */}
              <View style={st.formBtns}>
                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => { resetEdu(); setShowAddEdu(false); }}
                  style={st.cancelBtn}>
                  <Text style={st.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (!eduDegree || !eduInstitution || !eduField || !eduStart || !eduEnd || !eduGrade) {
                      Alert.alert('Required', 'Complete degree, institution, field, dates, and grade before saving.'); return;
                    }
                    const newEdu: EducationItem = {
                      id: editingEducationIndex !== null ? (resume.education?.[editingEducationIndex]?.id || 'edu_' + Date.now()) : 'edu_' + Date.now(),
                      degree: eduDegree,
                      institution: eduInstitution, location: eduField,
                      startDate: eduStart, endDate: eduEnd, scoreOrGpa: eduGrade,
                    };
                    onUpdate({ ...resume, education: editingEducationIndex === null ? [...(resume.education || []), newEdu] : (resume.education || []).map((item, index) => index === editingEducationIndex ? newEdu : item) });
                    resetEdu(); setShowAddEdu(false);
                  }}
                  style={st.saveEntryBtn}>
                  <Text style={st.saveEntryText}>Save Education</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 12 — SKILLS                         */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'skills' && (
            <View style={{ gap: 14 }}>
              {/* Selected Skills chips */}
              {(resume.skillCategories?.[0]?.skills?.length || 0) > 0 && (
                <View style={st.sectionCard}>
                  <Text style={st.sectionTitle}>Selected Skills</Text>
                  <View style={st.chipWrap}>
                    {(resume.skillCategories?.[0]?.skills || []).map((skill, idx) => (
                      <TouchableOpacity key={idx} activeOpacity={0.7}
                        onPress={() => {
                          const updated = (resume.skillCategories?.[0]?.skills || []).filter((_, i) => i !== idx);
                          onUpdate({ ...resume, skillCategories: [{ id: 'cat_1', categoryName: 'Core Skills', skills: updated }] });
                        }}
                        style={st.skillChip}>
                        <Text style={st.skillChipText}>{skill}</Text>
                        <Text style={st.skillChipX}>  ✕</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Add skill input + button */}
              <View style={st.sectionCard}>
                <View style={st.skillInputRow}>
                  <Text style={{ fontSize: 16, marginRight: 8, color: '#94A3B8' }}>📋</Text>
                  <TextInput style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
                    placeholder="Type a skill..." placeholderTextColor="#94A3B8"
                    value={newSkill} onChangeText={setNewSkill}
                    onSubmitEditing={() => {
                      if (newSkill.trim()) {
                        const updated = [...(resume.skillCategories?.[0]?.skills || []), newSkill.trim()];
                        onUpdate({ ...resume, skillCategories: [{ id: 'cat_1', categoryName: 'Core Skills', skills: updated }] });
                        setNewSkill('');
                      }
                    }} />
                </View>
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (newSkill.trim()) {
                      const updated = [...(resume.skillCategories?.[0]?.skills || []), newSkill.trim()];
                      onUpdate({ ...resume, skillCategories: [{ id: 'cat_1', categoryName: 'Core Skills', skills: updated }] });
                      setNewSkill('');
                    }
                  }}
                  style={st.addSkillBtn}>
                  <Text style={st.addSkillBtnText}>+ Add Skill</Text>
                </TouchableOpacity>
              </View>

              {/* ── Skill Proficiency (Optional) ── */}
              {(resume.skillCategories?.[0]?.skills?.length || 0) > 0 && (
                <View style={st.sectionCard}>
                  <Text style={st.sectionTitle}>Skill Proficiency (Optional)</Text>
                  {(resume.skillCategories?.[0]?.skills || []).map((skill, idx) => {
                    const level = skillLevels[skill] || 'Advanced';
                    const barColor = getLevelColor(level);
                    const barWidth = getLevelWidth(level);
                    return (
                      <View key={idx} style={st.profRow}>
                        <Text style={st.profSkillName}>{skill}</Text>
                        {/* Progress bar */}
                        <View style={st.profBarBg}>
                          <View style={[st.profBarFill, { width: barWidth as any, backgroundColor: barColor }]} />
                        </View>
                        {/* Level selector */}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => cycleLevel(skill)}
                          style={st.profLevelBtn}>
                          <Text style={st.profLevelText}>{level}</Text>
                          <Text style={{ color: '#94A3B8', fontSize: 10, marginLeft: 2 }}>▾</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Suggested Skills */}
              <View style={st.sectionCard}>
                <Text style={st.sectionTitle}>Suggested Skills</Text>
                <View style={st.chipWrap}>
                  {SUGGESTED_SKILLS.map((sk) => {
                    const already = (resume.skillCategories?.[0]?.skills || []).includes(sk);
                    return (
                      <TouchableOpacity key={sk} activeOpacity={0.7} disabled={already}
                        onPress={() => {
                          if (!already) {
                            const updated = [...(resume.skillCategories?.[0]?.skills || []), sk];
                            onUpdate({ ...resume, skillCategories: [{ id: 'cat_1', categoryName: 'Core Skills', skills: updated }] });
                          }
                        }}
                        style={[st.suggestChip, {
                          borderColor: already ? '#10B981' : '#D6E2F7',
                          backgroundColor: already ? '#F0FDF4' : '#F8FAFC',
                        }]}>
                        <Text style={[st.suggestChipText, { color: already ? '#10B981' : '#475569' }]}>
                          {already ? '✓ ' : ''}{sk}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Save & Continue */}
              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 13 — PROJECTS                       */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'projects' && !showProjectForm && (
            <View>
              {(resume.projects || []).map((proj, idx) => {
                const techs = (proj.techStack || '').split(',').map(t => t.trim()).filter(Boolean);
                const color = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                const icon = PROJECT_ICONS[idx % PROJECT_ICONS.length];
                return (
                  <View key={proj.id} style={st.projCard}>
                    {/* Color icon */}
                    <View style={[st.projIconBox, { backgroundColor: color + '18' }]}>
                      <Text style={[st.projIconEmoji, { color }]}>{icon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={st.projTitle}>{proj.title || 'Project'}</Text>
                      {proj.description ? (
                        <Text style={st.projSub} numberOfLines={2}>{proj.description}</Text>
                      ) : null}
                      {/* Tech chips */}
                      {techs.length > 0 && (
                        <View style={{ marginTop: 8 }}>
                          <Text style={st.projTechLabel}>Technologies:</Text>
                          <View style={[st.chipWrap, { marginTop: 4 }]}>
                            {techs.slice(0, 5).map((t, ti) => (
                              <View key={ti} style={st.techChip}>
                                <Text style={st.techChipText}>{t}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {proj.description ? (
                        <View style={{ marginTop: 6 }}>
                          <Text style={st.projDescLabel}>Description:</Text>
                          <Text style={st.projDescText} numberOfLines={2}>
                            {proj.description}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    {/* Edit + Delete */}
                    <View style={st.cardActions}>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => openProjectEditor(proj, idx)} style={st.editBtn}>
                        <Text style={st.editBtnText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7}
                        onPress={() => Alert.alert('Delete', 'Remove this project?', [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => onUpdate({ ...resume, projects: resume.projects?.filter((_, i) => i !== idx) }) },
                        ])}
                        style={st.deleteBtn}>
                        <Text style={st.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* + Add Project */}
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => openProjectEditor()}
                style={st.addEntryBtn}>
                <Text style={st.addEntryIcon}>+</Text>
                <Text style={st.addEntryText}>Add Project</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Add / Edit Project Form ── */}
          {sectionId === 'projects' && showProjectForm && (
            <View>
              <View style={st.formCard}>
                <Text style={st.label}>Project Name *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. ProResume Builder" placeholderTextColor="#94A3B8"
                  value={projTitle} onChangeText={setProjTitle} />

                <Text style={st.label}>Technologies (comma-separated)</Text>
                <TextInput style={st.field}
                  placeholder="e.g. React, Android, PDF" placeholderTextColor="#94A3B8"
                  value={projTech} onChangeText={setProjTech} />

                <Text style={st.label}>Description</Text>
                <TextInput style={st.textArea}
                  placeholder="All-in-one resume and biodata creation application."
                  placeholderTextColor="#94A3B8"
                  multiline numberOfLines={3} value={projDesc} onChangeText={setProjDesc} />
              </View>

              <View style={st.formBtns}>
                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => { resetProject(); setShowProjectForm(false); }}
                  style={st.cancelBtn}>
                  <Text style={st.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (!projTitle) { Alert.alert('Required', 'Enter project name.'); return; }
                    const newProj = { id: editingProjectIndex !== null ? (resume.projects?.[editingProjectIndex]?.id || 'proj_' + Date.now()) : 'proj_' + Date.now(), title: projTitle, techStack: projTech, description: projDesc };
                    if (editingProjectIndex !== null) {
                      onUpdate({ ...resume, projects: (resume.projects || []).map((item, i) => i === editingProjectIndex ? newProj : item) });
                    } else {
                      onUpdate({ ...resume, projects: [...(resume.projects || []), newProj] });
                    }
                    resetProject(); setShowProjectForm(false);
                  }}
                  style={st.saveEntryBtn}>
                  <Text style={st.saveEntryText}>{editingProjectIndex !== null ? 'Save Project' : '+ Add Project'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 14 — CERTIFICATIONS                 */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'certifications' && !showCertificationForm && (
            <View>
              {(resume.certifications || []).map((cert, idx) => {
                const accent = getCertBrandColor(cert.issuer);
                return (
                  <View key={cert.id} style={st.certCard}>
                    <View style={[st.certIconBox, { backgroundColor: accent + '15' }]}>
                      <Text style={[st.certInitial, { color: accent }]}>
                        {(cert.issuer || 'C').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={st.certTitle}>{cert.name || 'Certification'}</Text>
                      <Text style={st.certIssuer}>{cert.issuer || 'Issuer'}</Text>
                      {cert.year ? <Text style={st.certYear}>{cert.year}</Text> : null}
                    </View>
                    {/* Edit + Delete */}
                    <View style={st.cardActions}>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => openCertEditor(cert, idx)} style={st.editBtn}>
                        <Text style={st.editBtnText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7}
                        onPress={() => Alert.alert('Delete', 'Remove this certification?', [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => onUpdate({ ...resume, certifications: resume.certifications?.filter((_, i) => i !== idx) }) },
                        ])}
                        style={st.deleteBtn}>
                        <Text style={st.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* + Add Certification */}
              <TouchableOpacity activeOpacity={0.8} onPress={() => openCertEditor()}
                style={st.addEntryBtn}>
                <Text style={st.addEntryIcon}>+</Text>
                <Text style={st.addEntryText}>Add Certification</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Add / Edit Certification Form ── */}
          {sectionId === 'certifications' && showCertificationForm && (
            <View>
              <View style={st.formCard}>
                <Text style={st.label}>Certification Title *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. Google UX Design Certificate" placeholderTextColor="#94A3B8"
                  value={certName} onChangeText={setCertName} />

                <Text style={st.label}>Issuing Organization *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. Google" placeholderTextColor="#94A3B8"
                  value={certIssuer} onChangeText={setCertIssuer} />

                <Text style={st.label}>Year</Text>
                <TextInput style={st.field}
                  placeholder="e.g. 2024" placeholderTextColor="#94A3B8"
                  keyboardType="number-pad" value={certYear} onChangeText={setCertYear} />
              </View>

              <View style={st.formBtns}>
                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => { resetCert(); setShowCertificationForm(false); }}
                  style={st.cancelBtn}>
                  <Text style={st.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (!certName || !certIssuer) { Alert.alert('Required', 'Enter title and issuer.'); return; }
                    const newCert = { id: editingCertIndex !== null ? (resume.certifications?.[editingCertIndex]?.id || 'cert_' + Date.now()) : 'cert_' + Date.now(), name: certName, issuer: certIssuer, year: certYear };
                    if (editingCertIndex !== null) {
                      onUpdate({ ...resume, certifications: (resume.certifications || []).map((item, i) => i === editingCertIndex ? newCert : item) });
                    } else {
                      onUpdate({ ...resume, certifications: [...(resume.certifications || []), newCert] });
                    }
                    resetCert(); setShowCertificationForm(false);
                  }}
                  style={st.saveEntryBtn}>
                  <Text style={st.saveEntryText}>{editingCertIndex !== null ? 'Save Certification' : '+ Add Certification'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* SCREEN 15 — ACHIEVEMENTS                   */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'achievements' && !showAchievementForm && (
            <View>
              {(resume.achievements || []).map((ach, idx) => {
                const achColor = ACHIEVEMENT_COLORS[idx % ACHIEVEMENT_COLORS.length];
                const achIcon = ACHIEVEMENT_ICONS[idx % ACHIEVEMENT_ICONS.length];
                return (
                  <View key={ach.id} style={st.achCard}>
                    <View style={[st.achIconBox, { backgroundColor: achColor + '18' }]}>
                      <Text style={st.achIconEmoji}>{achIcon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={st.achTitle}>{ach.title}</Text>
                      {ach.organization ? <Text style={st.achOrg}>{ach.organization}</Text> : null}
                      {ach.year ? <Text style={st.achYear}>{ach.year}</Text> : null}
                    </View>
                    {/* Edit + Delete */}
                    <View style={st.cardActions}>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => openAchEditor(ach, idx)} style={st.editBtn}>
                        <Text style={st.editBtnText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7}
                        onPress={() => Alert.alert('Delete', 'Remove this achievement?', [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => onUpdate({ ...resume, achievements: resume.achievements?.filter((_, i) => i !== idx) }) },
                        ])}
                        style={st.deleteBtn}>
                        <Text style={st.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* + Add Achievement */}
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => openAchEditor()}
                style={st.addEntryBtn}>
                <Text style={st.addEntryIcon}>+</Text>
                <Text style={st.addEntryText}>Add Achievement</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Add / Edit Achievement Form ── */}
          {sectionId === 'achievements' && showAchievementForm && (
            <View>
              <View style={st.formCard}>
                <Text style={st.label}>Achievement Title *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. Employee of the Month" placeholderTextColor="#94A3B8"
                  value={achTitle} onChangeText={setAchTitle} />

                <Text style={st.label}>Organization</Text>
                <TextInput style={st.field}
                  placeholder="e.g. ABC Company" placeholderTextColor="#94A3B8"
                  value={achOrg} onChangeText={setAchOrg} />

                <Text style={st.label}>Year</Text>
                <TextInput style={st.field}
                  placeholder="e.g. 2024" placeholderTextColor="#94A3B8"
                  keyboardType="number-pad" value={achYear} onChangeText={setAchYear} />

                <Text style={st.label}>Description (Optional)</Text>
                <TextInput style={st.textArea}
                  placeholder="Recognized for outstanding project delivery"
                  placeholderTextColor="#94A3B8"
                  multiline numberOfLines={3}
                  maxLength={300}
                  value={achDesc} onChangeText={setAchDesc} />
              </View>

              <View style={st.formBtns}>
                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => { resetAch(); setShowAchievementForm(false); }}
                  style={st.cancelBtn}>
                  <Text style={st.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (!achTitle) { Alert.alert('Required', 'Enter achievement title.'); return; }
                    const newAch = {
                      id: editingAchIndex !== null ? (resume.achievements?.[editingAchIndex]?.id || 'ach_' + Date.now()) : 'ach_' + Date.now(),
                      title: achTitle, organization: achOrg, year: achYear, description: achDesc,
                    };
                    if (editingAchIndex !== null) {
                      onUpdate({ ...resume, achievements: (resume.achievements || []).map((item, i) => i === editingAchIndex ? newAch : item) });
                    } else {
                      onUpdate({ ...resume, achievements: [...(resume.achievements || []), newAch] });
                    }
                    resetAch(); setShowAchievementForm(false);
                  }}
                  style={st.saveEntryBtn}>
                  <Text style={st.saveEntryText}>{editingAchIndex !== null ? 'Save Achievement' : '+ Add Achievement'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* PERSONAL INFO                              */}
          {/* ═══════════════════════════════════════════ */}
          {sectionId === 'personalInfo' && (
            <Card variant="outlined" style={{ marginBottom: 8 }}>
              <View style={st.photoRow}>
                <ResumeAvatar photoUri={resume.personalInfo.photoUri} name={resume.personalInfo.fullName} size={68} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Profile Photo</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPhotoModal(true)}
                    style={st.photoBtn}>
                    <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '700' }}>
                      {resume.personalInfo.photoUri ? '📷 Change Photo' : '📷 Upload Photo'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Input label="Full Name *" placeholder="e.g. Rahul Sharma" value={resume.personalInfo.fullName}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, fullName: v } })} />
              <Input label="Job Title *" placeholder="e.g. Senior Frontend Developer" value={resume.personalInfo.jobTitle}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, jobTitle: v } })} />
              <Input label="Email *" placeholder="rahul@example.com" keyboardType="email-address" value={resume.personalInfo.email}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, email: v } })} />
              <Input label="Phone *" placeholder="+91 98765 43210" keyboardType="phone-pad" value={resume.personalInfo.phone}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, phone: v } })} />
              <Input label="Location" placeholder="e.g. Bengaluru, India" value={resume.personalInfo.location}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, location: v } })} />
              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={[st.saveContinue, { marginTop: 12 }]}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* SUMMARY */}
          {sectionId === 'summary' && (
            <Card variant="outlined" style={{ marginBottom: 8 }}>
              <Input label="Professional Summary" placeholder="Write 2-3 sentences..."
                multiline numberOfLines={6} value={resume.personalInfo.summary}
                onChangeText={(v) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, summary: v } })} />
              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={[st.saveContinue, { marginTop: 12 }]}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* WORK EXPERIENCE */}
          {sectionId === 'workExperience' && (
            <View>
              {(resume.experience || []).map((exp, idx) => (
                <View key={exp.id} style={st.expCard}>
                  <View style={st.expIconBox}>
                    <Text style={{ fontSize: 20 }}>💼</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={st.expTitle}>{exp.jobTitle}</Text>
                    <Text style={st.expSub}>{exp.company}</Text>
                    <Text style={st.expDate}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                  </View>
                  <View style={st.cardActions}>
                    <TouchableOpacity activeOpacity={0.7} style={st.editBtn}>
                      <Text style={st.editBtnText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}
                      onPress={() => Alert.alert('Delete', 'Remove?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => onUpdate({ ...resume, experience: resume.experience?.filter((_, i) => i !== idx) }) },
                      ])}
                      style={st.deleteBtn}>
                      <Text style={st.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={st.formCard}>
                <Text style={st.label}>Company Name *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. Acme Tech" placeholderTextColor="#94A3B8"
                  value={expCompany} onChangeText={setExpCompany} />
                <Text style={st.label}>Job Title *</Text>
                <TextInput style={st.field}
                  placeholder="e.g. Senior Engineer" placeholderTextColor="#94A3B8"
                  value={expTitle} onChangeText={setExpTitle} />
                <View style={st.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={st.label}>Start Year</Text>
                    <TextInput style={st.field}
                      placeholder="2021" placeholderTextColor="#94A3B8"
                      value={expStart} onChangeText={setExpStart} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.label}>End Year</Text>
                    <TextInput style={st.field}
                      placeholder="Present" placeholderTextColor="#94A3B8"
                      value={expEnd} onChangeText={setExpEnd} />
                  </View>
                </View>
                <Text style={st.label}>Key Responsibilities</Text>
                <TextInput style={st.textArea}
                  placeholder="• Led team of 5 engineers" placeholderTextColor="#94A3B8"
                  multiline numberOfLines={4} value={expDesc} onChangeText={setExpDesc} />
                <TouchableOpacity activeOpacity={0.85}
                  onPress={() => {
                    if (!expCompany || !expTitle) { Alert.alert('Required', 'Enter company and title.'); return; }
                    onUpdate({ ...resume, experience: [...(resume.experience || []), { id: 'exp_' + Date.now(), company: expCompany, jobTitle: expTitle, location: '', startDate: expStart, endDate: expEnd, isCurrent: expEnd === 'Present', description: expDesc, highlights: [] }] });
                    setExpCompany(''); setExpTitle(''); setExpStart(''); setExpEnd(''); setExpDesc('');
                  }}
                  style={[st.saveEntryBtn, { marginTop: 12 }]}>
                  <Text style={st.saveEntryText}>+ Add Experience</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={onSaveAndContinue} style={st.saveContinue}>
                <Text style={st.saveContinueText}>Save & Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>

        <PhotoUploadModal
          visible={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          currentPhotoUri={resume.personalInfo.photoUri}
          candidateName={resume.personalInfo.fullName}
          onSavePhoto={(uri) => onUpdate({ ...resume, personalInfo: { ...resume.personalInfo, photoUri: uri } })}
        />
      </ScreenContainer>
    </Modal>
  );
};

// ═════════════════════════════════════════════
// STYLES — Light reference-accurate design
// ═════════════════════════════════════════════
const st = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 80, gap: 10 },

  // ── Step indicator (Screen 10 top) ──
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 4,
  },
  stepDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: '#CBD5E1',
    borderRadius: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },

  // ── Education list card (Screen 10) ──
  eduCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  eduIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eduIconText: { fontSize: 18 },
  eduTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  eduSub: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  eduDate: { fontSize: 11, color: '#94A3B8' },

  // ── Shared card actions (edit + delete) ──
  cardActions: { flexDirection: 'column', gap: 6 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: { fontSize: 14 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 14 },

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
    marginBottom: 8,
    backgroundColor: '#FAFBFE',
  },
  addEntryIcon: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginRight: 6 },
  addEntryText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  // ── Avatar row (Screen 11) ──
  avatarRow: { alignItems: 'center', marginBottom: 16 },

  // ── Form card (Screen 11 / add forms) ──
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 12,
  },
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
  fieldWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  calendarIcon: { color: '#94A3B8', fontSize: 14 },
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
  twoCol: { flexDirection: 'row', gap: 12 },
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
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 11,
    color: '#94A3B8',
  },
  formBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
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
  saveEntryBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveEntryText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  // ── Skills (Screen 12) ──
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  skillChipText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  skillChipX: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  skillInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  addSkillBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addSkillBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  suggestChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestChipText: { fontSize: 13, fontWeight: '600' },

  // ── Skill Proficiency ──
  profRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  profSkillName: { fontSize: 13, fontWeight: '600', color: '#1E293B', width: 80 },
  profBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  profBarFill: {
    height: 6,
    borderRadius: 3,
  },
  profLevelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D6E2F7',
  },
  profLevelText: { fontSize: 11, fontWeight: '600', color: '#475569' },

  // ── Projects (Screen 13) ──
  projCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
  },
  projIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projIconEmoji: { fontSize: 20 },
  projTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  projSub: { fontSize: 12, color: '#64748B' },
  projTechLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  projDescLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  projDescText: { fontSize: 12, lineHeight: 17, color: '#64748B' },
  techChip: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  techChipText: { color: '#2563EB', fontSize: 11, fontWeight: '700' },

  // ── Certifications (Screen 14) ──
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
  },
  certIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certInitial: { fontSize: 20, fontWeight: '800' },
  certTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  certIssuer: { fontSize: 12, color: '#64748B', marginBottom: 1 },
  certYear: { fontSize: 11, color: '#94A3B8' },

  // ── Achievements (Screen 15) ──
  achCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  achIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achIconEmoji: { fontSize: 20 },
  achTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  achOrg: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  achYear: { fontSize: 11, color: '#94A3B8' },

  // ── Work Experience cards ──
  expCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
  },
  expIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  expSub: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  expDate: { fontSize: 11, color: '#94A3B8' },

  // ── Photo picker ──
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#F8FAFC',
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  photoBtn: {
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
  },

  // ── Save & Continue ──
  saveContinue: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  saveContinueText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
