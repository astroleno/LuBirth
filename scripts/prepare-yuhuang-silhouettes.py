"""Read existing PNG alpha to describe layout envelopes. Never rewrite image pixels."""
import hashlib
import json
import math
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
data = root / "src/spikes/sky/data"
manifest = json.loads((data / "chinese-art/manifest.json").read_text())

def cross(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def convex_hull(points):
    points = sorted(set(points))
    lower, upper = [], []
    for p in points:
        while len(lower) > 1 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(points):
        while len(upper) > 1 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]

entries = []
for entry in manifest["entries"]:
    path = data / entry["skyImage"]["file"]
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != entry["skyVariant"]["sha256"]:
        raise ValueError("Line art source changed: " + entry["title"])
    with Image.open(path) as image:
        alpha = image.getchannel("A")
        pixels = alpha.load()
        width, height = image.size
        points = []
        for y in range(0, height, 4):
            occupied = [x for x in range(width) if pixels[x, y] >= 32]
            if occupied:
                points.extend([(occupied[0], y), (occupied[-1], y)])
        hull = convex_hull(points)
        # Remove almost straight contour vertices; a six-screen-pixel caption gap
        # remains outside this small source-pixel simplification tolerance.
        while len(hull) > 16:
            distances = []
            for i, p in enumerate(hull):
                a, b = hull[i - 1], hull[(i + 1) % len(hull)]
                distances.append(abs(cross(a, b, p)) / max(1, math.dist(a, b)))
            index = min(range(len(hull)), key=distances.__getitem__)
            if distances[index] > 3:
                break
            hull.pop(index)
        entries.append({"cultureId": entry["cultureId"], "sourceSha256": digest,
                        "hull": [[round(x / width, 5), round(y / height, 5)] for x, y in hull]})

output = {"schema": 1, "method": "Convex alpha envelope, alpha >= 32/255, sampled every four source rows; 3px simplification. Layout analysis only; no image edits.", "entries": entries}
(data / "chinese-art/silhouettes.json").write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n")
print(f"Read {len(entries)} unchanged PNGs; recorded {sum(len(e['hull']) for e in entries)} contour vertices.")
