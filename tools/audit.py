#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""audit.py —— 發佈前稽核（A 資料外洩 / B 前端注入 / C GitHub Pages 可用性）

這個站會推到公開的 GitHub Pages。資料來源是惡意程式樣本與 LLM 輸出，
兩者都不可信，所以「推上去之前」要有一支能重複執行的閘門。

用法:
    py tools/audit.py                 # 稽核 repo 根目錄（tools/ 的上一層）
    py tools/audit.py --root <dir>
    py tools/audit.py --quiet         # 只印 FAIL/WARN

退出碼:
    0  沒有發現，或只有 INFO
    1  有 WARN（建議修，不一定擋發佈）
    2  有 FAIL（必須修掉才能推上去）

設計上的兩個原則:

  1. 這支腳本本身不含任何敏感字串明文。使用者名稱不寫死 —— 用一般化的
     路徑樣式（`<碟>:\\Users\\`、`/mnt/<x>/Users/`、`/home/<user>` …）比對，
     另外從執行環境取當前使用者名稱當額外的比對字串。
     所以把 audit.py 自己推上去也不會洩漏任何東西。

  2. A 類的資料檢查跑在**解析後的 JSON 值**上，不是純文字比對 ——
     這樣 `AdjustTokenPrivileges` 這種 Windows API 名稱不會被誤判成憑證。
"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import re
import sys

# --------------------------------------------------------------------------
# 設定
# --------------------------------------------------------------------------

TEXT_EXT = {".html", ".js", ".json", ".css", ".py", ".md", ".txt", ".svg", ".yml", ".yaml"}
SKIP_DIRS = {".git", ".github", "node_modules", "__pycache__", ".venv", "venv"}

# 二進位樣本的魔術位元組。任何一個出現在檔案開頭就是樣本混進來了。
BINARY_MAGIC = [
    (b"MZ", "PE/DOS 執行檔 (MZ)"),
    (b"PK\x03\x04", "ZIP/壓縮檔"),
    (b"\x7fELF", "ELF 執行檔"),
    (b"Rar!", "RAR 壓縮檔"),
    (b"\xd0\xcf\x11\xe0", "OLE 複合文件"),
    (b"\x1f\x8b", "gzip"),
    (b"7z\xbc\xaf", "7-Zip"),
]

# ---- A1 本機路徑 / 使用者名稱 -------------------------------------------
PATH_PATTERNS = [
    (r"[A-Za-z]:[\\/]{1,2}Users[\\/]", "Windows 使用者目錄絕對路徑"),
    (r"/mnt/[a-z]/Users/", "WSL 掛載的 Windows 使用者目錄"),
    (r"/home/[A-Za-z0-9_.-]+/", "Linux 家目錄絕對路徑"),
    (r"/opt/ais3", "分析機 /opt/ais3 路徑"),
    (r"/root/", "Linux root 家目錄"),
    (r"[A-Za-z]:[\\/]{1,2}(?:Desktop|Downloads|Documents)[\\/]", "Windows 個人資料夾路徑"),
    (r"\\\\[A-Za-z0-9_.-]+\\[A-Za-z0-9_$.-]+", "UNC 網路分享路徑"),
]

# ---- A2 憑證 --------------------------------------------------------------
# 只抓「看起來真的是憑證」的形狀，避免 Windows API 名稱（OpenProcessToken 等）誤報。
CRED_PATTERNS = [
    (r"\bsk-[A-Za-z0-9_-]{8,}", "OpenAI 樣式金鑰 (sk-)"),
    (r"\bsk-ant-[A-Za-z0-9_-]{8,}", "Anthropic 樣式金鑰"),
    (r"\bghp_[A-Za-z0-9]{20,}", "GitHub personal access token"),
    (r"\bgh[pousr]_[A-Za-z0-9]{20,}", "GitHub token"),
    (r"\bAKIA[0-9A-Z]{16}\b", "AWS access key id"),
    (r"\bBearer\s+[A-Za-z0-9._\-]{12,}", "Bearer token"),
    (r"(?i)\b(api[_-]?key|apikey|access[_-]?token|auth[_-]?token|secret[_-]?key|"
     r"client[_-]?secret|password|passwd|passphrase)\b\s*[:=]\s*"
     r"[\"']?[A-Za-z0-9!@#$%^&*._\-/+]{6,}", "賦值形式的憑證"),
    (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "私鑰 PEM 區塊"),
    (r"(?i)\bxox[baprs]-[A-Za-z0-9-]{10,}", "Slack token"),
    (r"(?i)\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.", "JWT"),
]

# ---- A3 未 defang 的 C2 ---------------------------------------------------
# 要求 scheme 後面至少接一個主機字元，否則 `"http://"` 這種單純的字串常數
# （defang 實作裡的 replace 來源）會被誤判成 IOC。
LIVE_URL = re.compile(r"(?<![a-zA-Z])(?<!hxx)(https?)://[A-Za-z0-9]", re.I)
BARE_IPV4 = re.compile(r"(?<![\d.\[])((?:\d{1,3}\.){3}\d{1,3})(?![\d.\]])")
TLDS = (r"com|net|org|ru|cn|top|xyz|info|biz|io|cc|su|onion|me|pw|club|site|"
        r"online|shop|live|link|tk|ml|ga|cf|gq|uk|de|fr|jp|kr|tw|br|in|ir|ua")
BARE_DOMAIN = re.compile(r"(?<![\w.\[])([a-z0-9][a-z0-9-]{1,62}(?:\.[a-z0-9-]{1,62})*\.(?:" + TLDS + r"))(?![\w\]])", re.I)

# 這些不是 IOC，是程式碼裡本來就有的東西。
URL_ALLOW = (
    "http://www.w3.org/",        # SVG / XML namespace，不會發出請求
    "http://localhost",          # 錯誤訊息裡教使用者跑 http.server
    "https://localhost",
    "http://127.0.0.1",
)
DOMAIN_ALLOW = {
    "w3.org", "www.w3.org",
    "schemas.microsoft.com",     # 只會以 defanged 形式出現；這裡是保險
    "build-data.py", "audit.py", "style.css", "app.js", "index.js",
    "sample.js", "bundle.json", "data.js",
}
# 副檔名長得像 TLD 的檔名（*.io / *.me …）不算網域
FILENAME_LIKE = re.compile(r"\.(py|js|json|css|html|md|txt|cfg|ini|exe|dll|sys|bin|dat|log|yml|yaml)$", re.I)

# ---- A4 樣本衍生的原始文字 ------------------------------------------------
# 這些 key 不管出現在 JSON 的哪一層都算失敗。與 build-data.py 的
# FORBIDDEN_KEYS 對齊，另外補上 C2 的未 defang 欄位。
FORBIDDEN_KEYS = {
    "untrusted": "樣本可控的原始內容區塊",
    "in_memory_strings": "記憶體字串內容",
    "decompiled": "反編譯輸出",
    "decompiled_functions": "反編譯函式清單",
    "strings": "抽出的字串內容（只應保留 counts）",
    "strings_dropped": "字串抽取的中間產物",
    "classified": "分類過的字串內容",
    "source_path": "分析機上的樣本絕對路徑",
    "argv": "工具執行的完整命令列",
    "tool_path": "工具的絕對路徑",
    "stderr_tail": "工具 stderr（常含絕對路徑）",
    "cmdline": "命令列",
    "command": "命令列",
    "functions": "Ghidra 函式清單",
    "matches": "YARA 命中細節（含字串內容）",
}
# c2 項目裡只允許 defanged；value/host 是未 defang 的原形。
C2_FORBIDDEN_SUBKEYS = {"value", "host", "raw", "url"}

# ---- B 前端注入 -----------------------------------------------------------
# 預編：這些會對每一個 .js／.html 的每一行各跑一次，data.js 就有一萬九千行。
_SINKS = [
    (r"\.innerHTML\s*(?:\+)?=", "innerHTML 指派"),
    (r"\.outerHTML\s*(?:\+)?=", "outerHTML 指派"),
    (r"\binsertAdjacentHTML\s*\(", "insertAdjacentHTML"),
    (r"\bdocument\s*\.\s*write(?:ln)?\s*\(", "document.write"),
    (r"(?<![.\w])eval\s*\(", "eval"),
    (r"\bnew\s+Function\s*\(", "new Function"),
    (r"\bsetTimeout\s*\(\s*[\"']", "setTimeout 字串形式"),
    (r"\bsetInterval\s*\(\s*[\"']", "setInterval 字串形式"),
    (r"\.srcdoc\s*=", "iframe srcdoc"),
    (r"javascript:", "javascript: URL"),
    (r"\bdangerouslySetInnerHTML\b", "React dangerouslySetInnerHTML"),
    (r"\$\(\s*[^)]*\)\s*\.\s*(?:html|append|prepend|after|before)\s*\(", "jQuery HTML 注入"),
]
SINK_PATTERNS = [(re.compile(p), why) for p, why in _SINKS]
# 行內事件處理器（HTML）
INLINE_EVENT = re.compile(r"\son(?:click|load|error|mouseover|focus|submit|change)\s*=", re.I)


# --------------------------------------------------------------------------
# 結果收集
# --------------------------------------------------------------------------

class Findings:
    ORDER = {"FAIL": 0, "WARN": 1, "INFO": 2}

    def __init__(self):
        self.items = []

    def add(self, level, cat, path, line, msg, excerpt=""):
        self.items.append({
            "level": level, "cat": cat, "path": path,
            "line": line, "msg": msg, "excerpt": excerpt,
        })

    def fail(self, *a, **k):  self.add("FAIL", *a, **k)
    def warn(self, *a, **k):  self.add("WARN", *a, **k)
    def info(self, *a, **k):  self.add("INFO", *a, **k)

    def count(self, level):
        return sum(1 for i in self.items if i["level"] == level)


def clip(s, n=140):
    s = str(s).replace("\n", "\\n").replace("\r", "")
    return s if len(s) <= n else s[:n] + "…"


# --------------------------------------------------------------------------
# 檔案走訪
# --------------------------------------------------------------------------

def walk_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            full = os.path.join(dirpath, fn)
            yield full, os.path.relpath(full, root).replace("\\", "/")


def read_text(path):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return fh.read()
    except (UnicodeDecodeError, OSError):
        return None


def extract_data_js(raw):
    """從 data.js 取出 `DATA = {...}` 的物件。

    檔尾可能還有別的敘述（例如 `window.__BUNDLE__ = window.DATA;` 這種別名），
    所以用大括號配對抓出第一個完整物件，不能直接 rstrip(';') 後整段丟給 json。
    """
    m = re.search(r"(?:window\s*\.\s*)?DATA\s*=\s*", raw)
    if not m:
        return None, "找不到 DATA 指派"
    i = raw.find("{", m.end())
    if i < 0:
        return None, "DATA 後面找不到物件"
    depth, in_str, esc, quote = 0, False, False, ""
    for j in range(i, len(raw)):
        c = raw[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == quote:
                in_str = False
            continue
        if c in "\"'":
            in_str, quote = True, c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(raw[i:j + 1]), None
                except Exception as exc:
                    return None, "JSON 解析失敗：%s" % exc
    return None, "大括號沒有配對完成"


def load_bundle(root, fnd):
    """回傳 (obj, 相對路徑) 清單：bundle.json 與 data.js 都解析成物件。"""
    out = []

    bj = os.path.join(root, "data", "bundle.json")
    if os.path.isfile(bj):
        try:
            with open(bj, "r", encoding="utf-8") as fh:
                out.append((json.load(fh), "data/bundle.json"))
        except Exception as exc:
            fnd.fail("A", "data/bundle.json", 0, "JSON 解析失敗：%s" % exc)
    else:
        fnd.warn("A", "data/bundle.json", 0, "檔案不存在")

    dj = os.path.join(root, "data", "data.js")
    if os.path.isfile(dj):
        raw = read_text(dj) or ""
        obj, err = extract_data_js(raw)
        if err:
            fnd.fail("A", "data/data.js", 0, "%s，前端 file:// 備援會壞掉" % err)
        else:
            out.append((obj, "data/data.js"))
    else:
        fnd.warn("A", "data/data.js", 0, "檔案不存在（file:// 開啟時會失效）")

    return out


def iter_json_strings(obj, path="$"):
    """走訪 JSON，yield (json路徑, key, 字串值)。也 yield key 本身供 key 檢查。"""
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = "%s.%s" % (path, k)
            yield ("KEY", p, k)
            yield from iter_json_strings(v, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from iter_json_strings(v, "%s[%d]" % (path, i))
    elif isinstance(obj, str):
        yield ("VAL", path, obj)


def line_of(text, needle):
    """在原始檔字面上找 needle 第一次出現的行號（找不到回 0）。"""
    if not text or not needle:
        return 0
    idx = text.find(needle[:80])
    if idx < 0:
        return 0
    return text.count("\n", 0, idx) + 1


# --------------------------------------------------------------------------
# A. 資料外洩
# --------------------------------------------------------------------------

def extra_user_needles():
    """從執行環境取使用者名稱當額外比對字串 —— 不寫死在檔案裡。"""
    needles = set()
    for v in (getpass.getuser() if hasattr(getpass, "getuser") else None,
              os.environ.get("USERNAME"), os.environ.get("USER"),
              os.environ.get("LOGNAME")):
        if v and len(v) >= 3 and v.lower() not in {"user", "root", "admin", "runner"}:
            needles.add(v)
    home = os.path.expanduser("~")
    if home and len(home) > 3:
        needles.add(os.path.basename(home.rstrip("\\/")))
    return {n for n in needles if len(n) >= 3}


def check_a_text_files(root, fnd, user_needles):
    """A1/A2/A3：對所有文字檔做逐行掃描。

    這支腳本自己不列入 A1~A3 的字面掃描 —— 掃描器本來就必須內含它要找的
    樣式，掃自己一定會誤報。它仍然會被 A5（二進位）與 C 類檢查涵蓋，
    而且腳本裡刻意不寫死任何真實的使用者名稱或憑證。
    """
    self_path = os.path.abspath(__file__)
    for full, rel in walk_files(root):
        ext = os.path.splitext(rel)[1].lower()
        if ext not in TEXT_EXT:
            continue
        if os.path.abspath(full) == self_path:
            fnd.info("A1", rel, 0, "掃描器自身，不列入 A1~A3 字面掃描（內含比對樣式）")
            continue
        text = read_text(full)
        if text is None:
            continue
        for ln, line in enumerate(text.splitlines(), 1):
            # A1 本機路徑
            for pat, why in PATH_PATTERNS:
                m = re.search(pat, line)
                if m:
                    fnd.fail("A1", rel, ln, "本機路徑外洩：%s" % why, clip(line.strip()))
            for needle in user_needles:
                # 使用者名稱只在「像路徑」的上下文才算 —— 避免誤報。
                if re.search(r"[\\/]%s[\\/]" % re.escape(needle), line):
                    fnd.fail("A1", rel, ln, "路徑中含本機使用者名稱", clip(line.strip()))
            # A2 憑證
            for pat, why in CRED_PATTERNS:
                if re.search(pat, line):
                    fnd.fail("A2", rel, ln, "疑似憑證：%s" % why, clip(line.strip()))
            # A3 未 defang 的 URL（程式碼裡的 namespace / localhost 除外）
            for m in LIVE_URL.finditer(line):
                seg = line[m.start():m.start() + 60]
                if any(seg.startswith(a) or a in line[max(0, m.start() - 2):m.start() + 40]
                       for a in URL_ALLOW):
                    continue
                lvl = fnd.fail if ext in {".json", ".js"} and "/data/" in "/" + rel else fnd.warn
                lvl("A3", rel, ln, "未 defang 的 URL scheme（應寫成 hxxp://）", clip(line.strip()))


def check_a_json(bundles, root, fnd, user_needles):
    """A1~A4：跑在解析後的 JSON 值上，準確度比純文字高。"""
    for obj, rel in bundles:
        raw = read_text(os.path.join(root, rel)) or ""
        for kind, jpath, val in iter_json_strings(obj):

            # ---- A4 黑名單 key ----
            if kind == "KEY":
                if val in FORBIDDEN_KEYS:
                    fnd.fail("A4", rel, line_of(raw, '"%s"' % val),
                             "出現黑名單欄位 `%s`（%s） 於 %s"
                             % (val, FORBIDDEN_KEYS[val], jpath))
                if ".c2[" in jpath and val in C2_FORBIDDEN_SUBKEYS:
                    fnd.fail("A4", rel, line_of(raw, '"%s"' % val),
                             "C2 項目含未 defang 欄位 `%s` 於 %s" % (val, jpath))
                continue

            ln = line_of(raw, val)

            # ---- A1 路徑 ----
            for pat, why in PATH_PATTERNS:
                if re.search(pat, val):
                    fnd.fail("A1", rel, ln, "值含本機路徑（%s）於 %s" % (why, jpath), clip(val))
            for needle in user_needles:
                if re.search(r"[\\/]%s[\\/]" % re.escape(needle), val):
                    fnd.fail("A1", rel, ln, "值含本機使用者名稱 於 %s" % jpath, clip(val))

            # ---- A2 憑證 ----
            for pat, why in CRED_PATTERNS:
                if re.search(pat, val):
                    fnd.fail("A2", rel, ln, "值疑似憑證（%s）於 %s" % (why, jpath), clip(val))

            # ---- A3 未 defang 的 IOC ----
            if LIVE_URL.search(val) and not any(a in val for a in URL_ALLOW):
                fnd.fail("A3", rel, ln, "值含未 defang 的 URL 於 %s" % jpath, clip(val))
            for m in BARE_IPV4.finditer(val):
                ip = m.group(1)
                octets = ip.split(".")
                if all(0 <= int(o) <= 255 for o in octets):
                    fnd.fail("A3", rel, ln,
                             "值含未 defang 的 IPv4 於 %s（應寫成 1[.]2[.]3[.]4）" % jpath, clip(val))
            for m in BARE_DOMAIN.finditer(val):
                dom = m.group(1).lower()
                if dom in DOMAIN_ALLOW or FILENAME_LIKE.search(dom):
                    continue
                fnd.fail("A3", rel, ln,
                         "值含未 defang 的網域 `%s` 於 %s（應寫成 xxx[.]com）" % (dom, jpath), clip(val))

            # ---- A4 疑似樣本衍生的長文字 ----
            if len(val) > 2000:
                fnd.warn("A4", rel, ln,
                         "異常長的字串（%d 字元）於 %s —— 確認不是樣本抽出的內容"
                         % (len(val), jpath), clip(val, 80))


# LLM 自由文字欄位：白名單過濾管不到這裡。模型讀了樣本的軌跡之後寫出來的
# 散文，可能把樣本裡的字串原封不動引述出來（MessageBox 文字、檔名、環境變數
# 名稱…）。欄位層級的白名單擋不住這條路徑，所以另外抓。
LLM_TEXT_KEYS = re.compile(r"(?i)(llm|diagnosis|rationale|explanation|analysis_text|summary_text)")
# 開頭的引號前面不能是字母／數字，結尾的引號後面也不能是 —— 否則
# 「emulator's default … the emulator's」這種所有格撇號會被兩兩配成一對，
# 把整段散文誤判成被引述的字串。
QUOTED_LITERAL = re.compile(r"(?<![\w])['\"‘“]([\x20-\x7e]{3,80}?)['\"’”](?!\w)")


def check_a_llm_text(bundles, root, fnd):
    """A6：LLM 診斷文字裡被引述的樣本字串。

    這是啟發式檢查，所以是 WARN 不是 FAIL —— 需要人看過才能判定。
    重點在於這條管道**不受欄位白名單保護**：樣本作者可以在自己的
    MessageBox 文字裡塞受害者資料或針對讀報告的 LLM 寫的注入指令，
    模型把它引述進診斷，就會原封不動publish 出去。
    """
    for obj, rel in bundles:
        raw = read_text(os.path.join(root, rel)) or ""
        for kind, jpath, val in iter_json_strings(obj):
            if kind != "VAL":
                continue
            leaf = jpath.rsplit(".", 1)[-1]
            if not LLM_TEXT_KEYS.search(leaf):
                continue
            quotes = [q for q in QUOTED_LITERAL.findall(val) if not q.strip().isdigit()]
            if quotes:
                fnd.warn("A6", rel, line_of(raw, val),
                         "LLM 自由文字引述了 %d 段字面字串於 %s —— "
                         "若來自樣本（MessageBox 文字、檔名、環境變數名），"
                         "等於繞過欄位白名單把樣本可控內容發佈出去，需人工確認"
                         % (len(quotes), jpath),
                         " | ".join(clip(q, 60) for q in quotes[:6]))


def check_a_binaries(root, fnd):
    """A5：目錄裡不可以有樣本本體。"""
    for full, rel in walk_files(root):
        try:
            with open(full, "rb") as fh:
                head = fh.read(8)
        except OSError:
            continue
        if not head:
            continue
        for magic, why in BINARY_MAGIC:
            if head.startswith(magic):
                fnd.fail("A5", rel, 0, "二進位檔混入站台目錄：%s" % why)
        ext = os.path.splitext(rel)[1].lower()
        if ext in {".exe", ".dll", ".sys", ".bin", ".zip", ".7z", ".rar", ".gz", ".dat", ".vir", ".sample"}:
            fnd.fail("A5", rel, 0, "可疑的樣本副檔名 `%s`" % ext)


# --------------------------------------------------------------------------
# B. 前端注入
# --------------------------------------------------------------------------

def strip_js_comments(text):
    """把註解換成等長空白，讓行號不變、但註解裡的字不會誤報。"""
    out = []
    i, n = 0, len(text)
    mode = None  # None | 'line' | 'block' | 'str'
    quote = ""
    while i < n:
        c = text[i]
        nxt = text[i + 1] if i + 1 < n else ""
        if mode is None:
            if c == "/" and nxt == "/":
                mode = "line"; out.append("  "); i += 2; continue
            if c == "/" and nxt == "*":
                mode = "block"; out.append("  "); i += 2; continue
            if c in "\"'`":
                mode = "str"; quote = c; out.append(c); i += 1; continue
            out.append(c); i += 1
        elif mode == "line":
            if c == "\n":
                mode = None; out.append("\n")
            else:
                out.append(" ")
            i += 1
        elif mode == "block":
            if c == "*" and nxt == "/":
                mode = None; out.append("  "); i += 2; continue
            out.append("\n" if c == "\n" else " "); i += 1
        else:  # str
            if c == "\\":
                out.append("  "); i += 2; continue
            if c == quote:
                mode = None
            out.append(c); i += 1
    return "".join(out)


def check_b(root, fnd):
    for full, rel in walk_files(root):
        ext = os.path.splitext(rel)[1].lower()
        if ext not in {".js", ".html"}:
            continue
        text = read_text(full)
        if text is None:
            continue
        scan = strip_js_comments(text) if ext == ".js" else text
        # splitlines() 必須在迴圈外。原本 `text.splitlines()` 寫在迴圈裡、
        # 而且一行被呼叫兩次，等於每一行都把整個檔案重切一遍 —— data.js 有
        # 一萬九千行、474 KB，那是 18 GB 的字串搬運，實測 142 秒。資料量翻倍
        # 時間變四倍，所以第三組上線把它從「幾秒」推成「兩分鐘」。
        raw_lines = text.splitlines()
        for ln, line in enumerate(scan.splitlines(), 1):
            raw_line = raw_lines[ln - 1] if ln - 1 < len(raw_lines) else line
            for pat, why in SINK_PATTERNS:
                if pat.search(line):
                    fnd.fail("B", rel, ln,
                             "把資料寫進不安全的 sink：%s（資料來自惡意樣本與 LLM，皆不可信）" % why,
                             clip(raw_line.strip()))
            if ext == ".html" and INLINE_EVENT.search(line):
                fnd.warn("B", rel, ln, "HTML 行內事件處理器", clip(raw_line.strip()))


# --------------------------------------------------------------------------
# C. GitHub Pages 可用性
# --------------------------------------------------------------------------

REF_RE = re.compile(r"""(?:src|href)\s*=\s*["']([^"']+)["']""", re.I)
JS_REF_RE = re.compile(r"""["']((?:data|js|css|assets|img)/[A-Za-z0-9._/-]+|[A-Za-z0-9._-]+\.html)["']""")
CSS_URL_RE = re.compile(r"""url\(\s*["']?([^"')]+)["']?\s*\)""", re.I)
EXTERNAL_RE = re.compile(r"""(?:src|href)\s*=\s*["'](?:https?:)?//([^/"']+)""", re.I)


def check_c(root, fnd):
    # --- C1 .nojekyll ---
    if os.path.isfile(os.path.join(root, ".nojekyll")):
        fnd.info("C1", ".nojekyll", 0, "存在（底線開頭的檔案不會被 Jekyll 吃掉）")
    else:
        fnd.fail("C1", ".nojekyll", 0,
                 "缺少 .nojekyll —— GitHub Pages 會跑 Jekyll，底線開頭的檔案與目錄會被忽略")

    # --- 實際檔案清單（保留原始大小寫） ---
    actual = set()
    for _full, rel in walk_files(root):
        actual.add(rel)
    lower_map = {}
    for a in actual:
        lower_map.setdefault(a.lower(), a)

    def resolve(base_dir, ref):
        """把引用解析成相對 root 的路徑；外部/錨點回 None。"""
        if not ref or ref.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
            return None
        if re.match(r"^(?:https?:)?//", ref) or re.match(r"^[a-z][a-z0-9+.-]*:", ref, re.I):
            return None
        clean = ref.split("?")[0].split("#")[0]
        if not clean:
            return None
        if clean.startswith("/"):
            return ("ABS", clean.lstrip("/"))
        joined = os.path.normpath(os.path.join(base_dir, clean)).replace("\\", "/")
        return ("REL", joined)

    def check_ref(rel, ln, ref, line, base_dir=None):
        """base_dir 是「瀏覽器解析這個引用時的基準目錄」（相對 root）。

        HTML/CSS 的引用以自己所在目錄為基準；但 .js 裡的路徑是給
        `fetch()` / `<script src>` 用的，基準是**載入它的頁面**所在目錄，
        本站所有頁面都在根目錄，所以 js 的基準是 root 而不是 js/。
        """
        if base_dir is None:
            base_dir = os.path.dirname(rel)
        # --- C3 外部資源 ---
        if re.match(r"^(?:https?:)?//", ref):
            host = re.sub(r"^(?:https?:)?//", "", ref).split("/")[0]
            fnd.fail("C3", rel, ln,
                     "引用外部網域資源 `%s` —— Pages 上可能被擋，也會造成第三方追蹤" % host,
                     clip(line))
            return
        r = resolve(base_dir, ref)
        if r is None:
            return
        kind, target = r
        # --- C2 絕對路徑 ---
        if kind == "ABS":
            fnd.warn("C2", rel, ln,
                     "絕對路徑 `%s` —— 推到 user.github.io 根目錄可行，"
                     "但放到 project pages（/repo/ 子路徑）會全部壞掉；建議統一用相對路徑" % ref,
                     clip(line))
        # --- C4 檔案存在 + C5 大小寫 ---
        if target in actual:
            return
        if target.lower() in lower_map:
            fnd.fail("C5", rel, ln,
                     "大小寫不符：引用 `%s`，實際檔名是 `%s`。"
                     "Windows 不分大小寫但 GitHub Pages 的 Linux 分 —— 上線後會 404"
                     % (target, lower_map[target.lower()]), clip(line))
        else:
            fnd.fail("C4", rel, ln, "引用了不存在的檔案 `%s`" % target, clip(line))

    # --- 掃 HTML ---
    for full, rel in walk_files(root):
        ext = os.path.splitext(rel)[1].lower()
        text = read_text(full)
        if text is None:
            continue
        if ext == ".html":
            for ln, line in enumerate(text.splitlines(), 1):
                for m in REF_RE.finditer(line):
                    check_ref(rel, ln, m.group(1), line.strip())
        elif ext == ".css":
            for ln, line in enumerate(text.splitlines(), 1):
                if "@import" in line:
                    fnd.warn("C3", rel, ln, "CSS @import —— 確認不是外部資源", clip(line.strip()))
                for m in CSS_URL_RE.finditer(line):
                    check_ref(rel, ln, m.group(1), line.strip())
        elif ext == ".js":
            # js 裡的路徑基準是載入它的頁面（本站頁面都在根目錄），不是 js/
            for ln, line in enumerate(text.splitlines(), 1):
                for m in JS_REF_RE.finditer(line):
                    check_ref(rel, ln, m.group(1), line.strip(), base_dir="")

    # --- C6 data.js 與 bundle.json 必須同步 ---
    bj = os.path.join(root, "data", "bundle.json")
    dj = os.path.join(root, "data", "data.js")
    if os.path.isfile(bj) and os.path.isfile(dj):
        try:
            with open(bj, "r", encoding="utf-8") as fh:
                b = json.load(fh)
            d, err = extract_data_js(read_text(dj) or "")
            if err:
                raise ValueError(err)
            if json.dumps(b, sort_keys=True, ensure_ascii=False) != \
               json.dumps(d, sort_keys=True, ensure_ascii=False):
                fnd.fail("C6", "data/data.js", 0,
                         "data.js 的內容與 bundle.json 不一致 —— "
                         "以 file:// 開啟與以 http:// 開啟會看到不同的數據")
            else:
                fnd.info("C6", "data/data.js", 0, "與 bundle.json 內容一致")
        except Exception as exc:
            fnd.warn("C6", "data/data.js", 0, "無法比對兩份資料：%s" % exc)

    # --- C7 前端會取用、但資料裡不存在的欄位（會丟 TypeError 讓整頁掛掉） ---
    check_c7_fields(root, fnd)

    # --- C8 說明文字裡的 python 呼叫方式 ---
    check_c8_python_invocation(root, fnd)


# 只抓「真的在叫直譯器」的寫法：python 後面接 -m 或某個 .py。
# 這樣 `python:socket` 這種 API 名稱、散文裡的「Python 3.13」都不會誤報。
PY_INVOKE = re.compile(r"(?<![\w.\-/\\])(python3?)\s+(-m\s+[\w.]+|[\w./\\-]+\.py)")

# 同樣的形狀，但直譯器是 `py`（Windows 的 launcher，唯一不會被 Store stub 攔的）
PY_LAUNCHER = re.compile(r"(?<![\w.\-/\\])py\s+(-m\s+[\w.]+|[\w./\\-]+\.py)")

# `python3` 本身在 Linux／CI 上是對的寫法。真正該警告的是「只寫了 python3、
# 沒有同時給 Windows 的 py」。所以往上下各看幾行：附近有 py 的替代寫法就放行。
# 不這樣做的話，一份正確地把兩種平台都寫清楚的文件反而會被自己的稽核擋下來。
#
# 視窗要多大：文件裡把兩種平台分開寫時，中間會夾著小標題與 code fence 的
# 前後兩行 —— README 實測是隔 6 行。設 8 行容得下這種寫法，又不會寬到把
# 文件另一節裡孤立的 `python3` 也一起放過。
PY_HINT_WINDOW = 8


def check_c8_python_invocation(root, fnd):
    """C8：說明文字裡叫 Python 的方式。

    這台 Windows 上 `python` 與 `python3` 都指到 Microsoft Store 的
    App Execution Alias（0 byte reparse point）：跑下去沒有任何輸出、
    退出碼 9009／49，看起來像「指令跑完了但什麼都沒發生」。
    """
    self_path = os.path.abspath(__file__)
    for full, rel in walk_files(root):
        ext = os.path.splitext(rel)[1].lower()
        if ext not in {".html", ".js", ".py", ".md", ".txt"}:
            continue
        if os.path.abspath(full) == self_path:
            continue
        text = read_text(full)
        if text is None:
            continue
        lines = text.splitlines()
        # 哪幾行提供了 `py` 的替代寫法
        has_py = set(ln for ln, line in enumerate(lines, 1)
                     if PY_LAUNCHER.search(line))
        for ln, line in enumerate(lines, 1):
            if line.lstrip().startswith("#!"):
                continue
            nearby = any(n in has_py
                         for n in range(ln - PY_HINT_WINDOW,
                                        ln + PY_HINT_WINDOW + 1))
            if nearby:
                continue
            for m in PY_INVOKE.finditer(line):
                exe = m.group(1)
                fnd.warn("C8", rel, ln,
                         "說明文字用 `%s ...` 叫直譯器 —— 這台 Windows 上 `python` 與 "
                         "`python3` 都指到 Microsoft Store 的 App Execution Alias，"
                         "會靜默失敗（無輸出、退出碼 9009／49）。"
                         "建議標明 `py`（Windows）／`python3`（Linux／CI）兩種寫法" % exe,
                         clip(line.strip()))


# 前端會直接存取（`.length` 或索引）而且沒有 null 檢查的欄位。
# 資料格式一改就會整頁白掉，所以列成硬檢查 —— 但**必須跟著 schema 版本走**，
# 否則 schema 升級時反而是這支腳本在誤報。
#
# 每個版本：{"sample": [(欄位, 型別)], "static": [欄位], "sample_any": [(候選欄位…)]}
SCHEMA_REQUIREMENTS = {
    "ais3-site/1": {
        "sample": [("id", str), ("summary", dict), ("speakeasy", dict),
                   ("static", dict), ("iterations", list)],
        "static": ["available", "is_packed", "diec", "suspected_anti_analysis",
                   "categories_present", "capabilities", "attack_techniques",
                   "yara", "c2", "lab_networks", "budget", "analysis_notes", "meta"],
    },
    "ais3-site/2": {
        # v2 把 `iterations` 換成 `dynamic`（mirage 外圈）+ `baseline_segments`
        "sample": [("id", str), ("summary", dict), ("speakeasy", dict),
                   ("static", dict), ("dynamic", dict), ("baseline_segments", list)],
        "static": ["available", "is_packed", "diec", "suspected_anti_analysis",
                   "categories_present", "capabilities", "attack_techniques",
                   "yara", "c2", "lab_networks", "budget", "analysis_notes", "meta"],
        "top": ["mirage_meta"],
    },
}


def check_c7_fields(root, fnd):
    bj = os.path.join(root, "data", "bundle.json")
    if not os.path.isfile(bj):
        return
    try:
        with open(bj, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except Exception:
        return

    schema = data.get("schema")
    req = SCHEMA_REQUIREMENTS.get(schema)
    if req is None:
        fnd.warn("C7", "data/bundle.json", 0,
                 "schema `%s` 不在已知清單裡，跳過前端必要欄位檢查 —— "
                 "請在 audit.py 的 SCHEMA_REQUIREMENTS 補上這個版本，"
                 "否則資料格式改動不會被擋下" % schema)
        return
    fnd.info("C7", "data/bundle.json", 0, "依 schema `%s` 檢查前端必要欄位" % schema)

    for key in req.get("top", []):
        if key not in data:
            fnd.fail("C7", "data/bundle.json", 0,
                     "頂層缺少 `%s` —— 前端查表會拿到 undefined" % key)

    for i, s in enumerate(data.get("samples", [])):
        sid = s.get("id", "#%d" % i)
        for key, typ in req["sample"]:
            if key not in s:
                fnd.fail("C7", "data/bundle.json", 0,
                         "樣本 %s 缺少 `%s` —— 前端會丟 TypeError，整頁顯示載入失敗" % (sid, key))
            elif not isinstance(s[key], typ):
                fnd.fail("C7", "data/bundle.json", 0,
                         "樣本 %s 的 `%s` 型別不符（預期 %s）" % (sid, key, typ.__name__))
        st = s.get("static", {})
        if isinstance(st, dict) and st.get("available"):
            for key in req["static"]:
                if key not in st:
                    fnd.fail("C7", "data/bundle.json", 0,
                             "樣本 %s 的 static 缺少 `%s` —— sample.js 會直接存取它的 .length"
                             % (sid, key))


# --------------------------------------------------------------------------
# 主程式
# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="發佈前安全與正確性稽核")
    ap.add_argument("--root", default=None, help="站台根目錄（預設：本檔案的上一層）")
    ap.add_argument("--quiet", action="store_true", help="只印 FAIL 與 WARN")
    args = ap.parse_args()

    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.abspath(args.root) if args.root else os.path.dirname(here)

    fnd = Findings()
    needles = extra_user_needles()

    print("=" * 78)
    print("發佈前稽核  root = %s" % root)
    print("=" * 78)

    bundles = load_bundle(root, fnd)

    check_a_text_files(root, fnd, needles)
    check_a_json(bundles, root, fnd, needles)
    check_a_llm_text(bundles, root, fnd)
    check_a_binaries(root, fnd)
    check_b(root, fnd)
    check_c(root, fnd)

    # ---- 輸出 ----
    cats = {
        "A1": "A 資料外洩 · 本機路徑／使用者名稱",
        "A2": "A 資料外洩 · 憑證",
        "A3": "A 資料外洩 · 未 defang 的 C2 指標",
        "A4": "A 資料外洩 · 樣本衍生的原始文字",
        "A5": "A 資料外洩 · 樣本二進位檔",
        "A6": "A 資料外洩 · LLM 自由文字引述的樣本字串",
        "B":  "B 前端注入",
        "C1": "C Pages · .nojekyll",
        "C2": "C Pages · 絕對路徑",
        "C3": "C Pages · 外部資源",
        "C4": "C Pages · 引用不存在的檔案",
        "C5": "C Pages · 檔名大小寫",
        "C6": "C Pages · 資料副本同步",
        "C7": "C Pages · 前端必要欄位",
        "C8": "C Pages · 文件裡的 python 呼叫方式",
    }

    shown = [i for i in fnd.items if not (args.quiet and i["level"] == "INFO")]
    shown.sort(key=lambda i: (Findings.ORDER[i["level"]], i["cat"], i["path"], i["line"]))

    if not shown:
        print("\n沒有任何發現。")
    for cat in sorted(cats):
        rows = [i for i in shown if i["cat"] == cat]
        if not rows:
            continue
        print("\n---- %s ----" % cats[cat])
        for i in rows:
            loc = "%s:%d" % (i["path"], i["line"]) if i["line"] else i["path"]
            print("  [%s] %s" % (i["level"], loc))
            print("        %s" % i["msg"])
            if i["excerpt"]:
                print("        > %s" % i["excerpt"])

    nf, nw, ni = fnd.count("FAIL"), fnd.count("WARN"), fnd.count("INFO")
    print("\n" + "=" * 78)
    print("結果：FAIL %d · WARN %d · INFO %d" % (nf, nw, ni))
    if nf:
        print("判定：不可發佈 —— 先修掉上面的 FAIL。")
        print("=" * 78)
        return 2
    if nw:
        print("判定：可發佈，但上面的 WARN 建議先處理。")
        print("=" * 78)
        return 1
    print("判定：通過。")
    print("=" * 78)
    return 0


if __name__ == "__main__":
    sys.exit(main())
