$apps = @{
    "resume-maker" = @{ pkg = "com.dailyapps.resumemaker"; name = "DailyResumeMaker" }
    "productivity" = @{ pkg = "com.dailyapps.productivity"; name = "DailyProductivity" }
    "pdf-tools" = @{ pkg = "com.dailyapps.pdftools"; name = "DailyPdfTools" }
    "image-tools" = @{ pkg = "com.dailyapps.imagetools"; name = "DailyImageTools" }
    "money-manager" = @{ pkg = "com.dailyapps.moneymanager"; name = "DailyMoneyManager" }
    "student-toolkit" = @{ pkg = "com.dailyapps.studenttoolkit"; name = "DailyStudentToolkit" }
    "qr-barcode" = @{ pkg = "com.dailyapps.qrbarcode"; name = "DailyQrBarcode" }
}

$buildGradleContent = @"
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.7.2")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24")
    }
}

ext {
    buildToolsVersion = "35.0.0"
    minSdkVersion = 24
    compileSdkVersion = 35
    targetSdkVersion = 35
    ndkVersion = "26.1.10909125"
    kotlinVersion = "1.9.24"
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
"@

foreach ($app in $apps.Keys) {
    $info = $apps[$app]
    $androidDir = Join-Path $PSScriptRoot "..\apps\$app\android"
    if (!(Test-Path $androidDir)) { continue }

    # 1. root build.gradle
    [System.IO.File]::WriteAllText((Join-Path $androidDir "build.gradle"), $buildGradleContent)

    # 2. settings.gradle
    $settingsContent = @"
rootProject.name = '$($info.name)'
include ':app'

def autolinkingJsonFile = file("build/generated/autolinking/autolinking.json")
if (!autolinkingJsonFile.exists()) {
    autolinkingJsonFile.parentFile.mkdirs()
    def proc = ["cmd", "/c", "npx @react-native-community/cli config"].execute(null, file(".."))
    autolinkingJsonFile.text = proc.text
}

if (autolinkingJsonFile.exists() && autolinkingJsonFile.length() > 0) {
    try {
        def jsonSlurper = new groovy.json.JsonSlurper()
        def autolinkConfig = jsonSlurper.parse(autolinkingJsonFile)
        autolinkConfig.dependencies.each { name, dep ->
            if (dep.platforms?.android?.sourceDir) {
                def cleansedName = ":" + name.replace('/', '_').replace('@', '')
                include(cleansedName)
                project(cleansedName).projectDir = new File(dep.platforms.android.sourceDir)
            }
        }
    } catch (Exception e) {
        // Fallback gracefully
    }
}

includeBuild(new File(rootDir, "../../../node_modules/@react-native/gradle-plugin"))
"@
    [System.IO.File]::WriteAllText((Join-Path $androidDir "settings.gradle"), $settingsContent)

    # 3. app/build.gradle
    $appBuildGradle = @"
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

react {
    root = file("../..")
    reactNativeDir = file("../../../../node_modules/react-native")
    codegenDir = file("../../../../node_modules/@react-native/codegen")
    cliFile = file("../../../../node_modules/react-native/cli.js")
    autolinkLibrariesWithApp()
}

def enableProguardInReleaseBuilds = false
def jscFlavor = 'io.github.react-native-community:jsc-android:+'

android {
    ndkVersion rootProject.ext.has('ndkVersion') ? rootProject.ext.ndkVersion : "26.1.10909125"
    buildToolsVersion rootProject.ext.has('buildToolsVersion') ? rootProject.ext.buildToolsVersion : "35.0.0"
    compileSdk 35

    namespace "$($info.pkg)"
    defaultConfig {
        applicationId "$($info.pkg)"
        minSdk 24
        targetSdk 35
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
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
"@
    [System.IO.File]::WriteAllText((Join-Path $androidDir "app\build.gradle"), $appBuildGradle)

    Write-Host "Propagated build configurations to $app"
}
