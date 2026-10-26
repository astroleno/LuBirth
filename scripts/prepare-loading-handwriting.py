"""Prepare small, offline glyph/character-index SVGs for the opening.

Requires fontTools. Supply the four frozen Google Fonts files and sources.json
with --font-dir; source URLs and SHA-256 values are retained in font-sources.json.
No full font is included in the web release. Existing keepsake art is untouched.
"""
import argparse
from copy import deepcopy
from hashlib import sha256
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/keepsake/loading/v2'
SVG = 'http://www.w3.org/2000/svg'
ET.register_namespace('', SVG)


def tag(name):
    return '{' + SVG + '}' + name


def make_svg(width, height, text, glyphs, metadata, indexed=False):
    root = ET.Element(tag('svg'), {'width': str(width), 'height': str(height),
        'viewBox': f'0 0 {width} {height}', 'role': 'img', 'aria-label': text})
    ET.SubElement(root, tag('title')).text = text
    ET.SubElement(root, tag('metadata')).text = metadata
    definitions = ET.SubElement(root, tag('defs')) if indexed else None
    for index, original in enumerate(glyphs):
        glyph = deepcopy(original)
        if indexed:
            # Tint the exact glyph alpha; no shifted or enlarged ownership mask.
            red = round((index + .5) * 255 / len(glyphs)) / 255
            color_filter = ET.SubElement(definitions, tag('filter'), {
                'id': f'character-{index}', 'color-interpolation-filters': 'sRGB'})
            ET.SubElement(color_filter, tag('feColorMatrix'), {'type': 'matrix',
                'values': f'0 0 0 0 {red:.8f} 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'})
            wrapper = ET.SubElement(root, tag('g'), {'filter': f'url(#character-{index})'})
            wrapper.append(glyph)
        else:
            root.append(glyph)
    return ET.tostring(root, encoding='unicode') + '\n'


def font_glyphs(path, text):
    font = TTFont(path)
    glyph_set, cmap = font.getGlyphSet(), font.getBestCmap()
    scale = 256 / font['head'].unitsPerEm
    cursor, xmin, ymin, xmax, ymax = 0, math.inf, math.inf, -math.inf, -math.inf
    raw = []
    for char in text:
        assert ord(char) in cmap, f'missing character: {char}'
        name = cmap[ord(char)]
        bounds = BoundsPen(glyph_set); glyph_set[name].draw(bounds)
        assert bounds.bounds is not None, f'empty character: {char}'
        x0, y0, x1, y1 = bounds.bounds
        xmin, ymin = min(xmin, cursor + x0), min(ymin, y0)
        xmax, ymax = max(xmax, cursor + x1), max(ymax, y1)
        pen = SVGPathPen(glyph_set); glyph_set[name].draw(pen)
        raw.append((cursor, pen.getCommands()))
        cursor += font['hmtx'][name][0] + font['head'].unitsPerEm * .045
    width, height = math.ceil((xmax - xmin) * scale + 32), math.ceil((ymax - ymin) * scale + 32)
    glyphs = []
    for index, (cursor, path_data) in enumerate(raw):
        group = ET.Element(tag('g'), {'data-glyph-index': str(index),
            'transform': f'matrix({scale:.8f} 0 0 {-scale:.8f} {(cursor-xmin)*scale+16:.4f} {ymax*scale+16:.4f})'})
        ET.SubElement(group, tag('path'), {'d': path_data, 'fill': '#e6ddca'})
        glyphs.append(group)
    font.close()
    return width, height, glyphs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-dir', type=Path, required=True)
    args = parser.parse_args()
    sources = json.loads((args.font_dir / 'sources.json').read_text())
    templates = json.loads((ROOT / 'src/keepsake/data/templates.json').read_text())['templates']
    styles = [{'id': 'inko-no012', 'name': 'Inko No.012', 'source': 'keepsake/templates/v1/provenance.json'}]
    for source in sources['fonts']:
        assert sha256((args.font_dir / source['file']).read_bytes()).hexdigest() == source['sha256']
        assert 'SIL OPEN FONT LICENSE' in source['license']
        styles.append({'id': source['id'], 'name': source['file'].removesuffix('-Regular.ttf'), 'source': source['url']})
    manifest = {'version': 2, 'styles': styles, 'variants': []}
    total_bytes = 0
    for style in styles:
        destination = OUT / style['id']; destination.mkdir(parents=True, exist_ok=True)
        for template in templates:
            identifier, text = template['id'], template['text']
            if style['id'] == 'inko-no012':
                original = ET.parse(ROOT / 'public/keepsake/templates/v1' / template['loading']).getroot()
                width, height = template['width'], template['loadingHeight']
                glyphs = [deepcopy(child) for child in original if child.tag == tag('g')]
                for index, group in enumerate(glyphs):
                    group.set('data-glyph-index', str(index))
                    for child in group.iter(): child.attrib.pop('mask', None)
                metadata = original.find(tag('metadata')).text
            else:
                source = next(item for item in sources['fonts'] if item['id'] == style['id'])
                width, height, glyphs = font_glyphs(args.font_dir / source['file'], text)
                metadata = json.dumps({'font': style['name'], 'source': source['url'], 'license': source['licenseUrl']})
            assert len(glyphs) == len(text)
            for suffix, indexed in [('loading', False), ('index', True)]:
                data = make_svg(width, height, text, glyphs, metadata, indexed)
                (destination / f'{identifier}-{suffix}.svg').write_text(data)
                total_bytes += len(data.encode())
            manifest['variants'].append({'id': style['id'] + ':' + identifier,
                'styleId': style['id'], 'templateId': identifier, 'text': text,
                'width': width, 'height': height, 'characters': len(text),
                'durationMs': template['loadingDurationMs'],
                'glyph': f'keepsake/loading/v2/{style["id"]}/{identifier}-loading.svg',
                'index': f'keepsake/loading/v2/{style["id"]}/{identifier}-index.svg'})
    assert len(manifest['variants']) == 15
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'font-sources.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'src/keepsake/data/loading-variants.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'styles': len(styles), 'variants': len(manifest['variants']), 'svgBytes': total_bytes}))


if __name__ == '__main__':
    main()
