param(
  [string]$SrcDir = "C:\Users\tcabb\OneDrive\Documents\Wedding video presentation\photos",
  [string]$OutDir = "C:\Users\tcabb\OneDrive\Documents\Wedding video presentation\photos\clean\16x9"
)
$bases = @('IMG_7759','IMG_7769','IMG_7787','IMG_7795','IMG_7800','IMG_7814','IMG_7830','IMG_7836','IMG_7838','IMG_7854','IMG_7855','IMG_7863')
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
foreach ($b in $bases) {
  $src = Join-Path $SrcDir ($b + ".JPG")
  if (!(Test-Path $src)) { Write-Host "missing $src"; continue }
  $outJpg = Join-Path $OutDir ($b + ".jpg")
  $outWebp = Join-Path $OutDir ($b + ".webp")
  Write-Host "16:9 $b"
  & ffmpeg -hide_banner -loglevel error -y -i $src -vf "scale=w=1920:h=1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,unsharp=3:3:0.6:3:3:0,eq=contrast=1.04:saturation=1.06" -q:v 3 -frames:v 1 $outJpg
  & ffmpeg -hide_banner -loglevel error -y -i $src -vf "scale=w=1920:h=1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,unsharp=3:3:0.5:3:3:0" -c:v libwebp -quality 78 -frames:v 1 $outWebp
}
Get-ChildItem $OutDir | Select-Object Name,Length | Format-Table -AutoSize
