import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { SupportedLanguage, t } from '@dailyapps/utils';

interface AiAssistantComingSoonModalProps {
  visible: boolean;
  language: SupportedLanguage;
  onClose: () => void;
}

export const AiAssistantComingSoonModal: React.FC<AiAssistantComingSoonModalProps> = ({
  visible,
  language,
  onClose,
}) => {
  const theme = useTheme();

  const UPCOMING_FEATURES = [
    {
      icon: '📝',
      title: t('aiFeatureSummary', language),
      desc: 'Craft concise, role-tailored summaries highlighting key strengths and career trajectory.',
    },
    {
      icon: '⚡',
      title: t('aiFeatureBullets', language),
      desc: 'Transform passive duties into impactful achievements led by powerful action verbs.',
    },
    {
      icon: '💼',
      title: t('aiFeatureWording', language),
      desc: 'Elevate vocabulary and sentence structure to executive-grade industry standards.',
    },
    {
      icon: '🎯',
      title: t('aiFeatureAts', language),
      desc: 'Analyze target job descriptions and align critical keywords to pass ATS filters.',
    },
    {
      icon: '📊',
      title: t('aiFeatureReview', language),
      desc: 'Instant structural, grammatical, and readability audit before sharing with recruiters.',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <View style={styles.titleBadgeRow}>
                <Text style={styles.robotIcon}>✨</Text>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  {t('aiAssistant', language)}
                </Text>
              </View>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                {t('aiSubtitle', language)}
              </Text>
            </View>

            <View style={[styles.comingSoonPill, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
              <Text style={styles.comingSoonText}>
                {t('comingSoon', language)}
              </Text>
            </View>
          </View>

          {/* Transparent Notice */}
          <View style={[styles.noticeBanner, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.noticeText, { color: theme.colors.textMuted }]}>
              {t('aiFeatureNotice', language)}
            </Text>
          </View>

          {/* Upcoming Feature List */}
          <ScrollView style={styles.featureList} showsVerticalScrollIndicator={false}>
            {UPCOMING_FEATURES.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureRow,
                  { borderBottomColor: theme.colors.border },
                  idx === UPCOMING_FEATURES.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.featureIcon}>{item.icon}</Text>
                <View style={styles.featureContent}>
                  <View style={styles.featureTitleRow}>
                    <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.featureTag}>Future</Text>
                  </View>
                  <Text style={[styles.featureDesc, { color: theme.colors.textMuted }]}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Close Action */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>
              {language === 'hi' ? 'समझ गया' : 'Got It'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  robotIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  comingSoonPill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#b45309',
    textTransform: 'uppercase',
  },
  noticeBanner: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  noticeText: {
    fontSize: 11.5,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  featureList: {
    maxHeight: 280,
  },
  featureRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  featureTag: {
    fontSize: 9.5,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featureDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
