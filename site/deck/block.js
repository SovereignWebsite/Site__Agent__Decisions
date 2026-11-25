// A decision block as a presentation: one slide per item, with what is asked, the draft, every reviewer's opinion,
// and what follows. Reads this site's own /data/blocks/<id>.json. No cookies, no tracking, no other site contacted.
(function () {
  'use strict';
  const el = (t, a, ...kids) => { const n = document.createElement(t); for (const [k, v] of Object.entries(a || {})) { if (k === 'class') n.className = v; else n.setAttribute(k, v); } for (const c of kids.flat()) n.append(c && c.nodeType ? c : document.createTextNode(c == null ? '' : String(c))); return n; };
  const deck = document.getElementById('deck'), dots = document.getElementById('dots'), where = document.getElementById('where');
  const id = document.body.getAttribute('data-block');
  let slides = [], at = 0;
  const show = (i) => { at = Math.max(0, Math.min(slides.length - 1, i)); deck.replaceChildren(slides[at]()); where.textContent = id + ': slide ' + (at + 1) + ' of ' + slides.length; [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === at ? 'true' : 'false')); history.replaceState(null, '', '#' + (at + 1)); deck.focus({ preventScroll: true }); };
  const follows = (it, b) => {
    const s = String(b.state || ''), d = String(it.draft || '');
    if (/always-ask|Dinis/i.test(d)) return 'After the panel, this goes to Dinis: it touches a protected path or needs his own act.';
    if (/^decided/.test(s)) return 'Decided by the panel; decisions.b signs the record and the agent pushes under it.';
    return 'If every reviewer agrees, decisions.b signs and the agent acts. Any disagreement goes to Dinis.';
  };
  fetch('/data/blocks/' + id + '.json', { cache: 'no-store' }).then((r) => r.json()).then((b) => {
    const ops = b.opinions || {};
    slides = [
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Decision block'), el('h1', {}, b.id),
        el('p', { class: 'lead' }, 'Opened ' + String(b.opened).replace('T', ' ').replace('Z', ' UTC') + '. ' + b.items.length + ' items. State: ' + b.state),
        el('p', {}, 'Panel: ', b.panel.map((p) => el('span', { class: 'chip' }, p))), el('p', { class: 'lead' }, b.how)),
      ...b.items.map((it, n) => () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Item ' + (n + 1) + ' of ' + b.items.length), el('h2', {}, it.item),
        el('p', { class: 'lead' }, it.what),
        el('div', { class: 'grid' },
          el('article', { class: 'card' }, el('span', { class: 'n' }, 'The change'), el('p', {}, 'Repository: ' + it.repository), el('p', {}, 'Paths: ' + ((it.paths || []).join(', ') || 'none')), el('p', {}, 'Commit ' + it.commit + ', patch-id ' + it.patch_id)),
          el('article', { class: 'card' }, el('span', { class: 'n' }, 'decisions.b\'s draft'), el('p', {}, it.draft), it.also_ask && it.also_ask.length ? el('p', {}, 'Also asked: ' + it.also_ask.join('; ')) : '')),
        el('div', { class: 'group' }, 'The panel'),
        el('div', { class: 'grid' }, Object.keys(ops[it.item] || {}).length ? Object.entries(ops[it.item]).map(([who, v]) => el('article', { class: 'card' }, el('span', { class: 'n' }, who.replace(/ \(.*$/, '')), el('p', {}, v))) : [el('p', {}, 'No opinions yet.')]),
        el('div', { class: 'group' }, 'What follows'), el('p', {}, follows(it, b)))),
      () => el('section', { class: 'slide' }, el('div', { class: 'kicker' }, 'Summary'), el('h2', {}, 'Where ' + b.id + ' stands'),
        el('div', { class: 'grid' }, b.items.map((it) => el('article', { class: 'card' }, el('span', { class: 'n' }, it.item), el('p', {}, Object.keys(ops[it.item] || {}).length + ' of ' + b.panel.length + ' opinions in'), el('p', {}, follows(it, b))))),
        el('p', {}, el('a', { href: '/blocks/' + b.id + '/' }, 'The block page'), ' · ', el('a', { href: '/data/blocks/' + b.id + '.json' }, 'the data'), ' · ', el('a', { href: '/send/' }, 'send a comment')))];
    dots.replaceChildren(...slides.map((_, k) => { const x = el('button', { type: 'button', 'aria-label': 'Slide ' + (k + 1) }); x.onclick = () => show(k); return x; }));
    const s = parseInt(location.hash.slice(1), 10); show(isNaN(s) ? 0 : s - 1);
  }).catch(() => { deck.replaceChildren(el('p', { class: 'plain' }, 'This block could not be loaded. The block page is at /blocks/' + id + '/.')); });
  document.getElementById('prev').onclick = () => show(at - 1);
  document.getElementById('next').onclick = () => show(at + 1);
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'PageDown') show(at + 1); if (e.key === 'ArrowLeft' || e.key === 'PageUp') show(at - 1); });
})();
