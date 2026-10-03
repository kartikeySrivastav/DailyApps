import React from 'react';
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
import { calculatorToolCatalog, SMARTCALC_CATEGORIES } from '../config/toolCatalog';
import { CalculatorItem } from '../types/catalog.types';

interface CategoryToolsScreenProps {
  navigation: any;
  route: any;
}

export const CategoryToolsScreen: React.FC<CategoryToolsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();
  const storage = useAppStorage();

  const categoryName = route?.params?.category || 'Loans';
  const categoryInfo = SMARTCALC_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.id.includes(categoryName)
  );

  const tools = calculatorToolCatalog.filter(
    (t) => t.category.toLowerCase().includes(categoryName.toLowerCase()) && t.status === 'available'
  );

  const handleSelectTool = async (tool: CalculatorItem) => {
    analytics.logToolOpened(tool.id, { tool_name: tool.name, category: tool.category });
    await storage.addRecentTool(tool.id, 10);
    const timestamps = await storage.getJson<Record<string, number>>('recent_tool_timestamps', {});
    timestamps[tool.id] = Date.now();
    await storage.setJson('recent_tool_timestamps', timestamps);
    navigation.navigate(tool.route, { tool });
  };

  const getSubTitleText = () => {
    if (tools.length > 0) {
      const topNames = tools.slice(0, 3).map((t) => t.name.replace(' Calculator', '')).join(', ');
      return `${topNames} and more`;
    }
    return `${tools.length} calculators available`;
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* Header (Matching Screen 3) */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderBottomColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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

        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {categoryInfo?.name || categoryName}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {getSubTitleText()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen', { defaultCategory: categoryName })}
          activeOpacity={0.7}
          style={[
            styles.searchBtn,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tools List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {tools.map((tool) => (
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
              <Text style={[styles.toolDesc, { color: theme.colors.textMuted }]} numberOfLines={1}>
                {tool.shortDescription}
              </Text>
            </View>

            <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 62,
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
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  listContent: {
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
    gap: 3,
  },
  toolName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  toolDesc: {
    fontSize: 11.5,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '400',
    marginLeft: 4,
  },
});
