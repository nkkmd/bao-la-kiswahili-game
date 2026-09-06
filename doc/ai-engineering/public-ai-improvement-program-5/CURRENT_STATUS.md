# PBAI-P5 — 現在状態と再開位置

状態: `PREPARATION-COMPLETE / NOT-STARTED`。進行中測定なし、新規科学seedの消費0。前回のPBAI-P4はCOMPLETE/HOLDのままである。

| Stage | 内容 | 状態 |
| --- | --- | --- |
| PBAI-P5-A | 認可・現状・候補同一性・既知データ監査 | COMPLETE |
| PBAI-P5-B | 条件固定・監視器・技術的開始前点検 | PREPARED |
| PBAI-P5-C | 新規正確性と境界互換性 | NOT-EXECUTED |
| PBAI-P5-D | developmentと独立検算 | NOT-EXECUTED |
| PBAI-P5-E | validationと独立検算 | NOT-EXECUTED |
| PBAI-P5-F | 最終holdoutと独立判断 | NOT-EXECUTED |
| PBAI-P5-G | 最終報告・レビュー | NOT-EXECUTED |

## 保存先とHEAD

ブランチはengineering/pbai-p5-reverification-preparation。元のP4ブランチを上書きしない。準備元commitは2d77792220af80ca2700bd0b3c0ab8e45197c24e、baseline mainは548ccead3965fa98602d99c8b3e2a49fbeeed093。準備HEADはこのブランチを取得してgit rev-parse HEADで確認する。正式開始時は監視器が実際のHEAD・全コマンド・開始時刻・絶対期限をRUN_STARTED.jsonへ固定する。

source hashはSOURCE_LOCK.json、計画・監視器・測定器のhashはPREPARATION_LOCK.json、旧データ除外表はKNOWN_DATA_EXCLUSIONS.json。人工監視試験と開始前点検はartifacts/pbai-p5に保存した。

## 次にできること

今回の依頼は準備までであり、--startは実行していない。開始する指示があれば、[再現手順](REPRODUCIBILITY_INDEX.md)の点検を実施し、同じ監視器を1回だけ開始する。通常のstage間確認を待たずに固定gateで進む。

開始後はartifacts/pbai-p5/runを正本とする。RUN_STARTED.json、RUN_FINAL.json、command別log/marker、stage別のseeds.jsonl・source・pair・gate・independent結果を確認する。生きたプロセスを再起動しない。プロセスが消えて開始markerだけならINCOMPLETEで止め、同じseedや未完了ペアを再実行しない。期限超過を敗北・引分に置換しない。

## 未使用データ

正確性825000001..825000064、局面822/823/824 block、対局826/827/828 block、bootstrap829000001はすべて未使用。821の診断予約も未使用。正確な終端・採用数はPROTOCOL.mdを正本とする。P4の旧81x blockを未使用holdoutに戻さない。
