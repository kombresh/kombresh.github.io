/* 由 tools/build-data.py 產生，內容與 bundle.json 相同。
   用途：以 file:// 直接開啟時 fetch() 會被 CORS 擋掉，改用這一份。 */
window.DATA = {
 "generated_at": "2026-07-29T21:05:40Z",
 "generator": "tools/build-data.py",
 "mirage_meta": {
  "headline": "六支樣本的 mirage 結果，success 全部是 false、assisted 全部是 true。「跑得比較深」不是「分析成功」—— 每一支都至少有一個值是我們補的或編的。",
  "n_assisted": 6,
  "n_inconclusive": 5,
  "n_log_scale": 2,
  "n_samples": 6,
  "n_stopped_by_guard": 4,
  "n_success": 0,
  "outcome_verdicts": {
   "inconclusive": {
    "kind": "bad",
    "label": "不可採信"
   },
   "resolved": {
    "kind": "ok",
    "label": "有結論"
   },
   "unresolved": {
    "kind": "bad",
    "label": "沒有結論"
   }
  },
  "reason_labels": {
   "clean": {
    "kind": "ok",
    "label": "這一輪正常結束",
    "why": "這一次模擬跑到樣本自己結束，沒有中途卡住。"
   },
   "crash_after_llm_answer": {
    "kind": "bad",
    "label": "拿到 LLM 答案之後崩潰",
    "why": "模型回答之後樣本走進了一段跑不動的記憶體。"
   },
   "llm_call_failed": {
    "kind": "bad",
    "label": "LLM 端點失敗",
    "why": "這一輪要問模型的問題沒有拿到答案（逾時或回了不能用的內容）。這一輪的數字是端點故障下的產物，不是分析成果。"
   },
   "llm_declared_arity": {
    "kind": "bad",
    "label": "參數個數是 LLM 宣告的",
    "why": "未實作 API 的堆疊參數個數由模型宣告，沒有權威來源可以對照。"
   },
   "max_iters": {
    "kind": "warn",
    "label": "用完迭代次數上限",
    "why": "跑到指定的最大輪數就停了 —— 不代表已經沒有東西可挖。"
   },
   "no_behaviour_change": {
    "kind": "warn",
    "label": "連續兩輪行為沒有變化",
    "why": "外圈的守衛看到這一輪跟上一輪的軌跡指紋一樣，判定再跑也不會不同，主動停手。這是被守衛停下來的，不是樣本自然跑完。"
   },
   "no_progress": {
    "kind": "warn",
    "label": "連續輪次沒有推進",
    "why": "外圈判定這幾輪沒有把樣本推到更深的地方，停止繼續迭代。同樣是被守衛停下來的，不是收斂。"
   },
   "synthesised_data_import": {
    "kind": "bad",
    "label": "依賴了合成的資料匯入值",
    "why": "被匯入的其實是變數而不是函式，我們給了一個值。那個值是編的，所以這一輪標成 inconclusive。"
   },
   "synthesized_unimplemented_api": {
    "kind": "bad",
    "label": "依賴了合成的未實作 API",
    "why": "模擬器沒實作的 API，回傳值是我們合成的。合成值無法驗證，所以這一輪一律降級成 inconclusive。"
   }
  },
  "round_verdicts": {
   "bailed": {
    "kind": "warn",
    "label": "樣本自己收工",
    "why": "樣本自己走到結束，但沒有做出我們在等的行為。"
   },
   "inconclusive": {
    "kind": "bad",
    "label": "不可採信",
    "why": "這一輪有某個值是我們補的或編的，結果不能當成樣本的行為證據。"
   }
  },
  "scope_source_labels": {
   "args": "這一輪帶了字串引數",
   "conv": "呼叫慣例被改對",
   "raise": "API 派送中途拋例外",
   "sig": "LLM 宣告參數個數",
   "synth": "合成回答（模擬器沒實作）",
   "watch": "攔截清單（LLM 要求接管）"
  }
 },
 "samples": [
  {
   "baseline_segments": [
    {
     "apis_tail": [],
     "error": {},
     "label": "tls_callback_0",
     "n_apis": 0,
     "start_addr": "0x14001d700"
    },
    {
     "apis_tail": [
      "kernel32.GetProcessHeap",
      "kernel32.LoadLibraryExW",
      "kernel32.GetProcAddress",
      "kernel32.EnterCriticalSection",
      "kernel32.VirtualProtect",
      "kernel32.VirtualProtect",
      "kernel32.LeaveCriticalSection",
      "kernel32.FlsAlloc"
     ],
     "error": {
      "address": "0xfeee0003",
      "api_name": "kernel32.FlsGetValue2",
      "pc": "0xfeee0003",
      "type": "unsupported_api"
     },
     "label": "module_entry",
     "n_apis": 36,
     "start_addr": "0x14002682c"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 36,
    "final_profile": [
     {
      "key": "hostname",
      "value": "DESKTOP-7F3K9A2"
     },
     {
      "key": "user_name",
      "value": "jdoe"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": true,
     "distinct": 54,
     "first": [
      "kernel32.GetSystemTimeAsFileTime",
      "kernel32.GetCurrentThreadId",
      "kernel32.GetCurrentProcessId",
      "kernel32.QueryPerformanceCounter",
      "kernel32.LoadLibraryExW",
      "kernel32.GetProcAddress",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.LoadLibraryExW",
      "kernel32.GetProcAddress",
      "kernel32.FlsAlloc",
      "kernel32.GetProcAddress",
      "kernel32.FlsSetValue",
      "kernel32.VirtualProtect",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.InitializeCriticalSectionEx",
      "kernel32.GetProcessHeap",
      "kernel32.LoadLibraryExW",
      "kernel32.GetProcAddress",
      "kernel32.EnterCriticalSection",
      "kernel32.VirtualProtect",
      "kernel32.VirtualProtect",
      "kernel32.LeaveCriticalSection",
      "kernel32.FlsAlloc",
      "kernel32.FlsGetValue2",
      "kernel32.GetLastError",
      "kernel32.FlsSetValue",
      "kernel32.HeapAlloc"
     ],
     "recorded": 20000,
     "round_n_apis": 199941,
     "top": [
      {
       "api": "kernel32.CloseHandle",
       "count": 3234
      },
      {
       "api": "kernel32.QueryPerformanceCounter",
       "count": 3230
      },
      {
       "api": "kernel32.CreateWaitableTimerExW",
       "count": 3229
      },
      {
       "api": "kernel32.SetWaitableTimer",
       "count": 3229
      },
      {
       "api": "kernel32.WaitForSingleObject",
       "count": 3228
      },
      {
       "api": "user32.GetCursorPos",
       "count": 3227
      },
      {
       "api": "kernel32.GetProcessHeap",
       "count": 154
      },
      {
       "api": "kernel32.HeapAlloc",
       "count": 113
      },
      {
       "api": "kernel32.HeapFree",
       "count": 100
      },
      {
       "api": "kernel32.InitializeCriticalSectionEx",
       "count": 83
      },
      {
       "api": "kernel32.SetLastError",
       "count": 21
      },
      {
       "api": "kernel32.GetEnvironmentVariableW",
       "count": 19
      },
      {
       "api": "kernel32.HeapReAlloc",
       "count": 11
      },
      {
       "api": "kernel32.EnterCriticalSection",
       "count": 10
      },
      {
       "api": "kernel32.GetLastError",
       "count": 10
      },
      {
       "api": "kernel32.LeaveCriticalSection",
       "count": 10
      },
      {
       "api": "kernel32.GetProcAddress",
       "count": 7
      },
      {
       "api": "kernel32.VirtualProtect",
       "count": 7
      },
      {
       "api": "kernel32.CreateFileW",
       "count": 6
      },
      {
       "api": "kernel32.GetFileInformationByHandle",
       "count": 6
      },
      {
       "api": "kernel32.MultiByteToWideChar",
       "count": 6
      },
      {
       "api": "kernel32.WideCharToMultiByte",
       "count": 6
      },
      {
       "api": "kernel32.LoadLibraryExW",
       "count": 5
      },
      {
       "api": "kernel32.LCMapStringEx",
       "count": 4
      },
      {
       "api": "kernel32.FlsSetValue",
       "count": 3
      },
      {
       "api": "kernel32.GetCommandLineW",
       "count": 3
      },
      {
       "api": "kernel32.GetCurrentProcessId",
       "count": 3
      },
      {
       "api": "kernel32.GetFileType",
       "count": 3
      },
      {
       "api": "kernel32.GetStdHandle",
       "count": 3
      },
      {
       "api": "kernel32.FlsAlloc",
       "count": 2
      },
      {
       "api": "kernel32.FlsGetValue2",
       "count": 2
      },
      {
       "api": "kernel32.GetCPInfo",
       "count": 2
      },
      {
       "api": "kernel32.GetModuleFileNameW",
       "count": 2
      },
      {
       "api": "kernel32.GetSystemTimePreciseAsFileTime",
       "count": 2
      },
      {
       "api": "bcryptprimitives.ProcessPrng",
       "count": 1
      },
      {
       "api": "kernel32.AddVectoredExceptionHandler",
       "count": 1
      },
      {
       "api": "kernel32.AreFileApisANSI",
       "count": 1
      },
      {
       "api": "kernel32.FlsGetValue",
       "count": 1
      },
      {
       "api": "kernel32.FreeEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "kernel32.GetACP",
       "count": 1
      },
      {
       "api": "kernel32.GetCommandLineA",
       "count": 1
      },
      {
       "api": "kernel32.GetCurrentThread",
       "count": 1
      },
      {
       "api": "kernel32.GetCurrentThreadId",
       "count": 1
      },
      {
       "api": "kernel32.GetEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "kernel32.GetModuleHandleA",
       "count": 1
      },
      {
       "api": "kernel32.GetStartupInfoW",
       "count": 1
      },
      {
       "api": "kernel32.GetStringTypeW",
       "count": 1
      },
      {
       "api": "kernel32.GetSystemTimeAsFileTime",
       "count": 1
      },
      {
       "api": "kernel32.InitializeSListHead",
       "count": 1
      },
      {
       "api": "kernel32.IsValidCodePage",
       "count": 1
      },
      {
       "api": "kernel32.QueryPerformanceFrequency",
       "count": 1
      },
      {
       "api": "kernel32.SetThreadDescription",
       "count": 1
      },
      {
       "api": "kernel32.SetThreadStackGuarantee",
       "count": 1
      },
      {
       "api": "kernel32.SetUnhandledExceptionFilter",
       "count": 1
      }
     ]
    },
    "final_watchlist": [],
    "generated": "2026-07-28 01:18:36",
    "harness": {
     "answered_by_emulator": [
      "flsgetvalue2 -> kernel32.FlsGetValue"
     ],
     "blind_spots": [],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [],
    "max_apis": 199941,
    "min_apis": 36,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 1,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [],
    "outcome": {
     "assisted": true,
     "exit_meaning": "3 —— 跑到了但有不可驗證的成分(或 1,若 LLM 失效)",
     "inconclusive": true,
     "iterations": 2,
     "n_llm_failures": 1,
     "n_plan_errors": 0,
     "reason": "llm_call_failed",
     "reasons": [
      "llm_call_failed",
      "synthesized_unimplemented_api"
     ],
     "success": false,
     "synthesized_apis": [
      "bcryptprimitives.ProcessPrng",
      "kernel32.CreateWaitableTimerExW",
      "kernel32.SetThreadDescription",
      "kernel32.SetThreadStackGuarantee",
      "kernel32.SetWaitableTimer"
     ],
     "verdict": "inconclusive"
    },
    "partial": false,
    "reason_info": {
     "kind": "bad",
     "label": "LLM 端點失敗",
     "why": "這一輪要問模型的問題沒有拿到答案（逾時或回了不能用的內容）。這一輪的數字是端點故障下的產物，不是分析成果。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "bcryptprimitives.processprng",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createwaitabletimerexw",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue2",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heaprealloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibraryexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setthreaddescription",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.setthreadstackguarantee",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.setwaitabletimer",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.virtualprotect",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.waitforsingleobject",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": null,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 0.23,
      "entry_points": [
       {
        "ep_type": "tls_callback_0",
        "error": "",
        "n_apis": 0,
        "start_addr": "0x14001d700"
       },
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 229,
        "start_addr": "0x14002682c"
       }
      ],
      "llm_calls": 6,
      "llm_diagnosis": "The sample called five APIs that the emulator does not implement at all (bcryptprimitives.ProcessPrng, kernel32.CreateWaitableTimerExW, kernel32.SetThreadDescription, kernel32.SetThreadStackGuarantee, kernel32.SetWaitableTimer). Because the emulator synthesised return values for these calls, the run was marked inconclusive. The trace shows no evidence of anti-analysis checks, crashes, or environment detection; the program simply uses modern threading and cryptography APIs that are missing from the emulator.",
      "llm_seconds": 192.62,
      "n_apis": 229,
      "n_arity_fallbacks": 0,
      "n_faults": 32,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "jdoe"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "synthesized_unimplemented_api",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 50,
      "stack_unknown": 0,
      "stop": null,
      "synth_fills": [
       {
        "api": "bcryptprimitives.processprng",
        "applied": 1,
        "calls": 1,
        "calls_with_writes": 1,
        "proposed": 1
       },
       {
        "api": "kernel32.createwaitabletimerexw",
        "applied": 1,
        "calls": 5,
        "calls_with_writes": 1,
        "proposed": 1
       },
       {
        "api": "kernel32.setthreaddescription",
        "applied": 0,
        "calls": 2,
        "calls_with_writes": 0,
        "proposed": 0
       },
       {
        "api": "kernel32.setthreadstackguarantee",
        "applied": 2,
        "calls": 2,
        "calls_with_writes": 2,
        "proposed": 2
       },
       {
        "api": "kernel32.setwaitabletimer",
        "applied": 1,
        "calls": 4,
        "calls_with_writes": 1,
        "proposed": 1
       }
      ],
      "verdict": "inconclusive",
      "warnings": [],
      "watchlist_in": []
     },
     {
      "add_watchlist": [],
      "api_added": [
       "kernel32.createfilew"
      ],
      "api_removed": [
       "kernel32.closehandle",
       "kernel32.waitforsingleobject"
      ],
      "api_scope": [
       {
        "api": "bcryptprimitives.processprng",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.createfilew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createwaitabletimerexw",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue2",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heaprealloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibraryexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setthreaddescription",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.setthreadstackguarantee",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.setwaitabletimer",
        "sources": [
         "synth",
         "args"
        ]
       },
       {
        "api": "kernel32.virtualprotect",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 199712,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 85.28,
      "entry_points": [
       {
        "ep_type": "tls_callback_0",
        "error": "",
        "n_apis": 0,
        "start_addr": "0x14001d700"
       },
       {
        "ep_type": "module_entry",
        "error": "max_api_count",
        "n_apis": 199941,
        "start_addr": "0x14002682c"
       }
      ],
      "llm_calls": 11,
      "llm_diagnosis": "",
      "llm_seconds": 389.18,
      "n_apis": 199941,
      "n_arity_fallbacks": 0,
      "n_faults": 32,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "jdoe"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "llm_call_failed",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 54,
      "stack_unknown": 0,
      "stop": {
       "address": "",
       "instr": "",
       "pc": "0x14001f114",
       "sp": null,
       "type": "max_api_count"
      },
      "synth_fills": [
       {
        "api": "bcryptprimitives.processprng",
        "applied": 1,
        "calls": 1,
        "calls_with_writes": 1,
        "proposed": 1
       },
       {
        "api": "kernel32.createwaitabletimerexw",
        "applied": 1,
        "calls": 5,
        "calls_with_writes": 1,
        "proposed": 1
       },
       {
        "api": "kernel32.setthreaddescription",
        "applied": 0,
        "calls": 2,
        "calls_with_writes": 0,
        "proposed": 0
       },
       {
        "api": "kernel32.setthreadstackguarantee",
        "applied": 2,
        "calls": 2,
        "calls_with_writes": 2,
        "proposed": 2
       },
       {
        "api": "kernel32.setwaitabletimer",
        "applied": 1,
        "calls": 4,
        "calls_with_writes": 1,
        "proposed": 1
       }
      ],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "bad",
        "text": "這一輪的 LLM 呼叫失敗。外圈要問的問題沒有拿到答案，接下來發生的事是端點故障下的產物，不是分析成果。"
       },
       {
        "kind": "bad",
        "text": "這一輪是撞到模擬器的 API 呼叫上限才停的 —— 樣本當時還在跑。199,941 這個數字反映的是「上限在哪」，不是「行為有多深」；呼叫大多集中在同一個輪詢迴圈裡。"
       }
      ],
      "watchlist_in": []
     }
    ],
    "run": "run_20260728-000700",
    "scale": "log"
   },
   "id": "21080a1c",
   "kind": "exe",
   "md5": "92524d6a1335d799a6f284277be694f1",
   "sha1": "f13385aaf62d2b4df8da184690cb17c2f70ce092",
   "sha256": "21080a1cfbf838b6f7d7b1f1173f2bdaa0cd45f75a5c93487a7c5f06d2037f8b",
   "size": 1042432,
   "speakeasy": {
    "all_entrypoints": false,
    "apis_total": 36,
    "detail": {
     "address": "0xfeee0003",
     "api_name": "kernel32.FlsGetValue2",
     "pc": "0xfeee0003",
     "type": "unsupported_api"
    },
    "dllmain_only": false,
    "emulation_total_runtime": 0.265,
    "entry_points": [
     {
      "ep_type": "tls_callback_0",
      "error": {},
      "instr_count": null,
      "last_apis": [],
      "n_apis": 0,
      "start_addr": "0x14001d700"
     },
     {
      "ep_type": "module_entry",
      "error": {
       "address": "0xfeee0003",
       "api_name": "kernel32.FlsGetValue2",
       "pc": "0xfeee0003",
       "type": "unsupported_api"
      },
      "instr_count": null,
      "last_apis": [
       "kernel32.GetProcessHeap",
       "kernel32.LoadLibraryExW",
       "kernel32.GetProcAddress",
       "kernel32.EnterCriticalSection",
       "kernel32.VirtualProtect",
       "kernel32.VirtualProtect",
       "kernel32.LeaveCriticalSection",
       "kernel32.FlsAlloc"
      ],
      "n_apis": 36,
      "start_addr": "0x14002682c"
     }
    ],
    "is_dll": false,
    "timeout": 60,
    "variant": null,
    "verdict": "unsupported_api",
    "wall_seconds": 0.61
   },
   "static": {
    "analysis_notes": [
     "有 TLS callback：主要邏輯可能不在 entry point，只看 entry point 的工具會全部漏掉。"
    ],
    "arch": "x64",
    "attack_techniques": [
     "Defense Evasion::Obfuscated Files or Information (T1027)",
     "Defense Evasion::Virtualization/Sandbox Evasion (T1497.001)",
     "Defense Evasion::Virtualization/Sandbox Evasion (T1497.002)",
     "Discovery::File and Directory Discovery (T1083)",
     "Discovery::Process Discovery (T1057)",
     "Discovery::Query Registry (T1012)",
     "Discovery::Software Discovery (T1518)",
     "Discovery::System Information Discovery (T1082)",
     "Execution::Command and Scripting Interpreter (T1059)",
     "Execution::Shared Modules (T1129)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "有注入相關 API",
      "多重反分析檢測，可能需要多輪迭代"
     ],
     "seconds": 300
    },
    "c2": [
     {
      "benign": true,
      "defanged": "index[.]crates[.]io",
      "source": "static",
      "type": "domain"
     }
    ],
    "capabilities": [
     "reference analysis tools strings",
     "check for debugger via API",
     "check for time delay via QueryPerformanceCounter",
     "check for unmoving mouse cursor",
     "detect mouse movement via activity checks on Windows",
     "reference anti-VM strings",
     "reference anti-VM strings targeting Parallels",
     "reference anti-VM strings targeting Qemu",
     "reference anti-VM strings targeting VMWare",
     "reference anti-VM strings targeting VirtualBox",
     "compiled with rust",
     "encode data using XOR",
     "encrypt data using RC4 PRGA",
     "hash data using fnv",
     "extract resource via kernel32 functions",
     "accept command line arguments",
     "query environment variable",
     "set environment variable",
     "get common file path",
     "enumerate files on Windows",
     "read file on Windows",
     "write file on Windows",
     "get disk size",
     "check mutex on Windows",
     "create or open mutex on Windows",
     "get system information on Windows",
     "enumerate processes",
     "terminate process",
     "query or enumerate registry key",
     "query or enumerate registry value",
     "get installed programs",
     "link function at runtime on Windows",
     "link many functions at runtime",
     "inspect section memory permissions",
     "parse PE header",
     "resolve function by parsing PE exports"
    ],
    "categories_present": [
     "anti_debug",
     "anti_vm",
     "dynamic_resolve",
     "env_fingerprint",
     "injection",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "",
     "tools_not_ok": [],
     "value": false
    },
    "diec": {
     "compiler": "Microsoft Visual C/C++",
     "detects": [
      {
       "info": "",
       "name": "Microsoft Linker",
       "type": "linker",
       "version": "14.44.35215"
      },
      {
       "info": "C++",
       "name": "Microsoft Visual C/C++",
       "type": "compiler",
       "version": "19.44.35207"
      },
      {
       "info": "",
       "name": "Microsoft Visual Studio",
       "type": "tool",
       "version": "2022, 17.14"
      },
      {
       "info": "codeview, vc_feature, pogo",
       "name": "Records",
       "type": "debug data",
       "version": ""
      }
     ],
     "is_packed": false,
     "linker": "Microsoft Linker",
     "packers": [],
     "protectors": []
    },
    "floss_counts": {
     "decoded": 0,
     "stack": 0,
     "static": 11907,
     "tight": 0
    },
    "ghidra": {
     "function_count": 719,
     "language": "x86:LE:64:default",
     "message": "",
     "stats": {
      "api_symbols_matched": 30,
      "candidate_functions": 35,
      "decompile_incomplete": 0,
      "emitted": 27,
      "entry_points_emitted": 2
     },
     "status": "ok"
    },
    "is_dll": false,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "high entropy section .rsrc (7.79)"
     ],
     "value": false
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:50:57Z",
     "content_sha256": "f5949a34313fcbd45c56d441a003cc395fb730ba64739d2cc57f3e7b943c9b35",
     "elapsed_seconds": 163.66,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x64",
     "declared_section_count": 7,
     "delay_imports": [],
     "dll_count": 7,
     "entry_point": 157740,
     "exports": [],
     "file_entropy": 7.4706,
     "has_rich_header": true,
     "has_signature": false,
     "image_base": 5368709120,
     "imphash": "9b2f0ef76cd98cbdebcb80546443694f",
     "import_count": 125,
     "imports": [
      "advapi32.dll.RegCloseKey",
      "advapi32.dll.RegEnumKeyExW",
      "advapi32.dll.RegOpenKeyExW",
      "advapi32.dll.RegQueryValueExW",
      "api-ms-win-core-synch-l1-2-0.dll.WaitOnAddress",
      "api-ms-win-core-synch-l1-2-0.dll.WakeByAddressAll",
      "api-ms-win-core-synch-l1-2-0.dll.WakeByAddressSingle",
      "bcryptprimitives.dll.ProcessPrng",
      "kernel32.dll.AddVectoredExceptionHandler",
      "kernel32.dll.AllocConsole",
      "kernel32.dll.CheckRemoteDebuggerPresent",
      "kernel32.dll.CloseHandle",
      "kernel32.dll.CompareStringW",
      "kernel32.dll.CreateFileW",
      "kernel32.dll.CreateMutexA",
      "kernel32.dll.CreateToolhelp32Snapshot",
      "kernel32.dll.CreateWaitableTimerExW",
      "kernel32.dll.DeleteCriticalSection",
      "kernel32.dll.EncodePointer",
      "kernel32.dll.EnterCriticalSection",
      "kernel32.dll.ExitProcess",
      "kernel32.dll.FindClose",
      "kernel32.dll.FindFirstFileExW",
      "kernel32.dll.FindNextFileW",
      "kernel32.dll.FindResourceA",
      "kernel32.dll.FlsAlloc",
      "kernel32.dll.FlsFree",
      "kernel32.dll.FlsGetValue",
      "kernel32.dll.FlsSetValue",
      "kernel32.dll.FlushFileBuffers",
      "kernel32.dll.FormatMessageW",
      "kernel32.dll.FreeEnvironmentStringsW",
      "kernel32.dll.FreeLibrary",
      "kernel32.dll.GetACP",
      "kernel32.dll.GetCPInfo",
      "kernel32.dll.GetCommandLineA",
      "kernel32.dll.GetCommandLineW",
      "kernel32.dll.GetConsoleMode",
      "kernel32.dll.GetConsoleOutputCP",
      "kernel32.dll.GetCurrentDirectoryW",
      "kernel32.dll.GetCurrentProcess",
      "kernel32.dll.GetCurrentProcessId",
      "kernel32.dll.GetCurrentThread",
      "kernel32.dll.GetCurrentThreadId",
      "kernel32.dll.GetDiskFreeSpaceExW",
      "kernel32.dll.GetEnvironmentStringsW",
      "kernel32.dll.GetEnvironmentVariableW",
      "kernel32.dll.GetFileInformationByHandle",
      "kernel32.dll.GetFileInformationByHandleEx",
      "kernel32.dll.GetFileType",
      "kernel32.dll.GetFullPathNameW",
      "kernel32.dll.GetLastError",
      "kernel32.dll.GetModuleFileNameW",
      "kernel32.dll.GetModuleHandleA",
      "kernel32.dll.GetModuleHandleExW",
      "kernel32.dll.GetModuleHandleW",
      "kernel32.dll.GetOEMCP",
      "kernel32.dll.GetPhysicallyInstalledSystemMemory",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetProcessHeap",
      "kernel32.dll.GetStartupInfoW",
      "kernel32.dll.GetStdHandle",
      "kernel32.dll.GetStringTypeW",
      "kernel32.dll.GetSystemInfo",
      "kernel32.dll.GetSystemTimeAsFileTime",
      "kernel32.dll.GetSystemTimePreciseAsFileTime",
      "kernel32.dll.HeapAlloc",
      "kernel32.dll.HeapFree",
      "kernel32.dll.HeapReAlloc",
      "kernel32.dll.HeapSize",
      "kernel32.dll.InitializeCriticalSectionAndSpinCount",
      "kernel32.dll.InitializeCriticalSectionEx",
      "kernel32.dll.InitializeSListHead",
      "kernel32.dll.IsDebuggerPresent",
      "kernel32.dll.IsProcessorFeaturePresent",
      "kernel32.dll.IsValidCodePage",
      "kernel32.dll.LCMapStringW",
      "kernel32.dll.LeaveCriticalSection",
      "kernel32.dll.LoadLibraryA",
      "kernel32.dll.LoadLibraryExA",
      "kernel32.dll.LoadLibraryExW",
      "kernel32.dll.LoadResource",
      "kernel32.dll.LockResource",
      "kernel32.dll.MultiByteToWideChar",
      "kernel32.dll.Process32First",
      "kernel32.dll.Process32Next",
      "kernel32.dll.QueryPerformanceCounter",
      "kernel32.dll.QueryPerformanceFrequency",
      "kernel32.dll.RaiseException",
      "kernel32.dll.ReadConsoleW",
      "kernel32.dll.ReleaseMutex",
      "kernel32.dll.RtlCaptureContext",
      "kernel32.dll.RtlLookupFunctionEntry",
      "kernel32.dll.RtlPcToFileHeader",
      "kernel32.dll.RtlUnwindEx",
      "kernel32.dll.RtlVirtualUnwind",
      "kernel32.dll.SetEnvironmentVariableW",
      "kernel32.dll.SetFilePointerEx",
      "kernel32.dll.SetLastError",
      "kernel32.dll.SetStdHandle",
      "kernel32.dll.SetThreadStackGuarantee",
      "kernel32.dll.SetUnhandledExceptionFilter",
      "kernel32.dll.SetWaitableTimer",
      "kernel32.dll.SizeofResource",
      "kernel32.dll.Sleep",
      "kernel32.dll.TerminateProcess",
      "kernel32.dll.TlsAlloc",
      "kernel32.dll.TlsFree",
      "kernel32.dll.TlsGetValue",
      "kernel32.dll.TlsSetValue",
      "kernel32.dll.UnhandledExceptionFilter",
      "kernel32.dll.VirtualProtect",
      "kernel32.dll.WaitForSingleObject",
      "kernel32.dll.WaitForSingleObjectEx",
      "kernel32.dll.WideCharToMultiByte",
      "kernel32.dll.WriteConsoleW",
      "kernel32.dll.WriteFile",
      "kernel32.dll.lstrlenW",
      "ntdll.dll.NtReadFile",
      "ntdll.dll.NtWriteFile",
      "ntdll.dll.RtlNtStatusToDosError",
      "oleaut32.dll.SysFreeString",
      "oleaut32.dll.SysStringLen",
      "user32.dll.GetCursorPos",
      "user32.dll.GetSystemMetrics"
     ],
     "is_dll": false,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 34404,
     "overlay": null,
     "packer_heuristics": [
      "high entropy section .rsrc (7.79)"
     ],
     "resources": [
      {
       "entropy": 7.9996,
       "id": 3139,
       "size": 636928,
       "type": "KLDLRF"
      },
      {
       "entropy": 2.0418,
       "id": 1,
       "size": 67624,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.3779,
       "id": 1,
       "size": 844,
       "type": "RT_VERSION"
      },
      {
       "entropy": 1.9805,
       "id": 1,
       "size": 20,
       "type": "RT_GROUP_ICON"
      }
     ],
     "sections": [
      {
       "characteristics": "0x60000020",
       "entropy": 6.4065,
       "executable": true,
       "name": ".text",
       "raw_size": 219136,
       "readable": true,
       "virtual_size": 219072,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.2751,
       "executable": false,
       "name": ".rdata",
       "raw_size": 100864,
       "readable": true,
       "virtual_size": 100742,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 1.9917,
       "executable": false,
       "name": ".data",
       "raw_size": 3072,
       "readable": true,
       "virtual_size": 7496,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.4281,
       "executable": false,
       "name": ".pdata",
       "raw_size": 8704,
       "readable": true,
       "virtual_size": 8268,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.0,
       "executable": false,
       "name": ".fptable",
       "raw_size": 512,
       "readable": true,
       "virtual_size": 256,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 7.787,
       "executable": false,
       "name": ".rsrc",
       "raw_size": 706048,
       "readable": true,
       "virtual_size": 705736,
       "writable": false
      },
      {
       "characteristics": "0x42000040",
       "entropy": 5.3669,
       "executable": false,
       "name": ".reloc",
       "raw_size": 3072,
       "readable": true,
       "virtual_size": 2988,
       "writable": false
      }
     ],
     "subsystem": 2,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
     "timestamp": 1761504628,
     "timestamp_suspicious": false,
     "timestamp_utc": "2025-10-26T18:50:28Z",
     "tls_callbacks": [
      "0x14001d700"
     ]
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 125 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.26,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "未偵測到殼",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 13.46,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "n/a",
      "message": "不是 PyInstaller 打包的檔案（不適用，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": null,
      "detail": "抽出 11907 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 3.65,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "36 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 77.71,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "7 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.07,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "27 個函式",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "ok",
      "message": "",
      "seconds": 68.21,
      "status": "ok"
     }
    ],
    "pyinstaller": {
     "detected": false,
     "entry_count": 0,
     "obfuscator": "",
     "python_version": ""
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.AddVectoredExceptionHandler",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CheckRemoteDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.IsDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.SetUnhandledExceptionFilter",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetDiskFreeSpaceExW",
      "categories": [
       "anti_vm"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetSystemInfo",
      "categories": [
       "anti_vm"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleExW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.LoadLibraryA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.LoadLibraryExA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateToolhelp32Snapshot",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Process32First",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Process32Next",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "user32.dll.GetCursorPos",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.VirtualProtect",
      "categories": [
       "injection"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegOpenKeyExW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegQueryValueExW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateFileW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateMutexA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WriteFile",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetSystemTimeAsFileTime",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceCounter",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceFrequency",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WaitForSingleObject",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_AntiDebug_Imports"
     },
     {
      "n_strings": 5,
      "rule": "AIS3_AntiDebug_Tool_Window_Names"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_AntiVM_Hardware_Probe_Imports"
     },
     {
      "n_strings": 3,
      "rule": "AIS3_AntiVM_Sandbox_Products"
     },
     {
      "n_strings": 19,
      "rule": "AIS3_AntiVM_VMware_Artifacts"
     },
     {
      "n_strings": 10,
      "rule": "AIS3_AntiVM_VirtualBox_Artifacts"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Timing_Check_Imports"
     }
    ]
   },
   "summary": {
    "apis_total": 36,
    "arch": "x64",
    "budget_seconds": 300,
    "degraded": false,
    "emulation_seconds": 0.265,
    "id": "21080a1c",
    "is_dll": false,
    "kind": "exe",
    "mirage": true,
    "mirage_apis": [
     229,
     199941
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": true,
    "mirage_last_apis": 199941,
    "mirage_max_apis": 199941,
    "mirage_reason": "llm_call_failed",
    "mirage_rounds": 2,
    "mirage_scale": "log",
    "mirage_success": false,
    "mirage_verdict": "inconclusive",
    "mirage_warned": true,
    "n_c2": 1,
    "n_c2_non_benign": 0,
    "n_capabilities": 36,
    "n_categories": 7,
    "n_detections": 26,
    "n_entry_points": 2,
    "n_yara": 7,
    "packed": false,
    "size": 1042432,
    "verdict": "unsupported_api"
   }
  },
  {
   "baseline_segments": [
    {
     "apis_tail": [
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW",
      "KERNEL32.GetAtomNameW"
     ],
     "error": {
      "pc": "0x407560",
      "type": "max_api_count"
     },
     "label": "module_entry",
     "n_apis": 10001,
     "start_addr": "0x40a2bb"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 10001,
    "final_profile": [
     {
      "key": "hostname",
      "value": "DESKTOP-7F3K9J2"
     },
     {
      "key": "user_name",
      "value": "User"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": false,
     "distinct": 56,
     "first": [
      "KERNEL32.GetSystemTimeAsFileTime",
      "KERNEL32.GetCurrentProcessId",
      "KERNEL32.GetCurrentThreadId",
      "KERNEL32.GetTickCount",
      "KERNEL32.QueryPerformanceCounter",
      "KERNEL32.GetStartupInfoA",
      "KERNEL32.HeapCreate",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.TlsAlloc",
      "KERNEL32.TlsSetValue",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW",
      "KERNEL32.GetProcAddress",
      "kernel32.EncodePointer",
      "KERNEL32.TlsGetValue",
      "KERNEL32.GetModuleHandleW"
     ],
     "recorded": 17094,
     "round_n_apis": 17094,
     "top": [
      {
       "api": "KERNEL32.GetAtomNameW",
       "count": 16385
      },
      {
       "api": "KERNEL32.TlsGetValue",
       "count": 198
      },
      {
       "api": "kernel32.FlsGetValue",
       "count": 131
      },
      {
       "api": "KERNEL32.GetLastError",
       "count": 73
      },
      {
       "api": "KERNEL32.SetLastError",
       "count": 72
      },
      {
       "api": "kernel32.EncodePointer",
       "count": 38
      },
      {
       "api": "kernel32.DecodePointer",
       "count": 29
      },
      {
       "api": "KERNEL32.InitializeCriticalSectionAndSpinCount",
       "count": 17
      },
      {
       "api": "KERNEL32.GetProcAddress",
       "count": 16
      },
      {
       "api": "KERNEL32.EnterCriticalSection",
       "count": 14
      },
      {
       "api": "KERNEL32.LeaveCriticalSection",
       "count": 14
      },
      {
       "api": "KERNEL32.GetModuleHandleW",
       "count": 12
      },
      {
       "api": "KERNEL32.HeapAlloc",
       "count": 10
      },
      {
       "api": "KERNEL32.GetCurrentProcessId",
       "count": 6
      },
      {
       "api": "KERNEL32.MultiByteToWideChar",
       "count": 6
      },
      {
       "api": "KERNEL32.HeapSize",
       "count": 5
      },
      {
       "api": "KERNEL32.InterlockedIncrement",
       "count": 5
      },
      {
       "api": "KERNEL32.LCMapStringW",
       "count": 5
      },
      {
       "api": "KERNEL32.WideCharToMultiByte",
       "count": 4
      },
      {
       "api": "KERNEL32.DeleteCriticalSection",
       "count": 3
      },
      {
       "api": "KERNEL32.GetFileType",
       "count": 3
      },
      {
       "api": "KERNEL32.GetStdHandle",
       "count": 3
      },
      {
       "api": "KERNEL32.HeapFree",
       "count": 3
      },
      {
       "api": "KERNEL32.InitializeCriticalSection",
       "count": 3
      },
      {
       "api": "KERNEL32.GetCPInfo",
       "count": 2
      },
      {
       "api": "KERNEL32.GetCurrentThreadId",
       "count": 2
      },
      {
       "api": "KERNEL32.GetProcessHeap",
       "count": 2
      },
      {
       "api": "KERNEL32.GetStartupInfoA",
       "count": 2
      },
      {
       "api": "KERNEL32.GetStringTypeW",
       "count": 2
      },
      {
       "api": "KERNEL32.InterlockedDecrement",
       "count": 2
      },
      {
       "api": "KERNEL32.TlsAlloc",
       "count": 2
      },
      {
       "api": "KERNEL32.AddAtomW",
       "count": 1
      },
      {
       "api": "KERNEL32.CloseHandle",
       "count": 1
      },
      {
       "api": "KERNEL32.CreateMutexW",
       "count": 1
      },
      {
       "api": "KERNEL32.DeleteAtom",
       "count": 1
      },
      {
       "api": "KERNEL32.ExitProcess",
       "count": 1
      },
      {
       "api": "KERNEL32.FindAtomW",
       "count": 1
      },
      {
       "api": "KERNEL32.FreeEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetACP",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCommandLineA",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCommandLineW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetModuleFileNameA",
       "count": 1
      },
      {
       "api": "KERNEL32.GetSystemTimeAsFileTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetTickCount",
       "count": 1
      },
      {
       "api": "KERNEL32.HeapCreate",
       "count": 1
      },
      {
       "api": "KERNEL32.IsValidCodePage",
       "count": 1
      },
      {
       "api": "KERNEL32.QueryPerformanceCounter",
       "count": 1
      },
      {
       "api": "KERNEL32.ReleaseMutex",
       "count": 1
      },
      {
       "api": "KERNEL32.SetHandleCount",
       "count": 1
      },
      {
       "api": "KERNEL32.SetUnhandledExceptionFilter",
       "count": 1
      },
      {
       "api": "KERNEL32.TlsFree",
       "count": 1
      },
      {
       "api": "KERNEL32.TlsSetValue",
       "count": 1
      },
      {
       "api": "kernel32.FlsAlloc",
       "count": 1
      },
      {
       "api": "kernel32.FlsSetValue",
       "count": 1
      },
      {
       "api": "mscoree.CorExitProcess",
       "count": 1
      }
     ]
    },
    "final_watchlist": [],
    "generated": "2026-07-28 04:38:42",
    "harness": {
     "answered_by_emulator": [],
     "blind_spots": [],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [],
    "max_apis": 17094,
    "min_apis": 10001,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 1,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [],
    "outcome": {
     "assisted": true,
     "exit_meaning": "1 —— 外圈用盡機會仍沒能讓樣本跑起來",
     "inconclusive": false,
     "iterations": 2,
     "n_llm_failures": 0,
     "n_plan_errors": 0,
     "reason": "no_behaviour_change",
     "reasons": [
      "no_behaviour_change"
     ],
     "success": false,
     "synthesized_apis": [],
     "verdict": "unresolved"
    },
    "partial": false,
    "reason_info": {
     "kind": "warn",
     "label": "連續兩輪行為沒有變化",
     "why": "外圈的守衛看到這一輪跟上一輪的軌跡指紋一樣，判定再跑也不會不同，主動停手。這是被守衛停下來的，不是樣本自然跑完。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "kernel32.addatomw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createmutexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.decodepointer",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.deleteatom",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.encodepointer",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findatomw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getatomnamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapcreate",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapsize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionandspincount",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.interlockedincrement",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.releasemutex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.sethandlecount",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.tlsfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": null,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 5.98,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 17094,
        "start_addr": "0x40a2bb"
       }
      ],
      "llm_calls": 0,
      "llm_diagnosis": "The sample is a .NET application that performed normal CLR shutdown: it obtained 〔檔名已移除〕, resolved CorExitProcess, called it with exit code 0, then called ExitProcess(0). The emulator returned success for every API and the process terminated cleanly with exit code 0. No anti-analysis checks, crashes, or environmental checks were observed in the trace.",
      "llm_seconds": 0.0,
      "n_apis": 17094,
      "n_arity_fallbacks": 0,
      "n_faults": 32,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "clean",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 55,
      "stack_unknown": 1,
      "stop": null,
      "synth_fills": [],
      "verdict": "bailed",
      "warnings": [],
      "watchlist_in": []
     },
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "kernel32.addatomw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createmutexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.decodepointer",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.deleteatom",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.encodepointer",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findatomw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getatomnamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapcreate",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapsize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionandspincount",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.interlockedincrement",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.releasemutex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.sethandlecount",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.tlsfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 0,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 6.02,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 17094,
        "start_addr": "0x40a2bb"
       }
      ],
      "llm_calls": 0,
      "llm_diagnosis": "",
      "llm_seconds": 0.0,
      "n_apis": 17094,
      "n_arity_fallbacks": 0,
      "n_faults": 32,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "clean",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 55,
      "stack_unknown": 1,
      "stop": null,
      "synth_fills": [],
      "verdict": "bailed",
      "warnings": [],
      "watchlist_in": []
     }
    ],
    "run": "run_20260728-043635",
    "scale": "linear"
   },
   "id": "336e6c68",
   "kind": "exe",
   "md5": "2624b1d7990731aca0390c22ecd82d54",
   "sha1": "7b430e8a9797dcedc64f35bb6a23936c20a5e2c2",
   "sha256": "336e6c683d014775b1e9fc5e9953f5ae01d240969adc652705a7ddb1ba744a81",
   "size": 520648,
   "speakeasy": {
    "all_entrypoints": false,
    "apis_total": 10001,
    "detail": {
     "pc": "0x407560",
     "type": "max_api_count"
    },
    "dllmain_only": false,
    "emulation_total_runtime": 4.527,
    "entry_points": [
     {
      "ep_type": "module_entry",
      "error": {
       "pc": "0x407560",
       "type": "max_api_count"
      },
      "instr_count": null,
      "last_apis": [
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW",
       "KERNEL32.GetAtomNameW"
      ],
      "n_apis": 10001,
      "start_addr": "0x40a2bb"
     }
    ],
    "is_dll": false,
    "timeout": 60,
    "variant": null,
    "verdict": "hit_limit",
    "wall_seconds": 4.66
   },
   "static": {
    "analysis_notes": [
     "32-bit 樣本：下游模擬器對 x86 的支援與 x64 不同，跑之前先確認。",
     "PE 尾端有 overlay：dropper 的第二階段常黏在這裡。"
    ],
    "arch": "x86",
    "attack_techniques": [
     "Defense Evasion::Virtualization/Sandbox Evasion (T1497.001)",
     "Discovery::Application Window Discovery (T1010)",
     "Discovery::File and Directory Discovery (T1083)",
     "Discovery::Query Registry (T1012)",
     "Execution::Command and Scripting Interpreter (T1059)",
     "Execution::Shared Modules (T1129)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "有 5 個 C2 候選，可能逐一嘗試",
      "有注入相關 API",
      "多重反分析檢測，可能需要多輪迭代"
     ],
     "seconds": 600
    },
    "c2": [
     {
      "benign": false,
      "defanged": "down[.]360safe[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": false,
      "defanged": "www[.]360[.]cn",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": false,
      "defanged": "hxxp://down[.]360safe[.]com/setup[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://down[.]360safe[.]com/setupbeta[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://www[.]360[.]cn",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "crl[.]usertrust[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "crl[.]verisign[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "csc3-2010-aia[.]verisign[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "csc3-2010-crl[.]verisign[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "logo[.]verisign[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "www[.]verisign[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "hxxp://crl[.]verisign[.]com/pca3-g5[.]crl04",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxp://csc3-2010-aia[.]verisign[.]com/CSC3-2010[.]cer0",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxp://csc3-2010-crl[.]verisign[.]com/CSC3-2010[.]crl0D",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxp://logo[.]verisign[.]com/vslogo[.]gif04",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxps://www[.]verisign[.]com/cps0*",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxps://www[.]verisign[.]com/rpa",
      "source": "static",
      "type": "url"
     },
     {
      "benign": true,
      "defanged": "hxxps://www[.]verisign[.]com/rpa0",
      "source": "static",
      "type": "url"
     }
    ],
    "capabilities": [
     "reference analysis tools strings",
     "reference anti-VM strings targeting VirtualBox",
     "hash data with MD5",
     "hash data using SHA256",
     "contains PDB path",
     "accept command line arguments",
     "interact with driver via IOCTL",
     "check if file exists",
     "get file size",
     "read file on Windows",
     "find graphical window",
     "get storage device properties",
     "print debug messages",
     "check mutex on Windows",
     "create or open mutex on Windows",
     "get thread local storage value",
     "create process on Windows",
     "terminate process",
     "query or enumerate registry key",
     "query or enumerate registry value",
     "allocate thread local storage",
     "set thread local storage value",
     "link function at runtime on Windows",
     "link many functions at runtime",
     "enumerate PE sections",
     "parse PE header"
    ],
    "categories_present": [
     "anti_debug",
     "dynamic_resolve",
     "env_fingerprint",
     "injection",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "",
     "tools_not_ok": [],
     "value": false
    },
    "diec": {
     "compiler": "Microsoft Visual C/C++",
     "detects": [
      {
       "info": "",
       "name": "Microsoft Linker",
       "type": "linker",
       "version": "9.00.30729"
      },
      {
       "info": "C++",
       "name": "Microsoft Visual C/C++",
       "type": "compiler",
       "version": "15.00.30729"
      },
      {
       "info": "",
       "name": "Microsoft Visual Studio",
       "type": "tool",
       "version": "2008"
      },
      {
       "info": "PKCS #7, after overlay",
       "name": "Windows Authenticode",
       "type": "sign tool",
       "version": "2.0"
      },
      {
       "info": "codeview",
       "name": "Records",
       "type": "debug data",
       "version": ""
      }
     ],
     "is_packed": false,
     "linker": "Microsoft Linker",
     "packers": [],
     "protectors": []
    },
    "floss_counts": {
     "decoded": 5,
     "stack": 0,
     "static": 1514,
     "tight": 0
    },
    "ghidra": {
     "function_count": 605,
     "language": "x86:LE:32:default",
     "message": "",
     "stats": {
      "api_symbols_matched": 23,
      "candidate_functions": 38,
      "decompile_incomplete": 0,
      "emitted": 26,
      "entry_points_emitted": 1
     },
     "status": "ok"
    },
    "is_dll": false,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "判定未加殼：DiE 未偵測到殼，且 PE 區段熵、virtual/raw 大小落差、匯入表數量都沒有出現加殼特徵"
     ],
     "value": false
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:53:40Z",
     "content_sha256": "ca7edf794b67613546c763bb600d385a3d45254f1d0241de9114abab5adb80cc",
     "elapsed_seconds": 112.54,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x86",
     "declared_section_count": 5,
     "delay_imports": [],
     "dll_count": 5,
     "entry_point": 41659,
     "exports": [],
     "file_entropy": 6.5002,
     "has_rich_header": true,
     "has_signature": true,
     "image_base": 4194304,
     "imphash": "e72240a051b3e7eda44b65b961211a67",
     "import_count": 113,
     "imports": [
      "advapi32.dll.RegCloseKey",
      "advapi32.dll.RegEnumKeyExW",
      "advapi32.dll.RegOpenKeyExW",
      "advapi32.dll.RegQueryValueExA",
      "advapi32.dll.RegQueryValueExW",
      "kernel32.dll.AddAtomW",
      "kernel32.dll.CloseHandle",
      "kernel32.dll.CreateFileA",
      "kernel32.dll.CreateFileW",
      "kernel32.dll.CreateMutexW",
      "kernel32.dll.DeleteAtom",
      "kernel32.dll.DeleteCriticalSection",
      "kernel32.dll.DeviceIoControl",
      "kernel32.dll.EnterCriticalSection",
      "kernel32.dll.ExitProcess",
      "kernel32.dll.FindAtomW",
      "kernel32.dll.FlushFileBuffers",
      "kernel32.dll.FormatMessageW",
      "kernel32.dll.FreeEnvironmentStringsA",
      "kernel32.dll.FreeEnvironmentStringsW",
      "kernel32.dll.FreeLibrary",
      "kernel32.dll.GetACP",
      "kernel32.dll.GetAtomNameW",
      "kernel32.dll.GetCPInfo",
      "kernel32.dll.GetCommandLineA",
      "kernel32.dll.GetCommandLineW",
      "kernel32.dll.GetConsoleCP",
      "kernel32.dll.GetConsoleMode",
      "kernel32.dll.GetConsoleOutputCP",
      "kernel32.dll.GetCurrentProcess",
      "kernel32.dll.GetCurrentProcessId",
      "kernel32.dll.GetCurrentThreadId",
      "kernel32.dll.GetEnvironmentStrings",
      "kernel32.dll.GetEnvironmentStringsW",
      "kernel32.dll.GetFileSizeEx",
      "kernel32.dll.GetFileType",
      "kernel32.dll.GetLastError",
      "kernel32.dll.GetLocaleInfoA",
      "kernel32.dll.GetModuleFileNameA",
      "kernel32.dll.GetModuleFileNameW",
      "kernel32.dll.GetModuleHandleW",
      "kernel32.dll.GetOEMCP",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetProcessHeap",
      "kernel32.dll.GetStartupInfoA",
      "kernel32.dll.GetStdHandle",
      "kernel32.dll.GetStringTypeA",
      "kernel32.dll.GetStringTypeW",
      "kernel32.dll.GetSystemTime",
      "kernel32.dll.GetSystemTimeAsFileTime",
      "kernel32.dll.GetTickCount",
      "kernel32.dll.HeapAlloc",
      "kernel32.dll.HeapCreate",
      "kernel32.dll.HeapFree",
      "kernel32.dll.HeapReAlloc",
      "kernel32.dll.HeapSize",
      "kernel32.dll.InitializeCriticalSection",
      "kernel32.dll.InitializeCriticalSectionAndSpinCount",
      "kernel32.dll.InterlockedDecrement",
      "kernel32.dll.InterlockedIncrement",
      "kernel32.dll.IsDebuggerPresent",
      "kernel32.dll.IsValidCodePage",
      "kernel32.dll.LCMapStringA",
      "kernel32.dll.LCMapStringW",
      "kernel32.dll.LeaveCriticalSection",
      "kernel32.dll.LoadLibraryA",
      "kernel32.dll.LoadLibraryW",
      "kernel32.dll.LocalFileTimeToFileTime",
      "kernel32.dll.LocalFree",
      "kernel32.dll.MultiByteToWideChar",
      "kernel32.dll.OpenThread",
      "kernel32.dll.OutputDebugStringW",
      "kernel32.dll.QueryPerformanceCounter",
      "kernel32.dll.RaiseException",
      "kernel32.dll.ReadFile",
      "kernel32.dll.ReleaseMutex",
      "kernel32.dll.RtlUnwind",
      "kernel32.dll.SetFilePointer",
      "kernel32.dll.SetFilePointerEx",
      "kernel32.dll.SetHandleCount",
      "kernel32.dll.SetLastError",
      "kernel32.dll.SetStdHandle",
      "kernel32.dll.SetUnhandledExceptionFilter",
      "kernel32.dll.Sleep",
      "kernel32.dll.SystemTimeToFileTime",
      "kernel32.dll.TerminateProcess",
      "kernel32.dll.TlsAlloc",
      "kernel32.dll.TlsFree",
      "kernel32.dll.TlsGetValue",
      "kernel32.dll.TlsSetValue",
      "kernel32.dll.UnhandledExceptionFilter",
      "kernel32.dll.VirtualAlloc",
      "kernel32.dll.VirtualFree",
      "kernel32.dll.WaitForSingleObject",
      "kernel32.dll.WideCharToMultiByte",
      "kernel32.dll.WriteConsoleA",
      "kernel32.dll.WriteConsoleW",
      "kernel32.dll.WriteFile",
      "kernel32.dll.lstrcpynW",
      "kernel32.dll.lstrlenW",
      "shell32.dll.ShellExecuteExW",
      "shell32.dll.ShellExecuteW",
      "shlwapi.dll.PathAppendW",
      "shlwapi.dll.PathCombineW",
      "shlwapi.dll.PathFileExistsW",
      "shlwapi.dll.PathRemoveFileSpecW",
      "shlwapi.dll.SHGetValueW",
      "shlwapi.dll.StrStrW",
      "user32.dll.FindWindowW",
      "user32.dll.GetActiveWindow",
      "user32.dll.MessageBoxW",
      "user32.dll.SendMessageW",
      "user32.dll.WaitForInputIdle"
     ],
     "is_dll": false,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 332,
     "overlay": {
      "entropy": 5.8651,
      "offset": 135168,
      "size": 385480
     },
     "packer_heuristics": [],
     "resources": [
      {
       "entropy": 3.2624,
       "id": 2,
       "size": 4264,
       "type": "RT_ICON"
      },
      {
       "entropy": 4.2792,
       "id": 1,
       "size": 1128,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.4196,
       "id": 1,
       "size": 656,
       "type": "RT_VERSION"
      },
      {
       "entropy": 4.796,
       "id": 1,
       "size": 346,
       "type": "RT_MANIFEST"
      },
      {
       "entropy": 6.5976,
       "id": 864,
       "size": 128,
       "type": "RT_RCDATA"
      },
      {
       "entropy": 2.2106,
       "id": 128,
       "size": 34,
       "type": "RT_GROUP_ICON"
      }
     ],
     "sections": [
      {
       "characteristics": "0x60000020",
       "entropy": 6.6198,
       "executable": true,
       "name": ".text",
       "raw_size": 93696,
       "readable": true,
       "virtual_size": 93622,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.3698,
       "executable": false,
       "name": ".rdata",
       "raw_size": 18432,
       "readable": true,
       "virtual_size": 17948,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 2.8803,
       "executable": false,
       "name": ".data",
       "raw_size": 7168,
       "readable": true,
       "virtual_size": 17504,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 4.2938,
       "executable": false,
       "name": ".rsrc",
       "raw_size": 7168,
       "readable": true,
       "virtual_size": 6984,
       "writable": false
      },
      {
       "characteristics": "0x42000040",
       "entropy": 4.4077,
       "executable": false,
       "name": ".reloc",
       "raw_size": 7680,
       "readable": true,
       "virtual_size": 7360,
       "writable": false
      }
     ],
     "subsystem": 2,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
     "timestamp": 1420627200,
     "timestamp_suspicious": false,
     "timestamp_utc": "2015-01-07T10:40:00Z",
     "tls_callbacks": []
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 113 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.08,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "未偵測到殼",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 12.36,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "n/a",
      "message": "不是 PyInstaller 打包的檔案（不適用，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": null,
      "detail": "抽出 1519 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 21.35,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "26 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 50.96,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "3 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.02,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "26 個函式",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "ok",
      "message": "",
      "seconds": 27.71,
      "status": "ok"
     }
    ],
    "pyinstaller": {
     "detected": false,
     "entry_count": 0,
     "obfuscator": "",
     "python_version": ""
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.IsDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.OutputDebugStringW",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.SetUnhandledExceptionFilter",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.LoadLibraryA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetLocaleInfoA",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "user32.dll.FindWindowW",
      "categories": [
       "env_fingerprint"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.VirtualAlloc",
      "categories": [
       "injection"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegOpenKeyExW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegQueryValueExA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateFileA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateMutexW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WriteFile",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "shell32.dll.ShellExecuteW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetSystemTimeAsFileTime",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetTickCount",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceCounter",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WaitForSingleObject",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_AntiDebug_Imports"
     },
     {
      "n_strings": 20,
      "rule": "AIS3_Network_Hardcoded_URL"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Timing_Check_Imports"
     }
    ]
   },
   "summary": {
    "apis_total": 10001,
    "arch": "x86",
    "budget_seconds": 600,
    "degraded": false,
    "emulation_seconds": 4.527,
    "id": "336e6c68",
    "is_dll": false,
    "kind": "exe",
    "mirage": true,
    "mirage_apis": [
     17094,
     17094
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": false,
    "mirage_last_apis": 17094,
    "mirage_max_apis": 17094,
    "mirage_reason": "no_behaviour_change",
    "mirage_rounds": 2,
    "mirage_scale": "linear",
    "mirage_success": false,
    "mirage_verdict": "unresolved",
    "mirage_warned": false,
    "n_c2": 18,
    "n_c2_non_benign": 5,
    "n_capabilities": 26,
    "n_categories": 6,
    "n_detections": 20,
    "n_entry_points": 1,
    "n_yara": 3,
    "packed": false,
    "size": 520648,
    "verdict": "hit_limit"
   }
  },
  {
   "baseline_segments": [
    {
     "apis_tail": [
      "kernel32.CheckRemoteDebuggerPresent",
      "kernel32.GetModuleFileNameW",
      "USER32.GetProcessWindowStation",
      "USER32.GetUserObjectInformationW",
      "kernel32.LoadLibraryA",
      "user32.MessageBoxW",
      "kernel32.FreeLibrary",
      "kernel32.ExitProcess"
     ],
     "error": {},
     "label": "module_entry",
     "n_apis": 13,
     "start_addr": "0x17d7e66"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 13,
    "final_profile": [
     {
      "key": "trace_tail",
      "value": "True"
     },
     {
      "key": "hostname",
      "value": "DESKTOP-7F3K9A2"
     },
     {
      "key": "user_name",
      "value": "john.doe"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": false,
     "distinct": 13,
     "first": [
      "kernel32.LocalAlloc",
      "kernel32.GetModuleHandleA",
      "kernel32.GetModuleHandleA",
      "kernel32.IsWow64Process",
      "kernel32.IsDebuggerPresent",
      "kernel32.CheckRemoteDebuggerPresent",
      "ntdll.NtQueryInformationProcess",
      "kernel32.GetModuleFileNameW",
      "USER32.GetProcessWindowStation",
      "USER32.GetUserObjectInformationW",
      "kernel32.LoadLibraryA",
      "user32.MessageBoxW",
      "kernel32.FreeLibrary",
      "kernel32.ExitProcess"
     ],
     "recorded": 14,
     "round_n_apis": 14,
     "top": [
      {
       "api": "kernel32.GetModuleHandleA",
       "count": 2
      },
      {
       "api": "USER32.GetProcessWindowStation",
       "count": 1
      },
      {
       "api": "USER32.GetUserObjectInformationW",
       "count": 1
      },
      {
       "api": "kernel32.CheckRemoteDebuggerPresent",
       "count": 1
      },
      {
       "api": "kernel32.ExitProcess",
       "count": 1
      },
      {
       "api": "kernel32.FreeLibrary",
       "count": 1
      },
      {
       "api": "kernel32.GetModuleFileNameW",
       "count": 1
      },
      {
       "api": "kernel32.IsDebuggerPresent",
       "count": 1
      },
      {
       "api": "kernel32.IsWow64Process",
       "count": 1
      },
      {
       "api": "kernel32.LoadLibraryA",
       "count": 1
      },
      {
       "api": "kernel32.LocalAlloc",
       "count": 1
      },
      {
       "api": "ntdll.NtQueryInformationProcess",
       "count": 1
      },
      {
       "api": "user32.MessageBoxW",
       "count": 1
      }
     ]
    },
    "final_watchlist": [
     "kernel32.checkremotedebuggerpresent",
     "kernel32.isdebuggerpresent",
     "ntdll.ntqueryinformationprocess",
     "ntdll.ntquerysysteminformation",
     "ntdll.ntsetinformationthread"
    ],
    "generated": "2026-07-30 00:47:55",
    "harness": {
     "answered_by_emulator": [],
     "blind_spots": [],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [],
    "max_apis": 28,
    "min_apis": 13,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 6,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [
     {
      "apis": [
       13
      ],
      "assisted": false,
      "inconclusive": true,
      "reason": "max_iters",
      "rounds": 1,
      "run": "run_20260729-234511",
      "success": false,
      "verdict": "unresolved"
     },
     {
      "apis": [
       13,
       13
      ],
      "assisted": true,
      "inconclusive": true,
      "reason": "synthesised_data_import",
      "rounds": 2,
      "run": "run_20260729-234845",
      "success": false,
      "verdict": "inconclusive"
     },
     {
      "apis": [
       13,
       13
      ],
      "assisted": true,
      "inconclusive": true,
      "reason": "synthesised_data_import",
      "rounds": 2,
      "run": "run_20260730-000527",
      "success": false,
      "verdict": "inconclusive"
     },
     {
      "apis": [
       13,
       13
      ],
      "assisted": true,
      "inconclusive": true,
      "reason": "synthesised_data_import",
      "rounds": 2,
      "run": "run_20260730-001305",
      "success": false,
      "verdict": "inconclusive"
     },
     {
      "apis": [
       13,
       28
      ],
      "assisted": true,
      "inconclusive": true,
      "reason": "max_iters",
      "rounds": 2,
      "run": "run_20260730-001848",
      "success": false,
      "verdict": "unresolved"
     }
    ],
    "outcome": {
     "assisted": true,
     "exit_meaning": "1 —— 外圈用盡機會仍沒能讓樣本跑起來",
     "inconclusive": true,
     "iterations": 3,
     "n_llm_failures": 1,
     "n_plan_errors": 0,
     "reason": "no_progress",
     "reasons": [
      "no_progress"
     ],
     "success": false,
     "synthesized_apis": [],
     "verdict": "unresolved"
    },
    "partial": false,
    "reason_info": {
     "kind": "warn",
     "label": "連續輪次沒有推進",
     "why": "外圈判定這幾輪沒有把樣本推到更深的地方，停止繼續迭代。同樣是被守衛停下來的，不是收斂。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [
       "kernel32.isdebuggerpresent",
       "kernel32.checkremotedebuggerpresent"
      ],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "kernel32.checkremotedebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isdebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.localalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcrt.__getmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "user32.getuserobjectinformationw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "user32.messageboxw",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [
       {
        "api": "msvcrt.__getmainargs",
        "argc": 5
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "argc": 5
       }
      ],
      "data_imports": [
       {
        "symbol": "msvcrt._adjust_fdiv",
        "val_int": 0,
        "width": 4
       }
      ],
      "delta": null,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 5.48,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 13,
        "start_addr": "0x17d7e66"
       }
      ],
      "llm_calls": 0,
      "llm_diagnosis": "The sample performed standard anti-debugging checks (IsDebuggerPresent, CheckRemoteDebuggerPresent) and detected a debugger in the emulated environment. It then displayed a MessageBoxW with the explicit message 〔引文已移除〕 and exited with code 0xFEE1DEAD (4277006424). The emulator's implementation of IsDebuggerPresent and/or CheckRemoteDebuggerPresent returned TRUE, causing the sample to bail out. These APIs must be answered as FALSE to simulate an ordinary workstation.",
      "llm_seconds": 0.0,
      "n_apis": 13,
      "n_arity_fallbacks": 0,
      "n_faults": 19,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "trace_tail",
        "value": "True"
       }
      ],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "john.doe"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "synthesised_data_import",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": true,
      "stack_checked": 7,
      "stack_unknown": 0,
      "stop": null,
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "warn",
        "text": "樣本這一輪是自己決定結束的（self_abort）—— 它偵測到什麼之後主動退出。"
       }
      ],
      "watchlist_in": []
     },
     {
      "add_watchlist": [
       "ntdll.ntqueryinformationprocess",
       "ntdll.ntsetinformationthread",
       "ntdll.ntquerysysteminformation"
      ],
      "api_added": [
       "kernel32.localfree",
       "ntdll.ntclose",
       "ntdll.ntcreatesection",
       "ntdll.ntmapviewofsection",
       "ntdll.ntopenfile",
       "ntdll.ntprotectvirtualmemory",
       "ntdll.ntqueryinformationprocess",
       "ntdll.ntquerysysteminformation",
       "ntdll.ntsetinformationthread"
      ],
      "api_removed": [],
      "api_scope": [
       {
        "api": "kernel32.checkremotedebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isdebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.localalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.localfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcrt.__getmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "ntdll.ntclose",
        "sources": [
         "args"
        ]
       },
       {
        "api": "ntdll.ntcreatesection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "ntdll.ntmapviewofsection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "ntdll.ntopenfile",
        "sources": [
         "args"
        ]
       },
       {
        "api": "ntdll.ntprotectvirtualmemory",
        "sources": [
         "args"
        ]
       },
       {
        "api": "ntdll.ntqueryinformationprocess",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "ntdll.ntquerysysteminformation",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "ntdll.ntsetinformationthread",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "user32.getuserobjectinformationw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "user32.messageboxw",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [
       {
        "api": "msvcrt.__getmainargs",
        "argc": 5
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "argc": 5
       }
      ],
      "data_imports": [
       {
        "symbol": "msvcrt._adjust_fdiv",
        "val_int": 0,
        "width": 4
       }
      ],
      "delta": 15,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 632.39,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 28,
        "start_addr": "0x17d7e66"
       }
      ],
      "llm_calls": 2,
      "llm_diagnosis": "The sample performed multiple anti-debug checks (IsDebuggerPresent, CheckRemoteDebuggerPresent, NtQueryInformationProcess with ProcessDebugPort, NtSetInformationThread with ThreadHideFromDebugger, NtQuerySystemInformation with SystemKernelDebuggerInformation). One of these checks detected the analysis environment, causing the sample to display a MessageBoxW alerting about a debugger and then exit. The LLM is already answering IsDebuggerPresent and CheckRemoteDebuggerPresent, but the return values (likely FALSE/0) are still triggering the detection. The NtQueryInformationProcess and NtSetInformationThread calls are handled by the emulator and likely returning values that indicate a debugger is present.",
      "llm_seconds": 1.47,
      "n_apis": 28,
      "n_arity_fallbacks": 0,
      "n_faults": 32,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "trace_tail",
        "value": "True"
       },
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "john.doe"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "synthesised_data_import",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": true,
      "stack_checked": 8,
      "stack_unknown": 0,
      "stop": null,
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "warn",
        "text": "樣本這一輪是自己決定結束的（self_abort）—— 它偵測到什麼之後主動退出。"
       }
      ],
      "watchlist_in": [
       "kernel32.checkremotedebuggerpresent",
       "kernel32.isdebuggerpresent"
      ]
     },
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [
       "kernel32.localfree",
       "ntdll.ntclose",
       "ntdll.ntcreatesection",
       "ntdll.ntmapviewofsection",
       "ntdll.ntopenfile",
       "ntdll.ntprotectvirtualmemory"
      ],
      "api_scope": [
       {
        "api": "kernel32.checkremotedebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isdebuggerpresent",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.localalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcrt.__getmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "sources": [
         "conv"
        ]
       },
       {
        "api": "ntdll.ntqueryinformationprocess",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "ntdll.ntquerysysteminformation",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "ntdll.ntsetinformationthread",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "user32.getuserobjectinformationw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "user32.messageboxw",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [
       {
        "api": "msvcrt.__getmainargs",
        "argc": 5
       },
       {
        "api": "msvcrt.__wgetmainargs",
        "argc": 5
       }
      ],
      "data_imports": [
       {
        "symbol": "msvcrt._adjust_fdiv",
        "val_int": 0,
        "width": 4
       }
      ],
      "delta": -14,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 5.23,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 14,
        "start_addr": "0x17d7e66"
       }
      ],
      "llm_calls": 4,
      "llm_diagnosis": "The sample performed anti-debugging checks via IsDebuggerPresent, CheckRemoteDebuggerPresent, and NtQueryInformationProcess (ProcessDebugPort). The LLM handler for NtQueryInformationProcess timed out, causing the emulator to fall back to a synthesised return value. The sample detected this inconsistency and displayed a debugger-detected message box before exiting. The anti-debug checks need to return consistent, clean values indicating no debugger is present.",
      "llm_seconds": 371.62,
      "n_apis": 14,
      "n_arity_fallbacks": 0,
      "n_faults": 20,
      "n_stack_mismatch": 0,
      "nudged": true,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "trace_tail",
        "value": "True"
       },
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "john.doe"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "synthesised_data_import",
      "round": 3,
      "seeded_watchlist": [],
      "self_abort": true,
      "stack_checked": 7,
      "stack_unknown": 0,
      "stop": null,
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "warn",
        "text": "這一輪比上一輪**少** 14 次呼叫。迭代之間不是單調遞增，所以圖表用每輪各自獨立的長條，不做累積堆疊。"
       },
       {
        "kind": "warn",
        "text": "這一輪外圈主動「推」了樣本一把（nudged）—— 有一個值是規則塞的，不是模型要的。"
       },
       {
        "kind": "warn",
        "text": "樣本這一輪是自己決定結束的（self_abort）—— 它偵測到什麼之後主動退出。"
       }
      ],
      "watchlist_in": [
       "kernel32.checkremotedebuggerpresent",
       "kernel32.isdebuggerpresent",
       "ntdll.ntqueryinformationprocess",
       "ntdll.ntquerysysteminformation",
       "ntdll.ntsetinformationthread"
      ]
     }
    ],
    "run": "run_20260730-002948",
    "scale": "linear"
   },
   "id": "4ab7b0dd",
   "kind": "exe",
   "md5": "a1a5e52a7222aaef7394eacb4f6c0fff",
   "sha1": "bb994890c6ee841f9ac714d7fe8d2011d96f80fa",
   "sha256": "4ab7b0dd8c7d28e2d494501b70e229f9e503591476b2ba31afcf53eea4e2e096",
   "size": 9771008,
   "speakeasy": {
    "all_entrypoints": false,
    "apis_total": 13,
    "detail": {},
    "dllmain_only": false,
    "emulation_total_runtime": 1.805,
    "entry_points": [
     {
      "ep_type": "module_entry",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "kernel32.CheckRemoteDebuggerPresent",
       "kernel32.GetModuleFileNameW",
       "USER32.GetProcessWindowStation",
       "USER32.GetUserObjectInformationW",
       "kernel32.LoadLibraryA",
       "user32.MessageBoxW",
       "kernel32.FreeLibrary",
       "kernel32.ExitProcess"
      ],
      "n_apis": 13,
      "start_addr": "0x17d7e66"
     }
    ],
    "is_dll": false,
    "timeout": 60,
    "variant": null,
    "verdict": "clean_exit",
    "wall_seconds": 4.89
   },
   "static": {
    "analysis_notes": [
     "32-bit 樣本：下游模擬器對 x86 的支援與 x64 不同，跑之前先確認。"
    ],
    "arch": "x86",
    "attack_techniques": [
     "Defense Evasion::Obfuscated Files or Information (T1027.002)",
     "Defense Evasion::Virtualization/Sandbox Evasion (T1497.001)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "加殼，需要時間解殼",
      "整檔熵 7.98，可能有加密段"
     ],
     "seconds": 300
    },
    "c2": [
     {
      "benign": true,
      "defanged": "0[.]1[.]0[.]0",
      "source": "static",
      "type": "ip"
     }
    ],
    "capabilities": [
     "reference analysis tools strings",
     "reference anti-VM strings targeting Xen",
     "packed with VMProtect",
     "(internal) packer file limitation"
    ],
    "categories_present": [
     "dynamic_resolve",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "以下工具未成功執行：ghidra。相關維度的結論證據不足，不可以當成「這支樣本沒有這類特徵」。",
     "tools_not_ok": [
      "ghidra"
     ],
     "value": true
    },
    "diec": {
     "compiler": "",
     "detects": [
      {
       "info": "",
       "name": "PELock",
       "type": "protector",
       "version": ""
      },
      {
       "info": "",
       "name": "VMProtect",
       "type": "protector",
       "version": "3.2.0-3.5.0"
      }
     ],
     "is_packed": true,
     "linker": "",
     "packers": [],
     "protectors": [
      "PELock",
      "VMProtect"
     ]
    },
    "floss_counts": {
     "decoded": 0,
     "stack": 0,
     "static": 113354,
     "tight": 0
    },
    "ghidra": {
     "function_count": null,
     "language": null,
     "message": null,
     "stats": {},
     "status": null
    },
    "is_dll": false,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "diec protector: PELock",
      "diec protector: VMProtect",
      "section Rw6CisW0 has zero raw size but 4629548 virtual bytes",
      "section Rw6CisW0 is both writable and executable",
      "section 9wnzE73U has zero raw size but 8192 virtual bytes",
      "section a3t7oDzU has zero raw size but 4849664 virtual bytes",
      "section QiAjfyeY has zero raw size but 4096 virtual bytes",
      "suspicious section name: .vmp0",
      "section .vmp0 has zero raw size but 2949884 virtual bytes",
      "suspicious section name: .vmp1",
      "high entropy section .vmp1 (7.99)",
      "whole-file entropy 7.98"
     ],
     "value": true
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:55:33Z",
     "content_sha256": "a0b310e7178fd175605ca204daf968a6eaed2963fdf858e0722af67ad96b0f17",
     "elapsed_seconds": 185.77,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x86",
     "declared_section_count": 7,
     "delay_imports": [],
     "dll_count": 10,
     "entry_point": 20807270,
     "exports": [],
     "file_entropy": 7.9831,
     "has_rich_header": false,
     "has_signature": false,
     "image_base": 4194304,
     "imphash": "4c86fc4efe1ce3edaa5e139a2af68a83",
     "import_count": 26,
     "imports": [
      "advapi32.dll.RegDeleteKeyA",
      "gdi32.dll.DeleteObject",
      "iphlpapi.dll.GetInterfaceInfo",
      "kernel32.dll.ExitProcess",
      "kernel32.dll.FreeLibrary",
      "kernel32.dll.GetModuleFileNameW",
      "kernel32.dll.GetModuleHandleA",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetProcessAffinityMask",
      "kernel32.dll.LoadLibraryA",
      "kernel32.dll.LocalAlloc",
      "kernel32.dll.LocalFree",
      "kernel32.dll.SetProcessAffinityMask",
      "kernel32.dll.SetThreadAffinityMask",
      "kernel32.dll.Sleep",
      "kernel32.dll.Sleep",
      "kernel32.dll.VirtualQuery",
      "msvcrt.dll.calloc",
      "psapi.dll.GetMappedFileNameW",
      "shell32.dll.SHGetSpecialFolderPathA",
      "shlwapi.dll.PathFileExistsA",
      "user32.dll.GetProcessWindowStation",
      "user32.dll.GetSystemMetrics",
      "user32.dll.GetUserObjectInformationW",
      "user32.dll.GetUserObjectInformationW",
      "wtsapi32.dll.WTSSendMessageW"
     ],
     "is_dll": false,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 332,
     "overlay": null,
     "packer_heuristics": [
      "section Rw6CisW0 has zero raw size but 4629548 virtual bytes",
      "section Rw6CisW0 is both writable and executable",
      "section 9wnzE73U has zero raw size but 8192 virtual bytes",
      "section a3t7oDzU has zero raw size but 4849664 virtual bytes",
      "section QiAjfyeY has zero raw size but 4096 virtual bytes",
      "suspicious section name: .vmp0",
      "section .vmp0 has zero raw size but 2949884 virtual bytes",
      "suspicious section name: .vmp1",
      "high entropy section .vmp1 (7.99)",
      "whole-file entropy 7.98"
     ],
     "resources": [
      {
       "entropy": 4.5671,
       "id": 7,
       "size": 9640,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.0199,
       "id": 8,
       "size": 4264,
       "type": "RT_ICON"
      },
      {
       "entropy": 4.4341,
       "id": 4,
       "size": 3752,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.4517,
       "id": 9,
       "size": 2440,
       "type": "RT_ICON"
      },
      {
       "entropy": 4.7595,
       "id": 5,
       "size": 2216,
       "type": "RT_ICON"
      },
      {
       "entropy": 2.8502,
       "id": 1,
       "size": 1640,
       "type": "RT_ICON"
      },
      {
       "entropy": 2.4909,
       "id": 6,
       "size": 1384,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.9746,
       "id": 10,
       "size": 1128,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.1478,
       "id": 2,
       "size": 744,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.1384,
       "id": 1,
       "size": 558,
       "type": "RT_MANIFEST"
      },
      {
       "entropy": 3.0069,
       "id": 1,
       "size": 320,
       "type": "RT_VERSION"
      },
      {
       "entropy": 2.8518,
       "id": 3,
       "size": 296,
       "type": "RT_ICON"
      },
      {
       "entropy": 2.9798,
       "id": 129,
       "size": 146,
       "type": "RT_GROUP_ICON"
      }
     ],
     "sections": [
      {
       "characteristics": "0xe00000a0",
       "entropy": 0.0,
       "executable": true,
       "name": "Rw6CisW0",
       "raw_size": 0,
       "readable": true,
       "virtual_size": 4629548,
       "writable": true
      },
      {
       "characteristics": "0x60000020",
       "entropy": 0.0,
       "executable": true,
       "name": "9wnzE73U",
       "raw_size": 0,
       "readable": true,
       "virtual_size": 8192,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.0,
       "executable": false,
       "name": "a3t7oDzU",
       "raw_size": 0,
       "readable": true,
       "virtual_size": 4849664,
       "writable": true
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.0,
       "executable": false,
       "name": "QiAjfyeY",
       "raw_size": 0,
       "readable": true,
       "virtual_size": 4096,
       "writable": true
      },
      {
       "characteristics": "0x60000060",
       "entropy": 0.0,
       "executable": true,
       "name": ".vmp0",
       "raw_size": 0,
       "readable": true,
       "virtual_size": 2949884,
       "writable": false
      },
      {
       "characteristics": "0x60000060",
       "entropy": 7.9854,
       "executable": true,
       "name": ".vmp1",
       "raw_size": 9740288,
       "readable": true,
       "virtual_size": 9740224,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 4.7525,
       "executable": false,
       "name": "GkDVzHAH",
       "raw_size": 29696,
       "readable": true,
       "virtual_size": 29266,
       "writable": false
      }
     ],
     "subsystem": 2,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
     "timestamp": 1422179864,
     "timestamp_suspicious": false,
     "timestamp_utc": "2015-01-25T09:57:44Z",
     "tls_callbacks": []
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 26 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.96,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "偵測到 PELock、VMProtect",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 11.2,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "n/a",
      "message": "不是 PyInstaller 打包的檔案（不適用，不是失敗）",
      "seconds": 0.01,
      "status": "skipped"
     },
     {
      "applicable": null,
      "detail": "抽出 113354 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 85.85,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "4 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 87.04,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "1 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.04,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "skipped",
      "message": "sample looks packed and could not be unpacked; decompiling the packer stub is not useful. Re-run with --force-ghidra to override.",
      "seconds": 0.0,
      "status": "skipped"
     }
    ],
    "pyinstaller": {
     "detected": false,
     "entry_count": 0,
     "obfuscator": "",
     "python_version": ""
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.GetModuleHandleA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.LoadLibraryA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegDeleteKeyA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "shell32.dll.SHGetSpecialFolderPathA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_Packer_Section_Names"
     }
    ]
   },
   "summary": {
    "apis_total": 13,
    "arch": "x86",
    "budget_seconds": 300,
    "degraded": true,
    "emulation_seconds": 1.805,
    "id": "4ab7b0dd",
    "is_dll": false,
    "kind": "exe",
    "mirage": true,
    "mirage_apis": [
     13,
     28,
     14
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": true,
    "mirage_last_apis": 14,
    "mirage_max_apis": 28,
    "mirage_reason": "no_progress",
    "mirage_rounds": 3,
    "mirage_scale": "linear",
    "mirage_success": false,
    "mirage_verdict": "unresolved",
    "mirage_warned": false,
    "n_c2": 1,
    "n_c2_non_benign": 0,
    "n_capabilities": 4,
    "n_categories": 3,
    "n_detections": 6,
    "n_entry_points": 1,
    "n_yara": 1,
    "packed": true,
    "size": 9771008,
    "verdict": "clean_exit"
   }
  },
  {
   "baseline_segments": [
    {
     "apis_tail": [
      "ADVAPI32.LookupPrivilegeValueA",
      "ADVAPI32.AdjustTokenPrivileges",
      "KERNEL32.CloseHandle",
      "KERNEL32.GetLastError",
      "KERNEL32.GetLocalTime",
      "KERNEL32.SystemTimeToFileTime",
      "KERNEL32.SystemTimeToFileTime",
      "KERNEL32.CompareFileTime"
     ],
     "error": {},
     "label": "dll_entry.DLL_PROCESS_ATTACH",
     "n_apis": 20,
     "start_addr": "0x1000217f"
    },
    {
     "apis_tail": [
      "USER32.MessageBoxA"
     ],
     "error": {},
     "label": "export.__current_exception",
     "n_apis": 1,
     "start_addr": "0x100014b0"
    },
    {
     "apis_tail": [
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "MSVCR90.memset",
      "KERNEL32.GetModuleFileNameA",
      "KERNEL32.GetFileAttributesA",
      "KERNEL32.GetFileAttributesA",
      "SHELL32.SHGetFolderPathA",
      "KERNEL32.GetFileAttributesA"
     ],
     "error": {},
     "label": "export.__current_exception_context",
     "n_apis": 18,
     "start_addr": "0x10001470"
    },
    {
     "apis_tail": [
      "USER32.MessageBoxA"
     ],
     "error": {},
     "label": "export._except_handler4_common",
     "n_apis": 1,
     "start_addr": "0x10001490"
    },
    {
     "apis_tail": [
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "MSVCR90.memset",
      "KERNEL32.GetModuleFileNameA",
      "KERNEL32.GetFileAttributesA",
      "KERNEL32.GetFileAttributesA",
      "SHELL32.SHGetFolderPathA",
      "KERNEL32.GetFileAttributesA"
     ],
     "error": {},
     "label": "export.memset",
     "n_apis": 18,
     "start_addr": "0x10001470"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 58,
    "final_profile": [
     {
      "key": "hostname",
      "value": "DESKTOP-7F3K9A2"
     },
     {
      "key": "user_name",
      "value": "speakeasy_user"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": false,
     "distinct": 34,
     "first": [
      "KERNEL32.GetSystemTimeAsFileTime",
      "KERNEL32.GetCurrentProcessId",
      "KERNEL32.GetCurrentThreadId",
      "KERNEL32.GetTickCount",
      "KERNEL32.QueryPerformanceCounter",
      "KERNEL32.InterlockedCompareExchange",
      "MSVCR90._initterm_e",
      "MSVCR90._initterm",
      "KERNEL32.InterlockedExchange",
      "MSVCR90.memset",
      "KERNEL32.GetCurrentProcess",
      "ADVAPI32.OpenProcessToken",
      "ADVAPI32.LookupPrivilegeValueA",
      "ADVAPI32.AdjustTokenPrivileges",
      "KERNEL32.CloseHandle",
      "KERNEL32.GetLastError",
      "KERNEL32.GetLocalTime",
      "KERNEL32.SystemTimeToFileTime",
      "KERNEL32.SystemTimeToFileTime",
      "KERNEL32.CompareFileTime",
      "USER32.MessageBoxA",
      "USER32.MessageBoxA",
      "KERNEL32.GetModuleHandleA",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "kernel32.LoadLibraryA",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "KERNEL32.GetProcAddress",
      "MSVCR90.memset",
      "KERNEL32.GetModuleFileNameA",
      "KERNEL32.GetFileAttributesA",
      "MSVCR90.memset",
      "wininet.InternetOpenA",
      "wininet.InternetConnectA",
      "wininet.FtpOpenFileA"
     ],
     "recorded": 86,
     "round_n_apis": 86,
     "top": [
      {
       "api": "KERNEL32.GetProcAddress",
       "count": 18
      },
      {
       "api": "MSVCR90.memset",
       "count": 9
      },
      {
       "api": "wininet.InternetCloseHandle",
       "count": 6
      },
      {
       "api": "MSVCR90.memcpy",
       "count": 5
      },
      {
       "api": "MSVCR90.??_U@YAPAXI@Z",
       "count": 4
      },
      {
       "api": "USER32.MessageBoxA",
       "count": 4
      },
      {
       "api": "wininet.InternetReadFile",
       "count": 3
      },
      {
       "api": "KERNEL32.GetFileAttributesA",
       "count": 2
      },
      {
       "api": "KERNEL32.GetModuleFileNameA",
       "count": 2
      },
      {
       "api": "KERNEL32.GetModuleHandleA",
       "count": 2
      },
      {
       "api": "KERNEL32.SystemTimeToFileTime",
       "count": 2
      },
      {
       "api": "kernel32.LoadLibraryA",
       "count": 2
      },
      {
       "api": "kernel32.VirtualAlloc",
       "count": 2
      },
      {
       "api": "wininet.FtpGetFileSize",
       "count": 2
      },
      {
       "api": "wininet.FtpOpenFileA",
       "count": 2
      },
      {
       "api": "wininet.InternetConnectA",
       "count": 2
      },
      {
       "api": "wininet.InternetOpenA",
       "count": 2
      },
      {
       "api": "ADVAPI32.AdjustTokenPrivileges",
       "count": 1
      },
      {
       "api": "ADVAPI32.LookupPrivilegeValueA",
       "count": 1
      },
      {
       "api": "ADVAPI32.OpenProcessToken",
       "count": 1
      },
      {
       "api": "KERNEL32.CloseHandle",
       "count": 1
      },
      {
       "api": "KERNEL32.CompareFileTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCurrentProcess",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCurrentProcessId",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCurrentThreadId",
       "count": 1
      },
      {
       "api": "KERNEL32.GetLastError",
       "count": 1
      },
      {
       "api": "KERNEL32.GetLocalTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetSystemTimeAsFileTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetTickCount",
       "count": 1
      },
      {
       "api": "KERNEL32.InterlockedCompareExchange",
       "count": 1
      },
      {
       "api": "KERNEL32.InterlockedExchange",
       "count": 1
      },
      {
       "api": "KERNEL32.QueryPerformanceCounter",
       "count": 1
      },
      {
       "api": "MSVCR90._initterm",
       "count": 1
      },
      {
       "api": "MSVCR90._initterm_e",
       "count": 1
      }
     ]
    },
    "final_watchlist": [
     "advapi32.adjusttokenprivileges",
     "advapi32.lookupprivilegevaluea",
     "advapi32.openprocesstoken",
     "kernel32.getfileattributesa",
     "kernel32.getlocaltime",
     "kernel32.getmodulefilenamea",
     "kernel32.systemtimetofiletime",
     "shell32.shgetfolderpatha",
     "wininet.internetreadfile"
    ],
    "generated": "2026-07-28 01:17:01",
    "harness": {
     "answered_by_emulator": [
      "??_u@yapaxi@z -> msvcrt.malloc (真的堆積配置)",
      "ftpgetfilesize -> wininet netman (罐頭回應的實際大小)",
      "ftpopenfilea -> wininet netman (真的 request 物件)"
     ],
     "blind_spots": [
      {
       "api": "KERNEL32.GetLocalTime",
       "field": "lpSystemTime"
      },
      {
       "api": "KERNEL32.SystemTimeToFileTime",
       "field": "lpFileTime"
      }
     ],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [
     {
      "api": "wininet.InternetReadFile",
      "size": 4096
     },
     {
      "api": "wininet.InternetReadFile",
      "size": 4096
     }
    ],
    "max_apis": 86,
    "min_apis": 58,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 1,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [],
    "outcome": {
     "assisted": true,
     "exit_meaning": "1 —— 外圈用盡機會仍沒能讓樣本跑起來",
     "inconclusive": true,
     "iterations": 3,
     "n_llm_failures": 0,
     "n_plan_errors": 0,
     "reason": "no_progress",
     "reasons": [
      "no_progress"
     ],
     "success": false,
     "synthesized_apis": [],
     "verdict": "unresolved"
    },
    "partial": false,
    "reason_info": {
     "kind": "warn",
     "label": "連續輪次沒有推進",
     "why": "外圈判定這幾輪沒有把樣本推到更深的地方，停止繼續迭代。同樣是被守衛停下來的，不是收斂。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [
       "kernel32.getlocaltime",
       "kernel32.systemtimetofiletime",
       "shell32.shgetfolderpatha",
       "kernel32.getmodulefilenamea",
       "kernel32.getfileattributesa",
       "advapi32.openprocesstoken",
       "advapi32.lookupprivilegevaluea",
       "advapi32.adjusttokenprivileges"
      ],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "advapi32.adjusttokenprivileges",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "advapi32.lookupprivilegevaluea",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "advapi32.openprocesstoken",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfileattributesa",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getlocaltime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamea",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.systemtimetofiletime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "msvcr90.memset",
        "sources": [
         "args"
        ]
       },
       {
        "api": "shell32.shgetfolderpatha",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "user32.messageboxa",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": null,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 0.34,
      "entry_points": [],
      "llm_calls": 0,
      "llm_diagnosis": "The sample performed environment reconnaissance and found indicators of an analysis sandbox. It checked for specific desktop shortcuts (〔檔名已移除〕, 〔檔名已移除〕, and a Chinese-named .lnk) that do not exist in the emulator's default user profile. It also detected the emulator's artifact username 〔引文已移除〕 via SHGetFolderPathA and GetModuleFileNameA returning 〔引文已移除〕 (suggesting the sample is injected into or masquerading as svchost). The sample displayed 〔引文已移除〕, 〔引文已移除〕, 〔引文已移除〕 message boxes and exited cleanly (exit code 0) after failing these environment checks. Additionally, the emulator's GetLocalTime and SystemTimeToFileTime handlers left their output parameters uninitialized (emulator_blind_spots), causing CompareFileTime to operate on garbage data, which likely contributed to the 〔引文已移除〕 logic branching.",
      "llm_seconds": 0.0,
      "n_apis": 58,
      "n_arity_fallbacks": 0,
      "n_faults": 0,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "speakeasy_user"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "clean",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 0,
      "stack_unknown": 0,
      "stop": null,
      "synth_fills": [],
      "verdict": "bailed",
      "warnings": [],
      "watchlist_in": []
     },
     {
      "add_watchlist": [
       "wininet.internetreadfile"
      ],
      "api_added": [
       "kernel32.virtualalloc",
       "msvcr90.??_u@yapaxi@z",
       "msvcr90.memcpy",
       "wininet.ftpgetfilesize",
       "wininet.ftpopenfilea",
       "wininet.internetclosehandle",
       "wininet.internetconnecta",
       "wininet.internetopena",
       "wininet.internetreadfile"
      ],
      "api_removed": [
       "kernel32.closehandle"
      ],
      "api_scope": [
       {
        "api": "advapi32.adjusttokenprivileges",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "advapi32.lookupprivilegevaluea",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "advapi32.openprocesstoken",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getfileattributesa",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getlocaltime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamea",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.systemtimetofiletime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.virtualalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.??_u@yapaxi@z",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.memcpy",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.memset",
        "sources": [
         "args"
        ]
       },
       {
        "api": "shell32.shgetfolderpatha",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "user32.messageboxa",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.ftpgetfilesize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.ftpopenfilea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetclosehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetconnecta",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetopena",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetreadfile",
        "sources": [
         "watch",
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 24,
      "dispatch_raises": [],
      "dynamic_code": [
       {
        "base": "0x50000",
        "ours": false,
        "size": "0x1000",
        "tag": "api.VirtualAlloc.0x50000"
       },
       {
        "base": "0x51000",
        "ours": false,
        "size": "0x1000",
        "tag": "api.VirtualAlloc.0x51000"
       }
      ],
      "emu_seconds": 0.51,
      "entry_points": [],
      "llm_calls": 8,
      "llm_diagnosis": "The sample downloads two files via FTP, copies each into a freshly allocated RWX page, and then crashes with an invalid-instruction fault inside that page. The emulator serves canned content for InternetReadFile (recorded in content_we_fabricated), so the shellcode is our placeholder bytes rather than the real payload. The crash is therefore expected and not an anti-analysis check; the sample would execute the real payload on a live host.",
      "llm_seconds": 22.04,
      "n_apis": 82,
      "n_arity_fallbacks": 0,
      "n_faults": 0,
      "n_stack_mismatch": 0,
      "nudged": true,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "speakeasy_user"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "crash_after_llm_answer",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 0,
      "stack_unknown": 0,
      "stop": {
       "address": "0x50000",
       "instr": "disasm_failed",
       "pc": "0x50000",
       "sp": "0x01211f78",
       "type": "Invalid instruction (UC_ERR_INSN_INVALID)"
      },
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "warn",
        "text": "這一輪外圈主動「推」了樣本一把（nudged）—— 有一個值是規則塞的，不是模型要的。"
       }
      ],
      "watchlist_in": [
       "advapi32.adjusttokenprivileges",
       "advapi32.lookupprivilegevaluea",
       "advapi32.openprocesstoken",
       "kernel32.getfileattributesa",
       "kernel32.getlocaltime",
       "kernel32.getmodulefilenamea",
       "kernel32.systemtimetofiletime",
       "shell32.shgetfolderpatha"
      ]
     },
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "advapi32.adjusttokenprivileges",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "advapi32.lookupprivilegevaluea",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "advapi32.openprocesstoken",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getfileattributesa",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getlocaltime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamea",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulehandlea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibrarya",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.systemtimetofiletime",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "kernel32.virtualalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.??_u@yapaxi@z",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.memcpy",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90.memset",
        "sources": [
         "args"
        ]
       },
       {
        "api": "shell32.shgetfolderpatha",
        "sources": [
         "watch"
        ]
       },
       {
        "api": "user32.messageboxa",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.ftpgetfilesize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.ftpopenfilea",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetclosehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetconnecta",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetopena",
        "sources": [
         "args"
        ]
       },
       {
        "api": "wininet.internetreadfile",
        "sources": [
         "watch",
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 4,
      "dispatch_raises": [],
      "dynamic_code": [
       {
        "base": "0x50000",
        "ours": false,
        "size": "0x1000",
        "tag": "api.VirtualAlloc.0x50000"
       },
       {
        "base": "0x51000",
        "ours": false,
        "size": "0x1000",
        "tag": "api.VirtualAlloc.0x51000"
       }
      ],
      "emu_seconds": 0.47,
      "entry_points": [],
      "llm_calls": 10,
      "llm_diagnosis": "The sample successfully downloaded a payload via FTP (two separate transfers), copied the received bytes into RWX memory allocated with VirtualAlloc, and then displayed 〔引文已移除〕/〔引文已移除〕 message boxes before crashing with an unhandled interrupt (exit code 0x121212C). The crash occurs after the LLM-synthesised InternetReadFile returns, indicating the fabricated file content did not satisfy the payload's validation (checksum, magic bytes, or decryption routine). Because the emulator has no real network, the content served to InternetReadFile is a canned placeholder; the sample detects the mismatch and aborts. No anti-analysis checks or missing APIs caused the failure.",
      "llm_seconds": 31.79,
      "n_apis": 86,
      "n_arity_fallbacks": 0,
      "n_faults": 0,
      "n_stack_mismatch": 0,
      "nudged": true,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9A2"
       },
       {
        "key": "user_name",
        "value": "speakeasy_user"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "crash_after_llm_answer",
      "round": 3,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 0,
      "stack_unknown": 0,
      "stop": {
       "address": "0x50000",
       "instr": "pop ds",
       "pc": "0x50000",
       "sp": "0x01211f78",
       "type": "unhandled_interrupt"
      },
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "warn",
        "text": "這一輪外圈主動「推」了樣本一把（nudged）—— 有一個值是規則塞的，不是模型要的。"
       }
      ],
      "watchlist_in": [
       "advapi32.adjusttokenprivileges",
       "advapi32.lookupprivilegevaluea",
       "advapi32.openprocesstoken",
       "kernel32.getfileattributesa",
       "kernel32.getlocaltime",
       "kernel32.getmodulefilenamea",
       "kernel32.systemtimetofiletime",
       "shell32.shgetfolderpatha",
       "wininet.internetreadfile"
      ]
     }
    ],
    "run": "run_20260726-234547-068",
    "scale": "linear"
   },
   "id": "787f2b0c",
   "kind": "dll",
   "md5": "6f8a3c0376d227a1425d849c6ec64e9f",
   "sha1": "77fdb6add6aa14e53360f1fd5c2736717d990eec",
   "sha256": "787f2b0cd8ee87cd4a6b38fc42f02932888f8336b02e4c727ff8ea411985d0b9",
   "size": 24064,
   "speakeasy": {
    "all_entrypoints": true,
    "apis_total": 58,
    "detail": {},
    "dllmain_only": false,
    "emulation_total_runtime": 0.186,
    "entry_points": [
     {
      "ep_type": "dll_entry.DLL_PROCESS_ATTACH",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "ADVAPI32.LookupPrivilegeValueA",
       "ADVAPI32.AdjustTokenPrivileges",
       "KERNEL32.CloseHandle",
       "KERNEL32.GetLastError",
       "KERNEL32.GetLocalTime",
       "KERNEL32.SystemTimeToFileTime",
       "KERNEL32.SystemTimeToFileTime",
       "KERNEL32.CompareFileTime"
      ],
      "n_apis": 20,
      "start_addr": "0x1000217f"
     },
     {
      "ep_type": "export.__current_exception",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "USER32.MessageBoxA"
      ],
      "n_apis": 1,
      "start_addr": "0x100014b0"
     },
     {
      "ep_type": "export.__current_exception_context",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "KERNEL32.GetProcAddress",
       "KERNEL32.GetProcAddress",
       "MSVCR90.memset",
       "KERNEL32.GetModuleFileNameA",
       "KERNEL32.GetFileAttributesA",
       "KERNEL32.GetFileAttributesA",
       "SHELL32.SHGetFolderPathA",
       "KERNEL32.GetFileAttributesA"
      ],
      "n_apis": 18,
      "start_addr": "0x10001470"
     },
     {
      "ep_type": "export._except_handler4_common",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "USER32.MessageBoxA"
      ],
      "n_apis": 1,
      "start_addr": "0x10001490"
     },
     {
      "ep_type": "export.memset",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "KERNEL32.GetProcAddress",
       "KERNEL32.GetProcAddress",
       "MSVCR90.memset",
       "KERNEL32.GetModuleFileNameA",
       "KERNEL32.GetFileAttributesA",
       "KERNEL32.GetFileAttributesA",
       "SHELL32.SHGetFolderPathA",
       "KERNEL32.GetFileAttributesA"
      ],
      "n_apis": 18,
      "start_addr": "0x10001470"
     }
    ],
    "is_dll": true,
    "timeout": 60,
    "variant": {
     "all_entrypoints": false,
     "apis_total": 20,
     "dllmain_only": true,
     "emulation_total_runtime": 0.109,
     "label": "只跑 DllMain",
     "note": "同一支樣本，只跑 DllMain 得到 20 個 API，跑全部匯出函式得到 58 個。正式數據採用後者。"
    },
    "verdict": "clean_exit",
    "wall_seconds": 0.22
   },
   "static": {
    "analysis_notes": [
     "32-bit 樣本：下游模擬器對 x86 的支援與 x64 不同，跑之前先確認。"
    ],
    "arch": "x86",
    "attack_techniques": [
     "Defense Evasion::Obfuscated Files or Information (T1027.005)",
     "Discovery::File and Directory Discovery (T1083)",
     "Execution::Command and Scripting Interpreter (T1059)",
     "Execution::Shared Modules (T1129)",
     "Privilege Escalation::Access Token Manipulation (T1134)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "有網路行為，要留時間給連線與重試",
      "有注入相關 API",
      "多重反分析檢測，可能需要多輪迭代"
     ],
     "seconds": 300
    },
    "c2": [
     {
      "benign": false,
      "defanged": "38[.]181[.]44[.]126",
      "source": "decoded",
      "type": "ip"
     }
    ],
    "capabilities": [
     "contain obfuscated stackstrings",
     "contains PDB path",
     "accept command line arguments",
     "get common file path",
     "check if file exists",
     "get file attributes",
     "create process on Windows",
     "acquire debug privileges",
     "modify access privileges",
     "terminate process",
     "set registry value",
     "link function at runtime on Windows",
     "link many functions at runtime"
    ],
    "categories_present": [
     "anti_debug",
     "dynamic_resolve",
     "injection",
     "network",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "",
     "tools_not_ok": [],
     "value": false
    },
    "diec": {
     "compiler": "Microsoft Visual C/C++",
     "detects": [
      {
       "info": "",
       "name": "Microsoft Linker",
       "type": "linker",
       "version": "9.00.21022"
      },
      {
       "info": "LTCG/C++",
       "name": "Microsoft Visual C/C++",
       "type": "compiler",
       "version": "15.00.21022"
      },
      {
       "info": "",
       "name": "Microsoft Visual Studio",
       "type": "tool",
       "version": "2008"
      },
      {
       "info": "codeview",
       "name": "Records",
       "type": "debug data",
       "version": ""
      }
     ],
     "is_packed": false,
     "linker": "Microsoft Linker",
     "packers": [],
     "protectors": []
    },
    "floss_counts": {
     "decoded": 34,
     "stack": 16,
     "static": 292,
     "tight": 3
    },
    "ghidra": {
     "function_count": 90,
     "language": "x86:LE:32:default",
     "message": "",
     "stats": {
      "api_symbols_matched": 12,
      "candidate_functions": 7,
      "decompile_incomplete": 0,
      "emitted": 10,
      "entry_points_emitted": 3
     },
     "status": "ok"
    },
    "is_dll": true,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "判定未加殼：DiE 未偵測到殼，且 PE 區段熵、virtual/raw 大小落差、匯入表數量都沒有出現加殼特徵"
     ],
     "value": false
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:58:39Z",
     "content_sha256": "f1df905644fbd7a0141ffc92cd170c02a188835b999066334eebe0b5d73d300c",
     "elapsed_seconds": 36.75,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x86",
     "declared_section_count": 5,
     "delay_imports": [],
     "dll_count": 5,
     "entry_point": 8575,
     "exports": [
      "__current_exception",
      "__current_exception_context",
      "_except_handler4_common",
      "memset"
     ],
     "file_entropy": 5.1992,
     "has_rich_header": true,
     "has_signature": false,
     "image_base": 268435456,
     "imphash": "ef58af71fcb1ee18471f3790a2f4047a",
     "import_count": 56,
     "imports": [
      "advapi32.dll.AdjustTokenPrivileges",
      "advapi32.dll.LookupPrivilegeValueA",
      "advapi32.dll.OpenProcessToken",
      "advapi32.dll.RegCloseKey",
      "advapi32.dll.RegCreateKeyExA",
      "advapi32.dll.RegSetValueExA",
      "kernel32.dll.CloseHandle",
      "kernel32.dll.CompareFileTime",
      "kernel32.dll.CreateProcessA",
      "kernel32.dll.GetCommandLineA",
      "kernel32.dll.GetCurrentProcess",
      "kernel32.dll.GetCurrentProcessId",
      "kernel32.dll.GetCurrentThreadId",
      "kernel32.dll.GetFileAttributesA",
      "kernel32.dll.GetLastError",
      "kernel32.dll.GetLocalTime",
      "kernel32.dll.GetModuleFileNameA",
      "kernel32.dll.GetModuleHandleA",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetSystemTimeAsFileTime",
      "kernel32.dll.GetTickCount",
      "kernel32.dll.InterlockedCompareExchange",
      "kernel32.dll.InterlockedExchange",
      "kernel32.dll.IsDebuggerPresent",
      "kernel32.dll.QueryPerformanceCounter",
      "kernel32.dll.SetUnhandledExceptionFilter",
      "kernel32.dll.Sleep",
      "kernel32.dll.SystemTimeToFileTime",
      "kernel32.dll.TerminateProcess",
      "kernel32.dll.UnhandledExceptionFilter",
      "kernel32.dll.lstrlenA",
      "msvcr90.dll.??3@YAXPAX@Z",
      "msvcr90.dll.??_U@YAPAXI@Z",
      "msvcr90.dll.__CppXcptFilter",
      "msvcr90.dll.__clean_type_info_names_internal",
      "msvcr90.dll.__dllonexit",
      "msvcr90.dll._adjust_fdiv",
      "msvcr90.dll._amsg_exit",
      "msvcr90.dll._crt_debugger_hook",
      "msvcr90.dll._decode_pointer",
      "msvcr90.dll._encode_pointer",
      "msvcr90.dll._encoded_null",
      "msvcr90.dll._initterm",
      "msvcr90.dll._initterm_e",
      "msvcr90.dll._lock",
      "msvcr90.dll._malloc_crt",
      "msvcr90.dll._mbsstr",
      "msvcr90.dll._onexit",
      "msvcr90.dll._unlock",
      "msvcr90.dll.free",
      "msvcr90.dll.memcpy",
      "msvcr90.dll.memset",
      "shell32.dll.#680",
      "shell32.dll.SHGetFolderPathA",
      "user32.dll.MessageBoxA",
      "user32.dll.wsprintfA"
     ],
     "is_dll": true,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 332,
     "overlay": null,
     "packer_heuristics": [],
     "resources": [
      {
       "entropy": 4.0574,
       "id": 5,
       "size": 3752,
       "type": "RT_ICON"
      },
      {
       "entropy": 4.1067,
       "id": 4,
       "size": 2216,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.27,
       "id": 3,
       "size": 1640,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.736,
       "id": 6,
       "size": 1384,
       "type": "RT_ICON"
      },
      {
       "entropy": 3.4057,
       "id": 1,
       "size": 744,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.0207,
       "id": 2,
       "size": 598,
       "type": "RT_MANIFEST"
      },
      {
       "entropy": 3.1653,
       "id": 2,
       "size": 296,
       "type": "RT_ICON"
      },
      {
       "entropy": 2.8667,
       "id": 102,
       "size": 90,
       "type": "RT_GROUP_ICON"
      }
     ],
     "sections": [
      {
       "characteristics": "0x60000020",
       "entropy": 6.0274,
       "executable": true,
       "name": ".text",
       "raw_size": 6144,
       "readable": true,
       "virtual_size": 5734,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 4.7287,
       "executable": false,
       "name": ".rdata",
       "raw_size": 3072,
       "readable": true,
       "virtual_size": 2764,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.7256,
       "executable": false,
       "name": ".data",
       "raw_size": 1536,
       "readable": true,
       "virtual_size": 1956,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 4.5901,
       "executable": false,
       "name": ".rsrc",
       "raw_size": 11264,
       "readable": true,
       "virtual_size": 11196,
       "writable": false
      },
      {
       "characteristics": "0x42000040",
       "entropy": 3.6989,
       "executable": false,
       "name": ".reloc",
       "raw_size": 1024,
       "readable": true,
       "virtual_size": 722,
       "writable": false
      }
     ],
     "subsystem": 2,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
     "timestamp": 1751900222,
     "timestamp_suspicious": false,
     "timestamp_utc": "2025-07-07T14:57:02Z",
     "tls_callbacks": []
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 56 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.01,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "未偵測到殼",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 11.97,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "n/a",
      "message": "不是 PyInstaller 打包的檔案（不適用，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": null,
      "detail": "抽出 345 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 6.21,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "13 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 9.37,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "2 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.01,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "10 個函式",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "ok",
      "message": "",
      "seconds": 9.14,
      "status": "ok"
     }
    ],
    "pyinstaller": {
     "detected": false,
     "entry_count": 0,
     "obfuscator": "",
     "python_version": ""
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.IsDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.SetUnhandledExceptionFilter",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "LoadLibraryA",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "string"
     },
     {
      "api": "VirtualAlloc",
      "categories": [
       "injection"
      ],
      "source": "string"
     },
     {
      "api": "FtpOpenFileA",
      "categories": [
       "network"
      ],
      "source": "string"
     },
     {
      "api": "InternetConnectA",
      "categories": [
       "network"
      ],
      "source": "string"
     },
     {
      "api": "InternetOpenA",
      "categories": [
       "network"
      ],
      "source": "string"
     },
     {
      "api": "InternetReadFile",
      "categories": [
       "network"
      ],
      "source": "string"
     },
     {
      "api": "advapi32.dll.RegCreateKeyExA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "advapi32.dll.RegSetValueExA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateProcessA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "shell32.dll.SHGetFolderPathA",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetSystemTimeAsFileTime",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetTickCount",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceCounter",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_AntiDebug_Imports"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Timing_Check_Imports"
     }
    ]
   },
   "summary": {
    "apis_total": 58,
    "arch": "x86",
    "budget_seconds": 300,
    "degraded": false,
    "emulation_seconds": 0.186,
    "id": "787f2b0c",
    "is_dll": true,
    "kind": "dll",
    "mirage": true,
    "mirage_apis": [
     58,
     82,
     86
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": true,
    "mirage_last_apis": 86,
    "mirage_max_apis": 86,
    "mirage_reason": "no_progress",
    "mirage_rounds": 3,
    "mirage_scale": "linear",
    "mirage_success": false,
    "mirage_verdict": "unresolved",
    "mirage_warned": false,
    "n_c2": 1,
    "n_c2_non_benign": 1,
    "n_capabilities": 13,
    "n_categories": 6,
    "n_detections": 18,
    "n_entry_points": 5,
    "n_yara": 2,
    "packed": false,
    "size": 24064,
    "verdict": "clean_exit"
   }
  },
  {
   "baseline_segments": [
    {
     "apis_tail": [
      "KERNEL32.GetCurrentThreadId",
      "KERNEL32.GetTickCount",
      "KERNEL32.QueryPerformanceCounter",
      "KERNEL32.GetStartupInfoW",
      "KERNEL32.InterlockedCompareExchange",
      "MSVCR90._initterm_e",
      "MSVCR90._initterm",
      "KERNEL32.InterlockedExchange"
     ],
     "error": {},
     "label": "module_entry",
     "n_apis": 10,
     "start_addr": "0x401825"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 10,
    "final_profile": [
     {
      "key": "run_initterm",
      "value": "True"
     },
     {
      "key": "hostname",
      "value": "DESKTOP-7F4K9J2"
     },
     {
      "key": "user_name",
      "value": "User"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": false,
     "distinct": 18,
     "first": [
      "KERNEL32.GetSystemTimeAsFileTime",
      "KERNEL32.GetCurrentProcessId",
      "KERNEL32.GetCurrentThreadId",
      "KERNEL32.GetTickCount",
      "KERNEL32.QueryPerformanceCounter",
      "KERNEL32.GetStartupInfoW",
      "KERNEL32.InterlockedCompareExchange",
      "MSVCR90._initterm_e",
      "MSVCR90._initterm",
      "KERNEL32.InterlockedExchange",
      "MSVCR90.__set_app_type",
      "KERNEL32.SetUnhandledExceptionFilter",
      "MSVCR90._decode_pointer",
      "MSVCR90._lock",
      "MSVCR90._decode_pointer",
      "MSVCR90._decode_pointer",
      "MSVCR90._encode_pointer",
      "MSVCR90.__dllonexit",
      "MSVCR90._encode_pointer",
      "MSVCR90._encode_pointer",
      "MSVCR90._unlock",
      "MSVCR90.__wgetmainargs"
     ],
     "recorded": 22,
     "round_n_apis": 22,
     "top": [
      {
       "api": "MSVCR90._decode_pointer",
       "count": 3
      },
      {
       "api": "MSVCR90._encode_pointer",
       "count": 3
      },
      {
       "api": "KERNEL32.GetCurrentProcessId",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCurrentThreadId",
       "count": 1
      },
      {
       "api": "KERNEL32.GetStartupInfoW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetSystemTimeAsFileTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetTickCount",
       "count": 1
      },
      {
       "api": "KERNEL32.InterlockedCompareExchange",
       "count": 1
      },
      {
       "api": "KERNEL32.InterlockedExchange",
       "count": 1
      },
      {
       "api": "KERNEL32.QueryPerformanceCounter",
       "count": 1
      },
      {
       "api": "KERNEL32.SetUnhandledExceptionFilter",
       "count": 1
      },
      {
       "api": "MSVCR90.__dllonexit",
       "count": 1
      },
      {
       "api": "MSVCR90.__set_app_type",
       "count": 1
      },
      {
       "api": "MSVCR90.__wgetmainargs",
       "count": 1
      },
      {
       "api": "MSVCR90._initterm",
       "count": 1
      },
      {
       "api": "MSVCR90._initterm_e",
       "count": 1
      },
      {
       "api": "MSVCR90._lock",
       "count": 1
      },
      {
       "api": "MSVCR90._unlock",
       "count": 1
      }
     ]
    },
    "final_watchlist": [
     "msvcr90._decode_pointer",
     "msvcr90._encode_pointer"
    ],
    "generated": "2026-07-28 14:30:40",
    "harness": {
     "answered_by_emulator": [
      "_initterm -> 把初始化表裡的函式排成 run(profile: run_initterm)",
      "_initterm_e -> 把初始化表裡的函式排成 run(profile: run_initterm)"
     ],
     "blind_spots": [],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [],
    "max_apis": 22,
    "min_apis": 10,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 1,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [],
    "outcome": {
     "assisted": true,
     "exit_meaning": "1 —— 外圈用盡機會仍沒能讓樣本跑起來",
     "inconclusive": true,
     "iterations": 2,
     "n_llm_failures": 0,
     "n_plan_errors": 0,
     "reason": "no_behaviour_change",
     "reasons": [
      "no_behaviour_change"
     ],
     "success": false,
     "synthesized_apis": [
      "MSVCR90._decode_pointer",
      "MSVCR90._encode_pointer"
     ],
     "verdict": "unresolved"
    },
    "partial": false,
    "reason_info": {
     "kind": "warn",
     "label": "連續兩輪行為沒有變化",
     "why": "外圈的守衛看到這一輪跟上一輪的軌跡指紋一樣，判定再跑也不會不同，主動停手。這是被守衛停下來的，不是樣本自然跑完。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [
       "msvcr90._decode_pointer",
       "msvcr90._encode_pointer"
      ],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "msvcr90.__set_app_type",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90._decode_pointer",
        "sources": [
         "watch",
         "synth",
         "sig"
        ]
       },
       {
        "api": "msvcr90._encode_pointer",
        "sources": [
         "watch",
         "synth",
         "sig",
         "raise"
        ]
       },
       {
        "api": "msvcr90._lock",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90._unlock",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [
       {
        "api": "msvcr90._decode_pointer",
        "argc": 1,
        "conflicts": 0,
        "conv": "cdecl",
        "source": "llm"
       },
       {
        "api": "msvcr90._encode_pointer",
        "argc": 1,
        "conflicts": 0,
        "conv": "cdecl",
        "source": "llm"
       }
      ],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": null,
      "dispatch_raises": [
       {
        "api": "MSVCR90._encode_pointer",
        "exception": "UcError: Invalid memory read (UC_ERR_READ_UNMAPPED)"
       }
      ],
      "dynamic_code": [],
      "emu_seconds": 0.21,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 10,
        "start_addr": "0x401825"
       },
       {
        "ep_type": "initterm_0x401744",
        "error": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)",
        "n_apis": 1,
        "start_addr": "0x401744"
       },
       {
        "ep_type": "initterm_0x401871",
        "error": "",
        "n_apis": 1,
        "start_addr": "0x401871"
       },
       {
        "ep_type": "initterm_0x40151b",
        "error": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)",
        "n_apis": 10,
        "start_addr": "0x40151b"
       }
      ],
      "llm_calls": 5,
      "llm_diagnosis": "The sample is a Visual C++ 2008 (MSVCR90) binary that crashes during CRT initialization because the emulator does not implement _decode_pointer and _encode_pointer. These are security-cookie helpers used by the CRT to protect function pointers; the LLM was asked to synthesize them but declared an incorrect arity, so the return values were garbage. The subsequent __dllonexit call received a bad encoded pointer, and the process later faulted on an unmapped fetch. This is an emulator gap, not anti-analysis behavior.",
      "llm_seconds": 21.79,
      "n_apis": 22,
      "n_arity_fallbacks": 0,
      "n_faults": 27,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "run_initterm",
        "value": "True"
       }
      ],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F4K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "llm_declared_arity",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 18,
      "stack_unknown": 2,
      "stop": {
       "address": "0xfeedf034",
       "instr": "disasm_failed",
       "pc": "0xfeedf034",
       "sp": "0x01211ff0",
       "type": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)"
      },
      "synth_fills": [
       {
        "api": "msvcr90._decode_pointer",
        "applied": 0,
        "calls": 4,
        "calls_with_writes": 0,
        "proposed": 0
       },
       {
        "api": "msvcr90._encode_pointer",
        "applied": 0,
        "calls": 6,
        "calls_with_writes": 0,
        "proposed": 0
       }
      ],
      "verdict": "inconclusive",
      "warnings": [],
      "watchlist_in": []
     },
     {
      "add_watchlist": [],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "msvcr90.__set_app_type",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90._decode_pointer",
        "sources": [
         "watch",
         "synth",
         "sig"
        ]
       },
       {
        "api": "msvcr90._encode_pointer",
        "sources": [
         "watch",
         "synth",
         "sig",
         "raise"
        ]
       },
       {
        "api": "msvcr90._lock",
        "sources": [
         "args"
        ]
       },
       {
        "api": "msvcr90._unlock",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [
       {
        "api": "msvcr90._decode_pointer",
        "argc": 1,
        "conflicts": 0,
        "conv": "cdecl",
        "source": "llm"
       },
       {
        "api": "msvcr90._encode_pointer",
        "argc": 1,
        "conflicts": 0,
        "conv": "cdecl",
        "source": "llm"
       }
      ],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 0,
      "dispatch_raises": [
       {
        "api": "MSVCR90._encode_pointer",
        "exception": "UcError: Invalid memory read (UC_ERR_READ_UNMAPPED)"
       }
      ],
      "dynamic_code": [],
      "emu_seconds": 0.24,
      "entry_points": [
       {
        "ep_type": "module_entry",
        "error": "",
        "n_apis": 10,
        "start_addr": "0x401825"
       },
       {
        "ep_type": "initterm_0x401744",
        "error": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)",
        "n_apis": 1,
        "start_addr": "0x401744"
       },
       {
        "ep_type": "initterm_0x401871",
        "error": "",
        "n_apis": 1,
        "start_addr": "0x401871"
       },
       {
        "ep_type": "initterm_0x40151b",
        "error": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)",
        "n_apis": 10,
        "start_addr": "0x40151b"
       }
      ],
      "llm_calls": 5,
      "llm_diagnosis": "",
      "llm_seconds": 6.47,
      "n_apis": 22,
      "n_arity_fallbacks": 0,
      "n_faults": 27,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "run_initterm",
        "value": "True"
       },
       {
        "key": "hostname",
        "value": "DESKTOP-7F4K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "llm_declared_arity",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 18,
      "stack_unknown": 2,
      "stop": {
       "address": "0xfeedf034",
       "instr": "disasm_failed",
       "pc": "0xfeedf034",
       "sp": "0x01211ff0",
       "type": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)"
      },
      "synth_fills": [
       {
        "api": "msvcr90._decode_pointer",
        "applied": 0,
        "calls": 4,
        "calls_with_writes": 0,
        "proposed": 0
       },
       {
        "api": "msvcr90._encode_pointer",
        "applied": 0,
        "calls": 6,
        "calls_with_writes": 0,
        "proposed": 0
       }
      ],
      "verdict": "inconclusive",
      "warnings": [],
      "watchlist_in": [
       "msvcr90._decode_pointer",
       "msvcr90._encode_pointer"
      ]
     }
    ],
    "run": "run_20260728-142959",
    "scale": "linear"
   },
   "id": "9787788d",
   "kind": "exe",
   "md5": "73c4a1248e4fb6bb8430872a61ea76ea",
   "sha1": "517c8575d14540ecd15df6714cbb226b2f6c0e21",
   "sha256": "9787788d19b47b0b3a18a71ae37b23a372635d652028601c1d2f99f005070da5",
   "size": 10752,
   "speakeasy": {
    "all_entrypoints": false,
    "apis_total": 10,
    "detail": {},
    "dllmain_only": false,
    "emulation_total_runtime": 0.111,
    "entry_points": [
     {
      "ep_type": "module_entry",
      "error": {},
      "instr_count": null,
      "last_apis": [
       "KERNEL32.GetCurrentThreadId",
       "KERNEL32.GetTickCount",
       "KERNEL32.QueryPerformanceCounter",
       "KERNEL32.GetStartupInfoW",
       "KERNEL32.InterlockedCompareExchange",
       "MSVCR90._initterm_e",
       "MSVCR90._initterm",
       "KERNEL32.InterlockedExchange"
      ],
      "n_apis": 10,
      "start_addr": "0x401825"
     }
    ],
    "is_dll": false,
    "timeout": 60,
    "variant": null,
    "verdict": "clean_exit",
    "wall_seconds": 0.14
   },
   "static": {
    "analysis_notes": [
     "32-bit 樣本：下游模擬器對 x86 的支援與 x64 不同，跑之前先確認。"
    ],
    "arch": "x86",
    "attack_techniques": [
     "Command and Control::Ingress Tool Transfer (T1105)",
     "Defense Evasion::Subvert Trust Controls (T1553.005)",
     "Discovery::File and Directory Discovery (T1083)",
     "Discovery::System Information Discovery (T1082)",
     "Execution::Shared Modules (T1129)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "有網路行為，要留時間給連線與重試",
      "有 10 個 C2 候選，可能逐一嘗試",
      "多重反分析檢測，可能需要多輪迭代"
     ],
     "seconds": 600
    },
    "c2": [
     {
      "benign": false,
      "defanged": "178[.]16[.]54[.]109",
      "source": "static",
      "type": "ip"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/1[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/2[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/3[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/4[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/5[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/6[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/7[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/xmr[.]exe",
      "source": "static",
      "type": "url"
     },
     {
      "benign": false,
      "defanged": "hxxp://178[.]16[.]54[.]109/xmrget[.]exe",
      "source": "static",
      "type": "url"
     }
    ],
    "capabilities": [
     "receive data",
     "download and write a file",
     "receive and write data from server to client",
     "reference HTTP User-Agent string",
     "connect to URL",
     "create HTTP request",
     "download URL",
     "read data from Internet",
     "query environment variable",
     "bypass Mark of the Web",
     "delete file",
     "check if file exists",
     "write file on Windows",
     "create process on Windows",
     "terminate process",
     "link function at runtime on Windows"
    ],
    "categories_present": [
     "anti_debug",
     "dynamic_resolve",
     "network",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "",
     "tools_not_ok": [],
     "value": false
    },
    "diec": {
     "compiler": "Microsoft Visual C/C++",
     "detects": [
      {
       "info": "",
       "name": "Microsoft Linker",
       "type": "linker",
       "version": "9.00.30729"
      },
      {
       "info": "C++",
       "name": "Microsoft Visual C/C++",
       "type": "compiler",
       "version": "15.00.30729"
      },
      {
       "info": "",
       "name": "Microsoft Visual Studio",
       "type": "tool",
       "version": "2008"
      }
     ],
     "is_packed": false,
     "linker": "Microsoft Linker",
     "packers": [],
     "protectors": []
    },
    "floss_counts": {
     "decoded": 0,
     "stack": 0,
     "static": 169,
     "tight": 0
    },
    "ghidra": {
     "function_count": 99,
     "language": "x86:LE:32:default",
     "message": "",
     "stats": {
      "api_symbols_matched": 17,
      "candidate_functions": 7,
      "decompile_incomplete": 0,
      "emitted": 8,
      "entry_points_emitted": 1
     },
     "status": "ok"
    },
    "is_dll": false,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "判定未加殼：DiE 未偵測到殼，且 PE 區段熵、virtual/raw 大小落差、匯入表數量都沒有出現加殼特徵"
     ],
     "value": false
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:59:15Z",
     "content_sha256": "5f8fa85f255931b9dab0acf99f0b8a511f7c8e7cea9f830cc4982335a6e3c327",
     "elapsed_seconds": 36.94,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x86",
     "declared_section_count": 5,
     "delay_imports": [],
     "dll_count": 7,
     "entry_point": 6181,
     "exports": [],
     "file_entropy": 5.1817,
     "has_rich_header": true,
     "has_signature": false,
     "image_base": 4194304,
     "imphash": "42cf01d41ef6dc0627982490afc9cddd",
     "import_count": 61,
     "imports": [
      "kernel32.dll.CloseHandle",
      "kernel32.dll.CreateFileW",
      "kernel32.dll.CreateProcessW",
      "kernel32.dll.DeleteFileW",
      "kernel32.dll.ExpandEnvironmentStringsW",
      "kernel32.dll.GetCurrentProcess",
      "kernel32.dll.GetCurrentProcessId",
      "kernel32.dll.GetCurrentThreadId",
      "kernel32.dll.GetModuleHandleW",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetStartupInfoW",
      "kernel32.dll.GetSystemTimeAsFileTime",
      "kernel32.dll.GetTickCount",
      "kernel32.dll.InterlockedCompareExchange",
      "kernel32.dll.InterlockedExchange",
      "kernel32.dll.IsDebuggerPresent",
      "kernel32.dll.QueryPerformanceCounter",
      "kernel32.dll.SetUnhandledExceptionFilter",
      "kernel32.dll.Sleep",
      "kernel32.dll.TerminateProcess",
      "kernel32.dll.UnhandledExceptionFilter",
      "kernel32.dll.WriteFile",
      "msvcr90.dll.?terminate@@YAXXZ",
      "msvcr90.dll._XcptFilter",
      "msvcr90.dll.__dllonexit",
      "msvcr90.dll.__p__commode",
      "msvcr90.dll.__p__fmode",
      "msvcr90.dll.__set_app_type",
      "msvcr90.dll.__setusermatherr",
      "msvcr90.dll.__wgetmainargs",
      "msvcr90.dll._adjust_fdiv",
      "msvcr90.dll._amsg_exit",
      "msvcr90.dll._cexit",
      "msvcr90.dll._configthreadlocale",
      "msvcr90.dll._controlfp_s",
      "msvcr90.dll._crt_debugger_hook",
      "msvcr90.dll._decode_pointer",
      "msvcr90.dll._encode_pointer",
      "msvcr90.dll._except_handler4_common",
      "msvcr90.dll._exit",
      "msvcr90.dll._initterm",
      "msvcr90.dll._initterm_e",
      "msvcr90.dll._invoke_watson",
      "msvcr90.dll._lock",
      "msvcr90.dll._onexit",
      "msvcr90.dll._snwprintf",
      "msvcr90.dll._unlock",
      "msvcr90.dll._wcmdln",
      "msvcr90.dll.exit",
      "msvcr90.dll.memset",
      "msvcr90.dll.rand",
      "msvcr90.dll.srand",
      "shell32.dll.ShellExecuteW",
      "shlwapi.dll.PathCombineW",
      "shlwapi.dll.PathFileExistsW",
      "urlmon.dll.URLDownloadToFileW",
      "user32.dll.wsprintfW",
      "wininet.dll.InternetCloseHandle",
      "wininet.dll.InternetOpenUrlW",
      "wininet.dll.InternetOpenW",
      "wininet.dll.InternetReadFile"
     ],
     "is_dll": false,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 332,
     "overlay": null,
     "packer_heuristics": [],
     "resources": [
      {
       "entropy": 5.0207,
       "id": 1,
       "size": 598,
       "type": "RT_MANIFEST"
      }
     ],
     "sections": [
      {
       "characteristics": "0x60000020",
       "entropy": 6.0127,
       "executable": true,
       "name": ".text",
       "raw_size": 3584,
       "readable": true,
       "virtual_size": 3466,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 4.2017,
       "executable": false,
       "name": ".rdata",
       "raw_size": 3584,
       "readable": true,
       "virtual_size": 3092,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.3528,
       "executable": false,
       "name": ".data",
       "raw_size": 512,
       "readable": true,
       "virtual_size": 908,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.1945,
       "executable": false,
       "name": ".rsrc",
       "raw_size": 1024,
       "readable": true,
       "virtual_size": 688,
       "writable": false
      },
      {
       "characteristics": "0x42000040",
       "entropy": 3.5679,
       "executable": false,
       "name": ".reloc",
       "raw_size": 1024,
       "readable": true,
       "virtual_size": 568,
       "writable": false
      }
     ],
     "subsystem": 2,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
     "timestamp": 1785169378,
     "timestamp_suspicious": false,
     "timestamp_utc": "2026-07-27T16:22:58Z",
     "tls_callbacks": []
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 61 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.01,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "未偵測到殼",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 11.73,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "n/a",
      "message": "不是 PyInstaller 打包的檔案（不適用，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": null,
      "detail": "抽出 169 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 6.33,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "16 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 9.7,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "4 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.02,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "8 個函式",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "ok",
      "message": "",
      "seconds": 9.13,
      "status": "ok"
     }
    ],
    "pyinstaller": {
     "detected": false,
     "entry_count": 0,
     "obfuscator": "",
     "python_version": ""
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.IsDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.SetUnhandledExceptionFilter",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "urlmon.dll.URLDownloadToFileW",
      "categories": [
       "network"
      ],
      "source": "iat"
     },
     {
      "api": "wininet.dll.InternetOpenUrlW",
      "categories": [
       "network"
      ],
      "source": "iat"
     },
     {
      "api": "wininet.dll.InternetOpenW",
      "categories": [
       "network"
      ],
      "source": "iat"
     },
     {
      "api": "wininet.dll.InternetReadFile",
      "categories": [
       "network"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateFileW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateProcessW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WriteFile",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "shell32.dll.ShellExecuteW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetSystemTimeAsFileTime",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetTickCount",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceCounter",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_AntiDebug_Imports"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Network_HTTP_Client_Imports"
     },
     {
      "n_strings": 9,
      "rule": "AIS3_Network_Hardcoded_URL"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Timing_Check_Imports"
     }
    ]
   },
   "summary": {
    "apis_total": 10,
    "arch": "x86",
    "budget_seconds": 600,
    "degraded": false,
    "emulation_seconds": 0.111,
    "id": "9787788d",
    "is_dll": false,
    "kind": "exe",
    "mirage": true,
    "mirage_apis": [
     22,
     22
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": true,
    "mirage_last_apis": 22,
    "mirage_max_apis": 22,
    "mirage_reason": "no_behaviour_change",
    "mirage_rounds": 2,
    "mirage_scale": "linear",
    "mirage_success": false,
    "mirage_verdict": "unresolved",
    "mirage_warned": false,
    "n_c2": 10,
    "n_c2_non_benign": 10,
    "n_capabilities": 16,
    "n_categories": 5,
    "n_detections": 16,
    "n_entry_points": 1,
    "n_yara": 4,
    "packed": false,
    "size": 10752,
    "verdict": "clean_exit"
   }
  },
  {
   "baseline_segments": [
    {
     "apis_tail": [
      "KERNEL32.GetProcessHeap",
      "KERNEL32.LoadLibraryExW",
      "KERNEL32.GetProcAddress",
      "KERNEL32.EnterCriticalSection",
      "KERNEL32.VirtualProtect",
      "KERNEL32.VirtualProtect",
      "KERNEL32.LeaveCriticalSection",
      "KERNEL32.FlsAlloc"
     ],
     "error": {
      "address": "0xfeee0003",
      "api_name": "kernel32.FlsGetValue2",
      "pc": "0xfeee0003",
      "type": "unsupported_api"
     },
     "label": "module_entry",
     "n_apis": 36,
     "start_addr": "0x14000c650"
    }
   ],
   "dynamic": {
    "available": true,
    "baseline_apis": 36,
    "final_profile": [
     {
      "key": "hostname",
      "value": "DESKTOP-7F3K9J2"
     },
     {
      "key": "user_name",
      "value": "User"
     },
     {
      "key": "os_ver",
      "value": "name=windows、major=10、minor=0、build=19045"
     }
    ],
    "final_trace": {
     "available": true,
     "capped": false,
     "distinct": 56,
     "first": [
      "KERNEL32.GetSystemTimeAsFileTime",
      "KERNEL32.GetCurrentThreadId",
      "KERNEL32.GetCurrentProcessId",
      "KERNEL32.QueryPerformanceCounter",
      "KERNEL32.LoadLibraryExW",
      "KERNEL32.GetProcAddress",
      "kernel32.InitializeCriticalSectionEx",
      "KERNEL32.LoadLibraryExW",
      "KERNEL32.GetProcAddress",
      "kernel32.FlsAlloc",
      "KERNEL32.GetProcAddress",
      "kernel32.FlsSetValue",
      "KERNEL32.VirtualProtect",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.InitializeCriticalSectionEx",
      "KERNEL32.GetProcessHeap",
      "KERNEL32.LoadLibraryExW",
      "KERNEL32.GetProcAddress",
      "KERNEL32.EnterCriticalSection",
      "KERNEL32.VirtualProtect",
      "KERNEL32.VirtualProtect",
      "KERNEL32.LeaveCriticalSection",
      "KERNEL32.FlsAlloc",
      "kernel32.FlsGetValue2",
      "KERNEL32.GetLastError",
      "KERNEL32.FlsSetValue",
      "KERNEL32.HeapAlloc"
     ],
     "recorded": 6797,
     "round_n_apis": 6797,
     "top": [
      {
       "api": "KERNEL32.GetFileAttributesExW",
       "count": 4837
      },
      {
       "api": "kernel32.FlsGetValue2",
       "count": 1635
      },
      {
       "api": "KERNEL32.InitializeCriticalSectionEx",
       "count": 83
      },
      {
       "api": "KERNEL32.HeapAlloc",
       "count": 36
      },
      {
       "api": "KERNEL32.EnterCriticalSection",
       "count": 34
      },
      {
       "api": "KERNEL32.LeaveCriticalSection",
       "count": 33
      },
      {
       "api": "KERNEL32.MultiByteToWideChar",
       "count": 30
      },
      {
       "api": "KERNEL32.HeapFree",
       "count": 15
      },
      {
       "api": "KERNEL32.GetProcAddress",
       "count": 5
      },
      {
       "api": "KERNEL32.SetFilePointerEx",
       "count": 5
      },
      {
       "api": "KERNEL32.VirtualProtect",
       "count": 5
      },
      {
       "api": "KERNEL32.GetEnvironmentVariableW",
       "count": 4
      },
      {
       "api": "KERNEL32.GetFileType",
       "count": 4
      },
      {
       "api": "KERNEL32.LoadLibraryExW",
       "count": 4
      },
      {
       "api": "KERNEL32.ReadFile",
       "count": 4
      },
      {
       "api": "kernel32.LCMapStringEx",
       "count": 4
      },
      {
       "api": "KERNEL32.CloseHandle",
       "count": 3
      },
      {
       "api": "KERNEL32.GetLastError",
       "count": 3
      },
      {
       "api": "KERNEL32.GetStdHandle",
       "count": 3
      },
      {
       "api": "KERNEL32.WideCharToMultiByte",
       "count": 3
      },
      {
       "api": "ADVAPI32.GetTokenInformation",
       "count": 2
      },
      {
       "api": "ADVAPI32.OpenProcessToken",
       "count": 2
      },
      {
       "api": "KERNEL32.FlsSetValue",
       "count": 2
      },
      {
       "api": "KERNEL32.GetCPInfo",
       "count": 2
      },
      {
       "api": "KERNEL32.GetCurrentProcess",
       "count": 2
      },
      {
       "api": "KERNEL32.GetCurrentProcessId",
       "count": 2
      },
      {
       "api": "KERNEL32.GetModuleFileNameW",
       "count": 2
      },
      {
       "api": "KERNEL32.HeapReAlloc",
       "count": 2
      },
      {
       "api": "KERNEL32.HeapSize",
       "count": 2
      },
      {
       "api": "KERNEL32.LocalFree",
       "count": 2
      },
      {
       "api": "KERNEL32.SetEnvironmentVariableW",
       "count": 2
      },
      {
       "api": "ADVAPI32.ConvertStringSecurityDescriptorToSecurityDescriptorW",
       "count": 1
      },
      {
       "api": "KERNEL32.CreateFileW",
       "count": 1
      },
      {
       "api": "KERNEL32.FindClose",
       "count": 1
      },
      {
       "api": "KERNEL32.FindFirstFileExW",
       "count": 1
      },
      {
       "api": "KERNEL32.FlsAlloc",
       "count": 1
      },
      {
       "api": "KERNEL32.FlsGetValue",
       "count": 1
      },
      {
       "api": "KERNEL32.FreeEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetACP",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCommandLineA",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCommandLineW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetCurrentThreadId",
       "count": 1
      },
      {
       "api": "KERNEL32.GetEnvironmentStringsW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetProcessHeap",
       "count": 1
      },
      {
       "api": "KERNEL32.GetStartupInfoW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetStringTypeW",
       "count": 1
      },
      {
       "api": "KERNEL32.GetSystemTimeAsFileTime",
       "count": 1
      },
      {
       "api": "KERNEL32.GetTempPathW",
       "count": 1
      },
      {
       "api": "KERNEL32.InitializeSListHead",
       "count": 1
      },
      {
       "api": "KERNEL32.IsValidCodePage",
       "count": 1
      },
      {
       "api": "KERNEL32.QueryPerformanceCounter",
       "count": 1
      },
      {
       "api": "KERNEL32.SetLastError",
       "count": 1
      },
      {
       "api": "KERNEL32.SetUnhandledExceptionFilter",
       "count": 1
      },
      {
       "api": "kernel32.FlsAlloc",
       "count": 1
      },
      {
       "api": "kernel32.FlsSetValue",
       "count": 1
      },
      {
       "api": "kernel32.InitializeCriticalSectionEx",
       "count": 1
      }
     ]
    },
    "final_watchlist": [
     "advapi32.gettokeninformation"
    ],
    "generated": "2026-07-28 01:17:22",
    "harness": {
     "answered_by_emulator": [
      "flsgetvalue2 -> kernel32.FlsGetValue",
      "setfilepointerex -> kernel32.SetFilePointer (adapted)"
     ],
     "blind_spots": [
      {
       "api": "KERNEL32.GetStringTypeW",
       "field": "lpCharType"
      },
      {
       "api": "KERNEL32.FindFirstFileExW",
       "field": "lpFindFileData"
      },
      {
       "api": "ADVAPI32.GetTokenInformation",
       "field": "TokenInformation(除了 class 20 之外都不填)"
      }
     ],
     "filled": [],
     "refused_to_llm": []
    },
    "injections": [],
    "max_apis": 6797,
    "min_apis": 36,
    "n_damaged": 0,
    "n_emulator_errors": 0,
    "n_runs": 1,
    "notes": {
     "no_cumulative": "各輪的長條是各自獨立的計數，不是累積 —— 迭代之間的 API 數不是單調遞增（本批最明顯的是 13 → 28 → 14），累積畫法在數字下降時沒有意義。",
     "scope_caveat": "逐輪的完整 API 呼叫軌跡沒有留存 —— run 報告只帶最後一輪的 api_trace_final。所以這裡每一輪的「新增／消失的 API」是就「外圈這一輪實際碰到的 API 名單」（攔截清單、合成回答、LLM 宣告參數個數、派送例外、呼叫慣例修正、帶字串引數的呼叫）算的，不是完整呼叫序列的差集。長條的高度（呼叫次數）才是完整計數。"
    },
    "other_runs": [],
    "outcome": {
     "assisted": true,
     "exit_meaning": "3 —— 跑到了但有不可驗證的成分(或 1,若 LLM 失效)",
     "inconclusive": true,
     "iterations": 2,
     "n_llm_failures": 0,
     "n_plan_errors": 0,
     "reason": "synthesized_unimplemented_api",
     "reasons": [
      "synthesized_unimplemented_api"
     ],
     "success": false,
     "synthesized_apis": [
      "ADVAPI32.ConvertSidToStringSidW",
      "ADVAPI32.ConvertStringSecurityDescriptorToSecurityDescriptorW"
     ],
     "verdict": "inconclusive"
    },
    "partial": false,
    "reason_info": {
     "kind": "bad",
     "label": "依賴了合成的未實作 API",
     "why": "模擬器沒實作的 API，回傳值是我們合成的。合成值無法驗證，所以這一輪一律降級成 inconclusive。"
    },
    "report_version": 1,
    "rounds": [
     {
      "add_watchlist": [
       "advapi32.gettokeninformation"
      ],
      "api_added": [],
      "api_removed": [],
      "api_scope": [
       {
        "api": "advapi32.convertsidtostringsidw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "advapi32.gettokeninformation",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "advapi32.openprocesstoken",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createfilew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.entercriticalsection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findclose",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findfirstfileexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue2",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heaprealloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapsize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.leavecriticalsection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibraryexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.readfile",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setfilepointerex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.virtualprotect",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": null,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 0.32,
      "entry_points": [],
      "llm_calls": 2,
      "llm_diagnosis": "The sample is a PyInstaller bootloader performing standard startup initialization: reading PyInstaller-specific environment variables (_PYI_PARENT_PROCESS_LEVEL, _PYI_SPLASH_IPC, PYINSTALLER_STRICT_UNPACK_MODE), querying process token information (TokenUser and TokenIntegrityLevel), and converting the resulting SIDs to string form via ConvertSidToStringSidW. The emulator does not implement ConvertSidToStringSidW, so the call was synthesized. The trace shows the first call passes a null SID pointer (0x0) because the preceding GetTokenInformation for TokenUser (class 1) returned success but left the output buffer uninitialized (emulator blind spot). The program then passes this garbage pointer to ConvertSidToStringSidW, which would crash on a real system. The crash is therefore caused by the emulator's GetTokenInformation handler not filling TokenInformation for classes other than 20.",
      "llm_seconds": 47.16,
      "n_apis": 325,
      "n_arity_fallbacks": 0,
      "n_faults": 0,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [],
      "profile_changed": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "reason": "synthesized_unimplemented_api",
      "round": 1,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 0,
      "stack_unknown": 0,
      "stop": {
       "address": "0xfeedf0e0",
       "instr": "disasm_failed",
       "pc": "0xfeedf0e0",
       "sp": "0x000000000120dea0",
       "type": "Invalid memory fetch (UC_ERR_FETCH_UNMAPPED)"
      },
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [],
      "watchlist_in": []
     },
     {
      "add_watchlist": [],
      "api_added": [
       "advapi32.convertstringsecuritydescriptortosecuritydescriptorw",
       "kernel32.getfileattributesexw",
       "kernel32.gettemppathw"
      ],
      "api_removed": [
       "advapi32.convertsidtostringsidw"
      ],
      "api_scope": [
       {
        "api": "advapi32.convertstringsecuritydescriptortosecuritydescriptorw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "advapi32.gettokeninformation",
        "sources": [
         "watch",
         "args"
        ]
       },
       {
        "api": "advapi32.openprocesstoken",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.closehandle",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.createfilew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.entercriticalsection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findclose",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.findfirstfileexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flsgetvalue2",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.flssetvalue",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.freeenvironmentstringsw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getcpinfo",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfileattributesexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getfiletype",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getmodulefilenamew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getprocaddress",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.getstringtypew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.gettemppathw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapalloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapfree",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heaprealloc",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.heapsize",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.initializecriticalsectionex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.isvalidcodepage",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.lcmapstringex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.leavecriticalsection",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.loadlibraryexw",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.multibytetowidechar",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.readfile",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setenvironmentvariablew",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.setfilepointerex",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.virtualprotect",
        "sources": [
         "args"
        ]
       },
       {
        "api": "kernel32.widechartomultibyte",
        "sources": [
         "args"
        ]
       }
      ],
      "api_signatures": [],
      "callconv_fixes": [],
      "data_imports": [],
      "delta": 6472,
      "dispatch_raises": [],
      "dynamic_code": [],
      "emu_seconds": 16.89,
      "entry_points": [],
      "llm_calls": 3,
      "llm_diagnosis": "",
      "llm_seconds": 3.47,
      "n_apis": 6797,
      "n_arity_fallbacks": 0,
      "n_faults": 0,
      "n_stack_mismatch": 0,
      "nudged": false,
      "payload_hits_discounted": 0,
      "payload_seen": false,
      "profile": [
       {
        "key": "hostname",
        "value": "DESKTOP-7F3K9J2"
       },
       {
        "key": "user_name",
        "value": "User"
       },
       {
        "key": "os_ver",
        "value": "name=windows、major=10、minor=0、build=19045"
       }
      ],
      "profile_changed": [],
      "reason": "synthesized_unimplemented_api",
      "round": 2,
      "seeded_watchlist": [],
      "self_abort": false,
      "stack_checked": 0,
      "stack_unknown": 0,
      "stop": {
       "address": "",
       "instr": "",
       "pc": "0x14002315d",
       "sp": null,
       "type": "max_api_count"
      },
      "synth_fills": [],
      "verdict": "inconclusive",
      "warnings": [
       {
        "kind": "bad",
        "text": "這一輪是撞到模擬器的 API 呼叫上限才停的 —— 樣本當時還在跑。6,797 這個數字反映的是「上限在哪」，不是「行為有多深」；呼叫大多集中在同一個輪詢迴圈裡。"
       }
      ],
      "watchlist_in": [
       "advapi32.gettokeninformation"
      ]
     }
    ],
    "run": "run_20260727-151837-889",
    "scale": "log"
   },
   "id": "c6a4ffb8",
   "kind": "exe",
   "md5": "ff6f21649a14a48bb413390cfb3325eb",
   "sha1": "55f87c9832ab2cfb11d4348f2524e5ffe109053b",
   "sha256": "c6a4ffb8891db5326fabd6926d3eda0feabbef4be680bfbc4ec4aef4b01e8f13",
   "size": 7433133,
   "speakeasy": {
    "all_entrypoints": false,
    "apis_total": 36,
    "detail": {
     "address": "0xfeee0003",
     "api_name": "kernel32.FlsGetValue2",
     "pc": "0xfeee0003",
     "type": "unsupported_api"
    },
    "dllmain_only": false,
    "emulation_total_runtime": 0.087,
    "entry_points": [
     {
      "ep_type": "module_entry",
      "error": {
       "address": "0xfeee0003",
       "api_name": "kernel32.FlsGetValue2",
       "pc": "0xfeee0003",
       "type": "unsupported_api"
      },
      "instr_count": null,
      "last_apis": [
       "KERNEL32.GetProcessHeap",
       "KERNEL32.LoadLibraryExW",
       "KERNEL32.GetProcAddress",
       "KERNEL32.EnterCriticalSection",
       "KERNEL32.VirtualProtect",
       "KERNEL32.VirtualProtect",
       "KERNEL32.LeaveCriticalSection",
       "KERNEL32.FlsAlloc"
      ],
      "n_apis": 36,
      "start_addr": "0x14000c650"
     }
    ],
    "is_dll": false,
    "timeout": 60,
    "variant": null,
    "verdict": "unsupported_api",
    "wall_seconds": 1.33
   },
   "static": {
    "analysis_notes": [
     "**PyInstaller 打包（Python 3.13）已解開**：25 個項目、5 個模組。下面的字串與 C2 候選包含打包進去的使用者腳本內容；PE 匯入表則仍是CPython 直譯器自己的，與樣本意圖無關。",
     "PE 尾端有 overlay：dropper 的第二階段常黏在這裡。"
    ],
    "arch": "x64",
    "attack_techniques": [
     "Defense Evasion::Obfuscated Files or Information (T1027)",
     "Defense Evasion::Virtualization/Sandbox Evasion (T1497.001)",
     "Discovery::File and Directory Discovery (T1083)",
     "Discovery::Process Discovery (T1057)",
     "Discovery::System Information Discovery (T1082)",
     "Execution::Command and Scripting Interpreter (T1059)",
     "Execution::Shared Modules (T1129)"
    ],
    "available": true,
    "budget": {
     "reasons": [
      "加殼，需要時間解殼",
      "整檔熵 7.99，可能有加密段",
      "有注入相關 API",
      "多重反分析檢測，可能需要多輪迭代"
     ],
     "seconds": 300
    },
    "c2": [
     {
      "benign": true,
      "defanged": "schemas[.]microsoft[.]com",
      "source": "static",
      "type": "domain"
     },
     {
      "benign": true,
      "defanged": "hxxp://schemas[.]microsoft[.]com/SMI/2016/WindowsSettings",
      "source": "static",
      "type": "url"
     }
    ],
    "capabilities": [
     "reference analysis tools strings",
     "check for time delay via QueryPerformanceCounter",
     "reference anti-VM strings targeting Qemu",
     "compute adler32 checksum",
     "compress data via ZLIB inflate or deflate",
     "encode data using XOR",
     "accept command line arguments",
     "query environment variable",
     "set environment variable",
     "get common file path",
     "create directory",
     "delete directory",
     "delete file",
     "enumerate files on Windows",
     "enumerate files recursively",
     "get file size",
     "read file on Windows",
     "clear file content",
     "write file on Windows",
     "get disk information",
     "create process on Windows",
     "create process suspended",
     "enumerate process modules",
     "terminate process",
     "link function at runtime on Windows",
     "link many functions at runtime",
     "linked against ZLIB",
     "parse PE header",
     "resolve function by parsing PE exports"
    ],
    "categories_present": [
     "anti_debug",
     "dynamic_resolve",
     "env_fingerprint",
     "injection",
     "persistence",
     "timing"
    ],
    "degraded": {
     "note": "以下工具未成功執行：ghidra。相關維度的結論證據不足，不可以當成「這支樣本沒有這類特徵」。",
     "tools_not_ok": [
      "ghidra"
     ],
     "value": true
    },
    "diec": {
     "compiler": "Microsoft Visual C/C++",
     "detects": [
      {
       "info": "",
       "name": "Microsoft Linker",
       "type": "linker",
       "version": "14.43.34808"
      },
      {
       "info": "C",
       "name": "Microsoft Visual C/C++",
       "type": "compiler",
       "version": "19.43.34808"
      },
      {
       "info": "",
       "name": "Microsoft Visual Studio",
       "type": "tool",
       "version": "2022, 17.13"
      },
      {
       "info": "modified",
       "name": "PyInstaller",
       "type": "packer",
       "version": ""
      },
      {
       "info": "pogo",
       "name": "Records",
       "type": "debug data",
       "version": ""
      }
     ],
     "is_packed": true,
     "linker": "Microsoft Linker",
     "packers": [
      "PyInstaller"
     ],
     "protectors": []
    },
    "floss_counts": {
     "decoded": 0,
     "stack": 0,
     "static": 89141,
     "tight": 0
    },
    "ghidra": {
     "function_count": null,
     "language": null,
     "message": null,
     "stats": {},
     "status": null
    },
    "is_dll": false,
    "is_dotnet": false,
    "is_packed": {
     "evidence": [
      "diec packer: PyInstaller",
      "high entropy section .rsrc (7.35)",
      "whole-file entropy 7.99"
     ],
     "value": true
    },
    "lab_networks": [],
    "meta": {
     "analyzed_at": "2026-07-29T16:59:52Z",
     "content_sha256": "2ee32a83e20c4ec0e1b95c86485c2ec97d41512afbdab7f4634f55191814feeb",
     "elapsed_seconds": 105.44,
     "gatherer_sha256": "6626a3e45ac51272",
     "gatherer_version": "3.0.0"
    },
    "pe": {
     "arch": "x64",
     "declared_section_count": 7,
     "delay_imports": [],
     "dll_count": 3,
     "entry_point": 50768,
     "exports": [],
     "file_entropy": 7.99,
     "has_rich_header": true,
     "has_signature": false,
     "image_base": 5368709120,
     "imphash": "064967a99ade726316dc79a4a929fe96",
     "import_count": 127,
     "imports": [
      "advapi32.dll.ConvertSidToStringSidW",
      "advapi32.dll.ConvertStringSecurityDescriptorToSecurityDescriptorW",
      "advapi32.dll.GetTokenInformation",
      "advapi32.dll.OpenProcessToken",
      "kernel32.dll.CloseHandle",
      "kernel32.dll.CompareStringW",
      "kernel32.dll.CreateDirectoryW",
      "kernel32.dll.CreateFileW",
      "kernel32.dll.CreateProcessW",
      "kernel32.dll.CreateSymbolicLinkW",
      "kernel32.dll.DeleteCriticalSection",
      "kernel32.dll.DeleteFileW",
      "kernel32.dll.EncodePointer",
      "kernel32.dll.EnterCriticalSection",
      "kernel32.dll.ExitProcess",
      "kernel32.dll.ExpandEnvironmentStringsW",
      "kernel32.dll.FileTimeToSystemTime",
      "kernel32.dll.FindClose",
      "kernel32.dll.FindFirstFileExW",
      "kernel32.dll.FindFirstFileW",
      "kernel32.dll.FindNextFileW",
      "kernel32.dll.FlsAlloc",
      "kernel32.dll.FlsFree",
      "kernel32.dll.FlsGetValue",
      "kernel32.dll.FlsSetValue",
      "kernel32.dll.FlushFileBuffers",
      "kernel32.dll.FormatMessageW",
      "kernel32.dll.FreeEnvironmentStringsW",
      "kernel32.dll.FreeLibrary",
      "kernel32.dll.GetACP",
      "kernel32.dll.GetCPInfo",
      "kernel32.dll.GetCommandLineA",
      "kernel32.dll.GetCommandLineW",
      "kernel32.dll.GetConsoleMode",
      "kernel32.dll.GetConsoleOutputCP",
      "kernel32.dll.GetConsoleWindow",
      "kernel32.dll.GetCurrentDirectoryW",
      "kernel32.dll.GetCurrentProcess",
      "kernel32.dll.GetCurrentProcessId",
      "kernel32.dll.GetCurrentThreadId",
      "kernel32.dll.GetDriveTypeW",
      "kernel32.dll.GetEnvironmentStringsW",
      "kernel32.dll.GetEnvironmentVariableW",
      "kernel32.dll.GetExitCodeProcess",
      "kernel32.dll.GetFileAttributesExW",
      "kernel32.dll.GetFileInformationByHandle",
      "kernel32.dll.GetFileSizeEx",
      "kernel32.dll.GetFileType",
      "kernel32.dll.GetFinalPathNameByHandleW",
      "kernel32.dll.GetFullPathNameW",
      "kernel32.dll.GetLastError",
      "kernel32.dll.GetModuleFileNameW",
      "kernel32.dll.GetModuleHandleExW",
      "kernel32.dll.GetModuleHandleW",
      "kernel32.dll.GetOEMCP",
      "kernel32.dll.GetProcAddress",
      "kernel32.dll.GetProcessHeap",
      "kernel32.dll.GetStartupInfoW",
      "kernel32.dll.GetStdHandle",
      "kernel32.dll.GetStringTypeW",
      "kernel32.dll.GetSystemTimeAsFileTime",
      "kernel32.dll.GetTempPathW",
      "kernel32.dll.GetTimeZoneInformation",
      "kernel32.dll.HeapAlloc",
      "kernel32.dll.HeapFree",
      "kernel32.dll.HeapReAlloc",
      "kernel32.dll.HeapSize",
      "kernel32.dll.InitializeCriticalSectionAndSpinCount",
      "kernel32.dll.InitializeCriticalSectionEx",
      "kernel32.dll.InitializeSListHead",
      "kernel32.dll.IsDebuggerPresent",
      "kernel32.dll.IsProcessorFeaturePresent",
      "kernel32.dll.IsValidCodePage",
      "kernel32.dll.K32EnumProcessModules",
      "kernel32.dll.K32GetModuleFileNameExW",
      "kernel32.dll.LCMapStringW",
      "kernel32.dll.LeaveCriticalSection",
      "kernel32.dll.LoadLibraryExW",
      "kernel32.dll.LocalFree",
      "kernel32.dll.MultiByteToWideChar",
      "kernel32.dll.PeekNamedPipe",
      "kernel32.dll.QueryPerformanceCounter",
      "kernel32.dll.QueryPerformanceFrequency",
      "kernel32.dll.RaiseException",
      "kernel32.dll.ReadConsoleW",
      "kernel32.dll.ReadFile",
      "kernel32.dll.RemoveDirectoryW",
      "kernel32.dll.RtlCaptureContext",
      "kernel32.dll.RtlLookupFunctionEntry",
      "kernel32.dll.RtlPcToFileHeader",
      "kernel32.dll.RtlUnwindEx",
      "kernel32.dll.RtlVirtualUnwind",
      "kernel32.dll.SetConsoleCtrlHandler",
      "kernel32.dll.SetDllDirectoryW",
      "kernel32.dll.SetEndOfFile",
      "kernel32.dll.SetEnvironmentVariableW",
      "kernel32.dll.SetFilePointerEx",
      "kernel32.dll.SetLastError",
      "kernel32.dll.SetStdHandle",
      "kernel32.dll.SetUnhandledExceptionFilter",
      "kernel32.dll.Sleep",
      "kernel32.dll.SystemTimeToTzSpecificLocalTime",
      "kernel32.dll.TerminateProcess",
      "kernel32.dll.TlsAlloc",
      "kernel32.dll.TlsFree",
      "kernel32.dll.TlsGetValue",
      "kernel32.dll.TlsSetValue",
      "kernel32.dll.UnhandledExceptionFilter",
      "kernel32.dll.VirtualProtect",
      "kernel32.dll.WaitForSingleObject",
      "kernel32.dll.WideCharToMultiByte",
      "kernel32.dll.WriteConsoleW",
      "kernel32.dll.WriteFile",
      "user32.dll.CreateWindowExW",
      "user32.dll.DefWindowProcW",
      "user32.dll.DestroyWindow",
      "user32.dll.DispatchMessageW",
      "user32.dll.GetMessageW",
      "user32.dll.GetWindowLongPtrW",
      "user32.dll.GetWindowThreadProcessId",
      "user32.dll.MsgWaitForMultipleObjects",
      "user32.dll.PeekMessageW",
      "user32.dll.RegisterClassW",
      "user32.dll.SetWindowLongPtrW",
      "user32.dll.ShowWindow",
      "user32.dll.ShutdownBlockReasonCreate",
      "user32.dll.TranslateMessage"
     ],
     "is_dll": false,
     "is_dotnet": false,
     "is_driver": false,
     "machine": 34404,
     "overlay": {
      "entropy": 7.9981,
      "offset": 335872,
      "size": 7097261
     },
     "packer_heuristics": [
      "high entropy section .rsrc (7.35)",
      "whole-file entropy 7.99"
     ],
     "resources": [
      {
       "entropy": 7.9508,
       "id": 4,
       "size": 37019,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.2912,
       "id": 5,
       "size": 9640,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.4387,
       "id": 6,
       "size": 4264,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.5865,
       "id": 1,
       "size": 3752,
       "type": "RT_ICON"
      },
      {
       "entropy": 6.0563,
       "id": 2,
       "size": 2216,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.5741,
       "id": 3,
       "size": 1384,
       "type": "RT_ICON"
      },
      {
       "entropy": 5.2579,
       "id": 1,
       "size": 1293,
       "type": "RT_MANIFEST"
      },
      {
       "entropy": 5.8936,
       "id": 7,
       "size": 1128,
       "type": "RT_ICON"
      },
      {
       "entropy": 2.7186,
       "id": 1,
       "size": 104,
       "type": "RT_GROUP_ICON"
      }
     ],
     "sections": [
      {
       "characteristics": "0x60000020",
       "entropy": 6.4863,
       "executable": true,
       "name": ".text",
       "raw_size": 179712,
       "readable": true,
       "virtual_size": 179328,
       "writable": false
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.7428,
       "executable": false,
       "name": ".rdata",
       "raw_size": 78336,
       "readable": true,
       "virtual_size": 77978,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 1.825,
       "executable": false,
       "name": ".data",
       "raw_size": 3584,
       "readable": true,
       "virtual_size": 20720,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 5.4075,
       "executable": false,
       "name": ".pdata",
       "raw_size": 9216,
       "readable": true,
       "virtual_size": 9036,
       "writable": false
      },
      {
       "characteristics": "0xc0000040",
       "entropy": 0.0,
       "executable": false,
       "name": ".fptable",
       "raw_size": 512,
       "readable": true,
       "virtual_size": 256,
       "writable": true
      },
      {
       "characteristics": "0x40000040",
       "entropy": 7.3501,
       "executable": false,
       "name": ".rsrc",
       "raw_size": 61440,
       "readable": true,
       "virtual_size": 61324,
       "writable": false
      },
      {
       "characteristics": "0x42000040",
       "entropy": 5.2719,
       "executable": false,
       "name": ".reloc",
       "raw_size": 2048,
       "readable": true,
       "virtual_size": 1896,
       "writable": false
      }
     ],
     "subsystem": 3,
     "subsystem_name": "IMAGE_SUBSYSTEM_WINDOWS_CUI",
     "timestamp": 1754112981,
     "timestamp_suspicious": false,
     "timestamp_utc": "2025-08-02T05:36:21Z",
     "tls_callbacks": []
    },
    "pipeline": [
     {
      "applicable": null,
      "detail": "匯入 127 個 API",
      "key": "pefile",
      "label": "PE 結構解析",
      "mark": "ok",
      "message": "",
      "seconds": 0.52,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "偵測到 PyInstaller",
      "key": "diec",
      "label": "加殼／編譯器偵測",
      "mark": "ok",
      "message": "",
      "seconds": 10.56,
      "status": "ok"
     },
     {
      "applicable": false,
      "detail": "",
      "key": "unpack",
      "label": "自動解殼",
      "mark": "n/a",
      "message": "未偵測到可自動解開的殼（這支樣本不需要解殼，不是失敗）",
      "seconds": 0.0,
      "status": "skipped"
     },
     {
      "applicable": true,
      "detail": "Python 3.13，25 個項目",
      "key": "pyinstaller",
      "label": "PyInstaller 解包",
      "mark": "ok",
      "message": "已解開 PyInstaller 包（Python 3.13，25 個項目，5 個模組，4669 條字串）；以下字串與 IOC 包含打包內容",
      "seconds": 0.08,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "抽出 89141 條字串（內容未收錄於本站）",
      "key": "floss",
      "label": "字串抽取",
      "mark": "ok",
      "message": "",
      "seconds": 22.53,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "29 項能力",
      "key": "capa",
      "label": "能力標籤",
      "mark": "ok",
      "message": "",
      "seconds": 71.2,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "3 條規則命中",
      "key": "yara",
      "label": "自有規則比對",
      "mark": "ok",
      "message": "",
      "seconds": 0.03,
      "status": "ok"
     },
     {
      "applicable": null,
      "detail": "",
      "key": "ghidra",
      "label": "反編譯",
      "mark": "skipped",
      "message": "sample looks packed and could not be unpacked; decompiling the packer stub is not useful. Re-run with --force-ghidra to override.",
      "seconds": 0.0,
      "status": "skipped"
     }
    ],
    "pyinstaller": {
     "detected": true,
     "entry_count": 25,
     "obfuscator": "",
     "python_version": "3.13"
    },
    "schema_version": "static_intel/1",
    "suspected_anti_analysis": [
     {
      "api": "kernel32.dll.IsDebuggerPresent",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.SetUnhandledExceptionFilter",
      "categories": [
       "anti_debug"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleExW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetModuleHandleW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.GetProcAddress",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.LoadLibraryExW",
      "categories": [
       "dynamic_resolve"
      ],
      "source": "iat"
     },
     {
      "api": "python:socket",
      "categories": [
       "env_fingerprint"
      ],
      "source": "pyinstaller_module"
     },
     {
      "api": "kernel32.dll.VirtualProtect",
      "categories": [
       "injection"
      ],
      "source": "iat"
     },
     {
      "api": "python:ctypes",
      "categories": [
       "injection"
      ],
      "source": "pyinstaller_module"
     },
     {
      "api": "kernel32.dll.CreateFileW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.CreateProcessW",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WriteFile",
      "categories": [
       "persistence"
      ],
      "source": "iat"
     },
     {
      "api": "python:wmi",
      "categories": [
       "persistence"
      ],
      "source": "pyinstaller_module"
     },
     {
      "api": "ShellExecuteW",
      "categories": [
       "persistence"
      ],
      "source": "string"
     },
     {
      "api": "kernel32.dll.GetSystemTimeAsFileTime",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceCounter",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.QueryPerformanceFrequency",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.Sleep",
      "categories": [
       "timing"
      ],
      "source": "iat"
     },
     {
      "api": "kernel32.dll.WaitForSingleObject",
      "categories": [
       "timing"
      ],
      "source": "iat"
     }
    ],
    "yara": [
     {
      "n_strings": 0,
      "rule": "AIS3_AntiDebug_Imports"
     },
     {
      "n_strings": 1,
      "rule": "AIS3_Network_Hardcoded_URL"
     },
     {
      "n_strings": 0,
      "rule": "AIS3_Timing_Check_Imports"
     }
    ]
   },
   "summary": {
    "apis_total": 36,
    "arch": "x64",
    "budget_seconds": 300,
    "degraded": true,
    "emulation_seconds": 0.087,
    "id": "c6a4ffb8",
    "is_dll": false,
    "kind": "exe",
    "mirage": true,
    "mirage_apis": [
     325,
     6797
    ],
    "mirage_assisted": true,
    "mirage_inconclusive": true,
    "mirage_last_apis": 6797,
    "mirage_max_apis": 6797,
    "mirage_reason": "synthesized_unimplemented_api",
    "mirage_rounds": 2,
    "mirage_scale": "log",
    "mirage_success": false,
    "mirage_verdict": "inconclusive",
    "mirage_warned": true,
    "n_c2": 2,
    "n_c2_non_benign": 0,
    "n_capabilities": 29,
    "n_categories": 6,
    "n_detections": 19,
    "n_entry_points": 1,
    "n_yara": 3,
    "packed": true,
    "size": 7433133,
    "verdict": "unsupported_api"
   }
  }
 ],
 "schema": "ais3-site/2",
 "security": {
  "audit": "產生時已自動掃過輸出，確認黑名單欄位與明文 URL scheme 都不存在。",
  "filter_location": "tools/build-data.py",
  "note": "樣本可控的內容（抽取出的字串、反編譯輸出、模擬期間的記憶體字串、API 的字串引數、逐指令軌跡與原始位元組）整區排除；C2 一律以 defanged 形式呈現；本站沒有任何樣本原始位元組。LLM 的診斷文字有收錄，但視為不可信文字：路徑抹掉、URL scheme defang、前端只用 textContent 輸出。",
  "policy": "白名單輸出：只有 tools/build-data.py 明確列出的欄位會進到這份檔案。"
 },
 "tracks": [
  {
   "accent": "dynamic",
   "blurb": "把樣本丟進 Speakeasy 模擬器直接跑，沒有任何環境偽裝、沒有 LLM 介入。這是對照組：反偵測的樣本會在這裡提早停下來。",
   "detail": "6 支樣本，每支一次執行。",
   "id": "speakeasy",
   "label": "純 Speakeasy 基線",
   "status": "available"
  },
  {
   "accent": "dynamic",
   "blurb": "同一批樣本改用 mirage 跑：內圈由 LLM 即時捏造模擬器沒實作的 API 回傳值，外圈每一輪依中止原因修訂環境剖繪後整個重跑。",
   "detail": "6 支樣本都有資料。⚠️ 六支的 success 全部是 false、assisted 全部是 true —— 「跑得比較深」不等於「成功」，每一支的結果都有值是我們補的。",
   "id": "dynamic",
   "label": "＋動態（mirage：LLM 即時捏造 API 回傳值）",
   "status": "available"
  },
  {
   "accent": "static",
   "blurb": "把靜態流水線產出的檢測點清單與模擬預算餵給動態端當起始條件，看能不能少走幾輪冤枉路。",
   "detail": "尚未取得 —— 這一組還沒跑過，網站上不會有它的數字。靜態分析報告本身已經有了（在每支樣本的詳情頁），但「靜態情報實際改善了動態結果多少」沒有資料，不編。",
   "id": "static_first",
   "label": "＋動態＋靜態（靜態報告餵給動態端）",
   "status": "pending"
  }
 ]
};
window.__BUNDLE__ = window.DATA;
