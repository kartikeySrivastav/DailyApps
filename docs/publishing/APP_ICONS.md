# App Icons & Asset Standards

## 1. Overview

Every app requires Android adaptive icons and iOS icon suites designed to stand out on app store charts and home screens.

---

## 2. Icon Specifications

### Android Adaptive Icons
- **Canvas Size**: 108dp x 108dp with a 72dp safe zone circle.
- **Layers**:
  - `ic_launcher_background.xml`: Solid brand color or subtle gradient.
  - `ic_launcher_foreground.png`: Vector logo centered within 72dp.
- **Output Densities**:
  - `mipmap-mdpi`: 48x48
  - `mipmap-hdpi`: 72x72
  - `mipmap-xhdpi`: 96x96
  - `mipmap-xxhdpi`: 144x144
  - `mipmap-xxxhdpi`: 192x192
- **Play Store High-Res Icon**: 512x512 PNG, 32-bit with alpha channel, max 1024KB.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- Standard Android resource directories (`res/mipmap-*`) present in all 8 `android/app/src/main/res/`.
- Default launcher placeholder icons configured.

### TARGET
- Automated icon generation script taking a single master SVG and generating all mipmap densities and Play Store 512x512 icons automatically.

### GAP
- Master SVG logos need to be designed, and automated density export script to be added to `scripts/`.
