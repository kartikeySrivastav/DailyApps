import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { calculatorToolCatalog, SMARTCALC_CATEGORIES } from '../config/toolCatalog';
import { CalculatorItem } from '../types/catalog.types';

interface HomeScreenProps {
  navigation: any;
  onOpenTab?: (tab: 'favorites' | 'history' | 'more') => void;
}

const POPULAR_TOOLS_DEF = [
  { id: 'basic_calc', name: 'Calculator', icon: '➗', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)', route: 'BasicCalculator' },
  { id: 'electricity_bill', name: 'Electricity', icon: '⚡', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.15)', route: 'ElectricityCalculator' },
  { id: 'emi', name: 'EMI', icon: '💳', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', route: 'EMICalculator' },
  { id: 'sip', name: 'SIP', icon: '📈', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', route: 'SIPCalculator' },
  { id: 'gst', name: 'GST', icon: '%', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', route: 'GSTCalculator' },
  { id: 'age', name: 'Age', icon: '🎂', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)', route: 'AgeCalculator' },
  { id: 'fuel_cost', name: 'Fuel', icon: '⛽', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)', route: 'FuelCostCalculator' },
  { id: 'unit_converter', name: 'Converter', icon: '🔄', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)', route: 'UnitConverter' },
];

const CATEGORY_SUBTITLES: { [key: string]: string } = {
  'Loans': 'EMI, Home, Car & Prepay',
  'Investments': 'SIP, Lumpsum, SWP & CAGR',
  'Trading': 'P&L, Average & Position Size',
  'Banking': 'FD, RD, Payout & Gratuity',
  'Tax & Salary': 'Income Tax, In-Hand & GST',
  'Vehicle': 'Fuel Cost, Mileage & EV',
  'Home': 'Bill & Solar Rooftop',
  'Health': 'BMI, Calories & Hydration',
  'Student': 'Attendance & CGPA',
  'Math': 'Basic, Scientific & Percent',
  'Date & Time': 'Age & Date Difference',
  'Converters': 'All Physical Unit Conversions',
};

const getCategoryStyle = (catString?: string) => {
  if (!catString) return { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.15)', icon: '➗' };
  const clean = catString.replace(/^[^\w\s]+/, '').trim();
  return CATEGORY_COLORS[clean] || { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.15)', icon: '➗' };
};

const CATEGORY_COLORS: { [key: string]: { color: string; bg: string; icon: string } } = {
  'Loans': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', icon: '💰' },
  'Investments': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', icon: '📈' },
  'Trading': { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', icon: '📊' },
  'Banking': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', icon: '🏦' },
  'Tax & Salary': { color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)', icon: '💵' },
  'Vehicle': { color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)', icon: '🚗' },
  'Home': { color: '#EA580C', bg: 'rgba(234, 88, 12, 0.15)', icon: '🏠' },
  'Health': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '❤️' },
  'Student': { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)', icon: '🎓' },
  'Math': { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.15)', icon: '➗' },
  'Date & Time': { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)', icon: '📅' },
  'Converters': { color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)', icon: '🔄' },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, onOpenTab }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const analytics = useAnalytics();
  const { width } = useWindowDimensions();

  // Exactly 2 cards per row: (screenWidth - 32 padding - 10 gap) / 2
  const categoryCardWidth = Math.floor((width - 42) / 2);
  // Exactly 4 cards per row for Popular: (screenWidth - 32 padding - 24 gap) / 4
  const quickCardWidth = Math.floor((width - 56) / 4);

  const [recents, setRecents] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      async function loadStored() {
        const rec = await storage.getRecentTools();
        const favs = await storage.getFavorites();
        if (isMounted) {
          setRecents(rec);
          setFavIds(favs);
        }
      }
      loadStored();
      return () => {
        isMounted = false;
      };
    }, [storage])
  );

  useEffect(() => {
    analytics.logScreenView('SmartCalcHome');
  }, [analytics]);

  const recentTools = useMemo(() => {
    return recents
      .map((id) => calculatorToolCatalog.find((item) => item.id === id))
      .filter((item): item is CalculatorItem => !!item);
  }, [recents]);

  const userFavorites = useMemo(() => {
    return favIds
      .map((id) => calculatorToolCatalog.find((item) => item.id === id))
      .filter((item): item is CalculatorItem => !!item);
  }, [favIds]);

  const handleSelectToolById = async (toolId: string, fallbackRoute?: string) => {
    const tool = calculatorToolCatalog.find((t) => t.id === toolId);
    if (tool) {
      analytics.logToolOpened(tool.id, { tool_name: tool.name, category: tool.category });
      await storage.addRecentTool(tool.id, 10);
      const timestamps = await storage.getJson<Record<string, number>>('recent_tool_timestamps', {});
      timestamps[tool.id] = Date.now();
      await storage.setJson('recent_tool_timestamps', timestamps);
      navigation.navigate(tool.route, { tool });
    } else if (fallbackRoute) {
      navigation.navigate(fallbackRoute);
    }
  };

  const handleSelectCategory = (catName: string) => {
    // Find available tools in this category
    const categoryTools = calculatorToolCatalog.filter(
      (t) => t.category.toLowerCase().includes(catName.toLowerCase()) && t.status === 'available'
    );
    
    if (categoryTools.length > 0) {
      // Directly navigate to the primary calculator screen that contains all category tabs
      const primaryTool = categoryTools[0];
      handleSelectToolById(primaryTool.id, primaryTool.route);
    } else {
      // Fallback navigation
      navigation.navigate('CategoryTools', { category: catName });
    }
  };

  const handleOpenMore = () => {
    if (onOpenTab) {
      onOpenTab('more');
    } else {
      navigation.navigate('MoreScreen');
    }
  };

  const handleOpenFavorites = () => {
    if (onOpenTab) {
      onOpenTab('favorites');
    } else {
      navigation.navigate('FavoritesScreen');
    }
  };

  const handleOpenHistory = () => {
    if (onOpenTab) {
      onOpenTab('history');
    } else {
      navigation.navigate('HistoryScreen');
    }
  };

  return (
    <ScreenContainer scrollable safeArea withPadding={false}>
      {/* 1. Dark Navy Top Header & Search Bar (Exact Match to Image 2 Mockup) */}
      <View
        style={[
          styles.headerNavyBlock,
          {
            backgroundColor: theme.isDark ? '#0C1322' : '#0B1E38',
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <View style={[styles.brandBadge, { backgroundColor: '#2563EB' }]}>
              <View style={styles.brandScreen} />
              <View style={styles.brandKeysRow}>
                <View style={styles.brandKey} />
                <View style={styles.brandKey} />
              </View>
              <View style={styles.brandKeysRow}>
                <View style={styles.brandKey} />
                <View style={[styles.brandKey, { backgroundColor: '#F59E0B' }]} />
              </View>
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.appTitle}>SmartCalc</Text>
              <Text style={styles.appSubtitle}>All-in-One Calculator</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleOpenMore}
              activeOpacity={0.7}
              style={styles.headerIconBtn}
            >
              <Text style={styles.crownIcon}>👑</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenMore}
              activeOpacity={0.7}
              style={styles.headerIconBtn}
            >
              <Text style={styles.gearIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar inside Dark Navy Header */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SearchScreen')}
          style={styles.searchBar}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search calculators...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* 2. ⭐ Favorites Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>⭐ Favorites</Text>
              {userFavorites.length > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7',
                    },
                  ]}
                >
                  <Text style={[styles.countBadgeText, { color: '#F59E0B' }]}>
                    {userFavorites.length}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleOpenFavorites}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                {userFavorites.length > 0 ? 'See all ›' : 'Manage ›'}
              </Text>
            </TouchableOpacity>
          </View>

          {userFavorites.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favScrollContent}
            >
              {userFavorites.map((tool) => {
                const catStyle = getCategoryStyle(tool.category);
                return (
                  <TouchableOpacity
                    key={tool.id}
                    onPress={() => handleSelectToolById(tool.id, tool.route)}
                    activeOpacity={0.75}
                    style={[
                      styles.favCard,
                      {
                        width: Math.max(78, Math.floor((width - 32 - 30) / 4)),
                        backgroundColor: theme.colors.surfaceCard,
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <View style={[styles.quickIconCircle, { backgroundColor: catStyle.bg }]}>
                      <Text style={[styles.quickIconText, { color: catStyle.color }]}>{tool.icon}</Text>
                    </View>
                    <Text style={[styles.quickCardLabel, { color: theme.colors.text }]} numberOfLines={1}>
                      {tool.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenFavorites}
              style={[
                styles.emptyFavBanner,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyFavStarCircle,
                  {
                    backgroundColor: theme.isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                  },
                ]}
              >
                <Text style={styles.emptyFavStarIcon}>⭐</Text>
              </View>
              <View style={styles.emptyFavTextWrap}>
                <Text style={[styles.emptyFavTitle, { color: theme.colors.text }]}>
                  No favorites pinned yet
                </Text>
                <Text style={[styles.emptyFavDesc, { color: theme.colors.textMuted }]}>
                  Tap the ☆ star inside any calculator to pin it here for quick 1-tap access.
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. 🔥 Popular Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔥 Popular</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickGrid}>
            {POPULAR_TOOLS_DEF.map((pop) => (
              <TouchableOpacity
                key={pop.id}
                onPress={() => handleSelectToolById(pop.id, pop.route)}
                activeOpacity={0.75}
                style={[
                  styles.quickCard,
                  {
                    width: quickCardWidth,
                    backgroundColor: theme.colors.surfaceCard,
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                  },
                ]}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: pop.bg }]}>
                  <Text style={[styles.quickIconText, { color: pop.color }]}>{pop.icon}</Text>
                </View>
                <Text style={[styles.quickCardLabel, { color: theme.colors.text }]} numberOfLines={1}>
                  {pop.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. Categories 2-Column Grid (Exact 2 cards per row) */}
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>

          <View style={styles.categoriesGrid}>
            {SMARTCALC_CATEGORIES.map((cat) => {
              const styleMeta = CATEGORY_COLORS[cat.name] || {
                color: '#2563EB',
                bg: 'rgba(37, 99, 235, 0.15)',
                icon: cat.icon,
              };

              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleSelectCategory(cat.name)}
                  activeOpacity={0.75}
                  style={[
                    styles.categoryCard,
                    {
                      width: categoryCardWidth,
                      backgroundColor: theme.colors.surfaceCard,
                      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <View style={[styles.catIconCircle, { backgroundColor: styleMeta.bg }]}>
                    <Text style={styles.catIconText}>{styleMeta.icon}</Text>
                  </View>

                  <View style={styles.catTextWrap}>
                    <Text style={[styles.catName, { color: theme.colors.text }]} numberOfLines={1}>
                      {cat.name}
                    </Text>
                    <Text style={[styles.catCount, { color: theme.colors.textMuted }]} numberOfLines={1}>
                      {CATEGORY_SUBTITLES[cat.name] || `${cat.count} tools`}
                    </Text>
                  </View>

                  <Text style={[styles.catChevron, { color: theme.colors.textMuted }]}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Promo Banner (Matching Image 1 & 2) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleSelectToolById('sip')}
          style={[
            styles.bannerCard,
            {
              backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF',
              borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
            },
          ]}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerTargetCircle}>
              <Text style={styles.bannerTargetIcon}>🎯</Text>
            </View>
            <View style={styles.bannerTexts}>
              <Text style={[styles.bannerTitle, { color: theme.colors.text }]}>Calculate Smarter</Text>
              <Text style={[styles.bannerSub, { color: theme.colors.textMuted }]}>
                Simple tools for a better you
              </Text>
            </View>
          </View>

          <View style={styles.bannerRight}>
            <Text style={styles.bannerCalcEmoji}>📱</Text>
            <Text style={[styles.bannerChevron, { color: theme.colors.primary }]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 6. 🕒 Recent Row */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🕒 Recent</Text>
            <TouchableOpacity onPress={handleOpenHistory}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            {(recentTools.length > 0 ? recentTools : calculatorToolCatalog.slice(0, 3)).map((tool, idx) => (
              <TouchableOpacity
                key={tool.id}
                onPress={() => handleSelectToolById(tool.id, tool.route)}
                activeOpacity={0.75}
                style={[
                  styles.recentCard,
                  {
                    backgroundColor: theme.colors.surfaceCard,
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                  },
                ]}
              >
                <View
                  style={[
                    styles.recentIconBox,
                    {
                      backgroundColor: idx % 3 === 0
                        ? 'rgba(139, 92, 246, 0.15)'
                        : idx % 3 === 1
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                    },
                  ]}
                >
                  <Text style={styles.recentIconText}>{tool.icon}</Text>
                </View>

                <View style={styles.recentInfo}>
                  <Text style={[styles.recentName, { color: theme.colors.text }]} numberOfLines={1}>
                    {tool.name}
                  </Text>
                  <Text style={[styles.recentTime, { color: theme.colors.textMuted }]} numberOfLines={1}>
                    {idx === 0 ? '10 mins ago' : idx === 1 ? 'Yesterday' : '2 days ago'}
                  </Text>
                </View>

                <Text style={[styles.recentChevron, { color: theme.colors.textMuted }]}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerNavyBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
  },
  brandScreen: {
    height: 7,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  brandKeysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
  },
  brandKey: {
    flex: 1,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  titleWrap: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
    includeFontPadding: false,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownIcon: {
    fontSize: 19,
  },
  gearIcon: {
    fontSize: 19,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  body: {
    padding: 16,
    gap: 20,
    paddingBottom: 28,
  },
  sectionWrap: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  favScrollContent: {
    gap: 10,
    paddingVertical: 2,
  },
  favCard: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyFavBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  emptyFavStarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFavStarIcon: {
    fontSize: 20,
  },
  emptyFavTextWrap: {
    flex: 1,
    gap: 3,
  },
  emptyFavTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyFavDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickCard: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: {
    fontSize: 20,
    fontWeight: '800',
  },
  quickCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1.5,
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconText: {
    fontSize: 18,
  },
  catTextWrap: {
    flex: 1,
    gap: 2,
  },
  catName: {
    fontSize: 13,
    fontWeight: '800',
  },
  catCount: {
    fontSize: 10,
    fontWeight: '500',
  },
  catChevron: {
    fontSize: 18,
    fontWeight: '400',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bannerTargetCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTargetIcon: {
    fontSize: 20,
  },
  bannerTexts: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSub: {
    fontSize: 11.5,
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerCalcEmoji: {
    fontSize: 22,
  },
  bannerChevron: {
    fontSize: 22,
    fontWeight: '700',
  },
  recentScroll: {
    gap: 10,
    paddingRight: 10,
  },
  recentCard: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  recentIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentIconText: {
    fontSize: 16,
  },
  recentInfo: {
    flex: 1,
    gap: 2,
  },
  recentName: {
    fontSize: 12,
    fontWeight: '700',
  },
  recentTime: {
    fontSize: 10,
  },
  recentChevron: {
    fontSize: 16,
  },
});
