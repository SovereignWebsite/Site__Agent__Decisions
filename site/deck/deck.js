// The Decisions deck: reads this site's own data and draws the slides. No cookies, no tracking, no other site contacted.
(function () {
  'use strict';
  const el = (t, a, ...kids) => { const n = document.createElement(t); for (const [k, v] of Object.entries(a || {})) { if (k === 'class') n.className = v; else n.setAttribute(k, v); } for (const c of kids.flat()) n.append(c && c.nodeType ? c : document.createTextNode(c == null ? '' : String(c))); return n; };
  const svg = (t, a, ...kids) => { const n = document.createElementNS('http://www.w3.org/2000/svg', t); for (const [k, v] of Object.entries(a || {})) n.setAttribute(k, v); for (const c of kids.flat()) n.append(c && c.nodeType ? c : document.createTextNode(String(c))); return n; };
  const get = (u) => fetch(u, { cache: 'no-store' }).then((r) => r.ok ? r.json() : null).catch(() => null);
  const deck = document.getElementById('deck'), dots = document.getElementById('dots'), where = document.getElementById('where');
  let slides = [], at = 0;

  function show(i) {
    at = Math.max(0, Math.min(slides.length - 1, i));
    deck.replaceChildren(slides[at]());
    where.textContent = 'Slide ' + (at + 1) + ' of ' + slides.length;
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === at ? 'true' : 'false'));
    history.replaceState(null, '', '#' + (at + 1));
    deck.focus({ preventScroll: true });
  }

  function bars(rows, label) {
    const w = 640, rowH = 26, max = Math.max(1, ...rows.map((r) => r[1])), h = rows.length * rowH + 10;
    return el('div', { class: 'chart' }, svg('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', role: 'img', 'aria-label': label },
      rows.map(([name, v], i) => [
        svg('text', { x: 0, y: i * rowH + 18 }, name),
        svg('rect', { x: 170, y: i * rowH + 5, width: Math.max(2, (v / max) * (w - 230)), height: 16, rx: 4, fill: 'var(--accent)' }),
        svg('text', { x: 176 + (v / max) * (w - 230), y: i * rowH + 18, class: 'muted' }, v)])));
  }

  function donut(done, total, label) {
    const r = 54, c = 2 * Math.PI * r, f = total ? done / total : 0;
    return svg('svg', { viewBox: '0 0 140 140', width: 180, role: 'img', 'aria-label': label },
      svg('circle', { cx: 70, cy: 70, r, fill: 'none', stroke: 'var(--line)', 'stroke-width': 16 }),
      svg('circle', { cx: 70, cy: 70, r, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 16, 'stroke-dasharray': `${c * f} ${c}`, transform: 'rotate(-90 70 70)' }),
      svg('text', { x: 70, y: 76, 'text-anchor': 'middle', style: 'font-size:22px;font-weight:700' }, Math.round(f * 100) + '%'));
  }

  Promise.all([get('/data/for-dinis-now.json'), get('/data/records.json'), get('/data/onboarding.json'), get('/data/blocks.json')]).then(([now, recs, onb, blocks]) => {
    now = now || { items: [], updated: '' }; recs = recs || { records: [], count: 0 }; onb = onb || { agents: [] }; blocks = blocks || { blocks: [] };
    const confirmed = onb.agents.filter((a) => a.confirmed).length;
    const groups = [...new Set(now.items.map((i) => i.where))];
    const perDay = {}; recs.records.forEach((r) => { const d = String(r.at).slice(0, 10); perDay[d] = (perDay[d] || 0) + 1; });
    const perAcct = {}; onb.agents.forEach((a) => { const k = 'Account ' + (a.account || '?'); perAcct[k] = perAcct[k] || [0, 0]; perAcct[k][1]++; if (a.confirmed) perAcct[k][0]++; });

    slides = [
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Decisions, live'), el('h1', {}, 'Where things stand'),
        el('p', { class: 'lead' }, 'Drawn from this site\'s own data each time you open it. Updated ' + String(now.updated).replace('T', ' ').replace('Z', ' UTC') + '.'),
        el('div', { class: 'stats' },
          el('div', { class: 'stat' }, el('b', {}, now.items.length), el('span', {}, 'waiting for you')),
          el('div', { class: 'stat' }, el('b', {}, recs.count), el('span', {}, 'signed records')),
          el('div', { class: 'stat' }, el('b', {}, confirmed + '/' + onb.agents.length), el('span', {}, 'agents on the how-it-works checklist')),
          el('div', { class: 'stat' }, el('b', {}, blocks.blocks.length), el('span', {}, 'blocks put to the panel')))),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'For you now'), el('h2', {}, 'Where to go, and what to say'),
        groups.map((g) => [el('div', { class: 'group' }, g), el('div', { class: 'grid' }, now.items.map((it, n) => [it, n]).filter(([it]) => it.where === g).map(([it, n]) =>
          el('article', { class: 'card' }, el('span', { class: 'n' }, n + 1), el('p', {}, it.what), el('div', { class: 'say' }, it.say), it.link ? el('a', { href: it.link }, 'Open ' + it.where) : '')))])),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'How a decision flows'), el('h2', {}, 'Every step is in Git'),
        el('div', { class: 'flow' },
          [['Request', 'The agent commits a request in its own repository and sends only the link.'], ['Receipt', 'decisions.b files it at /requests/<agent>/<id>.json.'], ['Block', 'Routine items are grouped and sent to the panel.'], ['Opinions', 'Each reviewer signs its opinion in its own repository.'], ['Record', 'All agree: decisions.b signs. Any disagreement: Dinis.'], ['Push', 'For the IaC, a push record pins the exact patch-id.']]
            .map(([t, d]) => el('div', { class: 'step' }, el('b', {}, t), d))),
        el('p', { class: 'lead' }, 'The rules, with examples: ', el('a', { href: '/how-it-works/' }, 'how it works'), '.')),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Records'), el('h2', {}, 'Signed records per day'),
        bars(Object.entries(perDay).sort(), 'Signed records per day'), el('p', {}, el('a', { href: '/decisions/' }, 'Every record'))),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Onboarding'), el('h2', {}, 'Agents holding their state in their repository'),
        el('div', { class: 'grid' }, el('div', { class: 'chart' }, donut(confirmed, onb.agents.length, confirmed + ' of ' + onb.agents.length + ' confirmed')),
          bars(Object.entries(perAcct).sort().map(([k, v]) => [k + ' (' + v[0] + '/' + v[1] + ')', v[0]]), 'Confirmed agents per account')),
        el('p', {}, 'Not yet: ', onb.agents.filter((a) => !a.confirmed).map((a) => el('span', { class: 'chip wait' }, a.agent)))),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'The panel'), el('h2', {}, 'Blocks'),
        el('div', { class: 'grid' }, blocks.blocks.map((b) => el('article', { class: 'card' }, el('a', { href: b.url }, b.id), el('p', {}, b.items + ' items'), el('p', {}, el('span', { class: 'chip ' + (/^decided/.test(b.state) ? 'ok' : 'wait') }, String(b.state).slice(0, 90))))))),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Feedback'), el('h2', {}, 'Tell decisions.b'),
        el('p', { class: 'lead' }, 'Comments go through feedback.b\'s lane for this site and reach decisions.b. The page works on a device that has scanned the QR code feedback.b gave you; there is no anonymous way in.'),
        el('p', {}, el('a', { href: '/send/' }, 'Send a comment'), ' or ', el('a', { href: 'https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ' }, 'say it in the decisions session')))
    ];
    dots.replaceChildren(...slides.map((_, k) => { const b = el('button', { type: 'button', 'aria-label': 'Slide ' + (k + 1) }); b.onclick = () => show(k); return b; }));
    const start = parseInt(location.hash.slice(1), 10);
    show(isNaN(start) ? 0 : start - 1);
  });
  document.getElementById('prev').onclick = () => show(at - 1);
  document.getElementById('next').onclick = () => show(at + 1);
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'PageDown') show(at + 1); if (e.key === 'ArrowLeft' || e.key === 'PageUp') show(at - 1); });
})();
