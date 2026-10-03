import { AppFeature } from '@dailyapps/config';

export const image_toolsToolCatalog: AppFeature[] = [
  {
    "id": "compress_img",
    "title": "Compress Image",
    "description": "Reduce photo file size to exact target KB/MB",
    "icon": "📉",
    "route": "CompressImage",
    "category": "Optimize",
    "isFeatured": true,
    "keywords": [
      "compress",
      "kb",
      "reduce",
      "photo"
    ]
  },
  {
    "id": "resize_img",
    "title": "Resize Dimensions",
    "description": "Scale images to custom pixel dimensions and aspect ratios",
    "icon": "📐",
    "route": "ResizeImage",
    "category": "Edit",
    "keywords": [
      "resize",
      "pixels",
      "scale",
      "dimensions"
    ]
  },
  {
    "id": "crop_img",
    "title": "Crop & Rotate",
    "description": "Crop photos with freeform or standard social media ratios",
    "icon": "✂️",
    "route": "CropImage",
    "category": "Edit",
    "keywords": [
      "crop",
      "rotate",
      "aspect",
      "square"
    ]
  },
  {
    "id": "format_converter",
    "title": "Format Converter",
    "description": "Convert between PNG, JPG, and WebP formats",
    "icon": "🔄",
    "route": "FormatConverter",
    "category": "Convert",
    "keywords": [
      "png",
      "jpg",
      "webp",
      "convert"
    ]
  },
  {
    "id": "exif_remover",
    "title": "EXIF & Privacy Cleaner",
    "description": "Strip GPS location and camera metadata from photos",
    "icon": "🛡️",
    "route": "ExifCleaner",
    "category": "Privacy",
    "keywords": [
      "exif",
      "metadata",
      "gps",
      "privacy"
    ]
  }
];
