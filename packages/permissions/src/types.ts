export type PermissionKind =
  | 'camera'
  | 'media'
  | 'storage'
  | 'notifications'
  | 'microphone';

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export interface RequestPermissionOptions {
  title?: string;
  message?: string;
  buttonPositive?: string;
  buttonNegative?: string;
}
