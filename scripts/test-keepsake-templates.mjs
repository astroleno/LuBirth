import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';

const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'lubirth-keepsake-tests-'));
const server = await createServer({ configFile: false, cacheDir: path.join(temporary, 'vite'),
  optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false },
  appType: 'custom', logLevel: 'error' });
let passed = 0;
const test = async (name, run) => { await run(); passed++; console.log('PASS', name); };
try {
  const draft = await server.ssrLoadModule('/src/keepsake/draft.ts');
  const { resolveObservation } = await server.ssrLoadModule('/src/history/observation.ts');
  const templates = await server.ssrLoadModule('/src/keepsake/templates.ts');
  const png = await server.ssrLoadModule('/src/keepsake/png-metadata.ts');
  const { createCardZip } = await server.ssrLoadModule('/src/keepsake/zip.ts');
  const { layoutBirthCard, layoutInkoLabel } = await server.ssrLoadModule('/src/keepsake/layout.ts');
  const { wrapCardText } = await server.ssrLoadModule('/src/keepsake/compose.ts');
  const bytes = new Uint8Array(await fs.readFile('public/keepsake/templates/v1/first-meeting.png'));
  const image = 'data:image/png;base64,' + Buffer.from(bytes).toString('base64');
  const place = { name: '上海', latitude: 31.2304, longitude: 121.4737, precision: 'representative', note: '测试代表点' };
  const personal = resolveObservation('2000-01-01', '00:30', place, { kind: 'offset', offsetMinutes: 480 }, { kind: 'birth', label: '我的出生时刻' });
  const rendered = observation => ({ utc: observation.utc, observer: { ...observation.observer }, placement: 'portrait', earthReady: true });
  const capture = observation => draft.captureKeepsakeDraft({ image, observation, moonPlacement: 'portrait', renderedFrameKey: observation.utc + '/test-scene', renderedObservation: rendered(observation) });
  await test('Freezes an independent observation; rejects unsynchronised frames', () => {
    const value = capture(personal);
    personal.observer.name = '稍后改动的地点';
    assert.equal(value.observation.observer.name, '上海');
    assert.ok(Object.isFrozen(value.observation.observer));
    assert.ok(Object.isFrozen(value.observation.assumptions));
    assert.equal(value.templateId, 'first-meeting');
    for (const renderedFrameKey of [null, '1999-01-01T00:00:00.000Z/test'])
      assert.throws(() => draft.captureKeepsakeDraft({ image, observation: personal, moonPlacement: 'portrait', renderedFrameKey, renderedObservation: rendered(personal) }));
    for (const renderedObservation of [null, { ...rendered(personal), earthReady: false },
      { ...rendered(personal), observer: { latitude: 0, longitude: 0 } }, { ...rendered(personal), placement: 'physical' }])
      assert.throws(() => draft.captureKeepsakeDraft({ image, observation: personal, moonPlacement: 'portrait',
        renderedFrameKey: personal.utc + '/test-scene', renderedObservation }));
    assert.throws(() => draft.pngDimensions('data:image/jpeg;base64,AA=='));
    assert.throws(() => draft.pngDimensions('data:image/png;base64,AAAA'));
  });
  await test('Birth fields are opt-in; modes, examples and historical assumptions remain explicit', () => {
    const card = capture(personal), options = draft.initialCardOptions(card);
    let context = draft.cardContext(card, options);
    assert.deepEqual(context.details, ['2000-01-01']);
    assert.match(context.notes.join(' '), /合影位置/);
    context = draft.cardContext(card, { ...options, showClock: true, showPlace: true });
    assert.ok(context.details.includes('00:30 · UTC+08:00'));
    assert.match(context.details.join(' '), /地区代表点/);
    const historical = resolveObservation('0755-12-16', '20:00', place, { kind: 'local-mean-solar' },
      { kind: 'history', label: '历史事件测试', recordId: 'dsh:test', recordKind: 'event' }, ['前推格里高利历'],
      { origin: 'event-default-20', ruleVersion: 'event-evening-v1', label: '演示时刻' });
    const historyCard = capture(historical);
    assert.equal(historyCard.templateId, 'same-moon');
    context = draft.cardContext(historyCard, draft.initialCardOptions(historyCard));
    assert.match(context.heading, /历史演示/);
    assert.match(context.notes.join(' '), /默认当地 20:00/);
    assert.match(context.notes.join(' '), /地方平太阳时/);
    assert.match(context.notes.join(' '), /条件性/);
    const example = resolveObservation('2026-10-24', '20:00', place, { kind: 'offset', offsetMinutes: 480 }, { kind: 'example', label: '此时' });
    assert.match(draft.cardContext(capture(example), options).notes.join(' '), /不代表真实出生/);
    assert.match(draft.cardContext({ ...card, moonPlacement: 'physical' }, options).notes.join(' '), /物理位置/);
  });
  await test('All three offline templates retain source metadata and accessible SVG motion policy', async () => {
    assert.equal(templates.KEEPSAKE_TEMPLATES.length, 3);
    assert.equal(templates.selectLoadingTemplate(0), 'first-meeting');
    assert.equal(templates.selectLoadingTemplate(.5), 'earth-and-you');
    assert.equal(templates.selectLoadingTemplate(1), 'same-moon');
    assert.equal(templates.selectLoadingTemplate(NaN), 'first-meeting');
    for (const { id, text } of templates.KEEPSAKE_TEMPLATES) {
      const asset = templates.handwritingAsset(id);
      assert.equal(asset.text, text);
      assert.match(asset.sourceJob, /^[\da-f-]{36}$/);
      for (const name of [asset.card, asset.loading, asset.png, asset.label.path])
        assert.ok((await fs.stat('public/keepsake/templates/v1/' + name)).size > 0);
      const svg = await fs.readFile('public/keepsake/templates/v1/' + asset.loading, 'utf8');
      const revealMs = Number(svg.match(/animation:ink-reveal ([\d.]+)s/)[1]) * 1000;
      const delays = [...svg.matchAll(/animation-delay:([\d.]+)s/g)].map(match => Number(match[1]) * 1000);
      assert.equal(delays.length, [...text].length);
      assert.equal(asset.loadingDurationMs, Math.round(Math.max(...delays) + revealMs),
        'The loading gate must cover the final character, including its delay');
      assert.match(svg, /prefers-reduced-motion:reduce/);
      assert.match(svg, /InkoEdited/);
      assert.match(svg, /ProduceID/);
      assert.ok(!/https?:/.test(svg.replace('http://www.w3.org/2000/svg', '')));
      const metadata = png.inkoMetadataFromPng(new Uint8Array(await fs.readFile('public/keepsake/templates/v1/' + asset.png)));
      for (const original of asset.metadata) {
        assert.ok(metadata.some(chunk => chunk.type === original.type && Buffer.from(chunk.data).toString('base64') === original.data));
      }
    }
  });
  await test('Final PNG metadata survives re-encoding byte-for-byte; damaged PNG and missing provenance fail', async () => {
    const source = templates.handwritingAsset('first-meeting').metadata;
    const result = await png.writeInkoPngMetadata(new Blob([bytes]), source);
    const actual = png.inkoMetadataFromPng(new Uint8Array(await result.arrayBuffer()));
    assert.equal(actual.length, 3);
    for (const chunk of source) assert.ok(actual.some(value => value.type === chunk.type && Buffer.from(value.data).toString('base64') === chunk.data));
    const corrupt = bytes.slice(); corrupt[50] ^= 1;
    assert.throws(() => png.readPngChunks(corrupt), /校验/);
    assert.throws(() => png.readPngChunks(bytes.subarray(0, 20)));
    await assert.rejects(png.writeInkoPngMetadata(new Blob([bytes]), []), /标识不完整/);
  });
  await test('Cards keep the whole screenshot aspect without upscaling and reserve a readable original label', () => {
    for (const [width, height] of [[320, 650], [390, 844], [1440, 900], [2880, 1800]]) {
      const layout = layoutBirthCard(width, height, 8), label = templates.handwritingAsset('same-moon').label;
      assert.ok(layout.width <= width);
      assert.ok(Math.abs(layout.imageHeight / layout.width - height / width) < 1 / layout.width);
      const mark = layoutInkoLabel(layout.width, layout.height, label);
      assert.ok(mark.textHeight >= Math.min(layout.width, layout.height) * .05);
      assert.ok(mark.x >= layout.padding && mark.x + mark.width <= layout.width - layout.padding + 1);
      assert.ok(mark.y > layout.footerY && mark.y + mark.height < layout.height);
    }
    const context = { measureText: value => ({ width: [...value].length * 10 }) };
    const text = '天地与你🌙出生日期和地区代表点';
    assert.equal(wrapCardText(context, text, 40).join(''), text);
  });
  await test('ZIP supports Chinese filenames, validates CRC, and cancellation rejects before allocation', async () => {
    const output = await createCardZip(templates.KEEPSAKE_TEMPLATES.map(template => ({ name: template.text + '.png', blob: new Blob([bytes]) })));
    const outputBytes = new Uint8Array(await output.arrayBuffer());
    const view = new DataView(outputBytes.buffer);
    assert.equal(view.getUint32(0, true), 0x04034b50);
    assert.equal(view.getUint16(outputBytes.length - 12, true), 3);
    const controller = new AbortController(); controller.abort();
    await assert.rejects(createCardZip([{ name: 'a.png', blob: new Blob([bytes]) }], controller.signal), { name: 'AbortError' });
    await fs.writeFile(path.join(temporary, 'three-templates.zip'), outputBytes);
    const { execFileSync } = await import('node:child_process');
    execFileSync('python3', ['-c', 'from zipfile import ZipFile;import sys;z=ZipFile(sys.argv[1]);assert z.testzip() is None;assert len(z.namelist())==3;assert "天地初见.png" in z.namelist()', path.join(temporary, 'three-templates.zip')]);
  });
  console.log(JSON.stringify({ suite: 'fixed-handwriting-keepsakes', passed, failed: 0 }));
} finally { await server.close(); await fs.rm(temporary, { recursive: true, force: true }); }
