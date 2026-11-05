# 第五世代研究 — 再現性の索引

第五世代研究は**技術準備不足による保留・凍結中**である。追加実装・技術試験・科学登録/実行は停止している。[凍結判断と再開条件](FREEZE_DECISION_20261105.md)を優先する。研究完了・仮説否定ではない。

## 現在の監査と記録の区別

現在checkoutの監査は[現在用手順](../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。PR #238の監査保守後、PR #239の統合main `b3f91875126575b103d2cb3eaead1353a1e25085`でも完全保存監査が合格した。旧verify.py・binding・原ZIPは変更しない。監査合格と科学条件成立を区別する。

契約具体化のPR #236とraw読戻し部品のPR #237は未統合で閉鎖済み。[凍結判断](FREEZE_DECISION_20261105.md#未統合資料の保全)に固定headを示す。以下は保存済み資料の参照・読取検算の案内であり、新規科学実行や技術再実験の指示ではない。

## 終了済み供給研究の保存記録

G5-01〜G5-05の5区画は消費済みである。下記は保存済みbyteの再照合先であり、source生成や同一区画の再実行手順ではない。原契約・manifest・結果のhashを現在の文書へ付け直さない。

| 工程 | 原結果・独立検算 | 再現性と固定入力 |
| --- | --- | --- |
| G5-01 | [原結果](g5-01/development/results/RESULT.json)・[独立検算](g5-01/development/results/VERIFICATION.json) | [固定入力](g5-01/development/SOURCE_MANIFEST.json)・以下のStage 1案内 |
| G5-02 | [原結果](g5-02/results/RESULT.json)・[独立検算](g5-02/results/VERIFICATION.json) | [再現性](g5-02/REPRODUCIBILITY.md)・[固定入力](g5-02/SOURCE_MANIFEST.json) |
| G5-03 | [原結果](g5-03/results/RESULT.json)・[独立検算](g5-03/results/VERIFICATION.json) | [再現性](g5-03/REPRODUCIBILITY.md)・[固定入力](g5-03/SOURCE_MANIFEST.json) |
| G5-04 | [原結果](g5-04/results/RESULT.json)・[独立検算](g5-04/results/VERIFICATION.json) | [再現性](g5-04/REPRODUCIBILITY.md)・[固定入力](g5-04/SOURCE_MANIFEST.json) |
| G5-05 | [原結果](g5-05/results/RESULT.json)・[独立検算](g5-05/results/VERIFICATION.json) | [再現性](g5-05/REPRODUCIBILITY.md)・[固定入力](g5-05/SOURCE_MANIFEST.json) |

第3版の5原ZIP・3,361 fileと二経路検算は[中間保存](checkpoint-20261014/README.md)を参照する。現在checkoutからの保存監査は[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)に記載した新しい入口を使う。旧監査器と旧bindingはPR #205時点の固定記録として保持する。

## G5-01 Stage 0の再現資料

- [技術契約](g5-01/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/STAGE_0_SPEC.json)。
- [実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)・[技術認可](g5-01/STAGE_0_AUTHORIZATION.json)。
- [使用ソースのbyte hash](g5-01/SOURCE_MANIFEST.json)。
- [測定結果](g5-01/results/stage-0/result.json)・[Python検算](g5-01/results/stage-0/verification.json)。
- [Actions来歴](g5-01/results/stage-0/CI_RECEIPT.json)・[技術検証報告](g5-01/STAGE_0_REPORT.md)。
- [実行コマンドとツールの範囲](../../tools/research/g5-01/README.md)。

実行前固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`。以下は過去の技術再現方法への案内であり、凍結中に新しいfixture実験を認可しない。core hashから所要時間・メモリ・環境来歴は分離してある。

保存済み結果の検算は次で実行する。これは新規科学的seedを使用しない。

```bash
python3 tools/research/g5-01/verify.py doc/research-generation-5/g5-01/results/stage-0/result.json
```

Stage 0完了時点では、新規局面、科学的seed、正式標本、正式検定の成果物は存在しなかった。

## 独立遷移の技術検証

実行前固定コミットは `ec2607dfc4a09b62d2aaa56f75740f9f551992e4`。

- [技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/transition/SPEC.json)・[ソース固定](g5-01/transition/SOURCE_MANIFEST.json)・[実行範囲](g5-01/transition/AUTHORIZATION.json)。
- [測定結果](g5-01/transition/results/result.json)・[Actions来歴](g5-01/transition/results/CI_RECEIPT.json)・[検証報告](g5-01/transition/REPORT.md)。
- [ツールと再現コマンド](../../tools/research/g5-01/transition/README.md)。

独立実装は依存モジュールをimportしない。固定fixture上の再測定も技術作業であるため凍結中は実施しない。割当済みの開発区画は使用しない。

## Stage 1開発診断

- [固定契約](g5-01/development/CONTRACT.md)・[機械用契約](g5-01/development/SPEC.json)・[ソース固定](g5-01/development/SOURCE_MANIFEST.json)・[認可](g5-01/development/AUTHORIZATION.json)。
- [run・lease・mirrorの来歴](g5-01/development/results/CI_RECEIPT.json)。
- [実行要約](g5-01/development/results/RESULT.json)・[圧縮生記録](g5-01/development/results/EVIDENCE.json.gz)・[独立検算](g5-01/development/results/VERIFICATION.json)。
- [消費journal](g5-01/development/results/SEED_READS.jsonl)・[候補固定](g5-01/development/results/CANDIDATES_FROZEN.json)。
- [供給診断](g5-01/development/results/SUPPLY_DIAGNOSTIC.json)・[診断報告](g5-01/development/REPORT.md)。

保存済み記録の検算と事後診断は、sourceを生成し直さず次で行う。実行時の32 seed区画は再使用しない。

```bash
node tools/research/g5-01/development/verify.cjs doc/research-generation-5/g5-01/development/results
node tools/research/g5-01/development/diagnose-supply.cjs doc/research-generation-5/g5-01/development/results
```

G5-01 Stage 1終了時点では開発source記録は存在したが、新規閉包・厳密解・正式関係検定の成果物は存在しなかった。その後に保存したG5-03・G5-04の完全閉包と現在状態は、上記の供給研究一覧と[現在状態](CURRENT_STATUS.md)を参照する。


## 方法・運用・契約の参照先

| 対象 | 正本・保存資料 |
| --- | --- |
| 科学用遷移と可逆保存 | [方法再評価](method-review-20261013/README.md) |
| 全閉包BFSと独立検算 | [全閉包統合](bfs-integration-20261013/README.md) |
| BEFCS供給案と資源レビュー | [提案](branch-envelope-20261013/README.md)・[資源レビュー](branch-envelope-20261013/RESOURCE_REVIEW.md) |
| source・保存fixture | [技術preflight](branch-envelope-preflight-20261013/README.md) |
| 一度限り運用と未採用契約 | [運用資料](befcs-operations-20261013/README.md)・[契約案](befcs-operations-20261013/CONTRACT_DRAFT.md) |
| 全workloadの保存済み技術結果 | [統合資料](befcs-workload-20261013/README.md)・[第2版CI](befcs-workload-20261013/CI_CONFIRMATION_V2.md) |
| 第3版の原ZIP・Git/ACK | [中間保存](checkpoint-20261014/README.md)・[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md) |
| 全工程・終了条件の未成立 | [全工程レビュー](lifecycle-review-20261017/README.md)・[完了条件](befcs-capsule-20261016/COMPLETION_GATES.md) |
| runnerとWSLの過去観察 | [runner調査](runner-topology-20261017/README.md)・[観察記録](runner-topology-20261017/host-observed-20261105/README.md) |
| 契約再評価と未採用の工程案 | [再評価](execution-contract-review-20261105/README.md)・[工程案](execution-contract-review-20261105/REVISED_ROADMAP_DRAFT.md) |

測定数値や当時の次工程を記した追補は[研究ログ](RESEARCH_LOG.md#過去案内の追補記録)と整理前の固定版に保持する。
