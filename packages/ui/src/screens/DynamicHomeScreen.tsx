import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { AppFeature } from '@dailyapps/config';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchBar } from '../components/SearchBar';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { EmptyState } from '../components/EmptyState';

export interface DynamicHomeScreenProps {
  appName: string;
  subtitle?: string;
  features: AppFeature[];
  favoriteIds?: string[];
  recentIds?: string[];
  onSelectFeature: (feature: AppFeature) => void;
  onToggleFavorite?: (featureId: string) => void;
  headerRightAction?: React.ReactNode;
  bannerAdSlot?: React.ReactNode;
  enableSearch?: boolean;
}

export const DynamicHomeScreen: React.FC<DynamicHomeScreenProps> = ({
  appName,
  subtitle,
  features,
  favoriteIds = [],
  recentIds = [],
  onSelectFeature,
  onToggleFavorite,
  headerRightAction,
  bannerAdSlot,
  enableSearch = true,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive categories from features
  const categories = useMemo(() => {
    const cats = new Set<string>(['All']);
    features.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return Array.from(cats);
  }, [features]);

  // Filter features based on query and category
  const filteredFeatures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return features.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;

      const inTitle = f.title.toLowerCase().includes(query);
      const inDesc = f.description.toLowerCase().includes(query);
      const inKeywords = f.keywords?.some((k) => k.toLowerCase().includes(query));

      return inTitle || inDesc || inKeywords;
    });
  }, [features, searchQuery, selectedCategory]);

  const featuredTool = useMemo(
    () => features.find((f) => f.isFeatured) || features[0],
    [features]
  );

  const favoriteTools = useMemo(
    () => features.filter((f) => favoriteIds.includes(f.id)),
    [features, favoriteIds]
  );

  const recentTools = useMemo(
    () =>
      recentIds
        .map((id) => features.find((f) => f.id === id))
        .filter((f): f is AppFeature => !!f),
    [features, recentIds]
  );

  return (
    <ScreenContainer scrollable safeArea withPadding={false}>
      {/* App Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surfaceCard }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.appTitle, { color: theme.colors.text }]}>
            {appName}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {headerRightAction && <View>{headerRightAction}</View>}
      </View>

      <View style={styles.contentPadding}>
        {/* Search Bar */}
        {enableSearch && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${appName} tools...`}
          />
        )}

        {/* Categories Horizontal Scroll */}
        {categories.length > 2 && !searchQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surfaceSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: isSelected ? '#ffffff' : theme.colors.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Featured Card (When not searching) */}
        {!searchQuery && selectedCategory === 'All' && featuredTool && (
          <Card
            onPress={() => onSelectFeature(featuredTool)}
            style={StyleSheet.flatten([
              styles.featuredCard,
              {
                backgroundColor: theme.colors.primary,
              },
            ])}
          >
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>FEATURED TOOL</Text>
            </View>
            <View style={styles.featuredIconContainer}>
              <Text style={styles.featuredIcon}>{featuredTool.icon || '⚡'}</Text>
            </View>
            <Text style={styles.featuredTitle}>{featuredTool.title}</Text>
            <Text style={styles.featuredDescription}>{featuredTool.description}</Text>
          </Card>
        )}

        {/* Favorites Section */}
        {!searchQuery && favoriteTools.length > 0 && (
          <Section title="★ Favorites">
            <View style={styles.toolGrid}>
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={true}
                  onSelect={() => onSelectFeature(tool)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </View>
          </Section>
        )}

        {/* Recents Section */}
        {!searchQuery && recentTools.length > 0 && (
          <Section title="🕒 Recent Tools">
            <View style={styles.toolGrid}>
              {recentTools.slice(0, 4).map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favoriteIds.includes(tool.id)}
                  onSelect={() => onSelectFeature(tool)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </View>
          </Section>
        )}

        {/* All / Filtered Tools */}
        <Section
          title={
            searchQuery
              ? `Results (${filteredFeatures.length})`
              : selectedCategory === 'All'
              ? 'All Tools'
              : selectedCategory
          }
        >
          {filteredFeatures.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No tools found"
              description={`We couldn't find any tool matching "${searchQuery}"`}
              actionText="Clear Search"
              onActionPress={() => setSearchQuery('')}
            />
          ) : (
            <View style={styles.toolGrid}>
              {filteredFeatures.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favoriteIds.includes(tool.id)}
                  onSelect={() => onSelectFeature(tool)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </View>
          )}
        </Section>

        {/* Bottom Banner Ad slot */}
        {bannerAdSlot && (
          <View style={styles.adContainer}>{bannerAdSlot}</View>
        )}
      </View>
    </ScreenContainer>
  );
};

interface ToolCardProps {
  tool: AppFeature;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite?: (id: string) => void;
}

const getCategoryStyle = (category?: string) => {
  switch (category) {
    case 'Standard':
      return { bg: 'rgba(2, 132, 199, 0.18)', border: 'rgba(2, 132, 199, 0.35)' };
    case 'Advanced':
      return { bg: 'rgba(124, 58, 237, 0.18)', border: 'rgba(124, 58, 237, 0.35)' };
    case 'Date & Time':
      return { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.35)' };
    case 'Financial':
      return { bg: 'rgba(16, 185, 129, 0.18)', border: 'rgba(16, 185, 129, 0.35)' };
    default:
      return { bg: 'rgba(99, 102, 241, 0.18)', border: 'rgba(99, 102, 241, 0.35)' };
  }
};

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const catStyle = getCategoryStyle(tool.category);

  return (
    <Card
      onPress={onSelect}
      style={StyleSheet.flatten([
        styles.toolCard,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderColor: theme.colors.borderSubtle,
        },
      ])}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: catStyle.bg,
              borderColor: catStyle.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={styles.toolIcon}>{tool.icon || '⚡'}</Text>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleFavorite(tool.id);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 18, color: isFavorite ? '#F59E0B' : theme.colors.textMuted }}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.toolTitle,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.base,
          },
        ]}
      >
        {tool.title}
      </Text>
      <Text
        numberOfLines={2}
        style={[
          styles.toolDescription,
          {
            color: theme.colors.textMuted,
            fontSize: theme.typography.fontSize.xs,
          },
        ]}
      >
        {tool.description}
      </Text>
      {tool.badge && (
        <View style={[styles.badgePill, { backgroundColor: theme.colors.surfaceSubtle }]}>
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{tool.badge}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
  },
  featuredCard: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredIcon: {
    fontSize: 26,
  },
  featuredTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  featuredDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
    minHeight: 124,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolIcon: {
    fontSize: 22,
  },
  toolTitle: {
    fontWeight: '700',
  },
  toolDescription: {
    marginTop: 4,
    lineHeight: 16,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  adContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
