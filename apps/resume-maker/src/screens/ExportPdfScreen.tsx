/**
 * ExportPdfScreen — Screen 22 (Reference-accurate)
 *
 * Success state showing "PDF Ready" with large PDF icon + checkmark,
 * file info card, format/pages details, and action buttons:
 * Download PDF (primary), Share + Open PDF (outlined), Done link.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { AnyDocumentProfile } from '../types/resume.types';

interface Props {
  navigation?: any;
  route?: { params?: { document?: AnyDocumentProfile } };
}

export const ExportPdfScreen: React.FC<Props> = ({ navigation, route }) => {
  const document = route?.params?.document;
  const docTitle = (document as any)?.title || (document as any)?.personalInfo?.fullName || 'My_Resume';
  const fileName = `${docTitle.replace(/\s+/g, '_')}.pdf`;

  const handleDownload = () => {
    Alert.alert('Download PDF', `${fileName} will be saved to your Downloads folder.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => Alert.alert('✅ Downloaded', `${fileName} saved successfully.`) },
    ]);
  };

  const handleShare = () => {
    navigation?.navigate('ShareDocument', { document });
  };

  const handleOpenPdf = () => {
    navigation?.navigate('PdfPreview', { document });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="Export PDF"
        onBack={() => navigation?.goBack()}
      />

      <View style={st.container}>
        {/* ── Large PDF icon with checkmark ── */}
        <View style={st.iconContainer}>
          <View style={st.pdfIconLarge}>
            <View style={st.pdfIconInner}>
              <Text style={st.pdfIconText}>PDF</Text>
            </View>
            {/* Green checkmark badge */}
            <View style={st.checkBadge}>
              <Text style={st.checkBadgeText}>✓</Text>
            </View>
          </View>
        </View>

        {/* ── PDF Ready heading ── */}
        <Text style={st.readyTitle}>PDF Ready</Text>
        <Text style={st.readySub}>Your PDF is ready</Text>

        {/* ── File info card ── */}
        <View style={st.fileCard}>
          <View style={st.filePdfBadge}>
            <Text style={st.filePdfText}>PDF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.fileName}>{fileName}</Text>
            <Text style={st.fileSize}>2.4 MB</Text>
          </View>
        </View>

        {/* ── Format & Pages ── */}
        <View style={st.detailsRow}>
          <View style={st.detailItem}>
            <Text style={st.detailIcon}>📄</Text>
            <View>
              <Text style={st.detailLabel}>Format</Text>
              <Text style={st.detailValue}>PDF</Text>
            </View>
          </View>
          <View style={st.detailItem}>
            <Text style={st.detailIcon}>📑</Text>
            <View>
              <Text style={st.detailLabel}>Pages</Text>
              <Text style={st.detailValue}>2</Text>
            </View>
          </View>
        </View>

        {/* ── Download PDF (primary CTA) ── */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleDownload} style={st.downloadBtn}>
          <Text style={st.downloadBtnText}>⬇ Download PDF</Text>
        </TouchableOpacity>

        {/* ── Share + Open PDF (outlined) ── */}
        <View style={st.secondaryRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleShare} style={st.outlineBtn}>
            <Text style={st.outlineBtnText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleOpenPdf} style={st.outlineBtn}>
            <Text style={st.outlineBtnText}>📄 Open PDF</Text>
          </TouchableOpacity>
        </View>

        {/* ── Done link ── */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation?.popToTop()} style={st.doneBtn}>
          <Text style={st.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ResumeBottomNav
        active="documents"
        onNavigate={(tab) => navigation?.navigate('MainTabs', { initialTab: tab })}
      />
    </ScreenContainer>
  );
};

const st = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Large PDF icon ──
  iconContainer: { marginBottom: 20 },
  pdfIconLarge: {
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pdfIconInner: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  pdfIconText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#DC2626',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },

  // ── Heading ──
  readyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  readySub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },

  // ── File info card ──
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#F8FAFC',
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  filePdfBadge: {
    width: 40,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  filePdfText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  fileName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  fileSize: { fontSize: 12, color: '#64748B', marginTop: 2 },

  // ── Format + Pages details ──
  detailsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 10,
  },
  detailIcon: { fontSize: 20 },
  detailLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  // ── Download button ──
  downloadBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 12,
  },
  downloadBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // ── Share + Open PDF row ──
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#C7D5EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineBtnText: { fontSize: 14, fontWeight: '700', color: '#475569' },

  // ── Done link ──
  doneBtn: { paddingVertical: 10 },
  doneText: { color: '#2563EB', fontSize: 14, fontWeight: '700' },
});
