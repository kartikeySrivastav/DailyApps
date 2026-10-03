import { PermissionsAndroid, Platform } from 'react-native';
import { PermissionKind, PermissionStatus, RequestPermissionOptions } from './types';

function getAndroidPermission(kind: PermissionKind): any {
  switch (kind) {
    case 'camera':
      return PermissionsAndroid.PERMISSIONS.CAMERA;
    case 'storage':
      return PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    case 'media':
      return (PermissionsAndroid.PERMISSIONS as any).READ_MEDIA_IMAGES ||
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    case 'notifications':
      return (PermissionsAndroid.PERMISSIONS as any).POST_NOTIFICATIONS;
    case 'microphone':
      return PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    default:
      return null;
  }
}

/**
 * Check if permission is currently granted.
 */
export async function checkPermission(kind: PermissionKind): Promise<boolean> {
  if (Platform.OS === 'android') {
    const perm = getAndroidPermission(kind);
    if (!perm) return true; // not required on this OS version
    return PermissionsAndroid.check(perm);
  }
  // On iOS or other platforms
  return true;
}

/**
 * Requests permission with user explanation rationale if needed.
 */
export async function requestPermission(
  kind: PermissionKind,
  options?: RequestPermissionOptions
): Promise<PermissionStatus> {
  if (Platform.OS === 'android') {
    const perm = getAndroidPermission(kind);
    if (!perm) return 'granted';

    try {
      const rationale = options
        ? {
            title: options.title || 'Permission Required',
            message: options.message || 'This tool requires permission to continue.',
            buttonPositive: options.buttonPositive || 'Allow',
            buttonNegative: options.buttonNegative || 'Cancel',
          }
        : undefined;

      const result = await PermissionsAndroid.request(perm, rationale);
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return 'granted';
      }
      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        return 'blocked';
      }
      return 'denied';
    } catch {
      return 'unavailable';
    }
  }

  return 'granted';
}
