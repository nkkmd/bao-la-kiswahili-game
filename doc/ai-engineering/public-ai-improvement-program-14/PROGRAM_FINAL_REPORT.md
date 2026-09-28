# `PBAI-P14` — 最終報告

正式作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**  
期間: 2026-09-28  
正式状態: **`COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4`**  
比較元: `AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
candidate: `PBAI-C017-v1`（development-only）

## 1. 問い

Namua captureの`nyumba stop/use`候補を列挙するときに作った遷移結果を、同じ探索node内の順位付けでも使えば、探索の意味を保ったまま実費用を減らせるかを調べた。

このProgramはResearch Generation 4やPBAI-P1〜P12とは別の工学作業として実施した。Jev比較、閉じたRG4 study、PBAI-P12/C016の未使用データは再開・救済・流用していない。

## 2. 工程と結果

| 工程 | 結果 | 主な根拠 |
| --- | --- | --- |
| baseline support | PASS | Actions run `36408095064`。64 seedから111局面を取得、全局面depth4、timeoutなし、診断計装前後のmove・root score・安定statsが一致。capture variant inputは103,788件。 |
| C017開発gate | PASS | Actions run `36409930392`。別64 seedをすべて処理し、104 paired局面（Namua 62、Mtaji 42）。全局面でdepth4の出力がbaselineと一致。 |
| 機械的費用 | 開発仮説を支持 | 318,039 baseline `applyMove`呼出しに対してcandidateは299,353回。18,686件を再利用し、同数の再適用を削減。観測sample上では呼出し数が5.88%減った。 |
| uninstrumented wall-clock | 事前gate未達 | Actions run `36411624798`。別64 seedを処理し、うち61 seedから106局面、7 paired repeats。推定時間削減2.9795%、seed-cluster bootstrap 95%区間1.7091%〜4.1921%。事前閾値の点推定3.0%を0.0205 percentage point下回った。 |

PERFORMANCE-002の61 seed clusterから点推定と区間を計算した。局面のなかった3 seedと、canonical JSONの`distinctSampleSeeds`という項目名の扱いは[結果記録](../../../artifacts/pbai-p14/C017_PERFORMANCE_002_RESULT.md)に明記した。

最初のperformance study `PBAI-C017-PERFORMANCE-001`はrunnerの変数名誤りで技術的不成立となった。seed/sample timerは完成rowへ保存できなかったため、このblock全体を消費済み扱いにして再利用せず、[技術的不成立記録](../../../artifacts/pbai-p14/C017_PERFORMANCE_001_TECHNICAL_FAILURE.md)に残した。修正後のPERFORMANCE-002ではpreflightでrunnerとatomic checkpointを確認してから、新しいseed blockを実行した。

## 3. 正式判断

正式判断は`NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4`である。全ての技術・seed coverage・出力同値性条件を満たしたが、固定depthの時間短縮点推定が事前固定した3.0% gateを満たさなかった。95%区間の下限が0を上回ることだけで、独立したpoint-estimate条件を免除しない。

この判断は、効果が厳密に0だという意味ではない。今回のcandidateと固定試験条件では、意味のある実時間改善として採用する事前基準を通過しなかったことを意味する。条件を見た後に閾値やseedを変更した再試験、強度対局、release holdoutへ進まない。

候補実装の詳細は[開発結果](../../../artifacts/pbai-p14/C017_DEVELOPMENT_RESULT.md)、実時間検証の結果は[performance結果](../../../artifacts/pbai-p14/C017_PERFORMANCE_002_RESULT.md)、完全なcanonical JSONは[`c017-performance-002.json`](../../../artifacts/pbai-p14/c017-performance-002.json)と[`c017-development.json`](../../../artifacts/pbai-p14/c017-development.json)にある。

## 4. 公開AIへの影響

`public/ai-candidate.js`にdefault-offの開発candidateを作った。固定depthでは候補出力がbaselineと一致したが、公開既定へ有効化する根拠は得ていない。候補は隔離branchに保持し、`main`へ統合しない。公開default、lineage、release、manifestは変更されず、現在の公開AIは`AI-GEN4 / AI-GEN4-RELEASE-001`、評価器は`PBAI-C015-v1`のままである。

## 5. 長時間試験の運用

support、development、performanceはGitHub Actionsのshardで実施した。各shardのartifactを個別保存し、canonical aggregateは必要なshardがそろった後だけ作った。PERFORMANCE-001の技術的不成立後はseedを流用せず、PERFORMANCE-002でsample/repeatごとのatomic checkpointを追加した。性能試験が不完了でも、途中状態をartifactで監査できる構成になった。今回の実測ではActions上限やrunner制約は観察されず、ローカル実行へ切り替える必要はなかった。

## 6. 終了状態

```text
PBAI-P14 = COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4
PBAI-C017-v1 = DEVELOPMENT-PASS / PERFORMANCE-GATE-FAIL
strength comparison = NOT-AUTHORIZED-NOT-EXECUTED
release holdout = NOT-AUTHORIZED-NOT-EXECUTED
main integration = NONE
public release change = NONE
public lineage = AI-GEN4
public release = AI-GEN4-RELEASE-001
```

このProgramを閉じても、次の改善案は別のID・baseline・fresh evidenceで評価する。A1 candidate、seed、閾値を新しいProgramの結果へ持ち込まない。
