$root = Split-Path $PSScriptRoot -Parent
$imagesDir = Join-Path $root 'public\Images'
if (-not (Test-Path $imagesDir)) { Write-Host "Dossier introuvable: $imagesDir"; exit 1 }
$backups = Get-ChildItem -Path $imagesDir -Directory | Where-Object { $_.Name -like 'backup_*' }
if ($backups.Count -eq 0) { Write-Host 'Aucun dossier backup_* trouvé.'; exit 0 }

foreach ($b in $backups) {
  Write-Host "Processing backup: $($b.Name)"
  $files = Get-ChildItem -Path $b.FullName -File -Recurse
  foreach ($f in $files) {
    $dest = Join-Path $imagesDir $f.Name
    if (Test-Path $dest) {
      $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
      $ext = [System.IO.Path]::GetExtension($f.Name)
      $k = 1
      do {
        $candidate = "$base`_restored_$k$ext"
        $k++
      } while (Test-Path (Join-Path $imagesDir $candidate))
      $newPath = Join-Path $imagesDir $candidate
      Move-Item -LiteralPath $f.FullName -Destination $newPath
      Write-Host "Moved and renamed: $($f.Name) -> $candidate"
    } else {
      Move-Item -LiteralPath $f.FullName -Destination $dest
      Write-Host "Moved: $($f.Name)"
    }
  }
  # Remove backup dir if empty
  if (-not (Get-ChildItem -Path $b.FullName -Recurse | Where-Object { $_.PSIsContainer -eq $false })) {
    Remove-Item -LiteralPath $b.FullName -Recurse
    Write-Host "Removed empty backup folder: $($b.Name)"
  } else {
    Write-Host "Backup folder still contains items: $($b.Name)"
  }
}

Write-Host 'Restore completed.'
