# `PBAI-P15` — Worker再利用 baseline support契約

状態: **測定契約改訂 / fresh preflight前 / seed未消費**

初回preflight run 36415107712は`measureUserAgentSpecificMemory()`呼出しがChromium 151で利用不可となり失敗した。P15 seed sample・latency計測は未実行。API名の存在だけではmemory測定可能性を示さなかったため、本契約をCDPのWorker isolate heap取得へ改訂した。  
固定日: 2026-09-28  
baseline: `main@22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
seed block: `2026100201..2026100264`  
実行基盤: GitHub Actions / Ubuntu 24.04 / Node 24 / Playwright 1.62.1 Chromium

## 1. 問いと対象

一手ごとにWorkerを新規起動する現行経路と、同じWorker instanceへ独立したsearch requestを順次送る測定用経路の、AI要求から応答までの時間差を測る。Worker scriptは両条件でbaselineの`public/ai-release-worker.js`そのものを使う。Worker instanceを残す場合のlong-session memoryと、現在のterminateによる取消しも調べる。

本契約はcandidate比較・棋力比較・公開AI変更を認めるものではない。探索結果は各requestでfreshに計算する。同じWorker上の次requestへ探索内置換表、評価cache、PV、候補手、前回評価などを渡さない。requestごとの探索器が新規作成されることをsource auditで検証し、branch内にstate carryの変更がないことをhash gateで確認する。

## 2. 固定baseline source

- `main`: `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`
- `public/main.js`: blob `141909c6530f6598679c66a0b969b1b42d6472c5`
- `public/ai-release-worker.js`: blob `6a65aa14e5e322e49dd5f5791bedd47fc2ad5273`
- `public/ai-release.js`: blob `724bb412528f6b0b635e81c2992f1834063dffc6`
- `public/ai-config.js`: blob `dc56e1a9c4af8999045cbf91c530a39ed1d4b8a2`

測定用HTML/Node harnessは`tools/`に追加し、同一originで`public/`を配信する。AI script/Worker自体は変更しない。Git diffで`public/**`がbaselineと完全一致することを必須とする。ChromiumのCDP browser sessionでWorker targetへ接続し、`Runtime.getHeapUsage`から当該Worker isolateのheapを記録する。

## 3. 64 seedの再現方法と標本

各shardは固定連番blockの8 seedを担当する。seedから32-bit xorshift generatorを作り、`BaoEngine.initialState()`から開始して`legalMoves(state)`の配列をrandom indexで選び、`BaoEngine.applyMove(state, move).state`を繰り返して同一の合法random gameを生成する。選択順はseedとplyだけで決まり、AI出力・壁時計・Worker modeに依存しない。

各seedでply 0、8、16、32の開始stateを保存する。到達不能のplyは欠測として記録し、後から別plyで置換しない。処理対象は同じ4状態のcold/warm paired requestで、難易度は`hard`、`expert`。各難易度につき最大256 paired position、最低192 paired position、最低48 distinct seedを要求する。未達ならsupportはPASSしない。

検索optionsはrelease APIのstandard tierを固定して`BaoReleaseConfig.searchOptions(level, { hardwareConcurrency: 4, deviceMemory: 4 }, state)`から作る。現行UI同様のPBAI-C015 logic-gate flagを含める。各条件は同じstate clone、same request id、同じoptionsを使い、実測時計はpage側の`performance.now()`でWorker生成直前から正規応答受信までとする。timer計装をWorker内部へ追加しない。

## 4. 条件とpaired順序

- **cold/current lifecycle**: sampleごとに新Workerを生成し、requestを送り、正規のresultを受信後に直ちにterminateする。timerはconstructor直前からresponse受信まで。
- **warm/persistent lifecycle**: seed・難易度ごとにWorkerを1回作り、同じWorkerへ4状態のrequestを逐次送る。最初の応答は`firstRequest`として分け、再利用benefit推定には2〜4番目の後続requestのみを使う。sampleごとの時間はpostMessage直前からresponse受信まで。
- 条件の実行順はseed parityでcounterbalanceする。condition順を変える以外は同一state sampleを用いる。warm Workerはseed×levelごとに終了後terminateする。
- resultに同一stateKey、合法move、expected result shapeがあることを検査する。error、worker error、timeoutはtechnical failureとしてrowに残し、そのrequestを補充しない。
- memory API・memory attribution・cancel timingはlatency timer外で測る。page / Workerはrequest間に追加workをせず、worker内に計測コードを入れない。

## 5. long-session memoryと取消し

各shardで固定割当した1 seedをlong sessionとして、同じWorkerに最大64個の連続する合法state requestを送る。各checkpointは1・16・32・64完了後。状態がterminalとなった場合はその時点を記録し、同じ状態を繰り返して水増ししない。hardとexpertを別Worker sessionにし、各検索にはstandard tierのrelease optionsを使う。

Node runnerはPlaywrightのChromium browser CDP sessionで`Target.getTargets`から`ai-release-worker.js` worker targetを特定し、`Target.attachToTarget`（flatten false）と`Target.sendMessageToTarget`を使って`Runtime.getHeapUsage`を呼び出す。Worker sourceやsearch codeへ計測処理は注入しない。要求処理中ではなく、1/16/32/64 request checkpointで同一Worker isolateの`usedSize`と`totalSize`をそれぞれ3回採取し中央値を保存する。可能なら`HeapProfiler.collectGarbage`後の値も記録し、gateはGC後の`usedSize`を使う。CDP targetのURL、session attach、heap responseを保存し、worker targetが捕捉できなければsupportはHOLD。memory値は固定Playwright/Chromium version内だけで比較する。

取消し確認ではexpert requestを送ってから固定20msでWorkerをterminateし、500ms以内にresultが届かないこと、次に作るfresh Workerが同じsourceで応答することを検査する。これはUI全体のcancel latencyを測るものではなく、Worker terminate経路のsupport checkである。

長時間増加gate: 各long sessionで、3回採取したGC後heap `usedSize`中央値について、16 request後から64 request後への増分が`max(8 MiB, 16-request値の10%)`以下であること。8 shard中すべての有効sessionで成立しなければP15 supportはPASSしない。この値はscreening thresholdであり、candidate adoptionのmemory上限ではない。

## 6. prospective support gates

次の全条件が必要。

1. 8/8 shard、64/64 unique seed、required source hashes、valid checkpoint/artifact、0 duplicate seed。
2. 各難易度で192以上のpaired positions・48以上のdistinct seed、合法move/stateKey/result verification 100%、timeout/error 0。
3. cold/warm saving = `100 × (cold_ms - warm_ms) / cold_ms`。per-seed paired mediansをunitとした10,000 resample percentile bootstrapの95% CIを計算する。hardまたはexpertの少なくとも一方でmedian saving >=5.0%かつ95%区間下限 >0。
4. 各shardでWorker CDP targetをattachでき、8/8 shardでheap checkpointが1/16/32/64件後に採れ、Dedicated Worker isolateを指すtarget URLと`Runtime.getHeapUsage` responseがある。全16 long-sessionでlong-session increase gateを満たす。
5. cancel testでstale response 0件、fresh post-cancel worker success 100%。
6. public source diff 0、seed/order/option contract drift 0。

どれか1つでも未達の場合、候補を実装せずP15を`HOLD / KEEP-AI-GEN4`とする。threshold、seed、phase、difficulty、repeat/order、memory criterionを結果確認後に変更して再試験しない。機材やbrowser versionを変えた確認を行う必要がある場合は、新しいProgram/contractとして扱う。

## 7. Actions中断・artifact契約

8 matrix shard、`fail-fast: false`、各job 30-minute timeout。各seedのcold/warm rowとlong-session checkpointを一時ファイルに追記し、temp fileからatomic renameして確定する。workflowはjob成功/失敗を問わずshard directoryをartifact uploadする。各artifactにmain commit, source hashes, seed list, completed seeds, completed samples, browser/version, status, memory checkpoints, row hashを含める。

aggregate jobは8 artifactがdownloadできてhashを検証し、seed listが連続blockと完全一致する場合だけcanonical JSONを作る。途中failureは結果rowを保持するが、aggregate gateはFAILであり、欠けたshard/seedを同じblockで再実行しない。新しい試行が必要な場合は新しいProgram/seed blockを固定する。

## 8. 既知の解釈境界

Chromium/Ubuntu Actionsで得る値はこの固定runner上のbrowser evidenceである。Android端末・Safari・Firefoxの待ち時間やmemoryに一般化せず、実機採用を意味しない。CDP値はChromium isolateのJavaScript heapであり、native/external memoryや端末全体のRSSを含まない。強制GC値は保持されたheapのscreeningに使う。起動時間screening PASS後も、candidateは別fresh validation、取消・長期対局memory gate、端末確認を通過するまで公開defaultへ昇格しない。
