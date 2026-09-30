#!/usr/bin/env python3
"""Generate preferred WebP assets; retain original JPEGs as runtime fallbacks.

Requires the official libwebp cwebp executable. Height/specular/normal data are
lossless; color maps use quality 90 at unchanged dimensions. Larger conversions
are discarded so these maps continue using their original JPEG.
"""
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1] / "public" / "textures"
encoder = shutil.which("cwebp")
if not encoder:
    raise SystemExit("Install libwebp or put its cwebp executable on PATH")
names = ["2k_earth_daymap", "2k_earth_nightmap", "2k_earth_clouds", "2k_moon",
         "2k_earth_specular_map", "2k_earth_displacement_map", "2k_moon_displacement", "2k_moon_normal"]
before = after = 0
for name in names:
    source, target = root / f"{name}.jpg", root / f"{name}.webp"
    data = any(kind in name for kind in ("displacement", "specular", "normal"))
    options = ["-lossless"] if data else ["-q", "90"]
    subprocess.run([encoder, "-quiet", *options, str(source), "-o", str(target)], check=True)
    before += source.stat().st_size
    result_size = target.stat().st_size
    if result_size >= source.stat().st_size:
        target.unlink()
        result_size = source.stat().st_size
    after += result_size
    print(f"{name}: {source.stat().st_size} → {result_size} bytes")
print(f"Total: {before} → {after} bytes ({100 * (1 - after / before):.1f}% smaller)")
