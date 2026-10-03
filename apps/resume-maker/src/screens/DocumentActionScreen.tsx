import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { AnyDocumentProfile } from '../types/resume.types';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props { navigation?: any; route?: { params?: { mode?: 'rename' | 'duplicate' | 'details'; document?: AnyDocumentProfile } } }

export const DocumentActionScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const mode = route?.params?.mode || 'details';
  const document = route?.params?.document;
  const [name, setName] = useState((document as any)?.title || 'My_Resume');
  const isRename = mode === 'rename';
  const isDuplicate = mode === 'duplicate';
  const title = isRename ? 'Rename Document' : isDuplicate ? 'Duplicate Document' : 'Document Details';

  const save = async () => {
    if (!document) return;
    try {
      const documents = await storage.getJson<AnyDocumentProfile[]>('saved_documents', []);
      if (isRename) {
        const renamed = { ...document, title: name.trim() || document.title, updatedAt: Date.now() };
        const updatedDocs = documents.map((d) => d.id === document.id ? renamed : d);
        await storage.setJson('saved_documents', updatedDocs);
        navigation?.navigate('MainTabs', { initialTab: 'documents' });
        return;
      }
      if (isDuplicate) {
        const duplicateTitle = `${name.trim() || document.title} (Copy)`;
        const duplicated = {
          ...document,
          id: `${document.id}_copy_${Date.now()}`,
          title: duplicateTitle,
          updatedAt: Date.now(),
        };
        await storage.setJson('saved_documents', [duplicated, ...documents]);
        navigation?.navigate('MainTabs', { initialTab: 'documents' });
        return;
      }
      // Open PDF / Preview
      navigation?.navigate('LivePreview', { document });
    } catch (e) {
      console.error(e);
      navigation?.goBack();
    }
  };

  const handleDelete = () => {
    if (!document) return;
    Alert.alert(
      'Delete Document',
      `Are you sure you want to permanently delete "${document.title || 'this document'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const documents = await storage.getJson<AnyDocumentProfile[]>('saved_documents', []);
            const filtered = documents.filter((d) => d.id !== document.id);
            await storage.setJson('saved_documents', filtered);
            navigation?.navigate('MainTabs', { initialTab: 'documents' });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation?.goBack();
  };

  const fileName = `${name || 'My_Resume'}.pdf`;

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title={title}
        subtitle={isRename ? 'Change the name of your document' : isDuplicate ? 'Make a duplicate copy of your document' : 'View document information'}
        onBack={() => navigation?.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>{isRename ? '✎' : isDuplicate ? '📋' : '📄'}</Text>
        </View>
        <Text style={[styles.heading, { color: theme.colors.text }]}>
          {isRename ? 'Rename Document' : isDuplicate ? 'Create a Copy' : document?.title || 'Document Details'}
        </Text>
        <Text style={[styles.subheading, { color: theme.colors.textMuted }]}>
          {isRename ? 'Choose a clear name for your file' : isDuplicate ? 'A copy will be created and saved on your device' : 'Your document is stored safely on this device.'}
        </Text>
        <View style={[styles.fileCard, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}>
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfText}>PDF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>{document?.title || 'My_Resume'}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>PDF  •  2.4 MB  •  Saved locally</Text>
          </View>
        </View>

        {(isRename || isDuplicate) && (
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              {isRename ? 'New File Name' : 'New Document Name'}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter document name"
              placeholderTextColor="#94A3B8"
              style={[styles.input, { color: theme.colors.text, borderColor: '#6366F1' }]}
            />
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>Filename Preview</Text>
            <View style={[styles.preview, { backgroundColor: theme.colors.surfaceSubtle }]}>
              <Text style={[styles.previewText, { color: theme.colors.text }]}>{fileName}</Text>
            </View>
          </View>
        )}

        {!isRename && !isDuplicate && (
          <View style={[styles.detailsCard, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}>
            {['Document Type: ' + (document?.type === 'marriage_biodata' ? 'Marriage Biodata' : document?.type === 'cover_letter' ? 'Cover Letter' : 'Professional Resume'),
              'Created & Modified: Recently',
              'Format: Print-ready A4 PDF',
              'Storage: 100% Private & Local'].map((item) => (
              <Text key={item} style={[styles.detailRow, { color: theme.colors.textMuted }]}>✓  {item}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={save}>
          <Text style={styles.primaryText}>{isRename ? 'Save Changes' : isDuplicate ? 'Create Duplicate' : 'Open PDF Preview'}  →</Text>
        </TouchableOpacity>

        {!isRename && !isDuplicate && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation?.replace('DocumentAction', { mode: 'rename', document })}>
              <Text style={styles.actionText}>✎  Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation?.replace('DocumentAction', { mode: 'duplicate', document })}>
              <Text style={styles.actionText}>📋  Duplicate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.deleteText}>🗑️  Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {(isRename || isDuplicate) && (
          <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ResumeBottomNav
        active="documents"
        onNavigate={(tab) => navigation?.navigate('MainTabs', { initialTab: tab })}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 80 },
  illustration: { alignSelf: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  illustrationIcon: { color: '#4F46E5', fontSize: 30, fontWeight: '800' },
  heading: { textAlign: 'center', fontSize: 20, fontWeight: '900' },
  subheading: { textAlign: 'center', fontSize: 13, marginTop: 5, marginBottom: 18 },
  fileCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 16 },
  pdfBadge: { width: 38, height: 42, borderRadius: 7, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  pdfText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  fileName: { fontSize: 14, fontWeight: '800' },
  meta: { fontSize: 11, marginTop: 3 },
  form: { marginTop: 4 },
  label: { fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  preview: { borderRadius: 8, padding: 12, marginTop: 4 },
  previewText: { fontSize: 13, fontWeight: '700' },
  detailsCard: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 10, marginBottom: 8 },
  detailRow: { fontSize: 12.5, lineHeight: 18 },
  primaryButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionButton: { flex: 1, borderWidth: 1, borderColor: '#A5B4FC', borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFFFFF' },
  actionText: { color: '#4F46E5', fontSize: 12, fontWeight: '800' },
  deleteButton: { borderColor: '#FCA5A5' },
  deleteText: { color: '#EF4444', fontSize: 12, fontWeight: '800' },
  cancelButton: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10, backgroundColor: '#FFFFFF' },
  cancelText: { color: '#64748B', fontWeight: '700', fontSize: 13 }
});
