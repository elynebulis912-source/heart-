# Liste les images et vidéos numériques et affiche les slots 1..200 manquants
$images = Get-ChildItem 'public/Images' -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^[0-9]+\.jpg$' }
$videos = Get-ChildItem 'public/Images' -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^[0-9]+\.mp4$' }
Write-Output ("Images: {0}" -f $images.Count)
Write-Output ("Videos: {0}" -f $videos.Count)
$missing = 1..200 | Where-Object { -not (Test-Path (Join-Path 'public/Images' ("{0}.jpg" -f $_))) -and -not (Test-Path (Join-Path 'public/Images' ("{0}.mp4" -f $_))) }
Write-Output ("Missing slots: {0}" -f $missing.Count)
if ($missing.Count -gt 0) {
    Write-Output ($missing -join ', ')
}
