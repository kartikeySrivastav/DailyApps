import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { RESUME_TEMPLATES, BIODATA_TEMPLATES, TemplateMeta } from '../templates/templateCatalog';
import { samplePriyaSharmaBiodata } from '../data/sampleData';
import { createEmptyResume } from '../data/documentDefaults';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props {
  navigation?: any;
  route?: any;
}

type FilterKey = 'all' | 'modern' | 'professional' | 'creative' | 'minimal';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'modern', label: 'Modern' },
  { key: 'professional', label: 'Professional' },
  { key: 'creative', label: 'Creative' },
  { key: 'minimal', label: 'Minimal' },
];

const renderTemplateSkeleton = (template: TemplateMeta) => {
  const isBiodata = template.category === 'marriage_biodata';

  if (isBiodata) {
    if (template.id === 'modern_clean' || template.id === 'modern_pastel') {
      return (
        <View style={styles.thumbBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <View style={[styles.thumbAvatar, { backgroundColor: template.primaryColor + '40' }]} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={[styles.thumbLine, { width: '70%', backgroundColor: template.primaryColor }]} />
              <View style={[styles.thumbLine, { width: '45%' }]} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 3, marginBottom: 8, padding: 3, backgroundColor: '#E2E8F0', borderRadius: 4 }}>
            <View style={{ flex: 1, height: 6, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 6, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 6, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
          </View>
          <View style={{ padding: 4, borderRadius: 4, borderWidth: 0.5, borderColor: '#CBD5E1', marginBottom: 4, gap: 2 }}>
            <View style={[styles.thumbLine, { width: '40%', backgroundColor: template.primaryColor }]} />
            <View style={[styles.thumbLine, { width: '85%' }]} />
          </View>
          <View style={{ padding: 4, borderRadius: 4, borderWidth: 0.5, borderColor: '#CBD5E1', gap: 2 }}>
            <View style={[styles.thumbLine, { width: '40%', backgroundColor: template.primaryColor }]} />
            <View style={[styles.thumbLine, { width: '80%' }]} />
          </View>
        </View>
      );
    }
    if (template.id === 'elegant_photo' || template.id === 'minimal_gold') {
      return (
        <View style={styles.thumbBody}>
          <View style={{ alignItems: 'center', marginVertical: 4 }}>
            <View style={{ width: 34, height: 34, borderRadius: 6, borderWidth: 1.5, borderColor: template.primaryColor, backgroundColor: template.primaryColor + '20' }} />
            <View style={[styles.thumbLine, { width: '60%', backgroundColor: template.primaryColor, marginTop: 4 }]} />
            <View style={[styles.thumbLine, { width: '40%', marginTop: 2 }]} />
          </View>
          <View style={{ flexDirection: 'row', gap: 4, padding: 4, backgroundColor: '#F1F5F9', borderRadius: 4, marginVertical: 4 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={[styles.thumbLine, { width: '90%' }]} />
              <View style={[styles.thumbLine, { width: '70%' }]} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={[styles.thumbLine, { width: '90%' }]} />
              <View style={[styles.thumbLine, { width: '70%' }]} />
            </View>
          </View>
          <View style={[styles.thumbLine, { width: '75%', marginTop: 4 }]} />
        </View>
      );
    }
    if (template.id === 'premium_classic') {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ height: 26, backgroundColor: template.primaryColor, padding: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
              <View style={{ width: 25, height: 3, backgroundColor: '#FDE68A', borderRadius: 1.5 }} />
            </View>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#FDE68A' }} />
          </View>
          <View style={{ padding: 6, flex: 1 }}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 6 }}>
              <View style={{ flex: 1, padding: 3, borderWidth: 0.5, borderColor: '#CBD5E1', borderRadius: 3, gap: 2 }}>
                <View style={[styles.thumbLine, { width: '60%', backgroundColor: template.primaryColor }]} />
                <View style={[styles.thumbLine, { width: '90%' }]} />
                <View style={[styles.thumbLine, { width: '80%' }]} />
              </View>
              <View style={{ flex: 1, padding: 3, borderWidth: 0.5, borderColor: '#CBD5E1', borderRadius: 3, gap: 2 }}>
                <View style={[styles.thumbLine, { width: '60%', backgroundColor: template.primaryColor }]} />
                <View style={[styles.thumbLine, { width: '90%' }]} />
                <View style={[styles.thumbLine, { width: '80%' }]} />
              </View>
            </View>
            <View style={[styles.thumbLine, { width: '85%' }]} />
            <View style={[styles.thumbLine, { width: '60%', marginTop: 3 }]} />
          </View>
        </View>
      );
    }
    // Royal Traditional Default
    return (
      <View style={{ flex: 1, margin: 4, borderWidth: 2, borderColor: template.primaryColor, borderRadius: 4, padding: 4 }}>
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 9, color: template.primaryColor, fontWeight: '800' }}>卐 ॥ श्री ॥ 卐</Text>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: template.primaryColor, backgroundColor: template.primaryColor + '15', marginVertical: 2 }} />
          <View style={[styles.thumbLine, { width: '50%', backgroundColor: template.primaryColor }]} />
        </View>
        <View style={{ height: 1, backgroundColor: template.primaryColor + '30', marginVertical: 3 }} />
        <View style={{ gap: 2 }}>
          <View style={[styles.thumbLine, { width: '35%', backgroundColor: template.primaryColor }]} />
          <View style={[styles.thumbLine, { width: '95%' }]} />
          <View style={[styles.thumbLine, { width: '90%' }]} />
          <View style={[styles.thumbLine, { width: '35%', backgroundColor: template.primaryColor, marginTop: 3 }]} />
          <View style={[styles.thumbLine, { width: '95%' }]} />
        </View>
      </View>
    );
  }

  // Resume skeletons
  if (template.id === 'clean_minimal' || template.id === 'ats_classic') {
    return (
      <View style={{ padding: 8, flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 6 }}>
          <View style={[styles.thumbLine, { width: '55%', height: 4, backgroundColor: '#0F172A' }]} />
          <View style={[styles.thumbLine, { width: '35%', marginTop: 2 }]} />
          <View style={[styles.thumbLine, { width: '75%', marginTop: 2 }]} />
          <View style={{ width: '100%', height: 1, backgroundColor: '#0F172A', marginTop: 4 }} />
        </View>
        <View style={{ gap: 2, marginBottom: 4 }}>
          <View style={[styles.thumbLine, { width: '30%', backgroundColor: '#0F172A' }]} />
          <View style={{ width: '100%', height: 0.5, backgroundColor: '#CBD5E1' }} />
          <View style={[styles.thumbLine, { width: '95%' }]} />
          <View style={[styles.thumbLine, { width: '85%' }]} />
        </View>
        <View style={{ gap: 2 }}>
          <View style={[styles.thumbLine, { width: '30%', backgroundColor: '#0F172A' }]} />
          <View style={{ width: '100%', height: 0.5, backgroundColor: '#CBD5E1' }} />
          <View style={[styles.thumbLine, { width: '90%' }]} />
          <View style={[styles.thumbLine, { width: '75%' }]} />
        </View>
      </View>
    );
  }

  if (template.id === 'executive_pro' || template.id === 'executive_slate') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 32, backgroundColor: '#0F172A', padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <View style={{ width: 45, height: 4, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
            <View style={{ width: 30, height: 3, backgroundColor: '#D97706', borderRadius: 1.5 }} />
            <View style={{ width: 20, height: 1, backgroundColor: '#D97706' }} />
          </View>
          <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#D97706', backgroundColor: '#334155' }} />
        </View>
        <View style={{ padding: 6, flex: 1 }}>
          <View style={[styles.thumbLine, { width: '35%', backgroundColor: '#0F172A', marginBottom: 3 }]} />
          <View style={[styles.thumbLine, { width: '90%', marginBottom: 5 }]} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 5 }}>
            <View style={{ width: '47%', height: 7, backgroundColor: '#FEF3C7', borderRadius: 2 }} />
            <View style={{ width: '47%', height: 7, backgroundColor: '#FEF3C7', borderRadius: 2 }} />
            <View style={{ width: '47%', height: 7, backgroundColor: '#FEF3C7', borderRadius: 2 }} />
            <View style={{ width: '47%', height: 7, backgroundColor: '#FEF3C7', borderRadius: 2 }} />
          </View>
          <View style={[styles.thumbLine, { width: '85%' }]} />
        </View>
      </View>
    );
  }

  if (template.id === 'creative_bold' || template.id === 'creative_pro') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 36, backgroundColor: template.primaryColor, padding: 6, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#DDD6FE', backgroundColor: '#EDE9FE' }} />
          <View style={{ marginLeft: 6, gap: 2, flex: 1 }}>
            <View style={{ width: '60%', height: 4, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
            <View style={{ width: '40%', height: 3, backgroundColor: '#DDD6FE', borderRadius: 1.5 }} />
          </View>
        </View>
        <View style={{ padding: 6, flex: 1, gap: 4 }}>
          <View style={{ padding: 3, backgroundColor: '#FAF5FF', borderRadius: 3, borderWidth: 0.5, borderColor: '#DDD6FE', gap: 2 }}>
            <View style={[styles.thumbLine, { width: '35%', backgroundColor: template.primaryColor }]} />
            <View style={[styles.thumbLine, { width: '85%' }]} />
          </View>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            <View style={{ width: 24, height: 7, borderRadius: 99, backgroundColor: template.primaryColor + '20' }} />
            <View style={{ width: 28, height: 7, borderRadius: 99, backgroundColor: template.primaryColor + '20' }} />
            <View style={{ width: 22, height: 7, borderRadius: 99, backgroundColor: template.primaryColor + '20' }} />
          </View>
          <View style={[styles.thumbLine, { width: '90%' }]} />
        </View>
      </View>
    );
  }

  // Modern Two-Column Split (Default)
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.thumbStrip, { backgroundColor: template.primaryColor }]} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: '36%', backgroundColor: '#F1F5F9', padding: 4, gap: 3, borderRightWidth: 0.5, borderRightColor: '#CBD5E1' }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: template.primaryColor + '30', alignSelf: 'center', marginBottom: 2 }} />
          <View style={[styles.thumbLine, { width: '80%' }]} />
          <View style={[styles.thumbLine, { width: '60%' }]} />
          <View style={[styles.thumbLine, { width: '50%', backgroundColor: template.primaryColor, marginTop: 4 }]} />
          <View style={{ height: 6, backgroundColor: template.primaryColor + '20', borderRadius: 2 }} />
          <View style={{ height: 6, backgroundColor: template.primaryColor + '20', borderRadius: 2 }} />
        </View>
        <View style={{ flex: 1, padding: 5, gap: 3 }}>
          <View style={[styles.thumbLine, { width: '70%', height: 4, backgroundColor: '#0F172A' }]} />
          <View style={[styles.thumbLine, { width: '45%', backgroundColor: template.primaryColor }]} />
          <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 2 }} />
          <View style={[styles.thumbLine, { width: '35%', backgroundColor: template.primaryColor }]} />
          <View style={[styles.thumbLine, { width: '95%' }]} />
          <View style={[styles.thumbLine, { width: '85%' }]} />
          <View style={[styles.thumbLine, { width: '35%', backgroundColor: template.primaryColor, marginTop: 3 }]} />
          <View style={[styles.thumbLine, { width: '90%' }]} />
        </View>
      </View>
    </View>
  );
};

export const TemplateSelectorScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const schemaId = route?.params?.schemaId || 'professional_resume';
  const category = route?.params?.category || (schemaId.includes('biodata') ? 'marriage_biodata' : 'resume');
  const isResume = category !== 'marriage_biodata';

  const allTemplates: TemplateMeta[] = isResume ? RESUME_TEMPLATES : BIODATA_TEMPLATES;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    allTemplates[0]?.id || 'modern_blue'
  );

  // Filter + search logic
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesFilter = activeFilter === 'all' || t.style === activeFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allTemplates, activeFilter, searchQuery]);

  const handleContinue = () => {
    if (category === 'marriage_biodata') {
      const template = allTemplates.find((t) => t.id === selectedTemplateId);
      navigation.navigate('MarriageBiodataBuilder', {
        schemaId,
        templateId: selectedTemplateId,
        document: {
          ...samplePriyaSharmaBiodata,
          id: 'bio_' + Date.now(),
          templateId: selectedTemplateId,
          accentColor: template?.primaryColor || '#D97706',
        },
      });
    } else if (schemaId === 'cover_letter') {
      navigation.navigate('CoverLetterBuilder', {
        schemaId,
        templateId: selectedTemplateId,
      });
    } else {
      const template = allTemplates.find((t) => t.id === selectedTemplateId);
      navigation.navigate('ResumeBuilder', {
        schemaId,
        templateId: selectedTemplateId,
        // Screen 4 is the section dashboard.  Personal Details opens from its
        // first row instead of bypassing the dashboard straight into a form.
        onboarding: false,
        document: createEmptyResume(selectedTemplateId as any, template?.primaryColor || '#2563EB'),
      });
    }
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* ─── Header ─── */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isResume ? 'Resume Templates' : 'Biodata Templates'}
          </Text>
          <Text style={[styles.headerSub, { color: theme.colors.textMuted }]}>
            {isResume ? 'Choose a Resume Template' : 'Choose a Biodata Template'}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ─── Body ─── */}
      <View style={styles.bodyWrap}>
        {/* Subtitle */}
        <Text style={[styles.bodySubtitle, { color: theme.colors.textMuted }]}>
          Select a design that matches your style
        </Text>

        {/* ── Search Bar ── */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9',
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Search templates..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 16, color: theme.colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter Pills ── */}
        {isResume && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(f.key)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isActive ? '#2563EB' : (theme.isDark ? '#1E293B' : '#F1F5F9'),
                      borderColor: isActive ? '#2563EB' : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: isActive ? '#FFFFFF' : theme.colors.textMuted },
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ── 2-Column Template Grid ── */}
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredTemplates.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
              <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.colors.text }]}>
                No templates found
              </Text>
              <Text style={[{ fontSize: 12, color: theme.colors.textMuted, textAlign: 'center', marginTop: 4 }]}>
                Try a different search or filter
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <TouchableOpacity
                    key={template.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedTemplateId(template.id)}
                    style={[
                      styles.templateCard,
                      {
                        backgroundColor: theme.colors.surfaceCard,
                        borderColor: isSelected ? '#2563EB' : theme.colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    {/* ── Thumbnail ── */}
                    <View
                      style={[
                        styles.thumbnail,
                        {
                          backgroundColor: theme.isDark ? '#0F172A' : '#F8FAFC',
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      {/* Dynamic structural skeleton */}
                      {renderTemplateSkeleton(template)}

                      {/* Selection checkmark badge */}
                      <View
                        style={[
                          styles.selectionBadge,
                          {
                            backgroundColor: isSelected ? '#2563EB' : 'transparent',
                            borderColor: isSelected ? '#2563EB' : '#94A3B8',
                          },
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>

                      {/* Premium badge */}
                      {template.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Text style={styles.premiumBadgeText}>⭐ PREMIUM</Text>
                        </View>
                      )}
                    </View>

                    {/* ── Template Name ── */}
                    <View style={styles.cardFooter}>
                      <Text
                        style={[styles.templateName, { color: theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {template.name}
                      </Text>
                      <Text
                        style={[
                          styles.templateTag,
                          {
                            color: template.isPremium ? '#D97706' : '#2563EB',
                            backgroundColor: template.isPremium ? '#FEF3C7' : '#EFF6FF',
                          },
                        ]}
                      >
                        {template.isPremium ? 'Premium' : 'Free'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {/* Spacer for bottom button */}
          <View style={{ height: 164 }} />
        </ScrollView>
      </View>

      {/* ─── Continue Button ─── */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.continueBtn}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <ResumeBottomNav
        active="templates"
        onNavigate={(tab) => navigation.navigate('MainTabs', { initialTab: tab })}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // ── Header ──
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 1,
  },

  // ── Body ──
  bodyWrap: {
    flex: 1,
  },
  bodySubtitle: {
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  // ── Search ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },

  // ── Filter Pills ──
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Grid ──
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    width: '47.5%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 190,
    margin: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbStrip: {
    height: 22,
    width: '100%',
  },
  thumbBody: {
    padding: 8,
    flex: 1,
  },
  thumbAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  thumbAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  thumbDivider: {
    height: 1.5,
    width: '100%',
    marginVertical: 5,
    opacity: 0.5,
  },
  thumbLine: {
    height: 3,
    backgroundColor: '#CBD5E1',
    borderRadius: 1.5,
  },
  selectionBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  cardFooter: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  templateTag: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // ── Empty State ──
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  // ── Bottom Bar ──
  bottomBar: {
    position: 'absolute',
    // Keep the primary action above the persistent app navigation.
    bottom: 62,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  continueBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
