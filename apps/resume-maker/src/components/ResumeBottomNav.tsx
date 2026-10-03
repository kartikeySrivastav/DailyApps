import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dailyapps/theme';

interface Props {
  active?: 'home' | 'documents' | 'templates' | 'tools' | 'settings';
  onNavigate?: (destination: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => void;
}

const ITEMS = [
  ['home', '⌂', 'Home'],
  ['documents', '▣', 'My Documents'],
  ['templates', '▤', 'Templates'],
  ['tools', '⚒', 'Tools'],
  ['settings', '⚙', 'Settings'],
] as const;

export const ResumeBottomNav: React.FC<Props> = ({ active = 'home', onNavigate }) => {
  const theme = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: theme.colors.surfaceCard, borderTopColor: theme.colors.border }]}>
      {ITEMS.map(([id, icon, label]) => {
        const selected = id === active;
        return (
          <TouchableOpacity
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Open ${label}`}
            activeOpacity={onNavigate ? 0.72 : 1}
            disabled={!onNavigate}
            onPress={() => onNavigate?.(id)}
            style={styles.item}
          >
            <Text style={[styles.icon, { color: selected ? '#4F46E5' : theme.colors.textMuted }]}>{icon}</Text>
            <Text numberOfLines={1} style={[styles.label, { color: selected ? '#4F46E5' : theme.colors.textMuted }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { height: 62, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingHorizontal: 4 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { fontSize: 18, fontWeight: '700' },
  label: { fontSize: 9, fontWeight: '600' },
});
