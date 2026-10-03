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

$content = "sdk.dir=C\:\\Users\\karti\\AppData\\Local\\Android\\Sdk`n"

foreach ($app in $apps) {
    $dir = Join-Path $PSScriptRoot "..\apps\$app\android"
    if (Test-Path $dir) {
        $filePath = Join-Path $dir "local.properties"
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Host "Set local.properties for $app"
    }
}
