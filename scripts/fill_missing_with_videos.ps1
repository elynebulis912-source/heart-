# Remplit les slots numériques manquants (1..200) en copiant/cyclant les vidéos numériques existantes
Param(
    [string]$ImagesDir = "public/Images"
)
Set-StrictMode -Version Latest
if (-not (Test-Path $ImagesDir)) { Write-Error "Dossier '$ImagesDir' introuvable"; exit 1 }

$videos = Get-ChildItem $ImagesDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^[0-9]+\.mp4$' } | Sort-Object Name
if ($videos.Count -eq 0) { Write-Output "Aucune vidéo numérique existante trouvée (0). Rien à copier."; exit 0 }

$existingSlots = $videos | ForEach-Object { [int]($_.BaseName) }
$missing = 1..200 | Where-Object { -not (Test-Path (Join-Path $ImagesDir ("{0}.jpg" -f $_))) -and -not (Test-Path (Join-Path $ImagesDir ("{0}.mp4" -f $_))) }
if ($missing.Count -eq 0) { Write-Output "Aucun slot manquant."; exit 0 }

Write-Output ("Found {0} source videos, {1} missing slots." -f $videos.Count, $missing.Count)

$idx = 0
foreach ($slot in $missing) {
    $src = $videos[ $idx % $videos.Count ]
    $destPath = Join-Path $ImagesDir ("{0}.mp4" -f $slot)
    Copy-Item -Path $src.FullName -Destination $destPath -Force
    Write-Output ("Copied {0} -> {1}" -f $src.Name, (Split-Path $destPath -Leaf))
    $idx++
}

Write-Output "Done."
