import { PickedFile, PickedImage, FilePickerOptions, ImagePickerOptions } from './types';

export interface FilePickerAdapter {
  pickFile(options?: FilePickerOptions): Promise<PickedFile | null>;
  pickFiles(options?: FilePickerOptions): Promise<PickedFile[]>;
  pickImage(options?: ImagePickerOptions): Promise<PickedImage | null>;
  takePhoto(options?: ImagePickerOptions): Promise<PickedImage | null>;
}

let activeAdapter: FilePickerAdapter | null = null;

export function registerFilePickerAdapter(adapter: FilePickerAdapter): void {
  activeAdapter = adapter;
}

export function getFilePickerAdapter(): FilePickerAdapter | null {
  return activeAdapter;
}
