const fs = require('fs');
const path = require('path');

// 1x1 valid blue PNG buffer
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(pngBase64, 'base64');

const apps = [
  'calculator',
  'resume-maker',
  'productivity',
  'pdf-tools',
  'image-tools',
  'money-manager',
  'student-toolkit',
  'qr-barcode'
];

const densities = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#4F46E5</color>
</resources>
`;

const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

const foregroundDrawableXml = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M30,30h48v48h-48z"/>
</vector>
`;

apps.forEach(app => {
  const resDir = path.resolve(__dirname, '..', 'apps', app, 'android', 'app', 'src', 'main', 'res');
  if (!fs.existsSync(resDir)) return;

  // 1. values/colors.xml
  const valuesDir = path.join(resDir, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml);

  // 2. drawable/ic_launcher_foreground.xml
  const drawableDir = path.join(resDir, 'drawable');
  fs.mkdirSync(drawableDir, { recursive: true });
  fs.writeFileSync(path.join(drawableDir, 'ic_launcher_foreground.xml'), foregroundDrawableXml);

  // 3. mipmap-anydpi-v26
  const anydpiDir = path.join(resDir, 'mipmap-anydpi-v26');
  fs.mkdirSync(anydpiDir, { recursive: true });
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveIconXml);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveIconXml);

  // 4. densities
  densities.forEach(density => {
    const densityDir = path.join(resDir, density);
    fs.mkdirSync(densityDir, { recursive: true });
    fs.writeFileSync(path.join(densityDir, 'ic_launcher.png'), pngBuffer);
    fs.writeFileSync(path.join(densityDir, 'ic_launcher_round.png'), pngBuffer);
  });

  console.log(`Icons setup for ${app}`);
});
