(function () {
  'use strict';
  var D = window.DASH_DATA, C = window.DASH_CONTENT;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var MN = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };

  // ---------- helpers ----------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  var ratio = function (p) { return p && p[1] ? p[0] / p[1] : null; };
  function pct(r, dec) {
    if (r == null) return 'n/a';
    var v = r * 100;
    return v.toFixed(dec != null ? dec : (v < 1 ? 2 : 1)) + '%';
  }
  function compact(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e4) return Math.round(n / 1e3) + 'K';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }
  function commas(n) { return Math.round(n).toLocaleString('en-US'); }
  function monthLabel(m, i) {
    var lab = MN[m.slice(5)] || m;
    return (i === D.months.length - 1) ? lab + '*' : lab;
  }
  function dateNice(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MN[p[1]];
  }
  // Current month vs the month before. Early in a month (fewer than 10 days of data) compare the last two complete months instead.
  var FULL = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };
  var NM = D.months.length, dayNow = parseInt(D.through.slice(8, 10), 10);
  var curI = dayNow >= 10 ? NM - 1 : NM - 2, prevI = curI - 1;
  var curName = FULL[D.months[curI].slice(5)], prevName = FULL[D.months[prevI].slice(5)];
  var curPartial = curI === NM - 1;
  var curText = curPartial ? curName + ' so far' : curName;
  // two-proportion z between the two months; a change also has to be at least 5% in relative terms to count
  function change(step) {
    var a = step.months[prevI], b = step.months[curI];
    if (!a[1] || !b[1] || a[1] < 30 || b[1] < 30) return { p: ratio(a), l: ratio(b), diff: null, dir: 'few', z: 0 };
    var p1 = a[0] / a[1], p2 = b[0] / b[1], pp = (a[0] + b[0]) / (a[1] + b[1]);
    var se = Math.sqrt(pp * (1 - pp) * (1 / a[1] + 1 / b[1]));
    var z = se ? (p2 - p1) / se : 0;
    var real = Math.abs(z) >= 1.96 && p1 > 0 && Math.abs(p2 - p1) / p1 >= 0.05;
    var moved = p1 > 0 && Math.abs(p2 - p1) / p1 >= 0.05;
    var dir = real ? (z > 0 ? 'up' : 'down') : moved ? (p2 > p1 ? 'lean-up' : 'lean-down') : 'flat';
    return { p: p1, l: p2, diff: p2 - p1, z: z, dir: dir };
  }
  function chip(ch) {
    var icons = { up: '\u25B2', down: '\u25BC', 'lean-up': '\u25B2', 'lean-down': '\u25BC', flat: '\u2013', few: '?' };
    var ad = ch.diff == null ? 0 : Math.abs(ch.diff * 100);
    var pp = ch.diff == null ? '' : (ch.diff >= 0 ? '+' : '\u2212') + ad.toFixed(ad < 1 ? 2 : 1) + ' pts';
    var text = {
      up: 'Improved ' + pp, down: 'Declined ' + pp,
      'lean-up': 'Up ' + pp + ', not yet significant', 'lean-down': 'Down ' + pp + ', not yet significant',
      flat: 'No clear change (' + pp + ')', few: 'Too few people to tell'
    }[ch.dir];
    var tip = ch.dir === 'few' ? 'Fewer than 30 people in one of the two months' : prevName + ' ' + pct(ch.p) + ' \u2192 ' + curText + ' ' + pct(ch.l);
    return el('span', { class: 'chip ' + ch.dir, title: tip }, [
      el('span', { class: 'ico', 'aria-hidden': 'true', text: icons[ch.dir] }),
      el('span', { text: text })
    ]);
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(v)));
    var f = v / e;
    var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * e;
  }
  function segName(f) { return f.platform + ' · ' + (f.segment === 'guest' ? 'Logged-out visitors' : 'Logged-in visitors'); }

  // ---------- tooltip ----------
  var tt = document.getElementById('tt');
  function showTip(evt, title, value, sub, keyed) {
    tt.textContent = '';
    tt.appendChild(el('div', { class: 't', text: title }));
    var v = el('div', { class: 'v' });
    if (keyed) v.appendChild(el('span', { class: 'key' }));
    v.appendChild(document.createTextNode(value));
    tt.appendChild(v);
    (sub || []).forEach(function (s) { tt.appendChild(el('div', { class: 'r', text: s })); });
    tt.hidden = false;
    var x = evt.clientX + 14, y = evt.clientY + 14, w = tt.offsetWidth, h = tt.offsetHeight;
    if (x + w > window.innerWidth - 8) x = evt.clientX - w - 14;
    if (y + h > window.innerHeight - 8) y = evt.clientY - h - 14;
    tt.style.left = Math.max(8, x) + 'px'; tt.style.top = Math.max(8, y) + 'px';
  }
  function hideTip() { tt.hidden = true; }

  // ---------- charts ----------
  // vals: rates (0-1) per month; tips: [{title,value,sub}] per month
  function lineChart(host, o) {
    var draw = function () {
      var W = host.clientWidth; if (!W) return;
      host.textContent = '';
      var H = o.height, mini = !!o.mini;
      var spark = !!o.spark;
      var m = spark ? { l: 6, r: 8, t: 6, b: 6 } : mini ? { l: 6, r: 8, t: 6, b: 16 } : { l: 42, r: 24, t: 20, b: 26 };
      var iw = W - m.l - m.r, ih = H - m.t - m.b, n = o.vals.length;
      var max = Math.max.apply(null, o.vals.filter(function (v) { return v != null; }));
      var top = mini ? Math.min(1, niceMax(max * 1.15)) : Math.min(1, niceMax(max * 1.15));
      if (mini) top = Math.min(1, max * 1.2 || 1);
      var X = function (i) { return m.l + (i + 0.5) * iw / n; };
      var lo = 0;
      if (spark) {
        var vs = o.vals.filter(function (v) { return v != null; });
        var mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs), pad = (mx - mn) * 0.15 || mx * 0.1;
        lo = mn - pad; top = mx + pad;
      }
      var Y = function (v) { return m.t + ih - ((v - lo) / (top - lo)) * ih; };
      var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, height: H, role: 'img', 'aria-label': o.aria });
      if (!mini) {
        for (var t = 0; t <= 4; t++) {
          var tv = top * t / 4, ty = Y(tv);
          sv('line', { x1: m.l, x2: W - m.r, y1: ty, y2: ty, class: t === 0 ? 'l-axis' : 'l-grid' }, svg);
          var tl = sv('text', { x: m.l - 8, y: ty + 4, 'text-anchor': 'end' }, svg);
          tl.textContent = pct(tv, top < 0.02 ? 2 : (top < 0.1 ? 1 : 0));
        }
      } else if (!spark) {
        sv('line', { x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0), class: 'l-axis' }, svg);
      }
      var pts = [];
      o.vals.forEach(function (v, i) { if (v != null) pts.push([X(i), Y(v), i]); });
      if (o.area !== false && pts.length > 1) {
        var ap = 'M' + pts[0][0] + ',' + Y(0) + ' L' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' L') + ' L' + pts[pts.length - 1][0] + ',' + Y(0) + ' Z';
        sv('path', { d: ap, class: 'l-area' }, svg);
      }
      sv('path', { d: 'M' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' L'), class: 'l-line' }, svg);
      var cross = sv('line', { x1: 0, x2: 0, y1: m.t, y2: m.t + ih, class: 'l-cross', visibility: 'hidden' }, svg);
      pts.forEach(function (p) {
        var last = p[2] === n - 1 && o.partialLast;
        if (mini && p[2] !== n - 1) return;
        sv('circle', { cx: p[0], cy: p[1], r: mini ? 3.5 : 4.5, class: 'l-dot' + (last ? ' hollow' : '') }, svg);
      });
      // labels: latest value always; peak when it is not the latest (full chart only)
      if (!mini) {
        var lastPt = pts[pts.length - 1];
        var lt = sv('text', { x: lastPt[0], y: lastPt[1] - 11, 'text-anchor': 'middle', class: 'lab' }, svg);
        lt.textContent = pct(o.vals[lastPt[2]]);
        var pk = pts.reduce(function (a, b) { return o.vals[b[2]] > o.vals[a[2]] ? b : a; });
        if (pk[2] !== lastPt[2]) {
          var pt = sv('text', { x: pk[0], y: pk[1] - 11, 'text-anchor': 'middle', class: 'lab' }, svg);
          pt.textContent = pct(o.vals[pk[2]]);
        }
      }
      // x labels
      var xl = spark ? [] : mini ? [0, n - 1] : o.labels.map(function (_, i) { return i; });
      xl.forEach(function (i) {
        var tx = sv('text', { x: X(i), y: H - (mini ? 3 : 7), 'text-anchor': 'middle' }, svg);
        tx.textContent = o.labels[i];
      });
      // hover layer: nearest month; hit area spans the whole plot
      var hit = sv('rect', { x: m.l, y: 0, width: iw, height: H, fill: 'transparent' }, svg);
      var idx = function (e) {
        var r = svg.getBoundingClientRect();
        var i = Math.floor((e.clientX - r.left - m.l) / (iw / n));
        return Math.max(0, Math.min(n - 1, i));
      };
      hit.addEventListener('pointermove', function (e) {
        var i = idx(e); if (o.vals[i] == null) return;
        cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
        var tip = o.tips[i];
        showTip(e, tip.title, tip.value, tip.sub, true);
      });
      hit.addEventListener('pointerleave', function () { cross.setAttribute('visibility', 'hidden'); hideTip(); });
      host.appendChild(svg);
    };
    watch(host, draw);
  }

  function barChart(host, o) {
    var draw = function () {
      var W = host.clientWidth; if (!W) return;
      host.textContent = '';
      var H = o.height, m = { l: 42, r: 10, t: 20, b: 26 };
      var iw = W - m.l - m.r, ih = H - m.t - m.b, n = o.vals.length;
      var top = niceMax(Math.max.apply(null, o.vals) * 1.1);
      var Y = function (v) { return m.t + ih - (v / top) * ih; };
      var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, height: H, role: 'img', 'aria-label': o.aria });
      for (var t = 0; t <= 4; t++) {
        var tv = top * t / 4, ty = Y(tv);
        sv('line', { x1: m.l, x2: W - m.r, y1: ty, y2: ty, class: t === 0 ? 'l-axis' : 'l-grid' }, svg);
        var tl = sv('text', { x: m.l - 8, y: ty + 4, 'text-anchor': 'end' }, svg);
        tl.textContent = compact(tv);
      }
      var band = iw / n, bw = Math.min(24, band * 0.5);
      o.vals.forEach(function (v, i) {
        var x = m.l + i * band + (band - bw) / 2, y = Y(v), h = Math.max(1, m.t + ih - y), r = Math.min(4, bw / 2, h);
        var d = 'M' + x + ',' + (m.t + ih) + ' V' + (y + r) + ' Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
          ' H' + (x + bw - r) + ' Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + r) + ' V' + (m.t + ih) + ' Z';
        var bar = sv('path', { d: d, class: 'b-bar' + (i === n - 1 && o.partialLast ? ' part' : '') }, svg);
        var lab = sv('text', { x: x + bw / 2, y: y - 6, 'text-anchor': 'middle', class: 'lab' }, svg);
        lab.textContent = compact(v);
        var xl = sv('text', { x: x + bw / 2, y: H - 7, 'text-anchor': 'middle' }, svg);
        xl.textContent = o.labels[i];
        var hit = sv('rect', { x: m.l + i * band, y: 0, width: band, height: H, fill: 'transparent' }, svg);
        hit.addEventListener('pointermove', function (e) {
          bar.classList.add('hover');
          showTip(e, o.tipTitles[i], commas(v) + ' people', o.tipSub[i], false);
        });
        hit.addEventListener('pointerleave', function () { bar.classList.remove('hover'); hideTip(); });
      });
      host.appendChild(svg);
    };
    watch(host, draw);
  }

  var ro = ('ResizeObserver' in window) ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { if (e.target._draw) e.target._draw(); });
  }) : null;
  function watch(host, draw) {
    host._draw = draw;
    if (ro) ro.observe(host); else { draw(); window.addEventListener('resize', draw); }
  }

  // ---------- content ----------
  var labels = D.months.map(monthLabel);
  var lastMonthName = MN[D.months[D.months.length - 1].slice(5)];
  var partialText = '1–' + dateNice(D.through);
  var partialNote = lastMonthName + '* covers ' + partialText;
  function fill(id, arr) {
    var ul = document.getElementById(id);
    arr.forEach(function (t) { ul.appendChild(el('li', { text: t })); });
  }
  document.getElementById('title').textContent = C.title;
  document.getElementById('subtitle').textContent = C.subtitle;
document.getElementById('commentary-note').textContent = 'The written commentary (the three boxes and the takeaway on each card) was written on ' + C.commentaryAsOf + ' and does not update by itself. The numbers, charts and table refresh every week.';
  document.getElementById('asof').textContent = 'Data through ' + dateNice(D.through) + ' ' + D.through.slice(0, 4) + ' · ' + partialNote;
  document.getElementById('th-rate').textContent = 'Overall conversion, ' + curText;
  document.getElementById('th-change').textContent = 'Change vs ' + prevName;
  document.getElementById('th-ent').textContent = 'People entering, ' + curText;
  document.getElementById('ov-lede').textContent = 'Overall conversion means the share of people who viewed a session page and went on to buy, in a single visit. The chip compares ' + curText + ' with ' + prevName + ' (hover it for both figures), and the small line shows the shape of the monthly trend (each row has its own scale).';
  fill('c-working', C.working); fill('c-not', C.notWorking); fill('c-watch', C.watch); fill('notes-list', C.notes);

  function overall(f) { return f.steps[f.steps.length - 1]; }

  // scoreboard
  var tbody = document.querySelector('#scoreboard tbody');
  var order = { group: [], oneone: [] };
  D.funnels.forEach(function (f) { order[f.product].push(f); });
  var platRank = { Web: 0, iOS: 1, Android: 2 };
  Object.keys(order).forEach(function (k) {
    order[k].sort(function (a, b) { return platRank[a.platform] - platRank[b.platform] || (a.segment === 'loggedin' ? -1 : 1); });
  });
  var rows = [];
  [['group', 'Group purchase'], ['oneone', '1:1 booking']].forEach(function (pair) {
    var gr = el('tr', { class: 'group' }, [el('td', { colspan: '5', text: pair[1] })]);
    tbody.appendChild(gr); rows.push({ tr: gr, plat: null });
    order[pair[0]].forEach(function (f) {
      var ov = overall(f), ch = change(ov);
      var spark = el('div', { class: 'host spark' });
      var tr = el('tr', { class: 'row' }, [
        el('td', null, [el('a', { href: '#' + f.id, text: segName(f) })]),
        el('td', { class: 'num', text: pct(ch.l) }),
        el('td', null, [chip(ch)]),
        el('td', null, [spark]),
        el('td', { class: 'num', text: commas(f.entrants.months[curI]) })
      ]);
      tbody.appendChild(tr); rows.push({ tr: tr, plat: f.platform, grp: gr });
      lineChart(spark, {
        vals: ov.months.map(ratio), labels: labels, height: 34, mini: true, spark: true, area: false, partialLast: true,
        aria: 'Overall conversion by month for ' + segName(f),
        tips: ov.months.map(function (p, i) { return { title: labels[i], value: pct(ratio(p)), sub: [commas(p[0]) + ' purchases of ' + commas(p[1])] }; })
      });
    });
  });

  // funnel cards
  function buildCard(f) {
    var ov = overall(f), och = change(ov), flags = [];
    if (f.entrants.months[prevI] < 1000) flags.push('Small audience – read direction only');
    var head = el('header', null, [el('h3', { text: segName(f) })]);
    var right = el('div', null);
    flags.forEach(function (t) { right.appendChild(el('span', { class: 'tag', text: t })); });
    head.appendChild(right);
    var card = el('article', { class: 'card fcard', id: f.id }, [head]);
    card.appendChild(el('p', { class: 'takeaway', text: C.takeaways[f.id] || '' }));
    card.appendChild(el('div', { class: 'stats' }, [
      el('div', { class: 'stat' }, [el('div', { class: 'k', text: 'Overall conversion, ' + curText }), el('div', { class: 'v', text: pct(och.l) })]),
      el('div', { class: 'stat' }, [el('div', { class: 'k', text: 'vs ' + pct(och.p) + ' in ' + prevName }), el('div', { class: 'v sm' }, [chip(och)])]),
      el('div', { class: 'stat' }, [el('div', { class: 'k', text: 'People entering, ' + curText }), el('div', { class: 'v sm', text: commas(f.entrants.months[curI]) })])
    ]));
    var h1 = el('div', { class: 'host' }), h2 = el('div', { class: 'host' });
    card.appendChild(el('div', { class: 'charts' }, [
      el('div', null, [el('p', { class: 'chart-t', text: 'Overall conversion by month' }), el('p', { class: 'chart-s', text: 'Share of people who entered and then purchased, in one visit' }), h1]),
      el('div', null, [el('p', { class: 'chart-t', text: 'People entering the funnel' }), el('p', { class: 'chart-s', text: 'Per month (' + lastMonthName + ' is part-month)' }), h2])
    ]));
    lineChart(h1, {
      vals: ov.months.map(ratio), labels: labels, height: 210, partialLast: true,
      aria: 'Overall conversion by month for ' + segName(f),
      tips: ov.months.map(function (p, i) {
        return { title: labels[i] + (i === labels.length - 1 ? ' (' + partialText + ')' : ''), value: pct(ratio(p)), sub: [commas(p[0]) + ' purchases of ' + commas(p[1]) + ' entrants'] };
      })
    });
    barChart(h2, {
      vals: f.entrants.months, labels: labels, height: 210, partialLast: true,
      aria: 'People entering the funnel by month for ' + segName(f),
      tipTitles: labels.map(function (l, i) { return l + (i === labels.length - 1 ? ' (' + partialText + ')' : ''); }),
      tipSub: f.entrants.months.map(function () { return []; })
    });
    card.appendChild(el('h4', { text: 'Step by step, month by month (the big number is ' + curText + ')' }));
    var grid = el('div', { class: 'steps' });
    f.steps.filter(function (s) { return !s.overall; }).forEach(function (s) {
      var ch = change(s), host = el('div', { class: 'host' });
      grid.appendChild(el('div', { class: 'step' }, [
        el('div', { class: 'step-n', text: s.label }),
        el('div', { class: 'step-v', text: pct(ch.l, 1) }),
        el('div', { class: 'step-d' }, [chip(ch)]),
        host
      ]));
      lineChart(host, {
        vals: s.months.map(ratio), labels: labels, height: 58, mini: true, partialLast: true,
        aria: s.label + ' by month',
        tips: s.months.map(function (p, i) {
          return { title: s.label + ' · ' + labels[i], value: pct(ratio(p), 1), sub: [commas(p[0]) + ' of ' + commas(p[1])] };
        })
      });
    });
    card.appendChild(grid);
    // table view
    var det = el('details', null, [el('summary', { text: 'View the numbers' })]);
    var tbl = el('table');
    var trh = el('tr', null, [el('th', { scope: 'col', text: 'Step' })]);
    labels.forEach(function (l) { trh.appendChild(el('th', { scope: 'col', text: l })); });
    tbl.appendChild(el('thead', null, [trh]));
    var tb = el('tbody');
    f.steps.forEach(function (s) {
      var tr = el('tr', null, [el('td', { text: s.label })]);
      s.months.forEach(function (p) { tr.appendChild(el('td', { text: pct(ratio(p), 1) })); });
      tb.appendChild(tr);
    });
    var tre = el('tr', null, [el('td', { text: 'People entering' })]);
    f.entrants.months.forEach(function (v) { tre.appendChild(el('td', { text: commas(v) })); });
    tb.appendChild(tre);
    tbl.appendChild(tb);
    det.appendChild(el('div', { class: 'tbl' }, [tbl]));
    card.appendChild(det);
    return card;
  }
  var cardMap = [];
  ['group', 'oneone'].forEach(function (p) {
    var host = document.getElementById('cards-' + p);
    order[p].forEach(function (f) { var c = buildCard(f); host.appendChild(c); cardMap.push({ el: c, plat: f.platform }); });
  });

  // platform filter
  var state = 'All';
  var pills = document.getElementById('platform-pills');
  ['All', 'Web', 'iOS', 'Android'].forEach(function (name) {
    var b = el('button', { class: 'pill', type: 'button', 'aria-pressed': name === 'All' ? 'true' : 'false', text: name });
    b.addEventListener('click', function () {
      state = name;
      Array.prototype.forEach.call(pills.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cardMap.forEach(function (c) { c.el.hidden = !(state === 'All' || c.plat === state); });
      rows.forEach(function (r) { if (r.plat) r.tr.hidden = !(state === 'All' || r.plat === state); });
    });
    pills.appendChild(b);
  });

  // theme
  var root = document.documentElement;
  try { var saved = localStorage.getItem('pr-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  document.getElementById('theme').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pr-theme', next); } catch (e) {}
  });
})();
