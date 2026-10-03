#!/usr/bin/env node

/**
 * DailyApps — Independent App Build Runner
 * Usage: node scripts/build-app.js <appSlug> [debug|release] [aab|apk]
 * Example: node scripts/build-app.js calculator release aab
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const appSlug = args[0] || 'calculator';
const buildType = args[1] || 'debug';
const format = args[2] || (buildType === 'release' ? 'aab' : 'apk');

const appDir = path.resolve(__dirname, '..', 'apps', appSlug);
const androidDir = path.join(appDir, 'android');

if (!fs.existsSync(appDir)) {
  console.error(`Error: App "apps/${appSlug}" does not exist.`);
  process.exit(1);
}

if (!fs.existsSync(androidDir)) {
  console.error(`Error: Android project missing in "apps/${appSlug}/android".`);
  process.exit(1);
}

if (args.includes('--bundle') || buildType === 'bundle') {
  console.log(`=============================================`);
  console.log(`Bundling DailyApps: ${appSlug}`);
  console.log(`Target: Standalone Metro JS Bundle`);
  console.log(`=============================================\n`);

  const outDir = path.join(appDir, 'build');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'index.android.bundle');

  try {
    execSync(`npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output "${outFile}"`, {
      cwd: appDir,
      stdio: 'inherit',
    });
    console.log(`\n Bundle generated successfully at: ${outFile}`);
    process.exit(0);
  } catch (err) {
    console.error(`\n Bundle failed for ${appSlug}.`, err.message);
    process.exit(1);
  }
}

let gradleTask = '';
if (buildType === 'release') {
  gradleTask = format === 'aab' ? 'bundleRelease' : 'assembleRelease';
} else {
  gradleTask = format === 'aab' ? 'bundleDebug' : 'assembleDebug';
}

console.log(`=============================================`);
console.log(`Building DailyApps: ${appSlug}`);
console.log(`Target: Android (${buildType.toUpperCase()} - ${format.toUpperCase()})`);
console.log(`Task: ${gradleTask}`);
console.log(`=============================================\n`);

const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

try {
  execSync(`${gradlew} ${gradleTask}`, {
    cwd: androidDir,
    stdio: 'inherit',
  });
  console.log(`\n Build succeeded for ${appSlug}!`);
} catch (error) {
  console.error(`\n Build failed for ${appSlug}.`, error.message);
  process.exit(1);
}
