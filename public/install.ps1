$ErrorActionPreference = "Stop"
$release = Invoke-RestMethod "https://api.github.com/repos/B-Divyesh/sf-local-caption-tape/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match "\.exe$" } | Select-Object -First 1
$sums = $release.assets | Where-Object { $_.name -eq "SHA256SUMS" } | Select-Object -First 1
if (-not $asset -or -not $sums) { throw "Windows downloads are still being published." }
$target = Join-Path $env:LOCALAPPDATA "LocalCaptionTape\LocalCaptionTape.exe"
New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
$temp = "$target.download"
Invoke-WebRequest $asset.browser_download_url -OutFile $temp
$sumText = (Invoke-WebRequest $sums.browser_download_url).Content
$hash = (Get-FileHash $temp -Algorithm SHA256).Hash.ToLower()
if ($sumText -notmatch $hash) { Remove-Item $temp; throw "Checksum did not match. Nothing was installed." }
Move-Item -Force $temp $target
Write-Output "Installed Local Caption Tape at $target"
