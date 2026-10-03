import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { MoreScreen } from '../screens/MoreScreen';

interface MainTabsProps {
  navigation: any;
}

export type TabType = 'home' | 'favorites' | 'history' | 'more';

export const MainTabs: React.FC<MainTabsProps> = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'favorites', label: 'Favorites', icon: '⭐' },
    { key: 'history', label: 'History', icon: '🕒' },
    { key: 'more', label: 'More', icon: '•••' },
  ];

  return (
    <View style={styles.container}>
      {/* Active Tab Screen Content */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <HomeScreen
            navigation={navigation}
            onOpenTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'favorites' && (
          <FavoritesScreen
            navigation={navigation}
            onGoBack={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'history' && (
          <HistoryScreen
            navigation={navigation}
            onGoBack={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'more' && (
          <MoreScreen
            navigation={navigation}
            onGoBack={() => setActiveTab('home')}
          />
        )}
      </View>

      {/* Persistent Bottom Tab Bar (Matching Mockup) */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surfaceCard,
            borderTopColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              {/* Active Indicator Top Line */}
              {isActive && <View style={[styles.activeLine, { backgroundColor: '#2563EB' }]} />}

              <Text
                style={[
                  styles.tabIcon,
                  {
                    color: isActive ? '#2563EB' : theme.colors.textMuted,
                    transform: [{ scale: isActive ? 1.08 : 1 }],
                  },
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#2563EB' : theme.colors.textMuted,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: Platform.OS === 'android' ? 62 : 74,
    paddingBottom: Platform.OS === 'android' ? 4 : 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 3,
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
  },
  tabIcon: {
    fontSize: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.1,
    includeFontPadding: false,
  },
});
