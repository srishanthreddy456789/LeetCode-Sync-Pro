# Powershell script to generate PNG icons using System.Drawing
Add-Type -AssemblyName System.Drawing

$iconsDir = Join-Path -Path $PSScriptRoot -ChildPath "icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
}

function Create-Icon {
    param (
        [int]$size,
        [string]$filename
    )
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Enable anti-aliasing
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    
    # Background - Github/LeetCode style gradient/color
    # Dark grey outer circle/box, orange inner symbol
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    
    $radius = $size * 0.2
    $path.AddArc($rect.X, $rect.Y, $radius * 2, $radius * 2, 180, 90)
    $path.AddArc($rect.Right - ($radius * 2), $rect.Y, $radius * 2, $radius * 2, 270, 90)
    $path.AddArc($rect.Right - ($radius * 2), $rect.Bottom - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
    $path.CloseFigure()
    
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 33, 38, 45))
    $g.FillPath($brush, $path)
    
    # Draw border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 48, 54, 61), ($size * 0.05))
    $g.DrawPath($pen, $path)
    
    # Draw Inner circular indicator/logo element
    # Vibrant orange for LeetCode
    $innerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 140, 36))
    $innerSize = $size * 0.4
    $innerX = ($size - $innerSize) / 2
    $innerY = ($size - $innerSize) / 2
    $g.FillEllipse($innerBrush, $innerX, $innerY, $innerSize, $innerSize)
    
    # Draw Sync Symbol (White curved arrow/lines)
    $whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, ($size * 0.08))
    $whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    # Simple loop representation
    $g.DrawArc($whitePen, ($size * 0.2), ($size * 0.2), ($size * 0.6), ($size * 0.6), 45, 270)
    
    # Cleanup
    $g.Dispose()
    
    $outputPath = Join-Path -Path $iconsDir -ChildPath $filename
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outputPath"
}

Create-Icon -size 16 -filename "icon16.png"
Create-Icon -size 48 -filename "icon48.png"
Create-Icon -size 128 -filename "icon128.png"
