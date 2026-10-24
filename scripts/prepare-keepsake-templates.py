"""Build three labelled, offline assets from LuBirth's reviewed Inko scene.

Requires Pillow and numpy. Glyph alpha comes from the original gray atlas,
not a thresholded screenshot. SVG masks reveal whole glyphs, not real strokes.
Run: python3 scripts/prepare-keepsake-templates.py
"""
from base64 import b64encode
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import struct
from xml.sax.saxutils import escape
from zipfile import ZipFile
import zlib

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/assets/inko/2026-10-24'
OUT = ROOT / 'public/keepsake/templates/v1'
TEMPLATES = [('first-meeting', '天地初见'), ('earth-and-you', '天地与你'), ('same-moon', '与古人同望')]


def png_bytes(image):
    buffer = BytesIO()
    image.save(buffer, 'PNG', optimize=True)
    return buffer.getvalue()


def data_url(image):
    return 'data:image/png;base64,' + b64encode(png_bytes(image)).decode()


def metadata_chunks(data):
    chunks, offset = [], 8
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    while offset < len(data):
        size = struct.unpack('>I', data[offset:offset + 4])[0]
        kind, payload = data[offset + 4:offset + 8], data[offset + 8:offset + 8 + size]
        assert zlib.crc32(kind + payload) == struct.unpack('>I', data[offset + 8 + size:offset + 12 + size])[0]
        if kind in (b'iTXt', b'tEXt') and payload.split(b'\0')[0] in (b'AIGC', b'XML:com.adobe.xmp'):
            chunks.append({'type': kind.decode(), 'data': b64encode(payload).decode()})
        offset += size + 12
    assert len(chunks) == 2
    return chunks


def write_labelled_png(path, image, chunks):
    data = png_bytes(image)
    extra = b''
    for item in [*chunks, {'type': 'tEXt', 'data': b64encode(b'InkoEdited\0true').decode()}]:
        from base64 import b64decode
        kind, payload = item['type'].encode(), b64decode(item['data'])
        extra += struct.pack('>I', len(payload)) + kind + payload + struct.pack('>I', zlib.crc32(kind + payload))
    path.write_bytes(data[:-12] + extra + data[-12:])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    original = (SOURCE / 'source-page.png').read_bytes()
    chunks = metadata_chunks(original)
    aigc = json.loads(Image.open(BytesIO(original)).info['AIGC'])
    with ZipFile(SOURCE / 'source-scene.zip') as package:
        scene = json.loads(package.read('scene.json'))
        page = scene['pages'][0]
        label_bytes = package.read(scene['label']['image'])
        label = Image.open(BytesIO(label_bytes)).convert('RGBA')
        atlas = Image.open(BytesIO(package.read('sprites/page-1.png'))).convert('L')
    assert scene['text'] == '\n'.join(text for _, text in TEMPLATES)
    assert aigc['ProduceID'] == page['aigc_id']
    rows = np.flatnonzero((np.asarray(label.getchannel('A')) > 128).any(1))
    label_text_height = int(rows[-1] - rows[0] + 1)
    (OUT / 'inko-label.png').write_bytes(label_bytes)
    manifest = {'version': 1, 'templates': []}
    for line, (identifier, text) in enumerate(TEMPLATES):
        glyphs = [glyph for glyph in page['glyphs'] if glyph['line'] == line]
        assert ''.join(glyph['c'] for glyph in glyphs) == text
        x0 = min(glyph['ink'][0] for glyph in glyphs) - 12
        y0 = min(glyph['ink'][1] for glyph in glyphs) - 12
        width = max(glyph['ink'][2] for glyph in glyphs) - x0 + 12
        ink_height = max(glyph['ink'][3] for glyph in glyphs) - y0 + 12
        height = ink_height + 44
        lab_scale = max(14, height * .06) / label_text_height
        lab_w, lab_h = label.width * lab_scale, label.height * lab_scale
        lab_x, lab_y = width - lab_w - 12, height - lab_h - 8
        assert lab_y >= ink_height + 5
        body = Image.new('RGBA', (width, height))
        card_elements, loading_elements, masks = [], [], []
        for index, glyph in enumerate(glyphs):
            sx, sy, sw, sh = glyph['sprite']['rect']
            alpha = Image.fromarray(255 - np.asarray(atlas.crop((sx, sy, sx + sw, sy + sh))))
            ink = Image.new('RGBA', alpha.size, (0, 0, 0, 255)); ink.putalpha(alpha)
            light = Image.new('RGBA', alpha.size, (230, 221, 202, 255)); light.putalpha(alpha)
            a, b, c, d, e, f = glyph['m']; c -= x0; f -= y0
            transform = f'matrix({a:.7f} {d:.7f} {b:.7f} {e:.7f} {c:.7f} {f:.7f})'
            inverse = np.linalg.inv([[a, b, c], [d, e, f], [0, 0, 1]])
            placed = ink.transform(body.size, Image.Transform.AFFINE, tuple(inverse[:2].reshape(-1)), Image.Resampling.BILINEAR)
            body.alpha_composite(placed)
            card_elements.append(f'<g transform="{transform}"><image width="{sw}" height="{sh}" href="{data_url(ink)}"/></g>')
            delay = .12 + index * (1.6 / len(glyphs))
            masks.append(f'<mask id="glyph-{index}" maskUnits="userSpaceOnUse" x="0" y="0" width="{sw}" height="{sh}"><rect class="reveal" width="{sw}" height="{sh}" fill="white" style="animation-delay:{delay:.3f}s"/></mask>')
            loading_elements.append(f'<g transform="{transform}"><image width="{sw}" height="{sh}" href="{data_url(light)}" mask="url(#glyph-{index})"/></g>')
        meta = escape(json.dumps({'AIGC': aigc, 'InkoEdited': True, 'SourceJob': scene['job']['id'],
                                  'Text': text, 'Motion': 'per-glyph reveal; not original stroke order'}, ensure_ascii=False))
        # The original visible label is a separate, unanimated image in both uses.
        label_svg = f'<image x="{lab_x:.3f}" y="{lab_y:.3f}" width="{lab_w:.3f}" height="{lab_h:.3f}" href="data:image/png;base64,{b64encode(label_bytes).decode()}"/>'
        shell = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{text}"><title>{text}</title><metadata>{meta}</metadata>'
        static = shell + ''.join(card_elements) + label_svg + '</svg>'
        css = '<style>.reveal{transform-box:fill-box;transform-origin:left center;animation:ink-reveal .65s cubic-bezier(.2,.55,.35,1) both}@keyframes ink-reveal{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media(prefers-reduced-motion:reduce){.reveal{animation:none;transform:none}}</style>'
        animated = shell + css + '<defs>' + ''.join(masks) + '</defs>' + ''.join(loading_elements) + label_svg + '</svg>'
        (OUT / f'{identifier}.svg').write_text(static, encoding='utf-8')
        (OUT / f'{identifier}-loading.svg').write_text(animated, encoding='utf-8')
        resized = label.resize((round(lab_w), round(lab_h)), Image.Resampling.LANCZOS)
        body.alpha_composite(resized, (round(lab_x), round(lab_y)))
        write_labelled_png(OUT / f'{identifier}.png', body, chunks)
        manifest['templates'].append({'id': identifier, 'text': text, 'width': width, 'height': height,
            'inkRect': [0, 0, width, ink_height], 'card': f'{identifier}.svg', 'loading': f'{identifier}-loading.svg',
            'png': f'{identifier}.png', 'label': {'path': 'inko-label.png', 'width': label.width,
                'height': label.height, 'textHeight': label_text_height},
            'sourceJob': scene['job']['id'], 'metadata': chunks})
        print(identifier, width, height, f'{sum((OUT / f).stat().st_size for f in [identifier + ".svg", identifier + "-loading.svg", identifier + ".png"])} bytes')
    (ROOT / 'src/keepsake/data/templates.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    provenance = {'sourceJob': scene['job']['id'], 'createdAt': scene['job']['created_at'], 'style': 'No.012 / preset writer 640',
        'model': scene['job']['model'], 'text': scene['text'], 'sourceFiles': {p.name: sha256(p.read_bytes()).hexdigest()
        for p in SOURCE.iterdir() if p.suffix in ('.png', '.zip')}, 'derivative': 'Original atlas alpha and affine transforms; per-glyph SVG masks; original visible label; byte-exact source PNG AIGC and XMP chunks.'}
    (OUT / 'provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
