import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
export const isWeb = Platform.OS === 'web';
export const platformVersion = Platform.Version;

export function selectPlatform<T>(options: {
  android?: T;
  ios?: T;
  web?: T;
  default: T;
}): T {
  if (isAndroid && options.android !== undefined) return options.android;
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isWeb && options.web !== undefined) return options.web;
  return options.default;
}
