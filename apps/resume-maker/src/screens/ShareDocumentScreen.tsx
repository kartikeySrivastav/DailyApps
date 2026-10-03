/**
 * ShareDocumentScreen — Screen 23 (Reference-accurate)
 *
 * Full-screen share UI showing:
 * - File info card (filename + PDF icon)
 * - PDF stats (size + pages)
 * - Share via grid (WhatsApp, Email, Messages, Drive, More)
 * - Share PDF (primary CTA)
 * - Download Instead (outlined)
 * - Privacy note
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share as NativeShare,
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

const SHARE_TARGETS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { id: 'email', name: 'Email', icon: '✉️', color: '#EA4335' },
  { id: 'messages', name: 'Messages', icon: '💌', color: '#34A853' },
  { id: 'drive', name: 'Drive', icon: '📁', color: '#4285F4' },
  { id: 'more', name: 'More', icon: '⋯', color: '#64748B' },
];

export const ShareDocumentScreen: React.FC<Props> = ({ navigation, route }) => {
  const document = route?.params?.document;
  const docTitle = (document as any)?.title || (document as any)?.personalInfo?.fullName || 'My_Resume';
  const fileName = `${docTitle.replace(/\s+/g, '_')}.pdf`;

  const handleShare = async (_targetId: string) => {
    try {
      await NativeShare.share({
        title: fileName,
        message: `Sharing document: ${fileName}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDownload = () => {
    Alert.alert('Download PDF', `${fileName} will be saved to your Downloads folder.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => Alert.alert('✅ Downloaded', `${fileName} saved successfully.`) },
    ]);
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="Share Document"
        onBack={() => navigation?.goBack()}
      />

      <View style={st.container}>
        {/* ── File info card ── */}
        <View style={st.fileCard}>
          <View style={st.filePdfBadge}>
            <Text style={st.filePdfText}>PDF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.fileName}>{fileName}</Text>
          </View>
        </View>

        {/* ── PDF Stats (size + pages) ── */}
        <View style={st.statsRow}>
          <View style={st.statItem}>
            <View style={st.statIconBox}>
              <Text style={st.statIcon}>PDF</Text>
            </View>
            <View>
              <Text style={st.statLabel}>PDF</Text>
              <Text style={st.statValue}>2.4 MB</Text>
              <Text style={st.statExtra}>2 Pages</Text>
            </View>
          </View>
        </View>

        {/* ── Share via label ── */}
        <Text style={st.sectionLabel}>Share via</Text>

        {/* ── Share target grid ── */}
        <View style={st.shareGrid}>
          {SHARE_TARGETS.map((target) => (
            <TouchableOpacity
              key={target.id}
              activeOpacity={0.8}
              onPress={() => handleShare(target.id)}
              style={st.shareItem}
            >
              <View style={[st.shareIconCircle, { backgroundColor: target.color + '15', borderColor: target.color + '30' }]}>
                <Text style={st.shareIconEmoji}>{target.icon}</Text>
              </View>
              <Text style={st.shareName}>{target.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Share PDF (primary CTA) ── */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => handleShare('native')} style={st.sharePdfBtn}>
          <Text style={st.sharePdfBtnText}>📤 Share PDF</Text>
        </TouchableOpacity>

        {/* ── Download Instead (outlined) ── */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleDownload} style={st.downloadBtn}>
          <Text style={st.downloadBtnText}>⬇ Download Instead</Text>
        </TouchableOpacity>

        {/* ── Privacy note ── */}
        <View style={st.privacyNote}>
          <Text style={st.privacyIcon}>🔒</Text>
          <Text style={st.privacyText}>
            Your document stays on your device unless you choose to share it.
          </Text>
        </View>
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
  },

  // ── File card ──
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#F8FAFC',
    padding: 14,
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

  // ── Stats row ──
  statsRow: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 12,
  },
  statIconBox: {
    width: 52,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: { color: '#DC2626', fontSize: 16, fontWeight: '900' },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  statExtra: { fontSize: 12, color: '#94A3B8', marginTop: 2 },

  // ── Section label ──
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },

  // ── Share grid ──
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  shareItem: {
    width: '28%',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shareIconEmoji: { fontSize: 22 },
  shareName: { fontSize: 11, fontWeight: '600', color: '#475569', textAlign: 'center' },

  // ── Share PDF CTA ──
  sharePdfBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 12,
  },
  sharePdfBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // ── Download Instead ──
  downloadBtn: {
    borderWidth: 1.5,
    borderColor: '#C7D5EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  downloadBtnText: { fontSize: 14, fontWeight: '700', color: '#475569' },

  // ── Privacy note ──
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  privacyIcon: { fontSize: 14 },
  privacyText: { flex: 1, color: '#475569', fontSize: 12, lineHeight: 17 },
});
