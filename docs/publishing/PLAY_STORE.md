# Google Play Store Publishing Strategy

## 1. Overview

Every app in DailyApps is distributed as an independent listing on the Google Play Store to maximize discoverability, category ranking, and targeted ASO (App Store Optimization).

---

## 2. Store Assets & Metadata Structure

Each app contains a dedicated `store/` directory:
```text
apps/<app>/store/
├── assets/
│   ├── icon-512x512.png           # High-resolution app icon
│   └── feature-graphic-1024x500.png # Google Play feature graphic
├── screenshots/
│   ├── phone/                     # Minimum 4 phone screenshots (1080x1920 or 1080x2400)
│   └── tablet/                    # 7-inch & 10-inch screenshots (optional)
└── metadata.md                    # Listing title, short description, full description, keywords
```

### Store Metadata Standards
- **App Title**: Max 30 characters (e.g. `Daily Calculator - Fast & Clean`).
- **Short Description**: Max 80 characters highlighting primary value proposition.
- **Full Description**: Max 4000 characters detailing features, offline capability, privacy, and free utility.
- **Content Rating**: Target "Everyone" / PEGI 3.

---

## 3. CURRENT vs TARGET vs GAP

### CURRENT
- `store/` folder structure created for all 8 apps.
- `metadata.md` template with app-specific titles, categories, privacy policy placeholders, and planned features configured for each app.

### TARGET
- High-resolution 512x512 app icons and 1024x500 feature graphics generated for all apps.
- Localized translations (Spanish, Hindi, French, German) for top markets.

### GAP
- Production graphic assets (icons, feature graphics, screenshots) need visual design rendering prior to upload.
