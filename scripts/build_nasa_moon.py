#!/usr/bin/env python3
"""Resample NASA SVS 14959's topographic GLB into a small, web-ready GLB.

Requires numpy, scipy and Pillow. The source GLB is downloaded separately from
https://svs.gsfc.nasa.gov/14959/ and is not kept in this repository.
"""

import argparse
import hashlib
import io
import json
import struct
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.spatial import cKDTree


SOURCE_URL = "https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/Moon_NASA_LRO_8k_Topo_Small.glb"


def read_glb(path: Path):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from("<4sII", data)
    if magic != b"glTF" or version != 2 or length != len(data):
        raise ValueError("Expected a complete glTF 2.0 binary")
    json_length, json_type = struct.unpack_from("<II", data, 12)
    if json_type != 0x4E4F534A:
        raise ValueError("Missing JSON chunk")
    document = json.loads(data[20:20 + json_length])
    binary_start = 20 + json_length
    binary_length, binary_type = struct.unpack_from("<II", data, binary_start)
    if binary_type != 0x004E4942:
        raise ValueError("Missing BIN chunk")
    binary = memoryview(data)[binary_start + 8:binary_start + 8 + binary_length]
    return document, binary, hashlib.sha256(data).hexdigest()


def accessor(document, binary, index):
    spec = document["accessors"][index]
    view = document["bufferViews"][spec["bufferView"]]
    if spec["componentType"] != 5126:
        raise ValueError("Expected float32 source attribute")
    components = {"VEC2": 2, "VEC3": 3}[spec["type"]]
    offset = view.get("byteOffset", 0) + spec.get("byteOffset", 0)
    return np.frombuffer(binary, "<f4", spec["count"] * components, offset).reshape(-1, components)


def image_bytes(document, binary):
    view = document["bufferViews"][document["images"][0]["bufferView"]]
    start = view.get("byteOffset", 0)
    return bytes(binary[start:start + view["byteLength"]])


def build(source: Path, output: Path, longitude_segments: int, latitude_segments: int):
    document, binary, source_sha = read_glb(source)
    primitive = document["meshes"][0]["primitives"][0]
    source_uv = accessor(document, binary, primitive["attributes"]["TEXCOORD_0"])
    source_pos = accessor(document, binary, primitive["attributes"]["POSITION"])
    tree = cKDTree(source_uv)

    u = np.linspace(0, 1, longitude_segments + 1, dtype=np.float32)
    v = np.linspace(0, 1, latitude_segments + 1, dtype=np.float32)
    uu, vv = np.meshgrid(u, v)
    uv = np.column_stack((uu.ravel(), vv.ravel())).astype("<f4")
    _, closest = tree.query(uv)
    radius = np.linalg.norm(source_pos[closest], axis=1).reshape(uu.shape)
    # The NASA GLB notes pinched pole artifacts. Build a single regular pole
    # height from its adjacent ring so the resampled silhouette has no spike.
    radius[0, :] = np.median(radius[1, :])
    radius[-1, :] = np.median(radius[-2, :])
    radius[:, -1] = radius[:, 0]

    azimuth = uu * 2 * np.pi
    latitude = vv * np.pi
    sin_latitude = np.sin(latitude)
    positions = np.stack((
        -np.cos(azimuth) * sin_latitude * radius,
        np.cos(latitude) * radius,
        np.sin(azimuth) * sin_latitude * radius,
    ), axis=-1).reshape(-1, 3).astype("<f4")

    stride = longitude_segments + 1
    rows = np.arange(latitude_segments)[:, None] * stride
    columns = np.arange(longitude_segments)[None, :]
    a = (rows + columns).ravel()
    b = a + 1
    c = a + stride
    d = c + 1
    indices = np.stack((a, c, b, b, c, d), axis=1).ravel().astype("<u4")

    normals = np.zeros_like(positions)
    triangles = indices.reshape(-1, 3)
    face_normals = np.cross(
        positions[triangles[:, 1]] - positions[triangles[:, 0]],
        positions[triangles[:, 2]] - positions[triangles[:, 0]],
    )
    for corner in range(3):
        np.add.at(normals, triangles[:, corner], face_normals)
    norm = np.linalg.norm(normals, axis=1)
    radial = positions / np.maximum(np.linalg.norm(positions, axis=1, keepdims=True), 1e-8)
    normals = np.where((norm > 1e-8)[:, None], normals / np.maximum(norm[:, None], 1e-8), radial)
    if np.mean(np.sum(normals * radial, axis=1)) < 0:
        raise ValueError("Generated mesh has inward-facing normals")
    normals = normals.astype("<f4")

    with Image.open(io.BytesIO(image_bytes(document, binary))) as source_image:
        image = source_image.convert("RGB").resize((2048, 1024), Image.Resampling.LANCZOS)
        image_stream = io.BytesIO()
        image.save(image_stream, format="JPEG", quality=84, optimize=True)
        color_map = image_stream.getvalue()

    payload = bytearray()
    views = []
    for blob, target in ((positions.tobytes(), 34962), (normals.tobytes(), 34962),
                         (uv.tobytes(), 34962), (indices.tobytes(), 34963), (color_map, None)):
        payload.extend(b"\0" * (-len(payload) % 4))
        view = {"buffer": 0, "byteOffset": len(payload), "byteLength": len(blob)}
        if target:
            view["target"] = target
        views.append(view)
        payload.extend(blob)
    payload.extend(b"\0" * (-len(payload) % 4))

    accessors = [
        {"bufferView": 0, "componentType": 5126, "count": len(positions), "type": "VEC3",
         "min": positions.min(axis=0).tolist(), "max": positions.max(axis=0).tolist()},
        {"bufferView": 1, "componentType": 5126, "count": len(normals), "type": "VEC3"},
        {"bufferView": 2, "componentType": 5126, "count": len(uv), "type": "VEC2"},
        {"bufferView": 3, "componentType": 5125, "count": len(indices), "type": "SCALAR"},
    ]
    reduced = {
        "asset": {"version": "2.0", "generator": "LuBirth NASA topography resampler",
                  "extras": {"source": SOURCE_URL, "sourceSha256": source_sha,
                             "credit": "NASA's Goddard Space Flight Center"}},
        "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0, "name": "NASA Moon"}],
        "meshes": [{"primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2},
                                    "indices": 3, "material": 0}]}],
        "materials": [{"pbrMetallicRoughness": {"baseColorTexture": {"index": 0},
                                               "metallicFactor": 0, "roughnessFactor": 1}}],
        "textures": [{"source": 0}], "images": [{"bufferView": 4, "mimeType": "image/jpeg"}],
        "accessors": accessors, "bufferViews": views, "buffers": [{"byteLength": len(payload)}],
    }
    json_chunk = json.dumps(reduced, separators=(",", ":")).encode()
    json_chunk += b" " * (-len(json_chunk) % 4)
    length = 12 + 8 + len(json_chunk) + 8 + len(payload)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(struct.pack("<4sII", b"glTF", 2, length)
                       + struct.pack("<II", len(json_chunk), 0x4E4F534A) + json_chunk
                       + struct.pack("<II", len(payload), 0x004E4942) + payload)
    print(json.dumps({"output": str(output), "bytes": length,
                      "triangles": len(indices) // 3, "vertices": len(positions),
                      "sourceSha256": source_sha}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--longitude-segments", type=int, default=128)
    parser.add_argument("--latitude-segments", type=int, default=64)
    args = parser.parse_args()
    if args.longitude_segments < 32 or args.latitude_segments < 16:
        parser.error("segment counts are too low")
    build(args.source, args.output, args.longitude_segments, args.latitude_segments)


if __name__ == "__main__":
    main()
