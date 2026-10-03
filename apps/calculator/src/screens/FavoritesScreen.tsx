import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAnalytics } from '@dailyapps/analytics';
import { useAppStorage } from '@dailyapps/storage';
import { calculatorToolCatalog } from '../config/toolCatalog';
import { CalculatorItem } from '../types/catalog.types';
import { EmptyState } from '../components/EmptyState';

interface FavoritesScreenProps {
  navigation: any;
  onGoBack?: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation, onGoBack }) => {
  const theme = useTheme();
  const analytics = useAnalytics();
  const storage = useAppStorage();

  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchFavs = async () => {
      const favs = await storage.getFavorites();
      if (isMounted) setFavIds(favs);
    };
    fetchFavs();
    return () => {
      isMounted = false;
    };
  }, [storage]);

  const favoriteTools = calculatorToolCatalog.filter((t) => favIds.includes(t.id));

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
    navigation.navigate(tool.route, { tool });
  };

  const handleRemoveFavorite = async (toolId: string, e: any) => {
    e.stopPropagation?.();
    const updated = await storage.toggleFavorite(toolId);
    setFavIds(updated);
  };

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
          <Text style={[styles.title, { color: theme.colors.text }]}>⭐ Favorites</Text>
        </View>
        <Text style={[styles.badge, { color: theme.colors.textMuted }]}>
          {favoriteTools.length} pinned
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteTools.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="No favorites pinned yet"
            message="Tap the star icon on any calculator to pin it here for instant 1-tap access."
            actionLabel="Browse Calculators"
            onAction={handleBack}
          />
        ) : (
          favoriteTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => handleSelectTool(tool)}
              activeOpacity={0.7}
              style={[
                styles.toolCard,
                {
                  backgroundColor: theme.colors.surfaceCard,
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.borderSubtle,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                  },
                ]}
              >
                <Text style={styles.iconText}>{tool.icon}</Text>
              </View>

              <View style={styles.toolInfo}>
                <Text style={[styles.toolName, { color: theme.colors.text }]} numberOfLines={1}>
                  {tool.name}
                </Text>
                <Text style={[styles.toolCategory, { color: theme.colors.textMuted }]} numberOfLines={1}>
                  {tool.category}
                </Text>
              </View>

              <TouchableOpacity
                onPress={(e) => handleRemoveFavorite(tool.id, e)}
                style={styles.starBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.starIcon}>★</Text>
              </TouchableOpacity>
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
  badge: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 10,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  toolInfo: {
    flex: 1,
    gap: 2,
  },
  toolName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  toolCategory: {
    fontSize: 11.5,
  },
  starBtn: {
    padding: 6,
  },
  starIcon: {
    fontSize: 22,
    color: '#F59E0B',
  },
});
