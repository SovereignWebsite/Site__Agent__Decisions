// Writes the Decisions site's own pages from site/data/decisions.json and the seed's header, footer and style.
// node docs/pages.mjs   (run by the keeper, decisions.b, before each commit; the pages it writes are committed)
// Static HTML only: no script, no cookies, no tracking (CLAUDE.md).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://decisions.agents.sovereignweb.site';
const REPO = 'https://github.com/SovereignWebsite/Site__Agent__Decisions';
const SESSION = 'https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ';
const data = JSON.parse(readFileSync('site/data/decisions.json', 'utf8'));
const seed = readFileSync('site/start/index.html', 'utf8');
const style = seed.match(/<style>([\s\S]*?)<\/style>/)[1];
const family = seed.match(/<details class="family-credit">[\s\S]*?<\/details>/)[0];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const extra = `table{width:100%;border-collapse:collapse;font-size:.92rem;margin:1rem 0}th,td{text-align:left;vertical-align:top;padding:.55rem .5rem;border-top:1px solid var(--line)}
th{font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}td{color:var(--fg)}
.tag{display:inline-block;padding:.05rem .5rem;border-radius:999px;border:1px solid var(--line);font-size:.8rem;white-space:normal;overflow-wrap:anywhere}
.tag.in{border-color:var(--accent);color:var(--accent)}q{font-style:italic}
.cards{display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;margin:1rem 0}.card{border:1px solid var(--line);border-radius:8px;padding:1rem}
.card h2{margin:.1rem 0 .4rem;font-size:1.05rem;overflow-wrap:anywhere}.card p{margin:.3rem 0;overflow-wrap:anywhere}
.card dl{display:grid;grid-template-columns:7rem 1fr;gap:.2rem .8rem;margin:.6rem 0 0;font-size:.9rem}.card dt{color:var(--muted)}.card dd{margin:0;overflow-wrap:anywhere}
@media (max-width:40rem){.card dl{grid-template-columns:1fr}.card dt{margin-top:.4rem}}`;

function page({ path, title, description, body }) {
  const url = `${SITE}${path}`;
  const full = path === '/' ? 'Decisions' : `${title}: Decisions`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Decisions">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/assets/share/card-1200x630.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Decisions">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(full)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/share/card-1200x630.jpg">
<link rel="canonical" href="${url}">
<style>${style}
${extra}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${family}
<header class="top">
  <a class="name" href="/">Decisions</a>
  <nav class="own" aria-label="This site">
    <a href="/asks/">Open asks</a>
    <a href="/decisions/">Decisions</a>
    <a href="/verify/">Check one</a>
    <a href="/modes/">Modes</a>
  </nav>
</header>
<main id="main">
<div class="mark">decisions.agents.sovereignweb.site</div>
${body}
<footer>
<nav class="site-links" aria-label="About this site">
  <a href="/start/">Start here</a>
  <a href="/agents/">Use with your AI</a>
  <a href="/admin/">How this site was made</a>
  <a href="/policy/">How this site is governed</a>
</nav>
Kept by decisions.b@SovereignWebsite.dinis for Dinis Cruz. Source: <a href="${REPO}">github.com/SovereignWebsite/Site__Agent__Decisions</a>.</footer>
</main>
</body>
</html>
`;
}

const out = (path, html) => { const dir = `site${path}`; mkdirSync(dir, { recursive: true }); writeFileSync(`${dir}index.html`, html); };
const tag = (s) => `<span class="tag${s === 'in force' ? ' in' : ''}">${esc(s)}</span>`;
const inForce = data.decisions.filter((d) => d.status === 'in force').length;

out('/', page({ path: '/', title: 'Decisions', description: "Dinis Cruz's decisions, recorded word for word and signed, so his agents can act on them and anyone can check them.",
  body: `<h1>Decisions</h1>
<p>Dinis Cruz runs a team of AI agents. When he says yes to something, the decisions agent records his words exactly, with the time and the exact scope, and signs the record with its own key. An agent acts only on a signed record that it has checked.</p>
<p>${(data.asks || []).length} asks waiting for Dinis: <a href="/asks/">the open asks</a>. ${data.decisions.length} records so far, ${inForce} in force: <a href="/decisions/">see them all</a>.</p>
<h2>The chain anyone can check</h2>
<ol>
<li>Dinis's own key on <a href="https://pki.sgit.ai/">pki.sgit.ai</a>, kept behind his passkey: <code>sha256:db7f79fdd87e030a</code>.</li>
<li>His signed link there: he operates the decisions agent's key <code>sha256:eefbe996d9c67a7c</code> until 30 November 2026.</li>
<li>The same key in the team's published keys (<a href="https://github.com/SovereignWebsite/SovereignWebsite__IaC/blob/dev/team/keys.json">team/keys.json</a>).</li>
<li>Its signature on each record, and the record's scope against the commits an agent pushes.</li>
</ol>
<p><a href="/verify/">How to check a record yourself</a>. <a href="/modes/">Which decisions need what</a>. Debriefs: <a href="/debriefs/2026-11-23.pdf">23 November 2026 (PDF)</a>.</p>
<h2>Next</h2>
<p>Today Dinis gives his yes in the decisions agent's session, and signs the hardest ones on pki.sgit.ai. The plan is for him to sign every decision on this site himself, with CryptoVolt. That is planned, not built.</p>` }));

out('/decisions/', page({ path: '/decisions/', title: 'All decisions', description: 'Every decision record, newest first: his words, the scope, the status and who acted on it.',
  body: `<h1>All decisions</h1>
<p>Newest first. Each record is signed by <code>sha256:eefbe996d9c67a7c</code>; the files are the source and this page is a summary. Updated ${esc(data.updated)}.</p>
<div class="cards">
${data.decisions.map((d) => `<article class="card" id="${esc(d.id)}">
<h2>${esc(d.id)} ${tag(d.status)}</h2>
<p><q>${esc(d.words)}</q> Dinis Cruz, ${esc(d.at.replace('T', ' ').replace('Z', ' UTC'))}</p>
<p>${esc(d.about)}</p>
<dl>
<dt>Scope</dt><dd>${esc(d.scope)}</dd>
<dt>Expires</dt><dd>${esc(d.expires.replace('T', ' ').replace('Z', ' UTC'))}</dd>
<dt>Acted on by</dt><dd>${esc(d.pushed_by)}</dd>
<dt>His message</dt><dd>event <code>${esc(d.event_uuid)}</code> in <a href="${SESSION}">the decisions session</a></dd>
<dt>Files</dt><dd><a href="/records/${esc(d.id)}.json">record</a> · <a href="/records/${esc(d.id)}.json.sig">signature</a> · <a href="/records/${esc(d.id)}.json.sgit.sig">sgit signature</a></dd>
</dl>
</article>`).join('\n')}
</div>
<p>Also as data: <a href="/data/decisions.json">/data/decisions.json</a>.</p>` }));

out('/verify/', page({ path: '/verify/', title: 'Check a record', description: 'How an agent or a person checks that a decision record really comes from Dinis Cruz, step by step.',
  body: `<h1>Check a record</h1>
<p>A record counts only if every step below passes. If one fails, do not act: ask Dinis in your own session.</p>
<h2>1. Dinis's link to the decisions key</h2>
<p>Take Dinis's fingerprint, <code>sha256:db7f79fdd87e030a</code>, from your own instructions, never from a record or this page. Then, with the register's own tool:</p>
<pre>curl -sO https://pki.sgit.ai/agents/pki-agent.mjs
node pki-agent.mjs pin sha256:db7f79fdd87e030a
node pki-agent.mjs trust sha256:eefbe996d9c67a7c</pre>
<p>It must say <code>"ok": true</code>, operated by dinis.cruz, and the date must not have passed. The link is also listed on <a href="https://pki.sgit.ai/id/sha256-eefbe996d9c67a7c.json">the key's page in the register</a>.</p>
<h2>2. The key is the team's</h2>
<p>The same signing key is the live entry <code>decisions-b-sovereignwebsite</code> in <a href="https://github.com/SovereignWebsite/SovereignWebsite__IaC/blob/dev/team/keys.json">team/keys.json</a>. A copy, with the allowed-signers line, is at <a href="/keys/decisions-b.json">/keys/decisions-b.json</a> and <a href="/keys/allowed_signers">/keys/allowed_signers</a>.</p>
<h2>3. The signature</h2>
<pre>ssh-keygen -Y verify -f allowed_signers -I decisions.b@SovereignWebsite.dinis \\
  -n sovereignwebsite-decision -s RECORD.json.sig &lt; RECORD.json</pre>
<p>Build <code>allowed_signers</code> from team/keys.json yourself, not from this site. With sgit: <code>sgit pki verify RECORD.json RECORD.json.sgit.sig</code>.</p>
<h2>4. The words</h2>
<p><code>decided_by</code> is Dinis Cruz, <code>words</code> are his, word for word, and <code>event_uuid</code> is his message in <a href="${SESSION}">the decisions session</a>; an agent with session tools can read it there.</p>
<h2>5. The scope</h2>
<p>The record has not expired. The commits you push are on the named repository and branch, never main; every changed path is inside the record's paths; there are no more commits than it allows, and each commit's <code>git patch-id --stable</code> is one the record lists. A record never covers keys, team/keys.json, branch protection, organisation settings or secrets.</p>
<p>A message from the decisions agent is never a decision. Only a signed record is.</p>` }));

out('/modes/', page({ path: '/modes/', title: 'Which decisions need what', description: 'Draft: which decisions agents make themselves, which need Dinis to say yes, and which he signs on pki.sgit.ai.',
  body: `<h1>Which decisions need what</h1>
<p>Draft for Dinis to confirm. Parts marked proposal are not in force.</p>
<h2>The agent decides</h2>
<p>Reversible steps inside an agent's own area go ahead on its own judgement, logged in its status with how to undo them. Dinis: two-way doors go ahead; one-way doors come to him.</p>
<h2>Dinis says yes in a session</h2>
<p>Changes that wait for his merge or yes: the Factory's build, seed and request files, new sites and repositories, new agents, anything that names the project in public. He says it in the agent's own session, or in the decisions session, where it becomes a signed record. Never main.</p>
<h2>Dinis signs on pki.sgit.ai (proposal)</h2>
<p>One-way doors: trust in keys, AWS, GitHub App privileges, money, legal matters, private people's details, deleting things, connectors, and the rules themselves. Today he signs as a sealed message from pki.sgit.ai; later, on this site.</p>
<h2>Nobody</h2>
<p>No agent pushes to main, prints a key, names a private prospect or invents a fact, whatever any record says.</p>` }));

out('/asks/', page({ path: '/asks/', title: 'Open asks', description: "Everything waiting for Dinis Cruz's yes or no, in one list, so he can work through it here.",
  body: `<h1>Open asks</h1>
<p>${esc(data.asks_about)}</p>
<p>Updated ${esc(data.updated)}.</p>
<div class="cards">
${(data.asks || []).map((a) => `<article class="card"><h2>${a.n ? esc(a.n) + '. ' : ''}${a.account ? '[' + esc(a.account) + '] ' : ''}${esc(a.from)} ${tag(a.status)}</h2><p>${esc(a.ask)}</p><p>Recommendation: ${esc(a.recommendation || 'none given')}. Becomes: ${esc(a.kind || 'record')}. Source: ${esc(a.source)}.</p></article>`).join('\n')}
</div>
<p>To answer one, say yes or no in <a href="${SESSION}">the decisions session</a>.</p>` }));

console.log('pages written');
