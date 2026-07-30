/* index.js —— 首頁：三組數據、樣本卡片、跨樣本總覽表 */
(function () {
  'use strict';

  var A = window.AIS3;
  var el = A.el, append = A.append, pill = A.pill;

  // 分級對應的 pill 樣式。標籤與說明文字由 build-data.py 供給（handoff_meta.classes），
  // 這裡只決定顏色 —— 文案只有一份來源，前後端不會講不一樣的話。
  var HF_CLASS = {
    decisive: { kind: 'ok' },
    minor: { kind: 'warn' },
    none: { kind: 'muted' }
  };

  A.markNav();

  A.loadData().then(render).catch(function (err) {
    A.fail(document.getElementById('sample-grid'), err);
  });

  function render(data) {
    // 標籤文字統一由資料端供給，這裡只把顏色併進去
    var cls = ((data.handoff_meta || {}).classes) || {};
    Object.keys(cls).forEach(function (k) {
      HF_CLASS[k] = HF_CLASS[k] || {};
      HF_CLASS[k].label = cls[k].label;
      HF_CLASS[k].blurb = cls[k].blurb;
    });
    renderMeta(data);
    renderTracks(data);
    renderMirageBanner(data);
    renderHandoffBanner(data);
    renderSamples(data);
    renderOverview(data);
  }

  // ------------------------------------------------------- 第三組摘要橫幅

  function renderHandoffBanner(data) {
    var mount = document.getElementById('handoff-banner');
    if (!mount) return;
    A.clear(mount);
    var m = data.handoff_meta || {};
    if (!m.available) {
      mount.appendChild(el('div', 'pending-box',
        '第三組（＋動態＋靜態）還沒有配對資料' +
        (m.why ? '（' + m.why + '）' : '') + '。'));
      return;
    }

    var box = el('div', 'note sta');
    box.appendChild(el('h4', null, '第三組：靜態情報接上動態端之後'));
    box.appendChild(el('p', null, m.headline));

    var row = el('div', 'pill-row');
    row.style.margin = '10px 0 4px';
    row.appendChild(pill((m.classes.decisive || {}).label + '：' +
      m.n_decisive + ' / ' + m.n_pairs, 'ok'));
    row.appendChild(pill((m.classes.minor || {}).label + '：' +
      m.n_minor + ' / ' + m.n_pairs, 'warn'));
    row.appendChild(pill((m.classes.none || {}).label + '：' +
      m.n_none + ' / ' + m.n_pairs, 'muted'));
    row.appendChild(pill('success = true：' + m.n_success_treated + ' / ' +
      m.n_pairs, 'bad'));
    box.appendChild(row);

    var row2 = el('div', 'pill-row');
    row2.style.margin = '4px 0';
    row2.appendChild(pill('拿到非空 profile：' + m.n_profile_applied + ' / ' +
      m.n_pairs, m.n_profile_applied === m.n_pairs ? 'ok' : 'warn'));
    row2.appendChild(pill('watchlist 已套用：' + m.n_watchlist_seeded + ' / ' +
      m.n_pairs, m.n_watchlist_seeded ? 'ok' : 'bad'));
    row2.appendChild(pill('初始 profile 與設計一致：' +
      m.n_profile_as_designed + ' / ' + m.n_pairs,
      m.n_profile_as_designed === m.n_pairs ? 'ok' : 'bad'));
    box.appendChild(row2);

    box.appendChild(el('p', 'small', m.caveat));
    box.appendChild(el('p', 'small faint',
      '批次 ' + (m.batch_generated_at || '?') + '　commit ' +
      String(m.commit || '?').slice(0, 12) +
      '　分級規則：' +
      Object.keys(m.classes).map(function (k) {
        return m.classes[k].label + ' = ' + m.classes[k].blurb;
      }).join('　')));
    mount.appendChild(box);
  }

  // ------------------------------------------------------- 誠實橫幅（動態端）

  function renderMirageBanner(data) {
    var mount = document.getElementById('mirage-banner');
    if (!mount) return;
    A.clear(mount);
    var m = data.mirage_meta;
    if (!m || !m.n_samples) {
      mount.appendChild(el('div', 'pending-box', '沒有動態端（mirage）資料。'));
      return;
    }

    var box = el('div', 'note bad');
    box.appendChild(el('h4', null, '先看這個：這六支沒有一支算「成功」'));
    box.appendChild(el('p', null, m.headline));

    var row = el('div', 'pill-row');
    row.style.margin = '10px 0 4px';
    row.appendChild(pill('success = true：' + m.n_success + ' / ' + m.n_samples, 'bad'));
    row.appendChild(pill('assisted = true：' + m.n_assisted + ' / ' + m.n_samples, 'bad'));
    row.appendChild(pill('inconclusive：' + m.n_inconclusive + ' / ' + m.n_samples, 'warn'));
    row.appendChild(pill('被守衛停下來：' + m.n_stopped_by_guard + ' / ' + m.n_samples, 'warn'));
    row.appendChild(pill('需要對數刻度：' + m.n_log_scale + ' 支', 'warn'));
    box.appendChild(row);

    box.appendChild(el('p', 'small faint',
      '「被守衛停下來」指外圈判定沒有推進（no_progress）或行為沒有變化（no_behaviour_change）' +
      '而主動停手 —— 不是樣本自然跑完。' +
      '「需要對數刻度」的兩支，輪與輪之間跨了兩到三個數量級，' +
      '在它們的圖表上縱軸會標紅字提醒。'));
    mount.appendChild(box);
  }

  // ---------------------------------------------------------------- meta

  function renderMeta(data) {
    var n = (data.samples || []).length;
    var when = (data.generated_at || '').replace('T', ' ').replace('Z', ' UTC');
    document.getElementById('hero-meta').textContent =
      n + ' 支樣本 · 資料產生於 ' + when + ' · schema ' + data.schema;
    document.getElementById('foot-meta').textContent =
      '資料由 tools/build-data.py 產生（' + when + '）。' +
      (data.security ? data.security.note : '');
  }

  // -------------------------------------------------------------- tracks

  function renderTracks(data) {
    var mount = A.clear(document.getElementById('track-grid'));
    (data.tracks || []).forEach(function (t, i) {
      var cls = 'card track-card acc-' + (t.accent === 'static' ? 'static' : 'dynamic');
      if (t.status !== 'available') cls += ' is-pending';
      var card = el('div', cls);

      var head = el('div', 'pill-row');
      head.appendChild(el('span', 'faint small mono', String(i + 1).padStart(2, '0')));
      if (t.status === 'available') {
        head.appendChild(pill('已有資料', 'ok'));
      } else {
        head.appendChild(pill('待補', 'pending'));
      }
      append(card,
        head,
        el('h3', null, t.label),
        el('p', null, t.blurb),
        el('p', 'track-detail', t.detail));
      mount.appendChild(card);
    });
  }

  // ------------------------------------------------------------- samples

  function renderSamples(data) {
    var mount = A.clear(document.getElementById('sample-grid'));
    (data.samples || []).forEach(function (s) {
      mount.appendChild(sampleCard(s));
    });
  }

  function sampleCard(s) {
    var su = s.summary;
    var a = el('a', 'card sample-card');
    a.href = 'sample.html?id=' + encodeURIComponent(s.id);
    a.setAttribute('aria-label', '樣本 ' + s.id + ' 的詳情');

    var top = el('div', 'pill-row');
    top.style.justifyContent = 'space-between';
    top.style.alignItems = 'baseline';
    top.appendChild(el('span', 'sc-id', s.id));

    var badges = el('span', 'pill-row');
    badges.appendChild(pill(su.arch || '架構不明'));
    if (su.is_dll) badges.appendChild(pill('DLL'));
    if (su.packed) badges.appendChild(pill('加殼', 'warn'));
    if (su.degraded) badges.appendChild(pill('證據不完整', 'bad'));
    top.appendChild(badges);

    var v = A.verdictInfo(su.verdict);
    var sub = el('div', 'sc-sub', A.bytes(su.size) + ' · .' + su.kind);

    var verdictRow = el('div', 'pill-row');
    verdictRow.style.marginBottom = '2px';
    verdictRow.appendChild(pill('基線：' + v.label, v.kind || 'dyn'));
    if (su.mirage) {
      verdictRow.appendChild(pill(
        'mirage：' + (su.mirage_success ? 'success' : '未成功'),
        su.mirage_success ? 'ok' : 'bad'));
      if (su.mirage_scale === 'log') verdictRow.appendChild(pill('對數刻度', 'warn'));
    }

    var stats = el('div', 'sc-stats');
    var pairs = [
      ['基線 API', A.num(su.apis_total)],
      ['模擬耗時', A.secs(su.emulation_seconds)],
      ['檢測點', A.num(su.n_detections)],
      ['capa 能力', A.num(su.n_capabilities)]
    ];
    if (su.mirage) {
      pairs.splice(1, 0,
        ['mirage 輪數', A.num(su.mirage_rounds)],
        ['每輪 API', (su.mirage_apis || []).map(function (x) { return A.num(x); }).join(' → ')]);
    }
    pairs.push(['C2 候選', su.n_c2_non_benign + ' / ' + su.n_c2]);
    pairs.forEach(function (p) {
      var row = el('div');
      row.appendChild(el('span', 'k', p[0]));
      row.appendChild(el('span', 'v', p[1]));
      stats.appendChild(row);
    });

    append(a, top, sub, verdictRow, stats);
    return a;
  }

  // ------------------------------------------------------------ overview

  function renderOverview(data) {
    var rows = (data.samples || []).map(function (s) { return s.summary; });

    var cols = [
      { label: 'sha8', cls: 'm', get: function (r) {
          var a = el('a', null, r.id);
          a.href = 'sample.html?id=' + encodeURIComponent(r.id);
          return a;
        } },
      { label: '架構', get: function (r) { return r.arch; } },
      { label: '型態', get: function (r) { return r.is_dll ? 'DLL' : 'EXE'; } },
      { label: '大小', cls: 'num', get: function (r) { return A.bytes(r.size); } },
      { label: '加殼', get: function (r) {
          return r.packed ? pill('是', 'warn') : el('span', 'faint', '否');
        } },
      { label: '① 基線判定', get: function (r) {
          var v = A.verdictInfo(r.verdict);
          return pill(v.label, v.kind || 'dyn');
        } },
      { label: '① 基線 API', cls: 'num', get: function (r) { return A.num(r.apis_total); } },
      { label: '② mirage 每輪 API', cls: 'm', get: function (r) {
          if (!r.mirage) return el('span', 'faint', '—');
          var wrap = el('span');
          wrap.textContent = (r.mirage_apis || []).map(function (x) { return A.num(x); }).join(' → ');
          if (r.mirage_scale === 'log') {
            wrap.appendChild(document.createTextNode(' '));
            wrap.appendChild(pill('對數', 'warn'));
          }
          return wrap;
        } },
      { label: '② success', get: function (r) {
          if (!r.mirage) return el('span', 'faint', '—');
          return pill(String(r.mirage_success), r.mirage_success ? 'ok' : 'bad');
        } },
      { label: '② 收場理由', cls: 'm', get: function (r) {
          if (!r.mirage) return el('span', 'faint', '—');
          var ri = A.reasonInfo(r.mirage_reason);
          return pill(ri.label, ri.kind || 'dyn');
        } },
      { label: '③ ＋靜態（對照）', get: function (r) {
          if (!r.handoff) return pill('尚未取得', 'pending');
          var info = (HF_CLASS[r.handoff_class] || {});
          var p = pill(info.label || r.handoff_class, info.kind || 'muted');
          p.title = '同批 normal → static-profile：最深呼叫數 ' +
            A.num(r.handoff_deep_control) + ' → ' + A.num(r.handoff_deep_treated) +
            '，末輪相異 API ' + A.num(r.handoff_distinct_control) + ' → ' +
            A.num(r.handoff_distinct_treated);
          return p;
        } },
      { label: '③ 最深呼叫數', cls: 'num', get: function (r) {
          if (!r.handoff) return '—';
          return A.num(r.handoff_deep_control) + ' → ' +
                 A.num(r.handoff_deep_treated);
        } },
      { label: '③ 相異 API', cls: 'num', get: function (r) {
          if (!r.handoff) return '—';
          return A.num(r.handoff_distinct_control) + ' → ' +
                 A.num(r.handoff_distinct_treated);
        } },
      { label: '模擬秒數', cls: 'num', get: function (r) { return A.secs(r.emulation_seconds); } },
      { label: '檢測點', cls: 'num', get: function (r) { return A.num(r.n_detections); } },
      { label: '分類', cls: 'num', get: function (r) { return A.num(r.n_categories); } },
      { label: 'capa', cls: 'num', get: function (r) { return A.num(r.n_capabilities); } },
      { label: 'YARA', cls: 'num', get: function (r) { return A.num(r.n_yara); } },
      { label: 'C2', cls: 'num', get: function (r) {
          return r.n_c2 === 0 ? '0' : r.n_c2 + '（' + r.n_c2_non_benign + '）';
        } },
      { label: '建議預算', cls: 'num', get: function (r) {
          return r.budget_seconds ? r.budget_seconds + ' s' : '—';
        } }
    ];

    var mount = A.clear(document.getElementById('overview-table'));
    mount.appendChild(A.table(cols, rows,
      '① 純 Speakeasy 基線、② ＋動態（mirage）、③ ＋動態＋靜態，' +
      '再加上靜態分析那一側的數字。③ 的兩個數字是「同一批 normal → static-profile」，' +
      '不是拿來比 ②：那是不同批次、不同參數。所有數字直接取自報告欄位，' +
      '沒有重新計算。', '1500px'));
  }
})();
