import { AppFeature } from '@dailyapps/config';

export const pdf_toolsToolCatalog: AppFeature[] = [
  {
    "id": "img_to_pdf",
    "title": "Images to PDF",
    "description": "Convert gallery photos and scans into a single PDF",
    "icon": "🖼️",
    "route": "ImagesToPdf",
    "category": "Convert",
    "isFeatured": true,
    "keywords": [
      "image",
      "photo",
      "pdf",
      "convert"
    ]
  },
  {
    "id": "merge_pdf",
    "title": "Merge PDF Files",
    "description": "Combine multiple PDF documents into one file",
    "icon": "📑",
    "route": "MergePdf",
    "category": "Edit",
    "keywords": [
      "merge",
      "combine",
      "join",
      "pdf"
    ]
  },
  {
    "id": "split_pdf",
    "title": "Split PDF",
    "description": "Extract specific pages or page ranges from a PDF",
    "icon": "✂️",
    "route": "SplitPdf",
    "category": "Edit",
    "keywords": [
      "split",
      "extract",
      "pages",
      "pdf"
    ]
  },
  {
    "id": "compress_pdf",
    "title": "Compress PDF",
    "description": "Reduce document file size while maintaining clarity",
    "icon": "🗜️",
    "route": "CompressPdf",
    "category": "Optimize",
    "keywords": [
      "compress",
      "reduce",
      "size",
      "pdf"
    ]
  },
  {
    "id": "scan_doc",
    "title": "Document Scanner",
    "description": "Capture documents using camera with edge detection",
    "icon": "📷",
    "route": "DocumentScanner",
    "category": "Scanner",
    "keywords": [
      "scan",
      "camera",
      "document",
      "ocr"
    ]
  },
  {
    "id": "pdf_viewer",
    "title": "Offline PDF Viewer",
    "description": "Read and bookmark PDF files on your device",
    "icon": "📖",
    "route": "PdfViewer",
    "category": "Reader",
    "keywords": [
      "view",
      "reader",
      "offline",
      "pdf"
    ]
  },
  {
    "id": "pdf_to_image",
    "title": "PDF to Image",
    "description": "Convert PDF pages to image files",
    "icon": "🖼️",
    "route": "PdfToImage",
    "category": "Convert",
    "keywords": ["pdf", "image", "convert"]
  },
  {
    "id": "rotate_pdf",
    "title": "Rotate PDF",
    "description": "Rotate selected PDF pages",
    "icon": "🔄",
    "route": "RotatePdf",
    "category": "Edit",
    "keywords": ["rotate", "pages", "pdf"]
  },
  {
    "id": "delete_pages",
    "title": "Delete Pages",
    "description": "Remove selected PDF pages",
    "icon": "🗑️",
    "route": "DeletePages",
    "category": "Edit",
    "keywords": ["delete", "pages", "pdf"]
  },
  {
    "id": "reorder_pages",
    "title": "Reorder Pages",
    "description": "Change the order of PDF pages",
    "icon": "☷",
    "route": "ReorderPages",
    "category": "Edit",
    "keywords": ["reorder", "pages", "pdf"]
  }
];
