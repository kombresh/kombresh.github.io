# AIS3 惡意程式分析專題 —— 資料瀏覽站

一個純靜態網站，把專題的分析結果攤開來看。沒有後端、沒有打包工具、沒有任何外部
CDN 資源 —— `git push` 之後 GitHub Pages 直接就是成品。

專題本身有兩半：

- **靜態分析** —— 不執行樣本，只讀位元組。PE 結構、加殼偵測與自動解殼、字串抽取、
  能力標籤、自有 YARA 規則、依 API 交叉引用挑函式反編譯。產出「這支樣本會檢查哪些
  環境特徵」「C2 候選」「建議的模擬預算」。
- **動態分析（mirage）** —— 在 Speakeasy 模擬器裡跑，從不原生執行。內圈在每一次
  Windows API 呼叫上決定回什麼值（模擬器沒實作的就問 LLM），外圈每一輪跑完依中止
  原因修訂環境剖繪後整支重跑。

這個站要回答的問題只有一個：**多花的力氣，換到多少行為。**

---

## 三組數據

同一批六支真實樣本（取自 MalwareBazaar），逐步加條件：

| | 這一組做了什麼 | 狀態 |
|---|---|---|
| ① 純 Speakeasy | 什麼都不做，直接丟進模擬器 | 有資料 |
| ② ＋動態（mirage） | LLM 即時捏造 API 回傳值 ＋ 每輪修訂環境剖繪 | 有資料 |
| ③ ＋動態＋靜態 | 靜態報告派生的環境剖繪與模擬預算餵給動態端 | 有資料 |

樣本：`21080a1c`、`336e6c68`、`4ab7b0dd`、`787f2b0c`、`9787788d`、`c6a4ffb8`

### ① ② 和 ③ 不能直接比

**③ 是另一個批次、另一組參數**，所以它自己帶了一組同批的對照組。

`21080a1c` 是最好的例子：它在 ② 的最深一輪是 199,941 次呼叫，在 ③ 的
`normal` 欄是 88,254 次 —— 這兩個數字是**同一個游標輪詢迴圈撞上呼叫上限**，
差別只在那一批的預算與上限設定。把它們並排在一條軸上，讀者會把批次差異算成
靜態情報的功勞。

所以樣本詳情頁有**兩張圖**：第一張只放 ① 與 ② 的每一輪；第二張是 ③ 的配對圖，
`normal`（空 profile ＋ budget 60）與 `static-profile`（靜態派生的 profile ＋
budget）逐輪並排。

---

## 結果，照實寫

### ② ＋動態

- `success = true`：**0 / 6**
- `assisted = true`：**6 / 6** —— 每一支都至少有一個值是我們補的或編的
- `inconclusive`：5 / 6
- 被防空轉守衛停下來（`no_progress` / `no_behaviour_change`）：4 / 6
- 需要對數刻度（輪與輪之間跨兩到三個數量級）：2 支

**「跑得比較深」不等於「分析成功」。** 長條變高代表樣本被推著多跑了一段，
不代表那條軌跡可信。

### ③ ＋動態＋靜態

配對批次 `2026-07-30`，mirage commit `263283d`，6 支 × 2 模式 = 12 份 run。

- **決定性改善 2 / 6**
  - `21080a1c`：最深呼叫數 88,254 → **1,182**，末輪相異 API 54 → **63**
  - `4ab7b0dd`：最深呼叫數 13 → **27**，末輪相異 API 9 → **21**
- 小幅改善 0 / 6
- 無明顯變化 4 / 6（其中 2 支逐輪數字完全相同）
- 兩組的 `success` 都是 **0 / 6**
- 初始 profile 與設計一致：**6 / 6**（`expected` 與 `actual` 逐份核對過）

`21080a1c` 那個 profile（`busy_desktop` + `mouse_activity`）是靜態端自己從樣本會
呼叫 `getcursorpos`、`createtoolhelp32snapshot` / `process32first` /
`process32next` 推出來的。套用之後第 2 輪新增了 `createtoolhelp32snapshot`、
`process32first`、`process32next`、`regopenkeyexw`、`getsystemmetrics` ——
行程列舉與虛擬機偵測那條鏈。呼叫數掉 75 倍，行為覆蓋反而多 9 支。

### ③ 是「部分驗證」，不是完整驗證

靜態端派生三樣東西：**環境剖繪、模擬預算、建議 watchlist**。那一批只套用了前兩項：

- 拿到非空 profile：**1 / 6**（其餘五支的靜態報告沒有足以支撐旗標的檢測點，
  只有模擬預算被改）
- 建議 watchlist 已套用：**0 / 6** —— 產生了 1～9 條，但那批的執行條件是
  「不預先種 optional watchlist」

所以**不能從「4 支沒變」推論靜態情報沒用**。對那四支來說，watchlist 正是唯一
可能起作用的機制（例如 `787f2b0c` 的建議清單裡就有 `gettickcount`、
`queryperformancecounter`、`isdebuggerpresent`，剛好是時間與除錯器檢查）。
下一個該做的實驗，就是把 watchlist 也接上去。

### 分級是規則算的，不是看圖說的

| 分級 | 門檻 |
|---|---|
| 決定性改善 | 最深呼叫數變化 ≥ 5 倍，或末輪相異 API 多 ≥ 5 支 |
| 小幅改善 | 變化 ≥ 1.5 倍，或相異 API 多 ≥ 2 支 |
| 無明顯變化 | 門檻以下（含逐筆完全相同） |

門檻是 `tools/build-data.py` 裡的常數，標籤文字也由它產生 —— 前端只決定顏色。
改門檻整站的分級會一起變，不會出現「文字說有效、數字說沒差」。

---

## 這個站放了什麼、沒放什麼

資料來源是**惡意程式樣本與 LLM 輸出，兩者都不可信**。所以輸出是白名單制：
只有 `tools/build-data.py` 明確列出的欄位會進到 `data/`。

**沒有放：**

- 任何樣本的原始位元組（這支腳本從頭到尾沒有開過樣本檔）
- FLOSS 抽出的字串內容、Ghidra 反編譯輸出、YARA match 的 `strings`
- 模擬期間的記憶體字串、API 的字串引數、逐指令軌跡
- 工具執行的完整命令列、工具路徑、來源檔絕對路徑（會洩漏使用者名稱）

**放了但當成不可信文字處理：** LLM 的診斷（`llm_diagnosis_UNVERIFIED`）—— 去控制
字元、截長度、URL scheme 一律 defang、絕對路徑一律抹掉。C2 只以 defanged 形式
呈現。前端**一律用 `textContent` 輸出，不碰 `innerHTML`**。

安全邊界只有一處：`tools/build-data.py`。前端不做過濾。

---

## 本機跑起來

任何靜態伺服器都可以。**Windows 上請用 `py`**：

```bash
py -m http.server 8000
```

Linux / macOS：

```bash
python3 -m http.server 8000
```

> **Windows 上不要用 `python` 或 `python3`。** 那兩個名字會被 Microsoft Store 的
> App Execution Alias 攔下（一個 0 bytes 的 reparse point），**沒有任何輸出、
> 退出碼 9009 或 49** —— 看起來像跑完了，其實根本沒執行。

不想起伺服器也行：直接用瀏覽器開 `index.html`。`fetch()` 在 `file://` 下會被 CORS
擋掉，前端會自動改載 `data/data.js`（同一份內容包成 `window.DATA`）。

---

## 重新產生資料

```bash
py tools/build-data.py
```

四個來源目錄預設在 **`page/` 的上一層**，也可以用環境變數或參數指定：

| 內容 | 參數 | 環境變數 | 預設資料夾 |
|---|---|---|---|
| ① 純 Speakeasy 基線 | `--speakeasy` | `AIS3_SPEAKEASY` | `only-speakeasy` |
| 靜態分析報告 | `--intel` | `AIS3_INTEL` | `test/reports` |
| ② mirage 執行紀錄 | `--mirage` | `AIS3_MIRAGE` | `speakeasy+llm` |
| ③ 配對批次 | `--last` | `AIS3_LAST` | `last` |

```bash
py tools/build-data.py --speakeasy <dir> --intel <dir> --mirage <dir> --last <dir> --out <dir>
```

產出 `data/bundle.json` 與 `data/data.js`（同一份內容，後者是 `file://` 用的
fallback）。兩者**必須同步** —— `tools/audit.py` 會檢查。

腳本裡刻意不寫任何含使用者名稱的絕對路徑，因為這個檔案本身會被 GitHub Pages
送出去。

---

## 發佈前稽核

```bash
py tools/audit.py
```

| 退出碼 | 意思 |
|---|---|
| `0` | 沒有發現，或只有 INFO |
| `1` | 有 WARN（建議修，不一定擋發佈） |
| `2` | 有 FAIL（**必須修掉才能推上去**） |

檢查四類：

- **A 資料外洩** —— 本機路徑與使用者名稱、憑證樣式、未 defang 的 C2、
  樣本衍生的原始文字、混進目錄的二進位檔
- **B 前端注入** —— `innerHTML` / `outerHTML` / `insertAdjacentHTML` /
  `document.write` / `eval` / `new Function` 的指派
- **C GitHub Pages 可用性** —— `.nojekyll`、外部資源、引用了不存在的檔案、
  **檔名大小寫**（Windows 不分、Pages 的 Linux 分）、`data.js` 與
  `bundle.json` 是否同步、schema 必要欄位
- **D 敘述正確性** —— 人工項目，寫在 `method.html`

`--root <dir>` 換稽核目錄，`--quiet` 只印 FAIL / WARN。

---

## 檔案結構

```
.nojekyll             缺了的話底線開頭的檔案會被 Jekyll 吃掉
index.html            總覽：三組數據、樣本卡片、跨樣本總覽表
sample.html           單支樣本詳情（?id=<sha8>）
method.html           方法說明：怎麼讀圖、三組的差別、排除了哪些欄位
css/style.css         深色／淺色都可讀，手機寬度不橫向捲動
js/app.js             載入資料、格式化、共用元件
js/index.js           總覽頁
js/sample.js          詳情頁（含兩張圖與可點的展開面板）
data/bundle.json      網站資料（schema ais3-site/2）
data/data.js          同內容，file:// 用的 fallback
tools/build-data.py   產生 data/ —— 安全邊界就是這一支
tools/audit.py        發佈前稽核，可重複執行
```

---

## 已知的限制

- **逐輪的完整 API 軌跡沒有留存。** run 報告只帶最後一輪的 `api_trace_final`，
  所以展開面板裡每一輪的「新增／消失的 API」是就「外圈那一輪實際碰到的 API 名單」
  算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。
- **有些軌跡被截斷。** 超過上限的部分不會出現在報告裡，網站會標明那一輪的
  完整呼叫數與實際留存筆數。
- **長條不是累積的。** 迭代之間的 API 數不是單調遞增（本批最明顯的是
  13 → 28 → 14），累積畫法在數字下降時沒有意義。
- **兩支需要對數刻度**，網站上用紅字標示。對數刻度下長條的視覺高度差
  **不等於**倍數差 —— 看數字。
- **判定字串不是分數。** 同一支從 `inconclusive` 變成 `unresolved/no_progress`
  指的是「停下來的理由不同」，不代表行為覆蓋變差。
- ③ 的來源檔 `generated-profiles.json` 裡，派生理由的中文在**來源端就已經是
  U+FFFD**（Big5 → UTF-8 的有損轉換，任何編碼都解不回來）。網站只取冒號右邊的
  API 證據，壞掉的散文不上站。

---

## 樣本

樣本檔案**不在這個 repo 裡，也不會在**。它們只存在專用的分析環境中，
靜態端從不執行它們，動態端只在 Speakeasy 模擬器內執行。所有動態報告都經過
VM 的白名單匯出流程，原始樣本與 raw run 沒有移出過 VM。
