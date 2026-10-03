import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useAppStorage } from '@dailyapps/storage';
import { calculatorToolCatalog } from '../config/toolCatalog';
import { CalculatorItem } from '../types/catalog.types';
import { useCalculationHistory } from '../hooks';
import { CalculationRecord } from '../types/history.types';
import { EmptyState } from '../components/EmptyState';
import { formatRelativeTime } from '../utils/timeUtils';
import { haptic } from '../utils/hapticUtils';

interface HistoryScreenProps {
  navigation: any;
  onGoBack?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation, onGoBack }) => {
  const theme = useTheme();
  const analytics = useAnalytics();
  const storage = useAppStorage();

  const [activeTab, setActiveTab] = useState<'calculations' | 'tools'>('calculations');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [recentTimestamps, setRecentTimestamps] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Global Calculation History
  const {
    history: calcHistory,
    clearHistory: clearCalcHistory,
    deleteItem: deleteCalcItem,
    refreshHistory,
  } = useCalculationHistory();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchRecents = async () => {
      const recents = await storage.getRecentTools();
      const timestamps = await storage.getJson<Record<string, number>>('recent_tool_timestamps', {});
      if (isMounted) {
        setRecentIds(recents);
        setRecentTimestamps(timestamps);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 220);
      }
    };
    fetchRecents();
    refreshHistory();
    return () => {
      isMounted = false;
    };
  }, [storage, refreshHistory]);

  const handleSwitchTab = (tab: 'calculations' | 'tools') => {
    if (tab === activeTab) return;
    haptic.selection();
    setActiveTab(tab);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 190);
  };

  const handleSelectCategory = (catKey: string) => {
    if (catKey === categoryFilter) return;
    haptic.selection();
    setCategoryFilter(catKey);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 170);
  };

  const recentTools = recentIds
    .map((id) => calculatorToolCatalog.find((t) => t.id === id))
    .filter(Boolean) as CalculatorItem[];

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleSelectTool = async (tool: CalculatorItem) => {
    analytics.logToolOpened(tool.id, { tool_name: tool.name, category: tool.category });
    await storage.addRecentTool(tool.id, 10);
    const updated = { ...recentTimestamps, [tool.id]: Date.now() };
    setRecentTimestamps(updated);
    await storage.setJson('recent_tool_timestamps', updated);
    navigation.navigate(tool.route, { tool });
  };

  const handleOpenCalculation = (item: CalculationRecord) => {
    const matchedTool = calculatorToolCatalog.find((t) => t.id === item.toolId);
    if (matchedTool) {
      analytics.logToolOpened(matchedTool.id, { tool_name: matchedTool.name, category: matchedTool.category });
      navigation.navigate(matchedTool.route, { tool: matchedTool, initialInputs: item.inputs });
    }
  };

  const handleClearHistory = async () => {
    Alert.alert(
      activeTab === 'calculations' ? 'Clear Calculation History?' : 'Clear Recent Tools?',
      'Are you sure you want to clear this history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            if (activeTab === 'calculations') {
              await clearCalcHistory();
            } else {
              await storage.clearRecentTools();
              await storage.setJson('recent_tool_timestamps', {});
              setRecentIds([]);
              setRecentTimestamps({});
            }
          },
        },
      ]
    );
  };

  // Filter calculations by category & search query
  const filteredCalculations = calcHistory.filter((item) => {
    if (categoryFilter !== 'all') {
      const cat = (item.category || '').toLowerCase();
      if (categoryFilter === 'trading' && !cat.includes('trad')) return false;
      if (categoryFilter === 'investments' && !cat.includes('invest')) return false;
      if (categoryFilter === 'loans' && !cat.includes('loan') && !cat.includes('emi')) return false;
      if (categoryFilter === 'tax' && !cat.includes('tax') && !cat.includes('salary')) return false;
      if (categoryFilter === 'math' && !cat.includes('math')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (item.title || '').toLowerCase().includes(q) ||
        (item.toolName || '').toLowerCase().includes(q) ||
        (item.result || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categoryFilters = [
    { key: 'all', label: 'All', icon: '✨' },
    { key: 'trading', label: 'Trading', icon: '📊' },
    { key: 'investments', label: 'Investments', icon: '📈' },
    { key: 'loans', label: 'Loans', icon: '💰' },
    { key: 'tax', label: 'Tax & GST', icon: '💵' },
    { key: 'math', label: 'Math', icon: '🧮' },
  ];

  const hasItems =
    activeTab === 'calculations' ? filteredCalculations.length > 0 : recentTools.length > 0;

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderBottomColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.backBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Text style={[styles.backArrow, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>History</Text>
        </View>
        {hasItems && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearBtn} activeOpacity={0.7}>
            <Text style={[styles.clearText, { color: '#EF4444' }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Switcher Tabs (Calculations vs Recent Tools) */}
      <View style={[styles.tabsRow, { backgroundColor: theme.colors.surfaceCard, borderBottomColor: theme.colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => handleSwitchTab('calculations')}
          style={[
            styles.tabBtn,
            activeTab === 'calculations' && {
              backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)',
              borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.25)',
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.mainTabIcon}>📊</Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'calculations'
                    ? theme.colors.primary
                    : theme.colors.textMuted,
              },
            ]}
          >
            Calculations ({calcHistory.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSwitchTab('tools')}
          style={[
            styles.tabBtn,
            activeTab === 'tools' && {
              backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)',
              borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.25)',
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.mainTabIcon}>⚡</Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'tools'
                    ? theme.colors.primary
                    : theme.colors.textMuted,
              },
            ]}
          >
            Recent Tools ({recentTools.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search bar (when in Calculations mode) */}
      {activeTab === 'calculations' && (
        <View style={[styles.searchBoxWrap, { backgroundColor: theme.colors.surfaceCard, borderBottomColor: theme.colors.borderSubtle }]}>
          <TextInput
            placeholder="Search calculations..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                color: theme.colors.text,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={{ color: theme.colors.textMuted, fontSize: 13, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Category Filter Chips (when in Calculations mode) */}
      {activeTab === 'calculations' && (
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {categoryFilters.map((cat) => {
              const isSelected = categoryFilter === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => handleSelectCategory(cat.key)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surfaceSubtle,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text style={[styles.chipIcon, isSelected && { transform: [{ scale: 1.1 }] }]}>
                    {cat.icon}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.chipText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.text,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            {/* Skeleton Card 1 */}
            <View
              style={[
                styles.skeletonCard,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.skeletonHeader}>
                <View
                  style={[
                    styles.skeletonPill,
                    {
                      width: 76,
                      height: 20,
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonPill,
                    {
                      width: 80,
                      height: 14,
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#EEF2F6',
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.skeletonPill,
                  {
                    width: '70%',
                    height: 16,
                    marginBottom: 8,
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              />
              <View
                style={[
                  styles.skeletonPill,
                  {
                    width: '45%',
                    height: 12,
                    marginBottom: 12,
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#EEF2F6',
                  },
                ]}
              />
              <View
                style={[
                  styles.skeletonBox,
                  {
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                  },
                ]}
              />
            </View>

            {/* Skeleton Card 2 */}
            <View
              style={[
                styles.skeletonCard,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.skeletonHeader}>
                <View
                  style={[
                    styles.skeletonPill,
                    {
                      width: 84,
                      height: 20,
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonPill,
                    {
                      width: 64,
                      height: 14,
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#EEF2F6',
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.skeletonPill,
                  {
                    width: '82%',
                    height: 16,
                    marginBottom: 8,
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              />
              <View
                style={[
                  styles.skeletonPill,
                  {
                    width: '52%',
                    height: 12,
                    marginBottom: 12,
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#EEF2F6',
                  },
                ]}
              />
              <View
                style={[
                  styles.skeletonBox,
                  {
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                  },
                ]}
              />
            </View>

            {/* Loading Indicator directly below the cards */}
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                {activeTab === 'calculations' ? 'Loading calculations...' : 'Loading recent tools...'}
              </Text>
            </View>
          </View>
        ) : activeTab === 'calculations' ? (
          filteredCalculations.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No calculations found"
              message={
                searchQuery
                  ? "No calculations match your search filter."
                  : "Calculations from Trading, Investments, Loans, Tax, and Math tools will automatically save here."
              }
              actionLabel={searchQuery ? "Clear Search" : "Browse Calculators"}
              onAction={() => (searchQuery ? setSearchQuery('') : handleBack())}
            />
          ) : (
            filteredCalculations.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.calcCard,
                  {
                    backgroundColor: theme.colors.surfaceCard,
                    borderColor: theme.isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : theme.colors.borderSubtle,
                  },
                ]}
              >
                {/* Header Row */}
                <View style={styles.calcHeader}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: theme.isDark
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(37, 99, 235, 0.1)',
                        borderColor: theme.isDark
                          ? 'rgba(59, 130, 246, 0.3)'
                          : 'rgba(37, 99, 235, 0.2)',
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {item.badge || item.category}
                    </Text>
                  </View>
                  <View style={styles.timeDeleteRow}>
                    <Text style={[styles.timeBadge, { color: theme.colors.textMuted }]}>
                      {formatRelativeTime(item.timestamp)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => deleteCalcItem(item.id)}
                      style={styles.deleteIconBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Delete calculation"
                    >
                      <Text style={[styles.deleteIconText, { color: theme.colors.textMuted }]}>
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Title & Subtitle */}
                <Text style={[styles.calcTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text style={[styles.calcSubtitle, { color: theme.colors.textMuted }]}>
                    {item.subtitle}
                  </Text>
                ) : null}

                {/* Result Box */}
                <View
                  style={[
                    styles.resultBox,
                    {
                      backgroundColor: theme.isDark
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(16, 185, 129, 0.08)',
                      borderColor: theme.isDark
                        ? 'rgba(16, 185, 129, 0.25)'
                        : 'rgba(16, 185, 129, 0.2)',
                    },
                  ]}
                >
                  <Text style={styles.resultValue}>{item.result}</Text>
                  {item.secondaryResult ? (
                    <Text style={[styles.secondaryResult, { color: theme.colors.textMuted }]}>
                      {item.secondaryResult}
                    </Text>
                  ) : null}
                </View>

                {/* Actions Row */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    onPress={() => handleOpenCalculation(item)}
                    style={[
                      styles.openToolBtn,
                      {
                        backgroundColor: theme.isDark
                          ? 'rgba(59, 130, 246, 0.12)'
                          : 'rgba(37, 99, 235, 0.08)',
                        borderColor: theme.isDark
                          ? 'rgba(59, 130, 246, 0.25)'
                          : 'rgba(37, 99, 235, 0.2)',
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.openToolText}>Recalculate in {item.toolName} ↗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : recentTools.length === 0 ? (
          <EmptyState
            icon="🕒"
            title="No recent tools"
            message="Your recently opened calculators will automatically appear here."
            actionLabel="Explore Tools"
            onAction={handleBack}
          />
        ) : (
          recentTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => handleSelectTool(tool)}
              activeOpacity={0.7}
              style={[
                styles.toolCard,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : theme.colors.borderSubtle,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: theme.isDark
                      ? 'rgba(59, 130, 246, 0.15)'
                      : '#EFF6FF',
                  },
                ]}
              >
                <Text style={styles.iconText}>{tool.icon}</Text>
              </View>

              <View style={styles.toolInfo}>
                <Text
                  style={[styles.toolName, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {tool.name}
                </Text>
                <Text
                  style={[styles.toolCategory, { color: theme.colors.textMuted }]}
                  numberOfLines={1}
                >
                  {tool.category}
                </Text>
              </View>

              <View style={styles.timeWrap}>
                <Text style={[styles.timeBadge, { color: theme.colors.textMuted }]}>
                  {formatRelativeTime(recentTimestamps[tool.id] || Date.now())}
                </Text>
                <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>
                  ›
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  mainTabIcon: {
    fontSize: 14,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
    includeFontPadding: false,
  },
  searchBoxWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingRight: 36,
    fontSize: 13,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 28,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    paddingVertical: 8,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    flexShrink: 0,
  },
  chipIcon: {
    fontSize: 13,
  },
  chipText: {
    fontSize: 12.5,
    includeFontPadding: false,
  },
  loadingWrapper: {
    gap: 12,
    paddingTop: 4,
  },
  skeletonCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonPill: {
    borderRadius: 6,
  },
  skeletonBox: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  calcCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  timeDeleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteIconBtn: {
    padding: 2,
  },
  deleteIconText: {
    fontSize: 12,
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  calcSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  resultBox: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  secondaryResult: {
    fontSize: 12,
    marginTop: 2,
  },
  openToolBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  openToolText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  toolCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 16,
    fontWeight: '700',
  },
});
