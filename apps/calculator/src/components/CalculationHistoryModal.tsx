import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { CalculationRecord } from '../types/history.types';

interface CalculationHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  records?: CalculationRecord[];
  history?: CalculationRecord[];
  onSelectRecord?: (record: CalculationRecord) => void;
  onSelect?: (record: CalculationRecord) => void;
  onClearAll?: () => void;
  onDeleteItem?: (id: string) => void;
  toolName?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CalculationHistoryModal: React.FC<CalculationHistoryModalProps> = ({
  visible,
  onClose,
  title = 'Calculation History',
  subtitle,
  records,
  history,
  onSelectRecord,
  onSelect,
  onClearAll,
  onDeleteItem,
  toolName,
}) => {
  const theme = useTheme();
  const displayRecords = records || history || [];
  const handleSelect = onSelectRecord || onSelect;
  const rawTitle = toolName ? `${toolName} History` : title;
  const modalTitle =
    rawTitle
      .replace(/Calculator History/i, 'History')
      .replace(/Calculator/i, '')
      .replace(/& Loss/i, '')
      .trim() || 'History';

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceCard,
              borderTopColor: theme.colors.borderSubtle,
            },
          ]}
        >
              {/* Drag Handle Indicator */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handleBar,
                    { backgroundColor: theme.colors.borderSubtle },
                  ]}
                />
              </View>

              {/* Header */}
              <View
                style={[
                  styles.headerRow,
                  { borderBottomColor: theme.colors.borderSubtle },
                ]}
              >
                <View style={styles.headerLeft}>
                  <View
                    style={[
                      styles.clockBadge,
                      {
                        backgroundColor: theme.isDark
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(37, 99, 235, 0.12)',
                      },
                    ]}
                  >
                    <Text style={styles.clockIcon}>🕒</Text>
                  </View>
                  <View style={styles.titleWrap}>
                    <View style={styles.titleWithCount}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.title, { color: theme.colors.text }]}
                      >
                        {modalTitle}
                      </Text>
                      {displayRecords.length > 0 && (
                        <View
                          style={[
                            styles.countBadge,
                            {
                              backgroundColor: theme.isDark
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(37, 99, 235, 0.12)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.countText,
                              { color: theme.colors.primary },
                            ]}
                          >
                            {displayRecords.length}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[styles.subtitle, { color: theme.colors.textMuted }]}
                    >
                      {subtitle || `${displayRecords.length} saved calculation${displayRecords.length === 1 ? '' : 's'}`}
                    </Text>
                  </View>
                </View>

                {/* Header Actions */}
                <View style={styles.headerActions}>
                  {displayRecords.length > 0 && onClearAll && (
                    <TouchableOpacity
                      onPress={onClearAll}
                      style={[
                        styles.clearBtn,
                        {
                          backgroundColor: theme.isDark
                            ? 'rgba(239, 68, 68, 0.18)'
                            : 'rgba(239, 68, 68, 0.12)',
                          borderColor: theme.isDark
                            ? 'rgba(239, 68, 68, 0.35)'
                            : 'rgba(239, 68, 68, 0.25)',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={onClose}
                    style={[
                      styles.closeBtn,
                      {
                        backgroundColor: theme.colors.surfaceSubtle,
                        borderColor: theme.colors.borderSubtle,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.closeText, { color: theme.colors.text }]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content List */}
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {displayRecords.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View
                      style={[
                        styles.emptyIconCircle,
                        { backgroundColor: theme.colors.surfaceSubtle },
                      ]}
                    >
                      <Text style={styles.emptyIcon}>🕒</Text>
                    </View>
                    <Text
                      style={[styles.emptyTitle, { color: theme.colors.text }]}
                    >
                      No History Yet
                    </Text>
                    <Text
                      style={[
                        styles.emptyDesc,
                        { color: theme.colors.textMuted },
                      ]}
                    >
                      Your calculations and setups will automatically save here so
                      you can review and re-apply them anytime.
                    </Text>
                  </View>
                ) : (
                  displayRecords.map((item) => {
                    const isLoss =
                      item.badge === 'LOSS' ||
                      item.result.startsWith('-') ||
                      item.title.toLowerCase().includes('loss');
                    const isProfit =
                      item.badge === 'PROFIT' ||
                      item.result.startsWith('+') ||
                      item.badge === 'POSSIBLE' ||
                      item.badge === 'SAFE';

                    const badgeBg = isLoss
                      ? theme.isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2'
                      : isProfit
                      ? theme.isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5'
                      : theme.isDark ? 'rgba(59, 130, 246, 0.18)' : '#EFF6FF';

                    const badgeBorder = isLoss
                      ? theme.isDark ? 'rgba(239, 68, 68, 0.35)' : '#FECACA'
                      : isProfit
                      ? theme.isDark ? 'rgba(16, 185, 129, 0.35)' : '#A7F3D0'
                      : theme.isDark ? 'rgba(59, 130, 246, 0.35)' : '#BFDBFE';

                    const badgeTextColor = isLoss
                      ? '#EF4444'
                      : isProfit
                      ? '#10B981'
                      : theme.isDark ? '#60A5FA' : '#2563EB';

                    const boxBg = isLoss
                      ? theme.isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2'
                      : isProfit
                      ? theme.isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5'
                      : theme.isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF';

                    const boxBorder = isLoss
                      ? theme.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA'
                      : isProfit
                      ? theme.isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'
                      : theme.isDark ? 'rgba(59, 130, 246, 0.25)' : '#BFDBFE';

                    const valColor = isLoss
                      ? '#EF4444'
                      : isProfit
                      ? '#10B981'
                      : theme.colors.text;

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.card,
                          {
                            backgroundColor: theme.colors.surfaceSubtle,
                            borderColor: theme.colors.borderSubtle,
                          },
                        ]}
                      >
                        {/* Card Top Row: Badge + Time */}
                        <View style={styles.cardHeader}>
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: badgeBg,
                                borderColor: badgeBorder,
                              },
                            ]}
                          >
                            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                              {item.badge || item.category || 'CALC'}
                            </Text>
                          </View>
                          <View style={styles.timeDeleteRow}>
                            <Text
                              style={[
                                styles.timeText,
                                { color: theme.colors.textMuted },
                              ]}
                            >
                              {formatTimestamp(item.timestamp)}
                            </Text>
                            {onDeleteItem && (
                              <TouchableOpacity
                                onPress={() => onDeleteItem(item.id)}
                                style={styles.deleteBtn}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Text
                                  style={[
                                    styles.deleteIcon,
                                    { color: theme.colors.textMuted },
                                  ]}
                                >
                                  ✕
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>

                        {/* Title & Subtitle */}
                        <Text
                          style={[styles.cardTitle, { color: theme.colors.text }]}
                        >
                          {item.title}
                        </Text>
                        {item.subtitle ? (
                          <Text
                            style={[
                              styles.cardSubtitle,
                              { color: theme.colors.textMuted },
                            ]}
                          >
                            {item.subtitle}
                          </Text>
                        ) : null}

                        {/* Result Box */}
                        <View
                          style={[
                            styles.resultBox,
                            {
                              backgroundColor: boxBg,
                              borderColor: boxBorder,
                            },
                          ]}
                        >
                          <Text style={[styles.resultValue, { color: valColor }]}>
                            {item.result}
                          </Text>
                          {item.secondaryResult ? (
                            <Text
                              style={[
                                styles.secondaryResult,
                                { color: theme.colors.textMuted },
                              ]}
                            >
                              {item.secondaryResult}
                            </Text>
                          ) : null}
                        </View>

                        {/* Tap to Use Action */}
                        {handleSelect && (
                          <TouchableOpacity
                            onPress={() => {
                              handleSelect(item);
                              onClose();
                            }}
                            style={[
                              styles.useBtn,
                              {
                                backgroundColor: theme.isDark
                                  ? 'rgba(59, 130, 246, 0.12)'
                                  : 'rgba(37, 99, 235, 0.08)',
                                borderColor: theme.isDark
                                  ? 'rgba(59, 130, 246, 0.25)'
                                  : 'rgba(37, 99, 235, 0.2)',
                              },
                            ]}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.useBtnText}>Tap to use setup ↗</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.78,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 24 : 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  clockBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  clockIcon: {
    fontSize: 18,
  },
  titleWrap: {
    flex: 1,
  },
  titleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    flexShrink: 0,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeDeleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  resultBox: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryResult: {
    fontSize: 12,
    marginTop: 2,
  },
  useBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  useBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});
