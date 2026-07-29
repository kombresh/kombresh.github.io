/* sample.js —— 樣本詳情頁
 *
 * 頁面結構：
 *   1. API 呼叫數長條圖（可點）。橫軸：基線 → mirage 每一輪 → ＋靜態（佔位）。
 *      mirage 每一輪是「該輪自己的計數」，不是累積 —— 有樣本第 3 輪比第 2 輪少。
 *      唯一會堆疊的是基線那一根，堆的是它自己的組成分段，且只在線性刻度下。
 *   2. Speakeasy 執行結果
 *   3. 靜態分析結果
 *   4. 這一次實際跑過的流程（從 tools[*].status 反推）
 */
(function () {
  'use strict';

  var A = window.AIS3;
  var el = A.el, append = A.append, pill = A.pill, clear = A.clear;

  var SVGNS = 'http://www.w3.org/2000/svg';

  A.markNav();

  var root = document.getElementById('sample-root');

  A.loadData().then(function (data) {
    var id = new URLSearchParams(location.search).get('id');
    renderNav(data, id);

    var s = id ? A.bySha(data, id) : null;
    if (!s) {
      s = (data.samples || [])[0];
      if (!s) { A.fail(root, new Error('資料裡沒有任何樣本')); return; }
      if (id) {
        // 網址帶了不存在的 id：講清楚，然後退回第一支。
        var warn = el('div', 'note bad');
        warn.appendChild(el('p', null, '找不到 id 為「' + id + '」的樣本，以下顯示 ' + s.id + '。'));
        root.parentNode.insertBefore(warn, root);
      }
      renderNav(data, s.id);
    }

    document.title = s.id + ' —— AIS3 惡意程式分析專題';
    var fm = document.getElementById('foot-meta');
    if (fm) fm.textContent = '資料產生於 ' +
      (data.generated_at || '').replace('T', ' ').replace('Z', ' UTC') + '。';

    render(s, data);
  }).catch(function (err) { A.fail(root, err); });

  // ------------------------------------------------------------------ nav

  function renderNav(data, current) {
    var nav = clear(document.getElementById('sample-nav'));
    var back = el('a', null, '← 全部樣本');
    back.href = 'index.html#samples';
    nav.appendChild(back);
    (data.samples || []).forEach(function (s) {
      var a = el('a', null, s.id);
      a.href = 'sample.html?id=' + encodeURIComponent(s.id);
      if (s.id === current) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
  }

  // --------------------------------------------------------------- render

  function render(s, data) {
    clear(root);
    append(root,
      head(s),
      chartSection(s, data),
      mirageSection(s),
      speakeasySection(s),
      staticSection(s),
      flowSection(s));
  }

  function head(s) {
    var su = s.summary;
    var box = el('header', 'sample-head');
    var top = el('div', 'sh-top');
    top.appendChild(el('h1', null, s.id));

    var badges = el('span', 'pill-row');
    badges.appendChild(pill(su.arch || '架構不明'));
    badges.appendChild(pill(su.is_dll ? 'DLL' : 'EXE'));
    badges.appendChild(pill(A.bytes(su.size)));
    if (su.packed) badges.appendChild(pill('加殼', 'warn'));
    if (su.degraded) badges.appendChild(pill('證據不完整', 'bad'));
    top.appendChild(badges);

    box.appendChild(top);
    box.appendChild(el('p', 'sh-hash', 'sha256  ' + A.dash(s.sha256)));

    var pairs = [];
    if (s.md5) pairs.push(['md5', s.md5]);
    if (s.sha1) pairs.push(['sha1', s.sha1]);
    if (s.static && s.static.pe && s.static.pe.imphash) pairs.push(['imphash', s.static.pe.imphash]);
    if (pairs.length) box.appendChild(A.kv(pairs));

    if (su.degraded && s.static.degraded && s.static.degraded.note) {
      var n = el('div', 'note bad');
      n.style.marginTop = '14px';
      n.appendChild(el('p', null, s.static.degraded.note));
      if ((s.static.degraded.tools_not_ok || []).length) {
        n.appendChild(el('p', 'small faint',
          '沒跑成功的工具：' + s.static.degraded.tools_not_ok.join('、')));
      }
      box.appendChild(n);
    }
    return box;
  }

  // ---------------------------------------------------------------- 圖表

  /* 一支樣本一張圖：
   *   第 0 格   純 Speakeasy 基線（依進入點分段）
   *   第 1..N 格 mirage 的每一輪（各自獨立的計數，不累積）
   *   最後一格  ＋動態＋靜態 —— 尚未取得，虛線佔位
   * 點任一格會在下面的面板展開那一格的細節。
   */
  function buildBars(s) {
    var dyn = s.dynamic || {};
    var bars = [{
      kind: 'baseline',
      key: 'base',
      label: '基線',
      sub: '純 Speakeasy',
      value: s.speakeasy.apis_total,
      segments: s.baseline_segments || []
    }];
    (dyn.rounds || []).forEach(function (r) {
      bars.push({
        kind: 'round',
        key: 'r' + r.round,
        label: '第 ' + r.round + ' 輪',
        sub: 'mirage',
        value: r.n_apis,
        round: r
      });
    });
    bars.push({
      kind: 'ghost',
      key: 'ghost',
      label: '＋靜態',
      sub: '尚未取得',
      value: null
    });
    return bars;
  }

  function chartSection(s, data) {
    var dyn = s.dynamic || {};
    var bars = buildBars(s);
    var isLog = dyn.scale === 'log';

    var sec = el('section', 'section dyn');
    var h = el('h2', null, '每一輪觀察到的 API 呼叫數');
    h.appendChild(el('span', 'h2-note', '點任一根長條看那一輪發生了什麼'));
    sec.appendChild(h);

    sec.appendChild(el('p', 'lede small',
      '橫軸左邊第一根是純 Speakeasy 基線，接下來是 mirage 外圈的每一輪，' +
      '最後一根是「＋動態＋靜態」那一組 —— 尚未取得，所以是空的。' +
      '每一根長條都是那一輪各自的計數，不是累積：' +
      '迭代之間的 API 數不是單調遞增，累積畫法在數字下降時沒有意義。'));

    if (!dyn.available) {
      sec.appendChild(el('div', 'pending-box', '這支樣本沒有 mirage 執行紀錄。'));
      return sec;
    }

    // 全站最重要的一句話：這六支沒有一支是「成功」。
    var oc = dyn.outcome;
    var honest = el('div', 'note bad');
    honest.style.marginBottom = '16px';
    honest.appendChild(el('p', null,
      '這一支的 mirage 結果：success = ' + oc.success + '、assisted = ' + oc.assisted +
      '、inconclusive = ' + oc.inconclusive + '。' +
      '長條變高代表「樣本被推著多跑了一段」，不代表分析成功 —— ' +
      '這一輪裡有值是我們補的或編的。'));
    if (oc.exit_meaning) {
      honest.appendChild(el('p', 'small faint', '外圈的收場：' + oc.exit_meaning));
    }
    sec.appendChild(honest);

    if (isLog) {
      var lg = el('div', 'note warn');
      lg.style.marginBottom = '16px';
      lg.appendChild(el('p', null,
        '⚠️ 這支樣本的縱軸是對數刻度（' + A.num(dyn.min_apis) + ' 到 ' +
        A.num(dyn.max_apis) + '，跨了 ' +
        Math.round(dyn.max_apis / Math.max(1, dyn.min_apis)) + ' 倍）。' +
        '線性刻度會把小的那幾根壓成看不見的一條線。' +
        '對數刻度下，長條的視覺高度差不等於倍數差 —— 請看長條上的數字。'));
      sec.appendChild(lg);
    }

    var box = el('div', 'chart-box');
    var panel = el('div', 'detail-panel');
    var state = { active: null, buttons: [], groups: [], sample: s };

    box.appendChild(buildChart(s, bars, isLog, state, panel));
    box.appendChild(barList(bars, state, panel));

    var legend = el('div', 'chart-legend');
    var l0 = el('span');
    var i0 = el('i'); i0.style.background = 'var(--base-bar)';
    append(l0, i0, el('span', null, '純 Speakeasy 基線'));
    var l1 = el('span'); l1.appendChild(el('i'));
    l1.appendChild(el('span', null, 'mirage 的每一輪'));
    var l2 = el('span'); l2.appendChild(el('i', 'ghost-key'));
    l2.appendChild(el('span', null, '＋動態＋靜態：尚未取得'));
    append(legend, l0, l1, l2);
    box.appendChild(legend);

    sec.appendChild(box);
    showHint(panel);
    sec.appendChild(panel);
    return sec;
  }

  function svgEl(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) { if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]); }
    return n;
  }

  function niceMax(v) {
    if (!v || v <= 0) return 10;
    var exp = Math.pow(10, Math.floor(Math.log10(v)));
    var steps = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] * exp >= v) return steps[i] * exp;
    }
    return 10 * exp;
  }

  function segColor(i, n) {
    if (n <= 1) return 'var(--base-bar)';
    var t = i / (n - 1);
    return 'hsl(' + Math.round(38 + 10 * t) + ',' +
           Math.round(66 - 12 * t) + '%,' +
           Math.round(58 - 22 * t) + '%)';
  }

  function buildChart(s, bars, isLog, state, panel) {
    var W = 760, H = 320;
    var PL = 68, PR = 58, PT = 30, PB = 58;
    var plotW = W - PL - PR, plotH = H - PT - PB;

    var vals = bars.map(function (b) { return b.value || 0; });
    var maxVal = Math.max.apply(null, vals.concat([1]));

    var y, ticks;
    if (isLog) {
      var hiExp = Math.ceil(Math.log10(Math.max(maxVal, 10)));
      y = function (v) {
        var lv = Math.log10(Math.max(v, 1));
        return PT + plotH - (lv / hiExp) * plotH;
      };
      ticks = [];
      for (var e = 0; e <= hiExp; e++) ticks.push(Math.pow(10, e));
    } else {
      var top = niceMax(maxVal);
      y = function (v) { return PT + plotH - (v / top) * plotH; };
      ticks = [0, top * 0.25, top * 0.5, top * 0.75, top];
    }

    var svg = svgEl('svg', {
      'class': 'chart-svg',
      viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': '每一輪觀察到的 API 呼叫數' + (isLog ? '（對數刻度）' : '')
    });

    ticks.forEach(function (v, i) {
      var yy = y(v);
      svg.appendChild(svgEl('line', {
        'class': i === 0 ? 'axis-line' : 'grid-line',
        x1: PL, x2: PL + plotW, y1: yy, y2: yy
      }));
      var lbl = svgEl('text', { 'class': 'axis-text', x: PL - 8, y: yy + 4, 'text-anchor': 'end' });
      lbl.textContent = A.num(Math.round(v));
      svg.appendChild(lbl);
    });
    svg.appendChild(svgEl('line', { 'class': 'axis-line', x1: PL, x2: PL, y1: PT, y2: PT + plotH }));

    var yTitle = svgEl('text', {
      'class': 'axis-title' + (isLog ? ' is-log' : ''), x: 0, y: 0,
      transform: 'translate(15,' + (PT + plotH / 2) + ') rotate(-90)', 'text-anchor': 'middle'
    });
    yTitle.textContent = isLog ? 'API（對數刻度）' : 'API 呼叫數';
    svg.appendChild(yTitle);

    if (isLog) {
      var badge = svgEl('text', { 'class': 'axis-title is-log', x: PL, y: 14, 'text-anchor': 'start' });
      badge.textContent = '⚠ 縱軸為對數刻度';
      svg.appendChild(badge);
    }

    var xTitle = svgEl('text', {
      'class': 'axis-title', x: PL + plotW / 2, y: H - 6, 'text-anchor': 'middle'
    });
    xTitle.textContent = '基線 → mirage 迭代輪次 → ＋靜態（尚未取得）';
    svg.appendChild(xTitle);

    var band = plotW / bars.length;
    var barW = Math.min(76, band * 0.5);
    var base = y(0);

    bars.forEach(function (b, bi) {
      var cx = PL + band * bi + band / 2;
      var x0 = cx - barW / 2;

      var xl = svgEl('text', { 'class': 'axis-text', x: cx, y: PT + plotH + 19, 'text-anchor': 'middle' });
      xl.textContent = b.label;
      svg.appendChild(xl);
      var xs = svgEl('text', { 'class': 'axis-text sub', x: cx, y: PT + plotH + 33, 'text-anchor': 'middle' });
      xs.textContent = b.sub;
      svg.appendChild(xs);

      if (b.kind === 'ghost') {
        var gy = PT + plotH * 0.34;
        var gg = svgEl('g', {
          'class': 'seg ghost', tabindex: '0', role: 'button',
          'aria-label': '＋動態＋靜態，尚未取得'
        });
        gg.appendChild(svgEl('rect', { x: x0, y: gy, width: barW, height: base - gy, rx: 2 }));
        var q = svgEl('text', { x: cx, y: gy + (base - gy) / 2 + 6, 'text-anchor': 'middle' });
        q.textContent = '?';
        gg.appendChild(q);
        bind(gg, 'ghost', state, panel, pendingPanel);
        state.groups.push({ key: 'ghost', node: gg });
        svg.appendChild(gg);
        return;
      }

      if (b.kind === 'baseline' && !isLog && b.segments.length > 1) {
        // 線性刻度下才堆疊 —— 對數刻度上堆疊的高度沒有意義。
        var acc = 0;
        b.segments.forEach(function (seg, si) {
          if (!seg.n_apis) return;
          var yTop = y(acc + seg.n_apis), yBot = y(acc);
          acc += seg.n_apis;
          var g = svgEl('g', {
            'class': 'seg', tabindex: '0', role: 'button',
            'aria-label': '基線 ' + seg.label + '，' + seg.n_apis + ' 個 API'
          });
          g.appendChild(svgEl('rect', {
            x: x0, y: yTop, width: barW, height: Math.max(2, yBot - yTop),
            fill: seg.unattributed ? 'var(--pending)' : segColor(si, b.segments.length)
          }));
          bind(g, 'base', state, panel, function () { return baselinePanel(s, b); });
          state.groups.push({ key: 'base', node: g });
          svg.appendChild(g);
        });
      } else {
        var yTop2 = y(b.value);
        var g2 = svgEl('g', {
          'class': 'seg', tabindex: '0', role: 'button',
          'aria-label': b.label + '，' + A.num(b.value) + ' 個 API'
        });
        g2.appendChild(svgEl('rect', {
          x: x0, y: yTop2, width: barW, height: Math.max(2, base - yTop2),
          fill: b.kind === 'baseline' ? 'var(--base-bar)' : 'var(--dyn)'
        }));
        bind(g2, b.key, state, panel, function () {
          return b.kind === 'baseline' ? baselinePanel(s, b) : roundPanel(s, b.round);
        });
        state.groups.push({ key: b.key, node: g2 });
        svg.appendChild(g2);
      }

      var tot = svgEl('text', {
        'class': 'bar-label', x: cx, y: Math.max(PT + 10, y(b.value) - 7), 'text-anchor': 'middle'
      });
      tot.textContent = A.num(b.value);
      svg.appendChild(tot);

      // 增減標記畫在長條右側 —— 這是「這一輪多／少跑了多少」的直接答案。
      if (b.round && b.round.delta !== null && b.round.delta !== undefined) {
        var d = svgEl('text', {
          'class': 'delta-label ' + (b.round.delta >= 0 ? 'up' : 'down'),
          x: x0 + barW + 5, y: Math.max(PT + 22, y(b.value) + 6), 'text-anchor': 'start'
        });
        d.textContent = A.delta(b.round.delta);
        svg.appendChild(d);
      }
    });

    return svg;
  }

  function bind(node, key, state, panel, build) {
    function activate() { setActive(state, panel, key, build); }
    node.addEventListener('click', activate);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        activate();
      }
    });
  }

  function setActive(state, panel, key, build) {
    state.active = key;
    state.groups.forEach(function (g) {
      if (g.key === key) g.node.classList.add('is-active');
      else g.node.classList.remove('is-active');
    });
    state.buttons.forEach(function (b) {
      b.node.setAttribute('aria-pressed', b.key === key ? 'true' : 'false');
    });
    clear(panel);
    panel.classList.toggle('is-pending', key === 'ghost');
    panel.appendChild(build());
    if (panel.scrollIntoView) {
      // 只在面板已經被捲出視窗外時才拉回來，不要每次點都跳。
      var r = panel.getBoundingClientRect();
      if (r.top < 0 || r.top > (window.innerHeight || 800)) {
        panel.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  function barList(bars, state, panel) {
    var ul = el('ul', 'seg-list');
    bars.forEach(function (b) {
      var li = el('li');
      var btn = el('button', b.kind === 'ghost' ? 'ghost-btn' : null);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      var sw = el('span', 'swatch');
      if (b.kind === 'ghost') sw.style.border = '1px dashed var(--pending)';
      else if (b.kind === 'baseline') sw.style.background = 'var(--base-bar)';
      else sw.style.background = 'var(--dyn)';

      var right = b.kind === 'ghost' ? '尚未取得' : A.num(b.value) + ' API';
      if (b.round && b.round.delta !== null && b.round.delta !== undefined) {
        right += '　' + A.delta(b.round.delta);
      }
      append(btn, sw,
        el('span', 'seg-name', b.label + '　' + b.sub),
        el('span', 'seg-n', right));

      btn.addEventListener('click', function () {
        setActive(state, panel, b.key, function () {
          if (b.kind === 'ghost') return pendingPanel();
          if (b.kind === 'baseline') return baselinePanel(state.sample, b);
          return roundPanel(state.sample, b.round);
        });
      });
      state.buttons.push({ key: b.key, node: btn });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    return ul;
  }

  function showHint(panel) {
    clear(panel);
    panel.classList.remove('is-pending');
    var f = A.frag();
    f.appendChild(el('h3', null, '點長條圖上的任一根'));
    f.appendChild(el('p', 'dp-sub',
      '會在這裡展開：那一輪相對前一輪多了／少了哪些 API、' +
      'LLM 產出了什麼讓它能進到下一輪、以及那一輪的結局判定。'));
    panel.appendChild(f);
  }

  // -------------------------------------------------------------- 基線面板

  function baselinePanel(s, bar) {
    var sp = s.speakeasy;
    var v = A.verdictInfo(sp.verdict);
    var f = A.frag();
    f.appendChild(el('h3', null, '純 Speakeasy 基線'));
    f.appendChild(el('p', 'dp-sub',
      '沒有任何環境偽裝、沒有 LLM 介入　·　' + A.num(sp.apis_total) + ' 個 API　·　' +
      A.secs(sp.emulation_total_runtime)));

    var vr = el('div', 'pill-row');
    vr.style.marginBottom = '10px';
    vr.appendChild(pill('判定：' + v.label, v.kind || 'dyn'));
    f.appendChild(vr);
    if (v.why) f.appendChild(el('p', 'small muted', v.why));

    f.appendChild(el('h4', null, '依進入點分段'));
    var rows = (bar.segments || []).map(function (seg) { return seg; });
    f.appendChild(A.table([
      { label: '進入點', cls: 'm', get: function (r) { return r.label; } },
      { label: '位址', cls: 'm', get: function (r) { return r.start_addr; } },
      { label: 'API 數', cls: 'num', get: function (r) { return A.num(r.n_apis); } },
      { label: '結束狀態', get: function (r) {
          if (r.unattributed) return pill('未歸屬', 'warn');
          if (r.error && r.error.type) {
            return pill(r.error.type + (r.error.api_name ? '：' + r.error.api_name : ''), 'bad');
          }
          return pill('正常結束', 'ok');
        } }
    ], rows, null, '520px'));

    var tails = (bar.segments || []).filter(function (x) {
      return x.apis_tail && x.apis_tail.length;
    });
    if (tails.length) {
      var d = el('details');
      d.style.marginTop = '12px';
      d.appendChild(el('summary', 'small muted', '軌跡尾巴（每個進入點的最後數筆 API）'));
      tails.forEach(function (seg) {
        var w = el('div'); w.style.marginTop = '8px';
        w.appendChild(el('p', 'small faint', seg.label + '（本段共 ' + A.num(seg.n_apis) + ' 筆）'));
        var ol = el('ol', 'api-list');
        seg.apis_tail.forEach(function (api) { ol.appendChild(el('li', null, api)); });
        w.appendChild(ol);
        d.appendChild(w);
      });
      f.appendChild(d);
      f.appendChild(el('p', 'small faint',
        '註：基線只保留每個進入點的軌跡尾巴，不是完整呼叫序列 —— 完整序列留在分析 VM 裡。'));
    }
    return f;
  }

  // ------------------------------------------------------------ 單輪面板

  function apiChips(names, cls) {
    var ul = el('ul', 'tag-list ' + (cls || ''));
    names.forEach(function (n) { ul.appendChild(el('li', null, n)); });
    return ul;
  }

  function roundPanel(s, rd) {
    var dyn = s.dynamic;
    var f = A.frag();

    var rv = A.roundVerdictInfo(rd.verdict);
    var ri = A.reasonInfo(rd.reason);

    f.appendChild(el('h3', null, '第 ' + rd.round + ' 輪'));

    var sub = A.num(rd.n_apis) + ' 個 API 呼叫';
    if (rd.delta !== null && rd.delta !== undefined) {
      sub += '（相對上一輪 ' + A.delta(rd.delta) + '）';
    }
    f.appendChild(el('p', 'dp-sub', sub));

    var pr = el('div', 'pill-row');
    pr.style.marginBottom = '12px';
    pr.appendChild(pill('判定：' + rv.label + '（' + rd.verdict + '）', rv.kind || 'dyn'));
    pr.appendChild(pill('理由：' + ri.label, ri.kind || 'dyn'));
    if (rd.nudged) pr.appendChild(pill('被推了一把', 'warn'));
    if (rd.self_abort) pr.appendChild(pill('樣本自己中止', 'warn'));
    if (rd.payload_seen) pr.appendChild(pill('看到 payload', 'ok'));
    f.appendChild(pr);

    // ---- 誠實旗標。放在最前面，不放在角落。
    (rd.warnings || []).forEach(function (w) {
      var n = el('div', 'note ' + (w.kind === 'bad' ? 'bad' : 'warn'));
      n.style.marginBottom = '10px';
      n.appendChild(el('p', null, w.text));
      f.appendChild(n);
    });

    // ---- 這一輪相對前一輪的 API 變化
    f.appendChild(el('h4', null, '① 相對前一輪，API 名單的變化'));
    if (rd.round === 1) {
      f.appendChild(el('p', 'small faint',
        '這是第一輪，沒有前一輪可以比。下面是這一輪外圈碰到的完整名單。'));
    }
    var diff = el('div', 'diff-grid');

    var addBox = el('div', 'diff-col add');
    addBox.appendChild(el('h5', null, '新增（' + rd.api_added.length + '）'));
    if (rd.api_added.length) addBox.appendChild(apiChips(rd.api_added, 'add'));
    else addBox.appendChild(el('p', 'small faint', rd.round === 1 ? '—' : '沒有新的 API 進來。'));
    diff.appendChild(addBox);

    var remBox = el('div', 'diff-col rem');
    remBox.appendChild(el('h5', null, '消失（' + rd.api_removed.length + '）'));
    if (rd.api_removed.length) remBox.appendChild(apiChips(rd.api_removed, 'rem'));
    else remBox.appendChild(el('p', 'small faint', rd.round === 1 ? '—' : '沒有 API 消失。'));
    diff.appendChild(remBox);

    f.appendChild(diff);

    var scopeDet = el('details');
    scopeDet.style.marginTop = '10px';
    scopeDet.appendChild(el('summary', 'small muted',
      '這一輪外圈碰到的完整 API 名單（' + rd.api_scope.length + '）'));
    var sw = el('div'); sw.style.marginTop = '8px';
    sw.appendChild(A.table([
      { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
      { label: '為什麼在名單裡', get: function (r) {
          var row = el('span', 'pill-row');
          r.sources.forEach(function (c) { row.appendChild(pill(A.scopeSourceLabel(c), 'dyn')); });
          return row;
        } }
    ], rd.api_scope, null, '460px'));
    scopeDet.appendChild(sw);
    f.appendChild(scopeDet);

    var caveat = el('div', 'note warn');
    caveat.style.marginTop = '10px';
    caveat.appendChild(el('p', 'small', (dyn.notes && dyn.notes.scope_caveat) || ''));
    f.appendChild(caveat);

    // ---- LLM 這一輪產出了什麼
    f.appendChild(el('h4', null, '② LLM 這一輪產出了什麼，讓它能進到下一輪'));
    var produced = false;

    if (rd.profile_changed.length) {
      produced = true;
      var pcw = el('div', 'subsec');
      pcw.appendChild(el('h5', null, '環境剖繪的修改（這些值是我們編的）'));
      pcw.appendChild(A.table([
        { label: '欄位', cls: 'm', get: function (r) { return r.key; } },
        { label: '改成', cls: 'm wrap-any', get: function (r) { return r.value; } }
      ], rd.profile_changed, null, '340px'));
      f.appendChild(pcw);
    }

    if (rd.add_watchlist.length || rd.seeded_watchlist.length) {
      produced = true;
      var wl = el('div', 'subsec');
      wl.appendChild(el('h5', null, '加進攔截清單的 API'));
      if (rd.add_watchlist.length) {
        wl.appendChild(el('p', 'small muted', 'LLM 要求接管（' + rd.add_watchlist.length + '）：'));
        wl.appendChild(apiChips(rd.add_watchlist, 'add'));
      }
      if (rd.seeded_watchlist.length) {
        wl.appendChild(el('p', 'small muted',
          '規則塞的、不是模型要的（' + rd.seeded_watchlist.length + '）：'));
        wl.appendChild(apiChips(rd.seeded_watchlist, 'warn'));
      }
      f.appendChild(wl);
    }

    if (rd.api_signatures.length) {
      produced = true;
      var sg = el('div', 'subsec');
      sg.appendChild(el('h5', null, '由誰決定未實作 API 的參數個數'));
      sg.appendChild(A.table([
        { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
        { label: 'argc', cls: 'num', get: function (r) { return r.argc; } },
        { label: '慣例', cls: 'm', get: function (r) { return r.conv; } },
        { label: '來源', get: function (r) {
            return r.source === 'llm' ? pill('LLM 宣告', 'bad') : pill(r.source || '—');
          } }
      ], rd.api_signatures, '來源是 llm 代表這個數字沒有權威來源可以對照。', '420px'));
      f.appendChild(sg);
    }

    if (rd.synth_fills.length) {
      produced = true;
      var sf = el('div', 'subsec');
      sf.appendChild(el('h5', null, '合成的回傳值（模擬器沒實作，值是編的）'));
      sf.appendChild(A.table([
        { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
        { label: '呼叫次數', cls: 'num', get: function (r) { return A.num(r.calls); } },
        { label: '有寫輸出參數', cls: 'num', get: function (r) { return A.num(r.calls_with_writes); } },
        { label: '提出/採用', cls: 'num', get: function (r) {
            return A.num(r.proposed) + ' / ' + A.num(r.applied); } }
      ], rd.synth_fills, null, '440px'));
      f.appendChild(sf);
    }

    if (rd.callconv_fixes.length || rd.data_imports.length) {
      produced = true;
      var fx = el('div', 'subsec');
      fx.appendChild(el('h5', null, '模擬器宣告被改掉的地方'));
      if (rd.callconv_fixes.length) {
        fx.appendChild(A.table([
          { label: '被改對呼叫慣例的 handler', cls: 'm wrap-any', get: function (r) { return r.api; } },
          { label: 'argc', cls: 'num', get: function (r) { return r.argc; } }
        ], rd.callconv_fixes, null, '360px'));
      }
      if (rd.data_imports.length) {
        var dw = el('div'); dw.style.marginTop = '8px';
        dw.appendChild(A.table([
          { label: '被匯入的其實是變數', cls: 'm wrap-any', get: function (r) { return r.symbol; } },
          { label: '寬度', cls: 'num', get: function (r) { return r.width; } },
          { label: '我們給的值', cls: 'num', get: function (r) { return r.val_int; } }
        ], rd.data_imports, '這一格的值是我們給的 —— 這就是 inconclusive 的來源之一。', '400px'));
        fx.appendChild(dw);
      }
      f.appendChild(fx);
    }

    if (!produced) {
      f.appendChild(el('p', 'small faint',
        '這一輪 LLM 沒有產出任何會改變下一輪的東西（' +
        A.num(rd.llm_calls) + ' 次呼叫）。'));
    }

    // ---- 結局
    f.appendChild(el('h4', null, '③ 這一輪的結局'));
    var end = el('div', 'note ' + (ri.kind === 'ok' ? 'dyn' : (ri.kind || 'warn')));
    end.appendChild(el('p', null, ri.label + ' —— ' + (ri.why || '')));
    if (rd.stop && rd.stop.type) {
      var line = '模擬中止於：' + rd.stop.type;
      if (rd.stop.pc) line += '　pc=' + rd.stop.pc;
      if (rd.stop.instr) line += '　instr=' + rd.stop.instr;
      end.appendChild(el('p', 'small mono', line));
    } else {
      end.appendChild(el('p', 'small faint',
        '這一輪沒有崩潰紀錄（stop 是空的）—— 但那不等於「跑完了」，見上面的旗標。'));
    }
    f.appendChild(end);

    var stats = el('div', 'subsec');
    stats.style.marginTop = '12px';
    stats.appendChild(A.kv([
      ['LLM 呼叫次數', A.num(rd.llm_calls)],
      ['LLM 花的時間', A.secs(rd.llm_seconds)],
      ['純模擬時間', A.secs(rd.emu_seconds)],
      ['這一輪跑了幾次 run', A.num(rd.entry_points.length)],
      ['無效記憶體存取', A.num(rd.n_faults) + ' 筆（清單已截斷）'],
      ['堆疊位移檢查', A.num(rd.stack_checked) + ' 次，不明 ' + A.num(rd.stack_unknown) +
        '，對不上 ' + A.num(rd.n_stack_mismatch)]
    ]));
    if (rd.entry_points.length) {
      stats.appendChild(A.table([
        { label: '型別', cls: 'm', get: function (r) { return r.ep_type; } },
        { label: '起點', cls: 'm', get: function (r) { return r.start_addr; } },
        { label: 'API 數', cls: 'num', get: function (r) { return A.num(r.n_apis); } },
        { label: '結局', get: function (r) {
            return r.error ? pill(r.error, 'bad') : pill('正常結束', 'ok');
          } }
      ], rd.entry_points, null, '460px'));
    }
    f.appendChild(stats);

    if (rd.dynamic_code.length) {
      var dc = el('div', 'subsec');
      dc.appendChild(el('h5', null, '執行期產生的程式碼區段'));
      dc.appendChild(A.table([
        { label: '標記', cls: 'm wrap-any', get: function (r) { return r.tag; } },
        { label: 'base', cls: 'm', get: function (r) { return r.base; } },
        { label: '大小', cls: 'm', get: function (r) { return r.size; } },
        { label: '含我方位元組', get: function (r) {
            return r.ours ? pill('是', 'bad') : el('span', 'faint', '否');
          } }
      ], rd.dynamic_code,
        '這裡不放區段內容 —— 那是樣本（或我方罐頭資料）的位元組。', '420px'));
      f.appendChild(dc);
    }

    // ---- LLM 診斷。不可信文字，用 textContent 輸出。
    if (rd.llm_diagnosis) {
      var dg = el('div', 'llm-quote');
      dg.appendChild(el('h5', null, 'LLM 的診斷（未經驗證）'));
      dg.appendChild(el('p', null, rd.llm_diagnosis));
      dg.appendChild(el('p', 'small faint',
        '這段是模型的輸出，不是量測結果。它讀的是同一份軌跡，所以它也會被同樣的儀器缺陷騙到 —— ' +
        '本站呈現它，但不當成結論。' +
        '文中的〔引文已移除〕/〔檔名已移除〕是本站的過濾：模型會複述樣本的字串' +
        '（檔名、錯誤訊息、使用者名稱），那些是樣本內容，不出境。'));
      f.appendChild(dg);
    }

    return f;
  }

  function pendingPanel() {
    var f = A.frag();
    f.appendChild(el('h3', null, '＋動態＋靜態 —— 尚未取得'));
    f.appendChild(el('p', 'dp-sub', '第三組對照：把靜態分析報告餵給動態端當起始條件'));
    var box = el('div', 'pending-box');
    box.appendChild(el('p', null,
      '這一組還沒有跑過，所以網站上沒有它的數字 —— 也不會有估計值。'));
    box.appendChild(el('p', 'small',
      '要問的問題是：先給動態端一份靜態情報（反分析檢測點清單、模擬預算建議、' +
      '「主要邏輯可能不在 entry point」這類註記），能不能少走幾輪冤枉路。' +
      '靜態報告本身在這一頁下面已經有了，缺的是「把它接上去之後的結果」。'));
    f.appendChild(box);
    return f;
  }

  // ------------------------------------------------- mirage 這一次執行的全貌

  function mirageSection(s) {
    var dyn = s.dynamic || {};
    var sec = el('section', 'section dyn');
    var h = el('h2', null, 'mirage 這一次執行');
    h.appendChild(el('span', 'h2-note', dyn.available ? ('run ' + dyn.run) : '無資料'));
    sec.appendChild(h);

    if (!dyn.available) {
      sec.appendChild(el('div', 'pending-box', '這支樣本沒有 mirage 執行紀錄。'));
      return sec;
    }

    var oc = dyn.outcome;
    var ov = A.outcomeVerdictInfo(oc.verdict);
    var ri = A.reasonInfo(oc.reason);

    var s0 = el('div', 'subsec');
    s0.appendChild(A.kv([
      ['run', dyn.run],
      ['產生時間', dyn.generated],
      ['總判定', pill(ov.label + '（' + oc.verdict + '）', ov.kind || 'dyn')],
      ['收場理由', pill(ri.label + '（' + oc.reason + '）', ri.kind || 'dyn')],
      ['success', pill(String(oc.success), oc.success ? 'ok' : 'bad')],
      ['assisted', pill(String(oc.assisted), oc.assisted ? 'bad' : 'ok')],
      ['inconclusive', pill(String(oc.inconclusive), oc.inconclusive ? 'bad' : 'ok')],
      ['輪數', A.num(oc.iterations)],
      ['LLM 端點失敗次數', A.num(oc.n_llm_failures)],
      ['計畫解析錯誤', A.num(oc.n_plan_errors)]
    ]));
    sec.appendChild(s0);

    if (ri.why) {
      var wbox = el('div', 'note ' + (ri.kind || 'warn'));
      wbox.style.marginBottom = '18px';
      wbox.appendChild(el('p', null, ri.why));
      sec.appendChild(wbox);
    }

    if (oc.synthesized_apis.length) {
      var sy = el('div', 'subsec');
      sy.appendChild(el('h3', null, '整場合成過的 API（值是編的，無法驗證）'));
      sy.appendChild(A.tagList(oc.synthesized_apis));
      sec.appendChild(sy);
    }

    var pf = el('div', 'subsec');
    pf.appendChild(el('h3', null, '最終環境身分（這些是我們編的，不是樣本的）'));
    pf.appendChild(A.kv(dyn.final_profile.map(function (p) { return [p.key, p.value]; })));
    sec.appendChild(pf);

    if (dyn.final_watchlist.length) {
      var wl = el('div', 'subsec');
      wl.appendChild(el('h3', null, '最終攔截清單（' + dyn.final_watchlist.length + '）'));
      wl.appendChild(A.tagList(dyn.final_watchlist));
      sec.appendChild(wl);
    }

    var hz = dyn.harness;
    if (hz.answered_by_emulator.length || hz.blind_spots.length || hz.refused_to_llm.length) {
      var hs = el('div', 'subsec');
      hs.appendChild(el('h3', null, '誰回答了什麼'));
      if (hz.answered_by_emulator.length) {
        hs.appendChild(el('p', 'small muted', '由模擬器自己的實作回答（不是合成值）：'));
        hs.appendChild(A.tagList(hz.answered_by_emulator));
      }
      if (hz.blind_spots.length) {
        var bw = el('div'); bw.style.marginTop = '10px';
        bw.appendChild(el('p', 'small muted', '已知盲點（模擬器宣稱成功但沒填輸出參數）：'));
        bw.appendChild(A.table([
          { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
          { label: '沒填的欄位', cls: 'm wrap-any', get: function (r) { return r.field; } }
        ], hz.blind_spots, null, '380px'));
        hs.appendChild(bw);
      }
      if (hz.refused_to_llm.length) {
        var rw = el('div'); rw.style.marginTop = '10px';
        rw.appendChild(el('p', 'small muted', '拒絕交給 LLM 接管的（deny 清單）：'));
        rw.appendChild(A.tagList(hz.refused_to_llm));
        hs.appendChild(rw);
      }
      sec.appendChild(hs);
    }

    if (dyn.injections.length) {
      var ij = el('div', 'subsec');
      ij.appendChild(el('h3', null, '我方餵給樣本的罐頭內容'));
      ij.appendChild(A.table([
        { label: '經由哪個 API', cls: 'm wrap-any', get: function (r) { return r.api; } },
        { label: '大小', cls: 'num', get: function (r) { return A.bytes(r.size); } }
      ], dyn.injections,
        '內容本身不出境。⚠️ 樣本後續對這些位元組做的事，不能當成它對真 payload 的行為。',
        '360px'));
      sec.appendChild(ij);
    }

    var ft = dyn.final_trace;
    if (ft && ft.available) {
      var tr = el('div', 'subsec');
      tr.appendChild(el('h3', null,
        '最後一輪的 API 軌跡（' + A.num(ft.distinct) + ' 種相異）'));
      if (ft.capped) {
        var cap = el('div', 'note warn');
        cap.style.marginBottom = '10px';
        cap.appendChild(el('p', 'small',
          '⚠️ 軌跡被截斷了：那一輪共 ' + A.num(ft.round_n_apis) + ' 次呼叫，' +
          '報告只留下前 ' + A.num(ft.recorded) + ' 筆。下面的次數是就這 ' +
          A.num(ft.recorded) + ' 筆算的，不是全量。'));
        tr.appendChild(cap);
      }
      tr.appendChild(A.table([
        { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
        { label: '次數', cls: 'num', get: function (r) { return A.num(r.count); } }
      ], ft.top, '只有最後一輪留有完整軌跡 —— 前面幾輪的完整序列沒有留存。', '380px'));
      sec.appendChild(tr);
    }

    if (dyn.other_runs.length) {
      var or = el('div', 'subsec');
      or.appendChild(el('h3', null, '同一支樣本的其他執行（' + dyn.other_runs.length + '）'));
      or.appendChild(A.table([
        { label: 'run', cls: 'm', get: function (r) { return r.run; } },
        { label: '輪數', cls: 'num', get: function (r) { return r.rounds; } },
        { label: '每輪 API', cls: 'm', get: function (r) {
            return r.apis.map(function (x) { return A.num(x); }).join(' → '); } },
        { label: '判定', cls: 'm', get: function (r) { return r.verdict + ' / ' + r.reason; } },
        { label: 'success', get: function (r) {
            return pill(String(r.success), r.success ? 'ok' : 'bad'); } }
      ], dyn.other_runs,
        '上面的圖表用的是「輪數最多」那一份（同輪數取最新）。' +
        '這些是同一支樣本的其他執行，參數不同 —— 列出來是因為「重跑會得到不同數字」本身就是結果。',
        '620px'));
      sec.appendChild(or);
    }

    return sec;
  }

  // ------------------------------------------------------- Speakeasy 區塊

  function speakeasySection(s) {
    var sp = s.speakeasy;
    var v = A.verdictInfo(sp.verdict);
    var sec = el('section', 'section dyn');
    var h = el('h2', null, 'Speakeasy 執行結果');
    h.appendChild(el('span', 'h2-note', '動態端 · 基線'));
    sec.appendChild(h);

    var sub = el('div', 'subsec');
    sub.appendChild(A.kv([
      ['判定', pill(v.label + '（' + sp.verdict + '）', v.kind || 'dyn')],
      ['判定的意思', el('span', null, v.why), 'plain'],
      ['API 呼叫總數', A.num(sp.apis_total)],
      ['模擬耗時', A.secs(sp.emulation_total_runtime)],
      ['實際牆鐘時間', A.secs(sp.wall_seconds)],
      ['時間上限', sp.timeout ? sp.timeout + ' s' : '—'],
      ['進入點模式', sp.all_entrypoints ? '全部匯出函式' : (sp.dllmain_only ? '只跑 DllMain' : '模組進入點')]
    ]));
    sec.appendChild(sub);

    if (sp.detail && sp.detail.type) {
      var d = el('div', 'note bad');
      d.style.marginBottom = '18px';
      d.appendChild(el('h4', null, '中止細節'));
      var rows = [['type', sp.detail.type]];
      if (sp.detail.api_name) rows.push(['api_name', sp.detail.api_name]);
      if (sp.detail.pc) rows.push(['pc', sp.detail.pc]);
      if (sp.detail.address) rows.push(['address', sp.detail.address]);
      d.appendChild(A.kv(rows));
      sec.appendChild(d);
    }

    if (sp.variant) {
      var vb = el('div', 'note dyn');
      vb.style.marginBottom = '18px';
      vb.appendChild(el('h4', null, '同一支樣本的另一種跑法'));
      vb.appendChild(el('p', null, sp.variant.note));
      vb.appendChild(el('p', 'small faint',
        '只跑 DllMain 模擬耗時 ' + A.secs(sp.variant.emulation_total_runtime) +
        '，跑全部匯出函式 ' + A.secs(sp.emulation_total_runtime) + '。' +
        '差別不在時間，在於 DLL 的實際功能往往不放在 DllMain 裡 —— ' +
        '只跑 DllMain 會漏掉將近三分之二的行為。'));
      sec.appendChild(vb);
    }

    var ep = el('div', 'subsec');
    ep.appendChild(el('h3', null, '進入點'));
    ep.appendChild(A.table([
      { label: '進入點', cls: 'm', get: function (r) { return r.ep_type; } },
      { label: '位址', cls: 'm', get: function (r) { return r.start_addr; } },
      { label: 'API 數', cls: 'num', get: function (r) { return A.num(r.n_apis); } },
      { label: '結束狀態', get: function (r) {
          if (r.error && r.error.type) {
            var t = r.error.type + (r.error.api_name ? '：' + r.error.api_name : '');
            return pill(t, 'bad');
          }
          return pill('正常結束', 'ok');
        } }
    ], sp.entry_points, null, '520px'));
    sec.appendChild(ep);

    return sec;
  }

  // --------------------------------------------------------- 靜態分析區塊

  function staticSection(s) {
    var st = s.static;
    var sec = el('section', 'section sta');
    var h = el('h2', null, '靜態分析結果');
    h.appendChild(el('span', 'h2-note', '靜態端 · schema ' + A.dash(st.schema_version)));
    sec.appendChild(h);

    if (!st.available) {
      sec.appendChild(el('div', 'pending-box', '這支樣本沒有對應的靜態分析報告。'));
      return sec;
    }

    // --- 加殼與編譯器
    var s0 = el('div', 'subsec');
    s0.appendChild(el('h3', null, '檔案特徵'));
    var packedNode = st.is_packed.value ? pill('是', 'warn') : el('span', 'faint', '否');
    s0.appendChild(A.kv([
      ['架構', st.arch],
      ['型態', st.is_dll ? 'DLL' : 'EXE'],
      ['.NET', A.yesno(st.is_dotnet)],
      ['加殼', packedNode],
      ['編譯器', st.diec.compiler || '—'],
      ['Linker', st.diec.linker || '—'],
      ['殼／保護器', (st.diec.packers.concat(st.diec.protectors).join('、')) || '—']
    ]));
    if (st.is_packed.evidence.length) {
      var ev = el('div', 'note warn');
      ev.style.marginTop = '12px';
      ev.appendChild(el('h4', null, '判定依據'));
      var ul = el('ul', 'tight small');
      st.is_packed.evidence.forEach(function (e) { ul.appendChild(el('li', null, e)); });
      ev.appendChild(ul);
      s0.appendChild(ev);
    }
    sec.appendChild(s0);

    // --- 檢測點
    var s1 = el('div', 'subsec');
    var h1 = el('h3', null, '反分析檢測點（' + st.suspected_anti_analysis.length + '）');
    s1.appendChild(h1);
    if (st.suspected_anti_analysis.length) {
      s1.appendChild(A.table([
        { label: 'API', cls: 'm wrap-any', get: function (r) { return r.api; } },
        { label: '分類', get: function (r) {
            var row = el('span', 'pill-row');
            r.categories.forEach(function (c) {
              row.appendChild(pill(A.categoryLabel(c) + ' · ' + c, 'sta'));
            });
            return row;
          } },
        { label: '來源', cls: 'm', get: function (r) { return r.source; } }
      ], st.suspected_anti_analysis, null, '540px'));
    } else {
      s1.appendChild(el('p', 'faint small', '沒有檢測點。'));
    }
    sec.appendChild(s1);

    // --- 行為分類
    var s2 = el('div', 'subsec');
    s2.appendChild(el('h3', null, '行為分類（' + st.categories_present.length + '）'));
    var catRow = el('div', 'pill-row');
    st.categories_present.forEach(function (c) {
      catRow.appendChild(pill(A.categoryLabel(c) + '　' + c, 'sta'));
    });
    s2.appendChild(st.categories_present.length ? catRow : el('p', 'faint small', '無。'));
    sec.appendChild(s2);

    // --- capa
    var s3 = el('div', 'subsec');
    s3.appendChild(el('h3', null, 'capa 能力（' + st.capabilities.length + '）'));
    s3.appendChild(st.capabilities.length
      ? A.tagList(st.capabilities, 'sta')
      : el('p', 'faint small', '沒有命中任何 capa 規則。'));
    if (st.attack_techniques.length) {
      var det = el('details');
      det.style.marginTop = '10px';
      det.appendChild(el('summary', 'small muted',
        'ATT&CK 對應（' + st.attack_techniques.length + ' 項）'));
      var box = el('div'); box.style.marginTop = '8px';
      box.appendChild(A.tagList(st.attack_techniques, 'sta'));
      det.appendChild(box);
      s3.appendChild(det);
    }
    sec.appendChild(s3);

    // --- YARA
    var s4 = el('div', 'subsec');
    s4.appendChild(el('h3', null, 'YARA 命中（' + st.yara.length + '）'));
    if (st.yara.length) {
      s4.appendChild(A.table([
        { label: '規則', cls: 'm', get: function (r) { return r.rule; } },
        { label: '命中字串條數', cls: 'num', get: function (r) { return A.num(r.n_strings); } }
      ], st.yara, '命中的字串內容來自樣本位元組，本站只收錄規則名與條數。', '380px'));
    } else {
      s4.appendChild(el('p', 'faint small', '沒有規則命中。'));
    }
    sec.appendChild(s4);

    // --- C2
    var s5 = el('div', 'subsec');
    var nb = st.c2.filter(function (c) { return !c.benign; }).length;
    s5.appendChild(el('h3', null, 'C2 候選（' + st.c2.length + '，其中非 benign ' + nb + '）'));
    if (st.c2.length) {
      s5.appendChild(A.table([
        { label: '類型', get: function (r) { return r.type; } },
        { label: '值（defanged）', cls: 'm wrap-any', get: function (r) { return r.defanged; } },
        { label: '判定', get: function (r) {
            return r.benign ? pill('已知良性', 'ok') : pill('待查', 'bad');
          } },
        { label: '來源', cls: 'm', get: function (r) { return r.source; } }
      ], st.c2,
        '一律以 defanged 形式呈現（hxxp:// 與 [.]）。source=decoded 代表這一筆是解密後才出現的，' +
        '原始檔案裡搜不到明文。', '520px'));
    } else {
      s5.appendChild(el('p', 'faint small', '沒有抽到 C2 候選。'));
    }
    if (st.lab_networks.length) {
      s5.appendChild(el('p', 'small faint', '實驗室網段：' + st.lab_networks.join('、')));
    }
    sec.appendChild(s5);

    // --- 建議預算
    var s6 = el('div', 'subsec');
    s6.appendChild(el('h3', null, '給動態端的建議'));
    var bud = el('div', 'note sta');
    bud.appendChild(el('p', null, '建議模擬預算：' +
      (st.budget.seconds ? st.budget.seconds + ' 秒' : '未給')));
    if (st.budget.reasons.length) {
      var bl = el('ul', 'tight small');
      st.budget.reasons.forEach(function (r) { bl.appendChild(el('li', null, r)); });
      bud.appendChild(bl);
    }
    s6.appendChild(bud);
    if (st.analysis_notes.length) {
      var an = el('div', 'note warn');
      an.style.marginTop = '10px';
      an.appendChild(el('h4', null, '分析註記'));
      var al = el('ul', 'tight small');
      st.analysis_notes.forEach(function (r) { al.appendChild(el('li', null, r)); });
      an.appendChild(al);
      s6.appendChild(an);
    }
    sec.appendChild(s6);

    // --- PE
    if (st.pe) sec.appendChild(peBlock(st));

    return sec;
  }

  function peBlock(st) {
    var pe = st.pe;
    var sub = el('div', 'subsec');
    sub.appendChild(el('h3', null, 'PE 結構'));
    sub.appendChild(A.kv([
      ['進入點', '0x' + (pe.entry_point || 0).toString(16)],
      ['image base', '0x' + (pe.image_base || 0).toString(16)],
      ['subsystem', pe.subsystem_name],
      ['編譯時間', pe.timestamp_utc + (pe.timestamp_suspicious ? '（可疑）' : '')],
      ['整檔 entropy', pe.file_entropy],
      ['匯入 DLL / API', A.num(pe.dll_count) + ' / ' + A.num(pe.import_count)],
      ['數位簽章', A.yesno(pe.has_signature, '有', '無')],
      ['TLS callback', pe.tls_callbacks.length ? pe.tls_callbacks.join('、') : '無'],
      ['overlay', pe.overlay
        ? A.bytes(pe.overlay.size) + '（offset ' + pe.overlay.offset + '，entropy ' + pe.overlay.entropy + '）'
        : '無']
    ]));

    if (pe.sections && pe.sections.length) {
      var d1 = el('details');
      d1.style.marginTop = '12px';
      d1.appendChild(el('summary', 'small muted', '區段（' + pe.sections.length + '）'));
      var w1 = el('div'); w1.style.marginTop = '8px';
      w1.appendChild(A.table([
        { label: '名稱', cls: 'm', get: function (r) { return r.name; } },
        { label: 'raw', cls: 'num', get: function (r) { return A.num(r.raw_size); } },
        { label: 'virtual', cls: 'num', get: function (r) { return A.num(r.virtual_size); } },
        { label: 'entropy', cls: 'num', get: function (r) { return r.entropy; } },
        { label: '權限', cls: 'm', get: function (r) {
            return (r.readable ? 'R' : '-') + (r.writable ? 'W' : '-') + (r.executable ? 'X' : '-');
          } }
      ], pe.sections, null, '460px'));
      d1.appendChild(w1);
      sub.appendChild(d1);
    }

    if (pe.resources && pe.resources.length) {
      var d3 = el('details');
      d3.style.marginTop = '8px';
      d3.appendChild(el('summary', 'small muted', 'resource（' + pe.resources.length + '）'));
      var w3 = el('div'); w3.style.marginTop = '8px';
      w3.appendChild(A.table([
        { label: '型別', cls: 'm', get: function (r) { return r.type; } },
        { label: 'id', cls: 'num', get: function (r) { return r.id; } },
        { label: '大小', cls: 'num', get: function (r) { return A.bytes(r.size); } },
        { label: 'entropy', cls: 'num', get: function (r) { return r.entropy; } }
      ], pe.resources, null, '360px'));
      d3.appendChild(w3);
      sub.appendChild(d3);
    }

    if (pe.imports && pe.imports.length) {
      var d2 = el('details');
      d2.style.marginTop = '8px';
      d2.appendChild(el('summary', 'small muted', '匯入表（' + pe.imports.length + '）'));
      var w2 = el('div'); w2.style.marginTop = '8px';
      w2.appendChild(A.tagList(pe.imports));
      d2.appendChild(w2);
      sub.appendChild(d2);
    }

    if (pe.exports && pe.exports.length) {
      var d4 = el('details');
      d4.style.marginTop = '8px';
      d4.appendChild(el('summary', 'small muted', '匯出表（' + pe.exports.length + '）'));
      var w4 = el('div'); w4.style.marginTop = '8px';
      w4.appendChild(A.tagList(pe.exports));
      d4.appendChild(w4);
      sub.appendChild(d4);
    }

    return sub;
  }

  // ------------------------------------------------------------- 流程圖

  var MARKS = { ok: '✓', 'n/a': '—', skipped: '⊘', fail: '✗' };
  var MARK_WORDS = { ok: '完成', 'n/a': '不適用', skipped: '跳過', fail: '失敗' };

  function flowSection(s) {
    var st = s.static;
    var sec = el('section', 'section sta');
    var h = el('h2', null, '這一次實際跑過的流程');
    h.appendChild(el('span', 'h2-note', '從 tools[*].status 反推'));
    sec.appendChild(h);

    if (!st.available || !st.pipeline || !st.pipeline.length) {
      sec.appendChild(el('div', 'pending-box', '沒有工具狀態資料。'));
      return sec;
    }

    sec.appendChild(el('p', 'lede small',
      '這不是設計圖，是這一次真的發生的事：每一格的狀態直接讀報告的 tools 區塊。' +
      '跳過與不適用都畫出來 —— 一條「看起來都跑完了」的流程圖是沒有資訊量的。'));

    var flow = el('div', 'flow');
    flow.appendChild(el('div', 'flow-cap',
      '樣本（' + A.bytes(s.summary.size) + '，未執行，僅靜態解析）'));

    st.pipeline.forEach(function (step) {
      flow.appendChild(el('div', 'flow-arrow'));
      var node = el('div', 'flow-node is-' + step.mark.replace('/', ''));
      var mark = el('div', 'fn-mark', MARKS[step.mark] || '?');
      mark.title = MARK_WORDS[step.mark] || step.status;
      mark.setAttribute('aria-label', MARK_WORDS[step.mark] || step.status);
      node.appendChild(mark);
      node.appendChild(el('div', 'fn-label', step.label));

      var detail = el('div', 'fn-detail');
      detail.appendChild(el('span', null,
        step.detail || (step.mark === 'n/a' ? '（不適用）' : MARK_WORDS[step.mark] || step.status)));
      if (step.seconds) {
        detail.appendChild(el('span', 'fn-secs', '　' + step.seconds + ' s'));
      }
      node.appendChild(detail);

      if (step.message && step.mark !== 'ok') {
        node.appendChild(el('div', 'fn-msg', step.message));
      }
      flow.appendChild(node);
    });

    flow.appendChild(el('div', 'flow-arrow'));
    flow.appendChild(el('div', 'flow-cap',
      '報告（schema ' + A.dash(st.schema_version) + '，content_sha256 ' +
      A.dash(st.meta.content_sha256) + '）'));
    sec.appendChild(flow);

    var extra = [];
    if (st.ghidra && st.ghidra.function_count) {
      extra.push('Ghidra 共辨識 ' + A.num(st.ghidra.function_count) + ' 個函式，' +
        '其中 ' + A.num((st.ghidra.stats || {}).candidate_functions || 0) + ' 個進入候選、' +
        A.num((st.ghidra.stats || {}).emitted || 0) + ' 個實際反編譯' +
        '（反編譯出的程式碼沒有收錄在本站）。');
    }
    var fc = st.floss_counts || {};
    var fkeys = Object.keys(fc);
    if (fkeys.length) {
      extra.push('字串抽取的計數：' + fkeys.map(function (k) {
        return k + ' ' + A.num(fc[k]);
      }).join('、') + '（只有數量，字串內容沒有收錄）。');
    }
    if (st.pyinstaller && st.pyinstaller.detected) {
      extra.push('PyInstaller：Python ' + (st.pyinstaller.python_version || '版本不明') +
        '，' + A.num(st.pyinstaller.entry_count) + ' 個項目' +
        (st.pyinstaller.obfuscator ? '，另有 ' + st.pyinstaller.obfuscator + ' 混淆' : '') + '。');
    }
    if (st.meta.elapsed_seconds) {
      extra.push('這一支的靜態分析總耗時 ' + A.secs(st.meta.elapsed_seconds) +
        '（gatherer ' + A.dash(st.meta.gatherer_version) + '，指紋 ' +
        A.dash(st.meta.gatherer_sha256) + '）。');
    }
    if (extra.length) {
      var note = el('div', 'note');
      note.style.marginTop = '14px';
      extra.forEach(function (t) { note.appendChild(el('p', 'small', t)); });
      sec.appendChild(note);
    }

    return sec;
  }
})();
