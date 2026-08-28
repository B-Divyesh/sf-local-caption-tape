#!/bin/sh
set -eu
repo="B-Divyesh/sf-local-caption-tape"
api="https://api.github.com/repos/$repo/releases/latest"
python3 - "$api" <<'PY'
import hashlib, json, os, pathlib, stat, sys, tempfile, urllib.request
data = json.load(urllib.request.urlopen(sys.argv[1]))
assets = {a['name']: a['browser_download_url'] for a in data['assets']}
name = next((n for n in assets if n.endswith('.AppImage')), None)
if not name: raise SystemExit('Linux download is still being published.')
checks = next((u for n,u in assets.items() if n == 'SHA256SUMS'), None)
expected = urllib.request.urlopen(checks).read().decode() if checks else ''
target = pathlib.Path.home() / '.local' / 'bin' / 'local-caption-tape.AppImage'
target.parent.mkdir(parents=True, exist_ok=True)
with urllib.request.urlopen(assets[name]) as src, tempfile.NamedTemporaryFile(delete=False) as out:
    out.write(src.read()); temp = pathlib.Path(out.name)
digest = hashlib.sha256(temp.read_bytes()).hexdigest()
if not any(line.startswith(digest) and name in line for line in expected.splitlines()): temp.unlink(); raise SystemExit('Checksum did not match. Nothing was installed.')
temp.replace(target); target.chmod(target.stat().st_mode | stat.S_IXUSR)
print(f'Installed Local Caption Tape at {target}')
PY
