import { Share } from 'react-native';

/**
 * Share text, message or URL using native OS share dialog.
 */
export async function shareContent(options: {
  title?: string;
  message: string;
  url?: string;
}): Promise<boolean> {
  try {
    const result = await Share.share({
      title: options.title,
      message: options.message,
      url: options.url,
    });
    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Failed to share content:', error);
    return false;
  }
}
