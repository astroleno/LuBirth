#!/usr/bin/env python3
"""Build the isolated sky spike's licensed, pinned data. No runtime network API."""
import ast
import argparse
import csv
from concurrent.futures import ThreadPoolExecutor
import gzip
import hashlib
import io
import json
import math
from pathlib import Path
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "src/spikes/sky/data"
CACHE = Path(tempfile.gettempdir()) / "lubirth-sky-spike-sources"
HYG_COMMIT = "53e3df311869e813ace5f1ad2ec4ce909f13256c"
SONG_COMMIT = "023040b5241badc9ea0b29428e3ef3f35d2fc65b"
HYG_ROOT = f"https://codeberg.org/astronexus/hyg/raw/commit/{HYG_COMMIT}"
SONG_ROOT = f"https://raw.githubusercontent.com/Stellarium/stellarium/{SONG_COMMIT}/skycultures/chinese_song_dynasty"
PROXY_URL = "https://vizier.cds.unistra.fr/viz-bin/asu-tsv?-source=I%2F239%2Fhip_main&HIP=55203%2C78727&-out=HIP%2CRAhms%2CDEdms%2CHD%2CCCDM%2CMultFlag&-out.max=10"
MODERN_ROOT = "https://raw.githubusercontent.com/Stellarium/stellarium/v26.3/skycultures/modern"
TRANSLATION_URL = "https://raw.githubusercontent.com/Stellarium/stellarium/v26.3/po/stellarium-skycultures/zh_CN.po"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def fetch(url):
    CACHE.mkdir(parents=True, exist_ok=True)
    cache = CACHE / digest(url.encode())
    if cache.exists():
        return cache.read_bytes()
    req = urllib.request.Request(url, headers={"User-Agent": "LuBirth-sky-spike/1.0"})
    with urllib.request.urlopen(req, timeout=40) as response:
        data = response.read(50_000_001)
    if len(data) > 50_000_000:
        raise ValueError("Unexpectedly large source; stop before writing data")
    cache.write_bytes(data)
    return data


def number(row, name):
    try:
        value = float(row[name])
        return value if math.isfinite(value) else None
    except (KeyError, ValueError):
        return None


def translations(data):
    """Read PO strings without executing source or adding a build dependency."""
    result = {}
    for block in data.decode().split("\n\n"):
        fields, field = {}, None
        for line in block.splitlines():
            if line.startswith(("msgid ", "msgstr ", "msgctxt ")):
                field, literal = line.split(" ", 1)
                fields[field] = ast.literal_eval(literal)
            elif line.startswith('"') and field:
                fields[field] += ast.literal_eval(line)
        if fields.get("msgid") and fields.get("msgstr"):
            result[(fields.get("msgctxt", ""), fields["msgid"])] = fields["msgstr"]
    return result


def fetch_lfs(url, sha256, size):
    """Resume this task's cache after interrupted large downloads; verify final bytes."""
    cache = CACHE / digest(url.encode())
    data = cache.read_bytes() if cache.exists() else b""
    if len(data) == size and digest(data) == sha256:
        return data
    if len(data) >= size:
        data = b""
    ranges = [(start, min(size - 1, start + 262_143)) for start in range(len(data), size, 262_144)]

    def get_range(bounds):
        start, end = bounds
        req = urllib.request.Request(url, headers={"User-Agent": "LuBirth-sky-spike/1.0",
                                                   "Range": f"bytes={start}-{end}"})
        with urllib.request.urlopen(req, timeout=40) as response:
            if response.status != 206 or response.headers.get("Content-Range") != f"bytes {start}-{end}/{size}":
                raise ValueError("Unexpected Git LFS range response")
            chunk = b""
            while len(chunk) < end - start + 1:
                block = response.read(min(65536, end - start + 1 - len(chunk)))
                if not block:
                    break
                chunk += block
        if len(chunk) != end - start + 1:
            raise ValueError("Interrupted Git LFS range; retry to resume")
        return chunk

    with ThreadPoolExecutor(max_workers=4) as pool:
        for chunk in pool.map(get_range, ranges):
            data += chunk
            cache.write_bytes(data)
            print(f"HYG source: {len(data)}/{size} bytes", flush=True)
    if digest(data) != sha256:
        cache.unlink()  # Only this task's invalid temporary source; not browser state.
        raise ValueError("HYG Git LFS checksum mismatch")
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--stellarium-assets-root', type=Path,
                        help='Optional official v26.3 skycultures/modern directory; otherwise fetch fixed public URLs')
    args = parser.parse_args()
    hyg_url = f"{HYG_ROOT}/data/hyg/CURRENT/hyg_v44.csv.gz"
    pointer = fetch(hyg_url)
    if pointer.startswith(b"version https://git-lfs.github.com/spec/v1"):
        fields = dict(line.split(" ", 1) for line in pointer.decode().strip().splitlines())
        resolved_url = hyg_url.replace("/raw/commit/", "/media/commit/")
        compressed = fetch_lfs(resolved_url, fields["oid"].split(":", 1)[1], int(fields["size"]))
    else:
        resolved_url, compressed = hyg_url, pointer
    song_bytes = fetch(f"{SONG_ROOT}/index.json")
    song = json.loads(song_bytes)
    modern_bytes = fetch(f"{MODERN_ROOT}/index.json")
    modern = json.loads(modern_bytes)
    if len(modern["constellations"]) != 88:
        raise ValueError("Expected exactly 88 modern constellations")
    if args.stellarium_assets_root and digest((args.stellarium_assets_root / 'index.json').read_bytes()) != digest(modern_bytes):
        raise ValueError('Local official assets do not match the pinned modern index')
    all_refs = {obj for c in song["constellations"] for line in c["lines"] for obj in line}
    refs = {obj for obj in all_refs if isinstance(obj, int) and obj > 0}
    modern_refs = {hip for obj in modern["constellations"] for line in obj["lines"] for hip in line}
    modern_refs |= {anchor["hip"] for obj in modern["constellations"] for anchor in obj.get("image", {}).get("anchors", [])}
    unsupported_objects = sorted(all_refs - refs)
    if unsupported_objects != ["DSO:M44", "DSO:M7"]:
        raise ValueError(f"Unexpected non-HIP references: {unsupported_objects}")
    stars = []
    source_count = 0
    for row in csv.DictReader(io.StringIO(gzip.decompress(compressed).decode("utf-8-sig"))):
        source_count += 1
        if row["id"] == "0":  # HYG includes the Sun; it is not a distant star.
            continue
        hip = int(row["hip"]) if row["hip"] else None
        mag, ra, dec = (number(row, key) for key in ("mag", "ra", "dec"))
        if mag is None or ra is None or dec is None or (mag > 6.5 and hip not in refs | modern_refs):
            continue
        dist = number(row, "dist")
        state = [number(row, key) for key in ("x", "y", "z", "vx", "vy", "vz")]
        if dist is None or not 0 < dist < 100000 or any(value is None for value in state):
            state = [None] * 6
        stars.append([int(row["id"]), hip, ra, dec, mag, number(row, "ci"), *state])
    stars.sort(key=lambda star: (star[4], star[0]))
    hip_ids = [star[1] for star in stars if star[1] is not None]
    if len(hip_ids) != len(set(hip_ids)):
        raise ValueError("Duplicate HIP keys; must resolve before rendering")
    direct_missing = sorted(refs - set(hip_ids))
    # The primary Hipparcos table has no precise astrometry for these system IDs.
    # Keep the HYG component's original identity, and explicitly mark proxy anchors.
    proxy_source = fetch(PROXY_URL)
    cross_ids = {}
    for line in proxy_source.decode().splitlines():
        fields = [field.strip() for field in line.split("\t")]
        if len(fields) == 6 and fields[0].isdigit() and fields[3].isdigit():
            cross_ids[int(fields[0])] = int(fields[3])
    expected = {55203: (118743, 98230), 78727: (119059, 144069)}
    if direct_missing != sorted(expected) or any(cross_ids.get(hip) != hd for hip, (_, hd) in expected.items()):
        raise ValueError("Unexpected HIP gap or changed primary-catalog cross-identification")
    retained = {star[0] for star in stars}
    proxies = [{"hip": hip, "hyg": hyg, "hd": hd, "status": "component-proxy-not-system-photocentre"}
               for hip, (hyg, hd) in expected.items()]
    if any(proxy["hyg"] not in retained for proxy in proxies):
        raise ValueError("A proxy component was filtered out")
    culture = [{"id": c["id"], "name": c.get("common_name", {}).get("native", ""),
                "english": c.get("common_name", {}).get("english", ""), "lines": c["lines"]}
               for c in song["constellations"]]
    catalog = {"schema": 1, "epoch": "J2000.0", "maxMagnitude": 6.5,
               "columns": ["hyg", "hip", "raHours", "decDegrees", "magV", "bMinusV",
                           "xPc", "yPc", "zPc", "vxPcYear", "vyPcYear", "vzPcYear"],
               "stars": stars, "culture": culture, "hipAliases": proxies,
               "lunarSystemUnverified": song.get("lunar_system")}
    DEST.mkdir(parents=True, exist_ok=True)
    output = json.dumps(catalog, ensure_ascii=False, separators=(",", ":")).encode()
    (DEST / "catalog.json").write_bytes(output)
    translation_bytes = fetch(TRANSLATION_URL)
    translated = translations(translation_bytes)
    modern_culture = []
    for obj in modern["constellations"]:
        common = obj["common_name"]
        name = translated.get((common.get("context", ""), common["english"])) or translated.get(("", common["english"]))
        if not name or name == common["english"]:
            raise ValueError(f"Missing official Chinese translation: {common}")
        modern_culture.append({"id": obj["id"], "name": name, "english": common["native"], "lines": obj["lines"]})
        if 'image' in obj:
            modern_culture[-1]['image'] = obj['image']
    def retain_image(obj):
        image = obj['image']
        relative = Path(image['file'])
        if relative.is_absolute() or '..' in relative.parts or relative.parts[0] != 'illustrations':
            raise ValueError('Unexpected source illustration path')
        url = f"{MODERN_ROOT}/{relative.as_posix()}"
        data = (args.stellarium_assets_root / relative).read_bytes() if args.stellarium_assets_root else fetch(url)
        if data[:8] != b'\x89PNG\r\n\x1a\n' or [int.from_bytes(data[i:i+4], 'big') for i in (16,20)] != image['size']:
            raise ValueError('Unexpected PNG dimensions: ' + str(relative))
        (DEST / relative).parent.mkdir(parents=True, exist_ok=True)
        (DEST / relative).write_bytes(data)
        return {'file':relative.as_posix(), 'sourceUrl':url, 'sha256':digest(data), 'bytes':len(data)}
    with ThreadPoolExecutor(max_workers=4) as pool:
        illustrations = list(pool.map(retain_image, [obj for obj in modern_culture if 'image' in obj]))
    modern_output = json.dumps(modern_culture, ensure_ascii=False, separators=(",", ":")).encode()
    (DEST / "modern.json").write_bytes(modern_output)
    modern_description = fetch(f"{MODERN_ROOT}/description.md")
    (DEST / "Modern-description.md").write_bytes(modern_description)
    license_bytes = fetch(f"{HYG_ROOT}/data/hyg/CURRENT/LICENSE")
    description = fetch(f"{SONG_ROOT}/description.md")
    (DEST / "HYG-LICENSE.txt").write_bytes(license_bytes)
    (DEST / "Song-description.md").write_bytes(description)
    (DEST / "HIP-component-identifiers.tsv").write_bytes(proxy_source)
    manifest = {"retrievedDate": "2026-10-21", "hygVersion": "4.4", "hygCommit": HYG_COMMIT,
                "hygPointerUrl": hyg_url, "hygResolvedUrl": resolved_url,
                "hygGzipSha256": digest(compressed), "hygGzipBytes": len(compressed),
                "hygSourceRows": source_count, "songCommit": SONG_COMMIT,
                "songUrl": f"{SONG_ROOT}/index.json", "songSourceSha256": digest(song_bytes),
                "songDescriptionSha256": digest(description), "license": "CC-BY-SA-4.0",
                "modernTag": "v26.3", "modernUrl": f"{MODERN_ROOT}/index.json", "modernSourceSha256": digest(modern_bytes),
                "modernCatalogSha256": digest(modern_output), "modernDescriptionSha256": digest(modern_description),
                "modernEntries": len(modern_culture), "modernHipReferences": len(modern_refs),
                "modernTranslationUrl": TRANSLATION_URL, "modernTranslationSha256": digest(translation_bytes),
                "illustrationsLicense": "Free Art License", "illustrationsLicenseUrl": "https://artlibre.org/licence/lal/en/",
                "illustrations": illustrations, "illustrationsTotalBytes": sum(image['bytes'] for image in illustrations),
                "catalogSha256": digest(output), "catalogBytes": len(output),
                "retainedStars": len(stars), "cultureEntries": len(culture),
                "cultureHipReferences": len(refs), "missingDirectHipReferences": direct_missing,
                "componentProxyHipReferences": proxies, "proxySourceUrl": PROXY_URL,
                "proxySourceSha256": digest(proxy_source), "missingHipReferences": [],
                "unrenderedNonStellarObjects": unsupported_objects,
                "starsWithLinearState": sum(star[6] is not None for star in stars),
                "filter": "Exclude Sun; magV <= 6.5 OR HIP referenced by Song/modern culture; no invented stars"}
    (DEST / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
