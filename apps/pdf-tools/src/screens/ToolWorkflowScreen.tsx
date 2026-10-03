import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { Header } from '@dailyapps/ui';
import { useTheme } from '@dailyapps/theme';
import { PdfBottomNav } from '../components/PdfBottomNav';

interface Props {
  navigation?: any;
  route?: { params?: { feature?: { id?: string; title?: string }; mode?: string } };
}

const CONFIG: Record<string, { title: string; subtitle: string; action: string; icon: string }> = {
  merge_pdf: { title: 'Merge PDF', subtitle: 'Merge PDF Files', action: 'Merge PDF', icon: '▣' },
  split_pdf: { title: 'Split PDF', subtitle: 'Split PDF', action: 'Split PDF', icon: '✂' },
  compress_pdf: { title: 'Compress PDF', subtitle: 'Reduce PDF Size', action: 'Compress PDF', icon: '⇩' },
  img_to_pdf: { title: 'Image to PDF', subtitle: 'Create PDF from Images', action: 'Create PDF', icon: '▧' },
  pdf_to_image: { title: 'PDF to Image', subtitle: 'Convert PDF to Images', action: 'Convert to Images', icon: '▤' },
  rotate_pdf: { title: 'Rotate PDF', subtitle: 'Rotate PDF Pages', action: 'Rotate & Save', icon: '↻' },
  delete_pages: { title: 'Delete PDF Pages', subtitle: 'Remove Pages', action: 'Delete Pages', icon: '⌫' },
  reorder_pages: { title: 'Reorder Pages', subtitle: 'Arrange PDF Pages', action: 'Save Order', icon: '☷' },
  scan_doc: { title: 'Scan to PDF', subtitle: 'Scan Document', action: 'Create PDF', icon: '⌁' },
  pdf_viewer: { title: 'PDF Viewer', subtitle: 'View your PDF files', action: 'Open PDF', icon: '▤' },
};

export const ToolWorkflowScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const featureId = route?.params?.feature?.id || route?.params?.mode || 'merge_pdf';
  const config = CONFIG[featureId] || CONFIG.merge_pdf;
  const [files, setFiles] = useState<string[]>(['My_Resume.pdf', 'My_Biodata.pdf']);
  const [selectedPages, setSelectedPages] = useState<number[]>([1, 2]);
  const [quality, setQuality] = useState('Medium');
  const [outputFormat, setOutputFormat] = useState('JPG');
  const isImageFlow = featureId === 'img_to_pdf' || featureId === 'scan_doc';
  const isPageFlow = ['split_pdf', 'rotate_pdf', 'delete_pages', 'reorder_pages'].includes(featureId);

  const addFile = () => setFiles((current) => [...current, `Document_${current.length + 1}.pdf`]);
  const togglePage = (page: number) => setSelectedPages((current) => current.includes(page) ? current.filter((item) => item !== page) : [...current, page]);
  const runAction = () => Alert.alert(`${config.action} complete`, `${files.length} file${files.length === 1 ? '' : 's'} processed successfully.`);
  const fileLabel = useMemo(() => files.length === 1 ? '1 file selected' : `${files.length} files selected`, [files.length]);

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <Header title={config.title} subtitle={config.subtitle} onBack={() => navigation?.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}>
          <View style={styles.heroIcon}><Text style={styles.heroIconText}>{config.icon}</Text></View>
          <View style={{ flex: 1 }}><Text style={[styles.heroTitle, { color: theme.colors.text }]}>{config.subtitle}</Text><Text style={[styles.heroSub, { color: theme.colors.textMuted }]}>Select files and configure your document</Text></View>
        </View>

        {isImageFlow ? (
          <View style={[styles.uploadBox, { borderColor: '#4F46E5', backgroundColor: theme.colors.surfaceCard }]}><Text style={styles.uploadIcon}>＋</Text><Text style={[styles.uploadTitle, { color: theme.colors.text }]}>Add Images</Text><Text style={[styles.uploadSub, { color: theme.colors.textMuted }]}>Select and arrange your images</Text><TouchableOpacity style={styles.outlineButton} onPress={addFile}><Text style={styles.outlineText}>+ Add Images</Text></TouchableOpacity></View>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Files</Text>
            {files.map((file, index) => <View key={`${file}-${index}`} style={styles.fileRow}><View style={styles.pdfBadge}><Text style={styles.pdfText}>PDF</Text></View><View style={{ flex: 1 }}><Text style={[styles.fileName, { color: theme.colors.text }]}>{file}</Text><Text style={[styles.fileMeta, { color: theme.colors.textMuted }]}>2.4 MB • 8 Pages</Text></View><Text style={styles.drag}>☷</Text></View>)}
            <TouchableOpacity style={styles.outlineButton} onPress={addFile}><Text style={styles.outlineText}>+ Add Files</Text></TouchableOpacity>
          </View>
        )}

        {isPageFlow && <View style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}><Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Pages</Text><View style={styles.pageGrid}>{[1, 2, 3, 4, 5, 6, 7, 8].map((page) => <TouchableOpacity key={page} onPress={() => togglePage(page)} style={[styles.pageTile, { borderColor: selectedPages.includes(page) ? '#4F46E5' : theme.colors.border, backgroundColor: selectedPages.includes(page) ? '#EEF2FF' : theme.colors.surfaceCard }]}><Text style={{ color: theme.colors.text }}>Page {page}</Text></TouchableOpacity>)}</View></View>}

        {featureId === 'compress_pdf' && <View style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}><Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Compression Level</Text><View style={styles.optionRow}>{['Low', 'Medium', 'High'].map((item) => <TouchableOpacity key={item} onPress={() => setQuality(item)} style={[styles.option, { borderColor: quality === item ? '#4F46E5' : theme.colors.border, backgroundColor: quality === item ? '#EEF2FF' : theme.colors.surfaceCard }]}><Text style={[styles.optionText, { color: theme.colors.text }]}>{item}</Text><Text style={[styles.optionSub, { color: theme.colors.textMuted }]}>{item === 'Low' ? 'Best Quality' : item === 'Medium' ? 'Balanced' : 'Smallest Size'}</Text></TouchableOpacity>)}</View></View>}

        {featureId === 'pdf_to_image' && <View style={[styles.card, { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border }]}><Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Output Format</Text><View style={styles.optionRow}>{['JPG', 'PNG'].map((item) => <TouchableOpacity key={item} onPress={() => setOutputFormat(item)} style={[styles.option, { borderColor: outputFormat === item ? '#4F46E5' : theme.colors.border }]}><Text style={[styles.optionText, { color: theme.colors.text }]}>{item}</Text></TouchableOpacity>)}</View></View>}

        <View style={styles.infoBox}><Text style={styles.infoText}>ⓘ {fileLabel}. Files stay on your device.</Text></View>
        <TouchableOpacity style={styles.primaryButton} onPress={runAction}><Text style={styles.primaryText}>{config.icon}  {config.action}  →</Text></TouchableOpacity>
      </ScrollView>
      <PdfBottomNav active="tools" />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 24 },
  hero: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 14 },
  heroIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  heroIconText: { color: '#4F46E5', fontSize: 22, fontWeight: '800' },
  heroTitle: { fontSize: 16, fontWeight: '800' },
  heroSub: { fontSize: 11, marginTop: 4 },
  card: { borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: 10 },
  fileRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 9, padding: 10, marginBottom: 8 },
  pdfBadge: { width: 36, height: 40, borderRadius: 7, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  pdfText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  fileName: { fontSize: 12, fontWeight: '700' },
  fileMeta: { fontSize: 10, marginTop: 3 },
  drag: { color: '#64748B', fontSize: 17 },
  uploadBox: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 10, padding: 24, alignItems: 'center', marginBottom: 14 },
  uploadIcon: { color: '#4F46E5', fontSize: 30 },
  uploadTitle: { fontSize: 14, fontWeight: '800', marginTop: 6 },
  uploadSub: { fontSize: 11, marginTop: 4, marginBottom: 12 },
  outlineButton: { borderWidth: 1, borderColor: '#4F46E5', borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
  outlineText: { color: '#4F46E5', fontSize: 12, fontWeight: '800' },
  pageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pageTile: { width: '23%', minHeight: 58, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, borderWidth: 1, borderRadius: 9, padding: 11, alignItems: 'center' },
  optionText: { fontSize: 12, fontWeight: '800' },
  optionSub: { fontSize: 9, textAlign: 'center', marginTop: 5 },
  infoBox: { backgroundColor: '#EEF2FF', borderRadius: 9, padding: 12, marginBottom: 12 },
  infoText: { color: '#4F46E5', fontSize: 11 },
  primaryButton: { backgroundColor: '#4F46E5', borderRadius: 9, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
});
