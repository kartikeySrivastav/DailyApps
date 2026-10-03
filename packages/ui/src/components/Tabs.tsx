import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  scrollable = false,
  style,
}) => {
  const theme = useTheme();

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.id;
    return (
      <TouchableOpacity
        key={tab.id}
        activeOpacity={0.7}
        onPress={() => onChangeTab(tab.id)}
        style={[
          styles.tab,
          {
            borderBottomColor: isActive ? theme.colors.primary : 'transparent',
            borderBottomWidth: 2,
          },
        ]}
      >
        {tab.icon && <View style={styles.iconWrapper}>{tab.icon}</View>}
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? theme.colors.primary : theme.colors.textMuted,
              fontWeight: isActive ? '600' : '400',
            },
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container, style]}
      >
        {tabs.map(renderTab)}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.flexRow, style]}>
      {tabs.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  flexRow: {
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
  },
});
