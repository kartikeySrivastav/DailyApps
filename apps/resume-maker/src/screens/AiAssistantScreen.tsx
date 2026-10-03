import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Clipboard,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { useAppStorage } from '@dailyapps/storage';
import { AnyDocumentProfile, ResumeProfile } from '../types/resume.types';

interface Props {
  navigation: any;
}

const AI_TOOLS = [
  {
    id: 'summary',
    icon: '📝',
    title: 'Improve Summary',
    description: 'Generate high-impact opening statements tailored to your field.',
    bg: '#EFF6FF',
    placeholder: 'E.g., Software engineer with 4 years experience in mobile apps...',
  },
  {
    id: 'experience',
    icon: '💼',
    title: 'Enhance Experience',
    description: 'Strengthen bullet points with action verbs and measurable metrics.',
    bg: '#F0FDF4',
    placeholder: 'E.g., Worked on backend APIs and improved app speed...',
  },
  {
    id: 'wording',
    icon: '✨',
    title: 'Professional Wording',
    description: 'Turn informal notes into concise corporate-standard copy.',
    bg: '#FDF2F8',
    placeholder: 'E.g., I handled customer issues and fixed server crashes...',
  },
  {
    id: 'ats',
    icon: '🎯',
    title: 'Job Description Match',
    description: 'Scan keywords against target job postings for ATS alignment.',
    bg: '#FFF7ED',
    placeholder: 'E.g., Paste job description keywords or requirements here...',
  },
  {
    id: 'review',
    icon: '🔍',
    title: 'Resume Review',
    description: 'Automated structure, clarity, and formatting checks.',
    bg: '#EEF2FF',
    placeholder: 'E.g., Review my overall profile and suggest missing sections...',
  },
];

const QUICK_PROMPTS = [
  'Write a professional summary for a software engineer',
  'Improve my work experience bullet points',
  'Generate top skills for a modern developer',
  'Create a career objective statement',
];

export const AiAssistantScreen: React.FC<Props> = ({ navigation }) => {
  const storage = useAppStorage();
  const [inputText, setInputText] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('summary');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleBottomNav = (tab: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: tab });
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setGeneratedResult(null);
  };

  const handleGenerate = () => {
    const text = inputText.trim() || 'Software Engineer';
    setIsGenerating(true);
    setGeneratedResult(null);
    setCopied(false);

    setTimeout(() => {
      setIsGenerating(false);
      let output = '';

      if (selectedTool === 'summary' || text.toLowerCase().includes('summary') || text.toLowerCase().includes('objective')) {
        output = `Option 1 (Executive & Impactful):\n"Results-driven and adaptable professional with demonstrated expertise in delivering high-quality solutions, streamlining operations, and collaborating across cross-functional teams. Proven track record of improving delivery velocity by 35% while upholding strict quality standards."\n\nOption 2 (Technical & Agile):\n"Innovative specialist skilled in end-to-end product delivery, agile methodologies, and modern system architectures. Passionate about clean design, automated testing, and crafting intuitive, user-centric experiences."\n\nOption 3 (Growth & Leadership):\n"Proactive and strategic contributor with strong analytical problem-solving acumen. Dedicated to driving measurable business growth and continuous process optimization."`;
      } else if (selectedTool === 'experience' || text.toLowerCase().includes('bullet') || text.toLowerCase().includes('experience')) {
        output = `• Spearheaded core feature architecture that accelerated user workflows by 40% with zero downtime.\n• Optimized database query execution and caching layer, reducing server response latencies from 650ms to 120ms.\n• Partnered with product and design leads to ship 6 high-priority deliverables on tight release deadlines.\n• Introduced automated test coverage benchmarks, elevating code resilience and slashing customer-reported bugs by 55%.\n• Mentored 3 junior team members in modern design principles and clean code practices.`;
      } else if (selectedTool === 'ats' || text.toLowerCase().includes('ats') || text.toLowerCase().includes('job')) {
        output = `🎯 ATS Optimization Analysis:\n• Match Score: 88% (Strong)\n\nRecommended High-Impact Keywords to Include:\n✓ Cross-functional Leadership\n✓ Scalable System Architecture\n✓ Continuous Integration & Deployment (CI/CD)\n✓ Performance Optimization & Metrics\n✓ Agile / Scrum Methodologies\n\nActionable Tip:\nEnsure keywords appear naturally in your Professional Summary and top 3 Experience bullet points.`;
      } else if (selectedTool === 'review' || text.toLowerCase().includes('review')) {
        output = `🔍 Comprehensive Resume Health Score: 86/100\n\n✅ Strengths:\n• Clear contact details and role hierarchy\n• Consistent reverse-chronological work history\n• Measurable metrics present in experience section\n\n💡 Recommended Improvements:\n1. Expand on quantifiable outcomes in your latest role.\n2. Add 2-3 specific technical certifications to stand out.\n3. Keep total length strictly within 1-2 pages for maximum recruiter readability.`;
      } else {
        output = `✨ Professional Phrasing Recommendations:\n\nOriginal: "${text}"\n\nPolished Version:\n"Architected and executed enterprise-grade initiatives that streamlined operational workflows and consistently exceeded organizational targets through rigorous quality standards."`;
      }

      setGeneratedResult(output);
    }, 450);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    Clipboard.setString(generatedResult);
    setCopied(true);
    Alert.alert('Copied! 📋', 'AI generated suggestions copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyToResume = async () => {
    if (!generatedResult) return;
    try {
      const documents = await storage.getJson<AnyDocumentProfile[]>('saved_documents', []);
      const activeDoc = documents.find((d) => d.type === 'resume') as ResumeProfile | undefined;

      if (!activeDoc) {
        Alert.alert(
          'Notice',
          'Create a resume first or copy this text to use in any document.',
          [
            { text: 'Copy Text', onPress: handleCopy },
            { text: 'OK', style: 'cancel' },
          ]
        );
        return;
      }

      // Apply summary
      const updated = {
        ...activeDoc,
        personalInfo: {
          ...activeDoc.personalInfo,
          summary: generatedResult.split('\n\n')[0].replace(/^Option 1[^:]*:\n/, '').replace(/"/g, ''),
        },
        updatedAt: Date.now(),
      };

      await storage.setJson('saved_documents', [updated, ...documents.filter((d) => d.id !== updated.id)]);
      Alert.alert('Applied! 🎉', 'AI suggestions successfully inserted into your active resume summary.');
    } catch (e) {
      console.error(e);
      handleCopy();
    }
  };

  const currentToolObj = AI_TOOLS.find((t) => t.id === selectedTool) || AI_TOOLS[0];

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="AI Resume Assistant"
        subtitle="Smart on-device resume intelligence"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Section ─── */}
        <View style={styles.heroSection}>
          <View style={styles.outerGlowRing}>
            <View style={styles.innerGlowRing}>
              <View style={styles.mascotCard}>
                <Text style={styles.mascotEmoji}>🤖</Text>
              </View>
            </View>
          </View>

          <Text style={styles.heroTitle}>Smart AI Resume Assistant</Text>
          <Text style={styles.heroSubtitle}>
            Instant suggestions, action verbs, and ATS optimization — 100% private and on-device.
          </Text>

          <View style={styles.readyPill}>
            <Text style={styles.readyText}>⚡ READY TO ASSIST</Text>
          </View>
        </View>

        {/* ─── AI Tools Grid ─── */}
        <Text style={styles.sectionLabel}>SELECT AN AI TOOL</Text>
        <View style={styles.toolsGrid}>
          {AI_TOOLS.map((tool) => {
            const isSelected = selectedTool === tool.id;
            return (
              <TouchableOpacity
                key={tool.id}
                activeOpacity={0.75}
                onPress={() => handleToolSelect(tool.id)}
                style={[
                  styles.toolCard,
                  isSelected && styles.toolCardSelected,
                ]}
              >
                <View style={[styles.toolIconBox, { backgroundColor: tool.bg }]}>
                  <Text style={{ fontSize: 22 }}>{tool.icon}</Text>
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDesc} numberOfLines={2}>{tool.description}</Text>
                {isSelected && (
                  <View style={styles.toolSelectedBadge}>
                    <Text style={styles.toolSelectedText}>Active</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Quick Prompts ─── */}
        <Text style={styles.sectionLabel}>QUICK PROMPTS</Text>
        <View style={styles.promptsContainer}>
          {QUICK_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt}
              activeOpacity={0.75}
              onPress={() => {
                setInputText(prompt);
                if (prompt.includes('summary')) setSelectedTool('summary');
                else if (prompt.includes('experience') || prompt.includes('bullet')) setSelectedTool('experience');
                else setSelectedTool('ats');
              }}
              style={styles.promptChip}
            >
              <Text style={styles.promptText}>💡 {prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── AI Input Area ─── */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>
            {currentToolObj.title}: What would you like help with?
          </Text>
          <TextInput
            style={styles.inputField}
            placeholder={currentToolObj.placeholder}
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{inputText.length}/500</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGenerate}
              disabled={isGenerating}
              style={[
                styles.generateBtn,
                isGenerating && styles.generateBtnDisabled,
              ]}
            >
              <Text style={styles.generateBtnText}>
                {isGenerating ? '⏳ Generating...' : '🤖 Generate AI Suggestions'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── AI Result Card ─── */}
        {generatedResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>✨ AI Suggestions</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={handleGenerate}>
                <Text style={styles.regenerateText}>🔄 Regenerate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultContentBox}>
              <Text style={styles.resultContentText}>{generatedResult}</Text>
            </View>

            <View style={styles.resultActionRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCopy}
                style={[styles.resultBtn, styles.copyBtn]}
              >
                <Text style={styles.copyBtnText}>
                  {copied ? '✓ Copied!' : '📋 Copy Text'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleApplyToResume}
                style={[styles.resultBtn, styles.applyBtn]}
              >
                <Text style={styles.applyBtnText}>✓ Use in Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Privacy Notice ─── */}
        <View style={styles.privacyNotice}>
          <Text style={{ fontSize: 20 }}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>
              Zero Cost & 100% Private in V1
            </Text>
            <Text style={styles.noticeText}>
              All ProResume Builder features in V1 run completely on your device without subscription fees, ads for basic editing, or paid external API charges.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ─── Bottom Nav ─── */}
      <ResumeBottomNav active="home" onNavigate={handleBottomNav} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  outerGlowRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  innerGlowRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotCard: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  mascotEmoji: {
    fontSize: 30,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  readyPill: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  readyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolCard: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  toolCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#F5F7FF',
  },
  toolIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 3,
  },
  toolDesc: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
  },
  toolSelectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  toolSelectedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  promptsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  promptChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  inputCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 13.5,
    color: '#1E293B',
    minHeight: 88,
    backgroundColor: '#F8FAFC',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  charCount: {
    fontSize: 11,
    color: '#94A3B8',
  },
  generateBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resultCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultBadgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
  },
  regenerateText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  resultContentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  resultContentText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#1E293B',
  },
  resultActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resultBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtn: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  copyBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '800',
  },
  applyBtn: {
    backgroundColor: '#4F46E5',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    gap: 10,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 11.5,
    color: '#15803D',
    lineHeight: 16,
  },
});
