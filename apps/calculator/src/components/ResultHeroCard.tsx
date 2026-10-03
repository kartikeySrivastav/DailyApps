import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { haptic } from '../utils/hapticUtils';

export interface SecondaryStat {
  label: string;
  value: string;
  color?: string;
}

export interface ResultHeroCardProps {
  title: string;
  value: string;
  subText?: string;
  badgeText?: string;
  badgeType?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  variant?: 'primary' | 'success' | 'danger' | 'accent';
  secondaryStats?: SecondaryStat[];
  style?: ViewStyle;
  showActions?: boolean;
  onCopy?: () => void;
  onShare?: () => void;
}

export const ResultHeroCard: React.FC<ResultHeroCardProps> = ({
  title,
  value,
  subText,
  badgeText,
  badgeType = 'default',
  variant = 'primary',
  secondaryStats,
  style,
  showActions = true,
  onCopy,
  onShare,
}) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  // Background and border colors based on variant
  const getCardStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.isDark ? '#064E3B' : '#ECFDF5',
          borderColor: theme.isDark ? '#059669' : '#A7F3D0',
          titleColor: theme.isDark ? '#A7F3D0' : '#047857',
          valueColor: theme.isDark ? '#FFFFFF' : '#065F46',
          subColor: theme.isDark ? '#D1FAE5' : '#065F46',
        };
      case 'danger':
        return {
          backgroundColor: theme.isDark ? '#7F1D1D' : '#FEF2F2',
          borderColor: theme.isDark ? '#DC2626' : '#FECACA',
          titleColor: theme.isDark ? '#FECACA' : '#B91C1C',
          valueColor: theme.isDark ? '#FFFFFF' : '#991B1B',
          subColor: theme.isDark ? '#FEE2E2' : '#991B1B',
        };
      case 'accent':
        return {
          backgroundColor: theme.isDark ? '#4C1D95' : '#F5F3FF',
          borderColor: theme.isDark ? '#7C3AED' : '#DDD6FE',
          titleColor: theme.isDark ? '#DDD6FE' : '#6D28D9',
          valueColor: theme.isDark ? '#FFFFFF' : '#5B21B6',
          subColor: theme.isDark ? '#EDE9FE' : '#5B21B6',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.isDark ? '#0B2347' : '#EFF6FF',
          borderColor: theme.isDark ? '#1D4ED8' : '#BFDBFE',
          titleColor: theme.isDark ? '#93C5FD' : '#1D4ED8',
          valueColor: theme.isDark ? '#FFFFFF' : '#1E40AF',
          subColor: theme.isDark ? '#DBEAFE' : '#2563EB',
        };
    }
  };

  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return {
          bg: theme.isDark ? 'rgba(16, 185, 129, 0.25)' : '#D1FAE5',
          text: theme.isDark ? '#6EE7B7' : '#047857',
        };
      case 'danger':
        return {
          bg: theme.isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
          text: theme.isDark ? '#FCA5A5' : '#B91C1C',
        };
      case 'warning':
        return {
          bg: theme.isDark ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7',
          text: theme.isDark ? '#FCD34D' : '#B45309',
        };
      case 'info':
      case 'default':
      default:
        return {
          bg: theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#DBEAFE',
          text: theme.isDark ? '#93C5FD' : '#1E40AF',
        };
    }
  };

  const handleCopy = () => {
    haptic.success();
    if (onCopy) {
      onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    haptic.selection();
    if (onShare) {
      onShare();
      return;
    }
    try {
      let message = `SmartCalc • ${title}\nPrimary Result: ${value}`;
      if (subText) message += ` (${subText})`;
      if (secondaryStats && secondaryStats.length > 0) {
        message += '\n\n' + secondaryStats.map((s) => `${s.label}: ${s.value}`).join('\n');
      }
      message += '\n\n— Calculated with SmartCalc All-in-One';
      await Share.share({ title: `SmartCalc: ${title}`, message });
    } catch {
      // Ignored
    }
  };

  const cardConfig = getCardStyle();
  const badgeConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardConfig.backgroundColor,
          borderColor: cardConfig.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.title, { color: cardConfig.titleColor }]}>
        {title.toUpperCase()}
      </Text>

      <Text
        style={[styles.value, { color: cardConfig.valueColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>

      {subText ? (
        <Text style={[styles.subText, { color: cardConfig.subColor }]}>
          {subText}
        </Text>
      ) : null}

      {badgeText ? (
        <View style={[styles.badgeContainer, { backgroundColor: badgeConfig.bg }]}>
          <Text style={[styles.badgeText, { color: badgeConfig.text }]}>
            {badgeText}
          </Text>
        </View>
      ) : null}

      {secondaryStats && secondaryStats.length > 0 ? (
        <View
          style={[
            styles.secondaryRow,
            secondaryStats.length > 3 && styles.secondaryGrid,
            { borderTopColor: cardConfig.borderColor },
          ]}
        >
          {secondaryStats.map((stat, idx) => (
            <View
              key={idx}
              style={[
                styles.secondaryItem,
                secondaryStats.length > 3 && styles.secondaryGridItem,
              ]}
            >
              <Text
                style={[
                  styles.secondaryLabel,
                  { color: cardConfig.titleColor },
                ]}
                numberOfLines={1}
              >
                {stat.label}
              </Text>
              <Text
                style={[
                  styles.secondaryValue,
                  { color: stat.color || cardConfig.valueColor },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Action buttons (Copy & Share) */}
      {showActions ? (
        <View style={[styles.actionRow, { borderTopColor: cardConfig.borderColor }]}>
          <TouchableOpacity
            onPress={handleCopy}
            activeOpacity={0.7}
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.6)',
                borderColor: cardConfig.borderColor,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: cardConfig.titleColor }]}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.6)',
                borderColor: cardConfig.borderColor,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: cardConfig.titleColor }]}>
              ↗ Share
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
    textAlign: 'center',
  },
  value: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginVertical: 4,
    textAlign: 'center',
  },
  subText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  badgeContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  secondaryGrid: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  secondaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  secondaryGridItem: {
    width: '50%',
    flex: undefined,
    paddingHorizontal: 8,
  },
  secondaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
