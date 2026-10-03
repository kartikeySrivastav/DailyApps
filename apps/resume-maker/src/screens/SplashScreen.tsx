import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';

interface SplashScreenProps {
  navigation?: any;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation, onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onFinish) {
        onFinish();
      } else if (navigation) {
        navigation.replace('MainTabs');
      }
    });
  }, [fadeAnim, navigation, onFinish, progressAnim, scaleAnim]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* Decorative gradient overlay glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Card */}
        <View style={styles.logoCard}>
          <View style={styles.docShape}>
            <View style={styles.docFold} />
            <View style={styles.docLineLong} />
            <View style={styles.docLineShort} />
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeIcon}>✓</Text>
            </View>
          </View>
        </View>

        {/* Brand Name */}
        <Text style={styles.brandTitle}>ProResume Builder</Text>
        <Text style={styles.brandTagline}>Smart Tools for a Better You</Text>

        {/* Progress Loading Bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, { width: progressBarWidth }]}
          />
        </View>
      </Animated.View>

      {/* Bottom Product Info */}
      <View style={styles.bottomFooter}>
        <Text style={styles.productName}>Resume & Biodata Maker</Text>
        <Text style={styles.productFeatures}>
          Create • Edit • Download • Share
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#3730A3',
    opacity: 0.35,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#4338CA',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    marginBottom: 20,
  },
  docShape: {
    width: 46,
    height: 58,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    padding: 8,
    justifyContent: 'space-between',
    position: 'relative',
  },
  docFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderBottomLeftRadius: 6,
    backgroundColor: '#60A5FA',
  },
  docLineLong: {
    width: '70%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
    marginTop: 4,
  },
  docLineShort: {
    width: '50%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
  },
  docBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 14,
    color: '#C7D2FE',
    fontWeight: '500',
    marginBottom: 28,
  },
  progressTrack: {
    width: 160,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productFeatures: {
    fontSize: 12,
    color: '#A5B4FC',
    fontWeight: '500',
  },
});
