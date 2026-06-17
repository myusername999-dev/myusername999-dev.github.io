param(
  [Parameter(Mandatory = $true)]
  [string]$Stage0VisualRoot,

  [Parameter(Mandatory = $true)]
  [string]$Stage1VisualRoot
)

Add-Type -AssemblyName PresentationCore

function Get-ImageData {
  param([string]$Path)

  $fs = [System.IO.File]::OpenRead($Path)
  try {
    $decoder = [System.Windows.Media.Imaging.PngBitmapDecoder]::new(
      $fs,
      [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
      [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    )
    $frame = $decoder.Frames[0]
    $converted = [System.Windows.Media.Imaging.FormatConvertedBitmap]::new(
      $frame,
      [System.Windows.Media.PixelFormats]::Bgra32,
      $null,
      0
    )

    $width = $converted.PixelWidth
    $height = $converted.PixelHeight
    $stride = $width * 4
    $bytes = New-Object byte[] ($stride * $height)
    $converted.CopyPixels($bytes, $stride, 0)

    [pscustomobject]@{
      Width = $width
      Height = $height
      Stride = $stride
      Bytes = $bytes
    }
  }
  finally {
    $fs.Dispose()
  }
}

function Compare-Images {
  param(
    [string]$PathA,
    [string]$PathB
  )

  $a = Get-ImageData -Path $PathA
  $b = Get-ImageData -Path $PathB

  $width = [Math]::Min($a.Width, $b.Width)
  $height = [Math]::Min($a.Height, $b.Height)

  $totalPixels = [int64]$width * [int64]$height
  $diffPixels = [int64]0

  for ($y = 0; $y -lt $height; $y++) {
    $rowA = $y * $a.Stride
    $rowB = $y * $b.Stride

    for ($x = 0; $x -lt $width; $x++) {
      $iA = $rowA + ($x * 4)
      $iB = $rowB + ($x * 4)

      if (
        $a.Bytes[$iA] -ne $b.Bytes[$iB] -or
        $a.Bytes[$iA + 1] -ne $b.Bytes[$iB + 1] -or
        $a.Bytes[$iA + 2] -ne $b.Bytes[$iB + 2] -or
        $a.Bytes[$iA + 3] -ne $b.Bytes[$iB + 3]
      ) {
        $diffPixels++
      }
    }
  }

  if ($a.Width -ne $b.Width -or $a.Height -ne $b.Height) {
    $maxTotal = [int64]([Math]::Max($a.Width, $b.Width)) * [int64]([Math]::Max($a.Height, $b.Height))
    $diffPixels += ($maxTotal - $totalPixels)
    $totalPixels = $maxTotal
  }

  [pscustomobject]@{
    Width = [Math]::Max($a.Width, $b.Width)
    Height = [Math]::Max($a.Height, $b.Height)
    TotalPixels = $totalPixels
    DiffPixels = $diffPixels
    DiffPercent = if ($totalPixels -eq 0) { 0 } else { [math]::Round(($diffPixels * 100.0) / $totalPixels, 4) }
  }
}

$pairs = @(
  @{ Name = 'home-desktop'; Stage0 = Join-Path $Stage0VisualRoot 'desktop/home-desktop.png'; Stage1 = Join-Path $Stage1VisualRoot 'desktop/home-desktop.png' },
  @{ Name = 'privacy-desktop'; Stage0 = Join-Path $Stage0VisualRoot 'desktop/privacy-desktop.png'; Stage1 = Join-Path $Stage1VisualRoot 'desktop/privacy-desktop.png' },
  @{ Name = 'contact-desktop'; Stage0 = Join-Path $Stage0VisualRoot 'desktop/contact-desktop.png'; Stage1 = Join-Path $Stage1VisualRoot 'desktop/contact-desktop.png' },
  @{ Name = 'home-mobile'; Stage0 = Join-Path $Stage0VisualRoot 'mobile/home-mobile.png'; Stage1 = Join-Path $Stage1VisualRoot 'mobile/home-mobile.png' },
  @{ Name = 'privacy-mobile'; Stage0 = Join-Path $Stage0VisualRoot 'mobile/privacy-mobile.png'; Stage1 = Join-Path $Stage1VisualRoot 'mobile/privacy-mobile.png' },
  @{ Name = 'contact-mobile'; Stage0 = Join-Path $Stage0VisualRoot 'mobile/contact-mobile.png'; Stage1 = Join-Path $Stage1VisualRoot 'mobile/contact-mobile.png' }
)

$results = foreach ($pair in $pairs) {
  $cmp = Compare-Images -PathA $pair.Stage0 -PathB $pair.Stage1
  [pscustomobject]@{
    Name = $pair.Name
    Width = $cmp.Width
    Height = $cmp.Height
    TotalPixels = $cmp.TotalPixels
    DiffPixels = $cmp.DiffPixels
    DiffPercent = $cmp.DiffPercent
  }
}

$results
