import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { MasterProfileScreen } from '../screens/MasterProfileScreen';
import { PremiumTemplatesScreen } from '../screens/PremiumTemplatesScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

interface Props { navigation: any; route?: any; }
type TabId = 'home' | 'documents' | 'templates' | 'tools' | 'settings';
const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '⌂' }, { id: 'documents', label: 'My Documents', icon: '▧' }, { id: 'templates', label: 'Templates', icon: '▤' }, { id: 'tools', label: 'Tools', icon: '⚒' }, { id: 'settings', label: 'Settings', icon: '⚙' },
];

export const MainTabNavigator: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const incoming = route?.params?.initialTab as TabId | undefined;
  const [activeTab, setActiveTab] = useState<TabId>(tabs.some((item) => item.id === incoming) ? incoming! : 'home');
  useEffect(() => { if (tabs.some((item) => item.id === incoming)) setActiveTab(incoming!); }, [incoming]);
  const content = activeTab === 'home' ? <HomeScreen navigation={navigation} /> : activeTab === 'documents' ? <MasterProfileScreen navigation={navigation} /> : activeTab === 'templates' ? <PremiumTemplatesScreen navigation={navigation} /> : activeTab === 'tools' ? <ToolsScreen navigation={navigation} /> : <SettingsScreen navigation={navigation} />;
  return <View style={[styles.root, { backgroundColor: theme.colors.background }]}><View style={styles.content}>{content}</View><View style={[styles.bar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.border }]}>{tabs.map((item) => { const active = item.id === activeTab; return <TouchableOpacity key={item.id} onPress={() => setActiveTab(item.id)} style={styles.tab}><Text style={[styles.icon, { color: active ? '#4265F4' : '#7080A1' }]}>{item.icon}</Text><Text numberOfLines={1} style={[styles.label, { color: active ? '#4265F4' : '#7080A1', fontWeight: active ? '800' : '600' }]}>{item.label}</Text></TouchableOpacity>; })}</View></View>;
};

const styles = StyleSheet.create({ root: { flex: 1 }, content: { flex: 1 }, bar: { height: 63, flexDirection: 'row', borderTopWidth: 1, paddingHorizontal: 4 }, tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }, icon: { fontSize: 22, fontWeight: '700' }, label: { fontSize: 9.5 } });
