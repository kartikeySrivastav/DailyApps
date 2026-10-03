#!/usr/bin/env node

/**
 * DailyApps — Comprehensive App Scaffolder CLI
 * Usage: node scripts/create-app.js <app-slug> <DisplayName> [brandColorHex]
 * Example: node scripts/create-app.js habit-tracker "Habit Tracker" "#10b981"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(`
DailyApps Scaffolder
====================
Usage:
  node scripts/create-app.js <app-slug> <DisplayName> [brandColorHex]

Examples:
  node scripts/create-app.js habits "Habit Tracker" "#10b981"
  node scripts/create-app.js notes "Daily Notes" "#f59e0b"
  `);
  process.exit(1);
}

const appSlug = args[0].toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
const displayName = args[1].trim();
const brandColor = args[2] || '#0284c7';
const packageName = `com.dailyapps.${appSlug.replace(/-/g, '')}`;
const appPascal =
  'Daily' +
  appSlug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

const targetDir = path.resolve(__dirname, '..', 'apps', appSlug);

if (fs.existsSync(targetDir)) {
  console.error(`Error: App directory "apps/${appSlug}" already exists!`);
  process.exit(1);
}

console.log(`Scaffolding new isolated app: ${displayName}`);
console.log(`- Folder: apps/${appSlug}`);
console.log(`- Package ID: ${packageName}`);
console.log(`- Brand Color: ${brandColor}\n`);

// Create folder structure
fs.mkdirSync(path.join(targetDir, 'src', 'config'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'src', 'screens'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'src', 'navigation'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'store', 'screenshots'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'store', 'assets'), { recursive: true });

const androidJavaDir = path.join(
  targetDir,
  'android',
  'app',
  'src',
  'main',
  'java',
  'com',
  'dailyapps',
  appSlug.replace(/-/g, '')
);
const androidResDir = path.join(
  targetDir,
  'android',
  'app',
  'src',
  'main',
  'res',
  'values'
);
fs.mkdirSync(androidJavaDir, { recursive: true });
fs.mkdirSync(androidResDir, { recursive: true });

// 1. package.json
const packageJson = {
  name: `@dailyapps/app-${appSlug}`,
  version: '1.0.0',
  private: true,
  main: 'index.js',
  scripts: {
    start: 'react-native start',
    android: 'react-native run-android',
    'build:android': 'cd android && gradlew.bat assembleDebug',
    typecheck: 'tsc --noEmit',
  },
  dependencies: {
    '@dailyapps/ads': '*',
    '@dailyapps/analytics': '*',
    '@dailyapps/config': '*',
    '@dailyapps/media': '*',
    '@dailyapps/navigation': '*',
    '@dailyapps/permissions': '*',
    '@dailyapps/storage': '*',
    '@dailyapps/theme': '*',
    '@dailyapps/ui': '*',
    '@dailyapps/utils': '*',
    '@react-native-async-storage/async-storage': '^2.1.2',
    '@react-navigation/native': '^7.0.14',
    '@react-navigation/native-stack': '^7.2.0',
    react: '18.3.1',
    'react-native': '0.76.6',
    'react-native-safe-area-context': '^5.2.0',
    'react-native-screens': '^4.6.0',
  },
};
fs.writeFileSync(
  path.join(targetDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// 2. tsconfig.json
const tsConfig = {
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    rootDir: 'src',
    outDir: 'dist',
    jsx: 'react-native',
    baseUrl: '.',
    paths: {
      '@dailyapps/*': ['../../packages/*/src'],
    },
  },
  include: ['src/**/*', 'index.js'],
};
fs.writeFileSync(
  path.join(targetDir, 'tsconfig.json'),
  JSON.stringify(tsConfig, null, 2)
);

// 3. babel.config.js
fs.writeFileSync(
  path.join(targetDir, 'babel.config.js'),
  `module.exports = {\n  presets: ['module:@react-native/babel-preset'],\n};\n`
);

// 4. metro.config.js
const metroConfig = `const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

const assetRegistryPath = path.resolve(
  workspaceRoot,
  'node_modules/@react-native/assets-registry/registry.js'
);

const config = {
  watchFolders: [workspaceRoot],
  transformer: {
    assetRegistryPath,
  },
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      'react-native/asset-registry': assetRegistryPath,
      '@dailyapps/config': path.resolve(workspaceRoot, 'packages/config/src'),
      '@dailyapps/theme': path.resolve(workspaceRoot, 'packages/theme/src'),
      '@dailyapps/utils': path.resolve(workspaceRoot, 'packages/utils/src'),
      '@dailyapps/storage': path.resolve(workspaceRoot, 'packages/storage/src'),
      '@dailyapps/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
      '@dailyapps/navigation': path.resolve(workspaceRoot, 'packages/navigation/src'),
      '@dailyapps/ads': path.resolve(workspaceRoot, 'packages/ads/src'),
      '@dailyapps/analytics': path.resolve(workspaceRoot, 'packages/analytics/src'),
      '@dailyapps/permissions': path.resolve(workspaceRoot, 'packages/permissions/src'),
      '@dailyapps/media': path.resolve(workspaceRoot, 'packages/media/src'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
`;
fs.writeFileSync(path.join(targetDir, 'metro.config.js'), metroConfig);

// 5. index.js
fs.writeFileSync(
  path.join(targetDir, 'index.js'),
  `import { AppRegistry } from 'react-native';\nimport App from './src/App';\n\nAppRegistry.registerComponent('${appPascal}', () => App);\n`
);

// 6. toolCatalog.ts
const toolCatalogContent = `import { AppFeature } from '@dailyapps/config';

export const ${appSlug.replace(/-/g, '_')}ToolCatalog: AppFeature[] = [
  {
    id: 'tool_1',
    title: 'First Tool',
    description: 'Main feature description for ${displayName}',
    icon: '⚡',
    route: 'MainTool',
    category: 'General',
    isFeatured: true,
  },
];
`;
fs.writeFileSync(
  path.join(targetDir, 'src', 'config', 'toolCatalog.ts'),
  toolCatalogContent
);

// 7. app.config.ts
const appConfigContent = `import { defineAppConfig, AppConfig } from '@dailyapps/config';
import { ${appSlug.replace(/-/g, '_')}ToolCatalog } from './toolCatalog';

export const ${appSlug.replace(/-/g, '')}Config: AppConfig = defineAppConfig({
  appId: '${appSlug}',
  appName: '${appSlug}',
  displayName: '${displayName}',
  packageName: '${packageName}',
  bundleId: '${packageName}',
  version: '1.0.0',
  buildNumber: 1,
  theme: {
    brandColor: '${brandColor}',
    defaultMode: 'system',
  },
  features: ${appSlug.replace(/-/g, '_')}ToolCatalog,
  ads: {
    enabled: true,
    testMode: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  storeMetadata: {
    appName: '${displayName}',
    shortDescription: '${displayName} utility app by DailyApps',
    fullDescription: '${displayName} is a focused, lightweight utility app.',
    category: 'Productivity',
    contentRating: 'Everyone',
    privacyPolicyUrl: 'https://dailyapps.dev/privacy/${appSlug}',
    supportEmail: 'support@dailyapps.dev',
  },
});
`;
fs.writeFileSync(
  path.join(targetDir, 'src', 'config', 'app.config.ts'),
  appConfigContent
);

// 8. HomeScreen.tsx
const homeScreenContent = `import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { DynamicHomeScreen } from '@dailyapps/ui';
import { useTheme, useThemeContext } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { BannerAd } from '@dailyapps/ads';
import { AppFeature } from '@dailyapps/config';
import { ${appSlug.replace(/-/g, '')}Config } from '../config/app.config';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const storage = useAppStorage();
  const analytics = useAnalytics();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    async function loadPreferences() {
      const favs = await storage.getFavorites();
      const rec = await storage.getRecentTools();
      setFavorites(favs);
      setRecents(rec);
    }
    loadPreferences();
    analytics.logScreenView('${appPascal}Home');
  }, [storage, analytics]);

  const handleSelectFeature = async (feature: AppFeature) => {
    analytics.logToolOpened(feature.id, { tool_name: feature.title });
    const updatedRecents = await storage.addRecentTool(feature.id);
    setRecents(updatedRecents);
    navigation.navigate(feature.route, { feature });
  };

  const handleToggleFavorite = async (featureId: string) => {
    const updated = await storage.toggleFavorite(featureId);
    setFavorites(updated);
  };

  return (
    <DynamicHomeScreen
      appName={${appSlug.replace(/-/g, '')}Config.displayName}
      subtitle="${displayName} Utilities"
      features={${appSlug.replace(/-/g, '')}Config.features}
      favoriteIds={favorites}
      recentIds={recents}
      onSelectFeature={handleSelectFeature}
      onToggleFavorite={handleToggleFavorite}
      headerRightAction={
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surfaceSubtle,
          }}
        >
          <Text style={{ fontSize: 16 }}>{theme.isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      }
      bannerAdSlot={<BannerAd placement="${appSlug}_home_bottom" />}
    />
  );
};
`;
fs.writeFileSync(
  path.join(targetDir, 'src', 'screens', 'HomeScreen.tsx'),
  homeScreenContent
);

// 9. RootNavigator.tsx
const rootNavContent = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dailyapps/theme';
import { getDefaultScreenOptions } from '@dailyapps/navigation';
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const screenOptions = getDefaultScreenOptions(theme);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
`;
fs.writeFileSync(
  path.join(targetDir, 'src', 'navigation', 'RootNavigator.tsx'),
  rootNavContent
);

// 10. App.tsx
const appTsxContent = `import React, { useEffect } from 'react';
import { AppConfigProvider } from '@dailyapps/config';
import { ThemeProvider } from '@dailyapps/theme';
import { StorageProvider } from '@dailyapps/storage';
import { AnalyticsProvider } from '@dailyapps/analytics';
import { DailyNavigationContainer } from '@dailyapps/navigation';
import { AdManager } from '@dailyapps/ads';
import { ${appSlug.replace(/-/g, '')}Config } from './config/app.config';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  useEffect(() => {
    AdManager.initialize(${appSlug.replace(/-/g, '')}Config.ads);
  }, []);

  return (
    <AppConfigProvider config={${appSlug.replace(/-/g, '')}Config}>
      <ThemeProvider
        brand={{
          brandPrimary: ${appSlug.replace(/-/g, '')}Config.theme.brandColor,
          brandSecondary: ${appSlug.replace(/-/g, '')}Config.theme.brandSecondary,
          brandDark: ${appSlug.replace(/-/g, '')}Config.theme.brandDarkColor,
        }}
        initialMode={${appSlug.replace(/-/g, '')}Config.theme.defaultMode}
      >
        <StorageProvider appId={${appSlug.replace(/-/g, '')}Config.appId}>
          <AnalyticsProvider>
            <DailyNavigationContainer>
              <RootNavigator />
            </DailyNavigationContainer>
          </AnalyticsProvider>
        </StorageProvider>
      </ThemeProvider>
    </AppConfigProvider>
  );
};

export default App;
`;
fs.writeFileSync(path.join(targetDir, 'src', 'App.tsx'), appTsxContent);

// 11. store/metadata.md
const metadataContent = `# ${displayName} — Play Store Metadata

- **App Name**: ${displayName}
- **Category**: Productivity
- **Package Name**: \`${packageName}\`
- **Default Language**: en-US
- **Content Rating**: Everyone (3+)
- **Privacy Policy**: https://dailyapps.dev/privacy/${appSlug}
- **Support**: support@dailyapps.dev
`;
fs.writeFileSync(
  path.join(targetDir, 'store', 'metadata.md'),
  metadataContent
);

// 12. Android Native Config
const androidBuildGradle = `buildscript {
    ext {
        buildToolsVersion = "35.0.0"
        minSdkVersion = 24
        compileSdkVersion = 35
        targetSdkVersion = 35
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.24"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.7.2")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
`;
fs.writeFileSync(
  path.join(targetDir, 'android', 'build.gradle'),
  androidBuildGradle
);

const androidSettingsGradle = `rootProject.name = '${appPascal}'
apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), "../native_modules.gradle");
applyNativeModulesSettingsGradle(settings)
include ':app'
includeBuild(new File(["node", "--print", "require.resolve('@react-native-gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile())
`;
fs.writeFileSync(
  path.join(targetDir, 'android', 'settings.gradle'),
  androidSettingsGradle
);

const androidGradleProps = `org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
android.useAndroidX=true
android.enableJetifier=true
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=false
hermesEnabled=true
`;
fs.writeFileSync(
  path.join(targetDir, 'android', 'gradle.properties'),
  androidGradleProps
);

const appBuildGradle = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

react {
    root = file("../../..")
    reactNativeDir = file("../../../node_modules/react-native")
    codegenDir = file("../../../node_modules/@react-native/codegen")
    cliFile = file("../../../node_modules/react-native/cli.js")
    autolinkLibrariesWithApp()
}

def enableProguardInReleaseBuilds = false
def jscFlavor = 'io.github.react-native-community:jsc-android:+'

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "${packageName}"
    defaultConfig {
        applicationId "${packageName}"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation("com.facebook.react:react-android")
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
`;
fs.writeFileSync(
  path.join(targetDir, 'android', 'app', 'build.gradle'),
  appBuildGradle
);

const androidManifest = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:supportsRtl="true">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
`;
fs.writeFileSync(
  path.join(targetDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'),
  androidManifest
);

fs.writeFileSync(
  path.join(androidResDir, 'strings.xml'),
  `<resources>\n    <string name="app_name">${displayName}</string>\n</resources>\n`
);
fs.writeFileSync(
  path.join(androidResDir, 'styles.xml'),
  `<resources>\n    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">\n        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>\n    </style>\n</resources>\n`
);

const mainActivity = `package ${packageName}

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "${appPascal}"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
`;
fs.writeFileSync(path.join(androidJavaDir, 'MainActivity.kt'), mainActivity);

const mainApplication = `package ${packageName}

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
  }
}
`;
fs.writeFileSync(
  path.join(androidJavaDir, 'MainApplication.kt'),
  mainApplication
);

console.log(`✅ App "apps/${appSlug}" successfully created!`);
console.log(`Next steps:
1. Customize features in apps/${appSlug}/src/config/toolCatalog.ts
2. Add screens in apps/${appSlug}/src/screens/
3. Run: npm install
`);
