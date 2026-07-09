Set-Location $PSScriptRoot\..

$indexPath = "index.html"
$html = Get-Content -Raw -Path $indexPath

function Get-MatchValue([string]$text, [string]$pattern, [int]$group = 1) {
  $m = [regex]::Match($text, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return $m.Groups[$group].Value }
  return ""
}

function Get-StyleValue([string]$style, [string]$name) {
  $pattern = [regex]::Escape($name) + ':\s*([^;\"]+)'
  $m = [regex]::Match($style, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  return ""
}

function Get-Translate([string]$style) {
  $m = [regex]::Match($style, "translate\(([-\d]+)px\s*,?\s*([-\d]+)px\)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) {
    return @{ x = [int]$m.Groups[1].Value; y = [int]$m.Groups[2].Value }
  }
  return @{ x = 0; y = 0 }
}

function Get-FileNameFromPath([string]$value) {
  if (-not $value) { return "" }
  $clean = ($value -split '\?')[0]
  $clean = ($clean -split '#')[0]
  $parts = $clean -split '/'
  if ($parts.Count -eq 0) { return "" }
  return $parts[$parts.Count - 1]
}

$rootStyle = Get-MatchValue $html '<div class="home-root" style="([^"]+)"'
$bgStyle = Get-MatchValue $html '<div class="home-bg" style="([^"]+)"'
$navStyle = Get-MatchValue $html '<nav[^>]*class="home-nav nav-slot"[^>]*style="([^"]+)"'
$navBlock = Get-MatchValue $html '<nav[^>]*class="home-nav nav-slot"[^>]*>(.*?)</nav>'
$heroTitleSlotStyle = Get-MatchValue $html '<div class="hero-title-slot" style="([^"]+)"'
if (-not $heroTitleSlotStyle) { $heroTitleSlotStyle = Get-MatchValue $html '<section class="hero-title-slot"[^>]*style="([^"]+)"' }
$heroSubtitleSlotStyle = Get-MatchValue $html '<div class="hero-subtitle-slot" style="([^"]+)"'
if (-not $heroSubtitleSlotStyle) { $heroSubtitleSlotStyle = Get-MatchValue $html '<section class="hero-subtitle-slot"[^>]*style="([^"]+)"' }
$ctaStyle = Get-MatchValue $html '<div class="cta-slot" style="([^"]+)"'

$heroTitleText = [System.Net.WebUtility]::HtmlDecode((Get-MatchValue $html '<(div|section) class="hero-title-slot"[^>]*>\s*<h1[^>]*>(.*?)</h1>' 2))
$heroSubtitleText = [System.Net.WebUtility]::HtmlDecode((Get-MatchValue $html '<(div|section) class="hero-subtitle-slot"[^>]*>\s*<p[^>]*>(.*?)</p>' 2))
$heroTitleInlineStyle = Get-MatchValue $html '<h1 style="([^"]+)"'
$heroSubtitleInlineStyle = Get-MatchValue $html '<p style="([^"]+)"'

$logoMatches = [regex]::Matches($html, '<div class="logo-slot" style="([^"]+)">\s*(?:<img[^>]*src="([^"]+)"[^>]*>)?', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$logos = @()
for ($i = 0; $i -lt [Math]::Min(2, $logoMatches.Count); $i++) {
  $matchItem = $logoMatches[$i]
  $style = $matchItem.Groups[1].Value
  $logoSrc = $matchItem.Groups[2].Value
  $tr = Get-Translate $style
  $sizeStr = Get-StyleValue $style 'width'
  $size = 72
  if ($sizeStr -match '([-\d]+)px') { $size = [int]$Matches[1] }

  $rotation = 0
  $rotationMatch = [regex]::Match($style, 'rotate\(([-\d]+)deg\)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($rotationMatch.Success) { $rotation = [int]$rotationMatch.Groups[1].Value }

  $opacity = 1.0
  $opacityStr = Get-StyleValue $style 'opacity'
  if ($opacityStr) { [double]::TryParse($opacityStr, [ref]$opacity) | Out-Null }
  $transparency = [int][Math]::Round((1 - $opacity) * 100)
  $logos += [ordered]@{
    src=$logoSrc
    fileName=(Get-FileNameFromPath $logoSrc)
    x=$tr.x
    y=$tr.y
    size=$size
    rotation=$rotation
    transparency=[Math]::Min(95,[Math]::Max(0,$transparency))
  }
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

$tabs = @()
if ($navBlock) {
  $navMatches = [regex]::Matches($navBlock, '<a href="([^"]*)"[^>]*?(?:style="([^"]*)")?[^>]*>(.*?)</a>', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($nm in $navMatches) {
    $href = $nm.Groups[1].Value
    $style = $nm.Groups[2].Value
    $label = [System.Net.WebUtility]::HtmlDecode(($nm.Groups[3].Value -replace '<[^>]+>', '').Trim())
    if (-not $label) { continue }

    $sid = ($label.ToLower() -replace '[^a-z0-9]+','-').Trim('-')
    if (-not $sid) { $sid = 'section' }

    $tabs += [ordered]@{
      label = $label
      sectionId = $sid
      pageHref = $href
      sectionTitle = $label
      sectionText = 'Add section content here.'
      sectionFontFamily = ''
      sectionTitleColor = '#102822'
      sectionTextColor = '#4f6962'
      sectionBackgroundColor = '#e5f0ea'
      navFontFamily = ''
      navTextColor = $(if (Get-StyleValue $style 'color') { Get-StyleValue $style 'color' } else { '#102822' })
      navBackgroundColor = $(if (Get-StyleValue $style 'background-color') { Get-StyleValue $style 'background-color' } else { '#e5f0ea' })
      sectionBackgroundSrc = ''
      sectionBackgroundFileName = ''
      sectionBackgroundTransparency = 36
      galleryLayout = 'horizontal'
      galleryImageTransparency = 0
      galleryImages = @([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''})
    }
  }
}
if ($tabs.Count -eq 0) {
  $tabs = @(
    [ordered]@{ label='HOME'; sectionId='home'; pageHref='index.html'; sectionTitle='HOME'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) },
    [ordered]@{ label='NEWS'; sectionId='news'; pageHref='news.html'; sectionTitle='NEWS'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) },
    [ordered]@{ label='PRIVACY POLICY'; sectionId='privacy'; pageHref='privacy.html'; sectionTitle='PRIVACY POLICY'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) },
    [ordered]@{ label='CONTACT'; sectionId='contact'; pageHref='contact.html'; sectionTitle='CONTACT'; sectionText='Add section content here.'; sectionFontFamily=''; sectionTitleColor='#102822'; sectionTextColor='#4f6962'; sectionBackgroundColor='#e5f0ea'; navFontFamily=''; navTextColor='#102822'; navBackgroundColor='#e5f0ea'; sectionBackgroundSrc=''; sectionBackgroundFileName=''; sectionBackgroundTransparency=36; galleryLayout='horizontal'; galleryImageTransparency=0; galleryImages=@([ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''},[ordered]@{src='';fileName=''}) }
  )
}

$titleAlign = Get-StyleValue $heroTitleSlotStyle 'text-align'; if (-not $titleAlign) { $titleAlign = 'left' }
$subtitleAlign = Get-StyleValue $heroSubtitleSlotStyle 'text-align'; if (-not $subtitleAlign) { $subtitleAlign = 'left' }
$titleFont = ''; $titleFontRaw = Get-StyleValue $heroTitleSlotStyle 'font-family'; if ($titleFontRaw -match "'([^']+)'") { $titleFont = $Matches[1] }
$subtitleFont = ''; $subtitleFontRaw = Get-StyleValue $heroSubtitleSlotStyle 'font-family'; if ($subtitleFontRaw -match "'([^']+)'") { $subtitleFont = $Matches[1] }

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
  brand = [ordered]@{
    name=((Get-MatchValue $html '<title>(.*?)</title>') -replace '<[^>]+>','').Trim()
    logoSrc=$(if ($logos.Count -gt 0) { $logos[0].src } else { '' })
    logoFileName=$(if ($logos.Count -gt 0) { $logos[0].fileName } else { '' })
    logos=$logos
  }
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
