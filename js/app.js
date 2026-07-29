/* app.js —— 共用：資料載入 + DOM 小工具
 *
 * 沒有框架、沒有 CDN。所有來自資料的文字一律用 textContent 寫進 DOM，
 * 不用 innerHTML —— 樣本可以控制匯入表、區段名稱這類欄位的內容。
 */
(function (global) {
  'use strict';

  // ------------------------------------------------------------ DOM 小工具

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null && text !== '') node.textContent = String(text);
    return node;
  }

  function frag() { return document.createDocumentFragment(); }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  function append(parent) {
    for (var i = 1; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined || child === false) continue;
      parent.appendChild(child);
    }
    return parent;
  }

  function pill(text, kind) {
    return el('span', 'pill' + (kind ? ' ' + kind : ''), text);
  }

  // ------------------------------------------------------------ 格式化

  function num(v) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return Number(v).toLocaleString('en-US');
  }

  function secs(v) {
    if (v === null || v === undefined) return '—';
    return Number(v).toFixed(3).replace(/0+$/, '').replace(/\.$/, '') + ' s';
  }

  function bytes(v) {
    if (v === null || v === undefined) return '—';
    if (v < 1024) return v + ' B';
    if (v < 1024 * 1024) return (v / 1024).toFixed(1) + ' KB';
    return (v / 1048576).toFixed(2) + ' MB';
  }

  function yesno(v, yes, no) {
    if (v === null || v === undefined) return '—';
    return v ? (yes || '是') : (no || '否');
  }

  function dash(v) {
    return (v === null || v === undefined || v === '') ? '—' : String(v);
  }

  // Speakeasy verdict -> 中文說明 + 語意色
  var VERDICTS = {
    clean_exit:      { label: '正常結束',       kind: 'ok',
                       why: '模擬跑到程式自己結束，沒有中途卡住。' },
    hit_limit:       { label: '打到上限',       kind: 'warn',
                       why: '模擬被 API 呼叫數上限攔下來，樣本還在跑（通常是迴圈）。' },
    unsupported_api: { label: '碰到未支援 API', kind: 'bad',
                       why: 'Speakeasy 沒有實作到的 API，模擬在這裡中止。' },
    timeout:         { label: '逾時',           kind: 'warn',
                       why: '超過時間預算。' },
    error:           { label: '錯誤',           kind: 'bad', why: '模擬過程出錯。' }
  };

  function verdictInfo(v) {
    return VERDICTS[v] || { label: v || '未知', kind: '', why: '' };
  }

  var CATEGORY_LABELS = {
    anti_debug:      '反除錯',
    anti_vm:         '反虛擬機',
    dynamic_resolve: '動態解析 API',
    env_fingerprint: '環境指紋',
    injection:       '注入',
    persistence:     '持久化',
    timing:          '時間檢查',
    network:         '網路'
  };

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] || key;
  }

  // ------------------------------------------------- 動態端（mirage）的字典
  //
  // 中文說明跟著資料走（bundle.mirage_meta），這裡只做查表與備援，
  // 免得資料換了、前端還在講舊的故事。

  var META = null;

  function setMeta(data) { META = (data && data.mirage_meta) || null; }

  function reasonInfo(code) {
    var t = (META && META.reason_labels && META.reason_labels[code]) || null;
    return t || { label: code || '未知', why: '', kind: '' };
  }

  function roundVerdictInfo(code) {
    var t = (META && META.round_verdicts && META.round_verdicts[code]) || null;
    return t || { label: code || '未知', kind: '', why: '' };
  }

  function outcomeVerdictInfo(code) {
    var t = (META && META.outcome_verdicts && META.outcome_verdicts[code]) || null;
    return t || { label: code || '未知', kind: '' };
  }

  function scopeSourceLabel(code) {
    var m = (META && META.scope_source_labels) || {};
    return m[code] || code;
  }

  /* 增減標記。刻意用 U+2212（真的減號），不是連字號 —— 在等寬字型下對得齊。 */
  function delta(v) {
    if (v === null || v === undefined) return '';
    if (v === 0) return '±0';
    return (v > 0 ? '+' : '−') + num(Math.abs(v));
  }

  function deltaKind(v) {
    if (v === null || v === undefined || v === 0) return '';
    return v > 0 ? 'ok' : 'bad';
  }

  // ------------------------------------------------------------ 表格

  /* cols: [{label, cls, get(row) -> string|Node}] */
  function table(cols, rows, caption, minWidth) {
    var wrap = el('div', 'table-wrap');
    var t = el('table', 'data');
    if (minWidth) t.style.minWidth = minWidth;
    if (caption) t.appendChild(el('caption', null, caption));

    var thead = el('thead');
    var htr = el('tr');
    cols.forEach(function (c) {
      var th = el('th', c.cls || null, c.label);
      if (c.cls && c.cls.indexOf('num') >= 0) th.style.textAlign = 'right';
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    t.appendChild(thead);

    var tbody = el('tbody');
    rows.forEach(function (row) {
      var tr = el('tr');
      cols.forEach(function (c) {
        var td = el('td', c.cls || null);
        var val = c.get(row);
        if (val instanceof Node) td.appendChild(val);
        else td.textContent = (val === null || val === undefined || val === '') ? '—' : String(val);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    wrap.appendChild(t);
    return wrap;
  }

  function kv(pairs) {
    var dl = el('dl', 'kv');
    pairs.forEach(function (p) {
      if (!p) return;
      dl.appendChild(el('dt', null, p[0]));
      var dd = el('dd', p[2] === 'plain' ? 'plain' : null);
      if (p[1] instanceof Node) dd.appendChild(p[1]);
      else dd.textContent = dash(p[1]);
      dl.appendChild(dd);
    });
    return dl;
  }

  function tagList(items, extraCls) {
    var ul = el('ul', 'tag-list' + (extraCls ? ' ' + extraCls : ''));
    (items || []).forEach(function (t) { ul.appendChild(el('li', null, t)); });
    return ul;
  }

  // ------------------------------------------------------------ 資料載入

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('無法載入 ' + src)); };
      document.head.appendChild(s);
    });
  }

  var cached = null;

  /* 先試 fetch(data/bundle.json)。以 file:// 開啟時 fetch 會被 CORS 擋掉，
     這時改用 <script src="data/data.js">（同一份內容，包成 window.DATA）。 */
  function loadData() {
    if (cached) return Promise.resolve(cached);
    var ready = global.DATA || global.__BUNDLE__;
    if (ready) { cached = ready; setMeta(cached); return Promise.resolve(cached); }

    var viaScript = function () {
      return loadScript('data/data.js').then(function () {
        var d = global.DATA || global.__BUNDLE__;
        if (!d) throw new Error('data/data.js 載入了但沒有 window.DATA');
        cached = d;
        setMeta(cached);
        return cached;
      });
    };

    if (typeof fetch !== 'function' || location.protocol === 'file:') {
      return viaScript();
    }

    return fetch('data/bundle.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) { cached = d; setMeta(cached); return d; })
      .catch(function () { return viaScript(); });
  }

  function bySha(data, id) {
    var list = data.samples || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function fail(mount, err) {
    clear(mount);
    var box = el('div', 'error-box');
    box.appendChild(el('p', null, '資料載入失敗：' + (err && err.message ? err.message : err)));
    box.appendChild(el('p', 'small faint',
      '若是以 file:// 直接開啟，請確認 data/data.js 存在；' +
      '或在這個目錄起一個本機伺服器再用 http://localhost:8000/ 瀏覽' +
      '（Linux／macOS：python3 -m http.server；Windows：py -m http.server）。'));
    mount.appendChild(box);
  }

  function markNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.site-nav a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href === here || (here === '' && href === 'index.html')) {
        links[i].setAttribute('aria-current', 'page');
      }
    }
  }

  global.AIS3 = {
    el: el, frag: frag, clear: clear, append: append, pill: pill,
    num: num, secs: secs, bytes: bytes, yesno: yesno, dash: dash,
    delta: delta, deltaKind: deltaKind,
    verdictInfo: verdictInfo, categoryLabel: categoryLabel,
    reasonInfo: reasonInfo, roundVerdictInfo: roundVerdictInfo,
    outcomeVerdictInfo: outcomeVerdictInfo, scopeSourceLabel: scopeSourceLabel,
    table: table, kv: kv, tagList: tagList,
    loadData: loadData, bySha: bySha, fail: fail, markNav: markNav
  };
})(window);
