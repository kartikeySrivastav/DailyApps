Add-Type -AssemblyName System.Drawing

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$resDir = Join-Path $PSScriptRoot "..\apps\calculator\android\app\src\main\res"

foreach ($name in $sizes.Keys) {
    $dim = $sizes[$name]
    $bmp = New-Object System.Drawing.Bitmap $dim, $dim
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Background: Deep dark slate rounded rect
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
    $g.FillRectangle($bgBrush, 0, 0, $dim, $dim)

    # Calculator body: Vibrant sky blue
    $calcMargin = [int]($dim * 0.15)
    $calcW = $dim - (2 * $calcMargin)
    $calcH = $dim - (2 * $calcMargin)
    $calcBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(2, 132, 199))
    $g.FillRectangle($calcBrush, $calcMargin, $calcMargin, $calcW, $calcH)

    # Calculator Screen: Dark glass
    $screenMargin = [int]($calcMargin + ($calcW * 0.1))
    $screenW = [int]($calcW * 0.8)
    $screenH = [int]($calcH * 0.28)
    $screenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(10, 15, 26))
    $g.FillRectangle($screenBrush, $screenMargin, ($calcMargin + 4), $screenW, $screenH)

    # Buttons: Grid
    $btnBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(241, 245, 249))
    $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(56, 189, 248))
    
    $btnStartY = [int]($calcMargin + $screenH + 8)
    $btnW = [int]($calcW * 0.22)
    $btnH = [int]($calcH * 0.16)
    $spacingX = [int]($calcW * 0.07)
    $spacingY = [int]($calcH * 0.06)

    for ($row = 0; $row -lt 2; $row++) {
        for ($col = 0; $col -lt 3; $col++) {
            $bx = [int]($screenMargin + ($col * ($btnW + $spacingX)))
            $by = [int]($btnStartY + ($row * ($btnH + $spacingY)))
            $brush = if ($col -eq 2) { $accentBrush } else { $btnBrush }
            $g.FillRectangle($brush, $bx, $by, $btnW, $btnH)
        }
    }

    $g.Dispose()

    $targetDir = Join-Path $resDir $name
    $bmp.Save((Join-Path $targetDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save((Join-Path $targetDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Write-Host "Generated $dim x $dim icon for $name"
}
