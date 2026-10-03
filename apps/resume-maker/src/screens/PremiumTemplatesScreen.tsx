import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useAppStorage } from '@dailyapps/storage';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';
import { RESUME_TEMPLATES, BIODATA_TEMPLATES, TemplateMeta } from '../templates/templateCatalog';

interface Props {
  navigation: any;
}

const FEATURES = [
  { icon: '📄', label: '20+ Premium Resume Templates', bg: '#EFF6FF' },
  { icon: '💍', label: '10+ Royal Biodata Designs', bg: '#FDF2F8' },
  { icon: '⬇️', label: 'Unlimited PDF Downloads', bg: '#F0FDF4' },
  { icon: '🎨', label: 'Custom Color Themes', bg: '#FFF7ED' },
  { icon: '🤖', label: 'AI Content Suggestions', bg: '#EEF2FF' },
  { icon: '☁️', label: 'Cloud Backup & Sync', bg: '#F0F9FF' },
];

// Screen 52 & 53: Premium Templates + Purchase flow
export const PremiumTemplatesScreen: React.FC<Props> = ({ navigation }) => {
  const storage = useAppStorage();
  const [activeCategory, setActiveCategory] = useState<'resume' | 'biodata'>('resume');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);

  useEffect(() => {
    void storage.getItem('is_pro_unlocked').then((val) => {
      if (val === 'true') setIsProUnlocked(true);
    });
  }, [storage]);

  const premiumTemplates =
    activeCategory === 'resume'
      ? RESUME_TEMPLATES.filter((t) => t.isPremium)
      : BIODATA_TEMPLATES.filter((t) => t.isPremium);

  const handleUpgrade = () => {
    if (isProUnlocked) {
      Alert.alert('Pro Already Active! ⭐', 'You have full lifetime access to all premium templates.');
      return;
    }
    setShowPurchaseModal(true);
    setPurchaseSuccess(false);
  };

  const handleConfirmPurchase = async () => {
    await storage.setItem('is_pro_unlocked', 'true');
    setIsProUnlocked(true);
    setPurchaseSuccess(true);
  };

  const handleUseTemplate = (template: TemplateMeta) => {
    if (!isProUnlocked) {
      handleUpgrade();
      return;
    }
    if (activeCategory === 'biodata') {
      navigation.navigate('MarriageBiodataBuilder', {
        templateId: template.id,
      });
    } else {
      navigation.navigate('ResumeBuilder', {
        templateId: template.id,
      });
    }
  };

  const handleClosePurchase = () => {
    setShowPurchaseModal(false);
    setPurchaseSuccess(false);
  };

  const handleBottomNav = (tab: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: tab });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* ─── Screen 52: Header ─── */}
      <ScreenHeader
        title="Premium Templates"
        subtitle="Exclusive ATS & Matrimonial Designs"
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.proBadgeSmall}>
            <Text style={styles.proBadgeSmallText}>PRO</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ─── Hero Pricing Card ─── */}
        <View style={styles.pricingCard}>
          {/* Crown Icon */}
          <View style={styles.crownBox}>
            <Text style={{ fontSize: 36 }}>👑</Text>
          </View>
          <Text style={styles.pricingTitle}>Resume Maker Pro</Text>
          <Text style={styles.pricingTagline}>
            Everything you need to land your dream job
          </Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>₹499</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>80% OFF</Text>
            </View>
          </View>
          <Text style={styles.finalPrice}>₹99</Text>
          <Text style={styles.priceNote}>One-time payment • Lifetime access</Text>

          {/* CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUpgrade}
            style={styles.upgradeBtn}
          >
            <Text style={styles.upgradeBtnText}>✨ Unlock Premium Now</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Features List ─── */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What's Included</Text>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <View style={[styles.featureIconBox, { backgroundColor: f.bg }]}>
                <Text style={{ fontSize: 18 }}>{f.icon}</Text>
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <View style={styles.featureCheck}>
                <Text style={styles.featureCheckText}>✓</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ─── Category Toggle ─── */}
        <Text style={styles.sectionLabel}>PREVIEW PREMIUM TEMPLATES</Text>
        <View style={styles.toggleRow}>
          {(['resume', 'biodata'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.togglePill,
                activeCategory === cat && styles.activeTogglePill,
              ]}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  {
                    color: activeCategory === cat ? '#FFFFFF' : '#64748B',
                  },
                ]}
              >
                {cat === 'resume' ? '📄 Resume' : '💍 Biodata'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Premium Template Grid ─── */}
        {premiumTemplates.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Text style={{ fontSize: 28 }}>🔒</Text>
            </View>
            <Text style={styles.emptyTitle}>All Templates Locked</Text>
            <Text style={styles.emptySub}>
              Upgrade to see premium designs
            </Text>
          </View>
        ) : (
          <View style={styles.templateGrid}>
            {premiumTemplates.map((t) => (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.8}
                onPress={() => handleUseTemplate(t)}
                style={styles.templateCard}
              >
                {/* Lock or Unlocked Badge */}
                {!isProUnlocked ? (
                  <View style={styles.lockOverlay}>
                    <View style={styles.lockBadge}>
                      <Text style={{ fontSize: 18 }}>🔒</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedBadgeText}>✓ UNLOCKED</Text>
                  </View>
                )}

                {/* Template Thumbnail Mockup */}
                <View style={[styles.thumbBox, { backgroundColor: t.accentColor + '15' }]}>
                  <View style={[styles.thumbAccentBar, { backgroundColor: t.accentColor }]} />
                  <View style={styles.thumbLines}>
                    <View style={[styles.thumbLine, { backgroundColor: t.accentColor + '40', width: '80%' }]} />
                    <View style={[styles.thumbLine, { backgroundColor: '#E2E8F0', width: '60%' }]} />
                    <View style={[styles.thumbLine, { backgroundColor: '#E2E8F0', width: '90%' }]} />
                    <View style={[styles.thumbLine, { backgroundColor: '#E2E8F0', width: '70%' }]} />
                  </View>
                </View>

                {/* Info */}
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName} numberOfLines={1}>
                    {t.name}
                  </Text>
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>PRO</Text>
                  </View>
                </View>
                <Text style={styles.templateStyle}>
                  {(t as any).style || 'Premium'} Design
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Testimonials ─── */}
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.testimonialQuote}>
            "Got my dream job thanks to these premium templates. The ATS optimization really works!"
          </Text>
          <Text style={styles.testimonialAuthor}>— Rahul K., Software Engineer</Text>
        </View>

        {/* ─── Bottom CTA ─── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUpgrade}
          style={styles.bottomCta}
        >
          <Text style={styles.bottomCtaText}>Get Premium — ₹99 Only</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          🔒 Secure payment • 7-day money back guarantee
        </Text>

      </ScrollView>

      {/* ─── Bottom Nav ─── */}
      <ResumeBottomNav active="templates" onNavigate={handleBottomNav} />

      {/* ─── Screen 53: Premium Purchase Modal ─── */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={handleClosePurchase}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!purchaseSuccess ? (
              /* ── Purchase Confirmation ── */
              <>
                <View style={styles.modalCrownBox}>
                  <Text style={{ fontSize: 42 }}>👑</Text>
                </View>
                <Text style={styles.modalTitle}>Upgrade to Premium</Text>
                <Text style={styles.modalSub}>
                  Unlock all premium templates, unlimited exports, and AI-powered suggestions.
                </Text>

                <View style={styles.modalPriceBox}>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalOriginal}>₹499</Text>
                    <Text style={styles.modalFinal}>₹99</Text>
                  </View>
                  <Text style={styles.modalPriceSub}>One-time purchase • Lifetime access</Text>
                </View>

                {/* Feature checklist */}
                <View style={styles.modalFeatures}>
                  {['All premium templates', 'Unlimited PDF exports', 'AI content suggestions', 'Custom color themes', 'Priority support'].map((f) => (
                    <View key={f} style={styles.modalFeatureRow}>
                      <View style={styles.modalCheckCircle}>
                        <Text style={styles.modalCheckText}>✓</Text>
                      </View>
                      <Text style={styles.modalFeatureLabel}>{f}</Text>
                    </View>
                  ))}
                </View>

                {/* Buy CTA */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConfirmPurchase}
                  style={styles.modalBuyBtn}
                >
                  <Text style={styles.modalBuyText}>Buy Now — ₹99</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleClosePurchase}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Maybe Later</Text>
                </TouchableOpacity>

                <Text style={styles.modalGuarantee}>
                  🔒 Secure • 7-day money back guarantee
                </Text>
              </>
            ) : (
              /* ── Purchase Success ── */
              <>
                <View style={styles.successIconCircle}>
                  <Text style={{ fontSize: 42 }}>🎉</Text>
                </View>
                <Text style={styles.modalTitle}>Welcome to Premium!</Text>
                <Text style={styles.modalSub}>
                  You now have full access to all premium templates and features. Enjoy!
                </Text>

                <View style={styles.successFeatures}>
                  {['All templates unlocked', 'Unlimited PDF exports', 'AI suggestions active'].map((f) => (
                    <View key={f} style={styles.successRow}>
                      <Text style={styles.successCheck}>✓</Text>
                      <Text style={styles.successLabel}>{f}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleClosePurchase}
                  style={styles.modalBuyBtn}
                >
                  <Text style={styles.modalBuyText}>Start Exploring →</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // ── Scroll ──
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  // ── PRO badge (header right) ──
  proBadgeSmall: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proBadgeSmallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // ── Pricing Card ──
  pricingCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    elevation: 6,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    marginBottom: 16,
  },
  crownBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pricingTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  pricingTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  originalPrice: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  finalPrice: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  priceNote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 20,
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // ── Features Card ──
  featuresCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheckText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '800',
  },

  // ── Section Label ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
    color: '#64748B',
  },

  // ── Toggle ──
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    backgroundColor: '#F1F5F9',
  },
  togglePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTogglePill: {
    backgroundColor: '#2563EB',
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Empty State ──
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  // ── Template Grid ──
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  templateCard: {
    width: '47.5%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },
  unlockedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  thumbBox: {
    height: 120,
    padding: 8,
  },
  thumbAccentBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  thumbLines: {
    gap: 6,
  },
  thumbLine: {
    height: 6,
    borderRadius: 3,
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 6,
  },
  templateName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  templateStyle: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: '#64748B',
  },

  // ── Testimonial ──
  testimonialCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E2F7',
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialStars: {
    fontSize: 16,
    marginBottom: 10,
  },
  testimonialQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },

  // ── Bottom CTA ──
  bottomCta: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  bottomCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    color: '#64748B',
  },

  // ── Screen 53: Purchase Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
  },
  modalCrownBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 280,
  },
  modalPriceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  modalOriginal: {
    color: '#94A3B8',
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  modalFinal: {
    color: '#1E293B',
    fontSize: 32,
    fontWeight: '900',
  },
  modalPriceSub: {
    color: '#64748B',
    fontSize: 12,
  },
  modalFeatures: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  modalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCheckText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
  modalFeatureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  modalBuyBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  modalBuyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalCancelBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D6E2F7',
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  modalGuarantee: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 12,
  },

  // ── Purchase Success ──
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successFeatures: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successCheck: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '800',
  },
  successLabel: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
  },
});
