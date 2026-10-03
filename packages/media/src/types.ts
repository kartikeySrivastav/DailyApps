export interface PickedFile {
  uri: string;
  name: string;
  size: number;
  type: string;
}

export interface PickedImage extends PickedFile {
  width?: number;
  height?: number;
}

export interface ImagePickerOptions {
  allowsMultiple?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
}

export interface FilePickerOptions {
  allowedTypes?: string[];
  allowsMultiple?: boolean;
}
