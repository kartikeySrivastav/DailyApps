import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@dailyapps/theme';

export const PdfBottomNav: React.FC<{ active?: 'home' | 'documents' | 'templates' | 'tools' | 'settings' }> = ({ active = 'tools' }) => {
  const theme = useTheme();
  const items = [['home', '⌂', 'Home'], ['documents', '▣', 'My Documents'], ['templates', '▤', 'Templates'], ['tools', '⚒', 'Tools'], ['settings', '⚙', 'Settings']] as const;
  return <View style={[styles.bar, { backgroundColor: theme.colors.surfaceCard, borderTopColor: theme.colors.border }]}>{items.map(([id, icon, label]) => <View key={id} style={styles.item}><Text style={[styles.icon, { color: id === active ? '#4F46E5' : theme.colors.textMuted }]}>{icon}</Text><Text numberOfLines={1} style={[styles.label, { color: id === active ? '#4F46E5' : theme.colors.textMuted }]}>{label}</Text></View>)}</View>;
};

const styles = StyleSheet.create({ bar: { height: 62, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingHorizontal: 4 }, item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }, icon: { fontSize: 18, fontWeight: '700' }, label: { fontSize: 9, fontWeight: '600' } });
