import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
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

export const PhotoUploadModal: React.FC<Props> = ({
  visible,
  onClose,
  currentPhotoUri,
  candidateName = 'Rahul Sharma',
  onSavePhoto,
}) => {
  const theme = useTheme();

  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUri || '');
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<string | null>(null);

  // Sync state with current prop on modal open
  useEffect(() => {
    setSelectedPhoto(currentPhotoUri || '');
    setZoom(1.0);
    setRotation(0);
    setFileDetails(null);
  }, [currentPhotoUri, visible]);

  const initials =
    candidateName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'CV';

  const isMonogram = selectedPhoto.startsWith('monogram:');
  const hasPhoto = Boolean(selectedPhoto) && !isMonogram;

  // ─── 1. CAMERA CAPTURE HANDLER ───
  const handleLaunchCamera = async () => {
    setIsLoading(true);
    setFileDetails(null);

    try {
      // Native adapter if registered
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

        const picked = await adapter.takePhoto({ quality: 0.88, maxWidth: 1000, maxHeight: 1000 });
        if (picked?.uri) {
          setSelectedPhoto(picked.uri);
          setFileDetails('Photo captured with camera');
          setZoom(1.0);
          setRotation(0);
          setIsLoading(false);
          return;
        }
      }

      // Web / Browser DOM fallback
      const globalDoc: any = typeof globalThis !== 'undefined' ? (globalThis as any).document : null;
      const GlobalFileReader: any = typeof globalThis !== 'undefined' ? (globalThis as any).FileReader : null;
      if (globalDoc && GlobalFileReader) {
        const input = globalDoc.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.setAttribute('capture', 'user'); // Front-facing selfie camera
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            const reader = new GlobalFileReader();
            reader.onload = (loadEvent: any) => {
              const dataUri = loadEvent.target?.result as string;
              if (dataUri) {
                setSelectedPhoto(dataUri);
                setFileDetails(`Camera snap (${Math.round(file.size / 1024)} KB)`);
                setZoom(1.0);
                setRotation(0);
              }
              setIsLoading(false);
            };
            reader.onerror = () => {
              Alert.alert('Capture Error', 'Could not process camera capture.');
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
        'Camera is not directly supported in this preview mode. Please select a photo from your files.'
      );
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Unable to open camera.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. FILE / GALLERY SELECTOR HANDLER ───
  const handleLaunchFilePicker = async () => {
    setIsLoading(true);
    setFileDetails(null);

    try {
      // Native adapter if registered
      const adapter = getFilePickerAdapter();
      if (adapter && typeof adapter.pickImage === 'function') {
        const hasPerm = await checkPermission('media');
        if (!hasPerm) {
          const res = await requestPermission('media', {
            title: 'Photos Access',
            message: 'Access is needed to select your resume photo from your device.',
            buttonPositive: 'Allow Access',
            buttonNegative: 'Cancel',
          });
          if (res !== 'granted') {
            Alert.alert('Permission Denied', 'Storage access was not granted.');
            setIsLoading(false);
            return;
          }
        }

        const picked = await adapter.pickImage({ quality: 0.88, maxWidth: 1000, maxHeight: 1000 });
        if (picked?.uri) {
          setSelectedPhoto(picked.uri);
          setFileDetails('Image loaded from gallery');
          setZoom(1.0);
          setRotation(0);
          setIsLoading(false);
          return;
        }
      }

      // Web / Browser DOM fallback
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
                setFileDetails(`${file.name} (${Math.round(file.size / 1024)} KB)`);
                setZoom(1.0);
                setRotation(0);
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

      Alert.alert('File Picker', 'Unable to open file selector in this environment.');
    } catch (err: any) {
      Alert.alert('File Picker Error', err?.message || 'Unable to open file picker.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 3. REMOVE PHOTO (CLEAR) ───
  const handleRemovePhoto = () => {
    setSelectedPhoto('');
    setFileDetails(null);
    setZoom(1.0);
    setRotation(0);
  };

  // ─── 4. USE MONOGRAM INITIALS (NO PHOTO) ───
  const handleUseMonogram = () => {
    setSelectedPhoto(`monogram:${initials}:#2563EB`);
    setFileDetails('Monogram initials selected (No photo)');
  };

  // ─── 5. APPLY PHOTO ───
  const handleApply = () => {
    onSavePhoto(selectedPhoto);
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
          {/* Top Handle */}
          <View style={styles.handle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Profile Photo</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Add a professional headshot from your device or camera
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <Text style={[styles.closeBtnText, { color: theme.colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* ─── Circular Photo Preview Card ─── */}
            <View
              style={[
                styles.previewBox,
                { backgroundColor: theme.isDark ? '#0F172A' : '#F8FAFC' },
              ]}
            >
              <View
                style={[
                  styles.circleWrapper,
                  {
                    borderColor: hasPhoto ? '#2563EB' : theme.colors.border,
                    backgroundColor: theme.isDark ? '#1E293B' : '#E2E8F0',
                  },
                ]}
              >
                {hasPhoto ? (
                  <Image
                    source={{ uri: selectedPhoto }}
                    style={[
                      styles.avatarImage,
                      {
                        transform: [{ scale: zoom }, { rotate: `${rotation}deg` }],
                      },
                    ]}
                    resizeMode="cover"
                  />
                ) : isMonogram ? (
                  <View style={styles.monogramBadge}>
                    <Text style={styles.monogramInitials}>{initials}</Text>
                  </View>
                ) : (
                  <View style={styles.emptyPlaceholder}>
                    <Text style={{ fontSize: 38 }}>👤</Text>
                    <Text style={[styles.emptyLabel, { color: theme.colors.textMuted }]}>
                      No Photo
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.candidateLabel, { color: theme.colors.text }]}>
                {candidateName}
              </Text>

              {fileDetails ? (
                <View style={styles.fileDetailsPill}>
                  <Text style={styles.fileDetailsText}>✓ {fileDetails}</Text>
                </View>
              ) : (
                <Text style={[styles.hintText, { color: theme.colors.textMuted }]}>
                  {hasPhoto
                    ? 'Looks great! Adjust zoom or rotation below.'
                    : 'A professional portrait increases profile views by 40%'}
                </Text>
              )}
            </View>

            {/* ─── Two Primary Upload Action Buttons ─── */}
            <View style={styles.uploadButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLaunchFilePicker}
                disabled={isLoading}
                style={[styles.actionBtn, styles.primaryUploadBtn]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.actionBtnIcon}>📁</Text>
                    <View>
                      <Text style={styles.primaryBtnTitle}>Upload Photo</Text>
                      <Text style={styles.primaryBtnSub}>From Gallery or Files</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLaunchCamera}
                disabled={isLoading}
                style={[styles.actionBtn, styles.cameraBtn, { borderColor: theme.colors.border }]}
              >
                <Text style={styles.actionBtnIcon}>📸</Text>
                <View>
                  <Text style={[styles.secondaryBtnTitle, { color: theme.colors.text }]}>
                    Take Photo
                  </Text>
                  <Text style={[styles.secondaryBtnSub, { color: theme.colors.textMuted }]}>
                    Open Camera
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ─── Adjustments Bar (Zoom, Rotate, Remove) — Only when photo is present ─── */}
            {hasPhoto && (
              <View
                style={[
                  styles.adjustmentsCard,
                  {
                    backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.adjustmentsTitle, { color: theme.colors.text }]}>
                  Adjust Portrait:
                </Text>

                <View style={styles.adjustRow}>
                  {/* Zoom Out */}
                  <TouchableOpacity
                    onPress={() => setZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(1))))}
                    style={[styles.toolBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.toolBtnText, { color: theme.colors.text }]}>🔍 −</Text>
                  </TouchableOpacity>

                  {/* Zoom Level Readout */}
                  <View style={styles.zoomReadout}>
                    <Text style={[styles.zoomReadoutText, { color: theme.colors.textMuted }]}>
                      {Math.round(zoom * 100)}%
                    </Text>
                  </View>

                  {/* Zoom In */}
                  <TouchableOpacity
                    onPress={() => setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(1))))}
                    style={[styles.toolBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.toolBtnText, { color: theme.colors.text }]}>🔍 +</Text>
                  </TouchableOpacity>

                  {/* Rotate 90 deg */}
                  <TouchableOpacity
                    onPress={() => setRotation((r) => (r + 90) % 360)}
                    style={[styles.toolBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.toolBtnText, { color: theme.colors.text }]}>🔄 Rotate</Text>
                  </TouchableOpacity>

                  {/* Remove */}
                  <TouchableOpacity
                    onPress={handleRemovePhoto}
                    style={[styles.toolBtn, styles.removeToolBtn]}
                  >
                    <Text style={styles.removeToolText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ─── ATS Friendly / Text-Only Resume Option ─── */}
            <View style={styles.altOptionCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleUseMonogram}
                style={[
                  styles.altOptionBtn,
                  isMonogram && styles.altOptionBtnActive,
                  { borderColor: isMonogram ? '#2563EB' : theme.colors.border },
                ]}
              >
                <Text style={{ fontSize: 20 }}>👤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.altOptionTitle, { color: theme.colors.text }]}>
                    Use Initials Monogram ({initials})
                  </Text>
                  <Text style={[styles.altOptionSub, { color: theme.colors.textMuted }]}>
                    Recommended for strict ATS parsers that prefer text-only CVs
                  </Text>
                </View>
                {isMonogram ? <Text style={styles.checkIcon}>✓</Text> : null}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* ─── Bottom Actions Footer ─── */}
          <View style={styles.footerRow}>
            {selectedPhoto ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRemovePhoto}
                style={[styles.cancelBtn, { borderColor: '#EF4444' }]}
              >
                <Text style={styles.removeActionText}>Clear Photo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: theme.colors.border }]}
              >
                <Text style={[styles.cancelText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleApply}
              style={[styles.applyBtn, { backgroundColor: '#2563EB' }]}
            >
              <Text style={styles.applyBtnText}>
                {selectedPhoto ? 'Save Photo to Document' : 'Keep Text Only'}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    paddingBottom: 10,
    gap: 16,
  },
  previewBox: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  circleWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  monogramBadge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramInitials: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  candidateLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  fileDetailsPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  fileDetailsText: {
    color: '#059669',
    fontSize: 11.5,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 11.5,
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  primaryUploadBtn: {
    backgroundColor: '#2563EB',
    elevation: 3,
  },
  cameraBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  actionBtnIcon: {
    fontSize: 22,
  },
  primaryBtnTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryBtnSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10.5,
    marginTop: 1,
  },
  secondaryBtnTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtnSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  adjustmentsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  adjustmentsTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  zoomReadout: {
    paddingHorizontal: 6,
  },
  zoomReadoutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  removeToolBtn: {
    marginLeft: 'auto',
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  removeToolText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  altOptionCard: {
    marginTop: 2,
  },
  altOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  altOptionBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  altOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  altOptionSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  checkIcon: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  removeActionText: {
    color: '#DC2626',
    fontSize: 13.5,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
