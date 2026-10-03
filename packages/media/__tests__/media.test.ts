import {
  getMimeType,
  getExtensionFromMime,
  generateTempFilename,
  sanitizeFilename,
} from '../src';

describe('@dailyapps/media', () => {
  it('detects MIME types properly', () => {
    expect(getMimeType('document.pdf')).toBe('application/pdf');
    expect(getMimeType('photo.png')).toBe('image/png');
    expect(getMimeType('data.json')).toBe('application/json');
    expect(getMimeType('unknown')).toBe('application/octet-stream');
  });

  it('maps MIME types back to file extensions', () => {
    expect(getExtensionFromMime('application/pdf')).toBe('pdf');
    expect(getExtensionFromMime('image/jpeg')).toBe('jpg');
  });

  it('generates unique temporary filenames', () => {
    const fn1 = generateTempFilename('scan', 'pdf');
    const fn2 = generateTempFilename('scan', 'pdf');
    expect(fn1.startsWith('scan_')).toBe(true);
    expect(fn1.endsWith('.pdf')).toBe(true);
    expect(fn1).not.toBe(fn2);
  });

  it('sanitizes unsafe filenames', () => {
    expect(sanitizeFilename('file/name:test?.pdf')).toBe('file_name_test_.pdf');
  });
});
