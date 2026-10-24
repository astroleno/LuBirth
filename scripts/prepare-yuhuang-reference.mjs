import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Public Commons API response, frozen alongside the contact sheet. No museum scraping.
const dir = fileURLToPath(new URL('../reference/sky/yuhuang-temple/', import.meta.url));
const raw = JSON.parse(await readFile(dir + 'commons-metadata.json', 'utf8'));
const order = '角木蛟 亢金龙 氐土貉 房日兔 心月狐 尾火虎 箕水豹 斗木獬 牛金牛 女土蝠 虚日鼠 危月燕 室火猪 壁水貐 奎木狼 娄金狗 胃土雉 昴日鸡 毕月乌 觜火猴 参水猿 井木犴 鬼金羊 柳土獐 星日马 张月鹿 翼火蛇 轸水蚓'.split(' ');
const plain = value => (value || '').replace(/<[^>]*>/g, '');
const entries = Object.values(raw.query.pages).map(page => {
  const image = page.imageinfo[0], m = image.extmetadata;
  const sourceName = page.title.replace(/^File:/, '').replace(/\.jpg$/, '');
  const name = ({ 女土福: '女土蝠', 参水猿观望鬼金羊: '参水猿' })[sourceName] || sourceName;
  if (m.LicenseShortName?.value !== 'CC BY-SA 4.0') throw new Error('Review changed license: ' + page.title);
  return { name, sourceName, file: String(order.indexOf(name) + 1).padStart(2, '0') + '.jpg',
    sourcePage: image.descriptionurl, sourceImage: image.url, thumbnail: image.thumburl,
    sourceSha1: image.sha1, sourceTimestamp: image.timestamp, author: plain(m.Artist?.value),
    license: m.LicenseShortName.value, licenseUrl: m.LicenseUrl.value, photographed: m.DateTimeOriginal?.value,
    identification: 'Source photographer label; not an independent museum attribution.' };
}).sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
if (entries.length !== 28 || new Set(entries.map(e => e.name)).size !== 28 || entries.some(e => !order.includes(e.name))) throw new Error('Incomplete source set');
await mkdir(dir + 'photos', { recursive: true });
for (let start = 0; start < entries.length; start += 3) {
  await Promise.all(entries.slice(start, start + 3).map(async entry => {
    const file = dir + 'photos/' + entry.file;
    try { await access(file); } catch {
      const response = await fetch(entry.thumbnail);
      if (!response.ok) throw new Error(entry.name + ': ' + response.status);
      await writeFile(file, Buffer.from(await response.arrayBuffer()));
    }
    const bytes = await readFile(file);
    entry.localSha256 = createHash('sha256').update(bytes).digest('hex');
  }));
}
await writeFile(dir + 'sources.json', JSON.stringify({ checked: '2026-10-22',
  source: 'https://commons.wikimedia.org/wiki/Category:Statues_of_the_Twenty-Eight_Mansions_in_Jade_Emperor_Temple,_Fucheng',
  note: 'Local files are Wikimedia-generated 960px-wide previews, not full-resolution originals. Pixel sizes and local hashes checked on 2026-10-22. Original and preview hashes are different fields.', entries }, null, 2) + '\n');
const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
await writeFile(dir + 'index.html', `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>玉皇庙二十八星宿 · 实物参考</title>
<style>body{margin:0;background:#141a1e;color:#e7ded0;font:14px/1.6 system-ui,sans-serif}main{max-width:1560px;margin:auto;padding:32px}h1{font-size:28px;font-weight:500}h2{font-size:18px;margin:24px 0 12px}p{max-width:1000px;color:#bcbab3}a{color:#dfc598}section{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:14px}figure{margin:0}img{display:block;width:100%;height:260px;object-fit:contain;background:#0c1114}figcaption{padding-top:7px}small{display:block;font-size:11px;color:#a3a59f}@media(max-width:700px){main{padding:20px}section{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>
<main><h1>玉皇庙二十八星宿 · 实物参考</h1><p>28 张摄影参考按四象排列。摄影：Patrick20242023，2024 年 2 月 13–14 日；<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>。点击名称查看原始照片、作者及许可。本页仅缩小展示，未修改照片内容。名称主要依据摄影者标注；不等同于馆方逐尊鉴定。</p>
${['东方青龙', '北方玄武', '西方白虎', '南方朱雀'].map((group, i) => `<h2>${group}</h2><section>${entries.slice(i * 7, i * 7 + 7).map(entry => `<figure><img src="photos/${entry.file}" alt="${escape(entry.name)}玉皇庙彩塑实物"><figcaption><a href="${escape(entry.sourcePage)}">${escape(entry.name)}</a>${entry.name !== entry.sourceName ? `<small>源文件名：${escape(entry.sourceName)}</small>` : ''}</figcaption></figure>`).join('')}</section>`).join('')}
<p><a href="artwork-gallery.html">查看 28 × 2 当代图绘总览</a> · <a href="../../../sky-spike.html?view=yuhuang">进入独立星空试验</a>。照片没有提供的背面、遮挡部位与纹样细节属于绘画解释，仍待其他照片或馆藏资料核实。</p></main></html>`);
console.log('Saved 28 attributed, licensed references and contact sheet.');
