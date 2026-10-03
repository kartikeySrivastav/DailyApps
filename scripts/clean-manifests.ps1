$apps = @(
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
        $content = $content.Replace("``n", "`r`n")
        [System.IO.File]::WriteAllText($manifestPath, $content)
        Write-Host "Cleaned $app"
    }
}
