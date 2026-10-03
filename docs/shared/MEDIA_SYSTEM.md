# Shared Media & File System (`@dailyapps/media`)

## 1. Overview

`@dailyapps/media` encapsulates cross-platform file picking, MIME type inference, byte formatting, and native sharing, isolating native file I/O from presentation layers.

---

## 2. API & Responsibilities

- **File Formatting**:
  - `formatFileSize(bytes)`: Formats raw bytes into human-readable strings (`1.4 MB`, `512 KB`).
- **MIME Detection**:
  - `getMimeType(filePath)`: Resolves MIME types for PDF, PNG, JPEG, SVG, CSV, JSON, TXT, etc.
  - `isImageMime(mime)`, `isPdfMime(mime)`: Helper predicates.
- **Native Sharing**:
  - `shareContent({ title, message, url })`: Invokes native system share sheet via React Native `Share`.
  - Fallback handling for platforms or environments without native share capabilities.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- File size formatter, MIME detection catalog, and native share abstraction implemented in `packages/media/src/index.ts`.
- Unit tests verified and passing.

### TARGET
- Cross-platform file picker integration (e.g. `react-native-document-picker` or `expo-document-picker`).
- Image picker integration for camera and gallery picking.
- Native file caching and temporary file cleanup utilities for PDF and Image tools.

### GAP
- Native file/image picker library linkage will be added when developing `pdf-tools`, `image-tools`, and `resume-maker`.
- Temporary directory cache clearing utilities to be implemented alongside file operations.
