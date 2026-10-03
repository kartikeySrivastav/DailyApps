import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { Card, Button } from '@dailyapps/ui';
import { AnyDocumentProfile } from '../types/resume.types';

interface DocumentCardProps {
  document: AnyDocumentProfile;
  onPreview: (doc: AnyDocumentProfile) => void;
  onEdit: (doc: AnyDocumentProfile) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  const isBiodata = document.type === 'marriage_biodata';
  const isResume = document.type === 'resume';

  const categoryLabel = isBiodata
    ? '💍 विवाह बायोडाटा'
    : isResume
    ? '💼 Professional Resume'
    : '✉️ Cover Letter';

  const dateString = new Date(document.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isBiodata
                ? '#fff1f2'
                : isResume
                ? '#eff6ff'
                : '#f0fdf4',
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: isBiodata
                  ? '#be185d'
                  : isResume
                  ? '#1d4ed8'
                  : '#15803d',
              },
            ]}
          >
            {categoryLabel}
          </Text>
        </View>

        <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>
          {dateString}
        </Text>
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
        {document.title}
      </Text>

      {isBiodata && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {(document as any).personalInfo?.fullName} • {(document as any).educationAndCareer?.occupation || 'Matrimonial Profile'}
        </Text>
      )}

      {isResume && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {(document as any).personalInfo?.fullName} • {(document as any).personalInfo?.jobTitle || 'Resume'}
        </Text>
      )}

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.actionsRow}>
        <View style={styles.actionBtn}>
          <Button
            title="👁️ Preview"
            variant="secondary"
            size="sm"
            onPress={() => onPreview(document)}
          />
        </View>
        <View style={styles.actionBtn}>
          <Button
            title="✏️ Edit"
            variant="primary"
            size="sm"
            onPress={() => onEdit(document)}
          />
        </View>
        <TouchableOpacity
          onPress={() => onDelete(document.id)}
          style={[styles.deleteBtn, { backgroundColor: theme.colors.surfaceSubtle }]}
        >
          <Text style={{ fontSize: 14 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
