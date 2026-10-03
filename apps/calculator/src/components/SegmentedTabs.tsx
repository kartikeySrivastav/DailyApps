import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  badge?: string;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  scrollable = false,
  style,
}) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const tabPositions = useRef<{ [key: string]: { x: number; width: number } }>({});

  useEffect(() => {
    if (scrollable && tabPositions.current[activeTab] && scrollRef.current) {
      const pos = tabPositions.current[activeTab];
      scrollRef.current.scrollTo({
        x: Math.max(0, pos.x - 32),
        animated: true,
      });
    }
  }, [activeTab, scrollable]);

  const containerBg = theme.isDark
    ? '#101726'
    : '#F1F5F9';

  const containerBorder = theme.isDark
    ? '#1F293D'
    : '#E2E8F0';

  const renderTab = (tab: TabItem) => {
    const isActive = tab.key === activeTab;

    const tabBg = isActive
      ? '#2563EB'
      : 'transparent';

    const tabBorder = isActive
      ? theme.isDark
        ? '#60A5FA'
        : '#1D4ED8'
      : 'transparent';

    const textColor = isActive
      ? '#FFFFFF'
      : theme.isDark
      ? '#CBD5E1'
      : '#334155';

    const iconColor = isActive
      ? '#FFFFFF'
      : theme.isDark
      ? '#94A3B8'
      : '#475569';

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          tabPositions.current[tab.key] = { x: layout.x, width: layout.width };
          if (tab.key === activeTab && scrollable && scrollRef.current) {
            scrollRef.current.scrollTo({
              x: Math.max(0, layout.x - 32),
              animated: false,
            });
          }
        }}
        activeOpacity={0.7}
        style={[
          styles.tabButton,
          !scrollable && styles.tabButtonFlex,
          {
            backgroundColor: tabBg,
            borderColor: tabBorder,
            borderWidth: isActive ? 1.2 : 0,
          },
        ]}
      >
        <View style={styles.tabContent}>
          {tab.icon ? (
            <Text
              style={[
                styles.tabIcon,
                { color: iconColor },
              ]}
            >
              {tab.icon}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={[
              styles.tabText,
              {
                color: textColor,
                fontWeight: isActive ? '800' : '600',
              },
            ]}
          >
            {tab.label}
          </Text>
          {tab.badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.25)'
                    : theme.colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isActive ? '#FFFFFF' : theme.colors.primary },
                ]}
              >
                {tab.badge}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: containerBg, borderColor: containerBorder },
          style,
        ]}
      >
        {tabs.map(renderTab)}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.fixedContainer,
        { backgroundColor: containerBg, borderColor: containerBorder },
        style,
      ]}
    >
      {tabs.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 4,
    marginVertical: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 4,
    gap: 6,
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  tabButtonFlex: {
    flex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  tabText: {
    fontSize: 12.5,
    letterSpacing: 0.1,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
