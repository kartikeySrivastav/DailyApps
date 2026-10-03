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

foreach ($app in $apps) {
    $manifestPath = Join-Path $PSScriptRoot "..\apps\$app\android\app\src\main\AndroidManifest.xml"
    if (Test-Path $manifestPath) {
        $content = [System.IO.File]::ReadAllText($manifestPath)
        if ($content -notmatch 'android:usesCleartextTraffic') {
            $content = $content.Replace('android:supportsRtl="true"', 'android:supportsRtl="true"`n      android:usesCleartextTraffic="true"')
            [System.IO.File]::WriteAllText($manifestPath, $content)
            Write-Host "Updated usesCleartextTraffic for $app"
        }
    }
}
