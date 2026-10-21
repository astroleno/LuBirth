#!/usr/bin/env python3
"""Build the 4K close-up night map from the existing 8K asset (requires libwebp)."""
from pathlib import Path
import shutil
import subprocess


def main():
    textures = Path(__file__).resolve().parents[1] / "public" / "textures"
    source = textures / "8k_earth_nightmap.webp"
    target = textures / "4k_earth_nightmap.webp"
    encoder = shutil.which("cwebp")
    if not encoder:
        raise SystemExit("Install libwebp or put its cwebp executable on PATH")
    subprocess.run([encoder, "-quiet", "-q", "90", "-resize", "4096", "2048",
                    str(source), "-o", str(target)], check=True)
    print(f"{target.name}: 4096 × 2048, {target.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
