$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_videos_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
if (-not (Test-Path $backup)) { New-Item -ItemType Directory -Path $backup | Out-Null }

# collect available mp4 files (exclude numeric-named and backups)
$allMp4 = Get-ChildItem -Path $dir -File | Where-Object { $_.Extension -ieq '.mp4' -and $_.BaseName -notmatch '^[0-9]+$' }
if ($allMp4.Count -eq 0) { Write-Host 'No non-numeric mp4 files found to assign.'; exit 0 }

Write-Host ("Found {0} candidate mp4(s) to assign." -f $allMp4.Count)

# find missing numeric slots 1..200 where no jpg or mp4 exists
$missing = @()
for ($i=1; $i -le 200; $i++) {
  $jpg = Join-Path $dir ("{0}.jpg" -f $i)
  $mp4 = Join-Path $dir ("{0}.mp4" -f $i)
  if (-not (Test-Path $jpg) -and -not (Test-Path $mp4)) { $missing += $i }
}

Write-Host ("Missing numeric slots: {0}" -f ($missing -join ', '))

$index = 0
foreach ($slot in $missing) {
  if ($index -ge $allMp4.Count) { break }
  $src = $allMp4[$index]
  $target = Join-Path $dir ("{0}.mp4" -f $slot)
  # if target exists, move it to backup
  if (Test-Path $target) {
    Move-Item -LiteralPath $target -Destination $backup
  }
  Rename-Item -LiteralPath $src.FullName -NewName ("{0}.mp4" -f $slot)
  Write-Host ("Assigned {0} -> {1}.mp4" -f $src.Name, $slot)
  $index++
}

Write-Host ("Assigned $index videos to numeric slots.")
if ($index -lt $allMp4.Count) { Write-Host ("{0} mp4(s) left unassigned." -f ($allMp4.Count - $index)) }
Write-Host 'Done.'
