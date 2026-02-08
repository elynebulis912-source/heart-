$root = Split-Path $PSScriptRoot -Parent
$dir = Join-Path $root 'public\\Images'
if (-not (Test-Path $dir)) { Write-Host "Dossier introuvable: $dir"; exit 1 }
$backup = Join-Path $dir ('backup_'+(Get-Date -Format 'yyyyMMdd_HHmmss'))
if (-not (Test-Path $backup)) { New-Item -ItemType Directory -Path $backup | Out-Null }
$exts = '.jpg','.jpeg','.png','.webp','.gif'
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name
if ($files.Count -eq 0) { Write-Host 'Aucune image trouvée.'; exit 0 }

# current max numeric name
$numeric = $files | Where-Object { $_.BaseName -match '^[0-9]+$' }
if ($numeric.Count -gt 0) { $max = ($numeric | ForEach-Object {[int]$_.BaseName} | Measure-Object -Maximum).Maximum } else { $max = 0 }
$need = 200 - $max
if ($need -le 0) { Write-Host "Déjà $max images numérotées, rien à faire."; exit 0 }

# choose non-numeric images to fill the gap
$non = $files | Where-Object { -not ($_.BaseName -match '^[0-9]+$') -and $_.Name -notlike 'backup_*' -and $_.Name -notlike '__*' }
$toTake = $non | Select-Object -First $need
Write-Host ("Will rename {0} files to reach 200 (starting at {1})." -f $toTake.Count, ($max+1))

# rename to temporary names to avoid collisions
$tmpIndex = 1
foreach ($f in $toTake) {
  if (-not (Test-Path $f.FullName)) { Write-Host ("Skipping missing file: {0}" -f $f.FullName); continue }
  $tmp = "__cont_{0:0000}{1}" -f $tmpIndex, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $tmp
  $tmpIndex++
}

# move any conflicts
for ($j=$max+1; $j -le $max + $toTake.Count; $j++) {
  $conflicts = Get-ChildItem -Path $dir -File | Where-Object { $_.BaseName -eq $j.ToString() -and $_.Name -notlike '__cont_*' }
  foreach ($c in $conflicts) { Move-Item -LiteralPath $c.FullName -Destination $backup }
}

# final rename
$tmpFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.Name -like '__cont_*' } | Sort-Object Name
$j = $max + 1
foreach ($f in $tmpFiles) {
  $newName = "{0}{1}" -f $j, $f.Extension
  Rename-Item -LiteralPath $f.FullName -NewName $newName
  $j++
}

Write-Host ("Renamed {0} files. Now max = {1}." -f ($j - $max -1), ($j-1))
