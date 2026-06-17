param(
  [string]$SiteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$Stage1VisualRoot = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path ("docs/refactor-execution/artifacts/stage-1/{0}/visual" -f (Get-Date -Format 'yyyy-MM-dd'))),
  [string]$Stage0VisualRoot = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path ("docs/refactor-execution/artifacts/stage-0/{0}/visual" -f (Get-Date -Format 'yyyy-MM-dd'))),
  [int]$VirtualTimeBudgetMs = 5000,
  [string]$EdgePath,
  [switch]$RunCompare
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName PresentationCore

function Resolve-EdgePath {
  param([string]$PreferredPath)

  if ($PreferredPath -and (Test-Path $PreferredPath)) {
    return (Resolve-Path $PreferredPath).Path
  }

  $cmd = Get-Command msedge -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $candidates = @(
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return (Resolve-Path $candidate).Path
    }
  }

  throw 'Microsoft Edge executable was not found. Install Edge or pass -EdgePath.'
}

function Get-PngDimensions {
  param([string]$Path)

  $fs = [System.IO.File]::OpenRead($Path)
  try {
    $decoder = [System.Windows.Media.Imaging.PngBitmapDecoder]::new(
      $fs,
      [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
      [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    )

    $frame = $decoder.Frames[0]
    return [pscustomobject]@{
      Width = $frame.PixelWidth
      Height = $frame.PixelHeight
    }
  }
  finally {
    $fs.Dispose()
  }
}

function New-DirectoryIfMissing {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    [void](New-Item -ItemType Directory -Path $Path -Force)
  }
}

function Invoke-EdgeCapture {
  param(
    [string]$BrowserPath,
    [string[]]$Arguments
  )

  $stdoutPath = [System.IO.Path]::GetTempFileName()
  $stderrPath = [System.IO.Path]::GetTempFileName()

  try {
    $proc = Start-Process -FilePath $BrowserPath -ArgumentList $Arguments -Wait -PassThru -NoNewWindow -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath
    if ($proc.ExitCode -ne 0) {
      $stderr = Get-Content -Path $stderrPath -Raw -ErrorAction SilentlyContinue
      throw "Capture failed with exit code $($proc.ExitCode). $stderr"
    }
  }
  finally {
    Remove-Item -Path $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
  }
}

$edgeExe = Resolve-EdgePath -PreferredPath $EdgePath
$stage1VisualRootResolved = [System.IO.Path]::GetFullPath($Stage1VisualRoot)
$stage0VisualRootResolved = [System.IO.Path]::GetFullPath($Stage0VisualRoot)
$siteRootResolved = [System.IO.Path]::GetFullPath($SiteRoot)

New-DirectoryIfMissing -Path $stage1VisualRootResolved
New-DirectoryIfMissing -Path (Join-Path $stage1VisualRootResolved 'desktop')
New-DirectoryIfMissing -Path (Join-Path $stage1VisualRootResolved 'mobile')

$capturePlan = @(
  @{ Key = 'home-desktop'; File = 'index.html'; View = 'desktop'; FallbackWidth = 1366; FallbackHeight = 812 },
  @{ Key = 'privacy-desktop'; File = 'privacy.html'; View = 'desktop'; FallbackWidth = 1366; FallbackHeight = 2186 },
  @{ Key = 'contact-desktop'; File = 'contact.html'; View = 'desktop'; FallbackWidth = 1366; FallbackHeight = 768 },
  @{ Key = 'home-mobile'; File = 'index.html'; View = 'mobile'; FallbackWidth = 375; FallbackHeight = 888 },
  @{ Key = 'privacy-mobile'; File = 'privacy.html'; View = 'mobile'; FallbackWidth = 375; FallbackHeight = 3960 },
  @{ Key = 'contact-mobile'; File = 'contact.html'; View = 'mobile'; FallbackWidth = 375; FallbackHeight = 989 }
)

$captures = @()
$timestamp = (Get-Date).ToString('s')
$edgeProfileDir = Join-Path ([System.IO.Path]::GetTempPath()) ("vinatech-edge-capture-{0}" -f [guid]::NewGuid().ToString('N'))
New-DirectoryIfMissing -Path $edgeProfileDir

try {
  foreach ($entry in $capturePlan) {
    $baselinePath = Join-Path $stage0VisualRootResolved ("{0}/{1}.png" -f $entry.View, $entry.Key)

    if (Test-Path $baselinePath) {
      $dims = Get-PngDimensions -Path $baselinePath
      $width = $dims.Width
      $height = $dims.Height
      $dimensionSource = 'stage0-baseline'
    }
    else {
      $width = $entry.FallbackWidth
      $height = $entry.FallbackHeight
      $dimensionSource = 'fallback-default'
    }

    $sourcePath = Join-Path $siteRootResolved $entry.File
    if (-not (Test-Path $sourcePath)) {
      throw "Capture source file not found: $sourcePath"
    }

    $outPath = Join-Path $stage1VisualRootResolved ("{0}/{1}.png" -f $entry.View, $entry.Key)
    $url = [System.Uri]::new($sourcePath).AbsoluteUri

    $edgeArgs = @(
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--disable-logging',
      '--log-level=3',
      "--user-data-dir=$edgeProfileDir",
      '--run-all-compositor-stages-before-draw',
      "--virtual-time-budget=$VirtualTimeBudgetMs",
      "--window-size=$width,$height",
      "--screenshot=$outPath",
      $url
    )

    Invoke-EdgeCapture -BrowserPath $edgeExe -Arguments $edgeArgs

    $captures += [pscustomobject]@{
      name = $entry.Key
      viewport = "{0}x{1}" -f $width, $height
      url = $url
      output = $outPath
      dimensionSource = $dimensionSource
      capturedAt = $timestamp
    }
  }
}
finally {
  Remove-Item -Path $edgeProfileDir -Recurse -Force -ErrorAction SilentlyContinue
}

$stage1Root = Split-Path $stage1VisualRootResolved -Parent
$reportsDir = Join-Path $stage1Root 'reports'
New-DirectoryIfMissing -Path $reportsDir

$metadataPath = Join-Path $reportsDir 'capture-stabilization-metadata.json'
$captures | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 -Path $metadataPath

Write-Output ("Captured {0} screenshots." -f $captures.Count)
Write-Output ("Metadata written: {0}" -f $metadataPath)
$captures | Format-Table -AutoSize | Out-String | Write-Output

if ($RunCompare) {
  if (-not (Test-Path $stage0VisualRootResolved)) {
    throw "Stage0 visual root not found: $stage0VisualRootResolved"
  }

  $compareScript = Join-Path $PSScriptRoot 'compare-stage-visuals.ps1'
  if (-not (Test-Path $compareScript)) {
    throw "Compare script not found: $compareScript"
  }

  $results = & $compareScript -Stage0VisualRoot $stage0VisualRootResolved -Stage1VisualRoot $stage1VisualRootResolved

  $csvPath = Join-Path $reportsDir 'visual-diff-metrics.csv'
  $jsonPath = Join-Path $reportsDir 'visual-diff-metrics.json'

  $results | Export-Csv -NoTypeInformation -Path $csvPath
  $results | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 -Path $jsonPath

  Write-Output "Parity metrics updated:"
  Write-Output ("- {0}" -f $csvPath)
  Write-Output ("- {0}" -f $jsonPath)
  $results | Format-Table -AutoSize | Out-String | Write-Output
}
