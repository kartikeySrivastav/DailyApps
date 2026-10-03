$pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$pngBytes = [System.Convert]::FromBase64String($pngBase64)

$apps = @(
    "calculator",
    "resume-maker",
    "productivity",
    "pdf-tools",
    "image-tools",
    "money-manager",
    "student-toolkit",
    "qr-barcode"
)

$densities = @(
    "mipmap-mdpi",
    "mipmap-hdpi",
    "mipmap-xhdpi",
    "mipmap-xxhdpi",
    "mipmap-xxxhdpi"
)

$colorsXml = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#4F46E5</color>
</resources>
"@

$adaptiveIconXml = @"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
"@

$foregroundDrawableXml = @"
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M30,30h48v48h-48z"/>
</vector>
"@

foreach ($app in $apps) {
    $resDir = Join-Path $PSScriptRoot "..\apps\$app\android\app\src\main\res"
    if (!(Test-Path $resDir)) { continue }

    # 1. values/colors.xml
    $valuesDir = Join-Path $resDir "values"
    if (!(Test-Path $valuesDir)) { New-Item -ItemType Directory -Path $valuesDir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path $valuesDir "colors.xml"), $colorsXml)

    # 2. drawable/ic_launcher_foreground.xml
    $drawableDir = Join-Path $resDir "drawable"
    if (!(Test-Path $drawableDir)) { New-Item -ItemType Directory -Path $drawableDir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path $drawableDir "ic_launcher_foreground.xml"), $foregroundDrawableXml)

    # 3. mipmap-anydpi-v26
    $anydpiDir = Join-Path $resDir "mipmap-anydpi-v26"
    if (!(Test-Path $anydpiDir)) { New-Item -ItemType Directory -Path $anydpiDir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Join-Path $anydpiDir "ic_launcher.xml"), $adaptiveIconXml)
    [System.IO.File]::WriteAllText((Join-Path $anydpiDir "ic_launcher_round.xml"), $adaptiveIconXml)

    # 4. densities
    foreach ($density in $densities) {
        $densityDir = Join-Path $resDir $density
        if (!(Test-Path $densityDir)) { New-Item -ItemType Directory -Path $densityDir -Force | Out-Null }
        [System.IO.File]::WriteAllBytes((Join-Path $densityDir "ic_launcher.png"), $pngBytes)
        [System.IO.File]::WriteAllBytes((Join-Path $densityDir "ic_launcher_round.png"), $pngBytes)
    }

    Write-Host "Icons configured for $app"
}
