// A briefing deck (16:9 PDF) from a list of slides in a JSON file: the same look as docs/debrief.mjs, but any order of
// cover, table, cards and answer slides. node docs/brief.mjs <slides.json> <out.pdf>   (needs Playwright with Chromium)
// The deck holds only what the file holds: keep private people, prospects, keys and tokens out of anything shared.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [src, out = 'brief.pdf'] = process.argv.slice(2);
const b = JSON.parse(readFileSync(src, 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let n = 0;
const foot = (left, dark) => `<div class="foot${dark ? ' d' : ''}"><span>${esc(left)}</span><span>${String(++n).padStart(2, '0')}</span></div>`;
const box = '+' + '-'.repeat(44) + '+';
const card = (c) => `<div class="card${c.hot ? ' hot' : ''}"><div class="lab">${esc(c.lab)}</div><p>${esc(c.text)}</p></div>`;
const call = (c) => c ? `<div class="call"><div class="lab">${esc(c.lab || 'YOUR CALL')}</div><p>${esc(c.text)}</p></div>` : '';

const render = (s) => {
  if (s.type === 'cover') return `<section class="dark"><pre class="box">${box}\n${esc(('| ' + s.tag).padEnd(box.length - 1))}|\n${box}</pre>
<h1>${esc(s.title)}</h1><p class="sub">${esc(s.sub)}</p>
<div class="stats">${(s.stats || []).map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>${foot(s.foot, true)}</section>`;
  if (s.type === 'table') return `<section class="${s.alt ? 'alt ' : ''}${s.tight ? 'tight' : ''}"><div class="kick">${esc(s.kick)}</div><h2>${esc(s.title)}</h2>
<table><thead><tr>${s.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${s.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>
${call(s.call)}${foot(s.foot)}</section>`;
  if (s.type === 'cards') return `<section class="${s.alt ? 'alt' : ''}"><div class="kick">${esc(s.kick)}</div><h2>${esc(s.title)}</h2>
<div class="grid${s.cols || 2}">${s.cards.map(card).join('')}${call(s.call)}</div>${foot(s.foot)}</section>`;
  if (s.type === 'answer') return `<section class="dark"><div class="kick l">${esc(s.kick)}</div><h2>${esc(s.title)}</h2>
${s.label ? `<div class="lab l">${esc(s.label)}</div>` : ''}<pre class="ans">${s.lines.map(esc).join('\n')}</pre><p class="sub">${esc(s.note)}</p>${foot(s.foot, true)}</section>`;
  throw new Error('unknown slide type ' + s.type);
};

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
@page{size:1334px 750px;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:#1a2440}
section{width:1334px;height:750px;position:relative;padding:92px 89px 0;background:#f6f4ef;page-break-after:always;overflow:hidden}
section.alt{background:#ebe7df}section.dark{background:#14203d;color:#e9ecf3}section.tight{padding-top:62px}
.kick{font:700 17px/1 'JetBrains Mono',monospace;letter-spacing:.12em;color:#d4631e;margin-bottom:22px;text-transform:uppercase}.kick.l{color:#c9d0de}
h1{font:700 76px/1.05 'Space Grotesk',sans-serif;margin:34px 0 22px;color:#fff;max-width:1100px}
h2{font:700 44px/1.1 'Space Grotesk',sans-serif;margin:0 0 28px;color:#14203d;max-width:1150px}.dark h2{color:#fff}
.sub{font-size:27px;line-height:1.45;color:#c9d0de;max-width:1060px;margin:0}
.box{font:500 19px/1.35 'JetBrains Mono',monospace;color:#c9d0de;margin:0}
.stats{position:absolute;left:89px;bottom:112px;display:flex;gap:70px}.stats b{display:block;font:700 22px 'Space Grotesk';color:#fff}.stats span{font-size:20px;color:#c9d0de}
.foot{position:absolute;left:89px;right:89px;bottom:44px;display:flex;justify-content:space-between;font:500 16px 'JetBrains Mono',monospace;color:#6b7280}.foot.d{color:#8d97ad}
.card{background:#fff;border-left:5px solid #2f6f9b;padding:18px 24px}.alt .card{background:#f8f6f1}.card.hot{border-left-color:#d4631e}
.lab{font:700 15px 'JetBrains Mono',monospace;letter-spacing:.08em;color:#2f6f9b;text-transform:uppercase;margin-bottom:8px}.hot .lab{color:#d4631e}.lab.l{color:#8d97ad}
.card p,.call p{margin:0;font-size:19px;line-height:1.42;color:#2b3550}
.call{background:#14203d;padding:20px 26px}.call .lab{color:#d4631e}.call p{color:#fff;font-size:20px}
table+.call{margin-top:22px}
.grid2,.grid3{display:grid;gap:16px}.grid2{grid-template-columns:1fr 1fr}.grid3{grid-template-columns:1fr 1fr 1fr}
table{border-collapse:collapse;width:100%;font-size:16.5px;background:#fff}.alt table{background:#f8f6f1}
th,td{border:1px solid #d8d4cb;padding:7px 11px;text-align:left;vertical-align:top}th{background:#e6e3dc;font-weight:600}
.tight table{font-size:14.5px}.tight th,.tight td{padding:4px 9px}.tight h2{margin-bottom:18px}
.ans{font:500 22px/1.6 'JetBrains Mono',monospace;color:#e9ecf3;margin:4px 0 26px}
</style></head><body>${b.slides.map(render).join('\n')}</body></html>`;
const htmlOut = out.replace(/\.pdf$/, '.html'); writeFileSync(htmlOut, html);
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1334, height: 750 } });
await pg.goto('file://' + htmlOut, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
const over = await pg.evaluate(() => [...document.querySelectorAll('section')].map((s, i) => [i + 1, [...s.querySelectorAll('*')].some((e) => !e.closest('.foot') && e.getBoundingClientRect().bottom > s.getBoundingClientRect().bottom - 78)]).filter(([, o]) => o).map(([i]) => i));
await pg.pdf({ path: out, width: '1334px', height: '750px', printBackground: true });
await br.close();
console.log(`written ${out} (${n} slides)${over.length ? '; content near or past the footer on slides ' + over.join(', ') : ''}`);
