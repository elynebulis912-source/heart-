$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
if (-not (Test-Path $backup)) { New-Item -ItemType Directory -Path $backup | Out-Null }
$exts = '.jpg','.jpeg','.png','.webp','.gif'
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
if ($files.Count -eq 0) { Write-Host 'Aucune image trouvée.'; exit 0 }
$max = [math]::Min(200, $files.Count)
$toProcess = $files[0..($max-1)]
Write-Host ("Found {0} image(s) to process." -f $toProcess.Count)

# 1) Rename selected files to temporary names to avoid collisions
$i=1
foreach ($f in $toProcess) {
  if (-not (Test-Path $f.FullName)) { Write-Host ("Skipping missing file: {0}" -f $f.FullName); $i++; continue }
  $tmp = "__tmp_{0:0000}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $tmp
  $i++
}

# 2) Move any existing files that would conflict with final numeric names to backup
for ($i=1; $i -le $toProcess.Count; $i++) {
  $conflicts = Get-ChildItem -Path $dir -File | Where-Object { $_.BaseName -eq $i.ToString() -and $_.Name -notlike '__tmp_*' }
  foreach ($c in $conflicts) {
    Move-Item -LiteralPath $c.FullName -Destination $backup
  }
}

# 3) Rename temporary files to final numeric names (preserve extension)
$tmpFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.Name -like '__tmp_*' } | Sort-Object Name
$i=1
foreach ($f in $tmpFiles) {
  $newName = "{0}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  $i++
}

Write-Host ("Renamed {0} files." -f ($i-1))
$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Path $backup | Out-Null
$exts = '.jpg','.jpeg','.png','.webp','.gif'
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
if ($files.Count -eq 0) { Write-Host 'Aucune image trouvée.'; exit 0 }
$max = [math]::Min(200, $files.Count)
$toProcess = $files[0..($max-1)]
Write-Host ("Found {0} image(s) to process." -f $toProcess.Count)

# 1) Rename selected files to temporary names to avoid collisions
$i=1
foreach ($f in $toProcess) {
  if (-not (Test-Path $f.FullName)) { Write-Host ("Skipping missing file: {0}" -f $f.FullName); $i++; continue }
  $tmp = "__tmp_{0:0000}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $tmp
  $i++
}

# 2) Move any existing files that would conflict with final numeric names to backup
for ($i=1; $i -le $toProcess.Count; $i++) {
  $conflicts = Get-ChildItem -Path $dir -File | Where-Object { $_.BaseName -eq $i.ToString() -and $_.Name -notlike '__tmp_*' }
  foreach ($c in $conflicts) {
    Move-Item -LiteralPath $c.FullName -Destination $backup
  }
}

# 3) Rename temporary files to final numeric names (preserve extension)
$tmpFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.Name -like '__tmp_*' } | Sort-Object Name
$i=1
foreach ($f in $tmpFiles) {
  $newName = "{0}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  $i++
}

Write-Host ("Renamed {0} files." -f ($i-1))
$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Path $backup | Out-Null
$exts = '.jpg','.jpeg','.png','.webp','.gif'
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
if ($files.Count -eq 0) { Write-Host 'Aucune image trouvée.'; exit 0 }
$max = [math]::Min(200, $files.Count)
$toProcess = $files[0..($max-1)]
Write-Host ("Found {0} image(s) to process." -f $toProcess.Count)
for ($i=0; $i -lt $toProcess.Count; $i++) {
  $target = Join-Path $dir ("{0}{1}" -f ($i+1), $toProcess[$i].Extension)
  if (Test-Path $target) {
    Move-Item -LiteralPath $target -Destination $backup
  }
}
$i=1
foreach ($f in $toProcess) {
  $tmp = "__tmp_{0:0000}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $tmp
  $i++
}
$tmpFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.Name -like '__tmp_*' } | Sort-Object Name
$i=1
foreach ($f in $tmpFiles) {
  $newName = "{0}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  $i++
}
Write-Host ("Renamed {0} files." -f ($i-1))
$dir = Join-Path $PSScriptRoot 'public\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Path $backup | Out-Null
$exts = '.jpg','.jpeg','.png','.webp','.gif'
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
if ($files.Count -eq 0) { Write-Host 'Aucune image trouvée.'; exit 0 }
$max = [math]::Min(200, $files.Count)
$toProcess = $files[0..($max-1)]
Write-Host ("Found {0} image(s) to process." -f $toProcess.Count)
for ($i=0; $i -lt $toProcess.Count; $i++) {
  $target = Join-Path $dir ("{0}{1}" -f ($i+1), $toProcess[$i].Extension)
  if (Test-Path $target) {
    Move-Item -LiteralPath $target -Destination $backup
  }
}
$i=1
foreach ($f in $toProcess) {
  $tmp = "__tmp_{0:0000}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $tmp
  $i++
}
$tmpFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.Name -like '__tmp_*' } | Sort-Object Name
$i=1
foreach ($f in $tmpFiles) {
  $newName = "{0}{1}" -f $i, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  $i++
}
Write-Host ("Renamed {0} files." -f ($i-1))
