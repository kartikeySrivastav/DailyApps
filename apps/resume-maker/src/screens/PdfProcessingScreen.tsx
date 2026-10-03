/**
 * PdfProcessingScreen — Screen 50: Processing + Screen 51: PDF Created
 *
 * Starts in processing state with circular progress, step indicators,
 * and file info. Auto-completes after 3 seconds and transitions to
 * success state with Download/Share/Open PDF/Done buttons.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props {
  navigation: any;
  route: any;
}

const STEPS = [
  'Preparing document',
  'Processing pages',
  'Optimizing document pages',
  'Finalizing PDF',
];

export const PdfProcessingScreen: React.FC<Props> = ({ navigation, route }) => {
  void route.params?.title; // consumed by navigation header
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setDone(true);
          return 100;
        }
        const next = Math.min(p + 5, 100);
        setActiveStep(Math.min(Math.floor(next / 25), 3));
        return next;
      });
    }, 150);
    Animated.loop(
      Animated.timing(animValue, { toValue: 1, duration: 2000, useNativeDriver: true }),
    ).start();
    return () => clearInterval(timer);
  }, [animValue]);

  const handleNavigation = (dest: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: dest });
  };

  if (done) {
    // Screen 51: PDF Created / Success
    return (
      <ScreenContainer scrollable={false} withPadding={false}>
        <ScreenHeader title="PDF Created" onBack={() => navigation.popToTop()} />

        <View style={styles.successContainer}>
          {/* Green checkmark circle */}
          <View style={styles.successCircle}>
            <Text style={styles.successCheck}>✅</Text>
          </View>

          <Text style={styles.successTitle}>PDF Created Successfully</Text>
          <Text style={styles.successSub}>Your document is ready.</Text>

          {/* File info card */}
          <View style={styles.fileCard}>
            <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.fileName}>My_Resume.pdf</Text>
              <Text style={styles.fileMeta}>PDF  •  2.4 MB  •  2 Pages</Text>
            </View>
          </View>

          {/* Action grid */}
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>⬇️</Text>
              <Text style={styles.actionLabel}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={styles.actionLabel}>Open PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.actionCard}>
              <Text style={styles.actionIcon}>✅</Text>
              <Text style={styles.actionLabel}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>Your document is saved on this device.</Text>
          </View>
        </View>

        <ResumeBottomNav active="tools" onNavigate={handleNavigation} />
      </ScreenContainer>
    );
  }

  // Screen 50: Processing
  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader title="Processing" onBack={() => navigation.goBack()} />

      <View style={styles.processingContainer}>
        {/* Circular Progress */}
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.circlePercent}>{progress}%</Text>
          </View>
        </View>

        <Text style={styles.processingTitle}>Creating your PDF...</Text>
        <Text style={styles.processingSub}>Please wait while we process your document.</Text>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{progress}% complete</Text>

        {/* Step indicators */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step, i) => {
            const isDone = i < activeStep;
            const isCurrent = i === activeStep;
            return (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepDot, isDone && styles.stepDotDone, isCurrent && styles.stepDotCurrent]}>
                  <Text style={styles.stepDotText}>{isDone ? '✓' : isCurrent ? '◉' : '○'}</Text>
                </View>
                <Text style={[styles.stepLabel, isDone && styles.stepLabelDone, isCurrent && styles.stepLabelCurrent]}>
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* File card */}
        <View style={styles.fileCard}>
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfBadgeText}>PDF</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.fileName}>My_Resume.pdf</Text>
            <Text style={styles.fileMeta}>2 pages</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⚠️</Text>
          <Text style={styles.infoText}>Do not close the app while processing.</Text>
        </View>
      </View>

      <ResumeBottomNav active="tools" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // Processing (Screen 50)
  processingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  circleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  circleInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercent: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563EB',
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  processingSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginBottom: 6,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  stepsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {},
  stepDotCurrent: {},
  stepDotText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  stepLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  stepLabelDone: {
    color: '#10B981',
  },
  stepLabelCurrent: {
    color: '#1E293B',
    fontWeight: '700',
  },

  // Success (Screen 51)
  successContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  successCheck: {
    fontSize: 44,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },

  // File card (shared)
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 20,
  },
  pdfBadge: {
    width: 38,
    height: 42,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  fileMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Action grid
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  actionCard: {
    width: '47%',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
});
