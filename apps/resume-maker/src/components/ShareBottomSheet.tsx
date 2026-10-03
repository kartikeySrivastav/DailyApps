import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share as NativeShare,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  fileName?: string;
  fileSize?: string;
  onShareApp?: (app: string) => void;
}

export const ShareBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  fileName = 'Resume.pdf',
  fileSize = '2.4 MB',
  onShareApp,
}) => {
  const theme = useTheme();

  const shareTargets = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { id: 'gmail', name: 'Gmail', icon: '✉️', color: '#EA4335' },
    { id: 'drive', name: 'Drive', icon: '📁', color: '#34A853' },
    { id: 'bluetooth', name: 'Bluetooth', icon: '📶', color: '#0082FC' },
    { id: 'nearby', name: 'Nearby Share', icon: '📡', color: '#4285F4' },
    { id: 'more', name: 'More', icon: '⋯', color: '#64748B' },
  ];

  const handleShare = async (targetId: string) => {
    if (onShareApp) {
      onShareApp(targetId);
      onClose();
      return;
    }
    try {
      await NativeShare.share({
        title: fileName,
        message: `Sharing document: ${fileName}`,
      });
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          {/* Top handle bar */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Share Document
          </Text>

          {/* File Card Pill */}
          <View
            style={[
              styles.fileCard,
              { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' },
            ]}
          >
            <View style={styles.pdfIcon}>
              <Text style={styles.pdfIconText}>PDF</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fileName, { color: theme.colors.text }]}>
                {fileName}
              </Text>
              <Text style={[styles.fileSize, { color: theme.colors.textMuted }]}>
                {fileSize}
              </Text>
            </View>
          </View>

          {/* Share Via Label */}
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>
            Share via
          </Text>

          {/* Grid of targets */}
          <View style={styles.grid}>
            {shareTargets.map((target) => (
              <TouchableOpacity
                key={target.id}
                activeOpacity={0.8}
                onPress={() => handleShare(target.id)}
                style={styles.targetItem}
              >
                <View
                  style={[
                    styles.targetIconCircle,
                    { backgroundColor: target.color + '1A', borderColor: target.color + '40' },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{target.icon}</Text>
                </View>
                <Text
                  style={[styles.targetName, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {target.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={[
              styles.cancelButton,
              { backgroundColor: theme.isDark ? '#334155' : '#E2E8F0' },
            ]}
          >
            <Text style={[styles.cancelText, { color: theme.colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  pdfIcon: {
    width: 38,
    height: 44,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfIconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  fileName: {
    fontSize: 15,
    fontWeight: '700',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  targetItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 6,
  },
  targetName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
