Set-Location $PSScriptRoot\..

$indexPath = "index.html"
$html = Get-Content -Raw -Path $indexPath

function Get-MatchValue([string]$text, [string]$pattern, [int]$group = 1) {
  $m = [regex]::Match($text, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return $m.Groups[$group].Value }
  return ""
}

function Get-StyleValue([string]$style, [string]$name) {
  $pattern = [regex]::Escape($name) + ":\s*([^;\"]+)"
  $m = [regex]::Match($style, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  return ""
}

function Get-Translate([string]$style) {
  $m = [regex]::Match($style, "translate\(([-\d]+)px\s*,\s*([-\d]+)px\)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) {
    return @{ x = [int]$m.Groups[1].Value; y = [int]$m.Groups[2].Value }
  }
  return @{ x = 0; y = 0 }
}

$rootStyle = Get-MatchValue $html '<div class="home-root" style="([^"]+)"'
$bgStyle = Get-MatchValue $html '<div class="home-bg" style="([^"]+)"'
$navStyle = Get-MatchValue $html '<nav class="home-nav nav-slot" style="([^"]+)"'
$heroTitleSlotStyle = Get-MatchValue $html '<div class="hero-title-slot" style="([^"]+)"'
if (-not $heroTitleSlotStyle) { $heroTitleSlotStyle = Get-MatchValue $html '<section class="hero-title-slot"[^>]*style="([^"]+)"' }
$heroSubtitleSlotStyle = Get-MatchValue $html '<div class="hero-subtitle-slot" style="([^"]+)"'
if (-not $heroSubtitleSlotStyle) { $heroSubtitleSlotStyle = Get-MatchValue $html '<section class="hero-subtitle-slot"[^>]*style="([^"]+)"' }
$ctaStyle = Get-MatchValue $html '<div class="cta-slot" style="([^"]+)"'

$heroTitleText = [System.Net.WebUtility]::HtmlDecode((Get-MatchValue $html '<(div|section) class="hero-title-slot"[^>]*>\s*<h1[^>]*>(.*?)</h1>' 2))
$heroSubtitleText = [System.Net.WebUtility]::HtmlDecode((Get-MatchValue $html '<(div|section) class="hero-subtitle-slot"[^>]*>\s*<p[^>]*>(.*?)</p>' 2))
$heroTitleInlineStyle = Get-MatchValue $html '<h1 style="([^"]+)"'
$heroSubtitleInlineStyle = Get-MatchValue $html '<p style="([^"]+)"'

$logoMatches = [regex]::Matches($html, '<div class="logo-slot" style="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$logos = @()
for ($i = 0; $i -lt [Math]::Min(2, $logoMatches.Count); $i++) {
  $style = $logoMatches[$i].Groups[1].Value
  $tr = Get-Translate $style
  $sizeStr = Get-StyleValue $style 'width'
  $size = 72
  if ($sizeStr -match '([-\d]+)px') { $size = [int]$Matches[1] }
  $opacity = 1.0
  $opacityStr = Get-StyleValue $style 'opacity'
  if ($opacityStr) { [double]::TryParse($opacityStr, [ref]$opacity) | Out-Null }
  $transparency = [int][Math]::Round((1 - $opacity) * 100)
  $logos += [ordered]@{ src=""; fileName=""; x=$tr.x; y=$tr.y; size=$size; rotation=0; transparency=[Math]::Min(95,[Math]::Max(0,$transparency)) }
}
while ($logos.Count -lt 2) {
  $logos += [ordered]@{ src=""; fileName=""; x=0; y=0; size=72; rotation=0; transparency=0 }
}

$ctaBlock = Get-MatchValue $html '<div class="cta-slot"[^>]*>(.*?)</div>'
$buttons = @()
if ($ctaBlock) {
  $buttonMatches = [regex]::Matches($ctaBlock, '<a href="([^"]*)"[^>]*>(.*?)</a>', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($bm in $buttonMatches) {
    $href = $bm.Groups[1].Value
    $label = [System.Net.WebUtility]::HtmlDecode(($bm.Groups[2].Value -replace '<[^>]+>', '').Trim())
    if ($label) { $buttons += [ordered]@{ label = $label; href = ($(if ($href) { $href } else { '#' })) } }
  }
}
if ($buttons.Count -eq 0) {
  $buttons += [ordered]@{ label = 'Explore Products'; href = 'products.html' }
}

$tabs = @(
  [ordered]@{ label='About'; sectionId='about'; sectionTitle='About'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) },
  [ordered]@{ label='Products'; sectionId='products'; sectionTitle='Products'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) },
  [ordered]@{ label='Privacy'; sectionId='privacy'; sectionTitle='Privacy'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) }
)

$titleAlign = Get-StyleValue $heroTitleInlineStyle 'text-align'; if (-not $titleAlign) { $titleAlign = 'left' }
$subtitleAlign = Get-StyleValue $heroSubtitleInlineStyle 'text-align'; if (-not $subtitleAlign) { $subtitleAlign = 'left' }
$titleFont = ''; $titleFontRaw = Get-StyleValue $heroTitleInlineStyle 'font-family'; if ($titleFontRaw -match "'([^']+)'") { $titleFont = $Matches[1] }
$subtitleFont = ''; $subtitleFontRaw = Get-StyleValue $heroSubtitleInlineStyle 'font-family'; if ($subtitleFontRaw -match "'([^']+)'") { $subtitleFont = $Matches[1] }

$bgOpacity = 0.68
$bgOpacityRaw = Get-StyleValue $rootStyle '--preview-bg-opacity'
if ($bgOpacityRaw) { [double]::TryParse($bgOpacityRaw, [ref]$bgOpacity) | Out-Null }
$bgTransparency = [int][Math]::Round((1 - $bgOpacity) * 100)
$bgTransparency = [Math]::Min(95,[Math]::Max(0,$bgTransparency))

$bgSrc = Get-MatchValue $bgStyle "background-image:url\('([^']+)'\)"
$bgPosMatch = [regex]::Match($bgStyle, 'background-position:\s*([0-9]+)%\s+([0-9]+)%', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$bgX = 52; $bgY = 20
if ($bgPosMatch.Success) { $bgX = [int]$bgPosMatch.Groups[1].Value; $bgY = [int]$bgPosMatch.Groups[2].Value }

$themeFont = (((Get-StyleValue $rootStyle 'font-family') -split ',')[0] -replace "'",'').Trim()
if (-not $themeFont) { $themeFont = 'Sora' }

$recover = [ordered]@{
  brand = [ordered]@{ name=((Get-MatchValue $html '<title>(.*?)</title>') -replace '<[^>]+>','').Trim(); logoSrc=''; logoFileName=''; logos=$logos }
  hero = [ordered]@{
    title = $(if ($heroTitleText) { $heroTitleText } else { 'We Build Financial Software With Human Clarity' })
    subtitle = $(if ($heroSubtitleText) { $heroSubtitleText } else { 'Experiment with colors, typography, and layout to shape your homepage before publishing.' })
    titleFontFamily = $titleFont
    subtitleFontFamily = $subtitleFont
    titleAlign = $titleAlign
    subtitleAlign = $subtitleAlign
    titleColor = $(if (Get-StyleValue $heroTitleInlineStyle 'color') { Get-StyleValue $heroTitleInlineStyle 'color' } else { '#102822' })
    subtitleColor = $(if (Get-StyleValue $heroSubtitleInlineStyle 'color') { Get-StyleValue $heroSubtitleInlineStyle 'color' } else { '#4f6962' })
    buttons = $buttons
  }
  theme = [ordered]@{
    fontFamily = $themeFont
    headingSize = [int]((Get-StyleValue $rootStyle '--preview-heading-size') -replace 'px','')
    bodySize = [int]((Get-StyleValue $rootStyle '--preview-body-size') -replace 'px','')
    buttonTextSize = [int]((Get-StyleValue $rootStyle '--preview-button-size') -replace 'px','')
    bgColor = $(if (Get-StyleValue $rootStyle '--preview-bg') { Get-StyleValue $rootStyle '--preview-bg' } else { '#f2f7f3' })
    textColor = $(if (Get-StyleValue $rootStyle '--preview-text') { Get-StyleValue $rootStyle '--preview-text' } else { '#102822' })
    accentColor = $(if (Get-StyleValue $rootStyle '--preview-accent') { Get-StyleValue $rootStyle '--preview-accent' } else { '#0f7b6c' })
    mutedColor = $(if (Get-StyleValue $rootStyle '--preview-muted') { Get-StyleValue $rootStyle '--preview-muted' } else { '#4f6962' })
    surfaceColor = $(if (Get-StyleValue $rootStyle '--preview-surface') { Get-StyleValue $rootStyle '--preview-surface' } else { '#e5f0ea' })
    buttonTextColor = $(if (Get-StyleValue $rootStyle '--preview-button-text') { Get-StyleValue $rootStyle '--preview-button-text' } else { '#ffffff' })
  }
  background = [ordered]@{ src=$bgSrc; fileName=''; transparency=$bgTransparency; x=$bgX; y=$bgY }
  layout = [ordered]@{ logo=[ordered]@{x=0;y=0}; nav=(Get-Translate $navStyle); hero=[ordered]@{x=0;y=0}; heroTitle=(Get-Translate $heroTitleSlotStyle); heroSubtitle=(Get-Translate $heroSubtitleSlotStyle); cta=(Get-Translate $ctaStyle) }
  display = [ordered]@{ tabMode='top-and-home'; topTabsTransparent=($html -match 'home-nav nav-slot[\s\S]*?box-shadow:none'); ctaTextOnly=($ctaBlock -match 'box-shadow:none') }
  tabs = $tabs
}

if (-not $recover.brand.name) { $recover.brand.name = 'VinATech' }
if (-not $recover.theme.headingSize) { $recover.theme.headingSize = 64 }
if (-not $recover.theme.bodySize) { $recover.theme.bodySize = 18 }
if (-not $recover.theme.buttonTextSize) { $recover.theme.buttonTextSize = 16 }

$json = $recover | ConvertTo-Json -Depth 20
$draftContent = "// Auto-generated by Homepage Configurator.`n// Recovered from index.html.`nwindow.__CONFIGURATOR_DRAFT__ = " + $json + ";`n"
Set-Content -Path "js/configurator.draft.js" -Value $draftContent -Encoding UTF8
Write-Output "Recovered draft written to js/configurator.draft.js"
