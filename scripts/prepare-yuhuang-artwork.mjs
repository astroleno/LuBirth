import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const data = root + '/src/spikes/sky/data/';
const source = JSON.parse(await readFile(root + '/reference/sky/yuhuang-temple/sources.json', 'utf8'));
const generation = JSON.parse(await readFile(root + '/reference/sky/yuhuang-temple/full-set-generation.json', 'utf8'));
const placements = JSON.parse(await readFile(root + '/reference/sky/yuhuang-temple/placements.json', 'utf8'));
const catalog = JSON.parse(await readFile(data + 'catalog.json', 'utf8'));
const manifest = JSON.parse(await readFile(data + 'chinese-art/manifest.json', 'utf8'));
const vite = await createServer({ configFile: false, root, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { cultureGroup, CHINESE_GROUPS } = await vite.ssrLoadModule('/src/spikes/sky/skyPresentation.ts');
  const { registerChineseFigure } = await vite.ssrLoadModule('/src/spikes/sky/chineseArtPlacement.ts');
  const specifications = generation.specifications;
  if (specifications.length !== 28 || new Set(specifications.map(s => s.name)).size !== 28) throw new Error('Expected all 28 distinct prototypes.');
  if (placements.entries.length !== 28 || new Set(placements.entries.map(p => p.number)).size !== 28) throw new Error('Expected all 28 individual placements.');
  manifest.schema = 5;
  manifest.status = '28 photo-referenced Yuhuang Temple adaptations, each with a full-color prototype and a finer transparent sky line drawing. Photographic attribution remains distinct from independent museum identification.';
  manifest.rights = 'Adapted from photographs by Patrick20242023, CC BY-SA 4.0. Contemporary AI-assisted drawings by LuBirth, distributed as adaptations under CC BY-SA 4.0. No museum endorsement claimed.';
  manifest.references['yuhuang-photographs'] = { url: 'https://commons.wikimedia.org/wiki/Category:Statues_of_the_Twenty-Eight_Mansions_in_Jade_Emperor_Temple,_Fucheng',
    author: 'Patrick20242023', license: 'CC-BY-SA-4.0', checked: '2026-10-22',
    evidence: 'All 28 local photographic previews and their source metadata inspected. Names follow the source photographer; independent museum identification remains pending.' };
  // Build every entry before writing: a missing asset cannot publish a partial set.
  const entries = await Promise.all(specifications.map(async spec => {
    const item = catalog.culture.find(item => item.name === spec.name);
    const photo = source.entries.find(entry => entry.name === spec.title);
    if (!photo) throw new Error('Missing photograph: ' + spec.title);
    const placement = placements.entries.find(entry => entry.number === spec.n);
    if (!item || !placement) throw new Error('Missing figure placement: ' + spec.name);
    const bytes = await readFile(data + 'chinese-art/' + spec.file);
    const size = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    const skyBytes = await readFile(data + 'chinese-art/' + spec.skyFile);
    const skySize = [skyBytes.readUInt32BE(16), skyBytes.readUInt32BE(20)];
    // The image generator can round portrait edges by one pixel; preserve each raster's proportions.
    if (Math.abs(size[0] / size[1] - skySize[0] / skySize[1]) > .005) throw new Error('Variant aspect mismatch: ' + spec.title);
    const original = registerChineseFigure(catalog, item, 'chinese-art/' + spec.file, size, placement);
    const line = registerChineseFigure(catalog, item, 'chinese-art/' + spec.skyFile, skySize, placement);
    return { cultureId: item.id, number: spec.n, name: item.name, title: spec.title, group: cultureGroup(item), summary: spec.summary, adaptationNote: spec.note || '',
      image: original.image, skyImage: line.image, placement: original.calibration,
      skyVariant: { kind: 'transparent-luminous-line-art', sha256: createHash('sha256').update(skyBytes).digest('hex'),
        bytes: skyBytes.length, derivedFrom: spec.file, generationRecord: 'reference/sky/yuhuang-temple/full-set-generation.json' },
      authoredAngularWidth: original.calibration.angularWidthDeg, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
      creator: 'LuBirth — AI-assisted contemporary drawn adaptation', created: '2026-10-22', license: 'CC-BY-SA-4.0',
      photograph: { page: photo.sourcePage, original: photo.sourceImage, originalSha1: photo.sourceSha1, localFile: photo.file,
        identification: photo.identification,
        author: 'Patrick20242023', license: 'CC-BY-SA-4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
      sourceRefs: ['yuhuang-photographs', 'song-lines', 'hyg-stars'],
      verification: { observed: spec.observed, interpretation: spec.inference,
        registration: 'Individually authored rotation, scale and position using two asterism members paired to figure landmarks. Similarity preserves aspect and handedness; a third HIP stabilizes the projection. Full placement and helper role are recorded; no historical anatomical claim.',
        remaining: 'Independent museum identification; hidden anatomy, costume and animal details are not conservation-verified.' } };
  }));
  manifest.entries = entries;
  await writeFile(data + 'chinese-art/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const gallery = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>玉皇庙二十八宿 · 28 × 2 图绘总览</title><style>
*{box-sizing:border-box}body{margin:0;background:#080e16;color:#e5ddcf;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}header{max-width:1320px;margin:auto;padding:44px 28px 24px}h1{font-weight:400;letter-spacing:.12em;font-size:28px}p{font-size:13px;color:#a3afbd;line-height:1.8}a{color:#b9cce3;text-underline-offset:4px}nav{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}button{font:inherit;min-height:44px;padding:8px 16px;background:transparent;border:1px solid #48505b;border-radius:12px;color:#d7dfeb;cursor:pointer}button[aria-pressed=true]{background:#27313e;border-color:#a89b80}main{max-width:1320px;margin:auto;padding:10px 28px 64px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px 24px}figure{margin:0;min-width:0}figure img{display:block;width:100%;height:360px;object-fit:contain}figcaption{padding:16px 0;border-bottom:1px solid #ffffff18}h2{font-size:16px;font-weight:400;margin:0 0 6px}small{font-size:11px;color:#8a98aa}figcaption p{font-size:12px;margin:6px 0}footer{padding:20px 28px 48px;max-width:1320px;margin:auto;font-size:12px;line-height:1.8;color:#a3afbd}@media(max-width:700px){header{padding:28px 20px 16px}h1{font-size:23px}main{padding:10px 20px 40px;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px}figure img{height:270px}button{font-size:12px;padding:8px 12px}}
</style><header><p>LuBirth · 独立星空试验</p><h1>玉皇庙 · 二十八宿</h1><p>28 幅淡彩原型 × 28 幅高光细线稿。依实物照片转绘，遮挡处与纹样为绘画补全。</p><a href="../../../sky-spike.html?view=yuhuang">进入星空查看 ↗</a><nav aria-label="图绘版本"><button data-mode="prototype" aria-pressed="true">淡彩原型 · 28</button><button data-mode="line" aria-pressed="false">高光线稿 · 28</button><button data-mode="photo" aria-pressed="false">实物照片 · 28</button></nav></header><main>
${entries.map(entry => `<figure><img loading="lazy" width="${entry.image.size[0]}" height="${entry.image.size[1]}" alt="${escape(entry.title)}淡彩原型" src="../../../src/spikes/sky/data/${escape(entry.image.file)}" data-prototype="../../../src/spikes/sky/data/${escape(entry.image.file)}" data-line="../../../src/spikes/sky/data/${escape(entry.skyImage.file)}" data-photo="photos/${escape(entry.photograph.localFile)}" data-title="${escape(entry.title)}"><figcaption><h2>${String(entry.number).padStart(2, '0')} · ${escape(entry.title)}</h2><small>${escape(entry.name)} · ${escape(CHINESE_GROUPS.find(([key]) => key === entry.group)[1])}</small><p>${escape(entry.summary)}</p><a href="${escape(entry.photograph.page)}" target="_blank" rel="noreferrer">摄影来源 ↗</a></figcaption></figure>`).join('\n')}
</main><footer>摄影 Patrick20242023；转绘 LuBirth（AI 辅助）。照片与衍生图绘：<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>。名称沿用摄影者标注；独立馆藏鉴定待补。参水猿取双像照片右侧人物，左侧鬼金羊单独对应第 23 项。鬼金羊掌中小像的衣袍为当代绘画处理。图绘为当代演绎，并非文物复原。</footer><script>
const versions={prototype:'淡彩原型',line:'高光线稿',photo:'实物照片'};
document.querySelector('nav').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;document.querySelectorAll('nav button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.querySelectorAll('figure img').forEach(img=>{img.src=img.dataset[button.dataset.mode];img.alt=img.dataset.title+versions[button.dataset.mode]});});
</script></html>`;
  await writeFile(root + '/reference/sky/yuhuang-temple/artwork-gallery.html', gallery);
  console.log('Registered all 28 paired drawings with individual figure landmarks, projection scales and source attribution.');
} finally { await vite.close(); }
