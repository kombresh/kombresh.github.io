#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build-data.py —— 產生靜態網站要用的 data/

這支腳本是**安全邊界**。網站會公開，所以「哪些欄位可以出去」由這裡決定，
不是靠前端不顯示。原則是**白名單**：只有明確列出來的欄位會被複製到輸出，
其餘一律丟掉。

排除的東西（以及為什麼）：

  derived.untrusted.*      樣本可控內容（FLOSS 字串、Ghidra 反編譯碼）。
                           可能含受害者資料、第三方情報、或針對 LLM 的注入。
                           **整區刪掉**，一個欄位都不留。
  raw.floss.strings        同上；只留下 counts（純數字）。
  raw.ghidra.functions     含反編譯出來的函式簽章與註記，屬於反編譯輸出。
  raw.yara.matches[].strings
                           YARA 命中的字串內容來自樣本位元組。只留規則名 + 命中條數。
  derived.c2_candidates[].value / .host
                           未 defang 的 IOC。輸出只留 `defanged`。
  meta.source_path         分析機的絕對路徑。
  tools[*].argv / tool_path / stderr_tail
                           含分析機的絕對路徑與使用者名稱。

動態端（mirage）的 run JSON 另外排除：

  in_memory_strings        模擬期間記憶體裡掃到的字串 —— 樣本內容，整區排除。
  injected_strings         我方注入的字串，同樣不出境。
  rounds[*].arg_strings[].value
                           樣本傳給 API 的字串引數（檔名、帳密、C2）。
                           只留 `api` 名稱，值一律不出境。
  rounds[*].tail_trace     逐指令位址與原始位元組 —— 那是樣本的機器碼。
  rounds[*].stop.traceback / bytes_error / *.traceback
                           含分析機的原始碼路徑與行號。
  rounds[*].fetch_misses   含 `curr_mod`（模擬器裡的完整檔案路徑）。
  rounds[*].initterm[*].entries[*].region
                           含以 sha256 命名的模組區段名。
  llm_diagnosis_UNVERIFIED 模型輸出，**會**收錄（改名為 llm_diagnosis），
                           但視為不可信文字：去控制字元、截長度、
                           URL scheme 一律 defang、絕對路徑一律抹掉。
                           前端只用 textContent 輸出，不碰 innerHTML。

另外沒有任何樣本原始位元組被複製出來 —— 這支腳本從頭到尾沒有開過樣本檔。

用法（Linux / macOS 用 python3，Windows 用 py）：
    python3 tools/build-data.py
    py      tools/build-data.py
    python3 tools/build-data.py --speakeasy <dir> --intel <dir> --mirage <dir> --out <dir>

Windows 上不要用 `python` 或 `python3` —— 那兩個名字會被 Microsoft Store 的
App Execution Alias 攔下（0 bytes 的 reparse point），沒有任何輸出、退出碼
9009 或 49，看起來像跑完了其實根本沒執行。一律用 `py`。

來源目錄預設是「page/ 的上一層」底下的同名資料夾，也可以用環境變數覆蓋：
    AIS3_SPEAKEASY / AIS3_INTEL / AIS3_MIRAGE
腳本裡刻意不寫任何含使用者名稱的絕對路徑 —— 這個檔案本身會被 GitHub Pages 送出去。

輸出：
    data/bundle.json    給 fetch() 用
    data/data.js        同一份內容包成 window.DATA（另設 window.__BUNDLE__ 別名），
                        給 file:// 開啟時的備援
"""

from __future__ import annotations

import argparse
import datetime
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE_ROOT = os.path.dirname(HERE)
SIBLING = os.path.dirname(PAGE_ROOT)


def source_default(env_key, folder):
    """來源目錄：環境變數優先，否則取 page/ 的上一層底下的同名資料夾。

    刻意不寫死任何含使用者名稱的絕對路徑 —— 這支腳本會被 GitHub Pages 送出去。
    """
    return os.environ.get(env_key) or os.path.join(SIBLING, folder)


DEFAULT_SPEAKEASY = source_default("AIS3_SPEAKEASY", "only-speakeasy")
DEFAULT_INTEL = source_default("AIS3_INTEL", os.path.join("test", "reports"))
DEFAULT_MIRAGE = source_default("AIS3_MIRAGE", "speakeasy+llm")
# 第三組：同一批次、同一天、其他參數固定的 normal vs static-profile 對照實驗
DEFAULT_LAST = source_default("AIS3_LAST", "last")
DEFAULT_OUT = os.path.join(PAGE_ROOT, "data")

# 一支樣本的長條圖裡，最大值 / 最小正值超過這個倍率就改用對數刻度。
# 本批有兩支跨了三個數量級（229→199941、325→6797），線性刻度會把小的那幾根壓成 0 像素。
LOG_SCALE_RATIO = 50

# 這些 key 不管在輸出的哪一層出現都算失敗。跑完會自己驗一次。
FORBIDDEN_KEYS = {
    # 靜態端
    "untrusted",
    "decompiled",
    "decompiled_functions",
    "strings",
    "strings_dropped",
    "classified",
    "source_path",
    "argv",
    "tool_path",
    "stderr_tail",
    # 動態端（mirage）
    "in_memory_strings",
    "in_memory_strings_capped",
    "injected_strings",
    "arg_strings",
    "arg_strings_dropped",
    "tail_trace",
    "tail_trace_attached",
    "traceback",
    "bytes_error",
    "stop_bytes",
    "curr_mod",
    "caller_mod",
    "fetch_misses",
    "llm_diagnosis_UNVERIFIED",
    "api_trace_final",
}

CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
MAX_TEXT = 240

# LLM 輸出裡如果冒出這些東西，一律在這裡處理掉（而不是靠前端不顯示）。
WIN_PATH = re.compile(r"[A-Za-z]:\\[^\s\"'`,;)]+")
NIX_PATH = re.compile(r"/(?:home|mnt|Users|root|tmp)/[^\s\"'`,;)]+")
URL_SCHEME = re.compile(r"\bhttps?://", re.I)

# 模型會**複述**它讀到的樣本字串 —— 實測 787f2b0c 的診斷裡就有樣本查的捷徑檔名
# 與它自己的錯誤訊息。那些是樣本內容，不能因為「經過模型的嘴」就變成可以出境。
# 所以引號裡的東西、看起來像檔名的 token、IP 與網域一律在這裡抹掉。
# 撇號的難處：`emulator's` 的 `'` 不是引號。所以開頭的引號前面不可以是單字字元，
# 收尾的單引號後面也不可以是單字字元 —— 不然一個所有格會把後面整段吃掉，
# 反而把真正該遮的字串留在外面（實測踩過）。
QUOTED = re.compile(
    r"""(?<!\w)"[^"\n]{1,200}"|"""
    r"""(?<!\w)'[^'\n]{1,200}'(?!\w)|"""
    r"""(?<!\w)`[^`\n]{1,200}`|"""
    r"""‘[^’\n]{1,200}’|“[^”\n]{1,200}”""")
FILENAME = re.compile(
    r"\b[\w.\-一-鿿]+\.(?:lnk|exe|dll|sys|bin|dat|tmp|txt|scr|bat|cmd|ps1|vbs|js|"
    r"jar|zip|rar|7z|cab|msi|pyd|pyc|pyz|db|log|ini|inf|reg|url|hta|wsf|ocx|drv|efi)\b",
    re.I)
IPV4 = re.compile(r"\b\d{1,3}(?:\[?\.\]?\d{1,3}){3}\b")
DOMAIN = re.compile(
    r"\b(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\[?\.\]?){1,4}"
    r"(?:com|net|org|ru|cn|info|biz|xyz|top|io|co|me|tk|cc|su|onion)\b", re.I)


# --------------------------------------------------------------------------
# 清洗工具
# --------------------------------------------------------------------------

def scrub(value, limit=MAX_TEXT):
    """樣本可控的字串一律過這裡：去控制字元、截長度。

    前端另外全部用 textContent 輸出，所以不做 HTML escape —— 在這裡做反而會
    讓 API 名稱裡的 `&` 之類的字元被雙重轉義。
    """
    if value is None:
        return None
    if not isinstance(value, str):
        return value
    out = CONTROL_CHARS.sub("", value)
    if len(out) > limit:
        out = out[:limit] + "…"
    return out


def scrub_list(values, limit=MAX_TEXT, cap=4000):
    if not values:
        return []
    return [scrub(v, limit) for v in list(values)[:cap]]


def pick(src, keys):
    """白名單複製。來源沒有的 key 就不會出現在結果裡。"""
    if not isinstance(src, dict):
        return {}
    return {k: src[k] for k in keys if k in src}


def scrub_untrusted(value, limit=1200):
    """LLM 產出的文字。

    模型輸出可以放進網站（它是我們自己的流水線產物，不是樣本內容），
    但它是**不可信文字**：模型可能複述樣本給它看的字串。所以這裡：

      1. 去控制字元、截長度（同 scrub）
      2. 絕對路徑一律抹掉 —— 分析機路徑、模擬器裡的檔案路徑都不出境
      3. **引號裡的東西一律抹掉** —— 模型會複述樣本的字串（檔名、錯誤訊息、
         使用者名稱），那些是樣本內容，經過模型的嘴不會變乾淨
      4. 看起來像檔名的 token、IPv4、網域一律抹掉
      5. URL scheme 一律 defang —— 網站上不會出現可直接點的連結

    留下來的是「模型認為發生了什麼」的句子結構與 API 名稱，
    那才是這段文字在網站上的用途。前端另外全部用 textContent 輸出，
    所以這裡不做 HTML escape。
    """
    if not isinstance(value, str) or not value:
        return ""
    out = CONTROL_CHARS.sub("", value)
    out = WIN_PATH.sub("〔路徑已移除〕", out)
    out = NIX_PATH.sub("〔路徑已移除〕", out)
    out = QUOTED.sub("〔引文已移除〕", out)
    out = FILENAME.sub("〔檔名已移除〕", out)
    out = DOMAIN.sub("〔網域已移除〕", out)
    out = IPV4.sub("〔IP 已移除〕", out)
    out = URL_SCHEME.sub(
        lambda m: ("hxxps://" if m.group(0).lower().startswith("https") else "hxxp://"),
        out)
    if len(out) > limit:
        out = out[:limit] + "…"
    return out.strip()


# --------------------------------------------------------------------------
# 讀取來源
# --------------------------------------------------------------------------

def read_json(path):
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def load_speakeasy(dirpath):
    """回傳 {sha8: {"official": obj, "variant": obj|None}}。

    787f2b0c 有兩份：`-allep.json`（跑全部匯出函式）與 `.json`（只跑 DllMain）。
    正式數據用 all_entrypoints 那份，另一份留著當對照註記。
    """
    buckets = {}
    for path in sorted(glob.glob(os.path.join(dirpath, "*.json"))):
        obj = read_json(path)
        sha = obj.get("sha256", "")
        if not sha:
            print("[-] 跳過沒有 sha256 的檔案：%s" % path, file=sys.stderr)
            continue
        buckets.setdefault(sha[:8], []).append(obj)

    result = {}
    for sha8, runs in buckets.items():
        if len(runs) == 1:
            result[sha8] = {"official": runs[0], "variant": None}
            continue
        # 多份時：all_entrypoints=True 的那份是正式數據
        official = next((r for r in runs if r.get("all_entrypoints")), None)
        if official is None:
            official = max(runs, key=lambda r: r.get("apis_total") or 0)
        variant = next((r for r in runs if r is not official), None)
        result[sha8] = {"official": official, "variant": variant}
    return result


def load_intel(dirpath):
    """回傳 {sha8: intel_json}。"""
    result = {}
    for path in sorted(glob.glob(os.path.join(dirpath, "*", "*.intel.json"))):
        obj = read_json(path)
        sha = obj.get("meta", {}).get("sha256", "")
        if not sha:
            print("[-] 跳過沒有 meta.sha256 的檔案：%s" % path, file=sys.stderr)
            continue
        result[sha[:8]] = obj
    return result


def load_mirage(dirpath):
    """回傳 {sha8: [run_json, ...]}（依 run id 排序）。

    來源目錄的形狀不一致：有的樣本把 run 放在 `<sha8>/runs/`，
    有的直接放在 `<sha8>/` 底下。兩種都掃。
    """
    result = {}
    patterns = (
        os.path.join(dirpath, "*", "run_*.json"),
        os.path.join(dirpath, "*", "runs", "run_*.json"),
    )
    seen = set()
    for pattern in patterns:
        for path in sorted(glob.glob(pattern)):
            real = os.path.normcase(os.path.abspath(path))
            if real in seen:
                continue
            seen.add(real)
            obj = read_json(path)
            sha = obj.get("sample_sha256") or ""
            if not sha:
                print("[-] 跳過沒有 sample_sha256 的 run：%s" % os.path.basename(path),
                      file=sys.stderr)
                continue
            result.setdefault(sha[:8], []).append(obj)
    for sha8 in result:
        result[sha8].sort(key=lambda o: o.get("run") or "")
    return result


# --------------------------------------------------------------------------
# 轉換：Speakeasy
# --------------------------------------------------------------------------

def build_speakeasy(official, variant):
    eps = []
    for ep in official.get("entry_points") or []:
        err = ep.get("error") or {}
        eps.append({
            "ep_type": scrub(ep.get("ep_type"), 120),
            "start_addr": scrub(ep.get("start_addr"), 32),
            "instr_count": ep.get("instr_count"),
            "n_apis": ep.get("n_apis") or 0,
            "error": pick(err, ("type", "pc", "address", "api_name")),
            "last_apis": scrub_list(ep.get("last_apis"), 120, 64),
        })

    out = {
        "verdict": scrub(official.get("verdict"), 64),
        "timeout": official.get("timeout"),
        "is_dll": bool(official.get("is_dll")),
        "all_entrypoints": bool(official.get("all_entrypoints")),
        "dllmain_only": bool(official.get("dllmain_only")),
        "emulation_total_runtime": official.get("emulation_total_runtime"),
        "wall_seconds": official.get("wall_seconds"),
        "apis_total": official.get("apis_total") or 0,
        "detail": pick(official.get("detail") or {}, ("type", "pc", "address", "api_name")),
        "entry_points": eps,
        "variant": None,
    }

    if variant is not None:
        out["variant"] = {
            "label": "只跑 DllMain" if variant.get("dllmain_only") else "另一次執行",
            "apis_total": variant.get("apis_total") or 0,
            "emulation_total_runtime": variant.get("emulation_total_runtime"),
            "dllmain_only": bool(variant.get("dllmain_only")),
            "all_entrypoints": bool(variant.get("all_entrypoints")),
            "note": (
                "同一支樣本，只跑 DllMain 得到 %d 個 API，跑全部匯出函式得到 %d 個。"
                "正式數據採用後者。"
                % (variant.get("apis_total") or 0, out["apis_total"])
            ),
        }
    return out


def build_baseline_segments(speak):
    """基線那一根長條的分段（依 entry point 拆）。

    這是「純 Speakeasy、沒有 LLM 介入」那一組的資料，圖表上放在第 0 格。
    """
    segments = []
    for ep in speak["entry_points"]:
        segments.append({
            "label": ep["ep_type"],
            "start_addr": ep["start_addr"],
            "n_apis": ep["n_apis"],
            "error": ep["error"],
            "apis_tail": ep["last_apis"],
        })

    total = speak["apis_total"]
    counted = sum(s["n_apis"] for s in segments)
    # 有些 verdict（例如 hit_limit）下 apis_total 是全域計數，跟逐 ep 加總可能對不上。
    # 差額用一段明確標記的「未歸屬」補上，不要偷偷把數字改成一致。
    if total > counted:
        segments.append({
            "label": "（未歸屬到單一 entry point）",
            "start_addr": None,
            "n_apis": total - counted,
            "error": {},
            "apis_tail": [],
            "unattributed": True,
        })
    return segments


# --------------------------------------------------------------------------
# 轉換：動態端（mirage）
# --------------------------------------------------------------------------

# 外圈的收場理由。這些字串直接決定觀眾怎麼理解「為什麼停了」，
# 所以中文說明寫在這裡、跟著資料出去，不在前端硬編。
OUTCOME_REASONS = {
    "no_behaviour_change": {
        "label": "連續兩輪行為沒有變化",
        "why": "外圈的守衛看到這一輪跟上一輪的軌跡指紋一樣，判定再跑也不會不同，主動停手。"
               "這是被守衛停下來的，不是樣本自然跑完。",
        "kind": "warn",
    },
    "no_progress": {
        "label": "連續輪次沒有推進",
        "why": "外圈判定這幾輪沒有把樣本推到更深的地方，停止繼續迭代。"
               "同樣是被守衛停下來的，不是收斂。",
        "kind": "warn",
    },
    "max_iters": {
        "label": "用完迭代次數上限",
        "why": "跑到指定的最大輪數就停了 —— 不代表已經沒有東西可挖。",
        "kind": "warn",
    },
    "llm_call_failed": {
        "label": "LLM 端點失敗",
        "why": "這一輪要問模型的問題沒有拿到答案（逾時或回了不能用的內容）。"
               "這一輪的數字是端點故障下的產物，不是分析成果。",
        "kind": "bad",
    },
    "synthesized_unimplemented_api": {
        "label": "依賴了合成的未實作 API",
        "why": "模擬器沒實作的 API，回傳值是我們合成的。合成值無法驗證，"
               "所以這一輪一律降級成 inconclusive。",
        "kind": "bad",
    },
    "synthesised_data_import": {
        "label": "依賴了合成的資料匯入值",
        "why": "被匯入的其實是變數而不是函式，我們給了一個值。那個值是編的，"
               "所以這一輪標成 inconclusive。",
        "kind": "bad",
    },
    "crash_after_llm_answer": {
        "label": "拿到 LLM 答案之後崩潰",
        "why": "模型回答之後樣本走進了一段跑不動的記憶體。",
        "kind": "bad",
    },
    "llm_declared_arity": {
        "label": "參數個數是 LLM 宣告的",
        "why": "未實作 API 的堆疊參數個數由模型宣告，沒有權威來源可以對照。",
        "kind": "bad",
    },
    "clean": {
        "label": "這一輪正常結束",
        "why": "這一次模擬跑到樣本自己結束，沒有中途卡住。",
        "kind": "ok",
    },
}

ROUND_VERDICTS = {
    "inconclusive": {"label": "不可採信", "kind": "bad",
                     "why": "這一輪有某個值是我們補的或編的，結果不能當成樣本的行為證據。"},
    "bailed": {"label": "樣本自己收工", "kind": "warn",
               "why": "樣本自己走到結束，但沒有做出我們在等的行為。"},
}

OUTCOME_VERDICTS = {
    "unresolved": {"label": "沒有結論", "kind": "bad"},
    "inconclusive": {"label": "不可採信", "kind": "bad"},
    "resolved": {"label": "有結論", "kind": "ok"},
}

# 每一輪的 API 名單從哪幾個欄位湊出來的。前端會照這個標示每一個 API 的來源。
SCOPE_SOURCE_LABELS = {
    "watch": "攔截清單（LLM 要求接管）",
    "synth": "合成回答（模擬器沒實作）",
    "sig": "LLM 宣告參數個數",
    "raise": "API 派送中途拋例外",
    "conv": "呼叫慣例被改對",
    "args": "這一輪帶了字串引數",
}


def api_key(name):
    return scrub((name or "").strip().lower(), 120)


def round_api_scope(rd):
    """這一輪外圈實際碰到的 API 名單 -> {api: [來源, ...]}。

    ⚠️ 這**不是**完整的 API 呼叫軌跡。逐輪的完整軌跡沒有留存 ——
    run JSON 只有最後一輪的 `api_trace_final`。所以逐輪的「新增／消失」
    是就這份名單算的，網站上必須這樣標。

    只取 API 名稱，不取任何引數值。`arg_strings[].value` 是樣本傳進去的字串
    （檔名、帳號密碼、C2），一個字都不出境。
    """
    scope = {}

    def add(name, src):
        k = api_key(name)
        if not k:
            return
        scope.setdefault(k, [])
        if src not in scope[k]:
            scope[k].append(src)

    for name in (rd.get("watchlist") or []):
        add(name, "watch")
    for name in (rd.get("add_watchlist") or []):
        add(name, "watch")
    for name in (rd.get("seeded_watchlist") or []):
        add(name, "watch")
    for item in (rd.get("synth_fills") or []):
        add(item.get("api"), "synth")
    for item in (rd.get("api_signatures") or []):
        add(item.get("api"), "sig")
    for item in (rd.get("dispatch_raises") or []):
        add(item.get("api"), "raise")
    for item in (rd.get("callconv_fixes") or []):
        mod = item.get("module") or ""
        api = item.get("api") or ""
        add((mod + "." + api) if mod else api, "conv")
    # arg_strings：只取 api 名稱。值不出境。
    for item in (rd.get("arg_strings") or []):
        add(item.get("api"), "args")
    return scope


def build_round(rd, prev_scope, prev_n, index):
    stop = rd.get("stop") or {}
    stop_type = scrub(stop.get("type"), 120) or ""
    reason = scrub(rd.get("reason"), 64) or ""
    n_apis = rd.get("n_apis") or 0

    scope = round_api_scope(rd)
    names = set(scope)
    added = sorted(names - prev_scope) if prev_scope is not None else []
    removed = sorted(prev_scope - names) if prev_scope is not None else []

    eps = []
    for ep in (rd.get("entry_points") or [])[:32]:
        eps.append({
            "ep_type": scrub(ep.get("ep_type"), 120),
            "start_addr": scrub(ep.get("start_addr"), 32),
            "n_apis": ep.get("n_apis") or 0,
            "error": scrub(ep.get("error"), 160) or "",
        })

    # profile_changed：這些是**我們編的環境值**，不是樣本內容。攤平成 [key, 值] 好顯示。
    changed = []
    for key, val in (rd.get("profile_changed") or {}).items():
        if isinstance(val, dict):
            val = "、".join("%s=%s" % (k, v) for k, v in val.items())
        changed.append({"key": scrub(str(key), 64), "value": scrub(str(val), 160)})

    profile_now = []
    for key, val in (rd.get("profile") or {}).items():
        if isinstance(val, dict):
            val = "、".join("%s=%s" % (k, v) for k, v in val.items())
        profile_now.append({"key": scrub(str(key), 64), "value": scrub(str(val), 160)})

    synth = [{
        "api": scrub(x.get("api"), 120),
        "calls": x.get("calls"),
        "calls_with_writes": x.get("calls_with_writes"),
        "proposed": x.get("proposed"),
        "applied": x.get("applied"),
    } for x in (rd.get("synth_fills") or [])[:64]]

    sigs = [{
        "api": scrub(x.get("api"), 120),
        "argc": x.get("argc"),
        "conv": scrub(x.get("conv"), 32),
        "source": scrub(x.get("source"), 32),
        "conflicts": x.get("conflicts"),
    } for x in (rd.get("api_signatures") or [])[:64]]

    # dispatch_raises：只留 api 與例外型別。traceback 含分析機的原始碼路徑，不出境。
    raises = [{
        "api": scrub(x.get("api"), 120),
        "exception": scrub(x.get("exception"), 160),
    } for x in (rd.get("dispatch_raises") or [])[:32]]

    conv_fixes = [{
        "api": scrub(((x.get("module") or "") + "." + (x.get("api") or "")).strip("."), 120),
        "argc": x.get("argc"),
    } for x in (rd.get("callconv_fixes") or [])[:32]]

    data_imports = [{
        "symbol": scrub(((x.get("module") or "") + "." + (x.get("symbol") or "")).strip("."), 120),
        "width": x.get("width"),
        "val_int": x.get("value") if isinstance(x.get("value"), int) else None,
    } for x in (rd.get("data_imports") or [])[:32]]

    dyn_code = [{
        "tag": scrub(x.get("tag"), 96),
        "base": scrub(x.get("base"), 32),
        "size": scrub(x.get("size"), 32),
        "ours": bool(x.get("ours")),
    } for x in (rd.get("dynamic_code") or [])[:32]]

    delta = None if prev_n is None else n_apis - prev_n

    # ------------------------------------------------------------------
    # 誠實旗標。這些不是裝飾 —— 沒有它們，觀眾會把 199941 讀成「跑得很深」。
    # ------------------------------------------------------------------
    warnings = []
    if reason == "llm_call_failed":
        warnings.append({
            "kind": "bad",
            "text": "這一輪的 LLM 呼叫失敗。外圈要問的問題沒有拿到答案，"
                    "接下來發生的事是端點故障下的產物，不是分析成果。",
        })
    if "max_api_count" in stop_type:
        warnings.append({
            "kind": "bad",
            "text": "這一輪是撞到模擬器的 API 呼叫上限才停的 —— 樣本當時還在跑。"
                    "%s 這個數字反映的是「上限在哪」，不是「行為有多深」；"
                    "呼叫大多集中在同一個輪詢迴圈裡。" % ("{:,}".format(n_apis)),
        })
    if delta is not None and delta < 0:
        warnings.append({
            "kind": "warn",
            "text": "這一輪比上一輪**少** %s 次呼叫。迭代之間不是單調遞增，"
                    "所以圖表用每輪各自獨立的長條，不做累積堆疊。"
                    % "{:,}".format(abs(delta)),
        })
    if rd.get("nudged"):
        warnings.append({
            "kind": "warn",
            "text": "這一輪外圈主動「推」了樣本一把（nudged）—— 有一個值是規則塞的，不是模型要的。",
        })
    if rd.get("self_abort"):
        warnings.append({
            "kind": "warn",
            "text": "樣本這一輪是自己決定結束的（self_abort）—— 它偵測到什麼之後主動退出。",
        })

    return {
        "round": rd.get("iter") or (index + 1),
        "n_apis": n_apis,
        "delta": delta,
        "verdict": scrub(rd.get("verdict"), 48),
        "reason": reason,
        "stop": {
            "type": stop_type,
            "pc": scrub(stop.get("pc"), 32),
            "address": scrub(stop.get("address"), 32),
            "instr": scrub(stop.get("instr"), 64),
            "sp": scrub(stop.get("sp"), 32),
        } if stop_type else None,
        "llm_calls": rd.get("llm_calls") or 0,
        "llm_seconds": rd.get("llm_seconds"),
        "emu_seconds": rd.get("emu_seconds"),
        "nudged": bool(rd.get("nudged")),
        "self_abort": bool(rd.get("self_abort")),
        "payload_seen": bool(rd.get("payload_seen")),
        "payload_hits_discounted": rd.get("payload_hits_discounted") or 0,
        "stack_checked": rd.get("stack_checked") or 0,
        "stack_unknown": rd.get("stack_unknown") or 0,
        "n_stack_mismatch": len(rd.get("stack_mismatch") or []),
        "n_faults": len(rd.get("faults") or []),
        "n_arity_fallbacks": len(rd.get("arity_fallbacks") or []),
        "entry_points": eps,
        "profile_changed": changed,
        "profile": profile_now,
        "watchlist_in": scrub_list([api_key(x) for x in (rd.get("watchlist") or [])], 120, 64),
        "add_watchlist": scrub_list([api_key(x) for x in (rd.get("add_watchlist") or [])], 120, 64),
        "seeded_watchlist": scrub_list([api_key(x) for x in (rd.get("seeded_watchlist") or [])], 120, 64),
        "synth_fills": synth,
        "api_signatures": sigs,
        "dispatch_raises": raises,
        "callconv_fixes": conv_fixes,
        "data_imports": data_imports,
        "dynamic_code": dyn_code,
        "api_scope": [{"api": k, "sources": scope[k]} for k in sorted(scope)],
        "api_added": added,
        "api_removed": removed,
        "llm_diagnosis": scrub_untrusted(rd.get("llm_diagnosis_UNVERIFIED")),
        "warnings": warnings,
    }


def build_final_trace(run, last_round_n):
    trace = run.get("api_trace_final") or []
    if not trace:
        return {"available": False}
    counts = {}
    for name in trace:
        key = scrub(name, 120)
        counts[key] = counts.get(key, 0) + 1
    top = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:200]
    return {
        "available": True,
        "recorded": len(trace),
        "distinct": len(counts),
        "capped": bool(last_round_n and len(trace) < last_round_n),
        "round_n_apis": last_round_n,
        "top": [{"api": k, "count": v} for k, v in top],
        "first": scrub_list(trace, 120, 40),
    }


def build_mirage(runs, baseline_apis):
    """六支樣本的 mirage 結果 -> 網站要用的結構。

    參考 run 的挑法：輪數最多的那一份；同輪數取 run id 最大（最新）的。
    這是決定性的規則，不是人工挑的 —— 重跑會得到同一份。
    """
    if not runs:
        return {"available": False}

    ref = max(runs, key=lambda o: (len(o.get("rounds") or []), o.get("run") or ""))

    rounds = []
    prev_scope = None
    prev_n = None
    for i, rd in enumerate(ref.get("rounds") or []):
        item = build_round(rd, prev_scope, prev_n, i)
        rounds.append(item)
        prev_scope = {x["api"] for x in item["api_scope"]}
        prev_n = item["n_apis"]

    oc = ref.get("outcome") or {}
    hc = ref.get("harness_completions") or {}

    values = [v for v in ([baseline_apis] + [r["n_apis"] for r in rounds]) if v and v > 0]
    lo, hi = (min(values), max(values)) if values else (0, 0)
    scale = "log" if (lo > 0 and hi / float(lo) >= LOG_SCALE_RATIO) else "linear"

    blind = []
    for api, field in (hc.get("blind_spots") or {}).items():
        blind.append({"api": scrub(api, 120), "field": scrub(str(field), 120)})

    others = []
    for run in runs:
        if run is ref:
            continue
        roc = run.get("outcome") or {}
        others.append({
            "run": scrub(run.get("run"), 64),
            "rounds": len(run.get("rounds") or []),
            "apis": [r.get("n_apis") or 0 for r in (run.get("rounds") or [])],
            "verdict": scrub(roc.get("verdict"), 48),
            "reason": scrub(roc.get("reason"), 64),
            "success": bool(roc.get("success")),
            "assisted": bool(roc.get("assisted")),
            "inconclusive": bool(roc.get("inconclusive")),
        })

    reason = scrub(oc.get("reason"), 64) or ""

    return {
        "available": True,
        "run": scrub(ref.get("run"), 64),
        "generated": scrub(ref.get("generated"), 48),
        "report_version": ref.get("report_version"),
        "partial": bool(ref.get("partial")),
        "n_runs": len(runs),
        "other_runs": others,
        "scale": scale,
        "max_apis": hi,
        "min_apis": lo,
        "baseline_apis": baseline_apis,
        "outcome": {
            "success": bool(oc.get("success")),
            "assisted": bool(oc.get("assisted")),
            "inconclusive": bool(oc.get("inconclusive")),
            "verdict": scrub(oc.get("verdict"), 48),
            "reason": reason,
            "reasons": scrub_list(oc.get("reasons"), 64, 8),
            "exit_meaning": scrub(oc.get("exit_meaning"), 200),
            "iterations": oc.get("iterations") or len(rounds),
            "synthesized_apis": scrub_list(oc.get("synthesized_apis"), 120, 64),
            "n_llm_failures": len(oc.get("llm_failures") or []),
            "n_plan_errors": len(oc.get("plan_errors") or []),
        },
        "final_profile": [
            {"key": scrub(str(k), 64),
             "value": scrub("、".join("%s=%s" % (a, b) for a, b in v.items())
                            if isinstance(v, dict) else str(v), 160)}
            for k, v in (ref.get("final_profile") or {}).items()
        ],
        "final_watchlist": scrub_list([api_key(x) for x in (ref.get("final_watchlist") or [])], 120, 64),
        "harness": {
            "answered_by_emulator": scrub_list(hc.get("answered_by_emulator"), 240, 32),
            "blind_spots": blind,
            "refused_to_llm": scrub_list(hc.get("refused_to_llm"), 120, 32),
            "filled": scrub_list(hc.get("filled"), 240, 32),
        },
        # injections：我方餵給樣本的罐頭內容。只留 API 名稱與大小，內容與雜湊不出境。
        "injections": [{
            "api": scrub(x.get("api"), 120),
            "size": x.get("size"),
        } for x in (ref.get("injections") or [])[:32]],
        "n_emulator_errors": len(ref.get("emulator_errors") or []),
        "n_damaged": len(ref.get("damaged") or []),
        "final_trace": build_final_trace(ref, rounds[-1]["n_apis"] if rounds else None),
        "rounds": rounds,
        "reason_info": OUTCOME_REASONS.get(reason),
        "notes": {
            "scope_caveat":
                "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 "
                "api_trace_final。所以這裡每一輪的「新增／消失的 API」是就"
                "「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、"
                "LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，"
                "不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。",
            "no_cumulative":
                "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是"
                "單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
        },
    }


# --------------------------------------------------------------------------
# 第三組：靜態情報餵給動態端（同批 A/B 對照）
# --------------------------------------------------------------------------
#
# 這一組跟前兩組的性質不同，要講清楚，否則圖表會被誤讀：
#
#   * 前兩組（純 Speakeasy / ＋動態）是不同時期、參數不一致的執行紀錄。
#   * 這一組是**同一天、同一批、其他參數固定**的配對實驗：同六支樣本各跑兩次，
#     一次空 profile + budget 60，一次用靜態報告派生的 profile + budget。
#
# 所以「第三組 vs 第二組」不能直接比 —— 能比的是這一組自己的 normal vs
# static-profile。網站上兩者要並排呈現，不能只放 static-profile 的數字。

def _descend_to_manifest(dirpath):
    """允許指到外層資料夾：`last/` 或 `last/last/` 都能找到 manifest.json。"""
    if os.path.isfile(os.path.join(dirpath, "manifest.json")):
        return dirpath
    for name in sorted(os.listdir(dirpath)) if os.path.isdir(dirpath) else []:
        cand = os.path.join(dirpath, name)
        if os.path.isfile(os.path.join(cand, "manifest.json")):
            return cand
    return dirpath


# `busy_desktop  <- ????:createtoolhelp32snapshot, process32first, process32next`
# 冒號左邊那段中文在來源檔就已經是 U+FFFD（Big5 -> UTF-8 的有損轉換，位元組
# 在寫檔前就毀了，任何編碼都解不回來）。右邊的 API 名單是 ASCII，還活著 ——
# 只取那一段，壞掉的散文不要送上網站。
_RE_DERIV = re.compile(r"^\s*([a-z_]+)\s*<-\s*(.*)$")
_RE_APIS = re.compile(r"[a-z][a-z0-9_]{3,}")


def parse_derivation_reasons(reasons):
    """把 generated-profiles.json 的 reasons 轉成 {旗標: [API 證據]}。"""
    out = {}
    for line in reasons or []:
        m = _RE_DERIV.match(str(line))
        if not m:
            continue
        flag = m.group(1)
        tail = m.group(2)
        # 冒號之後才是 API 名單；沒有冒號就整段掃
        if ":" in tail:
            tail = tail.split(":", 1)[1]
        apis = [a for a in _RE_APIS.findall(tail) if a != flag]
        out[flag] = scrub_list(apis, 120, 16)
    return out


def load_last(dirpath):
    """讀第三組。回傳 None 表示沒有這份資料（網站就退回「尚未取得」）。"""
    if not dirpath or not os.path.isdir(dirpath):
        return None
    root = _descend_to_manifest(dirpath)
    man_path = os.path.join(root, "manifest.json")
    if not os.path.isfile(man_path):
        return None
    man = read_json(man_path)
    if not man:
        return None

    profiles = {}
    prof_path = os.path.join(root, "static-profile", "generated-profiles.json")
    if os.path.isfile(prof_path):
        for p in (read_json(prof_path) or {}).get("profiles") or []:
            sha = p.get("sha256") or ""
            if sha:
                profiles[sha[:8]] = p

    runs = {}
    missing = []
    for rep in man.get("reports") or []:
        sha8 = (rep.get("sha_prefix")
                or (rep.get("sha256") or "")[:8])
        rel = (rep.get("json") or "").replace("/", os.sep)
        path = os.path.join(root, rel)
        if not sha8 or not os.path.isfile(path):
            missing.append(rel or "(無路徑)")
            continue
        obj = read_json(path)
        if not obj:
            missing.append(rel)
            continue
        runs.setdefault(sha8, {})[rep.get("mode")] = {
            "report": rep, "run": obj}
    for rel in missing:
        print("[-] 第三組缺這份 run：%s" % rel, file=sys.stderr)

    return {
        "root": root,
        "commit": scrub(man.get("commit"), 48),
        "generated_at": scrub(man.get("generated_at"), 48),
        "conditions": man.get("conditions") or {},
        "profiles": profiles,
        "runs": runs,
    }


# 兩組之間的差距要用一致的規則分級，不是我看圖說故事。
#   決定性：呼叫數變化 >= 5 倍，或末輪相異 API 多 >= 5 支
#   小幅　：呼叫數變化 >= 1.5 倍，或相異 API 多 >= 2 支
#   無變化：其餘（含逐筆相同）
HANDOFF_DECISIVE_RATIO = 5.0
HANDOFF_MINOR_RATIO = 1.5
HANDOFF_DECISIVE_DISTINCT = 5
HANDOFF_MINOR_DISTINCT = 2


def classify_handoff(ctl_deep, trt_deep, ctl_distinct, trt_distinct):
    ratio = 1.0
    if ctl_deep and trt_deep:
        ratio = max(ctl_deep, trt_deep) / float(min(ctl_deep, trt_deep))
    gain = (trt_distinct or 0) - (ctl_distinct or 0)
    if ratio >= HANDOFF_DECISIVE_RATIO or gain >= HANDOFF_DECISIVE_DISTINCT:
        return "decisive"
    if ratio >= HANDOFF_MINOR_RATIO or gain >= HANDOFF_MINOR_DISTINCT:
        return "minor"
    return "none"


def _mode_conditions(rep):
    prof = rep.get("actual_initial_profile") or {}
    return {
        "run": scrub(rep.get("run"), 64),
        "budget_seconds": rep.get("budget_seconds"),
        "max_iters": rep.get("max_iters"),
        "deadline_seconds": rep.get("deadline_seconds"),
        "profile_keys": scrub_list(sorted(prof.keys()), 64, 16),
        "profile_empty": not prof,
        "watchlist_seeded": bool(rep.get("watchlist_seeded")),
        # 驗證欄位：期望與實際的初始 profile 是否一致（不一致代表實驗沒照設計跑）
        "profile_as_designed":
            (rep.get("expected_initial_profile") or {}) == prof,
    }


def build_handoff(sha8, last, baseline_apis):
    if not last:
        return {"available": False, "why": "沒有第三組的資料來源"}
    pair = (last.get("runs") or {}).get(sha8) or {}
    ctl_rec, trt_rec = pair.get("normal"), pair.get("static-profile")
    if not ctl_rec or not trt_rec:
        have = "、".join(sorted(pair)) or "都沒有"
        return {"available": False,
                "why": "這一支的配對不完整（只有 %s）" % have}

    control = build_mirage([ctl_rec["run"]], baseline_apis)
    treated = build_mirage([trt_rec["run"]], baseline_apis)

    def deepest(m):
        vals = [r["n_apis"] for r in m.get("rounds") or [] if r.get("n_apis")]
        return max(vals) if vals else 0

    def distinct(m):
        return ((m.get("final_trace") or {}).get("distinct")
                or (m.get("final_trace") or {}).get("n_distinct") or 0)

    ctl_deep, trt_deep = deepest(control), deepest(treated)
    ctl_dist, trt_dist = distinct(control), distinct(treated)

    prof = (last.get("profiles") or {}).get(sha8) or {}
    watchlist = scrub_list([api_key(x) for x in
                            (prof.get("suggested_watchlist") or [])], 120, 64)
    seeded = bool(prof.get("watchlist_seeded"))

    derivation_flags = []
    evidence = parse_derivation_reasons(prof.get("reasons"))
    for k, v in sorted((prof.get("profile") or {}).items()):
        derivation_flags.append({
            "key": scrub(str(k), 64),
            "value": scrub(str(v), 32),
            "evidence": evidence.get(k) or [],
        })

    return {
        "available": True,
        "commit": last.get("commit"),
        "batch_generated_at": last.get("generated_at"),
        "control": control,
        "treated": treated,
        "conditions": {
            "control": _mode_conditions(ctl_rec["report"]),
            "treated": _mode_conditions(trt_rec["report"]),
        },
        "derivation": {
            # 靜態端派生出來的三樣東西，以及各自有沒有真的被用上
            "profile_flags": derivation_flags,
            "profile_applied": bool(prof.get("profile")),
            "budget_seconds": prof.get("budget_seconds"),
            "budget_applied": True,
            "suggested_watchlist": watchlist,
            "watchlist_seeded": seeded,
            # budget_reasons / reasons 的中文在來源檔就已經是 U+FFFD，救不回來，
            # 所以不送上網站；只送 API 證據（ASCII，沒壞）。
            "prose_lost_to_encoding": True,
        },
        "delta": {
            "deepest_control": ctl_deep,
            "deepest_treated": trt_deep,
            "distinct_control": ctl_dist,
            "distinct_treated": trt_dist,
            "verdict_control": (control.get("outcome") or {}).get("verdict"),
            "reason_control": (control.get("outcome") or {}).get("reason"),
            "verdict_treated": (treated.get("outcome") or {}).get("verdict"),
            "reason_treated": (treated.get("outcome") or {}).get("reason"),
            "iters_control": len(control.get("rounds") or []),
            "iters_treated": len(treated.get("rounds") or []),
            "classification": classify_handoff(ctl_deep, trt_deep,
                                               ctl_dist, trt_dist),
            "identical_rounds": [r["n_apis"] for r in control.get("rounds") or []]
                                == [r["n_apis"] for r in treated.get("rounds") or []],
        },
        "notes": {
            "pairing":
                "這兩欄是同一天、同一批、其他參數固定的配對執行：左邊空 profile "
                "＋ budget 60 秒，右邊用靜態報告派生的 profile ＋ budget。"
                "能互相比較的是這兩欄，不是拿右邊去比上面第二組 —— 那是不同批次、"
                "參數也不一樣。",
            "watchlist":
                "靜態端每一支都產出了建議 watchlist，但這一批的執行條件是"
                "「不預先種 optional watchlist」，所以那份清單沒有被套用。"
                "換句話說，靜態端三項輸出（profile／budget／watchlist）裡"
                "只有前兩項被測到。",
            "verdict":
                "判定字串不是分數。同一支樣本從 inconclusive 變成 "
                "unresolved/no_progress，指的是「停下來的理由不同」，"
                "不代表行為覆蓋變差 —— 要看呼叫數與相異 API 數。",
        },
    }


# --------------------------------------------------------------------------
# 轉換：靜態分析
# --------------------------------------------------------------------------

PIPELINE_STEPS = [
    ("pefile", "PE 結構解析"),
    ("diec", "加殼／編譯器偵測"),
    ("unpack", "自動解殼"),
    ("pyinstaller", "PyInstaller 解包"),
    ("floss", "字串抽取"),
    ("capa", "能力標籤"),
    ("yara", "自有規則比對"),
    ("ghidra", "反編譯"),
    ("unpack_verify", "解殼結果驗證"),
]


def pipeline_detail(key, intel):
    """每個步驟的一句話結果，全部從報告欄位讀，不重新計算。"""
    raw = intel.get("raw", {})
    der = intel.get("derived", {})
    if key == "pefile":
        n = (raw.get("pe") or {}).get("import_count")
        return "匯入 %d 個 API" % n if n is not None else ""
    if key == "diec":
        d = raw.get("diec") or {}
        hits = (d.get("packers") or []) + (d.get("protectors") or [])
        if hits:
            return "偵測到 " + "、".join(scrub_list(hits, 60, 8))
        return "未偵測到殼"
    if key == "pyinstaller":
        p = raw.get("pyinstaller") or {}
        if p.get("detected"):
            ver = scrub(p.get("python_version"), 32) or "版本不明"
            obf = scrub(p.get("obfuscator"), 32)
            txt = "Python %s，%d 個項目" % (ver, p.get("entry_count") or 0)
            if obf:
                txt += "，另有 %s 混淆" % obf
            return txt
        return ""
    if key == "floss":
        c = (raw.get("floss") or {}).get("counts") or {}
        total = sum(v for v in c.values() if isinstance(v, int))
        return "抽出 %d 條字串（內容未收錄於本站）" % total if total else ""
    if key == "capa":
        return "%d 項能力" % len(der.get("capabilities") or [])
    if key == "yara":
        return "%d 條規則命中" % len(der.get("yara_matches") or [])
    if key == "ghidra":
        g = raw.get("ghidra") or {}
        st = (g.get("stats") or {})
        if st.get("emitted") is not None:
            return "%d 個函式" % st["emitted"]
        return ""
    return ""


def build_pipeline(intel):
    tools = intel.get("tools") or {}
    steps = []
    for key, label in PIPELINE_STEPS:
        t = tools.get(key)
        if t is None:
            continue
        status = t.get("status") or "unknown"
        applicable = t.get("applicable")
        if status == "skipped" and applicable is False:
            mark = "n/a"
        elif status == "ok":
            mark = "ok"
        elif status == "skipped":
            mark = "skipped"
        else:
            mark = "fail"
        steps.append({
            "key": key,
            "label": label,
            "status": scrub(status, 32),
            "mark": mark,
            "applicable": applicable,
            "seconds": t.get("seconds"),
            "message": scrub(t.get("message"), 400),
            "detail": pipeline_detail(key, intel),
        })
    return steps


def build_pe(raw_pe):
    if not raw_pe:
        return None
    out = pick(raw_pe, (
        "arch", "declared_section_count", "dll_count", "entry_point",
        "file_entropy", "has_rich_header", "has_signature", "image_base",
        "imphash", "import_count", "is_dll", "is_dotnet", "is_driver",
        "machine", "subsystem", "timestamp", "timestamp_suspicious",
        "timestamp_utc",
    ))
    out["imphash"] = scrub(out.get("imphash"), 64)
    out["subsystem_name"] = scrub(raw_pe.get("subsystem_name"), 64)
    out["tls_callbacks"] = scrub_list(raw_pe.get("tls_callbacks"), 32, 64)
    out["packer_heuristics"] = scrub_list(raw_pe.get("packer_heuristics"), 200, 64)
    out["imports"] = scrub_list(raw_pe.get("imports"), 160, 2000)
    out["exports"] = scrub_list(raw_pe.get("exports"), 160, 500)
    out["delay_imports"] = scrub_list(raw_pe.get("delay_imports"), 160, 500)

    sections = []
    for s in (raw_pe.get("sections") or [])[:64]:
        item = pick(s, ("entropy", "executable", "raw_size", "readable",
                        "virtual_size", "writable"))
        item["name"] = scrub(s.get("name"), 32)
        item["characteristics"] = scrub(s.get("characteristics"), 32)
        sections.append(item)
    out["sections"] = sections

    resources = []
    for r in (raw_pe.get("resources") or [])[:64]:
        item = pick(r, ("entropy", "id", "size"))
        item["type"] = scrub(r.get("type"), 48)
        resources.append(item)
    out["resources"] = resources

    ov = raw_pe.get("overlay")
    out["overlay"] = pick(ov, ("entropy", "offset", "size")) if ov else None
    return out


def build_static(intel):
    der = intel.get("derived") or {}
    raw = intel.get("raw") or {}
    meta = intel.get("meta") or {}

    # ------------------------------------------------------------------
    # 安全：derived.untrusted 在這裡就被丟掉，後面完全不會碰到它。
    # ------------------------------------------------------------------
    anti = []
    for item in der.get("suspected_anti_analysis") or []:
        anti.append({
            "api": scrub(item.get("api"), 160),
            "categories": scrub_list(item.get("categories"), 48, 16),
            "source": scrub(item.get("source"), 32),
        })

    # C2：只輸出 defanged，不輸出 value / host。
    c2 = []
    for item in der.get("c2_candidates") or []:
        c2.append({
            "type": scrub(item.get("type"), 32),
            "defanged": scrub(item.get("defanged"), 200),
            "benign": bool(item.get("benign")),
            "source": scrub(item.get("source"), 32),
        })

    # YARA：只留規則名與命中條數，不留命中的字串內容。
    yara = []
    raw_matches = {m.get("rule"): m for m in ((raw.get("yara") or {}).get("matches") or [])}
    for rule in der.get("yara_matches") or []:
        m = raw_matches.get(rule) or {}
        yara.append({
            "rule": scrub(rule, 120),
            "n_strings": len(m.get("strings") or []),
        })

    diec = raw.get("diec") or {}
    detects = []
    for d in (diec.get("raw_detects") or [])[:32]:
        detects.append({
            "type": scrub(d.get("type"), 48),
            "name": scrub(d.get("name"), 96),
            "version": scrub(d.get("version"), 48),
            "info": scrub(d.get("info"), 96),
        })

    py = raw.get("pyinstaller") or {}
    ghidra = raw.get("ghidra") or {}

    return {
        "available": True,
        "schema_version": scrub(intel.get("schema_version"), 48),
        "meta": {
            "analyzed_at": scrub(meta.get("analyzed_at"), 48),
            "elapsed_seconds": meta.get("elapsed_seconds"),
            "gatherer_version": scrub(meta.get("gatherer_version"), 32),
            "gatherer_sha256": scrub(meta.get("gatherer_sha256"), 80),
            "content_sha256": scrub(meta.get("content_sha256"), 80),
        },
        "arch": scrub(der.get("arch"), 32),
        "is_dll": bool(der.get("is_dll")),
        "is_dotnet": bool(der.get("is_dotnet")),
        "is_packed": {
            "value": bool((der.get("is_packed") or {}).get("value")),
            "evidence": scrub_list((der.get("is_packed") or {}).get("evidence"), 200, 64),
        },
        "degraded": {
            "value": bool((der.get("degraded") or {}).get("value")),
            "note": scrub((der.get("degraded") or {}).get("note"), 400),
            "tools_not_ok": scrub_list((der.get("degraded") or {}).get("tools_not_ok"), 48, 32),
        },
        "suspected_anti_analysis": anti,
        "categories_present": scrub_list(der.get("categories_present"), 48, 32),
        "capabilities": scrub_list(der.get("capabilities"), 200, 256),
        "attack_techniques": scrub_list(der.get("attack_techniques"), 160, 128),
        "yara": yara,
        "c2": c2,
        "lab_networks": scrub_list(der.get("lab_networks"), 120, 64),
        "budget": {
            "seconds": der.get("suggested_budget_seconds"),
            "reasons": scrub_list(der.get("suggested_budget_reasons"), 240, 32),
        },
        "analysis_notes": scrub_list(der.get("analysis_notes"), 600, 32),
        "pe": build_pe(raw.get("pe")),
        "diec": {
            "compiler": scrub(diec.get("compiler"), 96),
            "linker": scrub(diec.get("linker"), 96),
            "is_packed": bool(diec.get("is_packed")),
            "packers": scrub_list(diec.get("packers"), 64, 16),
            "protectors": scrub_list(diec.get("protectors"), 64, 16),
            "detects": detects,
        },
        "pyinstaller": {
            "detected": bool(py.get("detected")),
            "python_version": scrub(py.get("python_version"), 32),
            "obfuscator": scrub(py.get("obfuscator"), 48),
            "entry_count": py.get("entry_count") or 0,
        },
        "ghidra": {
            "status": scrub(ghidra.get("status"), 32),
            "message": scrub(ghidra.get("message"), 400),
            "function_count": (ghidra.get("program") or {}).get("function_count"),
            "language": scrub((ghidra.get("program") or {}).get("language"), 64),
            "stats": pick(ghidra.get("stats") or {}, (
                "api_symbols_matched", "candidate_functions",
                "decompile_incomplete", "emitted", "entry_points_emitted",
            )),
        },
        # 只有數量，沒有字串內容。
        "floss_counts": {
            k: v for k, v in ((raw.get("floss") or {}).get("counts") or {}).items()
            if isinstance(v, int)
        },
        "pipeline": build_pipeline(intel),
    }


# --------------------------------------------------------------------------
# 組裝
# --------------------------------------------------------------------------

def build_sample(sha8, speak_pair, intel, mirage_runs, last=None):
    official = speak_pair["official"]
    speak = build_speakeasy(official, speak_pair["variant"])
    static = build_static(intel) if intel else {"available": False}
    dynamic = build_mirage(mirage_runs or [], speak["apis_total"])
    handoff = build_handoff(sha8, last, speak["apis_total"])

    meta = (intel or {}).get("meta") or {}
    target = meta.get("target") or ""
    ext = os.path.splitext(target)[1].lstrip(".").lower() or ("dll" if speak["is_dll"] else "exe")

    sample = {
        "id": sha8,
        "sha256": scrub(official.get("sha256"), 80),
        "sha1": scrub(meta.get("sha1"), 48),
        "md5": scrub(meta.get("md5"), 40),
        "size": meta.get("size"),
        "kind": ext,
        "speakeasy": speak,
        "static": static,
        "dynamic": dynamic,
        "handoff": handoff,
        "baseline_segments": build_baseline_segments(speak),
    }

    # 總覽表要用的攤平欄位
    st = static if static.get("available") else {}
    non_benign = [c for c in st.get("c2", []) if not c["benign"]]
    sample["summary"] = {
        "id": sha8,
        "arch": st.get("arch"),
        "is_dll": speak["is_dll"],
        "kind": ext,
        "size": meta.get("size"),
        "packed": (st.get("is_packed") or {}).get("value"),
        "verdict": speak["verdict"],
        "apis_total": speak["apis_total"],
        "emulation_seconds": speak["emulation_total_runtime"],
        "n_entry_points": len(speak["entry_points"]),
        "n_detections": len(st.get("suspected_anti_analysis", [])),
        "n_categories": len(st.get("categories_present", [])),
        "n_capabilities": len(st.get("capabilities", [])),
        "n_yara": len(st.get("yara", [])),
        "n_c2": len(st.get("c2", [])),
        "n_c2_non_benign": len(non_benign),
        "budget_seconds": (st.get("budget") or {}).get("seconds"),
        "degraded": (st.get("degraded") or {}).get("value"),
    }

    # 動態端（mirage）攤平到總覽。所有欄位照實 —— success 全部是 false。
    dyn = dynamic if dynamic.get("available") else {}
    doc = dyn.get("outcome") or {}
    rounds = dyn.get("rounds") or []
    sample["summary"].update({
        "mirage": bool(dyn),
        "mirage_rounds": len(rounds),
        "mirage_apis": [r["n_apis"] for r in rounds],
        "mirage_max_apis": dyn.get("max_apis"),
        "mirage_last_apis": rounds[-1]["n_apis"] if rounds else None,
        "mirage_success": doc.get("success"),
        "mirage_assisted": doc.get("assisted"),
        "mirage_inconclusive": doc.get("inconclusive"),
        "mirage_verdict": doc.get("verdict"),
        "mirage_reason": doc.get("reason"),
        "mirage_scale": dyn.get("scale"),
        "mirage_warned": any(w["kind"] == "bad" for r in rounds for w in r["warnings"]),
    })

    # 第三組攤平到總覽。available=False 時全部留 None —— 總覽表要顯示「—」，
    # 不是 0（0 會被讀成「量到了，結果是零」）。
    hd = handoff if handoff.get("available") else {}
    hdd = hd.get("delta") or {}
    hdv = hd.get("derivation") or {}
    sample["summary"].update({
        "handoff": bool(hd),
        "handoff_class": hdd.get("classification"),
        "handoff_deep_control": hdd.get("deepest_control"),
        "handoff_deep_treated": hdd.get("deepest_treated"),
        "handoff_distinct_control": hdd.get("distinct_control"),
        "handoff_distinct_treated": hdd.get("distinct_treated"),
        "handoff_reason_control": hdd.get("reason_control"),
        "handoff_reason_treated": hdd.get("reason_treated"),
        "handoff_profile_applied": hdv.get("profile_applied") if hd else None,
        "handoff_watchlist_seeded": hdv.get("watchlist_seeded") if hd else None,
        "handoff_n_watchlist": len(hdv.get("suggested_watchlist") or []) if hd else None,
        "handoff_budget_control": ((hd.get("conditions") or {})
                                   .get("control") or {}).get("budget_seconds"),
        "handoff_budget_treated": ((hd.get("conditions") or {})
                                   .get("treated") or {}).get("budget_seconds"),
    })
    return sample


TRACKS = [
    {
        "id": "speakeasy",
        "label": "純 Speakeasy 基線",
        "accent": "dynamic",
        "status": "available",
        "blurb": "把樣本丟進 Speakeasy 模擬器直接跑，沒有任何環境偽裝、沒有 LLM 介入。"
                 "這是對照組：反偵測的樣本會在這裡提早停下來。",
        "detail": "6 支樣本，每支一次執行。",
    },
    {
        "id": "dynamic",
        "label": "＋動態（mirage：LLM 即時捏造 API 回傳值）",
        "accent": "dynamic",
        "status": "available",
        "blurb": "同一批樣本改用 mirage 跑：內圈由 LLM 即時捏造模擬器沒實作的 API 回傳值，"
                 "外圈每一輪依中止原因修訂環境剖繪後整個重跑。",
        "detail": "6 支樣本都有資料。⚠️ 六支的 success 全部是 false、assisted 全部是 true —— "
                  "「跑得比較深」不等於「成功」，每一支的結果都有值是我們補的。",
    },
    {
        "id": "static_first",
        "label": "＋動態＋靜態（靜態報告餵給動態端）",
        "accent": "static",
        "status": "available",
        "blurb": "把靜態流水線派生的環境剖繪與模擬預算餵給動態端當起始條件。"
                 "這一組是配對實驗：同六支樣本、同一天、其他參數固定，"
                 "各跑一次「空 profile ＋ budget 60」與一次「靜態派生的 "
                 "profile ＋ budget」。",
        "detail": "6 支 × 2 種模式共 12 份 run。⚠️ 只有 profile 與 budget 被套用；"
                  "靜態端同時產出的建議 watchlist 因為執行條件是"
                  "「不預先種 optional watchlist」而沒有進場 —— "
                  "所以這是對交接機制的**部分**驗證，不是完整驗證。",
    },
]


# 第三組的分級標籤，前端與 method 頁共用同一份文字。
HANDOFF_CLASSES = {
    "decisive": {
        "label": "決定性改善",
        "blurb": "呼叫數變化 5 倍以上，或末輪相異 API 多 5 支以上。",
    },
    "minor": {
        "label": "小幅改善",
        "blurb": "呼叫數變化 1.5 倍以上，或末輪相異 API 多 2 支以上。",
    },
    "none": {
        "label": "無明顯變化",
        "blurb": "兩者差距在上述門檻以下，含逐筆完全相同。",
    },
}


def build_handoff_meta(samples, last):
    """第三組的整批摘要。沒有資料時明確標 available=False，不填零。"""
    hs = [s["handoff"] for s in samples if s["handoff"].get("available")]
    if not hs:
        return {"available": False,
                "why": "沒有第三組的配對資料" if not last else
                       "有資料來源但沒有任何一支湊成配對"}

    def count(cls):
        return sum(1 for h in hs if h["delta"]["classification"] == cls)

    n_seeded = sum(1 for h in hs if h["derivation"]["watchlist_seeded"])
    n_profile = sum(1 for h in hs if h["derivation"]["profile_applied"])
    n_designed = sum(1 for h in hs
                     if h["conditions"]["treated"]["profile_as_designed"]
                     and h["conditions"]["control"]["profile_as_designed"])
    n_identical = sum(1 for h in hs if h["delta"]["identical_rounds"])

    return {
        "available": True,
        "n_pairs": len(hs),
        "commit": hs[0].get("commit"),
        "batch_generated_at": hs[0].get("batch_generated_at"),
        "classes": HANDOFF_CLASSES,
        "n_decisive": count("decisive"),
        "n_minor": count("minor"),
        "n_none": count("none"),
        "n_profile_applied": n_profile,
        "n_watchlist_seeded": n_seeded,
        "n_profile_as_designed": n_designed,
        "n_identical_rounds": n_identical,
        # 兩組都是 success=false，這件事不能被「有改善」蓋掉
        "n_success_control": sum(
            1 for h in hs if (h["control"].get("outcome") or {}).get("success")),
        "n_success_treated": sum(
            1 for h in hs if (h["treated"].get("outcome") or {}).get("success")),
        "headline":
            "同一批、其他參數固定的配對實驗：%d 支裡 %d 支決定性改善、"
            "%d 支小幅改善、%d 支沒有變化。兩組的 success 都是 0/%d —— "
            "靜態情報改變的是「跑到哪」，不是「分析成功」。"
            % (len(hs), count("decisive"), count("minor"), count("none"),
               len(hs)),
        "caveat":
            "靜態端派生的三樣東西裡，profile 只有 %d 支拿到非空值、budget 全部套用、"
            "建議 watchlist %d 支被套用。所以沒有變化的那幾支不能推論成"
            "「靜態情報沒用」—— 最可能起作用的那一項根本沒進場。"
            % (n_profile, n_seeded),
    }


def main():
    ap = argparse.ArgumentParser(description="產生靜態網站的 data/")
    ap.add_argument("--speakeasy", default=DEFAULT_SPEAKEASY)
    ap.add_argument("--intel", default=DEFAULT_INTEL)
    ap.add_argument("--mirage", default=DEFAULT_MIRAGE)
    ap.add_argument("--last", default=DEFAULT_LAST)
    ap.add_argument("--out", default=DEFAULT_OUT)
    args = ap.parse_args()

    speak = load_speakeasy(args.speakeasy)
    intel = load_intel(args.intel)
    mirage = load_mirage(args.mirage)
    last = load_last(args.last)

    print("[*] Speakeasy 基線：%d 支" % len(speak))
    print("[*] 靜態報告：%d 支" % len(intel))
    print("[*] mirage 執行紀錄：%d 支 / 共 %d 份 run"
          % (len(mirage), sum(len(v) for v in mirage.values())))
    if last:
        print("[*] 第三組 A/B 對照：%d 支 / commit %s"
              % (len(last["runs"]), (last.get("commit") or "?")[:12]))
    else:
        print("[*] 第三組 A/B 對照：沒有資料（%s）" % args.last)

    samples = []
    for sha8 in sorted(speak):
        it = intel.get(sha8)
        if it is None:
            print("[!] %s 沒有對應的靜態報告" % sha8, file=sys.stderr)
        if sha8 not in mirage:
            print("[!] %s 沒有對應的 mirage 執行紀錄" % sha8, file=sys.stderr)
        samples.append(build_sample(sha8, speak[sha8], it, mirage.get(sha8),
                                    last))

    for sha8 in sorted(intel):
        if sha8 not in speak:
            print("[!] %s 有靜態報告但沒有 Speakeasy 結果" % sha8, file=sys.stderr)
    for sha8 in sorted(mirage):
        if sha8 not in speak:
            print("[!] %s 有 mirage 結果但沒有 Speakeasy 基線" % sha8, file=sys.stderr)

    # 逐支印出來，方便對照原始報告 —— 「網站上的數字跟報告不一樣」要當場看得出來。
    for s in samples:
        dyn = s["dynamic"]
        if not dyn.get("available"):
            print("    %s  基線 %-7s  mirage 無資料" % (s["id"], s["summary"]["apis_total"]))
            continue
        oc = dyn["outcome"]
        print("    %s  基線 %-7s  mirage %s  [%s]  success=%s assisted=%s  %s / %s"
              % (s["id"], "{:,}".format(s["summary"]["apis_total"]),
                 " → ".join("{:,}".format(r["n_apis"]) for r in dyn["rounds"]),
                 dyn["scale"], oc["success"], oc["assisted"],
                 oc["verdict"], oc["reason"]))

    # 第三組也逐支印，理由同上
    if last:
        print("[*] 第三組 normal vs static-profile：")
        for s in samples:
            h = s["handoff"]
            if not h.get("available"):
                print("    %s  %s" % (s["id"], h.get("why")))
                continue
            d = h["delta"]
            print("    %s  %-9s  最深 %s → %s   相異 %s → %s   %s → %s"
                  % (s["id"], HANDOFF_CLASSES[d["classification"]]["label"],
                     "{:,}".format(d["deepest_control"]),
                     "{:,}".format(d["deepest_treated"]),
                     d["distinct_control"], d["distinct_treated"],
                     d["reason_control"], d["reason_treated"]))

    n_guard = sum(1 for s in samples
                  if (s["dynamic"].get("outcome") or {}).get("reason")
                  in ("no_progress", "no_behaviour_change"))

    bundle = {
        "schema": "ais3-site/2",
        "generated_at": datetime.datetime.now(datetime.timezone.utc)
                        .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "generator": "tools/build-data.py",
        "tracks": TRACKS,
        "mirage_meta": {
            "n_samples": sum(1 for s in samples if s["dynamic"].get("available")),
            "n_success": sum(1 for s in samples
                             if (s["dynamic"].get("outcome") or {}).get("success")),
            "n_assisted": sum(1 for s in samples
                              if (s["dynamic"].get("outcome") or {}).get("assisted")),
            "n_inconclusive": sum(1 for s in samples
                                  if (s["dynamic"].get("outcome") or {}).get("inconclusive")),
            "n_stopped_by_guard": n_guard,
            "n_log_scale": sum(1 for s in samples if s["dynamic"].get("scale") == "log"),
            "reason_labels": OUTCOME_REASONS,
            "round_verdicts": ROUND_VERDICTS,
            "outcome_verdicts": OUTCOME_VERDICTS,
            "scope_source_labels": SCOPE_SOURCE_LABELS,
            "headline":
                "六支樣本的 mirage 結果，success 全部是 false、assisted 全部是 true。"
                "「跑得比較深」不是「分析成功」—— 每一支都至少有一個值是我們補的或編的。",
        },
        "handoff_meta": build_handoff_meta(samples, last),
        # 這裡刻意不列出被排除的欄位名稱 —— 那些名稱本身就是 audit() 的黑名單，
        # 寫進來會讓「grep data/ 應該一無所獲」這個驗證失去意義。
        # 完整的排除清單寫在 method.html 與這支腳本開頭的 docstring。
        "security": {
            "policy": "白名單輸出：只有 tools/build-data.py 明確列出的欄位會進到這份檔案。",
            "note": "樣本可控的內容（抽取出的字串、反編譯輸出、模擬期間的記憶體字串、"
                    "API 的字串引數、逐指令軌跡與原始位元組）整區排除；"
                    "C2 一律以 defanged 形式呈現；本站沒有任何樣本原始位元組。"
                    "LLM 的診斷文字有收錄，但視為不可信文字：路徑抹掉、URL scheme defang、"
                    "前端只用 textContent 輸出。",
            "filter_location": "tools/build-data.py",
            "audit": "產生時已自動掃過輸出，確認黑名單欄位與明文 URL scheme 都不存在。",
        },
        "samples": samples,
    }

    os.makedirs(args.out, exist_ok=True)
    payload = json.dumps(bundle, ensure_ascii=False, indent=1, sort_keys=True)

    audit(payload, bundle)

    bundle_path = os.path.join(args.out, "bundle.json")
    with open(bundle_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(payload)
        fh.write("\n")

    js_path = os.path.join(args.out, "data.js")
    with open(js_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("/* 由 tools/build-data.py 產生，內容與 bundle.json 相同。\n")
        fh.write("   用途：以 file:// 直接開啟時 fetch() 會被 CORS 擋掉，改用這一份。 */\n")
        fh.write("window.DATA = ")
        fh.write(payload)
        fh.write(";\n")
        fh.write("window.__BUNDLE__ = window.DATA;\n")

    print("[+] %s (%.1f KB)" % (bundle_path, os.path.getsize(bundle_path) / 1024.0))
    print("[+] %s (%.1f KB)" % (js_path, os.path.getsize(js_path) / 1024.0))
    print("[+] 安全檢查通過（%d 個黑名單欄位、明文 URL scheme、絕對路徑三項都掃過）"
          % len(FORBIDDEN_KEYS))


def walk_keys(node, path="$"):
    if isinstance(node, dict):
        for k, v in node.items():
            yield path, k
            yield from walk_keys(v, path + "." + str(k))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from walk_keys(v, path + "[%d]" % i)


def walk_values(node, key_wanted, path="$"):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == key_wanted and isinstance(v, str):
                yield path + "." + k, v
            yield from walk_values(v, key_wanted, path + "." + str(k))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from walk_values(v, key_wanted, path + "[%d]" % i)


def audit(payload, bundle):
    """輸出前自己驗一次。任何一項不過就直接中止，不寫檔。"""
    problems = []

    for path, key in walk_keys(bundle):
        if key in FORBIDDEN_KEYS:
            problems.append("禁用欄位 %s.%s" % (path, key))

    # LLM 的診斷是唯一一段「自由文字」，所以單獨再驗一次：
    # 引文、檔名、IP、網域、絕對路徑都不該在裡面。
    for path, text in walk_values(bundle, "llm_diagnosis"):
        for name, pat in (("引文", QUOTED), ("檔名", FILENAME), ("IPv4", IPV4),
                          ("網域", DOMAIN), ("Windows 路徑", WIN_PATH),
                          ("Unix 路徑", NIX_PATH)):
            m = pat.search(text)
            if m:
                problems.append("%s 的 LLM 診斷仍含%s：%r" % (path, name, m.group(0)[:60]))

    lowered = payload.lower()
    for needle in ("untrusted", "in_memory_strings", "decompiled", "arg_strings",
                   "traceback", "tail_trace"):
        if needle in lowered:
            problems.append("輸出字串中出現 %r" % needle)

    # 未 defang 的 IOC 不該出現在輸出裡。用「明文 scheme」與「未括號的點」當訊號。
    if "http://" in lowered or "https://" in lowered:
        problems.append("輸出含未 defang 的 URL scheme")

    # 分析機／模擬器的絕對路徑不該出現。使用者名稱就是從這裡漏的。
    if WIN_PATH.search(payload):
        problems.append("輸出含 Windows 絕對路徑：%r" % WIN_PATH.search(payload).group(0)[:80])
    if NIX_PATH.search(payload):
        problems.append("輸出含 Unix 絕對路徑：%r" % NIX_PATH.search(payload).group(0)[:80])

    # 憑證：這個站是公開的，任何看起來像 key 的字串都不該在裡面。
    for pat in (r"sk-[A-Za-z0-9_\-]{12,}", r"AKIA[0-9A-Z]{12,}",
                r"(?i)\b(api[_-]?key|secret|bearer)\b\s*[:=]"):
        m = re.search(pat, payload)
        if m:
            problems.append("輸出疑似含憑證：%r" % m.group(0)[:40])

    if problems:
        for p in problems:
            print("[FAIL] %s" % p, file=sys.stderr)
        raise SystemExit("安全檢查未通過，沒有寫出任何檔案")


if __name__ == "__main__":
    main()
