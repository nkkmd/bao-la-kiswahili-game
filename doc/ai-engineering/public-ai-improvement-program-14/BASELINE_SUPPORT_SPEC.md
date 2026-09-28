# `PBAI-P14-B` — baseline support計測契約

状態: **FROZEN BEFORE MEASUREMENT**
固定日: 2026-09-28
分類: **DEVELOPMENT-ONLY / SUPPORT PROBE**
baseline: `AI-GEN4-BASELINE-2026-09-28-v1`
source: `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`

## 1. 問い

現行AI-GEN4 release経路のfixed-depth探索で、Namua捕獲手のnyumba `stop/use` を比較する候補手生成がどれだけ発生するかを測る。現在の `moveVariants` は両variantのafter-stateを比較し、探索の `enhancedOrdered` は返された各候補を順位付けするために再度遷移を計算する。計測対象が十分に出現し、診断計装が判断を変えない場合のみ、候補設計へ進む。

この測定は、時間短縮量・棋力・誤手・正しい着手を判定しない。

## 2. 固定実装経路と検索条件

各sampleは `BaoReleaseAI.analyzeMove` を使い、`BaoReleaseConfig.searchOptions("expert", {hardwareConcurrency: 4, deviceMemory: 4}, state)` の現行release設定を基礎にする。固定条件:

- level: `expert`
- maxDepth: 4
- timeLimitMs: Infinity（探索終了条件は固定深度）
- aspirationWindow: 0
- stableBestDepths: 0
- evaluation profile / release adapter / PBAI-C015-v1: 現行本番既定
- random source: 下記seedとplyから決定的に生成
- 公開Worker、`public/`の既定値、ルール、評価器は変更しない

Baselineとinstrumented sourceは同一main commitから読む。instrumentationは`engine.js`の実遷移ロジックを変えず、呼出し数・Namua capture variant分岐数だけを外部counterに加算する。検索結果の move と elapsed time以外のstatsを比較する。各局面で計装有無の move、rootScore、completedDepth、安定statsが完全一致しない場合はtechnical failureでありsupport PASSではない。

## 3. Sample生成とseed block

- seed block: **`2026092801..2026092864`**（64 seeds、support専用）
- 各seedにつきdeterministic self-play prefixを最大128 ply生成する。
- 最初に得られたply 12以後の非終局Namua局面を1件保存する。
- 最初に得られた非終局Mtaji局面（候補variant数2以上）を1件保存する。
- そのseedから両phaseが得られたらprefix生成を止める。terminal/end capでphaseが得られない場合は欠測として報告する。
- 同一seed由来の2局面は独立標本と数えず、raw recordにsource seedを残す。

Seed reuse rules:

- このrangeは今回のsupport probeだけに使用し、後続development、independent validation、release holdoutへ流用しない。
- 追加seedや欠測補填は行わない。標本gate未達なら `SUPPORT-INSUFFICIENT / KEEP-AI-GEN4`。
- 既存mainで `2026092801`, `2026092864`, `2026092901`, `2026092964`, `2026100101`, `2026100201` を検索し、重複記録は見つからなかった。全64個を含む固定rangeを本Programに予約する。

## 4. 固定support gate

次のすべてを満たした場合のみ `BASELINE-SUPPORT-PASS`:

1. 8 shardすべてが完了し、seed範囲の漏れ・重複がない。
2. 対局prefixから得たsampleが合計48局面以上、Namua 16以上、Mtaji 16以上。各phaseが16以上の異なるseedに由来する。
3. 全保存局面でbaselineとdiagnostic実行のmove、rootScore、completedDepth、elapsedMsを除くstatsが完全一致。
4. 全局面でdepth 4が完了し、timeoutは0件。
5. Namua capture `stop/use` variant expansionが探索中に32件以上観測される。入力数・same-after-stateでのcollapse数・別状態へのsplit数・遷移適用回数を別々に記録する。

いずれか未達なら、A1 candidate実装へ進まず `NO-SUPPORT / KEEP-AI-GEN4` または技術状態を記録して停止する。gate、seed、深さ、sample selectionを結果後に変更しない。観測された頻度は支持母集団の一般頻度ではない。

## 5. Actions分割と成果物

GitHub Actionsの8 matrix shardを使い、各shardは連続8 seedを一回だけ処理する。各shard JSONは独立artifactとして常にuploadを試みる。すべてのshardが成功したときだけaggregate jobがcanonical resultとgateを作成する。Actions権限はcontents read限定で、計測結果を自動commitしない。

Job timeout、取消し、worker failure、artifact不足はtechnical/incomplete statusとする。未完了shardを再実行するときは元runの失敗原因を確認し、seed既使用状態を保つ。再実行が再現不能または結果に影響するなら新しいstudy identityを要する。
