import { AppFeature } from '@dailyapps/config';

export const qr_barcodeToolCatalog: AppFeature[] = [
  {
    "id": "scan_camera",
    "title": "Live Camera Scanner",
    "description": "Instant camera scanning for QR codes and all barcode formats",
    "icon": "📷",
    "route": "CameraScanner",
    "category": "Scanner",
    "isFeatured": true,
    "keywords": [
      "scan",
      "qr",
      "barcode",
      "camera"
    ]
  },
  {
    "id": "generate_qr",
    "title": "QR Code Generator",
    "description": "Create QR codes for URLs, WiFi, contacts, text, and SMS",
    "icon": "⚡",
    "route": "QrGenerator",
    "category": "Generator",
    "keywords": [
      "create",
      "generator",
      "wifi",
      "vcard"
    ]
  },
  {
    "id": "scan_history",
    "title": "Scan & Creation History",
    "description": "Searchable archive of past scanned and generated codes",
    "icon": "🕒",
    "route": "ScanHistory",
    "category": "History",
    "keywords": [
      "history",
      "recent",
      "saved",
      "archive"
    ]
  },
  {
    "id": "batch_scanner",
    "title": "Batch Scan Mode",
    "description": "Scan multiple barcodes continuously without interruption",
    "icon": "📦",
    "route": "BatchScanner",
    "category": "Scanner",
    "keywords": [
      "batch",
      "inventory",
      "continuous"
    ]
  }
];
