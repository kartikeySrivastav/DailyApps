/**
 * Generates a unique temporary filename with an optional extension.
 */
export function generateTempFilename(prefix: string = 'dailyapp', extension: string = 'tmp'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = extension.startsWith('.') ? extension.slice(1) : extension;
  return `${prefix}_${timestamp}_${random}.${ext}`;
}

/**
 * Sanitizes a filename by stripping invalid filesystem characters.
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[/\\?%*:|"<>]/g, '_').trim();
}

/**
 * Extract filename from a URI or path.
 */
export function getFilenameFromUri(uri: string): string {
  return uri.split('/').pop()?.split('\\').pop() || 'file';
}
