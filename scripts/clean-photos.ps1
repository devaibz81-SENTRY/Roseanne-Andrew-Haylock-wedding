# Chad CSM - CLEAN photo run
param(
  [string]$SrcDir = "C:\Users\tcabb\OneDrive\Documents\Wedding video presentation\photos",
  [string]$OutDir = "C:\Users\tcabb\OneDrive\Documents\Wedding video presentation\photos\clean",
  [int]$MaxSide = 1800,
  [int]$JpegQ = 3
)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$files = Get-ChildItem -LiteralPath $SrcDir -Filter "IMG_*.JPG" | Sort-Object Name
if ($files.Count -eq 0) { Write-Host "No IMG images found"; exit 1 }
Write-Host "Chad CSM clean run - $($files.Count) photos"
$i=0
foreach ($f in $files) {
  $i++
  $outJpg = Join-Path $OutDir ($f.BaseName + ".jpg")
  $outWebp = Join-Path $OutDir ($f.BaseName + ".webp")
  Write-Host "[$i/$($files.Count)] $($f.Name)"
  $vf = "scale=w=${MaxSide}:h=${MaxSide}:force_original_aspect_ratio=decrease:flags=lanczos,unsharp=3:3:0.6:3:3:0,eq=contrast=1.04:saturation=1.06:brightness=0.01"
  & ffmpeg -hide_banner -loglevel error -y -i $f.FullName -vf $vf -q:v $JpegQ -frames:v 1 $outJpg
  if ($LASTEXITCODE -ne 0) { Write-Host "  jpg fail"; continue }
  & ffmpeg -hide_banner -loglevel error -y -i $f.FullName -vf "scale=w=${MaxSide}:h=${MaxSide}:force_original_aspect_ratio=decrease:flags=lanczos,unsharp=3:3:0.5:3:3:0" -c:v libwebp -quality 78 -frames:v 1 $outWebp
  $orig = $f.Length
  $clean = (Get-Item $outJpg).Length
  $saved = [math]::Round((1 - $clean/$orig)*100,1)
  Write-Host "  $orig -> $clean bytes saved $saved pct"
}
$thumbDir = Join-Path $OutDir "thumbs"
New-Item -ItemType Directory -Force -Path $thumbDir | Out-Null
foreach ($f in $files) {
  $tOut = Join-Path $thumbDir ($f.BaseName + "_thumb.jpg")
  & ffmpeg -hide_banner -loglevel error -y -i $f.FullName -vf "scale=w=600:h=600:force_original_aspect_ratio=decrease:flags=lanczos" -q:v 4 -frames:v 1 $tOut | Out-Null
}
Write-Host "Done clean assets"
$sum = (Get-ChildItem $OutDir -File | Measure-Object Length -Sum).Sum
Write-Host "Clean total MB: $([math]::Round($sum/1MB,1))"
$sum2 = (Get-ChildItem $thumbDir -File | Measure-Object Length -Sum).Sum
Write-Host "Thumbs total MB: $([math]::Round($sum2/1MB,1))"
# manifests for auto-loading in site (no HTML edit needed when you add photos)
$cleanList = Get-ChildItem -LiteralPath $OutDir -Filter "*.jpg" | Where-Object { $_.Name -notlike "*_thumb*" } | Sort-Object Name | ForEach-Object { "photos/clean/$($_.Name)" }
$cleanList | ConvertTo-Json -Compress | Set-Content -LiteralPath (Join-Path $OutDir "manifest.json") -Encoding utf8
$origList = Get-ChildItem -LiteralPath $SrcDir -Filter "IMG_*.JPG" | Sort-Object Name | ForEach-Object { "photos/$($_.Name)" }
$origList | ConvertTo-Json -Compress | Set-Content -LiteralPath (Join-Path $SrcDir "manifest.json") -Encoding utf8
Write-Host "Manifests written: photos/clean/manifest.json + photos/manifest.json"
