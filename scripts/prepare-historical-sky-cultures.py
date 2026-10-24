#!/usr/bin/env python3
"""Versioned Chinese cultures, using the existing frozen HYG source for extra HIPs."""
import csv
import gzip
import hashlib
import importlib.util
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("sky_sources", ROOT / "scripts/prepare-sky-spike.py")
source = importlib.util.module_from_spec(spec)
spec.loader.exec_module(source)


def main():
    cultures = []
    provenance = []
    raw_dir = ROOT / "reference/sky/historical-cultures"
    raw_dir.mkdir(parents=True, exist_ok=True)
    required = set()
    for key, directory in [("chenzhuo", "chinese_chenzhuo"), ("yuan", "chinese_yuan_dynasty")]:
        base = f"https://raw.githubusercontent.com/Stellarium/stellarium/v26.3/skycultures/{directory}"
        index_bytes = source.fetch(base + "/index.json")
        description = source.fetch(base + "/description.md")
        index = json.loads(index_bytes)
        (raw_dir / f"{key}-index.json").write_bytes(index_bytes)
        (raw_dir / f"{key}-description.md").write_bytes(description)
        items = []
        non_stars = set()
        for item in index["constellations"]:
            common = item.get("common_name", {})
            name = common.get("native") or common.get("english")
            if not name:
                raise ValueError(f"Unnamed object in {key}: {item['id']}")
            lines = item["lines"]
            for hip in (hip for line in lines for hip in line):
                if isinstance(hip, int) and hip > 0:
                    required.add(hip)
                elif isinstance(hip, str) and hip.startswith("DSO:"):
                    non_stars.add(hip)
                else:
                    raise ValueError(f"Unexpected object ID: {hip}")
            items.append({"id": item["id"], "name": name, "english": common.get("english", name), "lines": lines})
        cultures.append({"id": key, "items": items, "nonStellarObjects": sorted(non_stars)})
        provenance.append({"id": key, "version": "v26.3", "indexUrl": base + "/index.json",
                           "descriptionUrl": base + "/description.md", "indexSha256": source.digest(index_bytes),
                           "descriptionSha256": source.digest(description), "license": "CC BY-SA 4.0",
                           "drawingRecords": len(items), "nonStellarObjects": sorted(non_stars)})
    catalog = json.loads((ROOT / "src/spikes/sky/data/catalog.json").read_text())
    known = {star[1] for star in catalog["stars"]} | {alias["hip"] for alias in catalog["hipAliases"]}
    missing = required - known
    aliases = []
    # Hipparcos gives 115125 no HD/usable motion. Both catalogue entries identify
    # the same CCDM system. Use its already rendered HYG component, never a second
    # invented star; retain the original HIP in cultural lines and disclose proxy.
    if 115125 in missing:
        cross_url = "https://vizier.cds.unistra.fr/viz-bin/asu-tsv?-source=I%2F239%2Fhip_main&HIP=115125%2C115126&-out=HIP%2CRAhms%2CDEdms%2CHD%2CCCDM%2CCCDMcomp%2CMultFlag%2CVmag&-out.max=10"
        cross_file = raw_dir / "hip-115125-cross-id.tsv"
        cross_bytes = cross_file.read_bytes() if cross_file.exists() else source.fetch(cross_url)
        cross_file.write_bytes(cross_bytes)
        rows = {}
        for line in cross_bytes.decode().splitlines():
            fields = [field.strip() for field in line.split("\t")]
            if len(fields) == 7 and fields[0] in ("115125", "115126"):
                rows[int(fields[0])] = fields
        if rows.get(115125, [None] * 5)[4] != "23191-1328" or rows.get(115126, [None] * 5)[3:5] != ["219834", "23191-1328"]:
            raise ValueError("Changed Hipparcos component cross-identification")
        component = [star for star in catalog["stars"] if star[1] == 115126]
        if len(component) != 1 or component[0][0] != 114764:
            raise ValueError("Missing expected HYG component")
        aliases.append({"hip": 115125, "hyg": 114764, "hd": 219834, "status": "component-proxy-not-system-photocentre"})
        provenance.append({"id": "hip-115125-proxy", "source": cross_url, "sha256": source.digest(cross_bytes),
                           "note": "HIP 115125 and 115126 share CCDM 23191-1328. Uses HYG 114764 / HIP 115126 component, about 14 arcseconds apart at catalog epoch; not a measured historical system photocentre."})
        missing.remove(115125)
    extra = []
    if missing:
        hyg_url = f"{source.HYG_ROOT}/data/hyg/CURRENT/hyg_v44.csv.gz"
        pointer = source.fetch(hyg_url)
        if pointer.startswith(b"version https://git-lfs.github.com/spec/v1"):
            fields = dict(line.split(" ", 1) for line in pointer.decode().strip().splitlines())
            compressed = source.fetch_lfs(hyg_url.replace("/raw/commit/", "/media/commit/"), fields["oid"].split(":", 1)[1], int(fields["size"]))
        else:
            compressed = pointer
        for row in csv.DictReader(io.StringIO(gzip.decompress(compressed).decode("utf-8-sig"))):
            hip = int(row["hip"]) if row["hip"] else None
            if hip not in missing:
                continue
            mag, ra, dec = (source.number(row, key) for key in ("mag", "ra", "dec"))
            if any(value is None for value in (mag, ra, dec)):
                raise ValueError(f"Invalid star: {hip}")
            dist = source.number(row, "dist")
            state = [source.number(row, key) for key in ("x", "y", "z", "vx", "vy", "vz")]
            if dist is None or not 0 < dist < 100000 or any(value is None for value in state):
                state = [None] * 6
            extra.append([int(row["id"]), hip, ra, dec, mag, source.number(row, "ci"), *state])
        extra.sort(key=lambda star: star[1])
        if {star[1] for star in extra} != missing:
            raise ValueError(f"Unresolved HIPs: {sorted(missing - {star[1] for star in extra})}")
    data = {"schema": 1, "cultures": cultures, "extraStars": extra, "hipAliases": aliases,
            "provenance": provenance, "hygCommit": source.HYG_COMMIT,
            "limitations": ["Historical culture reconstruction, not a facsimile of a single surviving map",
                            "Non-HIP objects listed separately; no lunar mansion boundaries inferred"]}
    output = ROOT / "src/spikes/sky/data/historical-cultures.json"
    output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(json.dumps({"cultures": provenance, "extraStars": len(extra), "sha256": source.digest(output.read_bytes())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
