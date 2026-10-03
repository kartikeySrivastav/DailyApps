import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';

interface CalculatorHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  category?: string;
  toolId?: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
  onHistory?: () => void;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  title,
  subtitle,
  icon,
  category,
  toolId,
  onBack,
  rightAction,
  onHistory,
}) => {
  const theme = useTheme();
  const storage = useAppStorage();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!toolId) return;
    let isMounted = true;
    async function checkFav() {
      const favs = await storage.getFavorites();
      if (isMounted) {
        setIsFavorite(favs.includes(toolId as string));
      }
    }
    checkFav();
    return () => {
      isMounted = false;
    };
  }, [toolId, storage]);

  const handleToggleFav = async () => {
    if (!toolId) return;
    const updated = await storage.toggleFavorite(toolId);
    setIsFavorite(updated.includes(toolId));
  };

  const cleanCategory = category ? category.replace(/^[^\w\s]+/, '').trim() : '';

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      {/* Left: Back button + Icon + Titles */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
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

        {icon && (
          <View style={[styles.iconBadge, { backgroundColor: theme.colors.surfaceSubtle }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        )}

        <View style={styles.titlesWrap}>
          {/* Row 1: Full Title */}
          <Text
            numberOfLines={1}
            style={[styles.headerTitle, { color: theme.colors.text }]}
          >
            {title}
          </Text>

          {/* Row 2: Category Pill + Subtitle */}
          <View style={styles.subtitleRow}>
            {cleanCategory.length > 0 && (
              <View
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)',
                    borderColor: theme.isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.25)',
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryPillText,
                    { color: theme.isDark ? '#60A5FA' : '#2563EB' },
                  ]}
                >
                  {cleanCategory}
                </Text>
              </View>
            )}
            {subtitle && (
              <Text
                numberOfLines={1}
                style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Right: History & Star Favorite Buttons */}
      <View style={styles.rightSection}>
        {onHistory && (
          <TouchableOpacity
            onPress={onHistory}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View calculation history"
            accessibilityHint="Opens your past calculations and results"
            style={[
              styles.starBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Text style={[styles.historyIcon, { color: theme.colors.text }]}>🕒</Text>
          </TouchableOpacity>
        )}

        {toolId && (
          <TouchableOpacity
            onPress={handleToggleFav}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityHint={isFavorite ? 'Double tap to remove this calculator from your favorites' : 'Double tap to add this calculator to your favorites for quick access'}
            accessibilityState={{ selected: isFavorite }}
            style={[
              styles.starBtn,
              {
                backgroundColor: isFavorite
                  ? 'rgba(245, 158, 11, 0.18)'
                  : theme.colors.surfaceSubtle,
                borderColor: isFavorite ? '#F59E0B' : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text
              style={[
                styles.starIcon,
                { color: isFavorite ? '#F59E0B' : theme.colors.textMuted },
              ]}
            >
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}

        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
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
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  titlesWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
  },
  categoryPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 0.5,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
    includeFontPadding: false,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    gap: 8,
  },
  starBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: {
    fontSize: 18,
  },
  starIcon: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    ...Platform.select({
      android: {
        marginTop: -1,
      },
    }),
  },
});
