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
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { getFilePickerAdapter } from '@dailyapps/media';
import { checkPermission, requestPermission } from '@dailyapps/permissions';

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
    fallbackIcon: '👨‍💻',
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
  const [activeTab, setActiveTab] = useState<'device' | 'portraits' | 'url' | 'logos' | 'monogram'>('device');
  const [inputUrl, setInputUrl] = useState<string>(
    currentPhotoUri?.startsWith('http') || currentPhotoUri?.startsWith('file://')
      ? currentPhotoUri
      : ''
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUri || '');
  const [selectedColor, setSelectedColor] = useState<string>('#2563EB');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const initials =
    candidateName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'RS';

  const isRemoteImage = (uri?: string) =>
    uri?.startsWith('http://') ||
    uri?.startsWith('https://') ||
    uri?.startsWith('file://') ||
    uri?.startsWith('data:') ||
    uri?.startsWith('content://');

  // ─── CAMERA CAPTURE HANDLER ───
  const handleLaunchCamera = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // 1. Native adapter if registered
      const adapter = getFilePickerAdapter();
      if (adapter && typeof adapter.takePhoto === 'function') {
        const hasPerm = await checkPermission('camera');
        if (!hasPerm) {
          const res = await requestPermission('camera', {
            title: 'Camera Permission',
            message: 'Camera access is required to take your profile headshot.',
            buttonPositive: 'Allow Camera',
            buttonNegative: 'Cancel',
          });
          if (res !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission was not granted.');
            setIsLoading(false);
            return;
          }
        }

        const picked = await adapter.takePhoto({ quality: 0.85, maxWidth: 800, maxHeight: 800 });
        if (picked?.uri) {
          setSelectedPhoto(picked.uri);
          setInputUrl(picked.uri);
          setStatusMessage('✓ Camera photo captured successfully');
          setIsLoading(false);
          return;
        }
      }

      // 2. Web / Browser fallback (HTML5 camera capture input)
      const globalDoc: any = typeof globalThis !== 'undefined' ? (globalThis as any).document : null;
      const GlobalFileReader: any = typeof globalThis !== 'undefined' ? (globalThis as any).FileReader : null;
      if (globalDoc && GlobalFileReader) {
        const input = globalDoc.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.setAttribute('capture', 'user'); // Triggers front camera on mobile/tablet browsers
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            const reader = new GlobalFileReader();
            reader.onload = (loadEvent: any) => {
              const dataUri = loadEvent.target?.result as string;
              if (dataUri) {
                setSelectedPhoto(dataUri);
                setInputUrl(dataUri);
                setStatusMessage(`✓ Photo captured (${file.name || 'camera_snap.jpg'})`);
              }
              setIsLoading(false);
            };
            reader.onerror = () => {
              Alert.alert('Capture Error', 'Could not read camera capture stream.');
              setIsLoading(false);
            };
            reader.readAsDataURL(file);
          } else {
            setIsLoading(false);
          }
        };
        input.click();
        return;
      }

      Alert.alert(
        'Camera Ready',
        'Please select a photo from your gallery, paste an image link, or choose an executive headshot preset.'
      );
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Unable to open camera.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── FILE / GALLERY PICKER HANDLER ───
  const handleLaunchFilePicker = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // 1. Native adapter if registered
      const adapter = getFilePickerAdapter();
      if (adapter && typeof adapter.pickImage === 'function') {
        const hasPerm = await checkPermission('media');
        if (!hasPerm) {
          const res = await requestPermission('media', {
            title: 'Photos & Files Access',
            message: 'Access is needed to select your resume photo from your device.',
            buttonPositive: 'Allow Access',
            buttonNegative: 'Cancel',
          });
          if (res !== 'granted') {
            Alert.alert('Permission Denied', 'Device storage permission was not granted.');
            setIsLoading(false);
            return;
          }
        }

        const picked = await adapter.pickImage({ quality: 0.85, maxWidth: 800, maxHeight: 800 });
        if (picked?.uri) {
          setSelectedPhoto(picked.uri);
          setInputUrl(picked.uri);
          setStatusMessage('✓ Photo loaded from device storage');
          setIsLoading(false);
          return;
        }
      }

      // 2. Web / Browser fallback (HTML5 file dialog)
      const globalDoc: any = typeof globalThis !== 'undefined' ? (globalThis as any).document : null;
      const GlobalFileReader: any = typeof globalThis !== 'undefined' ? (globalThis as any).FileReader : null;
      if (globalDoc && GlobalFileReader) {
        const input = globalDoc.createElement('input');
        input.type = 'file';
        input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/heic';
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            const reader = new GlobalFileReader();
            reader.onload = (loadEvent: any) => {
              const dataUri = loadEvent.target?.result as string;
              if (dataUri) {
                setSelectedPhoto(dataUri);
                setInputUrl(dataUri);
                setStatusMessage(`✓ Loaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
              }
              setIsLoading(false);
            };
            reader.onerror = () => {
              Alert.alert('File Error', 'Could not read image file.');
              setIsLoading(false);
            };
            reader.readAsDataURL(file);
          } else {
            setIsLoading(false);
          }
        };
        input.click();
        return;
      }

      Alert.alert(
        'File Selector Ready',
        'Please enter or paste your image file path or URL in the Upload tab.'
      );
    } catch (err: any) {
      Alert.alert('File Selector Error', err?.message || 'Unable to open file selector.');
    } finally {
      setIsLoading(false);
    }
  };

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
        Alert.alert('Selection Needed', 'Please select or capture a photo first.');
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
    setStatusMessage('Photo cleared');
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
                Photo & Profile Image Manager
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Capture via camera, select from device, or choose curated portraits
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
                {statusMessage || (selectedPhoto ? 'Photo selected • Ready to apply' : 'No custom photo selected yet')}
              </Text>
              {selectedPhoto ? (
                <View style={styles.badgeRow}>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>✓ Photo Ready</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Quick Clear Button if photo is loaded */}
            {selectedPhoto ? (
              <TouchableOpacity
                onPress={() => {
                  setSelectedPhoto('');
                  setInputUrl('');
                  setStatusMessage('Photo cleared');
                }}
                style={styles.inlineClearBtn}
              >
                <Text style={styles.inlineClearText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Quick Capture Action Bar (Camera + Device File) */}
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLaunchCamera}
              disabled={isLoading}
              style={[styles.primaryActionBtn, { backgroundColor: '#2563EB' }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryActionIcon}>📸</Text>
                  <Text style={styles.primaryActionText}>Take Photo (Camera)</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLaunchFilePicker}
              disabled={isLoading}
              style={[styles.primaryActionBtn, { backgroundColor: '#4F46E5' }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryActionIcon}>📁</Text>
                  <Text style={styles.primaryActionText}>Choose File / Gallery</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* 5 Tabs: [ Device | Portraits | URL/File | Logos | Monogram ] */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('device')}
              style={[styles.tabBtn, activeTab === 'device' && styles.activeTabBtn]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'device' ? '#2563EB' : theme.colors.textMuted },
                ]}
              >
                Device / Cam
              </Text>
            </TouchableOpacity>

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
                URL / Path
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

          {/* TAB 0: Device / Camera Tab Content */}
          {activeTab === 'device' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.deviceBox}>
              <View style={[styles.infoBanner, { backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF' }]}>
                <Text style={styles.infoBannerIcon}>💡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoBannerTitle, { color: theme.colors.text }]}>
                    High-Resolution Headshot Tips
                  </Text>
                  <Text style={[styles.infoBannerBody, { color: theme.colors.textMuted }]}>
                    Use good front lighting, maintain a neutral or friendly smile, and keep your face centered. Supports JPG, PNG, WebP up to 15 MB.
                  </Text>
                </View>
              </View>

              <View style={styles.deviceOptionsGrid}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleLaunchCamera}
                  style={[styles.deviceOptionCard, { borderColor: theme.colors.border }]}
                >
                  <Text style={{ fontSize: 32 }}>📸</Text>
                  <Text style={[styles.deviceOptionTitle, { color: theme.colors.text }]}>
                    Take Selfie / Headshot
                  </Text>
                  <Text style={[styles.deviceOptionSub, { color: theme.colors.textMuted }]}>
                    Opens front camera to snap a live executive portrait
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleLaunchFilePicker}
                  style={[styles.deviceOptionCard, { borderColor: theme.colors.border }]}
                >
                  <Text style={{ fontSize: 32 }}>🖼️</Text>
                  <Text style={[styles.deviceOptionTitle, { color: theme.colors.text }]}>
                    Select from Gallery
                  </Text>
                  <Text style={[styles.deviceOptionSub, { color: theme.colors.textMuted }]}>
                    Pick any high-res picture or scanned photo from phone/PC
                  </Text>
                </TouchableOpacity>
              </View>

              {statusMessage ? (
                <View style={styles.statusToast}>
                  <Text style={styles.statusToastText}>{statusMessage}</Text>
                </View>
              ) : null}
            </ScrollView>
          )}

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
                    onPress={() => {
                      setSelectedPhoto(item.url);
                      setStatusMessage(`Selected: ${item.label}`);
                    }}
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
                Image URL or Local Storage File Path
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
                    setStatusMessage('Applied Executive Headshot demo');
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
                    setStatusMessage('Applied Corporate Headshot demo');
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
                    onPress={() => {
                      setSelectedPhoto(logo.code);
                      setStatusMessage(`Selected Logo: ${logo.label}`);
                    }}
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
            {currentPhotoUri || selectedPhoto ? (
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
              <Text style={styles.applyBtnText}>Apply Photo to Document</Text>
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
    maxHeight: '92%',
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
    marginBottom: 12,
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
    marginBottom: 12,
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
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  activePill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  inlineClearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  inlineClearText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryActionIcon: {
    fontSize: 16,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 12,
    fontWeight: '700',
  },
  deviceBox: {
    paddingVertical: 6,
    gap: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  infoBannerIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  infoBannerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  infoBannerBody: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  deviceOptionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  deviceOptionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 6,
  },
  deviceOptionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  deviceOptionSub: {
    fontSize: 10.5,
    lineHeight: 14,
    textAlign: 'center',
  },
  statusToast: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusToastText: {
    color: '#059669',
    fontSize: 12,
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
