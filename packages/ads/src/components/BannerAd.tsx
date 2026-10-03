import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AdManager } from '../AdManager';

export interface BannerAdProps {
  placement?: string;
  style?: ViewStyle;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  placement = 'default_banner',
  style,
}) => {
  const adUnitId = AdManager.getBannerUnitId();

  // If ads are disabled or no ad unit is available, render nothing
  if (!adUnitId) {
    return null;
  }

  // In development / test mode or fallback: render a clean non-intrusive test banner
  return (
    <View style={[styles.container, style]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Ad</Text>
      </View>
      <Text style={styles.adText}>Test Banner Placement ({placement})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    backgroundColor: '#94a3b8',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  adText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },
});
