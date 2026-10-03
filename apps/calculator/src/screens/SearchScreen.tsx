import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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

interface SearchScreenProps {
  navigation: any;
  route: any;
}

const SUGGESTED_QUERIES = ['gst', 'tax', 'emi', 'sip', 'loan', 'fuel', 'cgpa', 'bmi'];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const analytics = useAnalytics();
  const storage = useAppStorage();

  const [query, setQuery] = useState(route?.params?.defaultCategory || '');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchResults: CalculatorItem[] = query.trim()
    ? calculatorToolCatalog.filter((tool) => {
        const q = query.toLowerCase().trim();
        return (
          tool.status === 'available' &&
          (tool.name.toLowerCase().includes(q) ||
            tool.title.toLowerCase().includes(q) ||
            tool.category.toLowerCase().includes(q) ||
            tool.shortDescription.toLowerCase().includes(q) ||
            (tool.description && tool.description.toLowerCase().includes(q)) ||
            (tool.aliases && tool.aliases.some((a) => a.toLowerCase().includes(q))) ||
            tool.keywords.some((k) => k.toLowerCase().includes(q)))
        );
      })
    : [];

  const handleSelectTool = async (tool: CalculatorItem) => {
    analytics.logToolOpened(tool.id, { tool_name: tool.name, category: tool.category });
    await storage.addRecentTool(tool.id, 10);
    const timestamps = await storage.getJson<Record<string, number>>('recent_tool_timestamps', {});
    timestamps[tool.id] = Date.now();
    await storage.setJson('recent_tool_timestamps', timestamps);
    navigation.navigate(tool.route, { tool });
  };

  return (
    <ScreenContainer safeArea withPadding={false}>
      {/* Top Search Bar Row */}
      <View
        style={[
          styles.headerRow,
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

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.surfaceSubtle,
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme.colors.borderSubtle,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.colors.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search calculators..."
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={[styles.clearText, { color: theme.colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Suggested Searches */}
        <View style={styles.suggestedWrap}>
          <Text style={[styles.suggestedTitle, { color: theme.colors.textMuted }]}>
            Suggested Searches
          </Text>
          <View style={styles.chipsRow}>
            {SUGGESTED_QUERIES.map((chip) => (
              <TouchableOpacity
                key={chip}
                onPress={() => setQuery(chip)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: query.toLowerCase() === chip ? '#2563EB' : theme.colors.surfaceSubtle,
                    borderColor: query.toLowerCase() === chip ? '#60A5FA' : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: query.toLowerCase() === chip ? '#FFFFFF' : theme.colors.text,
                      fontWeight: query.toLowerCase() === chip ? '800' : '600',
                    },
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results List */}
        {searchResults.length > 0 && (
          <View style={styles.resultsList}>
            <Text style={[styles.resultsCount, { color: theme.colors.textMuted }]}>
              {searchResults.length} {searchResults.length === 1 ? 'calculator' : 'calculators'} found
            </Text>

            {searchResults.map((tool) => (
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
                  <Text style={[styles.toolCategory, { color: theme.colors.primary }]} numberOfLines={1}>
                    {tool.category}
                  </Text>
                  <Text style={[styles.toolDesc, { color: theme.colors.textMuted }]} numberOfLines={1}>
                    {tool.shortDescription}
                  </Text>
                </View>

                <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {query.trim().length > 0 && searchResults.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No calculators found</Text>
            <Text style={[styles.emptyDesc, { color: theme.colors.textMuted }]}>
              Try searching with another keyword or pick one from the suggestions above.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    fontSize: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  suggestedWrap: {
    gap: 10,
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12.5,
  },
  resultsList: {
    gap: 10,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  toolInfo: {
    flex: 1,
    gap: 2,
  },
  toolName: {
    fontSize: 14,
    fontWeight: '700',
  },
  toolCategory: {
    fontSize: 11,
    fontWeight: '700',
  },
  toolDesc: {
    fontSize: 11.5,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '400',
  },
  emptyWrap: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
});
