Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot "..\build"
$outputPath = Join-Path $outputDirectory "icon.png"
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$size = 1024
$bitmap = New-Object System.Drawing.Bitmap($size, $size)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)

$background = New-Object System.Drawing.SolidBrush(
  [System.Drawing.ColorTranslator]::FromHtml("#0e7a61")
)
$roundedRectangle = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 214
$diameter = $radius * 2
$bounds = New-Object System.Drawing.Rectangle(36, 36, 952, 952)
$roundedRectangle.AddArc(36, 36, $diameter, $diameter, 180, 90)
$roundedRectangle.AddArc(
  $bounds.Right - $diameter,
  36,
  $diameter,
  $diameter,
  270,
  90
)
$roundedRectangle.AddArc(
  $bounds.Right - $diameter,
  $bounds.Bottom - $diameter,
  $diameter,
  $diameter,
  0,
  90
)
$roundedRectangle.AddArc(
  36,
  $bounds.Bottom - $diameter,
  $diameter,
  $diameter,
  90,
  90
)
$roundedRectangle.CloseFigure()
$graphics.FillPath($background, $roundedRectangle)

$barBrush = [System.Drawing.Brushes]::White
$bars = @(
  @{ X = 292; Y = 550; Width = 105; Height = 170 },
  @{ X = 458; Y = 430; Width = 105; Height = 290 },
  @{ X = 624; Y = 300; Width = 105; Height = 420 }
)

foreach ($bar in $bars) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $barRadius = 34
  $barDiameter = $barRadius * 2
  $barBounds = New-Object System.Drawing.Rectangle(
    $bar.X,
    $bar.Y,
    $bar.Width,
    $bar.Height
  )
  $path.AddArc($bar.X, $bar.Y, $barDiameter, $barDiameter, 180, 90)
  $path.AddArc(
    $barBounds.Right - $barDiameter,
    $bar.Y,
    $barDiameter,
    $barDiameter,
    270,
    90
  )
  $path.AddArc(
    $barBounds.Right - $barDiameter,
    $barBounds.Bottom - $barDiameter,
    $barDiameter,
    $barDiameter,
    0,
    90
  )
  $path.AddArc(
    $bar.X,
    $barBounds.Bottom - $barDiameter,
    $barDiameter,
    $barDiameter,
    90,
    90
  )
  $path.CloseFigure()
  $graphics.FillPath($barBrush, $path)
  $path.Dispose()
}

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$roundedRectangle.Dispose()
$background.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $outputPath
