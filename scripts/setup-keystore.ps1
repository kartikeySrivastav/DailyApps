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

$sourceKeystore = "C:\Users\karti\.android\debug.keystore"

foreach ($app in $apps) {
    $targetDir = Join-Path $PSScriptRoot "..\apps\$app\android\app"
    if (Test-Path $targetDir) {
        $dest = Join-Path $targetDir "debug.keystore"
        Copy-Item -Path $sourceKeystore -Destination $dest -Force
        Write-Host "Copied debug.keystore to $app"
    }
}
