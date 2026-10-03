import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentPhotoUri?: string;
  candidateName?: string;
  onSavePhoto: (photoUri: string) => void;
}

// Curated high-resolution professional executive headshots
const PROFESSIONAL_PORTRAITS = [
  {
    id: 'port_tech_m',
    label: 'Tech Lead (M)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👨‍💻',
  },
  {
    id: 'port_exec_f',
    label: 'Executive (F)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👩‍💼',
  },
  {
    id: 'port_dev_m',
    label: 'Developer (M)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👨‍💼',
  },
  {
    id: 'port_des_f',
    label: 'Product Designer (F)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👩‍🎨',
  },
  {
    id: 'port_corp_m',
    label: 'Corporate Manager (M)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👔',
  },
  {
    id: 'port_grad_f',
    label: 'Graduate (F)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '🎓',
  },
  {
    id: 'port_groom',
    label: 'Traditional Groom',
    url: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '🤵',
  },
  {
    id: 'port_bride',
    label: 'Traditional Bride',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80',
    fallbackIcon: '👰',
  },
];

// Company and organization logos
const COMPANY_LOGOS = [
  { id: 'logo_tech', label: 'Tech Stack', icon: '💻', code: 'logo:tech' },
  { id: 'logo_corp', label: 'Enterprise HQ', icon: '🏢', code: 'logo:corp' },
  { id: 'logo_univ', label: 'University Seal', icon: '🏛️', code: 'logo:univ' },
  { id: 'logo_cloud', label: 'Cloud Systems', icon: '☁️', code: 'logo:cloud' },
  { id: 'logo_shield', label: 'Security Crest', icon: '🛡️', code: 'logo:shield' },
  { id: 'logo_startup', label: 'Startup Rocket', icon: '🚀', code: 'logo:startup' },
  { id: 'logo_finance', label: 'Finance & Bank', icon: '⚖️', code: 'logo:finance' },
  { id: 'logo_creative', label: 'Creative Studio', icon: '🎨', code: 'logo:creative' },
];

const MONOGRAM_COLORS = [
  { id: 'blue', bg: '#2563EB', text: '#FFFFFF', label: 'Royal Blue' },
  { id: 'navy', bg: '#0F172A', text: '#FFFFFF', label: 'Dark Navy' },
  { id: 'emerald', bg: '#059669', text: '#FFFFFF', label: 'Emerald' },
  { id: 'purple', bg: '#7C3AED', text: '#FFFFFF', label: 'Violet' },
  { id: 'maroon', bg: '#991B1B', text: '#FFFFFF', label: 'Maroon' },
  { id: 'slate', bg: '#475569', text: '#FFFFFF', label: 'Slate' },
];

export const PhotoUploadModal: React.FC<Props> = ({
  visible,
  onClose,
  currentPhotoUri,
  candidateName = 'Rahul Sharma',
  onSavePhoto,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'url' | 'portraits' | 'logos' | 'monogram'>('portraits');
  const [inputUrl, setInputUrl] = useState<string>(
    currentPhotoUri?.startsWith('http') || currentPhotoUri?.startsWith('file://')
      ? currentPhotoUri
      : ''
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUri || '');
  const [selectedColor, setSelectedColor] = useState<string>('#2563EB');

  const initials =
    candidateName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'RS';

  const isRemoteImage = (uri?: string) =>
    uri?.startsWith('http://') || uri?.startsWith('https://') || uri?.startsWith('file://') || uri?.startsWith('data:');

  const handleApply = () => {
    if (activeTab === 'url') {
      if (!inputUrl.trim()) {
        Alert.alert('Empty URL', 'Please enter or paste an image link or local file URI.');
        return;
      }
      onSavePhoto(inputUrl.trim());
    } else if (activeTab === 'monogram') {
      onSavePhoto(`monogram:${initials}:${selectedColor}`);
    } else {
      if (!selectedPhoto) {
        Alert.alert('Selection Needed', 'Please select a photo or logo.');
        return;
      }
      onSavePhoto(selectedPhoto);
    }
    onClose();
  };

  const handleRemove = () => {
    onSavePhoto('');
    setSelectedPhoto('');
    setInputUrl('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border },
          ]}
        >
          {/* Top Sheet Handle */}
          <View style={styles.handle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Photo & Logo Manager
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Select photo or corporate logo for your resume & biodata
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ fontSize: 20, color: theme.colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Live Photo / Logo Preview Card */}
          <View
            style={[
              styles.previewContainer,
              { backgroundColor: theme.isDark ? '#0F172A' : '#F8FAFC' },
            ]}
          >
            <View style={styles.previewCircle}>
              {activeTab === 'url' && isRemoteImage(inputUrl) ? (
                <Image
                  source={{ uri: inputUrl }}
                  style={styles.previewImg}
                  resizeMode="cover"
                />
              ) : activeTab === 'monogram' ? (
                <View style={[styles.monogramCircle, { backgroundColor: selectedColor }]}>
                  <Text style={styles.monogramText}>{initials}</Text>
                </View>
              ) : isRemoteImage(selectedPhoto) ? (
                <Image
                  source={{ uri: selectedPhoto }}
                  style={styles.previewImg}
                  resizeMode="cover"
                />
              ) : selectedPhoto.startsWith('logo:') ? (
                <Text style={{ fontSize: 36 }}>
                  {COMPANY_LOGOS.find((l) => l.code === selectedPhoto)?.icon || '🏢'}
                </Text>
              ) : selectedPhoto.startsWith('monogram:') ? (
                <View style={[styles.monogramCircle, { backgroundColor: selectedColor }]}>
                  <Text style={styles.monogramText}>{initials}</Text>
                </View>
              ) : selectedPhoto ? (
                <Text style={{ fontSize: 36 }}>{selectedPhoto}</Text>
              ) : (
                <View style={[styles.monogramCircle, { backgroundColor: '#2563EB' }]}>
                  <Text style={styles.monogramText}>{initials}</Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.previewHeading, { color: theme.colors.text }]} numberOfLines={1}>
                {candidateName}
              </Text>
              <Text style={[styles.previewSub, { color: theme.colors.textMuted }]}>
                Visible in template headers, live preview & PDF downloads
              </Text>
            </View>
          </View>

          {/* 4 Tabs: [ Headshots | File/URL | Logos | Monogram ] */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('portraits')}
              style={[styles.tabBtn, activeTab === 'portraits' && styles.activeTabBtn]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'portraits' ? '#2563EB' : theme.colors.textMuted },
                ]}
              >
                Portraits
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('url')}
              style={[styles.tabBtn, activeTab === 'url' && styles.activeTabBtn]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'url' ? '#2563EB' : theme.colors.textMuted },
                ]}
              >
                Upload / URL
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('logos')}
              style={[styles.tabBtn, activeTab === 'logos' && styles.activeTabBtn]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'logos' ? '#2563EB' : theme.colors.textMuted },
                ]}
              >
                Logos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('monogram')}
              style={[styles.tabBtn, activeTab === 'monogram' && styles.activeTabBtn]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'monogram' ? '#2563EB' : theme.colors.textMuted },
                ]}
              >
                Monogram
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: Professional Portraits */}
          {activeTab === 'portraits' && (
            <ScrollView
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
            >
              {PROFESSIONAL_PORTRAITS.map((item) => {
                const isSelected = selectedPhoto === item.url;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedPhoto(item.url)}
                    style={[
                      styles.portraitCard,
                      {
                        backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isSelected ? '#2563EB' : theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={styles.portraitImg}
                      resizeMode="cover"
                    />
                    <Text
                      style={[
                        styles.portraitLabel,
                        { color: isSelected ? '#2563EB' : theme.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* TAB 2: Upload / URL / Local File Path */}
          {activeTab === 'url' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.urlBox}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Image URL or Local File Path
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.isDark ? '#0F172A' : '#F8FAFC',
                  },
                ]}
                value={inputUrl}
                onChangeText={(text) => {
                  setInputUrl(text);
                  setSelectedPhoto(text);
                }}
                placeholder="https://example.com/photo.jpg or file:///sdcard/photo.jpg"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
              />

              {/* Quick Preset Buttons */}
              <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>
                Quick Demo Presets:
              </Text>
              <View style={styles.quickRow}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    const sample = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                    setInputUrl(sample);
                    setSelectedPhoto(sample);
                  }}
                  style={[styles.quickChip, { borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.quickChipText, { color: theme.colors.text }]}>
                    👔 Executive Headshot
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    const sample = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400';
                    setInputUrl(sample);
                    setSelectedPhoto(sample);
                  }}
                  style={[styles.quickChip, { borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.quickChipText, { color: theme.colors.text }]}>
                    👩‍💼 Corporate Headshot
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.helpText, { color: theme.colors.textMuted, marginTop: 8 }]}>
                Paste any publicly accessible PNG, JPG, or WebP photo URL, or your local phone file URI.
              </Text>
            </ScrollView>
          )}

          {/* TAB 3: Company / Organization Logos */}
          {activeTab === 'logos' && (
            <ScrollView
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
            >
              {COMPANY_LOGOS.map((logo) => {
                const isSelected = selectedPhoto === logo.code;
                return (
                  <TouchableOpacity
                    key={logo.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedPhoto(logo.code)}
                    style={[
                      styles.logoCard,
                      {
                        backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isSelected ? '#2563EB' : theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 32 }}>{logo.icon}</Text>
                    <Text
                      style={[
                        styles.logoLabel,
                        { color: isSelected ? '#2563EB' : theme.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {logo.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* TAB 4: Monogram Initials */}
          {activeTab === 'monogram' && (
            <View style={styles.monogramBox}>
              <View style={[styles.monogramLargeCircle, { backgroundColor: selectedColor }]}>
                <Text style={styles.monogramLargeText}>{initials}</Text>
              </View>

              <Text style={[styles.inputLabel, { color: theme.colors.text, marginTop: 14 }]}>
                Select Monogram Badge Accent:
              </Text>

              <View style={styles.colorRow}>
                {MONOGRAM_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedColor(c.bg)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c.bg },
                      selectedColor === c.bg && styles.colorDotActive,
                    ]}
                  />
                ))}
              </View>

              <Text style={[styles.helpText, { color: theme.colors.textMuted, marginTop: 10 }]}>
                Generates a clean, modern corporate badge using candidate initials.
              </Text>
            </View>
          )}

          {/* Modal Action Buttons: [ Remove ] & [ Apply Photo ] */}
          <View style={styles.btnRow}>
            {currentPhotoUri ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRemove}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>Remove Photo</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleApply}
              style={styles.applyBtn}
            >
              <Text style={styles.applyBtnText}>Apply to Resume</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    padding: 20,
    maxHeight: '90%',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  previewCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  previewHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  previewSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  monogramCircle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  monogramLargeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  monogramLargeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  monogramBox: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: '#2563EB',
  },
  tabBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 6,
    maxHeight: 220,
  },
  portraitCard: {
    width: '22.5%',
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  portraitImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  portraitLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoCard: {
    width: '22.5%',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  urlBox: {
    paddingVertical: 10,
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13.5,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 11,
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  removeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 13.5,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
