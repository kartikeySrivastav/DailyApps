#!/usr/bin/env node

/**
 * DailyApps — Icon & Splash Generation Helper
 * Explains and validates app-specific icon assets.
 * Usage: node scripts/generate-icons.js <appSlug>
 */

const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const appSlug = args[0] || 'calculator';

const appDir = path.resolve(__dirname, '..', 'apps', appSlug);
const storeDir = path.join(appDir, 'store');
const assetsDir = path.join(storeDir, 'assets');

if (!fs.existsSync(appDir)) {
  console.error(`App "apps/${appSlug}" not found.`);
  process.exit(1);
}

fs.mkdirSync(assetsDir, { recursive: true });

console.log(`
App Icon & Splash Asset Guide for: ${appSlug}
=============================================
Required files in apps/${appSlug}/store/assets/:
1. icon-source.png         (1024x1024 px, 32-bit PNG, no transparency for Play Store)
2. icon-foreground.png     (432x432 px, transparent background for Android Adaptive Icon)
3. icon-background.png     (432x432 px, solid color or pattern)
4. feature-graphic.png     (1024x500 px, JPG or 24-bit PNG, Google Play header)
5. splash-logo.png         (512x512 px)

Standard Android Output Destinations:
- apps/${appSlug}/android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
- apps/${appSlug}/android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
- apps/${appSlug}/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
- apps/${appSlug}/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
- apps/${appSlug}/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)

To generate automatically from icon-source.png, you can run:
npx @bam.tech/react-native-make set-icon --path ./store/assets/icon-source.png
`);
