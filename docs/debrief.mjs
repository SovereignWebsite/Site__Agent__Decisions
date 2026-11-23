// A decisions debrief as a 16:9 PDF deck, one batch per file, for Dinis to share.
// node docs/debrief.mjs docs/debriefs/<date>.json <out.pdf>   (needs Playwright with Chromium)
// The deck is built only from the batch file: nothing confidential goes in it (no private people's names,
// no prospects, no keys or tokens). Plain British English, no em dashes.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [src, out = 'debrief.pdf'] = process.argv.slice(2);
const b = JSON.parse(readFileSync(src, 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let n = 0;
const foot = (left, dark) => `<div class="foot${dark ? ' d' : ''}"><span>${esc(left)}</span><span>${String(++n).padStart(2, '0')}</span></div>`;
const card = ([k, t, body], cls = '') => `<div class="card ${cls}"><div class="lab">${esc(k)}${t ? ' · ' + esc(t) : ''}</div><p>${esc(body)}</p></div>`;
const box = '+' + '-'.repeat(44) + '+';
const outcome = (o) => `<span class="o o-${o.toLowerCase().replace(/[^a-z]/g, '')}">${esc(o)}</span>`;

const slides = [];
slides.push(`<section class="dark">
<pre class="box">${box}\n${esc(('| @decisions DEBRIEF :: ' + b.date).padEnd(box.length - 1))}|\n${box}</pre>
<h1>${esc(b.title)}</h1><p class="sub">${esc(b.subtitle)}</p>
<div class="stats">${b.stats.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>
${foot(b.byline, true)}</section>`);
slides.push(`<section><div class="kick">THE AFTERNOON, IN UTC</div><h2>From a new key to twelve signed decisions</h2>
<div class="tl">${b.timeline.map(([t, x]) => `<div><span>${esc(t)}</span><p>${esc(x)}</p></div>`).join('')}</div>${foot(`Decisions debrief · ${b.short}`)}</section>`);
slides.push(`<section class="alt"><div class="kick">WHY AN AGENT CAN TRUST A YES</div><h2>Four links, all public, all checked by code</h2>
<div class="grid4">${b.chain.map(([k, x], i) => card([String(i + 1), k, x])).join('')}</div>
<p class="note">Any agent, or anyone, can run the checks at decisions.agents.sovereignweb.site/verify/. A message saying "Dinis agreed" is never enough; only a signed record is.</p>${foot('decisions.agents.sovereignweb.site')}</section>`);
const half = Math.ceil(b.rows.length / 2);
const table = (rows) => `<table><thead><tr><th>#</th><th>Ask</th><th>From</th><th>Now</th></tr></thead><tbody>${rows.map(([i, a, f, o]) => `<tr><td>${esc(i)}</td><td>${esc(a)}</td><td>${esc(f)}</td><td>${outcome(o)}</td></tr>`).join('')}</tbody></table>`;
slides.push(`<section class="tight"><div class="kick">AT A GLANCE</div><h2>${b.rows.length} asks, one list</h2><div class="two">${table(b.rows.slice(0, half))}${table(b.rows.slice(half))}</div>${foot(`Decisions debrief · ${b.short}`)}</section>`);
const sh = Math.ceil(b.signed.length / 2);
slides.push(`<section><div class="kick">SIGNED IN ONE PASS</div><h2>${b.signed.length} decisions, each its own record</h2>
<div class="grid3">${b.signed.slice(0, sh).map((c) => card(c)).join('')}</div>${foot('Each record: his words, the scope, an expiry, two signatures')}</section>`);
slides.push(`<section><div class="kick">SIGNED IN ONE PASS, CONTINUED</div><h2>Choices as well as code</h2>
<div class="grid3">${b.signed.slice(sh).map((c) => card(c)).join('')}</div>${foot('A choice record tells the agents named; a push record is checked on every push')}</section>`);
slides.push(`<section class="alt"><div class="kick">THINGS ONLY HE CAN DO</div><h2>Access, apps and keys stay with the person</h2>
<div class="grid2">${b.only.map((c) => card(c)).join('')}</div>${foot('No record covers keys, access, organisation settings or secrets')}</section>`);
slides.push(`<section><div class="kick">NEEDS HIS EYES OR HIS ANSWER</div><h2>What an agent can't know for him</h2>
<div class="grid2">${b.eyes.map((c) => card(c)).join('')}</div>${foot(`Decisions debrief · ${b.short}`)}</section>`);
slides.push(`<section class="alt"><div class="kick">HELD ON PURPOSE</div><h2>One-way doors wait for an explicit answer</h2>
<div class="grid3">${b.held.map((c, i) => card(c, i < 2 ? 'hot' : '')).join('')}</div>${foot("Dinis's rule: two-way doors go ahead; one-way doors come to him")}</section>`);
slides.push(`<section><div class="kick">WHICH DECISIONS NEED WHAT</div><h2>Four modes, from “just do it” to “never”</h2>
<div class="grid4">${b.modes.map(([k, x], i) => card([String(i + 1), k, x], i === 3 ? 'hot' : '')).join('')}</div>
<div class="next"><div class="lab">NEXT</div><ul>${b.next.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>${foot('Draft modes, for Dinis to confirm')}</section>`);
slides.push(`<section class="dark"><div class="kick l">HOW TO ANSWER</div><h2>One line per item is enough</h2>
<div class="lab l">${esc(b.answer_label || '')}</div><pre class="ans">${b.answer.map(esc).join('\n')}</pre><p class="sub">${esc(b.answer_note)}</p>${foot('decisions.b (Sovereign Website)', true)}</section>`);

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
@page{size:1334px 750px;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:#1a2440}
section{width:1334px;height:750px;position:relative;padding:92px 89px 0;background:#f6f4ef;page-break-after:always;overflow:hidden}
section.alt{background:#ebe7df}section.dark{background:#14203d;color:#e9ecf3}
.kick{font:700 17px/1 'JetBrains Mono',monospace;letter-spacing:.12em;color:#d4631e;margin-bottom:22px}.kick.l{color:#c9d0de}
h1{font:700 76px/1.05 'Space Grotesk',sans-serif;margin:34px 0 22px;color:#fff;max-width:1100px}
h2{font:700 46px/1.1 'Space Grotesk',sans-serif;margin:0 0 30px;color:#14203d}.dark h2{color:#fff}
.sub{font-size:27px;line-height:1.45;color:#c9d0de;max-width:1060px;margin:0}
.box{font:500 19px/1.35 'JetBrains Mono',monospace;color:#c9d0de;margin:0}
.stats{position:absolute;left:89px;bottom:112px;display:flex;gap:70px}.stats b{display:block;font:700 22px 'Space Grotesk';color:#fff}.stats span{font-size:20px;color:#c9d0de}
.foot{position:absolute;left:89px;right:89px;bottom:44px;display:flex;justify-content:space-between;font:500 16px 'JetBrains Mono',monospace;color:#6b7280}.foot.d{color:#8d97ad}
.card{background:#fff;border-left:5px solid #2f6f9b;padding:20px 24px}.alt .card{background:#f8f6f1}.card.hot{border-left-color:#d4631e}
.lab{font:700 15px 'JetBrains Mono',monospace;letter-spacing:.08em;color:#2f6f9b;text-transform:uppercase;margin-bottom:8px}.hot .lab{color:#d4631e}.lab.l{color:#8d97ad}
.card p{margin:0;font-size:19px;line-height:1.42;color:#2b3550}
.grid2,.grid3,.grid4{display:grid;gap:18px}.grid2{grid-template-columns:1fr 1fr}.grid3{grid-template-columns:1fr 1fr 1fr}.grid4{grid-template-columns:1fr 1fr 1fr 1fr}
.tl{display:grid;grid-template-columns:1fr 1fr;gap:14px 40px}.tl div{display:flex;gap:18px;border-left:4px solid #2f6f9b;background:#fff;padding:12px 18px}.tl span{font:700 18px 'JetBrains Mono';color:#d4631e;min-width:60px}.tl p{margin:0;font-size:18px;line-height:1.38}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px}table{border-collapse:collapse;width:100%;font-size:15.5px;background:#fff}
th,td{border:1px solid #d8d4cb;padding:6px 9px;text-align:left}th{background:#e6e3dc;font-weight:600}
.o{font:700 12.5px 'JetBrains Mono';letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.o-signed{color:#2f7a4f}.o-onlydinis,.o-held{color:#d4631e}.o-hiseyes,.o-hisanswer{color:#2f6f9b}.o-waiting{color:#6b7280}
.note{font-size:20px;color:#4b5568;margin-top:28px;max-width:1100px;line-height:1.45}
.next{margin-top:26px;background:#14203d;color:#e9ecf3;padding:18px 26px}.next .lab{color:#d4631e}.next ul{margin:0;padding-left:22px;font-size:19px;line-height:1.5}
.tight{padding-top:62px}.tight h2{margin-bottom:20px}.tight table{font-size:14.5px}.tight th,.tight td{padding:4px 8px}.ans{font:500 22px/1.6 'JetBrains Mono',monospace;color:#e9ecf3;margin:4px 0 26px}
</style></head><body>${slides.join('\n')}</body></html>`;
const htmlOut = out.replace(/\.pdf$/, '.html'); writeFileSync(htmlOut, html);
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1334, height: 750 } });
await pg.goto('file://' + htmlOut, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
const over = await pg.evaluate(() => [...document.querySelectorAll('section')].map((s, i) => [i + 1, s.scrollHeight > 752 || [...s.querySelectorAll('*')].some((e) => e.getBoundingClientRect().bottom > s.getBoundingClientRect().bottom - 80 && !e.closest('.foot'))]).filter(([, o]) => o).map(([i]) => i));
await pg.pdf({ path: out, width: '1334px', height: '750px', printBackground: true });
await br.close();
console.log(`written ${out} (${n} slides)${over.length ? '; content near or past the footer on slides ' + over.join(', ') : ''}`);
