$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$missing = @()
$imageCount = 0
$videoCount = 0
for ($i = 1; $i -le 200; $i++) {
  $jpg = Join-Path $dir ("{0}.jpg" -f $i)
  $mp4 = Join-Path $dir ("{0}.mp4" -f $i)
  $hasJ = Test-Path $jpg
  $hasV = Test-Path $mp4
  if ($hasJ) { $imageCount++ }
  if ($hasV) { $videoCount++ }
  if (-not $hasJ -and -not $hasV) { $missing += $i }
}
Write-Host "Images: $imageCount, Videos: $videoCount, Missing slots: $($missing.Count)"
if ($missing.Count -gt 0) { Write-Host 'Missing list:'; Write-Host ($missing -join ', ') }
